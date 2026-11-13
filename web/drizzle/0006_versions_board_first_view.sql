CREATE TABLE "work" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"handoff" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"added_by" uuid,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_feedback" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_id" uuid NOT NULL,
	"text" text NOT NULL,
	"person_id" uuid NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- Items sent before slice 4 each become a piece of work with one version, owned by their sender,
-- with the item's id as the work's id (layer1-versions-board-first-view#AC-1). The columns are
-- filled before they are made NOT NULL.
ALTER TABLE "review_item" ADD COLUMN "work_id" uuid;--> statement-breakpoint
ALTER TABLE "review_item" ADD COLUMN "version" integer;--> statement-breakpoint
INSERT INTO "work" ("id", "project_id", "title", "handoff", "owner_id", "added_by", "added_at", "assigned_at")
SELECT "id", "project_id", "title", "handoff", "sent_by", NULL, "sent_at", "sent_at" FROM "review_item";--> statement-breakpoint
UPDATE "review_item" SET "work_id" = "id", "version" = 1;--> statement-breakpoint
ALTER TABLE "review_item" ALTER COLUMN "work_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "review_item" ALTER COLUMN "version" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "review_item" ADD COLUMN "restored_from" integer;--> statement-breakpoint
ALTER TABLE "work" ADD CONSTRAINT "work_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work" ADD CONSTRAINT "work_owner_id_person_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work" ADD CONSTRAINT "work_added_by_person_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_feedback" ADD CONSTRAINT "work_feedback_item_id_review_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."review_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_feedback" ADD CONSTRAINT "work_feedback_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "work_project_idx" ON "work" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "work_feedback_item_idx" ON "work_feedback" USING btree ("item_id","at");--> statement-breakpoint
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_work_id_work_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "review_item_work_version_idx" ON "review_item" USING btree ("work_id","version");