---
id: story-nearest-body-retargeting-match-nearest-body-plan
status: approved
derived-from:
  - epic-nearest-body-retargeting#outcome: 49852e3af6be
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Match a character to the nearest body plan

As Sam, the technical artist, I want a character whose body does not match the performer's matched automatically to the nearest known body plan so that I can set up retargeting for characters whose bodies do not match the performer's.

## Acceptance criteria

- The known set of body plans is the biped UE5 mannequin (Manny), a quadruped and a creature with extra limbs, such as four arms. Other stories refer to it by this story's id. It is tested on a proxy character for each plan.
- Sam can choose a character and start the match without code. Sam sees which body plan was chosen, and a list, in text, of which character parts were matched to which performer parts and which parts were not matched.
- Parts that were not matched hold the character's rest pose until Sam maps them by hand (story-nearest-body-retargeting-correct-and-save). AI motion filling them in comes with AI assists in Layer 7 and is not in this story.
- The first match uses Unreal's IK Retargeter on the three proxy characters, driven by the portable inertial suit or a recording of it (story-session-recording-record-and-replay). The result records, for each plan, whether it was matched and whether the measured delay is within the show's delay target (story-live-puppet-measure-delay). A live performer drives a character only once their agreement is confirmed (story-session-recording-record-agreement).
- If IK Retargeter does not match all three plans within the delay target, Sam, or another person with the technical artist's role, chooses another tool and records the choice and its reason with the result before this story is accepted. An agent cannot make the choice.
- The automatic result is a draft. It is used only once it is corrected and saved as a mapping (story-nearest-body-retargeting-correct-and-save).
