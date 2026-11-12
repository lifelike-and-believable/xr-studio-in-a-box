---
id: design-identifier-filter
status: approved
derived-from:
  - story-contracts-and-payment-protect-sensitive-data#acceptance-criteria: 2b9128383b81
  - story-project-record-record-facts#acceptance-criteria: 1b82a3da6d7d
  - persona-producer#goals: d1cc47b03be9
  - persona-producer#context-of-use: 6e392d1314d8
  - decision-protected-store#decision: 1c1b55830ba3
  - decision-identifier-format-list#decision: a44bf2d99e03
---

# Identifier filter design

What happens when someone types, pastes or uploads text that looks like a bank detail, tax number or other identifier into a place agents can read, and how Jordan keeps the list of identifier formats (story-contracts-and-payment-protect-sensitive-data). Slice 2 builds the filter for facts, organisation facts, restores and work samples, with a starter list of formats. The same filter covers chat when chat arrives in slice 7. The protected store itself, where identifiers will be kept, arrives with the contracts and payment stories; until then the advice is to keep identifiers out of XR Studio.

## Personas

- persona-producer: Jordan handles bank details and tax numbers, which agents must never see (context of use). Jordan is stopped before such a number lands in a fact, told in plain words why, and can still save text that only looks like one. Jordan keeps the list of formats for the company.

## Flow

### Text that matches a format

