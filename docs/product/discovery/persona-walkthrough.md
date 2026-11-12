---
id: discovery-persona-walkthrough
status: draft
---

# Persona walkthrough of the approved stories

A walkthrough of the 257 approved stories once for each persona, in the order each would meet them on a first project, asking where the persona would fail and why. It was run after PR #318, by the rfr-process persona-walkthrough agent, and complements the coverage check in [concept-to-completion.md](concept-to-completion.md), which it does not repeat. "Observed" means the story text shows it; "inferred" means it is predicted from the persona file. The fixes were applied in the same pull request that records this walkthrough; the table at the end lists the stories that close each finding.

## Summary

- 33 findings: 0 blockers, 18 major, 15 minor.
- Every persona has stories, and every requirement is referenced by at least one epic or story (checked by id only).
- Nine persona goals have no story that serves them (listed at the end).

## Cross-cutting

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| X1 | major, observed | 51 stories leave a target, window, tolerance, count or timeout for the director or their delegate to set, about 30 of them "from rehearsal before this story is accepted", with no defaults. This works against Morgan's goals to approve quickly and spend less personal time. | A Morgan story: accept a starter set of targets and limits, change only where rehearsal shows a need, and list every unset value in plain words. |
| X2 | major, observed | 17 stories gate features on a legal review that the safety and consent holder records, but no story says who commissions one. | A Jordan story: commission and track legal reviews, with the features each one blocks shown on the status board. |
| X3 | major, observed | 14 stories read messages aloud to the performer on the crew channel, with no priority or quiet rule. Kai must "hear or feel a problem without breaking the performance". | A criterion in story-performer-support-crew-channel: which messages interrupt the performer, which wait for an offstage moment, which go to crew only. |
| X4 | major, observed | The performer must tell a dozen or more signal patterns apart, but each story tests only its own pattern. | One rehearsal criterion in story-handover-and-fallback-performer-signal that tests the whole set together. |

## Kai, the performer

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| K1 | major, observed | story-schedule-and-touring-time-in-kit lets Kai mark kit off but names no control. Marking off switches channels to fallback, so a stray press matters. The only physical stop for Kai is the solo-show one. | Name the control, make it safe from accidental use, and keep it armed in every section. |
| K2 | major, inferred | story-show-safety-solo-show checks that operator actions are covered, not capture-crew actions. A return that waits for Casey's confirmation never completes on a solo show. | Extend the solo check to crew-role actions; solo shows use "return by itself". |
| K3 | minor, inferred | Kai meets several sign-offs before performing, with no single "ready to perform" view. | Show outstanding items in text on Kai's limited page. |
| K4 | minor, observed | The agreement pages carry the legal confirmation but do not require WCAG 2.2 AA, as own-time-in-kit does. | Add the same criterion to record-agreement and change-agreement. |

## Taylor, the venue attendant

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| T1 | major, inferred | Taylor's goal "pause or stop for a guest who needs help" has no story; only Alex can pause, and the emergency stop stops everything. | Pause or end one guest's session, as an attendant. |
| T2 | major, observed | The live view of a guest's headset waits for a notice and a legal review, with no fallback for Taylor meanwhile. | A fallback, such as a plain "ask the guest" script on the headset list. |
| T3 | minor, observed | Taylor records incidents "from the dashboard", but uses only show-time tools, standing with guests waiting. | A quick record from the show-time device, completed later by the holder. |
| T4 | minor, observed | Three unattended-running stories are told as Taylor, though unattended shows have no staff. | Re-tell them for the person named for the schedule. |
| T5 | minor, inferred | Guardian consent for a minor in the venue has no stated method or place for Taylor to see it. | State the venue method and show "guardian consent recorded" per session. |

## Jamie, the audience member

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| J1 | major, observed | Jamie can mute, block and keep personal space, but cannot ask for help or report a guest. | A Jamie story: ask for help or report a guest in two steps, reaching Taylor or Alex in text and with a sound. |
| J2 | minor, observed | The pre-show has many steps for a guest with no patience for setup, and no default time ceiling. | A default ceiling for a first-time guest and a "skip to defaults" path for access options. |
| J3 | minor, inferred | A guest given a replacement headset may lose their avatar, since the rejoin token is tied to a device. | Say whether the token moves with the headset. |

## Robin, the collaborator

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| R1 | major, observed | Robin can see recorded terms but never confirms them, unlike a performer's agreement. | A dated confirmation and history, as in change-agreement. |
| R2 | major, observed | Robin cannot ask to change terms, a persona goal. | "Request a change to my terms" on the limited page, to the contracts approver's queue. |
| R3 | major, observed | A waiting sign-off has no reminder, no alternate, and no "I need more information" answer. | Add those three. |
| R4 | minor, inferred | How the signer on the limited page is verified is not defined. | A criterion on verifying the signer. |

## Casey, the capture crew

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| C1 | major, inferred | Show-time alerts and fallback changes assume Casey is at the show; the persona works before the call or in a break. | Say who is alerted when no crew role is present (for example Alex) and whether they may act. |
| C2 | minor, observed | Casey sets many timeouts and ranges with no starting values. | As X1, with defaults saved in the venue profile. |

