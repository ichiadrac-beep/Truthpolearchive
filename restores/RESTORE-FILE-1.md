# restore file(1)

**Label:** restore file(1)  
**Date:** 27 August 2026  
**Does not overwrite:** Complete build (`complete-build` branch, `TRUTHPOLE-restore-20260827-live.zip`)

Zip: `restores/restore-file-1.zip`

## What this snapshot adds on top of Complete build

- Archive ↔ Conspiracy ↔ Ancient **Related** cross-links (e.g. Roswell ↔ Majestic 12)
- Related rows show the desk name and open the other desk with the file pulled
- `?file=` deep links on Conspiracy and Ancient as well as Archive

## Restore

```bash
unzip restore-file-1.zip -d truthpole
cd truthpole
rm -rf node_modules
npm install
npm run build
sh startup.sh
```
