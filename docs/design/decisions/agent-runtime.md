---
id: decision-agent-runtime
status: approved
derived-from:
  - story-agent-work-agent-permissions#acceptance-criteria: 87d406e5fd7c
  - story-agent-work-direct-an-agent#acceptance-criteria: d3a11777747f
  - story-agent-work-read-activity-log#acceptance-criteria: 1649ac451653
  - story-agent-work-spend-limit#acceptance-criteria: d11a993a2ad7
  - story-provenance-and-policy-provenance-record#acceptance-criteria: 7a97218a0c55
  - story-contracts-and-payment-protect-sensitive-data#acceptance-criteria: 2b9128383b81
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

- **Chat** messages are written to the record first. The command layer filters them, the runner picks up the task, and replies are written back. Chat is therefore project state. A chat thread is private to the person who started it unless they share it. A shared message is given the most restrictive data class of anything it quotes, so a reader whose role cannot see prompts or budget cannot read a reply that quotes them (story-provenance-and-policy-provenance-record).
- **Enforcement lives in the record, not the runner.** For each task, the runner gets a short-lived agent token tied to the requesting person and the grant. Every tool call is a record command, checked against the grant and the never-for-agents list (decision-identity-and-roles). Refusals are logged by the record. The runner's hooks are a second check and give the agent plain-words reasons.
- **Built-in tools** (files, shell, web) are off by default. A grant that names folders turns on file tools for those paths only, using the SDK sandbox and a path check in `canUseTool` `[assumed]`. Folder access is the one check the record cannot make itself, so the runner is a second enforcement point: before each file-tool call runs, the runner writes it to the record as a logged command, and the record refuses it if the path is outside the grant. The SDK's Claude Code subprocess is started with an explicit environment that holds no vendor API keys, so an agent with a shell cannot call a vendor directly and skip the gate or the spend reservation. The spec verifies both against the installed SDK.
- **Spend** is kept in our own ledger, and the record makes every reservation. Before each metered call, the record reserves the call's maximum estimated cost; if the reservation would pass the limit, the call is refused. With no limit set, every reservation is refused, with a message naming who can set one.
  - **Model turns.** The SDK has no hook before each model request (0.3.322: no such event in `HOOK_EVENTS`, and `maxBudgetUsd` stops only after the budget is exceeded). So the runner owns a metering proxy, and the SDK subprocess reaches the model only through it, by setting `ANTHROPIC_BASE_URL` `[assumed]`, verified in slice 7 (chat), with the reservation path built in slice 6. The proxy asks the record for a reservation before forwarding each request and settles afterwards.
  - **Actual cost** is computed from the usage the vendor returns, multiplied by a price table that a person records, never from the SDK's own cost estimate.
  - **One at a time.** Metered calls for a project are serialised by the record's reservation, so a vendor price change can take spend past the limit by at most one call. As a backstop, each session's `maxBudgetUsd` is set to its share of the remaining headroom, never the whole of it.
  - **Currency.** The limit and the ledger are in the production's currency, CAD (approver's decision, 2026-11-12). Jordan records the USD to CAD rate and its date. Metered work priced in USD is blocked, with a plain-words message, until a rate is recorded (story-budgets-and-cost-track-actual-cost).
  - **Organisation-level work.** Agent drafts that belong to no project, such as organisation facts (story-project-record-set-up-organisation), count against an organisation spend limit that Jordan sets, with the same rules `[open]`: no story yet defines an organisation limit.
- **Out of the live path:** the runner has no route to show machines. The show runtime plugin depends only on the show package. Layer 4's test with agents stopped checks this.
- **Model access** uses an Anthropic API key held by the runner, never shown to the agent `[assumed]`. Anthropic's commercial terms for the Agent SDK settle whether a subscription sign-in is allowed instead.
- **Where the runner runs:** one always-on cloud worker first, and a runner on a studio workstation from Layer 3 (approver's decision, 2026-11-12).
- **Model use is metered work:** the runner's model turns count against the project's spend limit, like generation and cloud costs (approver's decision, 2026-11-12). Chat is built after the spend ledger, so no model turn ever runs unmetered (docs/design/architecture.md, build order).
- **"Outside the project"** (story-agent-work-agent-permissions): the model provider counts as inside, and so do the project's own hosting, storage, backup and email providers. Granting a tool approves sending that tool's inputs to its vendor. Email, publishing and uploads anywhere else need a person each time (approver's decision, 2026-11-12).

### Claude Code as the person's own tool (approver's decision, 2026-11-12)

Technical roles, such as Sam, may also work through Claude Code connected to the record's MCP endpoint. Claude Code is software the person runs on their own machine, like any other local application. It is not a project agent:

- **It acts as the person.** Its MCP calls carry the person's own principal, through a "via Claude Code" channel (decision-identity-and-roles). They are bounded by that person's role, go through the command layer like any dashboard action, and are logged as "<person> via Claude Code".
- **Agent rules do not apply to it.** Agent grants, the agent spend limit and the rules written for agents (the never-for-agents list, REQ-workflow-8 and REQ-workflow-14 as they apply to agents, and the agent actions in story-agent-work-read-activity-log) cover agents the project's runner runs. They do not cover Claude Code, and the person is responsible for what their own Claude Code does, as with any local software.
- **Outside the record's sight.** Claude Code's own tools (shell, file edits, web fetch, and any other MCP servers the person has added, such as an email server), what the person types, and files it reads from their machine are not checked against grants, not logged and not filtered. Anything it reads through the MCP endpoint is something the person's role could already read.
- **Protected data.** A token is issued only to a person whose roles cannot read the protected-store data class. Permissions are read again on every call, so if the person later gains a role that can read protected-store data, the token is refused on its next call.
- **Billing.** Claude Code's own model use is billed to the person's own Claude account. The project's spend ledger does not meter it. Adapter runs it starts through the MCP endpoint are project work, so they are reserved, metered and stopped at the limit like any other.

## Consequences

- Hard to reverse: chat as record state, and the agent token model. The SDK can be replaced by option C behind the runner without changing the record.
- Claude Code users' own model spend does not appear in the project's cost view. Jordan sees only what the runner and adapters spent.
- Revisit if Claude Desktop or Claude Code gains a hook that filters input before sending, or if another vendor's model is needed for a task.
