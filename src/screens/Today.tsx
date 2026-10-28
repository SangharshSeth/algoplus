import { useMemo, useState } from 'react';
import { Heading } from '@astryxdesign/core/Heading';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { patternById, patterns, type Category } from '../data';
import { CogIcon, ChevronRightIcon, PlayIcon } from '../components/icons';
import { MasteryOrNew, TabBar } from '../components/ui';
import { isStarted, mastery, planDrill } from '../lib/session';
import { navigate } from '../lib/router';
import { useAppState } from '../lib/store';

const FILTERS: { value: 'all' | Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'arrays', label: 'Arrays' },
  { value: 'trees', label: 'Trees' },
  { value: 'graphs', label: 'Graphs' },
  { value: 'dp', label: 'DP' },
];

export function Today() {
  const state = useAppState();
  const [filter, setFilter] = useState<'all' | Category>('all');
  const plan = useMemo(() => planDrill(state), [state]);
  const rows = patterns.filter((p) => filter === 'all' || p.category === filter);
  const last = state.lastLesson ? patternById.get(state.lastLesson) : undefined;
  const lastIndex = last ? (state.lessons[last.id] ?? 0) : 0;
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <main className="screen screen--tabbed">
        <div className="row row--between" style={{ alignItems: 'flex-start' }}>
          <div className="stack-1">
            <span className="supporting">{date}</span>
            <Heading level={1}>Today</Heading>
          </div>
          <IconButton label="Settings" variant="secondary" size="lg" icon={<Icon icon={CogIcon} size="md" />} onClick={() => navigate({ name: 'settings' })} />
        </div>

        <section className="hero" aria-label="Daily drill">
          <div className="stack-1">
            <span className="eyebrow" style={{ color: 'inherit', opacity: 0.75 }}>
              Daily drill
            </span>
            {plan.ids.length ? (
              <>
                <span style={{ fontSize: 'var(--text-display-3-size)', lineHeight: 'var(--text-display-3-leading)', fontWeight: 600 }}>{plan.ids.length} cards</span>
                <span className="hero__muted">About {Math.max(1, Math.round(plan.ids.length * 0.6))} minutes. Mixed patterns, no hints.</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 'var(--text-display-3-size)', lineHeight: 'var(--text-display-3-leading)', fontWeight: 600 }}>All caught up</span>
                <span className="hero__muted">Nothing is due. Open a pattern to learn something new.</span>
              </>
            )}
          </div>
          {plan.ids.length > 0 && (
            <div className="row row--wrap">
              {plan.due > 0 && <span className="hero__chip">{plan.due} due</span>}
              {plan.fresh > 0 && <span className="hero__chip">{plan.fresh} new</span>}
              {plan.fromMistakes > 0 && <span className="hero__chip">{plan.fromMistakes} from mistakes</span>}
            </div>
          )}
          <button className="hero__cta" disabled={!plan.ids.length} onClick={() => navigate({ name: 'drill', mode: 'daily' })}>
            <Icon icon={PlayIcon} size="sm" />
            Start drill
          </button>
        </section>

        {last && (
          <button className="tap card-link" onClick={() => navigate({ name: 'lesson', id: last.id })}>
            <div className="grow stack-1" style={{ gap: 0 }}>
              <span className="supporting">Continue lesson</span>
              <span className="list__title">
                {last.name} · card {lastIndex + 1} of 5
              </span>
            </div>
            <Icon icon={ChevronRightIcon} size="md" color="secondary" />
          </button>
        )}

        <section className="stack-3" aria-label="Patterns">
          <div className="row row--between row--baseline">
            <Heading level={2}>Patterns</Heading>
            <span className="supporting">
              {rows.length} {rows.length === 1 ? 'pattern' : 'patterns'}
            </span>
          </div>
          <div className="seg-tight">
          <SegmentedControl label="Filter patterns" value={filter} onChange={(v) => setFilter(v as 'all' | Category)} layout="fill" size="lg">
            {FILTERS.map((f) => (
              <SegmentedControlItem key={f.value} value={f.value} label={f.label} />
            ))}
          </SegmentedControl>
          </div>
          <div className="list">
            {rows.map((p) => (
              <button key={p.id} className="tap list__item" onClick={() => navigate({ name: 'lesson', id: p.id })}>
                <div className="grow stack-1" style={{ gap: 0 }}>
                  <span className="list__title">{p.name}</span>
                  <span className="list__sub">{p.signal}</span>
                </div>
                <MasteryOrNew pct={mastery(p, state)} started={isStarted(p, state)} />
              </button>
            ))}
          </div>
        </section>
      </main>
      <TabBar current="today" />
    </>
  );
}
