// A day is five short pages, one topic each. The order below is the suggested order, not a rule.
export const STEPS = [
  { slug: "learn", label: "Learn", minutes: 45, blurb: "Read and watch the sources picked for today" },
  { slug: "build", label: "Build", minutes: 60, blurb: "Make something small that works" },
  { slug: "dsa", label: "DSA", minutes: 60, blurb: "Practice problems in Python" },
  {
    slug: "engineering",
    label: "Engineering",
    minutes: 15,
    blurb: "One habit that makes you better at the craft",
  },
  { slug: "check", label: "Check", minutes: 10, blurb: "Answer from memory and write it down" },
] as const;

export type StepSlug = (typeof STEPS)[number]["slug"];
export const isStep = (s: string): s is StepSlug => STEPS.some((x) => x.slug === s);
export const stepHref = (week: number, day: number, slug: StepSlug) => `/day/${week}/${day}/${slug}`;
