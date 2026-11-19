// Leonida Platinum — the tracker. Plain ES module, no dependencies.
// Loads data/trophies.json (the app's only request), keeps earned trophies in
// localStorage, and renders the checklist, the detail pane, the roadmap and the
// missables view. ?demo=1 seeds 13 earned trophies for screenshots only.

const SAVE_KEY = 'leonida-platinum-v2';
const DEMO_EARNED = [2, 3, 8, 15, 16, 19, 20, 21, 32, 35, 42, 53, 55];

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const trophies = (await (await fetch('data/trophies.json')).json()).trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

let earned = new Set(JSON.parse(localStorage.getItem(SAVE_KEY) ?? '[]'));
if (params.get('demo') === '1' && !localStorage.getItem(SAVE_KEY)) {
  earned = new Set(DEMO_EARNED);
}
let selectedId = Number(params.get('open') ?? 0) || trophies[0].id;
if (!byId.has(selectedId)) selectedId = trophies[0].id;

function persist() {
  localStorage.setItem(SAVE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function isMasked(t) {
  return $('spoiler').checked && t.hidden && !earned.has(t.id);
}

function gradeLabel(t) {
  return t.grade[0].toUpperCase() + t.grade.slice(1);
}

function targetChip(t) {
  if (t.target == null) return '';
  return `<span class="chip">Target: ${t.target}</span>`;
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.id)).length;
  $('earnedCount').textContent = done;
  $('progressFill').style.width = `${(done / total) * 100}%`;
  $('progressBar').setAttribute('aria-valuenow', String(done));
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const have = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    const all = trophies.filter((t) => t.grade === g).length;
    return `${gradeLabel({ grade: g })} ${have}/${all}`;
  });
  $('gradeCounts').textContent = parts.join(' · ') + ` · ${Math.round((done / total) * 100)}% of the list`;
}

function rowHtml(t) {
  const masked = isMasked(t);
  const name = masked ? 'Hidden trophy' : t.name;
  const desc = masked ? 'Earn this trophy to reveal its name and description.' : t.description;
  return `<article class="row${earned.has(t.id) ? ' earned' : ''}${t.id === selectedId ? ' selected' : ''}" data-id="${t.id}" tabindex="0" role="button" aria-pressed="${earned.has(t.id)}">
    <input type="checkbox" ${earned.has(t.id) ? 'checked' : ''} aria-label="Earned: ${masked ? 'hidden trophy' : t.name}" data-check="${t.id}">
    <span class="grade grade-${t.grade}" title="${gradeLabel(t)}">${t.grade === 'platinum' ? 'P' : t.grade === 'gold' ? 'G' : t.grade === 'silver' ? 'S' : 'B'}</span>
    <span class="rowtext"><strong>${name}</strong><span class="desc">${desc}</span></span>
    <span class="tags"><span class="kind">${t.kind}</span>${t.missable ? '<span class="missable">Missable</span>' : ''}${targetChip(t)}</span>
  </article>`;
}

