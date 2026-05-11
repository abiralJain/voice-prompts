"use client";

import { useEffect, useRef, useState } from "react";

const MESSY =
  "umm I need a product page for my app, it records voice and makes prompts, like make it feel premium but simple and maybe show the flow...";

const CLEAN =
  "Design and build a premium responsive landing page for a voice-to-prompt AI app. Show the flow: record voice, review transcript, refine for the best AI tool, copy the final prompt. Use a polished product aesthetic, clear mobile layout, accessible controls, and subtle micro-interactions.";
const START_TEXT = "I need";

type Phase = "typing" | "pause-messy" | "morph" | "show-clean" | "pause-loop";

export default function AnimatedDemo() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(START_TEXT);
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
      setTyped(START_TEXT);
      setPhase("typing");

      let i = START_TEXT.length;
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
      className="pointer-events-none mx-auto w-full max-w-[31rem] cursor-default select-none overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-hero-demo)] text-[var(--text-on-dark)] shadow-[var(--shadow-lg)]"
      aria-hidden
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/60">
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none">
              <path d="M12 5v14M7 10v4M17 8v8M4 12v1M20 11v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          VoicePrompt Studio
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]">
          live
        </span>
      </div>

      <div className="relative p-5 md:p-6">
        <div className="mb-5 grid grid-cols-3 gap-2">
          {["Record", "Refine", "Copy"].map((label, index) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <p className="text-[10px] font-semibold text-white/32">0{index + 1}</p>
              <p className="text-xs font-semibold text-white/76">{label}</p>
            </div>
          ))}
        </div>
        <div className="relative min-h-[190px]">
          {(phase === "typing" || phase === "pause-messy") && (
            <div
              className={`rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition duration-500 ${
                phase === "pause-messy" ? "opacity-90" : "opacity-100"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/38">Raw voice</p>
                <div className="flex h-7 items-end gap-1 rounded-full bg-black/20 px-2 py-1.5">
                  {[0, 1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className="h-3 w-1 rounded-full bg-white/70"
                      style={{ animation: `meter ${620 + bar * 90}ms ease-in-out infinite` }}
                    />
                  ))}
                </div>
              </div>
              <p
                className="text-sm font-medium leading-relaxed text-white/66 md:text-[15px]"
                style={{ fontStyle: "italic" }}
              >
                {typed}
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white align-middle" />
              </p>
            </div>
          )}

          {(phase === "morph" || phase === "show-clean" || phase === "pause-loop") && (
            <div className="crossfade-enter">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/78">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Tool-ready prompt
              </div>
              <p
                className={`rounded-2xl border border-white/10 bg-[#f8f6ee] p-4 text-sm font-medium leading-relaxed text-[#111111] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition md:text-[15px] ${
                  phase === "morph" ? "blur-sm opacity-40" : "blur-0 opacity-100"
                }`}
              >
                {CLEAN}
              </p>
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold transition ${
                  phase === "show-clean" || phase === "pause-loop"
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none">
                  <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white/48">Best match</span>
                <span className="text-white">Cursor</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
