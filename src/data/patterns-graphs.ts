import type { Pattern } from './types';

export const graphPatterns: Pattern[] = [
  {
    id: 'grid-bfs',
    name: 'Grid BFS',
    category: 'graphs',
    signal: 'Shortest path, multi-source spread',
    summary: 'In an unweighted graph or grid, BFS reaches every cell in order of distance. Seed the queue with all sources at once to spread from many places together.',
    signals: ['Fewest steps or moves', 'Unweighted grid or graph', 'Spreading from many sources (rotting oranges)', 'Distance to nearest X'],
    steps: [
      'Push every source with distance 0 and mark it visited.',
      'Pop a cell and try its 4 neighbours.',
      'Push each unvisited, open neighbour with distance + 1 and mark it right away.',
    ],
    template: `from collections import deque

def shortest(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    q = deque([(start, 0)])
    seen = {start}
    while q:
        (r, c), d = q.popleft()
        if (r, c) == goal:
            return d
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols \\
                    and grid[nr][nc] != '#' and (nr, nc) not in seen:
                seen.add((nr, nc))
                q.append(((nr, nc), d + 1))
    return -1`,
    time: 'O(rows × cols)',
    space: 'O(rows × cols)',
    pitfalls: ['Mark visited when you push, not when you pop, or cells enter the queue many times.', 'Weighted edges need Dijkstra, not BFS.'],
    problems: ['Rotting Oranges', '01 Matrix', 'Shortest Path in Binary Matrix', 'Word Ladder', 'Walls and Gates'],
    quizzes: [
      {
        id: 'gb-spot-1',
        kind: 'spot',
        prompt: 'Rotten oranges infect neighbours each minute. How many minutes until all are rotten?',
        options: ['Grid BFS', 'Union-find', 'Backtracking', 'Topological sort'],
        answer: 0,
        explain: 'Multi-source BFS: start with every rotten orange in the queue. The number of levels is the answer.',
      },
      {
        id: 'gb-concept-1',
        kind: 'concept',
        prompt: 'Why does BFS find the shortest path in an unweighted grid?',
        options: [
          'It visits cells in order of distance, so the first time it reaches a cell is the shortest way there.',
          'It always moves toward the goal.',
          'It tries every path and keeps the minimum.',
          'Because the queue is sorted.',
        ],
        answer: 0,
        explain: 'All cells at distance d leave the queue before any cell at distance d + 1.',
      },
      {
        id: 'gb-concept-2',
        kind: 'concept',
        prompt: 'Where should you mark a cell as visited?',
        options: ['When you push it', 'When you pop it', 'Either, it doesn\'t matter', 'Only at the goal'],
        answer: 0,
        explain: 'Marking on pop lets the same cell be pushed by several neighbours, which blows up the queue.',
      },
      {
        id: 'gb-spot-2',
        kind: 'spot',
        prompt: 'Edges have different travel times. Find the fastest route between two nodes.',
        options: ['Grid BFS', 'Heap and top-k', 'Sliding window', 'Trie'],
        answer: 1,
        explain: 'Weighted shortest path is Dijkstra, which is BFS with a min-heap keyed on distance.',
      },
    ],
  },
  {
    id: 'topo-sort',
    name: 'Topological sort',
    category: 'graphs',
    signal: 'Dependencies, course order',
    summary: 'Order the nodes of a directed graph so every edge points forward. Repeatedly take a node with no remaining prerequisites. If you get stuck, there is a cycle.',
    signals: ['Prerequisites or dependencies', 'Build or task order', 'Detect a cycle in a directed graph', 'Alien dictionary'],
    steps: [
      'Count incoming edges (in-degree) for every node.',
      'Queue every node with in-degree 0.',
      'Pop a node, add it to the order, and lower its neighbours\' in-degrees. Queue any that hit 0.',
      'If the order is shorter than the node count, there is a cycle.',
    ],
    template: `from collections import deque

def topo_order(n, edges):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in edges:  # a must come before b
        graph[a].append(b)
        indeg[b] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in graph[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return order if len(order) == n else []`,
    time: 'O(V + E)',
    space: 'O(V + E)',
    pitfalls: ['Get the edge direction right: prerequisite → course.', 'An empty or short order means a cycle, not an error in your code.'],
    problems: ['Course Schedule', 'Course Schedule II', 'Alien Dictionary', 'Parallel Courses'],
    quizzes: [
      {
        id: 'ts-spot-1',
        kind: 'spot',
        prompt: 'Given course prerequisites, can you finish all courses?',
        options: ['Topological sort', 'Union-find', 'Grid BFS', 'Merge intervals'],
        answer: 0,
        explain: 'You can finish only if the prerequisite graph has no cycle, which Kahn\'s algorithm detects.',
      },
      {
        id: 'ts-concept-1',
        kind: 'concept',
        prompt: 'Kahn\'s algorithm ends with fewer nodes in the order than in the graph. What does that mean?',
        options: ['There is a cycle.', 'The graph is disconnected.', 'There are duplicate edges.', 'Some nodes have no edges.'],
        answer: 0,
        explain: 'Nodes in a cycle never reach in-degree 0, so they are never queued.',
      },
      {
        id: 'ts-complexity-1',
        kind: 'complexity',
        prompt: 'Topological sort time?',
        options: ['O(V + E)', 'O(V²)', 'O(E log V)', 'O(V · E)'],
        answer: 0,
        explain: 'Each node is queued once and each edge is relaxed once.',
      },
      {
        id: 'ts-fill-1',
        kind: 'fill',
        prompt: 'Fill the condition for queuing a neighbour.',
        code: `indeg[nxt] -= 1
if ____:
    q.append(nxt)`,
        options: ['indeg[nxt] == 0', 'indeg[nxt] < 0', 'nxt not in order', 'indeg[node] == 0'],
        answer: 0,
        explain: 'A node is ready once all its prerequisites have been placed.',
      },
    ],
  },
  {
    id: 'union-find',
    name: 'Union-find',
    category: 'graphs',
    signal: 'Components, redundant edge',
    summary: 'Track which group each node belongs to. Union joins two groups, find returns a group\'s root. With path compression both are close to O(1).',
    signals: ['Connected components as edges arrive', 'Is adding this edge a cycle?', 'Merge accounts or groups', 'Undirected graph only'],
    steps: [
      'Each node starts as its own parent.',
      'find(x) follows parents to the root, flattening the path on the way.',
      'union(a, b) points one root at the other. Same root already means a cycle.',
    ],
    template: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True`,
    time: 'About O(1) per operation (inverse Ackermann)',
    space: 'O(n)',
    pitfalls: ['Union the roots, not the original nodes.', 'Directed cycles need DFS or topological sort. Union-find is for undirected graphs.'],
    problems: ['Number of Provinces', 'Redundant Connection', 'Accounts Merge', 'Number of Connected Components'],
    quizzes: [
      {
        id: 'uf-spot-1',
        kind: 'spot',
        prompt: 'Edges arrive one at a time in an undirected graph. Return the first edge that creates a cycle.',
        options: ['Union-find', 'Topological sort', 'Tree DFS', 'Grid BFS'],
        answer: 0,
        explain: 'If both ends already share a root, the edge closes a cycle.',
      },
      {
        id: 'uf-concept-1',
        kind: 'concept',
        prompt: 'What does path compression do?',
        options: [
          'Points nodes on the find path closer to the root, so later finds are shorter.',
          'Deletes nodes that are not roots.',
          'Sorts the parent array.',
          'Merges the two smallest groups.',
        ],
        answer: 0,
        explain: 'Together with union by size it keeps trees almost flat.',
      },
      {
        id: 'uf-fill-1',
        kind: 'fill',
        prompt: 'Fill the cycle check.',
        code: `ra, rb = self.find(a), self.find(b)
if ____:
    return False  # already connected`,
        options: ['ra == rb', 'a == b', 'self.parent[a] == b', 'ra < rb'],
        answer: 0,
        explain: 'Compare roots. a and b can have different direct parents and still be in the same group.',
      },
      {
        id: 'uf-spot-2',
        kind: 'spot',
        prompt: 'Course B requires course A. Detect whether the requirements contain a cycle.',
        options: ['Union-find', 'Topological sort', 'Heap and top-k', 'Two pointers'],
        answer: 1,
        explain: 'Requirements are directed. Union-find ignores direction and would report false cycles.',
      },
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'graphs',
    signal: 'All subsets, permutations, N-queens',
    summary: 'Build a candidate one choice at a time. Recurse, then undo the choice so the next branch starts clean. Prune early when a partial choice cannot work.',
    signals: ['Return all combinations, subsets or permutations', 'Constraint puzzles (sudoku, N-queens)', 'Word search in a grid', 'Input size around 10 to 20'],
    steps: [
      'If the current path is complete, record a copy.',
      'For each valid choice: make it, recurse, then undo it.',
      'Skip choices that already break a rule.',
    ],
    template: `def subsets(nums):
    out, path = [], []
    def go(start):
        out.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            go(i + 1)
            path.pop()
    go(0)
    return out`,
    time: 'O(2ⁿ · n) for subsets, O(n! · n) for permutations',
    space: 'O(n) for the path',
    pitfalls: ['Append a copy (path[:]), not path itself, or every result ends up empty.', 'For inputs with duplicates, sort first and skip equal neighbours at the same depth.'],
    problems: ['Subsets', 'Permutations', 'Combination Sum', 'N-Queens', 'Word Search'],
    quizzes: [
      {
        id: 'bt-spot-1',
        kind: 'spot',
        prompt: 'Return every combination of candidates that sums to a target. Each can be reused.',
        options: ['Backtracking', '1-D DP', 'Two pointers', 'Prefix sums'],
        answer: 0,
        explain: 'You need every combination, not a count, so enumerate with backtracking and prune once the sum passes the target.',
      },
      {
        id: 'bt-concept-1',
        kind: 'concept',
        prompt: 'Why does the template append path[:] and not path?',
        options: [
          'path keeps changing. Without a copy, every stored result points to the same list.',
          'Slicing is faster.',
          'To sort the result.',
          'Python requires a copy for nested lists.',
        ],
        answer: 0,
        explain: 'By the end, path is empty again, so all stored references would show [].',
      },
      {
        id: 'bt-complexity-1',
        kind: 'complexity',
        prompt: 'Generating all permutations of n items. Time?',
        options: ['O(n! · n)', 'O(2ⁿ)', 'O(n²)', 'O(n log n)'],
        answer: 0,
        explain: 'There are n! permutations and copying each costs n.',
      },
      {
        id: 'bt-spot-2',
        kind: 'spot',
        prompt: 'How many ways can you climb n stairs taking 1 or 2 steps at a time?',
        options: ['Backtracking', '1-D DP', 'Grid BFS', 'Heap and top-k'],
        answer: 1,
        explain: 'You only need a count, and subproblems repeat. That is DP, not enumeration.',
      },
    ],
  },
];
