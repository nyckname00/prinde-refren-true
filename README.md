# Refren — cum publici site-ul (gratuit, ~2 minute)

Site-ul are două părți:
- `public/index.html` — jocul propriu-zis (ce vede utilizatorul)
- `server.js` — un server mic care aduce piesele de la iTunes pentru joc, evitând blocajele pe care browserul le are când încearcă să ceară asta direct

Cel mai simplu loc gratuit ca să-l pui live, fără linie de comandă:

## Varianta 1 — Glitch (cel mai simplu)

1. Mergi pe https://glitch.com și fă-ți cont (gratuit).
2. Alege „New Project” → „Import from GitHub” dacă ai pus codul pe GitHub, SAU „New Project” → „glitch-hello-node” și apoi înlocuiește fișierele generate cu cele de-aici (`server.js`, `package.json`, folderul `public/`).
3. Glitch instalează singur dependențele și pornește serverul.
4. Primești automat un link de forma `https://numele-tau.glitch.me` — asta e site-ul tău live.

## Varianta 2 — Render.com

1. Pune codul într-un repo pe GitHub.
2. Pe https://render.com → „New Web Service” → conectezi repo-ul.
3. Build command: `npm install`. Start command: `npm start`.
4. Render îți dă un URL public gratuit.

## Rulare locală (ca să testezi înainte de publicare)

Dacă ai Node.js instalat pe calculator:

```
npm install
npm start
```

Apoi deschizi `http://localhost:3000` în browser.

## De ce există serverul

Jocul are nevoie de fragmente audio reale de 30 de secunde pentru fiecare melodie. Sursa cea mai de încredere și complet gratuită (fără cheie API) e catalogul public al Apple/iTunes. Problema e că unele medii (inclusiv preview-ul din chat) blochează cererile făcute direct din browser către alte site-uri. `server.js` rezolvă asta: face el cererea către iTunes, iar jocul din browser vorbește doar cu propriul server.

## Extinderea catalogului de artiști

Lista de artiști e în `public/index.html`, în variabila `ARTISTS` de la începutul tag-ului `<script>`. Poți adăuga sau elimina nume oricând — jocul îi va căuta automat pe iTunes la următoarea încărcare a paginii.
