---
id: requirements-audience
status: draft
derived-from:
  - concept#vision:
---

# Audience and avatars requirements

<!-- Draft. Source: discovery sections 6, 10, 11. Avatars rank above AI that responds to the audience. -->

The first release includes avatars and reactions, the audience summary, and chat. Viewpoint choice and REQ-audience-9 come later.

## REQ-audience-1: Audience avatars

Audience members, in the venue and remote, can appear as avatars inside the world of the performance.

## REQ-audience-2: Appearance tiers

A show chooses one or more appearance tiers for its avatars: abstract or symbolic forms, stylised figures from a set, guest-customised avatars, and likenesses of the guest. Likenesses require REQ-governance-7.

## REQ-audience-3: Embodiment tiers

An avatar follows a guest using the best input available on the guest's device: headset and hand tracking, full-body inside-out tracking, browser or phone input, or passive guided movement. It falls back gracefully when input quality drops.

## REQ-audience-4: Mixed scale

A show can combine a few high-fidelity avatars (for example in the venue) with a large simplified remote crowd in one world. The design plans for hundreds of guests in the venue and tens of thousands remote. The counts each release must reach, per audience type, are TBD.

## REQ-audience-5: Presence and reactions

Avatars can be seen by performers and by other guests, and can express reactions (cheers, gestures, light or sound responses).

## REQ-audience-6: Readable audience summary

Performers and operators get a summary of audience presence and reaction that they can read at a glance. They do not need to watch every avatar.

## REQ-audience-7 (later): Viewpoint choice

Remote viewers can choose their camera or viewpoint, within limits the show sets.

## REQ-audience-8: Chat and reactions

Viewers can send text and reaction input that reaches the performer, the scene or both. Each show sets its moderation, and a person approves the rules (REQ-workflow-7). Automatic filters may apply those rules during the show.

## REQ-audience-9 (later): Touch, interaction and effect on the show

Avatars can touch or interact with performers, characters and each other, and collective or individual action can change the scene. The order of these features is TBD.

## REQ-audience-10: Two remote tiers

Remote guests join in one of two tiers. Interactive guests are in the live world with low delay, up to a limit the show sets. Stream viewers watch with seconds of delay, and their reactions reach the show as a combined summary. The delay target and limit for the interactive tier are TBD.

## REQ-audience-11: Avatar safety

Avatars keep a personal space around each guest. Guests can mute and block others. An operator can mute, hide or remove any guest during a show. A person approves each show's safety rules (REQ-workflow-7).

## REQ-audience-12: Accessibility and comfort

Each show offers captions for speech, a seated option, and a low-motion option where its format allows. Guests are warned before the show about flashing light or intense motion. The show declares which options it offers.

## REQ-audience-13: Minors

Each show declares whether guests under the age of consent may attend. Where they may, a guardian's consent is needed before any likeness, voice or body data is captured, and the show sets limits on chat and on what is kept. These rules are part of the legal review in REQ-governance-7 (pending).

## REQ-audience-14: Joining and reconnecting

A guest enters a show through a link or code issued by whatever ticketing the show uses. Guests can arrive late, and a guest who loses connection can rejoin with the same avatar.

## REQ-audience-15: Audience failures stay contained

A failure or overload in any audience system does not affect the performer loop or stop the show for other audience types. If the remote systems fail, the show continues in the venue.

## Constraints

- Audience types use different devices and have different latency (see REQ-audience-10).
- Avatars must not depend on AI responding to the audience, which is later (REQ-characters-9).
- Remote audiences need internet. A show's venue functions do not (REQ-delivery-5).
- Ticketing stays out of scope (concept, non-goals). The pipeline only accepts a link or code.

## Success measures

- Avatars connected per audience type at stable frame rate; performer rating of the audience summary in rehearsal. Each target is set after a baseline is measured on the first project.
