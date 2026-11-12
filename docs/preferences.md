# Preferences

The project lead's corrections, kept so each is given once. Read the relevant area before design, interface, or documentation work. When the lead corrects something, apply it, add or update the line here in the same pull request, and name it in your report. A preference that contradicts an older one replaces it.

One line each: the preference, the date, and where it came from (an issue, a pull request, or a review).

## Interface

## Wording

- No pithy analogies of the form "It's not just X, it's Y" or similar idiomatic devices. 2026-11-12, the lead's standing preferences.
- Avoid em dashes. 2026-11-12, the lead's standing preferences; also applied to every product document.
- Avoid metaphors and similes, unless explaining something to non-experts. 2026-11-12, the lead's standing preferences.
- Product documents use British spelling ("behaviour", "licence") and plain, short sentences. 2026-11-12, the Layer 1 to 7 story reviews.
- Stories use the persona wording "As <Name>, the <role>," exactly; CI's process-trace rejects other forms. 2026-11-12, PR #83 review.

## Code

## Tooling

- Never force-push (including `--force-with-lease`) or take any other action that raises a permission prompt when a prompt-free route exists. To bring a work branch up to date, merge `main` into it; do not reset it onto `main`. 2026-11-12, the lead in session after a force push prompted.

- Use the latest version of every tool, plugin and reusable workflow everywhere; the rfr-process workflow follows rules-for-robots `@main`. 2026-11-12, the lead in session (PR #312).
- Merge a pull request touching gated product docs only when the lead says so ("merge", "merge N", "merge when green"), then comment on it quoting the instruction. 2026-11-12, AGENTS.md and the lead in session.
