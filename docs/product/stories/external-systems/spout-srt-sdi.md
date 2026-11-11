---
id: story-external-systems-spout-srt-sdi
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Exchange video through Spout, SRT and SDI

As Sam, the technical artist, I want to send and receive video through Spout, SRT and SDI, as well as NDI, so that I can add media servers, video links and broadcast equipment as integrations without modifying the core.

## Acceptance criteria

- Sam can send an output of the show, and show an incoming stream in the world or on an output, through Spout with another application on the same show machine, through SRT over a network, and through SDI with a video card in the show machine. Sam sets each one up without code and in production mode (story-show-safety-switch-modes), in the same way as NDI (story-external-systems-video-and-timecode). Spout works only on Windows, and on other systems the setup says so in plain words.
- If an incoming Spout, SRT or SDI stream drops (story-handover-and-fallback-automatic-switch), it is replaced by the image Sam sets, and Alex is told in plain words and by a sound, as for NDI (story-external-systems-video-and-timecode). If the receiver of an outgoing stream disconnects, Alex is told in the same way, and the rest of the show carries on.
- SRT inside the venue runs on the venue network with no internet. SRT over the internet carries only what reaches remote audiences, or a link the show declares under REQ-delivery-5, and losing it does not stop the show in the venue.
- The delay of each kind of stream, each way, is measured and shown, with the frame rate and resolution in use.
- The story is tested against recorded or simulated streams (story-external-systems-other-simulators). It is tested once in rehearsal with a real SDI card, source and receiver, which the project chooses before the story is accepted, and once with SRT between two machines on a network. Apart from SRT to remote audiences, it works with every agent and the internet disconnected.
- In show mode, only a person whose role allows it changes these settings, following the rules for changes during a live run (story-session-operations-live-changes). An agent cannot change them.
