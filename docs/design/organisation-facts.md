---
id: design-organisation-facts
status: approved
derived-from:
  - story-project-record-set-up-organisation#acceptance-criteria: eb7a4e1f7ca0
  - story-project-record-record-facts#acceptance-criteria: 1b82a3da6d7d
  - persona-producer#goals: d1cc47b03be9
  - persona-producer#frustrations: a9b85718690b
  - decision-project-record-model#decision: cd1dfeb7a4dd
  - decision-protected-store#decision: 1c1b55830ba3
---

# Organisation facts design

The company's own facts, recorded once in its organisation and read by every project in it, so that the bio, history and funder details are never typed again (story-project-record-set-up-organisation). Slice 2 fills the **Organisation facts** section of the organisation page, which slice 1 left empty. Agent drafts of organisation facts arrive in slice 7; drafts that read these facts, and the flags on drafts when a fact changes, arrive with the funding stories.

## Personas

- persona-producer: Jordan enters the legal name, bio, history, an applicant profile for each funder and standard work samples once (goals), and every project's facts page reads them, so descriptions stop drifting between applications (frustrations).
- persona-director: on a solo production, Morgan looks after the organisation and does the same.
- persona-artist: Riley, on one of the organisation's projects, reads the general organisation facts but not the funder profiles.

## Flow

1. On an organisation page, **Organisation facts** lists, in this order: **Legal name**, **Bio**, **History**, **Funder applicant profiles** and **Standard work samples**. Each shows its value and "Last changed by <name>, <date and time>", with **Edit** and **History** for people who look after the organisation.
2. A line under the heading says that bank details and tax numbers are not organisation facts: they belong in the protected store, which comes in a later release (story-contracts-and-payment-protect-sensitive-data).
3. **Edit** opens one fact on its own page, as for project facts (design-project-facts). On save the organisation page opens with a notice: "Bio saved. Every project in <organisation> now reads the new bio. Drafts that used the old bio will be flagged once drafting arrives in a later release."
4. **Funder applicant profiles** lists one profile per funder on the program list. Until the program list story arrives, the list is the four funders the business requirements name: Canada Council for the Arts, Canada Media Fund, Creative BC and Epic MegaGrants. Each opens a short form: **Applicant name as registered with the funder**, **Applicant category**, **Funder's applicant profile number (optional)** and **Mandate**, with **Save profile**.
5. **Standard work samples** opens a list of files with a title, who added each and when, **Remove**, and **Add a work sample** (title and file). Text in documents is checked against the identifier formats when the upload is registered (design-identifier-filter).
6. Every project in the organisation shows the legal name and bio under **From <organisation>** on its Facts tab (design-project-facts).
7. History, compare and restore work as for project facts.

## Who sees and edits which organisation facts

| Fact | Who sees it | Who edits it |
|---|---|---|
| Legal name, Bio, History, Standard work samples | People who look after the organisation, and every dashboard role on its projects | People who look after the organisation |
| Funder applicant profiles | People who look after the organisation, and the Director and Producer on its projects | People who look after the organisation |

"A person the organisation names for it" (story-project-record-set-up-organisation) is a person in **Looked after by** (design-organisations-and-projects).

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| Organisation facts, as Jordan (looks after it) | ![Organisation facts](organisation-facts/org-facts.png) | Phone: ![Organisation facts at 320px](organisation-facts/org-facts-phone.png) |
| Organisation facts, nothing recorded yet | ![No organisation facts yet](organisation-facts/org-facts-empty.png) | **Add** beside each. |
| Organisation facts, as Riley (on one of its projects) | ![Read only](organisation-facts/org-facts-read-only.png) | No **Edit**; funder profiles not shown. |
| After saving the bio | ![Bio saved](organisation-facts/org-fact-saved.png) | Focus on the notice. |
| Edit the bio | ![Edit bio](organisation-facts/edit-bio.png) | |
| Edit one funder applicant profile | ![Funder profile](organisation-facts/edit-funder-profile.png) | |
| Standard work samples | ![Work samples](organisation-facts/work-samples.png) | |

## Layout

- **Organisation facts** sits on the organisation page between **Looked after by** and **Projects**.
- Control names: **Organisation facts**, **Edit**, **Add**, **History**, **Save <fact>**, **Save profile**, **Cancel**, **Add a work sample**, **Add work sample**, **Remove**.
- Value types: Legal name is one line; Bio and History are text; a funder profile is the four fields above; a work sample is a title and one file (video, images, audio or PDF, up to 2 GB).

## States and errors

- **Nothing recorded yet:** "Not recorded yet." with **Add**. On a project's Facts tab: "<organisation> has no facts recorded yet. People who look after it add them on its page."
- **Applicant profile number:** optional. Its hint says it is the funder portal's own number, not a tax or business number; a value matching an identifier format is held (design-identifier-filter).
- **Work sample title missing:** "Enter a title for the work sample." **File missing:** "Choose a file to add." **File too large:** "The file is larger than 2 GB. Choose a smaller file."
- **Someone else saved while you were editing:** as for project facts.
- **Flags on drafts:** in slice 2 there are no drafts, so nothing is flagged. The saved notice says flagging arrives with drafting.
- **Agents:** none in slice 2. From slice 7, an agent's drafts of organisation facts are marked as drafts until a person who looks after the organisation accepts them.

## How it works

- **How does the system know?** Organisation facts are versioned working state held on the organisation (decision-project-record-model). Projects read them through the organisation each time, so a change is seen by every project at its next page load, with nothing copied.
- **What enforces each promise?**
  - "Entered once and read by every project": there is one stored value; project pages read it from the organisation. A test with an organisation holding two projects checks both read the same bio after one change.
  - "Only people who look after the organisation edit them": the command layer checks **Looked after by**. A test.
  - "People on a project see only the organisation facts their role allows": funder profiles have their own data class, checked per request. A test signs in as Riley.
  - "Bank details and tax numbers are not organisation facts": the identifier filter checks every save and upload (design-identifier-filter). A test with test identifiers.
- **What is published together?** Each fact is saved on its own.

## Accessibility

- As design-project-facts: one heading per fact, actions naming the fact in visually hidden text, notices that take focus, and page titles starting with the outcome.
- The work sample file field has a visible label and hint; the size limit is written in the hint, not only shown after an error.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations, and the phone frame has no horizontal scrolling.

## Open items

- The full funder program list: story-funding-program-list. Until then, the four named funders.
- Agent drafts of organisation facts: slice 7.
- Flags on drafts that used a changed fact: the funding stories.
