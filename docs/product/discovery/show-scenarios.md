---
id: discovery-show-scenarios
status: draft
---

# Show scenarios: a test of the requirements

This is a desk check made on 2026-11-06. Eleven invented shows were walked from brief to final performance against the requirements, including the draft changes on the branch `requirements/design-disciplines`. It tests what the text says, not what has been built. Layers 3 to 7 have no epics yet, so a "supported" rating means a requirement exists, not that the work is designed.

Ratings: **supported**, **partly** (works, with real holes), **gap** (the show cannot be made as described), **later** (deliberately deferred, with room left for it).

## Results

| # | Show | Rating | Main reason |
|---|---|---|---|
| 1 | Living room puppet | Supported | Live voice effects are the one hole |
| 2 | Touring family adventure | Partly | No repeat sessions, venue adaptation or real-room safety |
| 3 | Concert with a creature | Partly | Music cannot drive a channel |
| 4 | The flock decides | Partly | No branching show structure |
| 5 | Museum gallery piece | Gap | Conversation is later, and nothing covers unattended running |
| 6 | Weekly serial world | Gap | Nothing persists between shows |
| 7 | Signed and described | Partly | Accessibility stops at captions, and hand quality has no measure |
| 8 | Stage and screen hybrid | Supported | Stage alignment is the one hole |
| 9 | Phone AR city walk | Gap | No native mobile or AR target |
| 10 | Duet from two cities | Later | `REQ-delivery-4` defers it, and room is left |
| 11 | Brand commission | Supported | Live improvisation is not bound by brand terms |

## Show by show

### 1. Living room puppet

One performer in an inertial suit improvises a weekly livestream from home, with no crew.

- **Holds up:** solo operation (`REQ-showcontrol-18`), the free cue palette (`REQ-showcontrol-10`), stream destinations (`REQ-delivery-12`), chat and the audience summary (`REQ-audience-6`, `REQ-audience-8`), and rules set before the show.
- **Holes:** a character's voice cannot be transformed live. Voice is a channel, but no requirement covers processing it.

### 2. Touring family adventure

Eight guests in headsets meet a live actor playing their guide, six sessions a day, in a different venue each month.

- **Holds up:** staff-installed builds (`REQ-delivery-6`), touring logistics (`REQ-business-10`), minors (`REQ-audience-13`), emergency stop, pre-show check.
- **Holes:**
  - Nothing covers resetting the show for the next group, or what "the show ends" means when it runs six times a day (see finding A).
  - Nothing adapts a show to a venue's room size and layout.
  - `REQ-audience-11` keeps avatars apart, but nothing stops guests walking into walls or each other.
  - No second actor can take over a role through a defined swap, for example between sessions.
  - Standalone headsets are later (`REQ-delivery-9`), but UC-1 is touring LBVR with immediate priority. A free-roaming group would need wireless PC VR or backpacks in the first release.
  - An attendant cannot see what a guest sees until the output monitors arrive (`REQ-showcontrol-17`, later).

### 3. Concert with a creature

A live band plays while a huge creature reacts to the music and to a dancer in a suit, for a venue crowd and thousands on the stream.

- **Holds up:** creatures (`REQ-characters-2`), mapping a dancer onto a different body (`REQ-performance-12`), timecode, MIDI and OSC cues, one source to many outputs (`REQ-delivery-3`).
- **Holes:**
  - Sources are capture devices (`REQ-performance-1`). Live audio analysis, MIDI or OSC can fire cues but cannot continuously drive a channel.
  - `REQ-content-14` covers live voices, but not a band's feed from the venue's mixing desk into the stream mix.

### 4. The flock decides

Remote guests play a flock whose choices steer the story down different paths to different endings.

