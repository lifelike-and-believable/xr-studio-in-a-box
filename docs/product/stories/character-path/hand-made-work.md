---
id: story-character-path-hand-made-work
status: approved
derived-from:
  - epic-character-path#outcome: ea093b262bb3
  - persona-artist#goals: 0767918db571
---

# Bring hand-made work into the character path

As Riley, the artist, I want to bring a character or part I made by hand into the path so that I keep working in my chosen tools and bring the results back without agents redoing them.

## Acceptance criteria

- Riley can bring in a whole character or a part, such as a design, a head, a costume piece, a rig or a texture, made in a tool Riley chooses, without code or the command line. The first formats are FBX, glTF and USD for meshes and rigs, and PNG and EXR for images. Sam can add a format as a step (story-agent-work-extend-the-workflow).
- Riley chooses the stage the work enters, design or mesh and rig, and it goes to that stage's gate like generated work (story-character-path-design-drafts, story-character-path-mesh-and-rig).
- The work passes the automatic checks of the quality and licence gate (story-provenance-and-policy-quality-and-licence-gate). It does not need an agent to regenerate it.
- No agent regenerates or overwrites hand-made work. An agent's suggested change arrives as a separate new version that Riley can compare and accept or ignore (story-review-and-status-feedback-and-versions).
- The provenance record (story-provenance-and-policy-provenance-record) shows the work as made by hand, by Riley, with the tool and its version, and with no AI used, only when Riley declares that no generation tool was used. Otherwise the declaration, policy check and provenance follow story-character-path-own-tool-generated-work. A character made of hand-made and generated parts shows the record of each part.
