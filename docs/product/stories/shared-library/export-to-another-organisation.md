---
id: story-shared-library-export-to-another-organisation
status: approved
derived-from:
  - epic-shared-library#outcome: 0f9866061bcc
  - persona-collaborator#goals: 72c41c51284f
---

# Share an item with another organisation by export

As Robin, a collaborator, I want an item shared with another organisation only by an export that carries my terms so that I can trust those terms hold outside the organisation I agreed them with.

## Acceptance criteria

- A project cannot bring in another organisation's library item directly (story-shared-library-save-to-library). Sharing between organisations is only by export.
- An item is exported from a project that uses it, and only by the person who holds that project's contracts and licence terms approval. An agent cannot export.
- An export carries the item's provenance record and all its original terms, with their end dates and any sign-off they call for. Prompts and reference inputs are left out unless the exporter includes them and the terms allow it.
- A term that does not allow sharing outside the organisation blocks the export, and the exporter is told which term, as in story-shared-library-block-reuse.
- In the receiving organisation, only the person who holds a project's contracts and licence terms approval can import the item, which adds it to that organisation's library with its terms. Bringing it into any project there runs the terms check (story-shared-library-check-terms).
- Each export and import appears in that organisation's activity log, and Robin can see on the limited page which organisations the work Robin contributed was exported to.
