-- The decision ledger, like slice 2's ledgers: the application inserts and reads; only the
-- retention role deletes (layer1-gates-and-queue#AC-28). The default privileges of 0003 gave
-- xr_app every right on the new tables, so the ledger's are taken back here.
REVOKE UPDATE, DELETE, TRUNCATE ON review_decision FROM xr_app;
--> statement-breakpoint
GRANT SELECT, DELETE ON review_decision TO xr_retention;
--> statement-breakpoint
-- Every existing project's owner holds every approval, as a new project's does (AC-3).
INSERT INTO approval_assignment (project_id, slot, approver_id, delegate_id)
SELECT p.id, s.slot, p.owner_id, NULL
FROM project p
CROSS JOIN (VALUES
  ('area:creative'),
  ('area:performance-and-behaviour'),
  ('area:builds-and-operations'),
  ('area:business'),
  ('protected:contracts-and-licence-terms'),
  ('protected:funding-applications-and-reports'),
  ('protected:publishing-and-marketing'),
  ('protected:audience-facing-safety-and-consent')
) AS s(slot)
ON CONFLICT DO NOTHING;
