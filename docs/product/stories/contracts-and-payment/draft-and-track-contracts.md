---
id: story-contracts-and-payment-draft-and-track-contracts
status: approved
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-collaborator#goals: 72c41c51284f
---

# Draft and track contracts, licences and AI-use terms

As Robin, a collaborator, I want my contracts, licences and AI-use terms drafted from the terms recorded for me, and tracked with a dated history, so that I can trust the terms I agreed hold, and change them when the project changes.

## Acceptance criteria

- An agent can draft a contract, a licence or a statement of AI-use terms from the project facts (story-project-record-record-facts) and the terms already recorded: a collaborator's terms in the policy record (story-provenance-and-policy-record-terms) and a performer's agreement (story-session-recording-record-agreement). The draft is marked as a draft. Until a lawyer the producer chooses has reviewed a template, every draft made from it is marked "template pending legal review". This is not legal advice.
- The contract record holds the document, its parties, its state (draft, waiting for review, sent, signed, changed or ended), its dates and its end date. It holds no second copy of the terms: each term in the document links to the term in the policy record or in the performer's agreement. Where a contract sets new or different terms, the holder of the contracts and licence terms approval (story-project-record-name-approvers) records them there first, as story-provenance-and-policy-record-terms or story-session-recording-change-agreement says. A contract whose document and linked terms disagree is flagged, says which term differs, and cannot be marked signed.
- Accepting, signing or changing a contract waits at the contracts and licence terms gate (story-review-and-status-hold-gated-hand-off), and only the holder of that approval decides it. Sending a draft to the other party, and recording the signed copy and its date, are done by a person. An agent can do neither (REQ-workflow-14).
- A change makes a new version with a dated history, and earlier versions can be compared and restored as drafts (story-review-and-status-feedback-and-versions). A term's end date set by a contract is the end date in the policy record, so the assets it covers are flagged as story-provenance-and-policy-record-terms says.
- Robin sees their own contracts and their history on the same limited page as their terms and sign-offs (story-provenance-and-policy-collaborator-sign-off), and nothing else in the project. A performer sees theirs on the limited page of story-session-recording-record-agreement.
- The story is tested with sample terms and a sample performer agreement: a contract is drafted, a linked term is then changed and the contract is checked to be flagged, and an agent is checked to be refused when it tries to send, accept or mark a contract signed.
