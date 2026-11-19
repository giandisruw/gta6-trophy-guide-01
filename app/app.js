// Leonida Platinum — GTA VI trophy guide & tracker.
// Offline static app: the only thing it fetches is data/trophies.json, a file
// under app/. Progress lives in localStorage; export/import is a JSON file.
const KEY = 'leonida-platinum-progress-v1';
const SOURCES = {
  Exophase: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  PSNProfiles: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  PowerPyx: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  'Output Lag': 'https://outputlag.com/guides/gta-6-trophy-list/',
  KeenGamer: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/',
  'GTA Zone': 'https://gta-zone.com/news/gta-6-trophies-achievements/',
};
const SOURCE_NOTES = {
  Exophase: 'Official trophy list — every name, description and grade, as listed before launch.',
  PSNProfiles: 'Official trophy list with PSN progress targets (counts such as 42 Shooting Range challenges).',
  PowerPyx: 'GTA 6 Trophy Guide & Roadmap (18 Nov 2026) — difficulty 4/10, ~200 hours, roadmap, the one potentially missable trophy.',
  'Output Lag': 'GTA 6 Trophy List (18 Nov 2026) — visible vs hidden split, unlock methods, save advice.',
  KeenGamer: 'GTA 6 Trophy Guide & Platinum Roadmap — all 55 trophies, roadmap and missable note.',
  'GTA Zone': 'GTA 6 Trophy List — the 55 names cross-checked against PowerPyx, GTABase and others.',
};
const KINDS = [
  ['all', 'All kinds'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectible', 'Collectibles'],
  ['activity', 'Activities'],
  ['side', 'Side stories'],
  ['feat', 'Feats'],
];
// Demo seed used only for the maker's screenshots (?demo=1): 13 earned, as the
// house guides' screenshots seed progress. Normal visitors never see it.
const DEMO_EARNED = [2, 3, 4, 8, 10, 15, 16, 19, 21, 33, 35, 42, 53];

const params = new URLSearchParams(location.search);
let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));

const rowsEl = document.getElementById('rows');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoilers');
const detailEl = document.getElementById('detail');
const hintEl = document.getElementById('listHint');
const kindEl = document.getElementById('kindChips');
let trophies = [];
let kind = 'all';
let selected = null;

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
// Resolve the demo seed now that names are known.
if (params.get('demo') === '1') {
  earned = new Set(DEMO_EARNED.map((id) => trophies.find((t) => t.id === id).name));
}

const byId = new Map(trophies.map((t) => [t.id, t]));
const nameOf = (id) => byId.get(id)?.name;

function save() { localStorage.setItem(KEY, JSON.stringify([...earned])); }

function gradeLabel(t) { return t.grade.charAt(0).toUpperCase() + t.grade.slice(1); }
function kindLabel(k) { return k === 'side' ? 'Side story' : k.charAt(0).toUpperCase() + k.slice(1); }

function spoilerHidden(t) {
  return spoilerEl.checked && t.hidden && !earned.has(t.name);
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind === 'missable') { if (!t.missable) return false; }
    else if (kind !== 'all' && t.kind !== kind) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${t.kind}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderKinds() {
  kindEl.replaceChildren();
  for (const [value, label] of KINDS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = value === 'missable'
      ? `${label} (1)`
      : `${label} (${value === 'all' ? trophies.length : trophies.filter((t) => t.kind === value).length})`;
    b.classList.toggle('active', kind === value);
    b.addEventListener('click', () => { kind = value; renderKinds(); render(); });
    kindEl.append(b);
  }
}

