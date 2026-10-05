import { blank, card, match, mcq, multi, order, py, tf, week } from "./types";

export const W1 = week(1, {
  core: [
    mcq(
      "What does `sys.getsizeof(0)` report on a 64-bit CPython 3.12 or later?",
      ["4", "8", "28", "56"],
      2,
      "An int is an object: a 16-byte header (reference count and type pointer), a length field, and one 30-bit digit. A 32-bit machine integer is just 4 bytes of value. The size grows by about 4 bytes for every 30 more bits.",
    ),
    mcq(
      "What does `ctypes.sizeof` report for this structure on a 64-bit machine?",
      ["10", "16", "24", "32"],
      2,
      "`a` sits at 0, then 7 bytes of padding so `b` is 8-aligned (8..16), `c` at 16, then 7 more bytes of padding so the whole struct is a multiple of 8. Total 24. Putting `b` first would give 16.",
      py`
import ctypes

class A(ctypes.Structure):
    _fields_ = [
        ("a", ctypes.c_bool),
        ("b", ctypes.c_int64),
        ("c", ctypes.c_bool),
    ]

print(ctypes.sizeof(A))
`,
    ),
    mcq(
      "What is the size of this structure?",
      ["6", "8", "12", "16"],
      2,
      "byte at 0, 3 bytes padding, int32 at 4..8, byte at 8, then 3 bytes of tail padding so the size is a multiple of the 4-byte alignment: 12. Reordering to `b int32; a, c byte` gives 8.",
      py`
class S(ctypes.Structure):
    _fields_ = [
        ("a", ctypes.c_ubyte),
        ("b", ctypes.c_int32),
        ("c", ctypes.c_ubyte),
    ]
`,
    ),
    blank(
      "A Python `list` stores ___ to its elements, 8 bytes each on a 64-bit machine, not the elements themselves.",
      ["pointers|references|pointer|reference"],
      "A list is a pointer to an array of pointers. That is why a list of a million ints costs 8 MB of pointers plus the int objects, and why `array.array` and NumPy exist.",
    ),
    mcq(
      "What does this print?",
      ["[1, 2]", "[1, 2, 3]", "[3]", "it raises an error"],
      1,
      "Assignment never copies: `b` is another name for the same list object, so appending through `b` is visible through `a`. `id(a) == id(b)`, and `sys.getrefcount` shows two references.",
      py`
a = [1, 2]
b = a
b.append(3)
print(a)
`,
    ),
    tf(
      "A closure that uses a local variable of its enclosing function keeps that variable alive after the function returns.",
      true,
      "The variable lives in a cell object that the closure references, so it outlives the call frame. Python locals are not tied to a stack slot that disappears on return.",
    ),
    mcq(
      "What does this Python program print?",
      ["128", "-128", "0", "it raises OverflowError"],
      0,
      "Python integers are arbitrary precision, so they never overflow: 127 + 1 is 128. To get 8-bit wraparound you must mask (`& 0xFF`) or use `ctypes.c_int8`, which gives -128.",
      py`
x = 127
x += 1
print(x)
`,
    ),
    mcq(
      "What does `ctypes.c_int8(127 + 1).value` return?",
      ["128", "-128", "It raises OverflowError", "127"],
      1,
      "`127 + 1` is 128 in Python, which never overflows, but an 8-bit signed register holds only -128 to 127. `ctypes` keeps the low 8 bits, 0b10000000, which is -128 in two's complement.",
    ),
    blank(
      "In 8-bit two's complement, -1 is written in binary as ___.",
      ["11111111|0xff"],
      "The top bit has weight -128 and the rest sum to 127, so all ones is -128 + 127 = -1. To negate: invert the bits and add 1.",
    ),
    mcq(
      "How are the 64 bits of a Python `float` (an IEEE 754 double) divided?",
      [
        "1 sign, 8 exponent, 55 mantissa",
        "1 sign, 11 exponent, 52 mantissa",
        "1 sign, 15 exponent, 48 mantissa",
        "2 sign, 10 exponent, 52 mantissa",
      ],
      1,
      "float32 is 1/8/23. float64 is 1/11/52, giving about 15 to 16 decimal digits of precision.",
    ),
    mcq(
      "What does this print?",
      ["True", "False", "it raises an error", "0.3"],
      1,
      "0.1 and 0.2 have no finite binary expansion, so the sum is 0.30000000000000004. Compare floats with a tolerance instead, for example `math.isclose`.",
      py`
a, b = 0.1, 0.2
print(a + b == 0.3)
`,
    ),
    mcq(
      "Above which integer can a `float64` no longer represent every integer exactly?",
      ["2^24", "2^31", "2^53", "2^63"],
      2,
      "The mantissa has 52 stored bits plus the implicit 1, so 53 significant bits. Beyond 2^53 the spacing between floats exceeds 1 and 2^53 + 1 rounds to 2^53.",
    ),
    multi(
      "Which statements about byte order are true?",
      [
        "0x01020304 is stored as 04 03 02 01 on a little-endian machine",
        "x86-64 and arm64 macOS are little-endian",
        "Network byte order is little-endian",
        "`int.to_bytes` and `struct` convert between byte orders",
      ],
      [0, 1, 3],
      "Network byte order is big-endian, which is why `htons` and friends exist.",
    ),
    mcq(
      "What does `print(a)` show?",
      ["[1, 2, 3, 4]", "[1, 2, 99, 4]", "[1, 2, 99]", "[1, 2]"],
      0,
      "A slice of a Python list is a new list: it copies the pointers, so `b` does not share storage with `a`, and appending to `b` leaves `a` alone. (This is different from slices in languages where a slice is a view.) A NumPy slice, by contrast, is a view.",
      py`
a = [1, 2, 3, 4]
b = a[:2]
b.append(99)
print(a)
`,
    ),
    mcq(
      "What does this print?",
      ["1 1", "100 100", "1 100", "100 1"],
      1,
      "`b = a` makes a second name for the same list, so changing `b[0]` changes what `a[0]` shows. Use `a.copy()`, `list(a)` or `a[:]` for a (shallow) copy.",
      py`
a = [1, 2, 3]
b = a
b[0] = 100
print(a[0], b[0])
`,
    ),
    tf(
      "On arm64, an `ADD` instruction can take one operand directly from memory.",
      false,
      "arm64 is a load/store architecture: only LDR and STR touch memory. Arithmetic works on registers.",
    ),
    match("Match each arm64 item to its role.", [
      ["x30", "link register: holds the return address after BL"],
      ["BL f", "call f"],
      ["LDR x0, [x1, #8]", "load 8 bytes from memory at x1 + 8"],
      ["CMP then B.LT", "set flags, then branch conditionally"],
      ["xzr", "always reads as zero"],
    ]),
    mcq(
      "Why is a method call in Python dearer than a direct call to a known function in compiled code?",
      [
        "Methods are always slower than plain functions",
        "The method is found at run time by looking at the instance and its class, because nothing is known about the receiver's type until then",
        "Python forbids inlining of functions",
        "The reference counter needs the call to stay",
      ],
      1,
      "`LOAD_ATTR` finds the function through the instance and the class's method resolution order, and `CALL` runs it. Specialisation caches the lookup, but it is still more than a direct `BL`.",
    ),
    blank(
      "After `import dis`, print the bytecode of a function `f` with `dis.___(f)`.",
      ["dis"],
      "`dis.dis` disassembles a function, class or code object. Add `adaptive=True` after warming the function up to see specialised instructions.",
    ),
    order(
      "Order a stack frame from the highest address to the lowest.",
      [
        "Caller's frame",
        "Saved return address (link register)",
        "Saved frame pointer",
        "Locals and spilled temporaries",
        "Callee's frame",
      ],
      "The stack grows toward lower addresses, so each deeper call sits below the previous one.",
    ),
    mcq(
      "What happens when this runs in CPython with the default settings?",
      [
        "The process segfaults when the stack runs out",
        "It raises RecursionError, because Python limits recursion depth (1000 by default)",
        "It returns 5000",
        "It silently returns None",
      ],
      1,
      "Python guards recursion with `sys.getrecursionlimit()` and raises an exception, where a program with no such guard would overflow its fixed stack (about 8 MB for the main thread) and segfault.",
      py`
def depth(n):
    return 0 if n == 0 else 1 + depth(n - 1)

depth(5000)
`,
    ),
    multi(
      "Which of these are defences against stack-smashing attacks?",
      ["Stack canaries", "ASLR", "A non-executable stack", "Compiling with -O3"],
      [0, 1, 2],
      "Optimisation level is not a defence. Canaries detect an overwritten return address, ASLR hides addresses, and NX stops injected code from running.",
    ),
    card(
      "How does a call between Python functions differ from a machine-level call on arm64 (AAPCS64)?",
      "A machine-level call passes the first integer arguments in registers (x0-x7), returns in x0, and keeps callee-saved state in x19-x28. CPython passes references to objects, returns one object reference (or NULL plus an exception), and keeps each call's locals and value stack in a frame object that the interpreter manages.",
    ),
    card(
      "What does `ctypes.sizeof(ctypes.c_void_p)` tell you about any pointer, and when does the pointee type matter?",
      "It is always 8 bytes on a 64-bit machine because a pointer is just an address. The pointee type only matters on dereference, when the CPU loads sizeof(T) bytes from that address.",
    ),
    tf(
      "`a[i]` on a Python list compares `i` with the list's length and raises `IndexError` when it is out of range.",
      true,
      "That bounds check is why an off-by-one write raises an exception in Python instead of silently corrupting the memory next to it.",
    ),
    mcq(
      "In `dis` output, what does `LOAD_FAST a` do?",
      [
        "Pushes the local variable `a` onto the value stack",
        "Stores the top of the stack into `a`",
        "Looks up a global named `a`",
        "Calls the function `a`",
      ],
      0,
      "CPython bytecode is for a stack machine. `LOAD_FAST` pushes a local, `BINARY_OP` pops two values and pushes the result, and `RETURN_VALUE` pops and returns it.",
    ),
    blank(
      "A class satisfies a `typing.Protocol` ___ by having the matching methods; there is no `implements` keyword.",
      ["structurally|implicitly|automatically"],
      "Protocols describe structure for the type checker. Python itself is duck typed, so any object with the right methods works at run time.",
    ),
    mcq(
      "Which of these does `ruff check` catch?",
      [
        "A file whose formatting differs from the canonical style",
        "An unused import or an undefined name",
        "Data races at run time",
        "Slow benchmarks",
      ],
      1,
      "`ruff format --check` reports unformatted files, and `pytest` finds failing behaviour. `ruff check` is the static linter for unused imports, undefined names and risky patterns.",
    ),
  ],
  dsa: [
    mcq(
      "Which sort in this list is not stable?",
      ["Insertion sort", "Merge sort", "Selection sort", "Bubble sort with early exit"],
      2,
      "Selection sort swaps the minimum to the front across other elements, which can reorder equal keys.",
    ),
    mcq(
      "What is bubble sort's best-case time when it stops after a pass with no swaps?",
      ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      2,
      "On already-sorted input one pass finds nothing to swap and stops.",
    ),
    mcq(
      "How many swaps does this insertion sort perform on `[3, 2, 1]`?",
      ["1", "2", "3", "6"],
      2,
      "Each swap removes exactly one inversion, and [3,2,1] has 3 inversions: (3,2), (3,1), (2,1).",
      py`
def insertion(a):
    for i in range(1, len(a)):
        j = i
        while j > 0 and a[j - 1] > a[j]:
            a[j - 1], a[j] = a[j], a[j - 1]
            j -= 1
`,
    ),
    blank("Merge sort takes ___ time in every case and ___ extra space.", [
      "n log n|o(n log n)|nlogn",
      "n|o(n)",
    ]),
    blank(
      "In the merge step, the comparison `l[i] ___ r[j]` (taking from the left on a tie) is what makes merge sort stable.",
      ["<="],
      "Taking the left element on equality keeps equal keys in their original order.",
    ),
    mcq(
      "Quick sort with the last element as pivot is run on an already sorted array. What is the time?",
      ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
      2,
      "Every partition splits into n-1 and 0 elements, so there are n levels of recursion each doing O(n) work. In Python that also means n levels of recursion, which raises RecursionError for a few thousand items.",
    ),
    tf("A loop that halves the remaining range each iteration is O(log n).", true),
  ],
  eng: [
    mcq(
      "In git, what is a branch?",
      [
        "A full copy of the working tree",
        "A movable name that points at a commit",
        "A separate repository",
        "A list of changed files",
      ],
      1,
      "A commit is a snapshot with parent pointers. A branch is just a ref, so creating one is nearly free.",
    ),
    match(
      "Match each git object to what it holds.",
      [
        ["blob", "file contents"],
        ["tree", "a directory: names pointing to blobs and trees"],
        ["commit", "a tree plus parents, author and message"],
        ["ref", "a name (branch or tag) pointing to a commit"],
      ],
      "Identical content is stored once, because objects are addressed by the hash of their content.",
    ),
    blank("`git diff ___` shows the changes that are already staged.", ["--staged|--cached"]),
    card(
      "Why commit after every working step, with a message that says why?",
      "Small commits are easy to review, revert and bisect, and the message records intent that the code alone cannot show.",
    ),
  ],
});

