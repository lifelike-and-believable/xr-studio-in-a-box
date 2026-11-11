---
id: story-session-operations-routing-control
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-show-operator#goals: 408315e4f8f6
---

# See and change who drives each channel

As Alex, the show operator, I want to see what drives each character's channels and change it from the show tools so that I can recover from anything by changing who drives a character.

## Acceptance criteria

- On the operator console, Alex sees for each character and channel what drives it now: a source and its performer, a recording, or a fallback (story-handover-and-fallback-define-fallback). A channel on its fallback after a drop (story-handover-and-fallback-automatic-switch) is marked in text, not by colour alone, as soon as the switch happens.
- During a session, Alex can hand a channel to another driver from this view. The change is a handover (story-handover-and-fallback-hand-over-a-channel) and uses its method, with no visible jump and no stop or restart.
- Alex cannot hand a channel to a performer's source or recording that the performer's agreement does not allow for that use (story-session-recording-record-agreement). The view says which part of the agreement blocks it.
- A handover is an operation and is logged with who started it. Changing the saved assignment of sources to channels (story-live-puppet-assign-channels) during a session is a change during a live run (story-session-operations-live-changes).
- Only people whose role needs the view, such as Alex and Casey, can open it. In show mode only a person at the show can change a driver, and an agent cannot.
- The view and handovers work with every agent and the internet disconnected, and are tested with recorded performer takes and simulated sources.
