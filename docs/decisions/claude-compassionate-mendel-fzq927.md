# Decisions made while delivering "Trying the product", step 1

This run was started by the delivery routine with no feature name. `delivery.mjs open` listed one feature: the stories add-person, follow-a-tutorial, set-up-organisation, start-project, try-from-a-link and what-needs-me, whose open user documentation is the "Trying the product" packet (`docs/user/help/` and the new area overviews). Nothing was asked in chat; each choice below is for the lead to judge in the review.

## Choices that most need the lead's eye

1. **This delivery was step 1 of the design's six.** The approver then asked for steps 2 to 6 on this branch; see "Steps 2 to 6" below. design-trying-the-product, "Notes for delivery", says to build in order and that each step ends with something that runs. Step 1 (the try command and sign-in) is self-contained and is what this branch builds, as `docs/specs/trying-the-product.md`. The spec derives from `docs-trying-xr-studio` only, so after this merges the process still lists Help (`docs-help-and-tutorials`, `docs-start` and the area overviews) as open, and the routine starts it as the next delivery. The other steps:
   - Step 2, previews: the lead connects the Vercel project and the Neon integration first (the design's checks only a person can do, and NODE-002). Not started here.
   - Steps 3 to 5, the twelve task tutorials, removing the four old ones and their scripts, and `lasting-tutorials: fail`: each tutorial needs its starting point in the loader. Not started here; the loader is built so that each one adds a function.
   - Step 6, Help: the next delivery, as above.
2. **A thirteenth tutorial.** A delivery needs a tutorial that derives from its user documentation, and none of the design's twelve derives from "Trying XR Studio". This run writes a new one for that page's task, `docs/tutorials/try-xr-studio-in-a-trial-copy.md` (for Morgan, the director). It is the only tutorial **Try XR Studio** lists until step 3 adds the others. If the lead would rather not keep it, step 3 can remove it once tutorial 1 covers the same ground.
3. **Files for the tutorials** is left off **Try XR Studio** while no tutorial on it uses a file. The design's section lists the files the tutorials use; with no such tutorial yet, an empty heading would say nothing. The page shows it once step 3 adds a tutorial with a file.
4. **The preview's file stand-in (files kept in the database, 4 MB at most) is left to step 2.** It exists for previews only. A local trial copy keeps files in its temporary folder, which is what the architecture's table gives for a local copy.
5. **Who signs in first.** At the first starting point Jordan can sign in because `pnpm run try` sets `SIGN_IN_FIRST_ADDRESSES=jordan@xr.test`, the same setting a real new installation uses. The loader writes no person for it: "nothing exists".

## Other choices

- **Emptying is by `TRUNCATE` of XR Studio's tables, named in code**, not by dropping them and migrating again. It keeps the migrations' roles and grants as they are and is one statement. The list is checked by a unit test against the schema, so a new table cannot be missed.
- **The trial line is decided at build time for pages Next.js renders ahead.** `pnpm run try` builds and runs with the same settings, so it makes no difference there. A try build later started with the production setting still shows the line on those pages, which only warns more; every `/try` page and route answers 404 in that case.
- **Sign-in as a person names nobody.** The first sign-in of a first address makes the account with no name, as the ordinary sign-in does, so "Signed in as" shows the address until the person is named in the product.

## Found while building

- **Next.js removes `Next-Router-Prefetch` before any of the app's code sees it**, in the proxy and in the page alike (checked against the built app: the proxy received no such header). It answers a real router prefetch (`RSC: 1` with `Next-Router-Prefetch: 1`) itself, without running the page: no sign-in link was minted. So AC-14 now says that, the app refuses only the browser's own prefetch headers (`Purpose`, `Sec-Purpose`), and the test sends a real router prefetch and checks nothing happened. The spec's `unlocks:` records the change. No proxy file was kept.
- **Column headers.** The spec named no header for the column of **Start** buttons or of **Open** links. Visible headers "Start" and "Open" were found by the tutorial runner before the controls themselves, so they are now "Start a tutorial" and "Open a message", visually hidden as in the mock-ups. Each **Start** button's name is "Start: <tutorial>", from visually hidden text in the button rather than a label, so the name contains what it shows.
- **A new setting, `TRY_PORT`,** chooses the port `pnpm run try` listens on (3000 if unset). The design asks the command to say when the port is in use; this is how a person picks another, and how the test makes the port busy.
- **`/try/mail` is decided at each request.** A try build first tried to render it at build time, reading the database.

## Not done, or done differently

- **`.env.example` is not updated.** This session's permission settings refuse every read and write of `.env*` files, so AC-21 is met in AGENTS.md only. These lines belong at the end of `.env.example`:

  ```
  # Trial copies (docs/specs/trying-the-product.md). XR_TRY=1 makes a trial copy, with made-up people
  # only; set it only for pnpm run try and previews, never in production.
  XR_TRY=
  # Set to 1 in production. It turns try mode off whatever else is set (VERCEL_ENV=production does too).
  XR_PRODUCTION=
  # pnpm run try only: an empty PostgreSQL database to use instead of a Docker container, and the
  # port the trial copy listens on (3000 if unset).
  TRY_DATABASE_URL=
  TRY_PORT=
  ```
- **`pnpm run try` with Docker was not run.** This environment has no Docker daemon. The command was run with `TRY_DATABASE_URL` (below), and the end-to-end tests check that it says so when Docker is not running. The container path (PostgreSQL 18, a fresh password, removed on exit) is untested here; the lead's first `pnpm run try` on a machine with Docker is its first run.
- **AC-19's happy path has no automated test.** A test would build a second try build into the folder the end-to-end try server is using. It is checked by the tutorial run below; AC-20's three refusals are tested.
- **Local runs used PostgreSQL 16**, the version installed here; CI uses 18.
- The design's security review against the four conditions was done by an independent reviewer agent (rfr-core's `security-reviewer`); see "Security review" below.

