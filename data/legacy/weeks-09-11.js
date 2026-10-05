WEEKS.push(
  {
    n: 9,
    phase: "dist",
    title: "Distributed systems foundations and Raft",
    summary:
      "Machines fail, clocks disagree and networks partition. Learn the model, then implement leader election.",
    project:
      "A failure-injecting network layer, a replicated KV with async replication, and Raft leader election.",
    days: [
      {
        t: "Why distributed systems are hard",
        why: "Learn the fault model before any algorithm.",
        main: [
          V(
            "Distributed Systems 1.1: Introduction (Kleppmann)",
            "UEAMfLPZZhE",
            "15 min. Start the full lecture series.",
          ),
          V("Distributed Systems 2.1: The two generals problem", "MDuWnzVnfpI", "12 min."),
          R(
            "Notes on distributed systems for young bloods",
            "https://www.somethingsimilar.com/2013/01/14/notes-on-distributed-systems-for-young-bloods/",
            "Practical lessons.",
          ),
          R(
            "Fallacies of distributed computing",
            "https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing",
            "Eight false assumptions.",
          ),
          R(
            "DDIA chapter 8: the trouble with distributed systems",
            "https://dataintensive.net/",
            "Read the sections on faults, unreliable networks and unreliable clocks. The rest of the chapter waits for week 10.",
          ),
        ],
        build: [
          "Build a `faultnet` package in Python (asyncio): a transport that can delay, drop, duplicate and partition messages by node pair.",
          "Run three in-process nodes that exchange pings over faultnet.",
          "Write tests that partition and heal the network.",
        ],
        ship: "dist/faultnet reused for the rest of the plan.",
        swe: {
          t: "Design for failure",
          link: R(
            "Addressing cascading failures (Google SRE book)",
            "https://sre.google/sre-book/addressing-cascading-failures/",
            "Read the first half.",
          ),
        },
        ask: [
          "Why can't two generals ever be certain they agreed, and what do real protocols do instead?",
          "How do you tell a crashed node from a slow one?",
        ],
      },
      {
        t: "Time, clocks and ordering",
        why: "Without a shared clock, 'before' needs a new definition.",
        main: [
          V("Distributed Systems 3.1: Physical time", "FQ_2N3AQu0M", "Kleppmann, 21 min."),
          V("Distributed Systems 4.1: Logical time", "x-D8iFU1d-o", "Kleppmann, 24 min."),
          R(
            "Time, Clocks, and the Ordering of Events (Lamport)",
            "https://lamport.azurewebsites.net/pubs/time-clocks.pdf",
            "The foundational paper. Read to section 4.",
          ),
          V("Distributed Systems 3.3: Causality and happens-before (Kleppmann)", "OKHIdpOAxto", "16 min. Read the Lamport paper after this, not before."),
        ],
        build: [
          "Implement Lamport clocks and vector clocks in Python.",
          "Simulate five nodes sending random messages. Verify the happens-before relation from the vectors.",
          "Detect a pair of concurrent writes using vector clocks.",
        ],
        ship: "dist/clocks with property tests.",
        swe: {
          t: "Logging with correlation",
          link: D(
            "logging: structured logging with LoggerAdapter",
            "https://docs.python.org/3/howto/logging-cookbook.html#adding-contextual-information-to-your-logging-output",
            "Add node id and logical time to every log line.",
          ),
        },
        ask: [
          "Why can't you order events across machines using wall-clock timestamps?",
          "What can vector clocks tell you that Lamport clocks cannot?",
        ],
      },
      {
        t: "Replication and consistency models",
        why: "Copies of data diverge. Learn the choices and what each costs.",
        main: [
          V("Data Consistency and Tradeoffs in Distributed Systems (Gaurav Sen)", "m4q7VkgDWrM", "26 min, English. A gentle first pass at consistency."),
          V("CAP Theorem Simplified (ByteByteGo)", "BHqjEjzAicA", "6 min. Read Kleppmann's critique below after this."),
          V("Distributed Systems 5.1: Replication (Kleppmann)", "mBUCF1WGI_I", "25 min."),
          R(
            "DDIA chapter 5: replication",
            "https://dataintensive.net/",
            "Leaders, followers, lag, multi-leader, leaderless.",
          ),
          L(
            "Jepsen: consistency models",
            "https://jepsen.io/consistency",
            "Linearizable, sequential, causal, eventual.",
          ),
          R(
            "Please stop calling databases CP or AP (Kleppmann)",
            "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html",
            "A critique of CAP as a label.",
          ),
          V("Distributed Systems 5.2: Quorums (Kleppmann)", "uNxl3BFcKSA", "10 min. The W + R > N rule."),
          V("Distributed Systems 5.3: State machine replication (Kleppmann)", "mlWOQuO55PE", "10 min. The idea Raft is built on."),
          V("Distributed Systems 7.2: Linearizability (Kleppmann)", "noUNH3jDLC0", "19 min. The strongest single-object guarantee."),
        ],
        build: [
          "Build a leader-follower replicated KV store over faultnet with asynchronous replication.",
          "Kill the leader and promote a follower. Show a lost write.",
          "Read from a follower and demonstrate a stale read.",
          "Add quorum reads and writes (N replicas, write to W, read from R) and show that a stale read becomes impossible when W + R > N, and returns when it is not.",
        ],
        ship: "dist/kv-repl and a write-up of the anomalies you triggered.",
        swe: {
          t: "Write down the guarantees",
          link: R(
            "Architecture Decision Records",
            "https://adr.github.io/",
            "Record: what consistency do reads give?",
          ),
        },
        ask: [
          "What does linearizability promise that eventual consistency does not?",
          "Why does synchronous replication hurt availability?",
          "Why does W + R > N guarantee that a read sees the latest write?",
        ],
      },
      {
        t: "Consensus and Raft leader election",
        why: "Consensus lets a cluster agree on one leader even when nodes fail.",
        main: [
          R(
            "In Search of an Understandable Consensus Algorithm (Raft paper)",
            "https://raft.github.io/raft.pdf",
            "Sections 1-5. Figure 2 is your spec.",
          ),
          L(
            "The Secret Lives of Data: Raft",
            "https://thesecretlivesofdata.com/raft/",
            "An animated walkthrough.",
          ),
          V("Distributed Systems 6.2: Raft (Kleppmann)", "uXEYuDwm7e4", "38 min."),
          V(
            "Designing for Understandability: The Raft Consensus Algorithm (Ongaro)",
            "vYp4LYbnnW8",
            "60 min.",
          ),
          R(
            "MIT 6.5840 Lab 3: Raft",
            "https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html",
            "Your spec and test cases.",
          ),
          V("Paxos Agreement (Computerphile)", "s8JqcZtvnsM", "14 min. Raft's older cousin: proposers, acceptors and quorums. Know the idea; do not implement it."),
        ],
        build: [
          "Implement Raft node state: term, votedFor, log, role.",
          "Implement RequestVote, randomized election timeouts and heartbeats.",
          "Test that exactly one leader is elected, and that a new one is elected after the leader is partitioned.",
        ],
        ship: "dist/raft v0 with election tests and weekly/week-09.md.",
        swe: {
          t: "Debug distributed code",
          link: R(
            "Debugging distributed systems (MIT 6.824 lab advice)",
            "https://pdos.csail.mit.edu/6.824/labs/guidance.html",
            "Logging and test tips from MIT.",
          ),
        },
        ask: [
          "Why do election timeouts need to be randomised?",
          "What stops two leaders existing in the same term?",
          "How does Raft's leader-based design differ from basic Paxos?",
        ],
      },
    ],
  },
  {
    n: 10,
    phase: "dist",
    title: "Replicated logs, sharding and reliable systems",
    summary:
      "Finish Raft, then learn how to partition data and make requests safe to retry. End with system design practice.",
    project:
      "A Raft-replicated KV store behind an HTTP API with idempotency keys, tested with failure injection.",
    days: [
      {
        t: "Raft log replication and safety",
        why: "Make the leader's log the cluster's source of truth.",
        main: [
          V("Lecture 6: Fault Tolerance: Raft (1) - MIT 6.824", "64Zp3tzNbpE", "Robert Morris, 80 min."),
          R(
            "Students' guide to Raft",
            "https://thesquareplanet.com/blog/students-guide-to-raft/",
            "Read before you implement AppendEntries.",
          ),
          R(
            "Raft paper, sections 5.3-5.4",
            "https://raft.github.io/raft.pdf",
            "Log matching and election restriction.",
          ),
          L("Raft visualization", "https://raft.github.io/", "Experiment with failures."),
          V("Lecture 7: Fault Tolerance: Raft (2) - MIT 6.824", "4r8Mz3MMivY", "Robert Morris, 78 min. Persistence, snapshots and the figure 8 scenario."),
        ],
        build: [
          "Implement AppendEntries with the consistency check and log repair.",
          "Advance the commit index and apply committed entries to the KV state machine.",
          "Run tests with random partitions, crashes and message loss on faultnet. Fix what fails.",
        ],
        ship: "dist/raft v1 replicating a KV store.",
        swe: {
          t: "Deterministic tests",
          link: R(
            "Deterministic simulation testing",
            "https://notes.eatonphil.com/2024-08-20-deterministic-simulation-testing.html",
            "Seed your randomness so failures reproduce.",
          ),
        },
        ask: [
          "Why can a leader only commit entries from its own term by counting replicas?",
          "What happens to uncommitted entries on a deposed leader?",
        ],
      },
      {
        t: "Partitioning and consistent hashing",
        why: "One machine's capacity is a ceiling. Spread data across many.",
        main: [
          V("Horizontal vs Vertical Database Partitioning (Hussein Nasser)", "QA25cMWp9Tk", "10 min."),
          V("When should you shard your database? (Hussein Nasser)", "iHNovZUZM3A", "21 min. The costs people forget."),
          R(
            "DDIA chapter 6: partitioning",
            "https://dataintensive.net/",
            "Key range versus hash, rebalancing.",
          ),
          R(
            "Dynamo: Amazon's highly available key-value store",
            "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
            "Consistent hashing, quorums, hinted handoff.",
          ),
          V("What is CONSISTENT HASHING and Where is it used?", "zaRkONvyGr8", "Gaurav Sen."),
          V("Consistent Hashing | Algorithms You Should Know", "UF9Iqmg94tk", "ByteByteGo."),
          V("Lecture 1: Introduction, MapReduce (MIT 6.824)", "cQP8WApzIQQ", "Optional, 80 min. Partitioned computation as well as partitioned storage."),
          V("Lecture 13: Spanner (MIT 6.824)", "4eW5SWBi7vs", "Optional, 79 min. Partitions, Paxos groups and TrueTime together. Good to return to after the week."),
        ],
        build: [
          "Implement a consistent hash ring with virtual nodes in Python.",
          "Measure key distribution with 1, 10 and 100 virtual nodes.",
          "Add and remove a node and report the fraction of keys that move.",
        ],
        ship: "dist/ring with tests and distribution plots.",
        swe: {
          t: "Capacity thinking",
          link: R(
            "Latency numbers",
            "https://gist.github.com/jboner/2841832",
            "Use them for back-of-envelope sizing.",
          ),
        },
        ask: [
          "Why does naive modulo hashing move almost every key when a node is added?",
          "What problem do virtual nodes solve?",
          "What is a hot partition, and how would you reduce one?",
        ],
      },
      {
        t: "Messaging, retries and idempotency",
        why: "Networks duplicate and drop. Make operations safe to repeat.",
        main: [
          V("Apache Kafka Fundamentals You Should Know (ByteByteGo)", "-RDyEFvnTXI", "5 min."),
          V("What is Kafka and How does it work? (Hussein Nasser)", "LN_HcJVbySw", "15 min. Topics, partitions, offsets and consumer groups."),
          R(
            "Designing robust and predictable APIs with idempotency (Stripe)",
            "https://stripe.com/blog/idempotency",
            "Idempotency keys in practice.",
          ),
          R(
            "Timeouts, retries and backoff with jitter (AWS Builders' Library)",
            "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
            "Read in full.",
          ),
          D(
            "Apache Kafka documentation: design",
            "https://kafka.apache.org/documentation/#design",
            "Read persistence, the producer and consumer sections, and delivery semantics.",
          ),
          V("Distributed Systems 7.1: Two-phase commit (Kleppmann)", "-_rdWB9hN1c", "19 min. Atomic commit across nodes, and where it blocks."),
        ],
        build: [
          "Put an HTTP API in front of your Raft KV. Support an `Idempotency-Key` header and store results.",
          "Write a client with timeouts, exponential backoff and full jitter.",
          "Test: inject message loss and duplicate requests. Verify each logical write applies exactly once.",
          "Sketch two-phase commit across two shards of your store: coordinator, prepare, commit, and what each participant does if the coordinator dies after prepare. Implement it over faultnet if time allows.",
        ],
        ship: "dist/api and client library with tests.",
        swe: {
          t: "Resilience patterns",
          link: R(
            "Circuit breaker (Fowler)",
            "https://martinfowler.com/bliki/CircuitBreaker.html",
            "Add one to your client.",
          ),
        },
        ask: [
          "Why is 'exactly once' delivery impossible, and how do you get exactly-once effects instead?",
          "What goes wrong with retries without jitter during an outage?",
          "What does two-phase commit block on, and how does a replicated coordinator help?",
        ],
      },
      {
        t: "System design practice and failure testing",
        why: "Turn the components into designs you can explain under time pressure.",
        main: [
          V("What is LOAD BALANCING? (Gaurav Sen)", "K0Ta65OqQkY", "14 min. Round robin, least connections, consistent hashing: you have met them all."),
          R(
            "The System Design Primer",
            "https://github.com/donnemartin/system-design-primer",
            "Read the study guide and the scalability sections.",
          ),
          V("Rate Limiter System Design: Token Bucket, Leaky Bucket, Scaling", "YXkOdWBwqaA", "ByteByteGo."),
          V("Design a URL Shortener (Bitly) - System Design Interview", "qSJAvd5Mgio", "NeetCode, 49 min."),
          R(
            "Google SRE book: monitoring distributed systems",
            "https://sre.google/sre-book/monitoring-distributed-systems/",
            "Four golden signals.",
          ),
        ],
        build: [
          "Design a URL shortener and a rate limiter in 45 minutes each: requirements, estimates, API, data model, scaling, failure modes.",
          "Run a Jepsen-style test on your cluster: concurrent clients, random partitions and crashes, then check linearizability by hand on small histories.",
          "Write weekly/week-10.md and an ADR for your replication choice.",
        ],
        ship: "Two design docs, one ADR, a failure-injection report.",
        swe: {
          t: "Estimation",
          link: R(
            "System design: back-of-envelope estimation",
            "https://github.com/donnemartin/system-design-primer#back-of-the-envelope-calculations",
            "Use the powers-of-two table.",
          ),
        },
        ask: [
          "Where is the first bottleneck in your design at 10x load and at 100x?",
          "What does your system do when the leader and a follower are partitioned from the rest?",
        ],
      },
    ],
  },
  {
    n: 11,
    phase: "swe",
    title: "Software engineering in depth",
    summary:
      "Design, testing, APIs, architecture, delivery and operations: the practices that make a codebase last. Applied to your own projects.",
    project:
      "Refactor and productionise your Raft-backed KV service: clean modules, test suite, versioned API, CI, container image, metrics and a runbook.",
    days: [
      {
        t: "Software design and refactoring",
        why: "Complexity is the main enemy. Learn to see it and reduce it.",
        main: [
          V("From Spaghetti Code to Clean Python (ArjanCodes)", "mH7e7fs9gaE", "23 min. A refactor shown step by step."),
          V("Uncle Bob's SOLID Principles Made Easy, in Python (ArjanCodes)", "pTB30aXS77U", "19 min. Use the principles as questions to ask of your code."),
          V("A Philosophy of Software Design (Ousterhout, Talks at Google)", "bmSAYlu0NcY", "62 min."),
          R(
            "A Philosophy of Software Design: book page",
            "https://web.stanford.edu/~ouster/cgi-bin/book.php",
            "Deep modules, information hiding.",
          ),
          R("Refactoring catalog (Fowler)", "https://refactoring.com/catalog/", "Browse; pick five."),
          R(
            "Refactoring Guru: design patterns",
            "https://refactoring.guru/design-patterns",
            "Learn patterns as vocabulary, not recipes.",
          ),
          R(
            "Software Engineering at Google",
            "https://abseil.io/resources/swe-book",
            "Read the culture and 'what is software engineering' chapters.",
          ),
        ],
        build: [
          "Audit your HTTP server and KV service for shallow modules and leaked details.",
          "Refactor into modules with small public interfaces. Keep all tests green.",
          "Write a 1-page design doc: goals, non-goals, components, key decisions.",
        ],
        ship: "A refactor PR to yourself with a description reviewers could follow.",
        swe: {
          t: "Naming",
          link: R(
            "Google Python style guide",
            "https://google.github.io/styleguide/pyguide.html",
            "Naming, module layout and exception handling.",
          ),
        },
        ask: [
          "What makes a module 'deep', and which of yours is shallow?",
          "What does this refactor make easier to change, and what did you deliberately leave alone?",
        ],
      },
      {
        t: "Testing in depth",
        why: "Tests are the only reliable proof a change is safe.",
        main: [
          V("Please Learn How To Write Tests in Python: Pytest Tutorial (Tech With Tim)", "EgpLj86ZHFQ", "33 min. Start here if pytest is still new."),
          V("Automated Testing in Python with pytest, tox, and GitHub Actions (mCoding)", "DhUpxWjOhME", "27 min."),
          R(
            "The practical test pyramid (Fowler)",
            "https://martinfowler.com/articles/practical-test-pyramid.html",
            "What to test at which level.",
          ),
          D(
            "Hypothesis: property-based testing",
            "https://hypothesis.readthedocs.io/en/latest/",
            "Generated inputs, shrinking and stateful tests.",
          ),
          R(
            "Hypothesis quickstart",
            "https://hypothesis.readthedocs.io/en/latest/quickstart.html",
            "Write one property test for your parser.",
          ),
          R("Google Testing Blog", "https://testing.googleblog.com/", "Read three posts."),
          D(
            "pytest: fixtures and parametrize",
            "https://docs.pytest.org/en/stable/how-to/fixtures.html",
            "Fixtures, parametrized tests and helpers.",
          ),
        ],
        build: [
          "Convert tests to `pytest.mark.parametrize` tables. Add fixtures that set up and clean up with `yield`.",
          "Fuzz your HTTP request parser and the KV record decoder with Hypothesis for 5 minutes each. Fix what it finds.",
          "Measure coverage with `pytest --cov`; find the untested branch that worries you most and test it.",
        ],
        ship: "Test suite with unit, integration and fuzz tests; coverage report.",
        swe: {
          t: "Mutation thinking",
          link: R(
            "Mutation testing at Google",
            "https://testing.googleblog.com/2021/04/mutation-testing.html",
            "Ask whether your tests would catch a deliberate bug.",
          ),
        },
        ask: [
          "Which test would have caught your worst bug so far, and at which level of the pyramid does it belong?",
          "When is a mock the wrong choice?",
        ],
      },
      {
        t: "APIs and architecture styles",
        why: "Interfaces outlive implementations. Design them to evolve.",
        main: [
          V("Top 6 Most Popular API Architecture Styles (ByteByteGo)", "4vLxWqE94l4", "4 min. REST, GraphQL, gRPC and the rest in one map."),
          V("What is RPC? gRPC Introduction (ByteByteGo)", "gnchfOojMk4", "6 min. Needed for the REST versus gRPC ADR."),
          V("FastAPI Course for Beginners (freeCodeCamp)", "tLKKmouUams", "65 min. FastAPI is what the gateway uses from week 14. Code along with the first half."),
          V("How To Design A Good API and Why it Matters (Bloch)", "aAb7hSCtvGw", "60 min."),
          R(
            "Google API design guide",
            "https://cloud.google.com/apis/design",
            "Resource-oriented design, errors, versioning.",
          ),
          R(
            "Microservices (Fowler and Lewis)",
            "https://martinfowler.com/articles/microservices.html",
            "Read with the next link.",
          ),
          R(
            "Monolith first (Fowler)",
            "https://martinfowler.com/bliki/MonolithFirst.html",
            "A counterweight.",
          ),
          R(
            "RFC 9457: Problem Details for HTTP APIs",
            "https://www.rfc-editor.org/rfc/rfc9457",
            "A standard error format.",
          ),
        ],
        build: [
          "Write an OpenAPI spec for your KV service. Version it under `/v1`.",
          "Return errors as problem+json. Add pagination for key listing.",
          "Write an ADR comparing REST and gRPC for this service.",
        ],
        ship: "api/openapi.yaml, a conformance test, and one ADR.",
        swe: {
          t: "Backward compatibility",
          link: R(
            "Semantic Versioning and API compatibility",
            "https://semver.org/",
            "What may change in a v1 API.",
          ),
        },
        ask: [
          "Which change to your API would break an existing client, and how would you roll it out safely?",
          "When would you split this service in two, and what would it cost?",
        ],
      },
      {
        t: "Delivery and operations",
        why: "Software that cannot be built, shipped and observed is unfinished.",
        main: [
          V("Docker Crash Course for Absolute Beginners (TechWorld with Nana)", "pg19Z8LL06w", "68 min. Images, containers, volumes and Compose. You used a container in week 8; now you build one."),
          V("CI/CD Explained in 5 Minutes (TechWorld with Nana)", "ddDJxFnv-qs", "5 min."),
          D(
            "GitHub Actions documentation",
            "https://docs.github.com/en/actions",
            "Workflows, jobs, caching.",
          ),
          D(
            "Docker: multi-stage builds",
            "https://docs.docker.com/build/building/multi-stage/",
            "Small, reproducible images.",
          ),
          R(
            "Google SRE book: monitoring distributed systems",
            "https://sre.google/sre-book/monitoring-distributed-systems/",
            "Latency, traffic, errors, saturation.",
          ),
          D("Prometheus Python client", "https://prometheus.github.io/client_python/", "Expose /metrics."),
          R(
            "Google engineering practices: code review",
            "https://google.github.io/eng-practices/review/",
            "Both the author and reviewer guides.",
          ),
        ],
        build: [
          "CI workflow: install with uv, `ruff check`, `mypy`, `pytest`, and a Hypothesis run with a fixed seed.",
          "Multi-stage Dockerfile that installs locked dependencies with uv into a slim image under 200 MB, running as a non-root user.",
          "Expose /metrics (request count, latency histogram), structured logs with the `logging` module, and py-spy or `cProfile` available on a private port.",
          "Write a runbook: how to tell the service is unhealthy and the first three things to check.",
        ],
        ship: "weekly/week-11.md, green CI badge, container image, runbook.",
        swe: {
          t: "Pipeline as code",
          link: V(
            "GitHub Actions Tutorial: Basic Concepts and CI/CD Pipeline with Docker",
            "R8_veQiYBjI",
            "TechWorld with Nana.",
          ),
        },
        ask: [
          "If the p99 latency doubles at 3 a.m., what do your metrics and logs tell you in the first five minutes?",
          "What would stop a bad commit from reaching production?",
        ],
      },
    ],
  },
);
