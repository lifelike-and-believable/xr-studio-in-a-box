---
id: story-external-systems-video-simulators
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Test video streams against simulators

As Sam, the technical artist, I want simulators for NDI, Spout, SRT and SDI video streams so that I can see why a video integration failed and fix the cause once for every project.

## Acceptance criteria

- NDI, Spout, SRT and SDI each have a simulator, and each simulator ships with its own protocol's story, that stands in for a real sender and a real receiver in tests, alongside story-external-systems-simulators and story-external-systems-other-simulators. A simulator uses the same setup as the real system, so a show needs no change to switch between them. The SDI simulator stands in for the SDI card (story-external-systems-srt-and-sdi), so tests need no card. A simulated sender sends a test picture that shows its frame number and time, so delay and lost frames can be measured.
- Each simulator can be made to drop (story-handover-and-fallback-automatic-switch), to change frame rate or resolution, and to lose or delay frames by an amount Sam sets. The SRT simulator can also add network delay and lost packets, set by Sam, or by Casey when it stands in for a remote performer's link (story-session-recording-remote-performer), and can stand in for a remote destination (story-outputs-and-streaming-stream-to-platforms) or a remote performer's link (story-session-recording-remote-performer) that is lost.
- Sam can record a stream a real system sends in rehearsal, and replay it in tests. Replaying the same recording twice gives the same result. Recordings are made only in rehearsals with no guests, and a recording that shows a performer is kept and used only as their agreement allows (story-session-recording-record-agreement).
- An automated test can run a show against these simulators and the other simulators in this epic, with no person present, on the first release's test kit (story-build-and-install-measure-against-budget). It checks that each stream arrives and shows within a target delay with a tolerance, both set by Sam from repeated measurements, and that a dropped stream is replaced by the image Sam sets and Alex is told in plain words and by a sound. An agent cannot set the target or the tolerance. A failure names the stream, the protocol, the expected and the measured value, in plain words. The tests run with every agent and the internet disconnected.
- Real senders and receivers for these protocols, which Sam chooses with the director or their delegate, are tested in rehearsal, and each result is recorded with the system, the date and pass or fail.
- Sam can add a simulator for a new video protocol without modifying the core (story-agent-work-extend-the-workflow).
