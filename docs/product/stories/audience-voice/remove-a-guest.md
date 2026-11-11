---
id: story-audience-voice-remove-a-guest
status: approved
derived-from:
  - epic-audience-voice#outcome: f83d52994def
  - persona-show-operator#goals: 408315e4f8f6
---

# Mute, hide or remove a guest during a show

As Alex, the show operator, I want to mute, hide or remove any guest during a show so that I can keep guests safe and step in when a guest needs help.

## Acceptance criteria

- Alex, or the person named for moderation, can do any of these to any guest from the operator console, in two steps or fewer, by choosing the guest from a list or in a view of the world: mute, so that nobody hears or sees their voice, text or reactions; hide, so that their avatar and input are hidden from everyone else while they still see the show; or remove, so that their session ends and their rejoin token (story-remote-guests-rejoin) and the code use they entered with are blocked for the session. A public link cannot block re-entry: a removed guest who opens a public link again comes in as a new guest, and Alex can remove them again. Alex or that person can undo a mute or a hide. A removal stands for the rest of the session unless Alex lets the guest rejoin.
- A guest who is removed sees a plain message and the show's aftercare step (story-guest-care-room-safety). Whether a muted or hidden guest is told, in plain words, is set in the show's moderation rules (story-audience-voice-moderation-rules).
- Each action is an operation, not a change during a live run (story-session-operations-live-changes). It is logged with who acted, when and what they did, and names the guest only by a label that identifies no one outside the session. An agent cannot mute, hide or remove a guest.
- On a show declared solo, these actions are covered by the moderation rules and Kai's mute (story-audience-voice-moderation-rules), as story-show-safety-solo-show requires.
- The actions work with every agent and the internet disconnected for guests in the venue. The story is tested with simulated guests of each audience type, and once in a rehearsal with real guests.
