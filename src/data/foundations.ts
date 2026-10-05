// Python Foundations: a four-week pre-course for people who are new to programming (or new to Python).
// It sits in front of the 16-week plan and has its own numbering (f1d1 .. f4d4), so nothing in the main plan moves.
//
// Three sources are woven together, in this order of use on every day:
//  1. freeCodeCamp's Python curriculum (lectures, workshops and labs that run in the browser). Gentle, first-timer.
//  2. Google's Python Class (written notes, lecture videos and exercises). Denser, so it comes after the gentle pass.
//  3. freeCodeCamp's "Learn Python" video course, deep-linked to the chapter you need (timestamps below).
//
// Items use the same shape as the main plan, so ticking them off uses the same progress store.
import type { Item } from "@/lib/curriculum-types";

export type FoundationDay = {
  /** "f2d3": week 2, day 3 of the foundations. Item keys are "<id>:l0" (learn) and "<id>:p0" (practice). */
  id: string;
  week: number;
  n: number;
  title: string;
  why: string;
  /** What you can do by the end of the day, in one sentence you can test yourself against. */
  goal: string;
  minutes: number;
  learn: Item[];
  practice: Item[];
  check: string[];
  ship: string;
};

export type FoundationWeek = {
  number: number;
  title: string;
  summary: string;
  /** What you can do at the end of the week. */
  checkpoint: string;
  days: FoundationDay[];
};

// ---------- link builders ----------

const GOOGLE = "https://developers.google.com/edu/python";
const g = (path: string) => `${GOOGLE}/${path}`;
const GOOGLE_ZIP = "https://developers.google.com/static/edu/python/google-python-exercises.zip";

const yt = (id: string, from?: string) => {
  // from is "h:mm:ss" or "m:ss", the chapter start taken from the video description.
  const secs = from ? from.split(":").reduce((n, p) => n * 60 + Number(p), 0) : 0;
  return `https://www.youtube.com/watch?v=${id}${secs ? `&t=${secs}s` : ""}`;
};
const FCC_COURSE = "rfscVS0vtbw"; // Learn Python - Full Course for Beginners (Mike Dane), 4h 27m
const gv = (id: string) => yt(id);

const FCC = "https://www.freecodecamp.org/learn/python-v9";
/** First page of each freeCodeCamp block used here, as "block/first-page" (taken from the live curriculum). */
const FCC_BLOCKS: Record<string, string> = {
  "lecture-introduction-to-python":
    "lecture-introduction-to-python/what-is-python-and-what-are-some-common-uses-in-the-industry",
  "lecture-python-installation":
    "lecture-python-installation/how-do-you-install-configure-and-use-python-in-your-local-environment",
  "lecture-understanding-variables-and-data-types":
    "lecture-understanding-variables-and-data-types/how-do-you-declare-variables-and-what-are-naming-conventions-to-name-variables",
  "lecture-numbers-and-mathematical-operations":
    "lecture-numbers-and-mathematical-operations/how-do-you-work-with-integers-and-floating-point-numbers",
  "lecture-introduction-to-python-strings":
    "lecture-introduction-to-python-strings/what-are-strings-and-what-is-string-immutability",
  "lecture-booleans-and-conditionals":
    "lecture-booleans-and-conditionals/how-do-conditional-statements-and-logical-operators-work",
  "lecture-understanding-functions-and-scope":
    "lecture-understanding-functions-and-scope/how-do-functions-work-in-python",
  "lecture-working-with-loops-and-sequences":
    "lecture-working-with-loops-and-sequences/what-are-lists-and-how-do-they-work",
  "lecture-working-with-dictionaries-and-sets":
    "lecture-working-with-dictionaries-and-sets/what-are-dictionaries-and-how-do-they-work",
  "lecture-working-with-modules":
    "lecture-working-with-modules/what-is-the-python-standard-library-and-how-do-you-import-a-module",
  "lecture-understanding-error-handling":
    "lecture-understanding-error-handling/what-are-some-common-error-messages-in-python",
  "lecture-classes-and-objects":
    "lecture-classes-and-objects/how-do-classes-work-and-how-do-they-differ-from-objects",
  "lecture-understanding-object-oriented-programming-and-encapsulation":
    "lecture-understanding-object-oriented-programming-and-encapsulation/what-is-object-oriented-programming-and-how-does-encapsulation-work",
  "lecture-understanding-inheritance-and-polymorphism":
    "lecture-understanding-inheritance-and-polymorphism/what-is-inheritance-and-how-does-it-promote-code-reuse",
  "lecture-understanding-abstraction":
    "lecture-understanding-abstraction/what-is-abstraction-and-how-does-it-help-keep-complex-systems-organized",
  "workshop-report-card-printer": "workshop-report-card-printer/step-1",
  "workshop-bill-splitter": "workshop-bill-splitter/step-1",
  "workshop-employee-profile-generator": "workshop-employee-profile-generator/step-1",
  "workshop-movie-ticket-booking-calculator": "workshop-movie-ticket-booking-calculator/step-1",
  "workshop-kitchen-inventory-tracker": "workshop-kitchen-inventory-tracker/step-1",
  "workshop-caesar-cipher": "workshop-caesar-cipher/step-1",
  "workshop-pin-extractor": "workshop-pin-extractor/step-1",
  "workshop-medical-data-validator": "workshop-medical-data-validator/step-1",
  "workshop-musical-instrument-inventory": "workshop-musical-instrument-inventory/step-1",
  "workshop-salary-tracker": "workshop-salary-tracker/step-1",
  "lab-travel-weather-planner": "lab-travel-weather-planner/build-a-travel-weather-planner",
  "lab-discount-calculator": "lab-discount-calculator/build-a-discount-calculator",
  "lab-rpg-character": "lab-rpg-character/build-an-rpg-character",
  "lab-number-pattern-generator": "lab-number-pattern-generator/build-a-number-pattern-generator",
  "lab-user-configuration-manager": "lab-user-configuration-manager/build-a-user-configuration-manager",
  "lab-isbn-validator": "lab-isbn-validator/debug-an-isbn-validator",
  "lab-planet-class": "lab-planet-class/build-a-planet-class",
  "lab-game-character-stats": "lab-game-character-stats/lab-game-character-stats",
  "lab-budget-app": "lab-budget-app/build-a-budget-app",
  "lab-polygon-area-calculator": "lab-polygon-area-calculator/build-a-polygon-area-calculator",
  "review-python-basics": "review-python-basics/review-python-basics",
  "quiz-python-basics": "quiz-python-basics/quiz-python-basics",
  "review-loops-and-sequences": "review-loops-and-sequences/review-loops-and-sequences",
  "quiz-loops-and-sequences": "quiz-loops-and-sequences/quiz-loops-and-sequences",
  "review-dictionaries-and-sets": "review-dictionaries-and-sets/review-dictionaries-and-sets",
  "quiz-dictionaries-and-sets": "quiz-dictionaries-and-sets/quiz-dictionaries-and-sets",
  "review-error-handling": "review-error-handling/review-error-handling",
  "quiz-error-handling": "quiz-error-handling/quiz-error-handling",
  "review-classes-and-objects": "review-classes-and-objects/review-classes-and-objects",
  "quiz-classes-and-objects": "quiz-classes-and-objects/quiz-classes-and-objects",
  "review-object-oriented-programming":
    "review-object-oriented-programming/review-object-oriented-programming",
  "quiz-object-oriented-programming": "quiz-object-oriented-programming/quiz-object-oriented-programming",
  "review-python": "review-python/review-python",
};
const fcc = (block: keyof typeof FCC_BLOCKS | string) => {
  const path = FCC_BLOCKS[block];
  if (!path) throw new Error(`Unknown freeCodeCamp block: ${block}`);
  return `${FCC}/${path}`;
};
const FCC_NEWS = "https://www.freecodecamp.org/news";
const PYDOCS = "https://docs.python.org/3";

