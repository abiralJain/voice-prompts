"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AnimatedDemo from "./AnimatedDemo";
import HeroThreeScene from "./HeroThreeScene";

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

const PROOF_POINTS = ["No account", "Voice or type", "Copy-ready output"];
const SIGNALS = ["Record", "Clarify", "Route", "Copy"];

interface LandingStateProps {
  onStartSpeaking: () => void;
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 4.5a3.5 3.5 0 0 0-3.5 3.5v4a3.5 3.5 0 1 0 7 0V8A3.5 3.5 0 0 0 12 4.5Z" fill="currentColor" />
      <path d="M6 11.5v.75a6 6 0 0 0 12 0v-.75M12 18.25V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 5v14m0 0 6-6m-6 6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingState({ onStartSpeaking }: LandingStateProps) {
  const row = [...TRUST_TOOLS, ...TRUST_TOOLS];
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        y: 18,
        opacity: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.to("[data-signal-chip]", {
        y: -6,
        duration: 1.8,
        stagger: 0.18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden px-4 pb-10 pt-8 md:pb-16 md:pt-12">
      <div className="pointer-events-none absolute left-1/2 top-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(31,92,255,0.13),transparent_62%)] blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute right-[8%] top-[12%] hidden h-72 w-72 rounded-full border border-[var(--border)] opacity-70 md:block" aria-hidden />

      <div className="mx-auto grid w-full min-w-0 max-w-6xl flex-1 items-center gap-10 md:grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)] md:gap-12 lg:gap-16">
        <div className="relative z-[1] flex min-w-0 flex-col items-start text-left">
          <p data-hero-reveal className="mb-5 rounded-full border border-[var(--border)] bg-[rgba(255,254,250,0.72)] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] shadow-[var(--shadow-sm)] backdrop-blur-xl">
            Voice-to-prompt workspace
          </p>

          <h1 data-hero-reveal className="mb-6 max-w-[13ch] font-[family-name:var(--font-heading)] text-[clamp(3.1rem,10vw,5.1rem)] font-extrabold leading-[0.96] tracking-[-0.055em] text-[var(--text-primary)] md:text-[clamp(4rem,5.7vw,5.9rem)]">
            Speak rough. Ship polished.
          </h1>
          <p data-hero-reveal className="mb-8 max-w-[35rem] text-[1.03rem] font-medium leading-[1.75] tracking-[-0.012em] text-[var(--text-secondary)] md:text-lg">
            VoicePrompt turns a spoken thought into a clean, tool-ready prompt for ChatGPT, Claude, Cursor, v0, and the rest of your AI stack.
          </p>

          <div data-hero-reveal className="mb-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button type="button" onClick={onStartSpeaking} className="btn-hero-cta w-full sm:w-auto">
              <MicIcon />
              Start with voice
            </button>
            <a href="#how-it-works" className="btn-secondary w-full px-8 py-4 text-base sm:w-auto">
              See the flow
            </a>
          </div>

          <div data-hero-reveal className="mb-8 flex w-full max-w-xl flex-wrap gap-x-5 gap-y-2">
            {PROOF_POINTS.map((point) => (
              <span
                key={point}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-brand)]" aria-hidden />
                {point}
              </span>
            ))}
          </div>

          <div
            id="tools"
            data-hero-reveal
            className="w-full min-w-0 max-w-xl overflow-hidden border-y border-[var(--border)] py-4"
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
              Works across your AI stack
            </p>
            <div className="min-w-0 overflow-hidden">
              <div className="flex w-max max-w-none animate-[marquee_38s_linear_infinite] gap-2 hover:[animation-play-state:paused] min-[400px]:gap-2.5">
                {row.map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div data-hero-reveal className="relative z-[1] flex min-h-[34rem] justify-center md:justify-end">
          <div className="absolute inset-x-0 top-0 h-64 md:-top-10 md:h-80">
            <HeroThreeScene />
          </div>
          <div className="absolute right-0 top-4 hidden w-full max-w-sm justify-between md:flex">
            {SIGNALS.map((signal) => (
              <span
                key={signal}
                data-signal-chip
                className="rounded-full border border-[var(--border)] bg-[rgba(255,254,250,0.72)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] backdrop-blur-xl"
              >
                {signal}
              </span>
            ))}
          </div>
          <div className="animate-gentle-float relative mt-32 w-full max-w-lg md:mt-44 md:max-w-none">
            <AnimatedDemo />
          </div>
        </div>
      </div>

      <div className="relative z-[1] mx-auto mt-8 w-full min-w-0 max-w-6xl border-t border-[var(--border)] pt-5 min-[400px]:mt-10">
        <a
          href="#problem"
          className="mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-tertiary)] hover:bg-[rgba(17,17,17,0.04)] hover:text-[var(--text-secondary)]"
        >
          <ArrowDownIcon />
          See the transformation
        </a>
      </div>
    </div>
  );
}
