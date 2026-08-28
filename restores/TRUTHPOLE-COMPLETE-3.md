# Truthpole-Complete 3

**Label:** Truthpole-Complete 3  
**Date:** 28 August 2026, 01:14 BST  
**Does not overwrite:** Complete build, restore file(1), restore file(2), Truthpole-Complete 2

Zip: `restores/Truthpole-Complete-3.zip`

## What this snapshot is

Full restorable copy of the live desk at this moment:

- Truthpole-Complete 2 desk (linked counts, status tags, ticking archive count, desk decrypt, Tonight’s file first-paint)
- **Scratch-to-declassify** on Archive case files only (not Conspiracy, not Ancient)
- Dedicated **Men in Black** conspiracy file — origins (Maury Island), Bender case (IFSB / Bridgeport 1953), mythology (Barker, Keel)
- Case titles **type out** character by character the first time they scroll into view on the map and lists, then stay static for the rest of the session

Does **not** include sky hum or Mr. Black.

## Restore into another build

```bash
curl -L -o Truthpole-Complete-3.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/Truthpole-Complete-3.zip
unzip -o Truthpole-Complete-3.zip -d truthpole
cd truthpole
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x startup.sh
sh startup.sh
```

Do not tell the desk it is restored until the origin answers. Do not add features. Do not touch hum or Mr. Black unless asked.