// ---------- item builders ----------

type Draft = { kind: Item["kind"]; title: string; url: string | null; note: string };
const learn = (kind: Item["kind"], title: string, url: string, note: string): Draft => ({
  kind,
  title,
  url,
  note,
});
const task = (title: string): Draft => ({ kind: "task", title, url: null, note: "" });

function items(id: string, group: "l" | "p", drafts: Draft[]): Item[] {
  return drafts.map((d, i) => ({
    key: `${id}:${group}${i}`,
    // The day page lists link items with their link and plain tasks as a checklist line.
    section: d.url ? "learn" : "build",
    kind: d.kind,
    title: d.title,
    url: d.url,
    note: d.note || null,
    difficulty: null,
    position: i,
  }));
}

/**
 * The Learn links of each day, grouped by topic: several sources on the same idea are one optional tick. A group
 * is [title, one line on what it is for, indexes into the day's `learn` list]; every index appears exactly once.
 * The group is keyed by its first link, so progress saved before grouping still lines up.
 */
const LEARN_GROUPS: Record<string, [string, string, number[]][]> = {
  f1d1: [
    ["What Python is and how it runs", "The overview, and how the shell and a script differ.", [0, 4]],
    [
      "Install Python and run Hello World",
      "Three walk-throughs of the same first steps. Follow one, or use two.",
      [1, 2, 3],
    ],
  ],
  f1d2: [
    ["Variables, data types and numbers", "The same ideas from three sources.", [0, 1, 2]],
    ["Getting input from the user", "A short video on input().", [3]],
    ["See variables in memory", "Step through code and watch the names and values.", [4]],
  ],
  f1d3: [["Working with strings", "Slicing, methods and f-strings from four sources.", [0, 1, 2, 3]]],
  f1d4: [["Booleans, comparisons and if", "The same ideas from three sources.", [0, 1, 2]]],
  f2d1: [["Functions and scope", "Defining, calling and returning, from four sources.", [0, 1, 2, 3]]],
  f2d2: [
    ["Modules, help and built-in functions", "Finding what Python already gives you.", [0, 1]],
    ["A worked calculator", "Watch someone build one step by step.", [2]],
  ],
  f2d3: [
    ["Lists and loops", "The core lesson from four sources.", [0, 1, 2, 3]],
    ["More on for and while", "Two short articles with more examples.", [4, 5]],
  ],
  f2d4: [
    ["Sorting", "sorted, key= and sort().", [0]],
    ["Tuples and the rest of sequences", "Tuples, and the remaining loops-and-sequences pages.", [1, 2]],
  ],
  f3d1: [["Dictionaries and sets", "The same ideas from four sources.", [0, 1, 2, 3]]],
  f3d2: [
    ["Reading and writing files", "Files and with open, from three sources.", [0, 2, 3]],
    ["Modules and the standard library", "Importing and what ships with Python.", [1]],
  ],
  f3d3: [
    ["Errors and exceptions", "try and except, from three sources.", [0, 1, 2]],
    ["The debugger", "Pause a program and look inside.", [3]],
  ],
  f3d4: [
    ["Regular expressions", "Patterns for text, from four sources, with a live tester.", [0, 1, 2, 3]],
    ["Files, folders and other programs", "The os, shutil and subprocess modules.", [4]],
  ],
  f4d1: [["Classes and objects", "The same ideas from three sources.", [0, 1, 2]]],
  f4d2: [
    [
      "Object-oriented programming",
      "Encapsulation, inheritance and abstraction from four sources.",
      [0, 1, 2, 3],
    ],
  ],
  f4d3: [
    ["Virtual environments and packages", "pip, venv and uv.", [0, 1]],
    ["pytest", "Your first tests.", [2]],
    ["Git and GitHub", "A beginner crash course.", [3]],
    ["Fetching a web page", "urllib and utilities.", [4]],
  ],
  f4d4: [["Review the whole course", "A closing lecture, one review page and a handbook.", [0, 1, 2]]],
};

/** Turn a day's learn drafts into items, merging each group of links into one tick with a link list. */
function learnItems(id: string, drafts: Draft[]): Item[] {
  const all = items(id, "l", drafts);
  const groups = LEARN_GROUPS[id];
  if (!groups) return all;
  const used = groups.flatMap((g) => g[2]).sort((a, b) => a - b);
  if (used.length !== all.length || used.some((v, k) => v !== k))
    throw new Error(`${id}: learn groups must cover every link exactly once`);
  return groups.map(([title, note, idx], position) => {
    const lead = all[Math.min(...idx)];
    if (idx.length === 1) return { ...lead, position };
    return {
      ...lead,
      title,
      note,
      url: null,
      position,
      links: idx.map((i) => ({
        kind: all[i].kind,
        title: all[i].title,
        url: all[i].url!,
        note: all[i].note,
      })),
    };
  });
}