- **Holds up:** playable characters (`REQ-audience-2`), audience-fired cues (`REQ-showcontrol-10`), remote tiers (`REQ-audience-10`).
- **Holes:**
  - The cue list is ordered or free. Nothing covers branches, conditions or several endings, or how they are reviewed, rehearsed and tested.
  - Jumping to a cue (`REQ-showcontrol-14`) assumes one right world state, but after branches the state depends on the path taken.
  - Nothing defines how combined action is counted: the time window, the threshold, or who can overrule a result.
  - `REQ-audience-4` promises "a large simplified remote crowd in one world", but stream viewers are not in the world and interactive guests are capped (see finding G).
  - Crowds and creatures reacting to avatars are later (`REQ-characters-9`), so autonomous characters could respond only through cues.

### 5. Museum gallery piece

A self-guided installation runs for six months with no staff, and the public talks to a character.

- **Holds up:** the zero case (`REQ-interaction-7`), offline running, scripted fallbacks (`REQ-characters-5`), content limits (`REQ-characters-8`).
- **Holes:**
  - Talking with the public is conversational AI, which is later (`REQ-characters-9`). The first release can make this piece only without conversation.
  - Nothing covers starting and stopping on opening hours, recovering from a crash or power cut with no one there, an idle state when no one is present, or telling someone off-site that it failed. Monitoring and remote updates are both later.
  - The pre-show check assumes a person "before doors open".
  - A walk-up public, including children, does not fit consent recorded per show with a guardian present (`REQ-governance-7`, `REQ-audience-13`).

### 6. Weekly serial world

Guests return each week to a world that remembers what they did, and their characters keep their progress.

- **Holds up:** rejoining with the same avatar within one show (`REQ-audience-14`), the gated public build.
- **Holes:**
  - Nothing keeps world state or guest progress between shows.
  - A guest has only a link or code, so nothing identifies them next week. Ticketing is out of scope.
  - Guest data is kept out of backups (`REQ-governance-7`), so saved progress would need its own store and its own consent.

### 7. Signed and described

A Deaf performer signs through a character's hands, with audio description for blind guests.

- **Holds up:** the hands channel, captions (`REQ-audience-12`), and a fallback signal the performer "can perceive" (`REQ-performance-6`), which rightly does not assume sound.
- **Holes:**
  - `REQ-audience-12` stops at captions, seating and low motion. Nothing covers audio description, sign interpretation or a non-visual route through the experience.
  - Captions of improvised speech must run live, offline and with an AI service's fallback, and no requirement says how.
  - Only delay is measured (`REQ-performance-5`). For signing, finger and face accuracy carries the meaning, and nothing sets a quality bar.
  - Lower-detail versions (`REQ-content-7`) or a hold on the hands (`REQ-performance-6`) could make signing unreadable.
  - No requirement covers languages, spoken or signed, although touring shows are expected.
  - Nothing says the production and show tools are accessible to a Deaf or disabled team member.

### 8. Stage and screen hybrid

Actors on a physical stage play opposite a projected puppet, in a theatre with a stage manager and a lighting console.

- **Holds up:** nearly all of show control: master or follower, open protocols, operator surfaces, emergency stop, projection output. This is the best-covered show.
- **Holes:**
  - Nothing covers aligning the virtual world with the physical stage, or how actors see the puppet they are playing with.
  - The safe state (`REQ-showcontrol-12`) names headsets, sound, effects and remote viewers, but not projection.

### 9. Phone AR city walk

A self-guided walk through a city with characters placed in real locations, seen through a phone.

- **Holds up:** the workflow, gates and provenance apply as usual.
- **Holes:** phones are served only by cloud-rendered stream (`REQ-delivery-1`), which cannot do AR. Nothing mentions AR, mixed reality, passthrough or location. The concept says "mobile", so the decision should be explicit.

### 10. Duet from two cities

Two dancers perform together from different cities.

- **Holds up:** `REQ-delivery-4` defers this and `REQ-performance-10` streams between venues, so room is left. UC-4 depends on it.
- **To check at design time:** which site holds cue authority, and whether one emergency stop reaches both.

### 11. Brand commission

A show made for a brand that controls its own characters.

