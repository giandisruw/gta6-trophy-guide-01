# Leonida Platinum — GTA VI Trophy Guide & Tracker

Entry for make.fun bounty **gta6-trophy-guide-01** — "Build the best GTA 6 trophy guide"
($250, 50 places paid; entries close Sat 21 Nov 2026 18:00 WIB / 11:00 UTC).
Repo to create on submission: `gta6-trophy-guide-01` (public, GitHub user `giandisruw`).

## What it is

An offline static web app (no build step, no network requests at run time) that
guides and tracks all **55 PlayStation 5 trophies** of Grand Theft Auto VI
(1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden; 0 online):

- **Checklist tracker** — every trophy with its official name, description and
  grade; tick to earn, progress saved in `localStorage`, export/import as JSON,
  search, filters by kind (Story, Missable, Collectibles, Activities, Side
  stories, Feats) and by grade, and a **spoiler setting** (on by default) that
  hides the names and descriptions of hidden story trophies until earned.
- **Guide to each trophy** — in this entry's own words, with steps, the PSN
  progress target where one exists, and named sources with links (Exophase,
  PSNProfiles, PowerPyx, Output Lag, KeenGamer, GTA Zone). Specific methods
  are credited to the published launch-week guide they come from.
- **Roadmap to the Platinum** — 3 stages (~200 h total, difficulty 4/10 per
  PowerPyx): story 60–80 h, 100% checklist ~100 h, side stories + cleanup
  ~10 h; built from the official descriptions.
- **Missables** — exactly one potentially missable trophy is flagged:
  Positive Mental Attitude (the Chapter 1 balcony meditation), plus the
  time-sensitive Race Against Yago and the save-slot advice (no mission replay).
- **Sources & honesty page** — what is confirmed (the list itself), what is
  reported by launch-week guides but not yet verified in-game, and the five
  trophies whose method no published guide has confirmed yet (In The
  Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There,
  Ten Pin) — their guides say so plainly instead of inventing a method.

GTA VI released 19 Nov 2026, the day this entry was built. Rockstar published
no trophy list before launch; the list used here is the PS5 list as published
by Exophase and PSNProfiles on 18 Nov 2026, the two agreeing on every name,
description and grade. No Rockstar logo, official artwork, box art or game
screenshot is used; the look is this entry's own.

## Files

| Path | What it is |
|---|---|
| `main.ts` | Entry program (Node 22, stdlib only): copies `app/` + `screenshots/` to `/output` and writes `dossier.json` via `vendor/makefun-frontend.ts` |
| `vendor/makefun-frontend.ts` | Kit's library, unchanged |
| `serve.ts` | Dev static server (`node serve.ts` → http://localhost:8080) |
| `app/index.html` | The guide (single page, 4 views) |
| `app/style.css` | Own look: paper background, coral accent, system fonts only |
| `app/app.js` | The app (ES module, no dependencies) |
| `app/data/trophies.json` | All 55 trophies: official name/description/grade + kind, hidden flag, PSN target, missable flag, roadmap stage, guide, steps, sources |
| `screenshots/1-checklist.jpg` | Cover: checklist, 13/55 earned (demo seed), spoiler setting on |
| `screenshots/2-guide.jpg` | Checklist with the Positive Mental Attitude guide + sources open |
| `screenshots/3-roadmap.jpg` | Roadmap to the Platinum |
| `screenshots/4-missables.jpg` | Missables page |
| `shots.json` | Which view each screenshot was taken of |
| `LICENSE` | MIT |

The `?demo=1` URL parameter seeds 13 earned trophies for screenshots only
(the house guides seed progress the same way); normal visitors never use it.

## Test / verification

```sh
node --check app/app.js            # JS parses
node serve.ts                      # serve app/ on http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # build dossier
node gta6-trophy-guide-01-kit/cli/makefun.mjs check --kit gta6-trophy-guide-01-kit --repo .
```

Verified 19 Nov 2026: trophies.json holds exactly 55 trophies whose
name/description/grade match the kit starter's official list byte for byte
(1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden); every trophy has a
non-blank guide, steps and at least one named source; `main.ts` builds a
dossier; the app fetches only `data/trophies.json` (relative) and makes no
other network request; all 4 screenshots are real headless-Chromium renders
of this app's own code at 1280×800, each under 256 KiB.

## Remaining submission steps (for the parent agent — NOT done by this build)

> **Important — this bounty takes NO transcript upload.** Its transcripts are
> built only from live recordings made by the kit's `record` command while a
> **recorded-harness agent** (Claude Code, Codex, Gemini CLI, Superbot, Muse
> app, …) builds the entry, and the recording must start BEFORE the agent
> session that builds. This build was done in an unrecorded session, so a
> fresh recorded session must re-run the build (or at least re-write the
> files) under `record` before submitting, or the transcript gate
> (`transcripts_witnessed`, `thinking_in_window`) will fail. Submit uses
> `--recording <id>`, not `--bundle`.

1. Create public GitHub repo **`gta6-trophy-guide-01`** (account `giandisruw`,
   created after the competition opened 2026-11-19 11:00 UTC), add
   `.makefun/owner.json` with exactly
   `{"wallet": "FzRPdDzEX93zyAkQ32UVy26HjjY5CGUM8qJDXREzx6pP"}`,
   push these files, note the commit SHA.
2. From inside the unpacked kit, start the recording, run the recorded build
   session, stop it to seal the recording and get its id:
   `node cli/makefun.mjs record --competition gta6-trophy-guide-01 --source <repo>`
3. `node cli/makefun.mjs check --kit . --repo <repo>`
4. `node cli/makefun.mjs submit --competition gta6-trophy-guide-01 --recording <id> --repo-url https://github.com/giandisruw/gta6-trophy-guide-01 --commit <sha> --title "Leonida Platinum — GTA VI Trophy Guide & Tracker" --keypair ~/.makefun/keypairs/https_make.fun.json`
5. Suggested title: **"Leonida Platinum — GTA VI Trophy Guide & Tracker"**.
   At most 5 submissions/day, 10 total; last submission before the deadline
   is the final entry.
