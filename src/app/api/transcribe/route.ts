import { transcribeAudio, userFacingLlmError } from "@/lib/groq";
import { NextResponse } from "next/server";

const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Audio upload must use multipart form data" }, { status: 400 });
    }

    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    if (audio.size === 0) {
      return NextResponse.json({ error: "Recording was empty. Try speaking again." }, { status: 400 });
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Recording is too long. Try a shorter voice note." },
        { status: 413 },
      );
    }

    const transcript = await transcribeAudio(audio);
    if (!transcript) {
      return NextResponse.json(
        { error: "No speech was detected. Try speaking a bit louder." },
        { status: 422 },
      );
    }

    return NextResponse.json({ transcript });
  } catch (error: unknown) {
    console.error("Transcription API error:", error);
    return NextResponse.json({ error: userFacingLlmError(error) }, { status: 500 });
  }
}
