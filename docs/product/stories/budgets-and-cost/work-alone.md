---
id: story-budgets-and-cost-work-alone
status: approved
derived-from:
  - epic-budgets-and-cost#outcome: 5b1afee150ed
  - persona-director#goals: a92ca172be83
---

# Use the business tools alone, with no other software

As Morgan, the director, I want the business tools to work with no other software, with spreadsheet export and import to fill the gap, so that I can run a whole production alone when there is no team.

## Acceptance criteria

- The program list, matching, applications, reports and claims, tax-credit tracking, budgets, cost tracking and the cost and schedule view (stories in epic-funding and epic-budgets-and-cost) work from the web dashboard and chat with no third-party account or other software.
- Morgan can export the budget, the cost lines, the program list and an incentive's gathered spend as a spreadsheet file (CSV and .xlsx). An export holds only what the exporter's role can see, and never bank details or tax numbers unless the exporter's role allows it and they choose to include them. An agent can prepare an export, but only a person takes it out of the project.
- Morgan can import budget lines or cost lines from a spreadsheet file. Imported rows come in as drafts, with problems such as a missing amount or an unknown budget line listed in plain words, until Morgan accepts them. An import never overwrites an accepted line without Morgan confirming it, and each import is recorded with who made it and when.
- One person holding every role (story-project-record-name-approvers) can run the whole cycle, from program list to submitted claim, alone.
- The story is tested on a sample project with no third-party tool connected, including an export opened in a spreadsheet program and imported back with no change to any figure.
