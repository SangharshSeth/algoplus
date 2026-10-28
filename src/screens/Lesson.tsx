import { useEffect, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { categoryLabel, type Pattern } from '../data';
import { Code, QuizCard, Segments, TopBar } from '../components/ui';
import { vizById } from '../viz/vizzes';
import { navigate } from '../lib/router';
import { setLessonProgress, useAppState } from '../lib/store';

const CARDS = ['Overview', 'How it runs', 'Template', 'Check yourself', 'Practice'] as const;

export function Lesson({ pattern }: { pattern: Pattern }) {
  const state = useAppState();
  const [index, setIndex] = useState(() => Math.min(state.lessons[pattern.id] ?? 0, CARDS.length - 1));

  useEffect(() => {
    setLessonProgress(pattern.id, index);
    window.scrollTo(0, 0);
  }, [pattern.id, index]);

  const isLast = index === CARDS.length - 1;

  return (
    <main className="screen">
      <TopBar title={categoryLabel[pattern.category]} meta={`Card ${index + 1} of ${CARDS.length}`}>
        <Segments total={CARDS.length} done={index + 1} />
      </TopBar>

      <div className="stack-2">
        <Heading level={1} type="display-3">
          {pattern.name}
        </Heading>
        <Text type="body" color="secondary" as="p">
          {pattern.summary}
        </Text>
      </div>

      {index === 0 && <Overview pattern={pattern} />}
      {index === 1 && <HowItRuns pattern={pattern} />}
      {index === 2 && <Template pattern={pattern} />}
      {index === 3 && <CheckYourself pattern={pattern} />}
      {index === 4 && <Practice pattern={pattern} />}

      <div style={{ flex: '1 1 auto' }} />

      <div className="sticky-footer btn-row">
        <Button label="Back" variant="secondary" size="lg" isDisabled={index === 0} onClick={() => setIndex((i) => i - 1)} />
        <Button
          label={isLast ? 'Finish' : `Next: ${CARDS[index + 1].toLowerCase()}`}
          variant="primary"
          size="lg"
          onClick={() => {
            if (isLast) {
              setLessonProgress(pattern.id, 0);
              navigate({ name: 'today' });
            } else setIndex((i) => i + 1);
          }}
        />
      </div>
    </main>
  );
}

function Overview({ pattern }: { pattern: Pattern }) {
  return (
    <section className="stack-2" aria-label="Signals">
      <span className="eyebrow">Reach for it when you see</span>
      <div className="row row--wrap">
        {pattern.signals.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>
      <div className="panel stack-2" style={{ marginTop: 'var(--spacing-3)' }}>
        <Heading level={3} accessibilityLevel={2}>
          The idea in {pattern.steps.length} steps
        </Heading>
        <ol className="prose-list stack-2">
          {pattern.steps.map((s) => (
            <li key={s}>
              <Text type="body">{s}</Text>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function HowItRuns({ pattern }: { pattern: Pattern }) {
  if (pattern.viz) {
    const Viz = vizById[pattern.viz];
    return <Viz />;
  }
  return (
    <section className="panel stack-3" aria-label="Walkthrough">
      <Heading level={3} accessibilityLevel={2}>
        Walk through it
      </Heading>
      <ol className="prose-list stack-3">
        {pattern.steps.map((s) => (
          <li key={s}>
            <Text type="body">{s}</Text>
          </li>
        ))}
      </ol>
      <span className="supporting">An animation for this pattern is coming in a later version.</span>
    </section>
  );
}

function Template({ pattern }: { pattern: Pattern }) {
  return (
    <section className="stack-3" aria-label="Template">
      <div className="row row--between row--baseline">
        <Heading level={3} accessibilityLevel={2}>
          Template
        </Heading>
        <span className="supporting">Python</span>
      </div>
      <Code code={pattern.template} />
      <div className="row row--wrap">
        <span className="chip">Time {pattern.time}</span>
        <span className="chip">Space {pattern.space}</span>
      </div>
      <div className="panel stack-2">
        <Heading level={4} accessibilityLevel={3}>
          Pitfalls
        </Heading>
        <ul className="prose-list stack-2">
          {pattern.pitfalls.map((p) => (
            <li key={p}>
              <Text type="body">{p}</Text>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CheckYourself({ pattern }: { pattern: Pattern }) {
  const quizzes = pattern.quizzes.filter((q) => q.kind !== 'spot').slice(0, 2);
  return (
    <div className="stack-4">
      {quizzes.map((q) => (
        <QuizCard key={q.id} quiz={q} />
      ))}
    </div>
  );
}

function Practice({ pattern }: { pattern: Pattern }) {
  return (
    <section className="panel stack-3" aria-label="Practice problems">
      <Heading level={3} accessibilityLevel={2}>
        Try these on your own
      </Heading>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }} className="stack-2">
        {pattern.problems.map((p) => (
          <li key={p} className="row" style={{ minHeight: 32 }}>
            <span className="option__key" aria-hidden="true">
              ·
            </span>
            <Text type="body">{p}</Text>
          </li>
        ))}
      </ul>
      <span className="supporting">Your quiz answers for this pattern now show up in your daily drill.</span>
    </section>
  );
}
