---
id: story-behaviour-and-limits-write-specification
status: approved
derived-from:
  - epic-behaviour-and-limits#outcome: 11fe519b4e30
  - persona-director#goals: a92ca172be83
---

# Write a behaviour specification and review it at a gate

As Morgan, the director, I want each autonomous character to have a behaviour specification in plain words, reviewed at a gate before it runs in a show, so that I can see drafts early, steer them, and decide what is good.

## Acceptance criteria

- An autonomous character is a character, crowd, creature or assist on a performer-led character that acts without a person driving it (story-crowds-and-creatures-place-a-crowd, story-crowds-and-creatures-add-creatures, story-crowds-and-creatures-ai-assists). Its behaviour specification says, in plain words, what it does, what it may not do, how it reacts to cues, performers and nearby presence, the content limits it follows (story-behaviour-and-limits-content-limits), its scripted fallback (story-behaviour-and-limits-scripted-fallback), and the redirects an operator may choose (story-behaviour-and-limits-override). In the first release a specification describes rule-based and procedural behaviour only, with no generative model at show time. This story defines an autonomous character and its behaviour specification. Other stories refer to them by this story's id.
- The director or their delegate writes or edits a specification in production mode (story-show-safety-switch-modes). An agent can draft one, but cannot accept it or change an accepted one. Each version is kept with who made it and when (story-review-and-status-feedback-and-versions).
- A specification passes the AI behaviour, voice and dialogue gate (REQ-workflow-2) before its character runs in show mode. It waits for the person named for that gate (story-project-record-name-approvers, story-review-and-status-hold-gated-hand-off), who sees the specification, a recorded run of the character on a proxy level, the policy check (story-behaviour-and-limits-check-ai-use) and the scenario test results (story-behaviour-and-limits-scenario-tests). An AI recommendation is marked as one and cannot pass the gate. Any version can run in rehearsal in production mode.
- A specification with no scripted fallback, or that names no approved content limits, cannot be accepted, and the reason is shown in plain words.
- A change to an accepted specification makes a new version that goes back through the gate. In show mode it is also a change during a live run (story-session-operations-live-changes). The show tells Alex, the show operator, in text which version of each character's specification is running and whether it is accepted.
- The story is tested on proxy characters on the common skeleton in the Unreal Editor, with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget): a character whose specification is not accepted cannot start in show mode, and an accepted one does.
