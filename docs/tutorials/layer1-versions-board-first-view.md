---
id: tutorial-layer1-versions-board-first-view
status: draft
runner: manual
derived-from:
  - docs-board#see-where-everything-stands: 9d6237da4331
  - docs-board#show-only-blocked-work: 06080b0b13f5
  - docs-board#when-things-change: aacd00b8f0c4
  - docs-board#how-work-gets-on-the-board: 865b9134cbcb
  - docs-versions-and-feedback#see-a-piece-of-work-and-its-feedback: b7e2d10a12b5
  - docs-versions-and-feedback#give-feedback-on-a-version: 884eb0a3610a
  - docs-versions-and-feedback#send-a-revised-version: bb4d7f109c99
  - docs-versions-and-feedback#compare-two-versions: 23c9eb871975
  - docs-versions-and-feedback#restore-an-earlier-version: b68968e83f0a
  - docs-what-needs-you#find-what-to-do-next: 808b191a578e
  - docs-what-needs-you#if-you-are-new-to-a-project: 16c45b6a1213
  - docs-what-needs-you#when-things-change: 6b30ef912722
  - docs-your-projects: b0b632ebac5e
---

# Tutorial: put work on the board, give feedback on versions, and see what needs you

You are Jordan, the producer of The Lantern Keeper. You give Drew, a sound designer new to the project, a first piece of work, and watch the board as Riley, an artist, sends a character sheet that the rig is waiting on. Morgan, the director, and Sam, the delegate, give feedback; Riley sends a revised version, compares the two and goes back to the first; and everyone starts from **What needs you**.

<!-- The runnable script is web/e2e/tutorial-board.spec.ts, which cites tutorial-layer1-versions-board-first-view. -->

## Before you start

