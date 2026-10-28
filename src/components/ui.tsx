import { useMemo, useState, type ReactNode } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Heading } from '@astryxdesign/core/Heading';
import type { Quiz } from '../data';
import { recordAnswer } from '../lib/store';
import { shuffleOptions } from '../lib/session';
import { CheckIcon, ChevronLeftIcon, GridIcon, HomeIcon, RetryIcon, XIcon } from './icons';
import { navigate, type Route } from '../lib/router';

const RING_C = 2 * Math.PI * 13;

export function MasteryRing({ pct }: { pct: number }) {
  return (
    <div className="row" style={{ gap: 'var(--spacing-2)' }} aria-label={`Mastery ${pct} percent`}>
      <span className="supporting tabular" style={{ fontWeight: 500 }}>
        {pct}%
      </span>
      <svg className="ring" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <circle className="ring__track" cx="16" cy="16" r="13" fill="none" strokeWidth="3.5" />
        <circle
          className="ring__fill"
          cx="16"
          cy="16"
          r="13"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform="rotate(-90 16 16)"
          strokeDasharray={`${((RING_C * pct) / 100).toFixed(1)} ${RING_C.toFixed(1)}`}
        />
      </svg>
    </div>
  );
}

export function MasteryOrNew({ pct, started }: { pct: number; started: boolean }) {
  if (!started) return <Badge variant="cyan" label="New" />;
  return <MasteryRing pct={pct} />;
}

export function Segments({ total, done }: { total: number; done: number }) {
  return (
    <div className="segments" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} data-on={i < done} />
      ))}
    </div>
  );
}

export function TopBar({ title, meta, back = { name: 'today' }, children }: { title: string; meta?: string; back?: Route; children?: ReactNode }) {
  return (
    <div className="row">
      <IconButton label="Back" variant="secondary" size="lg" icon={<Icon icon={ChevronLeftIcon} size="md" />} onClick={() => navigate(back)} />
      <div className="grow stack-1">
        <div className="row row--between">
          <span className="eyebrow" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </span>
          {meta && <span className="supporting tabular">{meta}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Code({ code }: { code: string }) {
  const parts = code.split('____');
  return (
    <pre className="code">
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <mark>____</mark>}
        </span>
      ))}
    </pre>
  );
}

const KIND_LABEL: Record<Quiz['kind'], string> = {
  spot: 'Spot the pattern',
  concept: 'Check your understanding',
  predict: 'Predict the next step',
  fill: 'Fill the gap',
  complexity: 'Complexity check',
};

export function QuizCard({ quiz, onAnswered, framed = true }: { quiz: Quiz; onAnswered?: (correct: boolean) => void; framed?: boolean }) {
  const { options, answer } = useMemo(() => shuffleOptions(quiz.options, quiz.answer), [quiz]);
  const [choice, setChoice] = useState<number | null>(null);
  const answered = choice !== null;
  const right = choice === answer;

  const pick = (i: number) => {
    if (answered) return;
    setChoice(i);
    recordAnswer(quiz.id, i === answer);
    onAnswered?.(i === answer);
  };

  return (
    <section className={framed ? 'panel stack-3' : 'stack-3'} aria-label="Quiz">
      <span className="eyebrow">{KIND_LABEL[quiz.kind]}</span>
      <Heading level={3} accessibilityLevel={2}>
        {quiz.prompt}
      </Heading>
      {quiz.code && <Code code={quiz.code} />}
      <div className="stack-2" role="radiogroup" aria-label="Answers">
        {options.map((o, i) => {
          const state = !answered ? undefined : i === answer ? 'right' : i === choice ? 'wrong' : undefined;
          return (
            <button key={o} className="option" role="radio" aria-checked={choice === i} data-state={state} disabled={answered && i !== choice && i !== answer} onClick={() => pick(i)}>
              <span className="option__key">{state === 'right' ? <Icon icon={CheckIcon} size="xsm" /> : state === 'wrong' ? <Icon icon={XIcon} size="xsm" /> : String.fromCharCode(65 + i)}</span>
              <span className="grow">{o}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={right ? 'feedback feedback--right' : 'feedback feedback--wrong'} aria-live="polite">
          <Icon icon={right ? CheckIcon : XIcon} size="md" />
          <div className="stack-1">
            <strong>{right ? 'Correct' : 'Not quite'}</strong>
            <span>{quiz.explain}</span>
          </div>
        </div>
      )}
    </section>
  );
}

const TABS = [
  { name: 'today', label: 'Today', icon: HomeIcon },
  { name: 'cheats', label: 'Cheat sheets', icon: GridIcon },
  { name: 'mistakes', label: 'Mistakes', icon: RetryIcon },
] as const;

export function TabBar({ current }: { current: 'today' | 'cheats' | 'mistakes' }) {
  return (
    <nav className="tabbar" aria-label="Main">
      <div className="tabbar__inner">
        {TABS.map((t) => (
          <button key={t.name} className="tab" aria-current={current === t.name ? 'page' : undefined} onClick={() => navigate({ name: t.name })}>
            <span className="tab__icon">
              <Icon icon={t.icon} size="lg" />
            </span>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
