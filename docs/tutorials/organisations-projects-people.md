---
id: tutorial-organisations-projects-people
status: approved
runner: manual
derived-from:
  - docs-sign-in: fd75a535d2b1
  - docs-your-projects: b6b8557f98b6
  - docs-organisations-and-projects: e2a19ab061fa
  - docs-people-and-roles: d32ee2eab0f8
---

# Tutorial: start a production and bring in your team

You are Morgan, the first person on a new XR Studio installation. You sign in with an email link, start a project, add an artist and a performer, change the artist's roles, and see what the artist sees. Then you tidy up the organisation, add a passkey and sign out.

<!-- runner: manual, because signing in needs a link from an email. The web runner cannot open the
mail capture folder, so every step after the first sign-in would run signed out. See
docs/decisions/layer1-organisations-projects-people.md. -->

## Before you start

- A disposable Postgres database. In `web/`, set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` to it (see `.env.example`), then run `pnpm run db:migrate`.
- XR Studio running locally. In `web/`, with these also set, run `pnpm run build`, then `pnpm start`. Every step below is on http://localhost:3000.
  - `SIGN_IN_FIRST_ADDRESSES=morgan@example.com`
  - `MAIL_CAPTURE_DIR=<an empty folder>`. Each email is written there as a JSON file, named by the time it was sent. Nothing leaves your machine.
  - `APP_ORIGINS=http://localhost:3000`, `PASSKEY_RP_ID=localhost`, `PASSKEY_ORIGINS=http://localhost:3000`
  - `BETTER_AUTH_SECRET=<a random string>`, for example from `openssl rand -hex 32`
- A browser with a passkey provider (your device or a password manager) for steps 18 to 20, and a private window for steps 11 and 12.

"The newest email to <address>" below means the newest file in the mail folder whose `to` is that address. Copy the link from its `text`.

You have not given yourself a name, so XR Studio shows your email address, `morgan@example.com`, wherever it would show your name.

## Steps

### Sign in as the first person

1. Open http://localhost:3000. You see **Sign in**.
2. Type `morgan@example.com` into **Email address** and select **Email me a sign-in link**. You see **Check your email**.
3. Open the newest email to morgan@example.com. Its subject is "Your XR Studio sign-in link". Open its link in the same browser. You see **Projects** and "You are not on any projects.", with **Start a project** and **Create an organisation**.

### Start a project

4. Select **Start a project**. Type `The Lantern Keeper` into **Project name** and `A lighthouse keeper's last night, told with puppets.` into **Brief (optional)**. **Organisation** says "A new organisation with the same name as the project will be made." **Owner** is "morgan@example.com (you)". **When you start it** says "You will own it and have the Director and Producer roles."
5. Select **Start project**. The project's **Overview** opens with "Project started. You own it and have the Director and Producer roles."
6. Select **XR Studio** in the header. **Projects** lists The Lantern Keeper with "Organisation: The Lantern Keeper", "Your roles: Director, Producer" and an **Owner** tag.

### Add people

7. Select **The Lantern Keeper**, then **People**. You are listed with Director and Producer, **Owner** and **Signed in**.
8. Select **Add a person**. Type `riley@example.com` into **Email address** and `Riley Chen` into **Name (optional)**. Tick **Artist** and **Sound designer**. **Before you add Riley Chen** says "They will be able to open the project in the dashboard. They will get an invitation email with a link that works once, for 7 days." Select **Add person**. You see "Riley Chen added as Artist and Sound designer. We have emailed riley@example.com an invitation link that lasts 7 days." Riley shows **Invited, not signed in yet**.
9. Select **Add a person** again. Type `kai@example.com` into **Email address** and `Kai Morin` into **Name (optional)**, tick **Performer** and select **Add person**. You see "Kai Morin added as Performer. XR Studio has not emailed Kai Morin: Performer does not use the dashboard." and the rest of the notice. Kai shows **No dashboard access**, and the mail folder has no email to kai@example.com.
10. At least a minute after adding Riley, select **Send the sign-in link again** beside Riley Chen. You see "We have sent Riley Chen a new invitation link to riley@example.com. It lasts 7 days. You can send another in a minute."

### See what Riley sees

11. In a private window, open the link in the older of the two emails to riley@example.com. You see **This sign-in link no longer works**, because the newer invitation replaced it. Now open the link in the newest email to riley@example.com (subject "You have been added to The Lantern Keeper in XR Studio"). Riley is signed in on the project's **Overview**, which shows the name and brief and no **Edit name and brief**. Select **People**: Riley sees the list, "Ask morgan@example.com to add people or change roles.", and no **Add a person**.
12. Back in your own window, on **People**, select **Change roles or remove** beside Riley Chen, untick **Sound designer** and select **Save roles**. You see "Riley Chen's roles saved: Artist." In the private window, reload **People**: Riley's roles now read Artist, and Riley is still signed in. Close the private window.
13. Select **Change roles or remove** beside Kai Morin, then **Remove Kai Morin from the project**, then **Remove Kai Morin**. You see "Kai Morin removed from The Lantern Keeper. Their past work stays on the project."

