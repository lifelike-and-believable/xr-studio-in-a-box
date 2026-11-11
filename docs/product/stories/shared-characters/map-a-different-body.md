---
id: story-shared-characters-map-a-different-body
status: approved
derived-from:
  - epic-shared-characters#outcome: 78501c6baddc
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Map a performer onto a different body

As Sam, the technical artist, I want to map chosen body parts or motion values onto a character whose body does not match the performer's so that I can set up capture mappings for characters whose bodies do not match.

## Acceptance criteria

- Sam can choose which performer body parts drive which character parts (mapped puppeteering), without code. It is tested on a proxy character with a different body, such as a simple creature built outside the generation path.
- Sam can map motion values onto character values such as energy, size or colour (parameter mapping), without code.
- A mapping is a saved asset that names the performer parts or values, the character parts or values, and who made it. Other stories refer to it by this story's id.
- A mapping goes through review like other work (story-review-and-status-see-review-queue), and can be rehearsed live, reused on another character with the same body, and changed by Sam.
- In show mode a mapping can be changed only by a person whose role allows it. An agent cannot change it.
