---
id: story-external-systems-surfaces-and-standalone
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-show-operator#goals: 408315e4f8f6
---

# Run a show from any surface, or with no external systems

As Alex, the show operator, I want to run the show from a touchscreen or tablet, a control surface, or a keyboard and mouse, or with no external systems at all, so that I can run a show from a cue list, a free palette, timecode or any mix of these wherever I am.

## Acceptance criteria

- Alex can run the show (go, the palette, arming, and the controls of epic-session-operations) from a touchscreen or tablet, a physical control surface over MIDI or OSC, or a keyboard and mouse, and can change surface during a session without a restart.
- The touchscreen and screen tools meet WCAG 2.2 AA. State is never shown by colour alone, and warnings come in text and sound.
- Each person sees and can use only the controls their role allows. An agent cannot use the operator controls in show mode.
- A show can run with none of the external systems present, using Unreal alone. This is tested by running a whole show with every external link unplugged.
- If an external system the show uses is missing, Alex is told in plain words which one, and the rest of the show carries on.
- The surfaces work on the venue network with every agent and the internet disconnected.
