# Autonomous characters at runtime: research notes (as of 2026-11-04)

Sources are web results fetched 2026-11-04. Vendor claims are marked as such. UNVERIFIED = not confirmed from a primary source.

## 0. Context facts
- UE 5.8 released 2026-06-17; 5.8.1-5.8.3 patches exist. It ships an experimental MCP plugin (LLM-to-editor) and automated Android SDK setup. The release thread did not mention StateTree, Smart Objects or Quest. https://forums.unrealengine.com/t/unreal-engine-5-8-released/2729274
- MetaHuman is now MIT-licensed, with MetaHuman Animator markerless capture from a single webcam. https://knowledge.edge-online.com/p/ai-goes-native-in-unreal-engine-the-five-main-takeaways-from-state-of-unreal-2026 (2026-06-19)
- UE6 early access is expected late 2027 (approximate, same article). Plan for plugin churn.
- A community BT-to-StateTree converter exists for 5.8, which suggests StateTree is the direction. https://forums.unrealengine.com/t/behavior-tree-to-statetree-converter-keeps-your-blackboard-and-names-every-node-it-cant-translate-ue-5-8/2844144
- Known 5.8 StateTree bug: a state whose tasks are all marked "not affecting completion" may complete as Succeeded. https://forums.unrealengine.com/t/ue-5-8-statetree-a-state-with-tasks-all-marked-as-not-affecting-completion-may-incorrectly-complete-as-succeeded/2740370

## 1. LLM brains

| Option | Current facts | Latency | Cost | UE 5.8 / platform | Verdict |
|---|---|---|---|---|---|
| Claude Haiku 5.5 (`claude-haiku-5-5`) | Fastest in the lineup. 1M context, adaptive thinking, retirement not before 2027-10-07. https://platform.claude.com/docs/en/models/overview | No official TTFT. Latency is "fastest" relative to the other models. Measure it yourself. | From $0.10 / $0.50 per MTok in/out. Cache reads are 10% of input price. Batch is 50% off. | HTTPS/SSE from C++ (HTTP module); works on PC, Android, Quest, iOS. No official UE plugin. | **ADOPT** for the dialogue and intent tier |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | "Fast", $2 / $10 per MTok, same overview page | Moderate | About 20x Haiku input price | Same | **TRIAL** for hero NPCs, director or planner roles, and offline persona authoring |
| Claude Opus 5.5 / Fable 5.1 | $4/$20 and $10/$50 per MTok, same page | Slower | High | Same | **SKIP** at runtime. Use for authoring and evals. |
| Older Haiku 4.5 | Third-party TTFT ranges: ~0.35-1.0 s non-reasoning, 11+ s with reasoning on. https://artificialanalysis.ai/models/claude-4-5-haiku/providers | Reasoning mode is unusable for voice. | $1/$5 per MTok | n/a | Reference only |
| Local llama.cpp UE plugins | A Fab runtime plugin wraps llama.cpp (GGUF, streaming, BP+C++). The listing claims CPU intrinsics on Android and Quest and Vulkan on Windows and Linux. UE version support is not stated. https://forums.unrealengine.com/t/runtime-local-llm-llama-cpp/2718296 , https://www.fab.com/listings/47d00943-f8ef-4acf-9861-68a51d478766 | No Quest tokens/sec figures found: UNVERIFIED | No per-session cost; adds app size and thermal load | PC good. Android and Quest are possible but a CPU-bound 4B model competes with the render budget. | **TRIAL** on PC venue servers. **WATCH** for headset-resident use. |
| NVIDIA on-device SLMs (Nemotron 3.5 Bolt E4B Q4_K_M ~4 GB, Nemotron 3 Nano 4B/9B, Qwen 3.5 4B) | Listed on NVIDIA ACE page. https://developer.nvidia.com/ace-for-games | n/a | NVIDIA GPU needed | PC only in practice | **TRIAL** for offline LBVR host PCs |

