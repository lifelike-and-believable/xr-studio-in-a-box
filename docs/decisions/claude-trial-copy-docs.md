# Decisions made while revising "Open a trial copy"

## Revision

The lead tried `docs/tutorials/try-xr-studio-in-a-trial-copy.md` and found that its first "Before you start" line made no sense to them. That line repeats "Open a trial copy" in `docs/user/help/trying-xr-studio.md`. The section told the reader to find a link under "Try it" in the description of the change and to sign in to Vercel. Those are this project's development process, not XR Studio. They are not true for every change: only pull requests that touch a tutorial get a "Try it" section, and previews are not connected yet. They would also not outlast development, and the help is meant to. The section now gives the two ways to open a trial copy: `pnpm run try` on your own computer, and a link that the person asking for a decision sends. It names no pull request, heading or hosting service. The link stays, because `story-project-record-try-from-a-link` asks for one for each change waiting for a decision.

No document cites the changed section, so none was updated or re-recorded. `spec-trying-the-product` cites it and becomes an open revision when this merges. The tutorial's own corrections (its first "Before you start" line, and The Lantern Keeper described before the steps make it) are on a separate branch, because tutorials are on the delivery side.
