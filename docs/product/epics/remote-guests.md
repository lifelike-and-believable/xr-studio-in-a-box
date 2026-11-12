---
id: epic-remote-guests
status: approved
derived-from:
  - requirements-audience#REQ-audience-10: 326aa51d7472
  - requirements-audience#REQ-audience-14: ebe710dabf44
  - requirements-audience#REQ-audience-15: 4a34322de282
  - requirements-delivery#REQ-delivery-11: 0ee0b26b21d0
  - persona-audience-member#goals: e1b5f3ebc15b
  - persona-producer#goals: d1cc47b03be9
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Join from anywhere, in the tier that suits you

<!-- Layer 6, audience. -->

## Outcome

Remote guests join by link or code as interactive guests, player guests or stream viewers, can rejoin a session, and a failure in any audience system stays contained.

## Personas

- persona-audience-member: gets in easily, on the device they have.
- persona-producer: sees what cloud sessions cost.
- persona-technical-artist: keeps audience failures away from the performer loop.

## Proposed stories

- Join through a link or code, which can carry a tier.
- Arrive late, and rejoin the same session with the same avatar.
- Join as an interactive guest through an installed app or a cloud session.
- Join as a player guest, with a light input layer over the stream.
- Move guests past the limit to a lower tier.
- Keep an audience failure from reaching the performer loop or other audiences.
- Set up hosting for the player page, the cloud sessions and the installed app's download, with each provider's terms on guest data checked and credentials kept from agents.

## Stories

- story-remote-guests-join-by-link-or-code
- story-remote-guests-rejoin
- story-remote-guests-interactive-guest
- story-remote-guests-player-guest
- story-remote-guests-move-past-the-limit
- story-remote-guests-contain-failures
- story-remote-guests-host-online-audience

## Release groups

- Link entry and containment ship first.
- Each tier ships when a show needs it. Player guests are designed in the first release.

## Dependencies

- epic-outputs-and-streaming.
- epic-budgets-and-cost, for cloud costs.

## Open questions

- Answered: interactive guests see the show within 1 second of a performer's movement, so their input feels live. The director or their delegate confirms or changes the target from a test on a real internet connection before story-remote-guests-interactive-guest is accepted. The tier's limit is its guest count, measured in a load test on the first release's test kit and set by the director or their delegate (story-audience-avatars-choose-an-avatar) (approver's answers).
- Answered: UC-2, the livestreamed improvised puppetry show, is the first show with player guests (story-remote-guests-player-guest) (approver's answer).

## Out of scope

- Ticketing, which is out of scope.
- Viewpoint choice (REQ-audience-7), which is later.
