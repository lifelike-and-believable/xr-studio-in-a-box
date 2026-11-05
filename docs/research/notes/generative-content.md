# Generative content creation: stage inputs to UE 5.8

Researched 2026-11-04. Source quality is mixed: official docs are marked (O), third-party/aggregator pages (3P). Anything not confirmed is marked UNVERIFIED. Prices move often; re-check before purchase.

Context: Unreal Engine 5.8 shipped 2026-06-17 with an integrated MCP plugin for LLMs. Its release notes do not mention Geometry Script or Gaussian splats. (O: https://forums.unrealengine.com/t/unreal-engine-5-8-released/2729274)

## 1. Text/image-to-3D mesh

| Tool | Version / date | Licence and commercial use | Pricing | Automation | Real-time quality notes | Verdict |
|---|---|---|---|---|---|---|
| **Tripo** (licensed, MCP installed) | API lists H3.1 (`v3.1-20260211`), P2.0 (native quad topology for games), AI Texture (8K), Segmentation V2 (O: https://developers.tripo3d.ai/) | Commercial terms not stated on the API page; read the ToS. 3P says the free tier is non-commercial (CC BY 4.0) and paid plans allow commercial use (3P: https://costbench.com/software/ai-3d-generation/tripo-ai/). UNVERIFIED for the API. | API: 1 credit = $0.01. Generation from 10 credits, retopology 10-40, texture 10-30, auto-rig 25, rig check free. API is billed separately from Studio subscriptions (3P). | REST API plus MCP: text/image/multiview, check_riggable, rig_model, download. Fully headless. | `face_limit` control, full PBR, GLB/FBX/OBJ/USDZ. H series up to 2M polys, so decimate for VR. P2.0 quads help rigging and LODs. Rig is humanoid-oriented (UNVERIFIED). | **ADOPT** (primary generator, use P2.0 for characters/props) |
| **Meshy** | Models meshy-6/7.1; remesh and rig endpoints (O: https://docs.meshy.ai/en/api/pricing) | Paid plans include commercial rights; free output is CC BY 4.0 (3P: https://docs.meshy.ai/pricing, search result) | Prepaid API credits: image-to-3D with 2K textures 30 credits, retexture 10, remesh 5, rig 5 (O) | REST API. No MCP confirmed here (UNVERIFIED). | Strong retexture/remesh; quad output not confirmed in official docs | **TRIAL** (second source, retexture) |
| **Hunyuan3D** (Tencent) | Cloud API model 3.0 default, 3.1 optional; `FaceCount` default 500k, `LowPoly` mode (not on 3.1), `EnablePBR` off by default; separate Smart Topology API (O: https://www.tencentcloud.com/document/api/1284/75540). Open weights are 2.x. | **Open-weights licence excludes the EU, UK and South Korea** and bars using outputs outside the territory. It also requires a Tencent licence above 1M MAU and bars using outputs to train other models (O, v2.0 text: https://huggingface.co/tencent/Hunyuan3D-2/blob/main/LICENSE). The 3.x cloud terms were not checked. | Cloud credits; open weights are self-host | API and self-host (needs GPU) | Good geometry, but the licence is a blocker for LBVR venues in EU/UK/KR | **SKIP** for production. WATCH if Tencent changes the territory. |
| **Rodin / Hyper3D Gen-2** | 10B parameters, text or up to 5 images, quad or raw output, GLB/FBX/OBJ/USDZ/STL (3P: https://runware.ai/docs/models/hyper3d-rodin-gen-2) | Not found. UNVERIFIED. | About $0.80 per generation via a reseller (3P: https://empiriolabs.ai/models/hyper3d-gen2) | API via resellers and Deemos | Quad presets of about 4k to 50k faces suit real-time use (3P) | **TRIAL** after licence check |
| **TRELLIS.2** (Microsoft) | 4B parameters, Dec 2025 | MIT (O: https://huggingface.co/microsoft/TRELLIS.2-4B/blob/main/README.md) | Free weights. 3P says 24GB VRAM and Linux. | Self-hosted CLI/Python, fully scriptable | PBR maps (albedo, metallic, roughness, opacity) and GLB output. Triangle meshes, so retopo needed. | **TRIAL** (the only clean open licence, gives a no-vendor fallback) |
| **Higgsfield** (licensed, MCP installed) | Session exposes `generate_3d`, `generate_image/video/audio`, `scene_builder_3d_*` tools. Which 3D models sit behind them is not confirmed. | Not checked. UNVERIFIED. | Credits | MCP | Treat 3D output as unverified until tested | **TRIAL** for 3D; **ADOPT** for concept and video |

Cross-cutting: AI meshes usually arrive as dense triangle soup. Plan retopology and UV repair for every asset that is not a static background prop.

## 2. AI texture and materials

| Tool | Notes | Verdict |
|---|---|---|
| Tripo AI Texture and Meshy retexture | Mesh-aware PBR on an existing model. Both are API-driven (O links above). | **ADOPT** (Tripo) / **TRIAL** (Meshy) |
| Adobe Substance 3D | Photo-to-material and AI features. Price quotes conflict ($54.99 vs $59.99 per month) (3P: https://www.3daistudio.com/blog/best-ai-texture-and-pbr-generators-2026). Automation is limited. | **WATCH** |
| Polycam, Material Maker, Scenario | Tileable materials and style-consistent batches (3P: https://app.cinevva.com/guides/ai-texture-generators). Not evaluated. | **WATCH** |

Gate: check tiling seams, roughness/metallic ranges, and texture size (budget by platform; mobile and standalone VR need smaller maps).

## 3. Environments, splats, photogrammetry

| Tool | Facts | Verdict |
|---|---|---|
| **RealityScan 2.1** (licensed) | Released Nov 2025. Free for under $1M revenue, otherwise $1,250 per seat per year (O: https://www.realityscan.com/license?lang=en-us). CLI, REST/gRPC remote control, COLMAP import/export. NVIDIA CUDA GPU required. (O: https://www.cgchannel.com/2025/11/epic-games-releases-realityscan-2-1/) A 2.2 release exists (3P: https://digitalproduction.com/2026/06/26/realityscan-2-2-widens-gpu-support/). | **ADOPT** for scanned props and sets (scriptable batch) |
| **World Labs Marble** | Free tier cannot export. Standard exports splats (SPZ/PLY) and collider meshes. Pro adds textured GLB and commercial rights. (O: https://docs.worldlabs.ai/marble/export/gaussian-splat.md) API pay-as-you-go pricing comes from one blog and is UNVERIFIED. | **TRIAL** (Pro plan, for blockout and backdrops only) |
| **Gaussian splats in UE** | No native support in 5.8 release notes. Third-party plugins: SplatRenderer (free, Apache 2.0, UE 5.5-5.7), YaGS (open source, depth compositing), Volinga (SplatCapture 3.0.0 supports UE 5.3-5.8), Luma plugin (free), XGRIDS LCC4Unreal 3.0 (3P: https://radiancefields.com/free-unreal-engine-5-gaussian-splatting-plugin, https://radiancefields.com/splatcapture-3.0.0-adds-spline-capture). | **WATCH**. Splats carry no collision or lighting and are heavy for standalone VR. They suit PC backdrops. |
| Luma | Capture app and UE plugin as above. Licence and pricing not checked. | **WATCH** |

## 4. Concept, image and video

| Tool | Notes | Verdict |
|---|---|---|
| **Higgsfield** | MCP with image, video, voice and 3D scene tools, batch calls, job polling | **ADOPT** for look-dev and reference. Output licence terms: UNVERIFIED. |
| Adobe Firefly / Express (MCP present in session) | Not assessed for licence or pricing | **WATCH** |

Rule: image and video outputs are references and look-dev only. Anything that ships (textures, UI, billboards) should go through a provider with documented commercial terms.

## 5. Audio

| Tool | Notes | Verdict |
|---|---|---|
| **ElevenLabs** (TTS, SFX, music) | Paid plans include a commercial licence, free does not. API prices differ across 3P sources, so UNVERIFIED (3P: https://smallest.ai/blog/elevenlabs-pricing-explained-plans-limits-hidden-costs-calculator). REST API suits an agent. Voice cloning needs consent records. | **ADOPT** (TTS/SFX), **TRIAL** (music) |
| Higgsfield audio and voice tools | In the MCP. Licence not checked. | **TRIAL** |
| Stable Audio 2.5 | Enterprise product trained on licensed data. Open-weights Stable Audio Open licence is non-commercial or under $1M revenue, and sources conflict (3P: https://www.musicbusinessworldwide.com/stability-ai-launches-ai-model-for-brands-to-create-custom-sounds). | **TRIAL** for music and ambience |
| Suno / Udio | Commercial licence on paid tiers, but ongoing label litigation (3P as of April 2026: https://blog.dubspot.com/ai-music-licensing-explained-2026). Licence is not copyright ownership. | **SKIP** for shipped music |

## 6. Retopology, LODs and cleanup

| Tool | Notes | Verdict |
|---|---|---|
| **Blender (headless, MCP)** | `quadriflow_remesh` is an operator with target face count, and Decimate is scriptable. Both can be slow on dense meshes, so decimate first (3P: https://developer.blender.org/T72694, https://glama.ai/mcp/servers/@ShirshovDIM/retopoflow_blender_mcp/blob/78358fedc1d6d47808d380d331e176370b479c59/src/blender_handlers/remeshing.py). The Blender MCP also offers `execute_blender_code_for_cli`, so batch runs need no GUI. | **ADOPT** (default cleanup, UV and export) |
| **UE Nanite** | Handles static high-poly meshes on PC. Skeletal and mobile paths have limits, so check per target platform. 5.8 notes mention Nanite fixes (O: forum link above). | **ADOPT** for static PC; do not rely on it for mobile/standalone VR |
| **Tripo and Tencent topology APIs** | Tripo retopology costs 10-40 credits; Tencent Smart Topology has FaceLevel (O links above). | **TRIAL** |
| **Simplygon** | UE plugin supports 5.5 and 5.6 per its docs (O: https://documentation.simplygon.com/SimplygonSDK_10.4.199.0/overview/whatsnew/simplygon104.html). UE 5.8 support, current price and headless licence: UNVERIFIED. | **WATCH** |
| **Instant Meshes** | Licence and maintenance status UNVERIFIED. | **WATCH** |
| **Unreal Geometry Script** | Not confirmed in 5.8 notes. UNVERIFIED. | **WATCH** |

## Risks

- **Copyright:** the US Copyright Office says pure AI output has no protection and prompts alone are not enough (3P summaries: https://www.akingump.com/en/insights/ai-law-and-regulation-tracker/us-copyright-office-releases-part-2-of-ai-report). Competitors could reuse unmodified AI assets. Keep human-edit records.
- **Vendor licences:** free tiers are often CC BY or non-commercial (Tripo, Meshy, Marble). Use paid tiers only and keep a receipt per asset.
- **Territory:** Hunyuan3D excludes the EU/UK/South Korea. An LBVR rollout in those regions would breach it.
- **Fab:** Epic requires a "Created with AI" tag. Misclassification can be removed, and buyers can filter AI content (O: https://forums.unrealengine.com/t/update-on-products-generated-with-ai/2523501, May 2025). I could not verify the current policy text. A claim that prompt-only assets are now allowed with a label is from one unverified source. Do not plan to sell AI assets on Fab until the live terms are read.
- **Voice and likeness:** get consent for cloned voices and avoid real-person likeness.
- **Provenance:** the Tripo MCP saves a provenance record on download. Extend that to every generator.

## Quality gates before import to UE

1. Provenance record present (tool, model version, plan tier, date, prompt).
2. Triangle budget per platform and LOD chain generated (VR budgets are a project decision, not researched here).
3. Clean manifold mesh, no flipped normals, single UV set without overlap, texel density consistent.
4. PBR check: albedo free of baked lighting, roughness/metallic in sensible ranges, sRGB and linear set correctly.
5. Scale and pivot normalized, collision generated.
6. Characters: rig check, bone naming mapped to the UE skeleton, retarget test.
7. Run the UnrealAudit `mesh_report`, `texture_report` and `material_report` tools after import.
8. Human visual review in a headset for hero assets.

## Top unknowns

- Tripo API commercial terms and whether P2.0 output rigs well.
- Higgsfield 3D model quality and licence.
- Rodin and Marble API licences.
- Whether Simplygon and Geometry Script work in 5.8 for headless LODs.
