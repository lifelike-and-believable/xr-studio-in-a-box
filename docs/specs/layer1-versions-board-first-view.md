---
id: spec-layer1-versions-board-first-view
status: approved
derived-from:
  - docs-board#see-where-everything-stands: eb1e0ba19f25
  - docs-board#show-only-blocked-work: 8626926d160e
  - docs-board#when-things-change: e859d541e842
  - docs-board#how-work-gets-on-the-board: f3dc395cf332
  - docs-board#who-can-do-this: c797b10ca846
  - docs-board#if-something-goes-wrong: 070cf05cab1e
  - docs-versions-and-feedback#see-a-piece-of-work-and-its-feedback: 3c5f504df8ed
  - docs-versions-and-feedback#give-feedback-on-a-version: ac491689f685
  - docs-versions-and-feedback#send-a-revised-version: 9c0a8dc0bc33
  - docs-versions-and-feedback#compare-two-versions: 69cf359f89b6
  - docs-versions-and-feedback#restore-an-earlier-version: 32b3e0cf64b7
  - docs-versions-and-feedback#who-can-do-this: 9b811d54a515
  - docs-versions-and-feedback#if-something-goes-wrong: 9fdbedc6adb5
  - docs-what-needs-you#find-what-to-do-next: 9b223e63823b
  - docs-what-needs-you#if-you-are-new-to-a-project: d7f3a3bbc11c
  - docs-what-needs-you#when-things-change: 3cfd2d9ed993
  - docs-what-needs-you#if-something-goes-wrong: 4529bfaae6df
  - docs-review#see-what-you-have-sent: fea857dae05d
  - docs-your-projects: 9f550e665a71
  - design-work-and-versions: 93d6a3b09864
  - design-what-needs-you: f2ad84583dbc
  - decision-navigation-and-urls: 2dd0e158ee13
tests-commit:
unlocks:
  - contracts/test/roles.test.ts: Roles and permissions. Slice 1's test compares each role's permissions with an exact list; the Director and Producer list gains `plan-work` as the spec's Roles and permissions section gives it. Every earlier permission is still checked.
---

# Layer 1, slice 4: versions, the board and the first view

## Problem

Work sent for review today is a list of unrelated items: a revision is not linked to what it revises, nobody can see every stage and piece of work with its owner and state, feedback lives only in a decision, and a person who signs in lands on a list of projects rather than on what needs them. Slice 4 builds what the approved user documentation promises for the board (`docs/user/board.md`), versions and feedback (`docs/user/versions-and-feedback.md`) and the first view (`docs/user/what-needs-you.md`), on the queue, approvers, identifier filter and activity log of slices 2 and 3 (design-architecture, build order slice 4).

## User stories

- story-review-and-status-status-board.
- story-review-and-status-feedback-and-versions.
- story-review-and-status-what-needs-me.

## Acceptance criteria

"Source" names the user documentation section each criterion comes from. A test cites a criterion as `layer1-versions-board-first-view#AC-1` in its title or a comment. Wording in quotes is the exact text the user documentation, designs and mock-ups give, and tests check it. "Dir/Prod" means a person holding the Director or Producer role on the project. "Deciders" of a stage are its area's approver and delegate, or the holder of its protected approval (slice 3). Dates and times read "11 November, 16:40" in the viewer's time zone.

