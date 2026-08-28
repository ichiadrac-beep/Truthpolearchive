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
Does **not** replace Complete build or restore file(1).

**Zip:** [`restores/restore-file-2.zip`](restores/restore-file-2.zip)  
**Docs:** [restores/RESTORE-FILE-2.md](restores/RESTORE-FILE-2.md) · [restores/INDEX.md](restores/INDEX.md)

## Truthpole-Complete 2

Full desk snapshot, 27 Aug 2026.  
**Zip:** [`restores/Truthpole-Complete-2.zip`](restores/Truthpole-Complete-2.zip)  
**Docs:** [restores/TRUTHPOLE-COMPLETE-2.md](restores/TRUTHPOLE-COMPLETE-2.md)

## Truthpole-Complete 3

Full restorable desk: Complete 2 + archive scratch + Men in Black + title type-out.  
**Zip:** [`restores/Truthpole-Complete-3.zip`](restores/Truthpole-Complete-3.zip)  
**Docs:** [restores/TRUTHPOLE-COMPLETE-3.md](restores/TRUTHPOLE-COMPLETE-3.md)

## Truthpole-Complete 4

Full restorable desk: Complete 3 + lottery-ticket scratch + SIGNAL HUD + rare SIGNAL LOST burst.  
**Zip:** [`restores/Truthpole-Complete-4.zip`](restores/Truthpole-Complete-4.zip)  
**Docs:** [restores/TRUTHPOLE-COMPLETE-4.md](restores/TRUTHPOLE-COMPLETE-4.md)

## Truthpole-Complete 5

Full restorable desk: Complete 4 + instant desk hops + rare 4,281,006-document tally flicker.  
**Zip:** [`restores/Truthpole-Complete-5.zip`](restores/Truthpole-Complete-5.zip)  
**Docs:** [restores/TRUTHPOLE-COMPLETE-5.md](restores/TRUTHPOLE-COMPLETE-5.md)

## Beta 1.0 (current — 28 Aug 2026)

The final Beta 1.0 of the working site. Restore this if something happens.

**Zip:** [`restores/Truthpole-Beta-1.0.zip`](restores/Truthpole-Beta-1.0.zip)  
**Docs:** [restores/TRUTHPOLE-BETA-1.0.md](restores/TRUTHPOLE-BETA-1.0.md) · [restores/INDEX.md](restores/INDEX.md)

```bash
curl -L -o Truthpole-Beta-1.0.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/Truthpole-Beta-1.0.zip
unzip -o Truthpole-Beta-1.0.zip -d truthpole
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
| Truthpole-Complete 2 | `restores/Truthpole-Complete-2.zip` |
| Truthpole-Complete 3 | `restores/Truthpole-Complete-3.zip` |
| Truthpole-Complete 4 | `restores/Truthpole-Complete-4.zip` |
| Truthpole-Complete 5 | `restores/Truthpole-Complete-5.zip` |
| **Beta 1.0** | `restores/Truthpole-Beta-1.0.zip` |

Never replace older restore zips.
