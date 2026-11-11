---
id: story-guest-care-standard-pre-show
status: approved
derived-from:
  - epic-guest-care#outcome: 96cd04bf3a39
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Enter through a standard pre-show that a show can restyle

As Jamie, the audience member, I want to arrive, have my device checked and learn the controls in a pre-show before the show starts so that I can join with no setup trouble.

## Acceptance criteria

- The pre-show is the state of a session before its start. Guests can arrive early and wait in it, enter in stages, have their device checked, and learn the show's controls in a short tutorial where the show has controls, which can sit inside the story. The director or their delegate sets the size of each stage and the time between stages in production mode (story-show-safety-switch-modes). This story defines the pre-show. Other stories refer to it by this story's id.
- The pipeline provides a standard pre-show, saved as a reusable pattern (story-interaction-design-reusable-pattern). Quinn can restyle or replace it for a show, and the result goes through the interaction design gate (story-interaction-design-record-design).
- The required steps, notices, consent and warnings (story-guest-care-notices-and-warnings), always happen before a guest enters, in the standard pre-show and in any restyled or custom one. A session with guests cannot start in show mode while the show's pre-show leaves one out, and the check lists each missing step in plain words.
- If Jamie's device check fails, Jamie is told in plain words what to do next. In the venue, Taylor sees in text which guests are not yet ready.
- The director or their delegate sets a time budget for the pre-show, which counts towards the show's comfort limits (story-guest-care-access-options). The time is measured in rehearsal and shown against the budget in text.
- The story is tested with simulated guests arriving in a number and pattern a person sets, in headsets and on the player page, and once in a rehearsal with real guests.
