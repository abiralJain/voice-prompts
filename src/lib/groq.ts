import OpenAI, { APIError } from "openai";
import {
  CATEGORY_LABELS,
  getCategoryDocs,
  getClassificationToolList,
  type CategoryKey,
} from "@/lib/toolDocs";
import type { ClassificationLlmResult, PromptMode, ToolPrompt } from "@/types";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

/** Fast model for classification */
const MODEL_CLASSIFY = process.env.GROQ_MODEL_CLASSIFY ?? "llama-3.1-8b-instant";
/** Default model for prompt generation */
const MODEL_GENERATE = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

function getClient(): OpenAI {
  const key = process.env.GROQ_API_KEY;
  if (!key?.trim()) {
    throw new Error("GROQ_API_KEY is not set. Add it to .env.local.");
  }
  return new OpenAI({
    apiKey: key,
    baseURL: GROQ_BASE_URL,
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === "object" && "status" in err) {
    const s = (err as { status: number }).status;
    if (s === 429) return true;
  }
  if (err instanceof APIError) {
    return err.status === 429;
  }
  if (err instanceof Error) {
    return /429|RESOURCE_EXHAUSTED|quota exceeded|rate limit/i.test(err.message);
  }
  return false;
}

function parseRetryMsFromError(err: unknown): number | null {
  if (!(err instanceof Error)) return null;
  const m = err.message.match(/retry in ([\d.]+)s/i);
  if (m) return Math.ceil(parseFloat(m[1]) * 1000) + 400;
  return null;
}

async function withGroqRetry<T>(call: () => Promise<T>): Promise<T> {
  const maxAttempts = 5;
  let last: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await call();
    } catch (e) {
      last = e;
      if (!isRateLimitError(e) || attempt === maxAttempts - 1) throw e;
      const suggested = parseRetryMsFromError(e);
      const backoff = suggested ?? Math.min(90_000, 2000 * 2 ** attempt + Math.random() * 600);
      await sleep(backoff);
    }
  }
  throw last;
}

export function userFacingLlmError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (/PerDay|per day|daily limit|tokens per day/i.test(raw)) {
    return "AI daily quota reached. Try again later or check your Groq account limits.";
  }
  if (/PerMinute|per minute|rate limit|too many requests/i.test(raw)) {
    return "Too many AI requests in a short time. Wait a minute and try again.";
  }
  if (isRateLimitError(err)) {
    return "The AI service is busy (rate limit). Wait a moment and try again.";
  }
  if (/GROQ_API_KEY|api key/i.test(raw)) {
    return "Server configuration error: missing or invalid GROQ_API_KEY.";
  }
  return raw.length > 200 ? "Something went wrong with the AI request. Please try again." : raw;
}

function stripJsonFence(text: string): string {
  return text.replace(/```json\s*|```\s*/g, "").trim();
}

function parseJson<T>(text: string): T {
  const cleaned = stripJsonFence(text);
  return JSON.parse(cleaned) as T;
}

async function chatCompletionText(params: {
  system: string;
  user: string;
  temperature: number;
  model: string;
  jsonMode?: boolean;
}): Promise<string> {
  const client = getClient();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: params.system },
    { role: "user", content: params.user },
  ];
  const body: OpenAI.Chat.ChatCompletionCreateParams = {
    model: params.model,
    messages,
    temperature: params.temperature,
  };
  if (params.jsonMode) {
    body.response_format = { type: "json_object" };
  }

  try {
    const res = await withGroqRetry(() => client.chat.completions.create(body));
    return res.choices[0]?.message?.content?.trim() ?? "";
  } catch (e) {
    if (!params.jsonMode) throw e;
    const msg = e instanceof Error ? e.message : String(e);
    if (!/response_format|json_object|json mode|unsupported/i.test(msg)) throw e;
    const res = await withGroqRetry(() =>
      client.chat.completions.create({
        model: params.model,
        messages,
        temperature: params.temperature,
      }),
    );
    return res.choices[0]?.message?.content?.trim() ?? "";
  }
}

