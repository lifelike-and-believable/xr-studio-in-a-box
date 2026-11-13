---
id: tutorial-layer1-facts-identifiers-activity
status: draft
runner: manual
derived-from:
  - docs-project-facts#see-a-projects-facts: 774a71278ca6
  - docs-project-facts#edit-a-fact: db1322b2c494
  - docs-project-facts#what-each-fact-takes: f64f8be4323d
  - docs-project-facts#earlier-versions-of-a-fact: 7594707ec40b
  - docs-project-facts#restore-an-earlier-version: e6a1a566cc6e
  - docs-project-facts#add-and-remove-work-samples: 828909e4fe9f
  - docs-project-facts#if-someone-else-saved-while-you-were-editing: b8e1fa637765
  - docs-project-facts#who-can-do-this: f4272b6f3cef
  - docs-project-facts#if-something-goes-wrong: af88e7394ff6
  - docs-organisation-facts#see-an-organisations-facts: a722562a44db
  - docs-organisation-facts#how-projects-use-them: f7ee4047175d
  - docs-organisation-facts#edit-an-organisation-fact: e097e2ed51eb
  - docs-organisation-facts#record-a-funder-applicant-profile: b206e3df8807
  - docs-organisation-facts#add-standard-work-samples: bbe6e558b563
  - docs-organisation-facts#who-can-do-this: 391b66dbf2a8
  - docs-organisation-facts#if-something-goes-wrong: df98e90fc407
  - docs-identifier-filter#what-is-checked: e96f28321b42
  - docs-identifier-filter#text-that-looks-like-an-identifier: bce1c6f3fe21
  - docs-identifier-filter#text-that-matches-several-formats: ee996ea08b1a
  - docs-identifier-filter#a-document-that-is-held: b08dcaad8d4f
  - docs-identifier-filter#keep-the-list-of-identifier-formats: db86c84deaac
  - docs-identifier-filter#add-a-format: 9d80a29462bc
  - docs-identifier-filter#turn-a-format-off-or-on: 68454952c132
  - docs-identifier-filter#remove-a-format-you-added: 5d639a925d3a
  - docs-identifier-filter#who-can-do-this: faf12f82ab66
  - docs-identifier-filter#if-something-goes-wrong: d37c31c290fa
  - docs-activity-log#read-a-projects-activity: 76e7c3f0a37c
  - docs-activity-log#filter-the-activity: e8704792ef26
  - docs-activity-log#read-an-organisations-activity: 84e9dc528bd7
  - docs-activity-log#entries-nobody-can-change: 1fbbb53961e4
  - docs-activity-log#who-can-do-this: 34d9091ea09f
  - docs-activity-log#if-something-goes-wrong: df47be0ba235
---

# Tutorial: record a project once, keep identifiers out, and read who changed what

You are Jordan, the producer. You set up Harbourfront Puppet Co. and its project The Lantern Keeper, record the project's facts once, see a bank account number stopped before it is saved, add work samples, give the organisation its bio, keep the list of identifier formats, and read the activity log. Last, you see the same facts as Riley, an artist.

<!-- The runnable script is web/e2e/tutorial-facts.spec.ts, which cites tutorial-layer1-facts-identifiers-activity. -->

## Before you start

