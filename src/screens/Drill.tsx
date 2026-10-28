import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { quizById } from '../data';
import { QuizCard, Segments, TopBar } from '../components/ui';
import { navigate } from '../lib/router';

export function Drill({ ids, title }: { ids: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const answered = results.length > index;
  const finished = index >= ids.length;

  if (!ids.length) {
    return (
      <main className="screen">
        <TopBar title={title} />
        <div className="panel stack-2">
          <Heading level={2}>Nothing to drill</Heading>
          <Text type="body" color="secondary">
            You are all caught up. Open a pattern from Today to learn something new.
          </Text>
        </div>
      </main>
    );
  }

  if (finished) {
    const right = results.filter(Boolean).length;
    const missed = [...new Set(ids.filter((_, i) => !results[i]).map((id) => quizById.get(id)!.pattern.name))];
    return (
      <main className="screen">
        <TopBar title={title} meta="Done">
          <Segments total={ids.length} done={ids.length} />
        </TopBar>
        <div className="stack-2">
          <Heading level={1} type="display-3">
            {right} of {ids.length} right
          </Heading>
          <Text type="body" color="secondary" as="p">
            {missed.length ? 'Missed cards come back in about 10 minutes and stay in Mistakes until you get them right.' : 'Clean run. Those cards will space out further.'}
          </Text>
        </div>
        {missed.length > 0 && (
          <section className="panel stack-2">
            <Heading level={3} accessibilityLevel={2}>
              Worth a second look
            </Heading>
            <div className="row row--wrap">
              {missed.map((m) => (
                <span key={m} className="chip">
                  {m}
                </span>
              ))}
            </div>
          </section>
        )}
        <div style={{ flex: '1 1 auto' }} />
        <Button label="Back to today" variant="primary" size="lg" width="100%" onClick={() => navigate({ name: 'today' })} />
      </main>
    );
  }

  const ref = quizById.get(ids[index])!;

  return (
    <main className="screen">
      <TopBar title={title} meta={`${index + 1} of ${ids.length}`}>
        <Segments total={ids.length} done={index + (answered ? 1 : 0)} />
      </TopBar>
      <QuizCard key={ref.quiz.id} quiz={ref.quiz} framed={false} onAnswered={(c) => setResults((r) => [...r, c])} />
      {answered && (
        <button className="tap card-link" onClick={() => navigate({ name: 'lesson', id: ref.pattern.id })}>
          <div className="grow stack-1" style={{ gap: 0 }}>
            <span className="supporting">Pattern</span>
            <span className="list__title">{ref.pattern.name}</span>
          </div>
          <span className="supporting">Open lesson</span>
        </button>
      )}
      <div style={{ flex: '1 1 auto' }} />
      <div className="sticky-footer">
        <Button label={index + 1 === ids.length ? 'See results' : 'Next card'} variant="primary" size="lg" width="100%" isDisabled={!answered} onClick={() => setIndex((i) => i + 1)} />
      </div>
    </main>
  );
}
