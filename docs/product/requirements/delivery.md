---
id: requirements-delivery
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Delivery and deployment requirements

<!-- Source: discovery sections 6, 10, 13. LBVR hardware is undecided. -->

## REQ-delivery-1: First-release targets

The first release delivers to Windows PC (desktop and PC VR, including flat video livestream and projection output) and to browser or mobile stream. In the first release, mobile means stream: phones do not run a show natively (REQ-delivery-16).

## REQ-delivery-2: One show, scaled

One authored show runs on every supported target, with lower-detail versions for weaker devices (see REQ-content-7). A show is not rebuilt per target.

## REQ-delivery-3: One live source, many outputs

A single live performance feeds several outputs at the same time, including stage projection, in-venue headsets, flat livestream, and browser and mobile clients.

## REQ-delivery-4 (later): Multi-location

Two or more venues can join one shared world, with performers and audience present in it. The first release runs from one location, apart from a remote performer (REQ-performance-18), and the architecture must not prevent this. Performers in distant venues will see each other with a delay, though each performer's own loop still meets REQ-performance-5.

## REQ-delivery-5: Offline

Every function performers, operators and the venue audience need during a show works on the venue network with no internet. Only what reaches remote audiences needs internet and cloud services. If those fail, the show continues in the venue (REQ-audience-15). The one exception is a show with a remote performer (REQ-performance-18), which declares that it depends on that link and has a fallback for losing it.

## REQ-delivery-6: Staff-installed builds

A technician can install a versioned build on a venue system, check it, and roll back to the previous build.

## REQ-delivery-7: Engine and plugin versions

Each build records the engine and plugin versions it uses. When a target needs a different version from another, the difference is shown and managed rather than found at build time.

## REQ-delivery-8: Performance budgets

Each target has a performance budget (frame rate, memory, load time) set by the approver (TBD). Builds are measured against it automatically.

## REQ-delivery-9 (later): Standalone headsets

Shows rendered on a standalone headset are not part of the first release. Wireless PC VR, which streams from a PC, counts as a PC VR target in the first release (REQ-delivery-1). Content and rigs are built so a standalone target can be added. The hardware decision for LBVR depends on the venue and partner (pending). Standalone headsets at home are a separate decision. In the first release, home headset guests use PC VR only.

## REQ-delivery-10 (later): Remote updates and fleet management

Pushing builds to remote venues, monitoring them, and managing fleets of headsets are later. They follow staff-installed builds.

## REQ-delivery-11: Interactive guest access

Interactive guests (REQ-audience-10) on PC and PC VR join through an installed app. Interactive guests on browsers and phones each get a cloud-rendered session of the same show, which is kept for the few guests who need to be in the world. A mass browser or phone audience joins as player guests. Each show sets a limit on cloud sessions, and their cost is tracked (REQ-workflow-6). Guests past the limit join as player guests or stream viewers.

## REQ-delivery-12: Livestream destinations

Each show sends its flat livestream to public platforms, to its own player page, or to both. Chat and reactions (REQ-audience-8) are read from whichever the show uses. Going live on a public platform needs a person's approval (REQ-workflow-7).

## REQ-delivery-13: Show machine failure

Each show chooses what happens if a main show computer fails: a quick restart that resumes at the last cue, a warm spare machine, or a live spare that takes over at once. An unattended show returns to its idle state instead (REQ-showcontrol-21). The chosen level is tested in rehearsal. Restart and takeover time targets are TBD.

## REQ-delivery-14: Venue profiles and alignment

Each venue has a saved profile of its space, boundaries, obstacles, outputs and network. A show declares the space it needs, and may have hand-made layouts for different venue sizes, which agents can draft. A show does not rearrange itself to fit a room, so every layout can be rehearsed and approved. A guided step aligns the virtual world with the room or stage, and the result is saved for that venue.

## REQ-delivery-15: Seeing the virtual from the stage

Performers and actors who share a stage with virtual characters can see what they are playing opposite, through a monitor, a headset or another view the show sets.

## REQ-delivery-16 (later): Native mobile, AR and mixed reality

Shows can run natively on phones, and can place virtual content in the real world through phone AR or headset passthrough. This includes location-based experiences. The first release must not prevent it.

## REQ-delivery-17: Multi-surface output

A show can output to several projectors or surfaces, with the geometry, mirroring and brightness of each output saved in the venue profile (REQ-delivery-14). It does this through Unreal's own multi-display tools where they fit, or by sending video to a venue's media server over NDI or Spout. The pipeline does not build its own warping and blending tools.

## REQ-delivery-18 (later): Broadcast profile

A small production can composite virtual content onto tracked real cameras without a specialist vendor, using lens and camera tracking data, genlock and live video as a layer. Until then, a show that needs this hands its video and timecode to a specialist broadcast or XR system. The show's own virtual cameras can be cut live by cue in the first release (REQ-showcontrol-2).

## REQ-delivery-19: Headset list

In a show that uses headsets, attendants see a plain list of them, with each one's charge, assigned guest, cleaned or not, and connection. An attendant can open a live view of any one guest's headset. This is far smaller than REQ-delivery-10. It is built first for the first release's PC VR kit. Standalone headsets and UC-1's touring kit follow once that hardware is chosen.

## REQ-delivery-20 (later): Rendered export

A show or section can be exported as rendered media for a media server. A brief can choose live or rendered for each section.

## REQ-delivery-21 (later): Audience replay

A recorded live show can be replayed to audiences, in the engine or as video, subject to rights and each performer's agreement (REQ-governance-9).

## REQ-delivery-22 (later): Third-party LBVR platforms

A show can be offered through a third-party LBVR platform or partner. Venue profiles (REQ-delivery-14) align with venue standards such as Japan's LBEC specification once they settle.

## Constraints

- Unreal Engine is the engine. Plugin and engine version compatibility differs by target and must be checked before a target is chosen.
- How well Unreal's multi-display tools cover domes and blended projection in the chosen engine version is unchecked (pending).
- A free-roaming headset group in the first release needs wireless PC VR or backpack computers, because standalone headsets are later (REQ-delivery-9). The hardware decision for UC-1 may bring standalone headsets forward, which would change the first release's budgets and character detail (pending).
- Meta's 2026 change to its commercial headset programme and plugin support for the chosen engine version are unchecked (research notes).
- Shows run in the project's own build. Running a show inside a social platform such as VRChat is declined for now. Livestreams still go to public platforms.
- Public platforms apply their own terms, for example on music and chat data. Each show checks them against its policy record (REQ-governance-1).

## Success measures

- A show builds once and runs on each first-release target within its budget.
- A venue with its internet disconnected runs a full show for its venue audience.
- A simulated audience at each release's target counts (REQ-audience-4) connects with the performer loop still inside REQ-performance-5.
