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

## Stories

- None yet.

## Release groups

- Link entry and containment ship first.
- Each tier ships when a show needs it. Player guests are designed in the first release.

## Dependencies

- epic-outputs-and-streaming.
- epic-budgets-and-cost, for cloud costs.

## Open questions

- What are the delay target and limit for the interactive tier? They are TBD.
- Which show needs player guests first?

## Out of scope

- Ticketing, which is out of scope.
- Viewpoint choice (REQ-audience-7), which is later.