- A local copy of the repository with Node 26.13.1 and pnpm 12.18.0, and a disposable PostgreSQL database. Put `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in `web/.env` (see `.env.example`).
- Apply the migrations: `pnpm --filter @xr/web run db:migrate`.
- Build and start the app: `pnpm --filter @xr/web run build`, then start it with the settings `.env.example` lists set in `web/.env` (sign-in, `MAIL_CAPTURE_DIR`, and for this slice `STORAGE_DIR`, `STORAGE_SIGNING_SECRET` and `CRON_SECRET`): `pnpm --filter @xr/web exec next start -p 3000`, then open http://localhost:3000. Every page below is on that server.
- Your address is in `SIGN_IN_FIRST_ADDRESSES`. Sign-in links arrive as files in `MAIL_CAPTURE_DIR`.
- A small image (PNG) and a PDF whose second page holds the text `GST 123456789 RT0001`.

Or run every step at once: `pnpm --filter @xr/web run e2e -- e2e/tutorial-facts.spec.ts`.

## Steps

1. **Set up.** Sign in. Under **Organisations**, create **Harbourfront Puppet Co.**, then select **Start a project in this organisation** and start **The Lantern Keeper**. The project's Overview opens, with **Organisation: Harbourfront Puppet Co.** above its name and the tabs **Overview**, **Review**, **Facts**, **People**, **Approvers** and **Activity**.
2. **See the Facts tab.** Select **Facts**. Description, Plan, Budget, Credits, Collaborators, Schedule, Work samples and Capacity are listed in that order, each "Not recorded yet." with **Add**. Under **From Harbourfront Puppet Co.**: "Harbourfront Puppet Co. has no facts recorded yet. People who look after it add them on its page."
3. **Add the description.** Select **Add** beside Description, type a sentence about the show, and select **Save description**. Facts opens with "Description saved." and the description shows "Last changed by <you>, <date> at <time>", in your own time zone.
4. **Add the budget.** Select **Add** beside Budget. Type `$148,000` in **Total in Canadian dollars** and a note, and select **Save budget**. The budget reads "Total: $148,000 CAD. Note: …".
5. **Add the capacity, with a mistake.** Select **Add** beside Capacity, type `forty` guests and `200` viewers, and select **Save capacity**. The error summary takes focus: "Enter the number of guests in the room as a whole number, like 40." Both values are still in their boxes. Change `forty` to `40` and save: "40 guests in the room and 200 viewers online, per show."
6. **Change, compare and restore.** Select **Edit** beside Description, change the text and save. Select **Earlier versions** beside it: version 2 is "(current)". Select **Compare with current** beside version 1: added words are underlined, removed ones struck through, and both versions are written out below. Select **Restore version 1**; the dialog asks "Restore version 1 of description?" with **Keep the current description** first. Select **Restore version 1**: "Description restored to version 1, saved as version 3. Earlier versions are kept."
7. **See an identifier stopped, and confirm a false match.** Select **Add** beside Plan and type `Build the lantern prop, catalogue 00123-004-1234567, in March.` Select **Save plan**. Nothing is saved: "Not saved: this looks like a bank account number", with the number marked. Select **It is not a bank account number**, type `Catalogue number for the lantern prop` under **What is it?**, and select **Confirm and save plan**: "Plan saved. Your confirmation that "00123-004-1234567" is not a bank account number is recorded in Activity."
8. **Add work samples.** Select **Add** beside Work samples. Type the title `Lantern test`, choose the PNG, and select **Add work sample**; a progress bar shows while it uploads, then "Lantern test added to the work samples." and the sample is in the table. Now add the PDF titled `Grant letter`. It is not added: "Not added: grant-letter.pdf looks like it has a GST/HST number", "Page 2 of grant-letter.pdf has text matching the format for a GST/HST number", and the time it will be deleted. Open the work samples page again: the file is listed as **Held** with its deletion time. Select **Delete grant-letter.pdf now**: "grant-letter.pdf deleted."
9. **Remove a sample and bring it back.** Select **Remove** beside Lantern test, then **Remove Lantern test** in the dialog: "Lantern test removed from the work samples. It stays in the earlier versions of Work samples." Select **Earlier versions**, then **Restore** beside version 1 and **Restore version 1**: "Work samples restored to version 1, saved as version 3. Earlier versions are kept." Lantern test is back.
10. **Give the organisation its bio.** Select **Organisation: Harbourfront Puppet Co.**. **Organisation facts** sits between **Looked after by** and **Projects**. Select **Add** beside Bio, type the bio and select **Save bio**: "Bio saved. Every project in Harbourfront Puppet Co. now reads the new bio." Open the project's **Facts** tab: the bio is under **From Harbourfront Puppet Co.**
11. **Record a funder applicant profile.** On the organisation's page, select **Add** beside Canada Council for the Arts. Fill in the applicant name, category and mandate and select **Save profile**: "Applicant profile for Canada Council for the Arts saved. Every project in Harbourfront Puppet Co. now reads it."
12. **Keep the identifier formats.** Select **Identifier formats**. The five starter formats are On. Select **Add a format**, name it `Funder account number`, type the pattern `###-AA-#####`, and type `204-HP-11872` under **Try it with an example**; when you leave the field it says ""204-HP-11872" matches this pattern." Select **Add format**: "Funder account number added. It is checked from now on; text already saved is not changed." Select **Turn off** beside Business Number, then **Turn off** in the dialog; the row shows **Off**. Select **Turn on**: "Business Number turned on. It is checked from now on; text already saved is not changed."
13. **Read the project's activity.** Open the project's **Activity** tab. Every change is there, newest first, including "Saved the plan (version 1) after confirming that text in it is not a bank account number ("Catalogue number for the lantern prop")", "Restored the description to version 1, saved as version 3" and "Deleted grant-letter.pdf, held because its text looked like it had a GST/HST number". Choose **Facts** under **Area** and select **Apply filters**: focus moves to a line such as "12 entries: Facts."
14. **Read the organisation's activity.** On the organisation's page, select **Activity**. It lists "Saved the bio (version 1)", "Added the identifier format "Funder account number"" and the other changes to the organisation, and nothing from the project.
15. **See it as an artist.** On the project's **People** tab, add Riley Chen as an Artist and follow Riley's invitation link in another browser. On **Facts**, Riley sees the facts without **Edit** or **Add**, a line naming who edits them, and "The budget is visible to the director and producer." in place of the budget. Riley has no **Activity** tab.

## What you made

The Lantern Keeper's facts are recorded once, with every version kept and who saved each; the organisation's bio and funder profile are read by each of its projects; a bank account number was stopped before it was saved, and a catalogue number was saved with your confirmation on record; and the activity log shows each change. Next, see [Project facts](../user/facts/project-facts.md), [Organisation facts](../user/organisations/organisation-facts.md), [Bank details, tax numbers and identifier formats](../user/organisations/identifier-formats.md) and [Activity](../user/activity/activity.md).

## Run record

The tutorial's runner is manual: its steps follow a sign-in email and upload files, which the web runner's step grammar cannot express. Its author walked it with a script instead. Run on 2026-11-12 against a local production build (`next start`) and PostgreSQL 16, by the script `web/e2e/tutorial-facts.spec.ts`, which follows the steps above in order with the values given. Every step gave the result written in it; the run passed in 7.4 seconds. The same steps' screens are also covered, one criterion each, by the slice's end-to-end tests, which passed in the same session with `pnpm verify`.
