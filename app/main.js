// Leonida Platinum — boot, checklist rendering, detail pane, hash routing.
// Loads data/trophies.json at run time (a file of this app, nothing remote).
import { loadStore, saveStore, isEarned, setEarned, exportProgress, importProgressFile, countByGrade } from './store.js';
import { filterTrophies, spoilerMask, kindLabel, gradeLabel, countTarget } from './filters.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const listEl = document.getElementById('trophyList');
const listMeta = document.getElementById('listMeta');
const detailPane = document.getElementById('detailPane');
const searchBox = document.getElementById('searchBox');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const missableOnly = document.getElementById('missableOnly');
const hideEarned = document.getElementById('hideEarned');
const spoilerToggle = document.getElementById('spoilerToggle');
const toolbar = document.getElementById('toolbar');
const views = {
  checklist: document.querySelector('.layout'),
  roadmap: document.getElementById('roadmapView'),
  missables: document.getElementById('missablesView'),
  about: document.getElementById('aboutView'),
};

let data = null;
let store = loadStore();
let selectedId = null;

const filters = { query: '', kind: 'all', grade: 'all', missableOnly: false, hideEarned: store.hideEarned };

function currentFilters() {
  return { ...filters };
}

function renderProgress() {
  const total = data.trophies.length;
  const earned = store.earned.length;
  document.getElementById('earnedCount').textContent = String(earned);
  const bar = document.getElementById('progressBar');
  bar.setAttribute('aria-valuenow', String(earned));
  document.getElementById('progressFill').style.width = `${total ? (earned / total) * 100 : 0}%`;
  const counts = countByGrade(data.trophies, store);
  document.getElementById('progressGrades').textContent =
    `Platinum ${counts.platinum[0]}/${counts.platinum[1]} · Gold ${counts.gold[0]}/${counts.gold[1]} · Silver ${counts.silver[0]}/${counts.silver[1]} · Bronze ${counts.bronze[0]}/${counts.bronze[1]}`;
}

function trophyRow(trophy) {
  const li = document.createElement('li');
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'trophy-row' + (isEarned(store, trophy.name) ? ' earned' : '') + (trophy.id === selectedId ? ' selected' : '');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned(store, trophy.name);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('click', (event) => {
    event.stopPropagation();
    store = setEarned(store, trophy.name, box.checked);
    renderAll();
  });
  const main = document.createElement('div');
  const shown = spoilerMask(trophy, store);
  const name = document.createElement('div');
  name.className = 'trophy-name' + (shown.masked ? ' spoiler-name' : '');
  name.textContent = shown.name;
  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = shown.description;
  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  const gradeTag = document.createElement('span');
  gradeTag.className = `tag grade-${trophy.grade}`;
  gradeTag.textContent = gradeLabel(trophy.grade);
  tags.append(gradeTag);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = kindLabel(trophy.kind);
  if (trophy.kind !== 'platinum') tags.append(kindTag);
  if (trophy.missable) {
    const miss = document.createElement('span');
    miss.className = 'tag missable';
    miss.textContent = 'Missable';
    tags.append(miss);
  }
  if (trophy.hidden) {
    const hid = document.createElement('span');
    hid.className = 'tag hidden-note';
    hid.textContent = 'Hidden on PSN';
    tags.append(hid);
  }
  main.append(name, desc, tags);
  const count = document.createElement('div');
  count.className = 'trophy-count';
  count.textContent = countTarget(trophy);
  row.append(box, main, count);
  row.addEventListener('click', () => {
    selectedId = trophy.id;
    renderDetail();
    renderList();
    location.hash = `#/trophy/${trophy.id}`;
  });
  li.append(row);
  return li;
}

function renderList() {
  const shown = filterTrophies(data.trophies, store, currentFilters());
  listEl.replaceChildren(...shown.map(trophyRow));
  const earned = store.earned.length;
  const parts = [`Showing ${shown.length} of ${data.trophies.length} trophies`, `· ${earned} earned`];
  if (currentFilters().kind === 'online') parts.push('· there are no online trophies in GTA VI — every trophy is single-player and offline');
  listMeta.textContent = parts.join(' ');
}

function sourceLine(key) {
  const source = data.sources[key];
  if (!source) return key;
  return { name: source.name, url: source.url, what: source.what };
}

