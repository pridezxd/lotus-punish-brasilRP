// Vercel Serverless Function
// Resolves a public Medal clip into its media URL and basic metadata.
export default async function handler(req, res) {
  const id = String(req.query.id || "").trim();
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    return res.status(400).json({ok:false,error:"ID de clipe inválido."});
  }
  try {
    const r = await fetch(`https://medal.tv/api/content/${encodeURIComponent(id)}`, {
      headers: { "Accept":"application/json", "User-Agent":"Lotus-Punish-Medal-Downloader/1.0" }
    });
    if (!r.ok) return res.status(r.status).json({ok:false,error:`Medal retornou HTTP ${r.status}.`});
    const d = await r.json();
    const contentUrl = d.contentUrl || null;
    let socialVideoUrl = null;
    if (!contentUrl) {
      try {
        const s = await fetch(`https://medal.tv/api/content/${encodeURIComponent(id)}/socialVideoUrl`, {
          redirect:"follow",
          headers: {"User-Agent":"Lotus-Punish-Medal-Downloader/1.0"}
        });
        if (s.ok) socialVideoUrl = s.url;
      } catch {}
    }
    if (!contentUrl && !socialVideoUrl) {
      return res.status(404).json({ok:false,error:"Este clipe não disponibilizou um arquivo público para download."});
    }
    res.setHeader("Cache-Control","public, s-maxage=30, stale-while-revalidate=120");
    return res.status(200).json({
      ok:true, id,
      title:d.contentTitle || "Clipe do Medal",
      uploader:d.poster?.displayName || "",
      duration:d.videoLengthSeconds || null,
      thumbnail:d.thumbnailUrl || null,
      contentUrl,
      socialVideoUrl
    });
  } catch (e) {
    return res.status(502).json({ok:false,error:"Falha ao consultar o Medal."});
  }
}
