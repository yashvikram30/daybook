import { blank, card, match, mcq, multi, order, py, tf, week } from "./types";

export const W3 = week(3, {
  core: [
    mcq(
      "What does `fork()` return?",
      [
        "0 in the parent and the child's pid in the child",
        "The child's pid in the parent and 0 in the child",
        "The child's pid in both",
        "1 on success and 0 on failure",
      ],
      1,
      "fork returns twice, once in each process. A negative value means it failed.",
    ),
    mcq(
      "How many times is `C` printed?",
      ["1", "2", "3", "It depends on scheduling"],
      1,
      "Both the parent and the child continue to the final print, so each prints C once. The waitpid only orders the A and B lines.",
      py`
import os

pid = os.fork()
if pid == 0:
    print("A", end="")
else:
    os.waitpid(pid, 0)
    print("B", end="")
print("C", end="")
`,
    ),
    mcq(
      "How many processes print `x` in total (counting the original)?",
      ["2", "3", "4", "8"],
      2,
      "The first fork doubles the processes to 2. Each of those then calls fork again, giving 4.",
      py`
import os

os.fork()
os.fork()
print("x")
`,
    ),
    mcq(
      "What stays the same across a successful `exec`?",
      [
        "The memory image",
        "The pid and the open file descriptors (unless close-on-exec)",
        "The program counter",
        "The stack contents",
      ],
      1,
      "exec replaces the program image but it is still the same process.",
    ),
    mcq(
      "Why does the OS provide fork and exec as two separate steps?",
      [
        "Because spawn is too slow",
        "So the child can rearrange fds, environment and process group between them: this is how a shell implements > and |",
        "To save memory",
        "Historical accident with no benefit",
      ],
      1,
    ),
    tf(
      "`fork` copies all of the parent's memory immediately.",
      false,
      "It copies page tables, and pages are shared copy-on-write. A page is duplicated only when one side writes to it.",
    ),
    mcq(
      "Why is calling `os.fork()` from a multithreaded Python program risky?",
      [
        "It is patented",
        "The child keeps only the calling thread, so any lock another thread held at that moment stays locked forever in the child",
        "Threads cannot be copied by the kernel",
        "The OS forbids it",
      ],
      1,
      "Python 3.12 and later warn about it. `subprocess` does fork and exec together in carefully written code, which avoids the problem.",
    ),
    blank(
      "A parent that never calls `wait` leaves its exited child as a ___, which holds only an exit-status entry.",
      ["zombie"],
    ),
    mcq(
      "What adopts an orphan whose parent has died?",
      [
        "Nothing, it is killed",
        "init (pid 1) or a subreaper, which reaps it",
        "The shell",
        "The kernel scheduler",
      ],
      1,
    ),
    mcq(
      "Three jobs arrive at t=0 in the order A (10 s), B (2 s), C (2 s). What is the average turnaround time under FIFO?",
      ["4.67 s", "6.67 s", "12 s", "14 s"],
      2,
      "Completions are 10, 12 and 14, which average 12. Under SJF they would be 2, 4, 14 (average 6.67). This is the convoy effect.",
    ),
    match("Match each scheduling policy to its main idea or weakness.", [
      ["FIFO", "convoy effect"],
      ["SJF", "optimal average turnaround but needs job lengths"],
      ["Round robin", "good response time, poor turnaround"],
      ["MLFQ", "learns job behaviour, approximates SJF without knowing lengths"],
    ]),
    multi(
      "Which are rules of a multi-level feedback queue?",
      [
        "Higher-priority queues run first",
        "A job that uses its whole allotment is demoted",
        "Periodically boost all jobs to the top to prevent starvation",
        "Job lengths must be declared in advance",
      ],
      [0, 1, 2],
      "New jobs start at the top. Short and interactive jobs finish or block early and stay high.",
    ),
    card(
      "Name the direct and hidden costs of a context switch.",
      "Direct: saving and loading registers, PC and SP (hundreds of ns to a few microseconds), plus switching page tables for a new process. Hidden: the incoming thread finds cold caches, TLB and branch predictors, which often costs more.",
    ),
    match("Match each way of running Python code at the same time to its main property.", [
      ["threading.Thread", "an OS thread; only one thread runs bytecode at a time because of the GIL"],
      ["asyncio task", "a coroutine in one thread, switched only at `await`"],
      ["multiprocessing.Process", "its own interpreter and GIL, so CPU-bound work really runs in parallel"],
    ]),
    mcq(
      "Why is an asyncio task switch cheaper than a thread switch?",
      [
        "Tasks run on dedicated cores",
        "It happens in user space inside one thread: the coroutine returns to the event loop, with no kernel entry",
        "The kernel caches task state",
        "Tasks never block",
      ],
      1,
      "The catch is that one blocking call stalls every task, because they share the thread.",
    ),
    mcq(
      "Why must `cd` be a shell builtin?",
      [
        "It is faster",
        "chdir changes the working directory of the calling process, so a child would only change itself",
        "Because there is no cd binary on any system",
        "To support tab completion",
      ],
      1,
      "The same applies to `exit` and `export`.",
    ),
    blank(
      "In a shell's redirection code, the child calls `___(fd, 1)` to make stdout refer to the opened file, then `exec`s.",
      ["dup2"],
    ),
    mcq(
      "Why does passing a file-like object (for example `out: TextIO = sys.stdout`) into a function make it easier to test?",
      [
        "File objects are faster than sys.stdout",
        "A test can pass an io.StringIO and inspect the output",
        "It avoids print",
        "It makes the function concurrent",
      ],
      1,
    ),
    mcq(
      "The parent connects `p1`'s stdout to a pipe's write end and `p2`'s stdin to the read end, starts both, but forgets `os.close(w)`. What happens?",
      [
        "c2 never sees EOF, so it hangs",
        "c1 is killed with SIGPIPE",
        "The pipe is closed automatically",
        "c2 reads garbage",
      ],
      0,
      "EOF is delivered only when every write end is closed, and the parent still holds one.",
      py`
r, w = os.pipe()
p1 = subprocess.Popen(["ls"], stdout=w)
p2 = subprocess.Popen(["wc", "-l"], stdin=r)
# no os.close(w) here
p1.wait()
p2.wait()
`,
    ),
    tf(
      "In `a | b | c`, the shell runs a to completion before starting b.",
      false,
      "The shell creates the pipes first and all the processes run concurrently, blocked by the pipe buffers.",
    ),
    multi(
      "Which signals cannot be caught, blocked or ignored?",
      ["SIGKILL", "SIGSTOP", "SIGINT", "SIGTERM"],
      [0, 1],
    ),
    mcq(
      "Which signal is sent when you write to a pipe that has no readers?",
      ["SIGCHLD", "SIGPIPE", "SIGHUP", "SIGSEGV"],
      1,
    ),
    mcq(
      "Ctrl-C in a terminal delivers SIGINT to…",
      ["only the shell", "the foreground process group", "every process of the user", "pid 1"],
      1,
      "That is why each job is placed in its own process group, and why the shell ignores SIGINT itself while a foreground job runs.",
    ),
    mcq(
      "What does `signal.signal(signal.SIGINT, handler)` do in Python?",
      [
        "Runs the handler immediately, on whichever thread was running",
        "A low-level handler sets a flag, and the interpreter runs your function in the main thread between bytecodes",
        "Blocks the signal forever",
        "Sends the signal to every thread",
      ],
      1,
      "That is why a handler may not run until a long native call returns, and why handlers can only be installed from the main thread.",
    ),
  ],
  dsa: [
    mcq(
      "In Two Sum with a dict, why look up `target - v` before inserting `v`?",
      [
        "To avoid using the same element twice",
        "To keep the map sorted",
        "To save memory",
        "It makes no difference",
      ],
      0,
    ),
    mcq(
      "How do 3Sum and 4Sum avoid duplicate tuples?",
      [
        "Use a hash set of tuples",
        "Sort, fix one or two elements, use two pointers, and skip equal values at every level",
        "Run each twice",
        "Only allow positive numbers",
      ],
      1,
      "Times: Two Sum O(n), 3Sum O(n^2), 4Sum O(n^3).",
    ),
    mcq(
      "In the Dutch national flag partition, when `a[mid] == 2` we swap with `hi` and do `hi -= 1`. Why do we not advance `mid`?",
      [
        "It would skip the 1s",
        "The element swapped in from hi has not been examined yet",
        "mid is already at the end",
        "It would overflow",
      ],
      1,
    ),
    blank(
      "Kadane's algorithm updates `cur = max(v, ___)` for each element.",
      ["cur+v|cur + v|v+cur"],
      "The best subarray sum ending here is either the element alone or the best sum ending at the previous element plus it.",
    ),
    mcq(
      "Majority element II (more than n/3 occurrences): how many candidates can there be at most?",
      ["1", "2", "3", "n/3"],
      1,
    ),
    mcq(
      "In merge-sort-based inversion counting, when the element is taken from the right half, how much do we add?",
      ["1", "len(left) - i, the remaining left elements", "len(right) - j", "i + j"],
      1,
      "The right element is smaller than every remaining element of the left half, and each of those pairs is an inversion.",
    ),
    mcq(
      "Why does the 'max product subarray' solution track both the max and the min ending here?",
      [
        "To find the median",
        "A negative number flips the smallest product into the largest",
        "To avoid overflow",
        "For symmetry",
      ],
      1,
    ),
    blank(
      "In `lower_bound`, `mid = lo + (hi - lo) // 2` is used instead of `(lo + hi) // 2` to avoid integer ___ in languages with fixed-width integers.",
      ["overflow"],
      "Python integers cannot overflow, but the habit matters in languages with fixed-width integers.",
    ),
    mcq(
      "Given `bisect_left(a, x)` and `bisect_right(a, x)`, how do you count occurrences of x in a sorted list?",
      [
        "bisect_left - bisect_right",
        "bisect_right - bisect_left",
        "bisect_right + bisect_left",
        "bisect_left(x + 1)",
      ],
      1,
    ),
  ],
  eng: [
    mcq(
      "In bash, what does `set -euo pipefail` do?",
      [
        "Makes the script run faster",
        "Exits on error, on unset variables, and when any command in a pipeline fails",
        "Enables debug output",
        "Prevents using pipes",
      ],
      1,
    ),
    blank(
      'ShellCheck\'s most common finding is an unquoted variable such as $var; fix it by writing "___".',
      ["$var|${var}"],
    ),
    mcq(
      "Which is a valid performance claim?",
      [
        "Task switches are fast",
        "asyncio task switch 4 µs, spread 0.2 µs, on an M2, one core, 10 repeats",
        "It felt faster",
        "It is 2x faster (one run)",
      ],
      1,
      "A claim needs what was measured, how, on what machine, with what variance.",
    ),
    card(
      "What is a good way to read an unfamiliar codebase?",
      "Start from an entry point and follow one path end to end, read the tests first for intended behaviour, use grep, go-to-definition, git log and blame, run it under a debugger, and take notes on the data structures.",
    ),
  ],
});

