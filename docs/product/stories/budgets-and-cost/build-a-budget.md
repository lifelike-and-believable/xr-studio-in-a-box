---
id: story-budgets-and-cost-build-a-budget
status: approved
derived-from:
  - epic-budgets-and-cost#outcome: 5b1afee150ed
  - persona-director#goals: a92ca172be83
---

# Build a budget per project and funder format

As Morgan, the director, I want to build a project's budget once and see it in each funder's format so that I spend less personal time writing budgets by hand.

## Acceptance criteria

- The project's budget is the budget in its facts (story-project-record-record-facts). It is a list of budget lines, each with a category, an amount and a note, in one currency that the producer sets. Lines for metered cost (generation, cloud and per-show running costs) are marked as metered. This story defines the budget and a budget line. Other stories refer to them by this story's id. It is not the budget file for a device target (story-asset-checks-check-against-budget).
- An agent can draft budget lines from the brief and the plan. Its lines are marked as drafts until a person whose role allows it, such as Morgan, accepts them. Only people whose role covers the budget see it (story-project-record-add-person).
- Morgan can see the budget in the format of any program on the program list (story-funding-program-list). Each funder line is built from the project's budget lines, mapped to the funder's categories, with no figure retyped. A change to a budget line shows in every funder format at once. A budget line the mapping does not place is listed in plain words for Morgan to place.
- The version sent with an application or report is kept unchanged (story-review-and-status-feedback-and-versions), and Morgan can compare it with the current budget.
- The budget does not change the project's spend limit (story-agent-work-spend-limit), which a person with the right role sets on its own.
- Before the story is accepted, Jordan chooses a past budget as the worked example for the success measure, and records it with the time it took to prepare. The test builds a budget from the same facts and shows it in the same funder's format, and records the time from the start to an accepted budget in that format, with the review time, against the worked example.