Cloud caveats: first-token latency is only one part of a voice loop (see section 3). Use streaming, short outputs, prompt caching, and `thinking` off or low on the voice path. Safety: server-side system prompt, an output classifier and an allow-listed action schema (section 5). Do not rely on model refusal alone.

## 2. Character-AI platforms and middleware

| Product | Status and licence | UE 5.8 maintenance | Verdict |
|---|---|---|---|
| NVIDIA ACE (Audio2Face-3D, ASR, TTS, character LLM, Game Agent SDK) | A2F-3D SDK is MIT, CUDA 12.8+ / TensorRT 10.13+, Windows and Linux only. https://github.com/NVIDIA/Audio2Face-3D-SDK . Models are open weights under the NVIDIA Open Model License. Audio2Emotion has a custom licence. The training framework is Apache. Game Agent SDK is Beta v0.5.0. https://developer.nvidia.com/ace-for-games | Unreal A2F plugin v2.5.0rc3 targets UE 5.5/5.6 (v2.4.0 for 5.4). ASR, TTS and character plugins list UE 5.5-5.7. **No UE 5.8 build listed.** Quest and Android are not supported (NVIDIA GPU / CUDA). | **TRIAL** A2F-3D on PC and server-rendered setups. **WATCH** the rest. |
| Convai | UE plugin on Fab and GitHub. Docs say 5.8 support landed in `4.0.0-beta.23`, `ConvaiToolset` (AI-callable actions and MCP tooling) in `4.0.0-beta.24`, and releases are smoke-tested on 5.6, 5.7 and 5.8. Older versions load without actions. https://docs.convai.com/api-docs/plugins-and-integrations/convai-unreal-engine-plugin/compatibility-and-requirements/unreal-engine-versions . Pricing: UNVERIFIED (third-party listings conflict). | Actively maintained, but still beta and cloud-hosted. A cloud dependency is a problem for offline venues. | **TRIAL** as a rapid-prototype comparator |
| Inworld | Docs now lead with Voice (TTS, STT, Realtime API) and Inference. No Unreal mention was found on the docs home. https://docs.inworld.ai/ Third-party pages claim a UE 5.3+ C++ SDK and conflicting prices. https://www.eesel.ai/blog/inworld-ai-pricing | UE plugin status for 5.8: UNVERIFIED | **WATCH.** Use Inworld TTS as an API only if it benchmarks well. |
| Charisma.ai | Story-graph plus generative AI, with Unity/Unreal/Web/VR SDKs listed. Still operating mid-2026 per an aggregator. https://parse.gl/brands/charisma-ai | UE 5.8 status: UNVERIFIED | **WATCH** |
| Replica Studios | Only 2023 coverage found (Smart NPCs plugin). No current status. https://gamesbeat.com/replica-unveils-ai-powered-smart-npcs-for-unreal-engine | UNVERIFIED | **SKIP** until confirmed alive |

Judgement: platforms bundle STT, LLM, TTS and animation behind one cloud API. This conflicts with offline LBVR and with agent-authored, testable pipelines. Prefer owning the orchestration (section 5) and plugging vendors in as swappable providers.

## 3. Speech

