// A small SM-2 style scheduler. Each quiz card has its own review state.

export interface CardState {
  reps: number;
  lapses: number;
  ease: number;
  /** Days until the next review. */
  interval: number;
  /** Epoch ms when the card is next due. */
  due: number;
  lastCorrect: boolean;
  lastSeen: number;
}

const DAY = 24 * 60 * 60 * 1000;

export function review(prev: CardState | undefined, correct: boolean, now = Date.now()): CardState {
  const s: CardState = prev ?? { reps: 0, lapses: 0, ease: 2.5, interval: 0, due: now, lastCorrect: false, lastSeen: now };
  if (!correct) {
    return {
      ...s,
      reps: 0,
      lapses: s.lapses + 1,
      ease: Math.max(1.3, s.ease - 0.2),
      interval: 0,
      // Wrong answers come back in about 10 minutes.
      due: now + 10 * 60 * 1000,
      lastCorrect: false,
      lastSeen: now,
    };
  }
  const reps = s.reps + 1;
  const interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(s.interval * s.ease);
  return {
    ...s,
    reps,
    ease: Math.min(3, s.ease + 0.05),
    interval,
    due: now + interval * DAY,
    lastCorrect: true,
    lastSeen: now,
  };
}

export function isDue(s: CardState | undefined, now = Date.now()): boolean {
  return !!s && s.due <= now;
}

/** 0..1 confidence for one card, used for pattern mastery. */
export function cardScore(s: CardState | undefined): number {
  if (!s) return 0;
  if (!s.lastCorrect) return 0.15;
  return Math.min(1, 0.4 + s.interval / 30);
}
