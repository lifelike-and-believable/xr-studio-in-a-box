---
id: story-project-record-see-how-it-was-set-up
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - persona-producer#goals: d1cc47b03be9
---

# Show a newcomer how the project was set up

As Jordan, the producer, I want a person who joins a project part way through, such as Sam hired for one production, to see how it was set up so that I can bring new people onto a production quickly.

## Acceptance criteria

- A person added to a project (story-project-record-add-person) can open a setup summary built from the project record and the activity log (story-agent-work-read-activity-log). It lists the characters and their mapping versions, the capture sources, the adapters and the tools they connect (story-agent-work-tool-adapter), the workflow steps added (story-agent-work-extend-the-workflow), the engine and plugin versions per target (story-build-and-install-engine-and-plugin-versions), the approvers per area (story-project-record-name-approvers) and the items that are blocked.
- Each entry names who set it up and when, and links to the full record.
- The summary shows only what the person's role allows (REQ-workflow-17). Protected items, such as bank details and tax numbers, never appear.
- The summary updates as the project changes, with no one maintaining it. An agent can draft a written handover note from it, marked as drafted by an agent, but cannot change any setting the summary shows.
- The story is tested with a simulated project that has a recorded setup: a newly added person with Sam's role is checked to see the full summary, and one with Riley's role only the parts their role allows.
