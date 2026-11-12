---
id: decision-agent-runtime
status: draft
derived-from:
  - epic-agent-work#outcome: f707c8c84ba0
  - persona-director#goals: a92ca172be83
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-producer#goals: d1cc47b03be9
---

# Decision: agents run in our own runner on the Claude Agent SDK, behind chat in the dashboard, and act only through the record

## Context

The agent stories set out what the runtime must guarantee:

- Morgan directs agents in chat. The agent says what it will do and reports what it did (story-agent-work-direct-an-agent).
- Every action is logged with the project, stage, tool and the person who requested or approved it (story-agent-work-read-activity-log).
- Agents reach only granted projects, tools and folders. They cannot delete approved work, change roles, limits or the policy record, or send anything outside the project (story-agent-work-agent-permissions).
- Metered work stops at the limit (story-agent-work-spend-limit).
- Identifiers never reach chat with an agent (story-contracts-and-payment-protect-sensitive-data).
- No live function depends on an agent (REQ-workflow-9).
- Text from tools and documents is data, not instructions (SEC-003).

Sam needs to see why an agent failed. Jordan needs spend to stop.

## Options

| Option | For | Against |
|---|---|---|
| A. Our runner uses the Claude Agent SDK. Chat lives in the dashboard. The agent's only tools are record commands and adapters, served from an in-process MCP server. | We own every input before it reaches the model, so identifiers can be filtered. The SDK (0.3.322) provides tool allow-lists, `canUseTool`, `PreToolUse` hooks, a sandbox and a per-query `maxBudgetUsd`. | The SDK runs a Claude Code process, so it needs a long-running host. It ties us to one model vendor. The SDK is at 0.x and changes often. |
| B. People use Claude Desktop or Claude Code, connected to an MCP server we host | No chat interface or runner to build. Strong client. | What a person types reaches the model provider before our server sees it, which breaks the identifier rule. Model spend is not metered per project. The log depends on the client calling our tools. |
| C. Our own agent loop on the Messages API | Full control. No subprocess. | We rebuild tool handling, context management and sub-agents that the SDK already has. |
| D. A multi-vendor agent framework | Can swap model vendors. | Another abstraction with no requirement behind it. Enforcement has to be built anyway. |

## Decision

Option A. The decisive point is that only a chat surface we own can stop identifiers reaching the model, and only a runner we own can meter model spend per project.

- **Chat** messages are written to the record first. The command layer filters them, the runner picks up the task, and replies are written back. Chat is therefore project state, visible on every surface the person's role allows.
- **Enforcement lives in the record, not the runner.** For each task, the runner gets a short-lived agent token tied to the requesting person and the grant. Every tool call is a record command, checked against the grant and the never-for-agents list (decision-identity-and-roles). Refusals are logged by the record. The runner's hooks are a second check and give the agent plain-words reasons.
- **Built-in tools** (files, shell, web) are off by default. A grant that names folders turns on file tools for those paths only, using the SDK sandbox and a path check in `canUseTool` `[assumed]`. The spec verifies this against the installed SDK.
- **Spend** is kept in our own ledger. Before each metered call (a model turn or an adapter run), the runner reserves the maximum estimated cost. If the reservation would pass the limit, the call is refused. The actual cost is settled afterwards. With no limit set, every reservation is refused, with a message naming who can set one. As a backstop, the SDK's `maxBudgetUsd` is set to the remaining headroom. The SDK documents its cost as an estimate, not a bill.
- **Out of the live path:** the runner has no route to show machines. The show runtime plugin depends only on the show package. Layer 4's test with agents stopped checks this.
- **Model access** uses an Anthropic API key held by the runner, never shown to the agent `[assumed]`. Anthropic's commercial terms for the Agent SDK settle whether a subscription sign-in is allowed instead.

## Consequences

- Hard to reverse: chat as record state, and the agent token model. The SDK can be replaced by option C behind the runner without changing the record.
- Where the first runner runs (a cloud worker or a studio workstation) is for the approver `[open]`. So is whether model use counts as metered work under the limit `[open]`.
- Revisit if Claude Desktop gains a hook that filters input before sending, or if another vendor's model is needed for a task.
