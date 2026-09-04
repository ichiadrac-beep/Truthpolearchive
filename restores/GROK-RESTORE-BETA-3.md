# GROK — restore TRUTHPOLE Archive Beta 3

**This is a restore, not a new app.** Do not scaffold. Do not rewrite the sky, the saucer, the CRT, or the desks. Unpack this snapshot, **run `npm install`**, start, leave it running.

**Snapshot:** 4 September 2026 · live classified desk  
**Zip:** `restores/Truthpole-archive-beta-3.zip`  
**Full backup:** `restores/TRUTHPOLE-backup-beta-3.zip`

---

## Prompt to paste into any Grok Build chat (old or new)

```
Restore TRUTHPOLE Archive Beta 3 from the GitHub repo ichiadrac-beep/Truthpolearchive. This is a restore, not a new app. Do not scaffold.

1. Read GROK-RESTORE.md (repo root).
2. Download restores/Truthpole-archive-beta-3.zip
   (fallback: restores/TRUTHPOLE-backup-beta-3.zip).
3. unzip -o that zip over /workspace
4. MUST run:  rm -f .node_modules.lock && rm -rf node_modules && npm install
   Then:      chmod +x RESTORE-THIS.sh startup.sh && sh /workspace/RESTORE-THIS.sh
   (RESTORE-THIS.sh is npm install + startup.sh. If it is missing, run those two yourself.)
5. Do not run vite or npx vite directly. Only npm run dev via startup.sh.
6. Keep every animation: star-field UFOs, Bob Lazar sport-model saucer (SportSaucer), hold-the-logo 5s summon, CRT, glyphs, title type-out. Do not add CSS shooting-star streaks.
7. Do not add features. Do not restyle. Verify the landing sky and a file open, then stop.
```

---

## Exact restore steps (Grok sandbox)

**Always `npm install` after unzip. This is required in every chat, old or new.**

```bash
curl -L -o /tmp/Truthpole-archive-beta-3.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/Truthpole-archive-beta-3.zip

unzip -o /tmp/Truthpole-archive-beta-3.zip -d /workspace
cd /workspace
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x RESTORE-THIS.sh startup.sh
sh /workspace/RESTORE-THIS.sh
```

If `RESTORE-THIS.sh` is missing, the last two lines are:

```bash
chmod +x startup.sh
sh /workspace/startup.sh
```

`startup.sh` also runs `npm install` if `node_modules` is missing, then `npm run dev` on **0.0.0.0:8080**. Still run `npm install` yourself first so a half-extracted tree cannot start on stale lockfiles.

Do not tell the desk it is restored until `http://127.0.0.1:8080/` answers 200. Leave the dev server up.

### Full backup (same live desk, second copy)

```bash
curl -L -o /tmp/TRUTHPOLE-backup-beta-3.zip \
  https://github.com/ichiadrac-beep/Truthpolearchive/raw/main/restores/TRUTHPOLE-backup-beta-3.zip
unzip -o /tmp/TRUTHPOLE-backup-beta-3.zip -d /workspace
cd /workspace
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x RESTORE-THIS.sh startup.sh
sh /workspace/RESTORE-THIS.sh
```

---

## Hard rules (break these and the live site is not restored)

1. **Do not scaffold.** No new `src/router.tsx` from memory. Use the files in the zip.
2. **Always `npm install` after unzip.** Then start with `npm run dev` only — never `vite` / `npx vite`. `scripts/with-app-env.mjs` must wrap the server.
3. **Bind `0.0.0.0:8080`.** `startup.sh` already does this.
4. **Do not rewrite these files:**
   - `src/components/fx-root.tsx` — sky host; empty `.cosmos-sky`; lazy StarField + SportSaucer
   - `src/components/star-field.tsx` — canvas stars + roaming UAP silhouettes (triangle, tic-tac, disk, cigar, etc.)
   - `src/components/sport-saucer.tsx` — Bob Lazar sport-model disc; roam / tail / duel / fire
   - `src/lib/sky-bogeys.ts` — star-field ↔ saucer kill bridge
   - `src/components/landing.tsx` — 5-second hold on the alien mark dispatches `truthpole:summon-saucer`
5. **Do not add CSS meteor / shoot-star spans.** Those were a regression (diagonal streaks). Live sky is canvas only.
6. **Keep** `grokPwaPlugin`, `public/__grok/`, `server/middleware/grok-pwa.ts`.
7. **Do not add features, restyle, or “improve” copy.** Restore, verify, stop.
8. **`XAI_API_KEY` is server-only.** Read-aloud hits `/api/read-aloud`. Do not put the key in client code.

---

## What must still work after restore

| Piece | Where | Check |
|---|---|---|
| Star field + UAP craft | Landing / every desk | Twinkling stars, small craft crossing |
| Sport-model saucer | `SportSaucer` over the sky | Disc appears, flees / duels; hold logo 5s to summon |
| No diagonal streaks | Landing | Empty `.cosmos-sky`, no `.shoot-star` nodes |
| CRT / glyphs / type-out | Shell | Scanlines, glyph field, titles type on first view |
| Hand scan | `/scan` | Biometric gate into the desks |
| Archive map | `/archive` | Globe, pins, file drawer, scratch on cases |
| Conspiracy | `/conspiracy` | ~192 files incl. cryptids, scratch, read aloud |
| Ancient | `/ancient` | Folklore / legend section on every card |
| Anniversaries | `/anniversaries` | Year from today, wraps |
| Today’s case | Landing CTA | Daily hash; real anniversary reads TODAY IS … |
| X-Files / Pole / Support | Tabs | Live boards, guest channel, tips |
| Read aloud | File panel | Orion TTS via `/api/read-aloud`, browser fallback |

---

## Verify (do this, then stop)

1. Landing loads: TRUTHPOLE, Enter the archive, **Today’s case**, tabs including **Anniversaries**.
2. Sky is a star field, not rain/meteors. A disc or craft should pass.
3. Hold the alien logo ~5 seconds — sport-model saucer summons.
4. Open `/conspiracy?file=mothman` and `/ancient?file=sigiriya` — folklore section on Sigiriya (Kassapa + Ravana, lion paws).
5. Leave `startup.sh` / `npm run dev` running.
