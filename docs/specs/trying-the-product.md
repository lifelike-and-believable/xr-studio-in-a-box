---
id: spec-trying-the-product
status: approved
derived-from:
  - docs-trying-xr-studio#open-a-trial-copy: b47ec19dfb98
  - docs-trying-xr-studio#start-a-tutorial: ef458aeef4e0
  - docs-trying-xr-studio#sign-in-as-a-person: aefb21367720
  - docs-trying-xr-studio#read-the-email-a-trial-copy-would-have-sent: 3d4d5889d15a
  - docs-trying-xr-studio#what-a-trial-copy-does-not-show: 9af370270706
  - docs-trying-xr-studio#who-can-do-this: c9f6c03c84a7
  - docs-trying-xr-studio#if-something-goes-wrong: 389e4b88bf7d
  - story-project-record-try-from-a-link#acceptance-criteria: 74fb3e25a279
  - design-trying-the-product#layout: a23f0b1cfcec
  - design-trying-the-product#states-and-errors: 551eaaabfec8
  - design-trying-the-product#the-one-command: ef2e36322e7c
  - design-trying-the-product#signing-in-as-a-tutorials-person: f875c7441a59
  - design-trying-the-product#start-and-the-append-only-records: acf5bd72b506
  - design-trying-the-product#accessibility: ff4c912c78bc
  - design-trying-the-product#starting-points: 20452d8ac7bd
  - design-trying-the-product#notes-for-delivery: 2a6ec3bc62d9
  - design-architecture#trying-the-product: 713b5821898d
---

# Trying the product: trial copies and signing in as a tutorial's person

## Problem

The lead validates a delivery by following its tutorial, and today that means building XR Studio by hand, setting six variables and reading sign-in links out of JSON files in a folder (`docs/tutorials/organisations-projects-people.md`, "Before you start"). The approved user documentation `docs/user/help/trying-xr-studio.md` promises a trial copy instead: XR Studio with made-up people, started with one command, where a person signs in as any of the tutorials' people with one selection and reads the email the copy would have sent. This spec is step 1 of the design's "Notes for delivery": the try command and sign-in, with the three guards, the email stand-in, the first starting point, **Try XR Studio** and `pnpm run try`.

## User stories

- story-project-record-try-from-a-link.

## Acceptance criteria

"Source" names the section each criterion comes from. A test cites a criterion as `trying-the-product#AC-1` in its title or a comment. Wording in quotes is the exact text the user documentation and design give, and tests check it. "Try mode" is what `tryMode()` answers (AC-1). "A try build" is a production build made with `XR_TRY=1`; "an ordinary build" is one made without it. "The five people" are Jordan Lee (producer), Morgan Ray (director), Riley Chen (artist), Sam Okafor (technical artist) and Drew Patel (sound designer), with the addresses `jordan@xr.test`, `morgan@xr.test`, `riley@xr.test`, `sam@xr.test` and `drew@xr.test`, listed once in `web/src/try/people.ts`.

### Try mode and its three guards

- **AC-1.** `tryMode(env)` answers yes only when `XR_TRY` is `1` and the production setting is off. The production setting is on when `XR_PRODUCTION` has any value other than empty or `0`, or when `VERCEL_ENV` is `production`; it is checked first, so it wins whatever else is set. Every try page, route, action and the email stand-in asks `tryMode()` before doing anything else. Source: design "Signing in as a tutorial's person", conditions 1 and 2.
- **AC-2.** The pages, routes and actions under `/try` are in files ending `.try.tsx` or `.try.ts`, which `next.config.ts` adds to `pageExtensions` only when `XR_TRY=1` at build time. An ordinary build has no route beginning `/try`; a test reads the ordinary build's route list (`.next/app-path-routes-manifest.json`) and fails if one does. Source: design, condition 1, "The build".
- **AC-3.** Outside try mode, `/try`, `/try/sign-in?as=Jordan`, `/try/mail`, `/try/mail/<id>` and the **Start** action answer **This page is not available** with status 404: in an ordinary build, and in a try build started with the production setting on, by `XR_PRODUCTION=1` and by `VERCEL_ENV=production`. Source: design, condition 4; user documentation "If something goes wrong" (first item).
- **AC-4.** Loading a starting point marks the database as a trial copy, with the row `trial-copy` in `app_meta`. Signing in as a person, **Start** and the loader refuse a database without the mark. The loader refuses to mark a database that holds any person, organisation or project, and refuses whenever try mode is off. Source: design, condition 1, "The database".
- **AC-5.** When the production setting is on, an instance whose database has the trial-copy mark refuses to start (start-up throws) and its health check answers 503, so a database that was ever a trial copy cannot become production's. When `XR_TRY=1` and the production setting are both on, the app writes an error to its log at start-up naming both settings, and carries on with try mode off. Source: design, conditions 1 and 2.

### The trial line

