---
id: story-guest-care-record-an-incident
status: approved
derived-from:
  - epic-guest-care#outcome: 96cd04bf3a39
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Record an incident

As Jamie, the audience member, I want an injury, near miss or complaint at a show recorded with what was done about it, holding only what I agree to about me, so that I feel safe and know what is captured about me.

## Acceptance criteria

- An incident is an injury, a near miss or a guest's complaint at a session, in the venue or online. A person whose role allows it, such as Taylor or Alex, records it from the dashboard: what happened, when it happened (not only when it was entered), the session, who was involved, first aid or other actions taken and the follow-up. It can link to the session's stop log (story-show-safety-emergency-stop). This story defines an incident record. Other stories refer to it by this story's id. An agent cannot read, draft or change an incident record.
- A guest's name and contact details are recorded only as the guest agrees, and the record says in text what the guest agreed to. Without that agreement, the guest is described without identifying them, such as by seat or time of joining.
- Incident records are visible only to the holder of the audience-facing safety and consent approval (story-project-record-name-approvers) and the staff that holder names. A person who records an incident and is not named sees it only until they save it. Each opening of a record is logged with who and when.
- An incident record is a business record kept under story-contracts-and-payment-keep-records. A guest's request to delete their data (story-guest-care-guest-data) removes their identity from it, unless a recorded retention rule requires keeping it, and then it is kept only until that rule's period ends. The guest is told which applies. A removed identity does not come back on restore (story-project-record-back-up-and-restore).
- What an incident record must hold, and how long it is kept, are pending legal review. Each record says so in text until the holder records that the review is done for the show's region. This is not legal advice.
- The story is tested with simulated incidents: an injury with a guest who agrees to be named, and a complaint from a guest who does not. Each is checked to be visible only to the holder and named staff, an agent is checked to be refused, and a deletion request is checked to remove the identity where no rule requires keeping it.
