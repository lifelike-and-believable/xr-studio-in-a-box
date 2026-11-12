---
id: story-project-record-set-up-organisation
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - persona-producer#goals: d1cc47b03be9
---

# Set up an organisation and its facts

As Jordan, the producer, I want the company's own facts recorded once in its organisation and read by every project so that funding applications, budgets and credits are drafted from one record of facts and I never type the company bio again.

## Acceptance criteria

- Jordan, or the director on a solo production, can create an organisation (story-shared-library-save-to-library) from the dashboard with its name and the person who looks after it, with no code or configuration files. Each new project is placed in one organisation when it is started (story-project-record-start-project), and the project shows which. An agent cannot create an organisation or move a project between organisations.
- The organisation keeps its own facts: its legal name, a bio, its history of past shows and funding, an applicant profile for each funder on the program list (story-funding-program-list) and standard work samples. This story defines organisation facts. Other stories refer to them by this story's id. Bank details and tax numbers are not organisation facts: they stay in the protected store (story-contracts-and-payment-protect-sensitive-data).
- Every project in the organisation reads the organisation facts, alongside its own facts (story-project-record-record-facts), in drafts, matching and budgets, with no fact typed again. A draft shows when a figure or statement came from an organisation fact. A change to an organisation fact flags each draft that used it, in text, as a changed project fact is flagged (story-funding-draft-application).
- Jordan, or a person the organisation names for it, edits organisation facts, and each shows who last changed it and when. An agent can draft organisation facts from a document a person points it at, marked as drafts until that person accepts them. People on a project see only the organisation facts their role allows (story-project-record-add-person).
- The story is tested with an organisation holding two projects: a company bio and a funder applicant profile are entered once, both projects' drafts are checked to read them, a change to the bio is checked to flag the drafts that used it, and a person with a narrow role on one project is checked to see only what that role allows.
