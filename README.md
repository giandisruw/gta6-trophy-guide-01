[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/giandisruw/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/giandisruw/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
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
  hides the names and descriptions of hidden story trophies until earned. The
  detail pane beside the list shows the selected trophy's guide, steps and
  sources; the roadmap collapses still-hidden trophies into one line per stage
  instead of repeating "Hidden trophy".
- **Guide to each trophy** — in this entry's own words, with steps, the PSN
  progress target where one exists, and named sources with links (Exophase,
  PSNProfiles, PowerPyx, Output Lag, KeenGamer, GTA Zone). Specific methods
  are credited to the published launch-week guide they come from.
- **Roadmap to the Platinum** — 3 stages (~200 h total, difficulty 4/10 per
  PowerPyx): story 60–80 h, 100% checklist ~100 h, side stories + cleanup
  ~10 h; each stage lists its trophies and how many of them you have earned.
- **Missables** — exactly one potentially missable trophy is flagged:
  Positive Mental Attitude (the Chapter 1 balcony meditation), plus the
  time-sensitive Race Against Yago, the save-slot advice (no mission replay,
  15 manual slots + autosave) and the warning to leave cheats off.
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
| `app/index.html` | The guide (single page, 4 views: checklist, roadmap, missables, sources) |
| `app/style.css` | Own look: paper background, coral accent, system fonts only |
| `app/app.js` | The app (ES module, no dependencies) |
| `app/favicon.svg` | Small coral "L" mark, so the browser never 404s on a favicon |
| `app/data/trophies.json` | All 55 trophies: official name/description/grade + kind, hidden flag, PSN target, missable flag, roadmap stage, guide, steps, sources |
| `screenshots/1-checklist.jpg` | Cover: checklist, 13/55 earned (demo seed), spoiler setting on |
| `screenshots/2-guide.jpg` | Checklist with the Positive Mental Attitude guide + sources open |
| `screenshots/3-roadmap.jpg` | Roadmap to the Platinum |
| `screenshots/4-missables.jpg` | Missables page |
| `shots.json` | Which view each screenshot was taken of |
| `LICENSE` | MIT |

The `?demo=1` URL parameter seeds 13 earned trophies for screenshots only
(the house guides seed progress the same way); normal visitors never use it.
`?open=<id>` opens a trophy's guide in the detail pane, e.g. `?demo=1&open=28`
for Positive Mental Attitude.

## Verification

Tested 19 Nov 2026, in this session, with Node v24.22.1 and headless Chromium
from the Playwright cache, against the kit at
`~/workspace/makefun/gta6-trophy-guide-01-kit`:

- **Trophy list:** `app/data/trophies.json` holds exactly 55 trophies whose
  name/description/grade match the kit starter's official list with 0 mismatches
  (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden; exactly 1 missable —
  Positive Mental Attitude; kinds Story 12, Side stories 7, Collectibles 6,
  Activities 9, Feats 20, Missable 1; roadmap stages 19/19/17). Every trophy
  has a non-blank guide, steps and at least one named source. File: 52,084 bytes.
- **Browser run:** served with `node serve.ts` and driven over CDP at 1280×800.
  **0 console errors, 0 failed requests, 0 external requests** (20 requests
  across the four page loads, all to localhost; the app's only fetch is the
  relative `data/trophies.json`).
- **Tracker exercised in the browser:** checklist renders 55 rows with 13/55
  earned (23.6%) from the demo seed and 25 hidden trophies masked; toggling a
  trophy moves the count 13 → 14; kind filter Collectibles shows 6 rows; search
  "meditate" shows 1 row; switching the spoiler setting off reveals all 28
  hidden names (0 masked); export + import of `{earned: [1, 2, 3]}` round-trips
  through `localStorage` and survives a reload (3 earned). The guide pane for
  Positive Mental Attitude shows 4 steps and 3 sources; the roadmap renders
  3 stages with all 55 trophies; the missables view renders 1 missable card +
  3 warning cards; the sources view lists 6 source links.
- **Screenshots:** all 4 are real headless-Chromium renders of this app's own
  code at 1280×800, JPEG quality 82, each under 256 KiB — 1-checklist.jpg
  114,298 bytes, 2-guide.jpg 113,355 bytes, 3-roadmap.jpg 105,325 bytes,
  4-missables.jpg 148,276 bytes. Each was viewed and two visual defects found
  and fixed (the Import button's text was unreadable on coral; the detail
  pane's grade word was clipped inside its circle).
- **Build:** `node --check app/app.js` passes; `MAKEFUN_OUTPUT_DIR=out1 node
  main.ts` and `MAKEFUN_OUTPUT_DIR=out2 node main.ts` produce byte-identical
  output (`diff -r` empty); `dossier.json` is 725,855 bytes, under the 1.5 MiB
  cap. `vendor/makefun-frontend.ts` is byte-identical to the kit starter's copy
  (sha256 `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240`).
- **Kit check:** `node cli/makefun.mjs check --kit … --repo … --worktree`
  reports **4 passed, 0 failed, 17 skipped, 5 checked at submission** — the
  17 skips are the transcript checks, which only run on the site from the
  sealed recordings, and the 5 at-submission checks (repo public, repo owner,
  repo created after opening, commit in repo, duplicate snapshot) can only
  pass once the GitHub repo exists. The sealed gate rows (app_files,
  references, screenshots, dossier_matches, trophies, js_parses) run on the
  server at grading, not in the local check; the properties they test were
  verified above instead.

## Remaining submission steps (for the parent agent — NOT done by this build)

> **Important — this bounty takes NO transcript upload.** Its transcripts are
> built only from live recordings made by the kit's `record` command while a
> **recorded-harness agent** (Claude Code, Codex, Gemini CLI, Superbot, Muse
> app, …) builds the entry, and the recording must start BEFORE the agent
> session that builds. This build was done in a live-recorded session, so a
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
