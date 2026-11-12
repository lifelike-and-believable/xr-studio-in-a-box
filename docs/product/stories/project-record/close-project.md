---
id: story-project-record-close-project
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - persona-producer#goals: d1cc47b03be9
---

# Close a project

As Jordan, the producer, I want to close a finished project in one step, ending access and keeping its records read-only, so that I keep the records each funder, tax rule and contract requires after the work is done.

## Acceptance criteria

- The project's owner (story-project-record-start-project), or a person whose role allows it such as Jordan, can close a project from the dashboard. Before closing, they see in plain words what is still open, such as drafts waiting at a gate, unconfirmed calls, unpaid invoices and records with "period pending" (story-contracts-and-payment-keep-records), and confirm. An agent cannot close or reopen a project.
- Closing takes a final backup (story-project-record-back-up-and-restore) and completes only once that backup has succeeded. If it fails, the project stays open and the person is told why in text.
- Closing ends every agent grant on the project (story-agent-work-agent-permissions) and every person's access in one step, except the owner, the holder of the contracts and licence terms approval (story-project-record-name-approvers), the holder of the audience-facing safety and consent approval with read-only access while incident or consent records remain (story-guest-care-record-an-incident), and anyone the person closing chooses to keep with read-only access. Spend on metered work stops (story-agent-work-spend-limit). Each person who loses access, and each grant ended, is listed in the activity log.
- A closed project is read-only and says so in text. Its business records stay under their retention rules and are listed as due when their periods end, and only the holder of the contracts and licence terms approval deletes them (story-contracts-and-payment-keep-records). Closing deletes any guest data a guest opted in to keep that has no business-record rule (story-guest-care-guest-data), and logs the deletion without the data. A guest's identity held in a consent or incident record stays under its retention rule.
- The owner can reopen a closed project. Reopening is logged with who and when, and gives back no access or agent grant: each must be given again.
- The story is tested with a sample project that has three people, two agent grants and one record with a known retention period: the project is closed, the people and agents are checked to be refused, the final backup is checked to have succeeded, an edit is checked to be refused, and the retained record is checked to stay listed with its rule and date.
