---
id: story-funding-match-programs
status: approved
derived-from:
  - epic-funding#outcome: 1d1f64414639
  - persona-director#goals: a92ca172be83
---

# Match a project to programs it may qualify for

As Morgan, the director, I want an agent to match my project's facts against the program list so that I spend less personal time finding funding programs, which I do today by hand.

## Acceptance criteria

- Morgan can ask an agent, in chat or the dashboard, to match a project against the program list (story-funding-program-list). The agent reads only the project facts (story-project-record-record-facts) and the program list.
- For each program, Morgan sees each eligibility rule marked as met, not met or unknown, in text, with the project fact the agent used for it, and the program's next deadline. An unknown rule names the fact that is missing.
- Programs whose rules are out of date (story-funding-program-list) are listed separately, marked as out of date in text, and are not matched until they are rechecked.
- The match is a draft. Morgan, or a person whose role allows it, chooses which programs the project pursues, and the choice is recorded with who made it and when. An agent cannot choose.
- The match is shown only to people whose role covers funding (story-project-record-add-person), and says that eligibility is decided by the funder.
- The story is tested with a sample project and the four first funders' programs, where Jordan has checked by hand which rules each program's documents set.
