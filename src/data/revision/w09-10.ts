import { blank, card, match, mcq, multi, order, py, tf, txt, week } from "./types";

const TREE7 = txt`
      4
     / \
    2   6
   / \ / \
  1  3 5  7
`;

export const W9 = week(9, {
  core: [
    match("Match each failure to its description.", [
      ["Crash-stop", "a node halts and never comes back"],
      ["Crash-recovery", "a node restarts and keeps its disk"],
      ["Byzantine", "a node behaves arbitrarily or maliciously"],
      ["Network partition", "the network splits into groups that cannot talk"],
    ]),
    mcq(
      "Which timing model do real protocols such as Raft assume?",
      [
        "Synchronous: known bounds on delay",
        "Partially synchronous: bounds hold eventually",
        "Asynchronous with no bounds ever",
        "Real-time",
      ],
      1,
      "Safety must hold regardless of timing; liveness needs the bounds to hold eventually.",
    ),
    multi(
      "Which of these are among the fallacies of distributed computing?",
      ["The network is reliable", "Latency is zero", "Bandwidth is infinite", "Messages can be lost"],
      [0, 1, 2],
      "The last one is a fact, not a fallacy. Others include: the network is secure, topology does not change, there is one administrator.",
    ),
    mcq(
      "What does the Two Generals problem teach?",
      [
        "Consensus is easy",
        "No finite exchange of messages over a lossy link gives both sides certainty, so we design with timeouts, retries and idempotent operations",
        "TCP is unreliable",
        "Clocks must be synchronised",
      ],
      1,
    ),
    mcq(
      "A node stops answering. Can you tell whether it crashed or is just slow?",
      [
        "Yes, always",
        "No: in an asynchronous network silence could be a crash, a GC pause, loss or a partition, so a failure detector only suspects",
        "Yes, with a ping",
        "Only with TCP",
      ],
      1,
    ),
    tf(
      "A very short failure-detection timeout gives faster recovery with no downside.",
      false,
      "Short timeouts cause false positives (healthy nodes suspected), long ones slow recovery. Protocols must stay safe when suspicion is wrong.",
    ),
    mcq(
      "What is the purpose of the jitter in this backoff?",
      [
        "To make retries slower",
        "To stop many clients from retrying in synchronised waves",
        "To avoid integer overflow",
        "To implement a circuit breaker",
      ],
      1,
      "Exponential backoff alone still synchronises clients that failed at the same moment. Cap the number of attempts and retry idempotent operations only.",
      py`
sleep = base * 2**attempt
sleep = sleep / 2 + random.uniform(0, sleep / 2)
`,
    ),
    mcq(
      "Which clock should you use to measure a timeout?",
      [
        "The wall clock (time of day)",
        "A monotonic clock",
        "Either, they are identical",
        "An NTP-synchronised clock from another machine",
      ],
      1,
      "The wall clock can jump when NTP corrects it. A monotonic value is meaningless across machines but only goes forward.",
    ),
    tf("Last-write-wins by timestamp can silently drop a newer write when clocks are skewed.", true),
    mcq(
      "Two events are 'concurrent' in Lamport's sense when…",
      [
        "They happen at the same wall-clock instant",
        "Neither can causally influence the other: there is no happens-before path between them",
        "They are on the same machine",
        "They have equal timestamps",
      ],
      1,
    ),
    blank("On receiving a message, a Lamport clock sets L = ___(L, m.L) + 1.", ["max"]),
    mcq(
      "Node B has L = 2 and receives a message stamped 5. What is B's clock after the receive?",
      ["2", "5", "6", "7"],
      2,
      "max(2, 5) + 1 = 6.",
    ),
    tf(
      "If Lamport timestamps satisfy L(a) < L(b), then a must have happened before b.",
      false,
      "Only the other direction holds: a -> b implies L(a) < L(b). Vector clocks give both directions.",
    ),
    mcq(
      "Vector clocks `[2,1,0]` and `[1,2,0]` are…",
      ["Equal", "The first is before the second", "Concurrent", "The second is before the first"],
      2,
      "Neither dominates: the first is larger in position 0, the second in position 1.",
    ),
    mcq(
      "Compare `[1,2,0]` with `[2,2,1]`.",
      [
        "The first happened before the second",
        "The second happened before the first",
        "They are concurrent",
        "They are equal",
      ],
      0,
      "Every entry of the first is <= the second and at least one is smaller.",
    ),
    mcq(
      "What can a vector clock do that a Lamport clock cannot?",
      [
        "Run faster",
        "Detect that two events are concurrent, so conflicts can be found",
        "Use less memory",
        "Replace the wall clock entirely",
      ],
      1,
      "The cost is O(n) space per timestamp.",
    ),
    mcq(
      "With asynchronous leader-follower replication, what is the risk at failover?",
      [
        "Followers are never behind",
        "Acknowledged writes the new leader never received are lost",
        "Reads are always fresh",
        "The leader cannot be replaced",
      ],
      1,
      "Synchronous replication avoids this but blocks if a follower is down. Semi-sync (one follower confirms) is the usual compromise.",
    ),
    mcq(
      "You write a value and your next read from a follower returns the old value. Which guarantee was violated?",
      ["Monotonic reads", "Read-your-writes", "Durability", "Isolation"],
      1,
    ),
    blank(
      "In a leaderless store with N = 5 replicas and writes acknowledged by W = 3, the smallest read quorum R that guarantees overlap (W + R > N) is ___.",
      ["3"],
    ),
    order("Order these consistency models from strongest to weakest.", [
      "Linearizable",
      "Sequential",
      "Causal",
      "Eventual",
    ]),
    mcq(
      "What does linearizability promise that eventual consistency does not?",
      [
        "Replicas converge",
        "Once a read returns a new value, every later read anywhere returns it or something newer",
        "Writes are never lost",
        "Low latency",
      ],
      1,
    ),
    mcq(
      "What does the CAP theorem say about a network partition?",
      [
        "You can have all three of C, A and P",
        "During a partition you must choose between staying consistent (refusing some requests) and staying available (possibly stale answers)",
        "Partitions never happen",
        "Choose any two of C, A, P at design time without trade-offs",
      ],
      1,
      "Kleppmann's critique: the definitions are narrow and binary, so describe precise guarantees (and latency trade-offs, PACELC) instead.",
    ),
    card(
      "What should an API document about its guarantees, and where do you record the decision?",
      "Consistency (is a read linearizable or possibly stale, by how much), durability, ordering, idempotency and what a timeout means. Record the decision in an Architecture Decision Record: title, status, context, decision, consequences.",
    ),
    mcq(
      "In Raft, which state must be persisted before replying to an RPC?",
      [
        "commitIndex and lastApplied",
        "currentTerm, votedFor and the log",
        "nextIndex and matchIndex",
        "The election timer",
      ],
      1,
    ),
    blank(
      "A Raft cluster of 5 servers keeps working while at most ___ of them are down.",
      ["2|two"],
      "2f + 1 servers tolerate f failures, because a majority must remain.",
    ),
    order("Put a Raft leader election in order.", [
      "A follower hears nothing for a randomised election timeout",
      "It becomes a candidate: increments currentTerm and votes for itself",
      "It sends RequestVote to the others",
      "It collects votes from a majority",
      "It becomes leader and sends heartbeats",
    ]),
    multi(
      "A voter grants its vote in Raft only if…",
      [
        "The candidate's term is at least the voter's current term",
        "The voter has not already voted for someone else in this term",
        "The candidate's log is at least as up to date as the voter's",
        "The candidate has the lowest id",
      ],
      [0, 1, 2],
    ),
    mcq(
      "A voter's log ends at index 9 with term 3. A candidate's log ends at index 2 with term 4. Does the voter grant its vote (assuming the other conditions hold)?",
      [
        "No: the candidate's log is shorter",
        "Yes: a higher last term is more up to date, regardless of length",
        "No: the terms differ",
        "Only if the candidate is the old leader",
      ],
      1,
    ),
    mcq(
      "Why can there be at most one leader per term?",
      [
        "The lowest id always wins",
        "Each node votes at most once per term and a leader needs a majority; two majorities overlap in at least one node",
        "Timeouts are identical",
        "Leaders are chosen by the client",
      ],
      1,
    ),
    mcq(
      "A leader receives a message with a higher term. What does it do?",
      ["Ignores it", "Updates its term and steps down to follower", "Sends a new election", "Crashes"],
      1,
    ),
  ],
  dsa: [
    match("Match each traversal to a typical use.", [
      ["Preorder", "copy or serialise a tree"],
      ["Inorder", "visit a BST in sorted order"],
      ["Postorder", "delete a tree or compute from children"],
      ["Level order", "work level by level (BFS)"],
    ]),
    mcq(
      "What is the postorder traversal of this tree?",
      ["4 2 1 3 6 5 7", "1 2 3 4 5 6 7", "1 3 2 5 7 6 4", "4 6 7 5 2 3 1"],
      2,
      "Left subtree, right subtree, then the node: 1 3 2, 5 7 6, 4.",
      TREE7,
    ),
    mcq(
      "Recursive tree traversals use how much extra space?",
      ["O(1)", "O(height): O(log n) when balanced, O(n) worst case", "O(n^2)", "O(width) always"],
      1,
    ),
    mcq(
      "In the balanced-tree check, why return -1 for 'unbalanced'?",
      [
        "To signal failure upward so the whole check runs in one O(n) pass",
        "Because heights are negative",
        "To avoid recursion",
        "To count nodes",
      ],
      0,
    ),
    mcq(
      "To compute a tree's diameter, at each node you…",
      [
        "Add the left and right heights to a global maximum, and return 1 + max(left, right)",
        "Return the sum of all values",
        "Sort the children",
        "Return the depth",
      ],
      0,
      "A common pattern: return one thing to the parent, record another globally. Max path sum works the same way.",
      py`
best = 0

def h(n):
    global best
    if n is None:
        return 0
    l, r = h(n.left), h(n.right)
    best = max(best, l + r)
    return 1 + max(l, r)
`,
    ),
    mcq(
      "Top view versus bottom view: using BFS with a horizontal distance, which node is kept per column?",
      [
        "Top: the first seen; bottom: the last seen (overwrite)",
        "Top: the last seen; bottom: the first seen",
        "Both keep the first",
        "Both keep the largest",
      ],
      0,
    ),
    mcq(
      "In 'all root-to-leaf paths', why `path.copy()` at a leaf?",
      [
        "To save memory",
        "The path list is reused and trimmed while backtracking, so the stored result must be a copy",
        "Python forbids storing lists",
        "To sort it",
      ],
      1,
    ),
    mcq(
      "A boundary traversal outputs…",
      [
        "Only leaves",
        "The root, the left boundary (without leaves), all leaves, then the right boundary (without leaves) in reverse",
        "All nodes level by level",
        "Only the root",
      ],
      1,
    ),
  ],
  eng: [
    multi(
      "Which belong in a design-for-failure checklist?",
      [
        "Timeouts on every call",
        "Retries with backoff and jitter, for idempotent operations only",
        "A circuit breaker and bulkheads",
        "Assume dependencies never fail",
      ],
      [0, 1, 2],
    ),
    mcq(
      "What makes distributed logs useful?",
      [
        "Free-text messages",
        "Structured lines carrying a timestamp, node, level and a request or trace id propagated across calls",
        "Logging inside every tight loop",
        "Logging secrets",
      ],
      1,
    ),
    mcq(
      "A key rule when debugging Raft code is…",
      [
        "Hold the lock while making an RPC",
        "Never hold a lock during a network call, and re-validate term and role after re-acquiring it",
        "Use a single global lock",
        "Disable the timers",
      ],
      1,
    ),
    mcq(
      "Why run distributed tests over many seeds and repeats?",
      [
        "pytest requires it",
        "Non-deterministic bugs may appear only one run in a hundred",
        "To fill the logs",
        "It makes tests faster",
      ],
      1,
    ),
  ],
});

