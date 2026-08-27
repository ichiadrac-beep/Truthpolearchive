# TRUTHPOLE — Restore guide

## Complete build (baseline — do not overwrite)

**Branch:** [`complete-build`](https://github.com/ichiadrac-beep/Truthpolearchive/tree/complete-build)  
**Zip:** [`restores/TRUTHPOLE-restore-20260827-live.zip`](restores/TRUTHPOLE-restore-20260827-live.zip)  
**Docs:** [restores/COMPLETE-BUILD.md](restores/COMPLETE-BUILD.md)

## restore file(1) (current — 27 Aug 2026)

Adds Archive ↔ Conspiracy ↔ Ancient **Related** cross-links (Roswell ↔ Majestic 12, etc.).  
Does **not** replace Complete build.

**Zip:** [`restores/restore-file-1.zip`](restores/restore-file-1.zip)  
**Docs:** [restores/RESTORE-FILE-1.md](restores/RESTORE-FILE-1.md) · [restores/INDEX.md](restores/INDEX.md)

```bash
curl -L -o restore-file-1.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/restore-file-1.zip
unzip restore-file-1.zip -d truthpole
cd truthpole
npm install
npm run build
sh startup.sh
```

## Naming rule

| Label | File |
|-------|------|
| Complete build | pinned branch + `TRUTHPOLE-restore-20260827-live.zip` |
| restore file(1) | `restores/restore-file-1.zip` |
| restore file(2) | `restores/restore-file-2.zip` (next backup only) |

Never replace older restore zips.
