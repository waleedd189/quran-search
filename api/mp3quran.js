// Fallback proxy for mp3quran.net ayah timings, used only if the browser is not allowed to call their API directly (CORS).
module.exports = async (req, res) => {
  const path = String(req.query.path || '');
  if (!/^ayat_timing(\/reads|\?surah=\d{1,3}&read=\d{1,4})$/.test(path)) return res.status(400).json({ error: 'bad path' });
  try {
    const r = await fetch('https://www.mp3quran.net/api/v3/' + path);
    if (!r.ok) return res.status(502).json({ error: 'upstream ' + r.status });
    const data = await r.json();
    res.setHeader('Cache-Control', 'public, s-maxage=604800, max-age=86400');
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: 'upstream unreachable' });
  }
};
