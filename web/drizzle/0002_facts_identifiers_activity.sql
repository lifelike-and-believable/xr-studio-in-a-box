CREATE TABLE "activity_entry" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid,
	"organisation_id" uuid,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_person_id" uuid,
	"actor_kind" text NOT NULL,
	"area" text NOT NULL,
	"what" text NOT NULL,
	CONSTRAINT "activity_entry_one_owner" CHECK (num_nonnulls("activity_entry"."project_id", "activity_entry"."organisation_id") = 1)
);
--> statement-breakpoint
CREATE TABLE "fact_version" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid,
	"organisation_id" uuid,
	"fact" text NOT NULL,
	"number" integer NOT NULL,
	"value" jsonb NOT NULL,
	"saved_by" uuid NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"restored_from" integer,
	"confirmation_id" uuid,
	CONSTRAINT "fact_version_one_owner" CHECK (num_nonnulls("fact_version"."project_id", "fact_version"."organisation_id") = 1)
);
--> statement-breakpoint
CREATE TABLE "identifier_confirmation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid,
	"organisation_id" uuid,
	"fact" text,
	"upload_id" uuid,
	"format_ids" jsonb NOT NULL,
	"text_hash" text NOT NULL,
	"answer" text NOT NULL,
	"person_id" uuid NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "identifier_confirmation_one_owner" CHECK (num_nonnulls("identifier_confirmation"."project_id", "identifier_confirmation"."organisation_id") = 1)
);
--> statement-breakpoint
CREATE TABLE "identifier_format" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organisation_id" uuid NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"pattern" text,
	"is_on" boolean DEFAULT true NOT NULL,
	"starter" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"added_by" uuid,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "stored_file" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid,
	"organisation_id" uuid,
	"storage_key" text NOT NULL,
	"file_name" text NOT NULL,
	"media_type" text NOT NULL,
	"size" bigint NOT NULL,
	"sha256" text NOT NULL,
	"added_by" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stored_file_storage_key_unique" UNIQUE("storage_key"),
	CONSTRAINT "stored_file_one_owner" CHECK (num_nonnulls("stored_file"."project_id", "stored_file"."organisation_id") = 1)
);
--> statement-breakpoint
CREATE TABLE "upload" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid,
	"organisation_id" uuid,
	"request_id" uuid NOT NULL,
	"title" text NOT NULL,
	"file_name" text NOT NULL,
	"media_type" text NOT NULL,
	"declared_size" bigint NOT NULL,
	"storage_key" text NOT NULL,
	"state" text DEFAULT 'pending' NOT NULL,
	"held_until" timestamp with time zone,
	"matches" jsonb,
	"file_id" uuid,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "upload_request_id_unique" UNIQUE("request_id"),
	CONSTRAINT "upload_storage_key_unique" UNIQUE("storage_key"),
	CONSTRAINT "upload_one_owner" CHECK (num_nonnulls("upload"."project_id", "upload"."organisation_id") = 1)
);
--> statement-breakpoint
ALTER TABLE "activity_entry" ADD CONSTRAINT "activity_entry_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_entry" ADD CONSTRAINT "activity_entry_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_entry" ADD CONSTRAINT "activity_entry_actor_person_id_person_id_fk" FOREIGN KEY ("actor_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fact_version" ADD CONSTRAINT "fact_version_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fact_version" ADD CONSTRAINT "fact_version_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fact_version" ADD CONSTRAINT "fact_version_saved_by_person_id_fk" FOREIGN KEY ("saved_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identifier_confirmation" ADD CONSTRAINT "identifier_confirmation_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identifier_confirmation" ADD CONSTRAINT "identifier_confirmation_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identifier_confirmation" ADD CONSTRAINT "identifier_confirmation_upload_id_upload_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."upload"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identifier_confirmation" ADD CONSTRAINT "identifier_confirmation_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identifier_format" ADD CONSTRAINT "identifier_format_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identifier_format" ADD CONSTRAINT "identifier_format_added_by_person_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stored_file" ADD CONSTRAINT "stored_file_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stored_file" ADD CONSTRAINT "stored_file_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stored_file" ADD CONSTRAINT "stored_file_added_by_person_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload" ADD CONSTRAINT "upload_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload" ADD CONSTRAINT "upload_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload" ADD CONSTRAINT "upload_file_id_stored_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."stored_file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload" ADD CONSTRAINT "upload_created_by_person_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_entry_project_idx" ON "activity_entry" USING btree ("project_id","at");--> statement-breakpoint
CREATE INDEX "activity_entry_organisation_idx" ON "activity_entry" USING btree ("organisation_id","at");--> statement-breakpoint
CREATE UNIQUE INDEX "fact_version_project_idx" ON "fact_version" USING btree ("project_id","fact","number") WHERE "fact_version"."project_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "fact_version_organisation_idx" ON "fact_version" USING btree ("organisation_id","fact","number") WHERE "fact_version"."organisation_id" is not null;--> statement-breakpoint
CREATE INDEX "identifier_confirmation_fact_idx" ON "identifier_confirmation" USING btree ("project_id","organisation_id","fact","text_hash");--> statement-breakpoint
CREATE INDEX "identifier_format_organisation_idx" ON "identifier_format" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "upload_held_idx" ON "upload" USING btree ("state","held_until");