| Component | Facts | Verdict |
|---|---|---|
| Deepgram Flux / Nova-3 (streaming STT) | Deepgram says Flux saves 200-600 ms by detecting end of turn (vendor claim). Prices seen: Flux ~$0.0077/min, Nova-3 ~$0.0048/min, from third-party aggregators. https://developers.deepgram.com/docs/flux/quickstart , https://pricingsaas.com/companies/deepgram/diffs/2026Q2 | **ADOPT** (cloud tier). Rates change often; check the pricing page. |
| Whisper family (whisper.cpp / faster-whisper) | Local option for offline venues. No UE plugin, Quest figures or licence check done in this pass: UNVERIFIED. Whisper is not natively streaming, so use chunked VAD. | **TRIAL** on venue PCs |
| Cartesia Sonic (TTS) | Vendor claim 40-90 ms time to first audio. Independent figures 166-199 ms median. Commercial licence starts at the Pro tier. Prices conflict across sources. https://futureagi.com/blog/best-voice-ai-june-2026/ , https://www.coval.dev/blog/elevenlabs-vs-cartesia-which-tts-provider-is-right-for-your-voice-ai-project | **ADOPT** as primary cloud TTS, pending a bake-off |
| ElevenLabs Flash v2.5 | "~75 ms" is inference time only. Measured 200-350 ms. https://deepgram.com/blog/text-to-speech-elevenlabs-alternatives | **TRIAL** (voice quality and cloning) |
| Kokoro-82M | Apache 2.0 weights; the espeak-ng phonemizer dependency is GPLv3, so check redistribution. No voice cloning. https://huggingface.co/hexgrad/Kokoro-82M | **ADOPT** as the offline fallback TTS |
| Piper | Licence and status not checked: UNVERIFIED | WATCH |
| XTTS v2 (Coqui) | Shown as CPML (non-commercial) in the Kokoro model card comparison. https://huggingface.co/hexgrad/Kokoro-82M | **SKIP** for commercial LBVR |

Voice-loop budget (design target, not measured): VAD/end-of-turn ~200 ms + LLM first sentence ~400-800 ms + TTS first audio ~150-250 ms, which is about 0.8-1.3 s. Mask the gap with an animated acknowledgement ("hm", a head turn).

## 4. Lip-sync and facial animation

| Option | Facts | Verdict |
|---|---|---|
| NVIDIA Audio2Face-3D | See section 2. Highest fidelity and MetaHuman-oriented. Needs an NVIDIA GPU and has no 5.8 plugin build listed. Convai's article calls it slower than OVR but higher quality. https://convai.com/blog/lip-syncing-virtual-ai-characters-techniques-integration-and-future-trends | **TRIAL** (PC) |
| Meta OVR Lipsync | End-of-life: no updates or support. Meta's replacement is Movement SDK visemes (OpenXR `XR_META_face_tracking_visemes`, 15 visemes, Quest 2 and later). https://developers.meta.com/vr/documentation/unreal/audio-ovrlipsync-sample-unreal/ | **SKIP** |
| Meta Audio To Expression | On-device model that drives lips, cheeks, lids and brows from audio. Quest 2/3/3S per UploadVR. https://uploadvr.com/meta-audio-to-expression-in-action . Exposure to UE for non-Meta avatars: UNVERIFIED. | **WATCH** (best Quest path if exposed) |
| UE built-in | No audio-to-face feature was found in the 5.8 release thread. MetaHuman Animator is capture-based (video), not audio-driven. | Gap: you need your own viseme or A2F layer. |

Quest practical path (inference, UNVERIFIED): stream A2F from a venue server as blendshape weights over the LAN, or use cheap viseme curves from TTS timestamps.

## 5. Behaviour architecture (UE 5.8)

Rules:
- StateTree is the main behaviour engine (BT converter exists; Epic direction). Pin the 5.8 completion-bug workaround.
- Mass is for crowds and ambient NPCs only. Never attach LLMs per Mass agent.
- Smart Objects and Gameplay Behaviors are the world-action vocabulary: "sit", "pick up", "use console". The LLM picks from advertised affordances; it never emits animation names or free-form code.

Pattern: LLM decides intent, deterministic layer executes.

```
Mic -> VAD/STT (stream) -> Dialogue Orchestrator (per NPC, server)
   persona spec (YAML/JSON, versioned) + memory + world snapshot (perceived facts only)
        -> LLM (Haiku 5.5; tool-use schema) -> {speech, emotion tag, intent tool call}
        -> Validator (schema + allow-list + rate limit + safety classifier)
              -> speech -> TTS stream -> audio -> A2F / viseme -> face
              -> intent -> StateTree event (e.g. Intent.GoTo{poi}) -> Smart Object /
                 Gameplay Behavior -> animation graph (deterministic)
   StateTree always has a scripted fallback state if the LLM is late, offline or invalid.
```

