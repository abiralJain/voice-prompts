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
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-[var(--bg)] px-3 pb-10 pt-6 min-[400px]:px-4 min-[400px]:pt-8 md:pb-16 md:pt-12">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl flex-1 items-center gap-10 min-[400px]:gap-12 md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] md:gap-14 lg:gap-16">
        <div className="flex min-w-0 flex-col items-start text-left">
          <h1 className="mb-4 min-[400px]:mb-5 font-[family-name:var(--font-heading)] text-[clamp(1.5625rem,6.5vw,1.8125rem)] font-extrabold leading-[1.06] tracking-[-0.038em] text-[var(--text-primary)] min-[400px]:text-[28px] sm:text-[36px] sm:tracking-[-0.04em] md:text-[2.75rem] md:leading-[1.05] lg:text-[3rem]">
            Your voice, perfected prompts.
          </h1>
          <p className="mb-6 max-w-[28rem] text-base font-medium leading-[1.7] tracking-[-0.015em] text-[var(--text-secondary)] min-[400px]:mb-8 min-[400px]:text-[1.0625rem]">
            Speak naturally into any AI tool. We transform your messy thoughts into clear, professional
            prompts — optimized for 50+ AI tools.
          </p>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={onStartSpeaking} className="btn-hero-cta w-full sm:w-auto">
              <span aria-hidden>🎤</span>
              Start speaking
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary w-full px-8 py-4 text-base sm:w-auto"
            >
              See how it works
            </button>
          </div>

          <p className="mb-8 text-[0.8125rem] font-medium tracking-[-0.008em] text-[var(--text-tertiary)]">
            Free to use • No sign up required
          </p>

          <div
            id="tools"
            className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 shadow-[var(--shadow-sm)] min-[400px]:p-4 sm:max-w-xl md:p-5"
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)] min-[400px]:text-[12px]">
              Optimized for{" "}
              <span className="rounded-md bg-[var(--accent-brand-light)] px-1.5 py-0.5 text-[var(--accent-brand)]">
                50+
              </span>{" "}
              AI tools
            </p>
            <div className="min-w-0 overflow-hidden">
              <div className="flex w-max max-w-none animate-[marquee_32s_linear_infinite] gap-2 hover:[animation-play-state:paused] min-[400px]:gap-2.5">
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

      <div className="mx-auto mt-10 w-full min-w-0 max-w-6xl border-t border-[var(--border)] bg-[var(--bg)] pt-6 min-[400px]:mt-12 min-[400px]:pt-8">
        <button
          type="button"
          onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
          className="flex w-full flex-col items-center gap-1 py-3 text-xs font-medium text-[#9b9b9b] hover:text-[#6b6b6b]"
        >
          <span className="text-lg leading-none">↓</span>
          <span>See how it works</span>
        </button>
      </div>
    </div>
  );
}
