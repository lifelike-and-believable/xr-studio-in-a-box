---
id: design-work-and-versions
status: approved
derived-from:
  - story-review-and-status-feedback-and-versions#acceptance-criteria: 667f3e80aa75
  - story-review-and-status-status-board#acceptance-criteria: 8c5f38b0e467
  - story-review-and-status-see-review-queue#acceptance-criteria: 0cf0b45ffc70
  - persona-artist#goals: 0767918db571
  - persona-artist#frustrations: 5ff7cb87b138
  - persona-producer#goals: d1cc47b03be9
  - persona-director#goals: a92ca172be83
  - design-review-queue: 5ae80c4a15b8
  - design-approvers: 983b149cfa2a
  - design-identifier-filter: 069c84a56674
  - design-project-facts: 1a327e4e7efd
  - decision-navigation-and-urls#decision: 0eed88adf12e
---

# Work, versions and the board design

Slice 4 adds one idea to the record: a **piece of work**. It has a title, a stage, an owner and a list of versions. Every item sent for review (design-review-queue) is now a version of a piece of work, and the board shows every piece of work with its state. This design covers the board (story-review-and-status-status-board) and feedback, versions, compare and restore (story-review-and-status-feedback-and-versions). The first view built on both is in design-what-needs-you.

## Personas

- persona-artist: Riley reads the reviewer's feedback beside the draft, adds written feedback on any draft, compares two versions side by side, and restores an earlier one without losing the later ones (goals: give written feedback on a draft and see it revised, with earlier versions kept and comparable; frustrations: feedback arrives in scattered places and earlier versions are hard to find). Feedback and versions live on the work's own page, one place per piece of work.
- persona-producer: Jordan sees every stage and piece of work with its owner and state, filters to what is blocked, and puts work on the board for a person before they start (goals: know where every stage and asset stands, who owns it, and what is blocked; bring new people on quickly).
- persona-director: Morgan sees, on the item they are deciding, which version it is, what was said about the version before, and other people's feedback, so a decision does not repeat an old request (goals: review quickly).

## Choices this design makes

The stories and the architecture leave these open. Each is the designer's choice, for the lead to judge in review.

1. **"Work", not "asset".** The story says "stage and asset". Much of what passes a gate is not an asset: a cue list, a licence, a funding report. The dashboard calls each row a **piece of work**, and the user documentation explains that an asset is one kind of work.
2. **Every send makes or extends a piece of work.** Sending from **Send for review** (slice 3) makes a new piece of work, owned by the sender, with the item as version 1. **Send a revised version** and **Send for review** on a work's page add the next version to that work. So the board fills itself from the review queue, with no set-up, and slice 3's link between a revision and the earlier item now exists. Items sent before slice 4 each become a piece of work with one version, owned by their sender, because the record does not know which of them were revisions of which.
3. **Stages on the board are the gated hand-offs** (contracts/src/gates.ts), in the order of **Approvers**, grouped by area. Every stage is listed, including stages with no work, so Jordan sees the whole pipeline. **Build for rehearsal** is not gated and is not listed: nothing waits there.
4. **A stage's owner is the person who decides at it**: the area approver (with the delegate), or the holder of a protected approval (design-approvers). Nobody has to keep a second list of stage owners, and the board changes when **Approvers** changes. On the board the stage line is labelled **Decided by**, not **Owner**, so it is not confused with the owner of a piece of work, who makes it.
5. **A piece of work's owner is one person on the project who uses the dashboard.** The director and producer set and change it; sending makes the sender the owner of new work. One owner keeps "who owns it" a single answer.
6. **States are worked out, never set by hand**, so the board cannot drift from the queue. In order of precedence:
   - **Done**: the latest version was accepted.
   - **Blocked**: not done, and the work's stage waits on an item that is still waiting at a gate (an item whose sender answered **Is other work waiting on this decision?** with this stage). This is the definition of blocking in story-review-and-status-see-review-queue. An item never blocks its own piece of work.
   - **Waiting for review**: the latest version is waiting at the gate.
   - **In progress**: anything else: no version sent yet, or the latest returned for revision, rejected or withdrawn.
   Blocked comes before Waiting for review because Jordan's question is "what is held up"; the detail still says a version is waiting. A stage's state is the first of Blocked, In progress, Waiting for review and Done that any of its work has, so a stage is Done only when all its work is.
