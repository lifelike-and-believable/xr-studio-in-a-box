---
id: tutorial-keep-bank-details-and-tax-numbers-out
status: draft
runner: manual
starts-from: tutorial-start-a-production-and-bring-in-your-team
derived-from:
  - docs-identifier-filter: 9a666784553c
---

# Keep bank details and tax numbers out

For **Jordan, the producer**.

You see XR Studio stop a number that looks like a bank account or tax number, confirm a false match, see a file with a tax number held, and keep the organisation's list of identifier formats.

<!-- runner: manual, because step 3 chooses a file, which the tutorial runner cannot do yet. -->

## Before you start

- Jordan Lee is the producer of The Lantern Keeper and looks after Harbourfront Puppet Co.
- The file `grant-letter.pdf`, from **Files for the tutorials** on Try XR Studio in a trial copy. It is a made-up letter whose second page has a made-up GST/HST number. Never use a real one.

## Steps

1. Sign in as **Jordan**. Click **Projects**. Click **The Lantern Keeper**. Click **Facts**. Click **Add plan**. Type `Build the lantern prop, catalogue 00123-004-1234567, in March.` into **Plan**. Click **Save plan**. You see **Not saved: this looks like a bank account number**.
2. Click **It is not a bank account number**. Type `Catalogue number for the lantern prop` into **What is it?**. Click **Confirm and save plan**. You see **Plan saved.**
3. Click **Add work samples**. Type `Grant letter` into **Title**, choose the PDF `grant-letter.pdf`, and click **Add work sample**. You see **Not added: grant-letter.pdf looks like it has a GST/HST number**. Open the work samples again: the file is listed as **Held**. Click **Delete grant-letter.pdf now**.
4. Click **Harbourfront Puppet Co.**. Click **Identifier formats**. Click **Add a format**. Type `Funder account number` into the name, `###-AA-#####` into the pattern, and `204-HP-11872` into **Try it with an example**. Click **Add format**. You see **Funder account number added.**
5. Click **Turn off** beside Business Number, then **Turn off** in the dialog. Click **Turn on**. You see **Business Number turned on.**

## What you made

A plan saved after you confirmed its number is not a bank account number, a held file deleted, and a new identifier format. Every confirmation is in the activity log. Next: [Name who approves what](name-who-approves-what.md).
