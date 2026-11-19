# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/giandisruw/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/giandisruw/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — built for the [make.fun bounty “Build the best GTA 6 trophy guide”](https://make.fun/bounty/gta6-trophy-guide-01) ($250, 50 paid places).

## What it is

- **Every trophy, official and complete:** all 55 names, descriptions and grades exactly as PlayStation publishes them — 1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden until earned.
- **A tracker:** a checklist saved in your browser (localStorage), with **export to a file and import back**, filters by kind (story, missable, collectibles, activities, side quests, robberies, exploration) and grade, full-text search, and a **spoiler setting** that hides the names and descriptions of story trophies until you earn them.
- **A roadmap to the platinum:** four stages in order — story (60–80 h), open-world systems, the 100% checklist (~100 h), clean-up (~10 h) — with per-stage progress. Difficulty 4/10, about 200 hours, one playthrough, no online trophies.
- **Missables, honestly flagged:** PowerPyx and GTABase agree only one trophy is potentially missable — **Positive Mental Attitude**, whose first meditation can only be done in Chapter 1. The guide gives the exact Chapter 1 steps and the chapter-save habit that protects you (GTA VI has no mission replay).
- **A cited guide for every trophy:** each guide is written for this entry, in its own words, and names its sources beside it — the official list on Exophase and PSNProfiles, and PowerPyx's trophy guide & roadmap (18 Nov 2026), cross-checked against GTABase. Where a method is not yet confirmed (Bad Luck, I Guess; Ten Pin), the guide says so instead of guessing.

## How to run it

No build step, no network. Serve `app/` with any static server and open `index.html`:

```sh
node serve.ts
# then open http://localhost:8080
```

Or open `app/index.html` directly from the files — everything it loads is a file under `app/`, so it works with the network off.

## How to reproduce the build

The entry is handed in by `main.ts` (Node 22, standard library only). It copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are real renders of the app in a desktop browser (1280×800), taken with Playwright Chromium from the views listed in `shots.json`: the checklist with a guide open, the roadmap, the missables page, and the 100% guide. Progress in the screenshots is seeded to 13 of 55 earned so the tracker shows real state.

## Checks (verified 2026-11-20)

- `node --check` passes on all four app modules; `MAKEFUN_OUTPUT_DIR=out node main.ts` exits 0 and writes `out/app/`, `out/screenshots/` and `out/dossier.json` (909,027 bytes, text 92,516 of 163,840 bytes). Two runs produce byte-identical `dossier.json` files.
- `app/data/trophies.json` holds all 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze), every guide non-blank, every trophy with named sources; exactly one trophy is flagged missable (Positive Mental Attitude).
- Screenshots: 4 JPEGs at 1280×800, each under 256 KiB, rendered in headless Chromium from this app's own code with 13 of 55 trophies seeded as earned.
- Offline: the app's only `fetch` is the relative `data/trophies.json`; no external script, font, image or stylesheet. The only absolute URLs in the source are the five citation links in `trophies.json`, opened only when a reader follows them.

## Layout

- `app/` — the guide itself: `index.html`, `main.js` (boot, checklist, detail pane, routing), `store.js` (progress, export/import), `filters.js` (kind/grade/search/spoiler rules), `roadmap.js` (roadmap and missables views), `style.css`, `data/trophies.json` (the 55 trophies with guides and sources), `favicon.svg`.
- `screenshots/` — 4 screenshots of the app, the first by name is the cover.
- `main.ts` — the hand-in program; `serve.ts` — a local static server for trying the app; `shots.json` — what each screenshot shows.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

## Sources

- Exophase — GTA VI trophy list: https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles — GTA VI trophy list: https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- PowerPyx — GTA 6 Trophy Guide & Roadmap: https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- PowerPyx — GTA 6 100% Completion Checklist: https://www.powerpyx.com/gta-6-100-completion-checklist-guide/
- GTABase — GTA 6 achievements & trophies list: https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series

## Notes

- Unofficial, fan-made guide. Not affiliated with Rockstar Games, Sony or PlayStation. No Rockstar logo, artwork or game screenshots are used.
- GTA VI released 19 November 2026, a day before this guide was written; launch-era details are labelled where unconfirmed.
- License: MIT (see `LICENSE`).
