---
id: spec-help-tutorials-and-previews
status: approved
tests-commit: [377ea23, 2315041]
unlocks:
  - web/e2e/help.spec.ts: AC-5. A missing help address has **Back to XR Studio** twice, in the help header and in place of the link to projects, as the design gives it; the test now looks for the one in the page. No assertion changes.
  - web/e2e/try.spec.ts (title links): AC-7. **Try XR Studio**'s tutorial titles now link to the tutorial in Help, not its file in the repository (trying-the-product AC-8 said so "until Help is built"); the test expects the Help address.
  - web/e2e/try.spec.ts (signed in as): AC-11. The starting points name the five people, and signing in as a first address now names the account from the list too, as the design's layout gives it ("Signed in as Jordan Lee."), so the test expects Jordan Lee rather than the address.
  - web/e2e/try.spec.ts (sections): AC-12. **Files for the tutorials** now shows, because tutorials on the page choose files (trying-the-product AC-7 shows it only then), so the expected headings gain it between **Sign in as a person** and **Email**.
  - web/test/try-mode.test.ts: AC-11. **Try XR Studio** lists every tutorial, including the five that are `runner: manual` because they choose a file, so the test compares the list with every tutorial in `docs/tutorials/`, not only the web ones.
derived-from:
  - docs-help-and-tutorials#open-help-for-the-page-you-are-on: aa1c89712b43
  - docs-help-and-tutorials#follow-a-tutorial: a2a95ca03e86
  - docs-help-and-tutorials#send-someone-a-tutorial: 1e914dc06545
  - docs-help-and-tutorials#who-can-do-this: e2763bbbfd2d
  - docs-help-and-tutorials#if-something-goes-wrong: 168cc60055b1
  - docs-trying-xr-studio#use-the-tutorials-files: ad02a5677fa5
  - docs-trying-xr-studio#what-a-trial-copy-does-not-show: 9af370270706
  - docs-start: 4397018bd04d
  - docs-area-signing-in: 283cd6eb2e8a
  - docs-area-what-needs-you: 2bc6f836348c
  - docs-area-projects: 644b01505a62
  - docs-area-review: 95d5bc75a223
  - docs-area-board: cf327e2daa98
  - docs-area-facts: f8ba19b8c130
  - docs-area-people: 75c0030d7b63
  - docs-area-activity: 20d3580cbf00
  - docs-area-organisations: 5b5e8b9f0af6
  - docs-area-help: c0b02120a5b0
  - story-project-record-follow-a-tutorial#acceptance-criteria: 61ac0ed21873
  - story-project-record-try-from-a-link#acceptance-criteria: 74fb3e25a279
  - design-trying-the-product#layout: a23f0b1cfcec
  - design-trying-the-product#states-and-errors: 551eaaabfec8
  - design-trying-the-product#previews-and-where-their-data-lives: 8117c9ecc77d
  - design-trying-the-product#starting-points: 20452d8ac7bd
  - design-trying-the-product#help: 0dde10ddc77f
  - design-trying-the-product#the-tutorials-after-the-delivery: 3ab5272f6c7c
  - design-trying-the-product#accessibility: ff4c912c78bc
  - design-trying-the-product#notes-for-delivery: 2a6ec3bc62d9
---

# Help, the task tutorials and previews

## Problem

`docs/specs/trying-the-product.md` built step 1 of design-trying-the-product: trial copies, **Try XR Studio** and signing in as a tutorial's person. The approver asked, on its pull request, for steps 2 to 6 on the same branch. This spec covers them: the preview's own pieces (step 2), the twelve task tutorials with their starting points and the **Try it** links (step 3), removing what they replace (step 4), turning the lasting-tutorial rules on (step 5), and Help with the **Help** link (step 6). The approved user documentation is `docs/user/help/help-and-tutorials.md`, `docs/user/README.md`, the eleven area overviews, and "Use the tutorials' files" and "What a trial copy does not show" in `docs/user/help/trying-xr-studio.md`.

## User stories

- story-project-record-follow-a-tutorial.
- story-project-record-try-from-a-link.

## Acceptance criteria

A test cites a criterion as `help-tutorials-and-previews#AC-1`. "Help content" is what the build makes from `docs/user/` and `docs/tutorials/`: approved pages only, and the tutorials.

### Help

- **AC-1.** Every signed-in page has the link **Help** in the header, after the main navigation and before the person's name. It goes to the help for the address the person is on: the page whose `covers:` matches the address (`{id}` and other placeholders match one path segment); else the overview of the area whose pages cover the nearest address above it; else the start page. It never leads to an error, for every address in decision-navigation-and-urls's table. Source: docs-help-and-tutorials "Open help for the page you are on"; story-project-record-follow-a-tutorial, first criterion; design "Layout", "Help".
- **AC-2.** `/help` is the start page (`docs/user/README.md`) with, after its text, a section **Tutorials** listing every tutorial with who it is for. `/help/<area>` is an area's overview, `/help/<area>/<page>` a page, and `/help/tutorials/<tutorial>` a tutorial, each named by its file name without `.md`. Source: docs-start; docs-area-*; story, second criterion; design mock-up "Help, the first page".
- **AC-3.** Each help page has the product name, the link **Back to XR Studio** (to `/`), a trail in a navigation landmark named "Help" ("Help", the area, the page; the current one marked), one `h1`, and the page's text in a column at most 720 pixels wide. An area's page ends with **In this part of Help**, listing the area's pages, the current one marked "(this page)". Nothing scrolls sideways at 320 pixels. Source: design "Layout", "Accessibility"; mock-up "Help for a page".
- **AC-4.** Links between pages go to their help addresses; a link to a tutorial goes to `/help/tutorials/<tutorial>`; the mock-up images in pages are shown, with the text alternatives the pages give them. Raw HTML in a page is shown as text, never run. Source: design "Help".
- **AC-5.** Help pages open signed in or signed out, hold no project data, and are the same for every role. A help address that does not exist shows **This page is not available** with status 404 and the link **Back to XR Studio** in place of the link to projects. Source: docs-help-and-tutorials "Send someone a tutorial", "Who can do this", "If something goes wrong"; story, last criterion; design "States and errors".
- **AC-6.** In a trial copy, a tutorial in Help has, above its steps, the notice "You are in a trial copy. To put it at this tutorial's starting point, select Start beside it on Try XR Studio." with **Try XR Studio** a link. The deployed product shows no notice. Source: design "Layout", mock-up "A tutorial in Help".
- **AC-7.** **Try XR Studio**'s tutorial titles and the notice's **Open the tutorial** link to the tutorial in Help. Source: design "Notes for delivery", step 6.
- **AC-8.** The four user documentation pages that end with a stray `</content>` or `</invoke>` line no longer do. Source: design "Notes for delivery".

