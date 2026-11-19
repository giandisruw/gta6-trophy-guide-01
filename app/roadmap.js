// Roadmap to the platinum and the missables page, both built from the trophy
// data itself: each stage lists the trophies it covers, in the order to earn them.
import { isEarned } from './store.js';
import { spoilerMask } from './filters.js';

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story',
    time: 'About 60–80 hours · Chapters 1–5',
    text: 'Finish the story and enjoy it. All 12 story trophies pop automatically, there are no mission gold medals, and the 100% checklist is not even visible until the story ends — but progress made now already counts toward it. Do the side questlines as they appear (Andy, Kenton, Billy, Randy, Tyrone, Bret, Cal): they stay available after the story, but they introduce the robbery and activity systems the later trophies need. Above all, do the Chapter 1 meditation at Jason\u2019s house (see Missables) — it is the one thing in the game that can be missed. Keep a manual save at the start and the end of each chapter: there is no mission replay, and you have 15 manual save slots plus one autosave.',
  },
  {
    stage: 2,
    title: 'Stage 2 — Open-world systems',
    time: 'Alongside the story, then free-roam',
    text: 'Learn the systems that the checklist counts: scan vehicles and landmarks with the WAiNK app (hold up, then R1), study animals with binoculars, try each of the 9 activity types once, and play one arcade game to completion. Start the collectible hunts now — meditation spots, card sets, vehicles — because every scan and spot counts from the moment you do it. Partner trophies unlock after the Chapter 2 mission Coffee Break, when Jason and Lucia can roam together.',
  },
  {
    stage: 3,
    title: 'Stage 3 — The 100% checklist',
    time: 'About 100 hours · after the story',
    text: 'After the final mission the checklist appears under Progress, Stats, 100% Completion. It is lenient — close to 60% true completion, per PowerPyx — and nothing on it is missable. Work it line by line: 100 optional missions, 300 stunts, gold in all 42 Shooting Range challenges, every drone race, 20 race wins, all 8 bank vaults, all 39 gang operations, 200 of 277 vehicles scanned, 100 of 255 animals studied, any 70 of 80 challenges, and the collectible counts (15 of 18 meditations, 3 card sets). The gold A Long Road pops when the checklist hits 100%.',
  },
  {
    stage: 4,
    title: 'Stage 4 — Clean-up and the platinum',
    time: 'About 10 hours',
    text: 'Sweep what is left: the 8 Strangers & Freaks strands, the miscellaneous trophies (the UFO easter egg, the Ocean Beach cocktail, the showroom Banshee, the bowling alley valuables), the money trophies (launder $250,000 in marked bills, spend $100,000 in shops, buy all 8 garages, register 10 vehicles), and the 500 criminal-profile actions. The platinum, Vice Got a Price!, pops with the last trophy you earn.',
  },
];

function chipFor(trophy, store, onSelect) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip' + (isEarned(store, trophy.name) ? ' earned' : '');
  chip.title = `${trophy.grade} · ${trophy.kind}${trophy.missable ? ' · missable' : ''}`;
  const shown = spoilerMask(trophy, store);
  chip.textContent = shown.name;
  chip.addEventListener('click', () => onSelect(trophy.id));
  return chip;
}

