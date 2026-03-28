"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const STEPS = [
  {
    n: "01",
    title: "Speak",
    body: "Talk naturally. Ramble, use filler words — we extract the real intent.",
    icon: "🎙️",
  },
  {
    n: "02",
    title: "Refine",
    body: "AI classifies your task, picks the best tools, and crafts optimized prompts.",
    icon: "✨",
  },
  {
    n: "03",
    title: "Use",
    body: "Copy a production-ready prompt. Switch tools instantly.",
    icon: "📋",
  },
];

export default function HowItWorksSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className={`reveal-on-scroll bg-[#ffffff] py-20 md:py-24 ${visible ? "is-visible" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="mb-12 text-center font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Three steps to better prompts
        </h2>
        <div className="relative grid gap-8 md:grid-cols-3">
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-14 hidden h-px bg-[var(--border)] md:block"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-[31%] top-11 hidden text-[var(--text-tertiary)] md:block"
            aria-hidden
          >
            →
          </div>
          <div
            className="pointer-events-none absolute right-[31%] top-11 hidden text-[var(--text-tertiary)] md:block"
            aria-hidden
          >
            →
          </div>
          {STEPS.map((step) => (
            <article key={step.n} className="card relative z-[1] transition hover:shadow-[var(--shadow-md)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  {step.icon}
                </span>
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--text-secondary)]">
                  {step.n}
                </span>
              </div>
              <h3 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-semibold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
