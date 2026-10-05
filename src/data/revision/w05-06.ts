import { blank, card, match, mcq, multi, order, py, tf, txt, week } from "./types";

export const W5 = week(5, {
  core: [
    match(
      "Match each identifier to the layer that uses it.",
      [
        ["MAC address", "link"],
        ["IP address", "network (internet)"],
        ["Port number", "transport"],
        ["HTTP header", "application"],
      ],
      "Encapsulation: each layer wraps the one above with its own header, so a frame is [Ethernet][IP][TCP][HTTP...].",
    ),
    order(
      "Order the socket calls a TCP server makes to serve a client.",
      ["socket", "bind", "listen", "accept", "read / write", "close"],
      "In Python, `socket.create_server` covers socket + bind + listen, and `srv.accept()` is accept.",
    ),
    mcq(
      "A client sends two messages with two `sendall` calls. What can a single `recv` on the server return?",
      [
        "Exactly one message, always",
        "Part of a message, or parts of both: TCP is a byte stream with no message boundaries",
        "Nothing until the connection closes",
        "A whole message or an error",
      ],
      1,
      "Protocols on TCP must frame their own messages (length prefix, delimiter).",
    ),
    mcq(
      "What is the limitation of this server?",
      [
        "It leaks file descriptors",
        "It serves only one client at a time because handle blocks the accept loop",
        "It cannot accept connections",
        "It will panic on the first client",
      ],
      1,
      "Start `threading.Thread(target=handle, args=(conn,)).start()` so each connection gets its own thread, or use `asyncio.start_server`, where each connection is a small task and the event loop multiplexes waiting through epoll or kqueue.",
      py`
while True:
    try:
        conn, addr = srv.accept()
    except OSError:
        continue
    handle(conn)
`,
    ),
    blank('`socket.create_server(("127.0.0.1", ___))` asks the OS to pick any free port, which avoids collisions in tests.', [
      "0",
    ]),
    order("Order the TCP three-way handshake.", [
      "Client sends SYN",
      "Server sends SYN+ACK",
      "Client sends ACK",
      "Connection is ESTABLISHED",
    ]),
    blank(
      "The client opens with SYN, seq=1000. The server's SYN+ACK carries ack=___.",
      ["1001"],
      "A SYN consumes one sequence number, so the acknowledgement is x + 1. A FIN also consumes one.",
    ),
    mcq(
      "Which side enters TIME_WAIT, and for how long?",
      [
        "The passive closer, for one RTT",
        "The side that sent the first FIN (active closer), for 2 x MSL",
        "Both sides, for 1 second",
        "The side that crashed",
      ],
      1,
      "It lets the last ACK be retransmitted if it was lost, and lets delayed old segments die before the 4-tuple is reused.",
    ),
    tf("A server that closes many short connections itself will accumulate sockets in TIME_WAIT.", true),
    mcq(
      "The peer's machine loses power with no FIN. Your thread is blocked in `conn.recv`. What happens?",
      [
        "recv returns b\"\" immediately",
        "recv waits indefinitely unless you set a timeout (`settimeout`) or keepalive notices",
        "The OS kills your process",
        "recv returns zero bytes in a loop",
      ],
      1,
      "Nothing arrives. Your writes would be retransmitted with backoff for minutes. Always set timeouts.",
    ),
    card(
      "What is a TCP half-close and how do you do one in Python?",
      "One side says 'I am done sending' by sending a FIN but can still read. In Python: `sock.shutdown(socket.SHUT_WR)`.",
    ),
    multi(
      "Which does TCP provide on top of IP?",
      [
        "Ordered delivery",
        "Flow control with a receive window",
        "Message boundaries",
        "Retransmission of lost data",
      ],
      [0, 1, 3],
      "Boundaries are what UDP preserves and TCP does not.",
    ),
    mcq(
      "Which header is required in every HTTP/1.1 request?",
      ["Accept", "Host", "Content-Type", "Connection"],
      1,
    ),
    mcq(
      "A server sends this body. What does the client decode?",
      ["hello", "hello world", "5hello6 world", "an error: the sizes are wrong"],
      1,
      "Each chunk is a size in hex, CRLF, the data, CRLF. 5 bytes 'hello' then 6 bytes ' world', and the 0 chunk ends the body.",
      txt`
5\r\nhello\r\n6\r\n world\r\n0\r\n\r\n
`,
    ),
    mcq(
      "How does a client know where an HTTP/1.1 response body ends?",
      [
        "It waits for a timeout",
        "Content-Length, or Transfer-Encoding: chunked, or (responses only) the server closes the connection",
        "A null byte",
        "The next header line",
      ],
      1,
      "Disagreement between a proxy and a server about length is how request smuggling works.",
    ),
    match(
      "Match each method to its properties.",
      [
        ["GET", "safe and idempotent"],
        ["PUT", "idempotent but not safe"],
        ["DELETE", "idempotent; repeating has the same effect"],
        ["POST", "neither safe nor idempotent"],
      ],
      "Idempotent requests can be retried automatically. POST needs an idempotency key to be retried safely.",
    ),
    match("Match the status code to its meaning.", [
      ["201", "Created"],
      ["204", "No Content"],
      ["304", "Not Modified"],
      ["429", "Too Many Requests"],
      ["502", "Bad Gateway"],
    ]),
    mcq(
      "What is head-of-line blocking on an HTTP/1.1 persistent connection?",
      [
        "A slow response delays every later response on that connection because they are answered in order",
        "The server refuses to answer the first request",
        "Headers are too large",
        "TLS being slow",
      ],
      0,
      "Browsers work around it by opening about 6 connections per host.",
    ),
    order("Order a DNS lookup that misses every cache.", [
      "Stub resolver in the OS asks the recursive resolver",
      "Recursive resolver asks a root server",
      "A TLD server (such as .com) points to the zone's name servers",
      "The authoritative server returns the A record",
      "The recursive resolver caches the answer for its TTL",
    ]),
    match("Match the DNS record type to what it maps.", [
      ["A", "name to IPv4 address"],
      ["AAAA", "name to IPv6 address"],
      ["CNAME", "alias to canonical name"],
      ["MX", "domain to mail servers"],
      ["NS", "zone to name servers"],
    ]),
    blank(
      "A DNS message starts with a fixed ___-byte header.",
      ["12"],
      "ID, flags, then QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT, each 16 bits.",
    ),
    mcq(
      "What does `3www7example3com0` encode?",
      [
        "A hash of the name",
        "The name www.example.com as length-prefixed labels ending in a zero byte",
        "An IPv6 address",
        "A checksum",
      ],
      1,
      "Compression uses a 2-byte pointer whose top two bits are set, referring to an earlier name by offset.",
    ),
    tf(
      "DNS never uses TCP.",
      false,
      "It falls back to TCP when the answer is truncated (the TC bit) and for zone transfers.",
    ),
    mcq(
      "What is the risk in this server?",
      [
        "It will not start",
        "A socket has no timeout by default, so a slow client can hold a connection and its thread open forever (slowloris)",
        "It only supports HTTP/1.0",
        "It leaks the handler",
      ],
      1,
      "Call `conn.settimeout(...)` (or wrap reads in `asyncio.timeout`) for every connection, limit header size and connection count, and give outbound clients a timeout too.",
      py`
srv = socket.create_server(("", 8080))
while True:
    conn, _ = srv.accept()
    threading.Thread(target=serve_http, args=(conn,)).start()   # serve_http never calls conn.settimeout
`,
    ),
    blank("Bound an asyncio block to two seconds with `async with asyncio.___(2):`.", ["timeout"]),
    mcq(
      "What is `socket.socketpair()` useful for?",
      [
        "Connecting to a remote host",
        "Two connected sockets in one process, for testing protocol code without a listening port",
        "Creating a UDP socket",
        "Load balancing",
      ],
      1,
    ),
  ],
  dsa: [
    mcq(
      "To find the k-th element of two sorted arrays, what do you binary search?",
      [
        "The value",
        "How many elements to take from the smaller array, with the rest from the other",
        "The array index of the median",
        "The first array only",
      ],
      1,
      "The partition is right when aL <= bR and bL <= aR; the answer is max(aL, bL).",
    ),
    mcq(
      "In a matrix where every row is sorted and each row starts above the last row's end, how do you search it?",
      [
        "Linear scan",
        "Treat it as a flat array of m*n; mid maps to (mid / n, mid % n)",
        "Sort it first",
        "Search each column",
      ],
      1,
    ),
    mcq(
      "Rows sorted and columns sorted. Searching from the top-right corner, if the current value is bigger than the target you…",
      ["go down", "go left", "stop", "go up"],
      1,
      "Everything below in that column is even bigger, so the column is eliminated. O(m + n).",
    ),
    mcq(
      "What does this print?",
      ["5 5", "6 5", "5 6", "6 6"],
      2,
      "`len(s)` counts code points, so a `str` of 5 characters has length 5. The UTF-8 encoding is 6 bytes because é takes 2, so `len(s.encode())` is 6.",
      py`
s = "héllo"
print(len(s), len(s.encode()))
`,
    ),
    mcq(
      "Longest palindromic substring by expanding around centres runs in…",
      ["O(n) time", "O(n^2) time, O(1) space", "O(n log n) time", "O(2^n) time"],
      1,
      "Try each of the 2n-1 centres (odd and even) and expand outward.",
    ),
    mcq(
      "In the jump game, why do we return false when `i > far`?",
      [
        "The array is finished",
        "Index i cannot be reached by any earlier jump",
        "far overflowed",
        "We should have used a queue",
      ],
      1,
      "far tracks the farthest reachable index so far.",
      py`
far = 0
for i, v in enumerate(a):
    if i > far:
        return False
    far = max(far, i + v)
return True
`,
    ),
    mcq(
      "Fractional knapsack greedy sorts items by…",
      ["weight ascending", "value descending", "value per unit weight, descending", "name"],
      2,
    ),
    tf(
      "Binary search over real numbers uses an epsilon or a fixed iteration count instead of `lo < hi`.",
      true,
    ),
  ],
  eng: [
    mcq(
      "Which is the right way to test an HTTP handler quickly?",
      [
        "Start a real server on port 80 and curl it",
        "Call the handler directly with a test client (for example FastAPI's TestClient or httpx with ASGITransport)",
        "Mock the whole standard library",
        "Only manual testing",
      ],
      1,
    ),
    mcq(
      "A POST that creates a resource should normally respond with…",
      ["200 and an empty body", "201 and a Location header", "302", "204 and a Retry-After"],
      1,
    ),
    mcq(
      "A good README's first priority is…",
      [
        "The complete design history",
        "What it is, then a quick start someone can paste and run in five minutes",
        "A list of contributors",
        "Benchmarks",
      ],
      1,
    ),
    tf(
      "You should set a timeout on every outbound network call and let the deadline shrink down the call chain.",
      true,
    ),
  ],
});

