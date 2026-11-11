---
id: story-cue-list-agent-drafts
status: approved
derived-from:
  - epic-cue-list#outcome: 26d12b7b12dc
  - persona-director#goals: a92ca172be83
---

# Draft and revise a cue list with agents, and approve it

As Morgan, the director, I want agents to draft a cue list from the script or brief and revise it from rehearsal notes, and to approve it at the gate, so that I approve quickly and review does not become the pipeline's limit.

## Acceptance criteria

- Morgan can ask an agent (story-agent-work-direct-an-agent) to draft a cue list (story-cue-list-build-a-cue-list) from the script or brief, with its sections, targets and ways of firing. Branches are drafted under epic-branching-shows.
- After a rehearsal, Morgan or Alex can give notes, and an agent revises the list from them. Each revision is a new version that can be compared with the last cue by cue, showing what changed (story-review-and-status-feedback-and-versions).
- A draft or revision cites only targets that exist in the project. A cue whose target is missing is marked in plain words.
- Each draft and revision goes to the cue list gate in the review queue (story-review-and-status-see-review-queue), and runs in a public show only once the director or their delegate accepts it (story-cue-list-build-a-cue-list). An AI reviewer's recommendation is marked as such and cannot pass the gate.
- Agents make no change to the cue list in show mode (story-show-safety-switch-modes), and the accepted cue list runs with every agent disconnected.
