import { useEffect, useMemo } from 'react';
import { patternById, quizById } from './data';
import { planDrill } from './lib/session';
import { useRoute } from './lib/router';
import { getState, useAppState } from './lib/store';
import { Today } from './screens/Today';
import { Lesson } from './screens/Lesson';
import { Drill } from './screens/Drill';
import { CheatSheet, CheatSheets, Mistakes } from './screens/Library';
import { Settings } from './screens/Settings';

export function App() {
  const route = useRoute();
  const { theme } = useAppState();

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'system') delete html.dataset.theme;
    else html.dataset.theme = theme;
  }, [theme]);

  // A drill's card list is fixed when it starts, so answering doesn't reshuffle it.
  const drillKey = route.name === 'drill' ? `${route.mode}:${location.hash}` : null;
  const drillIds = useMemo(() => {
    if (route.name !== 'drill') return [];
    const s = getState();
    return route.mode === 'mistakes' ? s.mistakes.filter((id) => quizById.has(id)) : planDrill(s).ids;
  }, [drillKey]);

  let screen;
  switch (route.name) {
    case 'lesson': {
      const p = patternById.get(route.id);
      screen = p ? <Lesson key={p.id} pattern={p} /> : <Today />;
      break;
    }
    case 'cheat': {
      const p = patternById.get(route.id);
      screen = p ? <CheatSheet pattern={p} /> : <CheatSheets />;
      break;
    }
    case 'drill':
      screen = <Drill key={drillKey} ids={drillIds} title={route.mode === 'mistakes' ? 'Mistakes review' : 'Daily drill'} />;
      break;
    case 'cheats':
      screen = <CheatSheets />;
      break;
    case 'mistakes':
      screen = <Mistakes />;
      break;
    case 'settings':
      screen = <Settings />;
      break;
    default:
      screen = <Today />;
  }

  return <div className="app">{screen}</div>;
}
