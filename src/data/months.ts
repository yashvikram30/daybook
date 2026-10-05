// The optional monthly review: one per four weeks. Each one covers its own four weeks and reaches back into
// every earlier month, so nothing is reviewed once and then left alone. Exercises join several weeks of work;
// "carry" exercises (from month 2 on) deliberately reopen something from before.

import type { LabExercise } from "./labs";

export const WEEKS_PER_MONTH = 4;

export type MonthReview = {
  month: number;
  title: string;
  focus: string;
  exercises: LabExercise[];
  /** Exercises that bring earlier months back into this one. Empty for month 1. */
  carry: LabExercise[];
};

export const MONTHS: MonthReview[] = [
  {
    month: 1,
    title: "The machine and the operating system",
    focus:
      "Join four weeks into one picture: what the CPU, memory, the kernel and your own Python code do when you run a single command.",
    exercises: [
      {
        kind: "explain",
        title: "Trace one command, top to bottom",
        prompt:
          "Pick `ls | grep c > out.txt`. Without notes, write one page that names every step from your shell starting the processes, through the pipe and file descriptors, to page faults, the cache and the disk. Then check it against your shell from week 3 and fix what you got wrong.",
        minutes: 40,
      },
      {
        kind: "code",
        title: "Count the system calls, then predict them",
        prompt:
          "Predict how many system calls your shell makes to run a three-stage pipeline. Run it under strace (Linux) or dtruss (macOS) and compare. For each surprise, find the line of your own code that caused it.",
        minutes: 30,
      },
      {
        kind: "measure",
        title: "Your allocators against Python's, with threads",
        prompt:
          "Benchmark your week 4 first-fit malloc and size-class allocator against Python's own allocation (`bytearray` and `bytes` slices), on one thread and on four, driven by your worker pool. Record throughput and fragmentation. Say where yours lose and which design choice is the cause.",
        minutes: 40,
      },
      {
        kind: "debug",
        title: "Plant a data race, then catch it",
        prompt:
          "Add one unsynchronised counter to your worker pool. Run it with `sys.setswitchinterval(1e-6)` until it gives the wrong answer, and use `dis` to show where `counter += 1` can be interrupted. Fix it twice, once with a `threading.Lock` and once by giving each thread its own count and adding them at the end, and note the cost of each. Then say which of the two fixes you would pick for a hot loop, and why.",
        minutes: 30,
      },
    ],
    carry: [],
  },
  {
    month: 2,
    title: "Networks and storage",
    focus:
      "Put the store behind the network and ask what each request costs: the wire, the protocol, the log and the disk.",
    exercises: [
      {
        kind: "code",
        title: "Serve your key-value store over HTTP",
        prompt:
          "Wrap your week 8 store in a small HTTP front end that supports GET, PUT and DELETE. Load test it with wrk or hey and find where the time goes with a profiler. Write down the top three costs.",
        minutes: 45,
      },
      {
        kind: "debug",
        title: "Kill it mid-write, a hundred times",
        prompt:
          "Write a loop that sends writes, kills the store with kill -9 at a random moment, restarts it and checks that every acknowledged write is still there. Fix any case where one is missing.",
        minutes: 40,
      },
      {
        kind: "explain",
        title: "Follow one request, with numbers",
        prompt:
          "A browser asks for one value. From memory, list every step: DNS, TCP, TLS, HTTP, your handler, the index, the log, fsync. Put a rough latency next to each, then check your guesses with real measurements.",
        minutes: 30,
      },
      {
        kind: "design",
        title: "Choose an isolation level for three bugs",
        prompt:
          "Describe three anomalies on paper: a lost update, a write skew and a phantom read. For each, say which isolation level prevents it, what your store does today, and what it would cost to change.",
        minutes: 30,
      },
    ],
    carry: [
      {
        kind: "explain",
        title: "Why the log needs fsync, in your own words",
        prompt:
          "Reopen your week 4 crash-consistency experiment. Explain what it showed, then explain how the same lesson shapes the write-ahead log in week 8. Write it so someone who skipped month 1 could follow.",
        minutes: 25,
      },
      {
        kind: "measure",
        title: "What each request costs the kernel",
        prompt:
          "Count the system calls and context switches your HTTP server makes per request. Connect each number to the processes and threads from month 1, and say what a thread pool would change here.",
        minutes: 30,
      },
    ],
  },
  {
    month: 3,
    title: "Distributed systems and engineering practice",
    focus:
      "Make failure the normal case: partitions, retries and crashes, then the engineering that keeps it running and understandable.",
    exercises: [
      {
        kind: "debug",
        title: "Partition the leader and serve a stale read",
        prompt:
          "Run a three-node cluster with failure injection. Isolate the leader and show a client reading an old value. Fix it with reads that go through the log or a lease, and add a test that fails if the bug comes back.",
        minutes: 45,
      },
      {
        kind: "code",
        title: "Exactly-once on a lossy network",
        prompt:
          "Send the same write ten times through a network that drops and duplicates messages. Use idempotency keys so it takes effect once. Put the scenario in your CI so it runs on every push.",
        minutes: 40,
      },
      {
        kind: "design",
        title: "Write the runbook for 3 a.m.",
        prompt:
          "In one page, list the alerts your service should raise, three failure modes, and for each the metric you would check first and the command you would run. Ask yourself whether someone else could follow it half asleep.",
        minutes: 35,
      },
      {
        kind: "measure",
        title: "Fit a line three ways",
        prompt:
          "Fit the same data with the closed-form solution, gradient descent and scikit-learn. Compare coefficients and cross-validated error, and plot the loss curve. Explain any difference you see.",
        minutes: 30,
      },
    ],
    carry: [
      {
        kind: "explain",
        title: "Raft log or write-ahead log: what is the same",
        prompt:
          "Put your week 8 write-ahead log next to the Raft log. List what they share and what each one needs that the other does not. Write it down without opening either until you have finished.",
        minutes: 25,
      },
      {
        kind: "measure",
        title: "The price of a durable write, layer by layer",
        prompt:
          "Build a table for one PUT: the cost of an fsync from month 1, of your write-ahead log from month 2, and of a Raft commit. Measure all three on your machine and say which layer dominates.",
        minutes: 40,
      },
    ],
  },
  {
    month: 4,
    title: "Machine learning and the capstone",
    focus:
      "Join models to systems: measure what mattered in your retrieval pipeline, break it on purpose and trace the whole stack from question to answer.",
    exercises: [
      {
        kind: "code",
        title: "Round-trip your tokenizer on awkward text",
        prompt:
          "Write a property test that checks decode(encode(x)) == x for random bytes, emoji and mixed scripts. Then train two vocabulary sizes and compare how many tokens the same paragraph takes.",
        minutes: 35,
      },
      {
        kind: "measure",
        title: "Which retrieval choice mattered",
        prompt:
          "Run your evaluation set with brute-force search, with the ANN index, and with and without reranking. Build a table of recall@k and latency. In one paragraph, say which choice made the biggest difference.",
        minutes: 45,
      },
      {
        kind: "debug",
        title: "Break your RAG on purpose",
        prompt:
          "Put a document in the corpus that tells the model to ignore its instructions, and ask a question the corpus cannot answer. Record how the system fails, add one mitigation for each, and turn both into evaluation cases.",
        minutes: 40,
      },
      {
        kind: "design",
        title: "Review the capstone for failure",
        prompt:
          "For each box in the architecture (gateway, RAG service, KV cache, model), write what happens when it is slow and when it is down. Name the timeout, the fallback and the metric you would watch.",
        minutes: 40,
      },
    ],
    carry: [
      {
        kind: "explain",
        title: "Explain the whole stack out loud",
        prompt:
          "Take one question sent to your system. Talk for ten minutes about every layer it touches, from CPU caches to the model, and record yourself. Listen back and mark where you hesitated: those are the topics to reopen.",
        minutes: 30,
      },
      {
        kind: "measure",
        title: "A cache hit against a miss, and why",
        prompt:
          "Measure the latency of a cached answer from your Raft store and of a full miss. Explain each number with something from earlier months: the commit path, fsync, the network or the scheduler.",
        minutes: 35,
      },
    ],
  },
];

export const monthOf = (week: number) => Math.ceil(week / WEEKS_PER_MONTH);
export const monthFor = (month: number): MonthReview | undefined => MONTHS.find((m) => m.month === month);
/** First and last week of a month. */
export const monthWeeks = (month: number): [number, number] => [
  (month - 1) * WEEKS_PER_MONTH + 1,
  month * WEEKS_PER_MONTH,
];
/** Exercises of a month in display order: new work first, then the carry-overs. */
export const monthExercises = (m: MonthReview) => [...m.exercises, ...m.carry];
export const monthKey = (month: number, i: number) => `m${month}rev:e${i}`;
