---
id: requirements-performance
status: draft
derived-from:
  - concept#vision:
---

# Performance capture and control requirements

<!-- Draft. Source: discovery sections 3, 4, 6, 10. -->

## REQ-performance-1: Pluggable capture

A character can be driven by any supported capture source through one interface: optical studio capture, inertial suit, headset and hand controllers, and webcam or phone. Adding a source does not change the characters or shows that use the interface.

## REQ-performance-2: Channels and sources

A character's performance is divided into channels: body, hands, face, voice, gaze and attention, form and transformation (morphs, scale, proportions), effects and materials (particles, glow, colour), and world position and travel (moving a character beyond the performer's physical space). Camera and prop channels are used where a show needs them. Each channel is assigned to one source, and several performers can share one character by owning different channels.

## REQ-performance-3: Drivers on a spectrum

Each channel can be driven by full-body capture, by a device, or by AI, and control can pass between any two of these in either direction while the show runs.

## REQ-performance-4: Live handover

Changing a channel's driver does not stop the show, restart a system, or cause a visible jump. The change can be triggered by a performer, an operator or a cue. Each handover chooses its method: a blend over a set time, a pose match before switching, or a cover behind an effect or transformation. A handover with no method chosen uses a default blend, so it can never be a hard cut by accident.

## REQ-performance-5: Performer loop latency

From a performer's movement to the rendered puppet takes under 100 ms on the show's target hardware. The pipeline measures it and shows the result. Delay for viewers may be seconds.

## REQ-performance-6: Fallback on failure

If a source drops, each affected channel switches to its defined fallback (another source, an AI-held pose or a safe hold) automatically and tells the performer in a way they can perceive without breaking character. The time to switch is measured for each capture source in rehearsal with real device failures, and the target is set from those results (TBD).

## REQ-performance-7: Props and tracked objects

Tracked props and objects can drive characters, effects or cues in the same way as performer bodies.

## REQ-performance-8: Any number of performers and characters

One performer with one character is a case of any number of performers and characters. The pipeline supports the growth path from a solo performer to several performers on several characters, including several performers on one character.

## REQ-performance-9: Session recording

Capture sessions are recorded so they can be replayed, cleaned up and used in rehearsal or tests.

## REQ-performance-10: Network streaming

Performance data can be sent over the network between machines and between venues in real time, in a documented open format.

## REQ-performance-11: Setup and calibration

Each capture source has a guided setup and calibration, usable by a capture operator who is not a pipeline engineer.

## REQ-performance-12: Characters without a matching skeleton

A capture source can drive a character whose body does not match the performer's, by any of four methods: mapped puppeteering (chosen body parts drive chosen character parts); parameter mapping (motion drives values such as energy, size or colour); performer intent with a procedural body (the performer drives position and intent, and procedural or AI motion fills in the rest); and automatic retargeting to the nearest body plan with manual correction. A mapping is a saved, reviewable asset that can be rehearsed, reused and changed by a technical artist without code.

## Constraints

- Past work used both a high-end optical studio and a portable inertial suit, so both are required tiers.
- The approver's existing components (Open3DBroadcast, VMC Live Link) are to be reused where they fit. How far they cover this is unchecked.

## Success measures

- REQ-performance-5 holds in rehearsal measurements.
- A source can be unplugged in rehearsal and the fallback takes effect with no show stop.
