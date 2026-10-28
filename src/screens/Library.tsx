import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Icon } from '@astryxdesign/core/Icon';
import { Text } from '@astryxdesign/core/Text';
import { categoryLabel, patterns, quizById, type Category, type Pattern } from '../data';
import { ChevronRightIcon } from '../components/icons';
import { Code, TabBar, TopBar } from '../components/ui';
import { navigate } from '../lib/router';
import { useAppState } from '../lib/store';

const CATEGORIES: Category[] = ['arrays', 'trees', 'graphs', 'dp'];

export function CheatSheets() {
  return (
    <>
      <main className="screen screen--tabbed">
        <Heading level={1}>Cheat sheets</Heading>
        {CATEGORIES.map((c) => (
          <section key={c} className="stack-1" aria-label={categoryLabel[c]}>
            <h2 className="eyebrow" style={{ margin: 0 }}>
              {categoryLabel[c]}
            </h2>
            <div className="list">
              {patterns
                .filter((p) => p.category === c)
                .map((p) => (
                  <button key={p.id} className="tap list__item" onClick={() => navigate({ name: 'cheat', id: p.id })}>
                    <div className="grow stack-1" style={{ gap: 0 }}>
                      <span className="list__title">{p.name}</span>
                      <span className="list__sub">
                        {p.time} · {p.signal}
                      </span>
                    </div>
                    <Icon icon={ChevronRightIcon} size="md" color="secondary" />
                  </button>
                ))}
            </div>
          </section>
        ))}
      </main>
      <TabBar current="cheats" />
    </>
  );
}

export function CheatSheet({ pattern }: { pattern: Pattern }) {
  return (
    <main className="screen">
      <TopBar title="Cheat sheet" back={{ name: 'cheats' }} />
      <div className="stack-2">
        <Heading level={1} type="display-3">
          {pattern.name}
        </Heading>
        <div className="row row--wrap">
          <span className="chip">Time {pattern.time}</span>
          <span className="chip">Space {pattern.space}</span>
        </div>
      </div>
      <section className="stack-2">
        <span className="eyebrow">Signals</span>
        <ul className="prose-list stack-1">
          {pattern.signals.map((s) => (
            <li key={s}>
              <Text type="body">{s}</Text>
            </li>
          ))}
        </ul>
      </section>
      <Code code={pattern.template} />
      <section className="stack-2">
        <span className="eyebrow">Pitfalls</span>
        <ul className="prose-list stack-1">
          {pattern.pitfalls.map((p) => (
            <li key={p}>
              <Text type="body">{p}</Text>
            </li>
          ))}
        </ul>
      </section>
      <section className="stack-2">
        <span className="eyebrow">Classic problems</span>
        <Text type="body" color="secondary">
          {pattern.problems.join(' · ')}
        </Text>
      </section>
      <Button label="Open full lesson" variant="secondary" size="lg" width="100%" onClick={() => navigate({ name: 'lesson', id: pattern.id })} />
    </main>
  );
}

export function Mistakes() {
  const state = useAppState();
  const items = state.mistakes.map((id) => quizById.get(id)).filter((r) => !!r);

  return (
    <>
      <main className="screen screen--tabbed">
        <div className="stack-1">
          <Heading level={1}>Mistakes</Heading>
          <Text type="body" color="secondary">
            Cards you got wrong. They leave this list once you answer them right.
          </Text>
        </div>
        {items.length ? (
          <>
            <Button label={`Review ${items.length} ${items.length === 1 ? 'card' : 'cards'}`} variant="primary" size="lg" width="100%" onClick={() => navigate({ name: 'drill', mode: 'mistakes' })} />
            <div className="list">
              {items.map(({ quiz, pattern }) => (
                <div key={quiz.id} className="list__item stack-1" style={{ gap: 0, justifyContent: 'center' }}>
                  <span className="supporting">{pattern.name}</span>
                  <span className="list__title" style={{ fontWeight: 500 }}>
                    {quiz.prompt}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="panel stack-2">
            <Heading level={2}>No mistakes yet</Heading>
            <Text type="body" color="secondary">
              Wrong answers from lessons and drills land here so you can go back to them.
            </Text>
          </div>
        )}
      </main>
      <TabBar current="mistakes" />
    </>
  );
}
