---
id: story-character-path-own-tool-generated-work
status: approved
derived-from:
  - epic-character-path#outcome: ea093b262bb3
  - persona-artist#goals: 0767918db571
---

# Bring in work I generated in my own tool

As Riley, the artist, I want to bring in work I generated directly in a tool I chose, with the tool declared and checked, so that I keep working in my chosen tools and bring the results back without agents redoing them.

## Acceptance criteria

- Riley can bring in work generated in a tool Riley uses directly, such as Higgsfield or Tripo, outside the pipeline's agents, through the same import as hand-made work (story-character-path-hand-made-work). Riley declares the tool, its version, the account or licence it was made under, and what was used as input, such as a reference image. The import shows in text any declaration that is missing, and the work cannot enter until it is complete.
- Before the work enters, it is checked against the policy record as a generation request would be (story-provenance-and-policy-block-generation). A tool or input that breaks a recorded term is refused, and the term is named. Where a term needs a collaborator's sign-off, the work waits for it.
- The work then passes the quality and licence gate (story-provenance-and-policy-quality-and-licence-gate), which records the tool's licence terms for the output. Work whose licence status is unknown is held out of the project.
- The provenance record (story-provenance-and-policy-provenance-record) shows that AI was used, the tool and its version, that Riley generated the work, and any change Riley made by hand afterwards as a separate part. It is never shown as made with no AI.
- An agent cannot make or change Riley's declaration, and does not regenerate the work. The story is tested with one generated image, one generated mesh, and one import whose tool breaks a recorded term.
