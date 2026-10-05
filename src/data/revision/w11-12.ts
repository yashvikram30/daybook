import { blank, card, match, mcq, multi, order, py, tf, txt, week, yaml } from "./types";

export const W11 = week(11, {
  core: [
    match(
      "Match each symptom of complexity to what it means.",
      [
        ["Change amplification", "one change touches many places"],
        ["Cognitive load", "there is a lot you must know to work on it"],
        ["Unknown unknowns", "you cannot tell what a change will affect"],
      ],
      "Ousterhout names dependencies and obscurity as the two causes.",
    ),
    mcq(
      "Which interface is a deeper module?",
      [
        "open, lock, seek, write, sync, unlock, close",
        "get, put, delete: it hides the log, index, fsync and compaction",
        "A wrapper that forwards every call unchanged",
        "One method per internal step",
      ],
      1,
      "A module's cost is its interface; its benefit is the functionality behind it.",
      py`
class KV(Protocol):
    def get(self, k: str) -> bytes | None: ...
    def put(self, k: str, v: bytes) -> None: ...
    def delete(self, k: str) -> None: ...
`,
    ),
    multi(
      "Which are principles from 'A Philosophy of Software Design'?",
      [
        "Information hiding",
        "Pull complexity downward into the module",
        "Define errors out of existence",
        "Expose every internal step so callers can control it",
      ],
      [0, 1, 2],
    ),
    mcq(
      "What is 'define errors out of existence'?",
      [
        "Never return errors",
        "Redefine the operation so the awkward case is not an error, for example deleting a missing key simply succeeds",
        "Catch all panics",
        "Ignore the error value",
      ],
      1,
    ),
    mcq(
      "Strategic programming means…",
      [
        "Working as fast as possible",
        "Investing a modest slice of time (about 10-20%) in good design as you go",
        "Never refactoring",
        "Writing all design documents first",
      ],
      1,
    ),
    mcq(
      "Refactoring is…",
      [
        "Adding features and fixing bugs together",
        "Changing structure without changing behaviour, in small steps with tests green after each",
        "Rewriting from scratch",
        "Renaming files",
      ],
      1,
      "Do not mix a refactor and a behaviour change in one commit. 'Make the change easy, then make the easy change.'",
    ),
    mcq(
      "Python module design advice: which is right?",
      [
        "Return protocols, accept concrete classes",
        "Accept protocols or plain callables, return concrete types; define a Protocol where it is used",
        "Put shared helpers in a utils.py",
        "Export everything",
      ],
      1,
    ),
    multi(
      "Which names follow Python conventions (PEP 8)?",
      [
        "kv.Store (not kv.KVStore)",
        "A function called read_record rather than ReadRecord",
        "A constant called MAX_RETRIES",
        "A class called string_utils",
      ],
      [0, 1, 2],
    ),
    mcq(
      "In the test pyramid, which tests should be the most numerous?",
      ["End-to-end", "Integration", "Unit", "Manual"],
      2,
      "Push each check as low as it can go while still testing the risk. Mostly slow end-to-end tests is the 'ice-cream cone' anti-pattern.",
    ),
    mcq(
      "What does a pytest fixture with `yield` do?",
      [
        "Skips the test",
        "Runs the setup before the test and the cleanup after it, even if the test failed",
        "Runs the test in parallel",
        "Adds a timeout",
      ],
      1,
    ),
    mcq(
      "100% line coverage tells you…",
      [
        "The code is correct",
        "Every line executed during tests, but not that anything was asserted or tested well",
        "No bugs remain",
        "The tests are fast",
      ],
      1,
      "Coverage shows what is not tested; it does not prove what is tested well.",
    ),
    mcq(
      "Fuzzing is especially good for…",
      ["UI layout", "Parsers and decoders", "Pure arithmetic", "Logging"],
      1,
      "Rejecting bad input with an error is fine; panicking is the bug. Hypothesis shrinks a failing input to a minimal example and replays it from .hypothesis on the next run.",
    ),
    mcq(
      "When is a mock the right tool?",
      [
        "For everything, to keep tests isolated",
        "At boundaries that are slow, nondeterministic or outside your control, such as a third-party API or the clock; otherwise prefer real code or fakes",
        "To re-implement the logic under test",
        "Never",
      ],
      1,
    ),
    mcq(
      "A mutation-testing tool changes `<` to `<=` and all your tests still pass. This is…",
      [
        "A passing sign",
        "A surviving mutant: no test noticed, so a test is missing or weak",
        "A tool bug",
        "Proof of 100% coverage",
      ],
      1,
    ),
    tf("'Easy to use, hard to misuse' and 'when in doubt, leave it out' are API design principles.", true),
    mcq(
      "Why use an opaque page token cursor for pagination instead of offsets?",
      [
        "Cursors are shorter",
        "Offsets break under concurrent writes (items shift between pages)",
        "Offsets are insecure",
        "HTTP forbids offsets",
      ],
      1,
    ),
    blank("RFC 9457 error responses use the content type application/___.", ["problem+json"]),
    mcq(
      "Which is the typical fit for gRPC rather than REST/JSON?",
      [
        "A public API called straight from browsers",
        "Internal service-to-service calls that need low latency and streaming, with a required .proto contract",
        "Quick debugging with curl",
        "Static websites",
      ],
      1,
      "REST/JSON is readable and browser-native; gRPC is binary protobuf over HTTP/2 with codegen.",
    ),
    mcq(
      "Martin Fowler's advice on microservices?",
      [
        "Start with them",
        "Monolith first: split once module boundaries are stable and there is a real need",
        "Never use them",
        "Use one per function",
      ],
      1,
      "They cost network failures, distributed data consistency, observability and operational overhead.",
    ),
    multi(
      "Which API changes are breaking?",
      [
        "Removing a field",
        "Making an optional input required",
        "Adding an optional response field",
        "Changing the type of a field",
      ],
      [0, 1, 3],
    ),
    order("Order the steps for rolling out a breaking API change.", [
      "Expand: add the new behaviour next to the old",
      "Announce deprecation (docs, Deprecation and Sunset headers)",
      "Migrate the clients",
      "Contract: remove the old behaviour in a new major version",
    ]),
    mcq(
      "Why does adding an abstract method to a Protocol or base class that others implement break compatibility?",
      [
        "It changes the package name",
        "Every existing implementer no longer satisfies it",
        "It makes the interface unexported",
        "It is not breaking",
      ],
      1,
      "Adding methods to a concrete class is fine; breaking changes need a new major version.",
    ),
    blank(
      "In the GitHub Actions workflow, complete the command so the tests run with warnings turned into errors.",
      ["error"],
      "`-W error` makes any warning a failure. The workflow runs jobs made of steps, triggered by events.",
      yaml`
steps:
  - uses: actions/checkout@v4
  - uses: astral-sh/setup-uv@v5
  - run: uv run ruff check .
  - run: uv run pytest -W ___
`,
    ),
    blank(
      "Complete the second stage so only the finished virtual environment is copied from the build stage.",
      ["build"],
      "A slim base image, locked dependencies and a non-root user give a small, reproducible image with a small attack surface.",
      txt`
FROM python:3.13-slim AS build
RUN uv sync --frozen --no-dev

FROM python:3.13-slim
COPY --from=___ /app /app
USER app
ENTRYPOINT ["python", "-m", "kvservice"]
`,
    ),
    mcq(
      "Why keep profiling and debug endpoints on a private port such as localhost:6060?",
      [
        "It is faster there",
        "Profiling endpoints reveal internals and must not be public",
        "Python requires port 6060",
        "To avoid TLS",
      ],
      1,
    ),
    mcq(
      "Which metric type suits request latency, so you can alert on p99?",
      ["A counter", "A gauge", "A histogram", "A label"],
      2,
    ),
    card(
      "What goes in a runbook?",
      "A page for the on-call engineer: symptom, dashboards to open, first checks, mitigation (rollback, scale, restart) and who to escalate to.",
    ),
  ],
  dsa: [
    mcq(
      "To validate a BST, why pass bounds down instead of only comparing a node with its children?",
      [
        "It is faster",
        "A node must lie within the bounds set by all its ancestors, not just its parent",
        "To avoid recursion",
        "Bounds are required by Python",
      ],
      1,
      "Alternative: check the inorder traversal is strictly increasing.",
    ),
    mcq(
      "LCA in a BST: if both targets are smaller than the current node you…",
      ["Return the node", "Go left", "Go right", "Stop"],
      1,
      "The first node where they split (or equal one of them) is the LCA. O(h).",
    ),
    mcq(
      "Constructing a BST from preorder in O(n) uses…",
      [
        "Sorting the array",
        "An upper bound: consume the next preorder value while it is less than the bound",
        "A queue",
        "Inorder as well",
      ],
      1,
    ),
    mcq(
      "In the inorder-successor loop, what happens when `x < n.val`?",
      ["Go right", "Record n as the candidate successor and go left", "Return n", "Stop"],
      1,
      "",
      py`
succ, n = None, root
while n:
    if x < n.val:
        succ, n = n, n.left
    else:
        n = n.right
`,
    ),
    mcq(
      "A BST iterator holds a stack of the left spine. What are its costs?",
      [
        "O(n) memory, O(n) next",
        "O(h) memory and amortised O(1) per next",
        "O(1) memory and O(log n) next",
        "O(n^2)",
      ],
      1,
    ),
    mcq(
      "In a BST with two swapped nodes the inorder sequence is `1 6 3 4 5 2 7`. Which values are swapped?",
      ["6 and 3", "6 and 2", "5 and 2", "3 and 5"],
      1,
      "The first violation (6 > 3) gives first = 6; the last violation (5 > 2) gives second = 2. Swap them.",
    ),
    mcq(
      "'Largest BST inside a binary tree' returns what from each postorder call?",
      ["Only a boolean", "Whether it is a BST, its size, and its min and max", "The height", "The sum"],
      1,
    ),
    mcq(
      "BFS finds shortest paths when…",
      ["Edges have weights", "The graph is unweighted", "The graph is cyclic only", "Never"],
      1,
    ),
    mcq(
      "How many islands are in this grid (4-directional)?",
      ["1", "2", "3", "4"],
      1,
      "The three connected 1s in the top-left form one island, and the lone 1 at the bottom right is another.",
      txt`
1 1 0
0 1 0
0 0 1
`,
    ),
    mcq(
      "Multi-source BFS (rotting oranges) starts by…",
      [
        "Running BFS from each source separately",
        "Pushing all sources into the queue at distance 0 and expanding level by level",
        "Sorting the grid",
        "Using DFS",
      ],
      1,
    ),
    mcq(
      "For 'number of distinct islands' you record each island's…",
      [
        "Area only",
        "Shape as coordinates relative to its first cell, and count unique shapes in a set",
        "Perimeter",
        "Absolute coordinates",
      ],
      1,
    ),
  ],
  eng: [
    mcq(
      "Which name is best?",
      ["list2", "pending_writes", "data", "x1"],
      1,
      "Names reveal intent. Scope decides length: `i` in a three-line loop, `replication_lag` for a module-level value.",
    ),
    mcq(
      "A test runs the code but only asserts 'no error'. In mutation terms…",
      [
        "It is strong",
        "It gives coverage but no protection: broken output would still pass",
        "It is flaky",
        "It is an integration test",
      ],
      1,
    ),
    mcq(
      "Which tolerates unknown fields?",
      [
        "A strict reader",
        "A tolerant reader: it ignores fields it does not know",
        "A validator that rejects them",
        "None",
      ],
      1,
    ),
    multi(
      "Which are part of pipeline as code?",
      [
        "Pinned toolchain and locked dependencies",
        "Cheap checks first, then slow ones",
        "Canary or staged rollouts with one-click rollback",
        "Pushing directly to main without checks",
      ],
      [0, 1, 2],
    ),
  ],
});

