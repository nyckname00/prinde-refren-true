// Refren — server mic care serveste site-ul si face rost de piese de la iTunes.
// De ce exista serverul asta: cererile facute direct din browser catre
// itunes.apple.com sunt adesea blocate sau nesigure (CORS / sandbox-uri).
// Un server face cererea in locul browserului, fara acele restrictii.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// pastram rezultatele cateva ore ca sa nu batem inutil API-ul iTunes
const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 ore

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
  const artist = (req.query.artist || '').trim();
  if (!artist) {
    return res.status(400).json({ error: 'Lipseste parametrul "artist".' });
  }

  const cacheKey = artist.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  const url = 'https://itunes.apple.com/search?media=music&entity=song&country=RO&limit=10&term=' +
    encodeURIComponent(artist);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: 'iTunes a raspuns cu eroare.' });
    }
    const data = await response.json();

    const tracks = (data.results || [])
      .filter(t => t.previewUrl && t.trackName && t.artistName)
      .map(t => ({
        id: t.trackId,
        title: t.trackName,
        artist: t.artistName,
        artwork: (t.artworkUrl100 || '').replace('100x100', '160x160'),
        preview: t.previewUrl
      }));

    cache.set(cacheKey, { data: tracks, time: Date.now() });
    res.json(tracks);
  } catch (err) {
    console.error('Eroare la interogarea iTunes pentru', artist, err.message);
    res.status(502).json({ error: 'Nu am putut contacta iTunes chiar acum.' });
  }
});

app.listen(PORT, () => {
  console.log(`Refren ruleaza pe portul ${PORT}`);
});
