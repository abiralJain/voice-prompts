import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  Midjourney: `MIDJOURNEY — Artistic, cinematic AI image generation

Official documentation (source: docs.midjourney.com):

PROMPT STRUCTURE (official):
Subject + Medium + Environment + Lighting + Color + Mood + Composition + Parameters

PARAMETERS (always at END of prompt, after a space):
--ar [W:H]        Aspect ratio: 16:9, 3:2, 2:3, 4:5, 1:1, 9:16
--v 7              Model version (V7 is current default 2025)
--s [0-1000]       Stylize: artistic interpretation. Default 100. Low=literal, High=artistic
--c [0-100]        Chaos: variation in results. Higher=more diverse
--w [0-3000]       Weird: unusual, experimental aesthetics
--no [elements]    Negative prompt: things to EXCLUDE
--style raw        Reduces default beautification for literal/photorealistic results
--iw [0-3]         Image weight when using image prompts
--sref [URL]       Style reference: apply style from another image
--cref [URL]       Character reference: maintain character consistency
--oref [URL]       Omni reference (V7): consistent objects/characters
--q [1-4]          Quality/detail level
--tile             Creates seamless tileable patterns
--r [1-40]         Repeat: generate multiple variations
--p                Personalization: uses your trained style profile

CRITICAL TIPS FROM OFFICIAL DOCS:
- Describe what you DO want, not what you don't (except with --no)
- Words at the BEGINNING have MORE weight than words at the end
- Short prompts = more variety but less control
- Specific synonyms matter: "gigantic" gives different results than "big"
- Multi-prompts with :: for blending: "cat::2 spaceship::1" weights cat 2x more

EFFECTIVE KEYWORDS:
Lighting: "volumetric lighting", "rim lighting", "golden hour", "chiaroscuro", "neon-lit", "studio lighting", "soft diffused", "dramatic side lighting", "backlighting", "ambient occlusion"
Camera: "shot on 35mm film", "85mm f/1.4", "wide angle 24mm", "macro lens", "drone aerial", "low angle", "dutch angle", "tilt-shift", "Hasselblad medium format"
Style: "editorial photography", "concept art", "oil painting", "watercolor", "cyberpunk", "art nouveau", "minimalist", "brutalist", "vaporwave", "dark academia"
Quality: "highly detailed", "photorealistic", "8K", "cinematic", "ultra HD"
Mood: "ethereal", "moody", "vibrant", "muted tones", "nostalgic", "melancholic", "serene"

AVOID: vague words like "beautiful", "nice", "cool", "awesome" — be SPECIFIC about what makes it beautiful

EXAMPLE:
"A lone samurai meditating under cherry blossoms at dawn, traditional ink wash painting style blended with cinematic photography, volumetric morning mist, soft golden light filtering through branches, shot on medium format film, contemplative and serene atmosphere, negative space composition --ar 21:9 --v 7 --s 350 --style raw"`,

  "DALL-E 3": `DALL-E 3 / CHATGPT IMAGE GENERATION

PROMPT RULES:
- Be LITERAL and DESCRIPTIVE — DALL-E follows instructions very closely
- For text in images: explicitly state exact words, font style, size, color, position
  "The text 'OPEN 24/7' appears in bold white Impact font centered on a red banner at the top"
- Specify exact style: "photorealistic photograph", "flat vector illustration", "3D render", "watercolor", "digital art", "pencil sketch", "pixel art"
- Describe composition: "centered", "rule of thirds", "bird's eye view", "symmetrical", "full-body shot", "extreme close-up", "wide establishing shot"
- Include exclusions: "No text", "No people", "No watermarks"
- Specify color palette: "warm earth tones", "monochromatic blue", "high contrast black and white", "pastel colors"
- GPT Image generation (2025+) has dramatically improved text rendering
- ChatGPT's conversational interface allows iterative refinement: "Make the sky darker", "Add more detail to the foreground"

EXAMPLE:
"A photorealistic product photograph of a ceramic coffee mug on a rustic wooden table. The mug is matte cream with the text 'BREW' in minimalist black sans-serif font on the front. Soft morning light enters from a window on the left, creating gentle shadows. Shallow depth of field with a blurred green potted plant in the background. Style: commercial product photography, clean, minimal, premium aesthetic. No other text or logos. Warm color temperature."`,

  "Stable Diffusion": `STABLE DIFFUSION — Open-source, local, full control

PROMPT FORMAT: Comma-separated TAGS, not natural sentences

STRUCTURE:
quality tags, subject description, scene, style, lighting, details

SYNTAX RULES:
- Start with quality tags: "masterpiece, best quality, highly detailed, sharp focus, 8k uhd, professional"
- Use prompt weights for emphasis: "(important element:1.3)" or "(less important:0.7)"
- ALWAYS include NEGATIVE PROMPT: "ugly, blurry, low quality, deformed, watermark, text, logo, bad anatomy, worst quality, jpeg artifacts, signature, extra limbs, mutated, disfigured"
- Specify model/checkpoint: "Using SDXL 1.0", "Using Realistic Vision v6.0", "Using DreamShaper v8"
- Specify sampler: "DPM++ 2M Karras", "Euler a", "DDIM"
- Specify steps: "30 steps" (20-50 typical range)
- Specify CFG scale: "CFG 7" (guidance scale, 1-30, 7 is balanced)
- For LoRA models: include LoRA name and weight
- For ControlNet: specify the control type (canny, depth, pose, etc.)

EXAMPLE:
"masterpiece, best quality, highly detailed, 1girl, silver hair flowing in wind, piercing blue eyes, futuristic cityscape background, neon lights reflecting on wet streets, cyberpunk aesthetic, (detailed face:1.3), dynamic pose, professional dramatic lighting, rain particles, 8k uhd, sharp focus

Negative: ugly, deformed, blurry, low quality, watermark, bad anatomy, worst quality, jpeg artifacts, extra fingers, mutated hands, poorly drawn face, signature, text

Model: SDXL 1.0 | Sampler: DPM++ 2M Karras | Steps: 35 | CFG: 7.5"`,

  Ideogram: `IDEOGRAM — Best for readable text in images, logos, posters, typography

PROMPT RULES:
- Excels at text rendering — be EXPLICIT about: exact words, font style, size, color, position
- Keywords: "clean readable text", "crisp typography", "legible lettering", "bold font"
- Describe layout: "text at top third, image below", "text centered over background"
- Specify font style: "modern sans-serif", "elegant serif", "hand-lettered script", "bold geometric"
- For logos: describe symbol + text + arrangement + overall style
- Ideogram's Canvas feature allows image-to-image editing
- Character creator maintains consistent characters across images

EXAMPLE:
"A minimalist poster design for a tech conference. Large bold text 'FUTURE FORWARD' in white geometric sans-serif font centered on the upper third. Below: abstract circuit board pattern in teal lines on dark navy background at 15% opacity. Small text '2025 CONFERENCE • BANGALORE' at bottom in thin weight white font. Overall: clean, modern, premium, tech-forward. No other elements. Aspect ratio 2:3."`,

  "Leonardo.ai": `LEONARDO.AI — Game characters, consistent character design, fantasy/sci-fi

PROMPT RULES:
- Specify model preset: "PhotoReal v2", "DreamShaper v7", "Anime Pastel Dream", "RPG v5"
- For character consistency: describe in EXTREME detail — hair color/style, eye color/shape, skin tone, outfit details, accessories, pose, expression
- Use reference images for consistency across multiple generations
- Leonardo's Alchemy pipeline enhances photorealism
- 150 free tokens daily

EXAMPLE:
"Character design sheet, female elf ranger, long silver-white braided hair with green leaf clips, sharp emerald green eyes, pointed ears, light brown leather armor with gold trim, carrying an ornate wooden bow, confident determined expression, full body standing pose, fantasy RPG concept art style, highly detailed, clean background, character turnaround sheet"`,

  "Adobe Firefly": `ADOBE FIREFLY — Commercially safe images, Adobe Creative Cloud integration

PROMPT RULES:
- Similar to DALL-E — clean, descriptive, literal
- Mention commercial intent: "for commercial use", "brand-safe"
- Excels at: transparent backgrounds, content-aware fills, variations
- Integrates with Photoshop, Illustrator, Express
- Firefly Boards for moodboarding with multiple AI models
- Supports Generative Fill, Generative Expand, Text Effects

EXAMPLE:
"A flat vector illustration of a diverse team collaborating in a modern office space. Clean lines, vibrant but professional color palette (teal, coral, navy). People gathered around a whiteboard with sticky notes. Laptop on table. Large windows with city view. Style: corporate illustration, friendly, inclusive. Transparent background. For use in marketing materials."`,

  Flux: `FLUX (Black Forest Labs) — Photorealistic images, best prompt adherence

PROMPT RULES:
- Photography-specific terms produce best results
- Specify: lens (85mm, 24mm, 50mm), aperture (f/1.4, f/2.8, f/8), ISO
- Lighting setup: "3-point studio lighting", "natural golden hour", "overcast soft light"
- Film stock: "Kodak Portra 400", "Fujifilm Pro 400H", "Ilford HP5 Plus"
- Camera body: "shot on Canon R5", "Hasselblad X2D", "Leica M11"
- Extremely detailed scene descriptions get the best results
- Flux Pro for highest quality, Flux Schnell for speed

EXAMPLE:
"Portrait of a weathered fisherman on a wooden dock at sunrise, deep wrinkles telling stories of decades at sea, salt-and-pepper beard, wearing a faded navy cable-knit sweater, holding coiled rope, shot on Hasselblad X2D with 80mm f/2.8 lens, Kodak Portra 400 film stock, golden hour side lighting creating dramatic shadows, shallow depth of field with blurred harbor boats in background, atmospheric morning mist, cinematic color grading"`,
};

export const tools: ToolMeta[] = [
  { name: "Midjourney", icon: "🎨", best_for: "Artistic, cinematic, emotionally resonant images", is_free: false, category: "image_generation" },
  { name: "DALL-E 3", icon: "🖼️", best_for: "Precise literal images, text in images, product mockups", is_free: true, category: "image_generation" },
  { name: "Stable Diffusion", icon: "🌀", best_for: "Open-source, full control, custom models", is_free: true, category: "image_generation" },
  { name: "Ideogram", icon: "✏️", best_for: "Readable text in images, logos, posters", is_free: true, category: "image_generation" },
  { name: "Leonardo.ai", icon: "🦁", best_for: "Game characters, consistent character design", is_free: true, category: "image_generation" },
  { name: "Adobe Firefly", icon: "🔥", best_for: "Commercially safe images, Adobe integration", is_free: true, category: "image_generation" },
  { name: "Flux", icon: "📸", best_for: "Photorealistic images with incredible detail", is_free: true, category: "image_generation" },
];