export const W12 = week(12, {
  core: [
    mcq(
      "Two vectors have dot product 0. They are…",
      ["Parallel", "Orthogonal", "Equal", "Opposite"],
      1,
      "a . b = |a||b| cos(theta).",
    ),
    blank(
      "Multiplying an (m x n) matrix by an (n x p) matrix gives an (m x ___) matrix.",
      ["p"],
      "Inner dimensions must match.",
    ),
    mcq(
      "The gradient of the loss points…",
      [
        "Toward the minimum",
        "In the direction of steepest increase, so we step in the opposite direction",
        "Perpendicular to the loss surface",
        "At random",
      ],
      1,
    ),
    mcq(
      "Mean squared error is…",
      ["(1/n) sum |y_hat - y|", "(1/n) sum (y_hat - y)^2", "sum (y_hat - y)", "(1/n) sum y_hat"],
      1,
    ),
    match("Match each learning rate behaviour to what you see.", [
      ["Too small", "smooth but very slow"],
      ["About right", "falls fast, then flattens"],
      ["Too large", "oscillates or rises, possibly to NaN"],
    ]),
    mcq(
      "In this loop `w` and `b` end up near…",
      ["0 and 0", "3 and 2", "2 and 3", "diverge"],
      1,
      "The data is y = 3x + 2 plus noise, and the learning rate 0.1 is stable for this convex problem.",
      py`
rng = np.random.default_rng(0)
x = rng.uniform(-1, 1, 200)
y = 3*x + 2 + rng.normal(0, 0.3, 200)
w, b, lr = 0.0, 0.0, 0.1
for step in range(500):
    err = (w*x + b) - y
    w -= lr * 2*np.mean(err*x)
    b -= lr * 2*np.mean(err)
`,
    ),
    mcq(
      "What is the shape of `(3,1) + (1,4)` under NumPy broadcasting?",
      ["(3,1)", "(1,4)", "(3,4)", "an error"],
      2,
      "Shapes align from the right and a dimension of size 1 stretches.",
    ),
    mcq(
      "What happens with `np.ones((5,3)) + np.ones(5)`?",
      [
        "Shape (5,3)",
        "A broadcasting error: trailing dimensions 3 and 5 do not match",
        "Shape (5,5)",
        "Shape (3,)",
      ],
      1,
      "`(5,3) + (3,)` works because trailing dimensions agree.",
    ),
    mcq(
      "To solve least squares in code you should prefer…",
      [
        "np.linalg.inv(X.T @ X) @ X.T @ y",
        "np.linalg.lstsq, which avoids an explicit inverse",
        "A for loop",
        "Random search",
      ],
      1,
    ),
    order("Order the supervised learning workflow.", [
      "Split into train, validation and test",
      "Build a dumb baseline",
      "Fit preprocessing and model in one pipeline",
      "Cross-validate and tune on validation data",
      "Evaluate on the test set once",
    ]),
    mcq(
      "A model scores 99% on training data and 70% on validation data. This is…",
      ["High bias (underfitting)", "High variance (overfitting)", "Data leakage only", "A good fit"],
      1,
      "Fixes: more data, regularisation, a simpler model, early stopping. If it is poor on both, it is underfitting.",
    ),
    blank(
      "With TP = 40, FP = 10, FN = 20, TN = 30, the precision is ___.",
      ["0.8|80%|4/5"],
      "Precision = TP / (TP + FP) = 40 / 50. Recall = 40 / 60 = 0.667, accuracy = 70 / 100.",
    ),
    mcq(
      "With the same counts (TP 40, FP 10, FN 20, TN 30), the recall is…",
      ["0.5", "0.67", "0.8", "0.7"],
      1,
    ),
    mcq(
      "1% of transactions are fraud. A model that always predicts 'not fraud' has…",
      ["1% accuracy", "99% accuracy and zero recall", "50% accuracy", "Perfect precision and recall"],
      1,
      "Use precision, recall or PR-AUC on imbalanced data, and pick the threshold by the cost of false positives against false negatives.",
    ),
    blank("The sigmoid sigma(z) = 1 / (1 + e^-z) outputs ___ when z = 0.", ["0.5|1/2|half"]),
    mcq(
      "Logistic regression is trained by minimising…",
      ["Mean squared error", "Log loss (cross-entropy)", "Accuracy", "Recall"],
      1,
    ),
    tf(
      "Picking the best model because of its test-set score is fine as long as you also report the score.",
      false,
      "Every decision made from the test set leaks it into your choices, so the final estimate is optimistic. Use validation or cross-validation for decisions.",
    ),
    match("Match each leakage kind to its defence.", [
      ["Scaler fit on all data before splitting", "put preprocessing in a Pipeline"],
      ["Random split of time-ordered data", "split by time (TimeSeriesSplit)"],
      ["Same patient in train and test", "GroupKFold"],
      ["Feature derived from the label", "ask whether it exists at prediction time"],
    ]),
    mcq(
      "Why does a network need a nonlinear activation between layers?",
      [
        "To make it run faster",
        "Without it a stack of linear layers collapses into a single linear map",
        "To normalise outputs",
        "To reduce parameters",
      ],
      1,
    ),
    order(
      "Order one training step.",
      [
        "Forward pass computes the loss",
        "Backward pass computes gradients",
        "Update parameters",
        "Zero the gradients for the next step",
      ],
      "Gradients accumulate with +=, so they must be zeroed each step.",
    ),
    mcq(
      "Why is backpropagation efficient?",
      [
        "It tries every parameter separately",
        "It applies the chain rule once in reverse topological order, reusing intermediate gradients, at roughly the cost of one extra forward pass",
        "It skips the forward pass",
        "It only updates the last layer",
      ],
      1,
    ),
    mcq("For c = a * b, what is the local derivative dc/da?", ["a", "b", "1", "a + b"], 1),
    mcq(
      "Why does micrograd's `_backward` use `+=` on `.grad`?",
      [
        "To save memory",
        "A value used in several places receives gradient from each use",
        "Python requires it",
        "To zero the gradient",
      ],
      1,
    ),
    mcq(
      "What is the finite-difference gradient check?",
      [
        "(f(x+h) - f(x)) * h",
        "(f(x+h) - f(x-h)) / 2h with h around 1e-5, compared with the analytic gradient",
        "f(x) / h",
        "Run backprop twice",
      ],
      1,
    ),
    mcq(
      "What does `nn.CrossEntropyLoss` expect as input?",
      [
        "Probabilities after softmax",
        "Raw logits: it applies log-softmax itself",
        "One-hot encoded predictions",
        "Class names",
      ],
      1,
    ),
    mcq(
      "What is missing from this training loop?",
      [
        "opt.zero_grad() before backward, so gradients accumulate across steps",
        "model.eval()",
        "A learning rate",
        "A second backward call",
      ],
      0,
      "",
      py`
for xb, yb in train:
    loss = loss_fn(model(xb), yb)
    loss.backward()
    opt.step()
`,
    ),
    mcq(
      "For evaluation you call `model.eval()` and wrap the loop in…",
      ["torch.train()", "torch.no_grad()", "torch.seed()", "nothing"],
      1,
      "eval() turns off dropout and batchnorm training behaviour; no_grad() stops gradient tracking.",
    ),
    mcq(
      "A first debugging step in Karpathy's recipe, when a new model will not train?",
      [
        "Add more layers",
        "Try to overfit a tiny batch of 5-10 examples to near-zero loss",
        "Train for 100 epochs",
        "Change the optimizer",
      ],
      1,
      "If you cannot, the bug is in the labels, loss, shapes, learning rate or data pipeline.",
    ),
    blank(
      "For a 10-class balanced problem the initial cross-entropy loss should be about ln(10), roughly ___.",
      ["2.3|2.30"],
    ),
    mcq(
      "How should you compare floating-point results in a test?",
      [
        "With ==",
        "With a tolerance, such as np.testing.assert_allclose",
        "By rounding to integers",
        "By string comparison",
      ],
      1,
    ),
  ],
  dsa: [
    mcq(
      "Detecting a cycle in a directed graph with DFS colours: an edge to which colour means a cycle?",
      ["White", "Gray (on the current path)", "Black", "Any"],
      1,
    ),
    mcq(
      "In an undirected graph DFS finds a cycle when it meets a visited node that is…",
      ["The parent", "Not the parent", "A leaf", "The root only"],
      1,
    ),
    mcq(
      "A graph is bipartite exactly when…",
      ["It has no cycles", "It has no odd cycle (2-colourable)", "It is a tree", "It is directed"],
      1,
    ),
    mcq(
      "Kahn's algorithm processes fewer than n nodes. What does that mean?",
      ["Disconnected graph", "The graph has a cycle", "It is a tree", "Negative weights"],
      1,
      "",
      py`
while q:
    u = q.popleft()
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)
return order, len(order) == n
`,
    ),
    mcq(
      "Alien dictionary: the words are `abc` then `ab`. What follows?",
      [
        "Edge a -> b",
        "Invalid ordering: a longer word cannot come before its own prefix",
        "Edge c -> a",
        "Valid",
      ],
      1,
    ),
    mcq(
      "Shortest path in a DAG with negative weights can be found by…",
      ["Dijkstra", "Relaxing edges in topological order, O(V + E)", "BFS", "Impossible"],
      1,
    ),
    match("Match each graph situation to its shortest-path algorithm.", [
      ["Unit weights", "BFS"],
      ["Non-negative weights", "Dijkstra"],
      ["Negative edges, no negative cycle", "Bellman-Ford"],
      ["A DAG", "topological relaxation"],
    ]),
    mcq(
      "In Dijkstra with a heap, why do we `continue` when `d > dist[u]` after popping `(d, u)`?",
      [
        "To stop early",
        "The entry is stale: a shorter distance to that node was already found",
        "To avoid negative weights",
        "To detect cycles",
      ],
      1,
    ),
    mcq(
      "Cheapest flights within K stops: why clone `dist` each round?",
      [
        "To save memory",
        "So a round uses only the previous round's values, limiting paths to one extra edge per round",
        "To sort",
        "It is not needed",
      ],
      1,
    ),
    mcq(
      "In the 'path with minimum effort' problem, Dijkstra's path cost is…",
      [
        "The sum of differences",
        "The maximum edge difference along the path",
        "The number of cells",
        "The minimum height",
      ],
      1,
    ),
  ],
  eng: [
    mcq(
      "What makes an ML project reproducible?",
      [
        "Installing packages ad hoc",
        "pyproject.toml plus a lockfile, a pinned Python version, seeded RNGs and a recorded commit and data version",
        "A README only",
        "Using the latest versions each time",
      ],
      1,
    ),
    mcq(
      "Test code for `softmax([1000, 1001])`. What does it check?",
      [
        "That exp overflows",
        "That the implementation is numerically stable (subtracting the max) and sums to 1",
        "That the output is integers",
        "That the input is sorted",
      ],
      1,
      "",
      py`
def test_softmax_stable():
    p = softmax(np.array([1000., 1001.]))
    assert np.isfinite(p).all() and np.isclose(p.sum(), 1.0)
`,
    ),
    multi(
      "What should an experiment run record?",
      ["Config and hyperparameters", "The random seed", "Code version and data version", "The weather"],
      [0, 1, 2],
    ),
    tf("Results that look too good to be true should make you suspect leakage.", true),
  ],
});
