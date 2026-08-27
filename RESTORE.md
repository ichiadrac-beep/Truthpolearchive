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

## restore file(3)

X-Files signal bar, map zoom bounce, sky hum, scratch-to-declassify.  
**Zip:** [`restores/restore-file-3.zip`](restores/restore-file-3.zip)

## restore file(4)

Landing alien chromatic-aberration glitch on tap.  
**Zip:** [`restores/restore-file-4.zip`](restores/restore-file-4.zip)

## Truthpole-Complete 2 (current complete snapshot — 27 Aug 2026)

Full restorable copy of the live desk: restore file(2) + Tonight’s file first-paint (Cussac).  
Does **not** replace Complete build or restore files 1–4.

**Zip:** [`restores/Truthpole-Complete-2.zip`](restores/Truthpole-Complete-2.zip)  
**Docs:** [restores/TRUTHPOLE-COMPLETE-2.md](restores/TRUTHPOLE-COMPLETE-2.md) · [restores/INDEX.md](restores/INDEX.md)

```bash
curl -L -o Truthpole-Complete-2.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/Truthpole-Complete-2.zip
unzip -o Truthpole-Complete-2.zip -d truthpole
cd truthpole
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x startup.sh
sh startup.sh
```

## Naming rule

| Label | File |
|-------|------|
| Complete build | pinned branch + `TRUTHPOLE-restore-20260827-live.zip` |
| restore file(1) | `restores/restore-file-1.zip` |
| restore file(2) | `restores/restore-file-2.zip` |
| restore file(3) | `restores/restore-file-3.zip` |
| restore file(4) | `restores/restore-file-4.zip` |
| Truthpole-Complete 2 | `restores/Truthpole-Complete-2.zip` |
| restore file(5) | `restores/restore-file-5.zip` (next numbered restore only) |

Never replace older restore zips.