function renderDetail() {
  detailPane.replaceChildren();
  const trophy = data.trophies.find((t) => t.id === selectedId);
  if (!trophy) {
    const empty = document.createElement('div');
    empty.className = 'detail-card detail-empty';
    empty.innerHTML = '<h2>Pick a trophy</h2><p>Select any trophy on the left to read its guide here — what to do, where and how, when it can be missed, and where each fact comes from.</p><p>The guide is written for this entry. Trophy names, descriptions and grades are shown as PlayStation publishes them.</p>';
    detailPane.append(empty);
    return;
  }
  const card = document.createElement('div');
  card.className = 'detail-card';
  const shown = spoilerMask(trophy, store);
  if (trophy.missable) {
    const banner = document.createElement('p');
    banner.className = 'missable-banner';
    banner.textContent = 'Potentially missable — do this in Chapter 1, before the chapter ends.';
    card.append(banner);
  }
  if (trophy.id === 49 || trophy.id === 51) {
    const note = document.createElement('p');
    note.className = 'unconfirmed-note';
    note.textContent = 'Method not yet confirmed by any source — this guide says so instead of guessing.';
    card.append(note);
  }
  const title = document.createElement('h2');
  title.textContent = shown.name;
  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = shown.description;
  const meta = document.createElement('div');
  meta.className = 'detail-meta';
  const gradeTag = document.createElement('span');
  gradeTag.className = `tag grade-${trophy.grade}`;
  gradeTag.textContent = gradeLabel(trophy.grade);
  meta.append(gradeTag);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = kindLabel(trophy.kind);
  if (trophy.kind !== 'platinum') meta.append(kindTag);
  const target = countTarget(trophy);
  if (target) {
    const targetTag = document.createElement('span');
    targetTag.className = 'tag';
    targetTag.textContent = target;
    meta.append(targetTag);
  }
  const guide = document.createElement('div');
  guide.className = 'detail-guide';
  for (const paragraph of trophy.guide.split('\n')) {
    if (!paragraph.trim()) continue;
    const p = document.createElement('p');
    p.textContent = paragraph;
    guide.append(p);
  }
  const actions = document.createElement('div');
  actions.className = 'detail-actions';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.textContent = isEarned(store, trophy.name) ? 'Mark as not earned' : 'Mark as earned';
  toggle.addEventListener('click', () => {
    store = setEarned(store, trophy.name, !isEarned(store, trophy.name));
    renderAll();
  });
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'secondary';
  clear.textContent = 'Close guide';
  clear.addEventListener('click', () => {
    selectedId = null;
    location.hash = '#/checklist';
    renderAll();
  });
  actions.append(toggle, clear);
  const sources = document.createElement('div');
  sources.className = 'sources';
  const sourcesTitle = document.createElement('h3');
  sourcesTitle.textContent = 'Sources';
  const list = document.createElement('ul');
  for (const key of trophy.sources || []) {
    const item = document.createElement('li');
    const info = sourceLine(key);
    if (typeof info === 'string') {
      item.textContent = info;
    } else {
      const link = document.createElement('a');
      link.href = info.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = info.name;
      item.append(link, document.createTextNode(` — ${info.what}`));
    }
    list.append(item);
  }
  const own = document.createElement('li');
  own.textContent = 'Guide text: written for this entry, in its own words, from the sources above. Where a method is not yet confirmed, the guide says so.';
  list.append(own);
  sources.append(sourcesTitle, list);
  card.append(title, desc, meta, guide, actions, sources);
  detailPane.append(card);
}

