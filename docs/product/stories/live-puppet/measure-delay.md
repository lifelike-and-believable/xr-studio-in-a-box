---
id: story-live-puppet-measure-delay
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# Measure the delay from performer to puppet

As Casey, the capture crew, I want to measure the delay from a performer's movement to the rendered puppet on the show's hardware so that I can prove the performer's latency is within budget.

## Acceptance criteria

- Casey can run a measurement, on the show's hardware, of the delay end to end from a performer's movement to the rendered puppet, in milliseconds.
- The measurement also reports the delay to what the audience sees on each output connected now, such as a monitor. Outputs added in later layers use the same measurement.
- The delay target is 100 ms, or a tighter target set by a person with the director's role for a show with a performer visible beside their character. Other stories refer to it by this story's id. The result shows pass or fail against it in text, not by colour alone.
- The first test puts a performer beside their character, and the people present record what they notice, so the director can set the tighter target from it.
- Each result is saved with its date, hardware, source and character, so results can be compared.
