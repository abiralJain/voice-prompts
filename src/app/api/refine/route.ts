import {
  classifyTranscript,
  generatePrompts,
  isRateLimitError,
  userFacingLlmError,
} from "@/lib/groq";
import {
  getCategoryTools,
  isValidCategory,
  resolveTopThree,
  type CategoryKey,
} from "@/lib/toolDocs";
import type { RefineResponse } from "@/types";
import { NextResponse } from "next/server";

const MAX_GEN_ATTEMPTS = 2;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript } = body;
    const modeRaw = body.mode as string | undefined;
    const mode: "enhance" | "clean" = modeRaw === "clean" ? "clean" : "enhance";

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const trimmed = transcript.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    if (wordCount < 5) {
      return NextResponse.json(
        { error: "Transcript too short. Need at least 5 words." },
        { status: 400 },
      );
    }

    const classified = await classifyTranscript(trimmed);
    const category: CategoryKey = isValidCategory(classified.category)
      ? classified.category
      : "general_chat";
    const allCategoryTools = getCategoryTools(category);

    const top3 = resolveTopThree(category, classified.top3);

    let lastError: Error | null = null;
    let toolsPayload: { tools: RefineResponse["tools"]; improvements_made: string[] } | null =
      null;

    for (let attempt = 0; attempt < MAX_GEN_ATTEMPTS; attempt += 1) {
      try {
        toolsPayload = await generatePrompts(trimmed, category, top3, mode);
        break;
      } catch (e) {
        lastError = e instanceof Error ? e : new Error("Generation failed");
        if (attempt < MAX_GEN_ATTEMPTS - 1) {
          await new Promise((r) => setTimeout(r, 500));
        }
      }
    }

    if (!toolsPayload) {
      const message = lastError ? userFacingLlmError(lastError) : "Prompt generation failed";
      const status = lastError && isRateLimitError(lastError) ? 429 : 502;
      return NextResponse.json(
        {
          error: message,
          partial: {
            category,
            category_label: classified.category_label,
            all_category_tools: allCategoryTools,
            original_transcript: trimmed,
          },
        },
        { status },
      );
    }

    const rawTools = toolsPayload.tools.slice(0, Math.min(toolsPayload.tools.length, 3));
    const tools = rawTools.map((t, i) => {
      const canonical = top3[i] ?? t.tool_name;
      const meta = allCategoryTools.find((m) => m.name === canonical);
      return {
        ...t,
        tool_name: canonical,
        tool_icon: meta?.icon ?? t.tool_icon,
        best_for: meta?.best_for ?? t.best_for,
        is_free: meta?.is_free ?? t.is_free,
      };
    });

    const refineResponse: RefineResponse = {
      category,
      category_label: classified.category_label || category,
      best_match_index: 0,
      tools,
      improvements_made: toolsPayload.improvements_made ?? [],
      prompt_mode: mode,
      all_category_tools: allCategoryTools,
      original_transcript: trimmed,
    };

    return NextResponse.json(refineResponse);
  } catch (error: unknown) {
    console.error("Refine API error:", error);
    const message = userFacingLlmError(error);
    const status = isRateLimitError(error) ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
