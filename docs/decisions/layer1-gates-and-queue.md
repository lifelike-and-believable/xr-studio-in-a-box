# Decisions made while delivering layer1-gates-and-queue

Choices the approved user documentation and designs left open, made during delivery. Each takes the most conservative reading.

## Pages and wording the documents do not give

1. **Everything waiting has its own address**, `/projects/<id>/review/waiting`, added to decision-navigation-and-urls beside the other review pages, because the design added the page after the addresses were set.
2. **Rejecting one item** opens a dialog headed "Reject <title>?" with **Go back** and **Reject 1 item**, and an optional **Feedback** filled from the page's feedback box. The design says only "the same confirmation as for several items".
3. **Notices the documents do not word:** after a revision request, "Revision requested: <title>. ..."; after a rejection, "Rejected: <title>. ..."; after a batch, "Revision requested for <n> items." and "Rejected <n> items."; when some items in a batch were decided by someone else first, " Not recorded for <titles>: decided by someone else first."; an approver's saved notice with no delegate, "..., with no delegate."; the read-only line on **Approvers**, "Directors and producers can change approvers. On this project: <names>.".
4. **The conflict message** names the other person's decision: "<name> accepted this item", "<name> asked for a revision of this item", "<name> rejected this item", or "<name> withdrew this item".
5. **First names** in "Only Jordan can decide this", "Keep Sam" and "Sam's queue" are the first word of the person's name, or their email address when they have no name.
6. **Text that looks like an identifier** in **Title**, **What changed** or feedback is confirmed in the same form: **It is not a <format>** shows **What is it?** under the summary, and sending again records the confirmation. Facts use a separate confirm page; the review form keeps the file the person chose, which a page change would lose.
7. **A held review file** is shown on **Send for review** with the documentation's held notice, **It is not a <format>, add <file>** and the 24-hour deletion; once confirmed, the form can be sent.

## Records and rules

8. **Who can withdraw:** only the person who sent the item.
9. **Builds and operations hand-offs** are not offered under **Stage** in the dashboard, but the API accepts them, so the build pipeline can send them later (design-review-queue, file types).
10. **A hand-off that is not gated** is accepted only by the API, which answers that the work moved on and logs it. The dashboard never offers one.
11. **AI recommendations** are added only by an agent-session principal. Nothing in slice 3 makes one; the tests add one through the command layer to show it never passes a gate.
12. **.gltf files** are JSON text, so their text is checked for identifiers like a PDF's or Word document's. .glb, .fbx and .usdz are binary and are not.
13. **The PDF preview** uses the browser's own PDF viewer in an `object` element, with "<file>, PDF" as its fallback. Rendering a page to an image would need a canvas library.
14. **Sending for review** is refused for agent sessions in slice 3, as the documentation says agents send work from a later release.

## Found while delivering

15. **Sign-in links stopped working after 120 checks from one address.** The auth library resets a path's rate-limit count only after a whole minute with no requests to it, so its limit of 120 on checking sign-in links was a lifetime cap for any address that signs someone in at least once a minute: a studio behind one address would be locked out. The full end-to-end suite reached it once slice 3's tests were added. Checking a link is no longer limited (the links are single use and about 190 bits long); sending links still is. A separate commit with `Change: fix` and its own test, `sign-in links keep working after many have been checked from one address`. It is outside slice 3, so the approver may prefer it as its own pull request.
16. **`process / change` is red because of three commit messages.** `310f436`, `cb27424` and `6a5df62` end with `Change: fix`, written for the random test failure and the sign-in limit. The check reads any such line as declaring the whole pull request a fix, and a fix may add no source file. Without those lines the pull request is a feature with an approved spec and the check passes. Rewording them needs a history rewrite and a force push, which the approver allowed in the session, but the project's own guard stops an agent from rewriting history. So the approver either rewords the three commits themselves (`git rebase -i origin/main`, reword those three, `git push --force-with-lease`, then update `tests-commit` in the spec to the new hash of "Add failing tests for slice 3"), or merges with `process / change` overridden.
17. **Delivered as one commit.** At the approver's request (2026-11-13), the work was moved to a new branch, `claude/gifted-meitner-slice3`, as a single commit with the same files, so that `process / change` passes without rewriting the original branch. The step-by-step history stays on `claude/gifted-meitner-pr2jry` (pull request #361): the spec (`a56e811`), the failing tests (`32925eb`, the spec's `tests-commit`), the implementation and the tutorial, in that order.
