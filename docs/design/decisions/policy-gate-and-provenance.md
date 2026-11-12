---
id: decision-policy-gate-and-provenance
status: draft
derived-from:
  - epic-provenance-and-policy#outcome: c0bb4a44b0d6
  - persona-collaborator#goals: 72c41c51284f
  - persona-director#goals: a92ca172be83
---

# Decision: structured terms checked by one gate function, and provenance kept as ledger rows keyed by content hash

## Context

The provenance and policy stories ask for the following:

- Terms with a dated history, optional end dates and alternates. A change that loosens a term applies only once Robin confirms it (story-provenance-and-policy-record-terms).
- A project-wide choice for when no AI term is recorded, which blocks until someone makes it (story-provenance-and-policy-no-term-choice).
- A blocked request is told which term blocked it. A request whose inputs need sign-off waits for the collaborator (story-provenance-and-policy-block-generation).
- Every asset carries its source, tool, date, AI use, approver and terms in force. Prompts and reference inputs are restricted. Assets with no record are listed (story-provenance-and-policy-provenance-record).
- Generated assets are held until checks pass and their licence status is recorded (story-provenance-and-policy-quality-and-licence-gate).
- The record travels with the asset when it is reused (REQ-governance-3).

Robin needs to trust that the pipeline refuses work that breaks the terms. Morgan needs AI used only where agreed.

## Options

Terms:

| Option | For | Against |
|---|---|---|
| A. Structured terms in a fixed vocabulary, each with plain-words text the collaborator confirms. A term covers named material, a person or the collaborator's contributions. It sets which uses are allowed, forbidden or need sign-off (generation from, transformation, training, synthesis). It says where output may go (internal drafts, the project, an audience) and has an optional end date. | The gate can decide automatically and name the term. Tests can be written as tables. | Some cultural protocols do not fit a vocabulary. They become "needs sign-off" terms with free text, and a person decides them. |
| B. Free-text terms, with a person checking each request | Captures anything. | Every generation waits for a person, so agents cannot work freely inside a stage. |
| C. A general policy language (Cedar or Rego) for each term | Expressive. | Nobody on a production can read or write it. Robin cannot confirm what it says. |

Provenance store:

| Option | For | Against |
|---|---|---|
| A. Ledger rows in the record keyed by asset version (record id and SHA-256), with restricted fields in a separate class, plus an exported sidecar file when an asset leaves the project | Queryable for credits and AI-use statements. Restricted fields are protected by role. | Files outside the pipeline do not carry the record unless exported. |
| B. Metadata embedded in files (C2PA manifests, glTF extras) | Travels with the file. | Not possible inside `.uasset`. Easily stripped. Cannot restrict prompts by role. |
| C. Sidecar files in the content repository as the source | Visible in git. | Not queryable. Visibility by role is impossible in a shared repository. |

## Decision

Terms A, provenance A.

- **One gate function** in the record takes a generation request (capability, tool, inputs with their owners, use, intended destination) and returns allow, block (naming the term), or wait (naming whose sign-off). The adapter host calls it before any run (decision-extensions-and-adapters). Every result is logged.
- **Effective terms:** where a change is unconfirmed, the stricter version applies. When no AI term is recorded, the project's no-term choice applies, and with no choice made, the gate blocks.
- **Overrides** are only new or changed terms, recorded by the holder of the contracts and licence terms approval. There is no override switch.
- **Provenance entries** are append-only, one per asset version. Later human changes add entries. Prompts and reference inputs are stored in the restricted data class.
- **Held assets:** generated output lands as a held version. It becomes usable inside its stage only when the automatic checks pass (the file opens, it is named correctly, and its provenance and licence status are recorded).
- **Asset identity in Unreal (Layer 3):** an imported asset carries its record id in asset metadata `[assumed]`, so the editor plugin can show its record. This is checked against the UE 5.8 API in that layer's spec.

## Consequences

- Hard to reverse: the term vocabulary and the provenance entry fields. Both are versioned in `contracts/`. Adding a use category later is cheap.
- The gate can only stop runs that pass through an adapter. A tool an artist uses directly cannot be stopped before it runs. The approver accepted this (approver's decision, 2026-11-12): the gate runs at every adapter, work generated in a tool outside the pipeline is declared when it is brought in (story-character-path-own-tool-generated-work) and checked against the terms then, and an import check lists assets with no provenance record for the gate holder.
- Revisit when shared-library reuse (Layer 3) checks terms across organisations, which may need terms to be exportable.
