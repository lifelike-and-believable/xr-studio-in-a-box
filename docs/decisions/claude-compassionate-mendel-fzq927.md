# Decisions made while delivering "Trying the product", step 1

This run was started by the delivery routine with no feature name. `delivery.mjs open` listed one feature: the stories add-person, follow-a-tutorial, set-up-organisation, start-project, try-from-a-link and what-needs-me, whose open user documentation is the "Trying the product" packet (`docs/user/help/` and the new area overviews). Nothing was asked in chat; each choice below is for the lead to judge in the review.

## Choices that most need the lead's eye

1. **This delivery is step 1 of the design's six, not all of them.** design-trying-the-product, "Notes for delivery", says to build in order and that each step ends with something that runs. Step 1 (the try command and sign-in) is self-contained and is what this branch builds, as `docs/specs/trying-the-product.md`. The spec derives from `docs-trying-xr-studio` only, so after this merges the process still lists Help (`docs-help-and-tutorials`, `docs-start` and the area overviews) as open, and the routine starts it as the next delivery. The other steps:
   - Step 2, previews: the lead connects the Vercel project and the Neon integration first (the design's checks only a person can do, and NODE-002). Not started here.
   - Steps 3 to 5, the twelve task tutorials, removing the four old ones and their scripts, and `lasting-tutorials: fail`: each tutorial needs its starting point in the loader. Not started here; the loader is built so that each one adds a function.
   - Step 6, Help: the next delivery, as above.
2. **A thirteenth tutorial.** A delivery needs a tutorial that derives from its user documentation, and none of the design's twelve derives from "Trying XR Studio". This run writes a new one for that page's task, `docs/tutorials/try-xr-studio-in-a-trial-copy.md` (for Morgan, the director). It is the only tutorial **Try XR Studio** lists until step 3 adds the others. If the lead would rather not keep it, step 3 can remove it once tutorial 1 covers the same ground.
3. **Files for the tutorials** is left off **Try XR Studio** while no tutorial on it uses a file. The design's section lists the files the tutorials use; with no such tutorial yet, an empty heading would say nothing. The page shows it once step 3 adds a tutorial with a file.
4. **The preview's file stand-in (files kept in the database, 4 MB at most) is left to step 2.** It exists for previews only. A local trial copy keeps files in its temporary folder, which is what the architecture's table gives for a local copy.
5. **Who signs in first.** At the first starting point Jordan can sign in because `pnpm run try` sets `SIGN_IN_FIRST_ADDRESSES=jordan@xr.test`, the same setting a real new installation uses. The loader writes no person for it: "nothing exists".

## Other choices

- **Emptying is by `TRUNCATE` of XR Studio's tables, named in code**, not by dropping them and migrating again. It keeps the migrations' roles and grants as they are and is one statement. The list is checked by a unit test against the schema, so a new table cannot be missed.
- **The trial line is decided at build time for pages Next.js renders ahead.** `pnpm run try` builds and runs with the same settings, so it makes no difference there. A try build later started with the production setting still shows the line on those pages, which only warns more; every `/try` page and route answers 404 in that case.
- **Sign-in as a person names nobody.** The first sign-in of a first address makes the account with no name, as the ordinary sign-in does, so "Signed in as" shows the address until the person is named in the product.
