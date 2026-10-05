import { blank, card, match, mcq, multi, order, py, sql, tf, week } from "./types";

export const W7 = week(7, {
  core: [
    match(
      "Match each database to its default page size.",
      [
        ["SQLite", "4 KB"],
        ["PostgreSQL", "8 KB"],
        ["InnoDB (MySQL)", "16 KB"],
      ],
      "A page is the unit of I/O, caching, locking and recovery. Page n is at offset n x pageSize.",
    ),
    mcq(
      "In a slotted page, how is a tuple addressed from outside the page?",
      [
        "By its byte offset in the file",
        "By (pageID, slotID); the slot records where the tuple currently sits",
        "By its primary key only",
        "By a pointer into memory",
      ],
      1,
      "Tuples can move during compaction while the slot keeps its id, so external references stay valid.",
    ),
    mcq(
      "In a slotted page, which way do the slot array and the tuple data grow?",
      [
        "Both grow toward the start",
        "Slots grow from the front, tuples grow from the end, and free space sits between",
        "Tuples grow from the front and slots from the end, with no free space",
        "Neither grows",
      ],
      1,
      "An insert needs room for the tuple plus a new slot entry.",
    ),
    multi(
      "What does a buffer pool frame track?",
      ["Which page it holds", "A pin count", "A dirty bit", "The user's password"],
      [0, 1, 2],
      "Pinned pages cannot be evicted. A dirty page may be written only after its log records are durable.",
    ),
    mcq(
      "Why do databases use scan-resistant variants of LRU in the buffer pool?",
      [
        "To save CPU",
        "A single large table scan would otherwise flush the hot working set",
        "LRU is patented",
        "To reduce disk space",
      ],
      1,
    ),
    mcq(
      "Where is the page size stored in a SQLite file header?",
      ["Offset 0, little-endian", "Offset 16, big-endian", "The last 4 bytes", "It is not stored"],
      1,
      "The 100-byte header begins with the string `SQLite format 3` followed by a zero byte.",
    ),
    mcq(
      "In a B+tree, where are the values (rows) stored?",
      [
        "In every node",
        "Only in the leaves, which are linked left to right",
        "Only in the root",
        "In a separate hash table",
      ],
      1,
      "Internal nodes hold only keys and child pointers, so more fit per page. Linked leaves make range scans cheap.",
    ),
    blank(
      "With a fanout of 200, a B+tree holding 1 billion keys needs about ___ levels.",
      ["4|four"],
      "200^3 is 8 million, 200^4 is 1.6 billion. Top levels are cached, so a lookup costs a few page reads.",
    ),
    order("Put a B+tree insert into a full leaf in order.", [
      "Search down to the right leaf",
      "The leaf is full, so split it in half",
      "Push the separator key up into the parent",
      "If the parent is full too, repeat; a root split grows the tree's height by one",
    ]),
    order("Put the LSM write path in order.", [
      "Append to the write-ahead log",
      "Insert into the in-memory sorted memtable",
      "When the memtable is full, flush it as an immutable SSTable",
      "Background compaction merges SSTables",
    ]),
    multi(
      "Which of these describe an LSM tree rather than a B+tree?",
      [
        "Sequential, batched writes",
        "In-place page updates with random I/O",
        "A point read may have to check several files",
        "Excellent range scans through linked leaves",
      ],
      [0, 2],
      "Bloom filters reduce the number of files a read touches.",
    ),
    mcq(
      "Which workload favours an LSM tree?",
      [
        "Read-heavy, low-latency point lookups",
        "Write-heavy ingestion such as logs, time series and messaging",
        "Tiny tables",
        "Heavy range scans on a stable table",
      ],
      1,
    ),
    mcq(
      "With a composite index on `(a, b)`, which query can use it?",
      ["WHERE b = 5", "WHERE a = 1 AND b = 5", "WHERE b > 2 ORDER BY b", "None of them"],
      1,
      "Leftmost prefix rule: it helps queries on `a` or on `a, b`, not on `b` alone.",
    ),
    tf(
      "A covering index lets the database answer a query from the index alone, without visiting the table.",
      true,
    ),
    mcq(
      "In Bitcask, what does a `Get` cost?",
      [
        "A scan of all data files",
        "A keydir lookup in RAM and one pread at the recorded offset",
        "A B-tree traversal",
        "A network round trip",
      ],
      1,
      "A Put is a single sequential append. Because the keydir lives in RAM, all keys must fit in memory.",
    ),
    mcq(
      "How does Bitcask handle a delete?",
      [
        "It overwrites the record with zeros",
        "It appends a tombstone record and removes the key from the keydir",
        "It rewrites the data file",
        "It cannot delete",
      ],
      1,
    ),
    blank("On startup, Bitcask rebuilds its ___ by scanning the data files or hint files.", [
      "keydir|key dir|index",
    ]),
    mcq(
      "After a crash the log's last record has a bad CRC. What is the correct recovery?",
      [
        "Refuse to start",
        "Stop at the first invalid record and truncate there: that write was never acknowledged",
        "Fix the CRC",
        "Delete the whole file",
      ],
      1,
    ),
    mcq(
      "Why must compaction update a keydir entry only if it still points at the old location?",
      [
        "To save memory",
        "A newer Put may have arrived meanwhile, and overwriting it would resurrect the old value",
        "Because dicts cannot be updated",
        "Python requires it",
      ],
      1,
    ),
    mcq(
      "In an LSM tree, why must reads check the newest data first?",
      [
        "It is faster",
        "Newer data shadows older; reading old tables first can return a stale value or resurrect a deleted key",
        "To balance load",
        "Because of Bloom filters",
      ],
      1,
      "A tombstone in a newer table must hide older values.",
    ),
    mcq(
      "Which compaction strategy gives cheaper writes but more files to check per read?",
      ["Leveled (LevelDB, RocksDB)", "Size-tiered (Cassandra)", "Neither", "Both equally"],
      1,
      "Leveled keeps non-overlapping levels about 10x bigger each: fewer files per read but more rewriting.",
    ),
    card(
      "Define write amplification and name where it comes from in an LSM tree.",
      "Bytes physically written divided by bytes the user wrote. It comes from the WAL write, the memtable flush and every time compaction rewrites the same data into a lower level. It trades off against read and space amplification.",
    ),
    multi(
      "Which statements about a Bloom filter are true?",
      [
        "It has no false negatives",
        "It can report false positives",
        "You can delete an item from a plain Bloom filter",
        "About 10 bits per key with k near 7 gives roughly 1% false positives",
      ],
      [0, 1, 3],
      "'Any bit 0' means definitely absent; 'all bits set' means maybe present.",
    ),
    blank(
      "Each probe sets or tests bit `(h1 + i*h2) % m` for i in 0..k-1. This trick of deriving k hashes from two is called ___ hashing.",
      ["double"],
      "A Bloom filter lets a read skip SSTables that cannot contain the key.",
      py`
d = hashlib.blake2b(key, digest_size=16).digest()
h1 = int.from_bytes(d[:8], "little")
h2 = int.from_bytes(d[8:], "little") | 1
for i in range(k):
    bit = (h1 + i * h2) % m
    bits[bit >> 3] |= 1 << (bit & 7)
`,
    ),
    order(
      "Put SQL's logical evaluation order in sequence.",
      ["FROM / JOIN", "WHERE", "GROUP BY", "HAVING", "SELECT", "ORDER BY", "LIMIT"],
      "That is why WHERE cannot use aggregates or SELECT aliases while HAVING can use aggregates.",
    ),
    mcq(
      "What does this query return?",
      ["Rows where x is 2 or 3", "No rows at all", "All rows", "An error"],
      1,
      "For a row with x = 2, `x NOT IN (1, NULL)` becomes `x <> 1 AND x <> NULL`, and the second part is unknown, so the row is never selected. A NULL in a NOT IN list poisons the result.",
      sql`
SELECT * FROM t WHERE x NOT IN (1, NULL);
`,
    ),
  ],
  dsa: [
    mcq(
      "How do you count subarrays with exactly K distinct values?",
      ["Two nested loops", "at_most(K) - at_most(K - 1)", "Sort first", "A single hash map pass"],
      1,
    ),
    mcq(
      "In `at_most`, why add `r - l + 1` for each right end `r`?",
      [
        "It is the window length, and every start in [l, r] gives a valid subarray ending at r",
        "It counts characters",
        "It is the number of distinct values",
        "It resets the window",
      ],
      0,
    ),
    mcq(
      "A queue is built from two stacks, `in` and `out`. When do you move elements?",
      [
        "On every push",
        "Only when `out` is empty and a pop is requested; this gives amortised O(1)",
        "Never",
        "On every pop",
      ],
      1,
    ),
    blank("In a circular-buffer queue the next free slot is at index `(head + size) % ___`.", [
      "cap|capacity",
    ]),
    mcq(
      "Convert infix `(a+b)*c` to postfix.",
      ["abc*+", "ab+c*", "*+abc", "ab*c+"],
      1,
      "Shunting-yard: operands go straight to output, '(' is pushed, ')' pops to the matching '(', and operators pop equal or higher precedence first.",
    ),
    mcq("What is the prefix form of `a+b*c`?", ["+a*bc", "abc*+", "*+abc", "+*abc"], 0),
    mcq(
      "Evaluating the postfix expression `2 3 4 * +` gives…",
      ["20", "14", "9", "24"],
      1,
      "Push 2, 3, 4. `*` pops 4 and 3 and pushes 12. `+` pops 12 and 2 and pushes 14.",
    ),
    mcq(
      "What does this next-greater-element code return for `[2, 1, 2, 4, 3]`?",
      ["[4, 2, 4, -1, -1]", "[1, 2, 4, 3, -1]", "[4, 4, 4, -1, -1]", "[-1, 2, 4, -1, -1]"],
      0,
      "Scanning right to left with a stack of decreasing candidates: 3 has none, 4 has none, 2 sees 4, 1 sees 2, 2 sees 4.",
      py`
def next_greater(a):
    res = [-1] * len(a)
    st = []
    for i in range(len(a) - 1, -1, -1):
        while st and st[-1] <= a[i]:
            st.pop()
        res[i] = st[-1] if st else -1
        st.append(a[i])
    return res
`,
    ),
    tf(
      "The monotonic-stack next greater element runs in O(n) because each element is pushed and popped at most once.",
      true,
    ),
  ],
  eng: [
    mcq("Which clause may use an aggregate such as SUM()?", ["WHERE", "HAVING", "FROM", "LIMIT"], 1),
    mcq(
      "In a query plan, what is a red flag?",
      [
        "An Index Scan on a selective filter",
        "A Seq Scan with a selective filter on a big table, or estimated rows off from actual by 10x or more",
        "Cost numbers",
        "Nested loop on a tiny table",
      ],
      1,
      "Stale statistics are fixed with ANALYZE. Note `EXPLAIN ANALYZE` actually runs the query.",
    ),
    mcq(
      "What makes code easy to test?",
      [
        "Global state",
        "Injecting dependencies such as the clock, randomness and filesystem, and separating pure logic from I/O",
        "Using init() for setup",
        "Avoiding interfaces everywhere",
      ],
      1,
    ),
    mcq(
      "The notes' advice on performance work is…",
      [
        "Trust intuition",
        "Benchmark a baseline, change one thing, compare the runs with pytest-benchmark or timeit statistics, and keep it only if the data supports it",
        "Always add a Bloom filter",
        "Optimise first",
      ],
      1,
    ),
  ],
});

