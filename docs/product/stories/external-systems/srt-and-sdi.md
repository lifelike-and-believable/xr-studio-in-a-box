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

- Sam can send an output of the show, and show an incoming stream in the world or on an output, through SRT over a network and through SDI on a capture and playout card in the show machine. Sam sets each one up without code and in production mode (story-show-safety-switch-modes), in the same way as NDI (story-external-systems-video-and-timecode). The SDI card is part of a show machine, which Sam proposes and the director or their delegate chooses and records as part of the first release's test kit, as story-build-and-install-measure-against-budget says. An agent cannot choose it.
- On the venue network, SRT and SDI work with every agent and the internet disconnected (REQ-delivery-5). An SRT stream sent to a remote audience carries the flat livestream and is a stream destination (story-outputs-and-streaming-stream-to-platforms): it drops, shows the holding screen after an emergency stop, and needs approval to go live as story-outputs-and-streaming-approve-going-live says, unless it is a private stream only the crew can see. An incoming SRT stream from outside the venue network is used only alongside a remote performer's data stream (story-session-recording-remote-performer), and the show declares it in its show-level fallback plan as a link the show depends on (story-show-safety-show-level-fallback). Setting up an incoming SRT stream from outside the venue network in a show that declares no such link is refused, and Sam is told why in plain words.
- If an incoming SRT or SDI stream drops (story-handover-and-fallback-automatic-switch), including when an SDI cable is pulled, it is replaced by the image Sam sets, and Alex is told in plain words and by a sound, as for NDI (story-external-systems-video-and-timecode). If the receiver of an outgoing SRT stream in the venue disconnects, or the SDI card reports that an output has failed, Alex is told in the same way, and the rest of the show carries on.
- The delay of each SRT and SDI stream, each way, is measured and shown, with the frame rate and resolution in use. For SRT, the latency setting Sam chose and the lost packets are shown beside it.
- The story is tested on the first release's test kit against simulated SRT and SDI (story-external-systems-video-simulators), and against recorded SRT and SDI streams until that story is built. It is tested once in rehearsal with a real SRT sender and receiver and a real SDI device, such as a camera or a vision mixer, which Sam chooses with the director or their delegate before the story is accepted. Each result is recorded with the device, the date and pass or fail.
- In show mode, only a person whose role allows it changes these settings, following the rules for changes during a live run (story-session-operations-live-changes). An agent cannot change them.
