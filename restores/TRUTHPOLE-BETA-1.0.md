# TRUTHPOLE — Beta 1.0

**Label:** Beta 1.0  
**Date:** 28 August 2026, 03:31 BST  
**Does not overwrite:** Complete build, restore file(1), restore file(2), Truthpole-Complete 2–5

Zip: `restores/Truthpole-Beta-1.0.zip`

## What this snapshot is

The final Beta 1.0 of the live desk. Full restorable copy. If the site breaks, this is the file that puts it back.

Includes everything through Complete 5, plus:

- Mr. Black on The Pole (scripted, shared, never a chatbot)
- Mr. Black conspiracy file (uncatalogued, no pin, custom scratch reveal)
- Lottery-ticket scratch on case files; override taunt on Mr. Black
- Tonight’s File rotates daily; on a case’s date it reads **Today is [name]’s anniversary**
- Conspiracy search no longer freezes the desk
- New conspiracy files: JFK Files, The Psionics, Galactic Federation, The Greys, Avians, Draco Reptilians, Nordics, Mantids, Tall Whites
- SIGNAL HUD, rare SIGNAL LOST, 4,281,006-document flicker, title type-out, Men in Black, instant desk hops

## Restore into another build

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

Do not tell the desk it is restored until the origin answers. Do not add features unless asked.
