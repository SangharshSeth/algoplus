import type { Pattern } from './types';

export const treePatterns: Pattern[] = [
  {
    id: 'fast-slow',
    name: 'Fast and slow pointers',
    category: 'trees',
    signal: 'Cycle, middle node, O(1) space',
    summary: 'Two pointers walk the same list at different speeds. If there is a cycle, the fast one catches the slow one from behind.',
    signals: ['Cycle in a list or sequence', 'Middle of a linked list', 'O(1) extra space', 'Repeating number sequence'],
    steps: [
      'Start slow and fast at the head.',
      'Each step, slow moves 1 and fast moves 2.',
      'If fast hits the end, there is no cycle.',
      'If they meet, there is a cycle.',
    ],
    template: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    time: 'O(n)',
    space: 'O(1)',
    pitfalls: ['Check fast.next before jumping two, or an even-length list crashes.', 'To find where the cycle starts, reset one pointer to head after they meet and move both by 1.'],
    problems: ['Linked List Cycle', 'Linked List Cycle II', 'Middle of the Linked List', 'Happy Number', 'Find the Duplicate Number'],
    viz: 'fast-slow',
    quizzes: [
      {
        id: 'fs-concept-1',
        kind: 'concept',
        prompt: 'Once both are inside the cycle, why can\'t fast jump over slow?',
        options: [
          'Each step fast gains exactly 1 node on slow, so the gap reaches 0 before it can go negative.',
          'Fast moves 2 nodes and every cycle has an even length.',
          'They always meet at the node where the cycle starts.',
          'Slow waits at the cycle entry until fast arrives.',
        ],
        answer: 0,
        explain: 'Inside the cycle the gap shrinks by 1 every step, so they meet within one lap of slow. That is why it stays O(n).',
      },
      {
        id: 'fs-spot-1',
        kind: 'spot',
        prompt: 'Repeatedly replace n by the sum of the squares of its digits. Does it reach 1, or loop forever?',
        options: ['Fast and slow pointers', '1-D DP', 'Backtracking', 'Prefix sums'],
        answer: 0,
        explain: 'The numbers form an implicit linked list. Detect the loop with O(1) space instead of a seen set.',
      },
      {
        id: 'fs-predict-1',
        kind: 'predict',
        prompt: 'List 1 → 2 → 3 → 4 → 5 with no cycle. Where is slow when fast can no longer move?',
        options: ['3', '2', '4', '5'],
        answer: 0,
        explain: 'Steps: (2, 3), then (3, 5). fast.next is None, so the loop stops with slow on the middle node 3.',
      },
      {
        id: 'fs-fill-1',
        kind: 'fill',
        prompt: 'Fill the loop condition.',
        code: `slow = fast = head
while ____:
    slow = slow.next
    fast = fast.next.next`,
        options: ['fast and fast.next', 'slow and fast', 'fast.next.next', 'slow is not fast'],
        answer: 0,
        explain: 'fast.next.next needs both fast and fast.next to exist.',
      },
      {
        id: 'fs-concept-2',
        kind: 'concept',
        prompt: 'After slow and fast meet, how do you find the node where the cycle starts?',
        options: [
          'Move one pointer back to head, then move both 1 step at a time. They meet at the start.',
          'The meeting node is the start.',
          'Keep fast moving until it returns to the meeting node.',
          'Count the cycle length, then binary search.',
        ],
        answer: 0,
        explain: 'The distance from head to the start equals the distance from the meeting point to the start, going around the cycle.',
      },
      {
        id: 'fs-complexity-1',
        kind: 'complexity',
        prompt: 'Cycle detection with a hash set vs fast and slow pointers. What do you save?',
        options: ['O(n) space drops to O(1)', 'O(n²) time drops to O(n)', 'Nothing, both are the same', 'O(n log n) time drops to O(n)'],
        answer: 0,
        explain: 'Both are O(n) time. The pointers avoid storing visited nodes.',
      },
    ],
  },
  {
    id: 'tree-dfs',
    name: 'Tree DFS',
    category: 'trees',
    signal: 'Path sums, subtree properties',
    summary: 'Recurse into children and combine their answers. Decide up front what each call returns to its parent and what it tracks on the side.',
    signals: ['Root-to-leaf paths', 'Height, diameter, balance', 'Answer depends on both subtrees', 'Validate a BST'],
    steps: [
      'Base case: an empty node returns the neutral value.',
      'Get the answers from the left and right children.',
      'Combine them for this node, update any global best, and return.',
    ],
    template: `def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        if not node:
            return 0
        l, r = height(node.left), height(node.right)
        best = max(best, l + r)
        return 1 + max(l, r)
    height(root)
    return best`,
    time: 'O(n)',
    space: 'O(h) for the call stack',
    pitfalls: ['What a call returns and what it records globally are often different, as with diameter.', 'Deep, skewed trees can blow Python\'s recursion limit. Use an explicit stack if h can be 10⁵.'],
    problems: ['Maximum Depth of Binary Tree', 'Diameter of Binary Tree', 'Path Sum II', 'Validate Binary Search Tree', 'Lowest Common Ancestor'],
    quizzes: [
      {
        id: 'td-spot-1',
        kind: 'spot',
        prompt: 'Find the longest path between any two nodes in a binary tree.',
        options: ['Tree DFS', 'Tree BFS', 'Topological sort', 'Union-find'],
        answer: 0,
        explain: 'Post-order DFS: each node returns its height and records left + right as a candidate diameter.',
      },
      {
        id: 'td-concept-1',
        kind: 'concept',
        prompt: 'In the diameter template, why does height return 1 + max(l, r) instead of l + r?',
        options: [
          'A parent can only extend one branch of a path. l + r is a path that bends here and can\'t go higher.',
          'l + r would double count the root.',
          'It is a micro-optimization.',
          'l + r would be wrong for leaves.',
        ],
        answer: 0,
        explain: 'Return what the parent can use (one branch). Record what only this node can use (both branches).',
      },
      {
        id: 'td-complexity-1',
        kind: 'complexity',
        prompt: 'Recursive DFS on a balanced tree of n nodes. Extra space?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
        answer: 0,
        explain: 'The call stack is as deep as the tree is tall, which is log n when balanced (n when skewed).',
      },
      {
        id: 'td-fill-1',
        kind: 'fill',
        prompt: 'Validate a BST. Fill the recursive call for the left child.',
        code: `def ok(node, lo, hi):
    if not node:
        return True
    if not (lo < node.val < hi):
        return False
    return ____ and ok(node.right, node.val, hi)`,
        options: ['ok(node.left, lo, node.val)', 'ok(node.left, node.val, hi)', 'ok(node.left, lo, hi)', 'node.left.val < node.val'],
        answer: 0,
        explain: 'Everything on the left must stay above lo and below this node, so the upper bound tightens to node.val.',
      },
    ],
  },
  {
    id: 'tree-bfs',
    name: 'Tree BFS',
    category: 'trees',
    signal: 'Level order, right side view',
    summary: 'Walk the tree level by level with a queue. Take a snapshot of the queue length to know where one level ends and the next begins.',
    signals: ['Level by level output', 'Right or left side view', 'Minimum depth', 'Connect nodes on the same level'],
    steps: [
      'Put the root in a queue.',
      'Read the queue length: that is the size of this level.',
      'Pop that many nodes, record them, and push their children.',
      'Repeat until the queue is empty.',
    ],
    template: `from collections import deque

def level_order(root):
    if not root:
        return []
    out, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        out.append(level)
    return out`,
    time: 'O(n)',
    space: 'O(w) where w is the widest level',
    pitfalls: ['Read len(q) once before the inner loop, because the loop adds children to the same queue.', 'Use deque.popleft(). list.pop(0) is O(n).'],
    problems: ['Binary Tree Level Order Traversal', 'Binary Tree Right Side View', 'Minimum Depth of Binary Tree', 'Zigzag Level Order Traversal'],
    viz: 'tree-bfs',
    quizzes: [
      {
        id: 'tb-spot-1',
        kind: 'spot',
        prompt: 'Return the values you would see looking at a binary tree from its right side.',
        options: ['Tree BFS', 'Tree DFS', 'Monotonic stack', 'Trie'],
        answer: 0,
        explain: 'Level order, keeping the last node of each level. A DFS that visits right first also works.',
      },
      {
        id: 'tb-concept-1',
        kind: 'concept',
        prompt: 'Why read len(q) before the inner loop?',
        options: [
          'Children get appended during the loop. The snapshot marks where the current level ends.',
          'len() is slow on a deque.',
          'To avoid an infinite loop on cycles.',
          'It is only needed for complete trees.',
        ],
        answer: 0,
        explain: 'Without the snapshot, the loop would keep going into the next level.',
      },
      {
        id: 'tb-predict-1',
        kind: 'predict',
        prompt: 'Tree: 1 has children 2 and 3, and 2 has a child 4. After processing level 1 (node 1), what is in the queue?',
        options: ['[2, 3]', '[2, 3, 4]', '[1, 2, 3]', '[4]'],
        answer: 0,
        explain: 'Popping 1 pushes its children 2 and 3. Node 4 gets pushed while processing level 2.',
      },
      {
        id: 'tb-spot-2',
        kind: 'spot',
        prompt: 'Find the minimum depth of a binary tree (root to nearest leaf).',
        options: ['Tree BFS', 'Binary search on answer', 'Prefix sums', 'Heap and top-k'],
        answer: 0,
        explain: 'BFS stops at the first leaf it sees, which is the shallowest. DFS would explore everything.',
      },
      {
        id: 'tb-complexity-1',
        kind: 'complexity',
        prompt: 'BFS on a complete binary tree with n nodes. Peak queue size?',
        options: ['About n / 2', 'About log n', 'About √n', 'Always 2'],
        answer: 0,
        explain: 'The last level of a complete tree holds about half of all nodes.',
      },
      {
        id: 'tb-fill-1',
        kind: 'fill',
        prompt: 'Which call takes the next node in O(1)?',
        code: `node = ____`,
        options: ['q.popleft()', 'q.pop()', 'q.pop(0)', 'q[0]'],
        answer: 0,
        explain: 'popleft takes from the front of a deque. pop() takes from the back, which would make it DFS.',
      },
    ],
  },
  {
    id: 'trie',
    name: 'Trie',
    category: 'trees',
    signal: 'Prefix lookups, word search',
    summary: 'A tree where each edge is a character. Words that share a prefix share a path, so prefix lookups cost the length of the prefix, not the number of words.',
    signals: ['Starts-with or prefix queries', 'Autocomplete', 'Search many words in a grid', 'Longest common prefix'],
    steps: [
      'Each node holds a map of child characters and an end-of-word flag.',
      'Insert walks or creates one node per character.',
      'Search walks the path and checks the flag at the end.',
    ],
    template: `class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['$'] = True

    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node:
                return False
            node = node[ch]
        return True`,
    time: 'O(L) per operation, L = word length',
    space: 'O(total characters)',
    pitfalls: ['Mark the end of a word explicitly. "app" is not a word just because "apple" is.', 'For Word Search II, prune trie branches once a word is found.'],
    problems: ['Implement Trie', 'Word Search II', 'Design Add and Search Words', 'Replace Words'],
    quizzes: [
      {
        id: 'tr-spot-1',
        kind: 'spot',
        prompt: 'Given a grid of letters and a list of 10,000 words, find every word in the grid.',
        options: ['Trie', 'Grid BFS', 'Sliding window', 'Union-find'],
        answer: 0,
        explain: 'Build a trie of the words and DFS the grid once, pruning paths that are not a prefix of any word.',
      },
      {
        id: 'tr-concept-1',
        kind: 'concept',
        prompt: 'Why does a trie need an end-of-word marker?',
        options: [
          'A path can be a prefix of a word without being a word itself.',
          'To free memory.',
          'To keep children sorted.',
          'Only for words with repeated letters.',
        ],
        answer: 0,
        explain: 'After inserting "apple", the path a-p-p exists, but "app" was never inserted.',
      },
      {
        id: 'tr-complexity-1',
        kind: 'complexity',
        prompt: 'Prefix lookup of length L in a trie holding n words?',
        options: ['O(L)', 'O(n)', 'O(n · L)', 'O(log n)'],
        answer: 0,
        explain: 'You follow one edge per character, no matter how many words are stored.',
      },
      {
        id: 'tr-fill-1',
        kind: 'fill',
        prompt: 'Fill the step that walks or creates the child.',
        code: `for ch in word:
    node = ____`,
        options: ['node.setdefault(ch, {})', 'node[ch]', "node.get(ch)", '{ch: node}'],
        answer: 0,
        explain: 'setdefault returns the existing child or inserts an empty one, so insert never fails.',
      },
    ],
  },
];
