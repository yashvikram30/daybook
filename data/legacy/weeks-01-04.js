// Weeks 1-4. The systems track is written in Python from the first day, and Python itself is taught on a ladder:
// one numbered "Python lesson" per day (see src/data/py-path.ts), preceded by a "Python basics" item and a short
// warm-up on the first days. Everything is written in Python. Where Python hides the machine, the build steps
// reach it through ctypes, dis, os and the other standard-library modules instead of a second language.
WEEKS.push(
  {
    n: 1,
    phase: "arch",
    title: "The machine, in Python",
    summary:
      "Learn Python from the first day, starting with the basics, while you look at the machine under it: how numbers and objects live in memory, and the bytecode the interpreter runs.",
    project:
      "Annotated bytecode listings of five small functions, traced in a debugger, plus a set of small basics programs.",
    days: [
      {
        t: "Toolchain, Python basics and the memory behind them",
        why: "Everything later is built in Python. If you finished Python Foundations, the basics below are revision, so spend your time on the toolchain and on the new idea of this week: every value is an object, a chunk of memory with a size and an address. If you did not, do the basics first and treat the memory work as the stretch.",
        main: [
          D(
            "Install Python 3.13 with uv",
            "https://docs.astral.sh/uv/getting-started/installation/",
            "Then run `uv python install 3.13` and `python3 --version`.",
          ),
          L(
            "Python lesson 1: The Python Tutorial, introduction to control flow",
            "https://docs.python.org/3/tutorial/introduction.html",
            "Read sections 3 to 4: numbers, strings, lists, if, for, range, functions. Know: how `//`, `%` and `**` differ, how slicing works, and what a default argument does. Try: type every example into a REPL and change one thing in each. Revision if you did Foundations weeks 1 and 2: skim it in 10 minutes. Keep the library reference (docs.python.org/3/library) open.",
          ),
          L(
            "Python basics: Automate the Boring Stuff, chapters 1 to 3",
            "https://automatetheboringstuff.com/3e/chapter1.html",
            "Revision if you finished Python Foundations; otherwise your main text for this week. Written for people who have never programmed: expressions, variables, flow control and functions, with exercises. Do the practice questions at the end of each chapter before moving on.",
          ),
          L(
            "Python basics: Exercism Python track, Basics concept group",
            "https://exercism.org/tracks/python/concepts",
            "Small, checked exercises. Do the first five or six today and keep the track as your daily warm-up for the first week.",
          ),
          R(
            "Computer Systems: A Programmer's Perspective (CS:APP)",
            "https://csapp.cs.cmu.edu/",
            "Your main book for weeks 1 and 2.",
          ),
          D(
            "pdb: the Python debugger",
            "https://docs.python.org/3/library/pdb.html",
            "Call `breakpoint()` anywhere. It stops the program on that line so you can look inside it.",
          ),
          L(
            "Lima: Linux VMs on macOS",
            "https://lima-vm.io/",
            "Install now. Weeks 3-4 need real Linux (strace, /proc, fork semantics).",
          ),
        ],
        build: [
          "Basics warm-up (45 min; if you finished Python Foundations this should take 15), in the REPL and then in `basics.py`: store your name and age in variables and print a sentence with an f-string; read a number with `input()` and `int()`; write FizzBuzz with a `for` loop and `if`/`elif`/`else`; write a `while` loop that asks until the input is valid; write a function `is_even(n)` with a docstring; and count the words in a text file with `open()` and `with`.",
          "Words for this step: an object is a value plus its bookkeeping, stored in memory; its id is where it lives; a reference count is how many names point at it. Run `uv init` in a new folder. Write `types.py` that prints `sys.getsizeof` of an int (0, 1, 2**30, 2**100), a float, a str, a bytes, a list, a dict and a tuple, and `id()` of a local, a module variable and a freshly created object.",
          "Find which names share an object: compare `a is b` for small ints, equal strings and equal lists, and watch `sys.getrefcount` change as you add names. Write down why.",
          "Add one test file with a single `def test_even(): assert is_even(4)`. Run `pytest`, `ruff check` and `ruff format --check`: they replace a Makefile. Lesson 4 teaches pytest properly; today one assert is enough (Foundations day 4.3 covered it).",
          "Raw sizes (20 min): use `ctypes.sizeof` on `c_int`, `c_long`, `c_double` and `c_void_p`, and compare each number with `sys.getsizeof` of the matching Python value. The difference is the object header.",
        ],
        ship: "Folder 01-architecture/ with basics.py, ex1-types and a 5-line note on what surprised you.",
        swe: {
          t: "Git: commits, branches, history",
          link: R(
            "Pro Git, chapters 1-2",
            "https://git-scm.com/book/en/v2",
            "Commit after every working step from now on.",
          ),
        },
        ask: [
          "Why does `sys.getsizeof(0)` report more bytes than the 4 a 32-bit integer needs, and what is in the extra bytes?",
          "In CPython, `id(x)` is the address of an object. What decides when two names share one object?",
        ],
      },
      {
        t: "How numbers live in memory",
        why: "Integers, floats and endianness explain whole classes of bugs, and lists show how Python wraps raw memory.",
        main: [
          L(
            "Python lesson 2: The Python Tutorial, data structures",
            "https://docs.python.org/3/tutorial/datastructures.html",
            "Read section 5: list methods, comprehensions, tuples, sets, dictionaries and looping techniques. Know: which operations are O(1) and which are O(n), why a list is a poor queue, and when to reach for `dict`, `set` or `collections.deque`. Try: write a word counter three ways (plain dict, `dict.get`, `Counter`). This revises Foundations days 2.3, 2.4 and 3.1, so read for the details you skipped.",
          ),
          L(
            "Python basics: Automate the Boring Stuff, chapters 4 to 6",
            "https://automatetheboringstuff.com/3e/chapter4.html",
            "Lists, dictionaries and strings, with the practice questions. Slicing, `in`, `.split()`, `.join()` and `.format()` are used in every later week.",
          ),
          R(
            "Python FAQ: how are lists implemented in CPython?",
            "https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython",
            "A list is a pointer to an array of pointers, with a length and an allocated size. Read it before you write any code today.",
          ),
          R(
            "CS:APP chapter 2: representing information",
            "https://csapp.cs.cmu.edu/",
            "Two's complement, overflow, IEEE 754.",
          ),
          V("Floating Point Numbers - Computerphile", "PZRI1IfStY0", "9 min."),
          L("float.exposed", "https://float.exposed/", "Flip bits and watch the value change."),
          D(
            "struct: interpret bytes as packed binary data",
            "https://docs.python.org/3/library/struct.html",
            "Compare your versions against `int.bit_count` and `struct`.",
          ),
        ],
        build: [
          "Basics warm-up (30 min): reverse a string two ways (slicing and a loop); count how often each letter appears in a sentence with a dict; remove duplicates from a list with a set and keep the original order; and sort a list of (name, score) tuples by score with `sorted(..., key=...)`.",
          "Print any int and any float as binary with `format(n, 'b')` and `struct.pack('>d', x)`. Check against float.exposed.",
          "Implement popcount, is-power-of-two and an endianness check yourself. Then compare with `int.bit_count`, `sys.byteorder` and `int.to_bytes`.",
          "Show that Python ints never overflow, then wrap results to 8, 32 and 64 bits with a mask to match fixed-width hardware integers. Show that `0.1 + 0.2` from variables is not `0.3`.",
          "Write a function that appends to a list in a loop. Print `sys.getsizeof` each time and find where it reallocates.",
          "Check your masks against hardware integers: `ctypes.c_int8(200).value`, `ctypes.c_int32(2**31).value` and `ctypes.c_uint8(-1).value` wrap the way a register does, while the same arithmetic on Python ints just grows.",
        ],
        ship: "bits.py with tests, a short note on fixed-width wrap-around, and a note on why 0.1 + 0.2 != 0.3.",
        swe: {
          t: "How git stores things",
          link: V(
            "Inside the Hidden Git Folder - Computerphile",
            "bSA91XTzeuA",
            "Blobs, trees, commits, refs.",
          ),
        },
        ask: [
          "Why can a float represent 2^53 + 1 incorrectly but still be exact for 0.5?",
          "What does -1 look like in an 8-bit register, and why does it make addition circuits simple?",
          "Two Python names refer to one list. What goes wrong when one of them appends?",
        ],
      },
      {
        t: "Machine code and assembly",
        why: "See what the interpreter does with your code, instruction by instruction, and what a method call costs, then compare with real machine code.",
        main: [
          L(
            "Python lesson 3: The Python Tutorial, classes",
            "https://docs.python.org/3/tutorial/classes.html",
            "Read section 9: classes, instances, inheritance, iterators and generators. Know: what `self` is, what `__init__` and `__repr__` do, and how a generator pauses at `yield`. Try: write a class with `__iter__` and `__next__`, then the same thing as a generator in four lines. Classes were Foundations days 4.1 and 4.2, so the last two sections (iterators and generators) are the new part.",
          ),
          L(
            "Python basics: Automate the Boring Stuff, chapters 7 to 9",
            "https://automatetheboringstuff.com/3e/chapter7.html",
            "Reading and writing files, handling errors with try/except, and organising code into functions and modules. Revision of Foundations days 3.2 and 3.3; skim what you already know.",
          ),
          D(
            "dis: disassembler for Python bytecode",
            "https://docs.python.org/3/library/dis.html",
            "Bytecode is the list of small steps Python turns your code into before running it. You only need to read it, not write it. Skim the opcode list, then disassemble your own functions with `python3 -m dis file.py`.",
          ),
          R(
            "CS:APP chapter 3: machine-level representation",
            "https://csapp.cs.cmu.edu/",
            "Registers, addressing modes, control flow.",
          ),
          V(
            "The Central Processing Unit (CPU): Crash Course Computer Science #7",
            "FZGugFqdr60",
            "Fetch, decode, execute.",
          ),
          D(
            "Arm Cortex-A programmer's guide for ARMv8-A",
            "https://developer.arm.com/documentation/den0024/latest",
            "Your Mac runs this ISA; skim registers and instruction groups.",
          ),
        ],
        build: [
          "Basics warm-up (30 min): write a small class `Counter` with `__init__`, an `increment` method and a `__repr__`, then a function that reads a file of numbers, skips blank lines with `try`/`except ValueError`, and returns the total.",
          "Write 5 tiny Python functions: add, max, sum-a-list loop, attribute access on an instance, and a method called through a class hierarchy.",
          "Disassemble each with `dis.dis`. Call a function a few thousand times, then disassemble again with `dis.dis(f, adaptive=True)` and watch instructions specialise.",
          "Find the instruction an attribute lookup or method call makes, and the one that does a list index with its bounds check.",
          "Annotate every line of one function's bytecode, using the dis docs for each opcode.",
          "Time `a + b` on ints, floats and strings with `timeit`, divide by the bytecode count, and estimate the cost per instruction. The interpreter loop that runs each bytecode is itself machine code.",
        ],
        ship: "annotated.md: one function, each instruction explained in plain English.",
        swe: {
          t: "Let the toolchain check you",
          link: D(
            "Ruff: linter and formatter",
            "https://docs.astral.sh/ruff/",
            "Run `ruff check` and `ruff format` on everything from now on and fix each finding. Add mypy once you have type hints.",
          ),
        },
        ask: [
          "What does the adaptive interpreter change after a function has run many times, and why does the specialised bytecode sometimes look unrelated to your source?",
          "How many bytecode instructions does `a + b` take, and how much machine work does the interpreter do for each of them compared with one `ADD` machine instruction?",
        ],
      },
      {
        t: "Stack frames and the calling convention",
        why: "Function calls are the contract between every piece of software on the machine. Python and the hardware keep that contract differently.",
        main: [
          L(
            "Python lesson 4: pytest, the first chapters",
            "https://docs.pytest.org/en/stable/getting-started.html",
            "Read: your first test, the assertion output, fixtures and `parametrize`. Know: tests are plain functions starting with `test_`, a failing `assert` shows both values, and a fixture builds the thing a test needs. Try: write the test first for `is_even`, watch it fail, then make it pass, then parametrize it over six inputs. Foundations day 4.3 covered the first steps, so go straight to fixtures and parametrize.",
          ),
          R(
            "What's new in Python 3.11: faster CPython",
            "https://docs.python.org/3/whatsnew/3.11.html#faster-cpython",
            "Cheaper frames and inlined Python-to-Python calls. Skim the sections on frames.",
          ),
          R(
            "inspect: the interpreter stack",
            "https://docs.python.org/3/library/inspect.html#the-interpreter-stack",
            "Frames are objects you can read: `inspect.stack()`, `f_locals`, `f_back`.",
          ),
          D(
            "Arm 64-bit procedure call standard (AAPCS64)",
            "https://github.com/ARM-software/abi-aa/blob/main/aapcs64/aapcs64.rst",
            "The register convention compiled code follows, and the one the interpreter itself uses. Which registers carry arguments and return values.",
          ),
        ],
        build: [
          "Step through a recursive factorial in pdb (`breakpoint()`, then `where`, `up`, `down`, `args`, `next`, `step`). Note each frame's locals.",
          "Recurse past the default limit and read the `RecursionError`. Raise it with `sys.setrecursionlimit` and find how deep your build goes. Explain why Python guards recursion instead of letting the stack run out.",
          "Draw the stack for a three-deep call chain with locals and saved registers, once as CPython frames and once as machine registers and stack slots (AAPCS64).",
          "Memory bugs Python prevents (30 min): write the Python version of an out-of-bounds write, a read of an uninitialised variable and a use of an object after you dropped the last name. Trigger each, and write down the exception it raises (`IndexError`, `UnboundLocalError`, or none because the object is still alive).",
        ],
        ship: "weekly/week-01.md: what you built, what broke, and your answers to the check questions.",
        swe: {
          t: "Debug with a debugger, not print statements",
          link: D(
            "pdb command reference",
            "https://docs.python.org/3/library/pdb.html#debugger-commands",
            "Learn break, continue, next, step, print and where.",
          ),
        },
        ask: [
          "What exactly is on the stack when function B is called from A, and who cleans it up?",
          "Why does an out-of-bounds write on a machine stack overwrite a return address and not a random location, and what does Python do when you index past the end?",
        ],
      },
    ],
  },
  {
    n: 2,
    phase: "arch",
    title: "Memory, caches and a tiny CPU",
    summary:
      "Understand why memory access dominates performance, how virtual memory works, and build a CPU emulator in Python.",
    project: "A CHIP-8 emulator in Python that passes a community test ROM suite.",
    days: [
      {
        t: "The memory hierarchy and caches",
        why: "Locality explains most real-world performance surprises. NumPy arrays and timeit make it easy to see.",
        main: [
          R(
            "Python lesson 5: PEP 8, the style guide",
            "https://peps.python.org/pep-0008/",
            "Read: code layout, naming conventions, whitespace, comments, programming recommendations. Know: `snake_case` for functions, `CapWords` for classes, four-space indents, `is None` rather than `== None`, no bare `except:`. Try: run `ruff check` and `ruff format` on your week 1 code and fix every message. You will come back to this each week.",
          ),
          D(
            "timeit: measure execution time",
            "https://docs.python.org/3/library/timeit.html",
            "`python3 -m timeit` and `timeit.repeat`. Also look at the pytest-benchmark plugin.",
          ),
          V("How CPU Memory & Caches Work - Computerphile", "SAk-6gVkio0", "35 min."),
          R(
            "CS:APP chapter 6: the memory hierarchy",
            "https://csapp.cs.cmu.edu/",
            "Locality, cache organisation, the memory mountain.",
          ),
          R(
            "What Every Programmer Should Know About Memory (Drepper)",
            "https://people.freebsd.org/~lstewart/articles/cpumemory.pdf",
            "Sections 1-3 for now.",
          ),
          R(
            "CMU 15-213 lectures and slides",
            "https://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html",
            "Pair with chapter 6.",
          ),
        ],
        build: [
          "Write a benchmark with NumPy that sums a 4096x4096 matrix row-wise and another that sums it column-wise. Use `timeit` and compare C-order with Fortran-order arrays.",
          "Vary the stride over a large array from 1 to 1024 and plot time per access.",
          "Explain the knees in your plot using your CPU's cache sizes (`sysctl hw.l1dcachesize` etc).",
          "Benchmark traversing a linked list of Python objects against a list and against an `array.array` of the same 1M ints, and explain what the interpreter adds.",
        ],
        ship: "cache-experiments/ with Python benchmarks, a plot and a paragraph interpreting it.",
        swe: {
          t: "Profiling mindset",
          link: R(
            "The Python profilers",
            "https://docs.python.org/3/library/profile.html",
            "Measure before you guess: `python3 -m cProfile -s cumtime script.py`, and py-spy for a running process.",
          ),
        },
        ask: [
          "Why is a linked list slower than an array even when both are O(n) to traverse?",
          "What is false sharing and which hardware fact causes it?",
        ],
      },
      {
        t: "Virtual memory",
        why: "Every address you print is virtual. Learn how it becomes a physical address, and how to ask the kernel for memory yourself.",
        main: [
          R(
            "Python lesson 6: errors and exceptions",
            "https://docs.python.org/3/tutorial/errors.html",
            "Read section 8: handling, raising, chaining (`raise ... from`), your own exception classes, and `finally`. Know: catch the narrowest exception that works, `FileNotFoundError` and `PermissionError` are subclasses of `OSError`, and `finally` always runs. Try: open a path that does not exist and handle it three different ways. Foundations day 3.3 covered try and except; the new parts are chaining and the OSError hierarchy. Every system call can fail.",
          ),
          D(
            "mmap: memory-mapped file support",
            "https://docs.python.org/3/library/mmap.html",
            "Anonymous and file-backed mappings, straight from the standard library.",
          ),
          V("What's Virtual Memory? - Computerphile", "5lFnKYCZT5o", "23 min."),
          V(
            "Virtual memory and page faults (Gate Smashers)",
            "o2_iCzS9-ZQ",
            "Watch at 1.5x. The first pass; OSTEP below is the second.",
          ),
          R("OSTEP: Address spaces", "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf", "Chapter 13."),
          R(
            "OSTEP: Paging introduction",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf",
            "Chapter 18.",
          ),
          R(
            "OSTEP: Translation lookaside buffers",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf",
            "Chapter 19.",
          ),
          V(
            "Page replacement and FIFO (Gate Smashers)",
            "8rcUs5RutX0",
            "Gate Smashers, Operating System playlist. Work each example on paper before the video does.",
          ),
          V(
            "Belady's anomaly (Gate Smashers)",
            "pR1uhp--COc",
            "More frames, more faults, under FIFO.",
          ),
          V(
            "Optimal page replacement (Gate Smashers)",
            "q2BpMvPhhrY",
            "The best possible policy, which needs to see the future. It is the yardstick.",
          ),
          V(
            "Least recently used page replacement (Gate Smashers)",
            "dYIoWkCvd6A",
            "Least recently used: the practical policy that optimal is measured against.",
          ),
          R(
            "OSTEP: Beyond physical memory: policies",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
            "Chapter 22: FIFO, random, LRU, approximating LRU with the clock algorithm, and thrashing.",
          ),
        ],
        build: [
          "Print `id()` of a function, a module variable, a heap object and a local. Sketch the layout. Note that these are real addresses in CPython, and compare with `ctypes.addressof`.",
          "`mmap.mmap(-1, 1 << 30)` an anonymous 1 GB region, touch one page at a time, and watch resident memory with `resource.getrusage`.",
          "Measure minor page faults with `/usr/bin/time -l` and `ru_minflt`.",
          "Catch the `OSError` from a bad mmap and re-raise it with context using `raise ... from err`.",
          "Write a page-replacement simulator for FIFO, optimal, LRU and clock. Run `1 2 3 4 1 2 5 1 2 3 4 5` with 3 and then 4 frames and show Belady's anomaly under FIFO. Plot faults against frames for a looping and a random reference string.",
        ],
        ship: "vm-experiments/ in Python and an address-space diagram of your own process.",
        swe: {
          t: "Write your notes as you go",
          link: R(
            "Google technical writing: one",
            "https://developers.google.com/tech-writing/one",
            "Short, free course; do one unit this week.",
          ),
        },
        ask: [
          "What happens on a page fault, step by step, from the instruction that faulted to the instruction that retries?",
          "Why do two processes see the same virtual address with different contents?",
          "Why can FIFO get worse with more frames, and why can LRU not? What does the clock algorithm approximate, and what is thrashing?",
        ],
      },
      {
        t: "Build a CPU emulator, part 1",
        why: "The fastest way to learn fetch-decode-execute is to write it, and an emulator is a good size of Python program.",
        main: [
          L(
            "Python lesson 7: dataclasses and protocols",
            "https://docs.python.org/3/library/dataclasses.html",
            "Read the dataclasses intro, `field`, `frozen=True` and `slots=True`, then `typing.Protocol`. Know: a dataclass writes `__init__`, `__repr__` and `__eq__` for you, and a Protocol says what methods something must have without inheriting from anything. Try: model your CPU's registers as a dataclass and your instruction decoder behind a Protocol. Classes were Foundations day 4.2.",
          ),
          R(
            "How to write a CHIP-8 emulator (Langhoff)",
            "https://tobiasvl.github.io/blog/write-a-chip-8-emulator/",
            "Your spec for the next two days.",
          ),
          L("CHIP-8 test suite", "https://github.com/Timendus/chip8-test-suite", "Your acceptance tests."),
          D(
            "importlib.resources",
            "https://docs.python.org/3/library/importlib.resources.html",
            "Ship the test ROMs inside your package.",
          ),
          V("Registers and RAM: Crash Course Computer Science #6", "fpnE6UAfbtU", "12 min refresher."),
        ],
        build: [
          "Model 4 KB memory (a `bytearray`), 16 registers, index register, PC, stack and timers in one class.",
          "Implement fetch, decode and the first 15 opcodes. Run the IBM logo ROM.",
          "Render the 64x32 display to the terminal with ANSI escapes first. Add pygame (pygame.org) later if you want a window.",
        ],
        ship: "chip8/ emulator in Python that passes the IBM logo and the first test ROM.",
        swe: {
          t: "Parametrized tests",
          link: R(
            "pytest: parametrizing tests",
            "https://docs.pytest.org/en/stable/how-to/parametrize.html",
            "Test each opcode in isolation with a table of before and after states.",
          ),
        },
        ask: [
          "Which parts of your emulator are the 'CPU' and which are the 'machine' around it?",
          "How would you add interrupts to this design?",
        ],
      },
      {
        t: "Finish the CPU, then pipelines, interrupts and I/O",
        why: "Complete the emulator and connect it to how real CPUs execute faster.",
        main: [
          L(
            "Python lesson 8: type hints and mypy",
            "https://mypy.readthedocs.io/en/stable/getting_started.html",
            "Read getting started, then the type-hints cheat sheet. Know: annotate parameters and return values, write `X | None` for optional values, `list[int]` and `dict[str, int]` for containers, and that hints are not checked at run time, only by mypy. Try: annotate your emulator, run `mypy` on it, and fix every error without adding `# type: ignore`.",
          ),
          D(
            "tty and termios",
            "https://docs.python.org/3/library/tty.html",
            "Raw terminal mode, for key presses without waiting for Enter.",
          ),
          V(
            "Advanced CPU Designs: Crash Course Computer Science #9",
            "rtAlC5J1U40",
            "Pipelining, out-of-order, branch prediction.",
          ),
          V("How CPUs do Out Of Order Operations - Computerphile", "jNC9LPc3BI0", "24 min."),
          V(
            "8-bit CPU control logic: Part 1 (Ben Eater)",
            "dXdoim96v5A",
            "Optional: see a CPU built from chips.",
          ),
        ],
        build: [
          "Finish the remaining opcodes. Pass the flags and quirks test ROMs.",
          "Add keyboard input and a 60 Hz timer with `threading.Timer` or a monotonic-clock loop.",
          "Write a short note on what a pipeline hazard would mean for your emulator's design.",
        ],
        ship: "weekly/week-02.md plus a tagged `v1` of the emulator.",
        swe: {
          t: "Tag and release",
          link: R("Semantic Versioning", "https://semver.org/", "Tag your emulator v1.0.0."),
        },
        ask: [
          "Why does branch misprediction cost more on a deep pipeline?",
          "What is the difference between polling and an interrupt for keyboard input?",
        ],
      },
    ],
  },
  {
    n: 3,
    phase: "os",
    title: "Processes and the shell",
    summary:
      "Processes, system calls, the CPU scheduling algorithms (FCFS, SJF, priority, round robin, MLFQ) and inter-process communication, ending in a real Unix shell written in Python. Work inside a Linux VM this week.",
    project:
      "A shell in Python with pipes, redirection, background jobs and signal handling, built on the raw fork, exec and dup2 calls.",
    days: [
      {
        t: "Processes and system calls",
        why: "A process is the OS's unit of everything. Learn how they are created and how you talk to the kernel from Python.",
        main: [
          R(
            "Python lesson 9: running processes with subprocess",
            "https://docs.python.org/3/library/subprocess.html",
            "Read `run`, `CompletedProcess`, `Popen` and the security note on `shell=True`. Know: `subprocess.run(args, capture_output=True, text=True, check=True, timeout=5)` covers most needs, a non-zero `returncode` is not an exception unless `check=True`, and you pass a list, not a string. Try: run `ls`, `false` and a missing command, and print what each gives. Then skim the os module's process management section.",
          ),
          D(
            "os.fork, os.execvp and os.waitpid",
            "https://docs.python.org/3/library/os.html#process-management",
            "Python exposes the raw calls. subprocess is built on them, and mixing fork with threads is where it gets dangerous.",
          ),
          V(
            "Process states (Neso Academy)",
            "jZ_6PXoaoxo",
            "Neso Academy, Operating System series. Watch at 1.5x. New, ready, running, waiting, terminated, and which events move a process between them.",
          ),
          V(
            "The process control block (Neso Academy)",
            "4s2MKuVYKV8",
            "What the kernel stores per process, and so what a context switch must save.",
          ),
          V(
            "Process creation (Neso Academy)",
            "pSW9d3Oaie8",
            "Parent and child, fork, and how the process tree grows.",
          ),
          R(
            "OSTEP: The abstraction: the process",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf",
            "Chapter 4.",
          ),
          R(
            "OSTEP: Process API",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf",
            "Chapter 5: fork, exec, wait.",
          ),
          D(
            "strace(1) manual",
            "https://man7.org/linux/man-pages/man1/strace.1.html",
            "Run it on everything today.",
          ),
        ],
        build: [
          "Start your Linux VM (`limactl start`) and install Python inside it with uv.",
          "In Python, use `subprocess.run` to run `ls` and print its pid and exit status. Then do the same with `os.fork`, `os.execvp` and `os.waitpid` by hand.",
          "Run `strace -f` on your Python program and on `ls`. Identify clone, execve, openat, read and write.",
          "Fork a tree of 3 levels with `os.fork`, printing each `os.getpid()` and `os.getppid()`, then `os.execvp` a program in a child and `os.waitpid` for it. Compare the `strace -f` output with your `subprocess.run` version and note what the interpreter adds around each call.",
        ],
        ship: "os/ex1-fork with the Python programs and a strace annotation of one command.",
        swe: {
          t: "Command-line fluency",
          link: R(
            "The Missing Semester of Your CS Education (MIT)",
            "https://missing.csail.mit.edu/",
            "Do the shell, editors and debugging lectures this week.",
          ),
        },
        ask: [
          "What exactly does fork copy, and why is copy-on-write needed?",
          "Why are fork and exec separate calls, and what does that make possible for a shell?",
          "Why is calling `os.fork` from a multithreaded Python program risky?",
        ],
      },
      {
        t: "Scheduling and context switching",
        why: "How the OS shares one CPU among many programs, what that costs, and how Python's threads and asyncio sit on top of it.",
        main: [
          L(
            "Python lesson 10: threads and asyncio",
            "https://docs.python.org/3/library/asyncio-task.html",
            "Read coroutines and tasks: `async def`, `await`, `create_task`, `gather`, then `asyncio.Queue`. Know: one thread runs many tasks and switches only at `await`, so a blocking call such as `time.sleep` stalls everything (use `asyncio.sleep` or `asyncio.to_thread`). Try: fetch ten fake slow jobs sequentially, then with `gather`, and time both. Then skim the threading docs and compare the two models.",
          ),
          R(
            "Async IO in Python: a complete walkthrough (Real Python)",
            "https://realpython.com/async-io-python/",
            "How an event loop multiplexes many tasks onto one thread, and where it still depends on the OS scheduler.",
          ),
          R(
            "OSTEP: Limited direct execution",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf",
            "Chapter 6.",
          ),
          V(
            "Introduction to CPU scheduling (Neso Academy)",
            "EWkQl0n0w5M",
            "Neso Academy, Operating System series. Watch at 1.5x. Then preemptive versus non-preemptive, and the criteria: throughput, turnaround, waiting and response time.",
          ),
          V(
            "First come first served (Neso Academy)",
            "7DoP1L9nAAs",
            "Gantt charts, waiting time and the convoy effect. Do the solved problem yourself before watching the answer.",
          ),
          V(
            "Shortest job first (Neso Academy)",
            "t0g9b3SJECg",
            "The optimal average waiting time, and the preemptive variant (shortest remaining time first).",
          ),
          V(
            "Priority scheduling (Neso Academy)",
            "yKD3pcFvGmY",
            "Starvation, and aging as the fix.",
          ),
          V(
            "Round robin (Neso Academy)",
            "7TpxxTNrcTg",
            "The time quantum, and turnaround versus waiting time.",
          ),
          V(
            "Multilevel feedback queue (Neso Academy)",
            "1KLuC0knvs8",
            "How jobs move between queues without anyone knowing their length.",
          ),
          R("OSTEP: CPU scheduling", "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf", "Chapter 7."),
          R(
            "OSTEP: Multi-level feedback queue",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf",
            "Chapter 8.",
          ),
          V("OS Context Switching - Computerphile", "DKmBRl8j3Ak", "15 min."),
        ],
        build: [
          "Write a scheduler simulator in Python for FCFS, SJF, shortest remaining time first, priority with aging, round robin and a small MLFQ behind one `Protocol`. Print a Gantt chart and report average turnaround, waiting and response time. Check it against the solved problems in the Neso videos.",
          "Measure switch cost with a ping-pong over two `queue.Queue`s between threads, over two asyncio tasks, then over two pipes between two processes (re-run your own script with `subprocess`).",
          "In the Linux VM, pin the process pair to one core with `taskset` and compare. Try `os.sched_setaffinity` for the thread version.",
        ],
        ship: "sched-sim/ with a table of results and one paragraph on why RR wins on response time.",
        swe: {
          t: "Measure, then claim",
          link: R(
            "Latency numbers every programmer should know",
            "https://gist.github.com/jboner/2841832",
            "Compare to your own measurements.",
          ),
        },
        ask: [
          "What does the OS save and restore on a context switch, and what is the hidden cost beyond that?",
          "Why does MLFQ approximate SJF without knowing job lengths?",
          "Which of FCFS, SJF, priority and round robin can starve a job, which suffers the convoy effect, and how do aging and the time quantum change that?",
          "Why is switching asyncio tasks cheaper than switching threads, and what does the event loop still need the OS for?",
        ],
      },
      {
        t: "Build a shell, part 1",
        why: "A shell is the smallest program that uses most of the process API, and a good place to practise Python's file-descriptor and stream tools.",
        main: [
          L(
            "Python lesson 11: files, streams and context managers",
            "https://docs.python.org/3/tutorial/inputoutput.html",
            "Read the tutorial's reading and writing files section, then the io module overview. Know: `with open(...)` closes the file for you, text mode needs an `encoding`, binary mode gives `bytes`, and iterating a file gives lines lazily. Try: write a function that copies a file in 4 KB chunks, then write a `@contextlib.contextmanager` that times a block. File objects and `with` are how Python programs plug together, and a shell is mostly wiring them up.",
          ),
          V(
            "fork() and exec() system calls (Neso Academy)",
            "IFEFVXvjiHY",
            "Neso Academy, Operating System series. Watch at 1.5x. Short, and exactly what the shell does.",
          ),
          D(
            "subprocess.Popen",
            "https://docs.python.org/3/library/subprocess.html#popen-constructor",
            "stdin, stdout, stderr, cwd, env, and shutil.which for lookups.",
          ),
          R(
            "OSTEP shell project notes",
            "https://github.com/remzi-arpacidusseau/ostep-projects/tree/master/processes-shell",
            "A spec with test cases; the tests do not care which language you use.",
          ),
          D(
            "execvp(3) and friends",
            "https://man7.org/linux/man-pages/man3/exec.3.html",
            "Know the variants; `os.execv`, `os.execvp` and `os.execve` map onto them.",
          ),
        ],
        build: [
          "Read-eval loop with `input()` or `sys.stdin` and a tokenizer that handles quotes (try `shlex.split` last, after writing your own).",
          "Run commands with `subprocess.Popen`. Builtins: `cd` (`os.chdir`), `exit`, `pwd`.",
          "Output redirection with `>` by opening a file and passing it as `stdout=`.",
          "Do the same redirection by hand: `os.fork`, then `os.dup2` the file's descriptor onto 1 in the child, then `os.execvp`. Compare it with what `stdout=` does for you.",
        ],
        ship: "shell/ v0 in Python passing the OSTEP processes-shell tests where applicable.",
        swe: {
          t: "Lint your shell scripts",
          link: L("ShellCheck", "https://www.shellcheck.net/", "Paste every script you write."),
        },
        ask: [
          "Why must `cd` be a builtin?",
          "What does dup2 do to the file descriptor table, before and after, and what does passing stdout= do underneath?",
        ],
      },
      {
        t: "Pipes, signals and job control",
        why: "Finish the shell and learn how processes talk and stop each other.",
        main: [
          L(
            "Python lesson 12: signals and selectors",
            "https://docs.python.org/3/library/signal.html",
            "Read the signal module intro and the note on handlers. Know: `signal.signal(SIGINT, handler)` installs a handler, handlers run in the main thread between bytecodes, SIGKILL cannot be caught, and Ctrl-C is just SIGINT turned into `KeyboardInterrupt`. Try: make a script that prints a summary on SIGINT and exits cleanly. Then read the selectors module for waiting on several file descriptors at once.",
          ),
          D(
            "os.pipe, os.setpgid and os.killpg",
            "https://docs.python.org/3/library/os.html#process-management",
            "The raw calls behind pipelines and process groups.",
          ),
          R(
            "OSTEP: Interlude: Process API (pipes section)",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf",
            "Re-read the part on pipe and how a shell wires two processes together.",
          ),
          V(
            "Interprocess communication (Neso Academy)",
            "dJuYKfR8vec",
            "Neso Academy, Operating System series. Watch at 1.5x. Shared memory versus message passing, the two models behind pipes, queues and sockets.",
          ),
          V(
            "Message passing systems (Neso Academy)",
            "LuuSXWkDJOo",
            "Direct and indirect communication, blocking and non-blocking send and receive.",
          ),
          D(
            "signal(7)",
            "https://man7.org/linux/man-pages/man7/signal.7.html",
            "Which signals can be caught, blocked or ignored.",
          ),
          V("Understanding Zombie Processes!", "xJ8KenZw2ag", "Jacob Sorber."),
          L("Julia Evans: Bite Size Linux zines", "https://wizardzines.com/", "Browse the free pages."),
        ],
        build: [
          "Pipelines: `a | b | c` with `os.pipe` or `Popen(stdout=PIPE)`, started in order and waited on.",
          "Background jobs with `&`. Reap them with `os.waitpid(-1, os.WNOHANG)` or a waiter thread so there are no zombies.",
          "Ctrl-C kills the foreground job but not your shell: catch SIGINT with `signal.signal` and put each job in its own process group with `start_new_session=True` or `os.setpgid`.",
          "Send the same 1 MB message between two processes in two ways: through a pipe (message passing) and through `multiprocessing.shared_memory` (shared memory). Time both and note what the shared-memory version needs that the pipe gives you for free.",
        ],
        ship: "shell/ v1 and weekly/week-03.md.",
        swe: {
          t: "Read other people's code",
          link: R(
            "Code Reading (Spinellis) overview",
            "https://www.spinellis.gr/codereading/",
            "Read the dash or busybox ash source for ten minutes.",
          ),
        },
        ask: [
          "In `a | b`, who creates the pipe and in which order are the processes started?",
          "What happens to a child whose parent never calls wait?",
          "When do you choose shared memory over message passing, and what does each give up?",
        ],
      },
    ],
  },
  {
    n: 4,
    phase: "os",
    title: "Threads, memory allocators and filesystems",
    summary:
      "Python threads and the GIL, critical sections, semaphores, the classic synchronization problems and deadlock (banker's algorithm), a malloc with placement policies written over a bytearray, disk scheduling, and how files survive crashes.",
    project:
      "A thread worker pool, a first-fit malloc and a size-class allocator over bytearrays, and a crash-consistency experiment.",
    days: [
      {
        t: "Threads and locks",
        why: "Create a race on purpose, then learn what it takes to fix it, and what the GIL does and does not protect.",
        main: [
          L(
            "Python lesson 13: threading, locks and the GIL",
            "https://docs.python.org/3/library/threading.html",
            "Read `Thread`, `Lock`, `RLock` and `Event`. Know: use `with lock:` so it is always released, a thread should be joined or be a daemon, and the GIL lets one thread run Python bytecode at a time but can switch between any two bytecodes (check `sys.getswitchinterval()`). Try: start four threads and join them. Then Beazley's talk below on what the GIL really does.",
          ),
          R(
            "Understanding the Python GIL (David Beazley)",
            "https://www.dabeaz.com/python/UnderstandingGIL.pdf",
            "Why threads do not speed up CPU-bound Python, and why `counter += 1` is still a race.",
          ),
          V(
            "Introduction to threads (Neso Academy)",
            "LOfGJcVnvAk",
            "Neso Academy, Operating System series. Watch at 1.5x. What a thread shares with its process and what it owns.",
          ),
          V(
            "Multithreading models (Neso Academy)",
            "HW2Wcx-ktsc",
            "Many-to-one, one-to-one and many-to-many, which is how to think about CPython threads, the GIL and asyncio.",
          ),
          V(
            "The critical-section problem (Neso Academy)",
            "UtEORPakw5Y",
            "Mutual exclusion, progress and bounded waiting: the three rules every lock must meet.",
          ),
          V(
            "Peterson's solution (Neso Academy)",
            "gYCiTtgGR5Q",
            "A software-only lock for two threads. You will build it below.",
          ),
          V(
            "Test and set lock (Neso Academy)",
            "5oZYS5dTrmk",
            "The hardware instruction that real locks are built from.",
          ),
          R(
            "OSTEP: Concurrency introduction",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf",
            "Chapter 26.",
          ),
          R("OSTEP: Thread API", "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-api.pdf", "Chapter 27."),
          R("OSTEP: Locks", "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf", "Chapter 28."),
        ],
        build: [
          "Four threads increment a shared counter 1M times. Use `sys.setswitchinterval(1e-6)` if needed to show the wrong total, and `dis` to show where `counter += 1` can be interrupted.",
          "Fix with a `threading.Lock`, then with one counter per thread added at the end, then with a `queue.Queue` and a single owner thread. Time all four.",
          "Run the CPU-bound version with 1 thread, 4 threads and 4 processes (`multiprocessing`). Read the numbers against what Beazley says about the GIL.",
          "Count how many updates each version loses over 20 runs and record the spread. A race is a distribution, not a single failure.",
          "Write Peterson's algorithm for two threads with shared `flag` and `turn`, use it to protect the counter, and check it against the three critical-section rules. Then build a spinlock from a single atomic step (`list.pop` or `Lock.acquire(blocking=False)` stands in for test-and-set) and say why it wastes CPU.",
        ],
        ship: "os/ex2-race in Python with a timing table.",
        swe: {
          t: "Testing concurrent code",
          link: R(
            "concurrent.futures",
            "https://docs.python.org/3/library/concurrent.futures.html",
            "Executors and futures give you structured shapes for concurrent work. You will use them in every later week.",
          ),
        },
        ask: [
          "Why can `counter += 1` lose updates even on a single core, and even with the GIL?",
          "What does a lock cost when uncontended, and when contended?",
          "How is a Python thread different from an asyncio task, and from a process?",
          "State the three requirements of a critical-section solution and show that Peterson's algorithm meets each.",
        ],
      },
      {
        t: "Semaphores, classic problems and deadlock",
        why: "Coordinate threads and tasks without spinning, solve the classic synchronization problems, and learn how an OS prevents, avoids and detects deadlock.",
        main: [
          L(
            "Python lesson 14: asyncio cancellation and timeouts",
            "https://docs.python.org/3/library/asyncio-task.html#timeouts",
            "Read `TaskGroup`, `asyncio.timeout` and the cancellation section. Know: `CancelledError` is how a task is told to stop, you should let it propagate (re-raise it) after cleanup in `finally`, and a `TaskGroup` cancels its siblings when one fails. Try: run three tasks, make one raise, and watch the others get cancelled. Every task you start needs a way to stop.",
          ),
          D(
            "threading.Condition",
            "https://docs.python.org/3/library/threading.html#condition-objects",
            "Python's condition variable. It is what OSTEP chapter 30 describes, and queue.Queue is built on it.",
          ),
          R(
            "OSTEP: Condition variables",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf",
            "Chapter 30.",
          ),
          V(
            "Semaphores (Neso Academy)",
            "XDIOC2EY5JE",
            "Neso Academy, Operating System series. Watch at 1.5x. Wait and signal, binary versus counting.",
          ),
          V(
            "The bounded buffer problem (Neso Academy)",
            "Qx3P2wazwI0",
            "Producer and consumer with three semaphores.",
          ),
          V(
            "The readers-writers problem (Neso Academy)",
            "p2XDhW5INOo",
            "Many readers or one writer, and which side can starve.",
          ),
          V(
            "The dining philosophers problem (Neso Academy)",
            "FYUi-u7UWgw",
            "Five forks, and the deadlock waiting for you.",
          ),
          V(
            "Monitors (Neso Academy)",
            "ufdQ0GR855M",
            "The language-level lock plus condition variables that Python's `threading.Condition` gives you.",
          ),
          R("OSTEP: Semaphores", "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf", "Chapter 31."),
          V(
            "Deadlock and its four conditions (Gate Smashers)",
            "rWFH6PLOIEI",
            "Gate Smashers, Operating System playlist. Mutual exclusion, hold and wait, no preemption, circular wait.",
          ),
          V(
            "Resource allocation graph (Gate Smashers)",
            "BW74JYB3QOM",
            "Drawing the graph, and reading a cycle as a deadlock.",
          ),
          V(
            "Deadlock prevention (Gate Smashers)",
            "pPM9Ajqmy_4",
            "Break one of the four conditions. The overview of handling methods comes first.",
          ),
          V(
            "Deadlock avoidance: the banker's algorithm (Gate Smashers)",
            "7gMLNiEz3nw",
            "Safe states, the need matrix and the safety algorithm. Do the example by hand.",
          ),
          V(
            "Deadlock detection and recovery (Jenny's Lectures)",
            "2-7JGoy52Qo",
            "Wait-for graph for detection, and the options for recovery.",
          ),
          R(
            "OSTEP: Common concurrency problems",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf",
            "Chapter 32.",
          ),
        ],
        build: [
          "Bounded buffer with a `threading.Lock` and two `threading.Condition`s. Then rebuild it with `queue.Queue(maxsize=n)` and compare the code.",
          "Reproduce dining philosophers deadlock with threads, find the stuck threads with `faulthandler.dump_traceback_later`, then fix it with lock ordering.",
          "Build a fixed-size worker pool: N threads, a task queue, a sentinel or `threading.Event` to stop them, and a `concurrent.futures.ThreadPoolExecutor` version beside it.",
          "Break the bounded buffer on purpose by changing the `while` around `Condition.wait()` to an `if`, and write a test with several producers and consumers that catches it.",
          "Write the readers-writers problem with two semaphores and a reader count, first with readers preferred, and show a writer starving. Then add a fairness rule so writers get in.",
          "Implement the banker's algorithm: given `available`, `max` and `allocation` matrices, decide whether the state is safe, print a safe sequence, and decide whether a new request can be granted. Add a wait-for-graph cycle detector for the single-instance case and test both on the textbook examples.",
        ],
        ship: "os/ex3-threadpool in Python with tests and a deadlock write-up.",
        swe: {
          t: "Review code in pairs",
          link: R(
            "Google engineering practices: how to do a code review",
            "https://google.github.io/eng-practices/review/reviewer/",
            "Review your own worker pool as a reviewer would.",
          ),
        },
        ask: [
          "Why must a condition variable wait sit inside a `while`, not an `if`?",
          "State the four conditions for deadlock and which one lock ordering breaks.",
          "What is the difference between a safe state and a deadlock-free state, and why does the banker's algorithm refuse a request that would not deadlock yet?",
          "Which problem needs more than a mutex: bounded buffer, readers-writers or dining philosophers? Why?",
        ],
      },
      {
        t: "Write a memory allocator",
        why: "Python hides the heap behind reference counting and its own allocator, so this is the day to build the allocator yourself, over a `bytearray`: it makes heaps, fragmentation and free lists concrete.",
        main: [
          L(
            "Python lesson 15: how Python manages memory",
            "https://docs.python.org/3/library/gc.html",
            "Read the gc module page, then the CPython garbage collector design notes in the developer guide. Know: every object has a reference count that frees it at zero, reference cycles need the cyclic collector (`gc.collect()`), `weakref` does not keep an object alive, and `__slots__` removes the per-object `__dict__`. Try: build a cycle, delete the names, and show with `gc.collect()` that it was freed.",
          ),
          D(
            "tracemalloc",
            "https://docs.python.org/3/library/tracemalloc.html",
            "Watch allocations from inside a program, and take snapshots to see who allocated what.",
          ),
          R(
            "OSTEP: Free-space management",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf",
            "Chapter 17.",
          ),
          V(
            "First fit, next fit, best fit, worst fit (Gate Smashers)",
            "N3rG_1CEQkQ",
            "Gate Smashers, Operating System playlist. Watch at 1.5x. Contiguous allocation policies, and the external fragmentation they cause.",
          ),
          V(
            "Segmentation versus paging (Gate Smashers)",
            "dz9Tk6KCMlQ",
            "How the two ways of splitting memory differ, and what each fragments.",
          ),
          R(
            "CS:APP section 9.9: dynamic memory allocation",
            "https://csapp.cs.cmu.edu/",
            "Explicit free lists, coalescing, placement policies.",
          ),
        ],
        build: [
          "Use `tracemalloc` and `sys.getrefcount` to watch a loop allocate, then benchmark it with and without a reused object pool and with `__slots__`.",
          "Build a size-class allocator over one big `bytearray` arena with a free list per class, and benchmark it against plain `bytes` allocation.",
          "The main task: get one big region with `mmap.mmap(-1, size)`, store block headers (size and free flag) in it with `struct`, and implement malloc, free and realloc as offsets, with first-fit and coalescing of neighbouring free blocks.",
          "Make the placement policy a parameter and add next fit, best fit and worst fit beside first fit. Run the same 100k-operation trace on each and compare the fragmentation they leave.",
          "Write a stress test of 100k random alloc/free operations on your malloc and verify no two live blocks overlap.",
        ],
        ship: "os/ex4-malloc with a fragmentation experiment, and the size-class arena with its benchmark.",
        swe: {
          t: "Fuzz your allocator",
          link: D(
            "Hypothesis: property-based testing",
            "https://hypothesis.readthedocs.io/en/latest/",
            "Feed random alloc/free sequences to your allocator and assert no live blocks overlap.",
          ),
        },
        ask: [
          "What is internal versus external fragmentation, and which does your allocator suffer from?",
          "Why does free() not need a size argument?",
          "On your trace, which of first, next, best and worst fit left the most fragmentation, and why is best fit not always best?",
          "Python counts references and also has a cyclic collector. Which of malloc's problems does that remove, and what does it cost?",
        ],
      },
      {
        t: "Files, disks and crash consistency",
        why: "Learn why fsync exists and how filesystems recover from power loss.",
        main: [
          L(
            "Python lesson 16: files and pathlib",
            "https://docs.python.org/3/library/pathlib.html",
            "Read `Path`: joining with `/`, `read_text`, `write_text`, `glob`, `rglob`, `mkdir(parents=True, exist_ok=True)`, `stat`. Know: `pathlib` replaces most `os.path` code, and a safe save writes to a temporary file, calls `os.fsync`, then `os.replace`s it over the original. Try: write a function that saves a file atomically in exactly that way. Then skim the `os.scandir` and `os.fsync` docs.",
          ),
          D(
            "os.fsync",
            "https://docs.python.org/3/library/os.html#os.fsync",
            "Python's fsync. Read what it promises and what it does not, and why `file.flush()` alone is not enough.",
          ),
          V(
            "Disk access time: seek, rotation, transfer (Gate Smashers)",
            "udZi6uiR8bM",
            "Gate Smashers, Operating System playlist. Watch at 1.5x. Why the order of disk requests matters.",
          ),
          V(
            "SCAN disk scheduling (Gate Smashers)",
            "xouo556RGiE",
            "The elevator algorithm. FCFS, SSTF, LOOK, C-SCAN and C-LOOK are in the same playlist; learn how each differs from this one.",
          ),
          V(
            "C-SCAN disk scheduling (Gate Smashers)",
            "vLqZ6ZMBkX8",
            "One-way sweeps for fairer waiting.",
          ),
          V(
            "Indexed file allocation (Gate Smashers)",
            "S6lLRz7SQUw",
            "Contiguous, linked and indexed allocation, and what each costs for random access.",
          ),
          V(
            "The Unix inode structure (Gate Smashers)",
            "BJ13GsC0_os",
            "Direct, single and double indirect blocks, with a size calculation.",
          ),
          R(
            "OSTEP: File system implementation",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf",
            "Chapter 40: inodes, bitmaps.",
          ),
          R(
            "OSTEP: Crash consistency and journaling",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf",
            "Chapter 42.",
          ),
          V("Files & File Systems: Crash Course Computer Science #20", "KN8YgJnShPM", "12 min."),
        ],
        build: [
          "Inspect inodes with `stat` and `ls -i`. Make a hard link and a symlink; explain the difference.",
          "Write 100 MB in Python with and without `os.fsync`. Time both.",
          "Write a tool with `os.scandir` and `os.stat` that lists a directory like `ls -l`.",
          "Write a disk-scheduling simulator for FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK. Given a start position and a request queue, print the service order and total head movement, and check it against the worked examples.",
          "Write a small append-only log with a checksum per record (`zlib.crc32`). Kill it with `kill -9` mid-write and make recovery ignore a torn last record.",
        ],
        ship: "weekly/week-04.md covering threads, malloc and journaling.",
        swe: {
          t: "Why durability matters for your later database",
          link: R(
            "Files are hard (Dan Luu)",
            "https://danluu.com/file-consistency/",
            "Read it now; it sets up weeks 7-8.",
          ),
        },
        ask: [
          "What guarantee does fsync give, and what can still go wrong?",
          "How does a journal let the filesystem recover without scanning the disk?",
          "Why does SSTF starve far-away requests, and how do SCAN and C-SCAN fix it? How many blocks can an inode with 12 direct pointers and one single-indirect pointer address?",
        ],
      },
    ],
  },
);
