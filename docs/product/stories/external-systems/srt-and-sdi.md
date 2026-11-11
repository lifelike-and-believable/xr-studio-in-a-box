---
id: story-external-systems-srt-and-sdi
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Exchange video through SRT and SDI

As Sam, the technical artist, I want to send and receive video through SRT and SDI, as well as NDI and Spout, so that I can add cameras, vision mixers, media servers and remote links as integrations without modifying the core.

## Acceptance criteria

- Sam can send an output of the show, and show an incoming stream in the world or on an output, through SRT over a network and through SDI on a capture and playout card in the show machine. Sam sets each one up without code and in production mode (story-show-safety-switch-modes), in the same way as NDI (story-external-systems-video-and-timecode). The SDI card is one that Sam chooses with the director or their delegate and that is recorded in the first release's test kit (story-build-and-install-measure-against-budget). An agent cannot choose it.
- On the venue network, SRT and SDI work with every agent and the internet disconnected (REQ-delivery-5). An SRT stream sent to a remote audience is a stream destination (story-outputs-and-streaming-stream-to-platforms): it drops, needs approval to go live on a public platform (story-outputs-and-streaming-approve-going-live) and shows the holding screen after an emergency stop as that story says. An incoming SRT stream from outside the venue network is used only as part of a remote performer's link (story-session-recording-remote-performer): the show declares that it depends on that link, and losing it follows the show-level fallback plan (story-show-safety-show-level-fallback).
- If an incoming SRT or SDI stream drops (story-handover-and-fallback-automatic-switch), including when an SDI cable is pulled, it is replaced by the image Sam sets, and Alex is told in plain words and by a sound, as for NDI (story-external-systems-video-and-timecode). If the receiver of an outgoing stream in the venue disconnects, Alex is told in the same way, and the rest of the show carries on.
- The delay of each SRT and SDI stream, each way, is measured and shown, with the frame rate and resolution in use. For SRT, the latency setting Sam chose and the lost packets are shown beside it.
- The story is tested on the first release's test kit against simulated SRT and SDI (story-external-systems-video-simulators), and against recorded SRT and SDI streams until that story is built. It is tested once in rehearsal with a real SRT sender and receiver and a real SDI device, such as a camera or a vision mixer, which Sam chooses with the director or their delegate before the story is accepted. Each result is recorded with the device, the date and pass or fail.
- In show mode, only a person whose role allows it changes these settings, following the rules for changes during a live run (story-session-operations-live-changes). An agent cannot change them.
