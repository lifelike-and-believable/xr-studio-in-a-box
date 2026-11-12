---
id: decision-notifications
status: approved
derived-from:
  - epic-review-and-status#outcome: adfddef70e61
  - persona-artist#goals: 0767918db571
  - persona-director#goals: a92ca172be83
---

# Decision: notifications come from record events through an outbox, sent by email and shown as a dashboard badge

## Context

story-review-and-status-notifications asks for email, a dashboard badge, or both. Email is a daily digest by default, or one email per item, and a blocking item alerts straight away. Each notification has a short summary and a link. Notifications also carry other traffic:

- Robin's emails and one-time codes (story-provenance-and-policy-collaborator-sign-off).
- Reminders to the person who asked.
- Plain-words messages, such as "no spend limit set".

Identifiers never appear in a notification (decision-protected-store). Riley needs to know what is waiting without checking all day. Morgan's reviews come in bursts.

## Options

| Option | For | Against |
|---|---|---|
| A. The record writes notification rows to an outbox in the same transaction as the event. Immediate items are sent right after the transaction commits; a scheduled job sends digests and retries through a transactional email provider behind an adapter. The badge is a count from the review queue query. | Nothing is sent for a change that rolled back. Digests and grouping are simple queries. Swapping the provider is an adapter change. | We write the digest and retry logic. |
| B. A notification service (Knock, Novu or Courier) | Preferences, digests and channels come built in. | Another vendor sees item summaries and people's contacts. Its digest rules may not match "blocking sends at once". |
| C. Send email inline when each event happens | Least code. | Cannot group items. A slow provider slows the request. Sends survive a rolled-back change. |

## Decision

Option A.

- Email holds a summary and a link only. The link needs a sign-in, or the limited-page token for a collaborator.
- Each send and each failure is logged.
- Other channels (chat apps, text messages) are added later as adapters.
- Immediate items (one-time codes, blocking alerts, one email per item) are sent right after the transaction commits, for example with Next.js `after()` `[assumed]`, so a code arrives before it expires. They are still written to the outbox first, so a failed send is retried.
- Digests and retries run on a scheduled job, for example Vercel Cron `[assumed]`, at a time each person sets. The plan's minimum cron interval sets how often retries run, not how fast immediate items go out.

## Consequences

- Cheap to change: the provider and the schedule. Moderately hard to change: the outbox rows that other stories add events to.
- Email deliverability (a sending domain and its records) has to be set up before the first collaborator email. That is a one-off task for a person.
- Revisit if the first touring production needs text-message alerts at venues.