function render() {
  const list = visibleTrophies();
  const earnedCount = earned.size;
  document.getElementById('earnedCount').textContent = earnedCount;
  document.getElementById('barFill').style.width = `${Math.round((earnedCount / trophies.length) * 100)}%`;
  document.getElementById('progressText').textContent =
    `${earnedCount} of ${trophies.length} earned · ${Math.round((earnedCount / trophies.length) * 100)}% to the Platinum`;
  hintEl.textContent = `Showing ${list.length} of ${trophies.length} trophies` +
    (spoilerEl.checked ? ' · story spoilers hidden until earned' : ' · spoilers shown') +
    ` · ${earnedCount} earned`;
  rowsEl.replaceChildren();
  for (const t of list) {
    const tr = document.createElement('tr');
    tr.classList.toggle('earned-row', earned.has(t.name));
    tr.classList.toggle('selected', selected === t.id);
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'earn';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      save(); render();
    });
    const c0 = document.createElement('td'); c0.className = 'c'; c0.append(box); tr.append(c0);
    const c1 = document.createElement('td');
    const nm = document.createElement('div'); nm.className = 'tname';
    if (spoilerHidden(t)) {
      nm.textContent = 'Hidden story trophy — earn it to reveal';
      const tag = document.createElement('span'); tag.className = 'hidden-tag'; tag.textContent = 'HIDDEN';
      nm.append(tag);
      const ds = document.createElement('div'); ds.className = 'tdesc';
      const sp = document.createElement('span'); sp.className = 'spoiled'; sp.textContent = 'Name and description hidden by the spoiler setting.';
      ds.append(sp); c1.append(nm, ds);
    } else {
      nm.textContent = t.name;
      if (t.hidden) {
        const tag = document.createElement('span'); tag.className = 'hidden-tag'; tag.textContent = 'HIDDEN';
        nm.append(tag);
      }
      const ds = document.createElement('div'); ds.className = 'tdesc'; ds.textContent = t.description;
      c1.append(nm, ds);
    }
    tr.append(c1);
    const c2 = document.createElement('td');
    const g = document.createElement('span'); g.className = `grade-badge ${t.grade}`; g.textContent = gradeLabel(t);
    c2.append(g); tr.append(c2);
    const c3 = document.createElement('td');
    const k = document.createElement('span'); k.className = 'kind-tag';
    k.textContent = (t.missable ? '⚠ Missable · ' : '') + kindLabel(t.kind);
    c3.append(k); tr.append(c3);
    tr.addEventListener('click', () => { selected = t.id; render(); renderDetail(); });
    rowsEl.append(tr);
  }
}

function renderDetail() {
  const t = byId.get(selected);
  if (!t) {
    detailEl.replaceChildren();
    const h = document.createElement('h3'); h.textContent = 'Your progress'; detailEl.append(h);
    const p = document.createElement('p');
    p.textContent = `${earned.size} of ${trophies.length} trophies earned (${Math.round((earned.size / trophies.length) * 100)}% to the Platinum).`;
    detailEl.append(p);
    const ul = document.createElement('ul');
    for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
      const total = trophies.filter((x) => x.grade === g).length;
      const got = trophies.filter((x) => x.grade === g && earned.has(x.name)).length;
      const li = document.createElement('li'); li.textContent = `${gradeLabel({ grade: g })}: ${got} of ${total} earned`;
      ul.append(li);
    }
    detailEl.append(ul);
    const next = trophies.find((x) => x.stage === 1 && !earned.has(x.name));
    if (next) {
      const h2 = document.createElement('h4'); h2.textContent = 'Next up'; detailEl.append(h2);
      const np = document.createElement('p');
      np.textContent = `${next.name} — ${next.description} Select any trophy in the list to read its guide, steps and sources.`;
      detailEl.append(np);
    } else {
      const h2 = document.createElement('h4'); h2.textContent = 'Tip'; detailEl.append(h2);
      const np = document.createElement('p');
      np.textContent = 'Select any trophy in the list to read its guide, steps and sources.';
      detailEl.append(np);
    }
    return;
  }
  detailEl.replaceChildren();
  const h = document.createElement('h3');
  h.textContent = spoilerHidden(t) ? 'Hidden story trophy' : t.name;
  detailEl.append(h);
  const meta = document.createElement('div'); meta.className = 'meta';
  const g = document.createElement('span'); g.className = `grade-badge ${t.grade}`; g.textContent = gradeLabel(t);
  meta.append(g);
  const k = document.createElement('span'); k.className = 'kind-tag'; k.textContent = kindLabel(t.kind);
  meta.append(k);
  if (t.hidden) { const hd = document.createElement('span'); hd.className = 'kind-tag'; hd.textContent = 'Hidden on PlayStation until earned'; meta.append(hd); }
  if (t.target) { const tg = document.createElement('span'); tg.className = 'target'; tg.textContent = `PSN target: ${t.target}`; meta.append(tg); }
  detailEl.append(meta);
  const off = document.createElement('p'); off.className = 'official';
  off.textContent = spoilerHidden(t)
    ? 'Official name and description hidden by the spoiler setting. Earn it in-game to reveal.'
    : `Official description: “${t.description}”`;
  detailEl.append(off);
  if (t.missable) {
    const m = document.createElement('div'); m.className = 'miss';
    const s = document.createElement('strong'); s.textContent = '⚠ Potentially missable. ';
    m.append(s, document.createTextNode(t.missable_note ?? ''));
    detailEl.append(m);
  }
  const unconfirmed = /not yet confirmed|unconfirmed/i.test(t.guide);
  if (unconfirmed) {
    const u = document.createElement('div'); u.className = 'unconfirmed';
    u.textContent = 'Method not yet confirmed at launch — this guide says so rather than inventing one. Check the sources below for updates.';
    detailEl.append(u);
  }
  const gh = document.createElement('h4'); gh.textContent = 'Guide'; detailEl.append(gh);
  const gp = document.createElement('p'); gp.textContent = spoilerHidden(t) ? 'Hidden until earned.' : t.guide; detailEl.append(gp);
  if (!spoilerHidden(t) && t.steps?.length) {
    const sh = document.createElement('h4'); sh.textContent = 'Steps'; detailEl.append(sh);
    const ol = document.createElement('ol');
    for (const s of t.steps) { const li = document.createElement('li'); li.textContent = s; ol.append(li); }
    detailEl.append(ol);
  }
  const sh2 = document.createElement('h4'); sh2.textContent = 'Sources'; detailEl.append(sh2);
  const sp = document.createElement('p'); sp.className = 'src';
  sp.append(document.createTextNode('Name, description, grade and PSN target: Exophase and PSNProfiles. Guide: '));
  t.sources.forEach((name, i) => {
    if (i > 0) sp.append(document.createTextNode(' · '));
    const a = document.createElement('a');
    a.href = SOURCES[name]; a.textContent = name; a.target = '_blank'; a.rel = 'noopener';
    sp.append(a);
  });
  sp.append(document.createTextNode('. All guides are this entry’s own words; sources are cited, never copied.'));
  detailEl.append(sp);
  const done = document.createElement('button');
  done.type = 'button';
  done.textContent = earned.has(t.name) ? '✓ Earned — mark as not earned' : 'Mark as earned';
  done.addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name); else earned.add(t.name);
    save(); render(); renderDetail();
  });
  detailEl.append(done);
}

