import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  "Perplexity AI": `PERPLEXITY AI — Real-time research with cited sources

Official documentation (source: docs.perplexity.ai/guides/prompt-guide):

CRITICAL DIFFERENCE FROM CHATGPT:
- Perplexity is a SEARCH ENGINE + LLM, not just an LLM
- Prompts initiate SEARCH + RETRIEVAL, not just generation
- Results include inline citations — every claim is sourced

FOCUS MODES:
- Web (default): searches entire internet
- Academic: prioritizes peer-reviewed papers, journals, scholarly sources
- Writing: disables search, generates from model only
- Social: Reddit, forums, discussions
- YouTube: video content
- Math: Wolfram Alpha integration

PROMPTING RULES FROM OFFICIAL DOCS:
- Be SPECIFIC, not broad. "What are 3 significant commercial AI applications in healthcare in 2025?" NOT "What's happening in AI?"
- Don't use LLM-style prompts: "Act as an expert chef and give me..." — instead: "What's a reliable sourdough recipe for beginners? Include ingredients and steps."
- ONE topic per query — don't mix unrelated questions
- Include constraints: timeframes, geography, output format
- Ask for citations explicitly: "Cite your sources"
- Use operators: site:sec.gov, filetype:pdf for targeted search

PRO SEARCH vs DEEP RESEARCH:
- Pro Search: faster, more focused, good for specific questions
- Deep Research: multi-stage, 5-15 page reports, synthesizes 100+ sources, takes minutes

EXAMPLE:
"What are the top 3 AI coding tools by developer adoption in 2025? Compare their pricing, key features, and limitations. Focus on tools with free tiers. Include data from developer surveys or usage statistics published in the last 6 months. Format as a comparison table."`,

  NotebookLM: `NOTEBOOKLM — Analyze your own uploaded documents

PROMPT RULES:
- Upload specific documents first, then ask targeted questions
- Only analyzes YOUR sources — no web search, no hallucinated citations
- Ask to compare, contrast, find patterns across sources
- Request structured output: "Create a summary table of findings"
- Great for: literature reviews, legal document analysis, meeting notes synthesis`,

  "ChatGPT Deep Research": `CHATGPT DEEP RESEARCH — Comprehensive multi-source investigation

PROMPT RULES:
- Frame as a clear research question with scope
- Specify depth, time period, geographic focus
- Ask for structured output with sections and citations
- Takes up to 30 minutes for comprehensive investigation
- Available to Plus and Pro subscribers

EXAMPLE:
"Research the current state of AI regulation in the European Union. Cover: existing regulations (AI Act), proposed amendments, enforcement mechanisms, and impact on startups. Focus on developments from January 2025 to present. Structure the report with sections for each topic and include sources."`,

  Claude: `CLAUDE — Long document analysis, nuanced reasoning

Official best practices (source: platform.claude.com/docs):

KEY RULES:
- Use XML tags for structure: <context>, <question>, <instructions>, <format>
- Claude was TRAINED on XML tags — they significantly improve output
- 200K token context window — upload entire documents
- For long docs: ask Claude to QUOTE relevant sections first, then analyze
- Be direct and explicit about what you want
- Specify output structure
- Ask for step-by-step reasoning when needed

EXAMPLE:
"<context>
I've uploaded three research papers on climate change adaptation strategies in South Asian agriculture.
</context>

<instructions>
1. First, identify and quote the key findings from each paper
2. Create a comparison table of the adaptation strategies discussed
3. Identify areas of agreement and disagreement between the papers
4. Highlight any gaps in the research that future studies should address
</instructions>

<format>
Use clear headings for each section. Include direct quotes with page references. End with a 200-word synthesis.
</format>"`,
};

export const tools: ToolMeta[] = [
  { name: "Perplexity AI", icon: "🔍", best_for: "Real-time research with cited sources", is_free: true, category: "research" },
  { name: "NotebookLM", icon: "📓", best_for: "Analyze your own uploaded documents", is_free: true, category: "research" },
  { name: "ChatGPT Deep Research", icon: "🧠", best_for: "Comprehensive multi-source investigation", is_free: false, category: "research" },
  { name: "Claude", icon: "🔮", best_for: "Long document analysis, nuanced reasoning", is_free: true, category: "research" },
];
