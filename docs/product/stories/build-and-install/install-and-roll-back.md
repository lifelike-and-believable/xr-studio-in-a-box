---
id: story-build-and-install-install-and-roll-back
status: approved
derived-from:
  - epic-build-and-install#outcome: ac937a2b0f34
  - persona-capture-crew#goals: a63bac7ade3c
---

# Install a build on a venue machine, check it and roll it back

As Casey, the capture crew, I want a guided install of a delivered build on each show machine at a venue, with a check and a one-step roll back, so that I can install a versioned build on a venue system, check it and roll it back without writing code.

## Acceptance criteria

- Casey, or another person whose role allows it, can install a delivered build (story-build-and-install-build-from-stages) on each show machine of a venue through a guided step, with no code or command line, from a local copy with no internet. The step shows the build version, the target, and whether the build was accepted at the build for a public show gate (story-build-and-install-automatic-checks). This story defines installing and rolling back a build. Other stories refer to it by this story's id.
- Only a build accepted at that gate can be installed for a show with a public audience. A build for rehearsal can be installed, and the operator console and the pre-show check (story-session-operations-pre-show-check) then show "rehearsal build" in text.
- After an install, a check runs on each machine: the files are complete, the version matches, and the show starts and reaches its first cue on the venue's outputs. Casey sees each result in plain words, with pass or fail in text, and a failure also with a sound. The pre-show check confirms that every show machine of the show runs the same build version.
- The previous build stays on each machine. Casey can roll back to it in one step, with a control that asks them to confirm, and the same check runs. Install and roll back cannot start while a session with guests runs. Each install and roll back is logged with who did it, the machine, the time and the old and new versions. An agent cannot install or roll back a build on a venue machine.
- The story is tested on two show machines on a venue network with the internet disconnected, using the first release's PC VR and projection kit: install, check, a check made to fail with a damaged file, and roll back.
