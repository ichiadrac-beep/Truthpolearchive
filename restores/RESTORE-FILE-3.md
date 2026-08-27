# restore file(3)

**Label:** restore file(3)  
**Date:** 27 August 2026  
**Does not overwrite:** Complete build, restore file(1), or restore file(2)

Zip: `restores/restore-file-3.zip`

## What this snapshot adds on top of restore file(2)

- Desk-only ACCESSING decrypt veil (case files open immediately)
- X-Files SIGNAL bar that flickers on feed refresh
- Archive map pinch-zoom rubber-band at min/max
- Ambient sky hum + mute, stars pulse with the bed
- Case-file redaction bars: scratch to declassify, haptics, faint scratch audio, partial wear

## Restore

```bash
unzip restore-file-3.zip -d truthpole
cd truthpole
rm -rf node_modules
npm install
npm run build
sh startup.sh
```
