import { blank, card, match, mcq, multi, order, py, tf, week } from "./types";

export const W13 = week(13, {
  core: [
    blank(
      "Attention(Q, K, V) = softmax(Q Kᵀ / √___) V, where the missing symbol is the key dimension.",
      ["d_k|dk|d_k |d"],
      "Each token's output is a weighted average of all value vectors, with weights from how well its query matches each key.",
    ),
    mcq(
      "For T = 10 tokens and d_k = 64, what is the shape of the attention score matrix Q Kᵀ?",
      ["10 x 64", "64 x 64", "10 x 10", "64 x 10"],
      2,
      "Scores are T x T, which is why attention cost grows quadratically with context length.",
    ),
    mcq(
      "Why divide the scores by √d_k?",
      [
        "To make the matrix smaller",
        "Dot products of d_k-dimensional vectors have variance proportional to d_k; unscaled, softmax saturates into near one-hot with tiny gradients",
        "To enforce the causal mask",
        "To normalise the values",
      ],
      1,
    ),
    blank(
      "With d_model = 768 and 12 heads, each head has d_k = ___.",
      ["64"],
      "d_k = d_model / h. Heads are concatenated and projected with W_O.",
    ),
    mcq(
      "Which entries does this causal mask allow?",
      [
        "Only the diagonal",
        "The lower triangle: token i may attend to positions j <= i",
        "The upper triangle",
        "Everything",
      ],
      1,
      "Scores for masked positions are set to a huge negative value before the softmax. Without it, training in one parallel pass would let position t read the answer at t + 1.",
      py`
mask = np.tril(np.ones((T, T), dtype=bool))
scores = np.where(mask, scores, -1e9)
`,
    ),
    mcq(
      "Without positional information, why does a transformer treat 'dog bites man' like 'man bites dog'?",
      [
        "It is trained badly",
        "Attention is permutation-equivariant: shuffling tokens just shuffles the outputs",
        "Embeddings are identical",
        "The mask removes order",
      ],
      1,
    ),
    multi(
      "Which are ways of giving a transformer position information?",
      [
        "Sinusoidal encodings",
        "Learned position embeddings",
        "Rotary embeddings (RoPE)",
        "Batch normalisation",
      ],
      [0, 1, 2],
    ),
    mcq(
      "You double the context length. Roughly how does attention compute change?",
      ["2x", "4x", "8x", "unchanged"],
      1,
      "Scores are T x T. FlashAttention computes the exact result without materialising the full matrix; sliding-window attention reduces it.",
    ),
    order("Order the operations in a pre-LayerNorm decoder block.", [
      "LayerNorm of x",
      "Multi-head attention, then add the residual",
      "LayerNorm of the result",
      "MLP (d to 4d to d with GELU), then add the residual",
    ]),
    mcq(
      "Roughly how many parameters does one transformer block have, for model width d?",
      ["2 d^2", "6 d^2", "12 d^2", "d^3"],
      2,
      "Attention has 4d^2 (W_Q, W_K, W_V, W_O) and the MLP 8d^2. GPT-2 small: 12 x 12 x 768^2 is about 85M, plus about 39M of embeddings, gives 124M.",
    ),
    mcq(
      "Byte-level BPE starts its vocabulary with…",
      [
        "All English words",
        "The 256 byte values, so any string is representable",
        "Characters of the training set only",
        "Random ids",
      ],
      1,
    ),
    mcq(
      "Given ids `[1, 2, 1, 2, 3]`, which pair is merged first by BPE?",
      ["(2, 1)", "(1, 2)", "(2, 3)", "(1, 3)"],
      1,
      "(1, 2) appears twice, the others once. Merging it into id 256 gives `[256, 256, 3]`.",
      py`
def get_stats(ids):
    c = {}
    for p in zip(ids, ids[1:]):
        c[p] = c.get(p, 0) + 1
    return c
`,
    ),
    mcq(
      "To encode new text with a trained BPE tokenizer you…",
      [
        "Look words up in a dictionary",
        "Convert to bytes and apply the learned merges in the order they were learned",
        "Split on spaces",
        "Hash the text",
      ],
      1,
    ),
    multi(
      "Which odd LLM behaviours are partly caused by tokenisation?",
      [
        "Difficulty counting letters or spelling words",
        "Weakness at long arithmetic, since numbers split into irregular chunks",
        "Non-English text and code costing more tokens",
        "Being unable to read the prompt at all",
      ],
      [0, 1, 2],
    ),
    tf("'hello', ' hello' and 'Hello' can be three different tokens.", true),
    mcq(
      "What is the trade-off of a bigger vocabulary?",
      [
        "Longer sequences and cheaper embeddings",
        "Shorter sequences, but larger embedding and output matrices and rarer, under-trained tokens",
        "No trade-off",
        "Faster tokenisation only",
      ],
      1,
    ),
    blank(
      "A character-level model with a 65-character vocabulary should start with a loss near ln(65), about ___.",
      ["4.17|4.2"],
      "Initial loss near ln(vocab) means the model starts uniform. Much higher or lower is a hint of a bug.",
    ),
    mcq(
      "What does lowering the sampling temperature do?",
      [
        "Changes the model's knowledge",
        "Sharpens the distribution so top tokens get more probability; T near 0 is greedy argmax",
        "Increases the vocabulary",
        "Changes the ranking of tokens",
      ],
      1,
      "Temperature rescales logits only. top-k and top-p are separate truncation rules.",
    ),
    match(
      "Match each training stage to its main result.",
      [
        ["Pretraining", "a base model with broad knowledge that just continues text"],
        ["Supervised fine-tuning", "follows instructions and formats"],
        ["Preference tuning (RLHF or DPO)", "helpfulness, safety and tone"],
      ],
      "Pretraining is by far the most expensive; later stages shape behaviour more than knowledge.",
    ),
    mcq(
      "How does DPO differ from RLHF with PPO?",
      [
        "It needs more compute",
        "It skips the reward model and RL loop, using a classification-style loss on chosen versus rejected responses relative to a frozen reference",
        "It uses no preference data",
        "It is unsupervised",
      ],
      1,
    ),
    mcq(
      "LoRA with d = k = 4096 and rank r = 8 trains about how large a share of that matrix's parameters?",
      ["50%", "10%", "about 0.4%", "100%"],
      2,
      "r(d + k) = 8 x 8192 = 65,536 against d x k = 16.8 million.",
    ),
    mcq(
      "You need answers about documents that change weekly, with citations. The best fit is…",
      [
        "Fine-tuning on the documents",
        "Retrieval (RAG): update the index, not the weights",
        "A bigger temperature",
        "Pretraining",
      ],
      1,
      "Fine-tuning is poor at reliably adding knowledge and goes stale; use it for style, format and narrow repeatable tasks.",
    ),
    tf(
      "Once you tune your prompt on a held-out set, it is still an unbiased estimate.",
      false,
      "Any decision made from the held-out set influences the model, so use a fresh set for the final number.",
    ),
    mcq(
      "Which statement about LLM generation is right?",
      [
        "Prefill is memory-bandwidth bound and decode is compute bound",
        "Prefill is compute bound (the prompt is processed in parallel); decode is memory-bandwidth bound (weights are re-read for every token)",
        "Both are limited by the network",
        "Neither depends on hardware",
      ],
      1,
      "That is why the first token is slower: time to first token pays for the entire prompt.",
    ),
    blank(
      "A decode-bound model of 8 GB on 200 GB/s memory generates about ___ tokens per second at batch size 1.",
      ["25"],
      "tokens/s is roughly memory bandwidth divided by bytes read per token (about the model size). Quantising to 4 bits makes decode faster because it is bandwidth-bound.",
    ),
    mcq(
      "Llama-2-7B has 32 layers, 32 KV heads, head_dim 128 in fp16. How much KV cache does 4,096 tokens need per sequence?",
      ["About 20 MB", "About 200 MB", "About 2 GB", "About 20 GB"],
      2,
      "2 x 32 x 32 x 128 x 2 bytes = 512 KB per token; times 4,096 is 2 GB. Grouped-query attention (fewer KV heads) cuts it.",
    ),
    mcq(
      "PagedAttention is like…",
      [
        "A cache replacement policy",
        "Virtual memory: the KV cache lives in fixed-size blocks at non-contiguous locations mapped by a block table",
        "A tokenizer",
        "A learning rate schedule",
      ],
      1,
    ),
    mcq(
      "How should you decide whether a 4-bit quantised model is good enough?",
      [
        "Trust the file size",
        "Run the same prompts and metric on both versions and compare accuracy and latency",
        "Check only perplexity",
        "Assume no quality loss",
      ],
      1,
    ),
  ],
  dsa: [
    order("Order the dynamic-programming recipe.", [
      "Define the state",
      "Write the recurrence",
      "Set the base cases",
      "Choose an evaluation order (small to large)",
      "Locate the answer, then optimise space",
    ]),
    mcq(
      "What does this compute for `[2, 7, 9, 3, 1]`?",
      ["10", "11", "12", "22"],
      2,
      "Take-or-skip: 2 + 9 + 1 = 12 is the best sum with no two adjacent.",
      py`
def rob(a):
    prev2 = prev1 = 0
    for v in a:
        prev2, prev1 = prev1, max(prev1, prev2 + v)
    return prev1
`,
    ),
    mcq(
      "Unique paths (right/down) in a 3 x 7 grid?",
      ["21", "28", "35", "56"],
      1,
      "C(m + n - 2, m - 1) = C(8, 2) = 28.",
    ),
    mcq(
      "Bottom-up minimum triangle path uses which recurrence per cell?",
      [
        "dp[j] = t[i][j] + max(dp[j], dp[j+1])",
        "dp[j] = t[i][j] + min(dp[j], dp[j+1])",
        "dp[j] = dp[j-1] + dp[j]",
        "dp[j] = t[i][j]",
      ],
      1,
    ),
    mcq(
      "Buy and sell stock with unlimited transactions on `[7,1,5,3,6,4]`: the maximum profit is…",
      ["5", "6", "7", "8"],
      2,
      "Sum the positive differences: (5-1) + (6-3) = 7. With one transaction the answer would be 5.",
    ),
    blank(
      "For subset sum with each item used at most once, iterate the sums ___ (high to low) in the inner loop.",
      ["downward|downwards|backward|backwards|descending|high to low"],
      "Updating dp[s] from a dp[s - v] not yet touched this round guarantees each item is used once.",
    ),
    mcq(
      "Partition equal subset sum reduces to…",
      [
        "Sorting",
        "Checking the total is even, then asking for a subset with sum total / 2",
        "A shortest path",
        "Binary search",
      ],
      1,
    ),
  ],
  eng: [
    order("Order Keshav's three passes for reading a paper.", [
      "Bird's-eye pass: title, abstract, headings, conclusions",
      "Grasp pass: read carefully, skip proofs, study figures",
      "Re-implementation pass: challenge assumptions, code the core idea",
    ]),
    multi(
      "Which are good properties to test for a tokenizer?",
      [
        "decode(encode(s)) == s for any string",
        "decode never crashes on any id sequence",
        "Encoding the empty string must produce one token",
        "len(encode(s)) <= len(s.encode()) bytes",
      ],
      [0, 1, 3],
    ),
    mcq(
      "Treating training data like code includes…",
      [
        "Editing the held-out set to make scores look better",
        "Versioning it, testing for duplicates and train/eval overlap, and recording provenance and licences",
        "Keeping it out of git forever with no record",
        "Manual edits with no scripts",
      ],
      1,
    ),
    mcq(
      "Why report p95 and p99 latency rather than only the mean?",
      [
        "They are smaller",
        "Averages hide the slow tail that users feel; also state how you measured",
        "They are easier to compute",
        "Percentiles are cheaper",
      ],
      1,
      "Separate time-to-first-token from per-token speed, and beware coordinated omission and cherry-picked runs.",
    ),
  ],
});