### Tidy up the project and organisation

14. Select **Overview**, then **Edit name and brief**. Change **Brief (optional)** to `A lighthouse keeper's last night, told with puppets and light.` and select **Save changes**. You see "Name and brief saved."
15. Select **Organisations** in the header. The Lantern Keeper is listed, and **You** reads "Look after it". Select it. You see **Looked after by**, **Start a project in this organisation**, **Edit organisation**, **Organisation facts** and **Projects**. Because you look after it, you also see **Identifier formats** and **Activity**. [Organisation facts](../user/organisation-facts.md) covers those sections.
16. Select **Edit organisation** and change **Organisation name** to `Lantern Works`. Under **Looked after by**, your own tick cannot be removed, because you are the only person looking after it. Select **Save changes**. You see "Organisation saved."
17. Select **XR Studio**, then **The Lantern Keeper**. In the header, select **Project: The Lantern Keeper**. Your projects are listed under Lantern Works, with **All projects** after them. Select **All projects**. You see **Projects**.

### Passkey and sign out

18. Select **morgan@example.com** at the top of the page, then **Your account**. Under **Passkeys**, select **Add a passkey** and confirm in your browser or password manager. The passkey is listed with the device it was made on and today's date, for example "Chrome on Linux. Made on 12 November 2026."
19. In the account menu, select **Sign out**. You see **You are signed out**. Select **Sign in again**, then **Sign in with a passkey**, and confirm. You see **Projects**.
20. Select **morgan@example.com**, then **Your account**. Select **Remove** beside the passkey. You see "Passkey removed. You can no longer use it to sign in."

## What you made

A project, The Lantern Keeper, in the organisation Lantern Works, which you own and look after. Riley Chen is on it as an Artist and can see it but not change it. Kai Morin was added as a Performer, which needs no dashboard account, and then removed. You signed in with an email link and with a passkey.

Next: read [People and roles](../user/people-and-roles.md) for what each role gives, and [Organisations and projects](../user/organisations-and-projects.md) for creating an organisation first and starting projects in it.

## Walk record

Walked on 2026-11-12 by the delivery agent, against a production build of this branch (`pnpm run build`, `pnpm start` in `web/`) on http://localhost:3000, with a fresh local Postgres 16 database, Node 26.13.1 and pnpm 12.18.0. A Playwright script performed each step in Chromium as written here, read the links from the mail capture folder, used a second browser context as the private window, and a virtual authenticator as the passkey provider. Every step gave the result written above.

| Step | Result |
|---|---|
| 1 to 3 | **Sign in**, then **Check your email**; one email, subject "Your XR Studio sign-in link"; its link opened **Projects** with "You are not on any projects." |
| 4 and 5 | The form showed the default-organisation line, "morgan@example.com (you)" and the roles line; **Start project** opened the **Overview** with the notice. |
| 6 and 7 | **Projects** showed the project, its organisation, "Your roles: Director, Producer" and **Owner**; **People** showed Morgan as **Owner**, **Signed in**. |
| 8 to 10 | Both notices as written; Riley **Invited, not signed in yet**, Kai **No dashboard access**, no email to Kai; the resend notice after waiting 61 seconds. |
| 11 | The older invitation showed **This sign-in link no longer works**; the newer one signed Riley in on the **Overview** with no edit button; **People** showed the "Ask morgan@example.com" line and no **Add a person**. |
| 12 and 13 | "Riley Chen's roles saved: Artist."; Riley's reload showed Artist and stayed signed in; Kai's removal notice as written. |
| 14 to 17 | "Name and brief saved."; **Organisations** showed "Look after it"; the organisation page showed all seven parts; Morgan's **Looked after by** box was disabled; "Organisation saved."; the switcher grouped the project under Lantern Works and **All projects** returned to **Projects**. |
| 18 to 20 | The passkey was listed as "Chrome on Linux. Made on 12 November 2026."; sign out, then passkey sign-in, landed on **Projects**; the removal notice as written. |

Walked again on 2026-11-13 after merging `main`, which added slice 2 (organisation facts, identifier formats and activity) and closed the account menu on a page change. Every step gave the result written above.

Seen on the first walk, recorded in `docs/decisions/layer1-organisations-projects-people.md`: the account menu stayed open after **Your account** was selected. `main` has since fixed it.
