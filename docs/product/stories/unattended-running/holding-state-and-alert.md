---
id: story-unattended-running-holding-state-and-alert
status: approved
derived-from:
  - epic-unattended-running#outcome: d435481b65a1
  - persona-venue-attendant#goals: ee33f70fd41e
---

# Show a safe holding state and alert a named person when recovery fails

As Taylor, the venue attendant, I want the show to hold a safe state and alert me when it cannot recover so that I can tell in plain language that it is not ready and what to do.

## Acceptance criteria

- When recovery fails (story-unattended-running-restart-and-recover) or the pre-show check fails at opening, the outputs go to the safe holding state: the show's safe state for screens, projection and sound (story-show-safety-declare-safe-state), with a plain notice to guests that the experience is closed for now. A watcher outside the show shows the holding notice if the show itself cannot run. The holder of the audience-facing safety and consent approval approves the holding state with the show's safe state.
- The director or the producer names who is alerted, and a backup (story-project-record-name-approvers). An agent cannot name or change them.
- The alert goes over the venue network to the operator console and to a local device the project names, such as a tablet or a light and sounder, in text and sound. It says what failed and what to do next in plain words. If the venue has internet, the alert also goes to the named person by each channel they chose (story-review-and-status-notifications). If not, it is queued and sent when the internet returns, marked with the time it happened.
- The alert repeats at an interval the named person sets until someone acknowledges it at the console or the local device. Each alert and acknowledgement is logged with who acknowledged it (story-unattended-running-maintenance-and-log).
- Each person sees only what their role needs: Taylor sees what failed and what to do, Sam can open the log entries behind it, and guests see only the holding notice.
- The story is tested in the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with the internet disconnected. A forced failure shows the holding state, and the alert reaches the console and the local device within a time the director or their delegate sets. When the internet is restored, the queued alert is delivered.
