# TRUTHPOLE — restore files

Frozen snapshots of the desk. **V 1.0 is still there** and is not overwritten.
This file’s **current restore** is the desk as of **26 Aug 2026** (early morning):
full live tree after invite, glyphs, archive pin persistence, X-Files real handles,
and expanded landing sky crafts.

Repo: [ichiadrac-beep/Truthpolearchive](https://github.com/ichiadrac-beep/Truthpolearchive)

---

## Current restore (26 Aug 2026 desk)

**Release:** [restore-20260826-current](https://github.com/ichiadrac-beep/Truthpolearchive/releases/tag/restore-20260826-current)  
**Tag:** `restore-20260826-current`  
**Frozen branch:** `backup/restore-20260826-current`  
**Zip asset:** `TRUTHPOLE-restore-20260826-current.zip`

### Fastest

1. Open [Releases](https://github.com/ichiadrac-beep/Truthpolearchive/releases) and download **TRUTHPOLE-restore-20260826-current.zip**.
2. Unzip, then:

```
npm install
npm run dev
```

### From git (does not depend on later `main` commits)

```
git clone https://github.com/ichiadrac-beep/Truthpolearchive.git
cd Truthpolearchive
git checkout restore-20260826-current
npm install
npm run dev
```

Same snapshot: `backup/restore-20260826-current`

### What this snapshot includes (on top of the 25 Aug restore)

- **Pole Invite / clearance:** fixed sheet above bottom nav; Invite contacts, X followers, X DMs, Copy; public join URL on sandbox hosts
- **Landing glyphs:** scattered random positions (no left/right columns on desktop); glyphs only on landing
- **Archive map:** pins stay visible once they appear until the timeline restarts; first Archive open each session auto-plays left → right
- **X-Files:** live feed resolves real X handles (never `@desk`); display names; noise filter; credibility meters
- **Landing sky crafts:** TR-3B triangle, tic-tac, orbs, disks, cigars, domes, boomerangs, rectangles, ovals, chevrons — multi-colour lights, random drift, up to 3 concurrent flybys
- Full `styles.css` restored (glass, cosmos, pole, archive, reduced-motion)

### Carried forward from 25 Aug restore

- Ancient / pre-modern: Anunnaki, Watchers, pre-biblical contact files
- Pole live chat: keyboard glued on mobile, SCIF, anon
- Archive globe: cold-start draw, stacked-pin picker, pulse on timeline year
- Clearance phrases: WOW / MJ-12 / ZETA
- Tonight’s File: anniversary preference
- Shooting stars: white / pale green / amber / deep red weights

App version label remains **V 1.0** (`1.0.0`). This restore is a full tree snapshot, not a version bump.

---

## Previous restore (25 Aug 2026 desk)

**Release:** [restore-20260825-current](https://github.com/ichiadrac-beep/Truthpolearchive/releases/tag/restore-20260825-current)  
**Tag:** `restore-20260825-current`  
**Frozen branch:** `backup/restore-20260825-current`

```
git checkout restore-20260825-current
```

---

## V 1.0 (frozen, 25 Aug 2026 morning)

**Release:** [v1.0.0 — TRUTHPOLE V 1.0](https://github.com/ichiadrac-beep/Truthpolearchive/releases/tag/v1.0.0)  
**Tag:** `v1.0.0`  
**Frozen branch:** `backup/v1.0`  
**Zip asset:** `TRUTHPOLE-v1.0-20260825-110439.zip`

```
git clone https://github.com/ichiadrac-beep/Truthpolearchive.git
cd Truthpolearchive
git checkout v1.0.0
npm install
npm run dev
```

Includes: landing + archive globe, Conspiracy and Ancient desks, X-Files watch
list, The Pole (anon / X / SCIF), Articles wire, liquid-glass, hand-scan, support.

---

## Earlier restore

- [restore-2026-08-25-pole-x-live](https://github.com/ichiadrac-beep/Truthpolearchive/releases/tag/restore-2026-08-25-pole-x-live) — Pole X / SCIF live chat
