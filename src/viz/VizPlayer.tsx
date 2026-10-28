import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Icon } from '@astryxdesign/core/Icon';
import { CheckIcon, PauseIcon, PlayIcon } from '../components/icons';

export interface Frame {
  text: string;
  chip?: string;
  done?: boolean;
}

interface Props<F extends Frame> {
  frames: F[];
  legend?: string;
  label: (frame: F) => string;
  children: (frame: F) => ReactNode;
  viewBox: string;
}

const STEP_MS = 900;

export function VizPlayer<F extends Frame>({ frames, legend, label, children, viewBox }: Props<F>) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const last = frames.length - 1;
  const frame = frames[step];

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setStep((s) => {
        if (s + 1 >= last) setPlaying(false);
        return Math.min(last, s + 1);
      });
    }, STEP_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, last]);

  const togglePlay = () => {
    if (playing) return setPlaying(false);
    if (step >= last) setStep(0);
    setPlaying(true);
  };

  return (
    <section className="panel stack-3" aria-label="Animation">
      <div className="row row--between row--baseline">
        <Heading level={3} accessibilityLevel={2}>
          Watch it run
        </Heading>
        <span className="supporting tabular">
          Step {step} of {last}
        </span>
      </div>

      <svg className="viz" viewBox={viewBox} role="img" aria-label={label(frame)}>
        {children(frame)}
      </svg>

      {(frame.chip || legend) && (
        <div className="row row--wrap">
          {frame.chip && <span className="chip chip--progress tabular">{frame.chip}</span>}
          {legend && <span className="supporting">{legend}</span>}
        </div>
      )}

      <div className={frame.done ? 'status status--done' : 'status'} aria-live="polite">
        {frame.done && <Icon icon={CheckIcon} size="md" />}
        <span>{frame.text}</span>
      </div>

      <div className="btn-row">
        <Button
          label="Reset"
          variant="secondary"
          size="lg"
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        />
        <Button
          label="Step"
          variant="secondary"
          size="lg"
          isDisabled={step >= last}
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(last, s + 1));
          }}
        />
        <Button
          label={playing ? 'Pause' : step >= last ? 'Replay' : 'Play'}
          variant="primary"
          size="lg"
          icon={<Icon icon={playing ? PauseIcon : PlayIcon} size="sm" />}
          onClick={togglePlay}
        />
      </div>
    </section>
  );
}

/** A labelled pill marker centred on (0, 0), drawn above (dy < 0) or below a node. */
export function Pointer({ x, y, label, dy, tone }: { x: number; y: number; label: string; dy: number; tone: 'ink' | 'alt' }) {
  const w = Math.max(34, label.length * 7 + 12);
  return (
    <g className={`viz-move viz-ptr viz-ptr-${tone}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
      <rect x={-w / 2} y={dy - 9} width={w} height={18} rx={9} />
      <text x={0} y={dy}>
        {label}
      </text>
    </g>
  );
}

export function ArrowDefs() {
  return (
    <defs>
      <marker id="viz-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" className="viz-arrowhead" />
      </marker>
    </defs>
  );
}
