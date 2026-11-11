---
id: story-handover-and-fallback-define-fallback
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-capture-crew#goals: a63bac7ade3c
---

# Define a fallback for each channel

As Casey, the capture crew, I want to set what each channel falls back to so that I can swap a failed device without stopping the session.

## Acceptance criteria

- Casey can choose a fallback for each channel of a character, and for each scene value a live signal drives: another source, a recording or loop, or a safe hold. The fallback is what drives the channel or value while its input has dropped (story-handover-and-fallback-automatic-switch). An AI-held pose is offered as a fallback only once AI assists arrive in Layer 7.
- For a body, hands, face or other pose channel, a safe hold keeps the last good pose, then eases to the character's rest pose. For a scene value, or a voice, effects or materials channel, a safe hold keeps the last good value, then eases to a neutral value Casey sets. Casey sets the ease time for each channel or value. Anything with no fallback chosen uses a safe hold, and Casey can see which have none.
- A recording of a performer can be chosen as a fallback only if that performer's agreement allows standing in for them (story-session-recording-record-agreement). Otherwise it is refused, and Casey is told why.
- A channel with a legibility bar cannot have an AI-held pose as its fallback (story-handover-and-fallback-legibility-bar). In Layer 2 this is checked by confirming that no AI option is offered for any channel. Once Layer 7 adds AI-held poses, a channel set to one uses a safe hold if AI cannot run or the performer has switched AI off.
- Only Casey, or another person with the capture crew's role, can set or change a fallback. In show mode, only such a person at the show can, and each change is logged with who made it. An agent cannot set or change a fallback.