/** Must appear at the top of Call 2 and Call 3 generation instructions. */
export const CRITICAL_OUTPUT_STYLE_RULE = `CRITICAL OUTPUT STYLE RULE:
The refined prompt must sound like something a knowledgeable human would naturally type into the tool. It should read like a clear, flowing creative brief — NOT like a technical specification document.

NEVER include in the refined prompt:
- Numbered steps (1. 2. 3.)
- Markdown formatting (**bold**, headers, bullet points)
- Section headers like "File Creation:", "Component Structure:", "Validation:"
- Meta-instructions like "Create the following files:" or "Ensure that..."
- Generic placeholder text like "Welcome to Our Service" or "Discover amazing features"

ALWAYS make the refined prompt:
- Read like natural, professional language — as if a senior developer/designer typed it
- Flow as continuous prose or clear paragraphs, not a bulleted list
- Include specific details (not generic placeholders) that reflect the user's actual intent
- Be ready to paste directly into the tool — no reformatting needed
- Match the tone each tool's community actually uses

EXAMPLES OF BAD vs GOOD:

BAD (sounds like a spec document):
"1. **File Creation**: Create the following two files:
   * \`/src/components/HeroSection.js\`: React functional component
   * \`/src/components/HeroSection.module.css\`: CSS Modules styles
2. **Component Structure**: The HeroSection should include:
   * A main heading
   * A descriptive paragraph
   * A call-to-action button"

GOOD (sounds like a human prompting v0):
"Create a hero section component for an artisan coffee shop landing page using shadcn/ui Card and Button components with Tailwind CSS. The hero should have a full-width background image of a coffee shop interior, a large heading 'Brewed with Passion Since 1985' in a warm serif font, a subtitle about handcrafted coffee, and a prominent 'View Our Menu' CTA button in a terracotta color. Include a subtle parallax scroll effect on the background. Below the hero, add a three-column feature grid showing 'Single Origin', 'Hand Roasted', and 'Fresh Daily' with matching icons. Mobile: stack everything vertically, hero image becomes 60vh height. Dark warm color palette: cream (#F5F0EB), dark brown (#2C1810), terracotta (#C4714A)."

BAD (generic, adds nothing useful):
"Create a responsive Hero component for a landing page, compatible with both mobile and web. Include a main heading, a brief descriptive paragraph, a call-to-action button, and a placeholder div for background image."

GOOD (specific, informed by what the user actually said):
"Create a landing page for a tech startup using Next.js App Router and Tailwind CSS. Hero section with a bold headline, a one-liner value prop, and a 'Get Started' button with gradient hover effect. Below: three feature cards with icons showing the key benefits. Include a testimonials carousel, a pricing comparison table with Free/Pro/Enterprise tiers, and a footer with newsletter signup. The design should feel modern and clean — think Linear or Vercel's website. Dark mode default, with subtle gradient backgrounds and smooth scroll animations between sections. Mobile-first, responsive up to 1440px."

The refined prompt should be SPECIFIC to what the user described. If the user said "coffee shop website with warm colors," the prompt should mention coffee shop specifics — not generic "Welcome to Our Service" placeholder text. Pull details from the user's intent and add domain-appropriate specifics only when in Enhance mode.`;

export const ENHANCE_RESTRAINT_RULE = `IMPORTANT RESTRAINT RULE (Enhance mode):
When enhancing a prompt, you should:
- Clean up filler words and structure the thought clearly
- Add tool-specific formatting, parameters, and keywords that improve output
- Add reasonable technical context only when it clearly fits what the user asked (e.g. responsive layout if they asked for a web page)

You should NOT:
- Invent features the user didn't mention (no "confirmation emails", "user profiles", "social sharing", "countdown timers", etc. unless they said so)
- Add user stories or persona descriptions they didn't request
- Turn a simple ask into a much larger product they didn't describe
- Over-elaborate with generic SaaS boilerplate

The enhanced prompt must be a BETTER VERSION of what the user said — not a different product. Stay faithful to scope and intent. Add professional structure and tool optimization without inventing requirements.

Example — user: "I want a landing page for an event on November 20th where people can fill out a form"
GOOD: A concise landing for an event on Nov 20 with hero, event details, and a registration form (name, email, etc.), modern responsive layout, form validation, success state after submit.
BAD: Inventing a named summit, speaker profiles, agenda PDFs, email confirmations, social share, countdown, etc.`;

const ENHANCE_MODE_BLOCK = `You are generating an ENHANCED prompt. Take the user's intent and transform it into a professional, detailed, tool-specific prompt. Add reasonable context, specific parameters, and details that improve the output quality — while still following the output style rules above (natural prose, no spec-document formatting).

${ENHANCE_RESTRAINT_RULE}`;

const CLEAN_MODE_BLOCK = `You are generating a CLEANED prompt. Your job is ONLY to:
1. Remove all filler words (um, uh, like, you know, basically, etc.)
2. Fix grammar and sentence structure
3. Remove repetitions and self-corrections
4. Organize the thought into clear sentences or short paragraphs
5. DO NOT add any information, context, parameters, or details that the user did not explicitly mention
6. DO NOT assume tech stack, design choices, or features
7. DO NOT add tool-specific parameters, flags, or documentation-style structure
8. Keep it faithful to the user's original intent — just cleaner and more readable

The output should be a clean, readable version of EXACTLY what the user said, nothing more. Still follow the CRITICAL OUTPUT STYLE RULE: natural flowing prose — never numbered specs, markdown, or section headers.`;

