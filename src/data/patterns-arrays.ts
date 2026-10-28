import type { Pattern } from './types';

export const arrayPatterns: Pattern[] = [
  {
    id: 'two-pointers',
    name: 'Two pointers',
    category: 'arrays',
    signal: 'Sorted input, pair or triplet sums',
    summary: 'Put one pointer at each end of a sorted array and move the one that brings you closer to the goal. Each step throws away a whole row of candidate pairs.',
    signals: ['Sorted array or string', 'Find a pair or triplet with a target sum', 'Compare from both ends (palindromes)', 'O(1) extra space wanted'],
    steps: [
      'Start left at 0 and right at n - 1.',
      'If the sum is too small, move left forward to grow it.',
      'If the sum is too big, move right back to shrink it.',
      'Stop when they meet or the target is found.',
    ],
    template: `def pair_with_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return left, right
        if s < target:
            left += 1
        else:
            right -= 1
    return None`,
    time: 'O(n)',
    space: 'O(1)',
    pitfalls: ['Only works when moving a pointer changes the sum in a known direction, which needs sorted input.', 'For 3Sum, skip duplicates after a match or you return the same triplet twice.'],
    problems: ['Two Sum II', '3Sum', 'Container With Most Water', 'Valid Palindrome'],
    viz: 'two-pointers',
    quizzes: [
      {
        id: 'tp-spot-1',
        kind: 'spot',
        prompt: 'Given a sorted array, find two numbers that add up to a target. Use O(1) extra space.',
        options: ['Two pointers', 'Sliding window', 'Prefix sums', 'Heap and top-k'],
        answer: 0,
        explain: 'Sorted plus pair sum plus O(1) space is the textbook two pointers signal. A hash map works too, but uses O(n) space.',
      },
      {
        id: 'tp-concept-1',
        kind: 'concept',
        prompt: 'nums[left] + nums[right] is bigger than the target. Why is it safe to move right back by one?',
        options: [
          'Every pair using nums[right] with a larger left is even bigger, so nums[right] can never be part of the answer.',
          'Moving right is always safe in two pointers.',
          'Because left has already been checked against every element.',
          'Because the array has no duplicates.',
        ],
        answer: 0,
        explain: 'left is the smallest value still in play. If even that is too big with nums[right], no pair with nums[right] works, so that column is gone.',
      },
      {
        id: 'tp-predict-1',
        kind: 'predict',
        prompt: 'nums = [1, 3, 4, 6, 8, 11], target = 10. left = 0, right = 5, sum is 12. What happens next?',
        options: ['right moves to 4', 'left moves to 1', 'Return (0, 5)', 'Both pointers move'],
        answer: 0,
        explain: '12 is bigger than 10, so drop the largest value: right goes from index 5 to 4.',
      },
      {
        id: 'tp-fill-1',
        kind: 'fill',
        prompt: 'Fill the loop condition.',
        code: `left, right = 0, len(nums) - 1
while ____:
    ...`,
        options: ['left < right', 'left <= right', 'right > 0', 'left < len(nums)'],
        answer: 0,
        explain: 'A pair needs two different indices, so stop once they meet. left <= right would pair an element with itself.',
      },
      {
        id: 'tp-complexity-1',
        kind: 'complexity',
        prompt: '3Sum: sort, then for each i run two pointers on the rest. What is the time cost?',
        options: ['O(n²)', 'O(n log n)', 'O(n³)', 'O(n)'],
        answer: 0,
        explain: 'Sorting is O(n log n), then n outer iterations each do an O(n) two pointer scan: O(n²) overall.',
      },
      {
        id: 'tp-spot-2',
        kind: 'spot',
        prompt: 'Given heights of vertical lines, pick two lines that hold the most water between them.',
        options: ['Monotonic stack', 'Two pointers', 'Binary search on answer', 'Sliding window'],
        answer: 1,
        explain: 'Start at both ends and move the shorter line inward. The shorter side caps the area, so keeping it can never do better.',
      },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding window',
    category: 'arrays',
    signal: 'Longest or shortest contiguous run',
    summary: 'Keep a window [left, right] over the array. Grow it from the right, and shrink it from the left only when it breaks a rule. Every element enters and leaves once.',
    signals: ['Contiguous subarray or substring', 'Longest, shortest or count of windows', 'A constraint like "at most k distinct" or "no repeats"', 'All values non-negative (for sum windows)'],
    steps: [
      'Move right forward and add nums[right] to the window state.',
      'While the window breaks the rule, remove nums[left] and move left forward.',
      'The window is now valid: update the best answer.',
    ],
    template: `def longest_without_repeat(s):
    seen = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
    time: 'O(n)',
    space: 'O(k) for the window state',
    pitfalls: ['Sum windows with negative numbers do not shrink predictably. Use prefix sums instead.', 'Update the answer after shrinking, when the window is valid again.'],
    problems: ['Longest Substring Without Repeating Characters', 'Minimum Window Substring', 'Longest Repeating Character Replacement', 'Max Consecutive Ones III'],
    viz: 'sliding-window',
    quizzes: [
      {
        id: 'sw-spot-1',
        kind: 'spot',
        prompt: 'Find the length of the longest substring with at most 2 distinct characters.',
        options: ['Two pointers', 'Prefix sums', 'Sliding window', 'Trie'],
        answer: 2,
        explain: 'Contiguous plus longest plus an "at most k" rule: grow right, shrink left when there are 3 distinct characters.',
      },
      {
        id: 'sw-concept-1',
        kind: 'concept',
        prompt: 'Why is a variable sliding window O(n) even though there is a loop inside a loop?',
        options: [
          'left only moves forward, so across the whole run it moves at most n times.',
          'The inner loop runs at most once per outer step.',
          'The window size is bounded by a constant.',
          'Hash map lookups are O(1).',
        ],
        answer: 0,
        explain: 'Count moves, not loops: right moves n times and left moves at most n times, so 2n steps total.',
      },
      {
        id: 'sw-concept-2',
        kind: 'concept',
        prompt: 'Smallest subarray with sum at least k. The array has negative numbers. Does a plain sliding window work?',
        options: [
          'No. Shrinking can raise the sum, so you cannot tell which way to move.',
          'Yes, as long as k is positive.',
          'Yes, if you sort the array first.',
          'No, because the window must be fixed size.',
        ],
        answer: 0,
        explain: 'The window relies on "adding grows, removing shrinks". Negatives break that. Use prefix sums with a monotonic deque instead.',
      },
      {
        id: 'sw-predict-1',
        kind: 'predict',
        prompt: 's = "abcab". After reading index 3 (the second "a"), where is left?',
        options: ['1', '0', '3', '2'],
        answer: 0,
        explain: '"a" was last seen at 0, which is inside the window, so left jumps to 0 + 1 = 1. The window is "bca".',
      },
      {
        id: 'sw-fill-1',
        kind: 'fill',
        prompt: 'Fill the window length.',
        code: `best = max(best, ____)`,
        options: ['right - left + 1', 'right - left', 'right + left', 'len(seen)'],
        answer: 0,
        explain: 'Both ends are inclusive, so the length is right - left + 1.',
      },
      {
        id: 'sw-spot-2',
        kind: 'spot',
        prompt: 'Return the maximum sum of any subarray of exactly length k.',
        options: ['Sliding window', 'Heap and top-k', '1-D DP', 'Merge intervals'],
        answer: 0,
        explain: 'A fixed-size window: add the new element, subtract the one that falls out, track the max.',
      },
    ],
  },
  {
    id: 'prefix-sums',
    name: 'Prefix sums',
    category: 'arrays',
    signal: 'Range sums, subarray equals k',
    summary: 'Precompute running totals so any range sum is one subtraction. Pair it with a hash map of seen prefixes to count subarrays that hit a target.',
    signals: ['Many range-sum queries', 'Count subarrays with sum k', 'Negative numbers rule out a sliding window', '2-D grid region sums'],
    steps: [
      'prefix[i] is the sum of the first i elements, with prefix[0] = 0.',
      'sum(l..r) = prefix[r + 1] - prefix[l].',
      'To count sum == k, look up how many earlier prefixes equal current - k.',
    ],
    template: `def subarray_sum(nums, k):
    count, total = 0, 0
    seen = {0: 1}
    for x in nums:
        total += x
        count += seen.get(total - k, 0)
        seen[total] = seen.get(total, 0) + 1
    return count`,
    time: 'O(n)',
    space: 'O(n)',
    pitfalls: ['Seed the map with {0: 1} or you miss subarrays that start at index 0.', 'Look up before you insert the current prefix.'],
    problems: ['Subarray Sum Equals K', 'Range Sum Query', 'Contiguous Array', 'Product of Array Except Self'],
    quizzes: [
      {
        id: 'ps-spot-1',
        kind: 'spot',
        prompt: 'Count subarrays whose sum equals k. Values can be negative.',
        options: ['Sliding window', 'Prefix sums', 'Two pointers', 'Binary search on answer'],
        answer: 1,
        explain: 'Negatives break the window. Store prefix counts in a map and look up total - k.',
      },
      {
        id: 'ps-fill-1',
        kind: 'fill',
        prompt: 'What must the map start with?',
        code: `seen = ____`,
        options: ['{0: 1}', '{}', '{0: 0}', '{k: 1}'],
        answer: 0,
        explain: 'An empty prefix (sum 0) exists before the array starts, so a subarray from index 0 is counted.',
      },
      {
        id: 'ps-predict-1',
        kind: 'predict',
        prompt: 'nums = [2, 4, 1]. With prefix = [0, 2, 6, 7], what is sum(nums[1..2])?',
        options: ['5', '7', '6', '4'],
        answer: 0,
        explain: 'prefix[3] - prefix[1] = 7 - 2 = 5, which is 4 + 1.',
      },
      {
        id: 'ps-complexity-1',
        kind: 'complexity',
        prompt: 'After O(n) setup, what does each range-sum query cost?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(√n)'],
        answer: 0,
        explain: 'One subtraction of two stored values.',
      },
    ],
  },
  {
    id: 'binary-search-answer',
    name: 'Binary search on answer',
    category: 'arrays',
    signal: 'Minimize the max, monotonic check',
    summary: 'When you cannot search the input but can test "is answer x good enough?", and that test flips from no to yes once, binary search over x.',
    signals: ['Minimize the maximum or maximize the minimum', 'A yes or no check that is monotonic in x', 'Answer range is large but bounded', 'Words like capacity, speed, days'],
    steps: [
      'Set lo and hi to the smallest and largest possible answers.',
      'Test mid with a greedy feasible(mid) check.',
      'If feasible, keep it and search left. Otherwise search right.',
    ],
    template: `def min_capacity(weights, days):
    def feasible(cap):
        need, load = 1, 0
        for w in weights:
            if load + w > cap:
                need, load = need + 1, 0
            load += w
        return need <= days

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    time: 'O(n log R) where R is the answer range',
    space: 'O(1)',
    pitfalls: ['Use hi = mid (not mid - 1) when mid itself might be the answer.', 'lo must start at a value that can be valid, like max(weights).'],
    problems: ['Koko Eating Bananas', 'Capacity To Ship Packages Within D Days', 'Split Array Largest Sum', 'Minimum Number of Days to Make m Bouquets'],
    quizzes: [
      {
        id: 'bs-spot-1',
        kind: 'spot',
        prompt: 'Koko eats bananas at speed k per hour. Find the smallest k that finishes all piles within h hours.',
        options: ['Heap and top-k', 'Binary search on answer', 'Sliding window', '1-D DP'],
        answer: 1,
        explain: 'If speed k works, any faster speed works too. That monotonic check is the signal to binary search on k.',
      },
      {
        id: 'bs-concept-1',
        kind: 'concept',
        prompt: 'What property must feasible(x) have for this to work?',
        options: [
          'Once it is true, it stays true for every larger x (or the reverse).',
          'It must run in O(1).',
          'It must be true for exactly one x.',
          'The input must be sorted.',
        ],
        answer: 0,
        explain: 'Binary search finds the boundary between false and true, so there must be exactly one boundary.',
      },
      {
        id: 'bs-fill-1',
        kind: 'fill',
        prompt: 'feasible(mid) is true. Fill the update.',
        code: `if feasible(mid):
    ____
else:
    lo = mid + 1`,
        options: ['hi = mid', 'hi = mid - 1', 'lo = mid', 'return mid'],
        answer: 0,
        explain: 'mid works and might be the smallest that works, so keep it in range with hi = mid.',
      },
      {
        id: 'bs-complexity-1',
        kind: 'complexity',
        prompt: 'n = 10⁵ items, answer range up to 10⁹, feasible is O(n). Roughly how many operations?',
        options: ['About 3 × 10⁶', 'About 10⁹', 'About 10¹⁴', 'About 10⁵'],
        answer: 0,
        explain: 'log₂(10⁹) is about 30 checks, each O(n): 30 × 10⁵.',
      },
    ],
  },
  {
    id: 'mono-stack',
    name: 'Monotonic stack',
    category: 'arrays',
    signal: 'Next greater or smaller element',
    summary: 'Keep a stack whose values only go down (or up). When a new value breaks the order, pop. Each popped item has just found its next greater element.',
    signals: ['Next greater or next smaller element', 'How far until a warmer day', 'Largest rectangle in a histogram', 'Remove digits to make the smallest number'],
    steps: [
      'Scan left to right, keeping indices on a stack with decreasing values.',
      'While the current value is bigger than the top, pop it: its answer is the current value.',
      'Push the current index.',
      'Anything left on the stack has no greater element.',
    ],
    template: `def next_greater(nums):
    ans = [-1] * len(nums)
    stack = []  # indices, values decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            ans[stack.pop()] = x
        stack.append(i)
    return ans`,
    time: 'O(n)',
    space: 'O(n)',
    pitfalls: ['Store indices, not values, when you need distances.', 'Decide strict or non-strict comparison on purpose: it changes how duplicates are handled.'],
    problems: ['Daily Temperatures', 'Next Greater Element I', 'Largest Rectangle in Histogram', 'Trapping Rain Water'],
    viz: 'mono-stack',
    quizzes: [
      {
        id: 'ms-spot-1',
        kind: 'spot',
        prompt: 'For each day, how many days until a warmer temperature?',
        options: ['Monotonic stack', 'Heap and top-k', 'Prefix sums', 'Two pointers'],
        answer: 0,
        explain: 'Classic next greater element. Store indices so the distance is i - popped index.',
      },
      {
        id: 'ms-concept-1',
        kind: 'concept',
        prompt: 'Why is the total work O(n) and not O(n²)?',
        options: [
          'Each index is pushed once and popped at most once.',
          'The while loop runs at most once per element.',
          'The stack never holds more than a few items.',
          'Python list pop is O(1).',
        ],
        answer: 0,
        explain: 'Total pops cannot exceed total pushes, which is n.',
      },
      {
        id: 'ms-predict-1',
        kind: 'predict',
        prompt: 'nums = [2, 1, 5]. The stack holds values [2, 1]. We read 5. What gets popped?',
        options: ['1, then 2', 'Only 1', 'Only 2', 'Nothing'],
        answer: 0,
        explain: '5 is bigger than 1, pop it (answer 5). 5 is bigger than 2, pop it too. Then push 5.',
      },
      {
        id: 'ms-fill-1',
        kind: 'fill',
        prompt: 'Next smaller element instead. Fill the comparison.',
        code: `while stack and nums[stack[-1]] ____ x:
    ans[stack.pop()] = x`,
        options: ['>', '<', '==', '<='],
        answer: 0,
        explain: 'For next smaller, pop while the top is bigger than x. The stack then increases from bottom to top.',
      },
      {
        id: 'ms-concept-2',
        kind: 'concept',
        prompt: 'After the scan, what does an index still on the stack mean?',
        options: ['It has no greater element to its right.', 'It is the global maximum.', 'It was a duplicate.', 'The scan has a bug.'],
        answer: 0,
        explain: 'Nothing after it was bigger, so its answer stays -1.',
      },
      {
        id: 'ms-spot-2',
        kind: 'spot',
        prompt: 'Find the largest rectangle that fits under a histogram.',
        options: ['Two pointers', 'Monotonic stack', '2-D DP', 'Binary search on answer'],
        answer: 1,
        explain: 'For each bar you need the nearest smaller bar on each side, which an increasing stack gives in one pass.',
      },
    ],
  },
  {
    id: 'merge-intervals',
    name: 'Merge intervals',
    category: 'arrays',
    signal: 'Overlapping ranges, meeting rooms',
    summary: 'Sort intervals by start. Then a single pass either extends the current interval or starts a new one.',
    signals: ['Ranges with start and end', 'Merge, insert or count overlaps', 'Meeting rooms or calendar bookings', 'Minimum arrows or removals'],
    steps: [
      'Sort by start time.',
      'If the next start is at or before the current end, extend the end.',
      'Otherwise close the current interval and start a new one.',
    ],
    template: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out`,
    time: 'O(n log n)',
    space: 'O(n)',
    pitfalls: ['Take max of the ends: a later interval can sit fully inside the current one.', 'For "rooms needed", sort starts and ends separately or use a min-heap of ends.'],
    problems: ['Merge Intervals', 'Insert Interval', 'Meeting Rooms II', 'Non-overlapping Intervals'],
    quizzes: [
      {
        id: 'mi-spot-1',
        kind: 'spot',
        prompt: 'Given meeting times, find the minimum number of rooms needed.',
        options: ['Merge intervals', 'Prefix sums', 'Union-find', 'Topological sort'],
        answer: 0,
        explain: 'An interval problem: sort by start and keep a min-heap of end times, or sweep sorted starts and ends.',
      },
      {
        id: 'mi-fill-1',
        kind: 'fill',
        prompt: 'Fill the merge step.',
        code: `if start <= out[-1][1]:
    out[-1][1] = ____`,
        options: ['max(out[-1][1], end)', 'end', 'min(out[-1][1], end)', 'start'],
        answer: 0,
        explain: '[1, 10] then [2, 3]: just using end would shrink it to [1, 3].',
      },
      {
        id: 'mi-complexity-1',
        kind: 'complexity',
        prompt: 'What dominates the cost of merging intervals?',
        options: ['The sort, O(n log n)', 'The merge pass, O(n²)', 'Appending, O(n)', 'It is O(n) overall'],
        answer: 0,
        explain: 'The pass after sorting is linear.',
      },
      {
        id: 'mi-concept-1',
        kind: 'concept',
        prompt: 'Why sort by start time first?',
        options: [
          'So any interval that overlaps the current one comes right after it.',
          'So the output is in order.',
          'Sorting by end would be wrong.',
          'To remove duplicates.',
        ],
        answer: 0,
        explain: 'After sorting by start, if the next interval does not overlap the current one, no later one can either.',
      },
    ],
  },
  {
    id: 'heap-top-k',
    name: 'Heap and top-k',
    category: 'arrays',
    signal: 'K largest, running median',
    summary: 'A heap of size k keeps the k best items seen so far. The root is the weakest of them, so each new item is one comparison and maybe one swap.',
    signals: ['K largest, smallest or most frequent', 'Merge k sorted lists', 'Running median of a stream', 'Always pick the current cheapest or soonest'],
    steps: [
      'For k largest, keep a min-heap of size k.',
      'Push each item. If the heap grows past k, pop the smallest.',
      'The heap now holds the k largest, with the k-th largest at the root.',
    ],
    template: `import heapq

def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap  # heap[0] is the k-th largest`,
    time: 'O(n log k)',
    space: 'O(k)',
    pitfalls: ['k largest uses a min-heap, which feels backwards. The root is what you evict.', 'Python heapq is a min-heap only. Push negatives for a max-heap.'],
    problems: ['Kth Largest Element in an Array', 'Top K Frequent Elements', 'Merge k Sorted Lists', 'Find Median from Data Stream'],
    quizzes: [
      {
        id: 'hp-spot-1',
        kind: 'spot',
        prompt: 'Return the k most frequent words from a large list.',
        options: ['Heap and top-k', 'Trie', 'Sliding window', 'Merge intervals'],
        answer: 0,
        explain: 'Count with a map, then keep a size-k heap keyed on frequency.',
      },
      {
        id: 'hp-concept-1',
        kind: 'concept',
        prompt: 'For the k largest elements, which heap do you keep?',
        options: ['A min-heap of size k', 'A max-heap of size k', 'A max-heap of all n items', 'Two heaps'],
        answer: 0,
        explain: 'The min-heap root is the smallest of your top k, the one to evict when something bigger arrives.',
      },
      {
        id: 'hp-complexity-1',
        kind: 'complexity',
        prompt: 'Size-k heap over n items. Time?',
        options: ['O(n log k)', 'O(n log n)', 'O(k log n)', 'O(n + k)'],
        answer: 0,
        explain: 'n pushes and pops on a heap that never exceeds k items.',
      },
      {
        id: 'hp-spot-2',
        kind: 'spot',
        prompt: 'Numbers arrive one by one. After each, report the median.',
        options: ['Binary search on answer', 'Heap and top-k', 'Prefix sums', 'Monotonic stack'],
        answer: 1,
        explain: 'Two heaps: a max-heap for the lower half and a min-heap for the upper half, kept balanced.',
      },
    ],
  },
];
