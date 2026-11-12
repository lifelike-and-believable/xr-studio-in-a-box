---
id: story-funding-program-list
status: approved
derived-from:
  - epic-funding#outcome: 1d1f64414639
  - persona-producer#goals: d1cc47b03be9
---

# Keep a list of funding programs and their deadlines

As Jordan, the producer, I want to keep a list of funding programs with their rules, formats and deadlines, checked against each funder's current documents, so that applications and reports are drafted from one record and I can check them before I send them.

## Acceptance criteria

- The organisation keeps one program list, used by all its projects. Each program records its funder, its eligibility rules, its format (sections, word limits, budget categories and attachments), its intake dates and its deadlines for applications, reports and claims, with the funder's source document and its date. The first funders are Canada Media Fund, Creative BC, Epic MegaGrants and the Canada Council for the Arts. This story defines a program, its rules and the rule check. Other stories refer to them by this story's id.
- A person whose role allows it (story-project-record-add-person), such as Jordan, adds and edits programs. An agent can draft a program, or changes to one, from a funder document a person points it at, and its draft is marked as a draft until that person accepts it.
- A program's rules are checked when the program opens a new intake, and again within 7 days before any application, report or claim to it is submitted. A person whose role allows it confirms each check and its date against the funder's current documents, and the check is recorded with who confirmed it. An agent can compare the list with the funder's documents and list differences, but cannot confirm a check.
- A program's rules are out of date when its recorded next intake has opened since the last confirmed check, or when a submission is due within 7 days and the last check is older than 7 days. While they are out of date, the program says so in text, and no draft for it can be started or continued (story-funding-draft-application, story-funding-reports-and-claims) until the rules are rechecked.
- Jordan sees each project's funder deadlines in date order with the days left, in text. Jordan is told a lead time before each deadline and each new intake, by the channel Jordan chooses (story-review-and-status-notifications). Jordan sets the lead time.
- The program list is not legal or financial advice. Each program shows that eligibility is decided by the funder.
