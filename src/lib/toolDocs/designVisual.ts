import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  Canva: `CANVA — Social media graphics, marketing materials, quick designs

PROMPT RULES:
- Specify dimensions or platform:
  Instagram Post: 1080x1080, Instagram Story: 1080x1920
  LinkedIn Banner: 1584x396, Twitter/X Header: 1500x500
  YouTube Thumbnail: 1280x720, Facebook Cover: 820x312
  A4 Poster: 210x297mm, Presentation: 1920x1080
- Include brand colors (hex codes) and fonts
- Describe layout: "headline top center, image below, CTA button bottom"
- Specify style: "minimalist", "bold and colorful", "corporate", "playful"
- Mention templates if relevant: "resume template", "invoice template"`,

  Gamma: `GAMMA — AI presentations and documents

PROMPT RULES:
- Provide an outline with key points PER SLIDE
- Specify tone: formal, casual, startup pitch, educational, sales
- Mention charts/data visualization needs
- Specify slide count and audience
- Gamma auto-generates layout and styling

EXAMPLE:
"Create a 12-slide investor pitch deck for a fintech startup called PayFlow.
Slides: 1) Title + tagline, 2) Problem: small businesses struggle with invoicing, 3) Solution: AI-powered invoicing, 4) How it works (3-step process), 5) Market size ($50B TAM), 6) Business model (SaaS subscription), 7) Traction (500 beta users, 85% retention), 8) Competitive landscape, 9) Team, 10) Financial projections, 11) Ask: $2M seed round, 12) Contact
Tone: confident, data-driven, clean design. Use charts for market size and projections."`,

  "Napkin AI": `NAPKIN AI — Text to infographics and visual diagrams

PROMPT RULES:
- Provide well-structured text with clear hierarchy (headers, bullets)
- The tool auto-generates visuals from your text structure
- Better organized input = better visual output
- Good for: process diagrams, comparison charts, flowcharts, data visualization`,

  Whimsical: `WHIMSICAL — Flowcharts, wireframes, mind maps

PROMPT RULES:
- Describe process steps, decision points, and connections
- Specify diagram type: flowchart, mind map, wireframe, sequence diagram
- Mention the level of detail needed
- Integration with Figma, Slack, Notion

EXAMPLE:
"Create a flowchart for user onboarding:
Start → Sign up (email or Google) → Email verification → Profile setup (name, role, avatar) → Choose plan (Free/Pro) → If Free: go to dashboard. If Pro: payment page → payment success → dashboard. From dashboard: show welcome tour (3 steps) → complete tour → full access.
Include decision diamonds for plan choice and payment success/failure."`,

  Figma: `FIGMA — UI/UX design, prototyping, design systems

PROMPT RULES (for Figma AI features):
- Describe components with EXACT specifications
- Include: padding, spacing, border-radius, colors (hex), typography (font, size, weight)
- Specify all states: default, hover, active, focus, disabled, loading
- Include responsive behavior
- Reference design tokens if using a design system

EXAMPLE:
"Design a notification card component:
- Container: 360px width, 16px padding, 12px border-radius, #FFFFFF background, 1px border #E5E7EB, subtle shadow (0 1px 3px rgba(0,0,0,0.1))
- Left: 40px circular avatar image
- Right of avatar: 12px gap, then title (14px, 600 weight, #111827) and description (13px, 400 weight, #6B7280) stacked
- Far right: timestamp (12px, #9CA3AF) and unread dot (8px circle, #3B82F6) if unread
- Hover state: background #F9FAFB, border #D1D5DB
- Unread state: left 3px blue border accent"`,
};

export const tools: ToolMeta[] = [
  { name: "Canva", icon: "🎨", best_for: "Social media graphics, marketing materials", is_free: true, category: "design_visual" },
  { name: "Gamma", icon: "📊", best_for: "AI presentations and documents", is_free: true, category: "design_visual" },
  { name: "Napkin AI", icon: "📝", best_for: "Text to infographics automatically", is_free: true, category: "design_visual" },
  { name: "Whimsical", icon: "💭", best_for: "Flowcharts, wireframes, mind maps", is_free: true, category: "design_visual" },
  { name: "Figma", icon: "🖌️", best_for: "UI/UX design, prototyping, design systems", is_free: true, category: "design_visual" },
];