export const W4 = week(4, {
  core: [
    mcq(
      "Why can `counter++` lose updates even on a single core?",
      [
        "The compiler removes the increment",
        "It is load, add, store, and a thread switch between load and store lets two threads read the same old value",
        "Single cores cannot run threads",
        "Memory is not coherent on one core",
      ],
      1,
    ),
    mcq(
      "Four threads each increment a shared `n` one million times without a lock. What can `n` be at the end?",
      ["Exactly 4,000,000", "Up to 4,000,000, and sometimes less", "Always 1,000,000", "More than 4,000,000"],
      1,
      "`n += 1` is several bytecodes, and the GIL can change hands between any two of them, so updates can be lost. How often depends on the Python version and the switch interval; a correct-looking run proves nothing.",
      py`
import sys, threading
sys.setswitchinterval(1e-6)
n = 0

def work():
    global n
    for _ in range(1_000_000):
        n += 1

ts = [threading.Thread(target=work) for _ in range(4)]
for t in ts: t.start()
for t in ts: t.join()
print(n)
`,
    ),
    match("Match each fix for the shared counter to when it fits best.", [
      ["threading.Lock", "a critical section of any size"],
      ["owner thread with a queue.Queue", "ownership handoff"],
      ["per-thread counts, summed at the end", "no sharing at all, fastest"],
      ["multiprocessing.Value", "separate processes, so CPU-bound work really runs in parallel"],
    ]),
    multi(
      "Which statements about finding races in Python are true?",
      [
        "There is a built-in race detector enabled with a -race flag",
        "Stress tests with a tiny sys.setswitchinterval make bad interleavings more likely",
        "A test that passes once proves there are no races",
        "A free-threaded build (3.13t) removes the GIL's accidental protection, so hidden races start to show",
      ],
      [1, 3],
      "Check the invariant (the final total, no lost items), repeat the test many times, and put a timeout on it so a hang becomes a failure.",
    ),
    mcq(
      "Which approach is most likely to expose a data race in a Python test?",
      ["Run it once", "Run it many times with a tiny `sys.setswitchinterval` and assert the invariant", "Run ruff", "Read the code once"],
      1,
    ),
    mcq(
      "What is wrong with this consumer?",
      [
        "It should use `if`, not `while`, around wait",
        "It should use `while` around wait: wake-ups can be spurious and another consumer may have emptied the queue first",
        "wait must be called without the lock held",
        "Nothing is wrong",
      ],
      1,
      "With Mesa semantics, always re-check the condition in a loop after waking.",
      py`
def get(self):
    with self.lock:
        if not self.q:
            self.not_empty.wait()
        return self.q.popleft()
`,
    ),
    tf(
      "`cond.wait()` releases the lock and sleeps atomically, then re-acquires the lock before returning.",
      true,
    ),
    mcq(
      "How can a counting semaphore be written in idiomatic Python?",
      [
        "With a dict",
        "`threading.Semaphore(n)` used as `with sem:` (or `asyncio.Semaphore` in async code)",
        "With goto",
        "It cannot",
      ],
      1,
    ),
    multi(
      "Which are among Coffman's four necessary conditions for deadlock?",
      ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"],
      [0, 1, 3],
      "The fourth is no preemption. Breaking any one of them prevents deadlock.",
    ),
    mcq(
      "Two threads lock A then B, and B then A. Which condition does a global lock ordering break?",
      ["Mutual exclusion", "Hold and wait", "No preemption", "Circular wait"],
      3,
    ),
    mcq(
      "What happens when these two threads both run?",
      [
        "They both finish",
        "Python raises a deadlock error",
        "RuntimeError: deadlock detected",
        "The program hangs silently forever",
      ],
      3,
      "Python does not detect deadlock. To see where each thread is stuck, call `faulthandler.dump_traceback_later(10, exit=True)` early, or run `py-spy dump` on the process. `lock.acquire(timeout=...)` turns a silent hang into an error.",
      py`
a, b = threading.Lock(), threading.Lock()

def t1():
    with a:
        time.sleep(0.1)
        with b: pass

def t2():
    with b:
        time.sleep(0.1)
        with a: pass
`,
    ),
    card(
      "Why does every thread or task you start need a way to stop?",
      "Otherwise it leaks. Threads cannot be killed from outside, so use a threading.Event or a sentinel on the queue and check it regularly. asyncio tasks are cancelled with task.cancel() or `async with asyncio.timeout(...)`.",
    ),
    match("Match the allocator concept to its description.", [
      ["Split", "carve a large free block into the requested part and a remainder"],
      ["Coalesce", "merge adjacent free blocks when one is freed"],
      ["First-fit", "take the first free block that is big enough"],
      ["Size classes", "segregated free lists for fixed block sizes"],
    ]),
    mcq(
      "How does `free(p)` know the block size without being told?",
      [
        "It scans the heap",
        "A header just before p records it",
        "The OS keeps a table",
        "It does not need to know",
      ],
      1,
    ),
    mcq(
      "A 13-byte request is served with a 16-byte block. What kind of waste is this?",
      ["External fragmentation", "Internal fragmentation", "A memory leak", "False sharing"],
      1,
      "External fragmentation is free space broken into pieces too small to use, such as three 1 KB holes failing a 2 KB request.",
    ),
    multi(
      "Which describe CPython's memory management?",
      [
        "Reference counting frees an object the moment its count reaches zero",
        "A generational cycle collector finds unreachable cycles",
        "A moving, compacting collector relocates objects",
        "Objects are freed only when a collection runs",
      ],
      [0, 1],
      "CPython never moves objects, and most are freed immediately by their count. The cycle collector exists for objects that refer to each other (see the `gc` module).",
    ),
    blank(
      "CPython frees most objects the instant their ___ count reaches zero.",
      ["reference|refcount|ref"],
      "Counting alone cannot free cycles, which is why a separate cyclic collector also runs.",
    ),
    mcq(
      "How does a hard link differ from a symlink?",
      [
        "A hard link is another directory entry for the same inode; a symlink is a small file holding a path and can dangle",
        "A symlink shares the inode",
        "A hard link can cross filesystems",
        "They are the same thing",
      ],
      0,
    ),
    blank(
      "A directory is a file that maps names to ___ numbers.",
      ["inode"],
      "The inode holds the metadata, but not the name.",
    ),
    mcq(
      "After `write()` returns successfully, where is the data?",
      [
        "On the disk platter",
        "In the OS page cache only, and it can be lost on power failure",
        "In the device flash",
        "In the process's memory only",
      ],
      1,
    ),
    order(
      "Put the safe file-replace pattern in order.",
      [
        "Write a temporary file",
        "fsync the temporary file",
        "rename it over the target (atomic)",
        "fsync the directory",
      ],
      "The directory fsync makes the new name durable.",
    ),
    order(
      "Put the steps of a journalled update in order.",
      [
        "Write the transaction (begin + blocks) to the journal",
        "Write the commit record once the previous step is durable",
        "Checkpoint: write the blocks to their real locations",
        "Free the journal space",
      ],
      "Recovery replays committed transactions and ignores incomplete ones, so the cost is proportional to the journal, not the disk.",
    ),
    mcq(
      "A log record has `[len][crc32][payload]`. On recovery you hit a record whose checksum fails. What do you do?",
      [
        "Skip it and read on",
        "Treat it as a torn write: stop and truncate the log there",
        "Crash",
        "Rewrite the checksum",
      ],
      1,
    ),
    tf(
      "On macOS a plain `fsync` does not force the drive's write cache to flush; that takes `F_FULLFSYNC`, which in Python you must request yourself with `fcntl.fcntl(fd, fcntl.F_FULLFSYNC)`.",
      true,
      "Disks and firmware can also lie about flushes, so durable systems test their assumptions.",
    ),
  ],
  dsa: [
    mcq(
      "In a rotated sorted array, at `mid`, `a[lo] <= a[mid]` tells you…",
      [
        "The right half is sorted",
        "The left half [lo, mid] is sorted",
        "The target is at mid",
        "The array has duplicates",
      ],
      1,
      "Then check whether the target lies inside that sorted half to choose a side.",
    ),
    mcq(
      "How do you find the minimum of a rotated sorted array (no duplicates)?",
      [
        "Compare a[mid] with a[hi]: if a[mid] > a[hi] go right, else keep mid and go left",
        "Compare a[mid] with a[lo] only",
        "Linear scan is the only way",
        "Sort it first",
      ],
      0,
      "The index of the minimum is also the number of rotations.",
    ),
    mcq(
      "With duplicates, `a[lo] == a[mid] == a[hi]`. What do you do and what does it cost?",
      [
        "Move lo++ and hi--; worst case O(n)",
        "Return -1",
        "Binary search still works in O(log n)",
        "Restart on the right half",
      ],
      0,
    ),
    blank("Binary search on the answer needs `feasible(x)` to be ___ (false...false true...true).", [
      "monotonic|monotone",
    ]),
    mcq(
      "For 'ship within D days', what is the search range for the capacity?",
      ["[1, sum]", "[max weight, sum of weights]", "[0, D]", "[min weight, max weight]"],
      1,
      "The ship must carry the heaviest single package, and capacity = sum always works.",
    ),
    blank(
      "When maximising (aggressive cows), use the ___ mid: `lo + (hi - lo + ___) // 2`, or the loop never terminates.",
      ["upper", "1"],
      "With lo = mid on success, the lower mid would not progress when hi = lo + 1.",
    ),
    mcq(
      "For a peak element, if `a[mid] < a[mid+1]` you move…",
      ["left", "right: a peak must exist on the rising side", "stop", "to the end"],
      1,
    ),
    mcq(
      "Median of two sorted arrays in O(log(min(m, n))) works by…",
      [
        "Merging both",
        "Binary searching a partition of the smaller array so that every left element is <= every right element",
        "Sorting the union",
        "Using a heap",
      ],
      1,
    ),
  ],
  eng: [
    multi(
      "Which are good practice for testing concurrent code?",
      [
        "Repeat the test many times, with a tiny sys.setswitchinterval",
        "Wait for threads with time.sleep",
        "Use join(), queue.join(), Events with timeouts or futures",
        "Set a test timeout",
      ],
      [0, 2, 3],
      "Sleeping to wait makes tests flaky.",
    ),
    mcq(
      "Which of these is a good code-review habit?",
      [
        "Large changes reviewed once a week",
        "Small changes with a description of what and why, comments on the code not the person, nits marked as nits",
        "Approve only perfect changes",
        "Skip tests",
      ],
      1,
    ),
    mcq(
      "What does Hypothesis do with a failing input?",
      [
        "Discards it",
        "Shrinks it to a minimal example and saves it in .hypothesis so it is replayed next time",
        "Emails you",
        "Fixes it",
      ],
      1,
      "Pick invariants to check (no overlap, in bounds, no double free), not just 'does not crash'.",
    ),
    card(
      "What is group commit and why do databases use it?",
      "Many transactions share one fsync. An fsync per commit bounds throughput by fsync latency, so batching commits amortises that cost while keeping durability.",
    ),
  ],
});
