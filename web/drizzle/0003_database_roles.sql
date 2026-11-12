-- The application's database roles (layer1-facts-identifiers-activity#AC-38). The app's pool
-- runs SET ROLE xr_app on each connection; migrations run as the owning user.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'xr_app') THEN
    CREATE ROLE xr_app NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'xr_retention') THEN
    CREATE ROLE xr_retention NOLOGIN;
  END IF;
END $$;
--> statement-breakpoint
-- The user that runs migrations may set either role. A superuser already can; elsewhere the
-- grant needs the right to administer the role, so a refusal is left for the operator.
DO $$
BEGIN
  EXECUTE format('GRANT xr_app, xr_retention TO %I', current_user);
EXCEPTION WHEN insufficient_privilege OR invalid_grant_operation THEN
  RAISE NOTICE 'xr_app and xr_retention were not granted to %', current_user;
END $$;
--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO xr_app, xr_retention;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO xr_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO xr_app;
--> statement-breakpoint
-- The three ledgers: the application inserts and reads; only the retention role deletes.
REVOKE UPDATE, DELETE, TRUNCATE ON fact_version, identifier_confirmation, activity_entry FROM xr_app;
--> statement-breakpoint
GRANT SELECT, DELETE ON fact_version, identifier_confirmation, activity_entry TO xr_retention;
--> statement-breakpoint
-- Organisations made in slice 1 start with the five starter formats On, as new ones do (AC-27).
INSERT INTO identifier_format (id, organisation_id, name, kind, is_on, starter, position)
SELECT gen_random_uuid(), o.id, s.name, s.kind, true, true, s.position
FROM organisation o
CROSS JOIN (VALUES
  ('Bank account number (Canada)', 'bank', 1),
  ('Social Insurance Number', 'sin', 2),
  ('Business Number', 'bn', 3),
  ('GST/HST number', 'gst', 4),
  ('Payment card number', 'card', 5)
) AS s(name, kind, position)
WHERE NOT EXISTS (SELECT 1 FROM identifier_format f WHERE f.organisation_id = o.id AND f.starter);
