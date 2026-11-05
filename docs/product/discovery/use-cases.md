# Use cases, goals and objectives (discovery draft)

Not a process artifact (no `id`, no status). This is the working record of the discovery conversation, for the approver to correct before stage 2 (requirements) begins. Items marked **[assumed]** are my inference and still need the approver's answer. Items marked **[site]** come from public project pages. Everything else is the approver's own statement or a point the approver confirmed on 2026-11-04.

## 1. What is being built

A reusable, **agent-driven production workflow** for live and interactive XR work, with review, iteration and hands-on collaboration at each stage. The goal is the pipeline, not any one performance. Projects are test cases that prove and shape it.

It spans two halves:
- **Digital production:** character design, mesh creation and rigging; environments with interactive features; show control and cues; deployment to several client types.
- **Business of the performance:** tools for managing the business around a production (section 9). Agents draft; a person approves anything external or financial.

## 2. Unit of reuse

The product is the agent-driven workflow **together with the tools and dashboards that let a person orchestrate a project**: see where each stage stands, review and approve, steer the agents, and run the show. Show templates and reusable modules (capture, streaming, character behaviour) are what the workflow assembles and produces.

## 3. The performance-control spectrum

Characters move along a spectrum, in both directions, including mid-scene:

full-body capture → device control (controllers, props, partial tracking) → AI control, and back.

Purposes: movement beyond physical limits, metamorphosis, and travel beyond the bounds of the physical stage. Crowds and creatures are the first autonomous targets. Conversational and other autonomous characters are speculative for now.

## 4. Capture must be pluggable

Past work used both ends: a high-end optical studio (Carry Me Home **[site]**) and portable inertial capture (Maamawi). The pipeline treats capture as interchangeable tiers. The approver already has components that support this, including Open3DBroadcast and VMC Live Link. **[assumed: how far they cover transport, retargeting and multi-source composition has not been checked.]**

## 5. Use cases

| ID | Use case | Priority | Notes |
|---|---|---|---|
| UC-1 | **Project A (unannounced)** with a guest artist: short proof of concept, then touring LBVR and a living performance sharing assets | Immediate | POC tests character, motion and world in VR. Source material and rights route are open. Details deferred by the approver. |
| UC-2 | **Immersive livestreamed virtual puppetry**: a personal, improvised performance | Immediate | Section 10. |
| UC-3 | **Maamawi expansion** | Later | Dancers and eight audience members in headsets, remote viewers as hummingbirds **[site]**. |
| UC-4 | **Gloaming** | Later | Two audiences on opposite sides of the world in one shared VR space, with a mocap guide **[site]**. |
| UC-5 | **Carry Me Home-style show** with a circus or dance company | Later | One live source to projection, in-venue VR, livestream and a browser or mobile arena **[site]**. |

## 6. Capabilities carried over from past shows (all required)

1. One live source, many outputs: stage projection, in-venue headsets, livestream, browser and mobile clients.
2. Multi-location, networked audiences.
3. Tracked objects and props as inputs, not only bodies.
4. Show control and cues, including music and lighting integration.
5. **Audience avatars within the world of the performance**, for in-venue and remote audience members. They have been a key part of most past performances, so they are explicit, and a higher priority than AI that responds to the audience.
6. Low-latency capture and robust character rigs.

## 7. Where time goes today (the approver's order)

1. Character design, mesh creation and rigging.
2. Designing and building environments with interactive features.
3. Building the show-control system and cues.
4. Deploying for multiple client types.

## 8. Policy on AI and cultural material

