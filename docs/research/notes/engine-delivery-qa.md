# Engine, agent control, delivery, QA/CI: research notes (as of 2026-11-04)

Method: WebSearch/WebFetch on 2026-11-04. Items I could not confirm are marked UNVERIFIED. Several search hits were low-quality aggregators; I relied on Epic and vendor pages where possible.

## 1. Unreal Engine 5.8: what is new

UE 5.8 was announced 2026-06-17, with hotfixes 5.8.1 to 5.8.4 since ([forum announcement](https://forums.unrealengine.com/t/unreal-engine-5-8-released/2729274)). Licence is the standard Epic EULA and royalty terms (UNVERIFIED for 2026; check Epic's licensing page).

| Area | 5.8 fact | Source | Relevance |
|---|---|---|---|
| MCP | Experimental "Unreal MCP" plugin (`ModelContextProtocol`) embeds an MCP server in the editor. Default `http://127.0.0.1:8000/mcp`, HTTP/SSE only (no stdio). Tools come from the "All Toolsets" plugin (Python or C++ `UToolsetDefinition`). Meta-tools: `list_toolsets`, `describe_toolset`, `call_tool`. Config generator supports Claude Code. Loopback only, no auth, no per-action approval, calls run serially on the game thread, editor-only. | [Epic MCP docs](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor) | Core agent surface. Docs are incomplete and toolset registries must be enabled by hand ([forum](https://forums.unrealengine.com/t/unreal-engine-5-8-released/2729274)). |
| Mobile | Multi-pass deferred is the default mobile renderer (forward opt-in). SSAO, SSR, decals, contact shadows, FP16 shaders. The visible notes say nothing about Nanite, Lumen or MegaLights on mobile. | [5.8 release notes](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes) | Mobile quality up. Nanite/Lumen on mobile UNVERIFIED. |
| Lumen/MegaLights | Lumen Lite (about 2x faster than high-quality Lumen), MegaLights production-ready (desktop/console). | [Guru3D](https://www.guru3d.com/story/unreal-engine-58-debuts-lumen-lite-and-productionready-megalights/), [PC Gamer](https://pcgamer.com/software/unreal-engine-5-8-launches-with-improved-terrain-and-vegetation-tools-a-lumen-lite-option-for-faster-global-illumination-and-for-the-times-we-now-live-in-an-open-standard-plugin-for-llm-systems/) | Not a VR/Quest path. Epic's Lumen-on-mobile page covers Android Vulkan SM5 desktop renderer on Adreno 7xx / Mali G7xx / Xclipse only, and no iOS ([Epic docs](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-lumen-global-illumination-on-mobile-in-unreal-engine); may predate 5.8). |
| XR | Experimental Steam Frame support; PICO controller OpenXR plugin on by default in VR Template; stereo layer underlays. visionOS: Xcode 26.1.1 recommended. | [5.8 release notes](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes) | OpenXR-first is the safe route. |
| MetaHuman | MetaHuman Crowd (experimental, Mass); Mesh to MetaHuman; batch API for MetaHuman Animator; single-camera body capture (experimental); MHA facial runs on Linux/macOS, body Windows-only. | same | Mocap and batch automation hooks. |
| Interchange | USD import production-ready, USD level import experimental; uFBX (experimental) for faster FBX. | same | glTF/USD/FBX handoff. |
| Networking | Iris production-ready for licensees. | same | LBVR multi-user. |
| Automation | Horde performance reporting (experimental) on Automated Performance Tests (APT) and Perf Report Tool. | same | Perf-budget CI. |
| Toolchain | VS 2026 recommended (min VS 2022 17.14), Windows SDK 10.0.26100; Android NDK r27c, SDK 35, Gradle 8.7. | same | Build-machine setup. |
| Known issues | Mesh Terrain conflicts with Water plugins; Nanite skeletal meshes with HW RT/Lumen; CPU Lightmass skylight problems; markerless mocap is single-camera only. Forum-reported, not official lists. | [forum](https://forums.unrealengine.com/t/unreal-engine-5-8-released/2729274) | Pin to 5.8.4+ and test. |

Not found for 5.8: any official Python or Blueprint scripting change beyond minor API exposure, any Verse change relevant to non-Fortnite UE, and any Nanite-on-Quest statement. All UNVERIFIED.

## 2. Agent control of Unreal

| Tool | What / version / licence | Write surface | Maturity | Verdict |
|---|---|---|---|---|
| Epic Unreal MCP (5.8) | See above. Experimental, free with UE. | Tool-defined; spawn actors, lighting, material instances cited. Custom toolsets in Python/C++. | New (June 2026), sparse docs, no auth, no approvals. | TRIAL (primary candidate; fix the connection first) |
| [ChiR24 EngineWire / Unreal_mcp](https://github.com/ChiR24/Unreal_mcp) | v0.6.0, MIT, UE 5.0 to 5.8, about 1.0k stars. Single `unreal` gateway tool (search/describe/execute/configure), 23 internal tools. | Very broad: Blueprints, materials, Niagara, PCG, PIE, console, Python, packaging. Safety: loopback, per-project capability token, per-call consent for deletes, path allow-list, blocked console commands. | Active; most safety-aware community option. Commit dates unverified. | TRIAL |
| [runreal/unreal-mcp](https://github.com/runreal/unreal-mcp) | Uses Python Remote Execution, UE 5.4+, npx. | Arbitrary Python (unsafe by design). | Simple, no plugin. | WATCH |
| [db-lyon/ue-mcp](https://awesome.ecosyste.ms/projects/github.com%2Fdb-lyon%2Fue-mcp) | 569+ actions, YAML flow engine; licence "other"; last push 2026-06-06 (tracker). | Read/write. | UNVERIFIED | WATCH |
| [wellingfeng/ue-mcp-for-all-versions](https://awesome.ecosyste.ms/projects/github.com%2Fwellingfeng%2Fue-mcp-for-all-versions) | C++ server over Remote Control HTTP, MIT, created 2026-06. | Remote Control scope. | Young. | WATCH |
| Paid Fab/commercial (Rekall, Strayspark) | Per [search listings](https://www.strayspark.studio/docs/unreal-mcp-server); not evaluated. | n/a | UNVERIFIED | SKIP for now |
| unreal-audit-mcp (yours) | Read-only. | None. | In-house. | ADOPT as the verify/audit half of the loop |
| Python Editor Scripting, commandlets, Remote Control API, Geometry Script | Built into UE (no per-version fetch done; background knowledge, UNVERIFIED for 5.8 changes). | Full editor control; headless via `UnrealEditor-Cmd -run=pythonscript` or commandlets. | Mature. | ADOPT as the deterministic layer under any MCP |
| Blender MCP (ahujasid, localhost:9876) | Needs Blender 3.0+; Blender 5 support UNVERIFIED ([Atlas notes](https://github.com/thekaveh/atlas/wiki/Service-Blender-Mcp)). Headless works with `--background` but no viewport screenshots. | Arbitrary bpy. | Popular, unsandboxed. | ADOPT (you already have an add-on); prefer headless `blender -b -P` for batch export |

Blueprint generation by agents: ChiR24 claims Blueprint graph creation. Reliability is UNVERIFIED. Recommendation: have agents write C++/Python and data assets, and keep Blueprint graphs thin.

## 3. Delivery targets

| Target | Status | Source | Verdict |
|---|---|---|---|
| PC VR (OpenXR) | First-class; VR Template defaults to OpenXR in 5.8. | [release notes](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes) | ADOPT |
| Meta Quest 3/3S | Meta XR plugin mismatch: plugins labelled for 5.8 are built for 5.7.0, causing module load failures; status "investigating" ([Meta bug](https://developers.meta.com/horizon/feedback/vr/investigations/1053459897316880/)). Meta's Unreal page updated 2026-09-30 gives no version matrix ([Meta docs](https://developers.meta.com/horizon/documentation/unreal/unreal-engine)). | | TRIAL; build Quest on 5.7 until Meta ships a matched plugin |
| Android/iOS mobile | Vulkan on Android; iOS Metal, experimental SM6 on A15+; Unreal Engine Remote on Android; Turnkey setup. | [release notes](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes) | ADOPT (mobile renderer) |
| Android XR | Google's Android XR OpenXR plugin plus Extensions plugin (v1.0.0 stable listed); min SDK 34; docs updated 2026-05-19 ([Google](https://developer.android.com/develop/xr/unreal/xr-extensions-quickstart)). | | WATCH |
| visionOS | Xcode 26.1.1 recommended in 5.8 notes; maturity UNVERIFIED. | | WATCH |
| SteamVR / Steam Frame | OpenXR works; Steam Frame experimental in 5.8. | | TRIAL |

## 4. LBVR

- **Meta commercial program ended.** Commercial Quest SKUs and new Horizon Managed Services signups stopped 2026-02-20, existing subscriptions are $0/month, and the program ends 2030-01-04 ([UploadVR](https://www.uploadvr.com/meta-is-shutting-down-its-quest-for-business-program/)). New commercial projects can reportedly use consumer Quest 3/3S with third-party MDM: ArborXR, ManageXR, Ivanti, Intune, Workspace ONE ([XR Today / search summary](https://www.xrtoday.com/?p=57113)). Quest licensing for public LBE use is UNVERIFIED; get Meta's written terms before committing.
- **Backpack vs standalone.** Industry commentary favors standalone: Zero Latency moved to Vive Focus 3 ([Mixed-News](https://mixed-news.com/en/zero-latency-high-end-vr-arcade-upgrades-to-htc-vive-focus-3/)), and a 2025 guide says PC-based VR adds cost without proportional benefit unless you need maximum fidelity ([Anvio](https://b2b.anvio.com/lbe-vr-hardware-guide-20252026-for-vr-business)). Backpack PC is for high-fidelity, MetaHuman-heavy content. Verdict: TRIAL both; decide by visual target.
- **Networking.** Unreal replication with Iris (production-ready in 5.8) plus dedicated servers is the default. nDisplay is for LED walls and CAVEs, not headsets: SKIP (background knowledge, UNVERIFIED for 2026).
- **Tracking (OptiTrack etc.), venue/kiosk software, offline operation.** No 2026 sources found. UNVERIFIED. Treat as an open research item.
- **Pixel Streaming.** Pixel Streaming 2 ships alongside the original and is compatible with its infrastructure ([Epic](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/pixel-streaming-2-overview-in-unreal-engine)); Unreal Engine Remote uses it on Android in 5.8. Good for demo and remote preview, not for free-roam VR latency. WATCH.

## 5. QA/CI

| Item | Notes | Verdict |
|---|---|---|
| UAT / BuildGraph / headless builds | Core to Epic's pipeline; Horde treats BuildGraph as first-class ([Epic Horde docs](https://dev.epicgames.com/documentation/unreal-engine/horde-build-automation-for-unreal-engine?lang=zh-CN)). | ADOPT |
| Automation Framework + Gauntlet | Chain: BuildGraph then Gauntlet (`RunUAT RunUnreal`, `UE.EditorAutomation`) runs Functional Test Blueprints; one user was still debugging it ([forum](https://forums.unrealengine.com/t/buildgraph-blueprint-functional-tests-and-horde/2674538)). | ADOPT |
| GitHub Actions self-hosted runner | Hosted runners lack disk for full UE builds; use self-hosted ([forum](https://forums.unrealengine.com/t/building-and-testing-unreal-engine-on-github-actions/1958824)). | ADOPT (agent-friendly PR gating) |
| Horde | Free, self-hosted, Perforce-centric; 5.8 adds experimental APT trend reports. Git support UNVERIFIED. | WATCH, then TRIAL if on Perforce |
| Perforce vs Git LFS | Perforce is Epic's native path (background); Git LFS fine for small teams, with lock and merge pain on `.uasset`. UNVERIFIED for 2026 pricing. | Git LFS with file locking now; revisit at team scale |
| Profiling | Unreal Insights (5.8 adds World Partition streaming debug), RenderDoc, Quest OVR Metrics Tool. No 2026 fetches; background knowledge. | ADOPT |
| Visual regression | Unreal's screenshot comparison in the Automation system, plus agent capture-and-compare (HighResShot or PIE capture, then image diff). Third-party PerfGuard on Fab ([listing](https://www.fab.com/listings/3af3bee7-22dd-4cf6-be53-364265b4a301)) is vendor-claimed. | TRIAL |
| Data Validation plugin and naming | Built in. unreal-audit-mcp already has `asset_naming`, `asset_broken_references`, `asset_redirectors`. | ADOPT |

Self-verification loop: agent edits via MCP or Python, saves, runs the commandlet or headless PIE, captures a screenshot plus an Insights trace, and compares both against budgets (unreal-audit-mcp as the independent read-only checker).

## 6. Biggest integration risks

1. **MCP is unauthenticated and unprompted.** Epic's server has no auth and no approvals, and community servers can run arbitrary Python or console commands. Mitigate with a git branch per agent run, a disposable project copy, and ChiR24-style tokens and allow-lists.
2. **Version skew.** Meta XR plugin is not matched to 5.8, and community MCP plugin binaries load only on the minor version they were built for ([ChiR24](https://github.com/ChiR24/Unreal_mcp)). Pin the engine per target (5.7 for Quest, 5.8 for PC) until Meta catches up.
3. **Binary assets break merge and review.** Agents editing `.uasset` files via a live editor cause locking conflicts; text-diffable changes (C++, Python, JSON data tables) are safer.
4. **Editor-bound, serial, game-thread tooling.** MCP calls run serially in a GUI editor, so long runs stall, crash, or hang. Both your `unreal` and `rider` MCP connections are failing (ECONNREFUSED); the editor must be running with Auto Start Server on.
5. **LBVR commercial and operational unknowns.** Meta's business-program shutdown, plus unresolved tracking, kiosk, offline update and licensing questions, can invalidate a hardware choice late.

## 7. Biggest unknowns

Nanite/Lumen/MegaLights on Quest and mobile in 5.8; Meta XR plugin date for 5.8; Epic MCP real-world stability; Blender 5 and MCP compatibility; OptiTrack, kiosk and offline content-deploy tooling; Quest commercial licence terms for LBE.
