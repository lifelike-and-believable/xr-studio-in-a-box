---
id: story-nearest-body-retargeting-correct-and-save
status: approved
derived-from:
  - epic-nearest-body-retargeting#outcome: 49852e3af6be
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Correct an automatic match and save it as a mapping

As Sam, the technical artist, I want to correct an automatic body-plan match by hand and save it as a mapping so that I can set up retargeting for characters whose bodies do not match the performer's without building a mapping from scratch.

## Acceptance criteria

- Starting from an automatic match (story-nearest-body-retargeting-match-nearest-body-plan), Sam can change a matched part, match a part that was not matched, or remove a match, without code. Sam sees the result on the proxy character as each change is made.
- On the creature with extra limbs, Sam can have one performer part drive more than one character part, such as one arm driving two arms.
- Sam saves the result as a mapping asset, which follows the rules in story-shared-characters-map-a-different-body for what it names, versions, restore, review, approval and show mode. The asset also names the body plan it was matched to, and shows which matches were automatic and which Sam made by hand.
- Running the automatic match again on a saved mapping makes a new version and keeps Sam's hand corrections, unless Sam chooses to replace them.
- A saved mapping can be reused on another character with the same body plan. Parts that do not match on the new character are listed, as in the automatic match.