## Security review

It found the four conditions met in the app, no blocker, and these. Fixed, each with a new test in `web/test/try-hardening.test.ts` or `web/e2e/try-hardening.spec.ts`:

- **Start checked the mark on one connection and emptied through another.** If `DATABASE_URL_UNPOOLED` named a different, unmarked database, Start would have emptied it. The mark is now checked again, and locked, inside the transaction that empties.
- **`pnpm run try` blanked the production setting instead of refusing it.** It now stops when `XR_PRODUCTION` or `VERCEL_ENV=production` is set in its shell.
- **Sign-in as a person was a link anything could fetch:** a link preview in a chat app could use up an invitation, and another site could sign a visitor's browser in. Only a selection now works: `Sec-Fetch-Site` of `same-origin` (a link on **Try XR Studio**) or `none` (a typed address). AC-14 says so.
- **`pnpm run e2e` dropped `<test database>_try` on whatever server it was given.** Its trial database now has a random name of its own, quoted, and is dropped when the run ends.
- **Marking checked three tables for "holds anything".** It now checks every one of XR Studio's tables.
- Smaller: the container's password is passed in the environment, not on Docker's command line; the try pages' titles ask `tryMode()` first and name only one of the five; the start-up and health checks read the mark from a small module, so the ordinary build does not bring the loader in.

**Two questions for the lead, left as built:**

1. **Email sent by this copy shows every message, including sign-in links for addresses that are not the five.** So in a trial copy anyone can sign in as an address listed in `SIGN_IN_FIRST_ADDRESSES`, or as a person added under a real address, by asking for a link and reading it there. The design says such people "can never receive the invitation", which is no longer a protection once the page shows it. The user documentation promises "each message XR Studio would have sent can be read", so the page was left showing all of them. The conservative alternatives are to keep only mail to `@xr.test`, or to never set a real address in a preview's `SIGN_IN_FIRST_ADDRESSES` (the design's step 2 checks). Say which.
2. **Every web address in a kept message is a live link**, including one typed into a project name. React escapes it and only `http` and `https` links are made; links could be limited to the copy's own address if the lead prefers.

The reviewer also noted that `pnpm run e2e` needs `DATABASE_URL` exported in the shell (it makes the trial database before Next.js reads `web/.env`), while AGENTS.md says `web/.env` is enough. AGENTS.md now says so.

## Tutorial run

`docs/tutorials/try-xr-studio-in-a-trial-copy.md` was run with rules-for-robots' `checks/tutorial-run.mjs` (at its current `main`) against a local trial copy started by `TRY_DATABASE_URL=<an empty database> TRY_PORT=3200 pnpm run try`, with `--base-url http://localhost:3200`: `ok tutorial-try-xr-studio-in-a-trial-copy (8 steps)`, with a screenshot of each step and a video of each person's session (Jordan, Riley) recorded. Stopping the command with Ctrl+C printed "The trial copy is stopped and deleted." and left no process or folder behind. `--coverage` reports problems only in the four older tutorials (machine names, run records), which step 4 of the design removes.

## Checks only the lead can do

From the design's "Notes for delivery", for this step:

