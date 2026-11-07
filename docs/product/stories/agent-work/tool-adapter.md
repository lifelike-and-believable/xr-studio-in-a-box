---
id: story-agent-work-tool-adapter
status: approved
derived-from:
  - epic-agent-work#outcome: f707c8c84ba0
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Reach a tool through an adapter

As Sam, the technical artist, I want to reach an external tool through an adapter so that I can replace it without rewriting the workflow around it.

## Acceptance criteria

- Tripo works through an adapter as the first external tool.
- Sam can replace it with another generator without changing the workflow that uses it.
- The tool's run is checked against the policy gate and spend limit before it starts.
- What the tool returns carries a provenance record.