function renderAbout() {
  const view = views.about;
  view.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = 'Sources & about this guide';
  view.append(heading);
  const about = document.createElement('p');
  about.textContent = 'Leonida Platinum covers the 55 PlayStation 5 trophies of Grand Theft Auto VI: every official name, description and grade, a checklist saved in your browser, filters by kind and grade, a spoiler setting that hides story trophies until earned, export and import of progress, a four-stage roadmap to the platinum, and a guide to each trophy that names its sources.';
  view.append(about);
  const sourcesTitle = document.createElement('h3');
  sourcesTitle.textContent = 'Where each fact comes from';
  view.append(sourcesTitle);
  const list = document.createElement('ul');
  list.className = 'source-list';
  for (const key of Object.keys(data.sources)) {
    const info = data.sources[key];
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = info.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = info.name;
    item.append(link, document.createTextNode(` — ${info.what}.`));
    list.append(item);
  }
  view.append(list);
  const notes = document.createElement('div');
  notes.className = 'note-box';
  notes.innerHTML = '<h3>Honesty note — launch-era information</h3><p>GTA VI released on 19 November 2026, a day before this guide was written. The trophy names, descriptions, grades and counts come from the official list as Exophase and PSNProfiles carried it on 18 November 2026, and the methods come from PowerPyx\u2019s trophy guide and roadmap of the same date, cross-checked against GTABase where the two agree. Two trophies (Bad Luck, I Guess and Ten Pin) have no confirmed method yet, and one (Positive Mental Attitude) is only possibly missable — this guide marks those plainly instead of inventing steps. Where PowerPyx says a detail is unconfirmed, this guide says so too.</p>';
  view.append(notes);
  const offline = document.createElement('div');
  offline.className = 'fact-box';
  offline.innerHTML = '<h3>Offline by design</h3><p>This guide is static files under app/ and makes no network request at run time. Your progress lives in this browser\u2019s localStorage and is never sent anywhere. Export writes a JSON file you own; import reads one back. The source links above open only when you follow them.</p>';
  view.append(offline);
}

function showView(name) {
  for (const [key, el] of Object.entries(views)) {
    if (key === 'checklist') {
      el.hidden = name !== 'checklist';
    } else {
      el.hidden = name !== key;
    }
  }
  toolbar.style.display = name === 'checklist' ? '' : 'none';
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === name);
  });
  if (name === 'roadmap') renderRoadmap(views.roadmap, data, store, selectTrophy);
  if (name === 'missables') renderMissables(views.missables, data, store, selectTrophy);
  if (name === 'about') renderAbout();
}

function selectTrophy(id) {
  selectedId = id;
  location.hash = `#/trophy/${id}`;
  renderAll();
  // On a narrow screen the detail pane sits below the list; bring it into view.
  if (window.innerWidth <= 900) detailPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function route() {
  const hash = location.hash || '#/checklist';
  const trophyMatch = hash.match(/^#\/trophy\/(\d+)$/);
  if (trophyMatch) {
    selectedId = Number(trophyMatch[1]);
    showView('checklist');
    renderAll();
    return;
  }
  const view = hash.replace(/^#\//, '');
  showView(['roadmap', 'missables', 'about'].includes(view) ? view : 'checklist');
  renderAll();
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
}

function wireToolbar() {
  searchBox.value = filters.query;
  kindFilter.value = filters.kind;
  gradeFilter.value = filters.grade;
  missableOnly.checked = filters.missableOnly;
  hideEarned.checked = filters.hideEarned;
  spoilerToggle.checked = store.spoilersHidden;

  searchBox.addEventListener('input', () => { filters.query = searchBox.value; renderList(); });
  kindFilter.addEventListener('change', () => { filters.kind = kindFilter.value; renderList(); });
  gradeFilter.addEventListener('change', () => { filters.grade = gradeFilter.value; renderList(); });
  missableOnly.addEventListener('change', () => { filters.missableOnly = missableOnly.checked; renderList(); });
  hideEarned.addEventListener('change', () => {
    filters.hideEarned = hideEarned.checked;
    store = { ...store, hideEarned: hideEarned.checked };
    saveStore(store);
    renderList();
  });
  spoilerToggle.addEventListener('change', () => {
    store = { ...store, spoilersHidden: spoilerToggle.checked };
    saveStore(store);
    renderAll();
  });
  document.getElementById('exportBtn').addEventListener('click', () => exportProgress(store));
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const earned = await importProgressFile(file);
      const known = new Set(data.trophies.map((t) => t.name));
      store = { ...store, earned: earned.filter((n) => known.has(n)) };
      saveStore(store);
      renderAll();
    } catch (error) {
      alert(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies and settings?')) return;
    store = { earned: [], spoilersHidden: true, hideEarned: false };
    saveStore(store);
    filters.hideEarned = false;
    hideEarned.checked = false;
    spoilerToggle.checked = true;
    selectedId = null;
    renderAll();
  });
}

async function boot() {
  const response = await fetch('data/trophies.json');
  data = await response.json();
  wireToolbar();
  window.addEventListener('hashchange', route);
  route();
}

boot().catch((error) => {
  listMeta.textContent = `Could not load the trophy list: ${error.message}`;
});
