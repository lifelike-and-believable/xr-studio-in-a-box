# Agent rules

## Development process

This project uses rfr-process. See the [rules-for-robots README](https://github.com/lifelike-and-believable/rules-for-robots#readme).

- Agents do not merge pull requests that touch `docs/product/`, `docs/design/`, `docs/user/`, or `docs/tutorials/` unless the approver explicitly says to. When the approver does, the agent comments on the pull request quoting the instruction.
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

Run `pnpm verify` at the repository root before reporting a code change as done (WA-001). It runs lint, type check, unit tests, the production build and the end-to-end tests for every sub-project. The repository pins Node 26.13.1 (`.nvmrc`, `engines.node`) and pnpm 12.18.0 (`engines.pnpm`, and in `.github/workflows/verify.yml`). Installing with another Node major or another pnpm version fails with a message naming the pinned version. pnpm is not pinned in `packageManager`, because that field breaks the rfr-process workflow's setup-node cache.

The end-to-end tests and migrations need a disposable Postgres. Either export `DATABASE_URL` (pooled, used by the app) and `DATABASE_URL_UNPOOLED` (direct, used by migrations) in the shell, or put both in `web/.env`, which git ignores and which both Next.js and drizzle-kit read; `.env.example` lists the names. Apply migrations with `pnpm --filter @xr/web run db:migrate`.
