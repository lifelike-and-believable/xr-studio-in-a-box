---
id: design-organisations-and-projects
status: draft
derived-from:
  - story-project-record-set-up-organisation#acceptance-criteria: eb7a4e1f7ca0
  - story-project-record-start-project#acceptance-criteria: 83fa11a80149
  - persona-director#goals: a92ca172be83
  - persona-producer#frustrations: a9b85718690b
  - decision-navigation-and-urls#decision: 711d0820b18c
---

# Organisations and projects design

Slice 1 covers creating an organisation, starting a project in one, and seeing both. Organisation facts and project facts arrive in slice 2; their sections show an empty state until then.

## Personas

- persona-director: Morgan wants one place to take a brief towards a show (goals). **Start a project** asks only for a name, a brief, an owner and an organisation, and Morgan's own name is already chosen as the owner.
- persona-director, solo production: with no organisation yet, Morgan is not stopped; a default organisation named after the project is made.
- persona-producer: the same project facts are retyped across documents today (frustrations). Every project shows which organisation it reads its company facts from, so the facts are entered once (story-project-record-set-up-organisation).

## Flow

1. From **Projects** or **Organisations**, the person chooses **Create an organisation**, types the **Organisation name** and chooses **Create organisation**. They look after it. It opens on its organisation page.
2. From **Projects**, or **Start a project in this organisation** on an organisation page, the person chooses **Start a project**.
3. They give a **Project name**, a **Brief**, an **Owner** (they are chosen already) and an **Organisation**. The organisation list shows only organisations they look after. If they look after none, the form says a new organisation named after the project will be made, which they will look after and can rename later.
4. They choose **Start project**. If the name or owner is missing, nothing is created; the error summary names each missing field and focus moves to it.
5. The project opens on its **Overview** with "Project started. You are its director and producer." The owner gets the Director and Producer roles (approver's decision, 2026-11-12).
6. The project appears on **Projects** with its organisation and the person's roles.
7. On an organisation page, the person who looks after it can **Rename organisation**.

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| Create an organisation | ![Create an organisation](organisations-and-projects/create-organisation.png) | |
| Create an organisation, name missing | ![Organisation name missing](organisations-and-projects/create-organisation-error.png) | |
| Start a project | ![Start a project](organisations-and-projects/start-project.png) | Phone: ![Start a project at 320px](organisations-and-projects/start-project-phone.png) |
| Start a project, name and owner missing | ![Start a project with errors](organisations-and-projects/start-project-errors.png) | |
| Start a project, no organisation to choose | ![Start a project, default organisation](organisations-and-projects/start-project-no-organisation.png) | |
| Project overview, just started | ![Project overview](organisations-and-projects/project-overview.png) | Facts section empty until slice 2. |
| Organisations | ![Organisations](organisations-and-projects/organisations.png) | |
| Organisation page | ![Organisation page](organisations-and-projects/organisation-page.png) | |

The project list (home) is in design-dashboard-shell.

## Layout

- Forms are one column, fields at most 480 pixels wide, with the label above each field and any hint below the label.
- The project page has a heading with the project name, the organisation as a link, and tabs: **Overview** and **People** in slice 1. Later slices add tabs to the same row.
- Control names: **Create an organisation**, **Organisation name**, **Create organisation**, **Cancel**, **Start a project**, **Project name**, **Brief**, **Owner**, **Organisation**, **Start project**, **Edit name and brief**, **Rename organisation**, **Start a project in this organisation**, **Overview**, **People**.
- **Edit name and brief** and **Rename organisation** open the same form as creating, filled in, with **Save changes**; they are shown only to people allowed to use them.

## States and errors

- **Missing project name:** "Enter the project name."
- **Missing owner:** "Choose who owns the project."
- **Missing organisation name:** "Enter the organisation name."
- **Brief left empty:** allowed; the overview says "No brief yet."
- **No organisation to choose:** the hint replaces the list, as above. The default organisation is named "<project name>" and the person looks after it.
- **Owner list:** the person starting the project, and people already on the organisation's other projects. Owners from outside are added afterwards as people (design-people-and-roles) and given the roles; ownership can be handed on in a later slice.
- **Not allowed:** a person who does not look after an organisation does not see it in the **Organisation** list, and **Rename organisation** is not shown. A direct address shows the "not available" page (decision-navigation-and-urls).
- **Empty facts:** "No project facts yet." and "No organisation facts yet." until slice 2.
- **Success:** a status notice on the page that opens, announced to screen readers.

## How it works

- **How does the system know?** Organisations, projects and who looks after each come from the record. The roles shown are the person's role assignments, read on each request. The organisation a project belongs to is stored with the project; its facts are read from the organisation, not copied (story-project-record-start-project).
- **What enforces each promise?**
  - "A project cannot be created without a name and an owner": the command layer refuses the command, and the form shows the error; the API returns 400 naming the fields. A test sends the command with each field missing.
  - "An agent cannot create an organisation or move a project between organisations": the command layer refuses those commands from an agent session. A test.
  - "The owner is director and producer": the start-project command creates both role assignments in the same transaction. A test.
- **What is published together?** Not applicable.

## Accessibility

- On a failed submit, focus moves to the error summary (`role="alert"`), which links to each field; each field's message is tied to it with `aria-describedby` and the field is marked `aria-invalid`.
- The organisation hint for "no organisation" is plain text, not a disabled control.
- The project tabs are a `nav` labelled "Project", with links and `aria-current="page"` on the open tab.
- No horizontal scrolling at 320 pixels; targets at least 44 by 44 pixels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations.
