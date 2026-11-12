# Decisions made while delivering layer1-facts-identifiers-activity

Choices the approved user documentation, designs and spec left open, made during delivery. Each takes the most conservative reading. Nothing is set aside: every criterion has its test, and the tutorial was run.

## Identifier matching

1. **Where a match may stop (AC-19 (c)).** Read literally, "a match must not continue into a further letter or digit on either side" stops the documentation's own example: rule (a) joins "account" and "00123-004-1234567" (the space lies between a letter and a digit), so the digits would sit next to the letter "t". The matcher instead stops a match from continuing into a further character *of the same kind as its own end*: a digit next to a digit, a letter next to a letter. 9 digits inside a 15-digit run are still not a Business Number, and the documented examples all match. AC-19's table of examples in `contracts/test/identifiers.test.ts` records the outcome, including `account 2041-HP-11872` (no match) and `Order 123456789` (Business Number).
2. **Overlapping matches.** A match lying wholly inside a longer one is part of the longer one, so "123456789 RT0001" is named as a GST/HST number only, as the documentation's held-document example says, and not also as a Business Number. Matches of the same span are one match naming each format (a SIN and a Business Number; a 16-digit card number and a bank account number, decision 5 of the spec).
3. **Saves covered by an earlier confirmation.** A version saved while its matching text was covered by an earlier confirmation (AC-24) records that confirmation, as a confirmed save does. AC-32's exception ("versions saved through a confirmation") therefore includes those versions, which hold text a person already confirmed.
4. **The keyed hash.** Confirmations hold an HMAC of the matching text, keyed from `BETTER_AUTH_SECRET`. Rotating that secret means earlier confirmations no longer cover their text, and the person is asked to confirm it again; nothing is let through. For a held file, the hash is of the matching text read again from the file when it is confirmed.

## Pages and wording the documents do not give

5. **Project pages inside the project frame.** Edit, confirm, earlier versions, compare and work samples for a project sit inside the project's frame (organisation link, project name as the page's `h1`, tabs), with the page's own heading as `h2`, as slice 1's **Edit name and brief** does. The mock-ups draw them with a breadcrumb and their own `h1`. Organisation pages have their own `h1` and a breadcrumb, as drawn.
6. **Compare is a state of the history page** (`.../history?compare=<n>`), since decision-navigation-and-urls gives one address for "earlier versions and compare". The work samples' history is at `.../work-samples/history` (projects) and `/organisations/<id>/work-samples/history`.
7. **Handing text to the confirm page.** "It is not a <format>" sends the box's text to the confirm page through the browser's session storage, never through an address or a server-side draft, so text that looks like an identifier is not stored anywhere the filter guards. Opening the confirm address directly says there is nothing to confirm and links back to the edit page.
8. **The notice after confirming** quotes the confirmed text ("Your confirmation that "…" is not a bank account number…"). The text travels to that page in a one-minute, HTTP-only cookie, not in the address.
9. **A restore stopped by the filter** opens the fact's edit page with the earlier text in the box and the "Not saved" summary (`.../edit?restore=<n>`). Confirming from there saves it, marked "restored from version <n>" when the text was not changed.
10. **Notices not worded in the documents:** after an upload, "<title> added to the work samples." (or "the standard work samples"); after confirming a held file, "<title> added to the work samples. Your confirmation that <file> does not have a <format> is recorded in Activity."; after **Delete <file> now**, "<file> deleted.". The held file's confirm page is headed "Confirm <file> does not have a <format>", with **Confirm and add <file>** and **Go back**.
11. **Stop uploading** returns to the form with the title kept and no message; nothing joins the record.
12. **Funder profiles on the organisation page** show whether each is recorded and who last changed it, as the mock-up does, not the profile's text. The text is read on its **Earlier versions** page and through the API, by the people AC-18 names.
13. **An added format's "What it matches"** reads "the pattern ###-AA-#####, like 123-AB-45678", made from the pattern.
14. **The filtered activity's result line** sits above the filters rather than below them as drawn. It takes focus after **Apply filters**; with it below, the next Tab left the page when there were no **Older entries**.
15. **Dates** are shown as in the mock-ups, without a year ("12 November at 14:20").
16. **Who edits** on a read-only Facts tab lists the people holding the Director or Producer role, joined with "and".

## Records and storage

17. **Upload states.** The spec lists pending, held and deleted. An upload that joined the record is marked `added` and keeps its file id, so registering it again answers with the same result and adds nothing (AC-10).
18. **A PDF whose text cannot be read** joins the record unchecked, as a scanned PDF does (AC-25 "PDFs with no extractable text").
19. **Starter formats for slice 1's organisations** are added by the roles migration with `gen_random_uuid()` ids, since PostgreSQL 16 (used locally) has no `uuidv7()`. Formats made by the app have UUIDv7 ids.
20. **The upload route** checks a signed token naming one storage key and size; the token is single use because the route refuses a key that already holds bytes.

## Findings

- None of the approved documents needed a change to match what was built. The three lines in `docs/user/organisations-and-projects.md` that said organisation facts come "in a later release" were updated as the spec's Delivery section asks, and the slice 1 spec's hashes for those two sections refreshed.
