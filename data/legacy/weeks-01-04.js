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
        why: "Everything later is built in Python. Start with the basics (values, strings, decisions, loops, functions, files), get the toolchain and a debugger working, and see how big things really are.",
        main: [
          D(
            "Install Python 3.13 with uv",
            "https://docs.astral.sh/uv/getting-started/installation/",
            "Then run `uv python install 3.13` and `python3 --version`.",
          ),
          L(
            "Python lesson 1: The Python Tutorial, introduction to control flow",
            "https://docs.python.org/3/tutorial/introduction.html",
            "Numbers, strings, lists, if, for, range, functions. Work through the examples in a REPL, and keep the library reference (docs.python.org/3/library) open.",
          ),
          L(
            "Python basics: Automate the Boring Stuff, chapters 1 to 3",
            "https://automatetheboringstuff.com/3e/chapter1.html",
            "Written for people who have never programmed: expressions, variables, flow control and functions, with exercises. Do the practice questions at the end of each chapter before moving on.",
          ),
          L(
            "Python basics: Exercism Python track, Basics concept group",
            "https://exercism.org/tracks/python/concepts",
            "Small, checked exercises. Do the first five or six today and mark the track as your daily warm-up for the first week.",
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
          "Basics warm-up (45 min), in the REPL and then in `basics.py`: store your name and age in variables and print a sentence with an f-string; read a number with `input()` and `int()`; write FizzBuzz with a `for` loop and `if`/`elif`/`else`; write a `while` loop that asks until the input is valid; write a function `is_even(n)` with a docstring; and count the words in a text file with `open()` and `with`.",
          "Run `uv init` in a new folder. Write `types.py` that prints `sys.getsizeof` of an int (0, 1, 2**30, 2**100), a float, a str, a bytes, a list, a dict and a tuple, and `id()` of a local, a module variable and a freshly created object.",
          "Find which names share an object: compare `a is b` for small ints, equal strings and equal lists, and watch `sys.getrefcount` change as you add names. Write down why.",
          "Add one test file. Run `pytest`, `ruff check` and `ruff format --check`: they replace a Makefile.",
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
            "Lists, tuples, sets, dictionaries, looping techniques. Type out every example.",
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
            "Classes, instances, inheritance, iterators and generators. Type out every example.",
          ),
          L(
            "Python basics: Automate the Boring Stuff, chapters 7 to 9",
            "https://automatetheboringstuff.com/3e/chapter7.html",
            "Reading and writing files, handling errors with try/except, and organising code into functions and modules. Skim what you already know.",
          ),
          D(
            "dis: disassembler for Python bytecode",
            "https://docs.python.org/3/library/dis.html",
            "Python compiles to bytecode for a stack machine. Read the opcode list, then disassemble your own functions with `python3 -m dis file.py`.",
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
            "Write a test, run it, read the failure output, use fixtures and parametrize. This is where test-first Python starts.",
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
            "Read it through once. You will come back to it each week, and ruff enforces most of it.",
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
            "Then read the exception hierarchy for OSError and its subclasses. Every system call can fail.",
          ),
          D(
            "mmap: memory-mapped file support",
            "https://docs.python.org/3/library/mmap.html",
            "Anonymous and file-backed mappings, straight from the standard library.",
          ),
          V("What's Virtual Memory? - Computerphile", "5lFnKYCZT5o", "23 min."),
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
        ],
        build: [
          "Print `id()` of a function, a module variable, a heap object and a local. Sketch the layout. Note that these are real addresses in CPython, and compare with `ctypes.addressof`.",
          "`mmap.mmap(-1, 1 << 30)` an anonymous 1 GB region, touch one page at a time, and watch resident memory with `resource.getrusage`.",
          "Measure minor page faults with `/usr/bin/time -l` and `ru_minflt`.",
          "Catch the `OSError` from a bad mmap and re-raise it with context using `raise ... from err`.",
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
        ],
      },
      {
        t: "Build a CPU emulator, part 1",
        why: "The fastest way to learn fetch-decode-execute is to write it, and an emulator is a good size of Python program.",
        main: [
          L(
            "Python lesson 7: dataclasses and protocols",
            "https://docs.python.org/3/library/dataclasses.html",
            "Model your CPU as a class with methods. Read typing.Protocol for the pieces you want to swap.",
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
            "Annotate your emulator and run mypy on it. Then read the typing module docs on Protocol and Optional.",
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
      "Processes, system calls, scheduling and inter-process communication, ending in a real Unix shell written in Python. Work inside a Linux VM this week.",
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
            "run, Popen, CompletedProcess, returncode. Then the os module's process management section.",
          ),
          D(
            "os.fork, os.execvp and os.waitpid",
            "https://docs.python.org/3/library/os.html#process-management",
            "Python exposes the raw calls. subprocess is built on them, and mixing fork with threads is where it gets dangerous.",
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
            "Coroutines, tasks, gather, and queues. Then skim the threading docs and compare the two models.",
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
          R("OSTEP: CPU scheduling", "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf", "Chapter 7."),
          R(
            "OSTEP: Multi-level feedback queue",
            "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf",
            "Chapter 8.",
          ),
          V("OS Context Switching - Computerphile", "DKmBRl8j3Ak", "15 min."),
        ],
        build: [
          "Write a scheduler simulator in Python for FIFO, SJF and round robin behind one `Protocol`. Report turnaround and response time.",
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
            "Then the io module docs. File objects and `with` are how Python programs plug together. A shell is mostly wiring them up.",
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
            "Handlers run in the main thread between bytecodes. Then the selectors module for waiting on several file descriptors.",
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
        ],
      },
    ],
  },
  {
    n: 4,
    phase: "os",
    title: "Threads, memory allocators and filesystems",
    summary:
      "Python threads and the GIL, the primitives under them, a malloc and a size-class allocator written over a bytearray, and how files survive crashes.",
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
            "Thread, Lock, RLock, Event. Then Beazley's talk below on what the GIL really does.",
          ),
          R(
            "Understanding the Python GIL (David Beazley)",
            "https://www.dabeaz.com/python/UnderstandingGIL.pdf",
            "Why threads do not speed up CPU-bound Python, and why `counter += 1` is still a race.",
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
        ],
      },
      {
        t: "Condition variables, semaphores and deadlock",
        why: "Coordinate threads and tasks without spinning, and recognise the classic bugs.",
        main: [
          L(
            "Python lesson 14: asyncio cancellation and timeouts",
            "https://docs.python.org/3/library/asyncio-task.html#timeouts",
            "TaskGroup, `asyncio.timeout`, and what `CancelledError` means. Every task you start needs a way to stop.",
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
          R("OSTEP: Semaphores", "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf", "Chapter 31."),
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
        ],
      },
      {
        t: "Write a memory allocator",
        why: "Python hides the heap behind reference counting and its own allocator, so this is the day to build the allocator yourself, over a `bytearray`: it makes heaps, fragmentation and free lists concrete.",
        main: [
          L(
            "Python lesson 15: how Python manages memory",
            "https://docs.python.org/3/library/gc.html",
            "The gc module, reference counting and the cyclic collector. Then read the CPython garbage collector design notes in the developer guide.",
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
            "Then the tutorial's reading and writing files section, and the os.scandir and os.fsync docs.",
          ),
          D(
            "os.fsync",
            "https://docs.python.org/3/library/os.html#os.fsync",
            "Python's fsync. Read what it promises and what it does not, and why `file.flush()` alone is not enough.",
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
        ],
      },
    ],
  },
);
