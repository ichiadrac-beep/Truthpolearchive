# TRUTHPOLE — Archive Beta 3

**Label:** Truthpole archive beta 3  
**Date:** 4 September 2026  
**Does not overwrite:** Complete build, restore file(1)–(4), Truthpole-Complete 2–5, Beta 1.0

| Artifact | Path |
|---|---|
| Restore zip (use this) | [`restores/Truthpole-archive-beta-3.zip`](Truthpole-archive-beta-3.zip) |
| Full backup zip | [`restores/TRUTHPOLE-backup-beta-3.zip`](TRUTHPOLE-backup-beta-3.zip) |
| Grok instructions | [`../GROK-RESTORE.md`](../GROK-RESTORE.md) |
| One-shot script | `RESTORE-THIS.sh` (inside the zip) |

## What this snapshot is

The live classified desk as of 4 Sep 2026. Full restorable copy. If a chat, preview, or deploy breaks, this file puts **this** version back — animations included.

On top of Beta 1.0 / Complete 5:

- Bob Lazar **sport-model** saucer (`SportSaucer`) + star-field UAP craft; hold the landing logo 5s to summon
- Sky is canvas only (no CSS meteor streaks)
- **Today’s case** rotates every local midnight; real calendar dates read **TODAY IS … anniversary**
- **Anniversaries** tab / desk — year of dated files, starting today
- Conspiracy cryptid drawer (Bigfoot, Mothman, Flatwoods Monster, 79 creature files)
- Ancient cards: **Folklore / legend** on every file (Sigiriya = Kassapa + Ravana, lion paws)
- Read aloud: xAI Orion storyteller TTS with browser fallback
- Related links, status tags, scratch-to-declassify, title type-out, CRT, hand scan

## Restore into any Grok Build chat (required)

**Always `npm install` after unzip.** Then start only with `RESTORE-THIS.sh` or `startup.sh` / `npm run dev` — never `vite` or `npx vite`.

```bash
curl -L -o Truthpole-archive-beta-3.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/Truthpole-archive-beta-3.zip
unzip -o Truthpole-archive-beta-3.zip -d /workspace
cd /workspace
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x RESTORE-THIS.sh startup.sh
sh /workspace/RESTORE-THIS.sh
```

Do not scaffold. Do not rewrite `src/components/fx-root.tsx`, `star-field.tsx`, or `sport-saucer.tsx`. Do not add features. Do not announce restore until the origin answers on port 8080.

## Full backup

Same live desk, second copy, plus desk screenshots:

```bash
curl -L -o TRUTHPOLE-backup-beta-3.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/TRUTHPOLE-backup-beta-3.zip
unzip -o TRUTHPOLE-backup-beta-3.zip -d /workspace
cd /workspace
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x RESTORE-THIS.sh startup.sh
sh /workspace/RESTORE-THIS.sh
```
