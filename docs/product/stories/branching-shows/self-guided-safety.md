---
id: story-branching-shows-self-guided-safety
status: approved
derived-from:
  - epic-branching-shows#outcome: fb606af20aad
  - persona-director#goals: a92ca172be83
---

# Keep a self-guided show safe with no attendant

As Morgan, the director, I want a self-guided show to have a minimum set of safety controls that a person approves so that audience-facing safety stays an approval held by people, even when no one runs the show.

## Acceptance criteria

- A self-guided show (story-branching-shows-self-guided-run) has at least these controls, set beforehand: a stop the guest can reach at any time, which reaches the same safe state as the emergency stop (story-show-safety-declare-safe-state) for that guest's session only, but is not the emergency-stop button (story-show-safety-emergency-stop), and cannot be disarmed, by section (story-cue-list-performer-fired) or in any other way; a pause the guest can reach, which holds the show until they resume (story-session-operations-pause-and-jump); the safe state reached by itself if the show crashes, loses its guest input, or the guest takes off a headset or leaves the play area as the headset's own tracking reports it (where a show senses presence without a headset, it needs the notice and legal review in story-unattended-running-idle-state); and moderation rules for anything one guest can do to another, or a statement that guests cannot meet.
- On a PC, the stop and pause are a key and an on-screen control shown at all times. On PC VR they are also a controller button the show reserves for them. At a venue installation, the stop is also a physical button within guests' reach. Each control is labelled in text, and using it gives a sound and a visible change.
- Where staff are present, a venue attendant such as Taylor can also stop the show and clear the stop (story-show-safety-emergency-stop). With no staff, a rule set beforehand stands in for clearing it: the session ends, and the show offers to start again from the beginning or, in an unattended show, returns to the idle state (story-unattended-running-idle-state). At a venue, a self-guided show with headsets has at least an attendant (REQ-showcontrol-21). At home on the guest's own headset there is no attendant (REQ-showcontrol-21): the guest is their own attendant, and the controls above take the attendant's place.
- The warnings (story-guest-care-notices-and-warnings) and comfort options (story-guest-care-access-options) the show declares are shown before it starts. Until those stories are built, they are simulated with a placeholder screen.
- The holder of the audience-facing safety and consent approval approves the controls, the safe state and the moderation rules (story-audience-voice-moderation-rules) for each self-guided show before its first public run. An agent can draft them but cannot approve them.
- In the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated guests, the stop and pause are used in every section and on every path, and each automatic trigger is forced once. The safe state is reached each time within the time set in story-show-safety-emergency-stop, with every agent and the internet disconnected.