function day(
  week: number,
  n: number,
  d: Omit<FoundationDay, "id" | "week" | "n" | "learn" | "practice"> & { learn: Draft[]; practice: Draft[] },
): FoundationDay {
  const id = `f${week}d${n}`;
  return { ...d, id, week, n, learn: learnItems(id, d.learn), practice: items(id, "p", d.practice) };
}

// Reusable lines.
const googleLecture = (id: string, title: string, note: string) => learn("video", title, gv(id), note);
const mike = (from: string, title: string, note: string) => learn("video", title, yt(FCC_COURSE, from), note);

// ---------- the four weeks ----------

export const FOUNDATION_WEEKS: FoundationWeek[] = [
  {
    number: 1,
    title: "Your first programs",
    summary:
      "Install Python, run code, and learn the four things every program is made of: values, text, numbers and decisions. Everything is small and runs the same day.",
    checkpoint:
      "You can write a short program that asks for input, does arithmetic or text work on it, and prints a different message depending on the answer.",
    days: [
      day(1, 1, {
        title: "Install Python and run your first program",
        why: "You learn to program by running programs, not by watching. Today the only goal is to get Python working and to see your own lines run.",
        goal: "Run a Python file from the terminal, use the interactive shell, and read an error message without panicking.",
        minutes: 150,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: What is Python and what is it used for?",
            fcc("lecture-introduction-to-python"),
            "5 minutes. The one-page overview. Read it first so the rest has a reason.",
          ),
          learn(
            "lab",
            "freeCodeCamp: Install, configure and use Python (3 short pages)",
            fcc("lecture-python-installation"),
            "25 minutes. Install Python, run a script, use the interactive shell. Follow along on your own machine as you read.",
          ),
          learn(
            "docs",
            "Google's Python Class: Set Up",
            g("set-up"),
            "20 minutes. Download the exercises zip, run hello.py, set up an editor. Skip the Windows path section if you are on Mac or Linux.",
          ),
          mike(
            "1:45",
            "Mike Dane (freeCodeCamp): Installing Python and Hello World",
            "15 minutes: play from 1:45 to about 10:23. A second voice explaining the same first steps. Pause and type along.",
          ),
          learn(
            "docs",
            "Python tutorial: Using the Python interpreter",
            `${PYDOCS}/tutorial/interpreter.html`,
            "Optional, 10 minutes. How the shell and a script differ.",
          ),
        ],
        practice: [
          task(
            "In a terminal run `python3 --version`. Then run `python3` to open the shell, type `2 + 3`, then `'hi' * 3`, then `exit()`.",
          ),
          task(
            "Download and unzip Google's exercises (link below), open hello.py, change the word Hello to Howdy, save, and run `python3 hello.py Alice`.",
          ),
          task(
            "Create `about_me.py` that prints three lines about you with `print()`. Run it. Then delete a closing quote on purpose, run it again, and read the SyntaxError: it names the file and the line.",
          ),
          learn(
            "docs",
            "Google Python exercises (zip)",
            GOOGLE_ZIP,
            "The hello.py and the exercise files for the next four weeks live in this folder.",
          ),
        ],
        check: [
          "What is the difference between typing code into the Python shell and running a .py file?",
          "What does `print()` do, and what goes between its brackets?",
          "A script fails with a SyntaxError on line 4. Where do you look first?",
        ],
        ship: "about_me.py, hello.py (edited to say Howdy), and a note of the Python version you installed.",
      }),
      day(1, 2, {
        title: "Variables, types and numbers",
        why: "A variable is a name for a value. Types decide what you can do with that value. Almost every bug a beginner meets is one of these two ideas going wrong.",
        goal: "Create variables, predict what arithmetic gives, and convert between text and numbers without being surprised.",
        minutes: 170,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Variables and data types (4 short pages)",
            fcc("lecture-understanding-variables-and-data-types"),
            "30 minutes. Naming, print(), the common types, type() and isinstance().",
          ),
          learn(
            "lab",
            "freeCodeCamp: Numbers and mathematical operations",
            fcc("lecture-numbers-and-mathematical-operations"),
            "20 minutes. Integers, floats, and += style assignment.",
          ),
          mike(
            "15:06",
            "Mike Dane: Variables and data types, then numbers",
            "20 minutes: play 15:06 to 27:03 (variables), then 38:18 to 48:26 (numbers).",
          ),
          mike(
            "48:26",
            "Mike Dane: Getting input from users",
            "5 minutes, then try it yourself with the calculator on 52:37.",
          ),
          learn(
            "docs",
            "Python Tutor: see your variables in memory",
            "https://pythontutor.com/",
            "Paste any program here and step through it. Use it every time a program surprises you.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp workshop: Report card printer (10 steps)",
            fcc("workshop-report-card-printer"),
            "30 to 40 minutes. A guided build in the browser. Do not skip the steps; each one adds one idea.",
          ),
          learn(
            "lab",
            "freeCodeCamp workshop: Bill splitter (8 steps)",
            fcc("workshop-bill-splitter"),
            "25 minutes. Numbers and rounding.",
          ),
          task(
            "Before you run it, write down what each line prints, then check: `7 / 2`, `7 // 2`, `7 % 2`, `2 ** 10`, `int('5') + 1`, `'5' + '5'`, `'5' * 3`.",
          ),
          task(
            "Write `tip.py`: ask for a bill with `input()`, convert it with `float()`, add a 15% tip, and print the total with two decimals using an f-string, for example `f'{total:.2f}'`.",
          ),
        ],
        check: [
          "Why does `input()` give back text even when you type 5, and how do you fix that?",
          "What is the difference between `/`, `//` and `%`?",
          "What does `type(3.0)` print, and why is 3.0 not the same type as 3?",
        ],
        ship: "tip.py and the predictions you wrote for the seven expressions, with a mark next to the ones you got wrong.",
      }),
      day(1, 3, {
        title: "Strings: working with text",
        why: "Programs spend most of their time moving text around. Slicing and string methods are the first tools that make a program feel useful.",
        goal: "Slice, search, clean and combine strings, and build text with f-strings.",
        minutes: 175,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Strings (4 short pages)",
            fcc("lecture-introduction-to-python-strings"),
            "30 minutes. Immutability, joining, f-strings, slicing and the common methods.",
          ),
          learn(
            "docs",
            "Google's Python Class: Strings",
            g("strings"),
            "35 minutes. Denser than freeCodeCamp. Read it after the lecture above. The section on slices is the important one.",
          ),
          googleLecture(
            "tKTZoB2Vjuk",
            "Google lecture 1.1: Introduction and strings",
            "50 minutes in full. Watch the strings half and type the examples along with it.",
          ),
          mike("27:03", "Mike Dane: Working with strings", "11 minutes: 27:03 to 38:18."),
        ],
        practice: [
          learn(
            "docs",
            "Google basic exercise: string1.py",
            g("exercises/basic"),
            "60 minutes. Open string1.py from the zip and fill in donuts, both_ends, fix_start and mix_up. Run it: it prints OK or X for each test.",
          ),
          learn(
            "lab",
            "freeCodeCamp workshop: Employee profile generator (18 steps)",
            fcc("workshop-employee-profile-generator"),
            "35 minutes. String building and formatting.",
          ),
          task(
            "Write `madlibs.py`: ask for a noun, a verb and an adjective, then print a short story that uses all three (Mike Dane's Mad Libs at 58:27 is the idea).",
          ),
        ],
        check: [
          "What does `s[1:4]` give for `s = 'python'`, and what does `s[-2:]` give?",
          "Why does `s.upper()` not change `s`?",
          "Write a one-line f-string that prints `Alice is 30` from `name` and `age`.",
        ],
        ship: "string1.py with every test printing OK, and madlibs.py.",
      }),
      day(1, 4, {
        title: "Decisions: booleans, if and comparisons",
        why: "A decision is what turns a list of commands into a program. This is also where indentation starts to matter.",
        goal: "Write if, elif and else chains with comparisons and `and`, `or` and `not`, and explain what each branch does.",
        minutes: 175,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Booleans and conditionals (2 pages)",
            fcc("lecture-booleans-and-conditionals"),
            "25 minutes. Comparisons, logical operators, truthy and falsy values.",
          ),
          learn(
            "docs",
            "Google's Python Class: Introduction (indentation, runtime checks)",
            g("introduction"),
            "25 minutes. Read 'Indentation' and 'Code checked at runtime' closely, and skim the rest. Then the 'If Statement' section at the end of the Strings page.",
          ),
          mike(
            "1:40:06",
            "Mike Dane: If statements and comparisons",
            "25 minutes: 1:40:06 to 2:07:17, including the better calculator.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp workshop: Movie ticket booking calculator (21 steps)",
            fcc("workshop-movie-ticket-booking-calculator"),
            "40 minutes. Conditions with real prices and ages.",
          ),
          learn(
            "lab",
            "freeCodeCamp lab: Travel weather planner",
            fcc("lab-travel-weather-planner"),
            "40 minutes. This one you build yourself, with tests that tell you what is missing.",
          ),
          task(
            "Week 1 project: write `grades.py`. Ask for a score from 0 to 100, print the letter grade, and print a clear message if the score is not a number or is out of range.",
          ),
        ],
        check: [
          "What is the difference between `=` and `==`?",
          "What does `0`, `''` and `[]` count as in an `if`? Name one more.",
          "How does Python know where an `if` block ends?",
        ],
        ship: "grades.py handling good and bad input, plus the two freeCodeCamp builds marked complete.",
      }),
    ],
  },
  {
    number: 2,
    title: "Functions, loops and lists",
    summary:
      "Stop repeating yourself. Wrap steps in functions, repeat work with loops, and keep many values together in lists. By the end you can solve small puzzle problems.",
    checkpoint:
      "You can solve a short problem with a function that loops over a list, and you have run freeCodeCamp's basics review and quiz.",
    days: [
      day(2, 1, {
        title: "Functions and scope",
        why: "A function is a named, reusable piece of work. Learning to split a problem into functions is the single biggest step from scripts to programs.",
        goal: "Define functions with parameters, defaults and return values, and explain why a variable inside a function is not visible outside it.",
        minutes: 170,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Functions and scope (2 pages)",
            fcc("lecture-understanding-functions-and-scope"),
            "25 minutes. Defining, calling, returning, and what scope means.",
          ),
          learn(
            "docs",
            "Google's Python Class: Introduction (user-defined functions)",
            g("introduction"),
            "15 minutes. Re-read the 'User-defined Functions' section now that functions are today's topic.",
          ),
          mike("1:24:15", "Mike Dane: Functions and the return statement", "15 minutes: 1:24:15 to 1:40:06."),
          learn(
            "docs",
            "Python tutorial: Defining functions",
            `${PYDOCS}/tutorial/controlflow.html#defining-functions`,
            "10 minutes. Default values and keyword arguments.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp workshop: Kitchen inventory tracker (17 steps)",
            fcc("workshop-kitchen-inventory-tracker"),
            "40 minutes. Functions that work together.",
          ),
          task(
            "Write `is_even(n)`, `clamp(x, low, high)` and `tip(total, percent=15, people=1)`. Call each with positional and keyword arguments.",
          ),
          task(
            "Break scope on purpose: define a variable inside one function, try to print it from outside, and read the NameError. Then fix it by returning the value.",
          ),
          task(
            "Re-write `grades.py` so the work lives in a function `letter_grade(score)` that returns the letter and does not print.",
          ),
        ],
        check: [
          "What is the difference between a function that prints a value and one that returns it?",
          "What happens if you call `tip(100)` when `percent` has a default?",
          "Why can a function read a global variable but not assign to it without `global`?",
        ],
        ship: "functions.py with the three functions and grades.py rewritten around letter_grade().",
      }),
      day(2, 2, {
        title: "Practice day: build with functions",
        why: "Reading and watching gets you about half way. Today you solve problems with what you know, and learn how to look things up yourself.",
        goal: "Build three small programs that combine input, conditions and functions, and use help() and the docs to find what you need.",
        minutes: 170,
        learn: [
          learn(
            "docs",
            "Google's Python Class: Introduction (modules, help and dir)",
            g("introduction"),
            "20 minutes. Read 'More on modules and namespaces' and 'Online help, help() and dir()'. This is how you find things without leaving the terminal.",
          ),
          learn(
            "docs",
            "Python built-in functions",
            `${PYDOCS}/library/functions.html`,
            "Skim the table once so you know what already exists: len, max, min, sum, sorted, range, abs, round, enumerate, zip.",
          ),
          mike(
            "2:00:37",
            "Mike Dane: Building a better calculator",
            "7 minutes. A worked example of functions plus conditions.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp lab: Discount calculator",
            fcc("lab-discount-calculator"),
            "30 minutes. Build it yourself against the tests.",
          ),
          learn(
            "lab",
            "freeCodeCamp workshop: Caesar cipher (25 steps)",
            fcc("workshop-caesar-cipher"),
            "50 minutes. The longest workshop this week: take a break in the middle.",
          ),
          learn(
            "lab",
            "freeCodeCamp lab: RPG character",
            fcc("lab-rpg-character"),
            "Optional, 40 minutes. Do it if the cipher felt easy.",
          ),
          task(
            "In the shell, run `help(len)`, `help(str.split)` and `dir('')`. Pick two string methods you have not used and try them.",
          ),
        ],
        check: [
          "How do you find out what a function does without searching the web?",
          "In your Caesar cipher, which part would you put in its own function, and why?",
          "What does a failing freeCodeCamp test tell you that your own eyes might miss?",
        ],
        ship: "The finished discount calculator and Caesar cipher (and the RPG character if you did it).",
      }),
      day(2, 3, {
        title: "Lists and loops",
        why: "Most real data comes in many pieces. A list holds them in order, and a loop does the same thing to each piece.",
        goal: "Create and change lists, loop with `for` and `while`, and use `range()`.",
        minutes: 180,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Loops and sequences (do the first six pages)",
            fcc("lecture-working-with-loops-and-sequences"),
            "35 minutes. Lists, list methods, tuples, loops and ranges. Leave enumerate, zip, comprehensions and lambda for tomorrow.",
          ),
          learn(
            "docs",
            "Google's Python Class: Lists",
            g("lists"),
            "30 minutes. FOR and IN, range, while, list methods, build-up and slices.",
          ),
          googleLecture(
            "EPYupizJYQI",
            "Google lecture 1.2: Lists and sorting",
            "Watch the lists half, about 25 minutes.",
          ),
          mike(
            "1:03:10",
            "Mike Dane: Lists, list functions, while and for loops",
            "20 minutes. Play 1:03:10 to 1:18:57 for lists, then 2:14:13 to 2:20:21 for while and 2:32:44 to 2:41:20 for for-loops.",
          ),
          learn(
            "read",
            "freeCodeCamp article: Python for loop and range",
            `${FCC_NEWS}/python-for-loop-for-i-in-range-example/`,
            "A short read with examples. Good for revision.",
          ),
          learn(
            "read",
            "freeCodeCamp article: Python while loop",
            `${FCC_NEWS}/python-while-loop-tutorial/`,
            "Including how to avoid an infinite loop.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp workshop: PIN extractor (19 steps)",
            fcc("workshop-pin-extractor"),
            "40 minutes. Looping over a list to pull out values.",
          ),
          learn(
            "docs",
            "Google basic exercise: list1.py and list2.py (first part)",
            g("exercises/basic"),
            "45 minutes. Do match_ends in list1.py and remove_adjacent in list2.py: neither needs sorting. Leave the rest for tomorrow.",
          ),
          task(
            "Write `stats.py`: put five numbers in a list and print the largest, smallest, total and average without using `max`, `min` or `sum`. Then check against the built-ins.",
          ),
        ],
        check: [
          "What does `range(2, 10, 3)` produce?",
          "What is the difference between `list.append(x)` and `list.extend(xs)`?",
          "What happens if you change a list while looping over it, and how do you avoid that?",
        ],
        ship: "stats.py, plus match_ends (list1.py) and remove_adjacent (list2.py) passing.",
      }),
      day(2, 4, {
        title: "Sorting, tuples, comprehensions and a review",
        why: "Sorting and comprehensions are two things you will use every week for the rest of the course. Then you check what you have learned so far.",
        goal: "Sort with `key=`, build lists with comprehensions, and pass freeCodeCamp's basics review and quiz.",
        minutes: 170,
        learn: [
          learn(
            "docs",
            "Google's Python Class: Sorting",
            g("sorting"),
            "30 minutes. sorted(), key=, tuples and list comprehensions.",
          ),
          learn(
            "lab",
            "freeCodeCamp: Loops and sequences (the remaining pages)",
            fcc("lecture-working-with-loops-and-sequences"),
            "25 minutes. enumerate, zip, comprehensions and lambda.",
          ),
          mike("1:18:57", "Mike Dane: Tuples", "6 minutes: 1:18:57 to 1:24:15."),
        ],
        practice: [
          learn(
            "docs",
            "Google basic exercise: list1.py (the rest) and list2.py",
            g("exercises/basic"),
            "45 minutes. front_x and sort_last in list1.py, then linear_merge in list2.py. If one is too hard, skip it, finish the others, and come back.",
          ),
          learn(
            "lab",
            "freeCodeCamp lab: Number pattern generator",
            fcc("lab-number-pattern-generator"),
            "30 minutes. Loops that build a string.",
          ),
          learn(
            "lab",
            "freeCodeCamp: Python basics review",
            fcc("review-python-basics"),
            "15 minutes. A single-page summary. Read it with the lecture in your head.",
          ),
          learn(
            "lab",
            "freeCodeCamp quiz: Python basics",
            fcc("quiz-python-basics"),
            "15 minutes. Aim for 80% or better; if not, note which topic and redo its lecture page.",
          ),
          learn(
            "lab",
            "freeCodeCamp quiz: Loops and sequences",
            fcc("quiz-loops-and-sequences"),
            "10 minutes.",
          ),
        ],
        check: [
          "How do you sort a list of words by their last letter?",
          "Write a list comprehension for the squares of the even numbers from 1 to 20.",
          "What is a tuple, and why would you choose one over a list?",
        ],
        ship: "list1.py passing, list2.py attempted, and the two quiz scores written down.",
      }),
    ],
  },
  {
    number: 3,
    title: "Data, files and errors",
    summary:
      "Store information by name with dictionaries, read and write files, handle things going wrong, and match text with regular expressions. This is the week programs start to touch the real world.",
    checkpoint:
      "You can read a text file, count and group what is in it with a dictionary, and keep the program running when the file is missing or the data is bad.",
    days: [
      day(3, 1, {
        title: "Dictionaries and sets",
        why: "A dictionary looks things up by name instead of by position. It is the most useful data structure in everyday Python, and the idea behind every database.",
        goal: "Create, read, update and loop over dictionaries, and use sets to remove duplicates and compare groups.",
        minutes: 170,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Dictionaries and sets (3 pages)",
            fcc("lecture-working-with-dictionaries-and-sets"),
            "30 minutes. Creating, looping, and the set operations.",
          ),
          learn(
            "docs",
            "Google's Python Class: Dict and Files (the dict part)",
            g("dict-files"),
            "20 minutes. Stop where it moves on to files; that is tomorrow.",
          ),
          googleLecture(
            "haycL41dAhg",
            "Google lecture 1.3: Dicts and files",
            "Watch the first half on dicts, about 20 minutes.",
          ),
          mike("2:07:17", "Mike Dane: Dictionaries", "7 minutes: 2:07:17 to 2:14:13."),
        ],
        practice: [
          task(
            "Write `wordfreq.py`: given a sentence in a string, count how many times each word appears using a dictionary, then print the counts.",
          ),
          task(
            "Write a small phone book: a dictionary of names to numbers, with functions to add, look up (without crashing on a missing name, use `.get()`) and delete.",
          ),
          task(
            "Use sets: from two sentences, print the words in both, the words in only the first, and the number of unique words overall.",
          ),
          learn(
            "lab",
            "freeCodeCamp lab: User configuration manager",
            fcc("lab-user-configuration-manager"),
            "35 minutes. Dictionaries with real rules.",
          ),
          learn(
            "lab",
            "freeCodeCamp quiz: Dictionaries and sets",
            fcc("quiz-dictionaries-and-sets"),
            "10 minutes.",
          ),
        ],
        check: [
          "What is the difference between `d['x']` and `d.get('x')` when the key is missing?",
          "Why can a list not be a dictionary key, but a tuple can?",
          "What does `set([1, 2, 2, 3])` give, and why?",
        ],
        ship: "wordfreq.py, the phone book and the set exercise in one folder.",
      }),
      day(3, 2, {
        title: "Files and modules",
        why: "Real programs read data that lives somewhere else and keep it after they stop. A module is how you borrow code that someone else already wrote and tested.",
        goal: "Read and write text files with `with open(...)`, import from the standard library, and install a package with pip.",
        minutes: 180,
        learn: [
          learn(
            "docs",
            "Google's Python Class: Dict and Files (the files part)",
            g("dict-files"),
            "20 minutes. Reading lines, and the incremental development tip near the end: it will save you hours.",
          ),
          learn(
            "lab",
            "freeCodeCamp: The standard library and modules",
            fcc("lecture-working-with-modules"),
            "15 minutes.",
          ),
          mike(
            "3:12:41",
            "Mike Dane: Reading files, writing files, modules and pip",
            "30 minutes. 3:12:41 to 3:43:56.",
          ),
          learn(
            "docs",
            "Python tutorial: Reading and writing files",
            `${PYDOCS}/tutorial/inputoutput.html#reading-and-writing-files`,
            "Optional, 10 minutes.",
          ),
        ],
        practice: [
          learn(
            "docs",
            "Google basic exercise: wordcount.py",
            g("exercises/basic"),
            "75 minutes. The big one: count the words in a file, print them alphabetically (--count) and by most common (--topcount). Build it in small steps, as the tip says: first get the word list printing, then the counts.",
          ),
          task(
            "Write `notes.py`: ask for a line of text, append it to `notes.txt`, then print everything in the file with line numbers. Run it three times and check the file.",
          ),
          learn(
            "lab",
            "freeCodeCamp workshop: Medical data validator (44 steps)",
            fcc("workshop-medical-data-validator"),
            "Stretch, 60 minutes or more. Do it later in the week if you are short of time.",
          ),
        ],
        check: [
          "Why use `with open(...)` instead of calling `open()` and `close()` yourself?",
          "What is the difference between opening a file with `'w'` and with `'a'`?",
          "What does `import os` give you, and how do you find out what is inside it?",
        ],
        ship: "wordcount.py running on a book from Project Gutenberg, and notes.py.",
      }),
      day(3, 3, {
        title: "When things go wrong: errors and debugging",
        why: "Programs fail. The skill is not avoiding errors, it is reading them, finding the cause, and deciding what the program should do next.",
        goal: "Read a traceback, handle expected failures with try and except, and debug with print and the debugger.",
        minutes: 165,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Error handling (4 pages)",
            fcc("lecture-understanding-error-handling"),
            "35 minutes. Common errors, debugging techniques, try/except and raise.",
          ),
          learn(
            "docs",
            "Google's Python Class: Utilities (the exceptions part)",
            g("utilities"),
            "10 minutes. Read the short section on exceptions.",
          ),
          mike("3:04:17", "Mike Dane: Try / except", "8 minutes: 3:04:17 to 3:12:41."),
          learn(
            "docs",
            "pdb: the Python debugger",
            `${PYDOCS}/library/pdb.html`,
            "Optional. Put `breakpoint()` in any program, run it, and use `n` to step and `p name` to print a value.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp lab: Debug an ISBN validator",
            fcc("lab-isbn-validator"),
            "40 minutes. Fix a program someone else wrote: the most realistic skill in this course.",
          ),
          task(
            "Write `safe_number()`: keep asking until the user types a valid number, catching ValueError, and return it as a float.",
          ),
          task(
            "Make `wordcount.py` from yesterday print a clear message and exit cleanly when the file does not exist, using `except FileNotFoundError`.",
          ),
          task(
            "Cause these on purpose and write one line on what each means: NameError, TypeError (`'a' + 1`), IndexError, KeyError, ZeroDivisionError.",
          ),
          learn("lab", "freeCodeCamp quiz: Error handling", fcc("quiz-error-handling"), "10 minutes."),
        ],
        check: [
          "In a traceback, which line do you read first, and which line tells you where your code went wrong?",
          "Why is `except:` with nothing after it a bad idea?",
          "What does `raise ValueError('bad input')` do?",
        ],
        ship: "safe_number(), wordcount.py with error handling, and your list of five errors.",
      }),
      day(3, 4, {
        title: "Text patterns: regular expressions and the standard library",
        why: "A regular expression describes a pattern in text: an email, a date, a phone number. It is a small language inside Python that saves you pages of string code.",
        goal: "Find, extract and replace text with `re`, and use the standard library for files and running programs.",
        minutes: 175,
        learn: [
          googleLecture(
            "kWyoYtvJpe4",
            "Google lecture 2.1: Regular expressions",
            "30 minutes. Watch it before you read the page.",
          ),
          learn(
            "docs",
            "Google's Python Class: Regular Expressions",
            g("regular-expressions"),
            "45 minutes. Basic patterns, repetition, groups and findall. The email example is worth typing in.",
          ),
          learn(
            "docs",
            "regex101: try patterns live",
            "https://regex101.com/",
            "Pick the Python flavour on the left. Paste text and your pattern, and see every match highlighted with an explanation.",
          ),
          learn(
            "docs",
            "Python Regular Expression HOWTO",
            `${PYDOCS}/howto/regex.html`,
            "Optional. Use it as a reference.",
          ),
          learn(
            "docs",
            "Google's Python Class: Utilities (os, shutil, subprocess)",
            g("utilities"),
            "Skim the file system and running-programs sections. You will use these in weeks 3 and 4 of the main plan.",
          ),
        ],
        practice: [
          learn(
            "docs",
            "Google exercise: Baby Names (part A)",
            g("exercises/baby-names"),
            "60 minutes. Parse HTML files to extract names with a regular expression. Do part A today. Part B is a stretch.",
          ),
          task(
            "Write `extract.py`: from a block of text, use `re.findall` to print every email address and every number that looks like a phone number.",
          ),
          task("Use `re.sub` to replace every run of spaces in a string with a single space."),
        ],
        check: [
          "What does `\\d+` match, and what does `\\d{3}` match?",
          "What is the difference between `re.search` and `re.findall`?",
          "What do the parentheses in a pattern do?",
        ],
        ship: "extract.py and your answer to baby names part A.",
      }),
    ],
  },
  {
    number: 4,
    title: "Classes, tools and a final project",
    summary:
      "Model things with classes, learn the tools professional Python programmers use every day, and finish with a project that proves you are ready for week 1 of the main plan.",
    checkpoint:
      "You have a small project in a git repo with a README, tests and a virtual environment, and you can explain every line of it.",
    days: [
      day(4, 1, {
        title: "Classes and objects",
        why: "A class bundles data with the functions that work on it. It is how you describe a bank account, a game character or a network connection in code.",
        goal: "Write a class with attributes and methods, create objects from it, and explain what `self` is.",
        minutes: 170,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Classes and objects (4 pages)",
            fcc("lecture-classes-and-objects"),
            "35 minutes. Classes versus objects, methods and attributes, special methods like __init__ and __str__.",
          ),
          mike(
            "3:43:56",
            "Mike Dane: Classes and objects, and object functions",
            "20 minutes: 3:43:56 to 3:57:37, then 4:08:28 to 4:12:37.",
          ),
          learn(
            "docs",
            "Python tutorial: Classes (sections 9.1 to 9.4)",
            `${PYDOCS}/tutorial/classes.html`,
            "20 minutes. A precise version of what you just watched. Come back to the rest later.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp workshop: Musical instrument inventory (13 steps)",
            fcc("workshop-musical-instrument-inventory"),
            "35 minutes.",
          ),
          learn("lab", "freeCodeCamp lab: Planet class", fcc("lab-planet-class"), "30 minutes."),
          task(
            "Write a `BankAccount` class with `deposit`, `withdraw` (refusing to go below zero) and a `__str__` that prints the balance. Create two accounts and check they do not share a balance.",
          ),
          learn(
            "lab",
            "freeCodeCamp quiz: Classes and objects",
            fcc("quiz-classes-and-objects"),
            "10 minutes.",
          ),
        ],
        check: [
          "What is `self`, and why does every method have it?",
          "What is the difference between a class and an object?",
          "What does `__init__` do, and when does it run?",
        ],
        ship: "BankAccount with a few tests of your own, and both freeCodeCamp builds.",
      }),
      day(4, 2, {
        title: "Object-oriented programming: inheritance, encapsulation, abstraction",
        why: "Once you have a few classes, you start to see repeated parts. Inheritance and encapsulation are the tools for sharing code and protecting data.",
        goal: "Make a subclass, override a method, and keep an attribute private behind a property.",
        minutes: 170,
        learn: [
          learn(
            "lab",
            "freeCodeCamp: Object-oriented programming and encapsulation (2 pages)",
            fcc("lecture-understanding-object-oriented-programming-and-encapsulation"),
            "25 minutes. Getters and setters.",
          ),
          learn(
            "lab",
            "freeCodeCamp: Inheritance and polymorphism (3 pages)",
            fcc("lecture-understanding-inheritance-and-polymorphism"),
            "30 minutes.",
          ),
          learn("lab", "freeCodeCamp: Abstraction", fcc("lecture-understanding-abstraction"), "10 minutes."),
          mike("4:12:37", "Mike Dane: Inheritance", "8 minutes: 4:12:37 to 4:20:43."),
        ],
        practice: [
          learn(
            "lab",
            "freeCodeCamp workshop: Salary tracker (40 steps)",
            fcc("workshop-salary-tracker"),
            "75 minutes. A long one: stop at any step boundary and come back.",
          ),
          learn(
            "lab",
            "freeCodeCamp lab: Game character stats",
            fcc("lab-game-character-stats"),
            "30 minutes.",
          ),
          task(
            "Extend `BankAccount` into a `SavingsAccount` that adds interest, and reuse the parent's `deposit` and `withdraw` through `super()`.",
          ),
          learn(
            "lab",
            "freeCodeCamp quiz: Object-oriented programming",
            fcc("quiz-object-oriented-programming"),
            "10 minutes.",
          ),
        ],
        check: [
          "What does `super().__init__(...)` do?",
          "What is polymorphism, in your own example with two classes?",
          "Why would you hide an attribute behind a property?",
        ],
        ship: "SavingsAccount, plus the salary tracker and game character labs.",
      }),
      day(4, 3, {
        title: "Your toolbox: virtual environments, pytest, git and the command line",
        why: "Every project from the main plan assumes these tools. Learn them now, on small code, rather than while also learning a new topic.",
        goal: "Start a project with its own environment, install a package, test a function with pytest, and commit the work with git.",
        minutes: 170,
        learn: [
          learn(
            "docs",
            "Python tutorial: Virtual environments and pip",
            `${PYDOCS}/tutorial/venv.html`,
            "15 minutes. Why every project has its own set of packages.",
          ),
          learn(
            "docs",
            "uv: install and first project",
            "https://docs.astral.sh/uv/",
            "10 minutes. The main plan uses uv; `uv init` and `uv add` do what the venv tutorial does, faster.",
          ),
          learn(
            "docs",
            "pytest: getting started",
            "https://docs.pytest.org/en/stable/getting-started.html",
            "15 minutes. A test is a function that starts with `test_` and uses `assert`.",
          ),
          learn(
            "video",
            "freeCodeCamp: Git and GitHub for beginners (crash course)",
            yt("RGOj5yH7evk"),
            "1 hour in full. Watch the first 30 minutes: init, add, commit, branch.",
          ),
          googleLecture(
            "Nn2KQmVF5Og",
            "Google lecture 2.3: Utilities, urllib",
            "Optional, 25 minutes. Fetching a web page from Python.",
          ),
        ],
        practice: [
          task(
            "Make a new folder, create a virtual environment with `uv init` (or `python3 -m venv .venv`), activate it, and install `requests` with `uv add requests` (or pip).",
          ),
          task(
            "Write a script that downloads a web page with `requests.get` and prints the status code and the first 200 characters.",
          ),
          task(
            "Write three pytest tests for `letter_grade()` from week 2 (a normal grade, the top edge, and a bad score). Run `pytest`.",
          ),
          task(
            "Run `git init`, commit with a clear message, make a change on a new branch, and merge it back. Push the repo to GitHub if you have an account.",
          ),
        ],
        check: [
          "What problem does a virtual environment solve?",
          "How do you tell pytest that a test should pass only if a function raises an error?",
          "What is the difference between `git add` and `git commit`?",
        ],
        ship: "A repo with a README, one script, three passing tests and at least four meaningful commits.",
      }),
      day(4, 4, {
        title: "Final project and the readiness check",
        why: "A real project forces every idea from the last four weeks to work together. Finishing one is the best proof you are ready for the main plan.",
        goal: "Finish one project from scratch, pass the final review, and decide whether you are ready for Week 1.",
        minutes: 180,
        learn: [
          googleLecture(
            "IcteAbMC1Ok",
            "Google lecture 2.4: Conclusions",
            "10 minutes. What to learn next and how to keep going.",
          ),
          learn(
            "lab",
            "freeCodeCamp: Python review (all topics on one page)",
            fcc("review-python"),
            "20 minutes. Skim it and mark every line you could not explain.",
          ),
          learn(
            "read",
            "freeCodeCamp: The Python Handbook",
            `${FCC_NEWS}/the-python-handbook/`,
            "A reference to keep. Look up what you could not explain.",
          ),
        ],
        practice: [
          learn(
            "lab",
            "Pick one: freeCodeCamp lab: Budget app",
            fcc("lab-budget-app"),
            "A class-based project. About 90 minutes.",
          ),
          learn(
            "docs",
            "Or pick one: Google exercise: Copy Special",
            g("exercises/copy-special"),
            "Files, paths and running a command. About 90 minutes.",
          ),
          learn(
            "docs",
            "Or pick one: Google exercise: Log Puzzle",
            g("exercises/log-puzzle"),
            "Regular expressions, sorting and downloading. About 90 minutes.",
          ),
          task(
            "Put the finished project in a git repo with a README that says what it does and how to run it, and add at least three pytest tests.",
          ),
          task(
            "Bridge to week 1: the main plan reuses what you did here. Week 1 revises weeks 1 and 2 of Foundations, week 1 day 4 and week 2 build on pytest, and the lessons on classes, exceptions and type hints build on weeks 3 and 4. Read the Python path page once to see the map.",
          ),
          task(
            "Readiness check: without looking anything up, write FizzBuzz, a word counter for a file, and a class with two methods. If any took more than 15 minutes, redo the matching day before starting Week 1.",
          ),
        ],
        check: [
          "Explain, line by line, what your project does to someone who has not seen it.",
          "Which of the four weeks was hardest, and which exercise would you redo?",
          "What is one thing you want to be able to do in Python that you cannot do yet?",
        ],
        ship: "A finished project in a git repo, and a pass or redo decision for each of the four weeks.",
      }),
    ],
  },
];

export const FOUNDATION_DAYS: FoundationDay[] = FOUNDATION_WEEKS.flatMap((w) => w.days);

export const foundationHref = (week: number, n: number) => `/foundations/${week}/${n}`;
export const findFoundationDay = (week: string | number, n: string | number) =>
  FOUNDATION_DAYS.find((d) => String(d.week) === String(week) && String(d.n) === String(n)) ?? null;

/** The three sources and why each is used, for the overview page. */
export const FOUNDATION_SOURCES = [
  {
    title: "freeCodeCamp: Python (interactive curriculum)",
    url: "https://www.freecodecamp.org/learn/python-v9/",
    why: "Written for people who have never programmed. Short lectures, then workshops and labs you complete in the browser. Start every topic here.",
  },
  {
    title: "Google's Python Class",
    url: "https://developers.google.com/edu/python",
    why: "Google's own two-day Python course: clear notes, lecture videos, and exercises you run on your own machine. It assumes a little programming, so it comes after the freeCodeCamp pass.",
  },
  {
    title: "freeCodeCamp: Learn Python, full course for beginners (video)",
    url: yt(FCC_COURSE),
    why: "A 4.5 hour video, split by chapter. Each day links to the chapters it needs, so you never have to scrub through it.",
  },
] as const;
