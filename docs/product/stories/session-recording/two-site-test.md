---
id: story-session-recording-two-site-test
status: approved
derived-from:
  - epic-session-recording#outcome: 196669ad74cf
  - persona-capture-crew#goals: a63bac7ade3c
---

# Test a remote performer between two real sites

As Casey, the capture crew, I want to test a remote performer between two real sites over the internet so that I can measure the performer's latency and prove that it is within budget.

## Acceptance criteria

- Kai, at one site, drives a character at a second site over an ordinary internet connection, using the remote performer setup (story-session-recording-remote-performer). The two sites are real locations the project chooses, not one network.
- Over a run whose length Casey sets, Kai's own view and the delay to the second site are measured and shown at both sites, against the show's delay target (story-live-puppet-measure-delay). The results, with the worst delay and how often it was over the target, are saved in the project with the date, sites and connections.
- Casey cuts the link at least once during the run. The character's channels at the second site switch to their fallbacks, Kai gets the performer signal's fallback pattern (story-handover-and-fallback-performer-signal), and when the link returns the character goes back to Kai with no visible jump (story-handover-and-fallback-return-recovered-source).
- Recording at either site follows Kai's agreement (story-session-recording-check-agreement).
- The results are compared with the simulated link in story-session-recording-remote-performer. Casey changes the simulated delay and loss to match what was found, so later tests on the simulated link reflect a real connection.
