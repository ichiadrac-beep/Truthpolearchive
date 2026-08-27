# TRUTHPOLE — Restore guide

## Complete build (baseline — do not overwrite)

**Branch:** [`complete-build`](https://github.com/ichiadrac-beep/Truthpolearchive/tree/complete-build)  
**Zip:** [`restores/TRUTHPOLE-restore-20260827-live.zip`](restores/TRUTHPOLE-restore-20260827-live.zip)  
**Docs:** [restores/COMPLETE-BUILD.md](restores/COMPLETE-BUILD.md)

## restore file(1)

Archive ↔ Conspiracy ↔ Ancient Related cross-links.  
**Zip:** [`restores/restore-file-1.zip`](restores/restore-file-1.zip)

## restore file(2)

Linked counts, case status tags, ticking archive count, desk-only decrypt.  
**Zip:** [`restores/restore-file-2.zip`](restores/restore-file-2.zip)

## restore file(3) (current — 27 Aug 2026)

X-Files signal bar, map zoom bounce, sky hum, scratch-to-declassify.  
Does **not** replace Complete build or earlier restore files.

**Zip:** [`restores/restore-file-3.zip`](restores/restore-file-3.zip)  
**Docs:** [restores/RESTORE-FILE-3.md](restores/RESTORE-FILE-3.md) · [restores/INDEX.md](restores/INDEX.md)

```bash
curl -L -o restore-file-3.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/restore-file-3.zip
unzip restore-file-3.zip -d truthpole
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
| restore file(2) | `restores/restore-file-2.zip` |
| restore file(3) | `restores/restore-file-3.zip` |
| restore file(4) | `restores/restore-file-4.zip` (next backup only) |

Never replace older restore zips.
