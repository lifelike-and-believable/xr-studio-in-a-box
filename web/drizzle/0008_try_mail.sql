CREATE TABLE "try_mail" (
	"id" uuid PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"subject" text NOT NULL,
	"text" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "try_mail_sent_idx" ON "try_mail" USING btree ("sent_at");