1. A person saves or restores a fact. Before anything is saved, the command layer checks the text against every format turned on for the project's organisation. Matching ignores spaces, hyphens and dots between characters, so "046 454 286", "046-454-286" and "046454286" match the same format.
2. If any part matches, nothing is saved. The edit page comes back with the text kept and an error summary that takes focus, page title starting "Error: Not saved". It quotes the matching part, names the field and the format, says why (facts can be read by agents), and says what to do: take it out and save again, or confirm it is not that kind of number.
3. **It is not a <format>** is a submit button in the same form, so whatever is in the box at that moment, including edits made after the error, is what goes to the confirmation page. It shows the matching text and asks **What is it?** in a few words.
4. **What is it?** is required and is itself checked against the formats before anything is saved, because it is recorded in the append-only activity log. If it is empty: "Say in a few words what the number is." If it matches a format: "Your answer also looks like a <format>. Say what it is in words, without the number." It is at most 100 characters; a longer answer is not cut but refused on submit with "Keep your answer to 100 characters or fewer.", the answer kept (approver's decision, 2026-11-12).
5. **Confirm and save <fact>** saves the fact and records the confirmation with the person's name, the time, the format and their answer, in the activity of whatever holds the item: the project's activity for a project's facts and work samples, the organisation's activity for organisation facts and standard work samples (approver's decision, 2026-11-12). The matching text itself is not copied into the log. **Go back and edit the text** returns to the edit page with the text kept.
6. The Facts tab opens with a notice: "Description saved. Your confirmation that "00123-004-1234567" is not a bank account number is recorded in Activity."
7. A confirmation covers that exact matching text in that fact. Later saves of the fact that still contain it are not held again; any new matching text is.

### Text that matches several formats

Some formats overlap: any 9 digits can be a Business Number, and 9 digits that pass the SIN check digit can also be a Social Insurance Number. When one piece of text matches more than one format, the summary names them all ("looks like a Social Insurance Number or a Business Number"), and the confirm button reads **It is none of these**. Confirming covers every format named, and the log entry names each. When different pieces of text match, each is listed in the summary with a link to the field.

### A document that matches

1. A person adds a work sample. When the upload is registered, the text of PDFs is checked. Scanned PDFs with no text layer, video, images and audio are not checked in slice 2, and the field's hint says so (approver's decisions, 2026-11-12). Work samples accept no other file types, so there are no text files to check.
2. If it matches, the file is not added. It is held until a stated clock time 24 hours later, then deleted, unless confirmed (approver's decision, 2026-11-12). The deletion is recorded in the activity of whatever holds the work samples page, by "XR Studio": "Deleted grant-letter.pdf, held because its text looked like it had a GST/HST number and not confirmed within 24 hours." (approver's decision, 2026-11-12). The error summary says which page of which file matched which format, and when it will be deleted.
3. **It is not a <format>, add <file>** is a submit button that goes to the same **What is it?** confirmation, then adds the file. **Or choose a different file** is a file field with **Upload a different file** to start again.
4. Until it is confirmed or deleted, a held file is listed at the top of the work samples page: "Held: <file>. Not added: its text looks like it has a <format>. It will be deleted at <time> on <date> unless you confirm it is not a <format>." with **Confirm <file> is not a <format>** and **Delete <file> now**. So a person who closes the page can come back to it.

### The list of formats

1. On the organisation page, people who look after it have **Identifier formats**. The list belongs to the organisation and applies to every project in it (approver's decision, 2026-11-12; decision-identifier-format-list).
2. Each format shows its name, what it matches with an example, whether checking is **On**, and its source (**Starter**, or who added it and when).
3. The starter list (decision-protected-store): **Bank account number (Canada)** (transit, institution and account); **Social Insurance Number** (9 digits that pass the SIN check digit); **Business Number** (any 9 digits, so it overlaps the SIN); **GST/HST number** (9 digits, RT and 4 digits); **Payment card number** (13 to 19 digits that pass the card check). Starter formats can be turned off and on but not removed.
4. **Add a format** takes a **Name** and a **Pattern**, written with # for any digit and A for any letter, other characters matching as typed, with spaces, hyphens and dots ignored when checking. Letters match in either case, so "RT" in a pattern matches "rt" (approver's decision, 2026-11-12). A pattern needs at least 6 # or A (approver's decision, 2026-11-12). **Try it with an example** shows whether an example matches: the status line is on the page, empty, from the start, and is updated when the person stops typing for a moment or leaves the field, with "<example> matches this pattern." or "<example> does not match this pattern."
5. **Turn off** asks for confirmation, because text of that kind will then be saved where agents can read it. After it, the row shows **Off** and **Turn on**, and a notice says so. **Turn on** needs no confirmation; its notice says it is checked from now on and text already saved is not changed.
6. **Remove** (added formats only) asks for confirmation, then says the format is no longer checked. To check it again, add it again.
7. Every change to the list is recorded in the organisation's activity (design-activity-log).

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| A fact's text matches a format | ![Not saved](identifier-filter/fact-held.png) | Phone: ![Not saved at 320px](identifier-filter/fact-held-phone.png). Text kept; focus on the summary. |
| Text matches several formats | ![Several matches](identifier-filter/fact-held-several.png) | **It is none of these**. |
| Confirm it is not an identifier | ![Confirm](identifier-filter/confirm-not-identifier.png) | Answer required and checked. |
| The answer itself matches a format | ![Answer refused](identifier-filter/confirm-reason-error.png) | Focus on the summary. |
| Saved after confirming | ![Saved after confirming](identifier-filter/confirmed-saved.png) | Focus on the notice. |
| A document's text matches a format | ![Document held](identifier-filter/document-held.png) | Phone: ![Document held at 320px](identifier-filter/document-held-phone.png). Deletion time given. |
| A held document on the work samples page | ![Held upload](project-facts/work-samples.png) | **Confirm** and **Delete now**. |
| Identifier formats | ![Formats](identifier-filter/formats.png) | Phone: ![Formats at 320px](identifier-filter/formats-phone.png) |
| Add a format, example matches | ![Add a format](identifier-filter/add-format.png) | Status region present from load. |
| Add a format, example does not match | ![No match](identifier-filter/add-format-no-match.png) | |
| Add a format, pattern too short | ![Pattern too short](identifier-filter/add-format-error.png) | All values kept, including the example. |
| Turn off a starter format, confirmation | ![Turn off](identifier-filter/turn-off-confirm.png) | Dialog; **Keep it on** first. |
| After turning a format off | ![Turned off](identifier-filter/format-turned-off.png) | Row shows **Off** and **Turn on**. |
| After adding or turning on a format | ![Format added](identifier-filter/format-added.png) | Says saved text is not changed. |
| Remove an added format, confirmation | ![Remove format](identifier-filter/remove-format-confirm.png) | Phone: ![Remove at 320px](identifier-filter/remove-format-confirm-phone.png) |
| After removing a format | ![Format removed](identifier-filter/format-removed.png) | Focus on the notice. |

## Layout

- **Identifier formats** is in the organisation page's navigation for people who look after it, next to **Activity** (design-organisation-facts).
- Control names: **It is not a <format>**, **It is none of these**, **What is it?**, **Confirm and save <fact>**, **Go back and edit the text**, **It is not a <format>, add <file>**, **Or choose a different file**, **Upload a different file**, **Confirm <file> is not a <format>**, **Delete <file> now**, **Identifier formats**, **Add a format**, **Name**, **Pattern**, **Try it with an example**, **Add format**, **Turn off**, **Turn on**, **Remove**, **Keep it on**, **Keep <format>**, **Remove <format>**.
- **Turn off**, **Turn on** and **Remove** are buttons in forms, never links.

## States and errors

- **Match in a fact:** summary heading "Not saved: this looks like a <format>"; field error "Take out "<text>", or confirm it is not a <format>."
- **Several formats:** "Not saved: this looks like a <format> or a <format>"; field error "Take out "<text>", or confirm it is none of these."
- **Answer empty:** "Say in a few words what the number is." **Answer too long:** "Keep your answer to 100 characters or fewer." (laid out as the answer-refused mock-up). **Answer matches a format:** "Your answer also looks like a <format>. Say what it is in words, without the number."
- **Match in a document:** "Not added: <file> looks like it has a <format>", naming the page and the deletion time.
- **Pattern too short:** "Use at least 6 # or A in the pattern. A shorter pattern would match ordinary numbers like dates and prices."
- **Name missing:** "Enter a name for the format." **Pattern missing:** "Enter a pattern, like ###-AA-#####."
- **A new or turned-on format:** checks from then on; text already saved is not changed. The notice says so. A restore of older text is checked like any save.
- **Who cannot see the list:** anyone who does not look after the organisation gets the "This page is not available" page (design-dashboard-shell).
- **Agents:** an agent cannot confirm a match or change the list; the command layer refuses both.

## How it works

- **How does the system know?** The formats are stored on the organisation as versioned working state (decision-identifier-format-list). Each check reads the list for the organisation of the project being written to.
- **What enforces each promise?**
  - "Identifiers never reach anything an agent can read": every write to an agent-readable field, including restores and the **What is it?** answer, passes through the command layer, which runs the check before writing (decision-project-record-model). There is no other write path. A test saves test identifiers in each field, as a restore and as a confirmation answer, and uploads them in a document, then searches the facts, documents and log for them and finds none.
  - "The confirmation is logged with who and when": confirm-and-save is one command; it writes the fact version and the log entry in one transaction. A test.
  - "An agent cannot confirm": the command layer refuses the confirm command from an agent session. A test.
  - "Held documents are deleted at the stated time": a scheduled job deletes held uploads that were not confirmed. A test with a shortened time.
- **What is published together?** Not applicable.

## Accessibility

- Error summaries take focus, list each problem as a link to its field, and the page title starts with "Error:". The matching text is marked with `mark` and a dashed outline, and named in words, so it is not shown by colour alone.
- **Try it with an example** reports its result in a polite status region that is on the page, empty, from load, and is updated after a pause in typing or on leaving the field, not on every keystroke.
- The turn-off and remove confirmations are modal dialogs; focus starts on the heading, the safe choice comes first, Escape is the safe choice, and closing returns focus to **Turn off <format>** or **Remove <format>**.
- The formats table has a caption and becomes one block per format at 320 pixels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations, and the phone frames have no horizontal scrolling.

## Open items

- The protected store and placeholders in drafts: the contracts and payment stories.
- Chat messages: checked by the same filter from slice 7.
- Other document types (images with text, spreadsheets, video and audio): checked when a story needs them.
