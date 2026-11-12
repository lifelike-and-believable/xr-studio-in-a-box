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

- persona-producer: Jordan brings new people onto a production quickly and gives them the right role without technical help (goals). One form takes a name, an email address and roles; the person gets a sign-in link.
- persona-artist: Riley sees the project and who is on it, and only what Riley's roles allow (story-project-record-add-person). Riley is not shown controls they cannot use.
- persona-performer and persona-collaborator: Kai and Robin do not use the dashboard. If they open it, they get a plain page that says so and who to contact.

## Flow

1. On a project's **People** tab, the person sees everyone on the project, with their roles and a status: **Owner**, **Signed in**, **Invited, not signed in yet** or **No dashboard access**.
2. A person with the Director or Producer role chooses **Add a person**.
3. They type a **Name** and an **Email address**, and tick one or more **Roles**. Each role's plain-words description is shown under its name, before anything is chosen.
4. As roles are ticked, **Before you add <name>** sums up what the person will and will not be able to do.
5. They choose **Add person**. The list shows the person, and a notice says a sign-in link has been emailed.
6. **Change roles** beside a person opens their roles, with **Save roles**. A change applies the next time that person does anything, with no sign-out needed.
7. **Remove <name> from the project** asks for confirmation. The person loses access at their next action; their past work stays on the project.
8. Someone without the Director or Producer role sees the list without **Add a person** or **Change roles**, and a line saying who can make changes.

## Role descriptions

These are the texts shown under each role in the form. They describe slice 1's permissions; later slices extend them as those slices add permissions (the permission table lives in `contracts/`).

| Role | Description shown |
|---|---|
| Director | Leads the creative work. Sees the whole project, adds and removes people, and changes the project name and brief. |
| Producer | Runs the production. Sees the whole project, adds and removes people, and changes the project name and brief. |
| Technical artist | Builds and checks the pipeline. Sees the project and who is on it. |
| Artist | Makes characters, environments and effects. Sees the project and who is on it. |
| Sound designer | Makes the sound and music. Sees the project and who is on it. |
| Interaction designer | Designs how guests take part. Sees the project and who is on it. |
| Capture crew | Sets up and runs capture suits and sensors. Sees the project and who is on it. |
| Show operator | Runs the show. Sees the project and who is on it. |
| Venue attendant | Looks after guests at a venue. Uses the show-time tools only, not the dashboard. |
| Performer | Performs live. Uses their own agreement page only, not the dashboard. |
| Collaborator | Contributes work under agreed terms. Uses a limited page for their own items only, not the dashboard. |

Above the list: "Choose one or more. A person can see and do what any of their roles allows. No role gives an approval: approvers are named separately." (story-project-record-name-approvers).

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| People, can manage people | ![People list](people-and-roles/people-list.png) | Phone: ![People list at 320px](people-and-roles/people-list-phone.png) |
| People, cannot manage people | ![People list, read only](people-and-roles/people-list-read-only.png) | |
| Add a person, nothing chosen | ![Add a person](people-and-roles/add-person.png) | |
| Add a person, roles chosen, summary shown | ![Add a person with summary](people-and-roles/add-person-filled.png) | Phone: ![Add a person at 320px](people-and-roles/add-person-filled-phone.png) |
| Add a person, email and roles missing | ![Add a person with errors](people-and-roles/add-person-errors.png) | |
| Person added | ![Person added](people-and-roles/person-added.png) | |
| Change roles | ![Change roles](people-and-roles/change-roles.png) | |
| Remove a person, confirmation | ![Confirm removal](people-and-roles/remove-confirm.png) | |
| Last person who can manage people | ![Last manager](people-and-roles/last-manager.png) | |
| Signed in, but no role opens the dashboard | ![No dashboard access](people-and-roles/no-dashboard-access.png) | |
| Access removed while using the project | ![Access removed](people-and-roles/access-removed.png) | |

## Layout

- The **People** tab sits beside **Overview** on the project page. **Add a person** is above the list.
- The list is a table on wide screens (Person, Roles, Status, actions). At 320 pixels each person becomes a block, with "Roles:" and "Status:" written before each value.
- Roles are a list of checkboxes, one per line, with the description under each name.
- Control names: **People**, **Add a person**, **Name**, **Email address**, **Roles**, **Add person**, **Cancel**, **Change roles**, **Save roles**, **Remove <name> from the project**, **Remove <name>**, **Keep <name>**.

## States and errors

- **Missing email:** "Enter the person's email address."
- **No role chosen:** "Choose at least one role."
- **Email already on the project:** "Riley Chen is already on this project. Use Change roles to change what they can do." with a link to their roles.
- **Removing the last Director or Producer:** refused: "Jordan Lee is the only person on this project who can add people and change roles. Give another person the Director or Producer role first." The same applies to unticking the last such role.
- **Saving no roles at all:** treated as removal, with the same confirmation.
- **Roles changed while the person is using the project:** their next action uses the new roles. If they lost all access, they see "You no longer have access to this project".
- **Only roles without dashboard access:** after signing in, the person sees "Your roles do not use the dashboard", their roles, and who added them, with **Sign out**.
- **Agents:** there is no agent path to these screens or commands; an agent session asking to add a person or change a role is refused by the command layer.

## How it works

- **How does the system know?** People, their roles and their status come from the record's role assignments and accounts, read on each request. "Invited, not signed in yet" means an account exists for the address but has never signed in. "Signed in" means it has.
- **What enforces each promise?**
  - "Sees only what their role needs": every page and API call reads the person's roles on the server and checks the permission table (`contracts/`); controls a person cannot use are not rendered, and the matching API call returns 403. A test signs in with each role.
  - "The change takes effect the next time that person acts": sessions hold identity only; roles are read on every request (decision-identity-and-roles). A test changes a role between two requests in one session.
  - "An agent cannot add a person or give, change or remove a role": the command layer refuses these commands from an agent session. A test.
  - "Never one of the four protected approvals": the permission table has no approval permissions. A test of the table.
  - "At least one person can manage people": the command layer refuses a change that would leave none. A test.
- **What is published together?** Not applicable.

## Accessibility

- Each role checkbox is tied to its description with `aria-describedby`, so a screen reader reads the description with the role name. The group is a `fieldset` with a `legend`.
- The summary **Before you add <name>** is a polite live region, so it is read as roles change without moving focus.
- The confirmation is a modal dialog with a heading; focus moves into it and returns to **Remove <name> from the project** when it closes; Escape closes it as **Keep <name>**.
- Actions in the table name the person in hidden text ("Change roles for Riley Chen").
- Errors use text and a thicker border, not colour alone. Targets are at least 44 by 44 pixels (checkboxes 24 pixels with their label as the larger target). No horizontal scrolling at 320 pixels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations.
