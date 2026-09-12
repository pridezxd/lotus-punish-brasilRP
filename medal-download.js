// Vercel Serverless Function
// Streams a public Medal MP4 through this site's origin so the browser can save it.
export const config = { maxDuration: 60 };
export default async function handler(req, res) {
  const id = String(req.query.id || "").trim();
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return res.status(400).send("ID inválido.");
  try {
    const api = await fetch(`https://medal.tv/api/content/${encodeURIComponent(id)}`, {
      headers: {"Accept":"application/json","User-Agent":"Lotus-Punish-Medal-Downloader/1.0"}
    });
    if (!api.ok) return res.status(api.status).send("Clipe não encontrado.");
    const d = await api.json();
    let media = d.contentUrl;
    if (!media) {
      const s = await fetch(`https://medal.tv/api/content/${encodeURIComponent(id)}/socialVideoUrl`, {
        redirect:"follow", headers: {"User-Agent":"Lotus-Punish-Medal-Downloader/1.0"}
      });
      if (s.ok) media = s.url;
    }
    if (!media || !/^https:\/\/(?:cdn|storage)\.medal\.tv\//i.test(media)) {
      return res.status(404).send("Arquivo público indisponível.");
    }
    const upstream = await fetch(media, {headers: {"User-Agent":"Lotus-Punish-Medal-Downloader/1.0"}});
    if (!upstream.ok || !upstream.body) return res.status(upstream.status||502).send("Falha ao obter o vídeo.");
    res.statusCode = 200;
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
    const len = upstream.headers.get("content-length");
    if (len) res.setHeader("Content-Length", len);
    res.setHeader("Content-Disposition", `attachment; filename="medal-${id}.mp4"`);
    res.setHeader("Cache-Control","no-store");
    // Node/Vercel supports Web Streams in current runtimes.
    const reader = upstream.body.getReader();
    try {
      while (true) {
        const {done,value}=await reader.read();
        if(done) break;
        if (!res.write(Buffer.from(value))) await new Promise(resolve=>res.once("drain",resolve));
      }
    } finally { reader.releaseLock(); }
    res.end();
  } catch (e) {
    if (!res.headersSent) res.status(502).send("Falha no download.");
    else res.end();
  }
}
