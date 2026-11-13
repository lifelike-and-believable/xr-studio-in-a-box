---
id: design-review-queue
status: approved
derived-from:
  - story-review-and-status-hold-gated-hand-off#acceptance-criteria: a7373f33f9bf
  - story-review-and-status-see-review-queue#acceptance-criteria: 0cf0b45ffc70
  - story-review-and-status-decide-on-items#acceptance-criteria: 09f7ac5e0805
  - persona-director#goals: a92ca172be83
  - persona-director#frustrations: 3721421a3614
  - persona-artist#goals: 0767918db571
  - design-approvers: 983b149cfa2a
  - design-identifier-filter: 069c84a56674
  - decision-navigation-and-urls#decision: 0efbb1ac8df4
---

# Review queue design

Work that waits at a gate, the queue its approver clears it from, and the decisions they make (story-review-and-status-hold-gated-hand-off, story-review-and-status-see-review-queue, story-review-and-status-decide-on-items). Who decides each item comes from design-approvers.

In slice 3 a person puts work at a gate with **Send for review**: a title, the stage, what changed and a file `[proposed]`. Agents and pipeline steps put items at gates through the same command from slice 7 and slice 11, and their items look the same. AI recommendations on items arrive with the first checks (slice 11); the page is designed for them now.

## Personas

- persona-director: Morgan clears every pending approval from one list, readable at a glance and batched, so review stops being the pipeline's limit (goals; frustrations: a slow or unclear queue stops everything). Blocking items come first. A group can be accepted in one step.
- persona-artist: Riley sends work for review, sees who it is waiting for, and reads the reviewer's feedback in one place (goals: know what is waiting and what the reviewer said).
- persona-producer: Jordan, as holder of the contracts and licence terms approval, decides items at that hand-off, and nobody else can.

## Flow

### Send work for review

