import { blank, card, match, mcq, multi, order, py, sql, tf, week, yaml } from "./types";

export const W15 = week(15, {
  core: [
    mcq(
      "Why does the code negate the similarities before `argsort`?",
      [
        "To normalise them",
        "argsort sorts ascending, so negating puts the highest cosine similarity first",
        "To avoid overflow",
        "Embeddings are negative",
      ],
      1,
      "With unit-length embeddings, the dot product E @ q is the cosine similarity.",
      py`
E = m.encode(chunks, normalize_embeddings=True)
q = m.encode([query], normalize_embeddings=True)[0]
top = np.argsort(-(E @ q))[:10]
`,
    ),
    mcq(
      "For unit-length vectors, dot product ranking is the same as…",
      [
        "Cosine ranking and Euclidean ranking",
        "Only random ranking",
        "Manhattan ranking only",
        "None of them",
      ],
      0,
      "For unit vectors, ||a - b||^2 = 2 - 2cos. Follow the metric the embedding model was trained for.",
    ),
    mcq(
      "Two unit vectors have cosine similarity 0.8. What is the squared Euclidean distance between them?",
      ["0.2", "0.4", "0.8", "1.6"],
      1,
      "2 - 2 x 0.8 = 0.4.",
    ),
    mcq(
      "Why does exact k-NN not scale?",
      [
        "It is inaccurate",
        "It compares the query with every vector, O(N x d) per query: 10 million 768-d vectors is about 7.7 billion multiply-adds",
        "It needs a GPU",
        "It cannot use cosine",
      ],
      1,
    ),
    match("Match each ANN idea to its description.", [
      ["HNSW", "layered proximity graph, like a skip list over a graph"],
      ["IVF", "cluster the vectors and search only the nprobe nearest clusters"],
      ["PQ (product quantisation)", "compress vectors into short codes to save memory"],
    ]),
    mcq(
      "Raising HNSW's `ef_search` gives…",
      ["Lower recall, faster", "Higher recall, slower queries", "Smaller index", "No change"],
      1,
    ),
    multi(
      "What does an ANN index give up compared with exact search?",
      [
        "Exactness: it may miss true neighbours, so measure recall@k against exact",
        "Simple deletes and updates",
        "Extra memory and build time (HNSW lives in RAM)",
        "The ability to return any results",
      ],
      [0, 1, 2],
    ),
    mcq(
      "Why can 'The food was great' and 'The food was terrible' have similar embeddings?",
      [
        "A bug",
        "Embeddings capture topical and contextual similarity, not logical contradiction; negation and antonyms are weak spots",
        "They share a tokenizer",
        "Cosine ignores words",
      ],
      1,
      "One reason to also use keyword search and a reranker.",
    ),
    order(
      "Order the RAG query path.",
      [
        "Retrieve with vector and keyword search",
        "Fuse the rankings",
        "Rerank the candidates",
        "Put the top few chunks in the prompt",
        "The LLM writes the answer",
      ],
      "Most RAG failures are retrieval failures: if the right chunk is not in the prompt, the model cannot use it.",
    ),
    mcq(
      "What is the problem with chunks that are too large?",
      [
        "They embed too precisely",
        "The embedding blurs several topics, noisy text wastes context, and the answer can get buried",
        "They cannot be indexed",
        "They are too fast",
      ],
      1,
      "Too small and they lack context or split the answer. A common start is 200-800 tokens with 10-20% overlap.",
    ),
    multi(
      "Which are sensible to store with every chunk?",
      ["Source URL", "Title and heading path", "Content hash", "The user's password"],
      [0, 1, 2],
    ),
    mcq(
      "Which query is BM25 most likely to handle better than an embedding search?",
      [
        "'how do I get my money back' (the docs say 'refund')",
        "ECONNRESET (an exact error code)",
        "a paraphrase of a long sentence",
        "a question in a different language",
      ],
      1,
      "BM25 rewards rare exact tokens (error codes, function names, IDs) but is weak on synonyms; embeddings are the reverse, so combine them with hybrid search.",
    ),
    mcq(
      "Reciprocal Rank Fusion scores a document with…",
      [
        "Its raw scores added",
        "The sum over rankings of 1 / (k + rank), with k = 60",
        "Its best rank only",
        "A learned weight",
      ],
      1,
      "It merges rankings without comparing incomparable scores.",
      py`
def rrf(rankings, k=60):
    s = {}
    for r in rankings:
        for rank, doc in enumerate(r, 1):
            s[doc] = s.get(doc, 0) + 1 / (k + rank)
    return sorted(s, key=s.get, reverse=True)
`,
    ),
    blank(
      "A document is ranked 1st by the vector search and 3rd by BM25. With k = 60, its RRF score is about ___ (three decimals).",
      ["0.032"],
      "1/61 + 1/63 = 0.01639 + 0.01587 = 0.03226.",
    ),
    mcq(
      "Why can you only rerank the top 20-100 candidates with a cross-encoder?",
      [
        "It has no GPU support",
        "It needs one forward pass per (query, document) pair, whereas bi-encoder document vectors are precomputed",
        "It cannot score text",
        "Cross-encoders are inaccurate",
      ],
      1,
      "Feeding query and document together lets every query token attend to every document token, which is much more accurate.",
    ),
    tf(
      "Stuffing more and more chunks into the prompt always improves answers.",
      false,
      "Models use the start and end of a long context better than the middle ('lost in the middle'). Prefer fewer, better chunks.",
    ),
    multi(
      "Which make an ingestion job idempotent?",
      [
        "Chunk ids derived from content, and upserting by id",
        "Skipping documents whose content hash is unchanged",
        "Deleting chunks whose source disappeared",
        "Appending duplicates on every rerun",
      ],
      [0, 1, 2],
      "Also publish atomically to a new index version, and version the chunker and embedding model.",
    ),
    multi(
      "Which checks verify that a cited source supports a claim?",
      [
        "The cited id exists in the retrieved set",
        "The quoted text appears verbatim in the chunk",
        "An LLM or NLI judge confirms support",
        "The citation looks plausible",
      ],
      [0, 1, 2],
      "Citations prove attribution, not truth.",
    ),
    mcq(
      "How should the abstention threshold be chosen?",
      [
        "By the model",
        "Tuned on an eval set of answerable and unanswerable questions, balancing wrong answers against false refusals",
        "Always 0.5",
        "By the engineer, ignoring data",
      ],
      1,
    ),
    mcq(
      "What is the risk of query rewriting?",
      [
        "It is too slow",
        "The rewrite can drop constraints, resolve a pronoun wrongly or inject assumptions, changing the question",
        "It breaks BM25",
        "It needs a GPU",
      ],
      1,
      "Log the original and rewritten queries and test rewrites.",
    ),
    mcq(
      "Contextual retrieval prepends to each chunk…",
      [
        "A random id",
        "A short LLM-written sentence situating it within its whole document, used for both embeddings and BM25",
        "The user's query",
        "A summary of the corpus",
      ],
      1,
    ),
    match("Match each technique to its idea.", [
      ["HyDE", "embed a hypothetical answer and search with it"],
      ["Self-RAG", "retrieve only when needed and critique the answer"],
      ["Contextual retrieval", "prepend document context to each chunk before indexing"],
    ]),
    mcq(
      "Why evaluate retrieval and answers separately?",
      [
        "It is cheaper",
        "End-to-end quality cannot tell you which stage failed; if recall@5 is 60%, no prompt will lift answers beyond about 60%",
        "Metrics are identical",
        "To avoid LLM judges",
      ],
      1,
    ),
    mcq(
      "For three questions the first relevant result is at ranks 1, 2 and 4. What is the MRR?",
      ["0.25", "0.58", "0.75", "2.33"],
      1,
      "(1 + 1/2 + 1/4) / 3 = 0.583.",
      py`
def rr(ranked, gold):
    return next((1 / i for i, d in enumerate(ranked, 1) if d in gold), 0.0)
`,
    ),
    mcq(
      "In RAG evaluation, 'faithfulness' means…",
      [
        "The answer matches the reference exactly",
        "Every claim in the answer is supported by the retrieved context",
        "The answer is short",
        "The retrieval is fast",
      ],
      1,
    ),
    mcq(
      "How should you run ablations?",
      [
        "Change several things at once",
        "Change one thing at a time on the same golden set, and report metric deltas plus cost and latency",
        "Use a different set each time",
        "Ignore cost",
      ],
      1,
    ),
    blank(
      "With a 40-question evaluation, one question is worth ___ percentage points.",
      ["2.5"],
      "A score of 80% (32/40) has a 95% confidence interval of about plus or minus 12 points, so a 5-point 'win' is two questions: noise.",
    ),
    mcq(
      "Which test suits a paired comparison of two systems on the same questions?",
      [
        "McNemar's test (or a bootstrap of the difference)",
        "A coin flip",
        "Averaging accuracy",
        "A t-test on token counts",
      ],
      0,
    ),
    mcq(
      "How should a RAG API report 'I could not find an answer'?",
      [
        "A 500 error",
        "A 200 response with status no_answer and a reason; reserve 4xx and 5xx for real errors",
        "An empty body",
        "A made-up answer",
      ],
      1,
      "Measure the abstention rate and correct versus false refusals. A broken index looks like 'everyone gets no answer'.",
    ),
  ],
  dsa: [
    mcq(
      "Longest common substring differs from longest common subsequence in that on a mismatch dp[i][j] is…",
      ["max(dp[i-1][j], dp[i][j-1])", "reset to 0", "dp[i-1][j-1]", "infinity"],
      1,
      "The answer is the maximum over all cells, not the last cell.",
      py`
if s[i - 1] == t[j - 1]:
    dp[i][j] = dp[i - 1][j - 1] + 1
    best = max(best, dp[i][j])
# else dp[i][j] stays 0
`,
    ),
    blank(
      "The longest palindromic subsequence of s equals LCS(s, ___(s)).",
      ["reverse|reversed"],
      "Minimum insertions to make a string a palindrome is n minus that length.",
    ),
    mcq(
      "Minimum insertions and deletions to turn A into B?",
      ["|A| + |B|", "|A| + |B| - 2 x LCS(A, B)", "LCS(A, B)", "max(|A|, |B|)"],
      1,
    ),
    mcq(
      "Edit distance between `kitten` and `sitting` is…",
      ["2", "3", "4", "5"],
      1,
      "k to s, e to i, and insert g.",
    ),
    mcq(
      "In the edit-distance recurrence, a mismatch costs…",
      [
        "dp[i-1][j-1]",
        "1 + min(delete, insert, replace) = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
        "0",
        "max of the three",
      ],
      1,
    ),
    mcq(
      "In wildcard matching, what does `*` in the pattern allow at dp[i][j]?",
      [
        "Only dp[i-1][j-1]",
        "dp[i-1][j] (star matches empty) or dp[i][j-1] (star matches one more character)",
        "Nothing",
        "Always true",
      ],
      1,
    ),
    mcq(
      "For word break, `dp[i]` is true when…",
      [
        "The whole string is a word",
        "Some j < i has dp[j] true and s[j:i] is in the dictionary",
        "s[:i] is a palindrome",
        "The dictionary is empty",
      ],
      1,
    ),
    mcq(
      "Why do interval DP solutions think about the 'last' action (last balloon, last multiplication)?",
      [
        "To reduce memory",
        "So the left and right sides become independent subproblems",
        "To sort",
        "Convention",
      ],
      1,
    ),
    mcq(
      "What is the typical time complexity of interval DP with a split point k?",
      ["O(n)", "O(n log n)", "O(n^2)", "O(n^3)"],
      3,
    ),
  ],
  eng: [
    mcq(
      "How should you benchmark an approximate nearest-neighbour index?",
      [
        "Quote one QPS number",
        "Sweep the knob (ef_search, nprobe) and plot recall@k against QPS or latency; compare Pareto frontiers",
        "Compare build times only",
        "Use a toy dataset",
      ],
      1,
    ),
    mcq(
      "Why is it a mistake to report '1,000 QPS' for an ANN index alone?",
      [
        "QPS is meaningless",
        "Without the recall at that speed the number says nothing; quality trades against cost",
        "QPS cannot be measured",
        "It is too low",
      ],
      1,
    ),
    mcq(
      "You tried 20 variants and the best beat the baseline by 3 points. What now?",
      [
        "Ship it",
        "Treat the best of many with suspicion and confirm on a fresh held-out set",
        "Try 20 more",
        "Report only the best",
      ],
      1,
    ),
    mcq(
      "Why does 'unchanged documents are skipped by comparing content hashes' matter?",
      [
        "It speeds up reads",
        "Embedding calls cost money and time; only changed chunks should be re-embedded",
        "It prevents leaks",
        "It encrypts data",
      ],
      1,
    ),
  ],
});

