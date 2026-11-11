---
id: story-audience-voice-mute-and-block
status: approved
derived-from:
  - epic-audience-voice#outcome: f83d52994def
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Mute and block other guests

As Jamie, the audience member, I want to mute or block another guest so that I feel safe and comfortable among other guests.

## Acceptance criteria

- Jamie can mute another guest, so that Jamie no longer hears their voice or sees their text, or block them, so that neither sees nor hears the other and nothing from them reaches Jamie. Jamie can do either in two steps or fewer, by choosing the guest from a list or by pointing at their avatar, in the world or on the player page. Jamie can undo either at any time.
- The other guest is not told. Each control is labelled in text, and Jamie sees and hears that it has acted.
- A mute or block lasts for the session, and holds if either guest rejoins it (epic-remote-guests). It is deleted with the session's other guest data (story-session-operations-reset-for-next-session) and is never stored after it.
- Guests are muted by default where the show's guest roles say so (epic-audience-avatars). Jamie's mute works in addition, and nothing Jamie mutes can be unmuted by the other guest.
- The story is tested with simulated guests, in the world and on the player page, and once in a rehearsal with real guests.
