---
id: requirements-characters
status: draft
derived-from:
  - concept#vision:
---

# Autonomous characters requirements

<!-- Draft. Source: discovery sections 3 and 10. Autonomy is speculative; crowds and creatures come first. Conversational characters are later. -->

"Autonomous" here means a character acts without a person driving it. Rule-based, procedural and AI methods all count, so crowds and creatures do not need a generative model at show time.

AI arrives in four stages: (1) live puppetry with no AI; (2) AI assists, crowds and creatures; (3) handoffs between performer and AI; (4) AI that responds to the audience. The first release delivers stages 1 and 2. Stages 3 and 4 follow, and the architecture must not prevent them.

## REQ-characters-1: Crowds

Groups of autonomous background characters can be placed in a scene, with behaviours the creator can choose and tune. During a show, a crowd can respond to cues and to performers' characters, and a performer can conduct a whole crowd or flock directly as one instrument. Maximum counts per target are TBD.

## REQ-characters-2: Creatures

Autonomous creatures move and react in a scene, including secondary motion that supports a performer-led character. They respond to cues and to performers' characters, and a performer can conduct them in the same way as a crowd.

## REQ-characters-3: AI assists performers

For a performer-led character, AI can add secondary motion and fill channels the performer is not driving. The performer can switch it off at any time.

## REQ-characters-4: Behaviour specification

Each autonomous character has a human-readable behaviour specification (what it does, what it may not do, how it reacts). The specification is reviewed at a gate, and the character's behaviour follows it.

## REQ-characters-5: Deterministic fallback

Every autonomous behaviour has a scripted fallback that runs when an AI service is slow, unavailable, switched off, or past its spend limit (REQ-workflow-13). It runs offline.

## REQ-characters-6: Operator override

An operator can pause, redirect or take over any autonomous character at any time from the show tools.

## REQ-characters-7: Testing non-deterministic behaviour

Autonomous behaviour is tested by replaying recorded scenarios and by running scenario checks that judge results statistically. A build that fails these checks cannot be used for a public show.

## REQ-characters-8: Content limits

Autonomous output is bounded by limits set for the project (what a character may say or do), including any cultural protocols in the policy record (REQ-governance-1). Output outside the limits does not reach the audience. A person approves these limits, as an audience-facing safety approval (REQ-workflow-7).

## REQ-characters-9 (later): Conversational and audience-responsive characters

Characters that speak with, or react to, individual audience members are a later stage. This includes crowds and creatures reacting to audience avatars. They are not part of the first release, and the architecture must not prevent them. They depend on REQ-governance-7 and on latency and cost limits that are TBD.

## REQ-characters-10: Locked and free moments

Each scene or behaviour is marked as locked or free. A locked moment plays the same way on every run, as rehearsed. A free moment varies within its limits. The choice can be changed in rehearsal.

## REQ-characters-11 (later): AI takeover from a performer

When AI takes over a channel from a performer mid-scene, each show chooses what it does: it continues the character from its behaviour specification, or it continues in that performer's style, learned from their recorded sessions. Style continuation runs only where the performer's agreement allows it (REQ-governance-9). Handoffs are stage 3, but the first release's handover (REQ-performance-4) and session recording (REQ-performance-9) must not prevent them.

## Constraints

- AI services may be cloud or local; a show must still run with neither (REQ-characters-5).
- Voice and language data are subject to REQ-governance-7.
- Character AI that runs during a show is separate from the production agents in REQ-workflow-9. It is allowed in the live path only because it has a fallback.

## Success measures

- With every AI service disconnected, a show with crowds and creatures runs unchanged on its fallbacks.
- A locked moment plays the same way across repeated runs in rehearsal.
- An operator can take over an autonomous character in rehearsal with no show stop.