### The task tutorials (step 3)

- **AC-9.** `docs/tutorials/` holds the twelve tutorials of the design's table, each named and titled as the table gives it, `status: draft`, deriving from the user documentation page that links it, with `starts-from` as the table gives it, "For" as the table gives it, and "Before you start" giving each person the role they have. Tutorials 3, 5, 7, 9 and 10 choose a file, which the tutorial runner cannot do, so they are `runner: manual` (design "Notes for delivery"); the other seven are `runner: web`, and each passes `checks/tutorial-run.mjs` against a trial copy, except where its starting tutorial is a manual one. Source: design "The tutorials after the delivery".
- **AC-10.** Each user documentation page the design names gets **Try it**: a line under the task, linking its tutorial: sign-in to 2; your-projects, organisations-and-projects and people-and-roles to 1; project-facts to 3; organisation-facts to 4; identifier-formats to 5; approvers to 6; review to 7 and 8; board to 9; versions-and-feedback to 10; what-needs-you to 11; activity to 12. Source: design "Notes for delivery", step 3.
- **AC-11.** **Try XR Studio** lists the twelve, in the table's order, and **Start** loads each one's starting point: tutorial 1's (a new installation where Jordan can sign in), or the state the tutorial it starts from leaves, built with the record's own commands as the five people. The tutorial added with step 1 stays listed first. Source: design "Starting points", "The tutorials after the delivery".
- **AC-12.** **Files for the tutorials** on **Try XR Studio** lists the made-up files the tutorials choose, each a link that downloads it, and each step that chooses a file names one of them. Source: docs-trying-xr-studio "Use the tutorials' files"; design "Layout".

### Removing what they replace, and the rules (steps 4 and 5)

- **AC-13.** The four old tutorials (`organisations-projects-people`, `layer1-facts-identifiers-activity`, `layer1-gates-and-queue`, `layer1-versions-board-first-view`) and `web/e2e/tutorial-board.spec.ts`, `tutorial-facts.spec.ts` and `tutorial-review.spec.ts` are removed, and every link to the old tutorials points at the new ones. Source: design "Notes for delivery", step 4.
- **AC-14.** `.github/workflows/rfr-process.yml` passes `lasting-tutorials: fail`, and `checks/tutorial-run.mjs --coverage` reports no error. Source: design "Notes for delivery", step 5.

### Previews (step 2)

- **AC-15.** `.github/workflows/rfr-tutorials-preview.yml` is the rfr-process template, passing only the `RFR_PREVIEW_BYPASS` secret, with the reusable workflow and `rules-ref` pinned to one commit. Source: design "Notes for delivery", step 2.
- **AC-16.** The build command (`web/scripts/build.mjs`, which Vercel runs for every environment) runs `next build` alone unless try mode is on. In try mode it first checks the database is empty or marked as a trial copy and stops the build otherwise, empties XR Studio's own tables, applies the migrations and loads the first starting point. With the production setting on it never touches the database. Source: design "Previews, and where their data lives" (Fresh at each deployment).
- **AC-17.** In try mode on Vercel (`VERCEL=1`), the app takes its allowed origins and its passkey address from the address Vercel gives the deployment (`VERCEL_URL`, `VERCEL_BRANCH_URL`); otherwise from `APP_ORIGINS` and the passkey settings, as today. Source: design "Its addresses".
- **AC-18.** In try mode on Vercel, uploaded files are kept in the database (`try_file`), and a file over 4 MB is refused with "In a trial copy on the web, a file can be 4 MB at most. This limit is not in XR Studio itself." A local trial copy keeps files in its folder with no such limit. Source: design "States and errors", design-architecture "Trying the product"; docs-trying-xr-studio "What a trial copy does not show".

## Roles and permissions

Help is open to everyone, signed in or not. Nothing else changes.

## Scope

Out: connecting the Vercel project, the Neon integration, the preview's settings and the bypass secret, which the design leaves to the lead (NODE-002). Until they are connected the preview workflow has nothing to run against.

## APIs and assumptions

- Help content is made at build time by `web/scripts/help-content.mjs` into `web/.help/` (pages) and `web/public/help/` (images), both ignored by git. It reads the areas from the start page's links and each area's pages from its overview's "Pages" list, as rules-for-robots' `checks/docs-map.mjs` does, so the build does not depend on a rules-for-robots checkout.
- Markdown is rendered with `marked` (MIT), with raw HTML escaped.
- `VERCEL_URL` and `VERCEL_BRANCH_URL` are the deployment's own host names, set by Vercel in every deployment `[assumed]`, as design-trying-the-product says.

## Delivery

Tests first, then the implementation, then the tutorials, which this spec's step 3 is.
