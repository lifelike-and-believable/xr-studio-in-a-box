---
id: epic-session-recording
status: approved
derived-from:
  - requirements-performance#REQ-performance-9: aca90e83f78b
  - requirements-performance#REQ-performance-10: c59960ebfdb7
  - requirements-performance#REQ-performance-18: b0492d174192
  - requirements-governance#REQ-governance-9: bbefcd6d5183
  - requirements-governance#REQ-governance-10: b97ebeb15f50
  - persona-performer#goals: 9de25c7bbe59
  - persona-capture-crew#goals: a63bac7ade3c
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Record, replay and share a performance

<!-- Layer 2, live puppetry. -->

## Outcome

A capture session can be recorded and replayed in rehearsal or tests, within what the performer has agreed, and performance data can move between machines in real time, including from a performer in another location.

## Personas

- persona-performer: decides what is captured and how it may be used.
- persona-capture-crew: records and replays sessions.
- persona-technical-artist: uses recordings for automated tests, and connects machines.

## Proposed stories

- Record a performer's agreement for a project: what may be captured, how it may be used, and their acknowledgement of any character brief.
- Check that agreement before recording, and before a generative tool uses the data.
- Record a capture session, and replay it to drive the same characters.
- Clean up a recorded session, with the performer named in the provenance record.
- Change an agreement, and flag the assets it no longer allows.
- Send performance data between machines in real time in a documented open format.
- Drive a character in a show from another location over the internet, with the delay measured and shown, tested over a simulated link.
- Test a remote performer between two real sites over the internet.

## Stories

- story-session-recording-record-agreement
- story-session-recording-check-agreement
- story-session-recording-record-and-replay
- story-session-recording-clean-up
- story-session-recording-change-agreement
- story-session-recording-stream-between-machines
- story-session-recording-remote-performer

## Release groups

- The agreement, its check and recording ship together: nothing is recorded without an agreement in place.
- Streaming between machines can ship on its own, and the remote performer follows it.

## Dependencies

- epic-live-puppet.
- epic-provenance-and-policy, for the policy gate and provenance record.

## Open questions

- Answered: the stories can be approved now. story-session-recording-change-agreement, the only story whose behaviour depends on the default, carries a criterion that legal review confirms the default (REQ-governance-9) before the story is accepted. Until then, a changed agreement blocks every new use of the affected recordings and assets, which is the safest default. Past shows and work already delivered stand as they are, as REQ-governance-9 says, and a contract can still set different terms.
- Answered: settled in story-session-recording-stream-between-machines, which defines a documented open format and checks Open3DBroadcast's format against that definition, with the result recorded, before the story is accepted.

## Out of scope

- Style continuation trained on recordings (REQ-characters-11), which is later. The recorded format must not prevent it.
- Streaming to audiences, which belongs to the delivery layer.
