---
id: story-venue-setup-offline-show
status: approved
derived-from:
  - epic-venue-setup#outcome: a0070cbdbc62
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Run a full show on the venue network with the internet disconnected

As Sam, the technical artist, I want a full show tested on the venue network with the internet disconnected so that I can make sure the show keeps running when agents and the internet are gone.

## Acceptance criteria

- Every function that performers, operators and the venue audience need during a show works on the venue network with no internet (REQ-delivery-5): cues, capture, outputs in the venue, the crew channel, the pre-show check and the emergency stop. Only outputs to remote audiences need the internet.
- The build record lists every address outside the venue network that the delivered build contacts, including licence checks of tools and plugins. The test fails if any in-venue function contacts one or waits for one.
- The offline test runs a full show on the delivered build (story-build-and-install-build-from-stages), from the start to every ending, on the show machines and network in the venue profile (story-venue-setup-venue-profile), with the internet connection unplugged, every agent disconnected, simulated guests (story-live-signals-guest-presence) and recorded performer takes where agreements allow replay (story-session-recording-record-agreement). It passes when every cue fires, every in-venue output keeps running, the crew channel carries voice and text, the pre-show check completes, an emergency stop is pressed and cleared, and live capture drives a character.
- A second run cuts the internet during a show with a stream. The show carries on in the venue, the lost link follows the show-level fallback plan (story-show-safety-show-level-fallback), and Alex is told in text and with a sound. A show with a remote performer declares that it depends on that link, and the run checks its fallback (story-session-recording-remote-performer).
- The result goes with the build to the build for a public show gate (story-build-and-install-automatic-checks). The check for outside addresses also runs as one of the automatic checks on every build (story-build-and-install-automatic-checks). A public show at a venue cannot start until a passing offline test of the currently accepted build at that venue is accepted at that gate, so each newly accepted build is tested offline at each venue before its first public show there. An agent cannot accept it.
