# BrasilRP Punições + Discord

Versão simples do sistema de punições.

## Envio automático para Discord

Ao clicar em **Registrar punição**, o site salva o registro e envia uma mensagem para um canal do Discord por meio de um Webhook.

Na Vercel, crie a variável de ambiente:

`DISCORD_WEBHOOK_URL`

com a URL do Webhook do canal desejado. O webhook fica apenas no servidor (`/api/discord.js`), não no HTML.

A mensagem enviada contém:
- ID
- DC
- PUNIÇÃO
- ID DO DENUCIANTE
- MOTIVO
- TEMPO
- STATUS
- CLIP, quando informado

## Regras já configuradas
- RDM: 2.000 + Camisa de Força
- RDM Ilha: Banimento + Wipe na conta — 7 dias
- Hacker: Banimento — Permanente
