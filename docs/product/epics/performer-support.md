---
id: epic-performer-support
status: approved
derived-from:
  - requirements-performance#REQ-performance-16: e28d35995e1a
  - requirements-performance#REQ-performance-17: 09aefb18a357
  - requirements-showcontrol#REQ-showcontrol-22: f3a6ea55bd46
  - requirements-delivery#REQ-delivery-15: 0fed22397198
  - persona-performer#goals: 9de25c7bbe59
  - persona-capture-crew#goals: a63bac7ade3c
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# The performer can sense the room and trust the motion

<!-- Layer 2, live puppetry. -->

## Outcome

While performing, a performer can sense the audience, see what they are playing opposite and talk privately to the crew, and their live motion holds up to a bar the show has set.

## Personas

- persona-performer: stays connected to the room and the crew without breaking character.
- persona-capture-crew: supports the performer during a session, on site or from elsewhere.
- persona-technical-artist: sets up the feeds and the motion quality checks.

## Proposed stories

- Talk privately with crew by voice and text from inside a headset or suit, with a remote helper able to join and a venue intercom able to connect.
- See a live view of the room, or a silhouette or depth view, with a clear notice to guests.
- Hear venue audio while performing.
- Sense the audience summary through physical signals such as lights.
- See the virtual character from the stage, through a monitor, a headset or another view.
- Check live motion against the show's quality bar for limbs, foot contact and held props.

## Stories

- None yet.

## Release groups

- The crew channel ships first: UC-2 is to be tested with a remote helper from the start.
- The room view, venue audio and stage view can each ship on their own.
- The summary through physical signals ships after the audience summary exists, and is tested against a simulated audience until then.
- The motion quality check can ship on its own, after epic-live-puppet.

## Dependencies

- epic-live-puppet, for the character and the delay measurement.
- The audience layer, for the audience summary (REQ-audience-6).
- The legal review of a live room view (REQ-governance-7).

## Open questions

- What can a performer in a suit with no headset see and hear? This needs trying with a real performer.
- Is motion correction built with Unreal's own tools, or bought from a vendor? It must stay within the show's delay target.
- What should the notice to guests about a live room view say?

## Out of scope

- The operator's cue calling and show tools, which belong to the show control layer.
- The audience summary itself, which belongs to the audience layer.
- Quality bars for signing, which belong to epic-handover-and-fallback.
