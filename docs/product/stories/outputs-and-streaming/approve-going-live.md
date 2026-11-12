---
id: story-outputs-and-streaming-approve-going-live
status: approved
derived-from:
  - epic-outputs-and-streaming#outcome: 6afddd5b3ae6
  - persona-director#goals: a92ca172be83
---

# Approve going live on a public platform

As Morgan, the director, I want going live on a public platform to need the approval of the person who holds the publishing and marketing approval, so that this approval stays with a person and never goes to an AI.

## Acceptance criteria

- A stream destination on a public platform (story-outputs-and-streaming-stream-to-platforms) cannot go live until the person the project records as holding the publishing and marketing approval (story-project-record-name-approvers) approves it for the show. The approval names the platform, the destination and the sessions it covers, and is recorded with who gave it and when. An agent can prepare the approval but cannot give it or go live.
- Before the first public stream to any destination, the show's own player page included, the licences of the music in the stream's mix are checked (story-sound-path-sound-assets, story-provenance-and-policy-quality-and-licence-gate). Before the first public stream on a platform, that platform's terms on music and chat data are also checked against the show's policy record (story-provenance-and-policy-record-terms). The person the project records as holding the contracts and licence terms approval records each item as allowed or in conflict, in plain words, and closes each conflict. An agent can prepare the items but cannot record or close them. The publishing and marketing holder cannot approve while any conflict is open. The check is recorded with the date of the terms checked. When the contracts and licence terms holder records a change in a platform's terms, or the show's music changes, the check opens again.
- Without an approval, the go-live control for that destination is blocked, and says why in plain words. The show's own player page is public, and needs the same approval and the music check before it goes live. Only a private stream that only the crew can see needs no approval, and it is marked in text as not public.
- The approval records whether the platform keeps a recording of the stream. A recording the platform keeps or offers to viewers after the stream is audience replay (REQ-delivery-21), which comes later. Until it arrives, the destination cannot be approved unless the platform's recording is off, or set to be removed when the stream ends, as the publishing and marketing holder records. Once it arrives, keeping one also needs every performer's agreement to allow replay to audiences (story-session-recording-record-agreement).
- Viewers on a public platform watch the platform's own page and never pass the pre-show. Before the destination is approved, the holder sees that its listing carries the show's warnings (story-guest-care-notices-and-warnings), a platform audience age setting that matches the show's minimum age, and a notice that chat may reach the show and its performers, and that the platform's own chat is set up as the show's moderation rules say (story-audience-voice-moderation-rules). An agent can draft the listing but cannot publish it.
- Ending a public stream is never blocked: Alex or the holder can end it at any time, and an emergency stop (story-show-safety-emergency-stop) puts it on the holding screen.
- The story is tested with a private YouTube Live stream, and with a simulated public platform for the blocked and approved cases, with every agent disconnected.
