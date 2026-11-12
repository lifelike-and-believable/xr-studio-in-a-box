---
id: design-people-and-roles
status: draft
derived-from:
  - story-project-record-add-person#acceptance-criteria: 8f5b1df665e2
  - story-project-record-same-project-state#acceptance-criteria: 66eece7e589c
  - persona-producer#goals: d1cc47b03be9
  - persona-artist#goals: 0767918db571
  - decision-identity-and-roles#decision: 402e397cf1b0
---

# People and roles design

Adding people to a project, giving them one or more roles, changing and removing roles, and what each person sees. The eleven roles and what each may do are defined by story-project-record-add-person; this design sets their plain-words descriptions.

## Personas

- persona-producer: Jordan brings new people onto a production quickly and gives them the right role without technical help (goals). One form takes a name, an email address and roles; the person gets an invitation link that lasts 7 days, and Jordan can send it again.
- persona-artist: Riley sees the project and who is on it, and only what Riley's roles allow (story-project-record-add-person). Riley is not shown controls they cannot use, and each page says who can make changes.
- persona-performer and persona-collaborator: Kai and Robin do not use the dashboard. Adding them sends no dashboard sign-in, and the form tells Jordan so before adding them.

## Flow

1. On a project's **People** tab, the person sees everyone on the project, with their roles in a fixed order (the order of the role list), an **Owner** tag beside the owner's name, and a sign-in status: **Signed in**, **Invited, not signed in yet** or **No dashboard access**.
2. A person with the Director or Producer role chooses **Add a person**.
3. They type a **Name (optional)** and an **Email address**, and tick one or more **Roles**. Each role shows what it is for and what it gives in the dashboard today, before anything is chosen.
4. As roles are ticked, **Before you add <name>** sums up what the person will and will not be able to do, and whether they get an invitation email.
5. They choose **Add person** (disabled while the request is in progress). The **People** list opens with a notice; focus moves to it.
   - With at least one role that opens the dashboard: "Riley Chen added as Artist and Sound designer. We have emailed riley@example.com an invitation link that lasts 7 days." (approver's decision, 2026-11-12).
   - With only roles that do not open the dashboard (venue attendant, performer, collaborator): no email and no dashboard account; the notice says they will get links to their own pages later (approver's decision, 2026-11-12).
   - If the address already has an XR Studio account from another project: no invitation link; they get an email saying they were added, with a link to the project, and their status is **Signed in**.
6. Beside someone who has not signed in yet, **Send the sign-in link again** sends a new invitation link that lasts 7 days and shows a notice to the person who sent it (approver's decision, 2026-11-12).
7. **Change roles or remove** beside a person opens their roles, with **Save roles**. A change applies the next time that person does anything, with no sign-out needed. A notice confirms the change.
8. When a person changes their own roles, **Before you save** says what they will lose before they save.
9. **Remove <name> from the project** opens a confirmation. The person loses access at their next action; their past work stays on the project. A notice confirms the removal.
10. Someone without the Director or Producer role sees the list without **Add a person** or the actions, and a line naming who can make changes.

## Role descriptions

These are the texts shown under each role in the form: what the role is for, then "In the dashboard today:" and what slice 1 gives it. Later slices extend the second part as they add permissions (the permission table lives in `contracts/`). Roles are always listed in this order.

| Role | What it is for | In the dashboard today |
|---|---|---|
| Director | Leads the creative work. | sees the whole project, adds and removes people, and edits the project name and brief. |
| Producer | Runs the production. | sees the whole project, adds and removes people, and edits the project name and brief. |
| Technical artist | Builds and checks the pipeline. | sees the project and who is on it. Pipeline tools come in later releases. |
| Artist | Makes characters, environments and effects. | sees the project and who is on it. Tools for making work come in later releases. |
| Sound designer | Makes the sound and music. | sees the project and who is on it. Sound tools come in later releases. |
| Interaction designer | Designs how guests take part. | sees the project and who is on it. Design tools come in later releases. |
| Capture crew | Sets up and runs capture suits and sensors. | sees the project and who is on it. Capture tools come in later releases. |
| Show operator | Runs the show. | sees the project and who is on it. Show tools come in later releases. |
| Venue attendant | Looks after guests at a venue. | nothing; no dashboard sign-in. They get show-time tools in a later release. |
| Performer | Performs live. | nothing; no dashboard sign-in. They get a link to their own agreement page when there is something to confirm. |
| Collaborator | Contributes work under agreed terms. | nothing; no dashboard sign-in. They get a link to a limited page for their own items when there is something to sign off. |

Above the list: "Choose one or more, listed in this order everywhere. A person can see and do what any of their roles allows. No role gives an approval: approvers are named separately." (story-project-record-name-approvers).

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| People, can manage people | ![People list](people-and-roles/people-list.png) | Phone: ![People list at 320px](people-and-roles/people-list-phone.png) |
| People, as Riley, who cannot manage people | ![People list, read only](people-and-roles/people-list-read-only.png) | Names who can make changes. |
| People, after Send the sign-in link again | ![Link sent again](people-and-roles/people-list-link-resent.png) | Focus on the notice. |
| People, after removing a person | ![Person removed](people-and-roles/people-list-removed.png) | Focus on the notice. |
| Add a person, nothing chosen | ![Add a person](people-and-roles/add-person.png) | The summary region is present and empty. |
| Add a person, roles chosen, summary shown | ![Add a person with summary](people-and-roles/add-person-filled.png) | Phone: ![Add a person at 320px](people-and-roles/add-person-filled-phone.png) |
| Add a person, only roles without dashboard access | ![Add a person, no dashboard](people-and-roles/add-person-no-dashboard.png) | No invitation email. |
| Add a person, email not valid and no role chosen | ![Add a person with errors](people-and-roles/add-person-errors.png) | Phone: ![Errors at 320px](people-and-roles/add-person-errors-phone.png). Values kept. |
| Add a person, already on this project | ![Already on the project](people-and-roles/add-person-duplicate.png) | Links to their roles. |
| Person added | ![Person added](people-and-roles/person-added.png) | Focus on the notice. |
| Person added, email could not be sent | ![Email not sent](people-and-roles/person-added-mail-failed.png) | |
| Change roles | ![Change roles](people-and-roles/change-roles.png) | |
| Your own roles, keeping a managing role | ![Change your roles](people-and-roles/change-roles-self.png) | |
| Your own roles, losing your managing role | ![Change your roles, losing management](people-and-roles/change-roles-self-lose.png) | |
| Your own roles, as the last person who can manage people | ![Last manager](people-and-roles/last-manager.png) | The reason is shown beside Director and Producer before saving; no remove action. |
| Remove a person, confirmation | ![Confirm removal](people-and-roles/remove-confirm.png) | Phone: ![Confirm removal at 320px](people-and-roles/remove-confirm-phone.png) |
| Signed in, but no role opens the dashboard | ![No dashboard access](people-and-roles/no-dashboard-access.png) | Only for someone with an account from an earlier role. |
| Access removed while using the project | ![Access removed](people-and-roles/access-removed.png) | |

## Layout

- The **People** tab sits beside **Overview** on the project page. **Add a person** is above the list.
- The list is a table on wide screens (Person, Roles, Status, actions). At 320 pixels each person becomes a block, with "Roles:" and "Status:" written before each value.
- Roles are a list of checkboxes, one per line, with the description under each name.
- Control names: **People**, **Add a person**, **Name**, **Email address**, **Roles**, **Add person**, **Cancel**, **Change roles or remove**, **Send the sign-in link again**, **Save roles**, **Remove <name> from the project**, **Keep <name>**, **Remove <name>**.

## States and errors

- **Malformed or missing email:** "Enter an email address, like name@example.com."
- **No role chosen:** "Choose at least one role."
- **Email already on the project:** "Riley Chen is already on this project. Use Change roles or remove for Riley Chen to change what they can do." with a link to their roles.
- **Name left empty:** allowed; the email address is shown in its place.
- **Removing the last Director or Producer:** refused (approver's decision, 2026-11-12). Before saving, the form shows beside Director and Producer: "You are the only person on this project who can add people and change roles, so this role stays until you give someone else the Director or Producer role." The remove action is replaced by a line saying why. If a request still arrives, it is refused with the same text in an error summary.
- **Changing your own roles:** **Before you save** says whether you keep the ability to add people and change roles, and who else has it.
- **Saving no roles at all:** treated as removal, with the same confirmation.
- **Roles changed while the person is using the project:** their next action uses the new roles. If they lost all access, they see "You no longer have access to this project".
- **Invitation email could not be sent:** the person is added, and a warning notice tells Jordan to check the address and use **Send the sign-in link again**. To change a wrong address, Jordan removes the person and adds them again.
- **Send the sign-in link again within a minute:** the notice says "You can send another in a minute" and no second email goes.
- **Only roles without dashboard access:** no account and no email. Someone who has an account from an earlier role but now has only such roles sees "Nothing in the dashboard for you yet", their roles, and who added them, with **Sign out**.
- **Values on error:** everything typed and ticked is kept.
- **Agents:** there is no agent path to these screens or commands; an agent session asking to add a person or change a role is refused by the command layer.

## How it works

- **How does the system know?** People, their roles and their sign-in status come from the record's role assignments and accounts, read on each request. "Invited, not signed in yet" means an account exists for the address but has never signed in. "Signed in" means it has. "No dashboard access" means every role the person has on this project has no dashboard access. The owner is stored with the project, separately from sign-in status.
- **What enforces each promise?**
  - "Sees only what their role needs": every page and API call reads the person's roles on the server and checks the permission table (`contracts/`); controls a person cannot use are not rendered, and the matching API call returns 403. A test signs in with each role.
  - "The change takes effect the next time that person acts": sessions hold identity only; roles are read on every request (decision-identity-and-roles). A test changes a role between two requests in one session.
  - "No dashboard account for roles without dashboard access": the add-person command creates an account only when at least one chosen role opens the dashboard. A test adds a performer and checks no account and no email.
  - "An invitation lasts 7 days; a sign-in link 15 minutes": separate expiries on the two kinds of link. Tests.
  - "An agent cannot add a person or give, change or remove a role": the command layer refuses these commands from an agent session. A test.
  - "Never one of the four protected approvals": the permission table has no approval permissions. A test of the table.
  - "At least one person can manage people": the command layer refuses a change that would leave none. A test.
- **What is published together?** Not applicable.

## Accessibility

- Each role checkbox is tied to its description (and any note) with `aria-describedby`, so a screen reader reads them with the role name. The group is a `fieldset` with a short `legend` ("Roles"); the hint under it is tied with `aria-describedby`.
- **Before you add <name>** and **Before you save** are polite live regions present, empty, from page load, so changes are read out without moving focus.
- Notices after an action take focus when the page loads, and the page title starts with the outcome.
- The confirmation is a modal dialog. Focus starts on its heading; **Keep <name>** comes first; Escape closes it as **Keep <name>**; focus returns to **Remove <name> from the project** when it closes.
- Actions in the table name the person in visually hidden text ("Change roles or remove Riley Chen").
- Errors use text and a thicker border, not colour alone. Targets are at least 44 by 44 pixels (checkboxes 24 pixels with their label as the larger target). No horizontal scrolling at 320 pixels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations.

## Open items

- Changing a person's email address without removing and adding them again, in a later slice.
- The email texts themselves (invitation, added to a project) are written with the user documentation.
