---
id: story-branching-shows-paths-and-endings
status: approved
derived-from:
  - epic-branching-shows#outcome: fb606af20aad
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Split a show into paths and endings, and rejoin them

As Quinn, the interaction designer, I want to split a show into paths and endings and rejoin them so that the ways a guest can go through the show are defined in a form that others, such as the stage manager, can review.

## Acceptance criteria

- Quinn can add a branch point, without code: a cue where the show splits into paths, each with a condition (story-branching-shows-conditional-cue), and one path marked as the default. A path is the run of cues from a branch point to a rejoin or an ending. A rejoin is a cue where paths meet again. An ending is a cue after which the show finishes. This story defines branch point, path, rejoin and ending. Other stories refer to them by this story's id.
- Only one path is taken at a branch point. If two conditions are met at once, the path listed first is taken, and the list shows that order. If no condition is met within the time limit, the default path is taken. A path that reaches neither a rejoin nor an ending cannot be saved, and the check names it in plain text.
- The cue list is drawn as one flat list in show order. Each branch point is a row that names its paths and their conditions in text. The cues of each path follow under the path's name. Each rejoin and ending is a row that says which paths arrive there. During a run, the path taken so far is shown in text and with a mark that does not rely on colour alone, and paths not taken are shown as not taken.
- Before this story is accepted, a stage manager or show operator who has not seen the list reads a branching list the size of the first show's in rehearsal and answers set questions, such as which cue is next, on which path, and under which condition. That stage manager or show operator sets the pass bar before the test. If the list fails the bar, the drawing changes, not the bar.
- Quinn, or another person with the interaction designer's role, makes and changes branches in production mode. An agent can draft them, but cannot accept them, and they run in a public show only once the cue list is accepted at its gate (story-cue-list-agent-drafts). Jumping to a cue on any path belongs to story-session-operations-pause-and-jump.
- Every path can be reached in the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated guests and recorded performer takes, and with every agent and the internet disconnected.
