import type { ComponentType } from 'react';
import type { VizId } from '../data';
import { ArrowDefs, Pointer, VizPlayer, type Frame } from './VizPlayer';

/* ---------- Two pointers: pair sum in a sorted array ---------- */

const TP_NUMS = [1, 3, 4, 6, 8, 11];
const TP_TARGET = 10;

interface TpFrame extends Frame {
  l: number;
  r: number;
  found: boolean;
}

function twoPointerFrames(): TpFrame[] {
  const frames: TpFrame[] = [];
  let l = 0;
  let r = TP_NUMS.length - 1;
  frames.push({ l, r, found: false, text: `Target is ${TP_TARGET}. left starts at the smallest value, right at the largest.` });
  while (l < r) {
    const s = TP_NUMS[l] + TP_NUMS[r];
    if (s === TP_TARGET) {
      frames.push({ l, r, found: true, done: true, chip: `${TP_NUMS[l]} + ${TP_NUMS[r]} = ${s}`, text: `${TP_NUMS[l]} + ${TP_NUMS[r]} = ${TP_TARGET}. Pair found.` });
      break;
    }
    const chip = `${TP_NUMS[l]} + ${TP_NUMS[r]} = ${s}`;
    if (s < TP_TARGET) {
      l++;
      frames.push({ l, r, found: false, chip, text: `${s} is less than ${TP_TARGET}, so drop ${TP_NUMS[l - 1]} and move left forward.` });
    } else {
      r--;
      frames.push({ l, r, found: false, chip, text: `${s} is more than ${TP_TARGET}, so drop ${TP_NUMS[r + 1]} and move right back.` });
    }
  }
  return frames;
}

const TP_FRAMES = twoPointerFrames();

const tpCx = (i: number) => 33 + i * 52;

function TwoPointersViz() {
  return (
    <VizPlayer
      frames={TP_FRAMES}
      viewBox="0 0 326 130"
      legend="Grey cells can no longer be part of the answer"
      label={(f) => `Sorted array ${TP_NUMS.join(', ')}. left on ${TP_NUMS[f.l]}, right on ${TP_NUMS[f.r]}.`}
    >
      {(f) => (
        <>
          {TP_NUMS.map((v, i) => {
            const s = f.found && (i === f.l || i === f.r) ? 'done' : i < f.l || i > f.r ? 'dim' : i === f.l || i === f.r ? 'active' : undefined;
            return (
              <g key={i}>
                <rect className="viz-cell viz-fade" data-s={s} x={tpCx(i) - 22} y={43} width={44} height={44} rx={10} />
                <text className="viz-label" data-s={s} x={tpCx(i)} y={65}>
                  {v}
                </text>
              </g>
            );
          })}
          <Pointer x={tpCx(f.l)} y={65} dy={-40} label="left" tone="ink" />
          <Pointer x={tpCx(f.r)} y={65} dy={40} label="right" tone="alt" />
        </>
      )}
    </VizPlayer>
  );
}

/* ---------- Sliding window: longest substring without repeats ---------- */

const SW = 'abcabcbb';

interface SwFrame extends Frame {
  l: number;
  r: number;
}

function slidingFrames(): SwFrame[] {
  const frames: SwFrame[] = [{ l: 0, r: -1, text: `Find the longest run of "${SW}" with no repeated letter.`, chip: 'Best: 0' }];
  const seen = new Map<string, number>();
  let l = 0;
  let best = 0;
  let bestWin = '';
  for (let r = 0; r < SW.length; r++) {
    const ch = SW[r];
    const prev = seen.get(ch);
    let text: string;
    if (prev !== undefined && prev >= l) {
      l = prev + 1;
      text = `"${ch}" is already in the window, so left jumps past it to ${l}.`;
    } else {
      text = `Add "${ch}". No repeat, so the window grows.`;
    }
    seen.set(ch, r);
    if (r - l + 1 > best) {
      best = r - l + 1;
      bestWin = SW.slice(l, r + 1);
    }
    frames.push({ l, r, text, chip: `Best: ${best} · "${bestWin}"` });
  }
  frames.push({ ...frames[frames.length - 1], done: true, text: `Done. The longest window is "${bestWin}", length ${best}.` });
  return frames;
}

