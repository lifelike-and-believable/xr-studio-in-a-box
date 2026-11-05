---
id: concept
status: draft
---

# Agentic XR Pipeline (working title)

<!-- Stage 1 of the RFR process. Draft for approver review. Revised 2026-11-04 after the first discovery review (docs/product/discovery/use-cases.md). -->

## Problem

Shocap's live and interactive XR work (shows such as Carry Me Home, Gloaming and Maamawi) has been built one production at a time. Each stage (character design, mesh creation, rigging, environments, capture, show control, deployment to PC, headsets, browsers and projection) lives in a different tool with its own hand-offs, and much of it is rebuilt for each show. Character design, meshing and rigging, then environment building, then show control and cues take the most time. The business around each performance (funding applications, budgets, rights, scheduling, reporting) is largely handled by hand, mostly by the creative director.

Generative AI tools now produce usable first drafts of images, video, meshes, textures, voice and motion, and coding agents can drive engines and DCC tools through scripting and MCP servers. This is an opportunity to turn one-off builds into a repeatable workflow in which agents do the repetitive work and people decide what is good.

## Audience

- **Creators and producers** at Shocap and its collaborators, who direct, design and produce live and interactive experiences, and who also run the business side of a production.
- **Technical artists and pipeline engineers** who build and maintain the pipeline.
- **Performers** who drive characters in real time, alone or together, through body, face, voice and devices.
- **Collaborators with a say over how work is made**, such as cultural consultants, rights holders and partner companies, whose terms (including limits on AI use) the pipeline must record and respect.
- **Venue operators** who run finished experiences in location-based VR (LBVR) sites and other venues.
- **Audiences**, in the venue or remote, on screens, browsers, mobile devices or headsets. Many appear as avatars inside the performance. They do not use the pipeline, but every quality bar is set by what they see and feel.

Personas make these concrete in stage 3.

## Vision

A creator briefs an experience, and an agent-driven workflow takes it from reference art to a running, tested build in Unreal Engine. Agents generate, clean up, import, assemble, build and verify. People review and steer at each stage through tools and dashboards, and approve at defined gates. The result is rapid iteration on extremely high quality live and interactive experiences.

One project delivers to PC, mobile, browser, projection and LBVR. Capture is pluggable, from a high-end studio to a portable suit to a webcam, and a character can be driven by several performers and devices at once. Control of a character moves along a spectrum from full-body capture, through device control, to AI control, and back, so a character can do what no body can: transform, move impossibly, or travel beyond the physical stage. Crowds and creatures are the first autonomous characters; conversational characters come later. Audience members can take part as avatars in the world.

The pipeline also covers the business of the performance, with agents drafting funding applications, budgets, reports and records, and people approving what goes out. Asset provenance and the terms agreed with each collaborator are tracked, so AI is used only where the collaborators have agreed to it.

Taken together, this is an "XR Studio in a Box". The scope is large on purpose and there is no deadline for the first official release. Each component is built and tested carefully and iteratively, layer by layer, and each layer is proven before the next one depends on it.

## Non-goals

- Replacing artists, directors or performers. The pipeline accelerates drafts and hand-offs; people set the bar and approve.
- Building a new game engine or DCC tool. The pipeline joins commercial and open tools; where we build, it is glue, plugins, automation, and the orchestration and business tools a solo production needs. Unreal Engine is the chosen engine for this pipeline.
- Shipping AI output unreviewed. Every generated asset passes a quality and licence gate before it enters a project.
- A general-purpose public product at this stage. The first goal is Shocap's own production use; packaging for others comes later, if at all.
- Console delivery targets in the first release.
- Ticketing and capacity management.