- **Tool calling:** expose 5-15 tools such as `move_to(poi_id)`, `use_object(id)`, `emote(tag)`, `give_item(id)`, `end_conversation()`. Use enums for IDs and reject anything not in the current affordance list.
- **Memory:** three layers. The persona is static and cached. Episodic memory is summarised per session. World facts are queried, not stuffed in. Session reset in LBVR to avoid cross-guest leakage.
- **Persona spec:** one file per character (voice, knowledge boundaries, forbidden topics, tone, action budget), reviewed like code. Claude Code can author and diff it through the UE 5.8 MCP plugin (https://pcgamer.com/software/unreal-engine-5-8-launches-with-improved-terrain-and-vegetation-tools-a-lumen-lite-option-for-faster-global-illumination-and-for-the-times-we-now-live-in-an-open-standard-plugin-for-llm-systems/). Maturity is uncertain: a forum user says the MCP docs are incomplete.
- **Evaluation:** record-and-replay transcripts with a mocked LLM for deterministic CI of the executor. Run scenario suites (golden intents, jailbreaks, off-topic, long sessions) against the real model with LLM-judge plus rule checks and statistical pass thresholds. Add latency percentiles (p50/p95) per stage and a "no invalid action reaches StateTree" invariant test.

Verdict: pattern **ADOPT**. Build it as an in-house plugin with a provider interface (LLM, STT, TTS, face).

## 6. Multi-user LBVR

- Run one orchestrator service per venue (LAN) that multiplexes N players and M NPCs. Use per-speaker channels, one mic stream per player, and push-to-talk or proximity gating to avoid cross-talk.
- Shared world state is server-authoritative; each NPC receives only a perceived-facts snapshot. Serialise NPC intent execution through the game server so that two players cannot trigger conflicting actions.
- Concurrency and cost: with voice, each active conversation holds an STT stream, an LLM call and a TTS stream. Rate-limit and queue. Check vendor concurrency caps (Deepgram reportedly cut STT concurrency in Q2 2026: https://pricingsaas.com/companies/deepgram/diffs/2026Q2).
- Offline: provide a degraded mode, with local Whisper plus a local 4B-9B LLM plus Kokoro on the venue PC. Quality will be visibly lower, so design "scripted-with-flavour" scenes for it.
- Privacy: voice is biometric data in many jurisdictions. Process on the venue edge when possible, send transcripts only (not audio) to cloud, keep no raw audio, show consent at check-in, treat minors specially, and set a retention policy. Legal review needed: UNVERIFIED for specific jurisdictions.

## 7. Biggest technical risks
1. End-to-end voice latency above ~1.5 s breaks presence. Cloud jitter at venues makes this worse.
2. No UE 5.8 build of NVIDIA's plugins (5.5/5.6 listed), and A2F needs a CUDA GPU, which excludes standalone Quest and Android.
3. Plugin churn: Convai is beta, Inworld and Charisma status is unclear, and UE6 is coming (late 2027, approximate).
4. Safety: jailbreaks, inappropriate content from guests (including minors), and voice-data compliance.
5. Non-determinism makes regression testing hard; it needs the mocked-LLM plus statistical suite from section 5.
6. On-device LLMs on Quest compete with rendering for CPU and thermals (no verified figures).
7. Cost scaling per concurrent guest-minute is not modelled: STT + TTS may dominate over the LLM.
8. Licence traps: XTTS non-commercial, Cartesia commercial tier, espeak-ng GPL, NVIDIA Open Model License terms.

## 8. Top recommendations
- ADOPT: Claude Haiku 5.5 (cloud, tool-use) as the character brain; the intent-to-StateTree architecture; Deepgram streaming STT; Cartesia TTS (after a bake-off); Kokoro as the offline TTS.
- TRIAL: A2F-3D (PC), Sonnet 5.5 for hero NPCs, local llama.cpp on venue PCs, Convai for prototypes.
- WATCH: Inworld, Charisma, Meta Audio To Expression, headset-resident LLMs. SKIP: OVR Lipsync, XTTS, Replica.
