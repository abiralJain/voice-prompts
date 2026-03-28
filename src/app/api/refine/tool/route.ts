import { generateSinglePrompt, isRateLimitError, userFacingLlmError } from "@/lib/groq";
import { getCategoryForTool, getCategoryTools, isValidCategory } from "@/lib/toolDocs";
import type { ToolPrompt } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transcript = body.transcript as string | undefined;
    const toolName = body.toolName as string | undefined;
    const categoryOverride = body.category as string | undefined;
    const modeRaw = body.mode as string | undefined;
    const mode: "enhance" | "clean" = modeRaw === "clean" ? "clean" : "enhance";

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }
    if (!toolName || typeof toolName !== "string") {
      return NextResponse.json({ error: "toolName is required" }, { status: 400 });
    }

    const trimmed = transcript.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    if (wordCount < 5) {
      return NextResponse.json(
        { error: "Transcript too short. Need at least 5 words." },
        { status: 400 },
      );
    }

    const name = toolName.trim();
    const preferred =
      categoryOverride && isValidCategory(categoryOverride) ? categoryOverride : undefined;
    const category = getCategoryForTool(name, preferred);
    if (!category) {
      return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
    }
    const generated = await generateSinglePrompt(trimmed, category, name, mode);
    const meta = getCategoryTools(category).find((m) => m.name === name);
    const tool: ToolPrompt = {
      ...generated,
      tool_name: name,
      tool_icon: meta?.icon ?? generated.tool_icon,
      best_for: meta?.best_for ?? generated.best_for,
      is_free: meta?.is_free ?? generated.is_free,
    };

    return NextResponse.json({ tool });
  } catch (error: unknown) {
    console.error("Refine tool API error:", error);
    const message = userFacingLlmError(error);
    const status = isRateLimitError(error) ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
