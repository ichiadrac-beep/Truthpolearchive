# restore file(4)

**Label:** restore file(4)  
**Date:** 27 August 2026  
**Does not overwrite:** Complete build or restore files (1)–(3)

Zip: `restores/restore-file-4.zip`

## What this snapshot adds on top of restore file(3)

- Landing alien head: one-frame chromatic-aberration glitch on tap

## Restore

```bash
unzip restore-file-4.zip -d truthpole
cd truthpole
rm -rf node_modules
npm install
npm run build
sh startup.sh
```
