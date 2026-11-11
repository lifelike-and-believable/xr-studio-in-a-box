---
id: story-behaviour-and-limits-check-ai-use
status: approved
derived-from:
  - epic-behaviour-and-limits#outcome: 11fe519b4e30
  - persona-collaborator#goals: 72c41c51284f
---

# Check AI use in a specification against the policy record

As Robin, a collaborator, I want every AI use a behaviour specification describes checked against my recorded terms at its gate so that I can trust that those terms hold, and that the pipeline refuses work that breaks them.

## Acceptance criteria

- A behaviour specification (story-behaviour-and-limits-write-specification) lists each AI use it makes: the method, whether it is rule-based, procedural or generative, whether it runs at show time or only in production, and which material it uses, such as a performer's recordings or a collaborator's work. A specification that lists none is shown as using none.
- Before the gate decision, each listed use is checked against the project's policy record (story-provenance-and-policy-record-terms), including cultural protocols. A use that breaks a term blocks the specification, and the person who asked and the gate's approver are told which term blocks it. Where a collaborator recorded no AI term, the project's choice applies (story-provenance-and-policy-no-term-choice); under internal drafts only, the specification may run only in rehearsal or on a private stream only the crew can see. Each use of a named performer's data or recordings is also checked against that performer's confirmed agreement (story-session-recording-check-agreement). Only a person who holds the contracts and licence terms approval can override, by recording a new or changed term (story-provenance-and-policy-block-generation). An agent cannot.
- In the first release, a specification that lists a generative model at show time is blocked, and told so in plain words. Generative work in production, such as making a behaviour's animations, goes through the policy gate as any generation does (story-provenance-and-policy-block-generation).
- Where a term needs Robin's sign-off, the specification waits for Robin on the limited page (story-provenance-and-policy-collaborator-sign-off). Robin sees the plain-words specification and the term it relates to, and nothing else in the project.
- When a term changes or reaches its end date, accepted specifications are checked again. One that no longer passes is flagged, cannot start a new show, and a show running it alerts a person at the show in text and with a sound, who decides (story-provenance-and-policy-record-terms).
- Each check, block and override is in the activity log. The story is tested with a proxy policy record holding terms that allow, block and need sign-off, against proxy specifications.
