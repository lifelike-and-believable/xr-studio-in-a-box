---
id: tutorial-layer1-gates-and-queue
status: draft
runner: manual
derived-from:
  - docs-approvers#see-who-approves-what: 91cd1cd3028f
  - docs-approvers#name-an-approver-and-a-delegate-for-an-area: e0c6ceae13dc
  - docs-approvers#name-the-holder-of-a-protected-approval: 5a9c1bcfe507
  - docs-approvers#removing-someone-who-approves: da8035c6b6a4
  - docs-approvers#if-something-goes-wrong: 049938a5f7fa
  - docs-review#send-work-for-review: 581b7cdcd5d4
  - docs-review#see-what-you-have-sent: 3d1805497e98
  - docs-review#see-everything-that-is-waiting: 386a5b787fcc
  - docs-review#clear-your-review-queue: ae12b606ef54
  - docs-review#decide-on-an-item: 0e33882d3059
  - docs-review#decide-on-several-items-at-once: c8aa8ff50c72
  - docs-review#hand-an-item-to-your-delegate: 3560c6b466ca
  - docs-review#if-something-goes-wrong: d4da1b19f200
  - docs-activity-log#read-a-projects-activity: 759961dac622
---

# Tutorial: name approvers, send work for review and decide on it

You are Jordan, the producer, who starts The Lantern Keeper. You name Morgan, the director, as approver for the creative work, with Sam, a technical artist, as delegate. Riley, an artist, sends work for review; Morgan and Sam decide on it; and you see what is waiting and what was recorded.

<!-- The runnable script is web/e2e/tutorial-review.spec.ts, which cites tutorial-layer1-gates-and-queue. -->

## Before you start

