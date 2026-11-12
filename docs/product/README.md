# Product map

Every epic and story, grouped by layer. This page is generated, so change the epics or stories and run `node scripts/product-index.mjs`.

39 epics, 248 proposed stories, 245 written, 0 open questions.

- [Concept](concept.md)
- [Requirements](requirements/)
- [Personas](personas/)
- [Show scenarios](discovery/show-scenarios.md)

## Layer 1, project backbone

| Epic | Stories written | Open questions |
|---|---|---|
| [Direct agents safely](epics/agent-work.md) | 6 of 6 | 0 |
| [One project, one set of facts](epics/project-record.md) | 6 of 6 | 0 |
| [Keep the terms, and know where every asset came from](epics/provenance-and-policy.md) | 6 of 6 | 0 |
| [Review, approve and see where everything stands](epics/review-and-status.md) | 6 of 6 | 0 |

<details>
<summary>Direct agents safely</summary>

- [Limit what an agent can reach](stories/agent-work/agent-permissions.md) (approved)
- [Direct an agent in conversation](stories/agent-work/direct-an-agent.md) (approved)
- [Add a step, integration or check](stories/agent-work/extend-the-workflow.md) (approved)
- [Read what agents did](stories/agent-work/read-activity-log.md) (approved)
- [Stop spend at the limit](stories/agent-work/spend-limit.md) (approved)
- [Reach a tool through an adapter](stories/agent-work/tool-adapter.md) (approved)

- Direct an agent in conversation on a project task.
- Read an activity log that names the project, stage, tool and the person who requested or approved each action.
- Grant an agent access to chosen projects, tools and folders, and see that it cannot delete approved work, change roles or limits, or send anything outside the project.
- Set a spend limit, with metered work blocked until one is set, and have an agent stop and ask when a request would pass it.
- Add a workflow step, integration or check without modifying the core, versioned and reviewed like other work.
- Reach an external tool through an adapter, and replace it without rewriting the workflow.

</details>

<details>
<summary>One project, one set of facts</summary>

