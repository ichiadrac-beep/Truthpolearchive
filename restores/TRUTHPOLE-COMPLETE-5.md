# Truthpole-Complete 5

**Label:** Truthpole-Complete 5  
**Date:** 28 August 2026, 02:16 BST  
**Does not overwrite:** Complete build, restore file(1), restore file(2), Truthpole-Complete 2, Truthpole-Complete 3, Truthpole-Complete 4

Zip: `restores/Truthpole-Complete-5.zip`

## What this snapshot is

Full restorable copy of the live desk at this moment — the working site:

- Everything in **Truthpole-Complete 4** (lottery-ticket scratch on Archive & Conspiracy, Men in Black, title type-out, SIGNAL HUD, rare SIGNAL LOST burst)
- Instant desk-to-desk hops (decrypt veil only on first entry from landing)
- Cheaper sky / CRT so the desk stays smooth
- Rare live-count flicker: **ANALYZING... 1 OF 4,281,006 DOCUMENTS**, then the real tally

Does **not** include sky hum or Mr. Black.

## Restore into another build

```bash
curl -L -o Truthpole-Complete-5.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/Truthpole-Complete-5.zip
unzip -o Truthpole-Complete-5.zip -d truthpole
cd truthpole
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x startup.sh
sh startup.sh
```

Do not tell the desk it is restored until the origin answers. Do not add features. Do not touch hum or Mr. Black unless asked.
