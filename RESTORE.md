# TRUTHPOLE — Full restore snapshot

**Tag / label:** `restore-20260827-live`
**Date:** 27 August 2026 (00:30 BST)
**What this is:** Complete restorable snapshot of the live TRUTHPOLE desk.

Repo: [ichiadrac-beep/Truthpolearchive](https://github.com/ichiadrac-beep/Truthpolearchive)

## Included in this package

| Path | Contents |
|------|----------|
| `src/` | Full app (landing, archive map, star-field, desks, panels, X-Files, Pole, styles) |
| `public/` | Static assets (logos, geo, audio, `og.jpg` 1200×630) |
| `scripts/` | Dev / preview / migrate helpers |
| `server/` | Server routes |
| `migrations/` | DB migrations |
| `.grok/app-env.json` | App Builder env |
| `package.json` + lock | Dependencies |
| `vite.config.ts`, `tsconfig.json`, `startup.sh` | Build & revive |

**Not included:** `node_modules/` (run `npm install` after restore).

## Key features in this snapshot

1. Landing sky — rare craft, landing-only duels, Zeta Reticuli + Cygnus charts.
2. Tonight’s File — anniversary windows; tap opens that archive file.
3. File panels — CLASSIFIED stamp, desk summary, full record, real sources/related, share.
4. Archive — extra non-US pins; opaque peek card; year slider still filters.
5. X-Files — 48h newest-first, correct @handles, credibility breakdown (heuristic label).
6. Guest filing form — readable labels/placeholders on a solid dark sheet.
7. The Pole — message board stays visible while the keyboard is open.
8. More sheet — opaque glass.
9. Share card — custom `public/og.jpg` 1200×630.

## Restore steps

```bash
unzip TRUTHPOLE-restore-20260827-live.zip -d truthpole
cd truthpole
rm -rf node_modules
npm install
npm run build
sh startup.sh    # 0.0.0.0:8080
```

Or clone the repo:

```bash
git clone https://github.com/ichiadrac-beep/Truthpolearchive.git
cd Truthpolearchive
npm install
sh startup.sh
```
