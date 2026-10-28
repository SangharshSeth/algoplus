import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'today' }
  | { name: 'cheats' }
  | { name: 'mistakes' }
  | { name: 'settings' }
  | { name: 'lesson'; id: string }
  | { name: 'cheat'; id: string }
  | { name: 'drill'; mode: 'daily' | 'mistakes' };

export function parse(hash: string): Route {
  const [, a, b] = hash.replace(/^#/, '').split('/');
  switch (a) {
    case 'cheats':
      return { name: 'cheats' };
    case 'mistakes':
      return { name: 'mistakes' };
    case 'settings':
      return { name: 'settings' };
    case 'lesson':
      return b ? { name: 'lesson', id: b } : { name: 'today' };
    case 'cheat':
      return b ? { name: 'cheat', id: b } : { name: 'cheats' };
    case 'drill':
      return { name: 'drill', mode: b === 'mistakes' ? 'mistakes' : 'daily' };
    default:
      return { name: 'today' };
  }
}

export function toHash(r: Route): string {
  switch (r.name) {
    case 'today':
      return '#/';
    case 'lesson':
    case 'cheat':
      return `#/${r.name}/${r.id}`;
    case 'drill':
      return `#/drill/${r.mode}`;
    default:
      return `#/${r.name}`;
  }
}

export function navigate(r: Route) {
  const hash = toHash(r);
  if (location.hash !== hash) location.hash = hash;
  window.scrollTo(0, 0);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(
    (l) => {
      window.addEventListener('hashchange', l);
      return () => window.removeEventListener('hashchange', l);
    },
    () => location.hash,
  );
  return parse(hash);
}
