# Truthpole-Complete 4

**Label:** Truthpole-Complete 4  
**Date:** 28 August 2026, 01:51 BST  
**Does not overwrite:** Complete build, restore file(1), restore file(2), Truthpole-Complete 2, Truthpole-Complete 3

Zip: `restores/Truthpole-Complete-4.zip`

## What this snapshot is

Full restorable copy of the live desk at this moment:

- Everything in **Truthpole-Complete 3** (Tonight’s file, linked counts, status tags, Men in Black file, one-shot title type-out)
- **Scratch-to-declassify** on Archive **and** Conspiracy case files — 3–5 black bars on the desk summary, lottery-ticket drag (not tap), one-shot per sitting
- Ancient stays clean
- X-Files **SIGNAL** HUD (hunt / lock / idle flicker)
- Rare idle **SIGNAL LOST / SIGNAL RESTORED** full-screen static burst

Does **not** include sky hum or Mr. Black.

## Restore into another build

```bash
curl -L -o Truthpole-Complete-4.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/Truthpole-Complete-4.zip
unzip -o Truthpole-Complete-4.zip -d truthpole
cd truthpole
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x startup.sh
sh startup.sh
```

Do not tell the desk it is restored until the origin answers. Do not add features. Do not touch hum or Mr. Black unless asked.
