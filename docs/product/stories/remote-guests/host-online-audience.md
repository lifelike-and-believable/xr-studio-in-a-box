---
id: story-remote-guests-host-online-audience
status: approved
derived-from:
  - epic-remote-guests#outcome: b4af335ea8ee
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Set up hosting for the online audience

As Sam, the technical artist, I want to set up where the player page, the cloud sessions and the installed app's download are hosted, each as an integration, so that I can add or change a hosting service or cloud provider without modifying the core.

## Acceptance criteria

- Sam sets up, in production mode (story-show-safety-switch-modes) and without code, the hosting service and web address of the show's player page (story-remote-guests-player-guest), the cloud provider for cloud sessions (story-remote-guests-interactive-guest) and its data region, and where guests download the installed app. Each is an integration behind the adapter (story-agent-work-tool-adapter), so one can be replaced without changing the show or the others. No provider is fixed for the first release: each is chosen when a show needs it.
- Before a provider's first use with guests, the person the project records as holding the contracts and licence terms approval checks its terms on guest data and its data region against the show's data declaration (story-guest-care-guest-data) and records each as allowed or in conflict, with the date of the terms checked, as for a platform's terms (story-outputs-and-streaming-approve-going-live). A provider with an open conflict cannot serve guests. An agent can prepare the check but cannot record it.
- Stream keys, provider credentials and hosting accounts are kept in the protected store (story-contracts-and-payment-protect-sensitive-data). Agents never see them, and only a person whose role allows it enters or changes them.
- The installed app's download is the delivered build for that target (story-build-and-install-build-from-stages). Guests see its version and size before downloading, and a build rolled back on the show machine (story-build-and-install-install-and-roll-back) is rolled back in the download too.
- Cloud session costs are counted against the project's spend limit (story-agent-work-spend-limit) as in story-remote-guests-move-past-the-limit. Making the player page public needs the going-live approval (story-outputs-and-streaming-approve-going-live).
- The story is tested with a test web address and a cloud provider's test account on a private network, with simulated guests, and with the provider replaced once by a second test provider.
