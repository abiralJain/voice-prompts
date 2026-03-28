import type { ToolMeta } from "@/lib/toolDocs";

export type { ToolMeta };

export type PromptMode = "enhance" | "clean";

export interface ToolPrompt {
  tool_name: string;
  tool_icon: string;
  best_for: string;
  is_free: boolean;
  refined_prompt: string;
  prompt_explanation: string;
}

/** Raw JSON from the classification model. */
export interface ClassificationLlmResult {
  category: string;
  category_label: string;
  top3: string[];
}

export interface ClassificationResult extends ClassificationLlmResult {
  allCategoryTools: ToolMeta[];
}

export interface RefineResponse {
  category: string;
  category_label: string;
  tools: ToolPrompt[];
  best_match_index: number;
  original_transcript: string;
  improvements_made: string[];
  all_category_tools: ToolMeta[];
  prompt_mode: PromptMode;
}

export type HeroState =
  | "landing"
  | "recording"
  | "reviewing"
  | "processing"
  | "results";

export type RecordingStatus = "idle" | "recording" | "paused" | "stopped";