- **Holds up:** the policy record, sign-offs, limited collaborator access, contracts and quotes. This side is strong.
- **Holes:**
  - Content limits bind autonomous characters (`REQ-characters-8`). Nothing tells a performer improvising a brand's character what is off limits.
  - Terms have dated history but no end date, so nothing flags an asset when its licence expires.
  - Nothing covers handing source assets to a client at the end of a project.

## Findings across shows

| ID | Finding | Shows | Proposal |
|---|---|---|---|
| A | "Show" means both the production and a single run. Consent, deletion, resets and reports all depend on which. | 1, 2, 5, 6 | Define **production** and **session**, then add a requirement for repeat sessions and resets. First release. |
| B | The show structure cannot branch, although self-guided work depends on it. | 4, 5, 6 | Add branching and conditional cues, with review, rehearsal and tests. First release. |
| C | Only capture devices can continuously drive a channel. | 3 | Allow audio analysis and external data such as MIDI and OSC as sources. First release. |
| D | The physical room is not modelled. | 2, 5, 8 | Add venue adaptation, real-room guest safety and stage alignment. First release. |
| E | Unattended running is unspecified, so the zero case is thinner than it reads. | 5 | Add a basic scheduled start, automatic recovery, idle state and failure alert. First release. |
| F | Accessibility stops at captions, and quality is not measured for hands and faces. | 7 | Widen `REQ-audience-12`, add a language requirement, and add a per-show legibility bar. First release for the minimum; the rest later. |
| G | `REQ-audience-4` and `REQ-audience-10` disagree on whether the huge remote crowd is in the world. | 4 | Say that stream viewers are shown in the world as a simulated crowd driven by their reactions, if that is the intent. |
| H | Conversation with the public is later, so the museum piece cannot talk. | 5 | Keep it later. Accept that limit. |
| I | Persistence between sessions is missing. | 6 | Mark it later, with room left for it. |
| J | Native mobile, AR and mixed reality are undecided. | 9, 2 | Mark them later, and state that "mobile" in the first release means stream. |
| K | Standalone headsets are later, but UC-1 is immediate. | 2 | Leave it for the UC-1 hardware decision, and note the wireless limit. |
| L | Performer-driven characters have no content limits, and licences have no end date. | 11 | Add a performer brief to the character's terms, and add end dates to terms. First release. |
| M | Smaller holes: live voice effects, a venue desk feed in the mix, a safe state for projection, and a defined swap between performers. | 1, 2, 3, 8 | Fold into the matching requirements. |

## Decisions

The approver ruled on each finding on 2026-11-06. The ratings above are from before these changes.

| ID | Decision | Where |
|---|---|---|
| A | Terms defined as project, show and session. Guest data is deleted at the end of each session. | Terms in `requirements-workflow`, `REQ-showcontrol-19`, `REQ-governance-7` |
| B | Shows can branch. Cue tools stay simple, and complex logic is built in Unreal. | `REQ-showcontrol-20`, `REQ-showcontrol-10`, `REQ-showcontrol-14` |
| C | Live signals can drive channels, including combined audience reaction for effects, materials and scene values. | `REQ-performance-13` |
| D | A show declares the space it needs, and does not reflow to fit a room. | `REQ-delivery-14`, `REQ-delivery-15`, `REQ-audience-16` |
| E | Unattended running is added. Unattended shows capture no guest data and do not use headsets. | `REQ-showcontrol-21` |
| F | Accessibility minimum in the first release. Live translation is later, and sign language is never generated by AI. | `REQ-audience-12`, `REQ-audience-17`, `REQ-audience-18`, `REQ-performance-14`, `REQ-workflow-18` |
| G | Stream viewers can appear in the world as a simulated crowd. | `REQ-audience-4` |
| H | Conversation with guests stays later. Set questions with scripted answers are possible through branches. | No change |
| I | Persistence between sessions is later. | `REQ-audience-19` |
| J | Native mobile, AR and mixed reality are later. In the first release, mobile means stream. | `REQ-delivery-16`, `REQ-delivery-1` |
| K | Standalone headsets stay later, pending the UC-1 hardware decision. | Constraints in `requirements-delivery` |
| L | Performer brief added, and terms can have end dates. Client handover is later. | `REQ-governance-10`, `REQ-governance-1`, `REQ-business-18` |
| M | All four folded in. | `REQ-content-14`, `REQ-showcontrol-12`, `REQ-performance-15` |

