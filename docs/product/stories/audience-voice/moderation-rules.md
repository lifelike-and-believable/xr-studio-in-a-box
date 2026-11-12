---
id: story-audience-voice-moderation-rules
status: approved
derived-from:
  - epic-audience-voice#outcome: f83d52994def
  - persona-director#goals: a92ca172be83
---

# Set moderation rules for a show, approved by a person

As Morgan, the director, I want each show's moderation rules approved by the person who holds the audience-facing safety and consent approval so that this approval stays with a person and never goes to an AI.

## Acceptance criteria

- A show's moderation rules say what guest input may reach a performer, the scene, an output or other guests, and what happens to the rest: which text, reactions and guest voice are let through, held for a person or dropped, who can mute a guest's voice, the rate each guest may send at, who moderates during the show, and the guest safety settings (story-audience-voice-personal-space, story-audience-voice-mute-and-block, story-audience-voice-remove-a-guest). The director or their delegate drafts them in production mode (story-show-safety-switch-modes), and an agent can draft them too. This story defines moderation rules and who approves them. Other stories refer to them by this story's id.
- The person the project records as holding the audience-facing safety and consent approval (story-project-record-name-approvers) approves each show's moderation rules and each change to them, before any session with guests. An agent cannot approve them. In show mode a change is a change during a live run (story-session-operations-live-changes) and also needs that holder's approval.
- During the show, automatic filters apply the approved rules. The filters work with every agent disconnected, and for guests in the venue with the internet disconnected as well. Where rules hold an item for a person, only the person named for moderation and others whose role needs it can see the held items (REQ-workflow-17), and they let each through or drop it.
- On a show declared solo (story-show-safety-solo-show) with nobody watching the input, the rules are set beforehand so that nothing waits for a person: an item a rule would hold is dropped. Kai also has a mute that stops all guest text, reactions and voice reaching Kai, the scene and the outputs until Kai lifts it. It works while performing, without a screen or keyboard, and Kai perceives that it has acted in at least two senses, with a pattern distinct from the solo controls and the performer signal. Kai's emergency stop stays as in story-show-safety-solo-show.
- The rules also say how each public platform's own chat is moderated, since chat there shows to every viewer whether or not it reaches the show: the platform's moderation settings, its blocked words and the named people who moderate on the platform during each session. The company is responsible for chat on the show's own stream. A person sets these on the platform, never an agent, and they are checked before going live (story-outputs-and-streaming-approve-going-live).
- Before approving, the holder sees the rules run on a recorded or simulated set of chat and reactions, with items meant to pass and items meant to be held or dropped, and sees the result for each in text. The test runs with every agent disconnected.
