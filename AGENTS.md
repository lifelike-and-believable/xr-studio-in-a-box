# Agent rules

## Development process

This project uses rfr-process. See the [rules-for-robots README](https://github.com/lifelike-and-believable/rules-for-robots#readme).

- Agents push their branch and do not open, approve, or merge pull requests. A workflow (`.github/workflows/rfr-open-pr.yml`) opens the pull request for a pushed `claude/`, `phase-`, or `feature/` branch as the `rfr-agent` App and turns on auto-merge. A pull request that touches `docs/product/`, `docs/design/`, `docs/user/`, or `docs/tutorials/` waits for the approver's review in GitHub; any other merges itself when the checks pass.
- Artifacts are approved by a pull request that sets `status: approved` and records hashes.
- The project combines web apps, Unreal plugins and possibly Claude plugins as sub-projects, so no single rfr-process profile applies. Pick the template that fits each sub-project.

## Preferences

Read `docs/preferences.md` before design, interface, or documentation work, and add to it when the project lead corrects something.

## Sub-projects and profiles

Each folder follows the rules-for-robots profile named here (docs/design/decisions/system-shape.md):

- `web/`: web-app (the project record, its API, the dashboard and the collaborator pages; Next.js on Vercel with Postgres).
- `runner/`: general, plus the typescript and node-services packs (the agent runner, a long-running Node service on the Claude Agent SDK).
- `extensions/`: general, plus the typescript and node-services packs (tool adapters, steps and checks).
- `contracts/`: general, plus the typescript and node-services packs (versioned schemas shared by the other sub-projects).
- `unreal/`: unreal-plugin (editor and show runtime plugins, from Layer 2).

## Verification

The repository skeleton (workspace, health check, CI) is described in `docs/engineering/layer1-skeleton.md`, an engineering note rather than an rfr-process spec.


Run `pnpm verify` at the repository root before reporting a code change as done (WA-001). It runs lint, type check, unit tests, the production build and the end-to-end tests for every sub-project. The repository pins Node 26.13.1 (`.nvmrc`, `engines.node`) and pnpm 12.18.0 (`engines.pnpm`, and in `.github/workflows/verify.yml`). Installing with another Node major or another pnpm version fails with a message naming the pinned version. pnpm is not pinned in `packageManager`, because that field breaks the rfr-process workflow's setup-node cache.

The end-to-end tests and migrations need a disposable Postgres. Either export `DATABASE_URL` (pooled, used by the app) and `DATABASE_URL_UNPOOLED` (direct, used by migrations) in the shell, or put both in `web/.env`, which git ignores and which both Next.js and drizzle-kit read; `.env.example` lists the names. Apply migrations with `pnpm --filter @xr/web run db:migrate`.

Sign-in and email (slice 1, `docs/specs/layer1-organisations-projects-people.md`) read `BETTER_AUTH_SECRET`, `APP_ORIGINS`, `SIGN_IN_FIRST_ADDRESSES`, `MAIL_CAPTURE_DIR`, `PASSKEY_RP_ID` and `PASSKEY_ORIGINS`; `.env.example` says what each is. `pnpm run e2e` (in `web/`, and so `pnpm verify`) sets test values for all of them through `web/scripts/run-e2e.mjs`, with a fresh secret each run and emails written to a temporary folder, so only the database URLs need exporting. Every write goes through the command layer in `web/src/record/commands.ts`; pages and route handlers never write to the database themselves.

Facts, work samples and the activity log (slice 2, `docs/specs/layer1-facts-identifiers-activity.md`) also read `STORAGE_DIR` (the folder that holds uploaded files locally), `STORAGE_SIGNING_SECRET` (signs upload addresses) and `CRON_SECRET` (the held-upload job's bearer token); `web/scripts/run-e2e.mjs` sets all three, and the unit tests get their own through `web/vitest.config.ts`. The migrations create the database roles `xr_app` and `xr_retention`; the app's pool runs `SET ROLE xr_app` on each connection, so it cannot update or delete fact versions, confirmations or activity entries. Apply the migrations before starting the app.