export const W8 = week(8, {
  core: [
    match("Match each ACID property to the mechanism that mostly provides it.", [
      ["Atomicity", "undo / log"],
      ["Consistency", "application logic and constraints"],
      ["Isolation", "locks or MVCC"],
      ["Durability", "WAL plus fsync"],
    ]),
    mcq(
      "What is the write-ahead rule?",
      [
        "Write data pages first, then the log",
        "The log record for a change must be durable before the changed data page is written",
        "Always fsync the data file at commit",
        "Never write the log",
      ],
      1,
      "A transaction commits when its commit record is durable. The log is sequential and cheap; data pages can be written later.",
    ),
    mcq(
      "'Steal, no-force' buffer management means…",
      [
        "Dirty pages of uncommitted transactions may be written, and pages need not be flushed at commit; so both undo and redo are needed",
        "Pages are flushed at every commit",
        "Uncommitted pages are never written",
        "No log is needed",
      ],
      0,
    ),
    order("Put the three ARIES recovery passes in order.", [
      "Analysis: find active transactions and dirty pages from the last checkpoint",
      "Redo: repeat history by reapplying logged changes missing from pages",
      "Undo: roll back transactions that never committed",
    ]),
    mcq(
      "A transaction committed and its commit record is in the log, but none of its data pages reached disk before the crash. What does recovery do?",
      ["Loses it", "Redoes it from the log", "Asks the user", "Undoes it"],
      1,
    ),
    mcq(
      "Why does group commit improve throughput?",
      [
        "It skips durability",
        "Many transactions share one expensive fsync, at the cost of a small wait",
        "It compresses the log",
        "It removes the need for a WAL",
      ],
      1,
    ),
    match("Match each anomaly to what happens.", [
      ["Dirty read", "reading another transaction's uncommitted write"],
      ["Non-repeatable read", "the same row read twice returns different values"],
      ["Phantom", "a repeated range query returns new rows"],
      ["Lost update", "one read-modify-write overwrites another"],
      ["Write skew", "two transactions write different rows and together break an invariant"],
    ]),
    mcq(
      "Under the SQL standard, which anomaly can still occur at REPEATABLE READ?",
      ["Dirty reads", "Non-repeatable reads", "Phantoms", "None"],
      2,
    ),
    mcq(
      "In PostgreSQL, what is REPEATABLE READ?",
      [
        "Two-phase locking",
        "Snapshot isolation: no phantoms, but write skew is still possible",
        "The same as READ UNCOMMITTED",
        "Serializable",
      ],
      1,
    ),
    mcq(
      "A PostgreSQL SERIALIZABLE transaction fails with SQLSTATE 40001. What should the application do?",
      ["Give up", "Retry the transaction", "Switch to READ UNCOMMITTED", "Restart the server"],
      1,
    ),
    mcq(
      "Two on-call doctors both check that two are on duty, then each takes themselves off. Nobody is on call. What is this?",
      ["Dirty read", "Write skew", "Phantom delete", "Deadlock"],
      1,
      "Each read the same data and wrote a different row. Snapshot isolation allows it; serializable does not.",
      sql`
-- T1 and T2 both:
BEGIN;
SELECT count(*) FROM oncall WHERE on_duty;  -- 2
-- then T1 sets alice off, T2 sets bob off
UPDATE oncall SET on_duty = false WHERE name = 'alice'; -- (T2: 'bob')
COMMIT;
`,
    ),
    multi(
      "Which fix the lost-update problem?",
      [
        "UPDATE t SET n = n + 1 (atomic update)",
        "SELECT ... FOR UPDATE",
        "A compare-and-set on a version column",
        "Reading the value, adding 1 in the app, and writing it back at READ COMMITTED",
      ],
      [0, 1, 2],
    ),
    mcq(
      "Balance starts at 100. Two sessions each run this statement once, concurrently. What is the final balance?",
      ["110", "120", "Either 110 or 120 depending on timing", "100"],
      1,
      "A single UPDATE that computes from the current value is atomic, so no increment is lost. The lost update happens when the app reads, adds, then writes back a constant.",
      sql`
UPDATE acct SET balance = balance + 10 WHERE id = 1;
`,
    ),
    card(
      "Why is serializable not the default in most databases?",
      "Weaker levels block or abort less and are faster, and most workloads tolerate their anomalies. Serializable needs retry logic and costs throughput (locks or conflict tracking).",
    ),
    mcq(
      "Version v1 has begin=10, end=20 and v2 has begin=20, end=infinity. Which version does a snapshot at ts=20 see, using begin <= snap < end?",
      ["v1", "v2", "both", "neither"],
      1,
      "For v1, 20 < 20 is false. For v2, 20 <= 20 < infinity is true.",
    ),
    mcq(
      "What is the main practical advantage of MVCC over locking for reads?",
      [
        "Readers never block writers, and writers never block readers",
        "It uses no extra storage",
        "It prevents all anomalies",
        "It needs no garbage collection",
      ],
      0,
    ),
    mcq(
      "In MVCC, two transactions update the same key. With first-committer-wins, what happens?",
      [
        "Both succeed",
        "The first to commit wins and the second aborts or retries",
        "The database crashes",
        "The second silently overwrites",
      ],
      1,
    ),
    mcq(
      "Why can a long-running transaction cause table bloat in an MVCC database such as Postgres?",
      [
        "It locks all rows",
        "Old versions cannot be removed while any active snapshot might still see them",
        "It disables VACUUM permanently",
        "It increases page size",
      ],
      1,
    ),
    mcq(
      "Strict two-phase locking…",
      [
        "Releases locks as soon as they are not needed",
        "Holds all locks until commit or abort, which avoids cascading aborts",
        "Uses no exclusive locks",
        "Cannot deadlock",
      ],
      1,
      "2PL gives serializability but readers can block writers and deadlocks need detection (waits-for graph or timeouts).",
    ),
    multi(
      "Which of these are true of MVCC rather than two-phase locking?",
      [
        "Readers use a snapshot and never wait",
        "Readers take shared locks and may wait for writers",
        "Old versions need garbage collection",
        "Deadlocks between transactions are the classic risk",
      ],
      [0, 2],
    ),
    mcq(
      "When is a sequential scan the planner's cheapest plan?",
      [
        "When one row matches",
        "When the query returns a large fraction of the table, or the table is small",
        "Never",
        "Only with no statistics",
      ],
      1,
      "Sequential reads beat many random page reads once enough rows match. An index not being used can be correct.",
    ),
    mcq(
      "Why might `WHERE lower(email) = 'a@b.c'` ignore a plain index on `email`?",
      [
        "The index is corrupt",
        "The predicate is not sargable: the function on the column needs a matching expression index",
        "lower() is slow",
        "Indexes ignore strings",
      ],
      1,
    ),
    tf("An index makes writes slower because every insert and update has to maintain it.", true),
    multi(
      "Which bugs does kill -9 crash testing typically find?",
      [
        "A missing fsync of the file or its directory",
        "A torn tail record that is not truncated",
        "A replay that is not idempotent",
        "Spelling mistakes in comments",
      ],
      [0, 1, 2],
      "Use failpoints before and after write, fsync and rename. The writer records acknowledged writes in a separate durable file, and the verifier checks every one is present.",
    ),
    order("Put a crash-test loop in order.", [
      "The writer performs a Put",
      "After the acknowledgement it appends the id to a separate durable ack log",
      "The killer sends kill -9 at a random moment",
      "The verifier reopens the store and checks every acknowledged write",
    ]),
  ],
  dsa: [
    mcq(
      "Asteroid collision: what is the final state for `[5, 10, -5]`?",
      ["[5 10]", "[10]", "[-5]", "[]"],
      0,
      "-5 meets 10, and 10 is larger, so -5 is destroyed.",
    ),
    mcq(
      "Remove k = 3 digits from `1432219` for the smallest number.",
      ["1219", "1221", "1322", "4329"],
      0,
      "Keep an increasing stack: pop a digit while a smaller digit follows it and k > 0.",
    ),
    mcq(
      "Sliding window maximum of `[1,3,-1,-3,5,3,6,7]` with k = 3?",
      ["[3 3 5 5 6 7]", "[1 3 -1 5 6 7]", "[3 3 5 5 6 6]", "[3 5 5 6 7 7]"],
      0,
      "A deque of indices keeps values in decreasing order; the front is the window maximum.",
    ),
    mcq(
      "Trapping rain water for `[0,1,0,2,1,0,1,3,2,1,2,1]`?",
      ["4", "6", "9", "10"],
      1,
      "Water above each bar is min(maxLeft, maxRight) - height.",
    ),
    mcq(
      "Largest rectangle in the histogram `[2,1,5,6,2,3]`?",
      ["8", "10", "12", "6"],
      1,
      "Bars 5 and 6 give width 2 and height 5 = 10.",
    ),
    mcq(
      "In 'sum of subarray minimums', why use strictly smaller on one side and smaller-or-equal on the other?",
      [
        "To speed up the loop",
        "So duplicates are not counted twice",
        "To avoid overflow",
        "It is a convention only",
      ],
      1,
    ),
    blank(
      "Fill in the check that drops the front index once it has left the window of size k.",
      ["k"],
      "Each index enters and leaves the deque once, so the whole scan is O(n).",
      py`
dq = deque()
for i, v in enumerate(a):
    while dq and a[dq[-1]] <= v:
        dq.pop()
    dq.append(i)
    if dq[0] <= i - ___:
        dq.popleft()
    if i >= k - 1:
        res.append(a[dq[0]])
`,
    ),
    mcq(
      "What data structure gives an O(1) LRU cache?",
      [
        "A sorted array",
        "A hash map to nodes of a doubly linked list ordered by recency",
        "A binary heap",
        "A trie",
      ],
      1,
    ),
    mcq(
      "In the celebrity problem, if `knows(c, i)` is true, then…",
      [
        "c cannot be the celebrity, so i becomes the candidate",
        "i cannot be the celebrity",
        "c is certainly the celebrity",
        "Both are celebrities",
      ],
      0,
      "A celebrity knows nobody. After the elimination pass, verify the remaining candidate against everyone.",
    ),
  ],
  eng: [
    card(
      "Name the steps for handling a bug report.",
      "Capture inputs, environment and logs; reduce to a minimal reproduction (git bisect helps); turn it into a failing test; hypothesise, fix and watch the test pass; keep the test.",
    ),
    mcq(
      "What does a property-based test do on failure?",
      [
        "Reports the first random input only",
        "Shrinks the failing input to a minimal case",
        "Ignores the failure",
        "Increases the seed",
      ],
      1,
      "Good properties: model equivalence against a simple map, round trips, idempotence, invariants after random histories.",
    ),
    mcq(
      "Which is a good invariant for a key-value store?",
      [
        "The code compiles",
        "Every acknowledged write is readable after any crash and restart",
        "The log has comments",
        "Keys are short",
      ],
      1,
    ),
    mcq(
      "A chaos experiment starts with…",
      [
        "Breaking production",
        "A steady-state definition and a hypothesis, with a limited blast radius",
        "Deleting the logs",
        "Ignoring metrics",
      ],
      1,
    ),
  ],
});
