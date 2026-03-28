import type { ToolMeta } from "./types";

export const toolDocs: Record<string, string> = {
  Cursor: `CURSOR — AI-Powered IDE for developers

Official best practices (source: cursor.com/blog/agent-best-practices):

PROMPT STRUCTURE:
- ALWAYS start with the tech stack: "Using Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui"
- Describe the DESIRED END STATE, not step-by-step instructions
- Reference specific files using @filename syntax: "@components/Header.tsx", "@lib/auth.ts"
- Include error handling: "Handle loading, error, and empty states with appropriate UI"
- Mention testing: "Add unit tests using Jest/Vitest for the core logic"
- Include accessibility: "Use semantic HTML, ARIA labels, keyboard navigation"
- Add "Don't modify any other files" to prevent unwanted changes
- One task per prompt — don't mix unrelated changes

WHAT MAKES GOOD CURSOR PROMPTS:
- Specific > vague: "Write a test case for auth.ts covering the logout edge case, using patterns from __tests__/" is MUCH better than "add tests for auth.ts"
- Describe BEHAVIOR not just appearance: "When user clicks Submit, validate all fields, show inline errors, and POST to /api/form"
- For refactoring: describe CURRENT state AND desired state
- For UI: specify responsive behavior, dark mode, hover/focus states, animations
- Include data types and interfaces when relevant

EXAMPLE PROMPT:
"Using Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui, create a notification bell component in @components/NotificationBell.tsx. It should:
- Show a bell icon with a red badge count from the useNotifications hook in @hooks/useNotifications.ts
- On click, open a dropdown (shadcn Popover) showing the last 10 notifications
- Each notification shows title, timestamp, and read/unread status
- Clicking a notification marks it as read and navigates to notification.link
- Handle: loading state (Skeleton), empty state ('No notifications'), error state (retry button)
- Responsive: dropdown is full-width on mobile, 320px on desktop
- Animate the badge count with a subtle scale pulse when new notifications arrive
- Don't modify any other files."`,

  "v0 by Vercel": `V0 BY VERCEL — AI-powered React/Next.js UI generation

Official best practices (source: vercel.com/blog/how-to-prompt-v0):

V0 PROMPT FRAMEWORK (3 core inputs):
1. PRODUCT SURFACE: List the actual components, features, and data
2. USER CONTEXT: Who uses it, their role, technical comfort, time constraints, environment
3. CONSTRAINTS: Tech stack, design system, responsive requirements, accessibility

KEY RULES:
- v0 generates React components using shadcn/ui + Tailwind CSS
- Name shadcn components explicitly: Card, Button, Badge, Dialog, Tabs, Sheet, Popover, Command, Avatar, Separator, ScrollArea, Skeleton, Alert, Toast
- Use Tailwind utilities for precise styling: "rounded-xl", "shadow-lg", "bg-zinc-900"
- Specify ALL interactive states: default, hover, active, focus, disabled, loading, error, empty
- Include responsive behavior: "On mobile (< 768px) stack vertically. On desktop, 3-column grid with gap-6"
- Dark mode: "Support light and dark using Tailwind dark: variant"
- Animations: "Use framer-motion for mount/unmount" or "CSS transition-all duration-200 on hover"
- v0 produces the CLEANEST React code — use for UI components, not full backend apps
- Specific prompts with context take ~26 seconds longer but deliver completely functional products vs generic output that needs 1-2 more prompts to fix

EXAMPLE PROMPT (from official Vercel guide):
"Build a support ticket dashboard using shadcn/ui Card, Badge, Tabs, and ScrollArea.
Shows: open tickets count, avg response time, satisfaction score at top.
Ticket list with columns: ID, subject, priority (Badge: red=urgent, yellow=high, green=normal), status, assigned agent, created date.
Filter by: status (Open/In Progress/Resolved), priority, date range.
User context: Support managers monitoring team performance on large desktop monitors.
Constraints: Light theme, high contrast for quick scanning. Color code: red for urgent, yellow for high, green for resolved. Mobile: single column, priority badges prominent."`,

  "Bolt.new": `BOLT.NEW — Fastest prompt-to-working-prototype, browser-based

KEY RULES:
- Give ONE comprehensive first prompt — Bolt works best with a complete app description upfront
- Describe EVERY page/screen the app needs
- Specify the complete user flow from first visit to final action
- Include visual style: "Modern, clean, rounded corners, soft shadows, sans-serif typography"
- Include data model: what data exists, relationships, storage
- Mention authentication if needed (email/password, Google, magic link)
- Mention integrations: Supabase for database, Stripe for payments, etc.
- Subsequent edit prompts should reference specific pages/components
- Bolt uses Supabase under the hood for backend — leverage this

EXAMPLE PROMPT:
"Build a freelancer invoicing app with these pages:
1. Dashboard: overview of total earned, pending invoices, recent activity
2. Clients: list of clients with add/edit, each client has name, email, company, billing address
3. Invoices: create new invoice by selecting client, adding line items (description, quantity, rate), tax %, notes. Auto-calculate totals. Status: Draft/Sent/Paid/Overdue
4. Invoice detail: preview the invoice in a professional template, download as PDF, mark as paid
User flow: Sign up → Add first client → Create first invoice → Send via email link → Client views and pays
Auth: Email/password with Supabase
Style: Clean, professional, white background with blue accents, Inter font, responsive
Data: Supabase for clients, invoices, line items tables with foreign key relationships"`,

  Lovable: `LOVABLE — Full-stack apps from natural language, no code needed

KEY RULES:
- Describe from the USER'S perspective using stories: "As a user, I can..."
- Mention every feature as a user action
- Specify auth, database, payments if needed
- Visual style in everyday language: "modern and clean" not "Tailwind utility-first"
- Lovable makes assumptions — be explicit about what you DON'T want
- Works best for: landing pages, dashboards, CRUD apps, internal tools

EXAMPLE PROMPT:
"Build a habit tracker app. As a user I can:
- Sign up and create my profile
- Add habits I want to track (name, icon, frequency: daily/weekly)
- Check off habits each day on a calendar view
- See my streaks and completion percentage for each habit
- View a weekly summary showing which habits I kept and which I missed
- The app should feel motivating with subtle animations when I complete habits
- Use green for completed, gray for missed, blue for today
- Mobile-first design, works great on phones"`,

  Replit: `REPLIT — Browser-based IDE with AI Agent, multi-language support

KEY RULES:
- Specify the programming language explicitly
- Describe the full application including backend
- Mention if you need database, API, or specific packages
- Replit Agent works well with conversational follow-ups
- Great for: quick experiments, learning, prototypes, multi-language projects
- Supports 50+ languages

EXAMPLE PROMPT:
"Build a Python Flask API that manages a book library.
Endpoints: GET /books (list all, with pagination), POST /books (add new), GET /books/:id (single book), PUT /books/:id (update), DELETE /books/:id
Each book has: title, author, isbn, genre, published_year, cover_image_url
Use SQLite for storage with SQLAlchemy ORM
Include input validation, error handling (404, 400, 500)
Add a simple HTML frontend at / that displays the book list with search and filter by genre"`,

  "GitHub Copilot": `GITHUB COPILOT — Inline code completion in VS Code/JetBrains

KEY RULES:
- Write detailed code COMMENTS as prompts — Copilot reads the comment and generates the code
- Specify input types, output types, and edge cases in comments
- Keep surrounding context relevant — Copilot uses open files for context
- Works best for function-level completions, not full apps
- Tab to accept, Esc to reject suggestions

EXAMPLE (write this as a comment, Copilot generates the code below):
"// Function that takes an array of user objects and returns a Map
// where keys are department names and values are arrays of users in that department
// Handle: empty array, users with no department (group under 'Unassigned')
// Sort users within each department alphabetically by last name"`,

  Windsurf: `WINDSURF — AI-native IDE, agentic coding with deep context

KEY RULES:
- Similar to Cursor — specify tech stack, file references, behavioral descriptions
- Supports long autonomous task chains (agent mode)
- Good at multi-file refactoring
- Specify end state clearly`,

  "Claude Code": `CLAUDE CODE — Terminal-based agentic coding by Anthropic

KEY RULES:
- Runs in terminal, not an IDE
- Be very specific about which files to create/modify
- Describe the current state AND desired end state
- Include testing and validation requirements
- Works well for large-scale refactoring across many files
- Can run tests, lint, and verify its own work

EXAMPLE PROMPT:
"In the /src/api directory, refactor all Express route handlers to use a consistent error handling pattern. Currently each handler has its own try/catch. Create a shared asyncHandler wrapper in /src/middleware/asyncHandler.ts that catches errors and passes them to the error middleware. Apply it to all 12 route files. Run the existing tests after to verify nothing broke."`,
};

export const tools: ToolMeta[] = [
  { name: "Cursor", icon: "⚡", best_for: "AI-powered IDE for existing codebases and complex projects", is_free: true, category: "coding" },
  { name: "v0 by Vercel", icon: "▲", best_for: "React/Next.js UI components with shadcn/ui and Tailwind", is_free: true, category: "coding" },
  { name: "Bolt.new", icon: "⚡", best_for: "Fastest prompt-to-prototype, browser-based MVPs", is_free: true, category: "coding" },
  { name: "Lovable", icon: "💜", best_for: "Full-stack apps from natural language for non-developers", is_free: true, category: "coding" },
  { name: "Replit", icon: "🔄", best_for: "Browser-based IDE with AI Agent, multi-language", is_free: true, category: "coding" },
  { name: "GitHub Copilot", icon: "🤖", best_for: "Inline code completion in VS Code", is_free: true, category: "coding" },
  { name: "Windsurf", icon: "🏄", best_for: "AI-native IDE with deep context awareness", is_free: true, category: "coding" },
  { name: "Claude Code", icon: "🔮", best_for: "Terminal-based agentic coding and refactoring", is_free: false, category: "coding" },
];