function renderRoadmap() {
  const stage1 = trophies.filter((t) => t.stage === 1);
  const stage3 = trophies.filter((t) => t.stage === 3);
  const ul1 = document.getElementById('stage1List');
  const ul3 = document.getElementById('stage3List');
  const fill = (ul, list, note) => {
    ul.replaceChildren();
    for (const t of list) {
      const li = document.createElement('li');
      const b = document.createElement('strong'); b.textContent = t.name;
      li.append(b, document.createTextNode(` — ${t.description}`));
      ul.append(li);
    }
    if (note) { const li = document.createElement('li'); li.textContent = note; ul.append(li); }
  };
  fill(ul1, stage1, 'Plus during the story: scan vehicles and study animals as you travel, try each activity type once, and meditate whenever the game offers it.');
  fill(ul3, stage3, 'Then the Platinum, Vice Got a Price!, pops on the last trophy.');
}

function renderSources() {
  const ul = document.getElementById('sourceList');
  ul.replaceChildren();
  for (const [name, url] of Object.entries(SOURCES)) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url; a.textContent = name; a.target = '_blank'; a.rel = 'noopener';
    li.append(a, document.createTextNode(` — ${SOURCE_NOTES[name]}`));
    ul.append(li);
  }
}

function switchView(view) {
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== `view-${view}`; });
  if (view === 'roadmap') renderRoadmap();
  if (view === 'sources') renderSources();
}
document.querySelectorAll('.tabs button').forEach((b) => {
  b.addEventListener('click', () => switchView(b.dataset.view));
});

searchEl.addEventListener('input', render);
gradeEl.addEventListener('change', render);
spoilerEl.addEventListener('change', render);

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ app: 'leonida-platinum', version: 1, earned: [...earned] }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => valid.has(n)));
    save(); render(); renderDetail();
  } catch { alert('That file is not a valid progress export.'); }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) { earned = new Set(); selected = null; save(); render(); renderDetail(); }
});

renderKinds();
render();
renderDetail();
renderRoadmap();
renderSources();
const openId = Number(params.get('open'));
if (openId && byId.has(openId)) { selected = openId; render(); renderDetail(); }
const view = params.get('view');
if (view && ['checklist', 'roadmap', 'missables', 'sources'].includes(view)) switchView(view);
if (params.get('spoilers') === 'off') { spoilerEl.checked = false; render(); }
