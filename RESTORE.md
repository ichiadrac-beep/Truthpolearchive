# TRUTHPOLE — Restore guide

## Complete build (baseline — do not overwrite)

**Label:** `Complete build`  
**Branch:** [`complete-build`](https://github.com/ichiadrac-beep/Truthpolearchive/tree/complete-build)  
**Commit:** `1d2a37efd417b5541317d23e08646fdd2479714f`  
**Index:** [restores/INDEX.md](restores/INDEX.md) · [restores/COMPLETE-BUILD.md](restores/COMPLETE-BUILD.md)

### Quick restore

```bash
curl -L -o complete-build.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/archive/refs/heads/complete-build.zip
unzip complete-build.zip
cd Truthpolearchive-complete-build
npm install
npm run build
sh startup.sh
```

Or use the stored full zip (already in the repo):

```bash
curl -L -o truthpole.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/TRUTHPOLE-restore-20260827-live.zip
unzip truthpole.zip -d truthpole && cd truthpole
npm install && npm run build && sh startup.sh
```

## Naming rule for future backups

| Label | File |
|-------|------|
| Complete build | pinned branch + docs (this baseline) |
| restore file(1) | `restores/restore-file-1.zip` (next backup only) |
| restore file(2) | `restores/restore-file-2.zip` |

Push each new zip as a **new path**. Never replace older restore zips.

## What a full restore includes

| Path | Contents |
|------|----------|
| `src/` | Landing, archive map, desks, panels, Pole, X-Files, styles |
| `public/` | Logos, geo, audio, OG image |
| `scripts/` | Dev / preview / migrate helpers |
| `server/` | Server routes |
| `migrations/` | DB migrations |
| `package.json` + lock | Dependencies |
| Vite / tsconfig / `startup.sh` | Build & revive |

**Not in zips:** `node_modules/` — always run `npm install` after extract.
