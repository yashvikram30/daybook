WEEKS.push(
  {
    n: 5,
    phase: "net",
    title: "Sockets, TCP, HTTP and DNS",
    summary:
      "Systems programming in Python: the layers from Ethernet up, sockets, TCP, an HTTP server, then IP addressing, routing and a DNS client.",
    project: "An HTTP/1.1 server on raw TCP, a subnet calculator and routing simulator, and a mini `dig` over UDP.",
    days: [
      {
        t: "Python for systems and the network layers",
        why: "You have written Python since day one. Today you use its socket module and learn the stack your bytes travel through, from the Ethernet frame up to the port.",
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
          V(
            "Layering in computer networks (Neso Academy)",
            "FewtLNsjtRA",
            "Neso Academy, Computer Networks series. Watch at 1.5x. Why the stack is layered, and what encapsulation means.",
          ),
          V(
            "The TCP/IP protocol suite (Neso Academy)",
            "wvPe4Zb0tUA",
            "The four layers you will actually use, against the seven-layer OSI model.",
          ),
          V(
            "Switching techniques (Neso Academy)",
            "-HlJ4psu5aU",
            "Circuit switching versus packet switching, datagrams versus virtual circuits.",
          ),
          V(
            "Ethernet (Neso Academy)",
            "MzhiVE6OuQA",
            "The link layer in practice: frame format, MAC addresses, minimum frame size.",
          ),
          V(
            "CSMA and CSMA/CD (Neso Academy)",
            "MAZi6VoekYw",
            "How a shared medium avoids and detects collisions. Backoff is the interesting part.",
          ),
          V(
            "ARP: address resolution (Gate Smashers)",
            "IUSyV2BVh4A",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). How an IP address becomes a MAC address on the local link.",
          ),
          V(
            "Hubs, switches and routers (Neso Academy)",
            "0pMm_QxCg3I",
            "Which layer each device works at, and what a collision domain is.",
          ),

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
          "Take one captured packet as hex and parse it by hand with `struct`: Ethernet header (destination MAC, source MAC, type), IPv4 header, TCP header. Print each field and say which layer added it.",
          "Run `arp -a`, then ping a neighbour and run it again. Explain what appeared and why.",
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
          "What does a switch know that a hub does not, and why does CSMA/CD back off for a random time after a collision?",
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
          V(
            "TCP header and fields (Gate Smashers)",
            "c8aet11HNxg",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). Watch at 1.5x. Sequence and acknowledgement numbers, flags, window size.",
          ),
          V(
            "TCP connection establishment and termination (Gate Smashers)",
            "qIEHUUt2Wfc",
            "Draw the handshake and the four-segment close yourself.",
          ),
          V(
            "TCP versus UDP (Gate Smashers)",
            "jJyXpMmXJI0",
            "When each is the right choice.",
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
          "Capture a handshake with tcpdump, save the TCP header bytes, and decode sequence number, acknowledgement number, flags and window with `struct`. Check them against the tcpdump output.",
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
          V(
            "Persistent versus non-persistent HTTP (Gate Smashers)",
            "zRUdSu3JlK8",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). HTTP/1.0 against HTTP/1.1, and what keep-alive saves in round trips.",
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
        t: "IP addressing, routing, DNS and UDP",
        why: "Every packet needs an address and a route, and name resolution comes before both. Learn IPv4, subnetting, the two routing algorithms and DNS.",
        main: [
          V(
            "IPv4 addressing, parts 1 and 2 (Neso Academy)",
            "phOlq9SuscM",
            "Neso Academy, Computer Networks series. Watch at 1.5x; part 2 is m_iCPlVzN_o in the same playlist. Dotted decimal, network and host parts, classes.",
          ),
          V(
            "Classless addressing: CIDR (Gate Smashers)",
            "N-ywmOpWehE",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). Prefix lengths and why classful addressing ran out.",
          ),
          V(
            "Subnetting in CIDR (Gate Smashers)",
            "wvvoT-dpr8o",
            "Work the example before the video does: network ID, broadcast address and host range.",
          ),
          V(
            "Fragmentation and the IPv4 header (Gate Smashers)",
            "k8VgrqDOIUo",
            "MTU, identification, flags and fragment offset.",
          ),
          V(
            "Distance vector routing (Gate Smashers)",
            "5ZuP5qjbKSI",
            "The Bellman-Ford idea, routers exchanging tables with neighbours.",
          ),
          V(
            "Count to infinity (Gate Smashers)",
            "UYASPR4jEkk",
            "The failure of distance vector, and split horizon.",
          ),
          V(
            "Link state routing (Gate Smashers)",
            "kW6zV-040SY",
            "Every router floods its links, then runs Dijkstra.",
          ),
          V(
            "NAT (Gate Smashers)",
            "47PUj7OSGkA",
            "Why your laptop shares one public address.",
          ),
          V(
            "DNS and its server types (Gate Smashers)",
            "BZISxpdl4lQ",
            "Record types and the resolver hierarchy.",
          ),
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
          "Use the `ipaddress` module to write a subnet calculator: given `192.168.10.0/26`, print the network address, broadcast address, mask and usable hosts, and split a /24 into four equal subnets. Add a VLSM split for hosts of 100, 50 and 20.",
          "Simulate routing on a small graph: a distance-vector version (rounds of table exchange) and a link-state version (Dijkstra at every node). Break a link and reproduce count-to-infinity, then add split horizon.",
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
          "How many usable hosts does a /26 hold? How do distance-vector and link-state routing differ in what each router knows and how it learns it?",
          "Why does an IPv4 datagram get fragmented, and who reassembles it?",
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
      "Build reliability on top of UDP (error detection, stop-and-wait, Go-Back-N, selective repeat, congestion control), then secure a connection with TLS and learn the basics of attacking and defending a web service.",
    project:
      "A reliable-delivery protocol over lossy UDP, and your HTTP server behind TLS and a load balancer.",
    days: [
      {
        t: "Reliability over UDP",
        why: "Build the ideas TCP uses: sequence numbers, acks, retransmission.",
        main: [
          V("Network Basics - Transport Layer and UDP Explained - Computerphile", "ihvbhwGblQg", "15 min."),
          V(
            "Stop-and-wait ARQ (Neso Academy)",
            "YdkksvhkQGQ",
            "Neso Academy, Computer Networks series. Watch at 1.5x. Acknowledgements, timeouts and lost frames.",
          ),
          V(
            "Bandwidth-delay product (Neso Academy)",
            "vPCKWhXSAEo",
            "Why stop-and-wait wastes a long, fat link.",
          ),
          V(
            "Checksum (Neso Academy)",
            "AtVWnyDDaDI",
            "The Internet checksum: sum in ones' complement, then invert.",
          ),
          V(
            "Cyclic redundancy check (Neso Academy)",
            "A9g6rTMblz4",
            "Polynomial division over bits. Part 2 is wQGwfBS3gpk in the same playlist.",
          ),
          V(
            "Hamming code (Gate Smashers)",
            "V5Iu52tbZEQ",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). Detecting and correcting a single-bit error.",
          ),
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
          "Add an integrity check to every packet. Write the Internet checksum by hand, then use `zlib.crc32`, and flip one bit in transit to show both catch it. Implement Hamming(7,4) and correct a single-bit error.",
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
          "What does a CRC catch that a simple checksum can miss? What can parity not detect?",
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
          V(
            "Sliding window protocol (Neso Academy)",
            "LnbvhoxHn8M",
            "Neso Academy, Computer Networks series. Window size and the sender and receiver windows.",
          ),
          V(
            "Go-Back-N ARQ (Neso Academy)",
            "QD3oCelHJ20",
            "Cumulative acknowledgements, and everything after a loss being resent.",
          ),
          V(
            "Selective repeat ARQ (Neso Academy)",
            "WfIhQ3o2xow",
            "The receiver buffers out-of-order frames, so only the lost one is resent.",
          ),
          V(
            "TCP congestion control (Gate Smashers)",
            "0bc_T_pEZmo",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). Slow start, congestion avoidance and fast retransmit in one summary.",
          ),

        ],
        build: [
          "Upgrade rudp to a sliding window. Implement it twice, as Go-Back-N with cumulative ACKs and as selective repeat with a receiver buffer, and compare retransmissions and throughput at 1%, 5% and 10% loss.",
          "Check the efficiency formula: for window N, link rate and RTT, predict utilisation, then measure it.",
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
          "When does Go-Back-N waste more than selective repeat, and why must the window be at most half the sequence space for selective repeat?",
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
          V(
            "Symmetric key cryptography (Gate Smashers)",
            "6AmmQiOWoXM",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). Block ciphers and shared secrets. TLS uses this for the bulk of the data.",
          ),
          V(
            "Asymmetric key cryptography (Gate Smashers)",
            "xw19eT5thIE",
            "Public and private keys, and why TLS needs both kinds.",
          ),
          V(
            "The RSA algorithm (Gate Smashers)",
            "VUxfDCmWM0U",
            "Key generation and a worked example.",
          ),
          D(
            "ssl: TLS/SSL wrapper for sockets",
            "https://docs.python.org/3/library/ssl.html",
            "SSLContext, load_cert_chain and wrap_socket.",
          ),
          L("mkcert", "https://github.com/FiloSottile/mkcert", "Local trusted certificates."),
        ],
        build: [
          "Implement toy RSA with Python integers (`pow(m, e, n)` and `pow(c, d, n)`) using small primes. Encrypt and decrypt a number, then explain why real systems use padding and why TLS uses RSA or Diffie-Hellman only to agree on a symmetric key.",
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
          V(
            "Firewalls: packet filtering (Gate Smashers)",
            "o_vyfo3Hw0Y",
            "Gate Smashers, Computer Networks playlist (mixes Hindi and English). What a packet filter looks at, and how an application proxy differs.",
          ),
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
          V("Introduction to Database Management Systems (Neso Academy)", "OMwgGL3lHlI", "10 min. What a DBMS is for. Start here if you have never used a database."),
          V("Introduction to Relational Databases (Neso Academy)", "WI9dE8-TFAc", "12 min. Tables, rows, keys."),
          V("SQL Tutorial - Full Database Course for Beginners (freeCodeCamp)", "HXV3zeQKqGY", "4h20 in full. Watch tables, keys, SELECT, joins and aggregates (about the first 90 minutes) at 1.5x. Skip the rest."),
          V("Lec-33: All Normal Forms with Real life examples (Gate Smashers)", "EGEwkad_llA", "11 min, Hindi and English mixed. 1NF to BCNF: why tables are split. Know it; you will not build it."),
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
          V("#04 - Memory Management & Buffer Pools (CMU Intro to Database Systems)", "8-2yv4z0VZc", "Pavlo, 80 min. Page replacement again (LRU, clock), as in week 2, but now with dirty pages and pinning."),
        ],
        build: [
          "Create a SQLite database, insert rows, and inspect with `sqlite3 .dbinfo` and `xxd`.",
          "Design a slotted page: header, slot array, tuple data growing from the end.",
          "Implement it in Python over a `bytearray` with `struct`, with insert, get and delete, and a fixed 4 KB page size.",
        ],
        ship: "db/page/ with tests.",
        swe: { t: "SQL fluency", link: L("SQLBolt", "https://sqlbolt.com/", "Do lessons 1 to 12 today (SELECT, filtering, joins, aggregates). Finish the rest this week.") },
        ask: [
          "Why do databases use fixed-size pages instead of byte-addressable files?",
          "What does the buffer pool decide, and what policy would you use to evict?",
          "What does a primary key guarantee, and what does an index add on top of it?",
        ],
      },
      {
        t: "Indexes: B-trees and LSM trees",
        why: "Two ways to find a key fast on disk, each with a different cost.",
        main: [
          V("Lec-107: Why Indexing is used (Gate Smashers)", "E--yzX05_k8", "10 min, Hindi and English mixed. The idea of an index before the tree."),
          V("10.2 B Trees and B+ Trees. How they are useful in Databases (Abdul Bari)", "aZjYr87r1b8", "40 min, English. Insert and split by hand. Do the examples with pencil and paper."),
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
            "You will use it again in week 8, day 4.",
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
          V("#07 - Database Hash Tables (CMU Intro to Database Systems)", "nuNW8IfgPNU", "Pavlo, 80 min. Static and dynamic hashing: the family your in-memory index belongs to. Skim."),
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
    summary:
      "What a database actually promises (ACID, serializability, locking, MVCC and recovery), and what it costs to keep the promise. Ends with join algorithms and query plans.",
    project:
      "Add a write-ahead log and snapshot-isolated transactions to your KV store, then try to break it with crashes.",
    days: [
      {
        t: "Transactions, ACID and the write-ahead log",
        why: "Atomicity and durability come from one trick: write the intent down first.",
        main: [
          V("ACID Properties in Databases With Examples (ByteByteGo)", "GAe5oB742dw", "5 min. The four words in one picture."),
          V("Lec-88: ACID Properties of a Transaction (Gate Smashers)", "-GS0OxFJsYQ", "14 min, Hindi and English mixed. Worked examples."),
          V("Write-Ahead Logs. The secret to fast database queries. (Ben Dicken)", "s3hKYMOpp3E", "11 min. Why the log is written before the data."),
          V(
            "#21 - Database Recovery with ARIES (CMU Intro to Database Systems)",
            "yVpzHdAP0TY",
            "Andy Pavlo, 80 min. The advanced one: watch it after the three videos above, and skim the three phases (analysis, redo, undo) if they feel like too much.",
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
          V("Redo, Undo and WAL logs (Hussein Nasser)", "uHvR7nOu5m4", "41 min. Optional: the ideas behind ARIES's redo and undo, from the practical side."),
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
          "What do the analysis, redo and undo phases of recovery each do?",
        ],
      },
      {
        t: "Isolation levels and anomalies",
        why: "Learn the bugs that appear when transactions interleave.",
        main: [
          V("What is Docker? Docker container concept explained (TechWorld with Nana)", "jPdIRX6q4jA", "11 min. Needed today: Postgres runs in a container. Then `docker run` the official image: see the Postgres link below."),
          D("Postgres official Docker image", "https://hub.docker.com/_/postgres", "Run it with POSTGRES_PASSWORD and a published port, then connect with `psql`."),
          V("Lec-96: Introduction to Serializability (Gate Smashers)", "s8QlJoL1G6w", "9 min, Hindi and English mixed. Schedules and why serial order is the reference."),
          V("Lec-98: Conflict Serializability | Precedence Graph (Gate Smashers)", "zv0ba0Iok1Y", "12 min. The algorithm: draw the graph, look for a cycle."),
          V("Serializable vs Repeatable Read Isolation Level (Hussein Nasser)", "KoULlXKK1H8", "8 min. The same idea in Postgres terms."),
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
          V("Lec-94: Irrecoverable Vs Recoverable Schedules (Gate Smashers)", "g2gZKA8E1yA", "6 min. Optional: why a commit order can make a schedule unsafe."),
        ],
        build: [
          "Run Postgres in Docker. Open two psql sessions.",
          "Reproduce a non-repeatable read, a lost update and write skew. Write the exact interleaving for each.",
          "Rerun each at SERIALIZABLE and record what the database does differently.",
          "By hand, draw the precedence graph for three small schedules and decide which are conflict serializable. Then write a short Python function that builds the graph from a schedule and finds a cycle.",
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
          "How do you tell from a precedence graph whether a schedule is conflict serializable?",
        ],
      },
      {
        t: "MVCC and locking",
        why: "Two ways to isolate transactions, and the cost of each.",
        main: [
          V("Lec-102: 2 Phase Locking (2PL) Protocol (Gate Smashers)", "1pUaEDNLWi4", "10 min, Hindi and English mixed. Growing and shrinking phases."),
          V("Lec-104: Strict 2PL, Rigorous 2PL and Conservative 2PL (Gate Smashers)", "z8Yqn91akV8", "12 min. What strict adds and why deadlock is still possible."),
          V("Pessimistic vs Optimistic concurrency control (Hussein Nasser)", "I8IlO0hCSgY", "16 min. Locks versus validate-at-commit."),
          V("Lec-105: Basic Timestamp Ordering Protocol (Gate Smashers)", "27NtGV1vNoY", "15 min. The third family: order by timestamps, abort the latecomer."),
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
          V("#19 - Timestamp Ordering Concurrency Control (CMU Intro to Database Systems)", "risHwKeWbBM", "Pavlo, 85 min. Optional: timestamp ordering and optimistic validation in full."),
        ],
        build: [
          "Store versions per key with begin and end timestamps.",
          "Implement begin, read, write and commit with snapshot reads.",
          "Detect write-write conflicts at commit (first-committer-wins).",
          "Add a lock-based variant: strict two-phase locking with a lock table and a wait-for-graph deadlock check (reuse the detector from week 4). Compare its behaviour with your MVCC version under the same workload.",
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
          "Why does strict 2PL avoid cascading aborts?",
          "What does timestamp ordering do to a transaction that arrives too late?",
        ],
      },
      {
        t: "Query planning and crash testing",
        why: "Understand why queries are slow, then prove your store survives crashes.",
        main: [
          V("Lec-43: Introduction to Joins and its types (Gate Smashers)", "zYH-e6tUYbw", "11 min, Hindi and English mixed. What a join means, before how it is computed."),
          R(
            "PostgreSQL: using EXPLAIN",
            "https://www.postgresql.org/docs/current/using-explain.html",
            "Read plans bottom-up.",
          ),
          V("Database Indexing Explained (with PostgreSQL)", "-qNSXK7s7_w", "Hussein Nasser."),
          L("PG Exercises", "https://pgexercises.com/", "Practice joins, aggregates and window functions."),
          V("#12 - Join Algorithms: Hash, Sort-Merge, Nested Loop Joins (CMU Intro to Database Systems)", "MFazkaZKs1s", "Pavlo, 74 min. The algorithms behind the plan nodes you see in EXPLAIN."),
          V("#15 - Query Planning & Optimization (CMU Intro to Database Systems)", "X8EHO8VLeG0", "Pavlo, 81 min. Watch the first half: cost models and join ordering."),
        ],
        build: [
          "Load 1M rows into Postgres. Run EXPLAIN ANALYZE before and after adding an index. Explain the plan change.",
          "Write a crash test: a loop that writes while another process randomly `kill -9`s yours, then verifies invariants on restart.",
          "Fix every bug it finds.",
          "Implement nested-loop, hash and sort-merge joins over two lists of tuples in Python. Count comparisons for several sizes and match each result with the plan Postgres chooses for the same join.",
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
          "When is a hash join better than a nested-loop join, and when does sort-merge win?",
        ],
      },
    ],
  },
);