- A local copy of the repository with Node 26.13.1 and pnpm 12.18.0, and a disposable PostgreSQL database. Put `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in `web/.env` (see `.env.example`).
- Apply the migrations: `pnpm --filter @xr/web run db:migrate`.
- Build and start the app: `pnpm --filter @xr/web run build`, then start it with the settings `.env.example` lists set in `web/.env`: `pnpm --filter @xr/web exec next start -p 3000`, then open http://localhost:3000. Every page below is on that server.
- Your address is in `SIGN_IN_FIRST_ADDRESSES`. Sign-in and invitation links arrive as files in `MAIL_CAPTURE_DIR`.
- Three browsers or private windows besides your own, for Morgan, Riley and Sam, and a few small images (PNG).

Or run every step at once: `pnpm --filter @xr/web run e2e -- e2e/tutorial-review.spec.ts`.

## Steps

1. **Set up.** Sign in and start **The Lantern Keeper**. On **People**, add Morgan Ray as **Director**, Riley Chen as **Artist** and Sam Okafor as **Technical artist**. Open each one's invitation link in a browser of its own.
2. **See who approves what.** Select **Approvers**. Under **Areas**, you are the **Approver** of all four areas, and each **Delegate** is "None". Under **Protected approvals**, you are the **Holder** of all four.
3. **Name the Creative approver and delegate.** Select **Change** beside Creative. Choose Morgan Ray as **Approver** and Sam Okafor as **Delegate (optional)**, and select **Save Creative**: "Creative saved: Morgan Ray approves it, with Sam Okafor as delegate. Items already waiting in Creative now wait for them."
4. **Make a mistake, then name Performance and behaviour.** Select **Change** beside Performance and behaviour and choose Morgan Ray as both **Approver** and **Delegate (optional)**. Select **Save Performance and behaviour**: "Choose someone other than the approver as delegate, or No delegate." Choose **No delegate** and save again: "Performance and behaviour saved: Morgan Ray approves it, with no delegate. Items already waiting in Performance and behaviour now wait for them."
5. **Give Morgan a protected approval.** Select **Change** beside Publishing and marketing, choose Morgan Ray as **Holder**, and select **Save publishing and marketing**: "Publishing and marketing saved: Morgan Ray holds it."
6. **As Riley, send work for review.** In Riley's browser, open the project's **Review** tab and select **Send for review**. Type the **Title** `Lantern Keeper character sheet`, choose **Character design** under **Stage** (a line appears: "Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this."), say in **What changed** what is new, choose an image as the **File**, and choose **Mesh and rig** under **Is other work waiting on this decision?**. Select **Send for review**: **Sent by you** opens with "Sent for review: Lantern Keeper character sheet. It waits for Morgan Ray or Sam Okafor."
7. **Send a second item.** Send `Harbour at night, lighting pass` at **Environments**, with another image.
8. **See a number stopped.** Send `Prop list` at **Look and concept art**, with **What changed** `Catalogue number 046 454 286 added for the lantern.`. Nothing is sent: the summary quotes "046 454 286" as looking like a Social Insurance Number or a Business Number. Select **It is none of these**, type `A catalogue number` under **What is it?**, choose the image again and select **Send for review**: "Sent for review: Prop list. …"
9. **As Morgan, open the queue.** In Morgan's browser, open **Review**: "3 items waiting for your decision, 1 blocking." The groups are **Character design** first (it is blocking, with "Mesh and rig waits on this decision."), then **Environments**, then **Look and concept art**.
10. **Hand an item to Sam.** Select `Harbour at night, lighting pass`, then **Hand to Sam Okafor**: "Handed to Sam Okafor: Harbour at night, lighting pass. It shows in Sam's queue as handed to them. You can still decide it." Choose Sam Okafor under **Handed to** and select **Apply filters**: focus moves to "1 item waiting for your decision: handed to Sam Okafor."
11. **As Sam, accept it.** In Sam's browser, open **Review**, choose **Handed to you** under **Handed to** and select **Apply filters**. Open the item, type `Good. Keep the fog at this height.` under **Feedback for Riley Chen**, and select **Accept**: "Accepted: Harbour at night, lighting pass. Recorded as your decision at <time> on <date>. Riley Chen sees it under Sent by you."
12. **As Morgan, ask for a revision.** Open `Lantern Keeper character sheet`. **Waiting for** says "Morgan Ray, the Creative approver, or Sam Okafor, the delegate". Select **Request revision** with no feedback: "Write feedback for Riley Chen: say what to change." Type what to change and select **Request revision** again: "Revision requested: Lantern Keeper character sheet. …"
13. **Reject an item.** Open `Prop list` and select **Reject**. The dialog asks "Reject Prop list?", with **Go back** first. Type `Use the props from the brief.` under **Feedback (optional)** and select **Reject 1 item**: "Rejected: Prop list. …". The queue now says "Nothing is waiting for your decision".
14. **As Riley, read the decisions.** Open **Sent by you**. The harbour lighting is "Accepted by Sam Okafor, …" with Sam's feedback; the character sheet "Revision requested by Morgan Ray, …"; the prop list "Rejected by Morgan Ray, …". Select **Send a revised version** beside the character sheet: **Send for review** opens with the title, stage and **Mesh and rig** filled in. Say what changed, choose the file and send it. Then select **Withdraw** beside it: "Withdrawn: Lantern Keeper character sheet. It has left the queue of Morgan Ray and Sam Okafor. To send it again, use Send it again."
15. **Decide on several at once.** As Riley, send `Bell sounds, take 1` and `Bell sounds, take 2` at **Sound and music**. As Morgan, open **Review** and select **Accept all 2 in Sound and music**, then **Accept 2 items** in the dialog: "Accepted 2 items in Sound and music."
16. **See everything waiting.** As Riley, send `Licence for the harbour recordings` at **Contracts and licence terms**: it waits for you, the holder. In your own browser, open **Review** and select **Everything waiting**: the licence is listed with "You" under **Waiting for**.
17. **Try to remove Sam.** On **People**, select **Change roles or remove** beside Sam Okafor, then **Remove Sam Okafor from the project**: "Sam Okafor cannot be removed yet", with "Sam is the delegate for Creative. Give those to someone else on Approvers first, so that no item waits for a person who has left."
18. **Read the activity.** Open **Activity**, choose **Review** under **Area** and select **Apply filters**. The sends, the hand-on, each decision and the withdrawal are listed, for example "Sent Lantern Keeper character sheet for review (Character design)", "Handed Harbour at night, lighting pass to Sam Okafor" and "Withdrew Lantern Keeper character sheet". No feedback appears in them.

## What you made

Morgan approves the creative work with Sam as delegate, and holds the publishing and marketing approval. Work Riley sent waited at its gate until a person decided it, each decision is recorded with who made it and when, and the activity log shows every step. Next, see [Approvers](../user/approvers.md) and [Review](../user/review.md).

## Run record

The tutorial's runner is manual: its steps follow invitation emails and upload files in four browsers, which the web runner's step grammar cannot express. Its author walked it with a script instead. Run on 2026-11-13 against a local production build (`next start`) and PostgreSQL 16, by the script `web/e2e/tutorial-review.spec.ts`, which follows the steps above in order with the values given. Every step gave the result written in it; the run passed in 10.0 seconds. The same screens are also covered, one criterion each, by the slice's end-to-end tests, which passed in the same session with `pnpm verify`.
