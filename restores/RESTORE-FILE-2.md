# restore file(2)

**Label:** restore file(2)  
**Date:** 27 August 2026  
**Does not overwrite:** Complete build or restore file(1)

Zip: `restores/restore-file-2.zip`

## What this snapshot adds on top of restore file(1)

- Tappable **N linked** counts (lists, peek, stack, file header)
- Case status tags: UNRESOLVED / DISPUTED / CONFIRMED, with desk filters
- Archive timeline case-count ticks instead of snapping
- Desk-to-desk **ACCESSING DESK** decrypt veil (not on case files)

## Restore

```bash
unzip restore-file-2.zip -d truthpole
cd truthpole
rm -rf node_modules
npm install
npm run build
sh startup.sh
```
