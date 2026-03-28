import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  Claude: `CLAUDE — Nuanced long-form writing, technical docs, analysis

Official best practices (source: platform.claude.com/docs):

KEY RULES:
- Use XML tags: <role>, <context>, <task>, <format>, <constraints>, <examples>
- Claude was specifically trained to recognize XML tags — use them
- Provide EXAMPLES of the writing style/tone you want
- Be DIRECT about what you want — Claude responds well to explicit instructions
- Specify the audience explicitly
- Mention what to AVOID: "Don't use jargon", "Avoid passive voice", "No corporate buzzwords"
- For long documents: break into sections and specify structure
- Claude follows instructions in user messages better than system messages
- Prefill Claude's response to guide format: start the assistant message with the format you want

EXAMPLE:
"<role>You are a senior content strategist writing for a tech-savvy but non-developer audience.</role>

<task>Write a blog post about how AI is changing product design workflows.</task>

<constraints>
- 1200-1500 words
- Conversational but authoritative tone — like a smart friend explaining over coffee
- Include 3 specific real-world examples
- No buzzwords like 'revolutionary', 'game-changing', 'cutting-edge'
- Use short paragraphs (2-3 sentences max)
- Include a compelling headline and 3 subheadings
</constraints>

<format>
Start with a surprising opening line. End with a practical takeaway the reader can apply today.
</format>"`,

  ChatGPT: `CHATGPT — Versatile writing, brainstorming, creative content

KEY RULES:
- Use role-setting: "You are a senior copywriter at a top-tier agency"
- Break complex writing into steps
- Specify format, length, and tone explicitly
- Ask for MULTIPLE variations: "Give me 3 versions: formal, casual, and punchy"
- Mention the platform/medium: "for a LinkedIn post", "for email newsletter", "for landing page hero"
- Use Custom Instructions for persistent style preferences
- ChatGPT responds well to step-by-step instructions

EXAMPLE:
"You are a senior copywriter specializing in SaaS products.

Write 3 versions of hero section copy for a project management tool called 'FlowState'.
Target audience: startup founders and small team leads who are overwhelmed by too many tools.

Version 1: Professional and confident
Version 2: Casual and relatable
Version 3: Bold and provocative

Each version needs: headline (max 8 words), subheadline (max 25 words), CTA button text (max 4 words).
The key value prop: FlowState replaces 5 tools with one simple workspace."`,

  Gemini: `GEMINI — Long documents, multimodal content, Google ecosystem

KEY RULES:
- Leverage the 1M token context window for analyzing/restructuring long content
- Mention if attaching files for reference
- Good for rewriting, restructuring, summarizing existing content
- Integrates with Google Docs, Sheets, Slides
- Multimodal: can analyze images and generate text about them

EXAMPLE:
"I'm attaching a 50-page technical whitepaper about distributed systems. Rewrite the executive summary (currently on page 2) to be accessible to non-technical business leaders. Keep it to 300 words. Maintain all the key findings but replace technical jargon with business language. Keep the same structure: problem, approach, results, implications."`,

  "Jasper AI": `JASPER AI — Marketing copy at scale, brand-consistent content

KEY RULES:
- Include brand voice description: "confident, warm, professional but not stuffy"
- Specify target audience persona: demographics, pain points, desires
- Mention the CTA and desired action
- Include value proposition
- Jasper uses Brand Voice and Knowledge Base features — reference them
- Good for: ad copy, email campaigns, blog posts at scale, social media batches

EXAMPLE:
"Brand voice: Confident, friendly, slightly witty. We're experts but we don't talk down to people. Think Mailchimp meets Stripe.
Audience: Marketing managers at mid-size B2B companies, 30-45 years old, overwhelmed by too many analytics tools.
Task: Write 5 variations of a Google Ads headline (max 30 chars each) and 3 descriptions (max 90 chars each) for our analytics dashboard product.
Value prop: See all your marketing data in one place.
CTA: Start free trial."`,

  "Copy.ai": `COPY.AI — Short-form copy: ads, emails, social captions, product descriptions

KEY RULES:
- Specify the platform and format constraints
- Mention character/word limits
- Include the key message and desired user action
- Request MULTIPLE variations — Copy.ai is built for this
- Good for: ad hooks, email subject lines, product descriptions, social captions

EXAMPLE:
"Write 10 Instagram caption variations for a new sustainable sneaker launch.
Brand: EcoStep. Tone: Gen-Z friendly, casual, environmentally conscious but not preachy.
Key message: Made from 100% recycled ocean plastic.
Include: 1 emoji per caption, a CTA, 2-3 relevant hashtags.
Character limit: 150 characters max per caption.
Mix of styles: 3 funny, 3 inspirational, 2 question-based, 2 factual."`,
};

export const tools: ToolMeta[] = [
  { name: "Claude", icon: "🔮", best_for: "Nuanced long-form writing, analysis", is_free: true, category: "writing_content" },
  { name: "ChatGPT", icon: "💬", best_for: "Versatile writing, brainstorming, creative", is_free: true, category: "writing_content" },
  { name: "Gemini", icon: "♊", best_for: "Long documents, multimodal, Google ecosystem", is_free: true, category: "writing_content" },
  { name: "Jasper AI", icon: "✍️", best_for: "Marketing copy at scale, brand-consistent", is_free: false, category: "writing_content" },
  { name: "Copy.ai", icon: "📋", best_for: "Short-form copy: ads, emails, captions", is_free: true, category: "writing_content" },
];