- A local copy of the repository with Node 26.13.1 and pnpm 12.18.0, and a disposable PostgreSQL database. Put `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in `web/.env` (see `.env.example`).
- Apply the migrations: `pnpm --filter @xr/web run db:migrate`.
- Build and start the app: `pnpm --filter @xr/web run build`, then start it with the settings `.env.example` lists set in `web/.env`: `pnpm --filter @xr/web exec next start -p 3000`, then open http://localhost:3000. Every page below is on that server.
- Your address is in `SIGN_IN_FIRST_ADDRESSES`. Sign-in and invitation links arrive as files in `MAIL_CAPTURE_DIR`.
- Four browsers or private windows besides your own, for Morgan, Riley, Sam and Drew, and a few small images (PNG).

Or run every step at once: `pnpm --filter @xr/web run e2e -- e2e/tutorial-board.spec.ts`.

## Steps

1. **Set up.** Sign in and start **The Lantern Keeper**. On **People**, add Morgan Ray as **Director**, Riley Chen as **Artist** and Sam Okafor as **Technical artist**, and open each one's invitation link in a browser of its own: each lands on **What needs you**. On **Approvers**, select **Change** beside Creative and save Morgan Ray as **Approver** with Sam Okafor as **Delegate (optional)**.
2. **Open the board.** Select **Board**, after **Review**. It says "Nothing is on the board yet. Work joins it when someone sends it for review, or when a director or producer adds it with Add work." Every stage with a gate is listed under its area, each saying who decides it and "No work yet.", for example "Decided by: Morgan Ray, the Creative approver, with Sam Okafor as delegate. No work yet."
3. **Give Drew a first task.** On **People**, add Drew Patel as **Sound designer**. On the **Board**, select **Add work**. Type the **Title** `Harbour ambience`, choose **Sound and music** under **Stage** (a line appears: "Morgan Ray, the Creative approver, or Sam Okafor, the delegate, decides this."), choose **Drew Patel (invited, not signed in yet)** as **Owner** (Drew has not opened the invitation yet), and select **Add work**. The work's page opens with "Added Harbour ambience to Sound and music, owned by Drew Patel. It shows under What needs you for Drew."
4. **As Drew, find the first task.** Open Drew's invitation link in a fresh browser. **What needs you** opens: "1 thing needs you: 1 assigned to you." Under **Assigned to you**, "Sound and music, The Lantern Keeper" lists **Harbour ambience**, with "Next step: Make it, then send it for review from its page. Morgan Ray or Sam Okafor decides it at Sound and music." Below, **How work moves on The Lantern Keeper** is open: "You are a Sound designer on The Lantern Keeper.", with Sound and music decided by "Morgan Ray, the Creative approver, or Sam Okafor, the delegate". Select **Harbour ambience**: its page says "Make it, then send it for review. It does not move on until Morgan Ray or Sam Okafor accepts it." and has **Send for review**.
5. **As Riley, send work the rig waits on.** In Riley's browser, open **Review**, select **Send for review**, and send `Lantern Keeper character sheet` at **Character design**, with an image and **Mesh and rig** under **Is other work waiting on this decision?**.
6. **Put the rig on the board, and see it blocked.** In your browser, add the work `Lantern Keeper mesh and rig` at **Mesh and rig**, owned by Sam Okafor. Open the **Board**: "3 pieces of work: 1 blocked, 1 waiting for review, 1 in progress." Under **Mesh and rig**, the rig is **Blocked**: "Waits on Lantern Keeper character sheet (Character design), which is waiting for Morgan Ray or Sam Okafor. Not sent for review yet." Under **Character design**, the sheet is **Waiting for review**, with **Blocking** and "Mesh and rig waits on this decision." Select **Blocked work only**: "1 piece of work is blocked.", and only **Mesh and rig** is shown. Leave this page open.
7. **As Sam, give feedback on version 1.** In Sam's browser, open the **Board** and select `Lantern Keeper character sheet`. Under **Add feedback on version 1**, type `The long coat will catch on the lighthouse stairs.` and select **Add feedback**: "Feedback added." The entry is listed under **Feedback on version 1** with Sam's name and the time. The sheet is still waiting: feedback decides nothing.
8. **As Morgan, decide from What needs you.** In Morgan's browser, open **What needs you**. Under **For your decision**, "Character design, The Lantern Keeper" says "1 item, 1 blocking.", and the sheet has **Blocking** and "Mesh and rig waits on this decision." Open it: the page shows Sam's feedback beside the preview. Type `Shorten the coat, as Sam says.` under **Feedback for Riley Chen** and select **Request revision**.
9. **Watch the board change.** Back in your browser, the blocked-only board changes without a reload (within 15 seconds): the rig's row shows **Changed** with the time and is now **In progress**, and the line above says "Updated <time>: Lantern Keeper mesh and rig is now In progress."
10. **As Riley, send a revised version.** In Riley's browser, open **What needs you**. Under **Returned to you**, the sheet says "Version 1: revision requested by Morgan Ray, …" and quotes "Morgan Ray: Shorten the coat, as Sam says." Open it and select **Send a revised version**. The form shows **Work**, **Stage** "Character design (Creative)", **This will be** "Version 2", who decides it, and "Morgan Ray asked, on version 1:" with the feedback; **Is other work waiting on this decision?** is **Mesh and rig** already. Type in **What changed** `Coat shortened to the knee.`, choose an image and select **Send for review**: "Sent for review: Lantern Keeper character sheet, version 2. It waits for Morgan Ray or Sam Okafor."
11. **As Morgan, review version 2.** Open the sheet from **What needs you**. It says "Version 2 of 2." with **See every version and compare**, and **Version 1** shows "Revision requested by Morgan Ray, …: "Shorten the coat, as Sam says."". Type `The long coat read better from the back rows. Go back to version 1.` and select **Request revision**.
12. **As Riley, compare and restore.** Open the sheet's page and select **Compare versions**: version 1 and version 2 are side by side, each with its file, who sent it, what changed, and its decision and feedback. Under version 1, select **Restore version 1**. The dialog asks "Restore version 1 of Lantern Keeper character sheet?" and says "Version 1's file is sent for review again as version 3, at Character design. It waits for Morgan Ray or Sam Okafor. Version 2 is kept, with its feedback." **What changed** says "Restored version 1."; add ` Morgan asked for the long coat.` and select **Restore version 1**: "Restored version 1 as version 3. It waits for Morgan Ray or Sam Okafor. Versions 1 and 2 are kept, with their feedback." **Versions** lists all three, and version 3 shows **Restored from** "Version 1".
13. **As Morgan, accept version 3.** Open the sheet and select **Accept**. On your **Board** (select **All work**), the sheet is **Done**: "Version 3: accepted by Morgan Ray, …".
14. **Change an owner, and remove work added by mistake.** Add the work `Harbour children character sheet` at **Character design**, owned by Sam Okafor. On its page choose Riley Chen under **Owner** and select **Change owner**: "Riley Chen now owns Harbour children character sheet. It shows under What needs you for Riley." Then select **Remove Harbour children character sheet**; the dialog asks "Remove Harbour children character sheet from the board?", with **Go back** first. Select **Remove Harbour children character sheet**: the board shows "Removed Harbour children character sheet from the board."
15. **Read the activity.** Open **Activity**, choose **Review** under **Area** and select **Apply filters**. Among the entries are "Added work Harbour ambience (Sound and music) for Drew Patel", "Added feedback on Lantern Keeper character sheet, version 1", "Restored Lantern Keeper character sheet version 1 as version 3", "Changed the owner of Harbour children character sheet to Riley Chen" and "Removed work Harbour children character sheet". No feedback text appears in them.

## What you made

The Lantern Keeper's board shows every stage, who decides it and where each piece of work stands, and changes by itself as work moves. The character sheet has three versions with their feedback, and the restored one passed the gate. Drew found the first task without help, and everyone else started from what needed them. Next, see [Board](../user/board/board.md), [Versions and feedback](../user/board/versions-and-feedback.md) and [What needs you](../user/what-needs-you/what-needs-you.md).

## The first-task test, for the lead

design-what-needs-you asks for a moderated test with someone new to the pipeline before the story is accepted. An agent cannot stand in for that person, so it is set up here for you to run (see `docs/decisions/feature-layer1-versions-board-first-view.md`, item 1).

1. Make steps 1 to 3 above with a person who has never seen XR Studio as Drew, using their own address.
2. Give them the link from their invitation email and the task "Find the first piece of work you need to do, and say who must approve it." Give no hints.
3. The bar: within two minutes of signing in, they name **Harbour ambience** and Morgan Ray (or Sam Okafor), and say what they would select to hand it in (**Send for review**).
4. Run it a second time with someone new and nothing assigned (skip step 3). The bar: they say they would ask the producer or director for work, and name the stage they work in (Sound and music).

If either bar is missed, note what they tried; the wording changes before story-review-and-status-what-needs-me is accepted.

## Run record

The tutorial's runner is manual: its steps follow invitation emails and upload files in five browsers, which the web runner's step grammar cannot express. Its author walked it with a script instead. Run on 2026-11-13 against a local production build (`next start`) and PostgreSQL 16, by the script `web/e2e/tutorial-board.spec.ts`, which follows the steps above in order with the values given; step 9 asks the board to check at once (as returning to the tab does) rather than waiting up to 15 seconds. Every step gave the result written in it; the run passed in 10.0 seconds. The same screens are also covered, one criterion each, by the slice's end-to-end tests. The first-task test above was not run: it needs a person new to the pipeline.
