import type { Pattern } from './types';

export const dpPatterns: Pattern[] = [
  {
    id: 'dp-1d',
    name: '1-D DP',
    category: 'dp',
    signal: 'Take or skip, house robber',
    summary: 'Define dp[i] as the best answer using the first i items. Each step chooses between a few earlier states, usually "take this one" or "skip it".',
    signals: ['Count ways or find the best value', 'Each choice depends on a few previous choices', 'Brute force recursion repeats subproblems', 'Linear input: stairs, houses, days'],
    steps: [
      'Define the state in words: dp[i] = best for the first i items.',
      'Write the transition: take item i, or skip it.',
      'Set the base cases, then fill left to right.',
      'If only the last two states are used, keep two variables.',
    ],
    template: `def rob(nums):
    # dp[i] = most money from the first i houses
    prev, best = 0, 0  # dp[i - 2], dp[i - 1]
    for x in nums:
        prev, best = best, max(best, prev + x)
    return best`,
    time: 'O(n)',
    space: 'O(1) after rolling, O(n) with a table',
    pitfalls: ['Write the state in plain words first. Most DP bugs are a fuzzy definition.', 'Off-by-one between dp[i] for "first i items" and "ending at index i".'],
    problems: ['Climbing Stairs', 'House Robber', 'Coin Change', 'Longest Increasing Subsequence', 'Decode Ways'],
    viz: 'dp-1d',
    quizzes: [
      {
        id: 'd1-spot-1',
        kind: 'spot',
        prompt: 'Rob houses on a street for the most money, but never two next to each other.',
        options: ['1-D DP', 'Two pointers', 'Heap and top-k', 'Backtracking'],
        answer: 0,
        explain: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Take this house or skip it.',
      },
      {
        id: 'd1-fill-1',
        kind: 'fill',
        prompt: 'House robber. Fill the transition.',
        code: `dp[i] = max(dp[i - 1], ____)`,
        options: ['dp[i - 2] + nums[i]', 'dp[i - 1] + nums[i]', 'nums[i]', 'dp[i - 2]'],
        answer: 0,
        explain: 'Taking house i means you could not take i - 1, so add it to the best up to i - 2.',
      },
      {
        id: 'd1-predict-1',
        kind: 'predict',
        prompt: 'nums = [2, 7, 9, 3, 1]. What is the best total?',
        options: ['12', '11', '10', '13'],
        answer: 0,
        explain: '2 + 9 + 1 = 12. The dp row is 2, 7, 11, 11, 12.',
      },
      {
        id: 'd1-concept-1',
        kind: 'concept',
        prompt: 'When can a 1-D DP table shrink to two variables?',
        options: [
          'When each state only reads the previous one or two states.',
          'Whenever the answer is a single number.',
          'Only for counting problems.',
          'When the input is sorted.',
        ],
        answer: 0,
        explain: 'If dp[i] only needs dp[i-1] and dp[i-2], older entries are never read again.',
      },
      {
        id: 'd1-spot-2',
        kind: 'spot',
        prompt: 'Fewest coins to make an amount, given coin values you can reuse.',
        options: ['1-D DP', 'Heap and top-k', 'Binary search on answer', 'Sliding window'],
        answer: 0,
        explain: 'dp[a] = 1 + min(dp[a - c]) over coins c. Greedy fails for coin sets like [1, 3, 4] with amount 6.',
      },
      {
        id: 'd1-complexity-1',
        kind: 'complexity',
        prompt: 'Coin change with amount A and k coin types. Time?',
        options: ['O(A · k)', 'O(A + k)', 'O(kᴬ)', 'O(A log k)'],
        answer: 0,
        explain: 'A states, and each tries k coins.',
      },
    ],
  },
  {
    id: 'dp-2d',
    name: '2-D DP',
    category: 'dp',
    signal: 'Two strings, grid paths',
    summary: 'The state needs two indices, like a position in each of two strings or a row and column. Fill a table so every cell reads only cells already filled.',
    signals: ['Compare two strings or sequences', 'Paths in a grid', 'Edit distance or common subsequence', 'Interval problems: dp[i][j] over a range'],
    steps: [
      'Define dp[i][j] in words, for example LCS of a[:i] and b[:j].',
      'Write the transition from neighbours: left, up and diagonal.',
      'Fill row 0 and column 0 as base cases.',
      'Fill row by row so dependencies are ready.',
    ],
    template: `def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
    time: 'O(m · n)',
    space: 'O(m · n), or O(n) keeping one row',
    pitfalls: ['The extra row and column (size m + 1 by n + 1) stand for empty prefixes. Index the strings with i - 1 and j - 1.', 'When rolling to one row, save the diagonal before you overwrite it.'],
    problems: ['Unique Paths', 'Longest Common Subsequence', 'Edit Distance', 'Longest Palindromic Subsequence'],
    quizzes: [
      {
        id: 'd2-spot-1',
        kind: 'spot',
        prompt: 'Fewest inserts, deletes or replaces to turn one word into another.',
        options: ['2-D DP', 'Sliding window', 'Trie', 'Two pointers'],
        answer: 0,
        explain: 'Edit distance: dp[i][j] over prefixes of both words.',
      },
      {
        id: 'd2-fill-1',
        kind: 'fill',
        prompt: 'LCS when the characters match. Fill it.',
        code: `if a[i - 1] == b[j - 1]:
    dp[i][j] = ____`,
        options: ['dp[i - 1][j - 1] + 1', 'dp[i - 1][j] + 1', 'max(dp[i - 1][j], dp[i][j - 1])', 'dp[i][j - 1] + 1'],
        answer: 0,
        explain: 'Both characters are used up, so step diagonally and add 1.',
      },
      {
        id: 'd2-complexity-1',
        kind: 'complexity',
        prompt: 'Unique paths in an m × n grid using one rolling row. Space?',
        options: ['O(n)', 'O(m · n)', 'O(1)', 'O(m + n)'],
        answer: 0,
        explain: 'Each cell only needs the cell above (same column, last row) and the cell to its left.',
      },
      {
        id: 'd2-concept-1',
        kind: 'concept',
        prompt: 'Why is the table (m + 1) × (n + 1) and not m × n?',
        options: [
          'Row 0 and column 0 represent empty prefixes, which makes the base cases uniform.',
          'To leave room for the answer.',
          'Python lists are 1-indexed.',
          'It is needed only for edit distance.',
        ],
        answer: 0,
        explain: 'dp[0][j] and dp[i][0] are the "one string is empty" cases.',
      },
    ],
  },
  {
    id: 'knapsack',
    name: 'Knapsack',
    category: 'dp',
    signal: 'Capacity budget, subset sum',
    summary: 'Each item is taken or not, under a capacity limit. dp[c] is the best value with capacity c. Loop capacity downward for 0/1 items and upward for unlimited items.',
    signals: ['Pick items under a weight or sum budget', 'Can a subset hit exactly this sum?', 'Partition into two equal halves', 'Count ways to reach a target'],
    steps: [
      'dp[c] = best value using capacity c, starting from 0.',
      'For each item, update capacities from high to low (0/1) so the item is used at most once.',
      'Read dp[capacity].',
    ],
    template: `def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [True] + [False] * target
    for x in nums:
        for c in range(target, x - 1, -1):
            dp[c] = dp[c] or dp[c - x]
    return dp[target]`,
    time: 'O(n · C)',
    space: 'O(C)',
    pitfalls: ['Looping capacity upward in 0/1 knapsack lets the same item be used twice.', 'O(n · C) is pseudo-polynomial: fine for C around 10⁴, not 10⁹.'],
    problems: ['Partition Equal Subset Sum', 'Target Sum', 'Coin Change II', 'Ones and Zeroes'],
    quizzes: [
      {
        id: 'ks-spot-1',
        kind: 'spot',
        prompt: 'Can the array be split into two parts with equal sums?',
        options: ['Knapsack', 'Two pointers', 'Prefix sums', 'Merge intervals'],
        answer: 0,
        explain: 'Subset sum to total / 2 is a 0/1 knapsack over booleans.',
      },
      {
        id: 'ks-concept-1',
        kind: 'concept',
        prompt: 'In 0/1 knapsack with a 1-D table, why loop capacity from high to low?',
        options: [
          'So dp[c - x] still holds the value from before this item, and the item is used at most once.',
          'It is faster.',
          'High capacities matter more.',
          'To avoid negative indices.',
        ],
        answer: 0,
        explain: 'Going upward, dp[c - x] may already include this item, which turns it into unbounded knapsack.',
      },
      {
        id: 'ks-fill-1',
        kind: 'fill',
        prompt: 'Unlimited copies of each coin. Fill the loop.',
        code: `for coin in coins:
    for c in ____:
        dp[c] += dp[c - coin]`,
        options: ['range(coin, amount + 1)', 'range(amount, coin - 1, -1)', 'range(amount + 1)', 'range(coin)'],
        answer: 0,
        explain: 'Upward order lets the same coin be reused within one pass.',
      },
      {
        id: 'ks-complexity-1',
        kind: 'complexity',
        prompt: 'n = 200 items, target sum 10,000. Roughly how much work?',
        options: ['2 × 10⁶ updates', '2²⁰⁰ subsets', '10⁴ updates', '4 × 10⁴ updates'],
        answer: 0,
        explain: 'n × C = 200 × 10,000.',
      },
    ],
  },
];
