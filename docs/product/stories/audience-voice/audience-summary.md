---
id: story-audience-voice-audience-summary
status: approved
derived-from:
  - epic-audience-voice#outcome: f83d52994def
  - persona-performer#goals: 9de25c7bbe59
---

# Read a summary of audience presence and reaction at a glance

As Kai, the performer, I want a summary of who is present and how they are reacting that I can read at a glance while performing so that I can sense the audience without watching hundreds of avatars.

## Acceptance criteria

- The audience summary shows, for each audience type the show has (story-remote-guests-join-by-link-or-code) and in total, how many guests are present and the combined reaction. The combined reaction is a level made from the reactions guests send (story-audience-voice-send-chat-and-reactions) over a time window, on a scale the show sets. The director or their delegate sets the window, the scale and which values the summary shows, in production mode (story-show-safety-switch-modes). An agent can draft them but cannot set them. This story defines the audience summary and the combined reaction. Other stories refer to them by this story's id.
- The summary holds only combined values. No value identifies or follows a single guest, and no summary value is stored or recorded (story-session-recording-record-and-replay).
- Kai can see the summary in a headset, or on a monitor placed where only the cast and crew named for the session can see it, as the show sets, and Alex sees it on the operator console. It does not rely on sight alone: the same values reach Kai through physical signals (story-performer-support-audience-summary-signals). Only people whose role needs the summary can see it (REQ-workflow-17).
- What makes the summary readable while performing is settled by a test with a real performer before this story is accepted. The performer uses it during a full rehearsal run with a simulated audience whose size and reaction a person changes, and sets the bar: which values are shown, how they are shown, and how soon a change must be noticed. The director or their delegate records the bar, and later tests show pass or fail against it in text.
- If one audience type's input drops or overloads, the summary marks that type in text as missing, the rest of the summary carries on, and the performer loop stays within the show's delay target (story-live-puppet-measure-delay) (REQ-audience-15).
- The story is tested with simulated guests of each audience type, and once in a rehearsal with real guests.
