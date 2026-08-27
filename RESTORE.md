# TRUTHPOLE — Full restore snapshot

**Tag / label:** `restore-20260827-live`
**Date:** 27 August 2026 (06:00 BST) — overwritten live snapshot
**Commit:** `af4dac3d0b24ed095794475cae904c447d0b8a2e`
**What this is:** Complete restorable snapshot of the live TRUTHPOLE desk.

Repo: [ichiadrac-beep/Truthpolearchive](https://github.com/ichiadrac-beep/Truthpolearchive)
Zip: `restores/TRUTHPOLE-restore-20260827-live.zip`

## Included in this package

| Path | Contents |
|------|----------|
| `src/` | Full app (landing, archive map, star-field, desks, panels, X-Files, Pole, styles) |
| `public/` | Static assets (logos, geo, audio, `og.jpg` 1200×630) |
| `scripts/` | Dev / preview / migrate helpers |
| `server/` | Server routes |
| `migrations/` | DB migrations |
| `package.json` + lock | Dependencies |
| `vite.config.ts`, `tsconfig.json`, `startup.sh` | Build & revive |

**Not included:** `node_modules/` (run `npm install` after restore).

## Key features in this snapshot

1. Landing sky — rare craft, landing-only duels, Zeta Reticuli + Cygnus charts; star-field restored.
2. Tonight’s File — anniversary windows; tap opens that archive file.
3. File panels — CLASSIFIED stamp, desk summary, full record, real sources/related, share.
4. Archive — extra non-US pins; opaque peek card; year slider still filters.
5. X-Files — 48h newest-first, correct @handles, credibility breakdown (heuristic label).
6. Guest filing form — readable labels/placeholders on a solid dark sheet.
7. The Pole — message board stays visible while the keyboard is open.
8. More sheet — opaque glass.
9. Share card — custom `public/og.jpg` 1200×630.
10. Offline mark kept in the title (not over logo or buttons).
11. Witness files — server store with SQL and memory fallback; panel, likes, comments, media publish on submit.
12. CRT scanlines overlay on the desk (non-blocking).
13. Terminal fonts and CRT stylesheet loaded.
14. Landing: Craig Reynolds UFO steering — wander / evade / investigate.

## Restore steps

```bash
unzip TRUTHPOLE-restore-20260827-live.zip -d truthpole
cd truthpole
rm -rf node_modules
npm install
npm run build
sh startup.sh
```

Or clone the repo:

```bash
git clone https://github.com/ichiadrac-beep/Truthpolearchive.git
cd Truthpolearchive
npm install
sh startup.sh
```
