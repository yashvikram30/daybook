WEEKS.push(
  {
    n: 12,
    phase: "ml",
    title: "Machine learning foundations",
    summary:
      "The math you need, a proper supervised-learning workflow, and a neural network built from scratch. Python from here.",
    project:
      "Linear regression from scratch, a cross-validated sklearn pipeline, a micrograd-style autograd engine and a PyTorch classifier.",
    days: [
      {
        t: "Math refresher and your first model",
        why: "Linear algebra and gradients are the working vocabulary of ML.",
        main: [
          L(
            "Essence of linear algebra (3Blue1Brown playlist)",
            "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
            "Watch chapters 1-4 and 7 today.",
          ),
          V("Gradient Descent, Step-by-Step (StatQuest)", "sDv4f4s2SB8", "24 min."),
          R(
            "Mathematics for Machine Learning",
            "https://mml-book.github.io/",
            "Free book. Use as reference; read chapter 5 on vector calculus.",
          ),
          D(
            "uv: Python package and project manager",
            "https://docs.astral.sh/uv/",
            "Set up the project with `uv init` and `uv add numpy matplotlib`.",
          ),
          D("NumPy quickstart", "https://numpy.org/doc/stable/user/quickstart.html", "Arrays, broadcasting."),
        ],
        build: [
          "Generate noisy data from y = 3x + 2. Fit it with gradient descent in plain NumPy.",
          "Compare with the closed-form solution (normal equation). Plot the loss curve.",
          "Change the learning rate by 10x up and down. Record what happens.",
        ],
        ship: "ml/ex1-linreg with plots and a note on how the learning rate behaves.",
        swe: {
          t: "Reproducible environments",
          link: R(
            "Python packaging user guide: projects",
            "https://packaging.python.org/en/latest/guides/writing-pyproject-toml/",
            "Pin dependencies and seeds.",
          ),
        },
        ask: [
          "Why does gradient descent need a learning rate, and what does a loss that rises tell you?",
          "What does the gradient point toward, and why do we step the opposite way?",
        ],
      },
      {
        t: "Supervised learning and honest evaluation",
        why: "Most ML failures are evaluation failures. Learn to avoid fooling yourself.",
        main: [
          R(
            "Google Machine Learning Crash Course",
            "https://developers.google.com/machine-learning/crash-course",
            "Do the data, generalisation and classification modules.",
          ),
          V("Machine Learning Fundamentals: Bias and Variance (StatQuest)", "EuBBz3bI-aA", "7 min."),
          V("Machine Learning Fundamentals: Cross Validation (StatQuest)", "fSytzGwwBVw", "6 min."),
          V("StatQuest: Logistic Regression", "yIYKR4sgzI8", "9 min."),
          D(
            "scikit-learn user guide",
            "https://scikit-learn.org/stable/user_guide.html",
            "Pipelines, model selection, metrics.",
          ),
        ],
        build: [
          "Pick a tabular dataset (for example sklearn's breast cancer or a Kaggle Titanic file).",
          "Build a baseline, then a Pipeline with preprocessing and logistic regression. Use stratified cross-validation.",
          "Report precision, recall and a confusion matrix. Find one way your first evaluation could have leaked test data.",
        ],
        ship: "ml/ex2-tabular notebook or script with a 'what could be wrong with this evaluation' section.",
        swe: {
          t: "Data leakage as a bug class",
          link: R(
            "Rules of Machine Learning (Google)",
            "https://developers.google.com/machine-learning/guides/rules-of-ml",
            "Read rules 1-20.",
          ),
        },
        ask: [
          "What is the difference between a validation set and a test set, and why does reusing the test set invalidate it?",
          "Why can accuracy be misleading on an imbalanced dataset?",
        ],
      },
      {
        t: "Neural networks and backpropagation",
        why: "Build the engine that every deep learning framework is made of.",
        main: [
          V("But what is a neural network? (3Blue1Brown)", "aircAruvnKk", "19 min."),
          V("Backpropagation, intuitively (3Blue1Brown)", "Ilg3gGewQ5U", "13 min."),
          V(
            "The spelled-out intro to neural networks and backpropagation: building micrograd (Karpathy)",
            "VMj-3S1tku0",
            "2h25. Code along.",
          ),
          R(
            "Neural Networks and Deep Learning (Nielsen)",
            "http://neuralnetworksanddeeplearning.com/",
            "Chapter 2 on backpropagation.",
          ),
          L("micrograd", "https://github.com/karpathy/micrograd", "Compare with your version afterwards."),
        ],
        build: [
          "Code along with the micrograd video. Build Value, the backward pass and a small MLP.",
          "Train it on a 2D toy dataset. Plot the decision boundary.",
          "Verify your gradients numerically against finite differences.",
        ],
        ship: "ml/ex3-autograd with a gradient check test.",
        swe: {
          t: "Test numerical code",
          link: R(
            "Gradient checking (UFLDL tutorial)",
            "http://deeplearning.stanford.edu/tutorial/supervised/DebuggingGradientChecking/",
            "A standard sanity test.",
          ),
        },
        ask: [
          "What does the chain rule do in backpropagation, in one sentence?",
          "Why do you need to zero gradients between steps?",
        ],
      },
      {
        t: "PyTorch and training discipline",
        why: "Move from your own engine to the tool everyone uses, and learn to train without chaos.",
        main: [
          D(
            "PyTorch: learn the basics",
            "https://docs.pytorch.org/tutorials/beginner/basics/intro.html",
            "Tensors, autograd, optimisation.",
          ),
          R(
            "A Recipe for Training Neural Networks (Karpathy)",
            "https://karpathy.github.io/2019/04/25/recipe/",
            "A method for avoiding silent bugs.",
          ),
          R(
            "Neural Networks: Zero to Hero",
            "https://karpathy.ai/zero-to-hero.html",
            "Full playlist for later.",
          ),
        ],
        build: [
          "Train an MNIST classifier in PyTorch. First overfit a tiny batch to confirm the pipeline works.",
          "Log loss and accuracy per epoch to a file. Fix the random seeds and show two identical runs.",
          "Write weekly/week-12.md: what you can now explain that you couldn't before.",
        ],
        ship: "ml/ex4-mnist with logs and a reproducibility check.",
        swe: {
          t: "Experiment tracking",
          link: R(
            "Reproducibility in ML (PyTorch notes)",
            "https://pytorch.org/docs/stable/notes/randomness.html",
            "Seeds, determinism, caveats.",
          ),
        },
        ask: [
          "Why overfit a single batch first?",
          "What changed from numbers you coded by hand to what PyTorch does for you?",
        ],
      },
    ],
  },
  {
    n: 13,
    phase: "ml",
    title: "Transformers and language models",
    summary:
      "How a transformer works, how to train a tiny one from scratch, and how large language models are tokenised, pretrained, aligned, fine-tuned and served.",
    project:
      "A byte-pair tokenizer you wrote, a tiny GPT trained from scratch, a LoRA fine-tune of a small open model, and a latency and memory report for local inference.",
    days: [
      {
        t: "Attention and transformers",
        why: "The architecture under every current language model. Build the core operation yourself before using a library.",
        main: [
          V("Transformers, the tech behind LLMs (3Blue1Brown)", "wjZofJX0v4M", "27 min."),
          V("Attention in transformers, step-by-step (3Blue1Brown)", "eMlx5fFNoYc", "26 min."),
          R(
            "The Illustrated Transformer",
            "https://jalammar.github.io/illustrated-transformer/",
            "Diagrams for every step.",
          ),
          L(
            "Transformer Explainer",
            "https://poloclub.github.io/transformer-explainer/",
            "Interactive. Run GPT-2 in the browser and watch attention change as you edit the prompt.",
          ),
          R(
            "Attention Is All You Need",
            "https://arxiv.org/abs/1706.03762",
            "Read after the above; it will make sense.",
          ),
        ],
        build: [
          "Implement scaled dot-product attention in NumPy. Print and check the shape at every step.",
          "Extend it to multi-head attention with a causal mask. Test that position t never depends on positions after t.",
          "Write down the parameter count of one transformer block from the paper's hyperparameters, then check it against a real model's config.",
        ],
        ship: "ml/ex5-attention with a causal-mask test and a parameter-count note.",
        swe: {
          t: "Reading papers",
          link: R(
            "How to read a paper (Keshav)",
            "https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf",
            "Three passes. Use it for the transformer paper.",
          ),
        },
        ask: [
          "Why does attention cost grow quadratically with sequence length, and what does that limit?",
          "What would break if you removed positional information?",
          "What does the causal mask do, and why does training need it when inference does not?",
        ],
      },
      {
        t: "Tokenization and a tiny GPT",
        why: "Models see tokens, not words. Many odd model behaviours start in the tokenizer, and a small GPT is the fastest way to see how generation works.",
        main: [
          V("Let's build the GPT Tokenizer (Karpathy)", "zduSFxRajkE", "2h13. Code along."),
          L(
            "minbpe",
            "https://github.com/karpathy/minbpe",
            "Compare your tokenizer with this one afterwards.",
          ),
          V(
            "Let's build GPT: from scratch, in code, spelled out (Karpathy)",
            "kCc8FmEb1nY",
            "1h56. Code along; finish it tomorrow morning if you run out of time.",
          ),
          L(
            "nanoGPT",
            "https://github.com/karpathy/nanoGPT",
            "The reference implementation. Skim train.py and model.py.",
          ),
          D(
            "Summary of the tokenizers (Hugging Face)",
            "https://huggingface.co/docs/transformers/tokenizer_summary",
            "BPE, WordPiece and SentencePiece.",
          ),
        ],
        build: [
          "Write a byte-level BPE trainer, encoder and decoder. Test that decode(encode(text)) returns the original for tricky inputs: emoji, empty string, mixed scripts.",
          "Train a character-level GPT on a small text file. Plot training and validation loss and sample from it at several temperatures.",
          "Compare how your tokenizer and a production one split the same ten strings. Explain one surprising difference.",
        ],
        ship: "ml/ex6-tiny-gpt with the tokenizer, loss curves, samples and a round-trip test.",
        swe: {
          t: "Property-based tests for encoders",
          link: D(
            "Hypothesis: what you can generate and how",
            "https://hypothesis.readthedocs.io/",
            "Express 'decode(encode(x)) == x' as a property and let the library find the bad input.",
          ),
        },
        ask: [
          "Why do models struggle to count letters in a word or do long arithmetic, and what does the tokenizer have to do with it?",
          "What does temperature change, and what does it not change?",
          "Why is the vocabulary size a trade-off?",
        ],
      },
      {
        t: "Pretraining, fine-tuning and alignment",
        why: "Know what each training stage does so you can choose between prompting, fine-tuning and retrieval for a given problem.",
        main: [
          V("State of GPT (Karpathy)", "bZQun8Y4L2A", "42 min. The pipeline from pretraining to RLHF."),
          V(
            "Deep Dive into LLMs like ChatGPT (Karpathy)",
            "7xTGNNLPyMI",
            "3h31. Watch the first 90 minutes today and the rest over the weekend.",
          ),
          R(
            "LoRA: Low-Rank Adaptation of Large Language Models",
            "https://arxiv.org/abs/2106.09685",
            "Abstract, section 4 and the results.",
          ),
          D(
            "PEFT quicktour (Hugging Face)",
            "https://huggingface.co/docs/peft/quicktour",
            "Wrap a model with a LoRA config and train.",
          ),
          R(
            "Direct Preference Optimization",
            "https://arxiv.org/abs/2305.18290",
            "Skim the abstract and the loss. It replaces a separate reward model.",
          ),
        ],
        build: [
          "Pick a narrow task, for example turning free text into your own JSON schema. Write 150 training and 30 held-out examples by hand or with a model, and check every one.",
          "Fine-tune a small open model (a few hundred million parameters) with LoRA using PEFT. Record the share of parameters you trained.",
          "Compare the base model, a few-shot prompt and the fine-tuned model on the held-out set. Report accuracy and where each one fails.",
        ],
        ship: "ml/ex7-lora with the dataset, training script, comparison table and a short verdict: when was fine-tuning worth it?",
        swe: {
          t: "Treat training data like code",
          link: D(
            "Hugging Face Datasets: quickstart",
            "https://huggingface.co/docs/datasets/quickstart",
            "Version it, split it before you look at it, and never edit the held-out set to make a score look better.",
          ),
        },
        ask: [
          "What does each stage give you: pretraining, supervised fine-tuning, preference tuning?",
          "When would you choose retrieval over fine-tuning to add knowledge to a model?",
          "Why is a held-out set that you looked at no longer a held-out set?",
        ],
      },
      {
        t: "Running models: inference and serving",
        why: "Latency, memory and cost decide whether an LLM feature is usable. Learn where they come from.",
        main: [
          R(
            "Transformer Inference Arithmetic",
            "https://kipp.ly/transformer-inference-arithmetic/",
            "Why generation is memory-bound and how to estimate tokens per second.",
          ),
          R(
            "KV caching explained (Hugging Face)",
            "https://huggingface.co/blog/not-lain/kv-caching",
            "What is cached, and why memory grows with context.",
          ),
          D(
            "Quantization overview (Hugging Face)",
            "https://huggingface.co/docs/transformers/quantization/overview",
            "What you trade away at 8-bit and 4-bit.",
          ),
          R(
            "Efficient Memory Management for LLM Serving with PagedAttention (vLLM)",
            "https://arxiv.org/abs/2309.06180",
            "Abstract and the figures. It is virtual memory and paging again, applied to the KV cache.",
          ),
          L(
            "llama.cpp",
            "https://github.com/ggml-org/llama.cpp",
            "Run a quantized model on your laptop. Ollama (https://ollama.com/) is the easier front end.",
          ),
        ],
        build: [
          "Run a 1B to 3B model locally with Ollama or llama.cpp. Measure time to first token and tokens per second for three prompt lengths and two quantization levels.",
          "Estimate the KV cache size from the model config and the context length. Compare with the memory you observe.",
          "Write a results table and one paragraph on what dominates latency for short and long prompts.",
        ],
        ship: "ml/ex8-inference-report with the measurement script, table and conclusions.",
        swe: {
          t: "Report latency honestly",
          link: R(
            "Monitoring distributed systems: the four golden signals (SRE book)",
            "https://sre.google/sre-book/monitoring-distributed-systems/",
            "Report percentiles, not averages, and say how you measured.",
          ),
        },
        ask: [
          "Why is the first token slower than the rest, and which phase is compute-bound versus memory-bound?",
          "Why does the KV cache grow with context length, and how does PagedAttention relate to virtual memory?",
          "What do you lose when you quantize, and how would you check it on your own task?",
        ],
      },
    ],
  },
  {
    n: 14,
    phase: "ml",
    title: "Building software on LLMs",
    summary:
      "Treat a model as an unreliable but powerful component: prompt it, constrain its output, give it tools, test it with evals and serve it safely.",
    project:
      "A typed extraction CLI, a small tool-using agent with no framework, an evaluation harness that runs in CI, and an async Python gateway that streams LLM responses.",
    days: [
      {
        t: "Calling models well: prompts and structured output",
        why: "Most of an LLM feature is making the output predictable enough to build on. Start with clear prompts and validated, typed results.",
        main: [
          D(
            "Prompt engineering overview (Claude docs)",
            "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
            "Be clear and direct, examples, structure, role, thinking.",
          ),
          L(
            "Prompt engineering interactive tutorial (Anthropic)",
            "https://github.com/anthropics/prompt-eng-interactive-tutorial",
            "Do the first chapters in a notebook.",
          ),
          D(
            "Claude API overview",
            "https://platform.claude.com/docs/en/api/overview",
            "Messages, roles, tokens, stop reasons, errors.",
          ),
          R(
            "Prompt Engineering Guide",
            "https://www.promptingguide.ai/",
            "Reference for few-shot, chain-of-thought and the limits of each.",
          ),
          D(
            "Pydantic: models and validation",
            "https://docs.pydantic.dev/latest/",
            "Define the schema once, validate every response against it.",
          ),
        ],
        build: [
          "Write a CLI that turns messy text (emails, job posts or support tickets) into JSON that validates against a Pydantic model.",
          "On a validation error, retry up to twice by sending the error back to the model. Count how often each case needs a retry.",
          "Log tokens, latency and an estimated cost per call. Run 15 real inputs and keep the failures.",
        ],
        ship: "ml/ex9-extract with a typed schema, retry logic, a log and a table of failure cases.",
        swe: {
          t: "Keep keys out of code",
          link: R(
            "The Twelve-Factor App: config",
            "https://12factor.net/config",
            "Keys come from the environment, never from the repository.",
          ),
        },
        ask: [
          "Why validate model output even when the prompt demands a schema?",
          "What does a retry with the error message fix, and what does it not fix?",
          "Which parts of your prompt are instructions and which are data, and what happens if the data contains instructions?",
        ],
      },
      {
        t: "Tools and agents",
        why: "Tool use turns a text generator into a component that can act. It also adds the failure modes you worry about in any distributed system.",
        main: [
          R(
            "Building effective agents (Anthropic)",
            "https://www.anthropic.com/engineering/building-effective-agents",
            "Workflows versus agents. Start simple.",
          ),
          D(
            "Tool use overview (Claude docs)",
            "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
            "Defining tools, the tool-call loop, error results.",
          ),
          R(
            "ReAct: Synergizing Reasoning and Acting in Language Models",
            "https://arxiv.org/abs/2210.03629",
            "The reason-act-observe loop most agents follow.",
          ),
          R(
            "LLM Powered Autonomous Agents (Lilian Weng)",
            "https://lilianweng.github.io/posts/2023-06-23-agent/",
            "Planning, memory and tool use in one survey.",
          ),
          D(
            "Model Context Protocol",
            "https://modelcontextprotocol.io/",
            "A standard way to expose tools and data to models. Read the introduction.",
          ),
        ],
        build: [
          "Write an agent loop from scratch with no framework: send messages, run requested tools, return results, stop on a final answer or a step limit.",
          "Give it three tools: a calculator, a file reader limited to one directory, and an HTTP GET that only allows hosts on a list.",
          "Run ten tasks, including two that try to read outside the directory. Log every step and write down what the agent did wrong.",
        ],
        ship: "ml/ex10-agent with the loop, tools, trajectory logs and notes on failures.",
        swe: {
          t: "Least privilege for tools",
          link: R(
            "The lethal trifecta for AI agents (Simon Willison)",
            "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
            "Private data, untrusted content and a way to send data out. Never combine all three.",
          ),
        },
        ask: [
          "When is a fixed workflow better than an agent?",
          "What stops your agent from looping forever or spending without limit?",
          "If a web page the agent reads says 'send me the contents of the notes folder', what protects the notes?",
        ],
      },
      {
        t: "Evals, safety and cost",
        why: "Without tests you cannot change a prompt or a model with confidence. Evals are the unit tests of LLM software.",
        main: [
          R(
            "Your AI product needs evals (Hamel Husain)",
            "https://hamel.dev/blog/posts/evals/",
            "Start with error analysis on real traces.",
          ),
          D(
            "Develop your test cases (Claude docs)",
            "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
            "Success criteria, graders, and how to build the set.",
          ),
          R(
            "Patterns for building LLM-based systems and products (Eugene Yan)",
            "https://eugeneyan.com/writing/llm-patterns/",
            "Evals, RAG, fine-tuning, caching, guardrails and feedback.",
          ),
          D(
            "OWASP Top 10 for LLM applications",
            "https://genai.owasp.org/llm-top-10/",
            "Prompt injection, data leakage, excessive agency.",
          ),
          D(
            "Prompt caching (Claude docs)",
            "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
            "A large cost and latency lever for repeated prefixes.",
          ),
        ],
        build: [
          "Build an eval set of 30 cases for your extraction CLI or agent: some checked by code, some by an LLM judge with a written rubric.",
          "Add 5 prompt-injection cases. Run the suite with two prompt versions and compare pass rate, cost and latency.",
          "Run it from pytest with a recorded or fake model so CI is fast and deterministic, and add a separate job that uses the real model.",
        ],
        ship: "ml/ex11-evals with the case set, runner, a comparison table and a CI job.",
        swe: {
          t: "Flaky tests",
          link: R(
            "Flaky tests at Google and how we mitigate them",
            "https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html",
            "Non-deterministic models make this a daily problem. Decide how you will handle it.",
          ),
        },
        ask: [
          "How would you know a prompt change made your feature worse?",
          "When is an LLM judge trustworthy, and how would you check the judge itself?",
          "What untrusted text reaches your model, and what can it make the model do?",
        ],
      },
      {
        t: "Serving LLM features: streaming, retries and rate limits",
        why: "An LLM call is a slow, expensive, failure-prone network call. Everything you learned about networks and reliability applies.",
        main: [
          D(
            "Using server-sent events (MDN)",
            "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
            "The protocol most LLM streaming uses.",
          ),
          D(
            "Streaming messages (Claude docs)",
            "https://platform.claude.com/docs/en/build-with-claude/streaming",
            "Event types and how to assemble the response.",
          ),
          L(
            "Anthropic Python SDK",
            "https://github.com/anthropics/anthropic-sdk-python",
            "Use it for the real upstream. A fake upstream is enough for tests.",
          ),
          D(
            "OpenTelemetry semantic conventions for generative AI",
            "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
            "Standard names for model, token and latency attributes.",
          ),
          R(
            "Building a generative AI platform (Chip Huyen)",
            "https://huyenchip.com/2024/07/25/genai-platform.html",
            "Gateway, guardrails, caching and observability in one picture.",
          ),
        ],
        build: [
          "With FastAPI and asyncio, build a gateway endpoint that streams tokens to the client over SSE from an upstream model. Pass the client's cancellation through to the upstream call.",
          "Add per-key rate limiting with a token bucket, request IDs, timeouts, and retries with jitter on 429 and 5xx responses.",
          "Export metrics: latency histogram, time to first token, tokens in and out, error counts. Test against a fake upstream that fails and stalls on demand, reusing the fault injection from your distributed systems weeks.",
        ],
        ship: "capstone/gateway with SSE streaming, rate limits, metrics and failure tests.",
        swe: {
          t: "Observability: logs, metrics and traces",
          link: R(
            "Observability primer (OpenTelemetry)",
            "https://opentelemetry.io/docs/concepts/observability-primer/",
            "Know which signal answers which question.",
          ),
        },
        ask: [
          "What should happen to the upstream request when the client disconnects, and how does your code do that?",
          "Why do retries need jitter and a budget, and what happens to a struggling provider without them?",
          "Which metric tells you users are waiting too long, and which tells you cost is drifting?",
        ],
      },
    ],
  },
  {
    n: 15,
    phase: "ml",
    title: "Retrieval-augmented generation",
    summary:
      "Give a model your own documents: embeddings and vector search, ingestion and chunking, hybrid retrieval and reranking, grounded answers with citations, and honest evaluation.",
    project:
      "A document Q&A system built from parts: an ingestion pipeline, an ANN index you measure against brute force, hybrid retrieval with reranking, cited answers, and an evaluation report that shows which choices mattered.",
    days: [
      {
        t: "Embeddings and vector search",
        why: "Retrieval quality sets the ceiling for a RAG system. Understand what an embedding is and what an approximate index trades away.",
        main: [
          R(
            "The Illustrated Word2vec (Jay Alammar)",
            "https://jalammar.github.io/illustrated-word2vec/",
            "The intuition behind embeddings.",
          ),
          D(
            "Sentence Transformers: quickstart",
            "https://www.sbert.net/docs/quickstart.html",
            "Embed text and compare with cosine similarity.",
          ),
          R(
            "Efficient and robust approximate nearest neighbor search using HNSW",
            "https://arxiv.org/abs/1603.09320",
            "Abstract and section 3. A skip list over a graph.",
          ),
          R(
            "Hierarchical Navigable Small Worlds (Pinecone)",
            "https://www.pinecone.io/learn/series/faiss/hnsw/",
            "A readable walk-through with diagrams.",
          ),
          D(
            "pgvector",
            "https://github.com/pgvector/pgvector",
            "Read the HNSW and IVFFlat sections. Your database in week 7 and 8 is the model for this.",
          ),
        ],
        build: [
          "Embed about 2,000 text chunks with a small local model. Implement exact top-k search with cosine similarity in NumPy.",
          "Build an HNSW index with hnswlib. Measure recall at 10 against the exact results and queries per second for three values of ef_search.",
          "Plot recall against latency. Note index build time and memory, and compare with what you know about B-tree and LSM indexes.",
        ],
        ship: "rag/ex1-vector-search with the exact baseline, the HNSW index and the recall versus latency plot.",
        swe: {
          t: "Benchmark as a curve, not a number",
          link: L(
            "ANN-Benchmarks",
            "https://ann-benchmarks.com/",
            "Look at how it reports recall against queries per second.",
          ),
        },
        ask: [
          "Why is exact nearest-neighbour search too slow at scale, and what does an approximate index give up?",
          "What does cosine similarity measure, and when would dot product or L2 distance be better?",
          "Why can two sentences with opposite meanings have very similar embeddings?",
        ],
      },
      {
        t: "Ingestion, chunking, hybrid search and reranking",
        why: "Most RAG failures are retrieval failures. Chunking, keyword search, fusion and reranking are the levers you have.",
        main: [
          R(
            "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
            "https://arxiv.org/abs/2005.11401",
            "The original RAG paper. Read the introduction and section 2.",
          ),
          R(
            "Chunking strategies for LLM applications (Pinecone)",
            "https://www.pinecone.io/learn/chunking-strategies/",
            "Fixed, recursive, semantic and structure-aware.",
          ),
          R(
            "Practical BM25: the algorithm and its variables (Elastic)",
            "https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables",
            "The keyword baseline that vectors still lose to on exact terms.",
          ),
          R(
            "Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods",
            "https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf",
            "Two pages. The simplest way to merge two rankings.",
          ),
          D(
            "Sentence Transformers: cross-encoders",
            "https://www.sbert.net/examples/applications/cross-encoder/README.html",
            "Why a reranker is slower and more accurate than embeddings.",
          ),
          R(
            "Lost in the Middle: how language models use long contexts",
            "https://arxiv.org/abs/2307.03172",
            "Why more retrieved text is not always better.",
          ),
        ],
        build: [
          "Ingest a real documentation set (for example the Postgres or Python docs). Keep source URL, title, heading path and a content hash with every chunk.",
          "Implement three chunkers: fixed size with overlap, by heading, and sentence windows. Store all three so you can compare them later.",
          "Add BM25 (rank_bm25 or Postgres full-text search), fuse it with vector results using reciprocal rank fusion, then rerank the top 20 with a cross-encoder. Inspect results for 10 queries and note where each stage helped or hurt.",
        ],
        ship: "rag/ex2-retrieval with the ingestion pipeline, three chunkers, hybrid retrieval, a reranker and your notes.",
        swe: {
          t: "Idempotent pipelines",
          link: R(
            "Designing robust and predictable APIs with idempotency (Stripe)",
            "https://stripe.com/blog/idempotency",
            "The same idea applies to ingestion: run it twice, get the same state.",
          ),
        },
        ask: [
          "Why does a query like an error code or a function name work better with BM25 than with embeddings?",
          "What does a cross-encoder see that a bi-encoder does not?",
          "What goes wrong when chunks are too small, and what goes wrong when they are too large?",
        ],
      },
      {
        t: "Grounded generation: citations, query rewriting and abstention",
        why: "Retrieval only helps if the answer stays tied to the sources. Design for citations, follow-up questions and the case where the documents do not contain the answer.",
        main: [
          D(
            "Citations (Claude docs)",
            "https://platform.claude.com/docs/en/build-with-claude/citations",
            "Have the model quote the sources it used.",
          ),
          R(
            "Introducing Contextual Retrieval (Anthropic)",
            "https://www.anthropic.com/news/contextual-retrieval",
            "Prepend context to each chunk before embedding. Large measured gains.",
          ),
          R(
            "Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)",
            "https://arxiv.org/abs/2212.10496",
            "Search with a generated hypothetical answer.",
          ),
          R(
            "Self-RAG: learning to retrieve, generate and critique",
            "https://arxiv.org/abs/2310.11511",
            "Retrieve only when needed, then check the answer. Skim.",
          ),
          V(
            "RAG From Scratch: Part 1 (LangChain)",
            "wd7TZ4w1mSw",
            "Overview. The rest of the playlist is optional.",
          ),
        ],
        build: [
          "Build an /ask endpoint: retrieve, number the sources in the prompt, require every claim to cite a source, and return the cited chunk IDs with the answer.",
          "Abstain when the evidence is weak: use a score threshold and an instruction to say that the documents do not answer the question. Test it on 10 unanswerable questions.",
          "Rewrite follow-up questions using the chat history so retrieval sees a standalone query. Then add contextual retrieval as an option and compare it with the plain chunks.",
        ],
        ship: "rag/ex3-answers with citations, abstention, query rewriting and a comparison of plain versus contextual chunks.",
        swe: {
          t: "Errors and abstention as first-class results",
          link: R(
            "RFC 9457: Problem Details for HTTP APIs",
            "https://www.rfc-editor.org/rfc/rfc9457.html",
            "'No answer found' is a normal outcome. Model it, do not hide it.",
          ),
        },
        ask: [
          "How do you check that a cited source really supports the claim?",
          "What should the system do when retrieval returns nothing relevant, and who decides the threshold?",
          "Why can rewriting the user's question help retrieval and also change its meaning?",
        ],
      },
      {
        t: "Evaluating RAG honestly",
        why: "You cannot improve what you cannot measure. Separate retrieval quality from answer quality and test one change at a time.",
        main: [
          D(
            "Ragas: available metrics",
            "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/",
            "Context precision and recall, faithfulness, answer relevance.",
          ),
          R(
            "Evaluation metrics for search and recommendation systems (Weaviate)",
            "https://weaviate.io/blog/retrieval-evaluation-metrics",
            "Recall at k, MRR and nDCG with worked examples.",
          ),
          R(
            "Seven failure points when engineering a RAG system",
            "https://arxiv.org/abs/2401.05856",
            "A catalogue of what goes wrong, from a real case study.",
          ),
          R(
            "BEIR: a heterogeneous benchmark for zero-shot evaluation of retrieval models",
            "https://arxiv.org/abs/2104.08663",
            "Why a retriever that wins on one dataset can lose on another.",
          ),
          R(
            "Retrieval-Augmented Generation for Large Language Models: a survey",
            "https://arxiv.org/abs/2312.10997",
            "Use as a map of techniques to try next.",
          ),
        ],
        build: [
          "Write a golden set of 40 questions: each with the chunk IDs that contain the answer and a reference answer. Make 10 of them unanswerable.",
          "Measure recall at 5 and MRR for retrieval, and correctness, faithfulness and correct abstention for answers, using code checks where possible and an LLM judge elsewhere.",
          "Run ablations changing one thing at a time: chunk size, hybrid on or off, reranker on or off, contextual chunks on or off. Commit the results as a table and write what mattered and what did not.",
        ],
        ship: "rag/ex4-eval-report with the golden set, the metrics script, the ablation table and conclusions.",
        swe: {
          t: "Small samples and false wins",
          link: R(
            "How not to run an A/B test (Evan Miller)",
            "https://www.evanmiller.org/how-not-to-run-an-ab-test.html",
            "40 questions is a small sample. Learn what differences you can and cannot trust.",
          ),
        },
        ask: [
          "Why measure retrieval separately from the final answer?",
          "How would you notice that your golden set has leaked into your prompt or your chunking choices?",
          "Which single change gave the largest improvement, and how sure are you?",
        ],
      },
    ],
  },
  {
    n: 16,
    phase: "ml",
    title: "Production RAG and the capstone",
    summary:
      "Make the RAG system incremental, safe and observable, put ML behind a production-style service, then tie every subject together in one capstone.",
    project:
      "Capstone: an async Python gateway in front of a RAG service that caches answers in your Raft KV, with metrics, tests, CI, an evaluation report, a failure-injection report and an architecture document.",
    days: [
      {
        t: "RAG in production",
        why: "A demo ingests once and trusts everyone. A product re-ingests changes, enforces access, caches and explains what it did.",
        main: [
          R(
            "Building RAG-based LLM applications for production (Anyscale)",
            "https://www.anyscale.com/blog/a-comprehensive-guide-for-building-rag-based-llm-applications-part-1",
            "An end-to-end build with the numbers behind each decision.",
          ),
          D(
            "pgvector: filtering and indexing",
            "https://github.com/pgvector/pgvector#hnsw",
            "Combine metadata filters with vector search. Read about filtering and iterative scans.",
          ),
          L(
            "GPTCache",
            "https://github.com/zilliztech/GPTCache",
            "Semantic caching: when two questions are close enough to share an answer, and when that is dangerous.",
          ),
          D(
            "Langfuse documentation",
            "https://langfuse.com/docs",
            "Tracing for LLM applications: spans for retrieve, rerank and generate.",
          ),
          D(
            "OWASP Authorization Cheat Sheet",
            "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
            "Enforce access on the server, on every request.",
          ),
        ],
        build: [
          "Make ingestion incremental: re-embed only chunks whose content hash changed, and delete chunks for removed documents. Test that running it twice changes nothing.",
          "Add a tenant ID to every chunk and enforce the filter inside the retrieval function. Write a test that proves tenant A can never retrieve tenant B's chunks, even with adversarial queries.",
          "Cache answers in your Raft KV, keyed by a hash of the normalised question and the corpus version. Add spans for retrieve, rerank and generate to every request.",
        ],
        ship: "capstone/rag-service with incremental ingestion, tenant isolation tests, an answer cache and tracing.",
        swe: {
          t: "Cache invalidation",
          link: R(
            "Caching strategies and pitfalls (AWS Builders' Library: caching challenges)",
            "https://aws.amazon.com/builders-library/caching-challenges-and-strategies/",
            "What to key on, how to expire, and how a cache hides outages and bugs.",
          ),
        },
        ask: [
          "When a source document changes, which cached answers are now wrong, and how does your key design handle that?",
          "Where exactly is the access check, and what happens if someone forgets it in a new code path?",
          "Why can a semantic cache return a confidently wrong answer?",
        ],
      },
      {
        t: "ML systems and production",
        why: "A model in a notebook is not a product. Learn what changes when it serves real traffic and how you notice it getting worse.",
        main: [
          R(
            "Hidden technical debt in machine learning systems",
            "https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html",
            "Sculley et al. A classic.",
          ),
          R(
            "Rules of Machine Learning (Google)",
            "https://developers.google.com/machine-learning/guides/rules-of-ml",
            "Finish rules 21-43.",
          ),
          R(
            "Machine learning systems design (Chip Huyen)",
            "https://huyenchip.com/machine-learning-systems-design/toc.html",
            "Skim: data, training, serving, monitoring.",
          ),
          D(
            "FastAPI",
            "https://fastapi.tiangolo.com/",
            "A small typed HTTP service around Python code, with health endpoints.",
          ),
        ],
        build: [
          "Wrap your RAG service in a FastAPI app with liveness and readiness endpoints, and a Dockerfile that runs as a non-root user.",
          "Call it from your gateway with timeouts, retries, a circuit breaker and request metrics.",
          "Add a quality canary: run a handful of golden questions on a schedule, record retrieval hit rate and abstention rate, and alert when they drop.",
        ],
        ship: "capstone/rag-service in a container with health checks, a canary and a monitoring note.",
        swe: {
          t: "Service boundaries for ML",
          link: R(
            "Google Cloud: MLOps continuous delivery and automation pipelines",
            "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
            "Levels of maturity.",
          ),
        },
        ask: [
          "How would you detect that quality has silently dropped in production?",
          "What happens to your gateway when the RAG service is slow, and what should it do?",
          "What belongs in the model service and what belongs in the gateway?",
        ],
      },
      {
        t: "Capstone build",
        why: "Tie the subjects into one system you can run, test and explain.",
        main: [
          R(
            "The C4 model for visualising software architecture",
            "https://c4model.com/",
            "Context, containers, components. Use it for your diagram.",
          ),
          R(
            "Circuit Breaker (Martin Fowler)",
            "https://martinfowler.com/bliki/CircuitBreaker.html",
            "You will need one between the gateway and the RAG service.",
          ),
          D(
            "Docker Compose: getting started",
            "https://docs.docker.com/compose/gettingstarted/",
            "Run the gateway, RAG service and a three-node KV cluster together.",
          ),
          R("Architecture Decision Records", "https://adr.github.io/", "Write one for each major choice."),
        ],
        build: [
          "Wire the system: Python gateway with API-key auth, rate limits and request IDs, the RAG service, the LLM upstream, and a three-node Raft KV used as the answer cache. Run it with one docker compose up.",
          "Build the CI pipeline: lint, unit tests with a fake LLM, container builds, and an eval run against the golden set that fails when retrieval recall or answer quality drops below a threshold.",
          "Write the README so someone else can start it and ask a question in five minutes.",
        ],
        ship: "capstone/ runs with docker compose up, has CI, and passes its eval gate.",
        swe: {
          t: "Definition of done for a service",
          link: D(
            "Production readiness checklist (Google SRE)",
            "https://sre.google/sre-book/launch-checklist/",
            "Use it to decide what is missing before you call the capstone finished.",
          ),
        },
        ask: [
          "Which component failing would make the whole system unusable, and which would only make it slower?",
          "What does your CI protect you from, and what could still reach users?",
          "Which decision would you most regret if requirements doubled?",
        ],
      },
      {
        t: "Capstone finish and retrospective",
        why: "Break it on purpose, record what you know, and decide what to learn next.",
        main: [
          R(
            "Teach Yourself Computer Science",
            "https://teachyourselfcs.com/",
            "A map of where to go deeper.",
          ),
          L("Papers We Love", "https://paperswelove.org/", "Pick a next paper per subject."),
          R(
            "Postmortem culture (Google SRE workbook)",
            "https://sre.google/workbook/postmortem-culture/",
            "Use the format for your failure report.",
          ),
        ],
        build: [
          "Run failure tests and record the metrics: kill a KV node (cache misses, not errors), stall the LLM (timeouts, then circuit breaker), take the vector store down (fall back to keyword search), flood the gateway (rate limits hold).",
          "Write the architecture document: diagram, data flow, failure modes, trade-offs, what you would change. Record a five-minute demo.",
          "Answer the 'what happens when' questions from every week from memory. Mark the ones you cannot, and write the plan to close them.",
        ],
        ship: "capstone/ with README, architecture doc, CI, failure report, demo and weekly/week-16.md.",
        swe: {
          t: "Write the retrospective",
          link: R(
            "How to write a good postmortem (Google SRE workbook)",
            "https://sre.google/workbook/postmortem-culture/",
            "Blameless, specific, actionable.",
          ),
        },
        ask: [
          "Trace one question through every layer of your capstone: DNS, TCP, TLS, HTTP, gateway, cache, retrieval, model, disk. Where can it fail?",
          "Which subject do you now want to go deeper in, and what is the first project?",
        ],
      },
    ],
  },
);
