---
id: story-sound-path-sound-assets
status: approved
derived-from:
  - epic-sound-path#outcome: 3f3e81a83f45
  - persona-sound-designer#goals: 70f155e30dc6
---

# Manage sound as assets with gates and provenance

As Drew, the sound designer, I want voices, music, effects and ambience managed as assets under the same gates, provenance records and policy checks as visual assets so that credit, licences and provenance record what was composed, licensed or generated.

## Acceptance criteria

- Drew can bring in stems prepared in an audio workstation, in standard formats such as WAV, with no rework. Each sound asset is marked as a voice, music, an effect or ambience.
- Each sound asset has a provenance record (story-provenance-and-policy-provenance-record) that says whether it was composed, licensed or generated, with its licence terms. The project lists any sound asset with no record.
- The automatic checks for audio format and loudness (story-asset-checks-check-effects-and-audio) run before review, and failures are shown to the reviewer beside the item.
- Sound and music wait at the sound and music gate until the person named for that area accepts them (story-review-and-status-hold-gated-hand-off). An agent cannot accept them.
- A sound asset made from a performer's voice names the performer in its provenance record, and is used only as their agreement allows (story-session-recording-check-agreement).