const CLASSIFICATION_SYSTEM = `You are VoicePrompt's classifier. Your ONLY job is to read a messy voice transcript and decide which AI task category fits best, then pick the THREE best-matching tools from the list below.

## CATEGORIES (pick exactly one "category" key)
- coding — apps, websites, components, scripts, debugging, APIs, databases
- image_generation — images, illustrations, photos, art, logos, graphics
- video_generation — video clips, animations, cinematic shots, reels
- audio_music — music, songs, SFX, voiceovers, podcasts, TTS
- research — finding info, literature review, fact-checking, cited answers
- design_visual — presentations, infographics, flowcharts, wireframes, slides, Canva/Figma
- writing_content — emails, blogs, copy, documentation, social posts, essays
- general_chat — general Q&A, explanations, brainstorming, tutoring when no specific tool workflow dominates

## AVAILABLE TOOLS (choose top 3 names EXACTLY as written after the em dash)
${getClassificationToolList()}

## RULES
1. Output ONLY valid JSON. No markdown, no preamble.
2. "top3" must contain exactly 3 strings — tool names copied EXACTLY from the list above for the chosen category.
3. "category_label" is the human-readable category name (e.g. "Image Generation").
4. Prefer the most specific category if multiple fit.

## OUTPUT JSON SHAPE
{
  "category": "<one category key>",
  "category_label": "<string>",
  "top3": ["<tool>", "<tool>", "<tool>"]
}`;

export async function classifyTranscript(transcript: string): Promise<ClassificationLlmResult> {
  const text = await chatCompletionText({
    system: CLASSIFICATION_SYSTEM,
    user: `TRANSCRIPT:\n"""${transcript}"""\n\nClassify and return JSON only.`,
    temperature: 0.3,
    model: MODEL_CLASSIFY,
    jsonMode: true,
  });

  try {
    const parsed = parseJson<ClassificationLlmResult>(text);
    if (!parsed.category || !Array.isArray(parsed.top3)) {
      throw new Error("Invalid classification shape");
    }
    return parsed;
  } catch {
    console.error("Classification parse error:", text);
    throw new Error("Failed to classify transcript. Please try again.");
  }
}

function generationSystemPromptEnhance(category: string, docsBlock: string): string {
  const label = CATEGORY_LABELS[category as CategoryKey] ?? category;
  return `${CRITICAL_OUTPUT_STYLE_RULE}

${ENHANCE_MODE_BLOCK}

## TASK CATEGORY
${label} (${category})

## DEEP DOCUMENTATION FOR THE REQUESTED TOOLS ONLY
${docsBlock}

## TRANSFORMATION RULES (Enhance)
1. Remove filler (um, uh, like, you know), repetitions, and self-corrections.
2. Preserve the user's true intent and scope; do not invent features or workflows they did not imply.
3. Add reasonable missing context and tool-specific detail per documentation only where it does not contradict the RESTRAINT RULE.
4. Each refined prompt MUST follow the tool documentation above (parameters, structure, keywords) where they improve the output — expressed as natural prose, never as a numbered spec.
5. Prompts must be different per tool — same intent, tool-specific formatting.
6. Length matches complexity: concise for simple asks, detailed for complex ones — without scope creep.

## OUTPUT FORMAT — JSON ONLY
{
  "tools": [
    {
      "tool_name": "Exact registry name",
      "tool_icon": "single emoji",
      "best_for": "one sentence",
      "is_free": true,
      "refined_prompt": "full optimized prompt",
      "prompt_explanation": "brief: why this structure for this tool"
    }
  ],
  "improvements_made": ["string", "string"]
}

Rules: "tools" length must match the number of tools requested (usually 3). tool_name must match one of the documented tools provided.`;
}

function generationSystemPromptClean(category: string, toolNames: string[]): string {
  const label = CATEGORY_LABELS[category as CategoryKey] ?? category;
  const namesList = toolNames.join(", ");
  return `${CRITICAL_OUTPUT_STYLE_RULE}

${CLEAN_MODE_BLOCK}

## CONTEXT (for JSON only — do not add this category info into refined_prompt unless the user said it)
Category: ${label}
Tools (you must output one entry per name, in this order): ${namesList}

## CLEAN MODE OUTPUT RULES
- For EVERY tool entry, "refined_prompt" MUST contain the SAME cleaned text. The cleanup is identical for each tool — only the JSON wrapper differs per tool name.
- Do NOT tailor content per tool. Do NOT use tool documentation. No stacks, paths, or parameters unless the user said them verbatim.
- "prompt_explanation" should briefly state this is faithful cleanup only.
- "improvements_made" lists only editorial fixes (filler removed, grammar, etc.).

## OUTPUT FORMAT — JSON ONLY
{
  "tools": [
    {
      "tool_name": "<exact name from list>",
      "tool_icon": "single emoji",
      "best_for": "one sentence",
      "is_free": true,
      "refined_prompt": "same cleaned transcript for each tool",
      "prompt_explanation": "brief"
    }
  ],
  "improvements_made": ["string", "string"]
}

Emit exactly ${toolNames.length} tools in order: ${namesList}.`;
}

