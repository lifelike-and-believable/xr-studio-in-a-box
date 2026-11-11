---
id: story-character-path-design-drafts
status: approved
derived-from:
  - epic-character-path#outcome: ea093b262bb3
  - persona-artist#goals: 0767918db571
---

# Turn a brief into design drafts and approve one

As Riley, the artist, I want to turn a character brief and references into design drafts and send one to the character design gate so that I get from a brief to a strong first draft quickly.

## Acceptance criteria

- Riley can give a character brief and reference images and get design drafts as concept images from Higgsfield, without code. Riley sets how many drafts each request makes. It is tested first on a stylised character for the first show (UC-2).
- A generation tool's first real use is the first time its output is meant to enter project work. Before it, the person who holds the contracts and licence terms approval checks the tool's output licence and records it with who did it and when. Until then the tool's requests are refused, and Riley is told why. An agent cannot record or change it. Other stories refer to this rule by this story's id.
- Each request goes through the policy gate (story-provenance-and-policy-block-generation), the spend limit (story-agent-work-spend-limit) and the tool's adapter (story-agent-work-tool-adapter). Each draft carries a provenance record (story-provenance-and-policy-provenance-record) and passes the quality and licence gate (story-provenance-and-policy-quality-and-licence-gate) before Riley sees it in the project.
- A reference that shows a performer's likeness is used by a generative tool only if that performer's agreement allows it (story-session-recording-check-agreement).
- Riley can give written feedback, get revised drafts and compare them (story-review-and-status-feedback-and-versions).
- Riley sends one draft to the character design gate. It waits for the director or their delegate (story-review-and-status-hold-gated-hand-off, story-review-and-status-decide-on-items), and an agent cannot pass it. Only an approved design can start a mesh (story-character-path-mesh-and-rig).