export const W14 = week(14, {
  core: [
    mcq(
      "Why separate instructions from data with delimiters such as XML tags?",
      [
        "It saves tokens",
        "So the model can tell what is content to process rather than instructions to follow",
        "It is required by every API",
        "It guarantees safety",
      ],
      1,
      "It helps, but it does not make injection impossible; treat the data as untrusted anyway.",
    ),
    mcq(
      "What is a good way to tell a model what to do when information is missing?",
      [
        "Say nothing",
        "State it explicitly, for example 'use null, do not guess'",
        "Ask for a longer answer",
        "Raise the temperature",
      ],
      1,
    ),
    mcq(
      "Which is the most reliable way to get structured output?",
      [
        "Asking nicely",
        "Tool or function calling with a JSON Schema, forcing the tool, and still validating in your code",
        "Regex on free text",
        "Temperature 2",
      ],
      1,
    ),
    mcq(
      "What happens when this model response is validated?",
      [
        "It passes",
        "A ValidationError, because priority is above the allowed maximum of 5",
        "The model fixes it",
        "priority is clamped automatically",
      ],
      1,
      "Validation catches structure errors. A valid-looking answer can still be wrong, which is what evals catch.",
      py`
class Ticket(BaseModel):
    category: Literal["bug", "billing", "other"]
    priority: int = Field(ge=1, le=5)

Ticket.model_validate({"category": "bug", "priority": 7})
`,
    ),
    mcq(
      '`stop_reason == "max_tokens"` means…',
      [
        "The answer is complete",
        "The output was truncated, so JSON may be incomplete",
        "The request was refused",
        "The tool succeeded",
      ],
      1,
    ),
    multi(
      "A retry that feeds the validation error back to the model can fix…",
      [
        "A wrong type or enum value",
        "A missing constraint such as a too-long summary",
        "Information that is not present in the input",
        "A semantically wrong but valid answer",
      ],
      [0, 1],
      "It cannot create missing information; the model will invent it. A high retry rate means improve the prompt.",
    ),
    blank(
      "A call uses 2,000 input tokens at $3 per million and 500 output tokens at $15 per million. The cost is $___.",
      ["0.0135|.0135"],
      "2000 x 3/1e6 = 0.006, 500 x 15/1e6 = 0.0075.",
    ),
    mcq(
      "What distinguishes an agent from a workflow?",
      [
        "Agents use bigger models",
        "In a workflow the code paths are predefined; in an agent the model decides its own steps and tool calls in a loop",
        "Workflows cannot call tools",
        "Agents never need limits",
      ],
      1,
    ),
    mcq(
      "Anthropic's advice on building with LLMs is to…",
      [
        "Start with a multi-agent system",
        "Start with the simplest thing, one good call then a workflow, and add autonomy only when it measurably helps",
        "Always use agents",
        "Avoid tools",
      ],
      1,
    ),
    order("Order one iteration of the agent loop.", [
      "Send the messages and tools to the model",
      "Append the assistant reply to the messages",
      "If the stop reason is not tool_use, finish",
      "Run each requested tool, returning errors as data",
      "Append the tool results as the next user message",
    ]),
    mcq(
      "In the agent loop, why return a tool's exception text to the model instead of crashing?",
      [
        "To hide errors",
        "So the model can see what went wrong and recover",
        "To save tokens",
        "It is required by JSON",
      ],
      1,
      "A hard step limit, cost and time budgets, and per-tool timeouts stop infinite loops and runaway cost.",
      py`
for step in range(MAX_STEPS):
    r = client.messages.create(model=MODEL, tools=TOOLS, messages=msgs)
    msgs.append({"role": "assistant", "content": r.content})
    if r.stop_reason != "tool_use":
        break
    results = []
    for b in r.content:
        if b.type == "tool_use":
            try:
                out, err = run_tool(b.name, b.input), False
            except Exception as e:
                out, err = f"error: {e}", True
            results.append({"type": "tool_result", "tool_use_id": b.id,
                            "content": out, "is_error": err})
    msgs.append({"role": "user", "content": results})
`,
    ),
    multi(
      "What are the three legs of the 'lethal trifecta'?",
      [
        "Access to private data",
        "Exposure to untrusted content",
        "A way to communicate externally",
        "A large context window",
      ],
      [0, 1, 2],
      "Remove at least one leg. Telling the model to ignore malicious instructions is not a defence.",
    ),
    mcq(
      "What is MCP, the Model Context Protocol?",
      [
        "A model architecture",
        "An open JSON-RPC protocol exposing tools, resources and prompts from a server to any compatible model client",
        "A prompt template",
        "A tokenizer",
      ],
      1,
    ),
    mcq(
      "What do you do when building an eval set?",
      [
        "Generate 1,000 synthetic cases first",
        "Start from real traces, do error analysis, name the failure categories, and add a case per category",
        "Use only easy cases",
        "Tune on the whole set",
      ],
      1,
      "20 to 50 good cases beat 1,000 synthetic ones. Keep a held-out slice and include adversarial cases such as prompt injection.",
    ),
    match("Match each grader to its best use.", [
      [
        "Code grader (exact match, schema, regex)",
        "anything mechanically checkable; fast, free, deterministic",
      ],
      ["LLM judge with a rubric", "tone, faithfulness, helpfulness at scale"],
      ["Human review", "calibrating the judge and hard cases"],
    ]),
    multi(
      "Known biases of LLM judges include…",
      [
        "Position bias (favouring the first answer)",
        "Verbosity bias",
        "Self-preference",
        "Always being too strict",
      ],
      [0, 1, 2],
      "Measure agreement with human labels (accuracy or Cohen's kappa) and re-check when the judge changes.",
    ),
    mcq(
      "With prompt caching, cache reads cost about…",
      [
        "The same as normal input tokens",
        "A tenth of normal input tokens, and cut latency",
        "Twice as much",
        "Nothing",
      ],
      1,
      "Mark a stable prefix (system prompt, tools, long documents) with cache_control. Entries expire after minutes and there is a minimum prefix size.",
    ),
    mcq(
      "'Improper output handling' in the OWASP LLM list means…",
      [
        "The model prints too much",
        "Treating model output as trusted input to other systems; escape HTML, parameterise SQL",
        "Slow responses",
        "Forgetting the system prompt",
      ],
      1,
    ),
    mcq(
      "How should CI treat LLM tests?",
      [
        "Call the real model on every PR",
        "Use a fake or recorded model for fast deterministic PR checks, and run the real model on the full set separately with a pass-rate threshold",
        "Skip them",
        "Retry until green",
      ],
      1,
    ),
    tf(
      "Even at temperature 0, a model's output is not guaranteed to be perfectly deterministic.",
      true,
      "So compare prompt versions by which cases flipped, run several samples, and gate on pass-rate thresholds rather than single outcomes.",
    ),
    card(
      "Name four risks from the OWASP Top 10 for LLM applications.",
      "Prompt injection, sensitive information disclosure, improper output handling (treating model output as trusted), excessive agency, and unbounded consumption (rate limits and budgets).",
    ),
    blank(
      "SSE responses use the Content-Type text/___.",
      ["event-stream"],
      "Each event is `data: ...` followed by a blank line.",
    ),
    mcq(
      "What does streaming change for the user?",
      [
        "Total generation time drops",
        "Time to first token drops from the full generation time to a fraction of a second",
        "Cost drops",
        "Quality improves",
      ],
      1,
    ),
    mcq(
      "Why does this handler keep the upstream call inside `async with` blocks and check `request.is_disconnected()`?",
      [
        "To add headers",
        "When the client disconnects, the task is cancelled and the upstream stream closes, so you stop paying for tokens nobody reads",
        "To enable HTTP/2",
        "To set timeouts on the client",
      ],
      1,
      "",
      py`
async def relay(request, payload):
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        async with client.stream("POST", UPSTREAM_URL, json=payload) as up:
            async for line in up.aiter_lines():
                if await request.is_disconnected():
                    break
                yield line + "\n"
`,
    ),
    multi(
      "When should a gateway retry an upstream LLM call?",
      [
        "On 429, honouring Retry-After, before any bytes are streamed",
        "On 5xx or overloaded errors, with backoff and jitter",
        "On every 400 error",
        "After streaming has begun, silently restarting the output",
      ],
      [0, 1],
      "Keep a retry budget (for example retries at most 10% of requests) so clients do not multiply load on a struggling provider.",
    ),
    match("Match each metric to the question it answers.", [
      ["Time to first token (p95)", "are users waiting too long?"],
      ["Input and output tokens per request, cache hit ratio", "is cost drifting?"],
      ["Error counts by status, retries, in-flight gauge", "how reliable and saturated are we?"],
    ]),
  ],
  dsa: [
    mcq(
      "In 0/1 knapsack with a 1-D array, why iterate capacity downward?",
      [
        "To save memory",
        "So dp[w - wt] has not yet been updated this round and each item is used once",
        "To sort items",
        "It is faster",
      ],
      1,
    ),
    mcq(
      "Coin Change II (number of combinations): which loop order is right?",
      [
        "Amounts outside, coins inside",
        "Coins outside, amounts inside ascending",
        "Either gives combinations",
        "Coins outside, amounts descending",
      ],
      1,
      "Amounts outside counts permutations. Upward inner loop means unbounded reuse; downward means 0/1.",
      py`
dp = [1] + [0] * amount
for c in coins:
    for a in range(c, amount + 1):
        dp[a] += dp[a - c]
`,
    ),
    mcq("Minimum coins for amount 11 with coins [1, 2, 5]?", ["2", "3", "4", "5"], 1, "5 + 5 + 1 = 3 coins."),
    mcq(
      "'Target sum' (assign + or - to each number) reduces to counting subsets with sum…",
      ["target", "(total + target) / 2", "total - target", "total / 2"],
      1,
      "(total + target) must be even, and |target| <= total.",
    ),
    mcq(
      "For minimum subset-sum difference, the answer is…",
      [
        "total",
        "total - 2 x best, where best is the largest reachable sum <= total / 2",
        "The maximum element",
        "Zero always",
      ],
      1,
    ),
    mcq(
      "The O(n log n) LIS using a `tails` array returns…",
      ["The LIS itself", "Its length only; tails is not the LIS", "The count of LIS", "The sum"],
      1,
      "tails[k] is the smallest tail of an increasing subsequence of length k + 1.",
    ),
    mcq(
      "Length of the longest strictly increasing subsequence of `[10, 9, 2, 5, 3, 7, 101, 18]`?",
      ["3", "4", "5", "6"],
      1,
      "For example 2, 3, 7, 18.",
    ),
    mcq("LCS of `abcde` and `ace`?", ["2", "3", "4", "5"], 1),
    mcq(
      "Why can 'largest divisible subset' sort ascending and check only divisibility by earlier elements?",
      [
        "Sorting is required by the problem",
        "Divisibility is transitive on a sorted list, so a chain only needs each element to divide the next",
        "It is faster",
        "To avoid duplicates",
      ],
      1,
    ),
  ],
  eng: [
    multi(
      "Which are correct ways to handle flaky tests?",
      [
        "Fix the root cause: inject time and randomness, isolate state, wait on conditions not sleeps",
        "Hide them with blind retries",
        "Quarantine with an owner and a deadline",
        "For LLM tests, use a fake model in CI and assert properties rather than exact text",
      ],
      [0, 2, 3],
    ),
    match("Match the observability signal to its best use.", [
      ["Metrics", "is something wrong, how bad and since when?"],
      ["Traces", "where did the time go across services?"],
      ["Logs", "why: what exactly happened?"],
    ]),
    mcq(
      "Which is the right way to handle an API key leak?",
      [
        "Delete the commit",
        "Revoke it immediately, then rotate; enable secret scanning",
        "Ignore it",
        "Rename the file",
      ],
      1,
      "Never ship keys to a browser or mobile app; call the model from your server.",
    ),
    mcq(
      "How do you narrow a file-reader tool for an agent?",
      [
        "Trust the prompt",
        "Restrict it to one root directory, resolve `..` and symlinks, then check the prefix, read-only with a size limit; enforce in code",
        "Give it shell access",
        "Allow all paths",
      ],
      1,
    ),
  ],
});