export async function generatePrompts(
  transcript: string,
  category: string,
  toolNames: string[],
  mode: PromptMode,
): Promise<{ tools: ToolPrompt[]; improvements_made: string[] }> {
  const sys =
    mode === "clean"
      ? generationSystemPromptClean(category, toolNames)
      : generationSystemPromptEnhance(category, getCategoryDocs(category, toolNames));

  if (mode === "enhance" && !getCategoryDocs(category, toolNames).trim()) {
    throw new Error("No documentation found for the selected tools.");
  }

  const user =
    mode === "clean"
      ? `Clean up this transcript only. Tools for JSON: ${toolNames.join(", ")}

TRANSCRIPT:
"""${transcript}"""

Return JSON only.`
      : `Generate optimized prompts for these tools ONLY: ${toolNames.join(", ")}

TRANSCRIPT:
"""${transcript}"""

Return JSON only.`;

  const text = await chatCompletionText({
    system: sys,
    user,
    temperature: mode === "clean" ? 0.45 : 0.7,
    model: MODEL_GENERATE,
    jsonMode: true,
  });

  try {
    const parsed = parseJson<{ tools: ToolPrompt[]; improvements_made: string[] }>(text);
    if (!Array.isArray(parsed.tools) || parsed.tools.length === 0) {
      throw new Error("No tools in response");
    }
    return {
      tools: parsed.tools,
      improvements_made: parsed.improvements_made ?? [],
    };
  } catch {
    console.error("Generate prompts parse error:", text);
    throw new Error("Failed to generate prompts. Please try again.");
  }
}

function singleSystemPromptEnhance(toolName: string, docsBlock: string): string {
  return `${CRITICAL_OUTPUT_STYLE_RULE}

${ENHANCE_MODE_BLOCK}

## DEEP DOCUMENTATION FOR ${toolName}
${docsBlock}

## RULES
Transform the transcript into one professional prompt following the documentation. Remove filler; keep intent and scope faithful; apply the RESTRAINT RULE; add tool-specific parameters/structure using natural prose only — never numbered specs or markdown headings inside refined_prompt.

## OUTPUT — JSON ONLY
{
  "tool_name": "${toolName}",
  "tool_icon": "emoji",
  "best_for": "one sentence",
  "is_free": true,
  "refined_prompt": "...",
  "prompt_explanation": "..."
}`;
}

function singleSystemPromptClean(toolName: string): string {
  return `${CRITICAL_OUTPUT_STYLE_RULE}

${CLEAN_MODE_BLOCK}

## SINGLE-TOOL CLEAN MODE
Tool name for JSON only: ${toolName}
Produce ONE cleaned "refined_prompt" — same rules as batch clean: no added assumptions, no tool docs, no parameters unless the user said them.

## OUTPUT — JSON ONLY
{
  "tool_name": "${toolName}",
  "tool_icon": "emoji",
  "best_for": "one sentence",
  "is_free": true,
  "refined_prompt": "...",
  "prompt_explanation": "brief: cleanup only"
}`;
}

export async function generateSinglePrompt(
  transcript: string,
  category: string,
  toolName: string,
  mode: PromptMode,
): Promise<ToolPrompt> {
  const doc = getCategoryDocs(category, [toolName]);
  if (mode === "enhance" && !doc.trim()) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  const systemInstruction =
    mode === "clean"
      ? singleSystemPromptClean(toolName)
      : singleSystemPromptEnhance(toolName, doc);

  const text = await chatCompletionText({
    system: systemInstruction,
    user: `TOOL: ${toolName}\n\nTRANSCRIPT:\n"""${transcript}"""\n\nReturn JSON only.`,
    temperature: mode === "clean" ? 0.45 : 0.7,
    model: MODEL_GENERATE,
    jsonMode: true,
  });

  try {
    const parsed = parseJson<ToolPrompt>(text);
    if (!parsed.refined_prompt) throw new Error("Missing prompt");
    return parsed;
  } catch {
    console.error("Single prompt parse error:", text);
    throw new Error("Failed to generate prompt for this tool. Please try again.");
  }
}
