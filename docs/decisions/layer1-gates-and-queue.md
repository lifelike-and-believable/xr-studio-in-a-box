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
