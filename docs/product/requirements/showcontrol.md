---
id: requirements-showcontrol
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Show control and cues requirements

<!-- Source: discovery sections 6, 12, 14. -->

## REQ-showcontrol-1: Cue list

A show has a cue list that can be built, edited, rehearsed and run. The cue list is approved at a review gate before a public show.

## REQ-showcontrol-2: Cue targets

A cue can act on scenes, lighting, sound, characters (including transformation and driver handover), cameras, and audience-facing outputs.

## REQ-showcontrol-3: Master or follower

Each show states whether its cue list is the master or follows an external cue system. Changing this is a configuration change, not a rebuild.

## REQ-showcontrol-4: Open protocols

The first release connects to external systems through open protocols: OSC, MIDI and MIDI show control, DMX over Art-Net or sACN, NDI, Spout, and timecode. Syphon (Mac only) and product-specific profiles follow later.

## REQ-showcontrol-5: Standalone

A show can run with none of the external systems present, using Unreal alone.

## REQ-showcontrol-6: Operator surfaces

Operators can run the show from a touchscreen or tablet, a physical control surface, or a keyboard and mouse. Existing show-control systems (lighting consoles, audio and cue software) can drive or follow the show.

## REQ-showcontrol-7: Live changes need a person

Any change to cues or settings after the show starts requires a person at the show. It is logged with who made it.

## REQ-showcontrol-8: Timing

Cue timing accuracy is set per show (TBD) and measured in rehearsal.

## REQ-showcontrol-9: Test without hardware

Integrations are tested automatically against simulators or recorded sessions. Real consoles and audio systems are tested in rehearsal.

## REQ-showcontrol-10: Ways to fire cues

A show can use any mix of four ways to fire cues: an ordered list stepped through by a stage manager; a free palette an operator fires in any order; performer-fired cues, through a gesture, controller, pedal or device; and cues fired from timecode or a music track. Performer-fired cues can be armed and disarmed by section of the show, so a stray gesture does not fire one. A show that follows an external cue system (REQ-showcontrol-3) can still use free and performer-fired cues.

## REQ-showcontrol-11: Agents draft and revise cues

Agents can draft a cue list from the script or brief, and revise it from notes after each rehearsal. A person approves it at the gate (REQ-showcontrol-1). Agents make no cue changes once the show starts (REQ-workflow-9).

## REQ-showcontrol-12: Emergency stop

One control puts the whole show into a safe state: headset guests see the real room or a safe view, sound and effects go to safe levels, and remote viewers see a holding screen. It works with no agent or internet. A person approves each show's safe state (REQ-workflow-7).

## REQ-showcontrol-13: Pause and resume

An operator can hold the show and carry on from the same place, for example after a technical problem or when a guest needs help.

## REQ-showcontrol-14: Jump to any cue

An operator can jump forward or back to any cue, with the world in the right state for that cue. This serves recovery during a show and cue-to-cue rehearsal, including rehearsal with recorded sessions when performers are absent (REQ-performance-9).

## REQ-showcontrol-15: Pre-show check

One check confirms that the build, capture sources, outputs, external links and any spare machine (REQ-delivery-13) are ready before doors open. Problems are listed in plain language.

## REQ-showcontrol-16: Routing control

Operators can see and change who or what drives each character and channel from the show tools, including live handover (REQ-performance-4). This is a first-release control.

## REQ-showcontrol-17 (later): Health and output monitors

Operators get a full view of capture and device health and a full monitor of the audience and every output. Until then, the first release has automatic fallback and the performer's signal (REQ-performance-6), the pre-show check (REQ-showcontrol-15), and the audience summary (REQ-audience-6).

## REQ-showcontrol-18: Solo operation

A solo performer can run a public show with no separate operator. Emergency stop, pause and handover are available as performer-fired controls that work while performing, and they cannot be disarmed. Guest moderation and safety (REQ-audience-8, REQ-audience-11) run on rules set before the show. Wherever a requirement names an operator, a solo show meets it through these controls or through those rules.

## Constraints

- Systems named so far: ETC Eos, grandMA, generic DMX, Ableton Live, QLab, TouchDesigner, Resolume, disguise. The first show's actual systems are not yet named.

## Success measures

- A rehearsal run with each external system in turn as master completes with every cue firing on time within the show's accuracy.
- The emergency stop reaches its safe state in rehearsal with agents and internet disconnected.
- Time to build a show's cue list, compared with a past show chosen by the approver as the baseline (pending).
