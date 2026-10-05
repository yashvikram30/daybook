// DSA track: every problem is from Striver's A2Z DSA Sheet (takeuforward.org). One block per day, in sheet order.
// Basic and core problems are the daily target; pro problems are stretch goals. Links go to LeetCode when the sheet maps one, otherwise to the problem on takeUforward.
window.DSA = [
  {
    t: "Sorting: selection, bubble, insertion and merge sort",
    learn: [
      {
        k: "lab",
        t: "Python tutorial: more control flow tools",
        u: "https://docs.python.org/3/tutorial/controlflow.html",
        n: "The DSA track is in Python. Today's Python lesson is the tutorial, in the learn step; use this page as a reference while you write the sorts.",
      },
      {
        k: "video",
        t: "Big-O Notation - Everything you Need for Coding Interviews",
        u: "https://www.youtube.com/watch?v=rv_ZacJYRFA",
        n: "NeetCode, 15 min.",
      },
      { k: "video", t: "Striver: Selection Sort (lecture)", u: "https://youtu.be/HGk_ypEuS24?t=167" },
    ],
    probs: [
      { t: "Selection Sort", u: "https://takeuforward.org/practice/dsa/selection-sort", d: "M" },
      { t: "Bubble Sort", u: "https://takeuforward.org/practice/dsa/bubble-sort", d: "M" },
      { t: "Insertion Sorting", u: "https://takeuforward.org/practice/dsa/insertion-sorting", d: "M" },
      { t: "Merge Sorting", u: "https://takeuforward.org/practice/dsa/merge-sorting", d: "M" },
    ],
  },
  {
    t: "Sorting: quick sort and the recursive versions",
    learn: [
      {
        k: "docs",
        t: "Python time complexity of list operations",
        u: "https://wiki.python.org/moin/TimeComplexity",
        n: "Lists are the structure you will use in nearly every problem. Know what append, pop, pop(0), insert and slicing cost, then skim dict and set.",
      },
      { k: "video", t: "Striver: Quick Sorting (lecture)", u: "https://youtu.be/WIrA4YexLRQ" },
    ],
    probs: [
      { t: "Quick Sorting", u: "https://takeuforward.org/practice/dsa/quick-sorting", d: "M" },
      {
        t: "Recursive Bubble Sort",
        u: "https://takeuforward.org/practice/dsa/recursive-bubble-sort",
        d: "M",
      },
      {
        t: "Recursive Insertion Sort",
        u: "https://takeuforward.org/practice/dsa/recursive-insertion-sort",
        d: "M",
      },
    ],
  },
  {
    t: "Arrays: scanning and searching basics",
    learn: { k: "video", t: "Striver: Linear Search (lecture)", u: "https://youtu.be/wvcQg43_V8U?t=2465" },
    probs: [
      { t: "Linear Search", u: "https://takeuforward.org/practice/dsa/linear-search", d: "E" },
      { t: "Largest Element", u: "https://takeuforward.org/practice/dsa/largest-element", d: "E" },
      {
        t: "Second Largest Element",
        u: "https://takeuforward.org/practice/dsa/second-largest-element",
        d: "E",
      },
      { t: "Maximum Consecutive Ones", u: "https://leetcode.com/problems/max-consecutive-ones/", d: "E" },
    ],
  },
  {
    t: "Arrays: rotation and in-place edits",
    learn: {
      k: "video",
      t: "Striver: Left Rotate Array by One (lecture)",
      u: "https://youtu.be/wvcQg43_V8U?t=61",
    },
    probs: [
      {
        t: "Left Rotate Array by One",
        u: "https://takeuforward.org/practice/dsa/left-rotate-array-by-one",
        d: "E",
      },
      { t: "Left Rotate Array by K Places", u: "https://leetcode.com/problems/rotate-array/", d: "M" },
      { t: "Move Zeros to End", u: "https://leetcode.com/problems/move-zeroes/", d: "E" },
      {
        t: "Remove duplicates from sorted array",
        u: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        d: "E",
      },
    ],
  },
  {
    t: "Arrays: missing numbers, sorted-array merges and majority element",
    learn: {
      k: "video",
      t: "Striver: Union of two sorted arrays (lecture)",
      u: "https://youtu.be/wvcQg43_V8U?t=2584",
    },
    probs: [
      { t: "Find missing number", u: "https://takeuforward.org/practice/dsa/find-missing-number", d: "E" },
      {
        t: "Union of two sorted arrays",
        u: "https://takeuforward.org/practice/dsa/union-of-two-sorted-arrays",
        d: "M",
      },
      {
        t: "Intersection of two sorted arrays",
        u: "https://takeuforward.org/practice/dsa/intersection-of-two-sorted-arrays",
        d: "M",
      },
      { t: "Majority Element-I", u: "https://leetcode.com/problems/majority-element/", d: "M" },
    ],
  },
  {
    t: "Arrays: leaders, sign rearrangement, spiral matrix and Pascal's triangle",
    learn: { k: "video", t: "Striver: Leaders in an Array (lecture)", u: "https://youtu.be/cHrH9CQ8pmY" },
    probs: [
      { t: "Leaders in an Array", u: "https://takeuforward.org/practice/dsa/leaders-in-an-array", d: "M" },
      {
        t: "Rearrange array elements by sign",
        u: "https://takeuforward.org/practice/dsa/rearrange-array-elements-by-sign",
        d: "M",
      },
      { t: "Print the matrix in spiral manner", u: "https://leetcode.com/problems/spiral-matrix/", d: "M" },
      { t: "Pascal's Triangle I", u: "https://leetcode.com/problems/pascals-triangle/", d: "M" },
    ],
  },
  {
    t: "Hashing: prefix sums and subarray counting",
    learn: [
      {
        k: "video",
        t: "Striver: Longest Consecutive Sequence in an Array (lecture)",
        u: "https://youtu.be/oO5uLE7EUlM",
      },
      {
        k: "docs",
        t: "Python docs: dict, Counter and defaultdict",
        u: "https://docs.python.org/3/library/collections.html",
        n: "A dict is a hash table. Know what lookup, insert and delete cost, and why a Two Sum or a subarray count becomes one pass with one.",
      },
    ],
    probs: [
      {
        t: "Longest Consecutive Sequence in an Array",
        u: "https://leetcode.com/problems/longest-consecutive-sequence/",
        d: "M",
      },
      {
        t: "Longest subarray with sum K",
        u: "https://takeuforward.org/practice/dsa/longest-subarray-with-sum-k",
        d: "M",
      },
      {
        t: "Largest Subarray with Sum 0",
        u: "https://takeuforward.org/practice/dsa/largest-subarray-with-sum-0",
        d: "M",
      },
      {
        t: "Count subarrays with given sum",
        u: "https://leetcode.com/problems/subarray-sum-equals-k/",
        d: "M",
      },
      {
        t: "Count subarrays with given xor K",
        u: "https://takeuforward.org/practice/dsa/count-subarrays-with-given-xor-k",
        d: "H",
      },
    ],
  },
  {
    t: "Arrays: matrix tricks and Pascal's triangle",
    learn: {
      k: "video",
      t: "Striver: Rotate matrix by 90 degrees (lecture)",
      u: "https://youtu.be/Z0R2u6gd3GU",
    },
    probs: [
      { t: "Pascal's Triangle II", u: "https://takeuforward.org/practice/dsa/pascals-triangle-ii", d: "M" },
      { t: "Pascal's Triangle III", u: "https://takeuforward.org/practice/dsa/pascals-triangle-iii", d: "M" },
      { t: "Rotate matrix by 90 degrees", u: "https://leetcode.com/problems/rotate-image/", d: "M" },
      { t: "Set Matrix Zeroes", u: "https://takeuforward.org/practice/dsa/set-matrix-zeroes", d: "M" },
    ],
  },
  {
    t: "Arrays: Two Sum to 4 Sum and the Dutch flag",
    learn: { k: "video", t: "Striver: Two Sum (lecture)", u: "https://youtu.be/UXDSeD9mN-k" },
    probs: [
      { t: "Two Sum", u: "https://leetcode.com/problems/two-sum/", d: "E" },
      { t: "3 Sum", u: "https://leetcode.com/problems/3sum/", d: "M" },
      { t: "4 Sum", u: "https://leetcode.com/problems/4sum/", d: "H" },
      { t: "Sort an array of 0's 1's and 2's", u: "https://leetcode.com/problems/sort-colors/", d: "M" },
    ],
  },
  {
    t: "Arrays: Kadane, permutations and repeating numbers",
    learn: { k: "video", t: "Striver: Kadane's Algorithm (lecture)", u: "https://youtu.be/AHZpyENo7k4" },
    probs: [
      { t: "Kadane's Algorithm", u: "https://takeuforward.org/practice/dsa/kadane's-algorithm", d: "M" },
      { t: "Next Permutation", u: "https://leetcode.com/problems/next-permutation/", d: "M" },
      { t: "Majority Element-II", u: "https://leetcode.com/problems/majority-element-ii/", d: "M" },
      {
        t: "Find the repeating and missing number",
        u: "https://takeuforward.org/practice/dsa/find-the-repeating-and-missing-number",
        d: "M",
      },
    ],
  },
  {
    t: "Arrays: inversions, reverse pairs and subarray products",
    learn: { k: "video", t: "Striver: Count Inversions (lecture)", u: "https://youtu.be/AseUmwVNaoY" },
    probs: [
      { t: "Count Inversions", u: "https://takeuforward.org/practice/dsa/count-inversions", d: "H" },
      { t: "Reverse Pairs", u: "https://leetcode.com/problems/reverse-pairs/", d: "H" },
      {
        t: "Maximum Product Subarray in an Array",
        u: "https://takeuforward.org/practice/dsa/maximum-product-subarray-in-an-array",
        d: "M",
      },
      {
        t: "Merge two sorted arrays without extra space",
        u: "https://takeuforward.org/practice/dsa/merge-two-sorted-arrays-without-extra-space",
        d: "M",
      },
    ],
  },
  {
    t: "Binary search: bounds and insert position",
    learn: {
      k: "video",
      t: "Striver: Search X in sorted array (lecture)",
      u: "https://youtu.be/MHf6awe89xw",
    },
    probs: [
      { t: "Search X in sorted array", u: "https://leetcode.com/problems/binary-search/", d: "E" },
      { t: "Lower Bound", u: "https://takeuforward.org/practice/dsa/lower-bound-", d: "M" },
      { t: "Upper Bound", u: "https://takeuforward.org/practice/dsa/upper-bound", d: "M" },
      { t: "Search insert position", u: "https://leetcode.com/problems/search-insert-position/", d: "E" },
      {
        t: "Floor and Ceil in Sorted Array",
        u: "https://takeuforward.org/practice/dsa/floor-and-ceil-in-sorted-array",
        d: "M",
      },
    ],
  },
  {
    t: "Binary search: rotated sorted arrays",
    learn: {
      k: "video",
      t: "Striver: First and last occurrence (lecture)",
      u: "https://youtu.be/hjR1IYVx9lY",
    },
    probs: [
      {
        t: "First and last occurrence",
        u: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        d: "M",
      },
      {
        t: "Search in rotated sorted array-I",
        u: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        d: "M",
      },
      {
        t: "Search in rotated sorted array-II",
        u: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
        d: "M",
      },
      {
        t: "Find minimum in Rotated Sorted Array",
        u: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        d: "M",
      },
      {
        t: "Find out how many times the array is rotated",
        u: "https://takeuforward.org/practice/dsa/find-out-how-many-times-the-array-is-rotated",
        d: "M",
      },
    ],
  },
  {
    t: "Binary search: counting, roots and divisors",
    learn: {
      k: "video",
      t: "Striver: Single element in sorted array (lecture)",
      u: "https://youtu.be/AZOmHuHadxQ",
    },
    probs: [
      {
        t: "Single element in sorted array",
        u: "https://leetcode.com/problems/single-element-in-a-sorted-array/",
        d: "M",
      },
      {
        t: "Count Occurrences in a Sorted Array",
        u: "https://takeuforward.org/practice/dsa/count-occurrences-in-a-sorted-array",
        d: "M",
      },
      {
        t: "Find square root of a number",
        u: "https://takeuforward.org/practice/dsa/find-square-root-of-a-number",
        d: "M",
      },
      {
        t: "Find Nth root of a number",
        u: "https://takeuforward.org/practice/dsa/find-nth-root-of-a-number",
        d: "M",
      },
      {
        t: "Find the smallest divisor",
        u: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
        d: "M",
      },
    ],
  },
  {
    t: "Binary search on the answer: capacity, days and partitions",
    learn: { k: "video", t: "Striver: Koko eating bananas (lecture)", u: "https://youtu.be/qyfekrNni90" },
    probs: [
      { t: "Koko eating bananas", u: "https://leetcode.com/problems/koko-eating-bananas/", d: "H" },
      {
        t: "Minimum days to make M bouquets",
        u: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
        d: "H",
      },
      {
        t: "Capacity to Ship Packages Within D Days",
        u: "https://takeuforward.org/practice/dsa/capacity-to-ship-packages-within-d-days",
        d: "H",
      },
      {
        t: "Kth Missing Positive Number",
        u: "https://takeuforward.org/practice/dsa/kth-missing-positive-number",
        d: "H",
      },
      { t: "Painter's Partition", u: "https://takeuforward.org/practice/dsa/painters-partition", d: "H" },
    ],
  },
  {
    t: "Binary search on the answer: allocation, peaks and medians",
    learn: { k: "video", t: "Striver: Aggressive Cows (lecture)", u: "https://youtu.be/R_Mfw4ew-Vo" },
    probs: [
      { t: "Aggressive Cows", u: "https://takeuforward.org/practice/dsa/aggressive-cows", d: "H" },
      {
        t: "Book Allocation Problem",
        u: "https://takeuforward.org/practice/dsa/book-allocation-problem",
        d: "H",
      },
      { t: "Find peak element", u: "https://leetcode.com/problems/find-peak-element/", d: "M" },
      {
        t: "Median of 2 sorted arrays",
        u: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        d: "H",
      },
    ],
  },
  {
    t: "Binary search: k-th element, split array and row search",
    learn: {
      k: "video",
      t: "Striver: Kth element of 2 sorted arrays (lecture)",
      u: "https://www.youtube.com/watch?v=nv7F4PiLUzo&list=PLgUwDviBIf0p4ozDR_kJJkONnb1wdx2Ma&index=66",
    },
    probs: [
      {
        t: "Kth element of 2 sorted arrays",
        u: "https://takeuforward.org/practice/dsa/kth-element-of-2-sorted-arrays",
        d: "H",
      },
      {
        t: "Minimize Max Distance to Gas Station",
        u: "https://takeuforward.org/practice/dsa/minimise-max-distance-to-gas-stations",
        d: "H",
      },
      { t: "Split array - largest sum", u: "https://leetcode.com/problems/split-array-largest-sum/", d: "H" },
      {
        t: "Find row with maximum 1's",
        u: "https://takeuforward.org/practice/dsa/find-row-with-maximum-1's",
        d: "M",
      },
    ],
  },
  {
    t: "Binary search: 2D matrices",
    learn: { k: "video", t: "Striver: Search in a 2D Matrix (lecture)", u: "https://youtu.be/ZYpYur0znng" },
    probs: [
      { t: "Search in a 2D Matrix", u: "https://leetcode.com/problems/search-a-2d-matrix/", d: "M" },
      { t: "Search in 2D matrix - II", u: "https://leetcode.com/problems/search-a-2d-matrix-ii/", d: "M" },
      { t: "Find Peak Element - II", u: "https://leetcode.com/problems/find-a-peak-element-ii/", d: "M" },
      { t: "Matrix Median", u: "https://takeuforward.org/practice/dsa/matrix-median", d: "H" },
    ],
  },
  {
    t: "Strings: parentheses, conversions and substrings",
    learn: [
      {
        k: "read",
        t: "Python Unicode HOWTO",
        u: "https://docs.python.org/3/howto/unicode.html",
        n: "Know what a Python str is, and how it differs from bytes, before you index into one.",
      },
      {
        k: "video",
        t: "Valid Parentheses - Stack - Leetcode 20 (NeetCode)",
        u: "https://www.youtube.com/watch?v=WTzjTskDFMg",
        n: "The stack pattern behind the parentheses problems.",
      },
    ],
    probs: [
      {
        t: "Remove Outermost Parentheses",
        u: "https://takeuforward.org/practice/dsa/remove-outermost-parentheses",
        d: "M",
      },
      {
        t: "Maximum Nesting Depth of the Parentheses",
        u: "https://takeuforward.org/practice/dsa/maximum-nesting-depth-of-the-parentheses",
        d: "M",
      },
      { t: "Roman to Integer", u: "https://takeuforward.org/practice/dsa/roman-to-integer", d: "E" },
      {
        t: "String to Integer (atoi)",
        u: "https://takeuforward.org/practice/dsa/string-to-integer-atoi",
        d: "M",
      },
      {
        t: "Longest Palindromic Substring",
        u: "https://takeuforward.org/practice/dsa/longest-palindromic-substring",
        d: "M",
      },
      {
        t: "Sum of Beauty of All Substrings",
        u: "https://takeuforward.org/practice/dsa/sum-of-beauty-of-all-substrings",
        d: "M",
      },
    ],
  },
  {
    t: "Greedy: assignment, change and jump problems",
    learn: {
      k: "video",
      t: "Striver: Assign Cookies (lecture)",
      u: "https://youtu.be/DIX2p7vb9co?si=GofAIDimue-Av0Fi",
    },
    probs: [
      { t: "Assign Cookies", u: "https://leetcode.com/problems/assign-cookies/", d: "M" },
      { t: "Lemonade Change", u: "https://leetcode.com/problems/lemonade-change/", d: "M" },
      { t: "Fractional Knapsack", u: "https://takeuforward.org/practice/dsa/fractional-knapsack", d: "M" },
      { t: "Jump Game - I", u: "https://leetcode.com/problems/jump-game/", d: "M" },
      { t: "Shortest Job First", u: "https://takeuforward.org/practice/dsa/shortest-job-first", d: "M" },
    ],
  },
  {
    t: "Greedy: scheduling and intervals",
    learn: {
      k: "video",
      t: "Striver: Job sequencing Problem (lecture)",
      u: "https://youtu.be/QbwltemZbRg?si=wvcemJ5BLPlTRmkG",
    },
    probs: [
      {
        t: "Job sequencing Problem",
        u: "https://takeuforward.org/practice/dsa/job-sequencing-problem",
        d: "M",
      },
      {
        t: "N meetings in one room",
        u: "https://takeuforward.org/practice/dsa/n-meetings-in-one-room",
        d: "M",
      },
      {
        t: "Non-overlapping Intervals",
        u: "https://leetcode.com/problems/non-overlapping-intervals/",
        d: "M",
      },
      { t: "Insert Interval", u: "https://leetcode.com/problems/insert-interval/", d: "M" },
      { t: "Merge Intervals", u: "https://takeuforward.org/practice/dsa/merge-intervals", d: "M" },
    ],
  },
  {
    t: "Greedy: platforms, brackets, candy and jumps",
    learn: {
      k: "video",
      t: "Striver: Minimum number of platforms required for a railway (lecture)",
      u: "https://youtu.be/AsGzwR_FWok?si=165acXU_dtqOHuo9",
    },
    probs: [
      {
        t: "Minimum number of platforms required for a railway",
        u: "https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/",
        d: "M",
      },
      {
        t: "Valid Paranthesis Checker",
        u: "https://takeuforward.org/practice/dsa/valid-paranthesis-checker",
        d: "H",
      },
      { t: "Candy", u: "https://leetcode.com/problems/candy/", d: "H" },
      { t: "Jump Game II", u: "https://takeuforward.org/practice/dsa/jump-game-ii", d: "H" },
    ],
  },
  {
    t: "Sliding window: fixed windows and longest substrings",
    learn: {
      k: "video",
      t: "Striver: Maximum Points You Can Obtain from Cards (lecture)",
      u: "https://youtu.be/pBWCOCS636U?si=-X64rY67noxvOwrG",
    },
    probs: [
      {
        t: "Maximum Points You Can Obtain from Cards",
        u: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
        d: "M",
      },
      {
        t: "Longest Substring Without Repeating Characters",
        u: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        d: "M",
      },
      { t: "Max Consecutive Ones III", u: "https://leetcode.com/problems/max-consecutive-ones-iii/", d: "M" },
      { t: "Fruit Into Baskets", u: "https://leetcode.com/problems/fruit-into-baskets/", d: "M" },
    ],
  },
  {
    t: "Sliding window: minimum windows and distinct characters",
    learn: {
      k: "video",
      t: "Striver: Longest Substring With At Most K Distinct Characters (lecture)",
      u: "https://youtu.be/teM9ZsVRQyc?si=Kh0_u6aCkkBU3Q33",
    },
    probs: [
      {
        t: "Longest Substring With At Most K Distinct Characters",
        u: "https://takeuforward.org/practice/dsa/longest-substring-with-at-most-k-distinct-characters",
        d: "H",
      },
      {
        t: "Longest Repeating Character Replacement",
        u: "https://leetcode.com/problems/longest-repeating-character-replacement/",
        d: "H",
      },
      { t: "Minimum Window Substring", u: "https://leetcode.com/problems/minimum-window-substring/", d: "H" },
      {
        t: "Minimum Window Subsequence",
        u: "https://takeuforward.org/practice/dsa/minimum-window-subsequence",
        d: "H",
      },
    ],
  },
  {
    t: "Sliding window: counting subarrays and substrings",
    learn: {
      k: "video",
      t: "Striver: Number of Substrings Containing All Three Characters (lecture)",
      u: "https://youtu.be/xtqN4qlgr8s?si=kuaLHVOLXhh5Z2tW",
    },
    probs: [
      {
        t: "Number of Substrings Containing All Three Characters",
        u: "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
        d: "M",
      },
      {
        t: "Binary Subarrays With Sum",
        u: "https://leetcode.com/problems/binary-subarrays-with-sum/",
        d: "M",
      },
      {
        t: "Count number of Nice subarrays",
        u: "https://leetcode.com/problems/count-number-of-nice-subarrays/",
        d: "H",
      },
      {
        t: "Subarrays with K Different Integers",
        u: "https://takeuforward.org/practice/dsa/subarrays-with-k-different-integers",
        d: "H",
      },
    ],
  },
  {
    t: "Stacks and queues: implementations",
    learn: {
      k: "video",
      t: "Striver: Implement Stack using Arrays (lecture)",
      u: "https://youtu.be/tqQ5fTamIN4?si=ofLt8Zt1ZvhikZ6w",
    },
    probs: [
      {
        t: "Implement Stack using Arrays",
        u: "https://takeuforward.org/practice/dsa/implement-stack-using-arrays",
        d: "M",
      },
      {
        t: "Implement Queue using Arrays",
        u: "https://takeuforward.org/practice/dsa/implement-queue-using-arrays",
        d: "M",
      },
      {
        t: "Implement Stack using Queue",
        u: "https://takeuforward.org/practice/dsa/implement-stack-using-queue",
        d: "M",
      },
      {
        t: "Implement Queue using Stack",
        u: "https://leetcode.com/problems/implement-queue-using-stacks/",
        d: "M",
      },
      {
        t: "Implement stack using Linkedlist",
        u: "https://takeuforward.org/practice/dsa/implement-stack-using-linkedlist",
        d: "M",
      },
    ],
  },
  {
    t: "Stacks and queues: linked-list queue, brackets and expression conversion",
    learn: {
      k: "video",
      t: "Striver: Implement queue using Linkedlist (lecture)",
      u: "https://youtu.be/tqQ5fTamIN4?si=ofLt8Zt1ZvhikZ6w",
    },
    probs: [
      {
        t: "Implement queue using Linkedlist",
        u: "https://takeuforward.org/practice/dsa/implement-queue-using-linkedlist",
        d: "M",
      },
      { t: "Balanced Paranthesis", u: "https://leetcode.com/problems/valid-parentheses/", d: "M" },
      {
        t: "Infix to Postfix Conversion",
        u: "https://takeuforward.org/practice/dsa/infix-to-postfix-conversion",
        d: "M",
      },
      {
        t: "Infix to Prefix Conversion",
        u: "https://takeuforward.org/practice/dsa/infix-to-prefix-conversion",
        d: "M",
      },
      {
        t: "Prefix to Infix Conversion",
        u: "https://takeuforward.org/practice/dsa/prefix-to-infix-conversion",
        d: "M",
      },
    ],
  },
  {
    t: "Stacks and queues: conversions and next greater element",
    learn: {
      k: "video",
      t: "Striver: Next Greater Element (lecture)",
      u: "https://youtu.be/e7XQLtOQM3I?si=QdcHpTtx6gAHsext",
    },
    probs: [
      {
        t: "Prefix to Postfix Conversion",
        u: "https://takeuforward.org/practice/dsa/prefix-to-postfix-conversion",
        d: "M",
      },
      {
        t: "Postfix to Infix Conversion",
        u: "https://takeuforward.org/practice/dsa/postfix-to-infix-conversion",
        d: "M",
      },
      {
        t: "Postfix to Prefix Conversion",
        u: "https://takeuforward.org/practice/dsa/postfix-to-prefix-conversion",
        d: "M",
      },
      { t: "Next Greater Element", u: "https://leetcode.com/problems/next-greater-element-i/", d: "M" },
    ],
  },
  {
    t: "Stacks and queues: monotonic stack applications",
    learn: {
      k: "video",
      t: "Striver: Next Greater Element - 2 (lecture)",
      u: "https://youtu.be/7PrncD7v9YQ?si=UkBc7eVy9HGlBpeW",
    },
    probs: [
      { t: "Next Greater Element - 2", u: "https://leetcode.com/problems/next-greater-element-ii/", d: "M" },
      { t: "Asteroid Collision", u: "https://leetcode.com/problems/asteroid-collision/", d: "M" },
      { t: "Sum of Subarray Minimums", u: "https://leetcode.com/problems/sum-of-subarray-minimums/", d: "M" },
      { t: "Sum of Subarray Ranges", u: "https://leetcode.com/problems/sum-of-subarray-ranges/", d: "M" },
    ],
  },
  {
    t: "Stacks and queues: next smaller, min stack and window maximum",
    learn: {
      k: "video",
      t: "Striver: Remove K Digits (lecture)",
      u: "https://youtu.be/jmbuRzYPGrg?si=WN387gwQ7aXWkUao",
    },
    probs: [
      { t: "Remove K Digits", u: "https://leetcode.com/problems/remove-k-digits/", d: "M" },
      { t: "Next Smaller Element", u: "https://takeuforward.org/practice/dsa/next-smaller-element", d: "M" },
      { t: "Implement Min Stack", u: "https://takeuforward.org/practice/dsa/implement-min-stack", d: "M" },
      {
        t: "Sliding Window Maximum",
        u: "https://takeuforward.org/practice/dsa/sliding-window-maximum",
        d: "H",
      },
    ],
  },
  {
    t: "Stacks and queues: rainwater, histograms and stock span",
    learn: {
      k: "video",
      t: "Striver: Trapping Rainwater (lecture)",
      u: "https://youtu.be/1_5VuquLbXg?si=NFG6df318_6OtGvg",
    },
    probs: [
      { t: "Trapping Rainwater", u: "https://leetcode.com/problems/trapping-rain-water/", d: "H" },
      {
        t: "Largest rectangle in a histogram",
        u: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        d: "H",
      },
      { t: "Maximum Rectangles", u: "https://takeuforward.org/practice/dsa/maximum-rectangles", d: "H" },
      { t: "Stock span problem", u: "https://leetcode.com/problems/online-stock-span/", d: "M" },
    ],
  },
  {
    t: "Stacks and queues: celebrity, LRU and LFU caches",
    learn: {
      k: "video",
      t: "Striver: Celebrity Problem (lecture)",
      u: "https://youtu.be/cEadsbTeze4?si=olXYfOs7l-SEn2zl",
    },
    probs: [
      { t: "Celebrity Problem", u: "https://takeuforward.org/practice/dsa/celebrity-problem", d: "M" },
      { t: "LRU Cache", u: "https://takeuforward.org/practice/dsa/lru-cache", d: "H" },
      { t: "LFU Cache", u: "https://takeuforward.org/practice/dsa/lfu-cache", d: "H" },
      {
        t: "Number of Greater Elements to the Right",
        u: "https://takeuforward.org/practice/dsa/number-of-greater-elements-to-the-right",
        d: "M",
      },
    ],
  },
  {
    t: "Binary trees: traversals",
    learn: [
      { k: "video", t: "Striver: Inorder Traversal (lecture)", u: "https://youtu.be/lxTGsVXjwvM" },
      {
        k: "video",
        t: "Striver: Parameterised and functional recursion",
        u: "https://www.youtube.com/watch?v=69ZCDFy-OUo",
        n: "Trees are recursion with two calls per node. If a recursive call still feels like magic, watch this and the next one first.",
      },
      {
        k: "video",
        t: "Striver: Multiple recursion calls",
        u: "https://www.youtube.com/watch?v=kvRjNm4rVBE",
        n: "The same shape as every tree traversal, and as the DP problems later.",
      },
    ],
    probs: [
      { t: "Inorder Traversal", u: "https://takeuforward.org/practice/dsa/inorder-traversal", d: "E" },
      { t: "Preorder Traversal", u: "https://takeuforward.org/practice/dsa/preorder-traversal", d: "E" },
      { t: "Postorder Traversal", u: "https://takeuforward.org/practice/dsa/postorder-traversal", d: "E" },
      {
        t: "Level Order Traversal",
        u: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        d: "M",
      },
      {
        t: "Pre, Post, Inorder in one traversal",
        u: "https://takeuforward.org/practice/dsa/pre%2C-post%2C-inorder-in-one-traversal",
        d: "M",
      },
    ],
  },
  {
    t: "Binary trees: depth, balance, diameter and path sum",
    learn: { k: "video", t: "Striver: Maximum Depth in BT (lecture)", u: "https://youtu.be/eD3tmO66aBA" },
    probs: [
      { t: "Maximum Depth in BT", u: "https://takeuforward.org/practice/dsa/maximum-depth-in-bt", d: "M" },
      { t: "Check if two trees are identical or not", u: "https://leetcode.com/problems/same-tree/", d: "M" },
      {
        t: "Check for balanced binary tree",
        u: "https://leetcode.com/problems/balanced-binary-tree/",
        d: "M",
      },
      { t: "Diameter of Binary Tree", u: "https://leetcode.com/problems/diameter-of-binary-tree/", d: "M" },
      { t: "Maximum path sum", u: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", d: "H" },
    ],
  },
  {
    t: "Binary trees: symmetry, zig-zag, boundary and vertical order",
    learn: {
      k: "video",
      t: "Striver: Check for symmetrical BTs (lecture)",
      u: "https://www.youtube.com/watch?v=nKggNAiEpBE",
    },
    probs: [
      { t: "Check for symmetrical BTs", u: "https://leetcode.com/problems/symmetric-tree/", d: "M" },
      {
        t: "Children Sum Property in Binary Tree",
        u: "https://takeuforward.org/practice/dsa/children-sum-property-in-binary-tree",
        d: "M",
      },
      {
        t: "Zig Zag or Spiral Traversal",
        u: "https://takeuforward.org/practice/dsa/zig-zag-or-spiral-traversal",
        d: "M",
      },
      { t: "Boundary Traversal", u: "https://takeuforward.org/practice/dsa/boundary-traversal", d: "M" },
      {
        t: "Vertical Order Traversal",
        u: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
        d: "H",
      },
    ],
  },
  {
    t: "Binary trees: views and root-to-leaf paths",
    learn: { k: "video", t: "Striver: Top View of BT (lecture)", u: "https://youtu.be/Et9OCDNvJ78" },
    probs: [
      { t: "Top View of BT", u: "https://takeuforward.org/practice/dsa/top-view-of-bt", d: "M" },
      { t: "Bottom view of BT", u: "https://takeuforward.org/practice/dsa/bottom-view-of-bt", d: "M" },
      { t: "Right/Left View of BT", u: "https://leetcode.com/problems/binary-tree-right-side-view/", d: "M" },
      {
        t: "Print root to leaf path in BT",
        u: "https://takeuforward.org/practice/dsa/print-root-to-leaf-path-in-bt",
        d: "M",
      },
    ],
  },
  {
    t: "Binary trees: LCA, width, distance K and burning a tree",
    learn: { k: "video", t: "Striver: LCA in BT (lecture)", u: "https://youtu.be/_-QHfMDde90" },
    probs: [
      { t: "LCA in BT", u: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", d: "H" },
      { t: "Maximum Width of BT", u: "https://takeuforward.org/practice/dsa/maximum-width-of-bt", d: "H" },
      {
        t: "Print all nodes at a distance of K in BT",
        u: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
        d: "H",
      },
      {
        t: "Minimum time taken to burn the BT from a given Node",
        u: "https://takeuforward.org/practice/dsa/minimum-time-taken-to-burn-the-bt-from-a-given-node",
        d: "H",
      },
    ],
  },
  {
    t: "Binary trees: counting, flattening and construction",
    learn: {
      k: "video",
      t: "Striver: Count total nodes in a complete BT (lecture)",
      u: "https://youtu.be/u-yWemKGWO0",
    },
    probs: [
      {
        t: "Count total nodes in a complete BT",
        u: "https://leetcode.com/problems/count-complete-tree-nodes/",
        d: "M",
      },
      {
        t: "Flatten Binary Tree to Linked List",
        u: "https://takeuforward.org/practice/dsa/flatten-binary-tree-to-linked-list",
        d: "H",
      },
      {
        t: "Requirements needed to construct a unique BT",
        u: "https://takeuforward.org/practice/dsa/requirements-needed-to-construct-a-unique-bt",
        d: "M",
      },
      {
        t: "Construct a BT from Preorder and Inorder",
        u: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        d: "M",
      },
    ],
  },
  {
    t: "Binary trees: construction, serialization and Morris traversal",
    learn: {
      k: "video",
      t: "Striver: Construct a BT from Postorder and Inorder (lecture)",
      u: "https://youtu.be/LgLRTaEMRVc",
    },
    probs: [
      {
        t: "Construct a BT from Postorder and Inorder",
        u: "https://takeuforward.org/practice/dsa/construct-a-bt-from-postorder-and-inorder",
        d: "M",
      },
      {
        t: "Serialize and De-serialize BT",
        u: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        d: "H",
      },
      {
        t: "Morris Inorder Traversal",
        u: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        d: "H",
      },
      {
        t: "Morris Preorder Traversal",
        u: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
        d: "H",
      },
    ],
  },
  {
    t: "Binary search trees: search, insert, delete and k-th element",
    learn: { k: "video", t: "Striver: Search in BST (lecture)", u: "https://youtu.be/KcNt6v_56cc" },
    probs: [
      { t: "Search in BST", u: "https://leetcode.com/problems/search-in-a-binary-search-tree/", d: "E" },
      {
        t: "Floor and Ceil in a BST",
        u: "https://takeuforward.org/practice/dsa/floor-and-ceil-in-a-bst",
        d: "M",
      },
      {
        t: "Insert a given node in BST",
        u: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
        d: "M",
      },
      { t: "Delete a node in BST", u: "https://leetcode.com/problems/delete-node-in-a-bst/", d: "M" },
      {
        t: "Kth Smallest and Largest element in BST",
        u: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        d: "M",
      },
    ],
  },
  {
    t: "Binary search trees: validation, LCA, construction and successor",
    learn: {
      k: "video",
      t: "Striver: Check if a tree is a BST or not (lecture)",
      u: "https://youtu.be/f-sj7I5oXEI",
    },
    probs: [
      {
        t: "Check if a tree is a BST or not",
        u: "https://leetcode.com/problems/validate-binary-search-tree/",
        d: "M",
      },
      {
        t: "LCA in BST",
        u: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        d: "M",
      },
      {
        t: "Construct a BST from a preorder traversal",
        u: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
        d: "M",
      },
      {
        t: "Inorder successor and predecessor in BST",
        u: "https://takeuforward.org/practice/dsa/inorder-successor-and-predecessor-in-bst",
        d: "M",
      },
    ],
  },
  {
    t: "Binary search trees: iterator, two-sum, recovery and largest BST",
    learn: { k: "video", t: "Striver: BST iterator (lecture)", u: "https://youtu.be/D2jMcmxU4bs" },
    probs: [
      { t: "BST iterator", u: "https://leetcode.com/problems/binary-search-tree-iterator/", d: "M" },
      { t: "Two sum in BST", u: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/", d: "M" },
      {
        t: "Correct BST with two nodes swapped",
        u: "https://leetcode.com/problems/recover-binary-search-tree/",
        d: "H",
      },
      {
        t: "Largest BST in Binary Tree",
        u: "https://takeuforward.org/practice/dsa/largest-bst-in-binary-tree",
        d: "H",
      },
    ],
  },
  {
    t: "Graphs: traversals, components and islands",
    learn: { k: "video", t: "Striver: Traversal Techniques (lecture)", u: "https://youtu.be/Qzf1a--rhp8" },
    probs: [
      { t: "Traversal Techniques", u: "https://takeuforward.org/practice/dsa/traversal-techniques", d: "M" },
      { t: "Connected Components", u: "https://takeuforward.org/practice/dsa/connected-components", d: "M" },
      { t: "Number of provinces", u: "https://leetcode.com/problems/number-of-provinces/", d: "M" },
      { t: "Number of islands", u: "https://takeuforward.org/practice/dsa/number-of-islands", d: "M" },
      { t: "Flood fill algorithm", u: "https://takeuforward.org/practice/dsa/flood-fill-algorithm", d: "M" },
    ],
  },
  {
    t: "Graphs: multi-source BFS and grid problems",
    learn: { k: "video", t: "Striver: Number of enclaves (lecture)", u: "https://youtu.be/rxKcepXQgU4" },
    probs: [
      { t: "Number of enclaves", u: "https://leetcode.com/problems/number-of-enclaves/", d: "M" },
      { t: "Rotten Oranges", u: "https://leetcode.com/problems/rotting-oranges/", d: "M" },
      { t: "Distance of nearest cell having one", u: "https://leetcode.com/problems/01-matrix/", d: "M" },
      { t: "Surrounded Regions", u: "https://leetcode.com/problems/surrounded-regions/", d: "M" },
      {
        t: "Number of distinct islands",
        u: "https://takeuforward.org/practice/dsa/number-of-distinct-islands",
        d: "M",
      },
    ],
  },
  {
    t: "Graphs: cycle detection, bipartite graphs and topological sort",
    learn: {
      k: "video",
      t: "Striver: Detect a cycle in an undirected graph (lecture)",
      u: "https://youtu.be/zQ3zgFypzX4",
    },
    probs: [
      {
        t: "Detect a cycle in an undirected graph",
        u: "https://takeuforward.org/practice/dsa/detect-a-cycle-in-an-undirected-graph",
        d: "M",
      },
      { t: "Bipartite graph", u: "https://takeuforward.org/practice/dsa/bipartite-graph", d: "M" },
      {
        t: "Topological sort or Kahn's algorithm",
        u: "https://takeuforward.org/practice/dsa/topological-sort-or-kahns-algorithm",
        d: "M",
      },
      {
        t: "Detect a cycle in a directed graph",
        u: "https://takeuforward.org/practice/dsa/detect-a-cycle-in-a-directed-graph",
        d: "M",
      },
      {
        t: "Find eventual safe states",
        u: "https://leetcode.com/problems/find-eventual-safe-states/",
        d: "H",
      },
    ],
  },
  {
    t: "Graphs: course scheduling, alien dictionary and shortest paths in DAGs",
    learn: { k: "video", t: "Striver: Course Schedule I (lecture)", u: "https://youtu.be/WAOfKpxYHR8" },
    probs: [
      { t: "Course Schedule I", u: "https://leetcode.com/problems/course-schedule/", d: "H" },
      { t: "Course Schedule II", u: "https://leetcode.com/problems/course-schedule-ii/", d: "H" },
      { t: "Alien Dictionary", u: "https://takeuforward.org/practice/dsa/alient-dictionary", d: "H" },
      { t: "Shortest path in DAG", u: "https://takeuforward.org/practice/dsa/shortest-path-in-dag", d: "M" },
      {
        t: "Shortest path in undirected graph with unit weights",
        u: "https://takeuforward.org/practice/dsa/shortest-path-in-undirected-graph-with-unit-weights",
        d: "M",
      },
    ],
  },
  {
    t: "Graphs: word ladder and Dijkstra",
    learn: [
      { k: "video", t: "Striver: Word ladder I (lecture)", u: "https://youtu.be/tRPda0rcf8E" },
      {
        k: "docs",
        t: "Python module heapq",
        u: "https://docs.python.org/3/library/heapq.html",
        n: "Dijkstra needs a priority queue, and heapq is Python's. Read the priority queue implementation notes in this page before writing the algorithm.",
      },
    ],
    probs: [
      { t: "Word ladder I", u: "https://leetcode.com/problems/word-ladder/", d: "H" },
      { t: "Word ladder II", u: "https://leetcode.com/problems/word-ladder-ii/", d: "H" },
      { t: "Dijkstra's algorithm", u: "https://takeuforward.org/practice/dsa/dijkstra's-algorithm", d: "M" },
      { t: "Print Shortest Path", u: "https://takeuforward.org/practice/dsa/print-shortest-path-", d: "M" },
    ],
  },
  {
    t: "Graphs: grid shortest paths and bounded stops",
    learn: {
      k: "video",
      t: "Striver: Shortest Distance in a Binary Maze (lecture)",
      u: "https://www.youtube.com/watch?v=U5Mw4eyUmw4&list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn&index=36",
    },
    probs: [
      {
        t: "Shortest Distance in a Binary Maze",
        u: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
        d: "M",
      },
      { t: "Path with minimum effort", u: "https://leetcode.com/problems/path-with-minimum-effort/", d: "M" },
      {
        t: "Cheapest flight within K stops",
        u: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        d: "H",
      },
      {
        t: "Minimum multiplications to reach end",
        u: "https://takeuforward.org/practice/dsa/minimum-multiplications-to-reach-end",
        d: "H",
      },
    ],
  },
  {
    t: "Dynamic programming: 1D, climbing stairs and house robber",
    learn: { k: "video", t: "Striver: Climbing stairs (lecture)", u: "https://youtu.be/mLfjzJsN8us" },
    probs: [
      { t: "Climbing stairs", u: "https://leetcode.com/problems/climbing-stairs/", d: "M" },
      { t: "Frog Jump", u: "https://takeuforward.org/practice/dsa/frog-jump", d: "M" },
      {
        t: "Frog jump with K distances",
        u: "https://takeuforward.org/practice/dsa/frog-jump-with-k-distances",
        d: "M",
      },
      {
        t: "Maximum sum of non adjacent elements",
        u: "https://takeuforward.org/practice/dsa/maximum-sum-of-non-adjacent-elements",
        d: "M",
      },
      { t: "House robber", u: "https://leetcode.com/problems/house-robber/", d: "M" },
    ],
  },
  {
    t: "Dynamic programming: grids and triangles",
    learn: {
      k: "video",
      t: "Striver: Ninja's training (lecture)",
      u: "https://www.youtube.com/watch?v=AE39gJYuRog",
    },
    probs: [
      { t: "Ninja's training", u: "https://takeuforward.org/practice/dsa/ninja's-training", d: "M" },
      { t: "Grid unique paths", u: "https://leetcode.com/problems/unique-paths/", d: "M" },
      { t: "Unique paths II", u: "https://leetcode.com/problems/unique-paths-ii/", d: "H" },
      { t: "Minimum Falling Path Sum", u: "https://leetcode.com/problems/minimum-falling-path-sum/", d: "M" },
      { t: "Triangle", u: "https://leetcode.com/problems/triangle/", d: "M" },
    ],
  },
  {
    t: "Dynamic programming: cherry pickup and stock problems",
    learn: {
      k: "video",
      t: "Striver: Cherry pickup II (lecture)",
      u: "https://leetcode.com/problems/cherry-pickup-ii/",
    },
    probs: [
      { t: "Cherry pickup II", u: "https://takeuforward.org/practice/dsa/cherry-pickup-ii", d: "H" },
      {
        t: "Best time to buy and sell stock",
        u: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        d: "M",
      },
      {
        t: "Best time to buy and sell stock II",
        u: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
        d: "M",
      },
      {
        t: "Best time to buy and sell stock III",
        u: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
        d: "H",
      },
      {
        t: "Best time to buy and sell stock IV",
        u: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
        d: "H",
      },
    ],
  },
  {
    t: "Dynamic programming: stock variants and subset sum",
    learn: {
      k: "video",
      t: "Striver: Best time to buy and sell stock with transaction fees (lecture)",
      u: "https://youtu.be/k4eK-vEmnKg",
    },
    probs: [
      {
        t: "Best time to buy and sell stock with transaction fees",
        u: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
        d: "M",
      },
      {
        t: "Best Time to Buy and Sell Stock with Cooldown",
        u: "https://takeuforward.org/practice/dsa/best-time-to-buy-and-sell-stock-with-cooldown",
        d: "M",
      },
      {
        t: "Subset sum equals to target",
        u: "https://takeuforward.org/practice/dsa/subset-sum-equals-to-target",
        d: "M",
      },
      {
        t: "Partition equal subset sum",
        u: "https://takeuforward.org/practice/dsa/partition-equal-subset-sum",
        d: "M",
      },
    ],
  },
  {
    t: "Dynamic programming: partitions, counting subsets and knapsack",
    learn: {
      k: "video",
      t: "Striver: Partition a set into two subsets with minimum absolute sum difference (lecture)",
      u: "https://www.youtube.com/watch?v=GS_OqZb2CWc",
    },
    probs: [
      {
        t: "Partition a set into two subsets with minimum absolute sum difference",
        u: "https://takeuforward.org/practice/dsa/partition-a-set-into-two-subsets-with-minimum-absolute-sum-difference",
        d: "H",
      },
      {
        t: "Count subsets with sum K",
        u: "https://takeuforward.org/practice/dsa/count-subsets-with-sum-k",
        d: "M",
      },
      {
        t: "Count partitions with given difference",
        u: "https://takeuforward.org/practice/dsa/count-partitions-with-given-difference",
        d: "M",
      },
      { t: "0 and 1 Knapsack", u: "https://takeuforward.org/practice/dsa/0-and-1-knapsack", d: "M" },
    ],
  },
  {
    t: "Dynamic programming: coin problems and unbounded knapsack",
    learn: {
      k: "video",
      t: "Striver: Minimum coins (lecture)",
      u: "https://www.youtube.com/watch?v=myPeWb3Y68A",
    },
    probs: [
      { t: "Minimum coins", u: "https://takeuforward.org/practice/dsa/minimum-coins", d: "M" },
      { t: "Target sum", u: "https://takeuforward.org/practice/dsa/target-sum", d: "M" },
      { t: "Coin change II", u: "https://leetcode.com/problems/coin-change-ii/", d: "H" },
      { t: "Unbounded knapsack", u: "https://takeuforward.org/practice/dsa/unbounded-knapsack", d: "M" },
    ],
  },
  {
    t: "Dynamic programming: rod cutting and longest increasing subsequence",
    learn: { k: "video", t: "Striver: Rod cutting problem (lecture)", u: "https://youtu.be/mO8XpGoJwuo" },
    probs: [
      { t: "Rod cutting problem", u: "https://takeuforward.org/practice/dsa/rod-cutting-problem", d: "H" },
      {
        t: "Longest Increasing Subsequence",
        u: "https://takeuforward.org/practice/dsa/longest-increasing-subsequence",
        d: "M",
      },
      {
        t: "Print Longest Increasing Subsequence",
        u: "https://takeuforward.org/practice/dsa/print-longest-increasing-subsequence",
        d: "H",
      },
      { t: "Largest Divisible Subset", u: "https://leetcode.com/problems/largest-divisible-subset/", d: "M" },
    ],
  },
  {
    t: "Dynamic programming: LIS variants and longest common subsequence",
    learn: { k: "video", t: "Striver: Longest String Chain (lecture)", u: "https://youtu.be/YY8iBaYcc4g" },
    probs: [
      { t: "Longest String Chain", u: "https://takeuforward.org/practice/dsa/longest-string-chain", d: "M" },
      {
        t: "Longest Bitonic Subsequence",
        u: "https://takeuforward.org/practice/dsa/longest-bitonic-subsequence",
        d: "M",
      },
      {
        t: "Number of Longest Increasing Subsequences",
        u: "https://takeuforward.org/practice/dsa/number-of-longest-increasing-subsequences",
        d: "M",
      },
      {
        t: "Longest common subsequence",
        u: "https://takeuforward.org/practice/dsa/longest-common-subsequence",
        d: "M",
      },
    ],
  },
  {
    t: "Dynamic programming on strings: substrings, palindromes and conversions",
    learn: {
      k: "video",
      t: "Striver: Longest common substring (lecture)",
      u: "https://youtu.be/_wP9mWNPL5w",
    },
    probs: [
      {
        t: "Longest common substring",
        u: "https://takeuforward.org/practice/dsa/longest-common-substring",
        d: "M",
      },
      {
        t: "Longest palindromic subsequence",
        u: "https://takeuforward.org/practice/dsa/longest-palindromic-subsequence",
        d: "M",
      },
      {
        t: "Minimum insertions to make string palindrome",
        u: "https://takeuforward.org/practice/dsa/minimum-insertions-to-make-string-palindrome",
        d: "H",
      },
      {
        t: "Minimum insertions or deletions to convert string A to B",
        u: "https://takeuforward.org/practice/dsa/minimum-insertions-or-deletions-to-convert-string-a-to-b",
        d: "M",
      },
    ],
  },
  {
    t: "Dynamic programming on strings: supersequences, edit distance and matching",
    learn: {
      k: "video",
      t: "Striver: Shortest common supersequence (lecture)",
      u: "https://youtu.be/xElxAuBcvsU",
    },
    probs: [
      {
        t: "Shortest common supersequence",
        u: "https://takeuforward.org/practice/dsa/shortest-common-supersequence",
        d: "H",
      },
      {
        t: "Distinct subsequences",
        u: "https://takeuforward.org/practice/dsa/distinct-subsequences",
        d: "H",
      },
      { t: "Edit distance", u: "https://takeuforward.org/practice/dsa/edit-distance", d: "H" },
      { t: "Wildcard matching", u: "https://takeuforward.org/practice/dsa/wildcard-matching", d: "H" },
    ],
  },
  {
    t: "Dynamic programming: word break, palindromic subsequences and matrix chain",
    learn: {
      k: "video",
      t: "Striver: Matrix chain multiplication (lecture)",
      u: "https://youtu.be/vRVfmbCFW7Y",
    },
    probs: [
      { t: "Word Break", u: "https://takeuforward.org/practice/dsa/word-break", d: "M" },
      {
        t: "Count Palindromic Subsequences",
        u: "https://takeuforward.org/practice/dsa/count-palindromic-subsequences",
        d: "H",
      },
      {
        t: "Matrix chain multiplication",
        u: "https://takeuforward.org/practice/dsa/matrix-chain-multiplication",
        d: "H",
      },
      { t: "Burst balloons", u: "https://takeuforward.org/practice/dsa/burst-balloons", d: "H" },
    ],
  },
  {
    t: "Dynamic programming: partitioning and interval problems",
    learn: {
      k: "video",
      t: "Striver: Palindrome partitioning II (lecture)",
      u: "https://youtu.be/_H8V5hJUGd0",
    },
    probs: [
      {
        t: "Palindrome partitioning II",
        u: "https://leetcode.com/problems/palindrome-partitioning-ii/",
        d: "H",
      },
      {
        t: "Partition Array for Maximum Sum",
        u: "https://takeuforward.org/practice/dsa/partition-array-for-maximum-sum",
        d: "H",
      },
      {
        t: "Minimum cost to cut the stick",
        u: "https://takeuforward.org/practice/dsa/minimum-cost-to-cut-the-stick",
        d: "H",
      },
      {
        t: "Different Ways to Evaluate a Boolean Expression",
        u: "https://takeuforward.org/practice/dsa/different-ways-to-evaluate-a-boolean-expression",
        d: "H",
      },
    ],
  },

  {
    t: "Graphs: path counting, Bellman-Ford and Floyd-Warshall",
    learn: {
      k: "video",
      t: "Striver: Number of ways to arrive at destination (lecture)",
      u: "https://youtu.be/_-0mx0SmYxA",
    },
    probs: [
      {
        t: "Number of ways to arrive at destination",
        u: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",
        d: "H",
      },
      {
        t: "Bellman ford algorithm",
        u: "https://takeuforward.org/practice/dsa/bellman-ford-algorithm",
        d: "H",
      },
      {
        t: "Floyd warshall algorithm",
        u: "https://takeuforward.org/practice/dsa/floyd-warshall-algorithm",
        d: "H",
      },
      {
        t: "Find the city with the smallest number of neighbors",
        u: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
        d: "H",
      },
    ],
  },
  {
    t: "Graphs: network delay, disjoint sets and spanning trees",
    learn: {
      k: "video",
      t: "Striver: Network Delay Time (lecture)",
      u: "https://leetcode.com/problems/network-delay-time/",
    },
    probs: [
      { t: "Network Delay Time", u: "https://takeuforward.org/practice/dsa/network-delay-time", d: "M" },
      { t: "Swim in Rising Water", u: "https://takeuforward.org/practice/dsa/swim-in-rising-water", d: "H" },
      { t: "Disjoint Set", u: "https://takeuforward.org/practice/dsa/disjoint-set-", d: "M" },
      { t: "Find the MST weight", u: "https://takeuforward.org/practice/dsa/find-the-mst-weight", d: "M" },
    ],
  },
  {
    t: "Graphs: union-find applications",
    learn: {
      k: "video",
      t: "Striver: Number of operations to make network connected (lecture)",
      u: "https://youtu.be/FYrl7iz9_ZU",
    },
    probs: [
      {
        t: "Number of operations to make network connected",
        u: "https://takeuforward.org/practice/dsa/number-of-operations-to-make-network-connected",
        d: "M",
      },
      { t: "Accounts merge", u: "https://takeuforward.org/practice/dsa/accounts-merge", d: "M" },
      { t: "Number of islands II", u: "https://takeuforward.org/practice/dsa/number-of-islands-ii", d: "H" },
      { t: "Making a large island", u: "https://leetcode.com/problems/making-a-large-island/", d: "H" },
    ],
  },
  {
    t: "Graphs: strongly connected components, bridges and articulation points",
    learn: {
      k: "video",
      t: "Striver: Most stones removed with same row or column (lecture)",
      u: "https://youtu.be/OwMNX8SPavM",
    },
    probs: [
      {
        t: "Most stones removed with same row or column",
        u: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
        d: "H",
      },
      { t: "Kosaraju's algorithm", u: "https://takeuforward.org/practice/dsa/kosaraju's-algorithm", d: "H" },
      {
        t: "Bridges in graph",
        u: "https://leetcode.com/problems/critical-connections-in-a-network/",
        d: "H",
      },
      {
        t: "Articulation point in graph",
        u: "https://takeuforward.org/practice/dsa/articulation-point-in-graph",
        d: "H",
      },
    ],
  },
];
