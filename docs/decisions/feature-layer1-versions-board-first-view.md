# Decisions made while delivering layer1-versions-board-first-view

Choices the approved user documentation, designs and mock-ups left open, made during delivery. Each takes the most conservative reading.

## For the lead's validation

1. **The first-task test needs a person.** design-what-needs-you choice 10 asks for a moderated test with someone new to the pipeline: a new account with the Sound designer role, one piece of work (**Harbour ambience**) added for them with **Add work**, and the task "Find the first piece of work you need to do, and say who must approve it." The bar is that they name **Harbour ambience** and Morgan Ray (or Sam Okafor) within two minutes of signing in, with no hints, and say what they would select to hand it in; then, with nothing assigned, that they would ask the producer or director for work and name the stage they work in. An agent cannot stand in for that person, so the test is not run here. The tutorial's last section sets up both cases so the lead can run it with someone before approving the tutorial; if the person cannot meet the bar, the wording changes before story-review-and-status-what-needs-me is accepted.

## Addresses and landing

2. **Projects moves to `/projects`**, its address in decision-navigation-and-urls. `/` sends a person on at least one project (with a role that uses the dashboard) to **What needs you**, and shows **Projects** to anyone else, so slice 1's landing is unchanged for a person on no project.
3. **Sending a version from a work's page returns to the work's page** with the notice, since that is where the person came from. Sending new work from **Review** still opens **Sent by you**, as in slice 3.

## User documentation changed with this delivery

4. **`docs/user/review.md`** ("Send a revised version") now says the new item is the work's next version, and that **Send for review** opens with the stage fixed. Because the stage is fixed, the sentence "To correct the stage, the file or the text, withdraw it and send it again" now says to send it as new work from **Send for review** to correct the stage.
5. **`docs/user/your-projects.md`** now says people land on **What needs you**, or on **Projects** when on no project, that **XR Studio** returns to **What needs you**, and that the header has **What needs you**. The specs and tutorials linked to those sections were rehashed.

## Wording the documents do not give

6. **A send while a version waits** is refused with "Not sent: version <n> of <title> is waiting for review. Withdraw it first."; the form only offers sending when nothing waits, so this is reached only by two sends at once or by the API.
7. **Sent by you** shows **Send a revised version** and **Send it again** only on the latest version of a piece of work; an older item's work already has a newer version.
8. **Board status line** for changes that are not a change of state: "<title> changed." (a new owner or version), "<title> was added." and "<title> was removed." Removed work leaves the board at the update.
9. **What needs you status line**: new items are counted per section ("1 new item returned to you."); items that left are counted by what happened ("1 item accepted.", "1 item rejected.", "1 item withdrawn.", "1 item sent for review."), and anything else as "1 item no longer needs you.".
10. **Your stages**: "You are the Director" and "the Producer", "a/an <role>" for other roles, roles joined with "and". The closing line names the project's producers; with none, its directors ("ask the project's director, <name>."). The viewer appears as "You, the <Area> approver", "You, the delegate" or "You, who hold its protected approval".
11. **New to a project** means the person has sent nothing for review on it. "Nothing is assigned to you yet" names the producers and directors; a person who is both is named once, as "the project's producer and director, <name>".
12. **A blocked piece of work with a version waiting** shows the blocking line followed by the line it would otherwise have ("Waiting for Morgan Ray or Sam Okafor."), as the mock-up does for work not sent yet.
13. **Sending a version** is logged as slice 3 logs a send, "Sent <title> for review (<stage>)"; the activity lines the design gives for slice 4 are added beside it.

## Records and rules

14. **Restoring a PDF or Word file that now matches an identifier format.** The file is already stored, so nothing is uploaded and nothing is deleted after 24 hours. The restore is refused with the held notice, and **It is not a <format>, add <file>** asks **What is it?** in the same dialog; restoring with the answer records the confirmation against the new item.
15. **Waiting for others** lists every waiting version the person sent, even at a gate they also decide; such an item is in both lists.
