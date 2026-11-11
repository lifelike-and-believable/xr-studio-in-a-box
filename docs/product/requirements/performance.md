---
id: requirements-performance
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Performance capture and control requirements

<!-- Source: discovery sections 3, 4, 6, 10. -->

## REQ-performance-1: Pluggable capture

A character can be driven by any supported capture source through one interface: optical studio capture, inertial suit, headset and hand controllers, and webcam or phone. Adding a source does not change the characters or shows that use the interface.

## REQ-performance-2: Channels and sources

A character's performance is divided into channels: body, hands, face, voice, gaze and attention, form and transformation (morphs, scale, proportions), effects and materials (particles, glow, colour), and world position and travel (moving a character beyond the performer's physical space). Camera and prop channels are used where a show needs them. Each channel is assigned to one source, and several performers can share one character by owning different channels.

## REQ-performance-3: Drivers on a spectrum

Each channel can be driven by full-body capture, by a device, or by AI, and control can pass between any two of these in either direction while the show runs. In the first release, AI fills channels and holds poses (REQ-characters-3, REQ-performance-6). Handing a performer's channel to AI mid-scene comes later (REQ-characters-11).

## REQ-performance-4: Live handover

Changing a channel's driver does not stop the show, restart a system, or cause a visible jump. The change can be triggered by a performer, an operator or a cue. Each handover chooses its method: a blend over a set time, a pose match before switching, or a cover behind an effect or transformation. A handover with no method chosen uses a default blend, so it can never be a hard cut by accident.

## REQ-performance-5: Performer loop latency

From a performer's movement to the rendered puppet takes under 100 ms on the show's target hardware. This is a working value until it is tested on the first real show. The pipeline measures it and shows the result, including the delay to what the audience sees on each output. A show with a performer visible beside their character sets a tighter target, from what people notice in rehearsal (TBD). Delay for stream viewers may be seconds (REQ-audience-10).

## REQ-performance-6: Fallback on failure

If a source drops, each affected channel switches to its defined fallback (another source, a recording or loop, an AI-held pose or a safe hold) automatically and tells the performer in a way they can perceive without breaking character. The time to switch is measured for each capture source in rehearsal with real device failures, and the target is set from those results (TBD).

## REQ-performance-7: Props and tracked objects

Tracked props and objects can drive characters, effects or cues in the same way as performer bodies.

## REQ-performance-8: Any number of performers and characters

One performer with one character is a case of any number of performers and characters. The pipeline supports the growth path from a solo performer to several performers on several characters, including several performers on one character.

## REQ-performance-9: Session recording

Capture sessions are recorded so they can be replayed, cleaned up and used in rehearsal or tests. Recording and each use follow the performer's agreement (REQ-governance-9).

## REQ-performance-10: Network streaming

Performance data can be sent over the network between machines and between venues in real time, in a documented open format.

## REQ-performance-11: Setup and calibration

Each capture source has a guided setup and calibration, usable by a capture operator who is not a pipeline engineer.

## REQ-performance-12: Characters without a matching skeleton

A capture source can drive a character whose body does not match the performer's, by any of four methods: mapped puppeteering (chosen body parts drive chosen character parts); parameter mapping (motion drives values such as energy, size or colour); performer intent with a procedural body (the performer drives position and intent, and procedural or AI motion fills in the rest); and automatic retargeting to the nearest body plan with manual correction. A mapping is a saved, reviewable asset that can be rehearsed, reused and changed by a technical artist without code.

## REQ-performance-13: Live signal sources

Live signals that are not capture, such as audio analysis, MIDI, OSC, DMX and sensor data, can continuously drive a channel in the same way as a capture source. The mapping is a saved, reviewable asset (REQ-performance-12). If a signal drops, the channel uses its fallback (REQ-performance-6). The acceptable delay is set per show (TBD). Sensor data from a performer's body falls under their agreement (REQ-governance-9).

The audience's combined reaction (REQ-audience-6) can also be a signal, for effects, materials and scene values. Characters reacting to individual guests stay in REQ-characters-9.

## REQ-performance-14: Legibility

A show can set a quality bar for channels where accuracy carries meaning, such as hands and face for signing. The bar is tested in rehearsal. Lower-detail versions (REQ-content-7) and fallbacks must not break it without warning: if a channel falls below the bar, the audience and performer are told, and the channel does not fill the gap with AI motion.

## REQ-performance-15: Performer swap

A different performer can take over a role between sessions. Each performer's calibration and mappings are saved, so a swap needs no rebuild, and each performer has their own agreement (REQ-governance-9).

## REQ-performance-16: Performer return feeds

A performer can sense the audience while performing, through any mix of a live room view, venue audio and the audience summary (REQ-audience-6). The summary can also reach them through physical signals such as lights, so a performer does not need to look at a screen. Each show declares which it uses. A live room view and venue audio follow REQ-governance-7, and a live room view and can use a silhouette or depth view where a show wants to reveal less.

## REQ-performance-17: Live motion quality

A show sets a quality bar for live motion, covering limbs passing through bodies, foot contact and held props. Any correction stays within the show's delay target.

## REQ-performance-18: Remote performer

A performer in another location can drive a character in a show over the internet (REQ-performance-10). Their own view stays within REQ-performance-5, and the delay to the show is measured and shown. If the link drops, the show-level fallback applies (REQ-showcontrol-23). Two or more venues sharing one world stay in REQ-delivery-4.

## REQ-performance-19: Guest presence source

Sensors such as floor pads, beams or depth sensors can report that guests are present, with calibration and a fallback. A simulated crowd can stand in for testing and rehearsal. Presence data follows REQ-governance-7, and is used live only.

## Constraints

- Past work used both a high-end optical studio and a portable inertial suit, so both are required tiers.
- The approver's existing components (Open3DBroadcast, VMC Live Link) are to be reused where they fit. How far they cover this is unchecked.

## Success measures

- REQ-performance-5 holds in rehearsal measurements.
- A source can be unplugged in rehearsal and the fallback takes effect with no show stop.
