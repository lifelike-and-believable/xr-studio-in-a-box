---
id: story-sound-path-place-sound
status: approved
derived-from:
  - epic-sound-path#outcome: 3f3e81a83f45
  - persona-sound-designer#goals: 70f155e30dc6
---

# Place sound in the world and hear it spatially

As Drew, the sound designer, I want to place sound in the world and hear it spatially on targets that support it so that I hear it as a guest would on each target.

## Acceptance criteria

- Drew can attach a sound asset to a position, a character or an object in a level in the Unreal Editor, and set its range and how it fades with distance, without code.
- The first spatial formats are binaural for headsets and stereo for the stream and the browser. The first show (UC-2) has a hybrid room, so the room's sound system, stereo first, is also a first output. Its layout is saved in the venue profile (story-venue-setup-venue-profile), and other speaker layouts are added per venue.
- Drew can listen from a guest's position or from a stream camera, in binaural or stereo, in the Unreal Editor or on the target's test device named in its budget file (story-asset-checks-check-against-budget). A delivered build (story-build-and-install-build-from-stages) is not needed.
- Placed sound is checked against the budget file of each target the project uses, which the director or their delegate sets (story-asset-checks-check-against-budget). A failure is shown to Drew in text.
- Placed sound plays with every agent and the internet disconnected.