export function renderRoadmap(container, data, store, onSelect) {
  container.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = 'Roadmap to the platinum';
  container.append(heading);
  const intro = document.createElement('p');
  intro.textContent = 'Four stages, in order, from the first mission to the platinum. Times and difficulty come from PowerPyx: 4/10 difficulty, about 200 hours, one playthrough, no online trophies, no difficulty setting. Cheats disable trophies and saving, so keep them off for the whole run.';
  container.append(intro);

  const facts = document.createElement('div');
  facts.className = 'fact-box';
  facts.innerHTML = '<h3>Platinum facts</h3><p><strong>55 trophies:</strong> 1 platinum, 2 gold, 6 silver, 46 bronze. <strong>28 hidden</strong> on PlayStation until earned. <strong>0 online.</strong> <strong>Difficulty 4/10</strong>, about <strong>200 hours</strong>, <strong>1 playthrough</strong>. Sources: the official list on Exophase and PSNProfiles; PowerPyx\u2019s trophy guide and roadmap (18 Nov 2026).</p>';
  container.append(facts);

  for (const stage of ROADMAP_STAGES) {
    const card = document.createElement('article');
    card.className = 'stage-card';
    const head = document.createElement('div');
    head.className = 'stage-head';
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const time = document.createElement('span');
    time.className = 'stage-time';
    time.textContent = stage.time;
    head.append(title, time);
    const text = document.createElement('p');
    text.textContent = stage.text;
    const list = document.createElement('div');
    list.className = 'stage-trophies';
    const covered = data.trophies.filter((t) => t.stage === stage.stage);
    const earned = covered.filter((t) => isEarned(store, t.name)).length;
    const counter = document.createElement('p');
    counter.className = 'stage-time';
    counter.textContent = `${earned} of ${covered.length} trophies in this stage earned`;
    for (const t of covered) list.append(chipFor(t, store, onSelect));
    card.append(head, text, counter, list);
    container.append(card);
  }
}

export function renderMissables(container, data, store, onSelect) {
  container.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = 'Missable trophies';
  container.append(heading);
  const intro = document.createElement('p');
  intro.textContent = 'PowerPyx and GTABase agree: only one trophy in the whole list is potentially missable. Everything else is either automatic story progress or repeatable in free-roam after the story. This page says exactly what to watch for, and what is safe to ignore.';
  container.append(intro);

  const missable = data.trophies.filter((t) => t.missable);
  for (const t of missable) {
    const box = document.createElement('div');
    box.className = 'warn-box';
    const title = document.createElement('h3');
    title.textContent = `⚠ ${t.name} — potentially missable`;
    const desc = document.createElement('p');
    desc.textContent = t.description;
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    const open = document.createElement('button');
    open.type = 'button';
    open.textContent = 'Open its full guide';
    open.addEventListener('click', () => onSelect(t.id));
    box.append(title, desc, guide, open);
    container.append(box);
  }

  const saves = document.createElement('div');
  saves.className = 'stage-card';
  saves.innerHTML = '<h3>Why chapter saves matter</h3><p>GTA VI has no mission replay. If you miss the Chapter 1 meditation, no replay and no free-roam return will bring it back. PowerPyx advises keeping a manual save at the start and the end of each chapter — you have 15 manual slots and one autosave, so keep 10 for the chapter boundaries and rotate the other 5 during free-roam clean-up. That one habit is the whole missable protection this game needs.</p>';
  container.append(saves);

  const story = data.trophies.filter((t) => t.kind === 'story');
  const tableWrap = document.createElement('div');
  tableWrap.innerHTML = '<h3>Story trophies — automatic, cannot be missed</h3>';
  const table = document.createElement('table');
  table.className = 'plain';
  table.innerHTML = '<thead><tr><th>Trophy</th><th>What pops it</th><th>Grade</th></tr></thead>';
  const body = document.createElement('tbody');
  for (const t of story) {
    const row = document.createElement('tr');
    const shown = spoilerMask(t, store);
    const nameCell = document.createElement('td');
    nameCell.textContent = shown.name;
    const descCell = document.createElement('td');
    descCell.textContent = shown.description;
    const gradeCell = document.createElement('td');
    gradeCell.textContent = t.grade;
    row.append(nameCell, descCell, gradeCell);
    body.append(row);
  }
  table.append(body);
  tableWrap.append(table);
  container.append(tableWrap);

  const unknown = data.trophies.filter((t) => t.id === 49 || t.id === 51);
  const unknownBox = document.createElement('div');
  unknownBox.className = 'note-box';
  unknownBox.innerHTML = '<h3>Still unconfirmed — not missable, just unknown</h3><p>Two trophies have no confirmed method yet, and this guide says so rather than guessing. <strong>Bad Luck, I Guess</strong> is believed to relate to the Payday Loans store from the prologue; <strong>Ten Pin</strong> is believed to come from kicking enemies while driving a motorcycle. Both are PowerPyx\u2019s best guesses as of 18 Nov 2026 — check the linked guide for updates, and do not grind for either until a source confirms the trigger.</p>';
  container.append(unknownBox);
}
