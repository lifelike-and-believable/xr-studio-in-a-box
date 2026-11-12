---
id: story-session-operations-several-sessions
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-venue-attendant#goals: ee33f70fd41e
---

# Run several sessions at once as separate copies

As Taylor, the venue attendant, I want several sessions of a show to run at once as separate copies, each with its own guests, performers, cue position and reset, so that I can get each group of guests through it on time.

## Acceptance criteria

- A copy is one running instance of the show that holds one session at a time, with its own world, guests, performers, cue position and reset. Copies do not share a world: groups that share one world, each on its own clock (REQ-showcontrol-24), are later. This story defines a copy. Other stories refer to it by this story's id. The director or their delegate sets, in production mode (story-show-safety-switch-modes), how many copies may run at once, from a test that measures how many the budget file's test device runs at its frame rate (story-asset-checks-check-against-budget), before this story is accepted, and re-measured on the delivered build (story-build-and-install-measure-against-budget). An agent cannot set it.
- Each copy is named in plain words, such as "Session 2", on the operator console and on the output thumbnails (story-session-operations-output-thumbnails). Taylor and Alex see for each copy its cue position and whether it is held, running or ready, in text, not by colour alone. Only people whose role needs this can see it. A person whose role allows it, such as Taylor or Alex, starts a session in a copy that is ready. A copy beyond the limit cannot start, and they are told why in plain words.
- Firing a cue, holding, resuming and jumping (story-session-operations-pause-and-jump), handing over a channel (story-session-operations-routing-control) and resetting (story-session-operations-reset-for-next-session) act on one copy only. A performer's source drives characters only in the copy it is assigned to, as their agreement allows (story-session-recording-record-agreement). Each copy's guests and guest data stay in that copy, and are deleted at its reset under the show's rules (REQ-governance-7). Each copy's ready signal names the copy, in text and with a sound.
- Every copy runs the same approved version of the show. The emergency stop reaches every copy at once (story-show-safety-emergency-stop), whether it comes from the button, the fire alarm or a solo performer's stop control (story-show-safety-solo-show), and each copy is cleared as that story says for its kind of show, including the solo and self-guided cases. A change during a live run (story-session-operations-live-changes) applies to every copy that uses what changed, and the cast and crew named for each affected session are told. Switching modes follows story-show-safety-switch-modes for every copy at once.
- Each session is logged with its copy, start, end and reset time, and no guest data, so reports can count sessions across copies (story-credits-and-outreach-collect-audience-data). In show mode an agent cannot start, hold, jump or reset a copy. Copies run with every agent and the internet disconnected.
- A scripted test runs the set number of copies at once in the Unreal Editor, as standalone games on the budget file's test device, with simulated guests (story-live-signals-guest-presence) and recorded performer takes (story-session-recording-record-and-replay), each copy at a different cue. It holds, jumps and resets one copy, and checks that every other copy's cue position, world state and guests are unchanged and that no guest data from the reset copy remains. It then fires the emergency stop once and checks that every copy reaches its safe state. Copies on several machines are tested once story-build-and-install-install-and-roll-back is built, which installs the same build on each show machine.
