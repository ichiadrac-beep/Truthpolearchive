# TRUTHPOLE — Restore guide

## Live restore snapshot (overwrite target)

**File:** `restores/TRUTHPOLE-restore-20260827-live.zip`  
**Updated:** 2026-08-27 08:32 BST  
**Snapshotted commit:** `dcf00796fb4a304c26de3901ea7a19da4aeb7312`  
**Repo:** [ichiadrac-beep/Truthpolearchive](https://github.com/ichiadrac-beep/Truthpolearchive)

### Restore steps

```bash
curl -L -o truthpole.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/TRUTHPOLE-restore-20260827-live.zip
unzip truthpole.zip -d truthpole && cd truthpole
npm install
npm run build
sh startup.sh
```

## Complete build (baseline — do not overwrite)

**Label:** `Complete build`  
**Branch:** [`complete-build`](https://github.com/ichiadrac-beep/Truthpolearchive/tree/complete-build)  
**Commit:** `1d2a37efd417b5541317d23e08646fdd2479714f`  
**Index:** [restores/INDEX.md](restores/INDEX.md) · [restores/COMPLETE-BUILD.md](restores/COMPLETE-BUILD.md)

### Quick restore from Complete build branch

```bash
curl -L -o complete-build.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/archive/refs/heads/complete-build.zip
unzip complete-build.zip
cd Truthpolearchive-complete-build
npm install
npm run build
sh startup.sh
```

## Naming rule for future backups

| Label | File |
|-------|------|
| Complete build | pinned branch + docs (this baseline) |
| Live restore | `restores/TRUTHPOLE-restore-20260827-live.zip` (canonical overwrite path) |
| restore file(1) | `restores/restore-file-1.zip` (next numbered backup only) |
| restore file(2) | `restores/restore-file-2.zip` |

Push numbered restore zips as **new paths**. The live path above is the single overwrite target for automated backups.

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