## Second round: real productions

A second round tested ten scenarios based on real productions in live VR theatre, virtual concerts, LBVR, digital puppetry, broadcast AR, domes and long-running installations. The approver ruled on the results. Public evidence on latency, failures and budgets was very thin, so benefits were inference and first measured shows matter more than further desk research.

| Topic | Decision | Where |
|---|---|---|
| Cast and crew channel | A basic channel is built in, and venue intercoms can connect. | `REQ-showcontrol-22` |
| Return feeds | Added. A live, unrecorded room view needs a notice, not each guest's consent. | `REQ-performance-16`, `REQ-governance-7` |
| Pre-show | A standard pre-show that a show can restyle. Required steps always come first. | `REQ-audience-20` |
| Show-level fallback | Added. Each show decides whether guests are told. | `REQ-showcontrol-23`, `REQ-performance-6` |
| Player guests | A third remote tier for mass browser audiences. | `REQ-audience-10`, `REQ-delivery-11` |
| Concurrent sessions | Separate copies in the first release. Staggered groups in one world are later. | `REQ-showcontrol-19`, `REQ-showcontrol-24` |
| Multi-surface output | Uses Unreal's tools or a venue's media server. | `REQ-delivery-17` |
| Broadcast | A profile for small productions is later. SRT and SDI are added now. | `REQ-delivery-18`, `REQ-showcontrol-4` |
| Live trim, welfare, character lock | Added. | `REQ-showcontrol-25`, `REQ-audience-12`, `REQ-business-9`, `REQ-content-15` |
| Delay and motion quality | Measure first. The 100 ms is a working value. | `REQ-performance-5`, `REQ-performance-17` |
| Headsets, guest roles, maintenance | Added. | `REQ-delivery-19`, `REQ-audience-21`, `REQ-showcontrol-26` |
| Rendered export, replay, LBVR platforms, further cues | Later. PosiStageNet and DMX into channels are added now. | `REQ-delivery-20`, `REQ-delivery-21`, `REQ-delivery-22`, `REQ-showcontrol-27`, `REQ-showcontrol-4`, `REQ-performance-13` |
| Social platforms, paid tiers | Running inside a social platform is declined for now. A join code can carry a tier. | Constraints in `requirements-delivery`, `REQ-audience-14` |
| Remote performer | One remote performer in a show is in the first release. | `REQ-performance-18`, `REQ-delivery-4`, `REQ-delivery-5` |
| Headset targets | Wireless PC VR counts as PC VR. Home headsets are their own decision. | `REQ-delivery-9` |
| Capacity and venue time | Capacity figures join the project facts, and on-site hours are tracked. | `REQ-business-1`, success measures in `requirements-workflow` |

| Guests with no device | Headsets, avatars and guest devices are options, and a show can have none. Anonymous presence reaction and a guest presence source are in the first release, and "body data" is defined, pending legal review. | Introduction to `requirements-audience`, `REQ-characters-12`, `REQ-performance-19`, `REQ-governance-7` |
| Walking guests | Safety covers any guests moving through a space. The safe state adds house lights and a fire alarm input. | `REQ-audience-16`, `REQ-showcontrol-12` |
| Outputs and flow | A basic output view, and a one-way "ready for next session" signal. | `REQ-showcontrol-28`, `REQ-showcontrol-19` |

**Plans for the first shows:** test UC-2 with one remote helper from the start, through the crew channel, and keep `REQ-showcontrol-18` as the base case. Model UC-1's staffing before choosing hardware.
