---
id: spec-layer1-gates-and-queue
status: approved
derived-from:
  - docs-approvers#see-who-approves-what: 3fd5430cc1af
  - docs-approvers#name-an-approver-and-a-delegate-for-an-area: d44000e3283e
  - docs-approvers#name-the-holder-of-a-protected-approval: 40fa29fe4e53
  - docs-approvers#what-happens-to-work-already-waiting: dc772f8103c8
  - docs-approvers#removing-someone-who-approves: 115bbfe3785d
  - docs-approvers#who-can-do-this: 970417b09920
  - docs-approvers#if-something-goes-wrong: 049938a5f7fa
  - docs-review#send-work-for-review: 7d6546841422
  - docs-review#see-what-you-have-sent: 800dc109d101
  - docs-review#see-everything-that-is-waiting: 43bc68df81ec
  - docs-review#clear-your-review-queue: cc8f096ce493
  - docs-review#decide-on-an-item: 3e2d314f2287
  - docs-review#decide-on-several-items-at-once: 0422562a8dfb
  - docs-review#hand-an-item-to-your-delegate: 3560c6b466ca
  - docs-review#who-can-do-this: 92af0a744227
  - docs-review#if-something-goes-wrong: 318196a7e498
  - design-approvers: 983b149cfa2a
  - design-review-queue: 5ae80c4a15b8
  - design-identifier-filter: 069c84a56674
  - decision-navigation-and-urls: 2dd0e158ee13
  - decision-identity-and-roles#decision: 402e397cf1b0
  - decision-project-record-model#decision: cd1dfeb7a4dd
tests-commit: 32925eb
unlocks:
  - contracts/test/roles.test.ts: Roles and permissions. Slice 1's test compares each role's permissions with an exact list; the Director and Producer list gains `manage-gates` as the spec's Roles and permissions section gives it. Every earlier permission is still checked, and so is the rule that no permission is an approval.
  - contracts/test/gates.test.ts: AC-1. The test counted 17 hand-offs sent by hand; the gate list has 19 gated hand-offs less the three builds, so 16. No other assertion changes.
  - web/test/review-commands.test.ts: AC-15 to AC-37. Made-up titles used random UUIDs, whose digits can form a Business Number that the filter rightly refuses; they now use letters only. The decision ledger is checked as the application role (AC-28), as slice 2's ledgers are, not as the superuser the test pool connects as. The send helper narrows the moved-on case so it type-checks. No behaviour assertion is weakened.
  - web/e2e/approvers.spec.ts: AC-8, AC-9, AC-11. `getByRole('alert')` also matched Next.js's route announcer, so error summaries are found inside `main`, as slice 2's tests do; adding two people now waits for each notice before moving on. No assertion changes.
  - web/e2e/review.spec.ts: AC-13, AC-16, AC-18, AC-23, AC-24, AC-27, AC-28. The same `main` scoping for alerts and the filter's result line, and the link to **Approvers** is found in the page's text rather than among the tabs. The **Stage** list has three groups, not four: Builds and operations has no stage sent by hand (AC-13). No other assertion changes.
  - web/e2e/slice3-accessibility.spec.ts: AC-40. The same `main` scoping for alerts.
  - web/e2e/facts.spec.ts: AC-2. Slice 2's tests list the project tabs; AC-2 adds **Review** after **Overview** and **Approvers** after **People**, so the three lists gain them. Nothing else changes.
  - web/e2e/tutorial-facts.spec.ts: AC-2. The same tab list in the slice 2 tutorial's runner gains **Review** and **Approvers**.
  - web/e2e/activity.spec.ts: AC-37. The project **Area** filter gains **Approvers** and **Review**.
  - web/e2e/support/slice3.ts: AC-2 to AC-40 (set-up only). The auth library allows 120 sign-ins a minute from one address, which the whole suite reached; the set-up now signs Morgan, Riley and Sam in once and adds them to each test's new project, and keeps Jordan's session. Every test still has its own project. No assertion changes.
---

# Layer 1, slice 3: gates and the queue

## Problem

Nearly every stage of a production needs a person's approval, and today XR Studio has no way to name who approves, to hold work until they do, or to decide on it. Slice 3 builds what the approved user documentation promises for approvers (`docs/user/approvers.md`) and review (`docs/user/review.md`), on the command layer, identifier filter, uploads and activity log of slices 1 and 2 (design-architecture, build order slice 3).