1. On a project, the **Review** tab sits after **Overview**. Everyone on the project who uses the dashboard can open it. It has **Send for review**, **Sent by you** and **Everything waiting** at the top.
2. **Send for review** opens a form: **Title**, **Stage** (the stages that need someone's approval, which are the gated hand-offs, grouped by area), **What changed**, **File**, and **Is other work waiting on this decision? (optional)**, which lists the same stages with **Nothing is waiting** first.
3. Once a stage is chosen, a line under it says who decides: "Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this." For a protected hand-off it names the holder only.
4. **Send for review** puts the item at the gate. **Sent by you** opens with a notice: "Sent for review: Ferry pilot character sheet. It waits for Morgan Ray or Sam Okafor."
5. Only gated hand-offs are offered, without the three Builds and operations hand-offs: builds reach their gates from the build pipeline (Layer 5), not by hand. They stay in **Is other work waiting on this decision?**, since a build can wait on another decision. Work at a hand-off that is not on the gate list does not wait for anyone, so there is nothing to send.

### See the queue

1. A person who approves an area, is its delegate, or holds a protected approval sees, under **Review**, every item waiting for their decision on this project, and only those. A Creative approver sees Creative items; items at a protected hand-off appear only for its holder.
2. Items are grouped by the gate they are held at (the stage), with the area beside each group heading. Groups with a blocking item come first, ordered by their oldest blocking item; then the other groups, by their oldest item. Inside a group, blocking items come first, then the rest, oldest first.
3. Each item shows a preview, its title (a link to the item), **Stage**, **Requested by** (with the date and time), and **What changed**. A blocking item shows the **Blocking** tag and "<stage> waits on this decision." An item handed to the delegate shows **Handed to <name>**. An AI recommendation is shown in its own dashed box headed **AI recommendation, not a decision**.
4. A line above the groups counts them: "5 items waiting for your decision, 1 blocking."
5. Filters: **Area** (**All areas** and the areas the person decides in) and **Handed to** (**Anyone**, **Not handed on**, each delegate of an area the person approves, and **Handed to you** for a delegate). **Apply filters** reloads the page; focus moves to the result line and the page title starts with it. **Clear filters** shows everything again.

### Decide

1. Opening an item shows a large preview, **Open the file**, its details, **Waiting for** (who can decide it), and any blocking note and AI recommendation.
2. Under **Your decision**: **Feedback for <requester> (needed to request a revision)**, then **Accept**, **Request revision** and **Reject**. Feedback is optional for accepting and rejecting, and required for a revision. Whatever feedback is given, the requester sees it with the decision.
3. **Accept** and **Request revision** act at once, with no confirmation, so that review stays quick (approver's decision, 2026-11-13). **Reject** asks for confirmation first, because a rejected item does not move on: the same confirmation as for several items, with optional feedback `[proposed]`.
4. The approver of an area that has a delegate also sees **Hand to <delegate>**. It marks the item as handed to them, and the queue opens with a notice: "Handed to Sam Okafor: Harbour at night, lighting pass. It shows in Sam's queue as handed to them. You can still decide it." Either of them can still decide it.
5. A person who can decide an item they sent themselves may decide it, so one person can run a production alone (story-project-record-name-approvers).
6. After a decision, **Review** opens with a notice, focus on it: "Accepted: Lantern Keeper character sheet. Recorded as your decision at 14:20 on 13 November. Riley Chen sees it under Sent by you." The item has left the queue.
7. Several at once: tick items and choose **Accept selected**, **Request revision for selected** or **Reject selected**; or, on a group with two or more items, **Accept all <n> in <stage>**. A confirmation lists the items. A batch rejection takes optional **Feedback**; a batch revision request asks for one **Feedback**, which each requester sees with their item. The notice counts the decisions: "Accepted 2 items in Character design."
8. A decision is final. It is recorded with who made it and when, and cannot be changed afterwards. To try again after a revision or a rejection, the requester sends the work again.

### See your requests

1. **Sent by you** lists what the person has sent, newest first: the item, its stage, when it was sent, and its status.
2. Status is one of: "Waiting for <approver> or <delegate> (delegate)" (or the holder, for a protected approval); "Accepted by <name>, <date and time>"; "Revision requested by <name>, <date and time>" with **Send a revised version**; "Rejected by <name>, <date and time>" with **Send it again**. Any feedback is shown under the status.
3. While an item waits, its sender sees **Withdraw** beside it in **Sent by you** and on the item's page (approver's decision, 2026-11-13). It acts at once, with no confirmation, since the work can be sent again: the item leaves the queue, its status becomes "Withdrawn by you, <date and time>" with **Send it again**, and **Sent by you** opens with a notice: "Withdrawn: Ferry pilot character sheet. It has left the queue of Morgan Ray and Sam Okafor. To send it again, use Send it again." A sent item cannot be edited; to correct one, withdraw it and send it again.
4. **Send a revised version** and **Send it again** open **Send for review** with the title, stage and blocking choice filled in. Linking the new item to the old one as a version comes with story-review-and-status-feedback-and-versions (slice 4).

### See everything waiting

1. **Everything waiting** lists every item held at a gate on the project, oldest first, with its stage, who sent it and when, a **Blocking** tag where it applies, and **Waiting for**: the person or people who can decide it, "<name> (handed on by <approver>)", or "You". Everyone on the project who uses the dashboard can open it, and open each item read only (story-review-and-status-hold-gated-hand-off: the status of held work shows who it is waiting for).
2. Only the people named under **Waiting for** see decision controls on the item.

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| Queue, as Morgan | ![Review queue](review-queue/queue.png) | Phone: ![Queue at 320px](review-queue/queue-phone.png). One blocking item; one with an AI recommendation; one handed on. |
| Queue after a decision | ![Accepted](review-queue/queue-decided.png) | Focus on the notice. |
| Queue filtered by Handed to | ![Filtered](review-queue/queue-filtered.png) | Focus on the result line. |
| Queue, nothing waiting | ![Empty](review-queue/queue-empty.png) | |
| Review, as someone who approves nothing | ![Not an approver](review-queue/queue-not-approver.png) | |
| One item, as its approver | ![Item](review-queue/item.png) | Phone: ![Item at 320px](review-queue/item-phone.png) |
| Request revision with no feedback | ![Feedback needed](review-queue/item-revision-error.png) | Focus on the summary. |
| Decided by someone else meanwhile | ![Not recorded](review-queue/item-conflict.png) | |
| One item, as the person who sent it | ![Item, requester](review-queue/item-requester.png) | No decision controls; **Withdraw**. |
| An item at a protected hand-off, as its holder | ![Protected item](review-queue/item-protected.png) | No **Hand to**. |
| Queue after Hand to | ![Handed to Sam Okafor](review-queue/queue-handed.png) | Focus on the notice. |
| Reject one item or a selection, confirmation | ![Reject 2 items?](review-queue/batch-reject.png) | Feedback optional. |
| Everything waiting, as Jordan | ![Everything waiting](review-queue/waiting.png) | Phone: ![At 320px](review-queue/waiting-phone.png). Read only. |
| Accept a group or a selection, confirmation | ![Accept 2 items?](review-queue/batch-accept.png) | Phone: ![At 320px](review-queue/batch-accept-phone.png) |
| Request revision for a selection | ![Request a revision of 2 items?](review-queue/batch-revise.png) | One feedback for all. |
| Send for review | ![Send for review](review-queue/send.png) | Phone: ![At 320px](review-queue/send-phone.png) |
| Send for review, nothing filled in | ![Not sent](review-queue/send-errors.png) | Phone: ![At 320px](review-queue/send-errors-phone.png) |
| Sent by you | ![Sent by you](review-queue/sent.png) | Phone: ![At 320px](review-queue/sent-phone.png). One status of each kind, and **Withdraw** on waiting items. |
| Sent by you, after Withdraw | ![Withdrawn](review-queue/sent-withdrawn.png) | Focus on the notice. |

## Layout

- **Review** is a project tab after **Overview**. The queue is per project, like every tab (decision-navigation-and-urls); a person's items across all their projects come with "What needs you" in slice 4 (story-review-and-status-what-needs-me).
- An item in the queue is a row: a checkbox, a preview 120 pixels wide, then its details. At 320 pixels the preview sits above the details and each label sits above its value.
- Previews: an image is shown scaled down; a video shows its first frame and audio its file name, with a player on the item page; a PDF shows its first page; a Word document shows its file name and page count. **Open the file** opens the file itself.
- Control names: **Withdraw**, **Review**, **Send for review**, **Sent by you**, **Everything waiting**, **Send it again**, **Reject <n> items**, **Handed to you**, **Waiting for**, **Title**, **Stage**, **What changed**, **File**, **Is other work waiting on this decision?**, **Nothing is waiting**, **Cancel**, **Area**, **All areas**, **Handed to**, **Anyone**, **Not handed on**, **Apply filters**, **Clear filters**, **Accept selected**, **Request revision for selected**, **Reject selected**, **Accept all <n> in <stage>**, **Accept**, **Request revision**, **Reject**, **Feedback for <requester>**, **Hand to <delegate>**, **Open the file**, **Go back**, **Accept <n> items**, **Request revision of <n> items**, **Feedback**, **Back to Review**, **Send a revised version**, **Blocking**, **Handed to <name>**, **AI recommendation, not a decision**.

## States and errors

- **Send for review, fields missing:** "Enter a title.", "Choose the stage this work is at.", "Say what changed.", "Choose a file to send." in an error summary that takes focus; everything typed is kept, except the file, which has to be chosen again.
- **Lengths:** **Title** at most 120 characters, **What changed** and feedback at most 2,000 (approver's decision, 2026-11-13). Longer text is refused, not cut: "Keep the title to 120 characters or fewer." and the same wording for the others.
- **Identifiers:** **Title**, **What changed** and feedback can be read by agents, so they are checked against the organisation's identifier formats before anything is saved, with the same error and **It is not a <format>** confirmation as facts (design-identifier-filter). A PDF or Word file is checked as a work sample is: a matching file is held, not sent, with the same held notice, the same **It is not a <format>, add <file>** confirmation and the same 24-hour deletion.
- **A document that really holds bank details or a tax number,** such as a signed contract or a funding report: until the protected store arrives (story-contracts-and-payment-protect-sensitive-data), it cannot be sent, and the held notice says to send a copy with those numbers removed and keep the original outside XR Studio, as design-identifier-filter advises for facts (approver's decision, 2026-11-13).
- **File types:** those of work samples plus 3D models (.glb, .gltf, .fbx, .usdz) `[proposed]`, so mesh, rig, environment and effects work can be sent as itself rather than a screenshot. A model shows its file name in the preview, with **Open the file**; a 3D viewer comes with the content layer. Any other type: "Choose a video, image, audio, PDF, Word or 3D model file." Builds are not sent by hand; they reach their gates from the build pipeline (Layer 5).
- **Request revision with no feedback:** "Write feedback for <requester>: say what to change." Nothing is recorded. In the batch dialog: "Write the feedback each requester will see."
- **Nothing selected:** "Select at least one item." above the batch buttons, with focus moved to it.
- **Decided by someone else while open** (the approver and the delegate both acting): the second decision is not recorded. "Your decision was not recorded: Sam Okafor accepted this item at 14:18 on 13 November, while you had it open. It has left your queue." with **Back to Review**. In a batch, the items still waiting are decided and the notice names the ones that were not.
- **Approver changed while an item waits:** it now waits for the new approver (design-approvers); a person who can no longer decide it no longer sees it in their queue, and can still open it read only, like everyone on the project.
- **Withdrawn while open:** an approver who decides an item its sender has just withdrawn sees "Your decision was not recorded: Riley Chen withdrew this item at 09:05 on 13 November." with **Back to Review**. A sender who withdraws an item just decided sees "Not withdrawn: Morgan Ray accepted it at 09:04 on 13 November."
- **Nothing waiting:** "Nothing is waiting for your decision", and that items appear when someone sends work at a hand-off they approve.
- **Not an approver:** "You do not approve any area on this project, so nothing waits for your decision here.", with a link to **Approvers**.
- **Sent by you, nothing sent:** "You have not sent anything for review on this project."
- **Agents:** an agent cannot accept, request revision, reject or hand on; the command layer refuses it. An agent's recommendation is shown only in the **AI recommendation, not a decision** box, and nothing in the record treats it as a decision.
- **Who can open an item:** everyone on the project who uses the dashboard, read only; only the people it waits for can decide it.
- **Approvers and delegates not signed in yet:** the lists on **Approvers** mark them "(invited, not signed in yet)", so Morgan can see an item may wait for someone who has not started.

## How it works

- **How does the system know?**
  - Who an item waits for is worked out on each page load from its stage and the current assignments (design-approvers). "Waiting for" and the queue therefore follow a change of approver at once.
  - An item is blocking when its requester said a stage waits on it. In slice 3 that is the only source, so an item whose requester did not say is not marked; the status board (slice 4) also marks items that stages on the board wait on. `[proposed]`
  - Decisions are entries in the append-only approvals ledger (decision-project-record-model), with the person, the time, the decision and any feedback. An item's state comes from that ledger, so it survives a reload, another device and a restore.
- **What enforces each promise?**
  - "Gated work does not move on until the named person or their delegate accepts it": an item's state changes only through a decision command, which checks on the server that the person can decide it now. A test tries to decide as someone else, and as an agent session.
  - "Work at a hand-off not on the gate list moves on without waiting": the gate list lives in `contracts/`. The command that hands work on checks it; a hand-off not on the list is recorded as moved on with no item made. A test hands on a build for rehearsal. In slice 3 nothing in the dashboard does that, so this is checked by the command test only.
  - "An AI recommendation cannot pass the gate": a recommendation is a separate record linked to the item. No command turns it into a decision, and decisions accept only person principals. A test.
  - "The queue shows only items Morgan can approve": the queue is built on the server from the person's own assignments. A test signs in as each assignment holder and as someone with none.
  - "A decision leaves the queue at once and is recorded with who and when": the decision and the item's new state are written in one transaction, and the page is drawn after it. A test decides and reloads.
  - Two people deciding at once: the decision command takes the item's current state with it and refuses if it has changed. A test.
  - Every send, hand-on and decision is logged in **Activity**, in a new area **Review**: "Sent Lantern Keeper character sheet for review (Character design)", "Handed Harbour at night, lighting pass to Sam Okafor", "Accepted Lantern Keeper character sheet", "Requested a revision of Lighthouse concept, second pass", "Rejected Lighthouse concept", "Withdrew Ferry pilot character sheet". Feedback is never copied into the log.
- **What is published together?** Not applicable.

## Accessibility

- Each item's checkbox is labelled "Select <title>". The batch buttons sit in a group labelled **With the items you select**.
- Groups are sections labelled by their heading. The **Blocking** tag is text, not colour, and the AI recommendation is marked by its heading as well as its dashed border.
- Previews have a text alternative naming the file.
- Notices and the filter result line take focus on load, and the page title starts with them. Errors use an error summary that takes focus.
- The confirmations are modal dialogs: focus starts on the heading, **Go back** comes first, Escape closes them as **Go back**, and focus returns to the button that opened them.
- The line under **Stage** that says who decides is a polite live region, present and empty from page load.
- Targets are at least 44 by 44 pixels (checkboxes 24 pixels, inside a 44-pixel row). No horizontal scrolling at 320 pixels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations.

## Open items

- Comparing an item with an earlier version, and written feedback threads: story-review-and-status-feedback-and-versions, slice 4.
- Email and badge alerts when something waits: story-review-and-status-notifications, slice 9. Until then people check **Review**.
- Stage-specific previews such as rigs and levels arrive with the content layer (epic-review-and-status, out of scope).