7. **Blocking still comes only from the sender's answer.** design-review-queue proposed that the board would also mark items that stages wait on. The board has no order of stages to infer that from, so that proposal is dropped: the sender's answer stays the one source, and the board shows what follows from it.
8. **Feedback is a thread on each version.** Anyone on the project who uses the dashboard can add written feedback to any version, decided or not, and the reviewer's decision feedback appears in the same thread, marked with the decision. Feedback cannot be edited or removed, like the rest of the review record (design-review-queue: decisions are final). It sits beside the version's preview on the work's page and on the review item's page.
9. **Restoring is a send.** Restoring version 1 sends version 1's file for review again as a new version, at the same stage. Every version is kept. A restored version is reviewed again even if it was accepted before, because only what a person accepts may pass a gate, and acceptance of version 1 said nothing about the work after version 2's feedback. Restore is offered only while no version of that work is waiting, so a piece of work never has two versions waiting at once.
10. **Compare shows two whole versions side by side**: the preview, who sent it and when, what changed, and the decision with its feedback. It does not mark differences inside files; that needs the content layer. At phone width the two versions stack, the first above the second.
11. **The board and the work's page update themselves** by asking the record for changes every 15 seconds while the page is visible, and at once when the tab becomes visible again. The architecture asks for "the board changing with no reload". Polling suits Vercel functions, which do not hold connections open, and a 15-second delay is within what Jordan needs.
12. **Regenerated versions** come from agents and pipeline steps from slice 7 and slice 11. They will arrive through the same new-version command and show "Sent by <agent> for <person>". In slice 4 every version is sent by a person.

## Flow

### See the board

