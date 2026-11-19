// Checklist filters: kind, grade, search text, missable-only and hide-earned.
// The spoiler rule lives here too: while spoilers are hidden, a story trophy
// the player has not earned shows a placeholder name and description.
import { isEarned } from './store.js';

export function filterTrophies(trophies, store, filters) {
  const query = (filters.query || '').trim().toLowerCase();
  // There are no online trophies in GTA VI: the "online" kind matches nothing.
  if (filters.kind === 'online') return [];
  return trophies.filter((t) => {
    if (filters.kind === 'missable' && !t.missable) return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.missableOnly && !t.missable) return false;
    if (filters.hideEarned && isEarned(store, t.name)) return false;
    if (query) {
      const haystack = `${t.name} ${t.description} ${t.guide} ${t.kind}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function spoilerMask(trophy, store) {
  const hidden = store.spoilersHidden && trophy.kind === 'story' && !isEarned(store, trophy.name);
  if (!hidden) return { name: trophy.name, description: trophy.description, masked: false };
  return {
    name: 'Hidden story trophy — earn it to reveal',
    description: 'Story trophy. Its name and description stay hidden until you earn it.',
    masked: true,
  };
}

export function kindLabel(kind) {
  const labels = {
    platinum: 'Platinum',
    story: 'Story',
    completion: 'Completion',
    activity: 'Activity',
    side: 'Side quest',
    collectible: 'Collectible',
    robbery: 'Robbery',
    exploration: 'Exploration',
    misc: 'Miscellaneous',
  };
  return labels[kind] || kind;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function countTarget(trophy) {
  if (trophy.count == null) return '';
  if (trophy.count === 250000) return 'Target: $250,000';
  if (trophy.count === 100000) return 'Target: $100,000';
  return `Target: ${trophy.count}`;
}
