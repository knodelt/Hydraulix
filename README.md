# Hydraulix

Ein mobiles Comic-Puzzlespiel über die vereinfachte Logik von Hydrauliksystemen. Spielende diagnostizieren defekte Maschinen, tauschen Bauteile, korrigieren den Ölstand und prüfen ihre Reparatur in einem animierten Testlauf.

## Lokaler Start

Die Dateien sind ohne Build-Schritt lauffähig. Für den Cloudflare-Entwicklungsserver:

```bash
npm install
npm run dev
```

## Cloudflare Workers

Das Projekt ist als Static Assets Worker vorbereitet. In Cloudflare muss als Deploy-Befehl nur Folgendes eingetragen werden:

```bash
npx wrangler deploy
```

Ein Build-Befehl oder Ausgabeverzeichnis ist nicht nötig. Die statischen Dateien liegen in `public/`.

## Version

Aktuell: `0.1.0` – fünf spielbare Reparaturaufträge, lokaler Fortschritt, PWA und Offline-Cache.

> Hydraulix ist ein Spiel und keine Anleitung für Arbeiten an echten Hydraulikanlagen.