const SW_FRAMES = slidingFrames();

const swX = (i: number) => 6 + i * 40;

function SlidingWindowViz() {
  return (
    <VizPlayer
      frames={SW_FRAMES}
      viewBox="0 0 326 130"
      legend="Each letter enters and leaves once"
      label={(f) => (f.r < 0 ? `String ${SW}, empty window.` : `Window from ${f.l} to ${f.r}: ${SW.slice(f.l, f.r + 1)}.`)}
    >
      {(f) => (
        <>
          {SW.split('').map((ch, i) => {
            const s = f.r >= 0 && i >= f.l && i <= f.r ? 'active' : undefined;
            return (
              <g key={i}>
                <rect className="viz-cell viz-fade" data-s={s} x={swX(i)} y={48} width={34} height={34} rx={8} />
                <text className="viz-label" x={swX(i) + 17} y={65}>
                  {ch}
                </text>
              </g>
            );
          })}
          <rect
            className="viz-window viz-win"
            x={f.r < 0 ? swX(0) - 3 : swX(f.l) - 3}
            y={45}
            width={f.r < 0 ? 0 : swX(f.r) - swX(f.l) + 40}
            height={40}
            rx={10}
            opacity={f.r < 0 ? 0 : 1}
          />
          {f.r >= 0 && (
            <>
              <Pointer x={swX(f.r) + 17} y={65} dy={-40} label="right" tone="ink" />
              <Pointer x={swX(f.l) + 17} y={65} dy={40} label="left" tone="alt" />
            </>
          )}
        </>
      )}
    </VizPlayer>
  );
}

/* ---------- Fast and slow pointers: cycle detection ---------- */

const FS_NODES: [number, number][] = [
  [36, 110],
  [100, 110],
  [168, 110],
  [230, 48],
  [292, 110],
  [230, 172],
];
const FS_EDGES: [number, number, number, number][] = [
  [56, 110, 78, 110],
  [120, 110, 146, 110],
  [182.1, 95.9, 213, 65],
  [244.1, 62.1, 275, 93],
  [277.9, 124.1, 247, 155],
  [215.9, 157.9, 185, 127],
];

interface FsFrame extends Frame {
  s: number;
  f: number;
}

function fastSlowFrames(): FsFrame[] {
  const at = (i: number) => (i < 6 ? i : 2 + ((i - 2) % 4));
  const cyc = (i: number) => (i - 2 + 4) % 4;
  const msgs = [
    'Both pointers start at the head, node 1.',
    'slow moves to 2, fast jumps to 3.',
    'slow enters the cycle at 3, fast is already at 5.',
    'fast wraps around to 3, one node behind slow.',
    'They meet at node 5. The list has a cycle.',
  ];
  return msgs.map((text, step) => {
    const s = at(step);
    const f = at(2 * step);
    const gap = s >= 2 && f >= 2 ? (cyc(s) - cyc(f) + 4) % 4 : null;
    return { s, f, text, done: step === 4, chip: gap === null ? undefined : `Gap to close: ${gap}` };
  });
}

const FS_FRAMES = fastSlowFrames();

function FastSlowViz() {
  return (
    <VizPlayer
      frames={FS_FRAMES}
      viewBox="0 0 326 224"
      legend="slow +1 · fast +2 per step"
      label={(fr) => `Linked list 1 to 6 with node 6 pointing back to 3. slow at ${fr.s + 1}, fast at ${fr.f + 1}.`}
    >
      {(fr) => (
        <>
          <ArrowDefs />
          {FS_EDGES.map(([x1, y1, x2, y2], i) => (
            <line key={i} className="viz-edge" x1={x1} y1={y1} x2={x2} y2={y2} markerEnd="url(#viz-arrow)" />
          ))}
          <text className="viz-small" x={230} y={110}>
            cycle
          </text>
          {FS_NODES.map(([x, y], i) => (
            <g key={i}>
              <circle className="viz-cell viz-fade" data-s={fr.done && i === fr.s ? 'done' : i === fr.s || i === fr.f ? 'active' : undefined} cx={x} cy={y} r={18} />
              <text className="viz-label" x={x} y={y}>
                {i + 1}
              </text>
            </g>
          ))}
          <Pointer x={FS_NODES[fr.s][0]} y={FS_NODES[fr.s][1]} dy={-35} label="slow" tone="ink" />
          <Pointer x={FS_NODES[fr.f][0]} y={FS_NODES[fr.f][1]} dy={35} label="fast" tone="alt" />
        </>
      )}
    </VizPlayer>
  );
}