- Run `pnpm run try` on a machine with Docker, follow `docs/tutorials/try-xr-studio-in-a-trial-copy.md`, and stop it with Ctrl+C.
- A manual pass of **Try XR Studio** with a screen reader.
- The rest of the design's list (the Vercel project, the Neon integration, the preview bypass secret, production's settings) belongs to step 2.

## Steps 2 to 6, asked for on the pull request

The approver's review on pull request #369 asked, "deliver slice 2-6". They are built on this branch, under a second spec, `docs/specs/help-tutorials-and-previews.md`, whose `derived-from` takes in Help, the start page and the area overviews, so that no part of the "Trying the product" packet is left open.

### Choices

1. **Help is made at build time by this repository's own script** (`web/scripts/help-content.mjs`), not by rules-for-robots' `checks/docs-map.mjs`, which the design names. The build runs where no rules-for-robots checkout exists (CI's `verify` job, Vercel). The script reads the areas and pages the same way: the start page's links, then each overview's "Pages" list, approved pages only.
2. **A new dependency, `marked` 18.2.0** (MIT, maintained, its latest release), renders the pages' Markdown. Raw HTML is escaped and HTML comments are left out.
3. **Five tutorials are `runner: manual`**: 3, 5, 7, 9 and 10, because each chooses a file and the tutorial runner has no sentence for that yet (checked at rules-for-robots `0efba3c`). Tutorials 8, 11 and 12 start from manual ones, so a full run of the runner skips them. That is a failure of the runner's run, not of the tutorials. Each was run here on its own after **Start** loaded its starting point (see "Tutorial runs").
4. **Where tutorials 9 and 11 meet.** The design gives tutorial 11 Morgan's decision from **What needs you**, and tutorial 9 the board changing when that decision is made. A tutorial cannot do both, because tutorials 10 and 11 start from where 9 ends. Tutorial 9's end leaves the character sheet waiting, Morgan decides it in tutorial 11, and tutorial 9 leaves out watching the board change without a reload. The end-to-end tests still cover that.
5. **Steps the tutorials leave out**, each covered by the end-to-end tests: the prop list stopped at sending (gates step 8; tutorial 5 shows the same check on a fact and a file), withdrawing a version (gates step 14, second half), and the second invitation email (slice 1). Tutorial 1 names the organisation Harbourfront Puppet Co. and leaves out renaming it.
6. **Signing in as a made-up person names the account** from the list ("Signed in as Jordan Lee."), as the design's layout gives it. This replaces the earlier choice above, under "Other choices", to name nobody.
7. **The preview's build step runs only on Vercel** (`VERCEL=1` with try mode on). A local `pnpm run build` with `XR_TRY=1` never touches a database: the end-to-end suite and `pnpm run try` make their own trial databases.
8. **The preview workflow is pinned to one rules-for-robots commit** (`0efba3c`) and passed only `RFR_PREVIEW_BYPASS`, as the design asks. This goes against the standing preference to follow rules-for-robots `@main` everywhere (docs/preferences.md, Tooling). The design gives the reason: the bypass token with the sign-in path opens every preview. The process workflow still follows `@main`.
9. **`vercel.json` names the build command** (`pnpm run build`), so that Vercel runs the build script and not `next build` alone.
10. **Recorded again, one reason for all:** the four slice specs, the first spec and the new tutorials cite user documentation pages that gained a **Try it** line, or lost a stray closing line. No wording, step, control name or message changed.

### Not done

- **Connecting the preview** is the lead's: the Vercel project, the Neon integration on Preview only, `XR_TRY=1` and the trial secrets for Preview, and the `RFR_PREVIEW_BYPASS` secret (NODE-002). Until then the preview workflow has no deployment to run against, and none of step 2's code has run on Vercel. `VERCEL_URL` and `VERCEL_BRANCH_URL` are assumed to be the deployment's host names, as the design marks them.
- **The tutorial runner cannot choose a file.** Raising it for rules-for-robots is the lead's, as the design says.

### Tutorial runs

Against a local trial copy started by `TRY_DATABASE_URL=<an empty database> TRY_PORT=3200 pnpm run try`, with rules-for-robots' `checks/tutorial-run.mjs` at `0efba3c`:

- Tutorial 1, then 2, 4 and 6 starting from it, in one run: `ok` (9, 6, 5 and 6 steps; tutorial 2's three passkey and email steps are manual).
- Tutorial 8 after **Start** loaded its starting point: `ok` (7 steps).
- Tutorial 11 after **Start**: `ok` (4 steps).
- Tutorial 12 after **Start**: `ok` (3 steps).
- `--coverage` with the lasting-tutorial rules failing: "13 tutorial(s): runners and steps are in order."

The five manual tutorials were not followed by hand here.
