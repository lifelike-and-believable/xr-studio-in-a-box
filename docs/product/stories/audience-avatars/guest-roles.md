---
id: story-audience-avatars-guest-roles
status: approved
derived-from:
  - epic-audience-avatars#outcome: 5457b095ba74
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Declare guest roles, with guests muted by default

As Quinn, the interaction designer, I want to declare the roles a show's guests can hold so that what each guest can do, who can see and hear them and what they hear is in a form others can review.

## Acceptance criteria

- Quinn declares the show's guest roles in the interaction design (story-interaction-design-record-design), without code: for each role, what guests in it can do, who can see and hear them, and what they hear (REQ-audience-21). Every guest holds one role. A show that declares none has one default role: seen by performers and other guests, heard by nobody, hearing the show. The roles go through the interaction design gate. An agent can draft them but cannot accept them.
- Guests are muted by default in every role. A guest in a role that lets them be heard is unmuted only after their consent for voice is recorded for that session (story-guest-care-notices-and-warnings, REQ-governance-7), and only when the show's moderation rules cover guest voice (story-audience-voice-moderation-rules).
- A link or code can place a guest in a role (story-remote-guests-join-by-link-or-code). During a session, a person whose role allows it, such as Alex, can move a guest between the declared roles, and the guest is told in text and with a sound. On a solo show, a rule set beforehand does this (story-show-safety-solo-show). Each move is logged with who made it. An agent cannot move a guest in show mode. Changing the declared roles in show mode is a change during a live run (story-session-operations-live-changes).
- In a prototype (story-interaction-design-playable-prototype) with simulated guests in each role, a scripted test checks that each guest can do only what their role allows, is seen and heard only by those their role names, and hears only what their role names.
