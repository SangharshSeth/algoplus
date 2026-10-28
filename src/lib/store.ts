import { useSyncExternalStore } from 'react';
import { review, type CardState } from './srs';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppState {
  version: 1;
  cards: Record<string, CardState>;
  /** Quiz ids answered wrong and not yet answered right since. */
  mistakes: string[];
  /** Last lesson card index viewed, per pattern. */
  lessons: Record<string, number>;
  lastLesson?: string;
  theme: ThemeMode;
}

const KEY = 'algoplus:v1';

function empty(): AppState {
  return { version: 1, cards: {}, mistakes: [], lessons: {}, theme: 'system' };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

let state: AppState = load();
const listeners = new Set<() => void>();

function set(next: AppState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: keep working in memory.
  }
  listeners.forEach((l) => l());
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export function getState(): AppState {
  return state;
}

export function recordAnswer(quizId: string, correct: boolean) {
  const mistakes = correct ? state.mistakes.filter((id) => id !== quizId) : [quizId, ...state.mistakes.filter((id) => id !== quizId)];
  set({ ...state, cards: { ...state.cards, [quizId]: review(state.cards[quizId], correct) }, mistakes });
}

export function setLessonProgress(patternId: string, index: number) {
  set({ ...state, lessons: { ...state.lessons, [patternId]: index }, lastLesson: patternId });
}

export function setTheme(theme: ThemeMode) {
  set({ ...state, theme });
}

export function exportState(): string {
  return JSON.stringify(state, null, 2);
}

export function importState(json: string) {
  const parsed = JSON.parse(json);
  if (!parsed || parsed.version !== 1 || typeof parsed.cards !== 'object') {
    throw new Error('This file is not an AlgoPlus backup.');
  }
  set({ ...empty(), ...parsed });
}

export function resetState() {
  set({ ...empty(), theme: state.theme });
}