- **AC-6.** In a try build in try mode, every page, signed in or not, including **Sign in** and **This page is not available**, starts with one line on a bordered band, before the skip link: "Trial copy. The people, projects and files here are made up. Do not enter real information." followed by the link **Try XR Studio** to `/try`. It is plain text, not a live region. An ordinary build has no such line. Source: design "Layout" (the trial line) and "Accessibility"; user documentation "Open a trial copy"; story, second criterion.

### Try XR Studio

- **AC-7.** `/try`, with no project navigation, has the heading "Try XR Studio" and four parts in this order: **Choose a tutorial**, **Sign in as a person**, **Files for the tutorials** (only when a tutorial on the page uses a file), and **Email**. It opens signed in or signed out. Source: design "Layout".
- **AC-8.** **Choose a tutorial** is a table with a caption and the column headers **Tutorial**, **For**, **Starts with** and a **Start** button for each row, whose accessible name is "Start: <tutorial>". It lists each `runner: web` tutorial in `docs/tutorials/` whose starting point the loader has, in the loader's order, and a test fails when the list and `docs/tutorials/` disagree on a title or starting point. Until Help is built (design, delivery step 6), each title links to the tutorial's file in the repository. At 320 pixels each row becomes a block with its labels, and nothing scrolls sideways. Source: design "Layout", "Accessibility", "Notes for delivery" step 6.
- **AC-9.** **Start** opens a native dialog with the heading "Start <tutorial>?", the text "Everything done in this trial copy so far is replaced by the tutorial's starting point: <starting point>. Anyone else using this copy loses what they did." and the buttons **Keep what is here** and **Start**, in that order. Focus moves to **Keep what is here**; Escape and **Keep what is here** close it with nothing changed, and focus returns to the **Start** that opened it. Source: design "Layout", "Accessibility"; user documentation "Start a tutorial".
- **AC-10.** **Start** in the dialog reads "Starting" and cannot be selected again until the page reloads. It empties the database and loads the tutorial's starting point (AC-15), which signs everyone out of the copy in every browser. The page then shows the notice "This copy now holds the starting point for <tutorial>: <starting point>. Sign in as <first person> to begin." with the link **Open the tutorial**; the notice takes focus and the page title starts with "Started". Source: design "States and errors" (After Start, Loading); user documentation "Start a tutorial".
- **AC-11.** **Sign in as a person** starts with "Nobody is signed in in this browser." or "Signed in as <name>.", then one row for each of the five people with their name and role. A person who can sign in at this point (AC-12) has a link styled as a button, **Sign in as Jordan** (and the other four by first name), to `/try/sign-in?as=<first name>`. A person who cannot has no link and the text "Not added yet. Jordan adds <first name> in the tutorial." Below the rows: "To act as two people at once, open a private window for the second person." Source: design "Layout"; user documentation "Sign in as a person"; story, third criterion.
- **AC-12.** `/try/sign-in?as=<first name>` accepts only the five first names, never an address or an id; any other name answers **This page is not available** with 404. It signs in only the account whose address is that person's in the list. It checks the person may sign in, as the sign-in form does (`canSignIn`), and then mints a one-time sign-in link inside the app, as an invitation does, and follows it, so the session is an ordinary one and the person lands where an ordinary sign-in lands. A person with an open invitation (not used, not replaced, not expired) has it accepted, as its emailed link would, and lands where that link lands (**What needs you**). Source: design "Signing in as a tutorial's person", conditions 3; "States and errors"; user documentation "Sign in as a person".
- **AC-13.** A person who cannot sign in and has no open invitation gets the page "<first name> is not on a project in this copy yet. Jordan adds <first name> in Start a production and bring in your team." with a link back to **Try XR Studio**. Source: design "States and errors"; user documentation "If something goes wrong".
- **AC-14.** `/try/sign-in` answers with `Cache-Control: no-store`, and refuses a request marked as a prefetch (`Next-Router-Prefetch`, `Purpose: prefetch` or `Sec-Purpose: prefetch`) with 404 before it signs anyone in or accepts any invitation. The **Sign in as** links are not prefetched. Source: design "Signing in as a tutorial's person".

### Starting points

- **AC-15.** The loader empties the database and loads a starting point. Emptying removes the rows of XR Studio's own tables, named in code, and nothing else, connecting as the database's owner through `DATABASE_URL_UNPOOLED`; it is the only code that does, and it runs only in try mode on a marked database (AC-4). A starting point is built by running the record's own commands as the five people, never by writing rows, and the mark is written again at the end. This spec builds the first starting point: "A new installation where Jordan can sign in", in which nothing exists and only Jordan can sign in. Source: design "Start and the append-only records", "Starting points", "States and errors" (A new trial copy).

### Email

