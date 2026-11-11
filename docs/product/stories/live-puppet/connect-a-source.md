---
id: story-live-puppet-connect-a-source
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# Connect a capture source and drive a character

As Casey, the capture crew, I want to connect a capture source through one common interface and see a character move so that I can confirm a performer's data is reaching the right character.

## Acceptance criteria

- The common interface is the one way every capture source reaches a character. Other stories refer to it by this story's id.
- Casey can connect a supported source through the common interface and see a proxy character on the UE5 mannequin skeleton (Manny) follow the performer.
- Casey sees which source drives which character, and whether data is arriving. A lost connection is shown in text and with a sound, not by colour alone.
- Adding a second source, tested with a recorded or simulated stream, needs no change to the character or the level that uses it.
- Connecting and driving a character does not depend on an agent. In show mode no agent is in the path.
