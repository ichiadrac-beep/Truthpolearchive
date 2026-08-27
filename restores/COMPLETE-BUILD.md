# Complete build

**Label:** `Complete build`  
**Pinned branch:** [`complete-build`](https://github.com/ichiadrac-beep/Truthpolearchive/tree/complete-build)  
**Pinned commit:** `1d2a37efd417b5541317d23e08646fdd2479714f`  
**Date:** 27 August 2026  
**Repo:** [ichiadrac-beep/Truthpolearchive](https://github.com/ichiadrac-beep/Truthpolearchive)

This is the **first full restorable baseline**. Do not overwrite this label.
Later backups must be added as separate files:

| Label | Path |
|-------|------|
| **Complete build** | branch `complete-build` + this file |
| restore file(1) | `restores/restore-file-1.zip` (next backup — new file only) |
| restore file(2) | `restores/restore-file-2.zip` |
| … | never overwrite prior restore zips |

## Full restore zip already in repo

A full project zip (source tree, no `node_modules`) is already stored here:

- [`restores/TRUTHPOLE-restore-20260827-live.zip`](https://github.com/ichiadrac-beep/Truthpolearchive/blob/main/restores/TRUTHPOLE-restore-20260827-live.zip) (~13 MB)

Download:

```text
https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/TRUTHPOLE-restore-20260827-live.zip
```

Or download the whole **Complete build** branch as a zip:

```text
https://github.com/ichiadrac-beep/Truthpolearchive/archive/refs/heads/complete-build.zip
```

## Restore / redeploy in another build chat

```bash
# Option A — branch zip (Complete build)
curl -L -o complete-build.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/archive/refs/heads/complete-build.zip
unzip complete-build.zip
cd Truthpolearchive-complete-build
rm -rf node_modules
npm install
npm run build
sh startup.sh

# Option B — stored restore zip
curl -L -o truthpole-restore.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/TRUTHPOLE-restore-20260827-live.zip
unzip truthpole-restore.zip -d truthpole
cd truthpole
rm -rf node_modules
npm install
npm run build
sh startup.sh

# Option C — git clone pinned branch
git clone -b complete-build https://github.com/ichiadrac-beep/Truthpolearchive.git
cd Truthpolearchive
npm install
sh startup.sh
```

## What is included

- Full `src/` app (landing, archive globe, desks, panels, Pole, X-Files, styles)
- `public/` assets (logos, geo, audio, og image)
- `scripts/`, `server/`, `migrations/`
- `package.json` + lockfile, Vite/tsconfig, `startup.sh`, `AGENTS.md`

**Not included in zips:** `node_modules/` (run `npm install` after restore).

## Backup naming rule (from now on)

1. **Complete build** — this baseline (never overwrite).
2. Next full backup → **restore file(1)** → commit as `restores/restore-file-1.zip` (new path only).
3. Next → **restore file(2)** → `restores/restore-file-2.zip`.
4. Always keep older restore zips in the repo; never replace them in place.
