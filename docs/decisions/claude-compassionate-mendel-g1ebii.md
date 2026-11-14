# Decisions made while recording the "Trying the product" build order

The delivery routine started this run with no feature name. `delivery.mjs open` listed the "Trying the product" stories (follow-a-tutorial, try-from-a-link) with all six steps of design-trying-the-product's build order still to build. They had been built: step 1 on pull request #369's first spec (`docs/specs/trying-the-product.md`), and steps 2 to 6 on the same pull request when the approver asked for them, under `docs/specs/help-tutorials-and-previews.md`. That run's decisions file (`docs/decisions/claude-compassionate-mendel-fzq927.md`) describes the work, but did not use the `[step done: …]` markers, so the process state still listed every step as open. This run changes no code, spec, test or tutorial. It checked each step against `main` at b7dd1df and records it below.

## The build order

- [step done: design-trying-the-product 1] The try command and sign-in: `tryMode()` in `web/src/try/mode.ts`, `pnpm run try` (`web/scripts/try.mjs`), the starting-point loader (`web/src/try/starting-points.ts`) and the `try:` block in `docs/product/process.yml`.
- [step done: design-trying-the-product 2] Previews: `.github/workflows/rfr-tutorials-preview.yml`, copied from the rfr-process template, pinned to rules-for-robots `0efba3c` for both the workflow and `rules-ref`, and passed only `RFR_PREVIEW_BYPASS`. Connecting the Vercel project, the Neon integration and the bypass secret is the lead's, and the design lists it under "Checks only a person can do"; it is repeated below. No preview has run yet, so step 2's build step has not run on Vercel.
- [step done: design-trying-the-product 3] The tutorials: the twelve task tutorials are in `docs/tutorials/`, with **Try it** on each user documentation page. Five (3, 5, 7, 9 and 10) are `runner: manual`, as the design says they must be until the tutorial runner can choose a file. The installed rfr-process README still lists no sentence for a file field, so nothing in this repository can change that yet. When the runner gains one, switching those five to `runner: web` is a small change of its own.
- [step done: design-trying-the-product 4] Removed what they replace: `web/e2e/` has no `tutorial-*.spec.ts`, and the four old tutorials are gone.
- [step done: design-trying-the-product 5] `lasting-tutorials: fail` is set in `.github/workflows/rfr-process.yml`.
- [step done: design-trying-the-product 6] Help: `web/app/help/` (start page, areas, pages, and `/help/for`), `web/src/help/`, and the Help link (`web/src/ui/help-link.tsx`, used in `web/app/(app)/layout.tsx`). No user documentation page still ends with a stray `</content>` or `</invoke>` line.

## Choices

1. **Step 2 is recorded as done, not later.** Its only remaining part is connecting the hosting account, which the design gives to the lead as a validation check. Recording it as later would keep the delivery open with nothing an agent can build, and the routine would start again on every merge.
2. **Step 3 is recorded as done with five manual tutorials.** The design asks for all twelve as `runner: web`, and also says the five that choose a file are "written, and run by hand" until the runner can choose one. That runner change is rules-for-robots work.

## Checks only the lead can do

From design-trying-the-product, "Notes for delivery", still owed:

- Connect the Vercel project, add the Neon integration on Preview only with a database branch per preview, and set `XR_TRY=1` and the trial secrets for Preview only (NODE-002: an agent does this only when the lead says so).
- Confirm the Neon branch is deleted when a pull request closes, and that no Production variable is shared with Preview.
- Save the preview bypass token as the `RFR_PREVIEW_BYPASS` repository secret.
- Before the first production deployment, confirm `XR_TRY` and `DATABASE_URL_UNPOOLED` are absent from Production, `XR_PRODUCTION=1` is set, and the database is Aurora's in ca-central-1 and was never a trial copy.
- Follow tutorials 3 to 12 on a preview, which validates slices 2 to 4, including the five manual ones.
- The first-task test with a person new to the pipeline (design-what-needs-you).
- A screen-reader pass of **Try XR Studio** and one help page.
- Approve the tutorials once followed; they stay drafts until then.

## Found, outside this run

- `web/src/db/client.ts` only logs when `set role xr_app` fails and carries on as the login user (raised in the design's review). It needs its own fix.

## Verification

`pnpm verify` was not run. This session has Node 22.23.4 and pnpm 10.28.0, and the repository pins Node 26.13.1 and pnpm 12.18.0, so the install stops before any check. The change is this one decisions file; the pull request's `verify` workflow runs the checks on the pinned versions.
