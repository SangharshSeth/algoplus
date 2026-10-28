import { patterns, quizById, type Pattern } from '../data';
import { cardScore, isDue } from './srs';
import type { AppState } from './store';

export function mastery(pattern: Pattern, state: AppState): number {
  const total = pattern.quizzes.reduce((sum, q) => sum + cardScore(state.cards[q.id]), 0);
  return Math.round((100 * total) / pattern.quizzes.length);
}

export function isStarted(pattern: Pattern, state: AppState): boolean {
  return pattern.quizzes.some((q) => state.cards[q.id]) || state.lessons[pattern.id] !== undefined;
}

export interface DrillPlan {
  ids: string[];
  due: number;
  fresh: number;
  fromMistakes: number;
}

const MAX_DUE = 6;
const MAX_NEW = 4;
const MAX_MISTAKES = 2;

/** Builds today's drill: due reviews first, then a few past mistakes, then new cards. */
export function planDrill(state: AppState, now = Date.now()): DrillPlan {
  const all = patterns.flatMap((p) => p.quizzes.map((q) => q.id));
  const due = all
    .filter((id) => isDue(state.cards[id], now) && !state.mistakes.includes(id))
    .sort((a, b) => state.cards[a].due - state.cards[b].due)
    .slice(0, MAX_DUE);
  const fromMistakes = state.mistakes.filter((id) => quizById.has(id)).slice(0, MAX_MISTAKES);

  // New cards: prefer patterns already started, and spot-the-pattern cards from anywhere,
  // so the drill trains recognition across the whole library.
  const unseen = all.filter((id) => !state.cards[id]);
  const started = unseen.filter((id) => isStarted(quizById.get(id)!.pattern, state));
  const spot = unseen.filter((id) => quizById.get(id)!.quiz.kind === 'spot');
  const fresh: string[] = [];
  for (const id of [...started, ...spot, ...unseen]) {
    if (fresh.length >= MAX_NEW) break;
    if (!fresh.includes(id)) fresh.push(id);
  }

  return { ids: shuffle([...due, ...fromMistakes, ...fresh]), due: due.length, fresh: fresh.length, fromMistakes: fromMistakes.length };
}

export function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffles answer options and returns where the right one went. */
export function shuffleOptions(options: string[], answer: number): { options: string[]; answer: number } {
  const order = shuffle(options.map((_, i) => i));
  return { options: order.map((i) => options[i]), answer: order.indexOf(answer) };
}