- [Add a person with a role](stories/project-record/add-person.md) (approved)
- [Back up and restore a project](stories/project-record/back-up-and-restore.md) (approved)
- [Name approvers and delegates](stories/project-record/name-approvers.md) (approved)
- [Record the project's facts](stories/project-record/record-facts.md) (approved)
- [See the same project state everywhere](stories/project-record/same-project-state.md) (approved)
- [Start a new project](stories/project-record/start-project.md) (approved)

- Start a new project with a name, a brief and an owner.
- Record and edit the project's facts: description, plan, budget, credits, collaborators, schedule and samples.
- Add a person and give them a role, with no code or configuration files.
- Name approvers and delegates per area, and record who holds each of the four kinds of approval that never go to an AI.
- See the same project state in the web dashboard and in chat, with the dashboard meeting WCAG 2.2 AA.
- Back up a project, including large binary assets, and restore an earlier version.

</details>

<details>
<summary>Keep the terms, and know where every asset came from</summary>

- [Block generation that breaks a term](stories/provenance-and-policy/block-generation.md) (approved)
- [Sign off through a limited page](stories/provenance-and-policy/collaborator-sign-off.md) (approved)
- [Choose what happens with no AI term](stories/provenance-and-policy/no-term-choice.md) (approved)
- [Keep every asset's history](stories/provenance-and-policy/provenance-record.md) (approved)
- [Hold generated work at the quality and licence gate](stories/provenance-and-policy/quality-and-licence-gate.md) (approved)
- [Record a collaborator's terms](stories/provenance-and-policy/record-terms.md) (approved)

- Record a collaborator's terms in the project's policy record, with a dated history and optional end dates that flag the assets they cover.
- Choose what the gate does when a collaborator has recorded no AI term.
- Block a generation request that breaks a term, and say which term blocked it.
- Attach a provenance record to every asset as it enters the project, with restricted access to prompts and reference inputs.
- Hold a generated asset out of the project until its quality checks and licence status are recorded.
- Review and sign off a shared item through a limited page, with who and when recorded.

</details>

<details>
<summary>Review, approve and see where everything stands</summary>

- [Accept, revise or reject work](stories/review-and-status/decide-on-items.md) (approved)
- [Give feedback and compare versions](stories/review-and-status/feedback-and-versions.md) (approved)
- [Hold work at a gate until a person approves](stories/review-and-status/hold-gated-hand-off.md) (approved)
- [Be told when something is waiting](stories/review-and-status/notifications.md) (approved)
- [See every pending approval in one queue](stories/review-and-status/see-review-queue.md) (approved)
- [See where everything stands](stories/review-and-status/status-board.md) (approved)

- See every pending approval in one queue, with a preview, the stage, the requester and what changed.
- Accept, request revision or reject an item, singly or in a batch.
- Hold a gated hand-off until the named person approves it, with any AI recommendation marked as such.
- Give written feedback, and compare and restore earlier versions.
- See every stage and asset on a status board, with its owner and state.
- Be told when something is waiting, by a chosen channel, with notifications grouped.

</details>

## Layer 2, live puppetry

| Epic | Stories written | Open questions |
|---|---|---|
| [Nothing breaks when a source changes or fails](epics/handover-and-fallback.md) | 7 of 7 | 0 |
| [A performer drives a character live](epics/live-puppet.md) | 7 of 7 | 0 |
| [Music, sensors and the crowd drive the show](epics/live-signals.md) | 11 of 11 | 0 |
| [Retarget a performer to the nearest body plan](epics/nearest-body-retargeting.md) | 5 of 5 | 0 |
| [The performer can sense the room and trust the motion](epics/performer-support.md) | 8 of 8 | 0 |
| [Record, replay and share a performance](epics/session-recording.md) | 8 of 8 | 0 |
| [Any number of performers, any kind of body](epics/shared-characters.md) | 8 of 8 | 0 |

<details>
<summary>Nothing breaks when a source changes or fails</summary>

- [Switch to the fallback when an input drops](stories/handover-and-fallback/automatic-switch.md) (approved)
- [Define a fallback for each channel](stories/handover-and-fallback/define-fallback.md) (approved)
- [Hand a channel to another driver](stories/handover-and-fallback/hand-over-a-channel.md) (approved)
- [Keep a channel legible or say so](stories/handover-and-fallback/legibility-bar.md) (approved)
- [Tell the performer about a fallback](stories/handover-and-fallback/performer-signal.md) (approved)
- [Return a recovered source to its channel](stories/handover-and-fallback/return-recovered-source.md) (approved)
- [Trigger a handover while performing](stories/handover-and-fallback/trigger-handover.md) (approved)

- Define a fallback for each channel: another source, a recording or loop, an AI-held pose or a safe hold.
- Switch to the fallback automatically when a source drops.
- Tell the performer about a fallback through a signal they can perceive while performing.
- Hand a channel to another driver by blend, pose match or cover, with a default blend so a hard cut cannot happen by accident.
- Trigger a handover from a performer control or a cue.
- Return a recovered source to its channel without a visible jump.
- Set a legibility bar for a channel, such as hands for signing, and tell the audience and performer if it is broken, with no AI motion filling the gap.

</details>

<details>
<summary>A performer drives a character live</summary>

- [Assign sources to a character's channels](stories/live-puppet/assign-channels.md) (approved)
- [Connect a capture source and drive a character](stories/live-puppet/connect-a-source.md) (approved)
- [Set up and calibrate a headset and hand controllers](stories/live-puppet/headset-setup.md) (approved)
- [Set up and calibrate a portable inertial suit](stories/live-puppet/inertial-suit-setup.md) (approved)
- [Measure the delay from performer to puppet](stories/live-puppet/measure-delay.md) (approved)
- [Connect an optical studio's live stream](stories/live-puppet/optical-studio-stream.md) (approved)
- [Set up and calibrate webcam or phone capture](stories/live-puppet/webcam-or-phone-setup.md) (approved)

- Connect a capture source through the common interface and drive a character.
- Complete a guided setup and calibration for a portable inertial suit, the first source.
- Complete a guided setup and calibration for headset and hand controllers.
- Complete a guided setup and calibration for webcam or phone capture.
- Connect an optical studio's live capture stream through a guided setup, and map its performers to characters. The studio's own system and staff do the calibration.
- Assign a source to a character's body, hands, face, voice and effects channels.
- See the measured delay from performer to rendered puppet, and to what the audience sees on each output, measured end to end on the show's hardware. The first test puts a performer beside their character.

</details>

<details>
<summary>Music, sensors and the crowd drive the show</summary>

- [Drive the scene from the audience's combined reaction](stories/live-signals/audience-reaction.md) (approved)
- [Drive a channel from live audio analysis](stories/live-signals/audio-analysis.md) (approved)
- [Report guest presence from beams](stories/live-signals/beams.md) (approved)
- [Report guest presence from depth sensors](stories/live-signals/depth-sensors.md) (approved)
- [Drive a channel from DMX](stories/live-signals/dmx.md) (approved)
- [Report guest presence from floor pads](stories/live-signals/guest-presence.md) (approved)
- [Map a signal onto a channel](stories/live-signals/map-a-signal.md) (approved)
- [Drive a channel from MIDI](stories/live-signals/midi.md) (approved)
- [Drive a channel from OSC](stories/live-signals/osc.md) (approved)
- [Drive a channel from a performer's sensor](stories/live-signals/performer-sensor.md) (approved)
- [Fall back when a signal drops](stories/live-signals/signal-fallback.md) (approved)

- Drive a channel from live audio analysis, such as level or beat.
- Drive a channel from MIDI.
- Drive a channel from OSC.
- Drive a channel from DMX (Art-Net or sACN).
- Map a signal onto a channel, and save the mapping as a reviewable asset.
- Drive a channel from a performer's sensor, within their agreement.
- Drive effects, materials and scene values from the audience's combined reaction.
- Report guest presence from floor pads, with a simulated crowd for testing and rehearsal.
- Report guest presence from beams.
- Report guest presence from depth sensors, as momentary points or skeletons that cannot identify anyone, with a clear notice to guests (REQ-governance-7).
- Use a channel's fallback when a signal drops.

</details>

<details>
<summary>Retarget a performer to the nearest body plan</summary>

- [Add a body plan to the known set](stories/nearest-body-retargeting/add-body-plan.md) (approved)
- [Correct an automatic match and save it as a mapping](stories/nearest-body-retargeting/correct-and-save.md) (approved)
- [Drive a retargeted character live](stories/nearest-body-retargeting/drive-live.md) (approved)
- [Match a character to the nearest body plan](stories/nearest-body-retargeting/match-nearest-body-plan.md) (approved)
- [Rehearse a retargeted mapping and send it for review](stories/nearest-body-retargeting/rehearse-and-review.md) (approved)

- Match a character to the nearest known body plan (biped, quadruped or extra limbs) automatically, and see which parts were matched and which were not. This story tests whether IK Retargeter is enough.
- Correct the automatic result by hand, without code, and save it as a mapping asset (story-shared-characters-map-a-different-body).
- Drive a retargeted character live, within the show's delay target (story-live-puppet-measure-delay).
- Add a body plan to the known set, without modifying the core.
- Rehearse a retargeted mapping on a proxy character and send it for review before it is used in show mode.

</details>

<details>
<summary>The performer can sense the room and trust the motion</summary>

- [Sense the audience through physical signals](stories/performer-support/audience-summary-signals.md) (approved)
- [Talk privately with the crew](stories/performer-support/crew-channel.md) (approved)
- [Check live motion against the show's bar](stories/performer-support/motion-quality-check.md) (approved)
- [Let a remote helper join the crew channel](stories/performer-support/remote-helper.md) (approved)
- [See a live view of the room](stories/performer-support/room-view.md) (approved)
- [See the virtual character from the stage](stories/performer-support/stage-view.md) (approved)
- [Hear the venue while performing](stories/performer-support/venue-audio.md) (approved)
- [Connect a venue intercom to the crew channel](stories/performer-support/venue-intercom.md) (approved)

- Talk privately with crew by voice and text, with captions, from inside a headset or suit.
- Let a remote helper join the crew channel over the internet.
- Connect a venue intercom to the crew channel.
- See a live view of the room, or a silhouette or depth view, with a clear notice to guests.
- Hear venue audio while performing.
- Sense the audience summary through physical signals such as lights.
- See the virtual character from the stage, through a monitor, a headset or another view.
- Check live motion against the show's quality bar for limbs, foot contact and held props.

</details>

<details>
<summary>Record, replay and share a performance</summary>

- [Change an agreement and flag what it no longer allows](stories/session-recording/change-agreement.md) (approved)
- [Check the agreement before recording and generation](stories/session-recording/check-agreement.md) (approved)
- [Clean up a recorded session](stories/session-recording/clean-up.md) (approved)
- [Record a performer's agreement](stories/session-recording/record-agreement.md) (approved)
- [Record a session and replay it](stories/session-recording/record-and-replay.md) (approved)
- [Drive a character from another location](stories/session-recording/remote-performer.md) (approved)
- [Stream performance data between machines](stories/session-recording/stream-between-machines.md) (approved)
- [Test a remote performer between two real sites](stories/session-recording/two-site-test.md) (approved)

- Record a performer's agreement for a project: what may be captured, how it may be used, and their acknowledgement of any character brief.
- Check that agreement before recording, and before a generative tool uses the data.
- Record a capture session, and replay it to drive the same characters.
- Clean up a recorded session, with the performer named in the provenance record.
- Change an agreement, and flag the assets it no longer allows.
- Send performance data between machines in real time in a documented open format.
- Drive a character in a show from another location over the internet, with the delay measured and shown, tested over a simulated link.
- Test a remote performer between two real sites over the internet.

</details>

<details>
<summary>Any number of performers, any kind of body</summary>

- [Drive a character by position and intent](stories/shared-characters/intent-and-procedural-motion.md) (approved)
- [Map a performer's body parts onto a different body](stories/shared-characters/map-a-different-body.md) (approved)
- [Drive several characters from one performer](stories/shared-characters/one-performer-several-characters.md) (approved)
- [Map motion onto character values](stories/shared-characters/parameter-mapping.md) (approved)
- [Run several performers on their own characters](stories/shared-characters/several-performers.md) (approved)
- [Share one character between several performers](stories/shared-characters/split-a-character.md) (approved)
- [Swap the performer in a role between sessions](stories/shared-characters/swap-performer.md) (approved)
- [Drive a character or effect from a tracked prop](stories/shared-characters/tracked-prop.md) (approved)

- Run several performers, each driving their own character.
- Split one character's channels between several performers, with each performer shown what they need to perceive of the others, settled by testing with real performers.
- Drive several characters from one performer.
- Drive a character or effect from a tracked prop.
- Map chosen body parts onto a character with a different body (mapped puppeteering), and save the mapping as a reviewable asset.
- Map motion values onto character values such as energy, size or colour (parameter mapping).
- Drive a character by position and intent, with procedural motion filling in the rest.
- Swap the performer in a role between sessions, using that performer's saved calibration and mappings, with no rebuild.

</details>

## Layer 3, character, environment and asset paths

| Epic | Stories written | Open questions |
|---|---|---|
| [Every asset fits every target before anyone reviews it](epics/asset-checks.md) | 5 of 5 | 0 |
| [Characters that change form and move well on every device](epics/character-forms.md) | 5 of 5 | 0 |
| [From a brief to a character a performer can drive](epics/character-path.md) | 6 of 6 | 0 |
| [From a brief to an effect a show can drive](epics/effects-path.md) | 4 of 4 | 0 |
| [From a brief to a world people can move through](epics/environment-path.md) | 7 of 7 | 0 |
| [Design what guests can do, and try it early](epics/interaction-design.md) | 6 of 6 | 0 |
| [Reuse work across projects, with its terms intact](epics/shared-library.md) | 5 of 5 | 0 |
| [Sound that fits the show on every output](epics/sound-path.md) | 6 of 6 | 0 |

<details>
<summary>Every asset fits every target before anyone reviews it</summary>

- [Check an asset against each target's budget before review](stories/asset-checks/check-against-budget.md) (approved)
- [Check effect cost and audio format and loudness](stories/asset-checks/check-effects-and-audio.md) (approved)
- [Check that provenance is complete](stories/asset-checks/check-provenance.md) (approved)
- [Make and check lower-detail versions for each target](stories/asset-checks/lower-detail-versions.md) (approved)
- [Show check results beside the item](stories/asset-checks/show-failures.md) (approved)

- Check naming, polygon and texture budgets, rigs, textures and materials before review.
- Check effect cost and audio format and loudness.
- Check that provenance is complete.
- Show failures to the reviewer beside the item.
- Generate or check lower-detail versions against each target's budget.

</details>

<details>
<summary>Characters that change form and move well on every device</summary>

- [Change a character continuously while driving it](stories/character-forms/continuous-change.md) (approved)
- [Dissolve and reassemble a character](stories/character-forms/dissolve-and-reassemble.md) (approved)
- [Author hair, cloth and costume once for every device](stories/character-forms/hair-cloth-costume.md) (approved)
- [Morph a character between two forms](stories/character-forms/morph.md) (approved)
- [Swap a character behind an effect](stories/character-forms/swap-behind-effect.md) (approved)

- Morph a character between two reviewed forms.
- Swap a character behind an effect.
- Dissolve and reassemble a character.
- Change a character continuously while a performer drives it, such as growing or shrinking.
- Author hair, cloth and costume once, simulated live on PC and simplified on weaker targets.

</details>

<details>
<summary>From a brief to a character a performer can drive</summary>

- [Put a character on the common skeleton or retarget it](stories/character-path/common-skeleton.md) (approved)
- [Turn a brief into design drafts and approve one](stories/character-path/design-drafts.md) (approved)
- [Bring hand-made work into the character path](stories/character-path/hand-made-work.md) (approved)
- [Lock a character before rehearsal](stories/character-path/lock-character.md) (approved)
- [Make a mesh and rig from an approved design](stories/character-path/mesh-and-rig.md) (approved)
- [Make any character style through the same path](stories/character-path/other-styles.md) (approved)

- Turn a brief and references into design drafts, and approve one at the design gate.
- Produce a mesh and rig from an approved design, and approve them at their gate.
- Bring a hand-made character or part into the path without an agent redoing it.
- Make a stylised, creature or abstract character through the same path as a human one.
- Put a character on the common skeleton, or retarget it automatically.
- Lock a character before rehearsal, with later changes needing a named person.

</details>

<details>
<summary>From a brief to an effect a show can drive</summary>

- [Draft an effect from a brief](stories/effects-path/draft-an-effect.md) (approved)
- [Expose an effect's values so a show can drive them](stories/effects-path/expose-values.md) (approved)
- [Revise an effect from feedback and send it to the gate](stories/effects-path/revise-and-approve.md) (approved)
- [See an effect's cost on each target while working](stories/effects-path/see-cost.md) (approved)

- Turn a brief and references into a first draft of an effect.
- Revise an effect from written feedback, and approve it at the gate.
- Expose an effect's values so channels, props and cues can drive them.
- See an effect's cost on each target while working on it.

</details>

<details>
<summary>From a brief to a world people can move through</summary>

- [Approve layout, look and interactive features at the gate](stories/environment-path/approve-at-the-gate.md) (approved)
- [Bring hand-made environment work into the path](stories/environment-path/bring-hand-made-work.md) (approved)
- [Build a layout from a kit of approved assets](stories/environment-path/build-from-kit.md) (approved)
- [Develop the look from approved concept art](stories/environment-path/develop-the-look.md) (approved)
- [Check that a level is engine-ready for every target](stories/environment-path/engine-ready-level.md) (approved)
- [Generate a rough world from a brief](stories/environment-path/generate-a-world.md) (approved)
- [Place designed interactions in a level](stories/environment-path/place-interactions.md) (approved)

- Generate a rough world that can be walked from a brief and references with World Labs Marble.
- Build a rough layout from a kit of approved assets when a generated world does not serve.
- Develop the look of an environment from approved concept art.
- Bring hand-made environment work into the path.
- Place designed interactions in a level.
- Check that a level is engine-ready against each target's budget file.
- Approve layout, look and interactive features at the gate.

</details>

<details>
<summary>Design what guests can do, and try it early</summary>

- [Declare how guests move on each target](stories/interaction-design/guest-movement.md) (approved)
- [Map an interaction to each target's input](stories/interaction-design/input-per-target.md) (approved)
- [Try an interaction in a playable prototype](stories/interaction-design/playable-prototype.md) (approved)
- [Record what guests can do as a reviewable design](stories/interaction-design/record-design.md) (approved)
- [Save and configure a reusable interaction pattern](stories/interaction-design/reusable-pattern.md) (approved)
- [Run a scripted test of each interaction on each target](stories/interaction-design/scripted-tests.md) (approved)

- Record what guests can do and what responds, as a reviewable design.
- Try an interaction in a playable prototype with placeholder art.
- Declare how guests move on each target.
- Map one interaction to each target's input, and say what replaces it where a target cannot support it.
- Save and configure a reusable interaction pattern without code.
- Run a scripted test of each interaction on each target.

</details>

<details>
<summary>Reuse work across projects, with its terms intact</summary>

- [Block reuse the terms do not allow, and say why](stories/shared-library/block-reuse.md) (approved)
- [Bring a library item into a new project](stories/shared-library/bring-into-project.md) (approved)
- [Check a reused item's terms against the new project](stories/shared-library/check-terms.md) (approved)
- [Share an item with another organisation by export](stories/shared-library/export-to-another-organisation.md) (approved)
- [Save an item to the organisation's library](stories/shared-library/save-to-library.md) (approved)

- Save an asset or cue structure to the shared library, with its provenance.
- Bring a library item into a new project.
- Check its original terms against the new project's policy record.
- Block reuse the terms do not allow, and say why.
- Share an item with another organisation by an export that carries its terms.

</details>

<details>
<summary>Sound that fits the show on every output</summary>

- [Turn a sound brief into drafts, and approve them](stories/sound-path/brief-to-drafts.md) (approved)
- [Process a live voice within the performer's agreement](stories/sound-path/live-voice-processing.md) (approved)
- [Set a mix for each output, in sync with picture](stories/sound-path/mix-per-output.md) (approved)
- [Place sound in the world and hear it spatially](stories/sound-path/place-sound.md) (approved)
- [Change levels and mixes in rehearsal without a new build](stories/sound-path/rehearsal-mix-changes.md) (approved)
- [Manage sound as assets with gates and provenance](stories/sound-path/sound-assets.md) (approved)

- Manage sound as assets with gates, provenance and policy checks.
- Turn a brief into drafts of music, effects and ambience, and approve them.
- Place sound in the world, and hear it spatially on targets that support it.
- Set a mix for each output, including live voices and external feeds.
- Process a live voice in real time, within the performer's agreement.
- Change levels and mixes in rehearsal, and save them to the show without a new build.

</details>

## Layer 4, show control

| Epic | Stories written | Open questions |
|---|---|---|
| [Shows that take different paths, with or without a performer](epics/branching-shows.md) | 6 of 6 | 0 |
| [Build, rehearse and fire the cues of a show](epics/cue-list.md) | 6 of 6 | 0 |
| [Work with the show systems a venue already has](epics/external-systems.md) | 11 of 11 | 0 |
| [Run a session, and the next one](epics/session-operations.md) | 8 of 8 | 0 |
| [A show stays safe, even with no agents and no crew](epics/show-safety.md) | 6 of 6 | 0 |
| [A show that looks after itself](epics/unattended-running.md) | 6 of 6 | 0 |

<details>
<summary>Shows that take different paths, with or without a performer</summary>

- [Make a cue depend on a condition](stories/branching-shows/conditional-cue.md) (approved)
- [Split a show into paths and endings, and rejoin them](stories/branching-shows/paths-and-endings.md) (approved)
- [Review every path at the gate, and test each with a script](stories/branching-shows/review-and-test-paths.md) (approved)
- [Run a show as a self-guided experience](stories/branching-shows/self-guided-run.md) (approved)
- [Keep a self-guided show safe with no attendant](stories/branching-shows/self-guided-safety.md) (approved)
- [Show a condition built in Unreal as one item in the cue list](stories/branching-shows/unreal-condition.md) (approved)

- Make a cue depend on a condition.
- Split a show into paths and endings, and rejoin them.
- Show a condition built in Unreal as one item in the cue list.
- Review every path at the gate, and test each with a script.
- Run a show as a self-guided experience, with cues fired by guests or timecode.
- Keep a self-guided show safe with no attendant.

</details>

<details>
<summary>Build, rehearse and fire the cues of a show</summary>

- [Draft and revise a cue list with agents, and approve it](stories/cue-list/agent-drafts.md) (approved)
- [Fire cues from the audience, with a count and an override](stories/cue-list/audience-fired.md) (approved)
- [Build and edit a cue list in Unreal](stories/cue-list/build-a-cue-list.md) (approved)
- [Fire cues while performing, armed by section](stories/cue-list/performer-fired.md) (approved)
- [Step through a cue list, or fire cues from a palette](stories/cue-list/step-and-palette.md) (approved)
- [Fire cues from timecode or a music track](stories/cue-list/timecode-and-music.md) (approved)

- Build and edit a cue list that acts on scenes, lighting, sound, characters, cameras and outputs.
- Step through a list, or fire cues from a free palette.
- Fire cues from a performer's gesture or device, armed by section.
- Fire cues from timecode or a music track.
- Fire cues from an audience action, with the count and override the show sets.
- Draft and revise a cue list with agents, and approve it at the gate.

</details>

<details>
<summary>Work with the show systems a venue already has</summary>

- [Choose whether a show leads or follows](stories/external-systems/lead-or-follow.md) (approved)
- [Connect lighting through DMX and PosiStageNet](stories/external-systems/lighting.md) (approved)
- [Send and receive MIDI timecode](stories/external-systems/midi-timecode.md) (approved)
- [Fire and send cues through OSC, MIDI and MIDI show control](stories/external-systems/osc-midi-msc.md) (approved)
- [Test the other protocols against simulators](stories/external-systems/other-simulators.md) (approved)
- [Test the lighting-desk path against simulators and recorded sessions](stories/external-systems/simulators.md) (approved)
- [Exchange video through Spout](stories/external-systems/spout.md) (approved)
- [Exchange video through SRT and SDI](stories/external-systems/srt-and-sdi.md) (approved)
- [Run a show from any surface, or with no external systems](stories/external-systems/surfaces-and-standalone.md) (approved)
- [Exchange video through NDI, and LTC timecode](stories/external-systems/video-and-timecode.md) (approved)
- [Test video streams against simulators](stories/external-systems/video-simulators.md) (approved)

- Choose whether a show leads or follows, without a rebuild.
- Connect through OSC, MIDI and MIDI show control.
- Connect lighting through DMX over Art-Net or sACN, and PosiStageNet.
- Exchange video through NDI, and LTC timecode.
- Run a show from a touchscreen, a control surface or a keyboard and mouse, or with no external systems.
- Test the lighting-desk path against simulators or recorded sessions.
- Exchange video through Spout.
- Exchange video through SRT and SDI.
- Send and receive MIDI timecode.
- Test the other protocols (MIDI notes and controllers, PosiStageNet, MIDI timecode) against simulators.
- Test video streams (NDI, Spout, SRT and SDI) against simulators.

</details>

<details>
<summary>Run a session, and the next one</summary>

- [Make a change during a live run](stories/session-operations/live-changes.md) (approved)
- [Trim alignment or calibration during a session](stories/session-operations/live-trim.md) (approved)
- [See a thumbnail of every output](stories/session-operations/output-thumbnails.md) (approved)
- [Pause and resume, and jump to any cue on any path](stories/session-operations/pause-and-jump.md) (approved)
- [Run one pre-show check, and a shorter one between sessions](stories/session-operations/pre-show-check.md) (approved)
- [Reset for the next session, and signal that the show is ready](stories/session-operations/reset-for-next-session.md) (approved)
- [See and change who drives each channel](stories/session-operations/routing-control.md) (approved)
- [Run several sessions at once as separate copies](stories/session-operations/several-sessions.md) (approved)

- Run one pre-show check, and a shorter one between sessions.
- Pause and resume, and jump to any cue on any path.
- See and change who drives each channel.
- Make and approve a change during a live run, and tell the people it affects.
- Trim alignment or calibration during a session, with each change logged.
- Reset for the next session, and signal that the show is ready.
- See a thumbnail of every output.
- Run several sessions at once as separate copies, each with its own guests, performers, cue position and reset, where resetting one does not change another.

</details>

<details>
<summary>A show stays safe, even with no agents and no crew</summary>

- [Declare a show's safe state for each kind of output](stories/show-safety/declare-safe-state.md) (approved)
- [Reach the safe state with one control](stories/show-safety/emergency-stop.md) (approved)
- [Declare and rehearse what continues if a whole layer is lost](stories/show-safety/show-level-fallback.md) (approved)
- [Run a solo show with controls that cannot be disarmed](stories/show-safety/solo-show.md) (approved)
- [Switch explicitly between production and show mode](stories/show-safety/switch-modes.md) (approved)
- [Keep every live function working when all agents are gone](stories/show-safety/without-agents.md) (approved)

- Switch explicitly between production and show mode.
- Keep every live function working when all agents are gone.
- Declare a show's safe state for each kind of output, approved by a person.
- Reach the safe state with one control, including house lights and a fire alarm input.
- Run a solo show with stop, pause and handover as controls that cannot be disarmed.
- Declare what continues if a whole layer or link is lost, and rehearse it.

</details>

<details>
<summary>A show that looks after itself</summary>

- [Show a safe holding state and alert a named person when recovery fails](stories/unattended-running/holding-state-and-alert.md) (approved)
- [Hold an idle state when no guests are present](stories/unattended-running/idle-state.md) (approved)
- [Use a maintenance mode, and read a log of failures and restarts](stories/unattended-running/maintenance-and-log.md) (approved)
- [Restart after a crash or power cut, and return to idle](stories/unattended-running/restart-and-recover.md) (approved)
- [Start and stop on a schedule, with an automatic pre-show check](stories/unattended-running/schedule-and-check.md) (approved)
- [Run a soak test before a long run](stories/unattended-running/soak-test.md) (approved)

- Start and stop on a schedule, with an automatic pre-show check.
- Hold an idle state when no guests are present.
- Restart after a crash or power cut, and return to idle.
- Show a safe holding state and alert a named person when recovery fails.
- Use a maintenance mode, and read a log of failures and restarts.
- Run a soak test before a long run.

</details>

## Layer 5, delivery

| Epic | Stories written | Open questions |
|---|---|---|
| [From approved work to a tested build on a venue machine](epics/build-and-install.md) | 5 of 5 | 0 |
| [One live performance, many outputs](epics/outputs-and-streaming.md) | 6 of 6 | 0 |
| [Set up in a venue, and keep running there](epics/venue-setup.md) | 6 of 6 | 0 |

<details>
<summary>From approved work to a tested build on a venue machine</summary>

- [Test each build automatically, and hold it at the public show gate](stories/build-and-install/automatic-checks.md) (approved)
- [Build a show from its approved stages](stories/build-and-install/build-from-stages.md) (approved)
- [Record engine and plugin versions, and show differences between targets](stories/build-and-install/engine-and-plugin-versions.md) (approved)
- [Install a build on a venue machine, check it and roll it back](stories/build-and-install/install-and-roll-back.md) (approved)
- [Measure each delivered build against each target's budget](stories/build-and-install/measure-against-budget.md) (approved)

- Build a show from its approved stages, with each output stored and reviewable.
- Run asset checks, scripted scenarios and performance measurements as part of a build.
- Measure a build against each target's budget.
- Record the engine and plugin versions of each build, and show differences between targets.
- Install a versioned build on a venue system, check it and roll it back.

</details>

<details>
<summary>One live performance, many outputs</summary>

- [Approve going live on a public platform](stories/outputs-and-streaming/approve-going-live.md) (approved)
- [Output to PC VR, including wireless PC VR](stories/outputs-and-streaming/pc-vr.md) (approved)
- [Output to a projector or screen](stories/outputs-and-streaming/projector-or-screen.md) (approved)
- [Read chat and reactions from whichever destination the show uses](stories/outputs-and-streaming/read-chat.md) (approved)
- [Output to several surfaces through Unreal's display tools or a media server](stories/outputs-and-streaming/several-surfaces.md) (approved)
- [Send a flat livestream to a public platform, the show's player page, or both](stories/outputs-and-streaming/stream-to-platforms.md) (approved)

- Send a flat livestream to a public platform, the show's own player page, or both.
- Read chat and reactions from whichever the show uses.
- Output to PC VR, including wireless PC VR.
- Output to a projector or screen.
- Output to several surfaces through Unreal's display tools or a media server.
- Approve going live on a public platform.

</details>

<details>
<summary>Set up in a venue, and keep running there</summary>

- [Align the virtual world with a room or stage, and save it for that venue](stories/venue-setup/align-to-room.md) (approved)
- [Choose and test a plan for a failed show machine](stories/venue-setup/failed-machine-plan.md) (approved)
- [Declare the space and staffing a show needs, and check whether a venue fits](stories/venue-setup/fit-check.md) (approved)
- [See a plain headset list, and open a live view of one guest's headset](stories/venue-setup/headset-list.md) (approved)
- [Run a full show on the venue network with the internet disconnected](stories/venue-setup/offline-show.md) (approved)
- [Save a venue profile, and connect the venue's fire alarm](stories/venue-setup/venue-profile.md) (approved)

- Save a venue profile of its space, boundaries, obstacles, outputs and network.
- Declare the space a show needs, and check whether a venue fits.
- Align the virtual world with a room or stage, and save it for that venue.
- Run a full show on the venue network with the internet disconnected.
- Choose and test a plan for a failed show machine.
- See a plain headset list, and open a live view of one guest's headset.

</details>

## Layer 6, audience

| Epic | Stories written | Open questions |
|---|---|---|
| [Guests in the world, as whoever the show lets them be](epics/audience-avatars.md) | 6 of 8 | 0 |
| [Hear from the audience, safely](epics/audience-voice.md) | 6 of 6 | 0 |
| [Welcome every guest, and look after them](epics/guest-care.md) | 6 of 6 | 0 |
| [Join from anywhere, in the tier that suits you](epics/remote-guests.md) | 6 of 6 | 0 |

<details>
<summary>Guests in the world, as whoever the show lets them be</summary>

- [Appear in the world as an avatar chosen from the show's set](stories/audience-avatars/choose-an-avatar.md) (approved)
- [Follow a guest with the best input their device has](stories/audience-avatars/follow-best-input.md) (approved)
- [Declare guest roles, with guests muted by default](stories/audience-avatars/guest-roles.md) (approved)
- [Design a playable character for guests](stories/audience-avatars/playable-character.md) (approved)
- [React with cheers, gestures, light or sound](stories/audience-avatars/react.md) (approved)
- [Show stream viewers in the world as a simulated crowd](stories/audience-avatars/stream-viewer-crowd.md) (approved)

- Give a guest an avatar in one of the show's appearance tiers.
- Play a character designed for the show, with its own form, movement and abilities.
- Follow a guest with the best input their device has, and fall back when it drops.
- React with cheers, gestures, light or sound.
- Declare guest roles, with guests muted by default.
- Show stream viewers in the world as a simulated crowd.
- Later, not written: customise one's own avatar (REQ-audience-2).
- Later, not written: appear as a likeness of oneself, from a camera or scan. It waits for each guest's consent and the legal review (REQ-governance-7). The first release uses chosen avatars only (approver's answer).

</details>

<details>
<summary>Hear from the audience, safely</summary>

- [Read a summary of audience presence and reaction at a glance](stories/audience-voice/audience-summary.md) (approved)
- [Set moderation rules for a show, approved by a person](stories/audience-voice/moderation-rules.md) (approved)
- [Mute and block other guests](stories/audience-voice/mute-and-block.md) (approved)
- [Keep a personal space around each guest](stories/audience-voice/personal-space.md) (approved)
- [Mute, hide or remove a guest during a show](stories/audience-voice/remove-a-guest.md) (approved)
- [Send text and reactions to the performer, the scene or both](stories/audience-voice/send-chat-and-reactions.md) (approved)

- Read a summary of audience presence and reaction at a glance.
- Send text and reactions that reach the performer, the scene or both.
- Set moderation rules for a show, and have a person approve them.
- Keep a personal space around each guest.
- Mute and block other guests.
- Mute, hide or remove a guest during a show.

</details>

<details>
<summary>Welcome every guest, and look after them</summary>

- [Choose captions, audio description, a sign-interpreted view, seating or low motion](stories/guest-care/access-options.md) (approved)
- [Declare what guest data is kept, delete it, and record guardian consent](stories/guest-care/guest-data.md) (approved)
- [Offer several languages without rework](stories/guest-care/languages.md) (approved)
- [See notices, give consent and read warnings before entering](stories/guest-care/notices-and-warnings.md) (approved)
- [Keep guests clear of hazards and each other, and name an aftercare step](stories/guest-care/room-safety.md) (approved)
- [Enter through a standard pre-show that a show can restyle](stories/guest-care/standard-pre-show.md) (approved)

- Enter through a standard pre-show that a show can restyle.
- See notices, give consent and read warnings before entering.
- Choose captions, audio description, a sign-interpreted view, seating or low motion, where the show offers them.
- Offer several languages without rework.
- Keep guests clear of hazards and each other, and name an aftercare step.
- Declare what guest data is kept, delete it at session end, and record guardian consent where minors may attend.

</details>

<details>
<summary>Join from anywhere, in the tier that suits you</summary>

- [Keep an audience failure from reaching the performer loop or other audiences](stories/remote-guests/contain-failures.md) (approved)
- [Join as an interactive guest through an installed app or a cloud session](stories/remote-guests/interactive-guest.md) (approved)
- [Join through a link or code, which can carry a tier](stories/remote-guests/join-by-link-or-code.md) (approved)
- [Move guests past the limit to a lower tier](stories/remote-guests/move-past-the-limit.md) (approved)
- [Join as a player guest, with a light input layer over the stream](stories/remote-guests/player-guest.md) (approved)
- [Arrive late, and rejoin the same session with the same avatar](stories/remote-guests/rejoin.md) (approved)

- Join through a link or code, which can carry a tier.
- Arrive late, and rejoin the same session with the same avatar.
- Join as an interactive guest through an installed app or a cloud session.
- Join as a player guest, with a light input layer over the stream.
- Move guests past the limit to a lower tier.
- Keep an audience failure from reaching the performer loop or other audiences.

</details>

## Layer 7, AI assists, crowds and creatures

| Epic | Stories written | Open questions |
|---|---|---|
| [Autonomous behaviour that stays inside agreed limits](epics/behaviour-and-limits.md) | 6 of 6 | 0 |
| [Crowds and creatures that fill the world](epics/crowds-and-creatures.md) | 6 of 7 | 0 |

<details>
<summary>Autonomous behaviour that stays inside agreed limits</summary>

- [Check AI use in a specification against the policy record](stories/behaviour-and-limits/check-ai-use.md) (approved)
- [Set content limits, and keep output outside them from the audience](stories/behaviour-and-limits/content-limits.md) (approved)
- [Pause, redirect or take over an autonomous character](stories/behaviour-and-limits/override.md) (approved)
- [Test behaviour with recorded scenarios, and block a failing build](stories/behaviour-and-limits/scenario-tests.md) (approved)
- [Give every behaviour a scripted fallback that runs offline](stories/behaviour-and-limits/scripted-fallback.md) (approved)
- [Write a behaviour specification and review it at a gate](stories/behaviour-and-limits/write-specification.md) (approved)

- Write a human-readable behaviour specification, and review it at a gate.
- Check any AI use in a specification against the policy record.
- Give every behaviour a scripted fallback that runs offline.
- Pause, redirect or take over an autonomous character.
- Set content limits, and keep output outside them from reaching the audience.
- Test behaviour with recorded scenarios and statistical checks, and block a failing build.

</details>

<details>
<summary>Crowds and creatures that fill the world</summary>

- [Add autonomous creatures that react to cues and performers](stories/crowds-and-creatures/add-creatures.md) (approved)
- [Add secondary motion and fill undriven channels, with a switch for the performer](stories/crowds-and-creatures/ai-assists.md) (approved)
- [Conduct a crowd or creatures as one instrument](stories/crowds-and-creatures/conduct.md) (approved)
- [Mark a moment as locked or free](stories/crowds-and-creatures/locked-or-free.md) (approved)
- [Place a crowd in a scene, and choose and tune its behaviours](stories/crowds-and-creatures/place-a-crowd.md) (approved)
- [React to a nearby presence, with nothing kept](stories/crowds-and-creatures/presence-reaction.md) (approved)

- Place a crowd in a scene, and choose and tune its behaviours.
- Add autonomous creatures that react to cues and performers.
- Conduct a crowd or creature directly as one instrument.
- Add secondary motion and fill undriven channels with AI, with a switch for the performer.
- Mark a moment as locked or free.
- React to a nearby presence with non-verbal, rule-based behaviour, with nothing kept.
- Later, not written: trial a local generative model on the show machine, behind the scripted fallback (story-behaviour-and-limits-scripted-fallback), including generative voice transformation of a performer's live voice. The first release uses rule-based and procedural methods only (approver's answer).

</details>

## Business layer, in parallel with the others

| Epic | Stories written | Open questions |
|---|---|---|
| [Know what a production costs while it happens](epics/budgets-and-cost.md) | 5 of 5 | 0 |
| [Agreements and payments, with a person in charge](epics/contracts-and-payment.md) | 5 of 5 | 0 |
| [Tell people about the work, and credit it properly](epics/credits-and-outreach.md) | 6 of 6 | 0 |
| [Find funding, apply and report, from one set of facts](epics/funding.md) | 5 of 5 | 0 |
| [Get the right people and kit to the right place](epics/schedule-and-touring.md) | 6 of 6 | 0 |

<details>
<summary>Know what a production costs while it happens</summary>

- [Build a budget per project and funder format](stories/budgets-and-cost/build-a-budget.md) (approved)
- [Connect a business tool through an adapter](stories/budgets-and-cost/connect-a-tool.md) (approved)
- [See budget against actual cost and the schedule](stories/budgets-and-cost/cost-and-schedule-view.md) (approved)
- [Track actual cost, including generation, cloud and per-show costs](stories/budgets-and-cost/track-actual-cost.md) (approved)
- [Use the business tools alone, with no other software](stories/budgets-and-cost/work-alone.md) (approved)

- Build a budget per project and funder format.
- Track actual cost, including generation, cloud and per-show costs.
- See budget against actual cost and the production schedule.
- Connect accounting, calendars or e-signature through an adapter.
- Use the business tools alone, with no other software.

</details>

<details>
<summary>Agreements and payments, with a person in charge</summary>

- [Draft and track contracts, licences and AI-use terms](stories/contracts-and-payment/draft-and-track-contracts.md) (approved)
- [Keep records for as long as each rule requires](stories/contracts-and-payment/keep-records.md) (approved)
- [Prepare payroll and payment information from hours and amounts](stories/contracts-and-payment/prepare-payroll.md) (approved)
- [Keep bank details and tax numbers away from agents](stories/contracts-and-payment/protect-sensitive-data.md) (approved)
- [Draft quotes and invoices](stories/contracts-and-payment/quotes-and-invoices.md) (approved)

- Draft and track contracts, licences and AI-use terms, with a person accepting them.
- Draft quotes and invoices.
- Prepare payroll and payment information from hours and amounts.
- Keep bank details and tax numbers where only a person with the right role can reach them.
- Keep records for as long as each rule requires, showing why and until when.

</details>

<details>
<summary>Tell people about the work, and credit it properly</summary>

- [Draft an AI-use statement from provenance records](stories/credits-and-outreach/ai-use-statement.md) (approved)
- [Use audience data in funder and partner reports](stories/credits-and-outreach/audience-data-in-reports.md) (approved)
- [Build credits from the project facts and provenance records](stories/credits-and-outreach/build-credits.md) (approved)
- [Collect attendance and feedback by session, where consent allows](stories/credits-and-outreach/collect-audience-data.md) (approved)
- [Draft promotional material, press kits and posts](stories/credits-and-outreach/draft-promotion.md) (approved)
- [Collect analytics on the player page only with consent](stories/credits-and-outreach/player-page-analytics.md) (approved)

- Build credits from project facts and provenance records.
- Draft an AI-use statement from provenance records.
- Draft promotional material, press kits and posts.
- Collect attendance and feedback by session, where consent allows.
- Use audience data in funder and partner reports.
- Collect analytics on the player page beyond counts, and any tracking, only for a guest who consents in the pre-show, off by default. They hold no name, contact or device identifier, are deleted on the guest's request with the deletion logged without the data, and need a guardian's consent for a guest under the age of consent (REQ-business-11, REQ-governance-7).

</details>

<details>
<summary>Find funding, apply and report, from one set of facts</summary>

- [Draft an application in a funder's format](stories/funding/draft-application.md) (approved)
- [Match a project to programs it may qualify for](stories/funding/match-programs.md) (approved)
- [Keep a list of funding programs and their deadlines](stories/funding/program-list.md) (approved)
- [Draft reports and cost claims with proof of spend](stories/funding/reports-and-claims.md) (approved)
- [Track spend and documents for tax credits and incentives](stories/funding/tax-credits.md) (approved)

- Keep a list of funding programs, with requirements and deadlines.
- Match a project to programs it may qualify for.
- Draft an application in a funder's format, for a person to review and submit.
- Draft interim and final reports and cost claims, with proof of spend.
- Track spend and documents for tax credits and incentives.

</details>

<details>
<summary>Get the right people and kit to the right place</summary>

- [Draft call sheets for a person to approve and send](stories/schedule-and-touring/call-sheets.md) (approved)
- [Draft equipment manifests and set-up checklists for each venue](stories/schedule-and-touring/manifests-and-checklists.md) (approved)
- [See my own time in kit, limits and history](stories/schedule-and-touring/own-time-in-kit.md) (approved)
- [Schedule availability, rehearsals and shoots](stories/schedule-and-touring/schedule.md) (approved)
- [Track each performer's time in a headset or suit against a set limit](stories/schedule-and-touring/time-in-kit.md) (approved)
- [Draft a travel checklist for each trip](stories/schedule-and-touring/travel-checklist.md) (approved)

- Schedule crew and performer availability, rehearsals and shoots.
- Draft call sheets for approval.
- Track each performer's time in a headset or suit against set limits.
- Draft equipment manifests and set-up checklists for each venue.
- Kai sees their own time in kit, their limits and the dated history of both on a limited page (story-schedule-and-touring-time-in-kit).
- Draft a travel checklist for each trip in the schedule: the people called, their travel and load-in calls, how the kit travels and what must be booked. This story defines a travel checklist. A person makes every booking and payment. An agent never books, pays or sends anything outside the project (REQ-workflow-14, REQ-business-8), and never sees passport numbers or similar identifiers (story-contracts-and-payment-protect-sensitive-data).

</details>
