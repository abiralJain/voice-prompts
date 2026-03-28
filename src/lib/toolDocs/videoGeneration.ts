import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  "Runway Gen-4": `RUNWAY GEN-4 — Professional AI video generation

Official documentation (source: help.runwayml.com/hc/en-us/articles/39789879462419):

CRITICAL RULES FROM OFFICIAL DOCS:
- Gen-4 thrives on SIMPLICITY — start simple, iterate by adding detail
- Focus on a SINGLE SHOT/SCENE — not a story with multiple scenes
- The text prompt should focus on MOTION since the input image handles visual appearance
- Avoid conversational prompts: NO "can you please make..." — just describe the scene
- Avoid negative prompts: don't say "no clouds" — describe what SHOULD be there
- Each generation is 5 or 10 seconds — treat as a single cinematic shot

PROMPT ELEMENTS:
1. Subject Motion: How characters/objects move. Use clear verbs + direction. "The subject turns slowly toward camera", "She raises her hand gently"
2. Camera Motion: "slow dolly forward", "static tripod", "pan left to right", "crane up", "tracking shot following subject", "handheld slight shake"
3. Scene/Atmosphere: Lighting, weather, mood — "golden hour", "neon-lit rain", "misty forest dawn"
4. Duration consideration: Keep to ONE action for 5s, can add secondary for 10s

BEST WORKFLOW (from official docs):
1. Generate a STILL IMAGE first (using Midjourney, DALL-E, or Runway's Gen-4 Image)
2. Use that image as the input for Gen-4 video — gives much more control
3. In the text prompt, focus on MOTION only since the image handles visuals

AVOID:
- Multiple scene changes in one prompt
- Overly complex multi-action sequences
- Conversational language ("please", "can you")
- Physical impossibilities the model can't reconcile

EXAMPLE:
"Medium shot, slow dolly forward through misty forest at dawn. Golden sunlight shafts pierce through canopy. Camera at waist height gliding between massive tree trunks. Pollen particles float in light beams. Gentle breeze moves leaves. Atmospheric, cinematic. 5 seconds."`,

  "Sora 2": `SORA 2 (OpenAI) — Photorealistic cinematic video, physics-accurate

PROMPT RULES:
- Write like a FILM DIRECTOR giving a shot description
- Describe the FULL scene: setting, lighting, atmosphere, character actions, physical interactions
- Sora understands PHYSICS — describe water splashing, cloth flowing, hair moving, fire flickering, objects falling with realistic gravity
- Include emotional tone and camera behavior
- Mention implied sound/atmosphere even though it guides visual mood
- Available in ChatGPT Plus, generates up to 20 seconds

EXAMPLE:
"A woman walks through a rain-soaked Tokyo street at night. Neon reflections ripple in puddles beneath her red umbrella. Camera follows from behind at a low angle. Street vendors and passing cars create soft bokeh in the background. Water droplets catch colored neon light. Her coat flows slightly in the wind. Slow motion. Contemplative, melancholic, cinematic. 10 seconds."`,

  "Kling AI": `KLING AI — Fast motion, action scenes, lip sync, high-volume content

PROMPT RULES:
- Specify movement PRECISELY: direction, speed, physical interactions
- Excellent for: martial arts, dancing, sports, complex character actions
- Supports lip-synced dialogue — include dialogue text if needed
- Kling 2.6 supports simultaneous audio-visual generation
- Free daily credits, affordable paid plans
- Mention facial expressions for character scenes

EXAMPLE:
"Close-up shot of a barista performing latte art. Steady hands pour steamed milk into espresso, creating a rosetta pattern. Steam rises gently. Camera is static, focused on the cup from above at 45 degrees. The barista's hands move with practiced precision. Warm cafe lighting. 5 seconds."`,

  "Pika Labs": `PIKA LABS — Quick social clips, creative effects

PROMPT RULES:
- Keep prompts SIMPLE — one clear action per clip
- Pikaffects for special effects: "explode", "melt", "crush", "inflate", "squish", "dissolve"
- Pikadditions: insert objects/people into existing videos
- Great for product animations and social media content
- Fastest generation time (~2 minutes)
- HD 1080p output

EXAMPLE:
"A red sneaker on a white surface slowly melts into a pool of liquid, then reforms back into shape. Dramatic studio lighting. Clean white background. Smooth slow motion. 5 seconds."`,

  "Veo 3": `VEO 3 — 4K cinematic, native audio generation

PROMPT RULES:
- Describe VISUAL + AUDIO together
- Native audio: ambient sounds, dialogue, music
- 4K output, up to 8 seconds
- SynthID watermarking for AI-generated content detection
- Available via Google AI tools

EXAMPLE:
"Wide establishing shot of a bustling Tokyo fish market at 5AM. Vendors calling out prices, the sound of ice being crushed, rubber boots on wet concrete. Camera slowly tracks through the narrow aisles. Fluorescent overhead lights mix with early dawn light from open doors. Authentic, documentary style. Include ambient market sounds and vendor voices. 8 seconds, 4K."`,

  "Luma Ray": `LUMA RAY — Ultra-realistic physics, fast coherent motion, 4K HDR

PROMPT RULES:
- Focus on physical accuracy and material interactions
- Describe how light interacts with surfaces
- Excellent for: product shots, architectural visualization, natural phenomena
- Natural language editing supported
- Hi-Fi 4K HDR output

EXAMPLE:
"A glass sphere slowly rolls across a polished marble table, catching and refracting overhead chandelier light. The sphere's shadow moves across the surface. It reaches the table edge and falls, shattering on a stone floor in slow motion. Crystal fragments scatter. Macro lens perspective. Studio lighting. 6 seconds."`,
};

export const tools: ToolMeta[] = [
  { name: "Runway Gen-4", icon: "🎬", best_for: "Professional control, style consistency, VFX", is_free: true, category: "video_generation" },
  { name: "Sora 2", icon: "🎥", best_for: "Photorealistic cinematic, physics-accurate motion", is_free: false, category: "video_generation" },
  { name: "Kling AI", icon: "🎭", best_for: "Fast motion, action scenes, lip sync", is_free: true, category: "video_generation" },
  { name: "Pika Labs", icon: "⚡", best_for: "Quick social clips, creative effects", is_free: true, category: "video_generation" },
  { name: "Veo 3", icon: "🎞️", best_for: "4K cinematic, native audio generation", is_free: true, category: "video_generation" },
  { name: "Luma Ray", icon: "✨", best_for: "Ultra-realistic physics, 4K HDR", is_free: true, category: "video_generation" },
];