## User stories

- story-project-record-name-approvers.
- story-review-and-status-hold-gated-hand-off.
- story-review-and-status-see-review-queue.
- story-review-and-status-decide-on-items.

## Acceptance criteria

"Source" names the user documentation section each criterion comes from. A test cites a criterion as `layer1-gates-and-queue#AC-1` in its title or a comment. Wording in quotes is the exact text the user documentation and designs give, and tests check it. "Dir/Prod" means a person holding the Director or Producer role on the project. "Deciders" of an item means the approver and delegate of its area, or the holder of its protected approval.

### The gate list

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-1 | `contracts/` holds the gate list of REQ-workflow-2: four areas (**Creative**, **Performance and behaviour**, **Builds and operations**, **Business**), each with its gated hand-offs in the order the requirement gives, and four protected approvals (**Contracts and licence terms**, **Funding applications and reports**, **Publishing and marketing**, **Audience-facing safety and consent**), each tied to the hand-off of the same name. It also names one hand-off that is not gated, **Build for rehearsal**. The three Builds and operations hand-offs are marked as not sent by hand. | docs-approvers#see-who-approves-what | test: `the gate list matches REQ-workflow-2` |

### Approvers

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-2 | The project tabs are **Overview**, **Review**, **Facts**, **People**, **Approvers** and, for roles that may read it, **Activity**, in that order. **Review** and **Approvers** are shown to everyone on the project who uses the dashboard. | docs-approvers#see-who-approves-what, docs-review | test: `review and approvers tabs sit in order` |
| AC-3 | When a project starts, its owner is the approver of all four areas and the holder of all four protected approvals, with no delegates. A migration gives every existing project the same. | docs-approvers | test: `a new project's owner holds every approval` |
| AC-4 | **Approvers** (`/projects/<id>/approvers`) shows a table under **Areas** with each area's name, the hand-offs it decides, its **Approver** and its **Delegate** ("None" when there is none), and a table under **Protected approvals** with each approval and its **Holder**. The page says that hand-offs not listed, such as a build for rehearsal, move on without waiting, and that one person can hold every approval. | docs-approvers#see-who-approves-what | test: `approvers page lists areas and protected approvals` |
| AC-5 | A Dir/Prod sees **Change** on each row (with the row's name in visually hidden text). Anyone else sees no **Change** and the line "Directors and producers can change approvers. On this project: <names>.", naming the people with either role, joined with "and"; opening a change page directly answers **This page is not available**. | docs-approvers#who-can-do-this | test: `only directors and producers change approvers` |
| AC-6 | **Change** on an area opens **<Area>: approver and delegate** (`/projects/<id>/approvers/<area>`) with **Approver** and **Delegate (optional)** lists, **No delegate** first in the second. **Save <Area>** saves both and opens **Approvers** with "<Area> saved: <approver> approves it, with <delegate> as delegate. Items already waiting in <Area> now wait for them." (with no delegate: "..., with no delegate. Items ..."), focus on the notice. **Cancel** saves nothing. | docs-approvers#name-an-approver-and-a-delegate-for-an-area | test: `name an approver and a delegate for an area` |
| AC-7 | **Change** on a protected approval opens **<Approval>: holder** (`/projects/<id>/approvers/protected/<approval>`) with a **Holder** list. **Save <approval>** (for example **Save contracts and licence terms**) opens **Approvers** with "<Approval> saved: <holder> holds it." | docs-approvers#name-the-holder-of-a-protected-approval | test: `name the holder of a protected approval` |
| AC-8 | The lists hold only people on the project whose roles use the dashboard, in the People tab's order; anyone who has not signed in yet is labelled "<name> (invited, not signed in yet)". The command refuses anyone else, and a person who is not a person record (an agent session) cannot be stored: the assignment columns reference `person`. | docs-approvers#name-an-approver-and-a-delegate-for-an-area | test: `only people who use the dashboard can be chosen` |
| AC-9 | Choosing the same person as approver and delegate saves nothing and shows "Choose someone other than the approver as delegate, or No delegate." in an error summary that takes focus, with the choices kept. | docs-approvers#if-something-goes-wrong | test: `approver and delegate must differ` |
| AC-10 | A change applies at once to items already waiting: they wait for the new people, appear in their queues, and leave the queue of anyone who can no longer decide them. | docs-approvers#what-happens-to-work-already-waiting | test: `waiting items follow a change of approver` |
| AC-11 | A person who is an approver, delegate or holder cannot be removed. Their removal page shows "<name> cannot be removed yet" as its heading and "<First name> <what they hold>. Give those to someone else on Approvers first, so that no item waits for a person who has left." (for example "Sam approves Builds and operations and is the delegate for Creative."), with **Keep <first name>** and **Go to Approvers**, and no remove button. Saving roles none of which use the dashboard is refused with the same sentence in an error summary. The command layer refuses both. | docs-approvers#removing-someone-who-approves | test: `someone who approves cannot be removed` |
| AC-12 | Agent sessions are refused by every slice 3 command except adding a recommendation (AC-30). Each approver change is logged in **Activity** under the area **Approvers**: "Named <approver> as approver and <delegate> as delegate for <Area>" (or "and no delegate"), and "Gave the <approval, lower case> approval to <holder>". | docs-approvers#who-can-do-this | test: `approver changes are logged and agents are refused` |

### Sending for review

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-13 | **Review** (`/projects/<id>/review`) has **Send for review**, **Sent by you** and **Everything waiting** at the top. **Send for review** (`/projects/<id>/review/new`) has **Title**, **Stage** (the gated hand-offs that may be sent by hand, grouped by area in `optgroup`s, after "Choose a stage"), **What changed**, **File**, **Is other work waiting on this decision? (optional)** (every gated hand-off, after **Nothing is waiting**), **Send for review** and **Cancel**. | docs-review#send-work-for-review | test: `send for review form` |
| AC-14 | Choosing a stage fills a polite live region, present and empty from page load, with who decides: "<approver>, the <Area> approver, or <delegate>, the delegate, decides this." (with no delegate: "<approver>, the <Area> approver, decides this."; for a protected hand-off: "<holder>, who holds the <approval, lower case> approval, decides this."). | docs-review#send-work-for-review | test: `the form says who decides` |
| AC-15 | Sending puts the item at the gate and opens **Sent by you** with "Sent for review: <title>. It waits for <deciders, joined with "or">.", focus on the notice. The item records its title, stage, what changed, file, the stage waiting on it if one was chosen, who sent it and when. | docs-review#send-work-for-review | test: `send work for review` |
| AC-16 | Missing fields give "Enter a title.", "Choose the stage this work is at.", "Say what changed." and "Choose a file to send." in an error summary that takes focus, the page title starting "Error: Not sent"; typed text is kept. Over-long text gives "Keep the title to 120 characters or fewer.", "Keep what changed to 2,000 characters or fewer." Nothing is cut. | docs-review#if-something-goes-wrong | test: `send for review errors` |
| AC-17 | The file may be a video, image, audio, PDF, Word document or 3D model (.glb, .gltf, .fbx, .usdz), checked from its first bytes as work samples are (a .usdz or .glb or .fbx by its signature, a .gltf as JSON text); any other gives "Choose a video, image, audio, PDF, Word or 3D model file." It travels by the slice 2 signed upload and is registered through the command layer with the purpose "review", so it joins the record as a stored file and never as a work sample. | docs-review#send-work-for-review | test: `review files and their types` |
| AC-18 | **Title**, **What changed** and feedback are checked against the organisation's identifier formats before anything is saved. A match saves nothing and shows the slice 2 summary naming the field and format, with **It is not a <format>** (or **It is none of these**), which shows **What is it?** in the same form; sending again with an answer records the confirmation (in `identifier_confirmation`, with the item as its subject) and logs it. The text of a PDF, Word document or .gltf file is checked when it is registered: a match holds the file, as a held work sample is held, with "<file> is held, not sent: its text looks like it has a <format>. It will be deleted at <time> on <date> unless you confirm it is not a <format>. If the document really holds one, send a copy with those numbers removed and keep the original outside XR Studio.", **It is not a <format>, add <file>** and the 24-hour deletion of slice 2. | docs-review#if-something-goes-wrong | test: `identifiers in review text and files` |
| AC-19 | The dashboard offers no Builds and operations hand-off under **Stage**. The API accepts every gated hand-off, so the build pipeline can send them later. Sending at a hand-off that is not gated (**Build for rehearsal**) makes no item, answers that the work moved on, and logs "Moved <title> on (<hand-off> is not gated)". | docs-review#send-work-for-review | test: `work at a hand-off not on the gate list moves on` |

### The queue

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-20 | **Review** lists every item waiting for the signed-in person's decision on this project, and only those: items whose area they approve or are delegate for, except protected hand-offs, and items at a protected hand-off whose approval they hold. | docs-review#clear-your-review-queue | test: `the queue shows only what you can decide` |
| AC-21 | Items are grouped by stage, each group a section headed by the stage, with "<Area>. <n> item(s)[, <m> blocking]." beside it. Groups with a blocking item come first, by their oldest blocking item; then the others, by their oldest item. Inside a group, blocking items first, then the rest, oldest first. A line above the groups says "<n> items waiting for your decision, <m> blocking." ("1 item", "none blocking"). | docs-review#clear-your-review-queue | test: `groups and order in the queue` |
| AC-22 | Each item shows a preview, its title as a link, **Stage** "<stage> (<Area>)", **Requested by** "<name>, <date and time>" and **What changed**. A blocking item shows **Blocking** and "<stage> waits on this decision."; a handed item shows **Handed to <name>**; an item with an AI recommendation shows it in a box headed **AI recommendation, not a decision**. Previews: an image is shown, a video's first frame, a PDF in an embedded viewer with "<file>, PDF" as its fallback; audio, Word and 3D model files show their file name. | docs-review#clear-your-review-queue | test: `items show their details and previews` |
| AC-23 | **Area** offers **All areas** and the areas the person decides in; **Handed to** offers **Anyone**, **Not handed on**, each delegate of an area the person approves, and **Handed to you** for a delegate. **Apply filters** reloads the page; the result line ("<n> item(s) waiting for your decision: <filters>.") takes focus and leads the page title. **Clear filters** shows everything. | docs-review#clear-your-review-queue | test: `filter the queue` |
| AC-24 | With nothing waiting: "Nothing is waiting for your decision". For someone who decides nothing on the project: "You do not approve any area on this project, so nothing waits for your decision here." with a link to **Approvers**. | docs-review#if-something-goes-wrong | test: `empty queues` |

### Deciding

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-25 | An item's page (`/projects/<id>/review/<item>`) shows the preview, **Open the file**, **Stage**, **Requested by**, **What changed**, **Waiting for** ("<approver>, the <Area> approver, or <delegate>, the delegate", or "<holder>, who holds the <approval> approval. Only <first name> can decide this."), any blocking note and recommendation. Everyone on the project who uses the dashboard can open it and the file; only deciders see **Your decision**. The sender sees "You sent this. It waits until <deciders> decides." and **Withdraw**. | docs-review#decide-on-an-item | test: `an item's page` |
| AC-26 | **Your decision** has **Feedback for <requester> (needed to request a revision)**, **Accept**, **Request revision** and **Reject**. **Accept** and **Request revision** record at once; **Reject** opens a confirmation first ("Reject <title>?", **Go back** first, then **Reject 1 item**, with optional **Feedback** filled from the page). A decision opens **Review** with "<Accepted|Revision requested|Rejected>: <title>. Recorded as your decision at <time> on <date>. <requester> sees it under Sent by you.", focus on it; the item has left the queue. | docs-review#decide-on-an-item | test: `decide on one item` |
| AC-27 | A revision request without feedback records nothing and shows "Write feedback for <requester>: say what to change." in an error summary. Feedback over 2,000 characters gives "Keep your feedback to 2,000 characters or fewer." | docs-review#if-something-goes-wrong | test: `a revision needs feedback` |
| AC-28 | A decision is final: it is one row of the append-only `review_decision` ledger, at most one per item, with the decision, any feedback, who and when. The application role may insert and read it, never update or delete it. A second decision on the same item, by anyone, is refused: on the item page with "Your decision was not recorded: <name> <accepted|asked for a revision of|rejected> this item at <time> on <date>, while you had it open. It has left your queue." (or "<name> withdrew this item at <time> on <date>.") and **Back to Review**. | docs-review#if-something-goes-wrong | test: `a decision is final and recorded once` |
| AC-29 | Batch: each item has a checkbox labelled "Select <title>"; **Accept selected**, **Request revision for selected** and **Reject selected** sit in a group labelled **With the items you select**; a group of two or more has **Accept all <n> in <stage>**. Each opens a dialog listing the items ("<title>, from <requester>"); a revision has a required **Feedback** ("Write the feedback each requester will see."), a rejection an optional one. Confirming ("Accept <n> items", "Request revision of <n> items", "Reject <n> items") records each and gives "<Accepted|Revision requested for|Rejected> <n> items[ in <stage>]."; items someone else decided meanwhile are named: " Not recorded for <titles>: decided by someone else first.". With nothing ticked: "Select at least one item." above the buttons, taking focus. | docs-review#decide-on-several-items-at-once | test: `decide on several items at once` |
| AC-30 | An AI recommendation is a separate record (`review_recommendation`: item, result accept, revise or reject, reason, at) added only by an agent-session principal through the command layer. It is shown only in its box; no command turns it into a decision; decide, hand on and withdraw refuse agent sessions; an item with an accepting recommendation still waits. | docs-review#clear-your-review-queue | test: `an AI recommendation cannot pass the gate` |
| AC-31 | The approver of an area with a delegate sees **Hand to <delegate>** on the area's items that are not handed on. It marks the item handed and opens **Review** with "Handed to <name>: <title>. It shows in <first name>'s queue as handed to them. You can still decide it." Either can still decide it. Protected items cannot be handed on. | docs-review#hand-an-item-to-your-delegate | test: `hand an item to your delegate` |
| AC-32 | A decider may decide an item they sent. | docs-review#decide-on-an-item | test: `decide your own item` |

### Your requests and everything waiting

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-33 | **Sent by you** (`/projects/<id>/review/sent`) lists the person's items on this project, newest first, in a table (Item, Stage, Sent, Status). Status is "Waiting for <approver> or <delegate> (delegate)" (or the one decider), with **Withdraw**; "Accepted by <name>, <date and time>"; "Revision requested by <name>, <date and time>" with **Send a revised version**; "Rejected by <name>, <date and time>" with **Send it again**; "Withdrawn by you, <date and time>" with **Send it again**. Any feedback is shown under the status. With none: "You have not sent anything for review on this project." | docs-review#see-what-you-have-sent | test: `sent by you shows every status` |
| AC-34 | **Withdraw** records at once and opens **Sent by you** with "Withdrawn: <title>. It has left the queue of <deciders, joined with "and">. To send it again, use Send it again.". Withdrawing an item already decided is refused with "Not withdrawn: <name> <accepted|...> it at <time> on <date>." Only the sender can withdraw. | docs-review#see-what-you-have-sent | test: `withdraw something you sent` |
| AC-35 | **Send a revised version** and **Send it again** open **Send for review** with the title, stage and waiting choice filled in; the new item is not linked to the old one, and both stay in **Sent by you**. | docs-review#see-what-you-have-sent | test: `send a revised version` |
| AC-36 | **Everything waiting** (`/projects/<id>/review/waiting`) lists every waiting item on the project, oldest first: the item, **Blocking** where it applies, its stage, who sent it and when, and **Waiting for** ("<approver> or <delegate> (delegate)", "<delegate> (handed on by <approver>)", or the holder), with the viewer's own name written "You". | docs-review#see-everything-that-is-waiting | test: `everything waiting` |

### Records, write path and accessibility

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-37 | Every send, withdrawal, hand-on and decision is logged in the project's **Activity** under the area **Review**: "Sent <title> for review (<stage>)", "Withdrew <title>", "Handed <title> to <name>", "Accepted <title>", "Requested a revision of <title>", "Rejected <title>". Feedback and what changed are never copied into an entry. **Activity**'s **Area** filter offers **Approvers** and **Review**. | docs-review#who-can-do-this | test: `review actions are logged without feedback` |
| AC-38 | Every write in this slice goes through the command layer; the write-path test's allow-list gains no file. Approver assignments are working state (never restored); review items are working state whose state comes from the decision ledger. | docs-review#who-can-do-this | test: `writes go through the command layer` (extended) |
| AC-39 | The API under `/api/v1` gives every action above, each body validated with a `contracts/` schema: `GET /projects/:id/approvers`, `PUT /projects/:id/approvers/:area`, `PUT /projects/:id/approvers/protected/:approval`, `GET|POST /projects/:id/review-items` (the queue, or a send), `GET /projects/:id/review-items/:item`, `POST .../decision`, `POST /projects/:id/review-decisions` (a batch), `POST .../hand-on`, `POST .../withdraw`, `POST .../recommendation`, `GET .../file`, and uploads with `purpose: "review"`. Refusals use the slice 1 shape. | docs-review#who-can-do-this | test: `the review API` |
| AC-40 | Every page in this slice has no axe violations at WCAG 2.2 AA, works with the keyboard alone with a visible focus indicator, and has no horizontal scroll at 320 CSS pixels; tables become one labelled block per row at 320 pixels. Notices and error summaries take focus and lead the page title. Dialogs start focus on their heading, put the safe choice first, treat Escape as the safe choice and return focus to the control that opened them. | design-approvers, design-review-queue (Accessibility sections) | check: the end-to-end suite `slice 3 pages pass axe and keyboard checks`, run in CI |

## Roles and permissions

One new permission in `contracts/src/roles.ts`, `manage-gates` (naming approvers, delegates and holders), held by the Director and the Producer. It is not an approval, and its name keeps slice 1's check that no permission is one. Sending for review, **Sent by you**, **Everything waiting** and opening an item follow `open-project`. Deciding, handing on and the queue follow the person's approval assignments, not their roles.

## Scope

- In:
  - `contracts/`: the gate list and its labels (AC-1); `manage-gates`; request schemas for the endpoints of AC-39; the review file types and their error (AC-17); the length limits.
  - Database (Drizzle, generated migrations, UUIDv7 ids):
    - `approval_assignment` (project, slot, approver person, delegate person or none): one row per area and per protected approval. Working state.
    - `review_item` (id, project, hand-off, title, what changed, file, waiting hand-off or none, sent by, sent at, handed to, handed by): working state.
    - `review_decision` (id, item unique, decision accept, revise, reject or withdraw, feedback, by, at): a ledger with the grants of slice 2's ledgers.
    - `review_recommendation` (id, item, result, reason, at): working state.
    - `upload.purpose` (`work-sample` by default, or `review`) and `identifier_confirmation.review_item_id`.
    - The migration backfills AC-3's assignments for existing projects.
  - `web/src/record/`: commands set area approvers, set protected holder, send for review, decide (one or many), hand on, withdraw, add recommendation; start project seeds the assignments; remove person and set roles check AC-11; register upload handles the review purpose.
  - API (AC-39) and pages at the addresses of decision-navigation-and-urls, plus `/projects/<id>/review/waiting`, added to that decision.
  - The user pages `docs/user/people-and-roles.md` and `docs/user/activity.md` gain the slice 3 lines held back from PR #360.
- Out:
  - Agents and pipeline steps sending work (slices 7 and 11); AI checks that make recommendations (slice 11).
  - Alerts (slice 9), versions and compare (slice 4), the cross-project view (slice 4, story-review-and-status-what-needs-me).
  - A 3D viewer (the content layer).

## APIs and assumptions

- No new dependency. The PDF preview uses the browser's own viewer (`object type="application/pdf"`), with its fallback text where a browser has none.
- Two decisions at once: the decision command locks the item rows (`for update`) before it reads earlier decisions, so the second waits and finds the first; the unique index on `review_decision.item_id` refuses any row that slips past. Settled when the tests were written (AC-28's unit and end-to-end tests).

## Non-functional requirements

- Accessibility: AC-40 (WEB-001, WEB-002).
- Security: every route checks the session and the person's roles or assignments on the server (SEC-002); bodies are validated with `contracts/`; a file is served only to someone who can open the project, with `Content-Disposition: attachment` for types other than image, video, audio and PDF.
- Privacy: what changed and feedback never enter the activity log (AC-37).
- Migrations are generated and applied by the pipeline only (PG-001, PG-003).

## Delivery

- Plan item: design-architecture#build-order, slice 3.
- Pull requests: one, holding the failing tests first (recorded in `tests-commit`) and then the implementation and the tutorial.

## Risks and decisions

Choices the documents leave open are recorded in `docs/decisions/layer1-gates-and-queue.md`.

- Assignments are access control: a restore never touches them (decision-project-record-model). They are hard to change once projects rely on them, so the slot names are fixed in `contracts/`.
