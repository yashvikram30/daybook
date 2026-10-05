WEEKS.push(
  {
    n: 5,
    phase: "net",
    title: "Sockets, TCP, HTTP and DNS",
    summary:
      "Systems programming in Python: build the web from the bottom with sockets first, then an HTTP server, then a DNS client.",
    project: "An HTTP/1.1 server on raw TCP, and a mini `dig` over UDP.",
    days: [
      {
        t: "Python for systems and the network layers",
        why: "You have written Python since day one. Today you use its socket module and learn the stack your bytes travel through.",
        main: [
          D(
            "socket: low-level networking interface",
            "https://docs.python.org/3/library/socket.html",
            "socket, bind, listen, accept, timeouts. Read the overview and the examples at the end.",
          ),
          R(
            "asyncio streams",
            "https://docs.python.org/3/library/asyncio-stream.html",
            "start_server, StreamReader and StreamWriter. You used asyncio in week 3; now put it on a socket.",
          ),
          V("Network Layers Model (Networking Basics) - Computerphile", "eelvWAURfdI", "13 min."),
          R(
            "Socket Programming HOWTO (Python docs)",
            "https://docs.python.org/3/howto/sockets.html",
            "Creating, connecting, sending and receiving, and why recv can return fewer bytes than you asked for.",
          ),
        ],
        build: [
          "Write a TCP echo server with `socket`. Handle each connection in a thread, then write the same server with `asyncio.start_server`.",
          "Write a client. Test with `nc` and with your client.",
          "Capture the traffic with `sudo tcpdump -i lo0 -n port 9000` (or Wireshark).",
        ],
        ship: "net/ex1-echo with a capture annotated by layer.",
        swe: {
          t: "Test the network without a network",
          link: R(
            "pytest: fixtures",
            "https://docs.pytest.org/en/stable/how-to/fixtures.html",
            "Use `socket.socketpair` and a server fixture on port 0 so tests stay fast.",
          ),
        },
        ask: [
          "At which layer does each of these live: MAC address, IP address, port, HTTP header?",
          "What does a thread cost compared with an asyncio task, and which would you choose for 10,000 idle connections?",
        ],
      },
      {
        t: "TCP in depth",
        why: "TCP makes an unreliable network look like a reliable byte stream. See how.",
        main: [
          V(
            "TCP a: Ensuring Your Data Gets There & in the Right Order! - Computerphile",
            "IADOV8UZO34",
            "17 min.",
          ),
          V(
            "What is the TCP 3-Way Handshake and Why Backend Engineers should understand it",
            "bW_BILl7n0Y",
            "Hussein Nasser.",
          ),
          R(
            "RFC 9293: Transmission Control Protocol",
            "https://www.rfc-editor.org/rfc/rfc9293",
            "Read the state diagram and the section on connection establishment.",
          ),
          R(
            "socket: examples (Python docs)",
            "https://docs.python.org/3/library/socket.html#example",
            "A TCP echo server and client. Streams, ports and the usual accept/recv/send pattern.",
          ),
        ],
        build: [
          "Watch the SYN, SYN-ACK, ACK and FIN exchange in tcpdump.",
          "Make a client that connects and then goes silent. Add read timeouts to the server with `sock.settimeout` or `asyncio.timeout`.",
          "Test half-close with `sock.shutdown(socket.SHUT_WR)` and explain the output.",
        ],
        ship: "net/ex2-tcp-notes.md: annotated handshake and teardown.",
        swe: {
          t: "Timeouts everywhere",
          link: R(
            "socket: notes on timeouts",
            "https://docs.python.org/3/library/socket.html#notes-on-socket-timeouts",
            "Why a socket with no timeout can hang forever, and how asyncio.timeout does the same job.",
          ),
        },
        ask: [
          "What is TIME_WAIT and why does the side that closes first end up in it?",
          "What happens to data in flight when a peer crashes without sending FIN?",
        ],
      },
      {
        t: "HTTP/1.1 from raw sockets",
        why: "Parsing the protocol yourself shows that HTTP is just structured text over TCP.",
        main: [
          R(
            "RFC 9112: HTTP/1.1",
            "https://www.rfc-editor.org/rfc/rfc9112",
            "Message format, Content-Length, chunked encoding, persistence.",
          ),
          R(
            "MDN: an overview of HTTP",
            "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
            "Orientation.",
          ),
          V(
            "Hyper Text Transfer Protocol Crash Course - HTTP 1.0, 1.1, HTTP/2, HTTP/3",
            "0OrmKCB0UrQ",
            "Hussein Nasser, 45 min.",
          ),
          D("curl manual", "https://curl.se/docs/manpage.html", "Use `-v` for everything."),
        ],
        build: [
          "Accept on a TCP listener and parse the request line, headers and body by hand.",
          "Route GET and POST, write correct status lines and Content-Length.",
          "Support keep-alive. Verify with `curl -v` that one connection serves two requests.",
        ],
        ship: "net/httpd with tests using a raw TCP client.",
        swe: {
          t: "Design HTTP APIs deliberately",
          link: R(
            "MDN: HTTP request methods",
            "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",
            "Safe and idempotent methods matter later for retries.",
          ),
        },
        ask: [
          "How does a server know where a request body ends, and what goes wrong if you get it wrong?",
          "What does keep-alive save, and what new problem does it create for a server?",
        ],
      },
      {
        t: "DNS and UDP",
        why: "Name resolution is the first thing every connection does.",
        main: [
          V("How DNS Works - Computerphile", "uOfonONtIuk", "8 min."),
          L("How DNS works (comic)", "https://howdns.works/", "A short visual story."),
          L(
            "Implement DNS in a weekend (Julia Evans)",
            "https://implement-dns.wizardzines.com/",
            "Your guide for today's build.",
          ),
          R(
            "RFC 1035: Domain names, implementation and specification",
            "https://www.rfc-editor.org/rfc/rfc1035",
            "Message format and name compression.",
          ),
        ],
        build: [
          "Build a DNS query for an A record as raw bytes. Send it over UDP to 8.8.8.8.",
          "Parse the header, question and answer sections, including name compression.",
          "Follow referrals from a root server to resolve a name iteratively.",
        ],
        ship: "net/mini-dig and weekly/week-05.md.",
        swe: {
          t: "Write the README",
          link: R("Make a README", "https://www.makeareadme.com/", "Give mini-dig a real one."),
        },
        ask: [
          "Why is DNS mostly UDP, and when does it fall back to TCP?",
          "Where do caches sit between your laptop and the authoritative server, and who controls their lifetime?",
        ],
      },
    ],
  },
  {
    n: 6,
    phase: "net",
    title: "Reliable transport, TLS and security",
    summary:
      "Build reliability on top of UDP, then secure a connection with TLS and learn the basics of attacking and defending a web service.",
    project:
      "A reliable-delivery protocol over lossy UDP, and your HTTP server behind TLS and a load balancer.",
    days: [
      {
        t: "Reliability over UDP",
        why: "Build the ideas TCP uses: sequence numbers, acks, retransmission.",
        main: [
          V("Network Basics - Transport Layer and UDP Explained - Computerphile", "ihvbhwGblQg", "15 min."),
          R(
            "Computer Networks: A Systems Approach, reliable transmission",
            "https://book.systemsapproach.org/direct/reliable.html",
            "Stop-and-wait and sliding window.",
          ),
          R(
            "socket: SOCK_DGRAM (Python docs)",
            "https://docs.python.org/3/library/socket.html#socket.SOCK_DGRAM",
            "Datagram sockets with sendto and recvfrom. Compare to TCP: no connection, no ordering, no retransmission.",
          ),
        ],
        build: [
          "Write a lossy UDP wrapper that drops, delays and reorders packets with configurable probabilities.",
          "Implement stop-and-wait with sequence numbers, ACKs and retransmission timers.",
          "Transfer a 10 MB file at 10% loss and verify the checksum.",
        ],
        ship: "net/rudp v0 and a loss-vs-throughput table.",
        swe: {
          t: "Simulate failure in tests",
          link: R(
            "pytest: monkeypatching and fixtures",
            "https://docs.pytest.org/en/stable/how-to/monkeypatch.html",
            "Make the lossy wrapper a test fixture.",
          ),
        },
        ask: [
          "How do you choose a retransmission timeout, and what goes wrong if it is too short?",
          "Why does stop-and-wait waste bandwidth on a long link?",
        ],
      },
      {
        t: "Sliding window and congestion control",
        why: "Fill the pipe without drowning the network.",
        main: [
          V(
            "TCP b: Additive Increase Multiplicative Decrease & Slow Start - Computerphile",
            "nKVML4YaBqs",
            "26 min.",
          ),
          V("Internet Congestion Collapse - Computerphile", "edUN8OabWCQ", "20 min."),
          R(
            "TCP Congestion Control: A Systems Approach",
            "https://tcpcc.systemsapproach.org/",
            "Chapters 1-3.",
          ),
          V("TCP Congestion Control (Kurose)", "cIHiSR4j3g4", "22 min."),
        ],
        build: [
          "Upgrade rudp to a sliding window with cumulative ACKs.",
          "Add AIMD congestion control with slow start.",
          "Plot window size over time under 1%, 5% and 10% loss.",
        ],
        ship: "net/rudp v1 with plots.",
        swe: {
          t: "Benchmark properly",
          link: R(
            "pytest-benchmark",
            "https://pytest-benchmark.readthedocs.io/en/latest/",
            "Calibrated rounds, statistics and saved runs to compare against.",
          ),
        },
        ask: [
          "Why does TCP halve its window on loss and grow by one per round trip?",
          "What causes bufferbloat and why does it hurt interactive traffic?",
        ],
      },
      {
        t: "TLS",
        why: "Understand how two strangers agree on a secret and prove who they are.",
        main: [
          L(
            "The Illustrated TLS 1.3 Connection",
            "https://tls13.xargs.org/",
            "Every byte of a handshake, explained.",
          ),
          V("TLS Handshake Explained - Computerphile", "86cQJ0MMses", "17 min."),
          V(
            "Transport Layer Security, TLS 1.2 and 1.3 (Explained by Example)",
            "AlE5X1NlHgg",
            "Hussein Nasser.",
          ),
          D(
            "ssl: TLS/SSL wrapper for sockets",
            "https://docs.python.org/3/library/ssl.html",
            "SSLContext, load_cert_chain and wrap_socket.",
          ),
          L("mkcert", "https://github.com/FiloSottile/mkcert", "Local trusted certificates."),
        ],
        build: [
          "Generate a local certificate with mkcert. Serve your HTTP server over TLS.",
          "Run `openssl s_client -connect localhost:8443 -tls1_3` and read the output.",
          "Compare the TLS capture in Wireshark with the Illustrated TLS 1.3 page.",
        ],
        ship: "net/httpd now serves HTTPS. Note on certificate chains and what verification checks.",
        swe: {
          t: "Secrets and configuration",
          link: R(
            "The Twelve-Factor App: config",
            "https://12factor.net/config",
            "Never commit keys or certificates.",
          ),
        },
        ask: [
          "What does a certificate prove and who vouches for it?",
          "What is forward secrecy, and which part of the handshake gives it?",
        ],
      },
      {
        t: "Security basics, HTTP/2 and load balancing",
        why: "Protect what you built and scale it across servers.",
        main: [
          R("OWASP Top 10", "https://owasp.org/Top10/", "Know the list and one example of each."),
          R(
            "OWASP Password Storage Cheat Sheet",
            "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
            "Hashing, salting, argon2id.",
          ),
          V("How HTTP/2 Works, Performance, Pros & Cons and More", "fVKPrDrEwTI", "Hussein Nasser."),
          R(
            "What is load balancing? (Cloudflare Learning Center)",
            "https://www.cloudflare.com/learning/performance/what-is-load-balancing/",
            "Algorithms and health checks.",
          ),
          D(
            "asyncio: open_connection and start_server",
            "https://docs.python.org/3/library/asyncio-stream.html#asyncio.open_connection",
            "For the build: forward bytes both ways between a client and a backend.",
          ),
        ],
        build: [
          "Write a round-robin reverse proxy with health checks in front of two copies of your server.",
          "Write a one-page threat model (STRIDE) for the proxy and server. List three mitigations.",
          "Add rate limiting per IP and test it.",
        ],
        ship: "net/lb and weekly/week-06.md.",
        swe: {
          t: "Threat modelling",
          link: R(
            "OWASP threat modeling cheat sheet",
            "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
            "Four questions: what are we building, what can go wrong, what do we do, did we do enough.",
          ),
        },
        ask: [
          "How does a load balancer decide a backend is dead, and what if it is only slow?",
          "Why is HTTPS alone not enough to prevent SQL injection or XSS?",
        ],
      },
    ],
  },
  {
    n: 7,
    phase: "db",
    title: "Storage engines",
    summary: "How databases lay data out on disk and find it again: pages, B-trees, logs and LSM trees.",
    project:
      "A key-value store in Python with an append-only log, in-memory index, compaction, and an LSM extension.",
    days: [
      {
        t: "Pages, tuples and the buffer pool",
        why: "A database is a file format plus a cache. Start with the file format.",
        main: [
          V(
            "#03 - Database Storage: Files, Pages, Tuples (CMU Intro to Database Systems)",
            "PRLXdIMJhOg",
            "Andy Pavlo, 77 min.",
          ),
          R("CMU 15-445 course site", "https://15445.courses.cs.cmu.edu/", "Schedule, notes and projects."),
          R(
            "Designing Data-Intensive Applications",
            "https://dataintensive.net/",
            "Your reference through week 10. Chapter 3 now.",
          ),
          R(
            "SQLite file format",
            "https://www.sqlite.org/fileformat2.html",
            "A real page layout you can inspect.",
          ),
        ],
        build: [
          "Create a SQLite database, insert rows, and inspect with `sqlite3 .dbinfo` and `xxd`.",
          "Design a slotted page: header, slot array, tuple data growing from the end.",
          "Implement it in Python over a `bytearray` with `struct`, with insert, get and delete, and a fixed 4 KB page size.",
        ],
        ship: "db/page/ with tests.",
        swe: { t: "SQL fluency", link: L("SQLBolt", "https://sqlbolt.com/", "Finish the lessons today.") },
        ask: [
          "Why do databases use fixed-size pages instead of byte-addressable files?",
          "What does the buffer pool decide, and what policy would you use to evict?",
        ],
      },
      {
        t: "Indexes: B-trees and LSM trees",
        why: "Two ways to find a key fast on disk, each with a different cost.",
        main: [
          V("#08 - Tree Indexes: B+Trees (CMU Intro to Database Systems)", "scUtG_6M_lU", "Andy Pavlo."),
          R("Use The Index, Luke", "https://use-the-index-luke.com/", "Read 'Anatomy of an index'."),
          V("The Secret Sauce Behind NoSQL: LSM Tree", "I6jB0nM9SKU", "ByteByteGo."),
          V("B-tree vs B+ tree in Database Systems", "UzHl2VzyZS4", "Hussein Nasser."),
        ],
        build: [
          "Implement an in-memory B-tree in Python (insert and search at least; delete if time).",
          "Benchmark it against `dict` and a sorted list with `bisect` for 1M keys.",
          "Write a short comparison of B-tree and LSM tree: reads, writes, space.",
        ],
        ship: "db/btree with benchmarks and the comparison note.",
        swe: {
          t: "Read the explain output",
          link: R(
            "Postgres: using EXPLAIN",
            "https://www.postgresql.org/docs/current/using-explain.html",
            "You will use this on day 8.",
          ),
        },
        ask: [
          "Why does a B+tree have a high fanout, and how does that bound its height?",
          "Which workload would make you pick an LSM tree over a B-tree?",
        ],
      },
      {
        t: "A log-structured key-value store",
        why: "The simplest durable store that actually works.",
        main: [
          R(
            "Bitcask: a log-structured hash table for fast key/value data",
            "https://riak.com/assets/bitcask-intro.pdf",
            "Six pages. Your design spec.",
          ),
          R(
            "DDIA chapter 3: storage and retrieval",
            "https://dataintensive.net/",
            "Hash indexes, SSTables, LSM trees.",
          ),
          D(
            "os.fsync",
            "https://docs.python.org/3/library/os.html#os.fsync",
            "fsync in Python, and why flush() comes first.",
          ),
        ],
        build: [
          "Append-only data file with checksummed records: key length, value length, key, value, CRC.",
          "In-memory hash index of key to file offset. Rebuild on startup by scanning.",
          "Get, Put, Delete (tombstones) and compaction. CLI first, HTTP later.",
        ],
        ship: "db/kv v0 with tests, including reopen-after-write.",
        swe: {
          t: "Design for testability",
          link: R(
            "doctest: test interactive examples",
            "https://docs.python.org/3/library/doctest.html",
            "Document usage as runnable tests.",
          ),
        },
        ask: [
          "What happens if the process dies halfway through writing a record?",
          "Why does compaction need to be safe against concurrent reads?",
        ],
      },
      {
        t: "Memtable, SSTables and Bloom filters",
        why: "Extend the KV store into a small LSM tree.",
        main: [
          R(
            "LevelDB implementation notes",
            "https://github.com/google/leveldb/blob/main/doc/impl.md",
            "Levels, SSTables, compaction.",
          ),
          V("FAST database writes with LSM", "9Plg3Oi1MT8", "Ben Dicken."),
          V("Bloom Filters | Algorithms You Should Know", "V3pzxngeLqw", "ByteByteGo."),
          R(
            "SQLite architecture",
            "https://www.sqlite.org/arch.html",
            "How a complete engine fits together.",
          ),
        ],
        build: [
          "Add an in-memory sorted memtable that flushes to an immutable sorted file at a size threshold.",
          "Read path: memtable, then newest to oldest SSTable. Add a Bloom filter per SSTable.",
          "Benchmark reads and writes against your v0.",
        ],
        ship: "db/kv v1 and weekly/week-07.md.",
        swe: {
          t: "Measure with benchmarks, not intuition",
          link: R(
            "The Python profilers",
            "https://docs.python.org/3/library/profile.html",
            "Use cProfile on your flush path.",
          ),
        },
        ask: [
          "Why can an LSM tree return a stale value if you read the SSTables in the wrong order?",
          "What is write amplification and where does it come from?",
        ],
      },
    ],
  },
  {
    n: 8,
    phase: "db",
    title: "Transactions, isolation and query planning",
    summary: "What a database actually promises, and what it costs to keep the promise.",
    project:
      "Add a write-ahead log and snapshot-isolated transactions to your KV store, then try to break it with crashes.",
    days: [
      {
        t: "Transactions, ACID and the write-ahead log",
        why: "Atomicity and durability come from one trick: write the intent down first.",
        main: [
          V(
            "#21 - Database Recovery with ARIES (CMU Intro to Database Systems)",
            "yVpzHdAP0TY",
            "Andy Pavlo.",
          ),
          V("Relational Database ACID Transactions (Explained by Example)", "pomxJOFVcQs", "Hussein Nasser."),
          R(
            "DDIA chapter 7: transactions",
            "https://dataintensive.net/",
            "Read to the end of isolation levels.",
          ),
          R(
            "PostgreSQL: write-ahead logging",
            "https://www.postgresql.org/docs/current/wal-intro.html",
            "Short and clear.",
          ),
        ],
        build: [
          "Add a WAL to the KV store: log the operation, fsync, then apply.",
          "On startup replay the WAL to rebuild the state.",
          "Add group commit: batch several writes into one fsync. Measure the throughput change.",
        ],
        ship: "db/kv v2 with WAL and replay tests.",
        swe: {
          t: "Define invariants",
          link: R(
            "Learn TLA+: why specify at all",
            "https://learntla.com/",
            "You do not need to learn TLA+ now; read the intro and write down what must always be true about your store.",
          ),
        },
        ask: [
          "Why must the log record reach disk before the data page does?",
          "What does recovery do for a transaction that committed but whose pages were never flushed?",
        ],
      },
      {
        t: "Isolation levels and anomalies",
        why: "Learn the bugs that appear when transactions interleave.",
        main: [
          R(
            "PostgreSQL: transaction isolation",
            "https://www.postgresql.org/docs/current/transaction-iso.html",
            "Dirty read, non-repeatable read, phantom, serialization anomaly.",
          ),
          L(
            "Jepsen: consistency models",
            "https://jepsen.io/consistency",
            "The map of every isolation and consistency model.",
          ),
          R(
            "A Critique of ANSI SQL Isolation Levels",
            "https://www.microsoft.com/en-us/research/publication/a-critique-of-ansi-sql-isolation-levels/",
            "The paper that introduced snapshot isolation and write skew.",
          ),
          V("Transactions: myths, surprises and opportunities (Kleppmann)", "5ZjhNTM8XU8", "41 min."),
        ],
        build: [
          "Run Postgres in Docker. Open two psql sessions.",
          "Reproduce a non-repeatable read, a lost update and write skew. Write the exact interleaving for each.",
          "Rerun each at SERIALIZABLE and record what the database does differently.",
        ],
        ship: "db/anomalies.md with the interleavings and results.",
        swe: {
          t: "Reproduce before you fix",
          link: R(
            "Julia Evans: debugging",
            "https://jvns.ca/blog/2022/12/07/tips-for-analyzing-logs/",
            "Methods for analysing evidence.",
          ),
        },
        ask: [
          "Which anomaly does snapshot isolation allow that serializable does not?",
          "Why do real databases default to something weaker than serializable?",
        ],
      },
      {
        t: "MVCC and locking",
        why: "Two ways to isolate transactions, and the cost of each.",
        main: [
          V(
            "#20 - MVCC: Multi-Version Concurrency Control (CMU Intro to Database Systems)",
            "tUFha9-DuSk",
            "Andy Pavlo.",
          ),
          V(
            "#17 - Two-Phase Locking Concurrency Control (CMU Intro to Database Systems)",
            "bXpkEt5P_Js",
            "Andy Pavlo.",
          ),
          R(
            "PostgreSQL: MVCC introduction",
            "https://www.postgresql.org/docs/current/mvcc-intro.html",
            "How Postgres does it.",
          ),
        ],
        build: [
          "Store versions per key with begin and end timestamps.",
          "Implement begin, read, write and commit with snapshot reads.",
          "Detect write-write conflicts at commit (first-committer-wins).",
        ],
        ship: "db/kv v3 with transaction tests, including two concurrent writers.",
        swe: {
          t: "Property-based testing",
          link: R(
            "Hypothesis: property-based testing",
            "https://hypothesis.readthedocs.io/en/latest/",
            "Generate random transaction histories and check invariants.",
          ),
        },
        ask: [
          "In MVCC, who cleans up old versions and when is it safe?",
          "What does a reader do under 2PL that it does not need to do under MVCC?",
        ],
      },
      {
        t: "Query planning and crash testing",
        why: "Understand why queries are slow, then prove your store survives crashes.",
        main: [
          R(
            "PostgreSQL: using EXPLAIN",
            "https://www.postgresql.org/docs/current/using-explain.html",
            "Read plans bottom-up.",
          ),
          V("Database Indexing Explained (with PostgreSQL)", "-qNSXK7s7_w", "Hussein Nasser."),
          L("PG Exercises", "https://pgexercises.com/", "Practice joins, aggregates and window functions."),
        ],
        build: [
          "Load 1M rows into Postgres. Run EXPLAIN ANALYZE before and after adding an index. Explain the plan change.",
          "Write a crash test: a loop that writes while another process randomly `kill -9`s yours, then verifies invariants on restart.",
          "Fix every bug it finds.",
        ],
        ship: "db/crash-test and weekly/week-08.md.",
        swe: {
          t: "Chaos on purpose",
          link: R(
            "Jepsen: analyses",
            "https://jepsen.io/analyses",
            "Read one report. Notice how bugs are found.",
          ),
        },
        ask: [
          "How does the planner choose between a sequential scan and an index scan?",
          "What invariant does your crash test check, and what bug did it catch?",
        ],
      },
    ],
  },
);
