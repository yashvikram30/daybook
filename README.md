# Daybook

A free, 16-week computer science self-study plan, taught in Python. Each day has a short lesson, curated links, a small build, a check-your-understanding step, and a place to write your own notes. Progress, revision cards and notes live in your browser, and sync to your account if you sign in.

## What is in it

- **Part 0: Python foundations.** Four weeks for people new to programming: variables, strings, functions, lists, dictionaries, files, errors, classes, testing and git.
- **The 16-week plan**, four days a week, in seven phases:
  1. Architecture (weeks 1-2)
  2. Operating systems (3-4)
  3. Networking (5-6)
  4. Databases (7-8)
  5. Distributed systems (9-10)
  6. Software engineering (11)
  7. Machine learning and generative AI (12-16)
- **Every day** has Learn, Build, DSA, Engineering and Check steps, with notes written in plain language and a reading list.
- **Revision lab.** Spaced-repetition cards and questions for each pair of weeks.
- **Second brain.** Your own Markdown notes with `[[wiki links]]` to other notes and to any day, `#tags`, backlinks, tasks, and export.
- **Schedule and streaks**, so you can see whether you are on track.

## Run it locally

You need Node.js 20 or later.

```bash
npm install
cp .env.example .env.local   # then fill it in (see below)
npm run dev                  # http://localhost:3000
```

The course content works without any configuration. Signing in and cross-device sync need the environment variables below.

| Variable                               | Used for                                                              |
| -------------------------------------- | --------------------------------------------------------------------- |
| `MONGODB_URI`, `MONGODB_DB`            | Storing synced progress and notes (MongoDB Atlas)                     |
| `AUTH_SECRET`                          | Auth.js session signing (`openssl rand -base64 33`)                   |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google sign-in. The redirect URI is `<site>/api/auth/callback/google` |
| `AUTH_URL`                             | Only when not hosting on Vercel: the public URL                       |

If `mongodb+srv://` fails locally with `querySrv EREFUSED`, your network's DNS is refusing SRV lookups. Switch to a public DNS server, or use Atlas's standard `mongodb://` connection string.

## Scripts

| Command              | Does                                                      |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | start the dev server                                      |
| `npm run build`      | production build                                          |
| `npm run lint`       | ESLint                                                    |
| `npm run typecheck`  | TypeScript check                                          |
| `npm test`           | Vitest                                                    |
| `npm run data:build` | regenerate `src/data/curriculum.json` from `data/legacy/` |

## Where the content lives

- `data/notes/<day>.md`: the lesson text for each day (`w3d2` is week 3, day 2; `f2d1` is foundations week 2, day 1). Sections start with `@@ learn`, `@@ build`, `@@ dsa`, `@@ engineering` and `@@ check`, and each may end with a `# Further reading` list.
- `data/legacy/*.js`: the plan's structure, links and exercises. After editing, run `npm run data:build`.
- `src/data/foundations.ts`: Part 0 days and their links.
- `src/data/revision/`: revision questions and cards.

## Built with

Next.js (App Router) and React, Auth.js, MongoDB, and Vitest. Notes, progress and review state are stored in `localStorage` first and synced per user.
