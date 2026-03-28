"use client";

import AnimatedDemo from "./AnimatedDemo";

const TRUST_TOOLS = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "Cursor",
  "Suno",
  "Runway",
  "v0",
  "Perplexity",
  "DALL-E",
  "Figma",
];

interface LandingStateProps {
  onStartSpeaking: () => void;
}

export default function LandingState({ onStartSpeaking }: LandingStateProps) {
  const row = [...TRUST_TOOLS, ...TRUST_TOOLS];

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-[#ffffff] px-4 pb-10 pt-8 md:pb-16 md:pt-12">
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] md:gap-14 lg:gap-16">
        <div className="flex flex-col items-start text-left">
          <h1 className="mb-5 font-[family-name:var(--font-heading)] text-[36px] font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a] md:text-5xl lg:text-[48px]">
            Your voice, perfected prompts.
          </h1>
          <p className="mb-8 max-w-[480px] text-lg leading-relaxed text-[#6b6b6b]">
            Speak naturally into any AI tool. We transform your messy thoughts into clear, professional
            prompts — optimized for 50+ AI tools.
          </p>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={onStartSpeaking} className="btn-hero-cta">
              <span aria-hidden>🎤</span>
              Start speaking
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary px-8 py-4 text-base"
            >
              See how it works
            </button>
          </div>

          <p className="mb-8 text-sm text-[#9b9b9b]">Free to use • No sign up required</p>

          <div
            id="tools"
            className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 shadow-[var(--shadow-sm)] md:p-5"
          >
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1a1a1a]">
              Optimized for{" "}
              <span className="rounded-md bg-[var(--accent-brand-light)] px-1.5 py-0.5 text-[var(--accent-brand)]">
                50+
              </span>{" "}
              AI tools
            </p>
            <div className="overflow-hidden">
              <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-2.5 hover:[animation-play-state:paused]">
                {row.map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    className="shrink-0 rounded-full border border-[var(--border)] bg-[#ffffff] px-3 py-1.5 text-xs font-medium text-[#6b6b6b] shadow-[var(--shadow-sm)]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="animate-gentle-float w-full max-w-lg md:max-w-none">
            <AnimatedDemo />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl border-t border-[var(--border)] bg-[#ffffff] pt-8">
        <button
          type="button"
          onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
          className="flex w-full flex-col items-center gap-1 text-xs font-medium text-[#9b9b9b] hover:text-[#6b6b6b]"
        >
          <span className="text-lg leading-none">↓</span>
          <span>See how it works</span>
        </button>
      </div>
    </div>
  );
}
