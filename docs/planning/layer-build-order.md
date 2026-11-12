# Layer build order

This is a planning note, not an rfr-process artifact, so it lives in `docs/planning/` and carries no `id` or approval status. It records an analysis made on 2026-11-12 of how the seven layers and the business layer depend on each other, which can be built at the same time, and the order that follows. It is a reading of the dependencies, not an approved plan.

A visual version is in [layer-build-order.html](layer-build-order.html). Open it in a browser.

## Sources and limits

- The Dependencies and Release groups sections of all 39 epics in `docs/product/epics/`.
- The Layer 1 build order in [design-architecture](../design/architecture.md#build-order).
- The analysis works at epic level. The 266 stories were not traced one by one.
- Layers 2 to 7 have no designs yet, so they have no slice order. Only Layer 1 has one.

## What each layer needs

| Layer | Needs from earlier layers | Does not need |
|---|---|---|
| 1, project backbone | Nothing | |
| 2, live puppetry | Layer 1 terms, policy gate and provenance, for the performer's agreement and recordings | Layer 3. It is built and tested on proxy characters on the UE5 mannequin skeleton |
| 3, asset paths | Layer 1 gates, provenance and adapters. The Layer 2 effects channel (effects-path), and signals and the agreement (sound-path) | Most of Layer 2. The common skeleton is already decided |
| 4, show control | Layer 1 review. Layer 2 live-puppet and handover-and-fallback. Layer 3 interaction-design, for branching-shows only | The rest of Layer 3 |
| 5, delivery | Layer 1. Layer 2 live-puppet. Layer 3 asset-checks, for the budget file. Layer 4 session-operations and external-systems | |
| 6, audience | Layer 3 character-path. Layer 5 outputs-and-streaming and venue-setup | Layers 2 and 4 directly |
| 7, AI assists, crowds and creatures | Layer 1. Layer 2 live-signals. Layer 3 character-path. Layer 4 cue-list and session-operations | Layers 5 and 6 |
| Business | Layer 1 for budgets-and-cost, contracts-and-payment and funding. Layer 4 for credits-and-outreach. Layers 2 and 5 for schedule-and-touring | |

### Number of epic dependencies between layers

Read across a row: the layer being built, against the layer it needs. A number in brackets points at a later layer (see the next section).

| Builds | L1 | L2 | L3 | L4 | L5 | L6 | L7 | Business |
|---|---|---|---|---|---|---|---|---|
| L1 | | | (1) | | | | | (1) |
| L2 | 1 | | | | | (2) | | |
| L3 | 12 | 4 | | (3) | (2) | | | |
| L4 | 1 | 3 | 1 | | | | | |
| L5 | 3 | 1 | 1 | 2 | | | | |
| L6 | | | 1 | | 3 | | (1) | (1) |
| L7 | 2 | 1 | 1 | 2 | | | | |
| Business | 7 | 2 | | 1 | 2 | | | |

## Where an earlier layer points at a later one

The epics already handle each of these by holding back one release group or testing against a simulation.

| From, to | What waits | Until then |
|---|---|---|
| L1 to L3 | Nothing. project-record takes only the definition of an organisation from shared-library | Layer 1 builds the organisation alone |
| L1 to Business | Closing a project (slice 14) needs retention fields from keep-records. The protected store is built with contracts-and-payment | Layer 1 builds the identifier filter only |
| L2 to L6 | Audience reaction as a signal, and the performer's audience summary through physical signals | Tested against a simulated audience |
| L3 to L4 | Interactions that fire cues, character form transitions as cues, sound mixes that follow cues | The design record, gates, morph and swap, and sound assets ship first |
| L3 to L5 | Sound mixes per output and venue speaker layouts | Sound assets and their gate ship first |
| L6 to L7 | Stream viewers shown as a simulated crowd | Ships with crowds-and-creatures |
| L6 to Business | Cost tracking for cloud guest sessions | budgets-and-cost is built well before Layer 6 on this plan |

One loop sits inside Layer 2: live-puppet needs the performer's agreement from session-recording, and session-recording needs live-puppet to have something to record. The agreement story comes first.

## Staged plan

Each stage can start when the one before it is proven. Tracks within a stage can be built in parallel.

| Stage | Starts when | Tracks |
|---|---|---|
| 1 | Now | **Layer 1**, slices 0 to 8, in order |
| 2 | Terms and the gate exist (slice 8) | **Layer 1**, slices 9 to 14. **Layer 2 core** in `unreal/`: the performer's agreement, live-puppet, then handover-and-fallback. **Business**: budgets-and-cost, contracts-and-payment and funding, which run on into stage 3 |
| 3 | Layer 1 is complete and the Layer 2 core is proven | **Rest of Layer 2**: shared-characters, nearest-body-retargeting, live-signals, performer-support. **Layer 3 first groups**: character-path, asset-checks, shared-library, the interaction design record. **Layer 4**: cue-list, then session-operations, show-safety and external-systems |
| 4 | The Layer 3 and Layer 4 first groups exist | **Layer 4**: branching-shows, then unattended-running. **Layer 3 held-back groups**: interactions that fire cues, form transitions as cues. **Layer 5**: build-and-install, as soon as asset-checks exists |
| 5 | Layer 4 is done | **Layer 5**: outputs-and-streaming and venue-setup. **Layer 3**: sound mixes per output and venue. **Layer 7**: behaviour-and-limits, then crowds-and-creatures, running on into stage 6. **Business**: credits-and-outreach |
| 6 | Layer 5 is done | **Layer 6**: remote-guests, audience-avatars, audience-voice, guest-care. **Layer 2 held-back stories**: audience reaction and summary signals. **Business**: schedule-and-touring. Layers 6 and 7 meet at the simulated crowd |

The critical path is Layer 1, the Layer 2 core, Layer 4, Layer 5, then Layer 6. Layer 3 is mostly off it. Only three of its epics hold others up: asset-checks (builds), character-path (avatars and crowds) and interaction-design (branching shows).

## Blockers outside the build

- The legal review of REQ-governance-7 is pending. It gates guest-care, guest presence sensing and the performer's live room view.
- The real optical capture test needs studio access. Until then it runs on a recorded or simulated stream.
- Layer 2 needs proxy characters: the mannequin, a quadruped, a creature with extra limbs, and one outside the known set.
