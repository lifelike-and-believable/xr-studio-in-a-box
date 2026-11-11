---
id: story-session-recording-stream-between-machines
status: approved
derived-from:
  - epic-session-recording#outcome: 196669ad74cf
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Stream performance data between machines

As Sam, the technical artist, I want to send performance data between machines in real time in a documented open format so that a tool at either end can be replaced without rewriting the workflow around it.

## Acceptance criteria

- Performance data for every channel, with its timing, sent from one machine drives the same character on another machine on the same network. The delay between the machines is measured and shown.
- The format is open and documented: its specification is published, can be read without a fee or a non-disclosure agreement, and is complete enough to write a reader from it alone. A reader written from the specification alone reads a test stream correctly.
- Before the story is accepted, Open3DBroadcast's format is checked against this definition, and the result is recorded in the project with what passed and what failed. If it fails, a person decides whether to close the gap or choose another format.
- Streaming works on a local network with no agent and no internet.
- If the stream drops, the receiving channels use their fallback (story-handover-and-fallback-automatic-switch).
