// How each day's Learn links are grouped into ticks. Every index of the day's `main` list must appear in exactly
// one group. A group of one is an ordinary item; a bigger group is one tick with several links under a topic.
// G(title, one line on what the group is for, [indexes into `main`]).
const G = (t, n, i) => ({ t, n, i });

window.GROUPS = {
  // Week 1
  w1d1: [
    G("Set up your tools", "Python 3.13 with uv, the debugger, and a Linux VM for weeks 3 and 4.", [0, 5, 6]),
    G("Python lesson 1: basics and control flow", "The same ground from three sources. Pick the one that suits you, or use two.", [1, 2, 3]),
    G("The course book", "Your main book for weeks 1 and 2.", [4]),
  ],
  w1d2: [
    G("Python lesson 2: lists, dictionaries and strings", "The tutorial chapter and the book chapters on the same data structures.", [0, 1]),
    G("How a list is built", "Why appending is cheap and inserting at the front is not.", [2]),
    G("Integers and floating point", "Two's complement, overflow and IEEE 754: read it, watch it, then flip bits yourself.", [3, 4, 5]),
    G("Packing bytes with struct", "Turn numbers into exact bytes and back.", [6]),
  ],
  w1d3: [
    G("Python lesson 3: classes, files and errors", "Objects and iterators, then reading files and handling failures.", [0, 1]),
    G("Python bytecode", "The small steps Python turns your code into.", [2]),
    G("Machine code and the ARM instruction set", "Registers, addressing, and the fetch, decode, execute loop on the chip in your Mac.", [3, 4, 5]),
  ],
  w1d4: [
    G("Python lesson 4: testing with pytest", "Your first tests, fixtures and parametrize.", [0]),
    G("Frames in CPython", "Cheaper calls in 3.11 and how to read frames as objects.", [1, 2]),
    G("The ARM64 calling convention", "Which registers carry arguments and return values.", [3]),
  ],
  // Week 2
  w2d1: [
    G("Python lesson 5: style", "PEP 8, the style guide.", [0]),
    G("Measuring time", "timeit for small experiments.", [1]),
    G("Caches and locality", "The chapter, a talk, the classic paper and lecture slides on the same idea.", [2, 3, 4, 5]),
  ],
  w2d2: [
    G("Python lesson 6: errors and exceptions", "Handling, raising and chaining.", [0]),
    G("Memory-mapped files", "Mappings straight from the standard library.", [1]),
    G("Virtual memory and paging", "Address spaces, page tables and the TLB, in a video and three OSTEP chapters.", [2, 3, 4, 5, 6]),
    G("Page replacement policies", "FIFO, Belady's anomaly, optimal and LRU, worked by hand.", [7, 8, 9, 10, 11]),
  ],
  w2d3: [
    G("Python lesson 7: dataclasses and protocols", "Small typed records for your CPU state.", [0]),
    G("The CHIP-8 spec and tests", "What to implement, and the ROMs that prove it works.", [1, 2]),
    G("Shipping data files in a package", "Bundle the test ROMs with your code.", [3]),
    G("Registers and RAM", "A short refresher video.", [4]),
  ],
  w2d4: [
    G("Python lesson 8: type hints and mypy", "Annotate your code and let a checker find mistakes.", [0]),
    G("Raw terminal input", "Key presses without waiting for Enter.", [1]),
    G("Pipelines and out-of-order execution", "How a CPU overlaps work, in two talks.", [2, 3]),
    G("A CPU built from chips", "Optional: see the control logic in hardware.", [4]),
  ],
  // Week 3
  w3d1: [
    G("Python lesson 9: running processes", "subprocess for everyday use, and the raw fork, exec and wait calls underneath it.", [0, 1]),
    G("What a process is", "States, the process control block and how processes are created, in three short videos.", [2, 3, 4]),
    G("The process API", "The OSTEP chapters on processes, fork, exec and wait.", [5, 6]),
    G("Watching system calls", "strace shows every call a program makes.", [7]),
  ],
  w3d2: [
    G("Python lesson 10: threads and asyncio", "Coroutines and tasks, and how an event loop shares one thread.", [0, 1]),
    G("Limited direct execution", "How the OS lets programs run directly yet keeps control.", [2]),
    G("CPU scheduling algorithms", "FCFS, SJF, priority, round robin and multilevel feedback queues, with solved problems and the OSTEP chapters.", [3, 4, 5, 6, 7, 8, 9, 10]),
    G("Context switching", "What is saved and restored when the CPU changes process.", [11]),
  ],
  w3d3: [
    G("Python lesson 11: files, streams and context managers", "Reading and writing files safely with `with`.", [0]),
    G("fork and exec for your shell", "The video, the manual pages and the Python wrappers you will use.", [1, 2, 4]),
    G("The shell project spec", "A spec with test cases to check your work against.", [3]),
  ],
  w3d4: [
    G("Python lesson 12: signals and selectors", "Catching signals and waiting on many file descriptors.", [0]),
    G("Pipes and process groups", "The raw calls behind pipelines and job control, and the OSTEP section on wiring a pipe.", [1, 2]),
    G("Interprocess communication", "Shared memory versus message passing.", [3, 4]),
    G("Signals and zombies", "Which signals can be caught, and what a zombie process is.", [5, 6]),
    G("Linux zines", "Optional: friendly one-page explainers.", [7]),
  ],
  // Week 4
  w4d1: [
    G("Python lesson 13: threads, locks and the GIL", "Thread, Lock and Event, and why threads do not speed up CPU-bound Python.", [0, 1]),
    G("Threads", "What a thread shares with its process, and the threading models.", [2, 3]),
    G("The critical-section problem and locks", "Mutual exclusion, Peterson's solution, test-and-set and the OSTEP chapters on locks.", [4, 5, 6, 7, 8, 9]),
  ],
  w4d2: [
    G("Python lesson 14: asyncio cancellation and timeouts", "TaskGroup, timeouts and cancelling safely.", [0]),
    G("Condition variables and monitors", "Waiting for a condition without spinning.", [1, 2, 7]),
    G("Semaphores and the classic problems", "Bounded buffer, readers-writers and dining philosophers.", [3, 4, 5, 6, 8]),
    G("Deadlock", "The four conditions, resource graphs, prevention, avoidance with the banker's algorithm, and detection.", [9, 10, 11, 12, 13, 14]),
  ],
  w4d3: [
    G("Python lesson 15: how Python manages memory", "The garbage collector, and tracemalloc to watch allocations.", [0, 1]),
    G("Memory allocation", "Free-space management, fit policies and segmentation versus paging.", [2, 3, 4, 5]),
  ],
  w4d4: [
    G("Python lesson 16: files and pathlib", "Paths as objects.", [0]),
    G("Durable writes", "What fsync promises and what it does not.", [1]),
    G("Disks and disk scheduling", "Seek time, rotation, and the elevator algorithms.", [2, 3, 4]),
    G("File system layout", "Allocation methods and inodes, with the OSTEP chapter.", [5, 6, 7]),
    G("Crash consistency", "Journaling, plus a short overview of file systems.", [8, 9]),
  ],
  // Week 5
  w5d1: [
    G("Python sockets", "The socket module, asyncio streams and the HOWTO, all for the same raw connections.", [0, 1, 10]),
    G("Layering and the TCP/IP stack", "Why networks are layered, and what each layer does, in three videos.", [2, 3, 4]),
    G("Switching and the link layer", "Packet switching, Ethernet, CSMA/CD, ARP and the devices that connect networks.", [5, 6, 7, 8, 9]),
  ],
  w5d2: [
    G("How TCP works", "Reliable delivery, the three-way handshake, header fields and closing a connection.", [0, 1, 2, 3]),
    G("TCP or UDP", "When each is the right choice.", [4]),
    G("TCP in the spec and in code", "The RFC's state diagram and a Python echo server.", [5, 6]),
  ],
  w5d3: [
    G("HTTP/1.1 explained", "An overview, a long crash course and persistent connections.", [1, 2, 3]),
    G("The HTTP/1.1 spec", "Message format, Content-Length and chunked encoding.", [0]),
    G("Testing a server with curl", "Use `-v` to see everything.", [4]),
  ],
  w5d4: [
    G("IPv4 addressing and subnetting", "Address classes, CIDR, worked subnetting and the IPv4 header with fragmentation.", [0, 1, 2, 3]),
    G("Routing algorithms", "Distance vector, count to infinity and link state.", [4, 5, 6]),
    G("NAT", "Why your laptop shares one public address.", [7]),
    G("How DNS works", "Record types, the resolver hierarchy, a comic and a talk.", [8, 9, 10]),
    G("Writing a DNS client", "A guide for the build and the message format in RFC 1035.", [11, 12]),
  ],
  // Week 6
  w6d1: [
    G("UDP and the transport layer", "What UDP gives you, and the datagram socket calls.", [0, 7]),
    G("Stop-and-wait and the bandwidth-delay product", "Acknowledgements, timeouts and why one packet at a time wastes a fast link.", [1, 2, 6]),
    G("Detecting and fixing errors", "Checksum, CRC and Hamming code.", [3, 4, 5]),
  ],
  w6d2: [
    G("Sliding window protocols", "Window size, Go-Back-N and selective repeat.", [4, 5, 6]),
    G("TCP congestion control", "AIMD, slow start, congestion collapse and the book chapters.", [0, 1, 2, 3, 7]),
  ],
  w6d3: [
    G("How the TLS handshake works", "An illustrated walk-through, a talk and a comparison of 1.2 and 1.3.", [0, 1, 2]),
    G("Cryptography behind TLS", "Symmetric keys, public and private keys, and RSA.", [3, 4, 5]),
    G("TLS in Python", "The ssl module, and mkcert for local certificates.", [6, 7]),
  ],
  w6d4: [
    G("Web security basics", "The OWASP Top 10 and how to store passwords.", [0, 1]),
    G("HTTP/2", "What changes from HTTP/1.1.", [2]),
    G("Firewalls and load balancing", "Packet filtering, balancing algorithms and health checks.", [3, 4]),
    G("A proxy in asyncio", "For the build: forward bytes both ways.", [5]),
  ],
  // Week 7
  w7d1: [
    G("Databases and the relational model", "What a DBMS is for, tables, rows and keys, plus a full SQL course to dip into.", [0, 1, 2]),
    G("Normal forms", "Why tables are split, from 1NF to BCNF.", [3]),
    G("How a database stores data", "Files, pages and tuples; the SQLite file format as a real example.", [4, 7]),
    G("The buffer pool", "Caching pages in memory, with LRU and clock as in week 2.", [8]),
    G("Course and book references", "CMU 15-445 and Designing Data-Intensive Applications.", [5, 6]),
  ],
  w7d2: [
    G("Why indexes exist", "The idea of an index, before the tree.", [0]),
    G("B-trees and B+ trees", "Inserting and splitting by hand, and how databases use them.", [1, 2, 5]),
    G("Reading about indexes", "Use The Index, Luke explains how an index is laid out.", [3]),
    G("LSM trees", "The write-optimised alternative to a B-tree.", [4]),
  ],
  w7d3: [
    G("The Bitcask design", "A six-page spec for your store.", [0]),
    G("Storage and retrieval", "Hash indexes, SSTables and LSM trees from DDIA, and database hash tables.", [1, 3]),
    G("Durable writes", "fsync, and why flush comes first.", [2]),
  ],
  w7d4: [
    G("LSM trees in practice", "LevelDB's levels and compaction, and why LSM writes are fast.", [0, 1]),
    G("Bloom filters", "A small structure that says a key is definitely absent.", [2]),
    G("A whole engine", "How SQLite fits together.", [3]),
  ],
  // Week 8
  w8d1: [
    G("ACID", "The four guarantees, with examples.", [0, 1, 4]),
    G("The write-ahead log", "Why the log is written before the data, and how redo and undo work.", [2, 6, 7]),
    G("Recovery with ARIES", "The full recovery algorithm; watch after the videos above.", [3]),
    G("Transactions in DDIA", "Read to the end of isolation levels.", [5]),
  ],
  w8d2: [
    G("Docker and Postgres", "Run Postgres in a container for the rest of the course.", [0, 1]),
    G("Serializability", "Schedules, conflicts and the precedence graph, and a recoverability extra.", [2, 3, 9]),
    G("Isolation levels and anomalies", "Dirty reads, phantoms and write skew, in Postgres and in theory.", [4, 5, 6, 7, 8]),
  ],
  w8d3: [
    G("Two-phase locking", "Growing and shrinking phases, and strict 2PL.", [0, 1, 5]),
    G("Optimistic concurrency and timestamps", "Validate at commit, or order by timestamp and abort the latecomer.", [2, 3, 7]),
    G("MVCC", "Keeping several versions so readers do not block writers, and how Postgres does it.", [4, 6]),
  ],
  w8d4: [
    G("Joins", "What a join means, practice queries and the algorithms behind them.", [0, 3, 4]),
    G("Reading query plans", "EXPLAIN output, indexes in Postgres, and cost-based planning.", [1, 2, 5]),
  ],
  // Week 9
  w9d1: [
    G("Why distributed systems are hard", "Kleppmann's introduction and the two generals problem.", [0, 1]),
    G("Faults, networks and clocks", "Practical lessons, the eight fallacies and the DDIA chapter on trouble.", [2, 3, 4]),
  ],
  w9d2: [
    G("Physical and logical time", "Why clocks disagree, and how to order events without them.", [0, 1]),
    G("Causality and happens-before", "The video first, then Lamport's paper.", [3, 2]),
  ],
  w9d3: [
    G("Consistency and CAP", "A gentle first pass, a short CAP explainer, and the critique of CAP as a label.", [0, 1, 5]),
    G("Replication", "Leaders and followers, lag, quorums and state machine replication.", [2, 3, 6, 7]),
    G("Consistency models", "The map of models, and linearizability in depth.", [4, 8]),
  ],
  w9d4: [
    G("The Raft paper and its spec", "Sections 1 to 5 of the paper, and the lab spec with tests.", [0, 4]),
    G("Raft explained", "An animation and two talks, one by Raft's author.", [1, 2, 3]),
    G("Paxos", "Raft's older cousin.", [5]),
  ],
  // Week 10
  w10d1: [
    G("Raft log replication and safety", "Two long MIT lectures, the paper sections on the log and a visualisation.", [0, 4, 2, 3]),
    G("Implementing Raft", "A guide to the traps in AppendEntries.", [1]),
  ],
  w10d2: [
    G("Partitioning", "Key range versus hash, sharding trade-offs and rebalancing.", [0, 1, 2]),
    G("Consistent hashing and Dynamo", "The ring, virtual nodes, quorums and hinted handoff.", [3, 4, 5]),
    G("Partitioned computation", "Optional MIT lectures on MapReduce and Spanner.", [6, 7]),
  ],
  w10d3: [
    G("Kafka and message logs", "Topics, partitions, offsets and consumer groups.", [0, 1, 4]),
    G("Retries and idempotency", "Backoff with jitter and idempotency keys.", [2, 3]),
    G("Atomic commit", "Two-phase commit and where it blocks.", [5]),
  ],
  w10d4: [
    G("Load balancing and rate limiting", "Balancing algorithms, token and leaky buckets.", [0, 2]),
    G("System design practice", "A study guide and a worked URL shortener.", [1, 3]),
    G("Monitoring", "The four golden signals.", [4]),
  ],
  // Week 11
  w11d1: [
    G("Refactoring in practice", "A step-by-step refactor and the SOLID principles as questions.", [0, 1]),
    G("A Philosophy of Software Design", "Deep modules and information hiding, as a talk and the book page.", [2, 3]),
    G("Refactorings and patterns", "A catalogue to browse, and patterns as vocabulary.", [4, 5]),
    G("Software engineering at Google", "Culture and what the job is.", [6]),
  ],
  w11d2: [
    G("pytest", "A beginner tutorial, tox and CI, and fixtures and parametrize.", [0, 1, 6]),
    G("The test pyramid", "What to test at which level, and posts from the Google Testing Blog.", [2, 5]),
    G("Property-based testing", "Generated inputs, shrinking and stateful tests with Hypothesis.", [3, 4]),
  ],
  w11d3: [
    G("API styles", "REST, GraphQL and gRPC in one map, and RPC in depth.", [0, 1]),
    G("FastAPI", "A course to code along with; the gateway uses it from week 14.", [2]),
    G("Designing a good API", "A talk, Google's design guide and a standard error format.", [3, 4, 7]),
    G("Monolith or microservices", "The case for each.", [5, 6]),
  ],
  w11d4: [
    G("Docker", "A crash course and multi-stage builds for small images.", [0, 3]),
    G("CI/CD", "The idea in five minutes, and GitHub Actions workflows.", [1, 2]),
    G("Monitoring", "The four golden signals and exposing metrics from Python.", [4, 5]),
    G("Code review", "Both the author and reviewer guides.", [6]),
  ],
  // Week 12
  w12d1: [
    G("An on-ramp to machine learning", "Optional courses if ML is new: a long video and the beginner specialization.", [0, 9]),
    G("Linear regression and gradient descent", "Andrew Ng's derivation and a step-by-step gradient descent video.", [1, 4]),
    G("Linear algebra and calculus", "A visual series on vectors and matrices, and a free maths book.", [3, 5]),
    G("Tooling: uv, NumPy and pandas", "Set up the project and learn arrays and data frames.", [6, 7, 2, 8]),
  ],
  w12d2: [
    G("Measuring a classifier", "Confusion matrix, sensitivity and specificity, ROC and AUC.", [0, 1, 2]),
    G("Generalisation and validation", "Bias and variance, cross validation, and Google's course modules.", [4, 5, 3]),
    G("Logistic regression and regularisation", "Classification with a line, and ridge and lasso.", [6, 8, 9]),
    G("Trees, forests and boosting", "Decision trees, random forests, gradient boosting and Google's decision forests course.", [10, 11, 12, 13]),
    G("scikit-learn and a long reference", "The library guide, and a six-hour course to dip into.", [7, 14]),
  ],
  w12d3: [
    G("Neural networks and backpropagation", "Main ideas in four short videos and a book chapter.", [0, 1, 2, 3, 5, 7]),
    G("Build micrograd", "Karpathy's code-along and the original to compare with.", [4, 6]),
    G("Google's neural networks module", "Short and interactive.", [8]),
  ],
  w12d4: [
    G("PyTorch basics", "Tensors, autograd and optimisation, with a second walkthrough.", [0, 3]),
    G("Training neural networks well", "A recipe for avoiding silent bugs, and the full Zero to Hero series for later.", [1, 2]),
    G("Reference deep learning course", "Dip into the ANN, CNN and RNN chapters when needed.", [4, 5]),
    G("More machine learning, optional", "Clustering, PCA and nearest neighbours.", [6, 7, 8]),
  ],
  // Week 13
  w13d1: [
    G("LLMs in a nutshell", "Two short overviews of what an LLM is and how it is used.", [0, 1]),
    G("Attention and transformers, visually", "Three-Blue-One-Brown, Google and diagrams. Pick one or two; they cover the same ideas.", [2, 3, 4, 5, 6, 9, 10]),
    G("Try one in the browser", "Run GPT-2 and watch attention change.", [7]),
    G("The original paper", "Read after the above; it will make sense.", [8]),
    G("A long reference", "Five hours of NLP deep learning, to dip into.", [11]),
  ],
  w13d2: [
    G("Tokenization", "Build a BPE tokenizer, compare with minbpe, and see the main tokenizer families.", [0, 1, 4]),
    G("A tiny GPT", "Code along with Karpathy, then compare with nanoGPT.", [2, 3]),
  ],
  w13d3: [
    G("How LLMs are trained", "From pretraining to RLHF: a one-hour overview, a pipeline talk and a long deep dive.", [0, 1, 2]),
    G("LoRA and fine-tuning", "The paper, the library, a visual explanation and a runnable walkthrough.", [3, 4, 6, 7]),
    G("Preference tuning with DPO", "The paper and a video on the maths.", [5, 8]),
  ],
  w13d4: [
    G("Why inference is slow and how to speed it up", "Memory-bound generation, KV caching and PagedAttention.", [0, 1, 3, 6]),
    G("Quantization", "What you lose at 8-bit and 4-bit, in docs and a video.", [2, 5]),
    G("Run a model locally", "llama.cpp and Ollama.", [4]),
  ],
  // Week 14
  w14d1: [
    G("Prompting basics", "A short intro and Google's whitepaper, from zero-shot to chain of thought.", [0, 1]),
    G("Prompting guides from model makers", "Gemini and Claude advice, an interactive tutorial and a general reference. The advice overlaps.", [2, 5, 6, 8]),
    G("Calling a model from Python", "A getting-started video and the Claude API overview.", [4, 7]),
    G("Structured output and validation", "JSON schemas as a constraint, and Pydantic to check every response.", [3, 9]),
  ],
  w14d2: [
    G("What agents are", "The rise of agents, and Anthropic's advice to start simple.", [0, 3]),
    G("Function calling", "The same tool loop in Gemini and Claude, with names that differ.", [1, 2, 4]),
    G("Agent patterns", "ReAct, a survey of planning and memory, and Google's whitepaper.", [5, 6, 8]),
    G("Model Context Protocol", "A standard way to expose tools to models.", [7]),
    G("Agent frameworks, optional", "LangChain and LangGraph, after you have written the loop yourself.", [9, 10]),
  ],
  w14d3: [
    G("How to build evals", "Error analysis on real traces, common mistakes and a worked example.", [0, 1, 2]),
    G("Test cases and eval patterns", "Success criteria, graders and how production systems use evals.", [3, 4]),
    G("Evals in CI", "The pytest shape for a CI job, and RAG evaluation.", [7, 8]),
    G("Safety and cost", "Prompt injection and other LLM risks, and prompt caching.", [5, 6]),
  ],
  w14d4: [
    G("Streaming with server-sent events", "The protocol, and how Claude's API uses it.", [0, 1]),
    G("The Anthropic SDK", "For the real upstream.", [2]),
    G("Observability and platform design", "Standard attributes for model calls, and what a gateway needs.", [3, 4, 5]),
  ],
  // Week 15
  w15d1: [
    G("The RAG pipeline", "The whole idea in one picture, and a framework version for later.", [0, 11]),
    G("Embeddings", "Word2vec, cosine similarity, Google's module, and hosted and local embedding models.", [1, 2, 3, 4, 5, 10]),
    G("Approximate nearest neighbours: HNSW", "A skip list over a graph, as a paper, an article and a video.", [6, 7, 9]),
    G("Vector search in Postgres", "pgvector, your database from weeks 7 and 8.", [8]),
  ],
  w15d2: [
    G("Retrieval and reranking", "Hybrid search, bi-encoders versus cross-encoders, and advanced RAG techniques.", [0, 1, 2, 7]),
    G("Keyword search and rank fusion", "BM25 and reciprocal rank fusion.", [5, 6]),
    G("Chunking and context", "Chunking strategies, and why more retrieved text is not always better.", [4, 8]),
    G("The original RAG paper", "Introduction and section 2.", [3]),
    G("RAG courses, optional", "Longer videos with code.", [9, 10]),
  ],
  w15d3: [
    G("Citations and abstention", "Have the model quote its sources.", [0]),
    G("Better retrieval", "Contextual retrieval, HyDE and Self-RAG.", [1, 2, 3]),
    G("RAG tutorials and architectures", "Overview videos, longer courses and Google's reference diagrams.", [4, 5, 6, 7]),
  ],
  w15d4: [
    G("RAG metrics", "Precision, recall and faithfulness in words, and in Ragas.", [0, 1]),
    G("Retrieval metrics", "Recall at k, MRR and nDCG.", [2]),
    G("How RAG fails", "A catalogue of failures, a retrieval benchmark and a survey of techniques.", [3, 4, 5]),
  ],
  // Week 16
  w16d1: [
    G("Building RAG for production", "An end-to-end build with numbers, and a long course to dip into.", [0, 5]),
    G("Filtering, caching and access control", "Metadata filters in pgvector, semantic caching and server-side authorization.", [1, 2, 4]),
    G("Tracing", "Spans for retrieve, rerank and generate.", [3]),
  ],
  w16d2: [
    G("What MLOps is", "A short intro and Google's production module.", [0, 1]),
    G("Machine learning systems", "Technical debt, Google's rules and a design overview.", [2, 3, 4]),
    G("Serving with FastAPI", "A small typed HTTP service with health endpoints.", [5]),
    G("Deployment, optional", "An end-to-end project, Kubernetes versus Docker, and an MLOps playlist.", [6, 7, 8]),
  ],
  w16d3: [
    G("Diagrams and decisions", "The C4 model and architecture decision records.", [0, 3]),
    G("Resilience", "A circuit breaker between the gateway and the RAG service.", [1]),
    G("Running it together", "Docker Compose for the gateway, RAG service and key-value cluster.", [2]),
  ],
  w16d4: [
    G("Where to go next", "A map of computer science, and papers worth reading.", [0, 1]),
    G("Writing a postmortem", "The format for your failure report.", [2]),
  ],
};
