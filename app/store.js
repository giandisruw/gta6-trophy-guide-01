// Progress store: earned trophies and settings, saved in localStorage.
// Export writes a JSON file; import reads one back. Nothing leaves the browser.
export const STORE_KEY = 'leonida-platinum-v1';

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return freshStore();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return freshStore();
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter((n) => typeof n === 'string') : [],
      spoilersHidden: parsed.spoilersHidden !== false,
      hideEarned: parsed.hideEarned === true,
    };
  } catch {
    return freshStore();
  }
}

export function freshStore() {
  return { earned: [], spoilersHidden: true, hideEarned: false };
}

export function saveStore(store) {
  try {
    // Keep the earned list sorted so exports are stable and diffable.
    const ordered = { ...store, earned: [...store.earned].sort() };
    localStorage.setItem(STORE_KEY, JSON.stringify(ordered));
  } catch {
    // Private mode or a full store: progress just does not persist.
  }
}

export function isEarned(store, trophyName) {
  return store.earned.includes(trophyName);
}

export function setEarned(store, trophyName, earned) {
  const next = store.earned.filter((n) => n !== trophyName);
  if (earned) next.push(trophyName);
  const updated = { ...store, earned: next };
  saveStore(updated);
  return updated;
}

export function exportProgress(store) {
  const blob = new Blob([JSON.stringify({ app: 'leonida-platinum', version: 1, earned: store.earned }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-platinum-progress.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function importProgressFile(file) {
  return file.text().then((text) => {
    const parsed = JSON.parse(text);
    const earned = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(earned) || !earned.every((n) => typeof n === 'string')) {
      throw new Error('That file does not look like a Leonida Platinum export.');
    }
    return earned;
  });
}

export function countByGrade(trophies, store) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    if (!counts[t.grade]) continue;
    counts[t.grade][1] += 1;
    if (isEarned(store, t.name)) counts[t.grade][0] += 1;
  }
  return counts;
}