- **AC-16.** In try mode no email leaves the copy: each message XR Studio would send is kept in the database (`try_mail`), with its address, subject, text and the time it was sent, and the folder transport is not called. Outside try mode email goes to the folder transport as today. Source: design "Help" (What enforces each promise, third item); design-architecture "Trying the product", Email row; story, fifth criterion.
- **AC-17.** **Email** on **Try XR Studio** has the link **Email sent by this copy** and the sentence "No email leaves a trial copy." **Email sent by this copy** (`/try/mail`) is a table with **To**, **Subject**, **Sent** and a link **Open** for each message, newest first; with none, it says "No email has been sent by this copy yet." Source: design "Layout", "States and errors"; user documentation "Read the email a trial copy would have sent".
- **AC-18.** A message's page (`/try/mail/<id>`) shows **To**, **Subject** and **Sent**, then the text, with each address in it a link that can be followed, and **Back to email sent by this copy**. An id that is not a message answers **This page is not available**. Source: design "Layout"; user documentation "Read the email a trial copy would have sent".

### The local command

- **AC-19.** `pnpm run try`, at the repository root, runs `web/scripts/try.mjs`. In order, it starts PostgreSQL 18 in a Docker container on a free port on 127.0.0.1, with a password made for the run, or uses the empty database a person gives in `TRY_DATABASE_URL`; makes a temporary folder for uploaded files and fresh secrets; checks the database is empty (no table outside the system schemas) or marked as a trial copy, and stops otherwise; applies the migrations; builds the app with `XR_TRY=1`; loads the first starting point; starts the app on 127.0.0.1; and prints three lines: that the trial copy is running, the address of **Try XR Studio**, and that Ctrl+C stops and deletes it. It sets both connection variables from the one address and does not read `web/.env`. On exit it stops the app, removes the container and deletes the folder. Source: design "The one command"; user documentation "Open a trial copy"; story, seventh criterion.
- **AC-20.** When it cannot start, `pnpm run try` says which of these is wrong and how to put it right, and leaves nothing behind: Docker is not running and no `TRY_DATABASE_URL` was given; the port is in use; the database is not empty and not a trial copy; the build failed. Source: design "States and errors".
- **AC-21.** `docs/product/process.yml` gains the `try:` block of the design (`local: pnpm run try`, `preview: true`, `sign-in: /try/sign-in?as={name}`). `.env.example` and AGENTS.md list `XR_TRY`, `XR_PRODUCTION` and `TRY_DATABASE_URL`. Source: design "The one command", "Notes for delivery".

### Accessibility

- **AC-22.** **Try XR Studio**, the Start dialog open, the page after **Start**, **Email sent by this copy** (with and without messages), a message and the not-added page have no axe violations at WCAG 2.2 AA, and none scrolls sideways at 320 pixels. Each page has one `h1`. Source: design "Accessibility".

## Roles and permissions

No role changes. Pages under `/try` are open to anyone who can reach the trial copy, signed in or not (user documentation "Who can do this"). Signing in as a person gives exactly the roles that person holds in the copy's record, read on every request as always.

## Scope

In: delivery step 1 of design-trying-the-product, the trial line, and the first starting point.

Out, each a later delivery of the same design (recorded in `docs/decisions/claude-compassionate-mendel-fzq927.md`):

- Previews (delivery step 2): the Vercel preview, its Neon database, the build step that empties and loads it, taking origins from the deployment's address, and the preview's file stand-in in the database with its 4 MB limit. They need the lead to connect the Vercel project first. A local trial copy keeps files in its temporary folder, as the architecture's table says.
- The twelve task tutorials and their starting points (step 3), removing the old tutorials and their scripts (step 4), and `lasting-tutorials: fail` (step 5).
- Help, the **Help** link and **Try it** on the user documentation pages (step 6).

## APIs and assumptions

- New routes, try builds only: `GET /try`, `GET /try/sign-in?as=<first name>`, `GET /try/mail`, `GET /try/mail/<id>`, and the server action behind **Start**. No `/api/v1` route is added: none of these is an API for other programs.
- `pageExtensions` in Next.js 16.4.6 applies to the App Router (its bundled `pageExtensions.md` documents it for both routers); a file named `page.try.tsx` is a page only when `try.tsx` is in the list. The AC-2 test checks this against the real build. If it does not hold, the other two guards stand and this spec is amended.
- The trial line is rendered in the root layout from `tryMode()`. A page Next.js renders at build time decides it at build, so a try build and its run must have the same settings; `pnpm run try` sets them once for both. The `/try` pages and routes are dynamic and decide at each request.
- The tutorials' list on **Try XR Studio** is kept in `web/src/try/starting-points.ts` and checked against `docs/tutorials/` by a unit test, because a Vercel function cannot be relied on to have `docs/` beside it.

## Non-functional requirements

- No secret, password or connection string is printed by `pnpm run try` or written to a log.
- The emptying step runs only through the owner connection; the app's pool keeps `SET ROLE xr_app`, so the append-only rules hold in a trial copy for everything except **Start**.

## Delivery

Tests first (unit tests in `web/test/`, end-to-end tests in `web/e2e/` against an ordinary build and a try build), then the implementation, then the tutorial `docs/tutorials/try-xr-studio-in-a-trial-copy.md`, `runner: web`, run against `pnpm run try`'s product.

## Risks and decisions

See `docs/decisions/claude-compassionate-mendel-fzq927.md`.
