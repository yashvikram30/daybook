CREATE TYPE "public"."difficulty" AS ENUM('E', 'M', 'H');--> statement-breakpoint
CREATE TYPE "public"."item_kind" AS ENUM('read', 'video', 'docs', 'lab', 'task', 'problem');--> statement-breakpoint
CREATE TYPE "public"."item_section" AS ENUM('learn', 'build', 'dsa_learn', 'dsa_problem', 'swe');--> statement-breakpoint
CREATE TABLE "days" (
	"id" serial PRIMARY KEY NOT NULL,
	"week_id" integer NOT NULL,
	"number_in_week" integer NOT NULL,
	"global_index" integer NOT NULL,
	"title" text NOT NULL,
	"why" text NOT NULL,
	"ship" text NOT NULL,
	"dsa_title" text NOT NULL,
	"swe_title" text NOT NULL,
	CONSTRAINT "days_global_index_unique" UNIQUE("global_index"),
	CONSTRAINT "days_week_number_uq" UNIQUE("week_id","number_in_week")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"day_id" integer NOT NULL,
	"section" "item_section" NOT NULL,
	"kind" "item_kind" NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"note" text,
	"difficulty" "difficulty",
	"position" integer NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "items_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "phases" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"language" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "phases_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_id" integer NOT NULL,
	"position" integer NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weeks" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"phase_id" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"project" text NOT NULL,
	CONSTRAINT "weeks_number_unique" UNIQUE("number")
);
--> statement-breakpoint
ALTER TABLE "days" ADD CONSTRAINT "days_week_id_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_day_id_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_day_id_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weeks" ADD CONSTRAINT "weeks_phase_id_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."phases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "items_day_idx" ON "items" USING btree ("day_id","section","position");