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

The first release connects to external systems through open protocols: OSC, MIDI and MIDI show control, DMX over Art-Net or sACN, PosiStageNet, NDI, Spout, SRT, SDI, and timecode. Syphon (Mac only) and product-specific profiles follow later.

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

A show can use any mix of five ways to fire cues: an ordered list stepped through by a stage manager; a free palette an operator fires in any order; performer-fired cues, through a gesture, controller, pedal or device; cues fired from timecode or a music track; and audience-fired cues, from one guest's action or from the combined action of many, in a live show or a self-guided experience (REQ-interaction-7). Performer-fired and audience-fired cues can be armed and disarmed by section of the show, so a stray gesture or an early crowd reaction does not fire one. Each show sets how combined action is counted, including its time window and threshold, and in a live show a performer or operator can overrule the result. A show that follows an external cue system (REQ-showcontrol-3) can still use free, performer-fired and audience-fired cues.

## REQ-showcontrol-11: Agents draft and revise cues

Agents can draft a cue list, including its branches, from the script or brief, and revise it from notes after each rehearsal. A person approves it at the gate (REQ-showcontrol-1). Agents make no cue changes once the show starts (REQ-workflow-9).

## REQ-showcontrol-12: Emergency stop

One control puts the whole show into a safe state: house lights come up where the show declares it, any headset guests see the real room or a safe view, projection and screens go to a safe view, sound and effects go to safe levels, and remote viewers see a holding screen. A venue's fire alarm can trigger it through an input. It works with no agent or internet. A person approves each show's safe state (REQ-workflow-7).

## REQ-showcontrol-13: Pause and resume

An operator can hold the show and carry on from the same place, for example after a technical problem or when a guest needs help.

## REQ-showcontrol-14: Jump to any cue

An operator can jump forward or back to any cue on any path, with the world in the right state for that cue. Where earlier branches change that state, the operator chooses which path the world reflects. This serves recovery during a show and cue-to-cue rehearsal, including rehearsal with recorded sessions when performers are absent (REQ-performance-9).

## REQ-showcontrol-15: Pre-show check

One check confirms that the build, capture sources, outputs, external links, venue profile and alignment (REQ-delivery-14) and any spare machine (REQ-delivery-13) are ready before doors open. A shorter check runs between sessions (REQ-showcontrol-19). The check can run automatically, with results sent to a person. Problems are listed in plain language.

## REQ-showcontrol-16: Routing control

Operators can see and change who or what drives each character and channel from the show tools, including live handover (REQ-performance-4). This is a first-release control.

## REQ-showcontrol-17 (later): Health and output monitors

Operators get a full view of capture and device health and a full monitor of the audience and every output. Until then, the first release has automatic fallback and the performer's signal (REQ-performance-6), the pre-show check (REQ-showcontrol-15), the audience summary (REQ-audience-6), and a basic output view (REQ-showcontrol-28).

## REQ-showcontrol-18: Solo operation

A solo performer can run a public show with no separate operator. Emergency stop, pause and handover are available as performer-fired controls that work while performing, and they cannot be disarmed. Guest moderation and safety (REQ-audience-8, REQ-audience-11) run on rules set before the show. Wherever a requirement names an operator, a solo show meets it through these controls or through those rules.

## REQ-showcontrol-19: Sessions and resets

A show can run any number of sessions. Several sessions can run at once as separate copies, each with its own guests, performers, cue position and reset. Between sessions, the world, characters and cues return to their starting state, guest data is cleared under the show's rules (REQ-governance-7), and the show confirms it is ready for the next session. Resetting can be done by one control or automatically. A one-way signal can tell a venue's own system or staff that the show is ready for its next session. Each session is recorded, so reports can count them. The target time between sessions is set from rehearsal (TBD).

## REQ-showcontrol-20: Branches and conditions

A cue can depend on a condition, such as a guest's action, a combined audience result, a character's state or elapsed time. A show can split into different paths and endings, and paths can rejoin. Every path is reviewed at the cue list gate, can be rehearsed, and has a scripted test. The cue tools stay simple enough for a stage manager or director to read: more complex logic is built in Unreal and appears in the cue list as a single condition, such as "puzzle solved".

## REQ-showcontrol-21: Unattended running

A self-guided show (REQ-interaction-7) can run with no staff present. It starts and stops on a schedule, runs its own pre-show check, and holds an idle state when no guests are present. After a crash or power cut, it restarts and returns to the idle state. When it cannot recover, it shows a safe holding state and alerts a named person, which needs a network connection. Unattended shows use screens, projection and similar outputs. A show with headsets needs at least an attendant.

An unattended show captures no guest data: it does not store or identify anyone's likeness, voice or body data. Like any show, it may react to a guest's presence (REQ-governance-7).

## REQ-showcontrol-22: Private cast and crew channel

Performers, operators and hidden crew can talk to each other by voice and text during a session. A basic channel is built in, and a venue's own intercom can connect to it. It works with no internet at the venue, and from inside a headset or suit. A remote helper can join it over the internet. Guests never hear it, and it never reaches any output. It is not recorded unless everyone on it has agreed.

## REQ-showcontrol-23: Show-level fallback

A show declares what continues if it loses a whole layer or link, such as a remote studio, a performer, an audience system or an AR layer. The rest of the show carries on, and a declared recording, loop or alternative scene can stand in. A recording of a performer can stand in for them only if their agreement allows it (REQ-governance-9). Each show decides whether and how guests are told. The plan, including that choice, is rehearsed, and a person approves it with the cue list.

## REQ-showcontrol-24 (later): Staggered groups in one world

Groups can share one world or space at different points in a show, each on its own clock. One emergency stop still reaches all of them. The first release must not prevent this.

## REQ-showcontrol-25: Live trim

An operator can apply a manual offset to alignment or calibration during a session, without stopping the show. Each change is logged under REQ-showcontrol-7. A show can plan offstage moments for a performer to recalibrate.

## REQ-showcontrol-26: Long-run maintenance

An unattended show (REQ-showcontrol-21) has a maintenance mode for staff, and keeps a log of failures and restarts. Before a long run, a soak test runs the show continuously for a set time, and the results are reviewed.

## REQ-showcontrol-27 (later): Further cue targets and sources

Cues can target guests, a single seat, and physical effects such as wind or scent. Physical effects need a safety interlock tied to the emergency stop (REQ-showcontrol-12). Shows can import MVR files, follow a script or score, and send channel data out as MIDI or OSC.

## REQ-showcontrol-28: Basic output view

Operators and attendants can see a wall of small thumbnails, one for each output, so a dark window or surface is spotted before a guest notices it.

## Constraints

- Systems named so far: ETC Eos, grandMA, generic DMX, Ableton Live, QLab, TouchDesigner, Resolume, disguise. The first show's actual systems are not yet named.

## Success measures

- A rehearsal run with each external system in turn as master completes with every cue firing on time within the show's accuracy.
- The emergency stop reaches its safe state in rehearsal with agents and internet disconnected.
- Time to build a show's cue list, compared with a past show chosen by the approver as the baseline (pending).