1. On a project, the **Board** tab sits after **Review**. Everyone on the project who uses the dashboard can open it.
2. Above the board, a line counts the work: "12 pieces of work: 1 blocked, 6 waiting for review, 3 in progress, 2 done."
3. Each area is a heading. Under it, each stage shows **Decided by** (its owner) and its state, then a table of its pieces of work: **Work** (a link to the work's page), **Owner**, **State** (with a line of detail) and **Latest version**. A stage with no work says "No work yet."
4. State details say what the state rests on: "Waits on Lantern Keeper character sheet (Character design), which is waiting for Morgan Ray or Sam Okafor."; "Waiting for Sam Okafor (handed on by Morgan Ray)."; "Version 2: revision requested by Morgan Ray, 11 November, 16:40."; "Not sent for review yet."; "Version 1: accepted by Morgan Ray, 8 November, 11:00."
5. **All work** and **Blocked work only** switch the view. **Blocked work only** shows only the stages with blocked work, and the line reads "1 piece of work is blocked."
6. When something changes (a decision, a send, a withdrawal, a hand-on, a change of approver), the rows change in place within 15 seconds. A changed row shows a **Changed <time>** tag. A polite status line says what changed: "Updated 14:22: Lantern Keeper character sheet is now Done. Lantern Keeper mesh and rig is now In progress." Focus does not move. In **Blocked work only**, a row that stops being blocked stays until the next load, with its new state, so nothing disappears under the reader.

### Add work and change its owner

1. The director and producer see **Add work** on the board. It opens a form: **Title**, **Stage** (the stages that are sent by hand, grouped by area), **Owner** (people on the project who use the dashboard) and **Add work**, **Cancel**. Once a stage is chosen, a line says who decides it, as on **Send for review**.
2. **Add work** opens the new work's page with "Added Harbour ambience to Sound and music, owned by Drew Patel. It shows under What needs you for Drew."
3. On a work's page, the director and producer see **Owner** with **Change owner**. After it: "Riley Chen now owns Harbour children character sheet. It shows under What needs you for Riley."
4. A piece of work with no versions can be removed by the director or producer with **Remove <title>**, after a confirmation. Work with a version cannot be removed: its versions are part of the review record.

### A piece of work's page

1. Selecting a piece of work opens its page: **Stage**, **Owner**, **State**, **Decided by**, and **Added by** for work added on the board.
2. The latest version is shown with its preview, **Open the file**, who sent it, what changed and its decision. Beside it (below it at phone width) is **Feedback on version <n>**, oldest first, and **Add feedback on version <n>**.
3. Under it, **Versions** lists every version, newest first: who sent it and when, what changed, and its decision. Each version's number opens that version's review item page. Earlier versions have **Restore version <n>** when nothing is waiting.
4. Actions above the version depend on the state:
   - Latest version returned or rejected: **Send a revised version** and **Compare versions**.
   - Latest version waiting: **Withdraw version <n>** (for its sender, as in slice 3) and **Compare versions**, with "Version 2 is waiting for review. To restore an earlier version, withdraw version 2 first." above **Versions**.
   - No versions yet: "Next step: Make it, then send it for review. It does not move on until Morgan Ray or Sam Okafor accepts it." and **Send for review**.
   - Latest version accepted: **Send a revised version** and **Compare versions**. A new version after an acceptance goes through the gate again.
5. **Send a revised version** and **Send for review** on a work's page open **Send for review** with the work and stage fixed: it shows "This will be version 3", who decides, and the last decision's feedback, then asks for **What changed**, **File** and **Is other work waiting on this decision?** (filled in from the last version). The notice after sending reads "Sent for review: Lighthouse concept, version 3. It waits for Morgan Ray or Sam Okafor."
6. **Send a revised version** and **Send it again** in **Sent by you** (slice 3) now open this same form, so the new item is linked as the next version.

### Give feedback

1. Under **Add feedback on version <n>**, type and select **Add feedback**. The entry is added with the person's name and the time, and the page shows "Feedback added." with focus on it.
2. The reviewer's feedback given with a decision appears in the same thread, with a tag naming the decision: **Accepted**, **Revision requested** or **Rejected**.
3. Feedback can be added on any version, at any time, by anyone on the project who uses the dashboard. It cannot be edited or removed.
4. Feedback starts once a version exists: work that has never been sent has no version, so nothing to write on. A draft is shared for feedback by sending it for review; the reviewer can request a revision without deciding against the work.

### Review an item that is a later version

1. A review item's page (slice 3) now says "Version 2 of 2." with **See every version and compare**, and lists the previous version's decision and feedback under the details, so the reviewer sees what they asked for last time.
2. The feedback thread for this version sits beside the preview, with **Add feedback on version <n>**. Adding feedback does not decide the item. **Your decision** is unchanged.
3. In the queue and in **Everything waiting**, an item that is not a first version shows "Version <n>" after its title.

### Compare versions

1. **Compare versions** opens with the latest version and the one before it. **Compare version** and **with version** choose any two; **Compare** shows them.
2. Each side shows the version's preview, **Open the file**, **Sent by**, **What changed**, **Decision** and its feedback. An earlier version also shows **Restore version <n>** when nothing is waiting.
3. With only one version: "Ferry pilot character sheet has one version so far. You can compare versions once a second one is sent."

### Restore an earlier version

The confirmation keeps slice 3's **Go back** as its first, safe button. The user documentation heads this task "Restore an earlier version", not "Go back", so the two are not confused.

1. **Restore version 1** opens a confirmation: "Restore version 1 of Lighthouse concept?", "Version 1's file is sent for review again as version 3, at Look and concept art. It waits for Morgan Ray or Sam Okafor. Version 2 is kept, with its feedback.", and **What changed**, filled in with "Restored version 1." for the person to add why.
2. **Go back** comes first. **Restore version 1** sends it and opens the work's page with "Restored version 1 as version 3. It waits for Morgan Ray or Sam Okafor. Versions 1 and 2 are kept, with their feedback."
3. The new version shows **Restored from: Version 1**.
4. Anyone on the project who uses the dashboard can restore, as anyone can send for review (slice 3). The version records who did it.

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| Board, as Jordan | ![Board](work-and-versions/board.png) | Phone: ![Board at 320px](work-and-versions/board-phone.png). Every stage, empty ones included. |
| Blocked work only | ![Blocked only](work-and-versions/board-blocked.png) | |
| Blocked work only, nothing blocked | ![Nothing is blocked](work-and-versions/board-blocked-none.png) | |
| Board after a change elsewhere | ![Updated](work-and-versions/board-updated.png) | No reload; **Changed 14:22** tags and the status line. |
| Board could not check for updates | ![Update failed](work-and-versions/board-update-failed.png) | As Riley: no **Add work**. |
| Board, nothing on it yet | ![Empty](work-and-versions/board-empty.png) | |
| Add work | ![Add work](work-and-versions/add-work.png) | Phone: ![At 320px](work-and-versions/add-work-phone.png) |
| Add work, nothing filled in | ![Not added](work-and-versions/add-work-errors.png) | Focus on the summary. |
| After Add work | ![Added](work-and-versions/work-added.png) | Focus on the notice. |
| Work's page after Change owner | ![Owner changed](work-and-versions/work-owner-changed.png) | As Jordan. |
| Remove work, confirmation | ![Remove?](work-and-versions/remove-confirm.png) | Only for work with no versions. |
| Board after Remove | ![Removed](work-and-versions/board-removed.png) | Focus on the notice. |
| A piece of work, latest version returned | ![Work](work-and-versions/work.png) | Phone: ![At 320px](work-and-versions/work-phone.png). Feedback beside the version. |
| A piece of work, latest version waiting | ![Waiting](work-and-versions/work-waiting.png) | No **Restore**; says why. |
| A piece of work with no versions, as its owner | ![Not sent](work-and-versions/work-not-sent.png) | The newcomer's first task. |
| Add feedback with nothing written | ![Feedback not added](work-and-versions/feedback-error.png) | Focus on the summary. |
| Review item that is version 2, as Morgan | ![Version 2](work-and-versions/version.png) | Phone: ![At 320px](work-and-versions/version-phone.png) |
| Send a revised version | ![Send a revised version](work-and-versions/send-version.png) | Phone: ![At 320px](work-and-versions/send-version-phone.png) |
| Compare versions | ![Compare](work-and-versions/compare.png) | Phone: ![Stacked at 320px](work-and-versions/compare-phone.png) |
| Compare, same version twice | ![Choose two](work-and-versions/compare-same.png) | Focus on the error. |
| Compare, only one version | ![One version](work-and-versions/compare-one.png) | |
| Restore, confirmation | ![Restore?](work-and-versions/restore-confirm.png) | Phone: ![At 320px](work-and-versions/restore-confirm-phone.png) |
| After Restore | ![Restored](work-and-versions/restored.png) | Focus on the notice. |

## Layout

- **Board** is a project tab after **Review**: Overview, Review, Board, Facts, People, Approvers, Activity.
- Addresses (added to decision-navigation-and-urls): the board `/projects/<id>/board`, blocked only `/projects/<id>/board?show=blocked`, **Add work** `/projects/<id>/board/new`, a piece of work `/projects/<id>/board/<work id>`, compare `/projects/<id>/board/<work id>/compare?a=<n>&b=<n>`, and **Send a revised version** `/projects/<id>/review/new?work=<work id>`. A version's page is its review item page, `/projects/<id>/review/<item id>`.
- On the board, each stage's work is a table. At 320 pixels each row becomes a block with its labels, as on **Sent by you**.
- On a work's page and an item's page, the version and its feedback are two columns from 721 pixels; at 720 and below, the feedback follows the version. Compare uses the same break.
- Control names: **Board**, **Add work**, **Decided by**, **All work**, **Blocked work only**, **Title**, **Stage**, **Owner**, **Cancel**, **Change owner**, **Remove <title>**, **Go back**, **Send a revised version**, **Send for review**, **Compare versions**, **Withdraw version <n>**, **Open the file**, **Add feedback on version <n>**, **Add feedback**, **Restore version <n>**, **What changed**, **File**, **Is other work waiting on this decision?**, **Nothing is waiting**, **Compare version**, **with version**, **Compare**, **See every version and compare**, **Back to <title>**, and the tags **Blocking**, **Changed <time>**, **Accepted**, **Revision requested**, **Rejected**.
- State names, exactly: **In progress**, **Waiting for review**, **Blocked**, **Done**, and "No work yet" for a stage.

## States and errors

- **Board, nothing on it:** every stage says "No work yet", above them "Nothing is on the board yet. Work joins it when someone sends it for review, or when a director or producer adds it with Add work."
- **Blocked work only, nothing blocked:** "Nothing is blocked." with a link to **All work**.
- **Could not check for updates:** "Could not check for updates at 14:23. Trying again in a minute. The board may be out of date; reload the page to check now." in the status line. The page stays usable; the next try is a minute later, then back to every 15 seconds once one succeeds.
- **Add work, fields missing:** "Enter a title.", "Choose the stage this work is at.", "Choose who owns this work." in an error summary that takes focus; what was chosen is kept. **Title** at most 120 characters: "Keep the title to 120 characters or fewer." The title is checked against the organisation's identifier formats, with the same error and confirmation as slice 3 (design-identifier-filter).
- **Add feedback, nothing written:** "Write your feedback before adding it." in an error summary. At most 2,000 characters: "Keep feedback to 2,000 characters or fewer." Feedback is checked against identifier formats like decision feedback.
- **Compare, same version twice:** "Choose two different versions." next to the choices, taking focus. A version number that does not exist shows the latest two instead.
- **Compare, one version:** the message above, with **Back to <title>**.
- **Restore while a version is waiting:** not offered; the page says why. If a version was sent in another session while the confirmation was open: "Not restored: Riley Chen sent version 3 at 09:18, and it is waiting for review. Withdraw it first to restore an earlier version." Nothing changes.
- **Restore, identifier check:** a restored file is checked again, like a send. A PDF or Word file that now matches a format turned on since is held with the same notice as slice 3, and nothing is sent until the person confirms.
- **Remove work that gained a version meanwhile:** "Not removed: Riley Chen sent version 1 at 10:02. Work with versions stays on the board."
- **Owner leaves the project:** the owner shows as "<name> (no longer on the project)", the state is unchanged, and the director and producer can change the owner. The work leaves that person's **What needs you**.
- **Approver changes:** the stage's owner and "waiting for" lines change at the next update, as the queue does (design-approvers).
- **Not the director or producer:** no **Add work**, **Change owner** or **Remove**. Everything else on the board is the same for everyone on the project who uses the dashboard.
- **Agents:** in slice 4 an agent cannot add work, change an owner, remove work, add feedback or restore; the command layer refuses it. Agents' versions and feedback arrive with slice 7.

## How it works

- **How does the system know?**
  - A piece of work and its versions are rows in the record. A version is a review item with a work id and a number; the number is given in the same transaction that makes the item, so two sends at once cannot share a number.
  - States, stage states, counts and "waiting for" lines are worked out on the server from the latest version's state in the approvals ledger, the waiting items that name a stage they block, and the current assignments (design-approvers), on each load and each update request. Nothing on the board is stored as a state, so it survives a reload, another device and a restore, and cannot drift from the queue.
  - Feedback entries are append-only rows linked to a version, with the person and the time. Decision feedback stays in the approvals ledger and is read into the thread from there, so it is not stored twice.
  - The update request returns the board's rows with a version stamp (the latest change in the record for this project). The page replaces only the rows that differ, and the status line names them.
- **What enforces each promise?**
  - "States change with no manual update": no command sets a state; a test sends, decides, withdraws and hands on, then reads the board after each step without reloading the page (an end-to-end test with a second browser session acting).
  - "Earlier versions are kept when one is restored": versions are never updated or deleted, and restore is the send command with an earlier file. A test restores and checks every version is listed with its feedback.
  - "Feedback cannot be changed": the application's database role has no update or delete on feedback, as for the activity log (slice 2). A database test.
  - "Only one version waits at a time": the send command refuses a new version while one is waiting, in the same transaction. A test sends twice at once.
  - "Only the director and producer add work, change owners and remove work": a new permission, **plan-work**, in the permission table in `contracts/` for those two roles. A test signs in as each role.
  - "Blocked means waiting on a blocking item": a unit test of the state rules covers each precedence case, including an item that names its own stage.
  - Every add, owner change, removal, feedback and restore is logged in **Activity** under the area **Review**: "Added work Harbour ambience (Sound and music) for Drew Patel", "Changed the owner of Harbour children character sheet to Riley Chen", "Removed work Harbour children character sheet", "Added feedback on Lighthouse concept, version 2", "Restored Lighthouse concept version 1 as version 3". Feedback text is never copied into the log.
- **What is published together?** Not applicable.

## Accessibility

- Areas are `h2` and stages `h3`, each a section labelled by its heading, so screen reader users can move stage by stage. Each table has a caption naming its stage.
- States are words, never colour. **Blocking** and **Changed <time>** are text tags.
- **All work** and **Blocked work only** are links in a navigation region labelled "Show", the current one marked with `aria-current="page"`.
- Live updates use one polite status region, present and empty from page load. Focus never moves on an update, and a row under focus is updated in place, not removed. Updates stop while the tab is hidden. Nothing moves or flashes.
- The feedback thread is an ordered list, oldest first, each entry starting with who and when. The decision tag is text.
- Compare gives each version a heading ("Version 1"), and each **Open the file** and **Restore version <n>** says which version.
- Dialogs (restore, remove) start focus on their heading, put **Go back** first, treat Escape as **Go back**, and return focus to the button that opened them.
- Targets are at least 44 by 44 pixels. No horizontal scrolling at 320 pixels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) at 1280 and 320 pixels wide, with no violations. The manual WCAG 2.2 AA check the architecture asks for (WEB-002) is done on the built pages in the delivery.

## Open items

- Differences inside files (an image overlay, a text diff of a PDF): with the content layer.
- Versions made by agents and pipeline steps, "regenerated": slices 7 and 11, through the same command.
- Due dates and an order of stages on the board are not in any Layer 1 story.
- Email and badge alerts for feedback: story-review-and-status-notifications, slice 9.
