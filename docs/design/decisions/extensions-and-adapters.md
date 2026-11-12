---
id: decision-extensions-and-adapters
status: draft
derived-from:
  - epic-agent-work#outcome: f707c8c84ba0
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Decision: adapters, steps and checks are versioned extension packages that the runner hosts, and projects pin their versions

## Context

The extension stories set the following:

- Sam adds a step, integration or check without changing the core. Each addition is versioned and reviewed. Sam can see which version a project uses, and a failing addition says why (story-agent-work-extend-the-workflow).
- Tripo is the first adapter. Replacing it does not change the workflow. Each run is checked against the policy gate and the spend limit before it starts, and its output carries a provenance record (story-agent-work-tool-adapter).

Tripo and Higgsfield already ship MCP servers (docs/research/notes/generative-content.md). Sam works in TypeScript, Python and C++.

## Options

| Option | For | Against |
|---|---|---|
| A. An extension package has a manifest (kind, id, version, permissions it needs) and speaks a small message protocol defined in `contracts/`. The runner hosts it. Projects pin versions in the record. | The host, not the agent, runs the gate, the spend reservation and provenance around every call, so they cannot be skipped. Replacing a tool means changing a pin. | We define and maintain the protocol. |
| B. Each tool is an MCP server that the agent calls directly | The servers already exist for Tripo and Higgsfield. | The gate, spend and provenance would depend on the agent calling them first, which nothing guarantees. Tool shapes differ, so replacing one changes prompts and workflow. |
| C. Declarative workflow files (YAML) interpreted by the core | Easy to read and review. | Integrations still need code somewhere. A YAML language grows into a programming language. |

## Decision

Option A. An adapter may use a vendor's MCP server or REST API inside it. The agent never calls either directly.

- **Adapter messages:** `describe` (what it does, the generic capability it serves such as `generate-mesh`), `estimate` (cost before a run), `run` (inputs, settings), and a result carrying outputs and the provenance fields: the tool, the model version, the settings, and a reference to the tool's licence terms on that date.
- **Host sequence for every run:** the policy gate (decision-policy-gate-and-provenance), then a spend reservation (decision-agent-runtime), then the run, then outputs stored as held asset versions at the quality and licence gate, then the spend settled. Each step is logged.
- **The agent** sees generic capabilities, not vendors. The project's pin decides which adapter serves `generate-mesh`, so swapping Tripo for another generator is a pin change.
- **Checks** return pass or fail with a reason in plain words and a link to what failed. **Steps** declare their inputs, outputs and the stage they belong to.
- **Languages:** the first host and helper library are TypeScript. An extension in Python runs as a subprocess speaking the same JSON messages over standard input and output `[assumed]`, because Sam scripts Blender and Unreal in Python.
- **Versioning and review:** packages live in `extensions/` with semantic versions and are reviewed by pull request. A project moving to a new version is also a review item in that project's queue. "Reviewed like other project work" means both (approver's decision, 2026-11-12).
- **Secrets:** vendor API keys are held by the runner for each organisation and are never passed to the agent or written to the log.

## Consequences

- Hard to reverse: the message protocol and manifest, which are Sam's public API. They are versioned, and the host supports the previous major version for one release `[assumed]`.
- The Tripo adapter is the test of the pattern. A fake generator replacing it in tests proves the swap.
- Revisit if extensions need to run on a machine with no runner (for example inside an Unreal build agent), which would need the protocol over a network transport.