/* ---------- Monotonic stack: next greater element ---------- */

const MS_NUMS = [2, 1, 5, 3, 6];

interface MsFrame extends Frame {
  i: number;
  stack: number[];
  ans: (number | null)[];
}

function monoFrames(): MsFrame[] {
  const ans: (number | null)[] = MS_NUMS.map(() => null);
  const stack: number[] = [];
  const frames: MsFrame[] = [{ i: -1, stack: [], ans: [...ans], text: 'Scan left to right. The stack keeps values that are still waiting for something bigger.' }];
  MS_NUMS.forEach((x, i) => {
    const popped: number[] = [];
    while (stack.length && MS_NUMS[stack[stack.length - 1]] < x) {
      const j = stack.pop()!;
      ans[j] = x;
      popped.push(MS_NUMS[j]);
    }
    stack.push(i);
    const text = popped.length
      ? `${x} is bigger than ${popped.join(' and ')}, so pop ${popped.length > 1 ? 'them' : 'it'}: their next greater is ${x}. Push ${x}.`
      : `${x} is not bigger than the top, so push it and wait.`;
    frames.push({ i, stack: [...stack], ans: [...ans], text, chip: popped.length ? `Popped ${popped.length}` : undefined });
  });
  frames.push({ i: MS_NUMS.length, stack: [...stack], ans: ans.map((a) => a ?? -1), done: true, text: 'Done. Whatever is left on the stack has no greater element, so it gets -1.' });
  return frames;
}

const MS_FRAMES = monoFrames();

const msCx = (i: number) => 28 + i * 48;

function MonoStackViz() {
  return (
    <VizPlayer
      frames={MS_FRAMES}
      viewBox="0 0 326 226"
      legend="Each value is pushed once and popped at most once"
      label={(f) => `Array ${MS_NUMS.join(', ')}. Stack holds ${f.stack.map((j) => MS_NUMS[j]).join(', ') || 'nothing'}.`}
    >
      {(f) => (
        <>
          {MS_NUMS.map((v, i) => (
            <g key={i}>
              <rect className="viz-cell viz-fade" data-s={i === f.i ? 'active' : undefined} x={msCx(i) - 20} y={32} width={40} height={36} rx={8} />
              <text className="viz-label" x={msCx(i)} y={50}>
                {v}
              </text>
            </g>
          ))}
          {f.i >= 0 && f.i < MS_NUMS.length && <Pointer x={msCx(f.i)} y={50} dy={-36} label="i" tone="ink" />}
          <text className="viz-small" x={8} y={96} style={{ textAnchor: 'start' }}>
            next greater
          </text>
          {f.ans.map((a, i) => (
            <g key={i}>
              <rect className="viz-cell viz-fade" data-s={a !== null ? 'visited' : undefined} x={msCx(i) - 20} y={106} width={40} height={30} rx={8} />
              <text className="viz-label" x={msCx(i)} y={121} style={{ fontSize: 13 }}>
                {a === null ? '' : a}
              </text>
            </g>
          ))}
          <line className="viz-edge" x1={260} y1={206} x2={320} y2={206} />
          <text className="viz-small" x={290} y={218}>
            stack
          </text>
          {f.stack.map((j, k) => (
            <g key={j}>
              <rect className="viz-cell" data-s={k === f.stack.length - 1 ? 'active' : undefined} x={264} y={170 - k * 36} width={52} height={32} rx={8} />
              <text className="viz-label" x={290} y={186 - k * 36}>
                {MS_NUMS[j]}
              </text>
            </g>
          ))}
        </>
      )}
    </VizPlayer>
  );
}

/* ---------- Tree BFS: level order ---------- */

