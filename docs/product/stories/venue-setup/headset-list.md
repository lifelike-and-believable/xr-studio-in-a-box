---
id: story-venue-setup-headset-list
status: approved
derived-from:
  - epic-venue-setup#outcome: a0070cbdbc62
  - persona-venue-attendant#goals: ee33f70fd41e
---

# See a plain headset list, and open a live view of one guest's headset

As Taylor, the venue attendant, I want a plain list of the show's headsets, and a live view of any one guest's headset, so that I can fit, clean and hand out headsets and help guests who are uncomfortable or confused.

## Acceptance criteria

- In a show that uses headsets, Taylor sees a plain list of them with each one's name, charge, assigned guest (shown by a session label, not personal data), cleaned or not, and connection. Where the show admits minors, it also shows in text whether a guardian's consent is recorded for that guest (story-guest-care-guest-data). States are shown in text, not by colour alone. A low charge or a lost connection is also announced with a sound, at a charge level the director or their delegate sets. A wired headset with no battery shows "wired". Only people whose role needs it can see the list.
- Taylor can assign a headset to a guest and mark it cleaned. When a guest's session ends, their headset is marked not cleaned, and it cannot be assigned to a new guest until Taylor marks it cleaned.
- Taylor can open a live view of what one guest's headset shows. The view is live only, is never recorded, reaches no output, and only Taylor and the cast and crew named for the session can open it. It cannot be opened in a show with guests until the show's notice to guests says that staff can see a guest's view, approved by the holder of the audience-facing safety and consent approval (story-project-record-name-approvers). An agent cannot approve the notice or open the view. Until the view is allowed, Taylor can still use it in tests with informed crew, and in a show the list offers Taylor a short plain script for asking a guest what they see and how they feel.
- The list and the view work with every agent and the internet disconnected.
- The story is written and tested for the first release's PC VR headsets, including wireless PC VR, on the first release's test kit (story-build-and-install-measure-against-budget), with simulated guests (story-live-signals-guest-presence). Headsets for UC-1's touring kit and standalone headsets are added by a separate epic once that hardware is chosen.