### Work and versions in the record

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-1 | A **piece of work** has a title, one gated stage, one owner (a person on the project) and its versions. A version is a review item with the work and a number; the number is given in the transaction that makes the item, so two sends cannot share one, and a unique index on (work, number) refuses any that slip past. A migration makes every item sent before slice 4 a piece of work with one version, owned by its sender. | docs-board#see-where-everything-stands | test: `every item is a version of a piece of work` |
| AC-2 | **Send for review** without a piece of work (slice 3's form) makes a new piece of work owned by the sender, with the item as version 1. Sending with a piece of work adds its next version, with the work's title and stage. | docs-board#how-work-gets-on-the-board | test: `sending makes or extends a piece of work` |
| AC-3 | Only one version of a piece of work waits at a time: sending or restoring while one waits is refused in the same transaction (the work row is locked first), with "Not sent: version <n> of <title> is waiting for review. Withdraw it first." for a send. | docs-versions-and-feedback#send-a-revised-version | test: `only one version waits at a time` |
| AC-4 | A piece of work's state is worked out on every read, never stored: **Done** when its latest version was accepted; else **Blocked** when an item that is still waiting, not a version of this work, names this work's stage under **Is other work waiting on this decision?**; else **Waiting for review** when its latest version waits; else **In progress** (no version, or the latest was returned, rejected or withdrawn). A stage's state is the first of Blocked, In progress, Waiting for review and Done that any of its work has. The rules are a pure function in `contracts/`. | docs-board#see-where-everything-stands | test: `work and stage states follow the precedence rules` |

### The board

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-5 | The project tabs are **Overview**, **Review**, **Board**, **Facts**, **People**, **Approvers** and, for roles that may read it, **Activity**. **Board** (`/projects/<id>/board`) is shown to everyone on the project who uses the dashboard. | docs-board | test: `board tab sits after review` |
| AC-6 | The board says "Every stage and piece of work on this project, with its owner and its state. States change by themselves as work is sent, decided and handed on." and counts the work: "<n> pieces of work: <b> blocked, <w> waiting for review, <p> in progress, <d> done." ("1 piece of work"; counts of zero are left out). | docs-board#see-where-everything-stands | test: `the board lists every stage with its work` |
| AC-7 | Every gated stage is listed, Builds and operations included, in the order of **Approvers**, under an `h2` per area and an `h3` per stage, each a section labelled by its heading. Builds and operations adds "Builds reach these stages from the build pipeline in a later release." Each stage says "Decided by: <approver>, the <Area> approver, with <delegate> as delegate." (no delegate: "Decided by: <approver>, the <Area> approver."; protected: "Decided by: <holder>, who holds the <approval, lower case> approval.") then "Stage: <state>. <n> piece(s) of work: <counts>." or "No work yet." | docs-board#see-where-everything-stands | test: `the board lists every stage with its work` |
| AC-8 | Each stage with work has a table captioned "Work at <stage>" with **Work** (a link to the work's page), **Owner**, **State** (the state, then a line of detail) and **Latest version** ("Version <n>, sent <date>", or "No versions yet"). Detail lines: "Not sent for review yet."; "Version <n>: revision requested by <name>, <date and time>." (also "rejected by", "withdrawn by", "accepted by"); "Waiting for <deciders joined with "or">." or "Waiting for <delegate> (handed on by <approver>)."; a waiting item that blocks adds "Blocking <stage> waits on this decision."; a blocked work's line starts "Waits on <title> (<stage>), which is waiting for <deciders>." and goes on with the line it would otherwise have. An owner who has left shows "<name> (no longer on the project)". | docs-board#see-where-everything-stands | test: `states and their detail lines` |
| AC-9 | With no work on the project, every stage says "No work yet." and the page says "Nothing is on the board yet. Work joins it when someone sends it for review, or when a director or producer adds it with Add work." | docs-board#if-something-goes-wrong | test: `an empty board` |
| AC-10 | **All work** and **Blocked work only** are links in a navigation region labelled "Show", the current one marked `aria-current="page"`. **Blocked work only** (`?show=blocked`) shows only stages with blocked work and only their blocked work, and the count line reads "<n> piece(s) of work is/are blocked." With nothing blocked: "Nothing is blocked." with a link to **All work**. | docs-board#show-only-blocked-work | test: `blocked work only` |
| AC-11 | The board and a work's page ask the record for changes every 15 seconds while the page is visible, and at once when it becomes visible again, with no reload. A changed row is updated in place with a **Changed <time>** tag; a polite status region, present and empty from page load, says "Updated <time>: <title> is now <State>." for each change of state (other changes: "<title> changed."; new work: "<title> was added."). Focus does not move. In **Blocked work only**, a row that stops being blocked stays, with its new state, until the next load. A failed check shows "Could not check for updates at <time>. Trying again in a minute. The board may be out of date; reload the page to check now." and the next try is a minute later, then every 15 seconds once one succeeds. | docs-board#when-things-change | test: `the board changes with no reload` |

### Adding work and its owner

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-12 | A Dir/Prod sees **Add work** on the board. **Add work** (`/projects/<id>/board/new`) says "Put a piece of work on the board before anyone sends it, so its owner sees it under What needs you." and has **Title**, **Stage** (the stages sent by hand, grouped by area, after "Choose a stage"), a polite region saying who decides the chosen stage (as on **Send for review**), **Owner** ("The person who makes it. They see it under What needs you.", after "Choose a person": people on the project who use the dashboard), **Add work** and **Cancel**. | docs-board#add-work | test: `add work` |
| AC-13 | **Add work** opens the new work's page with "Added <title> to <stage>, owned by <owner>. It shows under What needs you for <owner's first name>.", focus on the notice. The work records who added it and when (**Added by** on its page). | docs-board#add-work | test: `add work` |
| AC-14 | Missing fields give "Enter a title.", "Choose the stage this work is at." and "Choose who owns this work." in an error summary that takes focus, choices kept; a title over 120 characters gives "Keep the title to 120 characters or fewer."; a title that matches an identifier format is refused with slice 3's summary and **It is not a <format>**, which shows **What is it?**, and adding again records the confirmation. | docs-board#if-something-goes-wrong | test: `add work errors` |
| AC-15 | On a work's page a Dir/Prod sees **Owner** (a list of people on the project who use the dashboard) and **Change owner**, which gives "<owner> now owns <title>. It shows under What needs you for <first name>." | docs-board#change-the-owner | test: `change the owner and remove work` |
| AC-16 | A Dir/Prod sees **Remove <title>** on a work with no versions. It opens a dialog "Remove <title> from the board?" with "It has no versions, so nothing else is lost. <owner> no longer sees it under What needs you. The removal is recorded in Activity.", **Go back** first and **Remove <title>**; removing opens the board with "Removed <title> from the board.". Work with a version cannot be removed: "Not removed: <name> sent version 1 at <time>. Work with versions stays on the board." | docs-board#remove-work-added-by-mistake | test: `change the owner and remove work` |
| AC-17 | Only a Dir/Prod adds work, changes an owner or removes work: a new permission `plan-work` for those two roles. Anyone else sees none of these controls, and the commands refuse them and every agent session. | docs-board#who-can-do-this | test: `only directors and producers plan work` |

### A piece of work's page and feedback

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-18 | A work's page (`/projects/<id>/board/<work id>`) shows **Stage** ("<stage> (<Area>)"), **Owner** (with "(you)" for the viewer), **State** ("<State>. <detail>"; a waiting version reads "Waiting for review. Version <n> is waiting for <deciders>."), **Decided by** and, for added work, **Added by** "<name>, <date and time>"; a blocking waiting version shows **Waiting on this**. Everyone on the project who uses the dashboard can open it. | docs-versions-and-feedback#see-a-piece-of-work-and-its-feedback | test: `a piece of work's page` |
| AC-19 | The latest version is headed "Version <n>, the latest", with its preview, **Open the file**, **Sent by**, **What changed**, **Restored from** "Version <m>" for a restored version, and **Decision** ("Revision requested by <name>, <date and time>", or "Waiting for <deciders>" while it waits). Beside it (from 721 pixels; below it at 720 and less) is **Feedback on version <n>**: an ordered list, oldest first, each entry starting with who and when; decision feedback is in the same list with a **Accepted**, **Revision requested** or **Rejected** tag; with none, "No feedback on version <n> yet." | docs-versions-and-feedback#see-a-piece-of-work-and-its-feedback | test: `a piece of work's page` |
| AC-20 | **Versions** is a table captioned "Every version of this work, newest first" with **Version** ("Version <n> (latest)", a link to the version's review item page), **Sent**, **What changed**, **Decision** ("Waiting" or "<Decided> by <name>, <date and time>") and **Actions**. With no versions: "No versions yet. The first one is made when someone sends this work for review." | docs-versions-and-feedback#see-a-piece-of-work-and-its-feedback | test: `a piece of work's page` |
| AC-21 | Actions follow the state: latest returned, rejected, withdrawn or accepted: **Send a revised version** and **Compare versions**; latest waiting: **Withdraw version <n>** for its sender and **Compare versions**, and above **Versions** "Version <n> is waiting for review. To restore an earlier version, withdraw version <n> first."; no versions: **Next step** "Make it, then send it for review. It does not move on until <deciders joined with "or"> accepts it." and **Send for review**. | docs-versions-and-feedback#see-a-piece-of-work-and-its-feedback | test: `actions follow the state` |
| AC-22 | **Add feedback on version <n>** ("Everyone on the project who uses the dashboard can read it. It cannot be edited or removed afterwards.") and **Add feedback** add an entry with the person's name and the time; the page shows "Feedback added." with focus on it. Anyone on the project who uses the dashboard can add feedback to any version, waiting or decided; adding it decides nothing. | docs-versions-and-feedback#give-feedback-on-a-version | test: `give feedback on a version` |
| AC-23 | Empty feedback gives "Write your feedback before adding it." and over 2,000 characters "Keep feedback to 2,000 characters or fewer." in an error summary ("Feedback not added") that takes focus, text kept; feedback that matches an identifier format is refused with slice 3's summary and **It is not a <format>**. | docs-versions-and-feedback#if-something-goes-wrong | test: `feedback errors` |
| AC-24 | Feedback entries are an append-only ledger (`work_feedback`): the application role may insert and read them, never update or delete them. Decision feedback stays in `review_decision` and is read into the thread, not stored twice. | docs-versions-and-feedback#give-feedback-on-a-version | test: `feedback cannot be changed` |
| AC-25 | A review item that belongs to work with more than one version says "Version <n> of <total>." with **See every version and compare** (to the work's page), and shows **Version <n-1>** with that version's decision and feedback ("Revision requested by <name>, <date and time>: "<feedback>""). Its feedback thread and **Add feedback on version <n>** sit beside the preview; **Your decision** is unchanged. In the queue and in **Everything waiting**, an item that is not a first version shows "Version <n>" after its title. | docs-versions-and-feedback#give-feedback-on-a-version | test: `a later version's review page` |

### Send a revised version, compare and restore

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-26 | **Send a revised version** and **Send for review** on a work's page open **Send for review** for that work (`/projects/<id>/review/new?work=<work id>`), headed "Send a revised version" when the work has versions: **Work**, **Stage**, **This will be** "Version <n>", **Decided by**, and "<name> asked, on version <n>:" with the last decision's feedback, then **What changed**, **File**, **Is other work waiting on this decision? (optional)** filled in from the last version, **Send for review** and **Cancel**. Sending opens the work's page with "Sent for review: <title>, version <n>. It waits for <deciders joined with "or">.", focus on it. | docs-versions-and-feedback#send-a-revised-version | test: `send a revised version` |
| AC-27 | In **Sent by you**, **Send a revised version** and **Send it again** open this same form for the item's work, so the new item is the work's next version; they are shown only on an item that is the latest version of its work. | docs-review#see-what-you-have-sent | test: `send a revised version` |
| AC-28 | **Compare versions** (`/projects/<id>/board/<work id>/compare?a=<n>&b=<n>`) is headed "Compare versions of <title>" and opens with the latest version and the one before it. **Compare version** and **with version** choose any two; **Compare** shows them. Each side is headed "Version <n>" and shows the preview, **Open the file, version <n>**, **Sent by**, **What changed**, **Decision** and its feedback, and **Restore version <n>** for an earlier version while nothing waits. At 720 pixels and less the two stack, the first above. | docs-versions-and-feedback#compare-two-versions | test: `compare two versions` |
| AC-29 | Choosing the same version twice shows "Choose two different versions." in an error that takes focus; a version number that does not exist shows the latest two. With one version: "<title> has one version so far. You can compare versions once a second one is sent." and **Back to <title>**. | docs-versions-and-feedback#if-something-goes-wrong | test: `compare two versions` |
| AC-30 | **Restore version <n>** (in **Versions** and in **Compare versions**, only while no version waits) opens a dialog "Restore version <n> of <title>?" with "Version <n>'s file is sent for review again as version <next>, at <stage>. It waits for <deciders>. Version(s) <later> is/are kept, with its/their feedback.", **What changed** ("<deciders joined with "and"> see this. Say why you are going back.") filled with "Restored version <n>.", **Go back** first and **Restore version <n>**. Restoring opens the work's page with "Restored version <n> as version <next>. It waits for <deciders>. Versions <1 to next-1 joined with "and"> are kept, with their feedback." The new version shows **Restored from** "Version <n>"; every earlier version is kept unchanged. | docs-versions-and-feedback#restore-an-earlier-version | test: `restore an earlier version` |
| AC-31 | A restore while another version is waiting (sent meanwhile) changes nothing and says "Not restored: <name> sent version <m> at <time>, and it is waiting for review. Withdraw it first to restore an earlier version." A restored version's **What changed**, and the text of a PDF or Word file, are checked again against the identifier formats: a matching file is not sent, with "<file> is held, not sent: its text looks like it has a <format>." and **It is not a <format>, add <file>**, which asks **What is it?**; restoring with an answer records the confirmation. | docs-versions-and-feedback#if-something-goes-wrong | test: `restore conflicts and identifier checks` |

### What needs you

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-32 | The main navigation is **What needs you**, **Projects**, **Organisations**. **What needs you** (`/what-needs-you`) is where a person on at least one project lands after sign-in (unless they followed a link to another page) and after accepting an invitation; `/` and **XR Studio** go to it, or show **Projects** for a person on no project. **Projects** lists the person's projects at `/projects`. Opening **What needs you** on no project shows "You are not on any projects" with **Projects**' text and buttons. | docs-what-needs-you, docs-your-projects | test: `what needs you is the first view` |
| AC-33 | The page says "What is waiting for you on all your projects, grouped by gate, oldest first. It updates as work moves; there is no need to reload." and a count: "<n> thing(s) need(s) you: <d> for your decision, <b> blocking, <r> returned to you, <a> assigned to you." (zero parts left out) followed by " <w> thing(s) you sent is/are waiting for others." when there are. | docs-what-needs-you#find-what-to-do-next | test: `the four lists` |
| AC-34 | Up to four `h2` sections, empty ones left out, each with its line: **For your decision** ("Work waiting at a gate you decide. Open an item to accept it, request a revision or reject it."): items waiting at a gate the person decides, except items handed to a delegate, which are listed for the delegate only (an approver who handed any on sees "Items you handed to a delegate are not listed here; they are in the delegate's list. You can still decide them from the project's Review tab."); **Returned to you** ("Work you sent that came back. Read the feedback, then decide what to do next."): work whose latest version was returned or rejected and which the person sent or owns; **Assigned to you** ("Work you own that is not waiting for review: not sent yet, or withdrawn."); **Waiting for others** ("Work you sent that is waiting at a gate. Nothing to do until it is decided."): versions the person sent that wait. Only projects the person is on, and only what their roles there allow. | docs-what-needs-you#find-what-to-do-next | test: `the four lists` |
| AC-35 | In each section, items are grouped by gate and project, an `h3` "<stage>, <project>" with "<n> item(s)[, <m> blocking]."; groups with a blocking item first, by their oldest blocking item, then the rest by their oldest item; inside a group, blocking items first, then oldest first. "Oldest" is when the item reached the person: sent (decisions and waiting), decided (returned) or assigned. | docs-what-needs-you#find-what-to-do-next | test: `grouping and order are by gate, blocking first` |
| AC-36 | Each item is an `h4` link (decisions and waiting items to the review item page; returned and assigned work to the work's page), with a line ("Version <n> from <name>, <date and time>." for decisions; "Version <n>, sent <date and time>." waiting; "Version <n>: revision requested by <name>, <date and time>." returned; "Added by <name>, <date and time>. Not sent for review yet." or "Version <n>: withdrawn by <name>, <date and time>." assigned), the decision's feedback quoted as "<name>: <feedback>", **Blocking** with "<stage> waits on this decision." where it applies, and **Next step:** with the design's sentence for its case (choice 6), naming deciders ("Morgan Ray or Sam Okafor decides it", "at <stage>" while the person is new to the project). | docs-what-needs-you#find-what-to-do-next | test: `the four lists` |
| AC-37 | Under the lists, **Your stages** has a `details` panel per project, **How work moves on <project>**: "You are <the Director|a Sound designer|...> on <project>. A gate is the point where a named person must accept your work before it moves on. Each of your stages has one.", a table captioned "Your stages on <project> and who decides each" (**Your stage**, **Who decides it**, the viewer named "You"), and "When a piece of work is ready, open it and select Send for review. Work assigned to you is listed above, under Assigned to you. If you expected work that is not listed, ask the project's producer, <names>." It is open while the person has sent nothing on that project. The stages come from a role-to-stage table in `contracts/` (design-what-needs-you choice 8). | docs-what-needs-you#if-you-are-new-to-a-project | test: `your stages for a newcomer` |
| AC-38 | With nothing in the four lists: "Nothing needs you right now." and "Nothing is waiting for your decision, nothing you sent has come back, and no work is assigned to you. This page updates by itself when that changes." with "To see where everything stands on a project, open its Board:" and a link to each project's board; for a project the person is new to instead "Nothing is assigned to you yet on <project>. Ask the project's producer, <name>, or its director, <name>, to add your first piece of work. It will appear here, under Assigned to you, without a reload."; with only waiting items: "Nothing needs you right now. <w> thing(s) you sent is/are waiting for others." | docs-what-needs-you#if-something-goes-wrong | test: `nothing needs you` |
| AC-39 | The page asks for changes every 15 seconds while visible. A new item appears in its place with a **New** tag; an item that no longer needs the person stays in place, replaced by one line "<title>: <what happened>. It no longer needs you." (for example "accepted by Morgan Ray at 14:22"), or "<title>: you can no longer decide this." after a change of approver; a polite status region says "Updated <time>: <n> new item(s) <section>. <n> item(s) <accepted|...>."; focus never moves. A failed check shows "Could not check for updates at <time>. Trying again in a minute. This page may be out of date; reload it to check now." | docs-what-needs-you#when-things-change | test: `what needs you changes with no reload` |
| AC-40 | The page's reads write nothing: they run in a read-only transaction. | docs-what-needs-you#find-what-to-do-next | test: `what needs you adds no record` |

### Records, write path and accessibility

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-41 | Each add, owner change, removal, feedback and restore is logged in **Activity** under **Review**: "Added work <title> (<stage>) for <owner>", "Changed the owner of <title> to <owner>", "Removed work <title>", "Added feedback on <title>, version <n>", "Restored <title> version <n> as version <next>". Feedback text is never copied into an entry. Agent sessions are refused by every slice 4 command. | docs-versions-and-feedback#who-can-do-this, docs-board#who-can-do-this | test: `slice 4 actions are logged and agents are refused` |
| AC-42 | Every write goes through the command layer; the write-path test's allow-list gains no file. Pieces of work are working state; versions are review items; feedback is a ledger. | docs-board#who-can-do-this | test: `writes go through the command layer` (unchanged) |
| AC-43 | The API under `/api/v1` gives: `GET /projects/:id/board` (`?show=blocked`; the rows and a version stamp), `POST /projects/:id/work`, `GET /projects/:id/work/:work`, `PUT /projects/:id/work/:work/owner`, `DELETE /projects/:id/work/:work`, `POST /projects/:id/work/:work/restore`, `POST /projects/:id/review-items/:item/feedback`, `POST /projects/:id/review-items` with an optional `workId`, and `GET /what-needs-you`. Bodies are validated with `contracts/` schemas; refusals use the slice 1 shape. | docs-board#who-can-do-this | test: `the slice 4 API` |
| AC-44 | Every page in this slice has no axe violations at WCAG 2.2 AA, works with the keyboard alone, and has no horizontal scroll at 320 CSS pixels; tables become one labelled block per row at 320 pixels. Notices and error summaries take focus. Dialogs start focus on their heading, put **Go back** first, treat Escape as **Go back** and return focus to the control that opened them. States and tags are words, never colour alone. | design-work-and-versions, design-what-needs-you (Accessibility sections) | check: the end-to-end suite `slice 4 pages pass axe and keyboard checks`, run in CI |

## Roles and permissions

One new permission in `contracts/src/roles.ts`, `plan-work` (add work, change its owner, remove work with no versions), held by the Director and the Producer. It is not an approval. Seeing the board, a work's page and **What needs you**, adding feedback, sending a revised version, comparing and restoring follow `open-project`. Deciding still follows the approval assignments.

`contracts/` also holds the role-to-stage table of design-what-needs-you choice 8 (marked `[proposed]` there): it only guides **Your stages** and gives no permission.

## Scope

- In:
  - `contracts/`: `plan-work`; the role-to-stage table; the state rules (AC-4); request schemas for AC-43.
  - Database (Drizzle, generated migrations, UUIDv7 ids):
    - `work` (id, project, title, hand-off, owner person, added by person or none, added at, assigned at): working state.
    - `review_item` gains `work_id` (not null after the backfill) and `version`, unique together, and `restored_from` (a version number or none).
    - `work_feedback` (id, item, text, person, at): a ledger with the grants of slice 2's ledgers.
    - The migration makes a piece of work for each existing item, with the item's id as the work's id.
  - `web/src/record/`: commands add work, change owner, remove work, add feedback, restore version; send for review takes an optional work; reads for the board, a work, compare and **What needs you**.
  - API (AC-43) and pages at the addresses of decision-navigation-and-urls; `/projects` for **Projects**.
  - The user pages `docs/user/review.md` ("Send a revised version") and `docs/user/your-projects.md` (where you land after sign-in), whose wording the designs said would change with this delivery.
- Out:
  - Differences inside files (the content layer); versions from agents and pipeline steps (slices 7 and 11); alerts (slice 9); due dates and an order of stages.

## APIs and assumptions

- No new dependency. Updates are polling, as design-work-and-versions choice 11 says: Vercel functions do not hold connections open.
- Two sends at once: both lock the work row (`for update`) before reading its versions, so the second sees the first and is refused (AC-3); the unique index on (work, version) refuses any row that slips past.

## Non-functional requirements

- Accessibility: AC-44 (WEB-001, WEB-002).
- Security: every route checks the session and the person's roles on the server (SEC-002); bodies are validated with `contracts/`; **What needs you** queries only projects the person can open.
- Privacy: feedback and what changed never enter the activity log (AC-41).
- Migrations are generated and applied by the pipeline only (PG-001, PG-003).

## Delivery

- Plan item: design-architecture#build-order, slice 4.
- Pull request: one, holding the failing tests first (recorded in `tests-commit`), then the implementation and the tutorial.

## Risks and decisions

Choices the documents leave open are recorded in `docs/decisions/feature-layer1-versions-board-first-view.md`. The moderated first-task test of design-what-needs-you choice 10 needs a person new to the pipeline; it is recorded there for the lead's validation.
