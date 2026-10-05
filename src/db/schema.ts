import { relations } from "drizzle-orm";
import { index, integer, pgEnum, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

export const itemSection = pgEnum("item_section", ["learn", "build", "dsa_learn", "dsa_problem", "swe"]);
export const itemKind = pgEnum("item_kind", ["read", "video", "docs", "lab", "task", "problem"]);
export const difficulty = pgEnum("difficulty", ["E", "M", "H"]);

export const phases = pgTable("phases", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  language: text("language").notNull(),
  position: integer("position").notNull(),
});

export const weeks = pgTable("weeks", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  phaseId: integer("phase_id")
    .notNull()
    .references(() => phases.id),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  project: text("project").notNull(),
});

export const days = pgTable(
  "days",
  {
    id: serial("id").primaryKey(),
    weekId: integer("week_id")
      .notNull()
      .references(() => weeks.id, { onDelete: "cascade" }),
    numberInWeek: integer("number_in_week").notNull(),
    globalIndex: integer("global_index").notNull().unique(), // 0-based position in the whole plan
    title: text("title").notNull(),
    why: text("why").notNull(),
    ship: text("ship").notNull(),
    dsaTitle: text("dsa_title").notNull(),
    sweTitle: text("swe_title").notNull(),
  },
  (t) => [unique("days_week_number_uq").on(t.weekId, t.numberInWeek)],
);

// `key` is the stable public id (guests store it locally; progress rows reference the row id).
// Editing an item never changes its key. Removing one sets archivedAt.
export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull().unique(),
    dayId: integer("day_id")
      .notNull()
      .references(() => days.id, { onDelete: "cascade" }),
    section: itemSection("section").notNull(),
    kind: itemKind("kind").notNull(),
    title: text("title").notNull(),
    url: text("url"),
    note: text("note"),
    difficulty: difficulty("difficulty"),
    position: integer("position").notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [index("items_day_idx").on(t.dayId, t.section, t.position)],
);

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id")
    .notNull()
    .references(() => days.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  body: text("body").notNull(),
});

export const phasesRelations = relations(phases, ({ many }) => ({ weeks: many(weeks) }));
export const weeksRelations = relations(weeks, ({ one, many }) => ({
  phase: one(phases, { fields: [weeks.phaseId], references: [phases.id] }),
  days: many(days),
}));
export const daysRelations = relations(days, ({ one, many }) => ({
  week: one(weeks, { fields: [days.weekId], references: [weeks.id] }),
  items: many(items),
  questions: many(questions),
}));
export const itemsRelations = relations(items, ({ one }) => ({
  day: one(days, { fields: [items.dayId], references: [days.id] }),
}));
export const questionsRelations = relations(questions, ({ one }) => ({
  day: one(days, { fields: [questions.dayId], references: [days.id] }),
}));