const TB_POS: Record<number, [number, number]> = {
  1: [163, 30],
  2: [93, 92],
  3: [233, 92],
  4: [58, 154],
  5: [128, 154],
  6: [268, 154],
};
const TB_CHILDREN: Record<number, number[]> = { 1: [2, 3], 2: [4, 5], 3: [6], 4: [], 5: [], 6: [] };
const TB_LEVEL: Record<number, number> = { 1: 0, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2 };

interface TbFrame extends Frame {
  queue: number[];
  visited: number[];
  current: number | null;
  levels: number[][];
}

function bfsFrames(): TbFrame[] {
  const frames: TbFrame[] = [{ queue: [1], visited: [], current: null, levels: [], text: 'Put the root in the queue.' }];
  const queue = [1];
  const visited: number[] = [];
  const levels: number[][] = [];
  while (queue.length) {
    const node = queue.shift()!;
    visited.push(node);
    const lvl = TB_LEVEL[node];
    if (!levels[lvl]) levels[lvl] = [];
    levels[lvl].push(node);
    queue.push(...TB_CHILDREN[node]);
    const kids = TB_CHILDREN[node];
    const endsLevel = !queue.some((q) => TB_LEVEL[q] === lvl);
    let text = `Pop ${node}${kids.length ? `, push ${kids.join(' and ')}` : ', no children'}.`;
    if (endsLevel) text += ` Level ${lvl + 1} is done: [${levels[lvl].join(', ')}].`;
    frames.push({ queue: [...queue], visited: [...visited], current: node, levels: levels.map((l) => [...l]), text, chip: `Levels: ${levels.map((l) => `[${l.join(', ')}]`).join(' ')}` });
  }
  frames.push({ ...frames[frames.length - 1], current: null, done: true, text: 'Queue is empty. Every level has been read in order.' });
  return frames;
}

const TB_FRAMES = bfsFrames();

function edgePoints(a: [number, number], b: [number, number], r = 18) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  return { x1: a[0] + (dx / len) * r, y1: a[1] + (dy / len) * r, x2: b[0] - (dx / len) * r, y2: b[1] - (dy / len) * r };
}

function TreeBfsViz() {
  return (
    <VizPlayer
      frames={TB_FRAMES}
      viewBox="0 0 326 226"
      legend="Dashed: waiting in the queue"
      label={(f) => `Binary tree. Queue holds ${f.queue.join(', ') || 'nothing'}.`}
    >
      {(f) => (
        <>
          {Object.entries(TB_CHILDREN).flatMap(([p, kids]) =>
            kids.map((k) => <line key={`${p}-${k}`} className="viz-edge" {...edgePoints(TB_POS[Number(p)], TB_POS[k])} />),
          )}
          {Object.entries(TB_POS).map(([id, [x, y]]) => {
            const n = Number(id);
            const s = n === f.current ? 'active' : f.queue.includes(n) ? 'queued' : f.visited.includes(n) ? 'visited' : undefined;
            return (
              <g key={id}>
                <circle className="viz-cell viz-fade" data-s={s} cx={x} cy={y} r={18} />
                <text className="viz-label" x={x} y={y}>
                  {id}
                </text>
              </g>
            );
          })}
          <text className="viz-small" x={8} y={205} style={{ textAnchor: 'start' }}>
            queue
          </text>
          {f.queue.map((n, k) => (
            <g key={n} className="viz-move" style={{ transform: `translate(${56 + k * 40}px, 190px)` }}>
              <rect className="viz-cell" data-s="queued" x={0} y={0} width={32} height={30} rx={8} />
              <text className="viz-label" x={16} y={15}>
                {n}
              </text>
            </g>
          ))}
        </>
      )}
    </VizPlayer>
  );
}

/* ---------- 1-D DP: house robber ---------- */

const DP_NUMS = [2, 7, 9, 3, 1];

interface DpFrame extends Frame {
  i: number;
  dp: (number | null)[];
  took: boolean;
}

