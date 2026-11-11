---
id: story-session-operations-live-changes
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-show-operator#goals: 408315e4f8f6
---

# Make a change during a live run

As Alex, the show operator, I want a change during a live run to be made and approved by people at the show, logged, and told to the people it affects, so that I can recover from anything without an unapproved or unseen change reaching the audience.

## Acceptance criteria

- A change during a live run is any change, made in show mode (story-show-safety-switch-modes) while a session runs, to the cue list or a cue, a mapping, a fallback, a mix, the assignment of sources to channels, a timeout, a trim, or any other saved setting of the show. Firing a cue, holding, resuming, jumping, handing over a channel and riding a level are operations, not changes. This story defines a change during a live run. Other stories refer to it by this story's id.
- Only a person at the show whose role allows that kind of change, as its own story says, can make it. It takes effect only once the person named for the "changes during a live run" gate (story-project-record-name-approvers), or their delegate at the show, approves it. When the person making the change holds that approval, making it is the approval, and both are recorded. An approval that the change's own story also requires, such as a new approval of a mapping, still applies.
- An agent cannot make, approve or apply a change during a live run.
- Each change is logged with who made it, who approved it, the session, the time, and the old and new values. After the session, it appears in the review queue (story-review-and-status-see-review-queue) for its area's approver, who keeps it or restores the earlier version.
- The cast and crew whose work the change affects, such as a performer whose mapping changes, are told what changed and who made it, on the crew channel (story-performer-support-crew-channel), as text and read aloud. The change reaches no audience output except through its effect on the show.
- Changes during a live run work with every agent and the internet disconnected.
