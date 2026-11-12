---
id: design-identifier-filter
status: approved
derived-from:
  - story-contracts-and-payment-protect-sensitive-data#acceptance-criteria: 2b9128383b81
  - story-project-record-record-facts#acceptance-criteria: 1b82a3da6d7d
  - persona-producer#goals: d1cc47b03be9
  - persona-producer#context-of-use: 6e392d1314d8
  - decision-protected-store#decision: 1c1b55830ba3
  - decision-identifier-format-list#decision: 5289c2e8b81a
---

# Identifier filter design

What happens when someone types, pastes or uploads text that looks like a bank detail, tax number or other identifier into a place agents can read, and how Jordan keeps the list of identifier formats (story-contracts-and-payment-protect-sensitive-data). Slice 2 builds the filter for facts, organisation facts and work samples, with a starter list of formats. The same filter covers chat when chat arrives in slice 7. The protected store itself, where identifiers are kept, arrives with the contracts and payment stories; until then the advice is to keep identifiers out of XR Studio.

## Personas

- persona-producer: Jordan handles bank details and tax numbers, which agents must never see (context of use). Jordan is stopped before such a number lands in a fact, told in plain words why, and can still save text that only looks like one. Jordan keeps the list of formats for the company.

## Flow

### Text that matches a format

1. A person saves a fact. Before anything is saved, the command layer checks the text against every format turned on for the project's organisation.
2. If any part matches, nothing is saved. The edit page comes back with the text kept and an error summary that takes focus: "Not saved: this looks like a bank account number". It quotes the matching part, names the field and the format, says why (facts can be read by agents), and says what to do: take it out and save again, or confirm it is not that kind of number.
3. **It is not a bank account number** opens a confirmation page that shows the matching text and asks **What is it?** in a few words. **Confirm and save <fact>** saves the fact and records the confirmation in the project's activity with the person's name, the time, the format and their few words. The matching text itself is not copied into the log.
4. The Facts tab opens with a notice: "Description saved. Your confirmation that "00123-004-1234567" is not a bank account number is recorded in Activity."

### A document that matches

1. A person adds a work sample. When the upload is registered, the text of documents (PDF and text files) is checked.
2. If it matches, the file is not added. It is held for 24 hours, then deleted, unless confirmed. The page says which page of which file matched which format.
3. **It is not a GST/HST number, add the file** confirms as above and adds the file; **Upload a different file** starts again.

### The list of formats

1. On an organisation page, people who look after it have **Identifier formats**. The list applies to every project in the organisation.
2. Each format shows its name, what it matches with an example, whether checking is **On**, and its source (**Starter**, or who added it and when).
3. The starter list: **Bank account number (Canada)**, **Social Insurance Number**, **Business Number**, **GST/HST number** and **Payment card number** (decision-protected-store). Starter formats can be turned off and on but not removed.
4. **Add a format** takes a **Name** and a **Pattern**, written with # for any digit and A for any letter, other characters matching as typed. **Try it with an example** shows, as the person types, whether an example matches. A pattern needs at least 6 # or A.
5. **Turn off** asks for confirmation, because text of that kind will then be saved where agents can read it.
6. Every change to the list is recorded in the organisation's activity (design-activity-log).

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| A fact's text matches a format | ![Not saved](identifier-filter/fact-held.png) | Phone: ![Not saved at 320px](identifier-filter/fact-held-phone.png). Text kept; focus on the summary. |
| Confirm it is not an identifier | ![Confirm](identifier-filter/confirm-not-identifier.png) | Logged with who and when. |
| Saved after confirming | ![Saved after confirming](identifier-filter/confirmed-saved.png) | Focus on the notice. |
| A document's text matches a format | ![Document held](identifier-filter/document-held.png) | Held 24 hours, then deleted unless confirmed. |
| Identifier formats | ![Formats](identifier-filter/formats.png) | Phone: ![Formats at 320px](identifier-filter/formats-phone.png) |
| Add a format, with a test example | ![Add a format](identifier-filter/add-format.png) | The example result is a polite status message. |
| Add a format, pattern too short | ![Pattern too short](identifier-filter/add-format-error.png) | Values kept. |
| Turn off a starter format, confirmation | ![Turn off](identifier-filter/turn-off-confirm.png) | Dialog; **Keep it on** first. |
| After adding a format | ![Format added](identifier-filter/format-added.png) | Focus on the notice. |

## Layout

- **Identifier formats** is a link on the organisation page for people who look after it, under **Organisation facts**.
- Control names: **It is not a <format>**, **What is it?**, **Confirm and save <fact>**, **Go back and edit the text**, **It is not a <format>, add the file**, **Upload a different file**, **Identifier formats**, **Add a format**, **Name**, **Pattern**, **Try it with an example**, **Add format**, **Turn off**, **Turn on**, **Remove**, **Keep it on**.

## States and errors

- **Match in a fact:** summary heading "Not saved: this looks like a <format>"; field error "Take out "<text>", or confirm it is not a <format>."
- **Several matches:** each is listed in the summary, and confirming covers them all, each named in the log entry.
- **Match in a document:** "Not added: <file> looks like it has a <format>", naming the page.
- **Pattern too short:** "Use at least 6 # or A in the pattern. A shorter pattern would match ordinary numbers like dates and prices."
- **Name missing:** "Enter a name for the format." **Pattern missing:** "Enter a pattern, like ###-AA-#####."
- **A new or turned-on format:** checks from then on; text already saved is not changed. The notice says so.
- **Who cannot see the list:** anyone who does not look after the organisation gets the "This page is not available" page (design-dashboard-shell).
- **Agents:** an agent cannot confirm a match or change the list; the command layer refuses both.

## How it works

- **How does the system know?** The formats are stored on the organisation as versioned working state (decision-identifier-format-list). Each check reads the list for the organisation of the project being written to.
- **What enforces each promise?**
  - "Identifiers never reach anything an agent can read": every write to an agent-readable field passes through the command layer, which runs the check before writing (decision-project-record-model). There is no other write path. A test saves test identifiers in each field and uploads them in a document, then searches the facts, documents and log for them and finds none.
  - "The confirmation is logged with who and when": confirm-and-save is one command; it writes the fact version and the log entry in one transaction. A test.
  - "An agent cannot confirm": the command layer refuses the confirm command from an agent session. A test.
  - "Held documents are deleted after 24 hours": a scheduled job deletes held uploads that were not confirmed. A test with a shortened time.
- **What is published together?** Not applicable.

## Accessibility

- The error summary takes focus and links to the field. The matching text is marked with `mark` and a dashed outline, and named in words, so it is not shown by colour alone.
- **Try it with an example** reports its result in a polite status message.
- The turn-off confirmation is a modal dialog; focus starts on its heading and Escape is **Keep it on**.
- The formats table becomes one block per format at 320 pixels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations, and the phone frames have no horizontal scrolling.

## Open items

- The protected store and placeholders in drafts: the contracts and payment stories.
- Chat messages: checked by the same filter from slice 7.
- Other document types (images with text, spreadsheets): checked when a story needs them.
