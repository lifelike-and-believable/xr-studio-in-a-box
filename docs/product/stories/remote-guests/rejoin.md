---
id: story-remote-guests-rejoin
status: approved
derived-from:
  - epic-remote-guests#outcome: b4af335ea8ee
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Arrive late, and rejoin the same session with the same avatar

As Jamie, the audience member, I want to arrive late, and to rejoin the same session as the same avatar after losing connection, so that I can join with no setup trouble and rejoin as the same avatar after losing connection.

## Acceptance criteria

- Jamie can join after the session starts, until a time the director or their delegate sets for the show, or not at all if they set that. A late guest passes the pre-show's required steps (story-guest-care-notices-and-warnings) and enters at the current point of the show. The show does not stop or hold for them.
- A guest has lost connection when their device sends nothing for longer than a timeout Sam sets. Their avatar then shows as away, as the interaction design sets (story-interaction-design-record-design), never frozen in place.
- On entry, each guest's device receives a rejoin token for that session. It identifies no one outside the session. Within a rejoin window the director or their delegate sets, Jamie rejoins on the same device with that token and gets back the same avatar (story-audience-avatars-choose-an-avatar), role (story-audience-avatars-guest-roles) and tier, without repeating consent given for that session. On another device, Jamie can rejoin the same tier by opening the link or code again, and repeats the consent steps (story-guest-care-notices-and-warnings) before any capture. Their place in the tier's limit is held during the window.
- After the window or at the session's end, the hold ends and Jamie's session data is deleted (story-guest-care-guest-data).
- An agent cannot change the late-entry time, the timeout or the rejoin window in show mode.
- The story is tested by cutting the connection of simulated guests in each tier at several cues and reconnecting them, including a second guest using the same multi-use code on another device, who gets no consent or role from the first, and in one rehearsal with real guests. The time from reconnecting to being back in the show is measured and shown against a target the director or their delegate sets.