export const W2 = week(2, {
  core: [
    order(
      "Order the memory hierarchy from lowest to highest latency.",
      ["Registers", "L1 cache", "L2 cache", "L3 cache", "DRAM", "SSD"],
      "Roughly: 0.3 ns, 1 ns, 3-5 ns, 10-40 ns, 60-100 ns, 10-100 microseconds. Each level is bigger, slower and cheaper per byte.",
    ),
    multi(
      "Which of these exhibit good spatial locality?",
      [
        "Summing an `array.array` front to back",
        "Walking a linked list whose nodes were allocated far apart",
        "Reading a 2D array row by row when it is stored row-major",
        "Reading a row-major 2D array column by column",
      ],
      [0, 2],
      "Memory moves in cache lines (64 bytes on most x86, 128 on Apple M-series). Sequential access uses every byte of each line; strided access wastes most of it.",
    ),
    mcq(
      "Which traversal of a C-ordered (row-major) NumPy array `m` is faster, and why?",
      [
        "B, because the outer index changes slowest",
        "A, because it reads consecutive memory",
        "They are identical, both are O(n^2)",
        "B, because it uses fewer registers",
      ],
      1,
      "Same big-O, very different constants. The row-wise sum takes about one miss per cache line; the column-wise sum misses on nearly every access once the matrix is larger than the cache.",
      py`
# A: sum each row
for i in range(n):
    s += m[i, :].sum()
# B: sum each column
for j in range(n):
    s += m[:, j].sum()
`,
    ),
    blank(
      "An address is split into ___ | set index | block offset.",
      ["tag"],
      "The index picks the set, the tag is compared against each line in the set, and the offset selects the byte inside the line.",
    ),
    blank(
      "A 32 KB, 8-way set-associative cache with 64-byte lines has ___ sets.",
      ["64"],
      "32768 / (64 x 8) = 64 sets. That is 6 index bits and 6 offset bits.",
    ),
    match("Match each cache miss type to its cause.", [
      ["Compulsory", "the first touch of a line"],
      ["Capacity", "the working set is bigger than the cache"],
      ["Conflict", "many addresses map to the same set"],
    ]),
    mcq(
      "Two processes on different cores each increment their own counter, stored side by side in one shared-memory array, yet both slow down. What is the likely cause?",
      [
        "A data race",
        "False sharing: the counters sit on one cache line",
        "The scheduler is unfair",
        "TLB misses",
      ],
      1,
      "The coherence protocol keeps invalidating the line between cores. Pad or align hot per-process data to a cache line.",
    ),
    tf(
      "A linked list of Python objects and a flat array are both O(n) to traverse, so they perform about the same.",
      false,
      "Nodes are scattered, so each hop is a likely cache miss and the CPU cannot prefetch. Constants can differ by 10-100x.",
    ),
    mcq(
      "Which command repeats a statement for you and reports how long it takes?",
      [
        "python3 -m timeit -s 'setup' 'statement'",
        "python3 -m dis statement",
        "python3 -m pdb statement",
        "python3 -m venv statement",
      ],
      0,
      "`timeit` runs the statement many times; use the minimum of several repeats, because it has the least noise. With pytest, the pytest-benchmark plugin does the same.",
    ),
    mcq(
      "Two processes hammer `a` and `b` of this structure from different cores. Which change most plausibly removes the slowdown?",
      [
        "Make both fields int32",
        "Insert 56 bytes of padding between them so they sit on different cache lines",
        "Protect each with a lock",
        "Use a list of two ints instead",
      ],
      1,
      "The fields share a 64-byte line, so every write invalidates the other core's copy. A lock would not change where the data lives.",
      py`
class Counters(ctypes.Structure):
    _fields_ = [
        ("a", ctypes.c_int64),  # written by process 1
        ("b", ctypes.c_int64),  # written by process 2
    ]
`,
    ),
    blank(
      "Fill in the mask that extracts the top nibble, which selects the instruction family.",
      ["0xF000|0xf000"],
      "CHIP-8 decodes by nibbles: the top nibble picks the family (1NNN, 6XNN, 8XY_ ...), then X, Y and N come from the other nibbles.",
      py`
op = self.mem[self.pc] << 8 | self.mem[self.pc + 1]
self.pc += 2
match op & ___:
    case 0x1000:  # 1NNN jump
        self.pc = op & 0x0FFF
`,
    ),
    mcq(
      "How big is a page on x86-64 Linux, and on Apple silicon macOS?",
      ["4 KiB and 4 KiB", "4 KiB and 16 KiB", "16 KiB and 4 KiB", "64 KiB and 64 KiB"],
      1,
    ),
    blank(
      "x86-64 uses ___ levels of page table, each indexed by 9 bits, plus a 12-bit offset: a 48-bit virtual address.",
      ["4|four"],
      "A full walk costs up to 4 memory reads, which is why the TLB matters.",
    ),
    order(
      "Put the steps of handling a page fault in order.",
      [
        "The MMU finds the page-table entry not present",
        "The CPU traps to the kernel's fault handler",
        "The kernel checks the address belongs to a valid region",
        "The kernel maps a page (reading from disk first if it is a major fault)",
        "The faulting instruction is executed again",
      ],
      "An address outside any region ends in SIGSEGV. After the PTE is fixed, the CPU re-executes the same instruction, which now succeeds.",
    ),
    mcq(
      "What is the difference between a minor and a major page fault?",
      [
        "Minor faults are caught by user code",
        "A minor fault maps a page already in memory; a major fault must read from disk or swap",
        "A major fault always kills the process",
        "Minor faults only happen on the stack",
      ],
      1,
    ),
    multi(
      "Which are benefits of virtual memory?",
      ["Process isolation", "Demand paging", "Copy-on-write", "Eliminating the need for caches"],
      [0, 1, 2],
    ),
    card(
      "What does the TLB cache, and what happens on a miss?",
      "Recent virtual-to-physical translations. A hit costs about a cycle. A miss triggers a page-table walk (up to 4 memory reads on x86-64). Switching process either flushes it or uses address-space IDs (ASIDs/PCIDs).",
    ),
    tf(
      "In CPython, the `id()` of an object can change while the object is alive.",
      false,
      "CPython never moves an object once it is allocated, and `id(x)` is its address, so it stays fixed for the object's whole lifetime. (Runtimes whose garbage collectors relocate objects behave differently.)",
    ),
    mcq(
      "Which statement re-raises an `OSError` from `mmap` so that a traceback still shows the original error as the cause?",
      [
        'raise RuntimeError("mmap failed")',
        'raise RuntimeError("mmap failed") from err',
        "print(err)",
        "except OSError: pass",
      ],
      1,
      "`raise ... from err` chains the exceptions: the original is stored as `__cause__` and printed in the traceback. Catch the narrowest exception you can handle and let the rest propagate.",
    ),
    mcq(
      "In CHIP-8, where do programs start in the 4096-byte memory?",
      ["0x000", "0x050", "0x200", "0xF00"],
      2,
      "0x000 to 0x1FF was reserved for the original interpreter. Font sprites are conventionally at 0x050.",
    ),
    blank("In CHIP-8, register V___ is used as the flag register for carry and collision.", ["F|15|0xF"]),
    tf("CHIP-8 instructions are 2 bytes long, so the fetch step reads two bytes and advances PC by 2.", true),
    mcq(
      "What does opcode `8XY4` do in CHIP-8?",
      [
        "Vx = Vy",
        "Vx += Vy and sets VF to 1 if the result overflowed 8 bits",
        "Skip the next instruction if Vx == Vy",
        "Vx -= Vy and sets VF on borrow",
      ],
      1,
      "`7XNN` also adds, but with an immediate and without touching the carry flag. Python ints do not wrap, so the emulator must mask with `& 0xFF` itself.",
    ),
    mcq(
      "At what rate do the CHIP-8 delay and sound timers count down?",
      ["Once per instruction", "60 Hz", "1 kHz", "Once per frame drawn"],
      1,
    ),
    mcq(
      "Why does the notes' design keep the CPU separate from the machine (display, keyboard, timers)?",
      [
        "It makes the emulator run faster",
        "The core is state plus step, so it can be unit tested without any I/O",
        "Python requires separate modules for hardware",
        "To avoid using classes",
      ],
      1,
    ),
    match("Match the pipeline hazard to the usual remedy.", [
      ["Structural hazard", "duplicate the hardware unit"],
      ["Data hazard", "forwarding or stalling"],
      ["Control hazard", "branch prediction"],
    ]),
    mcq(
      "Why do deeper pipelines make branch mispredictions more expensive?",
      [
        "More instructions need to be flushed and refilled, costing about the pipeline depth",
        "Deeper pipelines have no branch predictor",
        "The cache is bigger",
        "Interrupts are disabled",
      ],
      0,
    ),
    multi(
      "Which are features of modern CPUs?",
      [
        "Out-of-order execution",
        "Register renaming",
        "Speculative execution",
        "Executing exactly one instruction at a time",
      ],
      [0, 1, 2],
      "Spectre-style attacks exploit the cache traces left behind by speculation.",
    ),
    mcq(
      "Compared with polling, interrupts are better when…",
      [
        "events are frequent and predictable",
        "events are rare, so the CPU should not spin checking a status register",
        "the device is slower than a floppy disk",
        "the CPU has only one core",
      ],
      1,
      "DMA goes further: a device copies data into memory without the CPU's help and interrupts only when done.",
    ),
  ],
  dsa: [
    blank(
      "To find the missing number in 0..n, XOR the length with every index and every ___.",
      ["value|element|number"],
      "Pairs cancel, leaving the missing one. With fixed-width integers it avoids the overflow risk of summing; in Python it still uses O(1) space.",
    ),
    blank(
      "Complete the voting loop: what happens to the count when the value is not the candidate?",
      ["-=1|-= 1"],
      "A different value cancels one vote. Whatever majority element exists survives the cancelling.",
      py`
cand, cnt = 0, 0
for v in a:
    if cnt == 0:
        cand = v
    if v == cand:
        cnt += 1
    else:
        cnt ___
`,
    ),
    mcq(
      "Boyer-Moore voting finds a majority element in what time and space?",
      [
        "O(n) time, O(1) space",
        "O(n log n) time, O(1) space",
        "O(n) time, O(n) space",
        "O(n^2) time, O(1) space",
      ],
      0,
      "If a majority is not guaranteed, a second pass must verify the candidate.",
    ),
    mcq(
      "In 'longest consecutive sequence' with a set, why only start counting at values `v` where `v-1` is absent?",
      [
        "To skip negative numbers",
        "So each run is counted from its start only, keeping the whole thing O(n)",
        "Because sets cannot hold duplicates",
        "To avoid integer overflow",
      ],
      1,
    ),
    mcq(
      "Why is 'prefix sum + hash map' used for 'subarray sum equals k' instead of a sliding window?",
      [
        "It is shorter to write",
        "It works with negative numbers, where a window's sum is not monotonic",
        "It uses O(1) space",
        "Sliding windows cannot run in O(n)",
      ],
      1,
    ),
    blank(
      "When counting subarrays with sum k, seed the dict with {0: ___} so subarrays that start at index 0 are counted.",
      ["1"],
    ),
    mcq(
      "How do you rotate an n x n matrix 90 degrees clockwise in place?",
      [
        "Reverse each row, then transpose",
        "Transpose, then reverse each row",
        "Transpose twice",
        "Reverse each column twice",
      ],
      1,
      "O(n^2) time and O(1) space. Counter-clockwise: transpose, then reverse each column.",
    ),
    mcq(
      "In 'set matrix zeroes' with O(1) extra space, where are the markers stored?",
      ["In a hash set", "In the first row and first column", "In a second matrix", "In the recursion stack"],
      1,
    ),
    mcq(
      "What is C(n, r) computed by `res = res * (n - i) // (i + 1)` for i in 0..r-1?",
      [
        "It loses precision for large n",
        "It is exact, because the division is exact at every step",
        "An approximation",
        "Only correct for r = 1",
      ],
      1,
      "After step i the value is C(n, i+1), an integer, so the floor division never drops a remainder. `math.comb` is the built-in version.",
    ),
  ],
  eng: [
    mcq(
      "What is the profiling workflow the notes recommend?",
      [
        "Optimise the code you suspect, then measure",
        "Benchmark a baseline, profile, change one thing, re-benchmark, keep it only if the numbers improve",
        "Rewrite it in another language first",
        "Only look at the heap profile",
      ],
      1,
    ),
    blank(
      "`python3 -m ___ -o prof.out script.py` profiles a script with the standard library's deterministic profiler.",
      ["cProfile|cprofile"],
      "Read the result with `python3 -m pstats prof.out`, or use py-spy for a flame graph of a running process.",
    ),
    mcq(
      "Why is `pytest.mark.parametrize` popular for tests?",
      [
        "It runs faster",
        "A new case is one line, and each case is reported separately by its id so it can be run alone",
        "It avoids needing assertions",
        "pytest requires it",
      ],
      1,
    ),
    match(
      "Match the semantic-versioning bump to when it applies.",
      [
        ["MAJOR", "incompatible API change"],
        ["MINOR", "backward-compatible feature"],
        ["PATCH", "backward-compatible bug fix"],
      ],
      "A Python package keeps its version in pyproject.toml, following PEP 440, and the git tag matches it (v1.0.0).",
    ),
  ],
});
