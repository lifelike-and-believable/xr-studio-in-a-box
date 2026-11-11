---
id: story-branching-shows-conditional-cue
status: approved
derived-from:
  - epic-branching-shows#outcome: fb606af20aad
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Make a cue depend on a condition

As Quinn, the interaction designer, I want to make a cue wait for a condition so that what a guest can do and what responds to it is defined in a form that others can review.

## Acceptance criteria

- Quinn can give any cue in the cue list (story-cue-list-build-and-edit) a condition, without code: a guest's action, a combined audience result counted as the show sets (story-cue-list-audience-fired), a character's state, or the time since an earlier cue. This story defines a condition: a test that is either met or not met at a moment in the show. Other stories refer to it by this story's id.
- A cue with a condition waits when the show reaches it and fires when the condition is met. Its row in the cue list shows the condition in plain text, such as "When: a guest touches the lantern", and its state (waiting, met, timed out or skipped) in text and with a mark that does not rely on colour alone.
- Each condition has a time limit and a default that Quinn sets: if the time limit passes and the condition is not met, the default happens (the cue fires, or it is skipped). In a live show, the show's operator can fire or skip a waiting cue by hand, and each such action is logged with who took it.
- Quinn, or another person with the interaction designer's role, sets and changes conditions in production mode. An agent can draft a condition, but it runs in a public show only once the cue list is accepted at the cue list gate (story-cue-list-agent-drafts). In show mode, changing a condition is a change during a live run (story-show-safety-switch-modes), and an agent cannot make it.
- Conditions are tested in the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated guests (story-live-signals-guest-presence) and recorded performer takes (story-session-recording-record-and-replay). They work in show mode with every agent and the internet disconnected.
