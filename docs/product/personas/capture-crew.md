---
id: persona-capture-crew
status: approved
derived-from:
  - concept#audience: f31bc32f2e88
---

# Casey, capture and technical crew

<!-- Stories link to a section, for example persona-capture-crew#goals. -->

## Goals

- Get each capture source set up and calibrated through a guided process.
- Confirm that a performer's data is reaching the right character and channel.
- Measure the performer's latency, and prove that it is within budget.
- Swap a failed device without stopping the session.
- Record sessions, within what the performer has agreed, for replay and cleanup.
- Install a versioned build on a venue system, check it, and roll it back.

## Skills and tools

- Inertial suits, optical systems, headsets and trackers, cameras, and venue networks.
- Reads technical status and fixes hardware quickly.
- Not a pipeline engineer. Does not write code.

## Context of use

In a capture volume or backstage, working around performers and against the clock, before a call or in a break. Hardware differs by production, from a high-end optical studio to a portable suit or webcam. Touring means setting up in unfamiliar rooms with unfamiliar networks **[assumed]**.

## Frustrations

- Each capture source has its own setup and its own failure modes **[assumed]**.
- Radio interference, drift and network problems that appear only in the venue **[assumed]**.
- Until the later health view arrives, relying on the pre-show check and fallbacks to find problems.

## Evidence

Named in discovery section 15 and in REQ-performance-11 and REQ-delivery-6. Frustrations are **[assumed]** from the kinds of capture used on past shows. This persona overlaps with [persona-show-operator](show-operator.md) on small productions. Keep it separate for now, because it sets up hardware before the show while the operator runs the show.
