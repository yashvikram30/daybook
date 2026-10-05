// The optional fifth day of every week: a revision lab. Each week has hands-on exercises tied to that
// week's project. The page adds retrieval cards and problem revisits on top, built from what you have done.

export type ExerciseKind = "code" | "debug" | "measure" | "explain" | "design";

export type LabExercise = {
  kind: ExerciseKind;
  title: string;
  prompt: string;
  minutes: number;
};

export type WeekLab = {
  week: number;
  /** One sentence on what this lab is for. */
  focus: string;
  exercises: LabExercise[];
};

export const KIND_LABEL: Record<ExerciseKind, string> = {
  code: "Write code",
  debug: "Break and fix",
  measure: "Measure",
  explain: "Explain from memory",
  design: "Design on paper",
};

export const LABS: WeekLab[] = [
  {
    week: 1,
    focus:
      "Make the machine visible: read what the compiler produced and prove what you think the stack looks like.",
    exercises: [
      {
        kind: "code",
        title: "Build the same function with and without optimisation",
        prompt:
          "Write swap, a string length and a loop that sums a list in Python. Disassemble each with dis, once cold and once after a few thousand calls with adaptive=True, and read the bytecode side by side. Write down three things the interpreter specialised or changed, then explain why the same source can run faster the second time.",
        minutes: 30,
      },
      {
        kind: "debug",
        title: "Write past the end",
        prompt:
          "Write an off-by-one write to a list in Python and note exactly what the interpreter reports. Then do the same on a `bytearray` with a slice assignment and with `ctypes.create_string_buffer`, and explain which of the three the interpreter stops, which it lets through, and why.",
        minutes: 25,
      },
      {
        kind: "explain",
        title: "Draw a stack frame, then check it in a debugger",
        prompt:
          "From memory, draw the frame of a function with three arguments and two locals right after the prologue. Then stop in pdb, walk the frames with `where` and `up`, and compare with `inspect.stack()` and the registers from your AAPCS64 notes. Fix your drawing where it was wrong.",
        minutes: 25,
      },
      {
        kind: "measure",
        title: "Predict the size of a struct, then shrink it",
        prompt:
          "Predict ctypes.sizeof and each field offset for a ctypes.Structure with a byte, an int64, a byte and an int32. Run it. Reorder the fields to make it smaller and explain padding in one paragraph.",
        minutes: 20,
      },
    ],
  },
  {
    week: 2,
    focus: "Turn the memory hierarchy from a diagram into numbers you measured.",
    exercises: [
      {
        kind: "measure",
        title: "Row-major against column-major",
        prompt:
          "Sum a 4096 by 4096 matrix by rows and by columns. Predict the ratio first, then time both. Explain the result with cache lines and write your prediction error down.",
        minutes: 25,
      },
      {
        kind: "code",
        title: "A direct-mapped cache simulator",
        prompt:
          "Write a cache simulator of about 60 lines that reads an address trace and reports the hit rate. Run a sequential trace and a strided trace and explain the difference.",
        minutes: 40,
      },
      {
        kind: "debug",
        title: "Fail one opcode on purpose",
        prompt:
          "Pick one CHIP-8 opcode from the test ROM suite. Write a unit test for it that fails against a broken version, then fix the emulator and watch it pass.",
        minutes: 30,
      },
      {
        kind: "explain",
        title: "Translate an address through two page-table levels",
        prompt:
          "By hand, split a 32-bit virtual address into two table indexes and a page offset for 4 KB pages. Say what happens on a TLB miss and on a page fault. Do two different addresses.",
        minutes: 20,
      },
    ],
  },
  {
    week: 3,
    focus: "Own the process lifecycle: create, wire up, signal and reap.",
    exercises: [
      {
        kind: "code",
        title: "fork, exec and wait in 30 lines",
        prompt:
          "Write a tiny runner in Python that starts a command with os.fork, os.execvp and os.waitpid. Add output redirection with os.dup2 and show the file receives the output. Then say what subprocess does for you that these raw calls do not.",
        minutes: 30,
      },
      {
        kind: "debug",
        title: "Make a zombie and an orphan",
        prompt:
          "Create one of each on purpose. Find them with ps, say what state each is in, and fix the zombie with wait or a SIGCHLD handler.",
        minutes: 25,
      },
      {
        kind: "design",
        title: "Who gets Ctrl-Z?",
        prompt:
          "Sketch the process groups and the controlling terminal for sleep 100 piped into cat. Say who receives SIGINT and SIGTSTP and why a background job gets neither.",
        minutes: 20,
      },
      {
        kind: "code",
        title: "A three-stage pipeline with no leaked descriptors",
        prompt:
          "Run a | b | c from your shell. Prove with lsof that no process holds a pipe end it does not need. A leaked write end is why a reader hangs forever.",
        minutes: 35,
      },
    ],
  },
  {
    week: 4,
    focus: "See races, deadlocks and fragmentation happen, then fix each one.",
    exercises: [
      {
        kind: "debug",
        title: "Lose updates with eight threads",
        prompt:
          "Increment a shared counter from eight threads and show the lost updates (lower sys.setswitchinterval if you need to). Fix it with a lock, then with one count per thread added at the end, and time all three versions. Use dis to show where the update can be interrupted.",
        minutes: 30,
      },
      {
        kind: "code",
        title: "Deadlock on purpose, then order the locks",
        prompt:
          "Make two threads deadlock with two locks. Find them with faulthandler.dump_traceback_later, fix it with a global lock order, and write a test that fails with a timeout if the deadlock returns.",
        minutes: 30,
      },
      {
        kind: "measure",
        title: "Your malloc against a plain bytes allocation",
        prompt:
          "Run a hundred thousand allocations and frees of mixed sizes on your allocator and on plain `bytes` allocation. Report time and peak memory, and say where your allocator fragments.",
        minutes: 35,
      },
      {
        kind: "explain",
        title: "Safe save by write, fsync and rename",
        prompt:
          "List every point where a crash can happen while saving a file this way, and what is on disk at each point. Say which fsync calls make the final state safe.",
        minutes: 20,
      },
    ],
  },
  {
    week: 5,
    focus: "Trust the wire, not the diagram: break your parsers and read real packets.",
    exercises: [
      {
        kind: "code",
        title: "Ten malformed requests, ten 400s",
        prompt:
          "Feed your HTTP server ten broken requests: no version, huge header, bad line endings, a negative Content-Length. Every one must get a clean error and never a crash or a hang.",
        minutes: 35,
      },
      {
        kind: "explain",
        title: "Label a handshake and a teardown",
        prompt:
          "Capture one connection with tcpdump or Wireshark. Label every flag, sequence number and acknowledgement from SYN to the last FIN, and say who closes first.",
        minutes: 30,
      },
      {
        kind: "code",
        title: "Resolve A, AAAA and MX with your mini dig",
        prompt:
          "Make your resolver handle three record types, name compression pointers and a truncated reply that needs TCP. Compare with dig for five names.",
        minutes: 40,
      },
      {
        kind: "measure",
        title: "What TCP_NODELAY does to small writes",
        prompt:
          "Send a thousand 50-byte writes with and without TCP_NODELAY and time the round trips. Explain the difference with Nagle's algorithm and delayed acknowledgements.",
        minutes: 25,
      },
    ],
  },
  {
    week: 6,
    focus: "Measure reliability and read security failures instead of imagining them.",
    exercises: [
      {
        kind: "measure",
        title: "Throughput against packet loss",
        prompt:
          "Inject 0, 5, 10 and 30 percent loss into your UDP protocol and plot throughput. Say where the curve bends and why.",
        minutes: 35,
      },
      {
        kind: "explain",
        title: "A TLS 1.3 handshake from memory",
        prompt:
          "Write out each message in order, say what is encrypted from which point, and what an attacker on the path can see. Check it against openssl s_client -trace.",
        minutes: 30,
      },
      {
        kind: "debug",
        title: "Break certificate validation three ways",
        prompt:
          "Try an expired certificate, a wrong hostname and an unknown CA. Record the exact error each time and what a careless client would do instead.",
        minutes: 25,
      },
      {
        kind: "design",
        title: "A one-page threat model",
        prompt:
          "List the assets, the attackers and three mitigations you actually built into your server. Say one risk you chose to accept and why.",
        minutes: 25,
      },
    ],
  },
  {
    week: 7,
    focus: "Prove your storage engine keeps its promises when the process dies.",
    exercises: [
      {
        kind: "code",
        title: "Kill it mid-write, reopen, check",
        prompt:
          "Write a loop that stores keys and records each acknowledged one, then kill -9 the process at a random moment. After reopening, assert every acknowledged key is present.",
        minutes: 40,
      },
      {
        kind: "measure",
        title: "Bloom filter: measured against theory",
        prompt:
          "Plot the false-positive rate for 4, 8 and 12 bits per key, measured and from the formula. Say what you would pick for a store that is mostly lookups of missing keys.",
        minutes: 30,
      },
      {
        kind: "explain",
        title: "Trace a Put and a Get through the engine",
        prompt:
          "Draw the path of one write from the memtable to compaction, and the order a read checks each place. Say where a delete tombstone must live until compaction.",
        minutes: 25,
      },
      {
        kind: "code",
        title: "A range scan across memtable and SSTables",
        prompt:
          "Add Scan(start, end) that merges the memtable with every SSTable and hides deleted keys. Test it against a plain sorted map.",
        minutes: 45,
      },
    ],
  },
  {
    week: 8,
    focus: "Make isolation anomalies happen on demand, then test recovery at every byte.",
    exercises: [
      {
        kind: "code",
        title: "Reproduce a lost update and a write skew",
        prompt:
          "Write two transactions that produce each anomaly against your store. Show which isolation level prevents which one, and which one needs more than snapshots.",
        minutes: 40,
      },
      {
        kind: "debug",
        title: "Truncate the log at every offset",
        prompt:
          "Copy a write-ahead log and truncate it at every byte. Recovery must always give a consistent prefix of the committed transactions. Fix whatever breaks.",
        minutes: 40,
      },
      {
        kind: "explain",
        title: "Four anomalies, four schedules",
        prompt:
          "From memory, write a two-transaction schedule for a dirty read, a non-repeatable read, a phantom and a write skew. Name the weakest level that prevents each.",
        minutes: 20,
      },
      {
        kind: "measure",
        title: "Read a real query plan",
        prompt:
          "Run EXPLAIN ANALYZE on a query in Postgres with and without an index. Compare estimated and actual rows and say which number the planner got wrong.",
        minutes: 30,
      },
    ],
  },
  {
    week: 9,
    focus: "Build the failures first, so the protocols have something to survive.",
    exercises: [
      {
        kind: "code",
        title: "A network that drops, delays and reorders",
        prompt:
          "Wrap your transport so each message can be dropped, delayed or reordered by a seeded random choice. Run your replication test at 20 percent loss and show the replicas diverging.",
        minutes: 40,
      },
      {
        kind: "explain",
        title: "Clocks on a timeline",
        prompt:
          "Draw three nodes and five events. Give each a Lamport timestamp and a vector clock. Circle the pairs of events that are concurrent.",
        minutes: 25,
      },
      {
        kind: "debug",
        title: "Force two leaders, then remove the bug",
        prompt:
          "Partition your cluster so both sides believe they lead. Show the conflicting writes, then fix it with term checks and re-run.",
        minutes: 35,
      },
      {
        kind: "design",
        title: "Pick a consistency level per operation",
        prompt:
          "For a bank balance read, a like counter and a username claim, choose linearizable, causal or eventual. Justify each in one sentence and name what breaks otherwise.",
        minutes: 20,
      },
    ],
  },
  {
    week: 10,
    focus: "Attack your replicated log until nothing committed can ever be lost.",
    exercises: [
      {
        kind: "code",
        title: "Kill the leader twenty times",
        prompt:
          "Run writes while a loop kills the current leader. At the end every acknowledged write must be present and every replica must agree. Keep the seed so a failure replays.",
        minutes: 45,
      },
      {
        kind: "explain",
        title: "Why only the current term commits",
        prompt:
          "Work through the Raft paper's figure 8 scenario on paper. Explain why a leader may not count replicas to commit an entry from an old term.",
        minutes: 30,
      },
      {
        kind: "measure",
        title: "Consistent hashing against modulo",
        prompt:
          "Add one node to a ring of five and to a hash mod N scheme. Count how many of 100,000 keys move in each, and add virtual nodes to even the load.",
        minutes: 30,
      },
      {
        kind: "debug",
        title: "Retry without an idempotency key",
        prompt:
          "Make a client retry a write after a timeout and show the double apply. Add an idempotency key and show the second request returns the first result.",
        minutes: 30,
      },
    ],
  },
  {
    week: 11,
    focus: "Practise changing code safely: characterise, refactor, decide and operate.",
    exercises: [
      {
        kind: "code",
        title: "Refactor your worst function under tests",
        prompt:
          "Choose the longest function in your service. Pin its current behaviour with characterisation tests, refactor it into small pieces, and keep the tests green throughout.",
        minutes: 45,
      },
      {
        kind: "measure",
        title: "Mutate five lines and count survivors",
        prompt:
          "Change five lines of your code by hand, such as flipping a comparison. Count how many mutations your tests miss and write tests that catch each.",
        minutes: 30,
      },
      {
        kind: "design",
        title: "An architecture decision record",
        prompt:
          "Write one page on a real decision in your service: the context, what you chose, two alternatives you rejected and what would make you revisit it.",
        minutes: 30,
      },
      {
        kind: "debug",
        title: "Run an incident with only metrics and logs",
        prompt:
          "Break the container in a way you do not reveal to yourself, for example by having a friend or a script do it. Find it using only dashboards and logs, then write the runbook entry.",
        minutes: 40,
      },
    ],
  },
  {
    week: 12,
    focus: "Rebuild the core ML ideas by hand, then catch the classic mistakes.",
    exercises: [
      {
        kind: "code",
        title: "Logistic regression with a checked gradient",
        prompt:
          "Write gradient descent in numpy. Check your analytic gradient against a numerical one on random data. They should agree to about six digits.",
        minutes: 40,
      },
      {
        kind: "debug",
        title: "Leak the test set, watch the score lie",
        prompt:
          "Scale the whole dataset before splitting it. Show the inflated score, then fix the pipeline so the scaler only sees training data.",
        minutes: 25,
      },
      {
        kind: "explain",
        title: "Backpropagation for two layers on paper",
        prompt:
          "Derive every gradient for a two-layer network with a ReLU and a softmax loss. Then confirm each against your autograd engine.",
        minutes: 40,
      },
      {
        kind: "measure",
        title: "A learning curve and a diagnosis",
        prompt:
          "Train on 10, 100, 1,000 and 10,000 examples and plot train and validation error. Say whether you have a bias or a variance problem and what you would try.",
        minutes: 30,
      },
    ],
  },
  {
    week: 13,
    focus: "Look inside the transformer: attention, tokens, adapters and memory.",
    exercises: [
      {
        kind: "code",
        title: "Single-head attention in twenty lines",
        prompt:
          "Write scaled dot-product attention with a causal mask in numpy. Check it against PyTorch on random inputs and say what happens without the scaling.",
        minutes: 35,
      },
      {
        kind: "measure",
        title: "Token counts across kinds of text",
        prompt:
          "Count tokens for the same idea in English, source code and another language with your tokenizer and a production one. Explain why the counts differ and what that costs.",
        minutes: 25,
      },
      {
        kind: "debug",
        title: "LoRA at rank 1, 8 and 32",
        prompt:
          "Fine-tune the same model at three ranks. Compare final loss, trainable parameters and memory, and say where more rank stopped helping.",
        minutes: 45,
      },
      {
        kind: "explain",
        title: "Size a KV cache from first principles",
        prompt:
          "Estimate the KV cache for a 7B model at 8k context and batch 8 from layers, heads and dimensions. Check the figure against a published one.",
        minutes: 25,
      },
    ],
  },
  {
    week: 14,
    focus: "Treat LLM calls like any unreliable dependency: validate, attack, measure and cancel.",
    exercises: [
      {
        kind: "code",
        title: "Extraction that validates and retries",
        prompt:
          "Run your typed extractor on ten messy inputs. Report how many pass the schema first time, after retries, and never. Look at the failures, not the average.",
        minutes: 35,
      },
      {
        kind: "debug",
        title: "Inject a prompt into your own agent",
        prompt:
          "Write an input that makes your agent call the wrong tool. Add a defence, then try five rewordings. Report which ones still get through.",
        minutes: 35,
      },
      {
        kind: "measure",
        title: "Two models, one eval set",
        prompt:
          "Run the same evaluation on two models. Tabulate accuracy, p50 and p95 latency and cost per thousand requests, and say which you would ship and why.",
        minutes: 30,
      },
      {
        kind: "code",
        title: "Cancel upstream when the client leaves",
        prompt:
          "Stream a response through your gateway, then disconnect the client midway. Prove from logs that the upstream request was cancelled and you stopped paying for tokens.",
        minutes: 35,
      },
    ],
  },
  {
    week: 15,
    focus: "Find where your retrieval actually fails, then change one thing at a time.",
    exercises: [
      {
        kind: "measure",
        title: "Approximate against exact search",
        prompt:
          "Plot recall at 10 and latency as you raise the search effort of your ANN index, against brute force. Pick an operating point and defend it.",
        minutes: 35,
      },
      {
        kind: "debug",
        title: "Classify five retrieval failures",
        prompt:
          "Find five questions your system gets wrong. Label each as a chunking, embedding, ranking or missing-document failure. Fix one and show the metric moved.",
        minutes: 40,
      },
      {
        kind: "code",
        title: "Say I don't know, correctly",
        prompt:
          "Add abstention. Ask ten questions the documents cannot answer and ten they can. Report false answers and false refusals, and where you set the threshold.",
        minutes: 40,
      },
      {
        kind: "design",
        title: "Choose chunk size by experiment",
        prompt:
          "Try three chunk sizes with and without overlap on the same questions. Give one table, one choice and one sentence on what the table could not tell you.",
        minutes: 30,
      },
    ],
  },
  {
    week: 16,
    focus: "Rehearse the capstone under failure and learn to explain it.",
    exercises: [
      {
        kind: "code",
        title: "Take the cache away mid-run",
        prompt:
          "Stop a Raft node, then the whole cache, while requests flow. The gateway must fall back to answering directly and recover when the cache returns. Write that as a test.",
        minutes: 45,
      },
      {
        kind: "debug",
        title: "Try to read another tenant's data",
        prompt:
          "Write a test where tenant A asks questions that only tenant B's documents answer. It must return nothing and abstain. Fix any leak you find.",
        minutes: 35,
      },
      {
        kind: "explain",
        title: "Present the architecture in five minutes",
        prompt:
          "Record yourself walking through the system, the request path and one decision you would change. Note every place you hesitated and write those down.",
        minutes: 30,
      },
      {
        kind: "design",
        title: "A failure report with three entries",
        prompt:
          "For three failures you caused, write how you noticed, the root cause, the fix and the test that now guards it. Keep each entry under a page.",
        minutes: 35,
      },
    ],
  },
];

export const labFor = (week: number): WeekLab | undefined => LABS.find((l) => l.week === week);
export const labKey = (week: number, i: number) => `w${week}lab:e${i}`;
export const labId = (week: number) => `w${week}lab`;
