import { ImageResponse } from "next/og";

export const alt = "VoicePrompt — Your voice, perfected prompts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(145deg, #faf8ff 0%, #f8f7f5 45%, #f2f0ed 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#6c5ce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            V
          </div>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#1a1a1a",
              letterSpacing: -0.02,
            }}
          >
            VoicePrompt
          </span>
        </div>
        <p
          style={{
            fontSize: 34,
            color: "#4a4a4a",
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.35,
            fontWeight: 500,
          }}
        >
          Your voice, perfected prompts — optimized for 50+ AI tools.
        </p>
        <div
          style={{
            marginTop: 48,
            height: 6,
            width: 200,
            borderRadius: 999,
            background: "linear-gradient(90deg, #6c5ce7, #a29bfe)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
