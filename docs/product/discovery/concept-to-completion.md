---
id: discovery-concept-to-completion
status: draft
---

# Concept to completion: a test of the approved stories

This is a desk check made on 2026-11-12 and updated after PR #318. It follows one invented production, step by step, from the first idea to the last record kept, and asks at each step which approved story makes that step possible. It tests the approved stories in `docs/product/stories/` and the epics they belong to, not built software. A step is rated covered only where a story's acceptance criteria provide it. A title that sounds right is not enough.

The production is UC-2's first show, extended: a livestreamed, improvised virtual puppetry show with stylised characters and a morphing creature, made by a small company. It plays to guests in headsets and seated guests at a hybrid venue, to interactive and player guests online, and to stream viewers on YouTube Live, then tours to two more venues. One performer is remote.

Ratings:

- **covered**: a story's criteria provide the step.
- **partly**: stories cover the step, with a real hole.
- **gap**: no story covers the step.
- **conflict**: two stories, or a story and an approved requirement, disagree.
- **deferred**: an approved later or deferred line covers the step, so the first release does not do it on purpose.

## The production

*Hollow Tide* is made by a five-person company in Vancouver. Mae, a stylised fisher, and a gull called Pell meet the Tide, a creature that starts as a puddle sprite, grows into a legless sea serpent, dissolves into foam and reassembles as a four-armed tide giant. Kai performs the Tide in a portable inertial suit with a phone for the face. A second performer, Lee (a second instance of the performer persona), plays Pell from Toronto. Mae is a hand-made proxy driven by Kai in the first act, then by a recorded loop while Kai plays the Tide. Each evening runs three 40-minute sessions. A harbour crowd of villagers and a flock of gulls are autonomous. Guests at the venue sit in a ring of 12 PC VR headsets plus 40 seats facing a projection wall, and online guests join through a player page, cloud sessions or YouTube Live.

People: Morgan (director and approver), Jordan (producer), Sam (technical artist), Riley (artist), Drew (sound designer), Quinn (interaction designer), Casey (capture crew), Alex (show operator), Taylor (venue attendant), Kai (performer), Robin (puppet designer and collaborator with terms) and Jamie (audience member, in each tier in turn).

## Summary

| Phase | Steps | Covered | Deferred |
|---|---|---|---|
| 1. Concept and project setup | 1 to 15a (16) | 15 | 1 |
| 2. Funding | 16 to 27 (12) | 12 | 0 |
| 3. Design | 28 to 62 (35) | 34 | 1 |
| 4. Live puppetry | 63 to 81 (19) | 19 | 0 |
| 5. Show control | 82 to 98 (17) | 17 | 0 |
| 6. Delivery | 99 to 117a (20) | 19 | 1 |
| 7. Audience | 118 to 138 (21) | 20 | 1 |
| 8. AI assists | 139 to 150 (12) | 10 | 2 |
| 9. Running sessions | 151 to 165 (15) | 15 | 0 |
| 10. Business and wrap-up | 166 to 184 (19) | 18 | 1 |
| 11. Short tour | 185 to 196 (12) | 11 | 1 |
| **Total** | **198** | **190** | **8** |

The first check rated 157 steps covered, 19 partly, 10 gap and 4 conflict. PR #318 closed all 33 of the partly, gap and conflict steps with new stories and new criteria, listed in "How the gaps were closed" below. Each of those steps keeps its original description, which records what was missing, and its rating line now names the stories that cover it and says what it was first rated. The 8 deferred steps are deferred on purpose by approved lines.

## Using this as an acceptance walkthrough

This document now serves as the acceptance walkthrough for the first show (UC-2). Each step names the stories whose acceptance shows that the step works. When those stories are built and accepted, a person can walk the production step by step against the built software and confirm each one.

## Walk-through

### Phase 1. Concept and project setup

**1. Morgan starts the project.** In the web dashboard Morgan creates *Hollow Tide* with a two-paragraph brief and names Morgan as owner. A first attempt without an owner is refused with the missing field named. The project starts empty.
Covered by: story-project-record-start-project. Rating: **covered**.

