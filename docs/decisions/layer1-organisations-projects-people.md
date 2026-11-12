# Decisions and findings: layer1-organisations-projects-people

Recorded during the delivery run that finished slice 1 with its tutorial. The spec, tests and implementation were already on `main`; this run added `docs/tutorials/organisations-projects-people.md`.

## The tutorial is `runner: manual`

**Question.** The web-app profile's tutorials are `runner: web`, which the rfr-process workflow runs in a browser. Can this one be?

**Choice.** `runner: manual`. Every path into the dashboard starts with a link from an email, and slice 1's only mail transport writes each email to `MAIL_CAPTURE_DIR`. The web runner has no step that reads that folder, so every step after the first sign-in would run signed out and fail. The guide allows `manual` when neither runner can do the steps.

**What was done instead.** The author walked every step against a production build on this branch with a Playwright script that read the links from the mail capture folder (the walk record is in the tutorial). The lead can switch the tutorial to `runner: web` once there is a way for the runner to sign in, for example a test-only sign-in route or a runner step that opens the newest captured email. Either is a change to the product or to rules-for-robots, so it is not made here.

## Finding: the account menu stays open after a page change

Selecting **Your account** in the account menu opens the page, but the menu is still open on it. Selecting your name again then closes the menu instead of opening it. The design (design-dashboard-shell) says the menus close on Escape and return focus to their button; it does not say whether they close when a menu item navigates. Nothing in the approved user documentation is contradicted, so no code was changed in this run. The tutorial's step 19 says "In the account menu, select **Sign out**", which works whether or not the menu is already open. Suggested follow-up: close the menu when the page changes, as a `Change: fix` with a test.
