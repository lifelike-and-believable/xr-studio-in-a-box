---
id: story-venue-setup-fit-check
status: approved
derived-from:
  - epic-venue-setup#outcome: a0070cbdbc62
  - persona-show-operator#goals: 408315e4f8f6
---

# Declare the space and staffing a show needs, and check whether a venue fits

As Alex, the show operator, I want each show to declare the space and staffing it needs, and to check it against a venue's profile, so that I can keep guests safe in a room the show was rehearsed for.

## Acceptance criteria

- The director or their delegate declares, in production mode (story-show-safety-switch-modes), the space a show needs: its guest and performer areas, the outputs and network it uses, and the external systems it needs. A show may have hand-made layouts for different venue sizes. An agent can draft a layout, and each layout goes through the environments gate (story-environment-path-approve-at-the-gate). A show never rearranges itself to fit a room: only an approved layout runs, so every layout can be rehearsed and approved.
- The director or their delegate declares the show's staffing: each role it needs at the venue, such as show operators, attendants and capture crew, and how many of each, and the most guests a session takes (the guest count). Staffing is modelled per show from these roles and counts, and is read and saved as the show's staffing in the project's facts (story-project-record-record-facts). A show with headsets in a venue that declares no attendant is flagged in text and with a sound, and cannot pass the check until one is declared (REQ-showcontrol-21). An agent can draft them but cannot set them.
- A person whose role allows it, such as Alex, Casey or the director, checks a show against a venue profile (story-venue-setup-venue-profile). The result lists, for each layout, each item as fits or does not fit, in plain words and in text, not by colour alone: space, boundaries, obstacles, outputs, network, external systems and the alarm interface. A venue whose profile records another way of handling a fire alarm (story-venue-setup-venue-profile) counts as fitting for the alarm item. It names the layouts that fit, or the items that stop any layout fitting, and lists the show's staffing beside the result.
- A layout whose guest or performer areas cross a boundary or an obstacle in the profile does not fit, and no one can override this. It can be used at that venue only after the layout or the profile changes and the check passes.
- The check only reads, and changes nothing. It is tested with a proxy level against at least two profiles: one that fits, and one with an obstacle in the guest area.
