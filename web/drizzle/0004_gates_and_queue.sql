CREATE TABLE "approval_assignment" (
	"project_id" uuid NOT NULL,
	"slot" text NOT NULL,
	"approver_id" uuid NOT NULL,
	"delegate_id" uuid,
	CONSTRAINT "approval_assignment_project_id_slot_pk" PRIMARY KEY("project_id","slot")
);
--> statement-breakpoint
CREATE TABLE "review_decision" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_id" uuid NOT NULL,
	"decision" text NOT NULL,
	"feedback" text DEFAULT '' NOT NULL,
	"decided_by" uuid NOT NULL,
	"decided_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_decision_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "review_item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"handoff" text NOT NULL,
	"title" text NOT NULL,
	"what_changed" text NOT NULL,
	"file_id" uuid,
	"waiting_handoff" text,
	"sent_by" uuid NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"handed_to" uuid,
	"handed_by" uuid
);
--> statement-breakpoint
CREATE TABLE "review_recommendation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_id" uuid NOT NULL,
	"result" text NOT NULL,
	"reason" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "identifier_confirmation" ADD COLUMN "review_item_id" uuid;--> statement-breakpoint
ALTER TABLE "upload" ADD COLUMN "purpose" text DEFAULT 'work-sample' NOT NULL;--> statement-breakpoint
ALTER TABLE "approval_assignment" ADD CONSTRAINT "approval_assignment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_assignment" ADD CONSTRAINT "approval_assignment_approver_id_person_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_assignment" ADD CONSTRAINT "approval_assignment_delegate_id_person_id_fk" FOREIGN KEY ("delegate_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decision" ADD CONSTRAINT "review_decision_item_id_review_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."review_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decision" ADD CONSTRAINT "review_decision_decided_by_person_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_file_id_stored_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."stored_file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_sent_by_person_id_fk" FOREIGN KEY ("sent_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_handed_to_person_id_fk" FOREIGN KEY ("handed_to") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_handed_by_person_id_fk" FOREIGN KEY ("handed_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_recommendation" ADD CONSTRAINT "review_recommendation_item_id_review_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."review_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "review_item_project_idx" ON "review_item" USING btree ("project_id","sent_at");--> statement-breakpoint
ALTER TABLE "identifier_confirmation" ADD CONSTRAINT "identifier_confirmation_review_item_id_review_item_id_fk" FOREIGN KEY ("review_item_id") REFERENCES "public"."review_item"("id") ON DELETE no action ON UPDATE no action;