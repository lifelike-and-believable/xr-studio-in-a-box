---
id: story-sound-path-brief-to-drafts
status: approved
derived-from:
  - epic-sound-path#outcome: 3f3e81a83f45
  - persona-sound-designer#goals: 70f155e30dc6
---

# Turn a sound brief into drafts, and approve them

As Drew, the sound designer, I want to turn a brief into drafts of music, effects and ambience so that I get from a brief to a first draft and spend my time on what makes the sound good.

## Acceptance criteria

- Drew can write a brief with references, and direct an agent to draft music, effects or ambience from it. Generated voices come later (REQ-content-13): the first show uses the performer's live voice (approver's decision).
- Each generation goes through the policy gate (story-provenance-and-policy-block-generation), the spend limit (story-agent-work-spend-limit), a tool adapter (story-agent-work-tool-adapter), the provenance record (story-provenance-and-policy-provenance-record) and the quality and licence gate (story-provenance-and-policy-quality-and-licence-gate). Each audio tool follows the licence rule for a tool's first real use (story-character-path-design-drafts).
- Drew can listen to each draft, compare versions, write feedback and have a draft regenerated (story-review-and-status-feedback-and-versions).
- Drew can replace a draft with work from an audio workstation, and the provenance record shows the change.
- Drew chooses which drafts go to the sound and music gate, where the person named for that area accepts or rejects them (story-review-and-status-decide-on-items). An agent cannot accept them.
