---
id: story-live-signals-performer-sensor
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-performer#goals: 9de25c7bbe59
---

# Drive a channel from a performer's sensor

As Kai, the performer, I want a sensor on my body to drive a channel only within my agreement so that I decide what may be captured from my body and how it is used.

## Acceptance criteria

- A sensor on Kai's body, such as heart rate or breath, can drive a channel through a signal mapping (story-live-signals-map-a-signal). It is tested with a recorded or simulated sensor stream.
- As with every capture source (story-live-puppet-connect-a-source), the sensor can drive a channel only when Kai's confirmed agreement (story-session-recording-record-agreement) allows that data to be captured. Otherwise it is refused, and the person setting it up is told which part of the agreement blocks it.
- Recording the sensor data, and any later use of it, is checked against Kai's agreement in the same way as other capture (story-session-recording-check-agreement).
- After Kai's agreement is changed so it no longer allows the sensor, the sensor cannot be connected in a new session.
- Before a session, Kai can see which channels their sensor drives and whether it is recorded.
