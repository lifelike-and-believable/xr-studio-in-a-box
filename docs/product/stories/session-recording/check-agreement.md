---
id: story-session-recording-check-agreement
status: approved
derived-from:
  - epic-session-recording#outcome: 196669ad74cf
  - persona-performer#goals: 9de25c7bbe59
---

# Check the agreement before recording and generation

As Kai, the performer, I want my agreement checked before anything is recorded and before a generative tool uses my data so that what is captured and how it is used stays what I decided.

## Acceptance criteria

- Recording cannot start for a performer with no agreement (story-session-recording-record-agreement) in the project. Only the kinds of data the agreement allows are recorded, and the person starting the recording sees which kinds are left out and why.
- Each use of a recording, such as replay in rehearsal or tests, or cleanup, runs only if the agreement allows it. A refused use names the part of the agreement that blocks it.
- Before a generative tool uses Kai's data or an asset derived from it, the policy gate (story-provenance-and-policy-block-generation) checks Kai's agreement, and the request does not run if the agreement does not allow that AI use.
- Only a person with the right role can override a refusal, by recording a changed agreement (story-session-recording-change-agreement). An agent cannot.
- Each refusal appears in the activity log.