export const W10 = week(10, {
  core: [
    mcq(
      "In Raft, what does an entry in the replicated log consist of?",
      ["Just the command", "A term and a command", "A timestamp and a key", "A hash only"],
      1,
    ),
    mcq(
      "A follower gets AppendEntries whose `prevLogIndex` is not in its log. What does it do?",
      [
        "Appends anyway",
        "Rejects, and the leader decrements nextIndex and retries",
        "Calls an election",
        "Deletes its log",
      ],
      1,
      "This consistency check, repeated, is how the leader repairs a follower's log.",
    ),
    mcq(
      "An existing follower entry conflicts with a new one: same index, different term. The follower…",
      [
        "Keeps both",
        "Deletes that entry and everything after it, then appends the leader's entries",
        "Rejects the whole RPC",
        "Overwrites only that entry",
      ],
      1,
    ),
    match("Match each Raft safety property to its meaning.", [
      ["Log matching", "same index and term in two logs means identical logs up to that point"],
      ["Election restriction", "a candidate must have a log at least as up to date as a majority's"],
      ["Leader completeness", "a leader contains every committed entry"],
      ["State-machine safety", "no two servers apply different commands at the same index"],
    ]),
    blank(
      "Complete the commit rule: a leader may only advance commitIndex by counting replicas for an entry from which term?",
      ["currentTerm|current term"],
      "Older-term entries become committed indirectly once a current-term entry after them commits (the Figure 8 scenario in the Raft paper).",
      py`
for N in range(len(log) - 1, commit_index, -1):
    if log[N].term == ___ and count_match(N) > n // 2:
        commit_index = N
        break
`,
    ),
    mcq(
      "A deposed leader had appended entries that were not yet replicated to a majority. What happens to them?",
      [
        "They are committed anyway",
        "They are overwritten by the new leader's log; their clients got no success reply and must retry",
        "They are sent to followers",
        "They become snapshots",
      ],
      1,
    ),
    match("Match each partitioning scheme to its drawback.", [
      ["Key range", "hot spots with sequential keys or timestamps"],
      ["Hash of the key", "range queries need scatter-gather"],
      ["hash(key) % N", "changing N moves almost every key"],
    ]),
    mcq(
      "You add a fifth node to four, using `hash(key) % N`. Roughly what fraction of keys move?",
      ["About 20%", "About 50%", "About 80%", "None"],
      2,
      "About (N-1)/N of keys change owner. With consistent hashing only about 1/N move.",
    ),
    mcq(
      "In consistent hashing, a key is owned by…",
      [
        "The node with the closest id",
        "The first node clockwise from the key's hash on the ring",
        "A random node",
        "Every node",
      ],
      1,
    ),
    multi(
      "What do virtual nodes achieve?",
      [
        "Evening out load, since one point per node gives uneven arcs",
        "Spreading a failed node's load across many peers",
        "Letting stronger machines take more points",
        "Removing the need for hashing",
      ],
      [0, 1, 2],
    ),
    mcq(
      "Why does `Get` set `i = 0` when the search runs off the end?",
      [
        "A bug",
        "The ring wraps around: the key belongs to the first node after the highest hash",
        "To restart the search",
        "To pick a random node",
      ],
      1,
      "",
      py`
i = bisect.bisect_left(r.hashes, h)
if i == len(r.hashes):
    i = 0
return r.owner[r.hashes[i]]
`,
    ),
    blank(
      "Redis Cluster uses a fixed number of hash slots: ___.",
      ["16384"],
      "Fixed partitions assigned to nodes (also Kafka, Elasticsearch) are an alternative to consistent hashing, as are rendezvous hashing and jump consistent hash.",
    ),
    blank(
      "100 million users each writing once a day is about ___ writes per second on average (use 10^5 seconds per day).",
      ["1000|1,000|1k"],
      "At 1 KB each that is about 1 MB/s or 86 GB a day.",
    ),
    match(
      "Match the delivery semantics to its behaviour.",
      [
        ["At-most-once", "no retry, a message may be lost"],
        ["At-least-once", "retry until acknowledged, duplicates possible"],
        ["Exactly-once effect", "at-least-once delivery plus idempotent processing"],
      ],
      "True exactly-once delivery is impossible in general, because you cannot know whether an unacknowledged message arrived.",
    ),
    mcq(
      "How does an idempotency key work?",
      [
        "The server generates a fresh key for each retry",
        "The client sends the same unique key with every retry of one logical operation, and the server stores key -> result atomically with the effect",
        "It encrypts the request",
        "It rate-limits the client",
      ],
      1,
    ),
    mcq(
      "Why does a Raft KV store record (clientID, seq) -> result inside the replicated state machine?",
      [
        "To save space",
        "So a retry that reaches a new leader after failover is still deduplicated",
        "To speed up elections",
        "Because followers need them for voting",
      ],
      1,
    ),
    mcq(
      "What is full jitter?",
      [
        "sleep = backoff exactly",
        "sleep = random(0, backoff), spreading retries evenly",
        "sleep = 0",
        "sleep = backoff x 2",
      ],
      1,
      "",
      py`
def backoff(attempt):
    d = min(max_d, base * 2**attempt)
    return random.uniform(0, d)
`,
    ),
    mcq(
      "Three layers of a service each retry a failed call three times. In the worst case, how many calls does the bottom service see per original request?",
      ["9", "12", "27", "3"],
      2,
      "Retries multiply. Retry at one layer and use retry budgets.",
    ),
    order("Put the circuit-breaker states in the order a failing dependency moves through them.", [
      "Closed: calls go through normally",
      "Open: after N consecutive failures, calls fail fast",
      "Half-open: after a cool-down, a trial request is allowed",
      "Closed again if the trial succeeds",
    ]),
    card(
      "What is a hedged request and when is it safe?",
      "Send a second copy of a request after a short delay if the first has not answered, and use whichever answers first. It cuts tail latency, and is safe only for idempotent operations.",
    ),
    order("Put the steps of the system design framework in order.", [
      "Requirements (functional and non-functional)",
      "Estimates",
      "API and data model",
      "High-level design",
      "Deep dive on the hard parts",
      "Failure modes, bottlenecks and scaling",
    ]),
    blank("A URL shortener using 7 base-62 characters can produce about 62^7, roughly ___ trillion ids.", [
      "3.5",
    ]),
    mcq(
      "Why is a fixed-window rate limiter imperfect?",
      [
        "It needs too much memory",
        "A burst at the end of one window and the start of the next can let through twice the limit",
        "It cannot count",
        "It blocks all traffic",
      ],
      1,
      "Token bucket allows controlled bursts: it refills at rate r up to burst b and each request takes a token.",
    ),
    match("Match the four golden signals to what they measure.", [
      ["Latency", "how long requests take (look at p99, not the average)"],
      ["Traffic", "demand placed on the system"],
      ["Errors", "rate of failed requests"],
      ["Saturation", "how full the most constrained resource is"],
    ]),
    mcq(
      "Your rate limiter's shared store goes down. What must you decide?",
      [
        "Whether to fail open (allow) or fail closed (reject)",
        "Which colour to use",
        "The page size",
        "Nothing",
      ],
      0,
    ),
  ],
  dsa: [
    mcq(
      "In the lowest common ancestor recursion, a node is the LCA when…",
      [
        "Both left and right recursive calls return non-None",
        "It is the root",
        "It is a leaf",
        "It equals p",
      ],
      0,
      "If only one side returns non-None, pass that result up.",
      py`
def lca(n, p, q):
    if n is None or n is p or n is q:
        return n
    l, r = lca(n.left, p, q), lca(n.right, p, q)
    if l and r:
        return n
    return l or r
`,
    ),
    mcq(
      "To find all nodes at distance K from a target in a binary tree, you…",
      [
        "Run DFS only",
        "Build a parent map so the tree behaves like an undirected graph, then BFS K levels from the target",
        "Sort the nodes",
        "Use the LCA only",
      ],
      1,
    ),
    mcq(
      "In 'maximum width of a binary tree', node indices are 2i and 2i+1. Why normalise them per level?",
      ["To sort them", "To avoid integer overflow on deep trees", "To balance the tree", "To find the LCA"],
      1,
    ),
    mcq(
      "Counting nodes in a complete binary tree can be done in…",
      ["O(n)", "O(log^2 n)", "O(1)", "O(n log n)"],
      1,
      "If the leftmost and rightmost depths are equal the subtree is perfect with 2^h - 1 nodes; otherwise recurse on both children.",
    ),
    mcq(
      "Which pair of traversals does NOT uniquely identify a binary tree?",
      ["Inorder + preorder", "Inorder + postorder", "Preorder + postorder", "Inorder + level order"],
      2,
      "With a node that has one child, preorder and postorder cannot tell left from right.",
    ),
    tf(
      "Morris traversal visits a tree in O(n) time and O(1) extra space by temporarily threading each node's inorder predecessor to it.",
      true,
    ),
    mcq(
      "Deleting a BST node with two children: replace its value with…",
      [
        "Its parent",
        "The inorder successor (minimum of the right subtree), then delete that node",
        "Its left child",
        "Zero",
      ],
      1,
    ),
    mcq(
      "To find the k-th smallest in a BST you…",
      [
        "Sort a copy",
        "Do an inorder traversal and stop at the k-th node",
        "Use level order",
        "Pick the root",
      ],
      1,
    ),
  ],
  eng: [
    mcq(
      "How should a randomised test report failure?",
      [
        "Silently",
        "Print the seed so the run can be replayed, and save the failing schedule as a regression test",
        "Use time.time() only",
        "Retry until it passes",
      ],
      1,
    ),
    mcq(
      "A fake clock in tests is used instead of `time.sleep` because…",
      [
        "It is shorter to write",
        "Time can be advanced explicitly and deterministically, with no real waiting or flakiness",
        "It uses less memory",
        "The race detector needs it",
      ],
      1,
    ),
    match("Match the resilience pattern to its purpose.", [
      ["Timeout", "bound how long you wait"],
      ["Bulkhead", "isolate resource pools so one failure cannot exhaust all"],
      ["Load shedding", "protect yourself by rejecting work under overload"],
      ["Fallback", "return cached or partial results"],
    ]),
    mcq(
      "In estimation, 'convert everything to per second' means dividing per-day counts by about…",
      ["10^3", "10^5", "10^7", "10^9"],
      1,
    ),
  ],
});
