# Decisions made while delivering "Trying the product", step 1

This run was started by the delivery routine with no feature name. `delivery.mjs open` listed one feature: the stories add-person, follow-a-tutorial, set-up-organisation, start-project, try-from-a-link and what-needs-me, whose open user documentation is the "Trying the product" packet (`docs/user/help/` and the new area overviews). Nothing was asked in chat; each choice below is for the lead to judge in the review.

## Choices that most need the lead's eye

1. **This delivery is step 1 of the design's six, not all of them.** design-trying-the-product, "Notes for delivery", says to build in order and that each step ends with something that runs. Step 1 (the try command and sign-in) is self-contained and is what this branch builds, as `docs/specs/trying-the-product.md`. The spec derives from `docs-trying-xr-studio` only, so after this merges the process still lists Help (`docs-help-and-tutorials`, `docs-start` and the area overviews) as open, and the routine starts it as the next delivery. The other steps:
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
- The design's security review against the four conditions was done by an independent reviewer agent before pushing; see below.

## Tutorial run

`docs/tutorials/try-xr-studio-in-a-trial-copy.md` was run with rules-for-robots' `checks/tutorial-run.mjs` (at its current `main`) against a local trial copy started by `TRY_DATABASE_URL=<an empty database> TRY_PORT=3200 pnpm run try`, with `--base-url http://localhost:3200`: `ok tutorial-try-xr-studio-in-a-trial-copy (8 steps)`, with a screenshot of each step and a video of each person's session (Jordan, Riley) recorded. Stopping the command with Ctrl+C printed "The trial copy is stopped and deleted." and left no process or folder behind. `--coverage` reports problems only in the four older tutorials (machine names, run records), which step 4 of the design removes.

## Checks only the lead can do

From the design's "Notes for delivery", for this step:

- Run `pnpm run try` on a machine with Docker, follow `docs/tutorials/try-xr-studio-in-a-trial-copy.md`, and stop it with Ctrl+C.
- A manual pass of **Try XR Studio** with a screen reader.
- The rest of the design's list (the Vercel project, the Neon integration, the preview bypass secret, production's settings) belongs to step 2.
