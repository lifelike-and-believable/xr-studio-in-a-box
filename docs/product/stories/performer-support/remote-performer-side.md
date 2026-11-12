---
id: story-performer-support-remote-performer-side
status: approved
derived-from:
  - epic-performer-support#outcome: c9b11fc41292
  - persona-performer#goals: 72110c93fc2a
---

# Support a performer at a remote location

As Kai, the performer, I want the crew channel, a stage view, the audience summary, my time in kit and a stop control where I perform from, when that is not the venue, so that I can hear or feel a problem without breaking the performance, and stop whenever I need to.

## Acceptance criteria

- A performer driving a character from another location (story-session-recording-remote-performer) joins the crew channel over the internet with the same rules as a remote helper (story-performer-support-remote-helper), and sees a stage view (story-performer-support-stage-view) of the characters they play opposite at their own location. The delay of each feed from the venue is measured and shown to them and to Casey.
- The audience summary signals (story-performer-support-audience-summary-signals) reach a device at the remote performer's location that they can feel. Their time in kit is counted from their own kit (story-schedule-and-touring-time-in-kit), and its warnings reach them there as text and read aloud.
- The remote performer has a stop control at their location they can reach while performing. It works whether or not the link is up. It ends their stretch in kit, their channels switch to their fallbacks as when their kit goes off (story-schedule-and-touring-time-in-kit), the show-level fallback plan covers their character (story-show-safety-show-level-fallback), and the crew at the venue are told in text and with a sound. It stops only their own performance, not the show.
- Before a session with a remote performer, the director or their delegate records who is responsible for that performer's safety at their location and how the crew reach them: a person present with them, or the performer themselves when they agree. A crew member at the remote location is not required. An agent cannot record it, and the pre-show check (story-session-operations-pre-show-check) shows the session as not ready until it is recorded.
- When the link drops, both ends are told in text and with a sound, and the remote performer gets the fallback pattern (story-handover-and-fallback-performer-signal).
- The story is tested over a simulated link with a delay and loss Casey sets, and once in the two-site test (story-session-recording-two-site-test).