function dpFrames(): DpFrame[] {
  const dp: (number | null)[] = DP_NUMS.map(() => null);
  const frames: DpFrame[] = [{ i: -1, dp: [...dp], took: false, text: 'dp[i] = most money from houses 0 to i, never robbing two neighbours.' }];
  DP_NUMS.forEach((x, i) => {
    const skip = i >= 1 ? dp[i - 1]! : 0;
    const take = (i >= 2 ? dp[i - 2]! : 0) + x;
    dp[i] = Math.max(skip, take);
    const took = take >= skip;
    const text =
      i === 0
        ? `dp[0] = ${x}. Only one house so far.`
        : `Skip: ${skip}. Take: ${i >= 2 ? dp[i - 2] : 0} + ${x} = ${take}. ${took ? 'Take it' : 'Skip it'}, dp[${i}] = ${dp[i]}.`;
    frames.push({ i, dp: [...dp], took, text, chip: `dp[${i}] = max(${skip}, ${take})` });
  });
  frames.push({ ...frames[frames.length - 1], done: true, text: `Best total is ${dp[DP_NUMS.length - 1]}: houses with 2, 9 and 1.` });
  return frames;
}

const DP_FRAMES = dpFrames();

const dpCx = (i: number) => 70 + i * 58;

function DpViz() {
  return (
    <VizPlayer
      frames={DP_FRAMES}
      viewBox="0 0 326 190"
      legend="Each cell reads only the two before it"
      label={(f) => `House values ${DP_NUMS.join(', ')}. dp row ${f.dp.map((d) => d ?? 'empty').join(', ')}.`}
    >
      {(f) => (
        <>
          <ArrowDefs />
          <text className="viz-small" x={4} y={40} style={{ textAnchor: 'start' }}>
            house
          </text>
          <text className="viz-small" x={4} y={110} style={{ textAnchor: 'start' }}>
            dp
          </text>
          {DP_NUMS.map((v, i) => (
            <g key={i}>
              <rect className="viz-cell viz-fade" data-s={i === f.i && f.took ? 'active' : undefined} x={dpCx(i) - 24} y={20} width={48} height={40} rx={8} />
              <text className="viz-label" x={dpCx(i)} y={40}>
                {v}
              </text>
            </g>
          ))}
          {f.dp.map((d, i) => (
            <g key={i}>
              <rect
                className="viz-cell viz-fade"
                data-s={f.done && i === f.i ? 'done' : i === f.i ? 'active' : i === f.i - 1 || i === f.i - 2 ? 'queued' : d !== null ? 'visited' : undefined}
                x={dpCx(i) - 24}
                y={90}
                width={48}
                height={40}
                rx={8}
              />
              <text className="viz-label" x={dpCx(i)} y={110}>
                {d ?? ''}
              </text>
            </g>
          ))}
          {f.i >= 1 && (
            <g>
              <path className="viz-edge" d={`M ${dpCx(f.i - 1)} 132 Q ${(dpCx(f.i - 1) + dpCx(f.i)) / 2} 156 ${dpCx(f.i) - 6} 134`} markerEnd="url(#viz-arrow)" />
              <text className="viz-small" x={(dpCx(f.i - 1) + dpCx(f.i)) / 2} y={156}>
                skip
              </text>
            </g>
          )}
          {f.i >= 2 && (
            <g>
              <path className="viz-edge" d={`M ${dpCx(f.i - 2)} 132 Q ${(dpCx(f.i - 2) + dpCx(f.i)) / 2} 204 ${dpCx(f.i) + 4} 134`} markerEnd="url(#viz-arrow)" />
              <text className="viz-small" x={(dpCx(f.i - 2) + dpCx(f.i)) / 2} y={180}>
                + take
              </text>
            </g>
          )}
          {f.i >= 0 && f.i < DP_NUMS.length && f.took && (
            <line className="viz-edge" x1={dpCx(f.i)} y1={62} x2={dpCx(f.i)} y2={86} markerEnd="url(#viz-arrow)" />
          )}
        </>
      )}
    </VizPlayer>
  );
}

export const vizById: Record<VizId, ComponentType> = {
  'two-pointers': TwoPointersViz,
  'sliding-window': SlidingWindowViz,
  'fast-slow': FastSlowViz,
  'mono-stack': MonoStackViz,
  'tree-bfs': TreeBfsViz,
  'dp-1d': DpViz,
};