export const W6 = week(6, {
  core: [
    blank("A UDP header is ___ bytes: source port, destination port, length and checksum.", ["8"]),
    match("Match each reliability mechanism to the problem it addresses.", [
      ["Checksum", "corruption"],
      ["Sequence numbers", "duplicates and reordering"],
      ["Retransmission timer", "loss"],
      ["Window", "throughput (several packets in flight)"],
    ]),
    mcq(
      "Why is stop-and-wait so slow on a fast, long link?",
      [
        "ACKs are large",
        "Only one packet is in flight per RTT, so throughput is about packet size / RTT regardless of link speed",
        "It cannot retransmit",
        "Checksums take too long",
      ],
      1,
      "A 1 Gb/s link with 100 ms RTT and 1.5 KB packets manages about 120 kb/s.",
    ),
    blank(
      "A 1 Gb/s link with a 100 ms RTT has a bandwidth-delay product of about ___ MB.",
      ["12.5|12.5mb"],
      "1,000,000,000 bits/s / 8 x 0.1 s = 12.5 million bytes. That much must be in flight to fill the pipe.",
    ),
    blank("RTO = SRTT + ___ x RTTVAR (Jacobson/Karels).", ["4"]),
    mcq(
      "What does Karn's rule say?",
      [
        "Double the RTO on every ACK",
        "Do not take RTT samples from retransmitted packets because the ACK is ambiguous",
        "Always use a fixed RTO",
        "Retransmit three times",
      ],
      1,
    ),
    mcq(
      "What happens if the RTO is set too short?",
      [
        "Real losses are detected faster with no downside",
        "Spurious retransmissions waste bandwidth and add congestion",
        "The connection closes",
        "Nothing, RTO is irrelevant",
      ],
      1,
    ),
    match("Match the sliding-window scheme to how it handles one lost packet.", [
      ["Go-Back-N", "resends from the lost packet onward"],
      ["Selective Repeat", "resends only the lost packet"],
      ["TCP fast retransmit", "resends after 3 duplicate ACKs"],
    ]),
    mcq(
      "What does a cumulative `ACK(n)` mean?",
      [
        "Packet n was received and nothing else",
        "Everything below n has been received, so the window base slides to n",
        "Packet n was lost",
        "Resend n",
      ],
      1,
    ),
    mcq(
      "How many bytes may a TCP sender have in flight?",
      ["rwnd", "cwnd", "min(cwnd, rwnd)", "max(cwnd, rwnd)"],
      2,
      "rwnd protects the receiver (flow control). cwnd protects the network (congestion control).",
    ),
    order(
      "Order the life of a Reno-style congestion window after a connection starts and then meets a loss signalled by 3 duplicate ACKs.",
      [
        "Slow start: cwnd doubles each RTT",
        "cwnd reaches ssthresh",
        "Congestion avoidance: +1 MSS per RTT",
        "3 duplicate ACKs: ssthresh = cwnd / 2",
        "Fast recovery continues at cwnd = ssthresh",
      ],
    ),
    mcq(
      "On a retransmission timeout (not 3 dup ACKs), Reno sets cwnd to…",
      ["cwnd / 2", "1 MSS and returns to slow start", "unchanged", "rwnd"],
      1,
    ),
    mcq(
      "Why does AIMD halve on loss but grow slowly?",
      [
        "It is arbitrary",
        "Overshooting overflows queues and is costly, under-using is merely slow; AIMD also converges to a fair share",
        "Because ACKs are rare",
        "To match TCP checksums",
      ],
      1,
    ),
    mcq(
      "What causes bufferbloat?",
      [
        "Tiny buffers",
        "Oversized router buffers with loss-based congestion control, so queues stay full and add hundreds of ms of delay",
        "Slow DNS",
        "Large MTU",
      ],
      1,
      "Fixes: smaller buffers, active queue management (CoDel, fq_codel), BBR.",
    ),
    mcq(
      "Which congestion controller models bandwidth and RTT instead of reacting to loss?",
      ["Reno", "CUBIC", "BBR", "Tahoe"],
      2,
    ),
    multi(
      "What does TLS give you?",
      ["Confidentiality", "Integrity", "Authentication of the server", "Protection against SQL injection"],
      [0, 1, 2],
      "TLS protects data in transit. Injection arrives as an ordinary encrypted request.",
    ),
    match("Match the cryptography to its role in TLS.", [
      ["ECDHE key exchange", "agree on a shared secret (with forward secrecy)"],
      ["Certificate signature chain", "binds a public key to a domain name"],
      ["CertificateVerify", "server proves it holds the private key"],
      ["AES-GCM / ChaCha20-Poly1305", "fast symmetric encryption of application data"],
    ]),
    mcq(
      "How many round trips does a full TLS 1.3 handshake need?",
      ["0", "1", "2", "3"],
      1,
      "TLS 1.2 needed 2. TLS 1.3 also removed weak ciphers and RSA key transport.",
    ),
    mcq(
      "What does forward secrecy protect against?",
      [
        "Phishing",
        "Decryption of recorded past traffic after the server's long-term private key is later stolen",
        "Packet loss",
        "Replay attacks only",
      ],
      1,
      "Each session uses ephemeral keys that are discarded, so the long-term key cannot decrypt old sessions.",
    ),
    multi(
      "Which checks does a client make when verifying a server certificate?",
      [
        "The signature chain leads to a root in its trust store",
        "The validity dates",
        "The hostname matches a Subject Alternative Name",
        "That the website's owner is trustworthy",
      ],
      [0, 1, 2],
      "A certificate only says a CA validated control of the name. Certificate Transparency logs make mis-issuance detectable.",
    ),
    mcq(
      "What is the problem with this client configuration in production?",
      [
        "MinVersion is too high",
        "`check_hostname = False` with `verify_mode = ssl.CERT_NONE` disables certificate verification, so anyone can impersonate the server",
        "It cannot speak TLS 1.3",
        "Nothing",
      ],
      1,
      "Never ship verify=False or CERT_NONE. `ssl.create_default_context()` verifies the chain and the hostname by default.",
      py`
ctx = ssl.create_default_context()
ctx.minimum_version = ssl.TLSVersion.TLSv1_2
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
`,
    ),
    mcq(
      "What is wrong with this query, and what is the fix?",
      [
        "Nothing wrong",
        "SQL injection: build the string safely with a placeholder, e.g. `cur.execute('... WHERE email = ?', (email,))`",
        "It is slow: add an index",
        "It should use SELECT 1",
      ],
      1,
      "Parameterised queries keep data from being parsed as SQL.",
      py`
q = f"SELECT * FROM users WHERE email = '{email}'"
rows = cur.execute(q).fetchall()
`,
    ),
    match("Match the OWASP category to an example.", [
      ["Broken access control", "changing /orders/42 to /orders/43 shows another user's order"],
      ["Cryptographic failures", "passwords hashed with MD5"],
      ["Injection", "' OR 1=1 -- in a login form"],
      ["SSRF", "server fetches an attacker-supplied URL such as the cloud metadata address"],
      ["Security misconfiguration", "default credentials and verbose errors"],
    ]),
    mcq(
      "Which is an appropriate way to store passwords?",
      [
        "SHA-256 of the password",
        "Plain text with a firewall",
        "A slow, salted, memory-hard hash such as argon2id, compared in constant time",
        "Base64",
      ],
      2,
    ),
    mcq(
      "What does HTTP/2 add over HTTP/1.1?",
      [
        "Text framing",
        "Binary framing, multiplexed streams on one connection and HPACK header compression",
        "UDP transport",
        "Cookies",
      ],
      1,
      "TCP-level head-of-line blocking remains; HTTP/3 moves to QUIC over UDP to fix that.",
    ),
    mcq(
      "Where does an L7 load balancer differ from an L4 one?",
      [
        "It understands HTTP, so it can route by path or header and terminate TLS",
        "It is slower because it cannot read packets",
        "It balances only UDP",
        "It has no health checks",
      ],
      0,
    ),
    mcq(
      "Which load-balancing health approach handles a backend that is slow but not down?",
      [
        "Ignoring latency",
        "Treat latency above a threshold as failure, with timeouts, retries only for idempotent requests and circuit breakers",
        "Retry every request three times",
        "Remove all backends",
      ],
      1,
    ),
  ],
  dsa: [
    mcq(
      "To maximise the number of non-overlapping meetings, sort by…",
      ["start time", "end time", "duration descending", "alphabet"],
      1,
      "Finishing earliest leaves the most room (an exchange argument).",
    ),
    mcq(
      "What does merging `[[1,3],[2,6],[8,10]]` give?",
      ["[[1,3],[2,6],[8,10]]", "[[1,6],[8,10]]", "[[1,10]]", "[[2,3],[8,10]]"],
      1,
      "Sorted by start, extend the last interval while the next start <= its end.",
      py`
iv.sort(key=lambda x: x[0])
out = [iv[0]]
for x in iv[1:]:
    last = out[-1]
    if x[0] <= last[1]:
        last[1] = max(last[1], x[1])
    else:
        out.append(x)
`,
    ),
    mcq(
      "Minimum platforms with arrivals 900, 940, 950, 1100, 1500, 1800 and departures 910, 1200, 1120, 1130, 1900, 2000?",
      ["2", "3", "4", "6"],
      1,
      "Sort both lists and sweep: arrival = +1, departure = -1. The peak at 1100 has 3 trains in the station.",
    ),
    mcq(
      "Candy: ratings are [1, 0, 2]. What is the minimum total candy?",
      ["3", "4", "5", "6"],
      2,
      "A left-to-right pass and a right-to-left pass give [2, 1, 2] = 5.",
    ),
    mcq(
      "Jump Game II on `[2,3,1,1,4]`: the minimum number of jumps is…",
      ["1", "2", "3", "4"],
      1,
      "Jump to index 1 (value 3), then reach the end. It is BFS by levels without a queue.",
    ),
    mcq(
      "What is the longest substring without repeating characters in `abcabcbb`?",
      ["2", "3", "4", "5"],
      1,
      "`abc`. A sliding window moves its left edge past the previous occurrence of a repeated character.",
    ),
    blank(
      "In the sliding-window template, we ___ the window from the left while it is invalid.",
      ["shrink|move|advance"],
      "Each index enters and leaves once, so the whole thing is O(n).",
    ),
    mcq(
      "How do you count subarrays with exactly K distinct values using the window technique?",
      ["One pass with a set", "atMost(K) - atMost(K - 1)", "Sort and binary search", "Two nested loops only"],
      1,
    ),
    mcq(
      "'Maximum points from cards' (take k from the two ends) is solved by finding…",
      [
        "The max window of size k at the ends",
        "The minimum-sum window of size n - k in the middle, and subtracting it from the total",
        "The median",
        "A prefix XOR",
      ],
      1,
    ),
    mcq(
      "In 'minimum window substring', when does the window shrink?",
      [
        "Always",
        "While `missing == 0`, i.e. every needed character is covered",
        "Only at the end",
        "When the window exceeds length k",
      ],
      1,
    ),
  ],
  eng: [
    multi(
      "Which are good practices when benchmarking?",
      [
        "Run several times and compare with benchstat",
        "Keep the result alive so the compiler cannot remove the work",
        "Use a single run to save time",
        "Vary the input size to see a curve",
      ],
      [0, 1, 3],
    ),
    mcq(
      "A secret was committed to git by mistake. What should you do first?",
      [
        "Delete the commit and carry on",
        "Treat it as leaked: revoke and rotate it",
        "Make the repo private",
        "Rename the file",
      ],
      1,
      "History and clones may already hold it.",
    ),
    card(
      "Name the four questions of threat modelling.",
      "What are we building? What can go wrong (STRIDE)? What are we going to do about it? Did we do a good job? Do it at design time, when changes are cheap.",
    ),
    mcq(
      "Why print the seed when a test uses a random fault injector?",
      [
        "To impress reviewers",
        "So a failing run can be replayed exactly",
        "pytest requires it",
        "To avoid logging",
      ],
      1,
    ),
  ],
});
