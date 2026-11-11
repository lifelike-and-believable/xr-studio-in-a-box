---
id: story-remote-guests-join-by-link-or-code
status: approved
derived-from:
  - epic-remote-guests#outcome: b4af335ea8ee
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Join through a link or code, which can carry a tier

As Jamie, the audience member, I want to join a show with a link or code so that I get in with no setup trouble.

## Acceptance criteria

- The remote tiers are those of REQ-audience-10: interactive guests (story-remote-guests-interactive-guest), player guests (story-remote-guests-player-guest) and stream viewers, who watch a stream destination (story-outputs-and-streaming-stream-to-platforms) and whose reactions reach the show as a combined summary. With guests in the venue, they are the show's audience types. This story defines the remote tiers and the audience types. Other stories refer to them by this story's id.
- Jamie enters through a link or code issued by whatever ticketing the show uses. The pipeline only accepts the link or code: it sells nothing and needs no account. Codes can be imported as a list from the ticketing or made by the pipeline. A code can carry a tier, or a role such as paid access to a trigger (story-audience-avatars-guest-roles). A person whose role allows it, such as Jordan, sets what each batch of codes carries, in production mode (story-show-safety-switch-modes). An agent can draft it but cannot set it.
- A code works only for its show and session, for the number of uses set with it. A code that is not valid, used up or for another session is refused in plain words that say what to do next.
- From the link, Jamie reaches the pre-show (story-guest-care-standard-pre-show) with nothing to install as a player guest or stream viewer, and passes its required steps (story-guest-care-notices-and-warnings) before entering. The time from opening the link to entering the show is measured in rehearsal and shown against a target the director or their delegate sets.
- A code does not identify a guest. Nothing about a guest is kept beyond the session except as story-guest-care-guest-data allows, and the join log holds counts only.
- The story is tested with simulated guests joining in each tier on each tier's test device (story-asset-checks-check-against-budget), and in one rehearsal with real guests on their own devices.
