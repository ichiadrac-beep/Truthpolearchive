# Truthpole-Complete 2

**Label:** Truthpole-Complete 2  
**Date:** 27 August 2026, 23:01 BST  
**Does not overwrite:** Complete build, restore file(1), restore file(2)

Zip: `restores/Truthpole-Complete-2.zip`

## What this snapshot is

Full restorable copy of the live desk at this moment:

- restore file(2) desk (linked counts, status tags, ticking archive count, desk decrypt)
- Tonight’s file on first paint (Cussac) — no scramble, no fade, no ready-gate
- `startup.sh` waits until the origin answers before it exits

Does **not** include sky hum, scratch-to-declassify, or Mr. Black.

## Restore into another build

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

Do not tell the desk it is restored until the origin answers. Do not add features. Do not touch hum, scratches, or Mr. Black unless asked.