export const W16 = week(16, {
  core: [
    mcq(
      "In incremental ingestion, a document whose content hash has not changed is…",
      ["Re-embedded anyway", "Skipped", "Deleted", "Moved"],
      1,
      "A changed document is re-chunked, re-embedded and upserted with stale chunks deleted; a removed document has its chunks deleted. Bump a corpus version on any change.",
    ),
    mcq(
      "What is wrong with this API design for tenant isolation?",
      [
        "Nothing",
        "tenant_id must come from the authenticated identity, never from the request body, and the retrieval function should require it",
        "It should use GET",
        "It should return more rows",
      ],
      1,
      "Enforce the filter inside the single retrieval function every code path must call, deny by default, and consider row-level security as defence in depth.",
      py`
@app.post("/v1/ask")
def ask(req: Ask):
    # req.tenant comes straight from the JSON body
    return pipeline(req.tenant, req.question)
`,
    ),
    mcq(
      "What does this pgvector query return?",
      [
        "5 random rows",
        "The 5 chunks nearest the query embedding by cosine distance, within the tenant",
        "All chunks",
        "5 rows from every tenant",
      ],
      1,
      "Caution: an HNSW index may scan the nearest candidates and then apply the WHERE, returning fewer than k rows. pgvector offers iterative index scans.",
      sql`
SELECT id, text FROM chunks
WHERE tenant_id = $1
ORDER BY embedding <=> $2
LIMIT 5;
`,
    ),
    mcq(
      "How would you test tenant isolation adversarially?",
      [
        "Run the happy path only",
        "Have tenant A query text copied verbatim from B's documents, or try prompt injection, and assert no B chunk id is ever returned; also check caches, logs and traces",
        "Trust the filter",
        "Disable the tests",
      ],
      1,
    ),
    multi(
      "What should an answer-cache key include?",
      [
        "Tenant id",
        "Normalised question",
        "Corpus version, prompt version and model",
        "The current time to the millisecond",
      ],
      [0, 1, 2],
      "A missing input means wrong answers served as fresh. A version bump makes old entries unreachable without deleting them.",
    ),
    mcq(
      "Why is a semantic cache risky?",
      [
        "It is slow",
        "Similar questions can have opposite answers (within versus after 30 days), and answers may cross tenants or go stale",
        "It uses too much disk",
        "It cannot be tested",
      ],
      1,
    ),
    order("Order the spans of one traced RAG request.", [
      "ask",
      "rewrite",
      "retrieve (vector and BM25)",
      "rerank",
      "generate",
    ]),
    match("Match each layer to its responsibility.", [
      ["Gateway (async Python)", "auth, rate limits, request ids, timeouts, circuit breaking"],
      ["Model service (Python)", "retrieval, reranking, prompt assembly, generation"],
      ["Liveness probe /healthz", "the process is up; restart if it fails"],
      ["Readiness probe /readyz", "dependencies are loaded; route traffic only when ready"],
    ]),
    mcq(
      "The RAG service gets slow. What should the gateway do?",
      [
        "Queue requests without bound",
        "Enforce a timeout, trip the circuit breaker, and degrade (cached answer, keyword-only result or a clear 'try again' with Retry-After)",
        "Retry forever",
        "Crash",
      ],
      1,
    ),
    match("Match each ML technical-debt term (Sculley et al.) to its meaning.", [
      ["Entanglement", "changing anything changes everything"],
      ["Pipeline jungle", "tangled glue code between data preparation steps"],
      ["Feedback loop", "model output influences future training data"],
      ["Unstable data dependency", "an input signal that changes underneath you"],
    ]),
    mcq(
      "Training-serving skew is…",
      [
        "Slow training",
        "Features or preprocessing differing between experiments and the live service",
        "Using a GPU",
        "A model with too many layers",
      ],
      1,
    ),
    mcq(
      "Data drift versus concept drift?",
      [
        "They are identical",
        "Data drift: the input distribution shifts; concept drift: the right answer for a given input changes",
        "Data drift only happens in training",
        "Concept drift only affects images",
      ],
      1,
    ),
    multi(
      "Which help detect silent quality drops?",
      [
        "A canary set of golden questions run on a schedule",
        "Tracking abstention rate, citation rate and retrieval score distributions",
        "Sampling and grading production traces",
        "Waiting for users to email you",
      ],
      [0, 1, 2],
    ),
    mcq(
      "A canary release sends roughly…",
      [
        "All traffic at once",
        "About 5% of traffic to the new version, compared against the old before promoting or rolling back",
        "No traffic",
        "Only internal tests",
      ],
      1,
    ),
    order("Order the C4 zoom levels.", ["System context", "Containers", "Components", "Code"]),
    blank(
      "Complete the Compose dependency so the gateway starts only once the rag service reports healthy.",
      ["service_healthy"],
      "Use health checks so a service starts only after what it depends on is actually ready.",
      yaml`
gateway:
  build: ./gateway
  depends_on:
    rag:
      condition: ___
`,
    ),
    order("Order the circuit-breaker states for a failing dependency that later recovers.", [
      "Closed",
      "Open: fail fast after N failures",
      "Half-open: a trial request after a cooldown",
      "Closed again",
    ]),
    multi(
      "Which belong in a service's definition of done?",
      [
        "Tests and an eval gate",
        "A runbook and rollback",
        "Metrics, traces and actionable alerts",
        "It works on my machine",
      ],
      [0, 1, 2],
    ),
    match("Match each injected failure to the expected behaviour.", [
      [
        "Kill one of three Raft KV nodes",
        "a majority remains, an election happens, cache errors are treated as misses",
      ],
      ["Stall the LLM", "the timeout fires, repeated failures open the circuit breaker"],
      ["Vector store down", "fall back to BM25 or cached answers and flag degraded quality"],
      ["Flood the gateway", "429 with Retry-After while healthy clients stay unaffected"],
    ]),
    mcq(
      "What is the focus of a blameless postmortem?",
      [
        "Finding the person at fault",
        "Systems and processes, with action items that have an owner, priority and deadline",
        "Hiding the timeline",
        "Marketing",
      ],
      1,
      "Sections: summary and impact, timeline, root cause, detection, what went well and badly, action items, lessons.",
    ),
    mcq(
      "What is a cache stampede and a fix?",
      [
        "A full disk; delete files",
        "Many misses hit the backend at once; use single-flight or locks and jittered TTLs",
        "A slow DNS lookup; add a cache",
        "A race in the OS; reboot",
      ],
      1,
    ),
    mcq(
      "A 'versioned key' invalidation strategy works by…",
      [
        "Deleting every key on write",
        "Including a version in the key so a new version makes old entries unreachable without deletes",
        "Using longer TTLs",
        "Disabling the cache",
      ],
      1,
    ),
    mcq(
      "A stable service contract should expose…",
      [
        "Internals such as the embedding model and index format",
        "Outcomes: status (ok or no_answer), answer, citations, trace id and model version, versioned as /v1",
        "Database credentials",
        "Only raw logs",
      ],
      1,
    ),
  ],
  dsa: [
    match("Match each shortest-path algorithm to what it handles.", [
      ["Dijkstra", "non-negative weights, single source"],
      ["Bellman-Ford", "negative edges, detects negative cycles"],
      ["Floyd-Warshall", "all pairs, O(V^3)"],
    ]),
    mcq(
      "When counting shortest paths with Dijkstra, on an equal-length path to v you…",
      ["Replace ways[v] with ways[u]", "Add: ways[v] += ways[u]", "Ignore it", "Reset dist[v]"],
      1,
      "On a strictly shorter path set ways[v] = ways[u] instead.",
    ),
    mcq(
      "Bellman-Ford detects a negative cycle if…",
      [
        "Any distance is negative",
        "An edge can still be relaxed in the V-th pass",
        "The graph is cyclic",
        "V-1 passes finish",
      ],
      1,
    ),
    mcq(
      "In Floyd-Warshall, which loop must be the outermost?",
      ["i", "j", "k, the allowed intermediate vertices", "Any"],
      2,
    ),
    mcq(
      "DSU with path compression and union by size gives roughly…",
      [
        "O(n) per operation",
        "O(log n) per operation",
        "near-constant amortised time (inverse Ackermann)",
        "O(n^2)",
      ],
      2,
    ),
    mcq(
      "In Kruskal's algorithm an edge is added when…",
      [
        "It is the lightest overall",
        "Union returns true: the endpoints are in different components",
        "It has no neighbours",
        "It forms a cycle",
      ],
      1,
    ),
    mcq(
      "'Number of operations to make a network connected': n = 4 computers and cables `[[0,1],[0,2],[1,2]]`. Answer?",
      ["-1", "0", "1", "2"],
      2,
      "There are enough cables (3 >= n - 1). Components: {0,1,2} and {3}, so components - 1 = 1 cable must be moved.",
    ),
    mcq(
      "In 'making a large island', why collect distinct neighbouring roots?",
      [
        "To sort them",
        "So an island touching a zero on two sides is not counted twice",
        "To save memory",
        "To find cycles",
      ],
      1,
    ),
    mcq(
      "Most stones removed (stones sharing a row or column)?",
      ["stones + components", "stones - components", "components", "stones / 2"],
      1,
      "Within each connected component all but one stone can be removed.",
    ),
    order("Order Kosaraju's SCC algorithm.", [
      "DFS the graph and push each node when it finishes",
      "Transpose the graph (reverse all edges)",
      "Pop nodes from the stack",
      "DFS in the transposed graph from each unvisited node: each tree is one SCC",
    ]),
    mcq(
      "Edge (u, v) is a bridge when…",
      ["low[v] > tin[u]", "low[v] == tin[v]", "tin[u] > low[u]", "u is the root"],
      0,
      "A root is an articulation point only if it has at least two DFS children.",
    ),
    mcq(
      "Network delay time is…",
      [
        "The sum of all edge weights",
        "The maximum shortest distance from the source (or -1 if some node is unreachable)",
        "The minimum edge",
        "The number of nodes",
      ],
      1,
    ),
  ],
  eng: [
    mcq(
      "Why is a service's contract kept stateless?",
      [
        "It is shorter",
        "So it can scale horizontally and be replaced, with state in a KV store, database or index",
        "Because state is illegal",
        "To avoid logging",
      ],
      1,
    ),
    mcq(
      "Which belongs in a good retrospective?",
      [
        "Only what went well",
        "What was built, what went well, what was harder than expected, what I learned, what I still do not understand, and concrete next steps with dates",
        "A list of people to blame",
        "A marketing summary",
      ],
      1,
    ),
    mcq(
      "Which of these is a hazard of caching?",
      [
        "Caches never hide outages",
        "A cache can keep serving while the backend is broken, hiding the outage and bugs",
        "Cache hit rate is irrelevant",
        "Unlimited memory is free",
      ],
      1,
    ),
    mcq(
      "In a definition of done, 'actionable alerts' means…",
      [
        "Alerts for every metric",
        "Alerts on symptoms users feel, each with a runbook step",
        "No alerts",
        "Email on every log line",
      ],
      1,
    ),
    card(
      "Name the habits the plan says are worth keeping.",
      "Commit small, test first, measure before optimising, write things down, review code, state guarantees, and design for failure.",
    ),
  ],
});
