---
id: spec-layer1-facts-identifiers-activity
status: approved
derived-from:
  - docs-project-facts#see-a-projects-facts: 220d72042aed
  - docs-project-facts#edit-a-fact: ca66d0f94049
  - docs-project-facts#what-each-fact-takes: aaf02a6ffb73
  - docs-project-facts#earlier-versions-of-a-fact: 5e6ff875df26
  - docs-project-facts#restore-an-earlier-version: 0c762b844951
  - docs-project-facts#add-and-remove-work-samples: b764215c788d
  - docs-project-facts#if-someone-else-saved-while-you-were-editing: a942057730fb
  - docs-project-facts#who-can-do-this: cbcb39ff204d
  - docs-project-facts#if-something-goes-wrong: 18b06698ba44
  - docs-organisation-facts#see-an-organisations-facts: a283dfab3c28
  - docs-organisation-facts#how-projects-use-them: f7ee4047175d
  - docs-organisation-facts#edit-an-organisation-fact: 141cb39eba3d
  - docs-organisation-facts#record-a-funder-applicant-profile: db8ede0e4907
  - docs-organisation-facts#add-standard-work-samples: fc084e4754ec
  - docs-organisation-facts#who-can-do-this: 71879709f78c
  - docs-organisation-facts#if-something-goes-wrong: 08bffb6d2e79
  - docs-identifier-filter#what-is-checked: e96f28321b42
  - docs-identifier-filter#text-that-looks-like-an-identifier: 80f1210ad6e1
  - docs-identifier-filter#text-that-matches-several-formats: 8aba7e80e6da
  - docs-identifier-filter#a-document-that-is-held: 8d0c730a7e8e
  - docs-identifier-filter#keep-the-list-of-identifier-formats: 80ea5ae5f155
  - docs-identifier-filter#add-a-format: ce3441d9d1d8
  - docs-identifier-filter#turn-a-format-off-or-on: f881ff68a355
  - docs-identifier-filter#remove-a-format-you-added: 5d639a925d3a
  - docs-identifier-filter#who-can-do-this: faf12f82ab66
  - docs-identifier-filter#if-something-goes-wrong: d37c31c290fa
  - docs-activity-log#read-a-projects-activity: 759961dac622
  - docs-activity-log#filter-the-activity: 66e90e1035e3
  - docs-activity-log#read-an-organisations-activity: 52200c927d11
  - docs-activity-log#entries-nobody-can-change: 1fbbb53961e4
  - docs-activity-log#who-can-do-this: 34d9091ea09f
  - docs-activity-log#if-something-goes-wrong: df47be0ba235
  - design-project-facts: 1a327e4e7efd
  - design-organisation-facts: 944f01c03608
  - design-identifier-filter: 069c84a56674
  - design-activity-log: 69b55595cccd
  - design-dashboard-shell: a56bdc0e80ae
  - decision-navigation-and-urls: 2dd0e158ee13
  - decision-identity-and-roles#decision: 402e397cf1b0
  - decision-project-record-model#decision: cd1dfeb7a4dd
  - decision-protected-store#decision: 1c1b55830ba3
  - decision-identifier-format-list#decision: a44bf2d99e03
tests-commit: 19dcf69
unlocks:
  - web/e2e/organisations.spec.ts: AC-13. Slice 1's organisation page test expected the placeholder "No organisation facts yet.", which AC-13 replaces with the facts themselves; it now expects **Add legal name** in that place. The other assertions are unchanged.
  - web/test/repo-hygiene.test.ts: Scope (new environment variables). The list of names in `.env.example` gains `CRON_SECRET`, `STORAGE_DIR` and `STORAGE_SIGNING_SECRET`, as the Scope requires; every value is still checked to be a placeholder.
  - contracts/test/roles.test.ts: AC-4 and AC-34 (Roles and permissions). Slice 1's test compares each role's permissions with an exact list; the spec adds `see-facts`, `see-budget`, `edit-facts` and `read-activity` beside slice 1's, so the lists gain them as the spec's table gives them, and the Technical artist, who now also reads the activity, is checked on its own line. Every slice 1 permission is still checked.
  - web/e2e/facts.spec.ts: AC-1. The test looked for the **Facts** tab with `getByRole('link', { name: 'Facts' })`, which also matches **Open <organisation>'s facts** and another link containing "facts", so the strict locator failed; it now looks inside the Project navigation. No assertion changes.
  - web/e2e/activity.spec.ts: AC-35. `getByLabel('To')` also matched the project switcher, whose label holds the made-up project name, when that name happened to contain "to"; it now matches the label exactly. No assertion changes.
  - web/e2e/work-samples.spec.ts: AC-10. `getByRole('button', { name: 'Uploading' })` also matched **Stop uploading**; it now matches the name exactly. No assertion changes.
  - web/e2e/identifiers.spec.ts: AC-23. The test typed new text straight after the first **Save description**, before the page answered; the answer redrew the form with the first text, so the later steps ran on the first text. It now waits for the "Not saved" summary before typing, as a person would. No assertion changes.
  - web/test/write-path.test.ts: AC-40. Extended with a test that the system writers gain no file, that every slice 2 command is in the command layer, and that the route receiving bytes uses only object storage. No existing assertion changes.
