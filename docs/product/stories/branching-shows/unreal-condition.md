---
id: story-branching-shows-unreal-condition
status: approved
derived-from:
  - epic-branching-shows#outcome: fb606af20aad
  - persona-show-operator#goals: 408315e4f8f6
---

# Show a condition built in Unreal as one item in the cue list

As Alex, the show operator, I want logic built in Unreal to appear in the cue list as one named condition so that I can run the show from a cue list I can read.

## Acceptance criteria

- Sam, or another person with the technical artist's role, can build a condition's logic in Unreal and publish it as one named condition, such as "puzzle solved", with no change to the core (story-agent-work-extend-the-workflow). An agent can draft the logic, and a person with the technical artist's role confirms it.
- In the cue list, a published condition is one item showing its plain name and its state (waiting, met or not reporting) in text and with a mark that does not rely on colour alone. Alex does not see the logic inside it. People whose role needs the logic, such as Sam and Quinn, can open it from the item.
- A published condition can be used wherever a condition can (story-branching-shows-conditional-cue), including at a branch point (story-branching-shows-paths-and-endings), with the same time limit and default.
- In production mode, Alex can set a published condition to met or not met by hand, to rehearse each path cue to cue with no performer or guest. In show mode, doing so counts as firing or skipping a waiting cue by hand (story-branching-shows-conditional-cue) and is logged with who did it. An agent cannot set a condition in show mode.
- If the logic behind a condition fails or stops reporting, the item shows "not reporting", Alex is told in plain words and with a sound, and the cue's time limit and default apply, so the show does not stall. Published conditions work with every agent and the internet disconnected.
- A change to a published condition is a new version, which runs in a public show only once the cue list is accepted at its gate (story-cue-list-agent-drafts).
