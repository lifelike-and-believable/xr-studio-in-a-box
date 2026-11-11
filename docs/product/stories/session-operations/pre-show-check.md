---
id: story-session-operations-pre-show-check
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-show-operator#goals: 408315e4f8f6
---

# Run one pre-show check, and a shorter one between sessions

As Alex, the show operator, I want one check that confirms everything the show needs is ready, and a shorter one between sessions, so that I know before doors open that the build, sources, outputs and links are ready.

## Acceptance criteria

- Alex can start one check from the operator console that confirms the build, each capture source, each output, each external link, the venue profile and alignment (REQ-delivery-14) and any spare machine (REQ-delivery-13) are ready. Until venue profiles, spare machines and delivered builds arrive in Layer 5 (epic-venue-setup, epic-build-and-install), those items are simulated in the test, and the result marks them as simulated.
- The result lists every item as ready or not ready in plain language, says what to do next for each problem, and shows pass or fail in text, not by colour alone. A problem is also announced with a sound.
- A shorter check runs between sessions, after a reset (story-session-operations-reset-for-next-session). It covers at least the capture sources, outputs, external links and the reset itself. The director or their delegate chooses any further items it covers, in production mode.
- The check can run automatically at a time Alex sets. Its result is shown on the operator console and sent to the person the show names, by the channel they choose (story-review-and-status-notifications). Sending it beyond the venue network needs the internet, and the check itself does not.
- The check only reads the show's state and changes nothing. Only a person can fix a problem it finds, and an agent cannot mark an item ready.
- The check runs with every agent and the internet disconnected. It is tested in the Unreal Editor, with the show run as a standalone game on the test device named in the budget file (story-asset-checks-check-against-budget), with each item made to fail in turn.