## Alex, the show operator

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| A1 | major, observed | story-cue-list-build-a-cue-list has Alex build cues in the Unreal Editor, which is not among Alex's tools. | Cue editing on the touchscreen or tablet surface, or Sam authors and Alex reviews. |
| A2 | minor, inferred | Several alerts can arrive at once with no ordering. | A "what to do first" ordering on the operator console. |

## Riley, the artist

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| Ri1 | major, observed | Work Riley generates directly in their own tool is either labelled "no AI used" or skips the policy gate. | "Bring in work I generated in my own tool", with tool and licence declared and the policy gate run. |
| Ri2 | major, observed | Cost on weaker devices is shown while working only for effects; characters and kit pieces are checked only before review. | Extend story-effects-path-see-cost to meshes, rigs and kit pieces. |
| Ri3 | minor, inferred | A newcomer gets a role but no first view of what to do next. | A "what needs me" first screen from the review queue. |

## Drew, the sound designer

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| D1 | major, inferred | Each rehearsal mix change waits at the sound gate; Casey has a pre-approved trim range, Drew does not. | A pre-approved level range, or one batch approval at the end of rehearsal. |
| D2 | minor, observed | Venue speaker mixes are deferred, though they are one of Drew's four outputs. | Add a venue speaker mix and check, or say it is out of scope for the first show. |

## Quinn, the interaction designer

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| Q1 | major, observed | "Check comfort and clarity with real people" has no story; REQ-interaction-6 calls it a separate step. | A Quinn story: run a session with real guests, capture comments, and see the resulting revisions. |

## Morgan, Jordan and Sam

| Id | Severity | Finding | Proposed fix |
|---|---|---|---|
| M1 | minor, observed | The review queue has no grouping for bursts of reviews. | Group by gate and show the oldest blocking item first. |
| J-1 | minor, observed | A new project blocks metered agent work until Jordan sets a limit, and the blocked person is not told who can. | Name who can set the limit in the message. |
| S1 | minor, inferred | A technical artist hired per project gets no summary of how the project was set up. | "See how this project was set up", from the project record and activity log. |

## Goals no story serves

1. Quinn: check comfort and clarity with real people (Q1).
2. Jamie: ask for help or report a guest (J1).
3. Taylor: pause or stop for one guest (T1).
4. Robin: confirm terms and request changes to them (R1, R2).
5. Riley: use generation tools directly, with honest provenance (Ri1).
6. Casey: diagnose radio interference and drift (only the microphone story handles a radio pack).
7. Drew: a right-sounding mix for venue speakers (D2).
8. Kai: a stop control on shows that are not solo (K1).
9. Jordan: commission legal reviews (X2).

## Fixed by

| Id | Stories that close it |
|---|---|
| X1 | story-review-and-status-starter-targets (new) |
| X2 | story-contracts-and-payment-legal-reviews (new) |
| X3 | story-performer-support-crew-channel |
| X4 | story-handover-and-fallback-performer-signal |
| K1 | story-schedule-and-touring-time-in-kit |
| K2 | story-show-safety-solo-show, story-handover-and-fallback-return-recovered-source |
| K3 | story-session-recording-record-agreement |
| K4 | story-session-recording-record-agreement, story-session-recording-change-agreement |
| T1 | story-session-operations-pause-one-guest (new) |
| T2 | story-venue-setup-headset-list |
| T3 | story-guest-care-record-an-incident |
| T4 | story-unattended-running-schedule-and-check and story-unattended-running-idle-state, re-told as Sam. story-unattended-running-holding-state-and-alert stays as Taylor, because Taylor is the person called when the show needs someone. |
| T5 | story-guest-care-guest-data, story-venue-setup-headset-list |
| J1 | story-audience-voice-ask-for-help (new) |
| J2 | story-guest-care-standard-pre-show |
| J3 | story-remote-guests-rejoin |
| R1 | story-provenance-and-policy-record-terms |
| R2 | story-provenance-and-policy-record-terms |
| R3 | story-provenance-and-policy-collaborator-sign-off |
| R4 | story-provenance-and-policy-collaborator-sign-off |
| C1 | story-handover-and-fallback-automatic-switch, story-handover-and-fallback-define-fallback |
| C2 | story-review-and-status-starter-targets |
| A1 | story-cue-list-build-a-cue-list |
| A2 | story-session-operations-pre-show-check |
| Ri1 | story-character-path-own-tool-generated-work (new), story-character-path-hand-made-work, story-environment-path-bring-hand-made-work |
| Ri2 | story-effects-path-see-cost |
| Ri3 | story-review-and-status-what-needs-me (new) |
| D1 | story-sound-path-rehearsal-mix-changes |
| D2 | story-sound-path-place-sound, story-sound-path-mix-per-output (venue speakers added, a proposal pending approval) |
| Q1 | story-interaction-design-test-with-real-guests (new) |
| M1 | story-review-and-status-see-review-queue |
| J-1 | story-agent-work-spend-limit |
| S1 | story-project-record-see-how-it-was-set-up (new) |
| Casey's radio goal | story-live-puppet-radio-and-drift-check (new) |
