---
id: story-shared-library-check-terms
status: approved
derived-from:
  - epic-shared-library#outcome: 0f9866061bcc
  - persona-collaborator#goals: 72c41c51284f
---

# Check a reused item's terms against the new project

As Robin, a collaborator, I want the terms I agreed for my work shown and checked whenever it is reused in a new project so that I can trust those terms hold, and that the pipeline refuses reuse that breaks them.

## Acceptance criteria

- Before a library item comes into a project (story-shared-library-bring-into-project), its original terms are shown beside the new project's policy record (story-provenance-and-policy-record-terms), to the person bringing it in, as far as their role allows, and in full to the new project's holder of the contracts and licence terms approval.
- Each original term, including limits on AI use, cultural protocols, rights and end dates, is checked against the new project's policy record and planned use. Each term shows a result: allowed, waiting for sign-off, or blocked. Blocked reuse is handled as in story-shared-library-block-reuse.
- Where an original term calls for Robin's sign-off, the reuse waits for Robin's decision on the limited page (story-provenance-and-policy-collaborator-sign-off).
- Parts derived from a performer's data come in only if that performer's confirmed agreement in the new project (story-session-recording-record-agreement) allows the use. Otherwise they are blocked.
- Once the item is in, its original terms are added to the new project's policy record for that item. The policy gate (story-provenance-and-policy-block-generation) checks them when the item is used in generation, and their end dates apply as in story-provenance-and-policy-record-terms.
- On the limited page, Robin can see which projects reuse the work Robin contributed, and nothing else in those projects.