function visibleTrophies() {
  const q = $('search').value.trim().toLowerCase();
  const kind = $('kind').value;
  const grade = $('grade').value;
  return trophies.filter((t) => {
    if (kind === 'missable') {
      if (!t.missable) return false;
    } else if (kind !== 'all' && t.kind !== kind) {
      return false;
    }
    if (grade !== 'all' && t.grade !== grade) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderList() {
  const list = visibleTrophies();
  $('list').innerHTML = list.map(rowHtml).join('') ||
    '<p class="empty">No trophies match those filters. Clear the search or widen the filters.</p>';
  $('shownLine').textContent = `Showing ${list.length} of ${trophies.length} trophies` +
    ($('spoiler').checked ? ' · hidden trophies masked until earned' : ' · hidden trophies shown');
}

function renderDetail() {
  const t = byId.get(selectedId);
  const masked = isMasked(t);
  const sourceLinks = t.sources.map((s) => `<li><a href="${s.url}">${s.name}</a></li>`).join('');
  $('detail').innerHTML = masked
    ? `<h2>Hidden trophy</h2>
       <p class="official">This is a hidden trophy. Its name, description and guide stay masked while
       the spoiler setting is on. Earn it in the game — or switch the spoiler setting off —
       to reveal it.</p>
       <p><span class="gradeword grade-${t.grade}">${gradeLabel(t)}</span> <span class="kind">${t.kind}</span></p>
       <button type="button" data-toggle="${t.id}">${earned.has(t.id) ? 'Mark as not earned' : 'Mark as earned'}</button>`
    : `<p class="kindline"><span class="gradeword grade-${t.grade}">${gradeLabel(t)}</span>
       <span class="kind">${t.kind}</span>${t.missable ? '<span class="missable">Missable</span>' : ''}${t.hidden ? '<span class="chip">Hidden on PSN</span>' : ''}</p>
       <h2>${t.name}</h2>
       <p class="official">“${t.description}”</p>
       ${targetChip(t)}
       <h3>How to earn it</h3>
       <p>${t.guide}</p>
       <ol>${t.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
       <h3>Sources</h3>
       <ul class="sources">${sourceLinks}</ul>
       <button type="button" data-toggle="${t.id}">${earned.has(t.id) ? 'Mark as not earned' : 'Mark as earned'}</button>`;
}

const STAGES = [
  { n: 1, title: 'Stage 1 — Play the story', hours: '60–80 hours', text: 'Chapters 1 to 4 and the final mission, in order. Finish the missions, try the side activities as they unlock, and — most important — do Lucia’s balcony meditation in Chapter 1 for Positive Mental Attitude before that chapter ends. Keep a manual save at the start of every chapter.' },
  { n: 2, title: 'Stage 2 — The 100% checklist', hours: 'About 100 hours', text: 'After the credits, open Progress, then Stats, then 100% Completion. Work the checklist in free-roam: challenges, stunts, vehicle scans, animal studies, collectibles and the money trophies. The thresholds are forgiving — 70 of 80 challenges, 200 of 277 vehicles — so skip the hardest bits.' },
  { n: 3, title: 'Stage 3 — Side stories & cleanup', hours: 'About 10 hours', text: 'The stranger strands that count toward Strangers & Freaks, the partner trophies, the robbery feats, and the five trophies whose method no guide has confirmed yet. The Platinum pops here, at the end.' },
];

function renderRoadmap() {
  $('stages').innerHTML = STAGES.map((s) => {
    const members = trophies.filter((t) => t.stage === s.n);
    const done = members.filter((t) => earned.has(t.id)).length;
    const shown = members.filter((t) => !isMasked(t));
    const hiddenCount = members.length - shown.length;
    const items = shown.map((t) =>
      `<li class="${earned.has(t.id) ? 'done' : ''}">${t.name} <span>(${gradeLabel(t)})</span></li>`).join('') +
      (hiddenCount ? `<li class="masked-note">…and ${hiddenCount} more hidden trophies — masked while the spoiler setting is on</li>` : '');
    return `<article class="stage"><h3>${s.title} <span class="hours">${s.hours}</span></h3>
      <p>${s.text}</p>
      <p class="stagecount">${done} / ${members.length} earned in this stage</p>
      <ul class="stagelist">${items}</ul></article>`;
  }).join('');
}

function renderMissables() {
  const pma = byId.get(28);
  $('missableCards').innerHTML = `<article class="card danger">
    <h3>Positive Mental Attitude — the one missable</h3>
    <p>${pma.guide}</p>
    <ol>${pma.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
    <p class="sourcesline">Sources: ${pma.sources.map((s) => `<a href="${s.url}">${s.name}</a>`).join(' · ')}</p>
  </article>`;
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
  renderMissables();
}

function showView(name) {
  for (const v of ['checklist', 'roadmap', 'missables', 'sources']) {
    $(`view-${v}`).hidden = v !== name;
    $(`tab-${v}`).classList.toggle('active', v === name);
  }
}

function viewFromHash() {
  const name = location.hash.replace('#', '');
  return ['checklist', 'roadmap', 'missables', 'sources'].includes(name) ? name : 'checklist';
}

// --- events ---
$('list').addEventListener('click', (e) => {
  const check = e.target.closest('[data-check]');
  if (check) {
    const id = Number(check.dataset.check);
    if (check.checked) earned.add(id); else earned.delete(id);
    persist();
    renderAll();
    return;
  }
  const row = e.target.closest('.row');
  if (row) {
    selectedId = Number(row.dataset.id);
    renderList();
    renderDetail();
  }
});
$('list').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.classList.contains('row')) {
    selectedId = Number(e.target.dataset.id);
    renderList();
    renderDetail();
  }
});
$('detail').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-toggle]');
  if (!btn) return;
  const id = Number(btn.dataset.toggle);
  if (earned.has(id)) earned.delete(id); else earned.add(id);
  persist();
  renderAll();
});
for (const id of ['search', 'kind', 'grade', 'spoiler']) {
  $(id).addEventListener('input', () => renderAll());
}
$('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const next = new Set(ids.filter((id) => byId.has(Number(id))).map(Number));
    earned = next;
    persist();
    renderAll();
  } catch {
    alert('That file is not valid Leonida Platinum progress JSON.');
  }
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    persist();
    renderAll();
  }
});
addEventListener('hashchange', () => showView(viewFromHash()));

showView(viewFromHash());
renderAll();
