---
id: story-schedule-and-touring-manifests-and-checklists
status: approved
derived-from:
  - epic-schedule-and-touring#outcome: 4e30b30b18d6
  - persona-capture-crew#goals: a63bac7ade3c
---

# Draft equipment manifests and travel and set-up checklists for each venue

As Casey, the capture crew, I want an equipment manifest and travel and set-up checklists drafted for each show at each venue so that each capture source, headset and show machine is set up and checked there through a guided process.

## Acceptance criteria

- An equipment manifest lists, for one show at one venue, each item the production brings and each the venue provides, with its count, who owns it and its state (packed, at the venue, returned or missing) in text. It is drafted from the show's declared space, outputs, external systems and staffing (story-venue-setup-fit-check), the venue profile (story-venue-setup-venue-profile), the headsets in the headset list (story-venue-setup-headset-list), the show machines and any spare machine (story-venue-setup-failed-machine-plan), and the build version to install, carried as a local copy (story-build-and-install-install-and-roll-back). Venue facts are read from the venue profile, never typed again (REQ-business-10). This story defines an equipment manifest. Other stories refer to it by this story's id.
- A travel checklist lists, for each trip in the schedule (story-schedule-and-touring-schedule), the people called, their travel and load-in calls, how the kit travels and what must be booked. A person makes every booking and payment. An agent never books, pays or sends anything outside the project (REQ-workflow-14, REQ-business-8), and never sees passport numbers or similar identifiers (REQ-business-16).
- A set-up checklist lists the steps to set up a show at a venue in order. It starts with the fit check result (story-venue-setup-fit-check) and includes installing and checking the accepted build (story-build-and-install-install-and-roll-back), the alarm connection (story-venue-setup-venue-profile), alignment (story-venue-setup-align-to-room), the headset list, whether a passing offline test of the currently accepted build at that venue is accepted (story-venue-setup-offline-show), and the pre-show check (story-session-operations-pre-show-check) last. A step that has its own guided step shows that step's result and cannot be ticked by hand. Casey ticks the other steps. States are shown in text, not by colour alone, and the manifest and set-up checklist can be opened and ticked on the venue network with no internet. This story defines a set-up checklist. Other stories refer to it by this story's id.
- An agent can draft a manifest or checklist. Casey, or another person whose role allows it, confirms each item before it is used. An agent cannot confirm an item or tick a step. Each version is dated and names who made it, and a later visit to the same venue starts from the last version. A new version of the venue profile or of the show's declared needs marks every manifest and checklist drafted from an older version as out of date, in text, until a person confirms the changes. Only people whose role needs them can see them, and network details only as the venue profile allows.
- The story is tested with a proxy show and the first release's test kit (story-build-and-install-measure-against-budget) against two venue profiles: one that fits and one with an obstacle in the guest area. The test drafts each document, confirms and ticks it, checks that steps with a guided step cannot be ticked by hand, opens and ticks the set-up checklist with the internet disconnected, and changes a venue profile to mark a manifest out of date.