---

# Layer 1, slice 2: facts, the identifier filter and the activity log

## Problem

Projects exist, but nothing about them is recorded: Jordan types the same description, budget and company bio into every application, and the figures drift. There is also no record of who changed what, and nothing stops a bank account or tax number from being typed into a place agents will read from slice 7. Slice 2 builds what the approved user documentation promises for project facts, organisation facts, work samples, the identifier filter with its list of formats, and the activity log, on slice 1's command layer (design-architecture, build order slice 2).

This spec derives from the approved user documentation (`docs/user/project-facts.md`, `organisation-facts.md`, `identifier-formats.md`, `activity.md`) and the approved designs it documents.

## User stories

- story-project-record-record-facts, without agent drafts (slice 7).
- story-project-record-set-up-organisation, criteria 2 and 4 (organisation facts, who edits them, who sees them), without drafts or flags on drafts (the funding stories) and without agent drafts (slice 7).
- story-contracts-and-payment-protect-sensitive-data, criterion 3 only (the filter, the confirmation and its log entry) and criterion 2 for facts, documents and the log. The protected store itself, drafts, chat, notifications and previews come later.
- story-agent-work-read-activity-log, partly: "nobody can edit or remove an entry" and filtering by date. Agent entries with stage and tool, and filtering by agent and stage, are slice 7 (approver's decision, 2026-11-12).
- story-review-and-status-feedback-and-versions, only comparing an earlier version of a fact with the current one and restoring it with later versions kept. Feedback, revising drafts, side-by-side compare and restore by roles other than the director and producer come with drafts (approver's decision, 2026-11-12).

## Acceptance criteria

"Source" names the user documentation section each criterion comes from. A test cites a criterion as `layer1-facts-identifiers-activity#AC-1` in its title or a comment. Wording in quotes is the exact text the user documentation and designs give, and tests check it. "Dir/Prod" means a person holding the Director or Producer role on the project; "stewards" means the people an organisation is **Looked after by**.

### Project facts

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-1 | The project tabs are **Overview**, **Facts**, **People** and, for roles that may read it, **Activity**, in that order. **Facts** (`/projects/<id>/facts`) lists **Description**, **Plan**, **Budget**, **Credits**, **Collaborators**, **Schedule**, **Work samples** and **Capacity** in that order, each as a heading with its value and "Last changed by <name>, <date and time>". A fact never saved shows "Not recorded yet." with **Add** in place of **Edit**. Below them, **From <organisation>** shows the organisation's legal name and bio with **Open <organisation>'s facts**, or "<organisation> has no facts recorded yet. People who look after it add them on its page." when neither is recorded. The slice 1 Overview's "No project facts yet." placeholder is removed. | docs-project-facts#see-a-projects-facts | test: `facts tab lists the facts in order with who last changed each` |
| AC-2 | A Dir/Prod selects **Edit** (or **Add**) beside a fact and edits that one fact at `/projects/<id>/facts/<fact>/edit`, with **Save <fact>** and **Cancel**. Saving writes a new version and opens **Facts** with "<Fact> saved." (for example "Description saved."), focus on the notice and the page title starting with it; the fact then shows the saver in "Last changed by". **Cancel** writes nothing. | docs-project-facts#edit-a-fact | test: `edit a fact and see who last changed it` |
| AC-3 | Description, Plan, Credits, Collaborators and Schedule take text. Budget takes **Total in Canadian dollars** (whole dollars; "148000", "148,000" and "$148,000" are all stored as 148000) and an optional **Note**. Capacity takes **Guests in the room per show** and **Viewers online per show**, each a whole number, 0 allowed. A value that is not a whole number gives "Enter the total in whole Canadian dollars, like 148000.", "Enter the number of guests in the room as a whole number, like 40." or "Enter the number of viewers online as a whole number, like 200.", each tied to its field and linked from an error summary that takes focus, with the page title starting "Error:", every value typed kept and nothing saved. | docs-project-facts#what-each-fact-takes | test: `fact values are parsed and checked` |
| AC-4 | What each role sees and edits follows the table in [Roles and permissions](#roles-and-permissions). A person who may not edit sees no **Edit**, **Add** or **Restore**, and a line naming the people who edit (for example "The project's facts. The director and producer edit them: Morgan Ray and Jordan Lee."). A fact a person may not see is listed by name with "The budget is visible to the director and producer." and no value; its edit and history addresses and its API answer exactly as an address that does not exist ("This page is not available", 404). Edit, restore and work-sample commands from a person without the right are refused (403), and none of them changes anything. | docs-project-facts#who-can-do-this | test: `facts visible and editable by role` |
| AC-5 | A saved fact is shown to every person whose roles let them see it at their next page load or API call after the save, with no cache in between. | docs-project-facts#edit-a-fact | test: `a saved fact is visible at the next request` |
| AC-6 | **Earlier versions** (`/projects/<id>/facts/<fact>/history`) lists every saved version newest first, with its number, who saved it and when. The newest is marked "(current)" and has no actions; a version made by restoring reads "<n>, restored from version <m>". **Compare with current** shows the earlier version against the current one, removed text in `del` and added text in `ins`, then both versions written out in full, with **Back to earlier versions**. For Work samples, compare lists the samples of each version and marks those removed and added. Anyone who may see the fact may open both pages. | docs-project-facts#earlier-versions-of-a-fact | test: `earlier versions and compare` |
| AC-7 | A Dir/Prod can restore from **Restore** on the list or **Restore version <n>** on the compare page. A dialog asks "Restore version <n> of <fact>?" with **Keep the current <fact>** first and **Restore version <n>**; Escape keeps it. Restoring writes a new version whose value equals version <n>, marked restored from <n>, and opens **Facts** with "<Fact> restored to version <n>, saved as version <m>. Earlier versions are kept." No version is changed or removed. Restored text goes through the identifier check like any save (AC-22). | docs-project-facts#restore-an-earlier-version | test: `restore saves a new version and keeps every version` |
| AC-8 | The edit form carries the version it started from. If another version was saved since, nothing is saved and the page shows "Check before saving: <name> saved a new <fact> at <time>" in a summary that takes focus, their version above the form, and the person's own text still in the box. **Save my <fact>** then saves the box's text as the newest version, and the other person's version stays in the earlier versions. **Cancel** leaves without saving. | docs-project-facts#if-someone-else-saved-while-you-were-editing | test: `a save made meanwhile is never overwritten` |

### Work samples

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-9 | A Dir/Prod opens the work samples page (`/projects/<id>/facts/work-samples`) from **Edit** (or **Add**) beside **Work samples**. It lists any held uploads first (AC-27), then the samples in a captioned table with title, file, who added it and when, each with **Remove**, then **Add a work sample**. A line at the top links to the organisation's standard work samples. Other roles see the samples' titles on **Facts** only; the page answers them "This page is not available". | docs-project-facts#add-and-remove-work-samples | test: `work samples page and who may open it` |
| AC-10 | **Add a work sample** takes a **Title** and a **File** (video, image, audio, PDF or Word document (.docx), up to 2 GB; the hint says "Video, images, audio, a PDF or a Word document (.docx), up to 2 GB. Text in PDFs and Word documents is checked for bank details and tax numbers; scanned PDFs, video, images and audio are not checked."). **Add work sample** first asks the server for a signed upload address, then sends the bytes there, showing a `progress` element and a polite status line updated every few seconds ("<n>% uploaded, about <time> left. Keep this page open."). During the upload the button reads **Uploading** and is disabled, and **Stop uploading** cancels it. When the bytes are in, the upload is registered through a command: the sample joins the record as a new Work samples version, and the list shows it. A repeated register for the same request id adds nothing more. | docs-project-facts#add-and-remove-work-samples | test: `add a work sample with progress` |
| AC-11 | Errors, each in a summary that takes focus with the title kept: "Enter a title for the work sample.", "Choose a file to add.", and "The file is larger than 2 GB. Choose a smaller file." (checked in the browser before any bytes are sent, and again by size when registering). A file of another type is refused, in the browser and again at registration (by its first bytes, not its name), with "Choose a video, image, audio, PDF or Word file." If the upload stops before it finishes, the page shows "The upload of <file> stopped before it finished. Choose the file again to try again." and nothing joins the record. | docs-project-facts#if-something-goes-wrong | test: `work sample errors and an interrupted upload` |
| AC-12 | **Remove** opens a dialog with **Keep <title>** first and **Remove <title>**. Removing writes a new Work samples version without the sample and shows "<title> removed from the work samples. It stays in the earlier versions of Work samples." The file's bytes and record are kept, so restoring an earlier version brings the whole list back as it was in that version, including files removed since and without files added since. | docs-project-facts#add-and-remove-work-samples | test: `remove a work sample and restore it from an earlier version` |

### Organisation facts

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-13 | The organisation page keeps every slice 1 control. For stewards, a navigation below the buttons has **Identifier formats** and **Activity**. **Organisation facts** follows, before **Projects**, with the line "Bank details and tax numbers are not organisation facts. They will be kept in the protected store, which comes in a later release; until then keep them out of XR Studio." and **Legal name**, **Bio**, **Company history**, **Funder applicant profiles** and **Standard work samples** in that order, each with its value and "Last changed by <name>, <date and time>", or "Not recorded yet." with **Add**. | docs-organisation-facts#see-an-organisations-facts | test: `organisation page shows its facts` |
| AC-14 | A steward edits Legal name (one line), Bio or Company history (text) at `/organisations/<id>/facts/<fact>/edit` with **Save <fact>** and **Cancel**. Saving opens the organisation page with "<Fact> saved. Every project in <organisation> now reads the new <fact>." (for example "Bio saved. Every project in Harbourfront Puppet Co. now reads the new bio."). **Earlier versions**, compare, restore and the save-made-meanwhile check behave as in AC-6 to AC-8, at `/organisations/<id>/facts/<fact>/history`, with stewards in place of Dir/Prod. | docs-organisation-facts#edit-an-organisation-fact | test: `edit, compare and restore an organisation fact` |
| AC-15 | Organisation facts are stored once on the organisation and read from it on each request. With an organisation holding two projects, a change to the bio is shown under **From <organisation>** on both projects' **Facts** at their next load. | docs-organisation-facts#how-projects-use-them | test: `both projects read the organisation's bio` |
| AC-16 | **Funder applicant profiles** has one line each for Canada Council for the Arts, Canada Media Fund, Creative BC and Epic MegaGrants, saying whether the profile is recorded, with **Add**, or **Edit** and **Earlier versions**, each naming the funder in visually hidden text. The profile form (`/organisations/<id>/facts/funder-profile-<funder>/edit`) has **Applicant name as registered with the funder**, **Applicant category**, **Funder's applicant profile number (optional)** and **Mandate**, and **Save profile**, which opens the organisation page with "Applicant profile for <funder> saved. Every project in <organisation> now reads it." No field is required. Every field is checked for identifiers. | docs-organisation-facts#record-a-funder-applicant-profile | test: `record a funder applicant profile` |
| AC-17 | **Open standard work samples** (or **Add** beside **Standard work samples**) opens `/organisations/<id>/work-samples`, which behaves as AC-9 to AC-12 with stewards in place of Dir/Prod. | docs-organisation-facts#add-standard-work-samples | test: `standard work samples` |
| AC-18 | Legal name, Bio, Company history and Standard work samples are seen by stewards and by every dashboard role on any of the organisation's projects. Funder applicant profiles are seen by stewards and by the Director and Producer on any of its projects; anyone else sees "Visible to the people who look after the organisation, and to the director and producer on its projects." and no profile. Only stewards edit, and a Dir/Prod who is not a steward sees no **Edit**. Only stewards see **Identifier formats** and **Activity** on the organisation page. | docs-organisation-facts#who-can-do-this | test: `organisation facts by role, with a narrow role on one project` |

### The identifier filter

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-19 | Matching follows these rules, in one shared function in `contracts/` used by the server and by **Try it with an example**: (a) any run of spaces, hyphens and dots between two letters or digits is ignored; (b) letters match in either case; (c) a match must not continue into a further letter or digit on either side, so 9 digits inside a 15-digit run are not a Business Number; (d) the starter formats are Bank account number (Canada): 5, 3 and 7 to 12 digits, so a run of 15 to 20 digits; Social Insurance Number: 9 digits passing the Luhn check; Business Number: any 9 digits; GST/HST number: 9 digits, RT and 4 digits; Payment card number: 13 to 19 digits passing the Luhn check; (e) an added pattern has `#` for a digit, `A` for a letter and any other character literally, needs at least 6 `#` or `A`, and its own spaces, hyphens and dots are ignored. A piece of text that meets several formats is one match naming each. | docs-identifier-filter#what-is-checked | test: `identifier matching rules` (unit, table of examples) |
| AC-20 | Before any write of a project fact, organisation fact (every funder profile field included) or restore, the command checks the text against every format that is On for the organisation that holds it (the project's organisation for project facts). If anything matches and is not covered by a confirmation (AC-24), nothing is written. | docs-identifier-filter#what-is-checked | test: `every fact save and restore is checked` |
| AC-21 | On a match the edit page comes back with the text kept, an error summary headed "Not saved: this looks like a <format>" that takes focus, quotes the matching text in `mark`, names the field and the format, and the page title starts "Error: Not saved". The field error reads "Take out "<text>", or confirm it is not a <format>." | docs-identifier-filter#text-that-looks-like-an-identifier | test: `a fact holding an identifier is not saved` |
| AC-22 | When one match meets several formats, the heading reads "Not saved: this looks like a <format> or a <format>" (all named), the field error ends "or confirm it is none of these.", and the button reads **It is none of these**. When several pieces match, each is listed in the summary with a link to its field. | docs-identifier-filter#text-that-matches-several-formats | test: `overlapping formats and several matches` |
| AC-23 | **It is not a <format>** is a submit button in the edit form, so the box's text at that moment goes to the confirm page (`/projects/<id>/facts/<fact>/confirm`, or the organisation's), which shows the matching text and asks **What is it?** (required, at most 100 characters). Errors keep the answer: "Say in a few words what the number is.", "Keep your answer to 100 characters or fewer." and "Your answer also looks like a <format>. Say what it is in words, without the number." **Go back and edit the text** returns to the edit page with the text kept. **Confirm and save <fact>** writes, in one transaction, the fact version, the confirmation (person, time, formats, answer, and a keyed hash of the matching text, never the text) and the activity entry, and opens the facts page with "<Fact> saved. Your confirmation that "<text>" is not a <format> is recorded in Activity." | docs-identifier-filter#text-that-looks-like-an-identifier | test: `confirm a false match and save` |
| AC-24 | A confirmation covers that exact matching text (compared after the rules of AC-19) for the formats named, in that fact. A later save or restore of the fact that still contains it is not stopped; any other match is. | docs-identifier-filter#text-that-looks-like-an-identifier | test: `a confirmation covers that text in that fact only` |
| AC-25 | When an upload is registered, a PDF (bytes starting `%PDF-`) has its text extracted page by page, and a Word document (a zip holding `word/document.xml`) has the text of its body, headers, footers, footnotes and endnotes extracted; both are checked. Other files, and PDFs with no extractable text, join the record unchecked. A matching file does not join the record: it is held until 24 hours after registration, and the page shows "Not added: <file> looks like it has a <format>" listing "Page <n> of <file> has text matching the format for a <format>" for a PDF, or "<file> has text matching the format for a <format>" for a Word document, and the deletion time, with **It is not a <format>, add <file>** (which leads to the same **What is it?** confirmation, then adds the file) and **Or choose a different file** with **Upload a different file**. | docs-identifier-filter#a-document-that-is-held | test: `a PDF or Word document holding an identifier is held, and can be confirmed` |
| AC-26 | Until it is confirmed or deleted, a held upload is listed at the top of its work samples page: "Held: <file>. Not added: its text looks like it has a <format>. It will be deleted at <time> on <date> unless you confirm it is not a <format>." with **Confirm <file> is not a <format>** and **Delete <file> now**. After its time it can no longer be confirmed and is not listed. A scheduled job, at least every 5 minutes, deletes the bytes and the held upload and writes the activity entry by XR Studio (AC-33). **Delete <file> now** does the same at once, by the person. | docs-identifier-filter#a-document-that-is-held | test: `held uploads are listed, deleted on time, and logged` |
| AC-27 | **Identifier formats** (`/organisations/<id>/identifier-formats`) is open to stewards only; anyone else gets "This page is not available". A new organisation starts with the five starter formats On. The page has the documented introduction and a captioned table: format, what it matches with an example, **On** or **Off**, the source (**Starter**, or "<name>, <date>"), and the actions. | docs-identifier-filter#keep-the-list-of-identifier-formats | test: `identifier formats page and starter list` |
| AC-28 | **Add a format** (`/organisations/<id>/identifier-formats/new`) has **Name**, **Pattern** and **Try it with an example**, whose polite status region is on the page and empty from load and shows "<example> matches this pattern." or "<example> does not match this pattern." after a pause in typing or on leaving the field. **Add format** saves the format On and shows "<name> added. It is checked from now on; text already saved is not changed." Errors keep every value, including the example: "Enter a name for the format.", "Enter a pattern, like ###-AA-#####." and "Use at least 6 # or A in the pattern. A shorter pattern would match ordinary numbers like dates and prices." | docs-identifier-filter#add-a-format | test: `add a format` |
| AC-29 | **Turn off** opens a dialog with **Keep it on** first and **Turn off**; turning off shows "<name> turned off. Text that only matches it is now saved where agents can read it. Turn it on again at any time." and the row then shows **Off** and **Turn on**. **Turn on** needs no dialog and shows the AC-28 "checked from now on" notice. Text already saved is never changed by either. | docs-identifier-filter#turn-a-format-off-or-on | test: `turn a format off and on` |
| AC-30 | **Remove** is offered for added formats only. Its dialog has **Keep <format>** first and **Remove <format>**; removing shows "<format> removed. It is no longer checked in any of <organisation>'s projects. Its removal is recorded in Activity." Starter formats cannot be removed (the command refuses it). | docs-identifier-filter#remove-a-format-you-added | test: `remove an added format` |
| AC-31 | Anyone who may edit a fact may confirm its text; anyone who may add work samples may confirm a held upload. Only stewards change the format list. Commands from an agent-session principal to read or write any fact, register or confirm an upload, confirm a match or change the format list are refused (403), whatever roles its person holds. | docs-identifier-filter#who-can-do-this | test: `who may confirm and change formats; agents refused` |
| AC-32 | With test identifiers for every starter format, saved into each fact, each funder profile field, a restore, a **What is it?** answer, a PDF and a Word document, a search of the fact versions, registered files, confirmations and activity entries finds none of them, except in versions saved through a confirmation, which hold the text the person confirmed is not an identifier. | docs-identifier-filter#what-is-checked | test: `test identifiers reach nothing an agent can read` |

### The activity log

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-33 | Every command writes its activity entry in the same transaction as its change, with the time, the actor (a person, or XR Studio for the held-upload job), the area and the words below. A test runs each command and checks its entry. | docs-activity-log#read-a-projects-activity | test: `every command writes its entry` |
| AC-34 | **Activity** (`/projects/<id>/activity`) is the last tab and is shown only to Director, Producer and Technical artist; for anyone else its address is "This page is not available". It lists entries newest first in a captioned table (**When**, **Who**, **What**, **Area**), with "Showing the newest 50 of <n> entries." and **Older entries** for the next fifty. | docs-activity-log#read-a-projects-activity | test: `project activity, paging and who may read it` |
| AC-35 | **Who** lists everyone with an entry on the project, with "<name> (removed)" for people no longer on it, then **Agents**. **Area** lists Project, Facts and People. **From** and **To** are dates. **Apply filters** reloads with the filters in the address; focus moves to "<n> entries: <filters>." and the title starts with it. **Clear filters** shows all. No match gives "No entries match these filters." with **Clear filters** (plus "Agents arrive in a later release, so there are no agent entries yet." when **Agents** is chosen). **From** after **To** gives "Choose a From date before the To date." in an error summary, with the values kept. | docs-activity-log#filter-the-activity | test: `filter the activity` |
| AC-36 | Times in Activity and in "Last changed by" are shown in the viewer's time zone, read from the browser and sent with each request; with none sent, America/Toronto. **From** and **To** are whole days in that zone and both are included. | docs-activity-log#filter-the-activity | test: `times and date filters use the viewer's time zone` |
| AC-37 | **Activity** on the organisation page (`/organisations/<id>/activity`) is for stewards only, lists the organisation's own entries (the organisation, its facts, its standard work samples, confirmations on them and its identifier formats), and has the same columns and filters, except that **Who** lists people only and **Area** lists Organisation, Organisation facts and Identifier formats. | docs-activity-log#read-an-organisations-activity | test: `organisation activity` |
| AC-38 | No page or API edits or removes an entry. The application's database role can insert and read activity entries, fact versions and confirmations but cannot update or delete them. A separate retention role can delete them. Both are proved by a database test that tries each statement under each role. | docs-activity-log#entries-nobody-can-change | test: `ledgers refuse update and delete by the application role` |
| AC-39 | An entry is built from the command and the names of what changed, never from a fact's value or a file's contents. The only free text it can hold is a **What is it?** answer, which has passed the identifier check. | docs-activity-log#read-a-projects-activity | test: `entries hold no values` |

Entry words (AC-33). Area in brackets.

| Command | What |
|---|---|
| Start a project | "Started the project" (Project) |
| Edit name and brief | "Changed the project's name and brief" (Project) |
| Add a person | "Added <name> as <roles>" (People) |
| Change roles | "Changed <name>'s roles to <roles>" (People) |
| Remove a person | "Removed <name> from the project" (People) |
| Send an invitation again | "Sent <name> a new invitation link" (People) |
| Save a project fact | "Saved the <fact> (version <n>)" (Facts) |
| Restore a project fact | "Restored the <fact> to version <n>, saved as version <m>" (Facts) |
| Save after confirming | "Saved the <fact> (version <n>) after confirming that text in it is not a <format> ("<answer>")" (Facts) |
| Add a work sample | "Added the work sample "<title>" (version <n>)" (Facts) |
| Add a held file after confirming | "Added the work sample "<title>" (version <n>) after confirming that <file> does not have a <format> ("<answer>")" (Facts) |
| Remove a work sample | "Removed the work sample "<title>" (version <n>)" (Facts) |
| Delete a held file now | "Deleted <file>, held because its text looked like it had a <format>" (Facts) |
| Held file deleted by the job | "Deleted <file>, held because its text looked like it had a <format> and not confirmed within 24 hours" (Facts), by XR Studio |
| Create an organisation | "Created the organisation" (Organisation) |
| Edit an organisation | "Changed the organisation's name and who looks after it" (Organisation) |
| Save, restore or confirm an organisation fact, a funder profile or a standard work sample | As the project rows, with "the applicant profile for <funder>" and "the standard work sample "<title>"" (Organisation facts) |
| Add, turn off, turn on, remove a format | "Added the identifier format "<name>"", "Turned off …", "Turned on …", "Removed …" (Identifier formats) |

Organisation entries are written to the organisation's log; every other entry to the project's.

### Write path and accessibility

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-40 | Every write in this slice goes through the command layer, including upload registration and the held-upload job, which is a system command with an XR Studio principal. The write-path test's allow-list gains no new file. The upload route that receives bytes writes only to object storage, never to the database. | docs-project-facts#edit-a-fact | test: `writes go through the command layer` (extended) |
| AC-41 | Every page in this slice has no axe violations at WCAG 2.2 AA, works with the keyboard alone with a visible focus indicator, and has no horizontal scroll at 320 CSS pixels; tables have captions and become one labelled block per row at 320 pixels. Error summaries and notices take focus and lead the page title as in slice 1. Dialogs start focus on their heading, put the safe choice first, treat Escape as the safe choice and return focus to the control that opened them. Compare marks changes with `del` and `ins` and writes both versions out. Matches are shown with `mark` and named in words. | design-project-facts, design-organisation-facts, design-identifier-filter, design-activity-log (Accessibility sections) | check: the end-to-end suite `slice 2 pages pass axe and keyboard checks`, run in CI |

AC-41's source is the designs' Accessibility sections, as AC-38 of slice 1, and it is a `check:` for the same reason.

## Roles and permissions

New permissions in `contracts/src/roles.ts`, beside slice 1's:

| Role | See facts (general) | See budget | Edit facts and work samples | Read project activity |
|---|---|---|---|---|
| Director, Producer | yes | yes | yes | yes |
| Technical artist | yes | no | no | yes |
| Artist, Sound designer, Interaction designer, Capture crew, Show operator | yes | no | no | no |
| Venue attendant, Performer, Collaborator | no | no | no | no |

Organisation rights are not project roles: stewards edit organisation facts, keep the format list and read the organisation's activity; anyone with a dashboard role on any of the organisation's projects sees its general facts; the Director and Producer on any of its projects also see the funder profiles.

## Scope

- In:
  - `contracts/`: the permission ids above; fact slugs, funder slugs and each fact's value schema; request and response schemas for the endpoints below, under `v1`; the identifier matcher (AC-19), with no dependency, so the browser can use it.
  - Database (Drizzle, generated migrations, UUIDv7 ids):
    - `fact_version` (id, project or organisation, fact slug, number, value as JSON, saved by, saved at, restored from, confirmation): unique (owner, fact, number). A ledger.
    - `stored_file` (id, owner, storage key, file name, media type, size, SHA-256, added by, added at): files that joined the record.
    - `upload` (id, owner, request id unique, title, file name, media type, declared size, storage key, state pending, held or deleted, held until, matches as format ids and page numbers, created by): working state.
    - `identifier_format` (id, organisation, name, pattern or starter kind, on, starter, added by, added at, removed at). Its history is its activity entries.
    - `identifier_confirmation` (id, owner, fact or upload, formats, keyed hash of the matching text, answer, person, at). A ledger.
    - `activity_entry` (id, project or organisation, at, actor person or none, actor kind person or system, area, what). A ledger.
    - A migration creates the roles `xr_app` and `xr_retention` (no login) if missing. `xr_app` gets select, insert, update and delete on working-state tables and select and insert on the three ledgers; `xr_retention` gets delete on the ledgers. Default privileges cover tables made later. The app's pool runs `SET ROLE xr_app` on each new connection, so the app and the end-to-end tests run under it. Migrations run as the owning user.
  - `web/src/record/`: commands for save fact, restore fact, confirm and save, request upload, register upload, confirm held upload, delete held upload, remove work sample, add format, turn format off, turn format on, remove format, and the system command delete expired held uploads; each slice 1 command gains its entry. One shared step inside each transaction runs the identifier check and writes the entry. Slice 2 commands refuse every agent-session principal.
  - API under `/api/v1`, validated with `contracts/` and going to the command layer:
    - `GET /projects/:id/facts`, `GET|PUT /projects/:id/facts/:fact`, `GET /projects/:id/facts/:fact/versions`, `POST /projects/:id/facts/:fact/restore`, `POST /projects/:id/facts/:fact/confirm`
    - the same under `/organisations/:id/facts/...`
    - `POST /projects/:id/uploads`, `POST /projects/:id/uploads/:uploadId/register`, `POST .../confirm`, `DELETE .../:uploadId`, `DELETE /projects/:id/work-samples/:fileId`, and the same under `/organisations/:id/`
    - `GET|POST /organisations/:id/identifier-formats`, `PATCH|DELETE /organisations/:id/identifier-formats/:formatId`
    - `GET /projects/:id/activity`, `GET /organisations/:id/activity`
    - `GET /jobs/held-uploads`, refused unless it carries `Authorization: Bearer <CRON_SECRET>`.
  - Pages at the addresses in decision-navigation-and-urls. A held upload's confirmation is a state of its work samples page (`?held=<upload id>`), so no new address is added.
  - Object storage: an interface with signed upload addresses, size, read and delete. In tests and local work it is a folder (`STORAGE_DIR`), with a route that accepts a `PUT` only with a valid signed token and only up to the declared size. The S3 transport is added before the first deployment, with Amazon SES.
  - The held-upload job: a function the route calls, and a `vercel.json` cron entry every 5 minutes.
  - New environment variables `STORAGE_DIR`, `STORAGE_SIGNING_SECRET` and `CRON_SECRET`, in `.env.example` and its hygiene test, and set by `web/scripts/run-e2e.mjs`.
  - A browser time-zone cookie set by a small client component, read by the server when formatting times (AC-36).
- Out:
  - Agent drafts of facts and organisation facts, agent and Claude Code entries, and filtering by agent and stage: slice 7.
  - Drafts that read facts, flags when a fact changes, and provenance shown in drafts: the funding stories.
  - The protected store, placeholders, and logging its openings: the contracts and payment stories.
  - Feedback, revising drafts, side-by-side compare and restore by other roles: with drafts (feedback-and-versions, slice 4).
  - The retention job and its entries: story-contracts-and-payment-keep-records. Slice 2 only creates the role.
  - The full funder program list: story-funding-program-list.
  - Checking images, audio, video and scanned PDFs, and accepting other document types (spreadsheets, older .doc files): later, each checked if it holds text (approver's decision, 2026-11-12).
  - The S3 transport, SES and any deployment.

## APIs and assumptions

- New dependency: `fflate` 0.8.3 (MIT, no dependencies, maintained), to read a Word document's zip; its text is taken from the `w:t` elements of the XML parts named in AC-25. Its `unzipSync` API is checked against the installed types before use (WA-006).
- New dependency: `unpdf` 2.1.0 (MIT, no dependencies, published 2026-10-30, maintained by the unjs project), for PDF text by page. Its `extractText` API and its options for per-page text are checked against the installed type definitions before use (WA-006). If it cannot run in a Next.js server function, `pdfjs-dist` 6.5.438 (Apache-2.0) is the fallback.
- Uploads are sent with `XMLHttpRequest`, whose `upload` progress events drive AC-10; `fetch` has no upload progress.
- Assumptions that could be wrong:
  - [assumed] `SET ROLE` on each pooled connection is enough to bind the app to `xr_app` in CI, where the connecting user is a superuser. On Aurora the app's login user is made a member of `xr_app` and is not the table owner; checked before deployment.
  - [assumed] Better Auth's tables work under `xr_app` with the default privileges; the end-to-end suite proves it.
  - [assumed] 2 GB uploads to the local folder transport are not exercised in tests; the limit is tested with the declared size, and one large upload is checked by hand.
  - [assumed] Vercel Cron can run every 5 minutes on the plan the project uses. If not, held uploads past their time are already hidden and cannot be confirmed (AC-26), and only the deletion of bytes is late.

## Non-functional requirements

- Accessibility: AC-41 (WEB-001, WEB-002).
- Security: every route checks the session and permission on the server (SEC-002); bodies are validated with `contracts/` schemas; signed upload tokens expire after an hour, name one storage key and one maximum size, and are single use; the job route needs its secret; registration reads the stored size and first bytes, not what the browser declared; no secrets committed (SEC-001).
- Privacy: a hidden fact's value never leaves the server for a person who may not see it, in pages, the API or activity entries; confirmations hold a keyed hash of the matching text, not the text.
- Migrations are generated and applied by the pipeline only (PG-001, PG-003).

## Delivery

- Plan item: design-architecture#build-order, slice 2.
- Pull requests: one, holding the failing tests first (recorded in `tests-commit`) and then the implementation.
- When slice 2 ships, the three lines in `docs/user/organisations-and-projects.md` that say organisation facts come "in a later release" are updated in the same pull request, with the slice 1 spec's hashes for those sections refreshed.

## Risks and decisions

Approver's decisions already made (2026-11-12, in the designs): who sees and edits each fact; four funders until the program list; work samples up to 2 GB; only PDFs checked, scanned PDFs not; held uploads deleted after 24 hours and the deletion logged; the format list per organisation, with patterns of at least 6 `#` or `A` and letters in either case; confirmations logged where the item lives; answers over 100 characters refused with a message; times in the viewer's zone and whole-day filters; the parts of feedback-and-versions and read-activity-log left for later.

Approver's decisions on this spec (2026-11-12):

1. Every fact entry in Activity carries its version number ("Saved the budget (version 2)"), including where a mock-up shows one without.
2. The slice 1 Overview's "No project facts yet." placeholder is removed (AC-1).
3. No funder profile field is required (AC-16).
4. Work samples also take Word documents (.docx), whose text is checked like a PDF's. A file of any other type is refused with "Choose a video, image, audio, PDF or Word file." (AC-10, AC-11, AC-25). More types may be added later. The designs, mock-ups and user documentation were updated to match.
5. Bank account numbers (Canada) match any run of 15 to 20 digits, so a 16-digit card number is named as both (AC-19, AC-22).
6. After saving a funder profile the notice is "Applicant profile for <funder> saved. Every project in <organisation> now reads it." (AC-16).
7. The format list keeps its current state in `identifier_format` and its history in the organisation's activity entries; a version table waits for a story that shows or restores an earlier list. design-identifier-filter was updated to say so.

Other risks:

- The database roles are new and hard to change once the record holds data. They are created by a migration and tested from the start (AC-38).
- The identifier matcher will stop some ordinary text (dates written as long digit runs, order numbers). The confirmation path and turning a format off are the remedies, and AC-19's table of examples records what matches.
- Large uploads to the local transport hold the whole file on disk; the S3 transport sends bytes straight to storage.
