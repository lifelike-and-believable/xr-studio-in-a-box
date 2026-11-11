---
id: story-unattended-running-idle-state
status: approved
derived-from:
  - epic-unattended-running#outcome: d435481b65a1
  - persona-venue-attendant#goals: ee33f70fd41e
---

# Hold an idle state when no guests are present

As Taylor, the venue attendant, I want the show to wait in an idle state when no guests are present so that each group of guests can start the experience on time with no one at the venue.

## Acceptance criteria

- This story defines the idle state, used only by self-guided (story-branching-shows-self-guided-run) and unattended shows: the show waits at its idle scene, with each output showing an idle view and sound at an idle level, ready to start a session. The director or their delegate approves the idle scene, views and level with the cue list (story-cue-list-agent-drafts). Other stories refer to the idle state by this story's id.
- The show enters the idle state when a session ends (story-session-operations-reset-for-next-session), and when no guest has been present for a time the director or their delegate sets. It leaves the idle state and starts a session when a guest arrives or presses a start control, as the show declares.
- Presence is used live only. Nothing is stored and no one is identified, as in story-live-signals-guest-presence. Presence sensing with guests needs the notice approved by the holder of the audience-facing safety and consent approval, and until the legal review of sensing is recorded it is used only in tests with informed crew. A start control needs no sensing.
- The show can stay in the idle state for the whole length of the soak test (story-unattended-running-soak-test).
- The story is tested in the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with a simulated crowd (story-live-signals-guest-presence) arriving and leaving, and with every agent and the internet disconnected.
