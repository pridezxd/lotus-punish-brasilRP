export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return res.status(500).json({ error: 'DISCORD_WEBHOOK_URL não configurada na Vercel.' });

  try {
    const { id, dc, punishment, reporter, reason, duration, status, infraction, clipUrl } = req.body || {};
    const fields = [
      { name: 'ID', value: String(id || 'Não informado'), inline: true },
      { name: 'DC', value: String(dc || 'Não informado'), inline: true },
      { name: 'PUNIÇÃO', value: String(punishment || 'Não informado'), inline: false },
      { name: 'ID DO DENUCIANTE', value: String(reporter || 'Não informado'), inline: true },
      { name: 'MOTIVO', value: String(reason || infraction || 'Não informado'), inline: false },
      { name: 'TEMPO', value: String(duration || 'Não informado'), inline: true },
      { name: 'STATUS', value: String(status || 'Aplicado'), inline: true }
    ];
    if (clipUrl) fields.push({ name: 'CLIP', value: String(clipUrl).slice(0, 1024), inline: false });

    const payload = {
      username: 'BrasilRP • Punições',
      embeds: [{
        title: '📋 PUNIÇÃO REGISTRADA',
        description: `**Infração:** ${infraction || 'Não informada'}`,
        fields,
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: 'Discord recusou a mensagem.', details: text.slice(0, 500) });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao enviar para o Discord.', details: error.message });
  }
}
