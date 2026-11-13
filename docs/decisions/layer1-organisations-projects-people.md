# Decisions and findings: layer1-organisations-projects-people

## During slice 2's delivery

Slice 2's branch (`docs/specs/layer1-facts-identifiers-activity.md`) changed the slice 1 spec only to refresh two `derived-from` hashes (`docs-organisations-and-projects#create-an-organisation` and `#an-organisations-page`), because slice 2's spec asks, in its Delivery section, for the lines in `docs/user/organisations-and-projects.md` that said organisation facts come "in a later release" to be updated in the same pull request. Slice 1 had been delivered without a tutorial, so that branch set slice 1's tutorial aside as slice 1's own work; slice 2's tutorial (`docs/tutorials/layer1-facts-identifiers-activity.md`) walks through the updated organisation page. Slice 1's tutorial is now delivered by the run below, so it is no longer set aside.

## During the run that added slice 1's tutorial

This run added `docs/tutorials/organisations-projects-people.md`. The spec, tests and implementation were already on `main`.

### The tutorial is `runner: manual`

**Question.** The web-app profile's tutorials are `runner: web`, which the rfr-process workflow runs in a browser. Can this one be?

**Choice.** `runner: manual`. Every path into the dashboard starts with a link from an email, and slice 1's only mail transport writes each email to `MAIL_CAPTURE_DIR`. The web runner has no step that reads that folder, so every step after the first sign-in would run signed out and fail. The guide allows `manual` when neither runner can do the steps.

**What was done instead.** The author walked every step against a production build of the branch with a Playwright script that read the links from the mail capture folder (the walk record is in the tutorial). The lead can switch the tutorial to `runner: web` once there is a way for the runner to sign in, for example a test-only sign-in route or a runner step that opens the newest captured email. Either is a change to the product or to rules-for-robots, so it is not made here.

### Finding: the account menu stayed open after a page change

Selecting **Your account** in the account menu opened the page with the menu still open, so selecting your name again closed it. This was found on the walk and has since been fixed on `main` ("Close the account menu when the page changes", b89cf99). The tutorial's step 19 says "In the account menu, select **Sign out**", which reads correctly either way.
