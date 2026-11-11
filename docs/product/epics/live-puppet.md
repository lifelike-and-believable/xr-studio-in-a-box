---
id: epic-live-puppet
status: approved
derived-from:
  - requirements-performance#REQ-performance-1: 020c3f2c7434
  - requirements-performance#REQ-performance-2: 02b272a46bfa
  - requirements-performance#REQ-performance-5: 000ad37bfbd5
  - requirements-performance#REQ-performance-11: 1ce91bd351c2
  - persona-performer#goals: 9de25c7bbe59
  - persona-capture-crew#goals: a63bac7ade3c
---

# A performer drives a character live

<!-- Layer 2, live puppetry. -->

## Outcome

A performer can step into a capture source, complete a guided setup and drive a character in Unreal with under 100 ms from movement to rendered puppet, shown by a measurement.

## Personas

- persona-performer: the character has to feel like their own body.
- persona-capture-crew: sets up and proves the source without a pipeline engineer.

## Proposed stories

- Connect a capture source through the common interface and drive a character.
- Complete a guided setup and calibration for a portable inertial suit, the first source.
- Complete a guided setup and calibration for headset and hand controllers.
- Complete a guided setup and calibration for webcam or phone capture.
- Connect an optical studio's live capture stream through a guided setup, and map its performers to characters. The studio's own system and staff do the calibration.
- Assign a source to a character's body, hands, face, voice and effects channels.
- See the measured delay from performer to rendered puppet, and to what the audience sees on each output, measured end to end on the show's hardware. The first test puts a performer beside their character.

## Stories

- story-live-puppet-connect-a-source
- story-live-puppet-inertial-suit-setup
- story-live-puppet-headset-setup
- story-live-puppet-webcam-or-phone-setup
- story-live-puppet-optical-studio-stream
- story-live-puppet-assign-channels
- story-live-puppet-measure-delay

## Release groups

- The common interface, the portable inertial suit's setup, channel assignment and the measurement ship together: this is the smallest proof of the 100 ms loop.
- Each further source can then ship on its own.

## Dependencies

- Proxy characters on the UE5 mannequin skeleton (Manny), such as the mannequin itself, a MetaHuman or a character from a past show retargeted to it with IK Retargeter. Layer 2 is built and tested on these, so it does not wait for the content layer.
- For the first show (UC-2), one hand-made character, built outside the generation path. This is a small piece of art work, not a dependency on Layer 3.
- A check of how far Open3DBroadcast and VMC Live Link already cover this.
- Access to an optical studio for the real test. Until then, the optical story is tested against a recorded or simulated stream.

## Open questions

- Answered: the common skeleton is the UE5 mannequin skeleton (Manny). MetaHuman bodies already share it, and Character Creator, Tripo and other characters are retargeted to it with IK Retargeter.
- Answered: the portable inertial suit comes first, because it served past shows and is what a solo performer is likely to use.
- Answered: the 100 ms is measured end to end, from performer to rendered puppet and to each output, on the show's hardware. The first test puts a performer beside their character, to see what people notice (the epic's proposal). Settled in story-live-puppet-measure-delay.
- Answered: the optical story does not wait for a studio. story-live-puppet-optical-studio-stream is tested against a recorded or simulated stream, and the real test waits for studio access, as listed under Dependencies. Which optical system and studio come first is decided when a studio is booked.

## Out of scope

- Calibrating an optical studio's own system, which stays with the studio.
- Several performers, props and non-matching bodies, which belong to epic-shared-characters.
- Failure handling, which belongs to epic-handover-and-fallback.
