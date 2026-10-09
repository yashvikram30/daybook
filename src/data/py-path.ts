// The Python learning path. Python is taught alongside the systems work, one numbered lesson per day for the
// first four weeks, then used as the working language. Lessons live in each day's learn step (items titled
// "Python lesson N"); this file groups them into stages and says how to tell you are ready for the next one.
// The first three days also carry "Python basics" reading and a short warm-up, for people new to programming.
// Python is the only language in the plan; where it hides the machine, ctypes, dis and os reach it.

export type PyStage = {
  title: string;
  /** What this stage teaches, in one sentence. */
  summary: string;
  /** Days that carry the stage's lessons, as [week, day]. */
  days: [number, number][];
  /** Where the lessons come from. */
  sources: { title: string; url: string }[];
  /** How you know you can move on. */
  ready: string;
  /** Where Python Foundations already covered this stage, so the lessons read as revision. */
  covered: string;
};

export const PY_STAGES: PyStage[] = [
  {
    title: "Basics: read and run",
    summary:
      "Install Python and learn the basics from scratch: values, strings, if and loops, functions and files. Then use the toolchain: virtual environments, pytest and ruff.",
    days: [[1, 1]],
    sources: [
      {
        title: "The Python Tutorial: an informal introduction",
        url: "https://docs.python.org/3/tutorial/introduction.html",
      },
      {
        title: "Automate the Boring Stuff, chapters 1 to 3",
        url: "https://automatetheboringstuff.com/3e/chapter1.html",
      },
      { title: "Exercism: Python track", url: "https://exercism.org/tracks/python/concepts" },
      { title: "venv: creating virtual environments", url: "https://docs.python.org/3/library/venv.html" },
      { title: "pytest: getting started", url: "https://docs.pytest.org/en/stable/getting-started.html" },
    ],
    ready:
      "You can write FizzBuzz, a function with a default argument and a word counter for a file from a blank page, test one with pytest, and run ruff on it.",
    covered:
      "Foundations weeks 1 and 2 cover all of it. The lesson is revision; do the warm-up in 15 minutes.",
  },
  {
    title: "Data and memory",
    summary: "Names and objects, mutability, lists, dicts, sets, bytes, and what each one is in memory.",
    days: [[1, 2]],
    sources: [
      {
        title: "The Python Tutorial: data structures",
        url: "https://docs.python.org/3/tutorial/datastructures.html",
      },
      {
        title: "Automate the Boring Stuff, chapters 4 to 6",
        url: "https://automatetheboringstuff.com/3e/chapter4.html",
      },
      { title: "Python data model", url: "https://docs.python.org/3/reference/datamodel.html" },
      {
        title: "Facts and myths about Python names and values",
        url: "https://nedbatchelder.com/text/names.html",
      },
    ],
    ready:
      "You can say what a list is made of and predict when an append reallocates and when two names share one object.",
    covered:
      "Foundations days 2.3, 2.4 and 3.1 cover lists, tuples, dicts and sets. New here: what they are in memory.",
  },
  {
    title: "Behaviour and tests",
    summary: "Classes, dataclasses and protocols, and the habit of writing the test first.",
    days: [
      [1, 3],
      [1, 4],
    ],
    sources: [
      { title: "The Python Tutorial: classes", url: "https://docs.python.org/3/tutorial/classes.html" },
      {
        title: "Automate the Boring Stuff, chapters 7 to 9",
        url: "https://automatetheboringstuff.com/3e/chapter7.html",
      },
      { title: "dataclasses", url: "https://docs.python.org/3/library/dataclasses.html" },
      {
        title: "pytest: parametrizing tests",
        url: "https://docs.pytest.org/en/stable/how-to/parametrize.html",
      },
    ],
    ready: "You can define a Protocol, satisfy it with two classes, and cover both with a parametrized test.",
    covered: "Foundations days 4.1 to 4.3 cover classes and pytest. New here: dataclasses and protocols.",
  },
  {
    title: "Idiomatic Python",
    summary:
      "How experienced Python programmers write it: exceptions, comprehensions, type hints, timing code.",
    days: [
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
    ],
    sources: [
      { title: "PEP 8: the style guide", url: "https://peps.python.org/pep-0008/" },
      {
        title: "The Python Tutorial: errors and exceptions",
        url: "https://docs.python.org/3/tutorial/errors.html",
      },
      { title: "timeit", url: "https://docs.python.org/3/library/timeit.html" },
    ],
    ready:
      "Your emulator passes ruff and mypy, raises specific exceptions, and has a timing benchmark you wrote yourself.",
    covered:
      "Foundations day 3.3 covers exceptions and day 4.3 covers pytest and ruff. New here: PEP 8 in depth, type hints and timing.",
  },
  {
    title: "Talking to the system",
    summary: "Running processes, reading and writing streams, threads and queues, signals.",
    days: [
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
    ],
    sources: [
      { title: "subprocess", url: "https://docs.python.org/3/library/subprocess.html" },
      { title: "signal", url: "https://docs.python.org/3/library/signal.html" },
      { title: "threading and queue", url: "https://docs.python.org/3/library/threading.html" },
    ],
    ready: "Your shell runs pipelines, handles Ctrl-C, and leaves no zombies.",
    covered: "Not in Foundations. Start from the subprocess docs; day 3.2 files and modules help.",
  },
  {
    title: "Concurrency for real",
    summary: "Locks, condition variables, the GIL, asyncio cancellation, the garbage collector, and files.",
    days: [
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    sources: [
      {
        title: "Understanding the Python GIL (David Beazley)",
        url: "https://www.dabeaz.com/GIL/",
      },
      { title: "gc: the garbage collector interface", url: "https://docs.python.org/3/library/gc.html" },
      { title: "concurrent.futures", url: "https://docs.python.org/3/library/concurrent.futures.html" },
    ],
    ready: "Your worker pool passes a stress test, shuts down cleanly on cancel, and you can explain why.",
    covered: "Not in Foundations. This is the first time you meet threads and locks.",
  },
];

export const PY_EXTRAS = [
  {
    title: "Exercism: Python track",
    url: "https://exercism.org/tracks/python",
    note: "Small exercises with mentoring.",
  },
  {
    title: "Fluent Python, 2nd edition",
    url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
    note: "The standard book on idiomatic Python, if you want one.",
  },
  { title: "Effective Python", url: "https://effectivepython.com/", note: "Read a few items after week 4." },
];
