-- Feedback is a ledger, like slice 2's ledgers and the decision ledger: the application inserts
-- and reads; only the retention role deletes (layer1-versions-board-first-view#AC-24). The default
-- privileges of 0003 gave xr_app every right on the new tables, so the ledger's are taken back.
REVOKE UPDATE, DELETE, TRUNCATE ON work_feedback FROM xr_app;
--> statement-breakpoint
GRANT SELECT, DELETE ON work_feedback TO xr_retention;
