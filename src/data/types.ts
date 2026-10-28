export type Category = 'arrays' | 'trees' | 'graphs' | 'dp';

export type QuizKind = 'spot' | 'concept' | 'predict' | 'fill' | 'complexity';

export interface Quiz {
  id: string;
  kind: QuizKind;
  prompt: string;
  /** Optional code shown under the prompt. A blank to fill is written as `____`. */
  code?: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explain: string;
}

export type VizId = 'two-pointers' | 'sliding-window' | 'fast-slow' | 'mono-stack' | 'tree-bfs' | 'dp-1d';

export interface Pattern {
  id: string;
  name: string;
  category: Category;
  /** One-line recognition hint shown in lists. */
  signal: string;
  summary: string;
  signals: string[];
  /** Short steps of the idea, used when there is no animation. */
  steps: string[];
  template: string;
  time: string;
  space: string;
  pitfalls: string[];
  problems: string[];
  viz?: VizId;
  quizzes: Quiz[];
}

export const categoryLabel: Record<Category, string> = {
  arrays: 'Arrays and strings',
  trees: 'Lists and trees',
  graphs: 'Graphs and search',
  dp: 'Dynamic programming',
};
