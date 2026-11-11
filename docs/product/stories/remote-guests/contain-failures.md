---
id: story-remote-guests-contain-failures
status: approved
derived-from:
  - epic-remote-guests#outcome: b4af335ea8ee
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Keep an audience failure from reaching the performer loop or other audiences

As Sam, the technical artist, I want a failure or overload in any audience system kept away from the performer loop and from other audiences so that the show keeps running when the remote systems and the internet are gone.

## Acceptance criteria

- The audience systems are the join page and codes, the installed app's and cloud sessions' connections, the player page and its input layer, guest avatars and reactions, the chat feed and the audience summary. A failure or overload in any of them does not take the performer loop outside the show's delay target (story-live-puppet-measure-delay), or the venue outputs below their budget file's frame rate (story-asset-checks-check-against-budget), and does not stop the show for other audience types (REQ-audience-15).
- If the remote systems fail or the internet drops, the show carries on in the venue (REQ-delivery-5).
- Under overload, an audience system drops or delays the guest input past its limits, never the show. The limits are those the show sets (story-remote-guests-move-past-the-limit, story-audience-voice-moderation-rules).
- Alex is told in plain words and by a sound which audience system failed and which audience types it affects. Guests in an affected tier see a plain-words message where their device can still show one. Alex can restart a failed audience system while the show runs, and its guests can rejoin (story-remote-guests-rejoin). An agent cannot restart it in show mode.
- A scripted test on a delivered build on the first release's test kit (story-build-and-install-measure-against-budget), with simulated guests in every tier and recorded performer takes, fails and then overloads each audience system in turn, at a load the director or their delegate sets, and drops the internet once. It measures the performer loop's delay and the venue outputs' frame rate throughout and shows pass or fail in text.
