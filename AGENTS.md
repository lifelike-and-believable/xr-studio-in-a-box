# Agent rules

## Development process

This project uses rfr-process. See the [rules-for-robots README](https://github.com/lifelike-and-believable/rules-for-robots#readme).

- Agents do not merge pull requests that touch `docs/product/`, `docs/design/`, `docs/user/`, or `docs/tutorials/` unless the approver explicitly says to. When the approver does, the agent comments on the pull request quoting the instruction.
- Artifacts are approved by a pull request that sets `status: approved` and records hashes.
- The project combines web apps, Unreal plugins and possibly Claude plugins as sub-projects, so no single rfr-process profile applies. Pick the template that fits each sub-project.

## Preferences

Read `docs/preferences.md` before design, interface, or documentation work, and add to it when the project lead corrects something.
