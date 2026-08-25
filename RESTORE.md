# TRUTHPOLE — restore files

Frozen snapshots of the desk. **V 1.0 is still there** and is not overwritten.
This file’s **current restore** is the desk as of 25 Aug 2026 (evening): Ancient
contact files, Pole mobile keyboard, archive map, clearance phrases, anniversary
Tonight’s File, tappable glyphs, shooting-star colours.

Repo: [ichiadrac-beep/Truthpolearchive](https://github.com/ichiadrac-beep/Truthpolearchive)

---

## Current restore (25 Aug 2026 desk)

**Release:** [restore-20260825-current](https://github.com/ichiadrac-beep/Truthpolearchive/releases/tag/restore-20260825-current)  
**Tag:** `restore-20260825-current`  
**Frozen branch:** `backup/restore-20260825-current`  
**Zip asset:** `TRUTHPOLE-restore-20260825-current.zip`

### Fastest

1. Open [Releases](https://github.com/ichiadrac-beep/Truthpolearchive/releases) and download **TRUTHPOLE-restore-20260825-current.zip**.
2. Unzip, then:

```
npm install
npm run dev
```

### From git (does not depend on later `main` commits)

```
git clone https://github.com/ichiadrac-beep/Truthpolearchive.git
cd Truthpolearchive
git checkout restore-20260825-current
npm install
npm run dev
```

Same snapshot: `backup/restore-20260825-current`

### What this snapshot includes (on top of V 1.0)

- Ancient / pre-modern: Anunnaki, Watchers, pre-biblical contact files
- Pole live chat: keyboard glued on mobile, no AutoFill bar, nav hidden while typing
- Archive globe: draws immediately, GeoJSON loads in the background with cache/retry
- Zoomed pins: only stacked cases fan out; tap picker when several still overlap
- Hidden phrases on landing/desk: WOW, MJ-12, ZETA → one-off cleared memo (session only)
- Tonight’s File: local-date “on this day” anniversaries, else the usual rotation
- 2–3 tappable sky glyphs (Zeta / WOW / 33°N) with tiny glass notes
- Shooting stars: white ~70%, pale green ~20%, amber ~8%, deep red ~2%

App version label is still **V 1.0** (`1.0.0`). This restore is a full tree snapshot, not a version bump.

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