**2. The company itself is set up.** Before any project, the company needs an organisation: its legal name, its applicant profile with the Canada Council for the Arts, its history of past shows and funding, its bio and its standard work samples. Every application, budget and credit draws on these. story-shared-library-save-to-library says each project belongs to one organisation and shows which, but no story creates an organisation, says how a project is placed in one, or keeps company-level facts. story-project-record-start-project says a new project starts with no facts carried over, so Jordan would type the company bio again on every project.
Covered by: story-project-record-set-up-organisation, story-project-record-start-project, story-shared-library-save-to-library. Rating: **covered** (first rated gap, closed in #318).

**3. Jordan adds the team.** Jordan adds Sam, Riley, Drew, Quinn, Casey, Alex and Kai from the dashboard and picks a role for each. Each sees only what the role needs, and Jordan can change or remove a role later. Many stories rely on "a person whose role allows it", "the technical artist's role" or "the capture crew's role", but no story says which roles exist, what each one allows, or whether Jordan can adjust a role for this project (Casey also operates sound on two nights, for example).
Covered by: story-project-record-add-person. Rating: **covered** (first rated partly, closed in #318).

**4. Morgan names approvers and delegates.** Morgan keeps the creative gates with Riley as delegate for look and mesh and rig, Alex as delegate at the show for changes during a live run, and Drew for sound and music. The four protected approvals are shown: Jordan holds contracts and licence terms, Morgan holds funding, publishing and marketing, and audience-facing safety and consent. An AI cannot be picked for any of them.
Covered by: story-project-record-name-approvers, story-review-and-status-hold-gated-hand-off. Rating: **covered**.

**5. Jordan records the project facts.** Jordan enters the description, the production plan, a draft schedule, the collaborators, two work samples (video of a past puppetry stream) and capacity figures (52 guests in the venue per session). Jordan points an agent at last year's pitch deck, and its suggested facts arrive as drafts until Jordan accepts them. Each fact shows who last changed it.
Covered by: story-project-record-record-facts. Rating: **covered**.

**6. Morgan works through chat and the dashboard.** Morgan asks an agent in chat for a list of open decisions on *Hollow Tide*. The agent says what it will do and reports back. A fact Jordan changes in the dashboard shows up in Morgan's chat answer.
Covered by: story-agent-work-direct-an-agent, story-project-record-same-project-state. Rating: **covered**.

**7. Each person chooses notifications.** Riley chooses a daily email digest. Morgan chooses the dashboard badge and immediate email for blocking items.
Covered by: story-review-and-status-notifications. Rating: **covered**.

**8. Robin's terms are recorded.** Robin designed Pell as a rod puppet years ago and licenses the sketches to the project. Jordan records Robin's terms: the sketches may be used as references for generated drafts only with Robin's sign-off, never for training, Robin is credited as "Pell designed by Robin", and the licence ends on 31 December 2028. Robin sees these terms with a dated history on a limited page and nothing else in the project.
Covered by: story-provenance-and-policy-record-terms, story-provenance-and-policy-collaborator-sign-off. Rating: **covered**.

**9. Jordan sets the choice for collaborators with no AI term.** Two music samplers on the project recorded no AI term. Jordan, as holder of contracts and licence terms, chooses "internal drafts only". Until the choice was made, the gate blocked.
Covered by: story-provenance-and-policy-no-term-choice. Rating: **covered**.

**10. Kai's agreement.** Jordan records Kai's agreement: body, face and voice may be captured; Kai's data may drive a character live, be replayed in rehearsal and tests, stand in as a recording or fallback, be cleaned up, and be used in promotion and press; AI assists on characters Kai drives are allowed; training, synthesis and continuing a performance in Kai's style are not. Kai's credit name is "Kai R." Kai confirms on the limited page, and the date is recorded. Robin's limit that Pell never attacks a person is shown to Kai and Lee as a brief, and each acknowledges it.
Covered by: story-session-recording-record-agreement. Rating: **covered**.

**11. Lee's agreement for remote performance.** Lee gets a separate agreement in the same project, with replay allowed but standing in refused.
Covered by: story-session-recording-record-agreement. Rating: **covered**.

**12. Contracts for Kai, Lee and Robin.** An agent drafts the performer contracts and Robin's licence from the facts and the recorded terms. Each is marked "template pending legal review" because the lawyer Jordan chose has not yet reviewed the template. Pay terms are held in the contract record. Jordan sends each draft and records the signed copy.
Covered by: story-contracts-and-payment-draft-and-track-contracts. Rating: **covered**.

**13. Spend limit.** The new project has no limit, so metered generation stays blocked. Jordan sets CAD 1,500 for metered work. Later an agent asking for a batch of 40 Marble worlds stops and asks Jordan.
Covered by: story-agent-work-spend-limit. Rating: **covered**.

**14. Agent permissions and tools.** Sam grants the agents the *Hollow Tide* project, the Higgsfield, Tripo and Marble adapters, and the project folders, and nothing in the protected store. An agent told to read Kai's contract is refused, and the refusal is in the log Sam reads.
Covered by: story-agent-work-agent-permissions, story-agent-work-tool-adapter, story-agent-work-read-activity-log, story-contracts-and-payment-protect-sensitive-data. Rating: **covered**.

**15. Backups.** Backups run by themselves. Jordan tests a restore on the project before real work relies on it. The protected store is backed up separately.
Covered by: story-project-record-back-up-and-restore, story-contracts-and-payment-protect-sensitive-data. Rating: **covered**.

**15a. The update-to-a-remote-venue gate.** Morgan sees "update to a remote venue" on the gate list and wants to name Sam for it. Remote updates are later, so the gate has nothing to hold in the first release.
Covered by: REQ-delivery-10 (later), epic-build-and-install (out of scope line). Rating: **deferred**.

### Phase 2. Funding

**16. Jordan adds the Canada Council program.** Jordan points an agent at the current guidelines of a Canada Council for the Arts research-and-creation program. The agent drafts the program's eligibility rules, format, word limits, budget categories, attachments, intake dates and deadlines, marked as a draft until Jordan accepts it. Jordan confirms the rule check with its date. Creative BC is added the same way.
Covered by: story-funding-program-list. Rating: **covered**.

**17. Morgan asks which programs fit.** The agent matches the project against the program list. Most rules are met or not met with the fact used. Three are unknown because they are about the company, not the project (years of activity, past Council funding, applicant category), and those facts are not in the project facts (see step 2).
Covered by: story-project-record-set-up-organisation, story-funding-match-programs. Rating: **covered** (first rated partly, closed in #318).

**18. Morgan chooses the programs to pursue.** Morgan chooses the Council program and Creative BC. The choice is recorded with who and when. An agent cannot choose.
Covered by: story-funding-match-programs. Rating: **covered**.

**19. Jordan builds the budget.** An agent drafts budget lines in CAD from the brief and plan: fees, venue hire, kit hire, travel, and metered lines for generation and cloud sessions. Jordan and Morgan accept them. The spend limit stays separate.
Covered by: story-budgets-and-cost-build-a-budget. Rating: **covered**.

**20. The budget in the Council's format, including revenue.** Morgan views the budget in the Council's format. Expense lines map to the funder's categories with nothing retyped. The Council form also asks for revenue: other grants applied for (Creative BC), earned revenue from tickets, the company's own contribution and in-kind support from the venue. A budget line has a category, an amount and a note, and nothing marks a line as income, confirmed or pending, or in kind.
Covered by: story-budgets-and-cost-build-a-budget. Rating: **covered** (first rated partly, closed in #318).

**21. A statement of intended AI use for the application.** The Council asks how AI will be used in the project. story-credits-and-outreach-ai-use-statement drafts only from the provenance records of existing assets. At application time no assets exist, so the statement cannot describe planned use (Higgsfield drafts, Tripo meshes, Marble worlds, rule-based crowds, no generative model at show time). No story drafts a statement of intended AI use from the plan and the policy record.
Covered by: story-credits-and-outreach-ai-use-statement. Rating: **covered** (first rated gap, closed in #318).

**22. The agent drafts the application.** The agent drafts the application in the Council's format from the facts and the budget, with each figure linked to its fact, a fact changed later flagged, missing facts named and left empty, and word counts shown against limits.
Covered by: story-funding-draft-application. Rating: **covered**.

**23. Support material: work samples and letters.** The work samples come from the facts. The Council also asks for letters of support or confirmation from the venue and from Robin. No story asks a partner for a letter, tracks whether it has arrived or attaches it. Robin's limited page shows only items for sign-off and Robin's own records.
Covered by: story-funding-draft-application, story-project-record-record-facts. Rating: **covered** (first rated partly, closed in #318).

**24. Rule check, funding gate and submission.** Six days before the deadline Jordan rechecks the program's rules and confirms the check. The draft waits at the funding applications and reports gate. Morgan approves, submits through the Council's portal in person, and records the submitted version, which is kept unchanged. The company's bank details for the Council's payment form come from the protected store.
Covered by: story-funding-program-list, story-funding-draft-application, story-review-and-status-hold-gated-hand-off, story-contracts-and-payment-protect-sensitive-data. Rating: **covered**.

**25. Recording the result.** Ten weeks later the Council awards CAD 45,000, paid in two instalments, with an interim report due at the midpoint and a set acknowledgement wording. Creative BC declines. Nothing records the outcome of a submitted application: the amount awarded against the amount asked, the award's conditions, its payment schedule, the acknowledgement it requires, or a decline. story-funding-reports-and-claims assumes "a funded program" but has no hand-off from a result.
Covered by: story-funding-record-decision, story-funding-reports-and-claims, story-credits-and-outreach-build-credits. Rating: **covered** (first rated gap, closed in #318).

**26. Deadlines in one view.** Jordan sees the interim and final report deadlines beside the production schedule, in date order, with a lead-time alert. The award's own deadlines would need to be entered as program deadlines by hand, since step 25 has no home for them.
Covered by: story-budgets-and-cost-cost-and-schedule-view, story-funding-program-list. Rating: **covered**.

**27. Expected income against spend.** Jordan wants to see when the two instalments arrive against the planned spend, to know whether the company can pay Kai in month two. The cost view shows budget, actual and remaining per line, and no income or cash timing.
Covered by: story-budgets-and-cost-build-a-budget, story-budgets-and-cost-cost-and-schedule-view. Rating: **covered** (first rated gap, closed in #318).

### Phase 3. Design

**28. Character brief and style.** Morgan writes the brief for Mae and chooses the stylised style. For the Tide, Morgan chooses a creature, and for its first form an abstract energy form.
Covered by: story-character-path-other-styles. Rating: **covered**.

**29. First real use of Higgsfield.** Before Riley's first request, Jordan checks Higgsfield's output licence and records it with the date. Until then Riley's requests are refused and Riley is told why.
Covered by: story-character-path-design-drafts. Rating: **covered**.

**30. Riley drafts Mae.** Riley gives a brief and three reference images and asks for six drafts. Each request passes the policy gate, the spend limit and the adapter, and each draft arrives with a provenance record after the quality and licence gate.
Covered by: story-character-path-design-drafts, story-provenance-and-policy-block-generation, story-provenance-and-policy-quality-and-licence-gate, story-provenance-and-policy-provenance-record. Rating: **covered**.

**31. Drafts of Pell from Robin's sketches.** Robin's term needs sign-off before the sketches are used as references. story-provenance-and-policy-block-generation only runs or blocks a request. story-provenance-and-policy-collaborator-sign-off says "the named stage waits", and story-behaviour-and-limits-check-ai-use routes specifications to Robin, but no story routes a generation request whose reference is under a sign-off term to Robin and holds it until Robin decides. Jordan would have to override by recording a changed term.
Covered by: story-provenance-and-policy-block-generation, story-provenance-and-policy-collaborator-sign-off. Rating: **covered** (first rated partly, closed in #318).

**32. Feedback and the character design gate.** Riley writes feedback, gets revisions and compares versions side by side. Riley sends one Mae draft and one Pell draft to the character design gate. Morgan approves Mae and asks for a revision of Pell's beak with written feedback.
Covered by: story-review-and-status-feedback-and-versions, story-review-and-status-see-review-queue, story-review-and-status-decide-on-items, story-character-path-design-drafts. Rating: **covered**.

**33. The show's key art.** Riley generates concept art of the harbour at night through Higgsfield and sends one image to the look and concept art gate. Morgan accepts it. It guides both the level's look and later promotion.
Covered by: story-environment-path-develop-the-look. Rating: **covered**.

**34. Mesh and rig through Tripo.** Jordan records Tripo's output licence first. Riley starts Mae's mesh and rig from the approved design. The result opens in Unreal, retargeted to the mannequin skeleton with IK Retargeter, and Sam sees which bones did not match. Riley previews it moving with a recorded suit take.
Covered by: story-character-path-mesh-and-rig, story-character-path-common-skeleton. Rating: **covered**.

**35. Hand-made parts.** Riley sculpts Pell's head in Blender and brings it in as FBX at the mesh and rig stage. Its provenance record shows hand-made work with no AI.
Covered by: story-character-path-hand-made-work. Rating: **covered**.

**36. Mesh and rig gate.** Mae and Pell wait at the mesh and rig gate for Morgan, with their asset check results. Morgan approves both.
Covered by: story-character-path-mesh-and-rig, story-asset-checks-show-failures. Rating: **covered**.

**37. What the Tide is called.** In the character path the Tide is "a creature, animal or spirit", a style driven by a performer. In story-crowds-and-creatures-add-creatures "a creature is an autonomous character" with a behaviour specification, scripted fallback, content limits and override. Kai's Tide is a creature in the first sense and must not be pulled into the second, but a tool or a reviewer reading "creature" cannot tell which applies, and the creature count limit and spec gate of add-creatures would wrongly apply to it.
Covered by: story-character-path-other-styles, story-crowds-and-creatures-add-creatures. Rating: **covered** (first rated conflict, closed in #318).

**38. The Tide's first form, the puddle sprite.** The sprite is an abstract form with no mesh. Its mesh and rig stage makes the form and the values that drive it, and the same gate reviews it.
Covered by: story-character-path-other-styles. Rating: **covered**.

**39. The serpent form, legless.** The serpent has no legs. The known body plans are the biped, a quadruped and a creature with extra limbs, and the epic says a legless creature comes later. Sam can still map Kai's spine and arms onto the serpent by hand with a mapping asset, without the automatic match.
Covered by: story-shared-characters-map-a-different-body (by hand); epic-nearest-body-retargeting (legless body plan later). Rating: **deferred**.

**40. The four-armed tide giant.** Sam runs the automatic match on the giant, which picks the extra-limbs plan. Sam has Kai's right arm drive both right arms, saves the mapping, and plays a recorded take through it to send for review.
Covered by: story-nearest-body-retargeting-match-nearest-body-plan, story-nearest-body-retargeting-correct-and-save, story-nearest-body-retargeting-rehearse-and-review. Rating: **covered**.

**41. Growth driven by Kai.** Sam maps how far Kai spreads both arms to the sprite's size, within limits, with the feet staying on the floor where the form has them.
Covered by: story-character-forms-continuous-change, story-shared-characters-parameter-mapping. Rating: **covered**.

**42. The morph from sprite to serpent.** Sam sets up a morph between the sprite and the serpent with a 4-second curve and rehearses it forwards and back. The two forms use different mappings: the sprite is driven by parameter values and the serpent by a hand-made body mapping. story-character-forms-morph says Kai keeps driving during the morph, but only story-character-forms-swap-behind-effect says how the new form's own mapping takes over. For a continuous morph between forms whose bodies differ, no criterion says which mapping drives which part during the blend.
Covered by: story-character-forms-morph, story-character-forms-swap-behind-effect. Rating: **covered** (first rated partly, closed in #318).

**43. Dissolve into foam, reassemble as the giant.** Riley makes a dissolve of the serpent and a reassembly into the giant from their own meshes. It goes to the visual effects gate. While dissolved, Kai's channels keep their sources, and the giant follows Kai at once.
Covered by: story-character-forms-dissolve-and-reassemble, story-character-forms-swap-behind-effect. Rating: **covered**.

**44. Mae's raincoat.** Riley authors the coat's cloth once. PC VR and projection simulate it live, and the cloud session gets a baked version, each a lower-detail version.
Covered by: story-character-forms-hair-cloth-costume, story-asset-checks-lower-detail-versions. Rating: **covered**.

**45. Locking the characters.** Before the first rehearsal with Kai, Morgan locks Mae, Pell and the Tide and names Riley for later changes. When Riley later changes the giant's hands, Kai gets a short summary before the next session and confirms it.
Covered by: story-character-path-lock-character. Rating: **covered**.

**46. The harbour through Marble.** Jordan records Marble's licence. An agent generates the harbour from Riley's brief and the key art. It opens as a level of meshes and materials and is walkable at the mannequin's scale.
Covered by: story-environment-path-generate-a-world. Rating: **covered**.

**47. The kit fallback on a first project.** The pier generates badly, so Riley builds that part from the kit. The kit holds only environment assets "accepted at their gate", and on the company's first project it is empty. Riley can bring in hand-made pieces, but no story generates a single prop or kit piece (a crate, a lamp post) or names the gate a single environment asset passes on its own. The environments gate reviews a whole level.
Covered by: story-environment-path-make-a-kit-piece, story-environment-path-build-from-kit. Rating: **covered** (first rated partly, closed in #318).

**48. The look and the engine-ready check.** An agent brings materials, lighting and sky towards the key art, keeping Riley's hand changes. Sam runs the checks for PC VR, projection and the cloud session on the whole level.
Covered by: story-environment-path-develop-the-look, story-environment-path-engine-ready-level. Rating: **covered**.

**49. The environments gate.** The harbour reaches Morgan as one item with layout, look and interactive features. Morgan accepts layout and look and asks for a revision of the features.
Covered by: story-environment-path-approve-at-the-gate. Rating: **covered**.

**50. Effects: the tide foam.** Riley briefs an agent, which drafts a Niagara foam effect. Riley rebuilds the edge by hand. Sam records which parts the agent drafted usefully. Riley sees its cost on each target as it changes.
Covered by: story-effects-path-draft-an-effect, story-effects-path-see-cost. Rating: **covered**.

**51. Exposed values and the visual effects gate.** Sam exposes foam intensity, driven by the speed of Kai's hands, and a cue sets its colour in the storm. The effect reaches the visual effects gate with a recorded preview and its cost check, and Morgan approves.
Covered by: story-effects-path-expose-values, story-effects-path-revise-and-approve, story-asset-checks-check-effects-and-audio. Rating: **covered**.

**52. Sound drafts.** Drew briefs an agent for harbour ambience drafts, after Jordan records the audio tool's licence. Drew listens, compares and has one regenerated.
Covered by: story-sound-path-brief-to-drafts. Rating: **covered**.

**53. Stems from Drew's workstation.** Drew composes the score in a DAW and brings in WAV stems marked as music. Format and loudness are checked against each target's budget file before review. They wait at the sound and music gate.
Covered by: story-sound-path-sound-assets, story-asset-checks-check-effects-and-audio. Rating: **covered**.

**54. Placing sound and mixing in Unreal.** Drew attaches the foghorn to the lighthouse, sets fall-off, and listens from a guest's seat in binaural and from the stream camera in stereo. Drew sets a mix per output: headsets, projection room speakers, stream and browser. The sound-to-picture offset is measured at each output against Morgan's target.
Covered by: story-sound-path-place-sound, story-sound-path-mix-per-output. Rating: **covered**.

**55. The Tide's voice.** Drew sets pitch shift and a wet reverb on Kai's live voice. Kai's agreement allows driving a character live, so it runs. Its added delay is shown against Morgan's target.
Covered by: story-sound-path-live-voice-processing. Rating: **covered**.

**56. The Tide's jaw follows Kai's voice.** Sam drives the serpent's jaw from the level of Kai's microphone through audio analysis and a signal mapping. A performer's voice is performer data, but story-live-signals-audio-analysis treats any microphone as a signal and does not check the performer's agreement, unlike story-shared-characters-parameter-mapping and story-live-signals-performer-sensor.
Covered by: story-live-signals-audio-analysis, story-live-signals-map-a-signal. Rating: **covered** (first rated partly, closed in #318).

**57. Interaction design.** Quinn records three interactions: a venue guest raising a hand-held lantern draws the Tide closer; player guests tap "throw bread" to bring gulls; anyone can send a cheer. Quinn maps each to hand tracking, controllers, mouse and touch, chooses seated movement for headsets, and checks the seated and low-motion options are supported on every target.
Covered by: story-interaction-design-record-design, story-interaction-design-input-per-target, story-interaction-design-guest-movement. Rating: **covered**.

**58. Prototype, guest roles and placing.** Quinn plays a grey-box prototype in a PC VR headset with no gate. Quinn declares two guest roles (venue guests seen by performers, online guests unseen) and places the lantern interaction in the harbour level.
Covered by: story-interaction-design-playable-prototype, story-audience-avatars-guest-roles, story-environment-path-place-interactions. Rating: **covered**.

**59. Scripted tests and the interaction design gate.** Each interaction gets a scripted scenario per target. Quinn sends the design to its gate, and Morgan accepts it.
Covered by: story-interaction-design-scripted-tests, story-interaction-design-record-design. Rating: **covered**.

**60. Budget files and asset checks.** Morgan sets the budget files for PC VR, projection PC and the cloud session from measurements on proxy assets. Riley's assets are checked automatically for naming, polygons, textures, rig validity and provenance before review, and Riley sees failures in plain words. The giant fails the cloud budget, and an agent makes a lower-detail version that goes to Riley's gate as a batch.
Covered by: story-asset-checks-check-against-budget, story-asset-checks-check-provenance, story-asset-checks-show-failures, story-asset-checks-lower-detail-versions. Rating: **covered**.

**61. The pre-show from the library.** Quinn uses the standard pre-show pattern and restyles it as a harbour waiting room, which goes through the interaction design gate.
Covered by: story-guest-care-standard-pre-show, story-interaction-design-reusable-pattern. Rating: **covered**.

**62. Motion and performance quality gate.** REQ-workflow-2 gates "motion and performance quality". Morgan wants to approve how Kai's motion reads on the giant before the cue list is built round it. story-performer-support-motion-quality-check lets Sam set a numeric bar, and nothing makes any work wait at a motion and performance quality gate, says what goes to it (a mapping, a cleaned recording, a rehearsal take) or who approves it.
Covered by: story-review-and-status-motion-quality-gate, story-performer-support-motion-quality-check. Rating: **covered** (first rated gap, closed in #318).

### Phase 4. Live puppetry

**63. Suit setup.** Casey connects the inertial suit through a guided setup. Each step checks itself. Kai hears the calibration poses read aloud and does not need to read a screen. The calibration is saved under Kai's name. The connection is refused for anyone whose confirmed agreement does not allow body capture.
Covered by: story-live-puppet-inertial-suit-setup, story-live-puppet-connect-a-source. Rating: **covered**.

**64. Face from a phone, channels assigned.** Casey sets up the phone for Kai's face, and the setup reports what the camera can drive. Casey assigns body and hands to the suit, face to the phone, form and transformation to the parameter mapping, and voice to Kai's microphone.
Covered by: story-live-puppet-webcam-or-phone-setup, story-live-puppet-assign-channels. Rating: **covered**.

**65. Kai's microphone as a source.** The voice channel needs a source, but every guided setup is for a body-tracking device. No story sets up a performer's microphone (radio pack, gain, a dropped radio link as a drop) as a capture source through the common interface.
Covered by: story-live-puppet-microphone-setup, story-live-puppet-assign-channels, story-sound-path-mix-per-output. Rating: **covered** (first rated partly, closed in #318).

**66. Kai drives the giant live.** Kai drives the four-armed giant through the approved mapping. The delay is measured per body plan and saved with the mapping version.
Covered by: story-nearest-body-retargeting-drive-live. Rating: **covered**.

**67. Measuring delay.** Casey measures the end-to-end delay on the show's hardware. In the first test Kai stands beside the giant on the projection wall, and the people present record what they notice. Morgan sets a tighter target of 80 ms from it.
Covered by: story-live-puppet-measure-delay. Rating: **covered**.

**68. Motion quality.** Sam sets limits for foot sliding and turns on foot correction with Control Rig. The delay stays within target.
Covered by: story-performer-support-motion-quality-check. Rating: **covered**.

**69. Fallbacks.** Casey chooses fallbacks per channel: face to a safe hold, body to the AI-held pose, the jaw to a neutral value. Casey sees which channels still have none.
Covered by: story-handover-and-fallback-define-fallback. Rating: **covered**.

**70. Drop and recovery tests.** Casey switches the suit off mid-take. Every channel it drives switches to its fallback with no visible jump, Kai gets the fallback pattern in touch and sound, and the time to fallback is measured. When the suit returns it waits for the settling time, then the channels return.
Covered by: story-handover-and-fallback-automatic-switch, story-handover-and-fallback-performer-signal, story-handover-and-fallback-return-recovered-source. Rating: **covered**.

**71. Kai plays two characters.** In act one Kai drives Mae, then presses a foot pedal to hand Mae to a recorded loop and take up the Tide. The handover uses a pose match.
Covered by: story-handover-and-fallback-trigger-handover, story-handover-and-fallback-hand-over-a-channel, story-shared-characters-one-performer-several-characters. Rating: **covered**.

**72. Performer support.** Casey sets up a stage view on a monitor only the cast can see, the crew channel, and a haptic belt that carries the audience summary. Kai hears venue audio in an earpiece once the notice is approved.
Covered by: story-performer-support-stage-view, story-performer-support-crew-channel, story-performer-support-audience-summary-signals, story-performer-support-venue-audio. Rating: **covered**.

**73. A live room view for Kai.** Kai wants to see the ring of headset guests. The view shows silhouettes only, on a monitor that cannot be seen from any guest area, after its notice is approved and the legal review is recorded.
Covered by: story-performer-support-room-view. Rating: **covered**.

**74. Sam helps from home.** Sam joins the crew channel as a named remote helper during a rehearsal, with the delay shown.
Covered by: story-performer-support-remote-helper. Rating: **covered**.

**75. Recording rehearsal takes.** Casey records takes. Each names the performers, sources and agreement versions. Lee's takes are recorded for replay only. Casey cleans a take in Unreal as a new version. Alex uses a take to drive the Tide for a cue-to-cue rehearsal with no performer present.
Covered by: story-session-recording-record-and-replay, story-session-recording-check-agreement, story-session-recording-clean-up, story-session-operations-pause-and-jump. Rating: **covered**.

**76. Lee performs Pell from Toronto.** Lee's headset data streams to the venue in the open format. Lee's own view stays within target, and the delay to the venue is shown at both ends. A two-site test over ordinary internet sets the simulated link's delay and loss.
Covered by: story-session-recording-remote-performer, story-session-recording-stream-between-machines, story-session-recording-two-site-test, story-live-puppet-headset-setup. Rating: **covered**.

**77. Lee's side of the show.** Lee is alone in a rented room. Lee needs the crew channel, a stage view of Kai's characters, the audience summary, time-in-kit counting and a way to stop. story-performer-support-crew-channel works on the venue network and names only the remote helper and intercom as separate stories. story-session-recording-remote-performer measures delay and the fallback, and nothing gives the remote performer the crew channel, return feeds, an emergency stop or who is responsible for their safety at the remote site.
Covered by: story-performer-support-remote-performer-side, story-session-recording-remote-performer. Rating: **covered** (first rated partly, closed in #318).

**78. Lee's link in the show-level fallback.** The plan declares Lee's link as a layer: if it is lost, Pell flies to a perch and the flock covers. A recording of Lee cannot stand in, because Lee's agreement refuses it, and the plan shows why.
Covered by: story-show-safety-show-level-fallback, story-session-recording-remote-performer. Rating: **covered**.

**79. An understudy.** For two nights an understudy plays the Tide. Casey swaps the performer between sessions, and the understudy's calibration and mappings load with their own agreement.
Covered by: story-shared-characters-swap-performer. Rating: **covered**.

**80. Kai's time in kit.** Morgan and Kai set Kai's limits from rehearsal (75-minute stretch, 20-minute break), and Kai confirms them on Kai's page.
Covered by: story-schedule-and-touring-time-in-kit, story-schedule-and-touring-own-time-in-kit. Rating: **covered**.

**81. A capture test before any guest sees it.** Morgan wants Robin to see Pell moving before it goes public, as a courtesy and not a term. Robin's limited page shows only items waiting for sign-off. With no term needing sign-off, there is no way to share a preview with Robin.
Covered by: story-provenance-and-policy-collaborator-sign-off. Rating: **covered** (first rated partly, closed in #318).

### Phase 5. Show control

**82. Drafting the cue list.** Morgan asks an agent to draft a cue list from the scenario outline, with four sections: Harbour, Tide rises, Storm and Calm. A cue whose target is missing is marked. The draft goes to the cue list gate.
Covered by: story-cue-list-agent-drafts. Rating: **covered**.

**83. Alex builds it in Unreal.** Alex edits the list in the Unreal Editor: scene, lighting, sound, the morph, the set handover, cameras and outputs. The list is versioned with the project and runs on the show machine with no agent.
Covered by: story-cue-list-build-a-cue-list. Rating: **covered**.

**84. Virtual cameras for the stream.** The stream needs three virtual cameras (wide, Kai close, Pell follow) and live cuts that follow an improvisation. A camera is a cue target and cuts can fire from the palette, but no story sets up a virtual camera (placement, lens, following a character, a camera driven by a camera channel), lets Alex switch cameras outside the cue list, or covers a preview of the next shot.
Covered by: story-outputs-and-streaming-virtual-cameras, story-cue-list-step-and-palette. Rating: **covered** (first rated partly, closed in #318).

**85. Kai fires cues.** Kai's foot pedal fires "lightning", armed only in the Storm section. Kai feels it fire.
Covered by: story-cue-list-performer-fired. Rating: **covered**.

**86. Audience-fired cue.** When 30 per cent of player guests tap "throw bread" within 10 seconds, gulls swarm. Kai feels the count near the threshold and can block it.
Covered by: story-cue-list-audience-fired. Rating: **covered**.

**87. A lighting desk leads.** The venue's desk leads Unreal over MIDI show control. Sam names the desk's address as the only allowed sender. It is tested first against the simulated desk, then with the real desk in rehearsal. When the desk drops, Alex takes the lead from the current cue.
Covered by: story-external-systems-lead-or-follow, story-external-systems-osc-midi-msc, story-external-systems-simulators. Rating: **covered**.

**88. Lights follow Kai's giant.** The show sends the giant's position over PosiStageNet to two moving lights, and DMX values for the storm.
Covered by: story-external-systems-lighting. Rating: **covered**.

**89. The storm to music.** The storm cues are timed to Drew's music track playing in Unreal.
Covered by: story-cue-list-timecode-and-music. Rating: **covered**.

**90. Cue timing.** Each cue's timing error is measured on the show's hardware. Morgan confirms one frame at 90 fps from rehearsal.
Covered by: story-cue-list-step-and-palette. Rating: **covered**.

**91. Branching ending.** At the end of Calm, the combined player result chooses whether the Tide returns to the sea or stays as a lighthouse. Quinn adds the branch point with a default path, and each path has a scripted test.
Covered by: story-branching-shows-paths-and-endings, story-branching-shows-conditional-cue, story-branching-shows-review-and-test-paths. Rating: **covered**.

**92. Safe state and emergency stop.** Morgan declares the safe state per output: house lights to 70 per cent through a desk message, headsets to the real room, projection to a safe view, sound faded, the stream to a holding screen. Morgan approves it after seeing each output in rehearsal. The physical button is pressed 20 times across a full run and reaches the safe state each time.
Covered by: story-show-safety-declare-safe-state, story-show-safety-emergency-stop. Rating: **covered**.

**93. Show-level fallback plan.** Alex writes the plan for Lee's link, the desk, the player page and YouTube, and Morgan approves it with the cue list.
Covered by: story-show-safety-show-level-fallback. Rating: **covered**.

**94. Operator surfaces.** Alex runs from a tablet and a MIDI fader box, and swaps to a laptop mid-session with no restart.
Covered by: story-external-systems-surfaces-and-standalone. Rating: **covered**.

**95. Switching to show mode.** Alex switches to show mode and first sees the items with no approved version. A session with guests cannot start until the cue list is accepted and the safe state approved. A scripted test stops every agent mid-show and nothing changes.
Covered by: story-show-safety-switch-modes, story-show-safety-without-agents. Rating: **covered**.

**96. Dress rehearsal with live changes.** In show mode Drew asks to raise the stream music level beyond what Alex can ride. The change waits for Alex as delegate, is logged, and goes to Drew's queue after the session. Kai is told on the crew channel when Kai's mapping changes.
Covered by: story-session-operations-live-changes, story-sound-path-rehearsal-mix-changes. Rating: **covered**.

**97. Trims and recalibration.** Casey nudges the suit's heading by 4 degrees, within the range accepted with the show. In the Storm section's marked offstage moment, Casey reruns the suit's guided calibration.
Covered by: story-session-operations-live-trim. Rating: **covered**.

**98. Soak test of the attended show.** Before the first public night Morgan wants the show run for six hours straight, three sessions with resets plus the stream, to find leaks. story-unattended-running-soak-test is defined only for unattended shows, around opening hours and the idle state. story-build-and-install-automatic-checks shows "any soak test result" at the public-show gate, but nothing defines a soak test for an attended live show, its length or its pass bar.
Covered by: story-build-and-install-soak-test-attended-show, story-build-and-install-automatic-checks. Rating: **covered** (first rated gap, closed in #318).

### Phase 6. Delivery

**99. Engine and plugins.** Sam pins Unreal 5.8 and each plugin per target. The differences between PC VR and the cloud target are shown before any build.
Covered by: story-build-and-install-engine-and-plugin-versions. Rating: **covered**.

**100. The test kit.** Morgan records the first release's test kit: the show PC, the spare, two projectors, four PC VR headsets and a switch.
Covered by: story-build-and-install-measure-against-budget. Rating: **covered**.

**101. Building.** Sam starts builds for the venue PC, PC VR and the cloud session. Each target gets its lower-detail versions. A failed packaging stage names the item and links to the log.
Covered by: story-build-and-install-build-from-stages, story-review-and-status-status-board. Rating: **covered**.

**102. Automatic checks and measurement.** Each build passes asset checks, interaction, branch and behaviour scenarios, the without-agents test, an outside-address check, and a measured run to every ending with simulated guests at the declared counts.
Covered by: story-build-and-install-automatic-checks, story-build-and-install-measure-against-budget, story-behaviour-and-limits-scenario-tests. Rating: **covered**.

**103. The access review.** Jordan recruits and pays three Deaf and disabled artists, who review captions of improvised speech from local recognition, the seated option and the audio description, and set the bar. Jordan records their findings.
Covered by: story-guest-care-access-options, story-contracts-and-payment-draft-and-track-contracts. Rating: **covered**.

**104. The public-show gate.** Morgan sees check results, the build record, the offline test status and the recorded access review, and accepts the build.
Covered by: story-build-and-install-automatic-checks. Rating: **covered**.

**105. The venue profile.** Casey profiles the Vancouver studio theatre: floor plan, a pillar, the projection wall, the network, the desk and the fire alarm relay. Casey connects the relay and tests it with the venue's alarm test.
Covered by: story-venue-setup-venue-profile. Rating: **covered**.

**106. The fit check.** The show declares the space for the headset ring and seats, staffing of two attendants, one operator and one capture crew, and a guest count of 52. Casey checks it against the profile: it fits.
Covered by: story-venue-setup-fit-check. Rating: **covered**.

**107. Installing.** Casey installs the accepted build on both show machines from a local copy with no internet. Each reaches its first cue.
Covered by: story-build-and-install-install-and-roll-back. Rating: **covered**.

**108. Aligning to the room.** Casey marks three points with a headset controller. The suit and the headsets share one origin, within the tolerance Morgan set.
Covered by: story-venue-setup-align-to-room. Rating: **covered**.

**109. Room safety for seated headset guests.** Morgan approves how guests are kept clear, the boundary warning distance and the aftercare step. Morgan records that the venue's insurance and rules review is done.
Covered by: story-guest-care-room-safety. Rating: **covered**.

**110. The offline test.** A full show runs on the delivered build with the internet unplugged. A second run cuts the internet during the stream, and Lee's link follows the plan.
Covered by: story-venue-setup-offline-show. Rating: **covered**.

**111. The failed-machine plan.** Morgan chooses a warm spare. It is rehearsed by pulling the main machine's power.
Covered by: story-venue-setup-failed-machine-plan. Rating: **covered**.

**112. Headsets and attendants.** Taylor sees the headset list with charge, assigned session label and cleaning state. The live view of a guest's headset is opened only after the notice says staff can see it.
Covered by: story-outputs-and-streaming-pc-vr, story-venue-setup-headset-list, story-session-operations-output-thumbnails. Rating: **covered**.

**113. Projection.** Sam sets up the projection wall and saves its settings in the venue profile. After a stop it shows the safe view.
Covered by: story-outputs-and-streaming-projector-or-screen. Rating: **covered**.

**114. YouTube Live and the player page.** Sam sets the two destinations, the private test stream is measured, and the stream viewer count is set from a load test.
Covered by: story-outputs-and-streaming-stream-to-platforms, story-remote-guests-player-guest. Rating: **covered**.

**115. Where the player page, the cloud sessions and the installed app live.** The player page is a public web page, cloud sessions run on a rented cloud provider, and remote PC guests download an installed app. No story chooses or sets up the hosting, the domain, the cloud provider and its data region, the provider's terms on guest data, or how the app is downloaded. The YouTube stream key is a credential, and no story says where it is kept or that agents cannot read it.
Covered by: story-remote-guests-host-online-audience. Rating: **covered** (first rated gap, closed in #318).

**116. Going-live approval.** Jordan checks the music licences in the stream mix and YouTube's terms on music and chat data, and closes each item. Morgan then approves both destinations for the opening week's sessions.
Covered by: story-outputs-and-streaming-approve-going-live. Rating: **covered**.

**117. The stream's archive.** YouTube keeps a recording of a live stream by default. That recording is an audience replay of the performance, which REQ-delivery-21 defers and ties to each performer's agreement. Kai's agreement does not list replay to audiences, and approve-going-live does not ask whether archiving is on. The default platform behaviour does what an approved requirement defers.
Covered by: story-outputs-and-streaming-approve-going-live, story-session-recording-record-agreement. Rating: **covered** (first rated conflict, closed in #318).

**117a. Viewpoint choice.** Morgan would like player guests to pick between the three stream cameras. Viewpoint choice is later.
Covered by: REQ-audience-7 (later), epic-remote-guests (out of scope line). Rating: **deferred**.

### Phase 7. Audience

**118. Codes from the ticketing service.** Jordan imports 300 codes. One batch carries the interactive tier, the rest the player tier. Each works only for its session.
Covered by: story-remote-guests-join-by-link-or-code. Rating: **covered**.

**119. Guest counts.** From load tests Morgan sets 52 in the venue, 20 interactive guests, 400 player guests and 5,000 stream viewers.
Covered by: story-audience-avatars-choose-an-avatar, story-remote-guests-interactive-guest, story-remote-guests-player-guest, story-outputs-and-streaming-stream-to-platforms. Rating: **covered**.

**120. The data declaration.** The show captures no likeness or body data beyond live tracking, keeps nothing past the session, gathers opt-in feedback and opt-in analytics. Morgan approves it after the legal review for British Columbia is recorded.
Covered by: story-guest-care-guest-data, story-credits-and-outreach-collect-audience-data, story-credits-and-outreach-player-page-analytics. Rating: **covered**.

**121. Notices, warnings and languages.** The pre-show shows the notices, a warning for lightning flashes, the access options and the aftercare step, in English and French, read aloud. Morgan approves the wording and the French translation.
Covered by: story-guest-care-notices-and-warnings, story-guest-care-languages. Rating: **covered**.

**122. Minors.** The show admits guests aged 10 and over. The pre-show asks each guest's age group first and routes a younger guest to guardian consent. At the venue the guardian is standing beside the child. For a 12-year-old joining the player page from home, no criterion says how a guardian's consent is given or told apart from the child's own tap.
Covered by: story-guest-care-notices-and-warnings, story-guest-care-guest-data. Rating: **covered** (first rated partly, closed in #318).

**123. Stream viewers on YouTube.** story-remote-guests-join-by-link-or-code says stream viewers reach the pre-show from the link. Most stream viewers watch on YouTube itself and never open the show's link, so they see no warning about flashing light and give no age group, yet their chat feeds the show through story-outputs-and-streaming-read-chat and drives the stream-viewer crowd.
Covered by: story-remote-guests-join-by-link-or-code, story-outputs-and-streaming-approve-going-live. Rating: **covered** (first rated conflict, closed in #318).

**124. Venue guests arrive.** Twelve guests enter in two stages, have their headsets checked and learn the lantern in a short tutorial. Taylor sees two not yet ready. The pre-show time is measured against its budget.
Covered by: story-guest-care-standard-pre-show. Rating: **covered**.

**125. Access options.** Jamie, seated, turns on captions of Kai's improvised speech and the low-motion option, and changes them mid-show.
Covered by: story-guest-care-access-options. Rating: **covered**.

**126. Avatars and personal space.** Jamie picks a lantern-bearer avatar. Its input falls from hand tracking to controllers when a battery dies, with no jump. Avatars of remote guests fade inside personal space, and guests in the room stay visible as outlines.
Covered by: story-audience-avatars-choose-an-avatar, story-audience-avatars-follow-best-input, story-audience-voice-personal-space. Rating: **covered**.

**127. Interactive and player guests online.** Jamie joins once from a PC with the installed app, once from a phone as a player guest. When the interactive tier is full, a late guest is offered the player tier without re-entering the code. When the spend limit is reached, cloud guests move to the player tier.
Covered by: story-remote-guests-interactive-guest, story-remote-guests-player-guest, story-remote-guests-move-past-the-limit. Rating: **covered**.

**128. Likeness avatars.** Morgan asks whether Jamie could appear as themselves. Likeness avatars wait for consent rules and legal review.
Covered by: epic-audience-avatars (later, not written). Rating: **deferred**.

**129. Late entry and rejoin.** Jamie's phone drops in the Storm and rejoins with the same role and tier within the window.
Covered by: story-remote-guests-rejoin. Rating: **covered**.

**130. Chat, reactions and moderation.** Morgan approves moderation rules after seeing them run on recorded chat. In the show, held items wait for Alex. Text reaching Kai is read into Kai's earpiece. Reactions show on avatars at once.
Covered by: story-audience-voice-moderation-rules, story-audience-voice-send-chat-and-reactions, story-outputs-and-streaming-read-chat, story-audience-avatars-react. Rating: **covered**.

**131. Chat on YouTube's own page.** A YouTube viewer posts abuse. The pipeline's filters stop it reaching Kai and the scene, but it still shows to every viewer in YouTube's own chat panel, which the pipeline does not moderate. No story covers the platform's own moderation settings, blocked words or the platform moderators who act there.
Covered by: story-audience-voice-moderation-rules, story-outputs-and-streaming-approve-going-live. Rating: **covered** (first rated gap, closed in #318).

**132. The audience summary reaches Kai.** Kai feels the cheer level on the haptic belt and sees counts per audience type on the cast monitor. When the player feed overloads, that type shows as missing.
Covered by: story-audience-voice-audience-summary, story-performer-support-audience-summary-signals. Rating: **covered**.

**133. The stream-viewer crowd.** Stream viewers' combined reaction drives a crowd on the far pier. When the YouTube chat feed drops, the crowd falls back and Alex is told.
Covered by: story-audience-avatars-stream-viewer-crowd, story-live-signals-audience-reaction, story-live-signals-signal-fallback. Rating: **covered**.

**134. A guest becomes upset.** A guest in a headset grips the chair during the Storm. Taylor reads the aftercare step and helps them out. The boundary warning works.
Covered by: story-guest-care-room-safety. Rating: **covered**.

**135. Removing a guest.** A player guest spams the bread button and chat. Jamie mutes them. Alex removes them, and the code use is blocked for the session.
Covered by: story-audience-voice-mute-and-block, story-audience-voice-remove-a-guest. Rating: **covered**.

**136. Applause measured by a room microphone.** Morgan wants the seated venue audience's applause to count, so Sam points audio analysis at a room microphone. Unlike floor pads, beams and depth sensors, story-live-signals-audio-analysis has no notice and no legal review before a microphone that hears guests is used.
Covered by: story-live-signals-audio-analysis. Rating: **covered** (first rated partly, closed in #318).

**137. Feedback and analytics.** After the session Jamie leaves feedback, allows quoting, and gets a deletion code. Analytics stay off for guests who do not opt in.
Covered by: story-credits-and-outreach-collect-audience-data, story-credits-and-outreach-player-page-analytics. Rating: **covered**.

**138. Guest data deleted.** At the reset, session-only data, mutes and avatar choices are deleted and none is found in the project or backups. A week later Jamie asks for their feedback to be deleted using the code.
Covered by: story-guest-care-guest-data, story-session-operations-reset-for-next-session, story-credits-and-outreach-collect-audience-data. Rating: **covered**.

### Phase 8. AI assists

**139. The harbour crowd.** Morgan places 30 villagers on the quay with idle, gather and part-around-character behaviours. Sam tunes them. The count fits each target's measured maximum.
Covered by: story-crowds-and-creatures-place-a-crowd. Rating: **covered**.

**140. The gull flock.** Sam adds 12 autonomous gulls with perch, follow and flee behaviours on the bird body plan added for them.
Covered by: story-crowds-and-creatures-add-creatures, story-nearest-body-retargeting-add-body-plan. Rating: **covered**.

**141. Behaviour specifications.** Morgan writes plain-words specifications for the crowd and flock, with scripted fallbacks and redirects. Each lists its AI use (rule-based, show time) and is checked against the policy record.
Covered by: story-behaviour-and-limits-write-specification, story-behaviour-and-limits-check-ai-use. Rating: **covered**.

**142. Content limits.** Morgan drafts limits: gulls never dive at a guest's avatar, villagers never come within 2 m of a guest's presence, nothing points at the projection audience. Morgan approves them as safety holder after seeing them run on recorded scenarios.
Covered by: story-behaviour-and-limits-content-limits. Rating: **covered**.

**143. Scenario tests and the AI behaviour gate.** Scenarios replay recorded takes and simulated guests 50 times. A limit breach in one run fails the build. The specifications pass the AI behaviour, voice and dialogue gate.
Covered by: story-behaviour-and-limits-scenario-tests, story-behaviour-and-limits-write-specification. Rating: **covered**.

**144. Scripted fallbacks.** Each behaviour has a loop as its fallback. A test cuts every service mid-show and the crowd keeps going.
Covered by: story-behaviour-and-limits-scripted-fallback. Rating: **covered**.

**145. AI assists on Kai's Tide.** Sam gives the serpent's tail AI secondary motion and fills the giant's unmatched fins. Kai's agreement allows AI assists. Kai switches AI off with a glove gesture in the Calm section, feels it in two senses, and only Kai can turn it back on.
Covered by: story-crowds-and-creatures-ai-assists. Rating: **covered**.

**146. Kai conducts the flock.** In the Storm section Kai takes the flock with a pedal cue and steers its gathering point with the left hand.
Covered by: story-crowds-and-creatures-conduct. Rating: **covered**.

**147. Locked and free moments.** Morgan marks the Storm locked and the Harbour free.
Covered by: story-crowds-and-creatures-locked-or-free. Rating: **covered**.

**148. Gulls react to venue guests, and Alex overrides.** Floor pads in the venue make gulls lift as guests walk in, after the notice and legal review. Alex pauses the flock with one control when a guest panics.
Covered by: story-crowds-and-creatures-presence-reaction, story-live-signals-guest-presence, story-behaviour-and-limits-override. Rating: **covered**.

**149. The Tide carries on while Kai rests.** Morgan would like the giant to keep acting in Kai's style for 30 seconds while Kai changes kit. That is AI takeover from a performer.
Covered by: REQ-characters-11 (later). Rating: **deferred**.

**150. The Tide answers a viewer by name.** Morgan would like the Tide to turn to a guest who typed "hello Tide". Characters that respond to identified guests are later. A generated voice for the Tide is also later.
Covered by: REQ-characters-9 (later), epic-sound-path (generated voices later). Rating: **deferred**.

### Phase 9. Running sessions

**151. The day's call sheet.** An agent drafts the opening night's call sheet from the schedule and venue profile, with Kai's planned time in kit. Jordan approves and sends it.
Covered by: story-schedule-and-touring-call-sheets. Rating: **covered**.

**152. The pre-show check.** At 18:00 the check runs by itself: build, suit, phone, outputs, desk link, profile, alignment, alarm input and the spare. The phone's battery is low, so Alex is told what to do.
Covered by: story-session-operations-pre-show-check. Rating: **covered**.

**153. Starting a session and going live.** At 19:30 Alex opens the pre-show to guests, starts the session and starts the YouTube and player page destinations. story-session-operations-several-sessions says a person "starts a session in a copy that is ready", and story-guest-care-standard-pre-show defines the pre-show as the state before the start. For a single-copy show, no story defines the start control, what ends a session in a live show (an ending, Alex, a time), or how starting and ending a session relate to starting and stopping the stream.
Covered by: story-session-operations-start-and-end-session. Rating: **covered** (first rated partly, closed in #318).

**154. The suit's battery dies.** Twelve minutes in, Kai's suit stops. Body channels fall to the AI-held pose, face continues from the phone, Kai feels the fallback pattern, and Casey swaps the battery. The channels return after the settling time.
Covered by: story-handover-and-fallback-automatic-switch, story-handover-and-fallback-return-recovered-source, story-crowds-and-creatures-ai-assists, story-session-operations-routing-control. Rating: **covered**.

**155. Drift.** The suit drifts 6 degrees without dropping. Casey trims it within range.
Covered by: story-session-operations-live-trim. Rating: **covered**.

**156. Lee's link drops.** Pell flies to its perch as the plan says, Lee feels the fallback, and Pell returns when the link is back.
Covered by: story-session-recording-remote-performer, story-show-safety-show-level-fallback. Rating: **covered**.

**157. The player page is flooded.** A burst of 2,000 taps overloads the input layer. It drops the excess input, the show and the venue continue, and Alex restarts the input service.
Covered by: story-remote-guests-contain-failures. Rating: **covered**.

**158. The main machine fails.** In the second session the main show PC crashes. Alex switches to the warm spare at the last cue. Headsets show their runtime's boundary view while down. The stream was encoded on the failed machine, so YouTube shows nothing at all rather than the holding screen: the holding screen is drawn by the show, and the plan has no stand-in for a remote output the failed machine drove.
Covered by: story-venue-setup-failed-machine-plan. Rating: **covered** (first rated partly, closed in #318).

**159. The fire alarm.** In the third session the alarm sounds. The relay fires the emergency stop: house lights up, headsets show the room, the stream shows its holding screen, the crew hear it on the crew channel and Kai feels the stop pattern. Taylor helps guests out. After the all-clear Alex clears the stop with confirmation, and the session resumes from the start of the Storm.
Covered by: story-show-safety-emergency-stop, story-venue-setup-venue-profile, story-show-safety-declare-safe-state, story-performer-support-crew-channel, story-session-operations-pause-and-jump. Rating: **covered**.

**160. An incident report.** During the evacuation a guest trips on a headset cable. The venue and the insurer ask for an incident report. The stop log records what fired and who cleared it, and nothing records an incident: what happened to whom, first aid given, and the follow-up, with the privacy rules that data needs.
Covered by: story-guest-care-record-an-incident, story-contracts-and-payment-keep-records. Rating: **covered** (first rated gap, closed in #318).

**161. Reset between sessions.** After each session the world, characters and cue position reset with one control, session data is deleted, the shorter check runs, and Taylor gets the ready signal. Guests still in headsets see the held harbour view.
Covered by: story-session-operations-reset-for-next-session. Rating: **covered**.

**162. Two copies on the festival day.** At a festival day the company runs two copies, one for a headset group and one for a school group on the projection wall. Each copy has its own guests and reset, and one emergency stop reaches both.
Covered by: story-session-operations-several-sessions. Rating: **covered**.

**163. The session log.** Each session's log holds start, end, reset time and guest counts by audience type, and no guest data.
Covered by: story-session-operations-reset-for-next-session. Rating: **covered**.

**164. A self-guided foyer version.** Between evenings the festival wants a 10-minute self-guided version in its foyer, on a screen with a start button. Recordings of Kai stand in, which Kai's agreement allows. Cues fire from the start button and timecode. Morgan approves the guest stop and pause. The self-guided story uses recordings to drive characters, and REQ-delivery-21 defers replaying a recorded live show to audiences. Where one ends and the other begins is not stated.
Covered by: story-branching-shows-self-guided-run. Rating: **covered** (first rated conflict, closed in #318).

**165. Running the foyer version unattended.** The foyer version is declared unattended: screens only, no guest data. It opens at 10:00 on the machine's clock, idles between guests, recovers from a forced crash and a power cut, and alerts Taylor's tablet when recovery fails. A 24-hour soak test passes and is accepted at the public-show gate.
Covered by: story-unattended-running-schedule-and-check, story-unattended-running-idle-state, story-unattended-running-restart-and-recover, story-unattended-running-holding-state-and-alert, story-unattended-running-maintenance-and-log, story-unattended-running-soak-test. Rating: **covered**.

### Phase 10. Business and wrap-up

**166. Cost lines.** Metered Tripo, Marble and cloud costs arrive as cost lines by themselves. Jordan uploads the venue's invoice as a PDF, which goes to the protected store, and an agent drafts the cost line with the bank details hidden.
Covered by: story-budgets-and-cost-track-actual-cost, story-contracts-and-payment-protect-sensitive-data. Rating: **covered**.

**167. A cost in US dollars.** Tripo bills in USD. Jordan records the rate and its date. Until then, further metered work in USD is blocked.
Covered by: story-budgets-and-cost-track-actual-cost. Rating: **covered**.

**168. Actual cost against budget.** Jordan sees each line's budget, actual and remaining, with generation, cloud and per-show costs per session. Kit hire passes 90 per cent and Jordan is told.
Covered by: story-budgets-and-cost-cost-and-schedule-view. Rating: **covered**.

**169. Venue hire and other contracts.** The venue hire agreement and the access reviewers' contracts are drafted, reviewed and signed at the contracts gate.
Covered by: story-contracts-and-payment-draft-and-track-contracts. Rating: **covered**.

**170. An e-signature tool.** The venue wants electronic signature. Jordan records why a tool is needed, Jordan records its terms on data, and Sam connects it through an adapter. Agents cannot send for signature.
Covered by: story-budgets-and-cost-connect-a-tool. Rating: **covered**.

**171. Invoices to the festival.** An agent drafts the festival's fee invoice from the signed contract. Jordan edits, approves and sends it, and records payment received.
Covered by: story-contracts-and-payment-quotes-and-invoices. Rating: **covered**.

**172. Ticket income from the venue.** The venue settles the box office split. The company receives money it did not invoice, and nothing records income against a budget line (see step 20).
Covered by: story-budgets-and-cost-track-actual-cost, story-budgets-and-cost-cost-and-schedule-view. Rating: **covered** (first rated gap, closed in #318).

**173. Payroll.** Kai, Casey and Alex confirm their time records. An agent prepares hours, rates and gross amounts from the signed contracts. Jordan exports the figures for the accountant, and the bank details are added from the protected store at export.
Covered by: story-contracts-and-payment-prepare-payroll. Rating: **covered**.

**174. Credits.** An agent drafts credits from the facts and the provenance records. Robin is credited with Robin's wording, Kai as "Kai R.", the Council's acknowledgement is included by hand because the award's wording was never recorded (step 25). Morgan approves at the AI-use statements and credits gate.
Covered by: story-credits-and-outreach-build-credits. Rating: **covered**.

**175. The AI-use statement.** An agent drafts the statement for the show from the provenance records: drafts by Higgsfield, meshes by Tripo, the harbour by Marble, Pell's head by hand, rule-based crowds. One asset with no record blocks approval until Riley adds it.
Covered by: story-credits-and-outreach-ai-use-statement. Rating: **covered**.

**176. Promotion.** An agent drafts a press kit and posts. A clip of Kai is used because Kai's agreement includes promotion. A wording test with audiences picks "live puppet show you can join" over "VR". Morgan approves at the publishing and marketing gate.
Covered by: story-credits-and-outreach-draft-promotion. Rating: **covered**.

**177. A highlights video.** Morgan wants a two-minute trailer rendered from a recorded session. Rendered export is later.
Covered by: REQ-delivery-20 (later). Rating: **deferred**.

**178. Kai withdraws promotion use.** After the tour Kai withdraws promotion use. Jordan records the change, Kai confirms, and new uses of Kai's clips are blocked. Published posts stand as already delivered.
Covered by: story-session-recording-change-agreement, story-credits-and-outreach-draft-promotion. Rating: **covered**.

**179. Audience figures and the funder report.** An agent drafts the audience section of the Council's final report from attendance and feedback, with groups under the set size hidden. The final report and claim, with proof attached by a person, pass the rule check and the funding gate, and Morgan submits.
Covered by: story-credits-and-outreach-audience-data-in-reports, story-funding-reports-and-claims. Rating: **covered**.

**180. Tax credits.** Jordan tracks a provincial digital media tax credit. An agent marks qualifying cost lines and hours, Jordan accepts them, and exports them for the accountant.
Covered by: story-funding-tax-credits. Rating: **covered**.

**181. Records kept.** Jordan records retention rules from the Council's terms and the tax rule. Contracts, proof of spend and consent records show why and until when they are kept.
Covered by: story-contracts-and-payment-keep-records. Rating: **covered**.

**182. Saving to the library.** Sam saves the Tide's rig, the giant mapping and the cue list to the company library with their terms and Kai's agreement. Quinn saves the lantern pattern.
Covered by: story-shared-library-save-to-library, story-interaction-design-reusable-pattern. Rating: **covered**.

**183. Running it alone.** Morgan exports the budget and cost lines as .xlsx for the board and imports them back unchanged, with no third-party tool.
Covered by: story-budgets-and-cost-work-alone. Rating: **covered**.

**184. Closing the project.** When the tour ends, Jordan wants to end the access of the freelancers, revoke agent grants, take a final backup and mark the project closed and read-only while its records stay under retention. Roles can be removed one by one, and no story closes or archives a project.
Covered by: story-project-record-close-project. Rating: **covered** (first rated partly, closed in #318).

### Phase 11. Short tour

**185. Scheduling the tour.** Jordan schedules calls for a week in Calgary and a week in Toronto. Availability clashes and a call past Kai's time-in-kit limit are flagged and cannot be confirmed.
Covered by: story-schedule-and-touring-schedule. Rating: **covered**.

**186. Venue profiles and fit checks.** Casey drafts profiles from the venues' floor plans and confirms them on arrival. The Calgary room is smaller, so the show uses its second hand-made layout, approved at the environments gate.
Covered by: story-venue-setup-venue-profile, story-venue-setup-fit-check. Rating: **covered**.

**187. Toronto's alarm.** The Toronto venue has no alarm interface. Morgan records that Alex presses the stop on the alarm, and the pre-show check asks Alex to confirm it.
Covered by: story-venue-setup-venue-profile. Rating: **covered**.

**188. Manifests and checklists.** An agent drafts an equipment manifest and set-up checklist per venue. Casey ticks steps on the venue network. The guided steps show their own results.
Covered by: story-schedule-and-touring-manifests-and-checklists. Rating: **covered**.

**189. The travel checklist.** An agent drafts the trip's checklist. Jordan books flights and rooms in person and records each cost. Lee's passport number is in the protected store.
Covered by: story-schedule-and-touring-travel-checklist. Rating: **covered**.

**190. Call sheets and time in kit on tour.** Daily call sheets go out after approval. Kai sees Kai's own stretches and travel days on Kai's page.
Covered by: story-schedule-and-touring-call-sheets, story-schedule-and-touring-own-time-in-kit. Rating: **covered**.

**191. A fix mid-tour.** A bug in the reset is fixed in Calgary. The new build passes the public-show gate and needs a passing offline test at Toronto before the first public show there. Casey installs it from a local copy.
Covered by: story-build-and-install-automatic-checks, story-venue-setup-offline-show, story-build-and-install-install-and-roll-back. Rating: **covered**.

**192. Sending the fix ahead.** Sam would like to send the fixed build to the Toronto machines over the internet before the crew arrives. Remote updates are later.
Covered by: REQ-delivery-10 (later). Rating: **deferred**.

**193. Going live on tour.** Morgan approves the YouTube destination for the Calgary and Toronto sessions.
Covered by: story-outputs-and-streaming-approve-going-live. Rating: **covered**.

**194. On-site hours.** The workflow requirements make on-site and rehearsal hours a success measure for the first project. Calls record planned hours and confirmed time records hold hours worked, but no story reports on-site hours per venue against planned hours for the measure.
Covered by: story-budgets-and-cost-cost-and-schedule-view. Rating: **covered** (first rated partly, closed in #318).

**195. Touring with an understudy.** In Toronto the understudy plays two nights. Casey swaps the performer, and the understudy's limits and agreement apply.
Covered by: story-shared-characters-swap-performer, story-schedule-and-touring-time-in-kit. Rating: **covered**.

**196. Crossing a border.** A late offer comes from Seattle. Kit would cross the border and Lee would need a work permit. The travel checklist tracks bookings and protects passport numbers, and nothing covers customs documents for kit or work permits for people.
Covered by: story-schedule-and-touring-travel-checklist. Rating: **covered** (first rated partly, closed in #318).

## How the gaps were closed

PR #318 closed every step first rated partly, gap or conflict.

The approver decided three questions:

1. Incidents: a new guest-care story records injuries, near misses and complaints. Only the holder of the audience-facing safety and consent approval and the staff they name can see a record. It is kept as a business record, pending legal review.
2. Guardian consent at home: a guardian attests in the pre-show, and only for regions whose legal review is recorded. The review is recorded per region.
3. Touring abroad is in scope. Customs documents (for example an ATA carnet) and work permits are travel-checklist items, and their numbers are kept in the protected store.

PR #318 also records 17 proposals the approver has not yet decided, such as organisation-level company facts and cash-flow timing in the first release. They are written into the stories and can be changed later.

| Steps | What was missing | Closed by |
|---|---|---|
| 2, 17 | Organisation and company facts | story-project-record-set-up-organisation, story-project-record-start-project |
| 3 | What each role may see and do | story-project-record-add-person |
| 20, 27, 172 | Income and cash timing | story-budgets-and-cost-build-a-budget, story-budgets-and-cost-track-actual-cost, story-budgets-and-cost-cost-and-schedule-view |
| 21 | Planned AI use at application time | story-credits-and-outreach-ai-use-statement |
| 23 | Letters of support | story-funding-draft-application |
| 25 | Funding result | story-funding-record-decision, story-funding-reports-and-claims, story-credits-and-outreach-build-credits |
| 31 | Sign-off before generation | story-provenance-and-policy-block-generation |
| 37 | Two meanings of "creature" | story-crowds-and-creatures-add-creatures, story-character-path-other-styles |
| 42 | Morph between different bodies | story-character-forms-morph |
| 47 | Kit pieces on a first project | story-environment-path-make-a-kit-piece |
| 56, 136 | Voice and guest microphones | story-live-signals-audio-analysis |
| 62 | Motion and performance quality gate | story-review-and-status-motion-quality-gate, story-performer-support-motion-quality-check |
| 65 | Microphone as a source | story-live-puppet-microphone-setup |
| 77 | The remote performer's own side | story-performer-support-remote-performer-side |
| 81 | Previews for a collaborator | story-provenance-and-policy-collaborator-sign-off |
| 84 | Virtual cameras | story-outputs-and-streaming-virtual-cameras |
| 98 | Soak test for an attended show | story-build-and-install-soak-test-attended-show |
| 115 | Hosting the online audience | story-remote-guests-host-online-audience |
| 117 | The platform's archive | story-outputs-and-streaming-approve-going-live, story-session-recording-record-agreement |
| 122 | Guardian consent at home | story-guest-care-notices-and-warnings, story-guest-care-guest-data |
| 123 | Stream viewers and the pre-show | story-remote-guests-join-by-link-or-code, story-outputs-and-streaming-approve-going-live |
| 131 | Moderation on the platform's own chat | story-audience-voice-moderation-rules |
| 153 | Starting and ending a session | story-session-operations-start-and-end-session |
| 158 | The stream when its machine fails | story-venue-setup-failed-machine-plan |
| 160 | Incident records | story-guest-care-record-an-incident, story-contracts-and-payment-keep-records |
| 164 | Self-guided shows and audience replay | story-branching-shows-self-guided-run |
| 184 | Closing a project | story-project-record-close-project |
| 194 | On-site hours | story-budgets-and-cost-cost-and-schedule-view |
| 196 | Customs and work permits | story-schedule-and-touring-travel-checklist |

### Deferred, for the record

Steps 15a (update to a remote venue gate), 39 (legless body plan), 117a (viewpoint choice), 128 (likeness avatars), 149 (AI takeover from a performer), 150 (responses to identified guests and generated voices), 177 (rendered export) and 192 (remote updates) are deferred by approved lines. None blocks the first show. Step 39 has a working route by hand, and step 192 has a working route by local install.

## What this does not test

- Built software, and whether the stories' criteria can be met as written. A covered step can still be hard to build.
- The quality of the creative work, or whether improvisation reads well on a stylised character.
- Stories of epics outside the first release.
- Legal correctness. Funder rules, tax credits, guardian consent, sensing, insurance and retention periods are stated as the stories state them, pending the legal reviews the stories already require.
- Performance figures. Delay targets, guest counts and budget numbers here are invented for the walk-through.
- Other use cases. UC-1 touring LBVR with standalone headsets, the museum piece with conversation and the other shows in the earlier desk check are not walked again.
- Several performers sharing one character, props and mixed reality, which this show did not need.
- Whether the gate list leaves the approver enough time. Step counts show how many gates Morgan passes through, but the review load is not measured.
