---
id: story-asset-checks-check-provenance
status: approved
derived-from:
  - epic-asset-checks#outcome: 85507973a80b
  - persona-artist#goals: 0767918db571
---

# Check that provenance is complete

As Riley, the artist, I want every asset's provenance record checked before review so that I can see that credit and provenance record the work I did by hand.

## Acceptance criteria

- Before an asset goes to review, its provenance record (story-provenance-and-policy-provenance-record) is checked for every item that story lists. A missing item fails the check, and the result names it.
- For a generated asset, the check also needs the tool's licence terms on the date of use and the reference inputs with their owners and terms. This is the provenance and licence check that story-provenance-and-policy-quality-and-licence-gate runs before the asset enters the project.
- Hand-made work, and a person's changes after generation, must name the person who did the work. Riley is named in the record of each asset Riley made or changed.
- An asset derived from a performer's data must name the performer (REQ-governance-9).
- The check result shows whether prompts and reference inputs are present, without showing their content to anyone whose role does not allow it.
- An agent can fill in what a tool reports, but cannot mark a failed provenance check as passed, or enter who approved an asset or the terms in force.
