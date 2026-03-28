import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  ChatGPT: `CHATGPT — General purpose, browsing, images, creative brainstorming

KEY RULES:
- Provide context: who you are, your expertise level, what this is for
- Specify response format: bullet points, essay, table, step-by-step
- Use Custom Instructions for persistent preferences
- Can browse web, generate images, analyze files, execute code
- Good for: explaining concepts, brainstorming, general Q&A, creative tasks`,

  Claude: `CLAUDE — Nuanced reasoning, careful analysis, long context

KEY RULES:
- Use XML tags for complex requests
- Best for: nuanced explanations, ethical considerations, long document analysis
- 200K token context — can process entire codebases or book-length documents
- Direct and explicit instructions work best`,

  Gemini: `GEMINI — Multimodal, Google ecosystem, large context

KEY RULES:
- 1M token context window — largest available
- Multimodal: text, images, audio, video, code
- Deep integration with Google services
- Good for: multimodal tasks, long context analysis, Google ecosystem workflows`,

  Perplexity: `PERPLEXITY — Cited, fact-checked answers from the web

KEY RULES:
- Best when you need VERIFIED information with sources
- Every answer includes citations
- Use Focus modes for targeted search
- NOT for creative writing — use for research and fact-finding`,
};

export const tools: ToolMeta[] = [
  { name: "ChatGPT", icon: "💬", best_for: "General purpose, browsing, images, brainstorming", is_free: true, category: "general_chat" },
  { name: "Claude", icon: "🔮", best_for: "Nuanced reasoning, careful analysis", is_free: true, category: "general_chat" },
  { name: "Gemini", icon: "♊", best_for: "Multimodal, Google ecosystem, large context", is_free: true, category: "general_chat" },
  { name: "Perplexity", icon: "🔍", best_for: "Cited, fact-checked answers from the web", is_free: true, category: "general_chat" },
];
