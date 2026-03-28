"use client";

import { useEffect, useRef, useState } from "react";

const MESSY =
  'umm so I want to like build a landing page for my coffee shop with warm colors and maybe some animations and like a menu section...';

const CLEAN =
  "Create a modern landing page for an artisan coffee shop. Use a warm color palette (cream, terracotta, dark brown). Include: hero section with full-bleed image, animated menu section with hover effects, about story section with parallax scrolling, Instagram feed integration, and a footer with location map. Mobile-first, responsive design. Style: organic, premium, handcrafted feel.";

type Phase = "typing" | "pause-messy" | "morph" | "show-clean" | "pause-loop";

export default function AnimatedDemo() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };

    const schedule = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    const runLoop = () => {
      clear();
      setTyped("");
      setPhase("typing");

      let i = 0;
      const typeNext = () => {
        if (i >= MESSY.length) {
          setPhase("pause-messy");
          schedule(() => setPhase("morph"), 1000);
          schedule(() => setPhase("show-clean"), 1600);
          schedule(() => setPhase("pause-loop"), 4200);
          schedule(() => runLoop(), 6200);
          return;
        }
        const ch = MESSY[i] ?? "";
        i += 1;
        const delay = /[.,]/.test(ch) ? 220 + Math.random() * 180 : 28 + Math.random() * 45;
        setTyped((t) => t + ch);
        schedule(typeNext, delay);
      };
      typeNext();
    };

    runLoop();
    return clear;
  }, []);

  return (
    <div
      className="pointer-events-none mx-auto w-full max-w-[28rem] cursor-default select-none overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-hero-demo)] shadow-[var(--shadow-card)]"
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]/80 px-3 py-2.5 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-sm">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-0.5 text-[var(--text-primary)]">✨ VoicePrompt Demo</span>
      </div>

      <div className="p-5 md:p-6">
        <div className="relative min-h-[200px] md:min-h-[220px]">
          {(phase === "typing" || phase === "pause-messy") && (
            <div
              className={`transition duration-500 ${
                phase === "pause-messy" ? "opacity-90" : "opacity-100"
              }`}
            >
              <p className="mb-2 text-xs text-[var(--text-tertiary)]">Before</p>
              <p
                className="font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
                style={{ fontStyle: "italic" }}
              >
                {typed}
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--accent-brand)] align-middle" />
              </p>
            </div>
          )}

          {(phase === "morph" || phase === "show-clean" || phase === "pause-loop") && (
            <div className="crossfade-enter">
              <p className="mb-2 text-xs font-medium text-[var(--success)]">After</p>
              <p
                className={`font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--text-primary)] transition md:text-base ${
                  phase === "morph" ? "blur-sm opacity-40" : "blur-0 opacity-100"
                }`}
              >
                {CLEAN}
              </p>
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium transition ${
                  phase === "show-clean" || phase === "pause-loop"
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
              >
                <span>▲</span>
                <span className="text-[var(--text-tertiary)]">Best for</span>
                <span className="font-semibold text-[var(--accent-brand)]">v0 by Vercel</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
