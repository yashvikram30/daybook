import { card, week } from "./types";

// Extra flashcards: short "explain it" prompts for saying out loud, a few per week.

export const CARDS = [
  ...week(1, {
    core: [
      card(
        "Explain two's complement in one breath.",
        "The top bit has negative weight -2^(n-1). Negate by inverting the bits and adding 1. The same adder works for signed and unsigned values; only the interpretation differs.",
      ),
      card(
        "Where do Python objects live, and when are they freed?",
        "Every Python object lives on the heap, with a 16-byte header holding a reference count and a type pointer. Names are references. An object is freed the moment its count reaches zero, and a cycle collector (the `gc` module) handles objects that refer to each other. There is no stack-or-heap decision to see, unlike in languages where you choose between stack and heap.",
      ),
      card(
        "Why does `b = a; b.append(x)` change `a`, but `b = a[:2]; b.append(x)` does not?",
        "Assignment never copies: `b = a` makes a second name for the same list, so an append through either is visible through both. A slice of a list creates a new list (copying the pointers), so `b` no longer shares storage with `a`. A NumPy slice, by contrast, is a view.",
      ),
    ],
    dsa: [
      card(
        "Best and worst case of selection, bubble, insertion and merge sort?",
        "Selection n^2 / n^2. Bubble (with early exit) n / n^2. Insertion n / n^2. Merge n log n / n log n. Merge needs O(n) extra space; the others are in place.",
      ),
    ],
    eng: [],
  }),
  ...week(2, {
    core: [
      card(
        "Name the three kinds of cache miss.",
        "Compulsory (first touch), capacity (working set larger than the cache), conflict (too many addresses map to one set).",
      ),
      card(
        "Walk through a page fault from the faulting instruction to the retry.",
        "The MMU finds the page-table entry not present, the CPU traps to the kernel, the kernel checks the address is in a valid region (otherwise SIGSEGV), maps a page (reading from disk for a major fault), and the same instruction is re-executed.",
      ),
      card(
        "What is false sharing and how do you fix it?",
        "Different cores write different variables that sit on one cache line, so the coherence protocol keeps invalidating it. Pad or align hot per-thread data to its own cache line.",
      ),
    ],
    dsa: [
      card(
        "Prefix sum plus hash map: what do you store, and why seed the map with {0: 1}?",
        "Store counts of each prefix sum seen so far; a subarray ending here sums to k if an earlier prefix equals sum - k. The seed counts subarrays that start at index 0.",
      ),
    ],
    eng: [],
  }),
  ...week(3, {
    core: [
      card(
        "Why are fork and exec separate system calls?",
        "Between them the child can rearrange file descriptors, environment, working directory and process group. That is exactly how a shell implements redirection and pipes.",
      ),
      card(
        "What is the convoy effect, and which scheduling policies fix it?",
        "Short jobs wait behind a long one under FIFO. SJF/STCF fix turnaround (if lengths are known); round robin fixes response time; MLFQ approximates SJF without knowing lengths.",
      ),
      card(
        "Zombie versus orphan?",
        "Zombie: a child that exited but whose parent has not waited, leaving only its exit status. Orphan: a child whose parent died first; init or a subreaper adopts and reaps it.",
      ),
    ],
    dsa: [
      card(
        "Dutch national flag: what do lo, mid and hi mean, and when do you not advance mid?",
        "Everything before lo is 0, between lo and mid is 1, after hi is 2. When a[mid] is 2 you swap with hi and do hi--, but do not advance mid because the swapped-in element is unexamined.",
      ),
    ],
    eng: [],
  }),
  ...week(4, {
    core: [
      card(
        "State Coffman's four conditions for deadlock and one way to break each.",
        "Mutual exclusion, hold and wait, no preemption, circular wait. Breaking circular wait with a global lock order is the usual fix; try-lock with back-off breaks hold and wait.",
      ),
      card(
        "Why must you wait on a condition variable inside a loop?",
        "Wake-ups can be spurious and another thread may change the state before you reacquire the lock (Mesa semantics), so recheck the condition every time you wake.",
      ),
      card(
        "Internal versus external fragmentation?",
        "Internal: wasted space inside an allocated block (rounding up, headers). External: enough total free space, but split into pieces too small for the request.",
      ),
    ],
    dsa: [
      card(
        "Binary search on the answer: when does it apply and what does it cost?",
        "When feasible(x) is monotonic (false...false true...true). Search the range for the first true. Cost is O(log(range) x cost of feasible).",
      ),
    ],
    eng: [],
  }),
  ...week(5, {
    core: [
      card(
        "What is TIME_WAIT for, and who enters it?",
        "The active closer (the side that sent the first FIN) waits 2 x MSL so its final ACK can be retransmitted and delayed segments from the old connection die before the 4-tuple is reused.",
      ),
      card(
        "How does an HTTP/1.1 client know where the body ends?",
        "Content-Length, or Transfer-Encoding: chunked (hex size, data, ending with a 0 chunk), or for responses only, the server closing the connection.",
      ),
      card(
        "Safe versus idempotent HTTP methods?",
        "Safe means no side effects (GET, HEAD, OPTIONS). Idempotent means repeating has the same effect (those plus PUT and DELETE). POST is neither, so retries need an idempotency key.",
      ),
    ],
    dsa: [],
    eng: [
      card(
        "Which timeouts should a network server set, and why?",
        "A timeout on reading the request headers, on reading the body, on writing the response, and an idle timeout (`sock.settimeout`, `asyncio.timeout`). Sockets have none by default, so slow clients can hold connections and threads forever (slowloris).",
      ),
    ],
  }),
  ...week(6, {
    core: [
      card(
        "Slow start, congestion avoidance and fast recovery in one line each.",
        "Slow start: cwnd doubles per RTT up to ssthresh. Congestion avoidance: +1 MSS per RTT. On 3 duplicate ACKs, halve and continue (fast recovery); on a timeout, drop cwnd to 1 MSS and restart slow start.",
      ),
      card(
        "Describe the TLS 1.3 handshake.",
        "ClientHello with an ECDHE key share, ServerHello with its share, then both derive keys. The server sends its certificate and a CertificateVerify signature, both sides send Finished. One round trip, forward secrecy mandatory.",
      ),
      card(
        "How is the retransmission timeout computed?",
        "Keep SRTT and RTTVAR from RTT samples (SRTT = 7/8 SRTT + 1/8 R, RTTVAR = 3/4 RTTVAR + 1/4 |SRTT - R|). RTO = SRTT + 4 x RTTVAR, doubled on each timeout; Karn's rule skips samples from retransmissions.",
      ),
    ],
    dsa: [
      card(
        "Sliding-window template for contiguous subarray problems?",
        "Expand the right edge, add the element, shrink the left edge while the window is invalid, record the best. Each index enters and leaves once, so it is O(n).",
      ),
    ],
    eng: [],
  }),
  ...week(7, {
    core: [
      card(
        "B+tree versus LSM tree: when do you choose each?",
        "B+tree: read-heavy workloads, predictable point and range reads, in-place updates. LSM: write-heavy ingestion, sequential appends and batched compaction, at the cost of read and write amplification.",
      ),
      card(
        "What guarantees does a Bloom filter give, and what can it not do?",
        "No false negatives, some false positives; about 10 bits per key with k near 7 gives roughly 1%. It cannot delete or list members. It lets reads skip SSTables that cannot hold the key.",
      ),
      card(
        "Describe the layout of a slotted page.",
        "A header, then a slot array growing from the front (offset and length per tuple) and tuples growing from the end, free space between. A tuple is addressed by (pageID, slotID), so tuples can move without breaking references.",
      ),
    ],
    dsa: [
      card(
        "Monotonic stack for next greater element: scan direction and pop rule?",
        "Scan right to left, pop while the top is <= the current value, the top (if any) is the answer, then push. Each element is pushed and popped once: O(n).",
      ),
    ],
    eng: [],
  }),
  ...week(8, {
    core: [
      card(
        "Name the three ARIES recovery passes.",
        "Analysis (find active transactions and dirty pages from the last checkpoint), redo (repeat history for changes missing from pages), undo (roll back transactions with no commit record).",
      ),
      card(
        "What anomaly does snapshot isolation still allow, and what is an example?",
        "Write skew: two transactions read the same data and write different rows, jointly breaking an invariant, such as two on-call doctors both going off call. Serializable (for example SSI) prevents it, at the cost of retries.",
      ),
      card(
        "State the write-ahead rule and why it makes commits fast.",
        "The log record for a change must be durable before the changed data page is written, and a transaction commits when its commit record is durable. The log is sequential; data pages can be flushed later in any order.",
      ),
    ],
    dsa: [
      card(
        "Sliding window maximum with a deque: what does it hold and when do elements leave?",
        "Indices with decreasing values; the front is the maximum. Pop from the back while the new value is >=, and pop from the front when its index is out of the window. O(n).",
      ),
    ],
    eng: [],
  }),
  ...week(9, {
    core: [
      card(
        "Lamport clocks versus vector clocks?",
        "Lamport: a single counter; a -> b implies L(a) < L(b), but not the reverse. Vector: one counter per node; it exactly characterises causality and can detect concurrent events, at O(n) space.",
      ),
      card(
        "Summarise a Raft leader election in four steps.",
        "A follower times out and becomes a candidate with term + 1; it requests votes; voters grant one vote per term to a candidate whose log is at least as up to date; a majority makes it leader and it sends heartbeats.",
      ),
      card(
        "Linearizable versus eventually consistent?",
        "Linearizable behaves like a single copy: once a new value is read, every later read returns it or newer. Eventual only promises that replicas converge if updates stop.",
      ),
    ],
    dsa: [
      card(
        "Tree recursion pattern behind diameter and maximum path sum?",
        "Return one value to the parent (the best downward height or path) while recording a different combined value in a global answer.",
      ),
    ],
    eng: [],
  }),
  ...week(10, {
    core: [
      card(
        "State Raft's commit rule and why it only counts current-term entries.",
        "A leader commits index N when a majority hold it and log[N].term equals the current term. An older-term entry on a majority can still be overwritten by a later leader that lacks it (Raft paper Figure 8), so it commits indirectly.",
      ),
      card(
        "Explain consistent hashing and why virtual nodes help.",
        "Nodes and keys are hashed onto a ring and a key belongs to the next node clockwise, so adding or removing a node moves about 1/N of keys. Virtual nodes even out the load, spread a failure and weight bigger machines.",
      ),
      card(
        "What is an idempotency key?",
        "A client-chosen unique id for one logical operation, sent with every retry. The server stores key -> result atomically with the effect and returns the stored result for repeats, giving exactly-once effect over at-least-once delivery.",
      ),
    ],
    dsa: [
      card(
        "Lowest common ancestor in a binary tree?",
        "Return the node if it is None, p or q; recurse both sides; if both sides return non-None this node is the LCA, otherwise pass up whichever side is non-None.",
      ),
    ],
    eng: [],
  }),
  ...week(11, {
    core: [
      card(
        "What makes a module deep, and why is that good?",
        "A small interface hiding a lot of functionality. A module's cost is its interface and its benefit is what it hides, so deep modules reduce cognitive load and leak less.",
      ),
      card(
        "Mocks versus fakes: which do you prefer and when do you use the other?",
        "Prefer real code or fakes (in-memory store, httptest), which test behaviour. Use mocks or stubs at slow, nondeterministic or external boundaries such as third-party APIs and the clock.",
      ),
      card(
        "Describe an expand-and-contract rollout for a breaking API change.",
        "Add the new behaviour alongside the old, announce deprecation, migrate clients while monitoring old-version usage, then remove the old behaviour in a new major version.",
      ),
    ],
    dsa: [
      card(
        "How do you validate a BST correctly?",
        "Pass bounds down: each node must lie strictly within (lo, hi) set by all its ancestors, not merely compare with its parent. Or check the inorder sequence is strictly increasing.",
      ),
    ],
    eng: [],
  }),
  ...week(12, {
    core: [
      card(
        "Bias versus variance: symptoms and fixes?",
        "High bias (underfitting): poor on train and validation; use a more expressive model or better features. High variance (overfitting): great on train, poor on validation; more data, regularisation, a simpler model.",
      ),
      card(
        "Define precision, recall and F1.",
        "Precision = TP / (TP + FP). Recall = TP / (TP + FN). F1 = 2PR / (P + R). Accuracy misleads on imbalanced data, so choose the threshold by the cost of false positives versus false negatives.",
      ),
      card(
        "Explain backpropagation.",
        "The loss is a graph of simple operations. The chain rule is applied once in reverse topological order, reusing intermediate gradients, so all parameter gradients cost roughly one extra forward pass. Gradients accumulate with +=, so zero them every step.",
      ),
    ],
    dsa: [
      card(
        "Kahn's algorithm: steps and what failure means?",
        "Compute indegrees, queue nodes with indegree 0, repeatedly pop a node, add it to the order and decrement neighbours. If fewer than n nodes are produced, the graph has a cycle.",
      ),
    ],
    eng: [],
  }),
  ...week(13, {
    core: [
      card(
        "Write self-attention and the shapes involved.",
        "softmax(Q Kᵀ / sqrt(d_k)) V. For T tokens, Q and K are T x d_k, scores and weights are T x T, and the output is T x d_v. Cost is quadratic in T.",
      ),
      card(
        "What is the KV cache and why does decode need it?",
        "It stores keys and values of past tokens for every layer so each new token reuses them instead of recomputing. Memory grows linearly with context: 2 x layers x kv_heads x head_dim x tokens x bytes.",
      ),
      card(
        "Explain LoRA.",
        "Freeze the pretrained weight W and learn a low-rank update (alpha / r) B A with B (d x r) and A (r x k). Trainable parameters are r(d + k), typically under 1%, and the update can be merged into W for no inference cost.",
      ),
    ],
    dsa: [
      card(
        "House robber recurrence and its space-optimised form?",
        "dp[i] = max(dp[i-1], dp[i-2] + a[i]): skip or take. Keep only the last two values for O(1) space.",
      ),
    ],
    eng: [],
  }),
  ...week(14, {
    core: [
      card(
        "What is the lethal trifecta and how do you defend against it?",
        "Access to private data, exposure to untrusted content and a way to communicate externally. If an agent has all three, an attacker's content can make it leak data. Remove at least one leg; asking the model to ignore bad instructions is not a defence.",
      ),
      card(
        "Describe the eval loop for an LLM feature.",
        "Find failures in real traces, write cases with expected outputs or criteria, measure with code graders where possible and a validated LLM judge elsewhere, change one thing, re-measure, and keep a held-out slice.",
      ),
      card(
        "Why stream, and what must you do when the client disconnects?",
        "Streaming cuts time to first token to a fraction of the full generation time. When the client disconnects, the request context is cancelled; pass it upstream so the stream closes and you stop paying for unread tokens.",
      ),
    ],
    dsa: [
      card(
        "Coin change: min coins versus number of combinations, and the loop-order rule?",
        "Min coins: dp[a] = min(dp[a-c] + 1). Combinations: coins in the outer loop, amounts ascending inside. Amounts outside counts permutations. Upward inner loops allow reuse; downward is 0/1.",
      ),
    ],
    eng: [],
  }),
  ...week(15, {
    core: [
      card(
        "Why combine BM25 and embeddings, and how with Reciprocal Rank Fusion?",
        "BM25 is strong on exact rare tokens but weak on paraphrase; embeddings are the reverse. RRF merges rankings by summing 1 / (60 + rank) per ranking, so no incomparable scores are mixed.",
      ),
      card(
        "Bi-encoder versus cross-encoder?",
        "Bi-encoder: query and document encoded separately with precomputed document vectors, fast and approximate. Cross-encoder: query and document go through the transformer together, far more accurate but one pass per pair, so rerank only the top 20-100.",
      ),
      card(
        "Which metrics evaluate retrieval and which evaluate the answer?",
        "Retrieval: recall@k, MRR, nDCG, precision@k. Answer: faithfulness, answer relevancy, correctness against a reference. Abstention: correct-abstention and false-refusal rates. Evaluate stages separately to see which failed.",
      ),
    ],
    dsa: [
      card(
        "Edit-distance recurrence and base cases?",
        "dp[i][0] = i, dp[0][j] = j. If the characters match, dp[i][j] = dp[i-1][j-1]; otherwise 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for delete, insert, replace.",
      ),
    ],
    eng: [],
  }),
  ...week(16, {
    core: [
      card(
        "List the checks that keep tenants isolated in a RAG service.",
        "tenant_id on every chunk, cache entry and trace; a required parameter on the one retrieval function, derived from the authenticated identity; awareness that ANN plus a post-filter can return fewer rows; adversarial tests with copied text and prompt injection; checks of caches and logs.",
      ),
      card(
        "What goes in an answer-cache key and how do you invalidate?",
        "Tenant, normalised question, corpus version, prompt version and model. Bumping the corpus version makes old entries unreachable; finer: track which documents each answer used and invalidate those keys. Add a TTL and guard against stampedes.",
      ),
      card(
        "Name the sections of a blameless postmortem.",
        "Summary and impact, timeline, root cause or trigger, detection, what went well and badly and where we got lucky, action items with owner, priority and deadline, and lessons learned.",
      ),
    ],
    dsa: [
      card(
        "Union-find: operations and optimisations?",
        "Find returns the root with path compression (or halving); Union joins two roots by size or rank and returns false if they were already connected. Together they are near-constant amortised time.",
      ),
    ],
    eng: [],
  }),
];