Negotiated case by case with each collaborator (for example Maamawi's cultural consultant, rights holders of existing works). Confirmed: each project has a **policy record of its collaborators' terms**, and that record gates AI generation in that project.

## 9. Business tools

Agent role: **draft, then a person approves** anything external or financial.

| Area | In scope | Out of scope for now |
|---|---|---|
| Money and funding | Budgets and cost tracking; grant and funding applications; quotes, invoices and payroll; tax credits and incentives | |
| Rights and people | Contracts and licensing; asset provenance and AI-use records; crew and performer scheduling; cultural consultation tracking | |
| Audience and operations | Venue and touring logistics; audience data and reporting; marketing and press | Ticketing and capacity |

Confirmed: asset provenance with AI-use records, and cost tracking that includes generation, cloud and per-show running costs, are core to the pipeline. The other business tools are adjacent and can sit on existing software.

### Funding and grants

- The business area that hurts most today, across the whole cycle: finding and matching programs; writing applications; budgets and financial forms; reporting and claims.
- The approver writes most of it personally.
- **First value:** one source of truth per project (descriptions, technical plan, budget, credits, samples), from which applications and reports are drafted. A person reviews and submits.
- Confirmed: this "project facts" record is shared with production (brief, character and asset list, tech plan, costs).
- Funders named in public material **[site]**: Canada Media Fund, Creative BC, Epic Mega Grants, an arts council. Not confirmed as the working list.

## 10. Livestreamed virtual puppetry (UC-2)

- **Audience, all four:** flat video stream; interactive browser or mobile; viewers in VR headsets; a hybrid room with a live audience plus remote viewers.
- **Performer control, all of:** body and face of a character; several characters or creatures; voice and sound; camera, world and cues; and **several performers controlling a single puppet**.
- **Equipment:** a combination of portable inertial suit, headset and hand controllers, webcam or phone capture, and studio optical capture.
- **Scale, in order of growth:** (1) solo performer, one character; (2) several performers, each controlling a character; (3) one performer controlling several characters; (4) several performers controlling one character; (5) a mix.
- **Latency:** under 100 ms from performer to their own puppet; seconds are acceptable for viewers.
- **AI, staged:** (1) live puppetry with no AI; (2) performer-led, AI assists (secondary motion, crowds, creatures); (3) handoffs between performer and AI mid-scene; (4) AI that responds to the audience. The first release delivers stages 1 and 2 (approver's answer).
- **Viewer input, staged:** (1) none; (2) camera or viewpoint choice; (3) chat and reactions; (4) characters that respond to viewers. **Audience avatars in the world** (section 6, item 5) are separate from this list and rank above stage 4.
- **Device failure:** fall back automatically to another source or an AI-held pose, and tell the performer.

Confirmed design consequences:
1. A character's motion is composed from several sources (people, devices, AI), each owning channels (spine, face, hands, voice, camera). Capture is not one device per character.
2. "One performer, one character" is a special case of "any number of each", not a separate design.
3. One live show feeds four audience types at once, with different formats and latency budgets. The 100 ms budget applies to the performer's own loop.
4. Stage 1 of the AI plan must not depend on AI; the architecture must leave room for stages 2 to 4.
5. For improvised live work, quick recovery matters more than polish.
6. Characters that respond to viewers share requirements with "AI responds to the audience" and belong in the same later epic.
7. Automatic fallbacks are defined per channel (body, face, voice), with a signal the performer can perceive without breaking character.

## 11. Audience avatars

The approver selected every option in each category, so these read as tiers that different shows pick from, not a single design.

- **Appearance:** abstract or symbolic forms; stylised figures from a set; guest-customised avatars; likeness of the guest.
- **Embodiment:** headset and hand tracking; full-body inside-out tracking; browser or phone input; passive or guided avatars.
- **Scale:** a mix by audience type, with a few high-fidelity avatars (in-venue) and a large simplified remote crowd.
- **Purpose, all of:** be seen as present; express reactions; touch or interact (as in Gloaming); affect the show.

**[assumed]** Implications to confirm:
1. One avatar system with fidelity tiers: the same guest can appear as a symbol, a stylised figure or a likeness depending on show and device, and degrades gracefully from full-body tracking down to passive.
2. Likeness avatars involve consent, privacy and retention rules (face and body data can be biometric in some jurisdictions). Each show needs a policy, tied to the collaborator policy record (section 8). Legal review is needed per jurisdiction.
3. Reactions that the performer can feel (not only see) are a requirement of the performer's tools: the performer needs a readable summary of the audience, not hundreds of faces.
4. "Affect the show" and "touch or interact" overlap with the later viewer-input stages in section 10. The order between them is not yet decided.
5. Numbers drive architecture (venue LAN versus cloud, interest management). Confirmed by the approver: the design plans for hundreds of guests in the venue and tens of thousands remote, with remote guests in two tiers (interactive and stream).

## 12. Orchestration tools

The approver selected every option in each category.

- **Production views:** project status board; review and approval queue; asset and provenance library; cost and schedule view.
- **Show-time controls:** cue list and show control; capture and device health; performer and character routing (who or what drives each character and channel, with live handover); audience and output monitor.
- **Where they live:** inside the Unreal Editor; a web dashboard; chat with the agent; a dedicated operator console.
- **Who uses them:** the approver, artists and technical artists, performers, stage managers and operators, and collaborators and funders.

**[assumed]** Implications to confirm:
1. There are two modes with different needs. Production mode favours flexibility and review. Show mode favours reliability, low latency and offline operation, and works without a person typing instructions to an agent.
2. Agents are not in the critical path during a live show. They prepare, monitor and suggest; operators and performers act. Fallbacks (section 10) run without waiting for an agent.
3. Chat with the agent is the main way to direct work. The dashboards show status and carry approvals, and do not duplicate chat.
4. One shared back end holds project state, so the editor panels, web dashboard and operator console show the same facts.
5. Collaborators and funders get limited, role-based access (review and sign-off only), which ties to the collaborator policy record (section 8).
6. Performer routing is the same mechanism as the control spectrum (section 3), so it is a core requirement, not a convenience.

### First-release priorities (approver's answers)

- **Essential production views:** project status board; review and approval queue; cost and schedule view. The asset and provenance library is not in the first release's top tier.
- **Essential show-time controls:** cue list and show control; performer and character routing. Capture and device health and the audience and output monitor come later.
- **Approval rights:** by project. Each project names its own approvers per stage, as the RFR process does.
- **Operator hardware:** touchscreens or tablets, physical control surfaces, existing show-control systems (lighting consoles, audio software, cue systems), and a plain keyboard and mouse.

**Resolved (the approver asked to resolve two tensions; the resolution below is the one proposed, applied on that reply):**
1. **Provenance.** Every generated asset carries a minimum provenance record from day one (source, tool, date, AI-use flag, and the collaborator terms that applied), because the licence gate and the project policy record need it. The library *view* for browsing that data comes later.
2. **Device failure.** Automatic fallback and the performer's signal are first-release behaviour. Only the full capture-and-device-health *view* comes later.

### Show-control systems (approver's answers)

- **Lighting:** ETC Eos family; grandMA; generic DMX, Art-Net or sACN. "None so far" was also selected. **[assumed: it means some shows had lighting run separately with no link to the XR system.]**
- **Audio and cues:** Ableton Live; QLab; Unreal Engine as the cue master.
- **Media and projection:** TouchDesigner; Resolume or similar; disguise or other media servers; NDI, Spout and Syphon video sharing.
- **Master and follower:** either, set per show. The link works both ways.

**[assumed]** Implications to confirm:
1. Confirmed: the first release integrates through open protocols (OSC, MIDI and MIDI show control, DMX/Art-Net/sACN, NDI/Spout, timecode) rather than one adapter per product. Syphon (Mac only) and product-specific profiles come after.
2. Each show states which system is the cue master, and the cue list, clocks and timecode follow that choice. Switching master is a configuration change, not a rebuild.
3. A show can run with none of these systems present, using Unreal alone.
4. Show-control integration is tested against simulators or recorded sessions in automated checks. Testing against real consoles happens at rehearsal.

## 13. Deployment targets

- **First release delivers to:** Windows PC (desktop and PC VR) and browser or mobile stream. Standalone headsets, and projection plus flat video livestream, are not listed for the first release.
- **Content across devices:** one authored show, scaled per device, with lower-detail versions made for weaker devices.
- **LBVR hardware:** not decided; it depends on the venue and partner.
- **Operations:** must run offline; remote updates and monitoring; staff-installed builds; fleet management of headsets (all four selected).

Implications (item 1 confirmed; the rest are **[assumed]**):
1. **Confirmed: flat livestream and projection are part of the PC target.** Both are video outputs of the same rendered scene, and puppetry and Carry Me Home-style shows need them (sections 6 and 10). So the first release delivers to PC (including flat livestream and projection output) and browser or mobile stream.
2. **Standalone headsets are deferred, not dropped.** The touring LBVR version of Project A (UC-1) needs them or an alternative, but the hardware is undecided. Until it is, the first release keeps content and rigs scalable so a standalone or streamed-headset target can follow. The research notes flag that Meta's XR plugin did not load on Unreal 5.8 and that Meta changed its commercial headset programme in 2026; both need checking before hardware is chosen.
3. **Offline operation is a design rule.** Anything performers, operators and the venue audience need at run time (characters, cues, voice) works on the venue network with no internet. Only what reaches remote audiences needs internet and cloud services.
4. **Remote updates and fleet management are later than offline running.** Staff-installed builds are the first-release way to deploy; remote push and fleet tools follow.

## 14. Review gates

A person must approve each item below before the next stage starts or the action is taken. Items not listed proceed on their own, with the result shown in the review queue.

| Area | Needs a person's approval |
|---|---|
| Creative | Look and concept art; character design; mesh and rig; environments |
| Performance and behaviour | Motion and performance quality; AI behaviour, voice and dialogue; cue list; audience-facing safety and consent |
| Builds and operations | Build for a public show; update to a remote venue; changes during a live run |
| Business | Funding applications and reports; contracts and licence terms; spend above a limit; publishing and marketing |

Only the **build for rehearsal** was left ungated: agents may put a new build on the rehearsal system without asking. Approval rights are set per project (section 12).

**[assumed]** Implications to confirm:
1. Nearly every stage is gated, so the approver's time becomes the pipeline's limit. The review queue must make approvals fast: batched, with previews and a clear accept, revise or reject. **Confirmed:** each project can name delegates per area (an artist for looks and rigs, a stage manager for cues and live changes), as section 12 allows.
2. Gates apply to what comes out of a stage. Agents may prepare work freely inside a stage (drafts, variants, iterations), and only the hand-off to the next stage waits.
3. "Changes during a live run" needs a person at the show, consistent with agents staying out of the live critical path (section 12).
4. A spend limit is needed. Its value is not yet set, and may differ per project.

## 15. The team

- **In the pipeline day to day:** the approver (creative direction), a producer or production manager, technical artists and pipeline engineers, and artists (character, environment, animation).
- **At performances and shows:** performers, a stage manager or show operator, capture and technical crew, and venue staff or LBVR attendants.
- **Engagement:** varies a lot by project, so teams form per production and people come and go.
- **Skill level:** mixed. Some people are deeply technical and many are not.

Implications (item 1 confirmed; the rest are **[assumed]**):
1. **Confirmed:** these roles are the first personas: **director/approver, producer, technical artist or pipeline engineer, artist, performer, stage manager or show operator, capture crew, venue attendant**. The collaborator (cultural consultant, rights holder, partner) and the audience member from the concept are the other two groups. Each persona gets its own goals and limits in stage 3.
2. Because teams change per project, access and approval roles are set per project, onboarding a new person is quick, and the tools do not assume prior training.
3. Artists, performers, operators and attendants must never need code, a command line or knowledge of the agents. Chat with the agent is optional for them, and what they need is a simple surface for their own job.
4. Technical artists and pipeline engineers can open up the workflow, edit its steps and write integrations. The platform is extensible by this group.
5. Venue attendants are users of the show-time and device tools only, not of production tools.

## 16. Open questions

1. **Project A (UC-1).** POC date and audience; whether the living performance has the guest artist in capture; the rights route. Deferred by the approver.
2. **Funding.** The working funder list; applications per year; a past application to use as a worked example; who reviews drafts besides the approver.
3. **Business tools.** Where records live now; who uses them; which outputs are client-facing.
4. **Review gates.** The spend limit, per project; which approvals may never be delegated (for example contracts and licence terms, funding submissions); what turnaround the approver expects from the queue.
5. **Deployment targets.** The LBVR hardware decision and its date; whether flat livestream and projection count as part of the PC target; which venues and networks the first shows run on.
6. **Team.** How large a typical team is; how often a person new to the pipeline joins mid-production; whether an in-house pipeline engineer exists or this role is shared or hired per project.
7. **Audience avatars.** Typical numbers for in-venue and for remote audiences; the order in which touch, interaction and show-affecting features should arrive; the consent policy for likenesses.
8. **Orchestration tools.** Which lighting console, audio and media systems the first show will really use, 

## Appendix: portfolio evidence

From public pages **[site]**, read 2026-11-04. Not verified beyond the pages.

- **Carry Me Home** (7 Fingers and Shocap, Dec 2022): real-time mocap and VR; livestream from Animatrik's Burnaby studio; in-venue headsets; browser, laptop, mobile and VR 3D arena; Unreal Engine; award for best XR experience, 2024.
- **Gloaming** (2022 SXSW prototype): multi-location live VR with a mocap guide; Shocap's mocap broadcast technology.
- **Maamawi** (2022 to 2025): hybrid live and VR; dancers and eight audience members in headsets; remote audience as hummingbirds in the world.
- **Press Play** (2022): custom 3D-printed juggling props with embedded markers drive animation.
- **Manipulations** (2016): early live theatre with mocap and a game engine.
- **Others:** The Orchard (hybrid theatre with an online 3D space); Jill Barber and The Phantom Jazz Band (streamed immersive event); Mahaha (CG music video and VR, Unreal, 2025).
- No past project describes autonomous or AI-driven characters.
