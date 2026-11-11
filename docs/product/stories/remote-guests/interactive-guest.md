---
id: story-remote-guests-interactive-guest
status: approved
derived-from:
  - epic-remote-guests#outcome: b4af335ea8ee
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Join as an interactive guest through an installed app or a cloud session

As Jamie, the audience member, I want to join the live world from home as an interactive guest so that I feel present in the performance and am seen as part of it.

## Acceptance criteria

- Interactive guests are in the live world with low delay (REQ-audience-10). On PC and PC VR, Jamie joins through an installed app, a delivered build for that target (story-build-and-install-build-from-stages). On a browser or phone, Jamie gets a cloud-rendered session of the same show, kept for the few guests who need to be in the world (REQ-delivery-11). This story defines the interactive tier, its delay target, the installed app and the cloud session. Other stories refer to them by this story's id.
- The interactive tier's delay target is that guests see the show within 1 second of a performer's movement, so their input feels live. It is measured as in story-live-puppet-measure-delay, to the guest's screen, for the installed app and for a cloud session, and shown pass or fail in text. The director confirms or changes the target from a test on a real internet connection before this story is accepted. An agent cannot set it.
- The tier's limit is its guest count (story-audience-avatars-choose-an-avatar). Cloud sessions also have their own limit (story-remote-guests-move-past-the-limit).
- Guests in the installed app hear the mix Drew sets for that output, and cloud sessions carry the browser mix (story-sound-path-mix-per-output). The sound-to-picture offset is measured on the guest's screen and shown beside the show's target.
- The story is tested on the first release's test kit (story-build-and-install-measure-against-budget) with simulated guests at the tier's limit, from which the director or their delegate sets that count (story-audience-avatars-choose-an-avatar), and once on a real internet connection with real guests on a PC, a PC VR headset, a browser and a phone.
