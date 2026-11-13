# Decisions made while writing the "Trying the product" packet

This packet moves XR Studio In A Box onto lasting tutorials, a place to try the product, and organised user documentation (rules-for-robots `docs/specs/lasting-tutorials.md`, AC-12, slice 27d). It holds stories, a design with mock-ups, an architecture amendment and user documentation. It holds no spec, test, code or rewritten tutorial: those are the delivery. Nothing was asked in chat; each choice below is for the lead to judge in the review.

## Choices that most need the lead's eye

1. **The tutorial runner cannot choose a file.** Its step sentences have none for a file field (rules-for-robots at 44a1445). Five of the twelve planned tutorials choose a file, and their later steps depend on it. They cannot pass as `runner: web` until the runner gains such a sentence. This is rules-for-robots work, outside this repository. The design says so in "Notes for delivery" and does not work round it in the product.
2. **Where a preview's data lives.** The lead decided a preview with only made-up data may be outside Canada. The design chooses a Neon database branch for each pull request through the Vercel marketplace, in a United States region, with files and email kept in that same database. Reason: one place holds a preview's data and is removed with the pull request, and the integration supplies the two connection variables the app already reads. The alternative is an Aurora database in ca-central-1 for each preview: it keeps to the Canadian rule the lead has lifted, costs more, and has no branch for each pull request. Vendor facts are marked `[assumed]` and checked when the spec is written.
3. **What "real data never goes in a preview" rests on.** No production secret or connection in the preview environment; no email leaves; only the five made-up people can be signed in to; a line on every page; deletion with the pull request. Nothing can stop a team member typing real information. The design says this plainly and the lead accepts it by approving.
4. **Three guards on signing in as a made-up person**, each enough alone: the routes are left out of an ordinary build; one function refuses at run time without the trying setting, and always when the production setting is on; and the database must be marked as a trial copy. The production setting is new: `XR_PRODUCTION=1`, or Vercel's own `VERCEL_ENV=production`. When both the trying and production settings are on, the app answers 404 on those paths and logs an error; it does not stop, because a stray setting should not take production down.
5. **Start on the Try XR Studio page.** One selection puts the trial copy at a tutorial's starting point, so the lead does not do the earlier tutorials first. It replaces what is there for everyone using that preview. Starting points are built by running the record's own commands, so each is a state a real team can reach. This is more than the guide asks for; it is here because validating slices 2 to 4 otherwise means doing tutorial 1 by hand before each.
6. **Help is proposed, and is the last delivery step.** The `/help` pages and the Help link are in the design because the second story needs them, and because the lasting-tutorials spec says the help ships with the product. Step 6 can follow the lead's validation of slices 2 to 4. If the lead wants it left out, remove step 6, the three help mock-ups and `docs/user/help/help-and-tutorials.md`.
7. **Twelve tutorials from four.** One for each task, as the spec asks. The table in the design says which steps each takes over. Fewer, longer tutorials would be quicker to validate once and slower to keep.

## Other choices

8. **Stories.** No approved story fitted, so two were added: `story-project-record-try-from-a-link` for Morgan, the director, and `story-project-record-follow-a-tutorial` for Drew, the sound designer. The lead is not a persona; persona-director's evidence says it is close to a self-description of the approver, so the lead's validation is written as Morgan's. Both are in epic-project-record, because no epic is about learning the product and the first pages a new person meets are in that one. The alternative is an epic of its own, which needs requirements that do not exist yet.
9. **Areas of the user documentation.** Nine areas from the navigation decision: the three main items (What needs you, Projects, Organisations), each project tab (Review, Board, Facts, Activity), and Signing in. Two merges: the Overview tab is in Projects, and Approvers is with People as "People and approvers", so there are fewer one-page areas. A tenth area, Help and trial copies, is new with this packet. `organisations-and-projects.md` is in Projects, because starting a project is its most common task; the Organisations overview links to it.
10. **`covers:`** uses `{id}` for the project or organisation id and a named placeholder for the other parts. Every address in the navigation decision's table is in exactly one page. The two addresses with a query string are the same pages as their paths and are not listed.
11. **The `try:` block is in the design, not in `process.yml`.** The process check refuses a `local` command whose package script does not exist, and this packet adds no code. The delivery adds the block with the script.
12. **The architecture's stand-in table lists services that are not built** (the S3 and SES transports, the ledger copy, the protected store, the runner, Tripo) as absent, with a rule that the slice building each one adds its row first.
13. **Overviews use no bold**, because the process check reads bold as a control's name.
14. **One test file changed.** `web/test/emails.test.ts` reads the sign-in page by path, so its path follows the move. Two comments that name moved pages were updated (`web/src/mail/templates.ts`, `contracts/test/roles.test.ts`). No assertion changed. The commit that holds them says `Change: trivial`.
15. **Left alone:** path mentions in code spans in the four specs, the earlier decisions files and `docs/design/what-needs-you.md` (line 132), which record history; and stray closing lines at the end of four user documentation pages, which were there before and are listed in the design for step 6.
16. **Not done:** the mock-ups were not checked with axe (it is not installed in this checkout), and `pnpm verify` was not run (see the pull request's report).

## Revision

Why: the user documentation pages moved into a folder for each area, so links and image paths inside them changed. The architecture gained an amendment and a "Trying the product" section.

- **design-architecture.** No approved artifact links to it by section or as a whole (checked by search and by the process check), so nothing was updated or re-recorded for it. "Approver's decisions (2026-11-12)" gained one sentence pointing at the amendment. decision-system-shape, decision-project-record-model and decision-protected-store say where real data lives and are unchanged.
- **epic-project-record.** Its lists gained the two stories. Its "Outcome" section, the one stories link to, is unchanged.
- **Re-recorded as unaffected, one reason for all:** only link and image paths changed in the cited sections; no wording, step, control name or message changed.
  - spec-layer1-organisations-projects-people
  - spec-layer1-facts-identifiers-activity
  - spec-layer1-gates-and-queue
  - spec-layer1-versions-board-first-view
  - tutorial-organisations-projects-people
  - tutorial-layer1-facts-identifiers-activity, tutorial-layer1-gates-and-queue, tutorial-layer1-versions-board-first-view (drafts; their links to the moved pages were updated)
