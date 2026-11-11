---
id: story-nearest-body-retargeting-add-body-plan
status: approved
derived-from:
  - epic-nearest-body-retargeting#outcome: 49852e3af6be
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Add a body plan to the known set

As Sam, the technical artist, I want to add a body plan to the known set so that I can set up retargeting for characters whose bodies match none of the plans already known.

## Acceptance criteria

- Sam can add a body plan to the known set (story-nearest-body-retargeting-match-nearest-body-plan) from a reference character, naming its parts, without code and without modifying the core. It is tested by adding a proxy character outside the first set, such as a winged creature.
- A new body plan is versioned and goes to the review queue (story-review-and-status-see-review-queue). The automatic match offers it only once a person with the technical artist's role has approved it. An agent can draft a body plan but cannot approve it.
- Adding or changing a body plan does not change existing mappings or the characters that use them. They keep the version of the plan they were matched to.
- Sam can see which version of which body plan each mapping was matched to.
