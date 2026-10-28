import { arrayPatterns } from './patterns-arrays';
import { treePatterns } from './patterns-trees';
import { graphPatterns } from './patterns-graphs';
import { dpPatterns } from './patterns-dp';
import type { Pattern, Quiz } from './types';

export const patterns: Pattern[] = [...arrayPatterns, ...treePatterns, ...graphPatterns, ...dpPatterns];

export const patternById = new Map(patterns.map((p) => [p.id, p]));

export interface QuizRef {
  quiz: Quiz;
  pattern: Pattern;
}

export const quizById = new Map<string, QuizRef>(
  patterns.flatMap((pattern) => pattern.quizzes.map((quiz) => [quiz.id, { quiz, pattern }] as const)),
);

export * from './types';
