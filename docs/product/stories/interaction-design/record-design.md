---
id: story-interaction-design-record-design
status: approved
derived-from:
  - epic-interaction-design#outcome: 6512961c0025
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Record what guests can do as a reviewable design

As Quinn, the interaction designer, I want to record what a guest can do, how they move and what responds to them so that others can review it before it is built.

## Acceptance criteria

- Quinn can record each interaction in the project's interaction design, without code: what the guest does, on which targets, and what responds, such as a character, a camera, the environment or a cue. An interaction that fires a cue names it, and the cue is simulated until show control arrives in Layer 4.
- The person who holds the interaction designer's role owns the design. On a small show the director holds this role unless the project names someone else, and a technical artist can be named for the build side, which builds what patterns cannot cover (story-project-record-name-approvers). The project shows who holds each.
- An agent can draft or revise the design, but only a person who holds the interaction designer's role can send it for review. The design waits at the interaction design gate until the person named for that area accepts it (story-review-and-status-hold-gated-hand-off). An agent cannot accept it.
- The design is versioned, and earlier versions can be compared and restored (story-review-and-status-feedback-and-versions).
- Where a project marks that its environments need the interaction design first, the status board shows environment work as blocked until the design is accepted (story-review-and-status-status-board).
- Only people whose role needs the design, such as the director, the technical artist and the artist, can open it.
