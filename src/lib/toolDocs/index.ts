import type { ToolMeta } from "./types";
import * as audioMusic from "./audioMusic";
import * as coding from "./coding";
import * as designVisual from "./designVisual";
import * as generalChat from "./generalChat";
import * as imageGeneration from "./imageGeneration";
import * as research from "./research";
import * as videoGeneration from "./videoGeneration";
import * as writingContent from "./writingContent";

export type { ToolMeta } from "./types";

const categoryModules = {
  coding,
  image_generation: imageGeneration,
  video_generation: videoGeneration,
  audio_music: audioMusic,
  research,
  design_visual: designVisual,
  writing_content: writingContent,
  general_chat: generalChat,
} as const;

export type CategoryKey = keyof typeof categoryModules;

/** Central registry: category id → tool metadata (matches product spec). */
export const TOOL_REGISTRY: Record<CategoryKey, ToolMeta[]> = {
  coding: [...coding.tools],
  image_generation: [...imageGeneration.tools],
  video_generation: [...videoGeneration.tools],
  audio_music: [...audioMusic.tools],
  research: [...research.tools],
  design_visual: [...designVisual.tools],
  writing_content: [...writingContent.tools],
  general_chat: [...generalChat.tools],
};

export function isValidCategory(category: string): category is CategoryKey {
  return Object.prototype.hasOwnProperty.call(categoryModules, category);
}

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  coding: "Coding & Development",
  image_generation: "Image Generation",
  video_generation: "Video Generation",
  audio_music: "Audio & Music",
  research: "Research",
  design_visual: "Design & Visual",
  writing_content: "Writing & Content",
  general_chat: "General Chat",
};

/** Deep documentation for one tool within its category (supports duplicate names across categories). */
export function getToolDoc(category: string, toolName: string): string {
  const mod = categoryModules[category as CategoryKey];
  if (!mod) return "";
  return mod.toolDocs[toolName] ?? "";
}

/** Alias: concatenate docs for multiple tools in the same category. */
export function getDocsForTools(category: string, toolNames: string[]): string {
  return getCategoryDocs(category, toolNames);
}

export function getCategoryDocs(category: string, toolNames: string[]): string {
  const parts: string[] = [];
  for (const name of toolNames) {
    const doc = getToolDoc(category, name);
    if (doc) {
      parts.push(`## TOOL: ${name}\n\n${doc}`);
    }
  }
  return parts.join("\n\n---\n\n");
}

/** Flat list for classification system prompt */
export function getClassificationToolList(): string {
  const lines: string[] = [];
  for (const [cat, list] of Object.entries(TOOL_REGISTRY) as [CategoryKey, ToolMeta[]][]) {
    const label = CATEGORY_LABELS[cat];
    for (const t of list) {
      lines.push(`- [${cat}] ${label} — ${t.name} (${t.best_for})`);
    }
  }
  return lines.join("\n");
}

export function getCategoryTools(category: string): ToolMeta[] {
  if (!isValidCategory(category)) return [];
  return [...TOOL_REGISTRY[category]];
}

/**
 * Resolve category for a tool name. If the name exists in multiple categories, pass `preferredCategory` from the client session.
 */
export function getCategoryForTool(
  toolName: string,
  preferredCategory?: string,
): CategoryKey | undefined {
  if (preferredCategory && isValidCategory(preferredCategory)) {
    const list = TOOL_REGISTRY[preferredCategory];
    if (list.some((t) => t.name === toolName)) return preferredCategory;
  }
  const hits: CategoryKey[] = [];
  for (const cat of Object.keys(TOOL_REGISTRY) as CategoryKey[]) {
    if (TOOL_REGISTRY[cat].some((t) => t.name === toolName)) hits.push(cat);
  }
  if (hits.length === 1) return hits[0];
  return undefined;
}

const normalizeKey = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export function resolveToolNameInCategory(category: string, raw: string): string | null {
  if (!isValidCategory(category)) return null;
  const list = TOOL_REGISTRY[category];
  const n = normalizeKey(raw);
  for (const t of list) {
    if (normalizeKey(t.name) === n) return t.name;
  }
  for (const t of list) {
    if (n.includes(normalizeKey(t.name)) || normalizeKey(t.name).includes(n)) return t.name;
  }
  return null;
}

export function resolveTopThree(category: string, names: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of names) {
    const resolved = resolveToolNameInCategory(category, raw);
    if (resolved && !seen.has(resolved)) {
      seen.add(resolved);
      out.push(resolved);
    }
    if (out.length >= 3) break;
  }
  if (isValidCategory(category)) {
    for (const t of TOOL_REGISTRY[category]) {
      if (!seen.has(t.name)) {
        seen.add(t.name);
        out.push(t.name);
      }
      if (out.length >= 3) break;
    }
  }
  return out.slice(0, 3);
}

export const ALL_TOOL_NAMES = Array.from(
  new Set(
    (Object.values(TOOL_REGISTRY) as ToolMeta[][]).flatMap((list) => list.map((t) => t.name)),
  ),
);
