---
id: story-behaviour-and-limits-content-limits
status: approved
derived-from:
  - epic-behaviour-and-limits#outcome: 11fe519b4e30
  - persona-director#goals: a92ca172be83
---

# Set content limits, and keep output outside them from the audience

As Morgan, the director, I want each project's content limits approved by the person who holds the audience-facing safety and consent approval so that this approval stays with a person and never goes to an AI.

## Acceptance criteria

- Content limits are rules for what an autonomous character (story-behaviour-and-limits-write-specification) may say or do in a project, such as actions, gestures, sounds and words it may not use, places it may not go and how close it may come to a performer or a guest's presence. They include the cultural protocols in the policy record (story-provenance-and-policy-record-terms). Each limit can be checked against a character's output. This story defines content limits. Other stories refer to them by this story's id. A specification may narrow them but never widen them.
- The director or their delegate drafts the limits in production mode (story-show-safety-switch-modes), and an agent can draft them too. The person the project records as holding the audience-facing safety and consent approval (story-project-record-name-approvers) approves them and each change. An agent cannot approve or change them. Limits change only in production mode, never during a session.
- During a show, every autonomous output, including an assist on a performer-led character (story-crowds-and-creatures-ai-assists), is checked against the limits before it reaches any output. Output outside them reaches no audience: the behaviour switches to its scripted fallback (story-behaviour-and-limits-scripted-fallback), and Alex, the show operator, is told in text and with a sound which character and limit. The check works with every agent and the internet disconnected.
- Before approving, the holder sees the limits run on recorded scenarios (story-behaviour-and-limits-scenario-tests) with outputs meant to pass and outputs meant to be stopped, and sees the result for each in text.
- The story is tested on proxy characters made to break each limit in turn: no breaking output reaches any output connected in the test, and remote outputs are checked on a simulated stream.
