"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const STEPS = [
  {
    n: "01",
    title: "Capture the thought",
    body: "Talk naturally or type. The studio keeps the focus on your idea instead of perfect wording.",
    icon: "voice",
  },
  {
    n: "02",
    title: "Shape the intent",
    body: "Review the transcript, add detail, then let the system classify the task and pick strong tools.",
    icon: "shape",
  },
  {
    n: "03",
    title: "Launch the prompt",
    body: "Copy a polished prompt, switch tools, clean it up, or re-refine with feedback in seconds.",
    icon: "copy",
  },
];

function StepIcon({ type }: { type: string }) {
  if (type === "shape") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M5 12c4.5 0 7-2.5 7-7 0 4.5 2.5 7 7 7-4.5 0-7 2.5-7 7 0-4.5-2.5-7-7-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "copy") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M8 8.5V7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1.5M5 8.5h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M12 4.5a3.5 3.5 0 0 0-3.5 3.5v4a3.5 3.5 0 1 0 7 0V8A3.5 3.5 0 0 0 12 4.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 11.5v.75a6 6 0 0 0 12 0v-.75M12 18.25V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function HowItWorksSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className={`reveal-on-scroll relative overflow-hidden py-20 md:py-28 ${visible ? "is-visible" : ""}`}
    >
      <div className="mx-auto min-w-0 max-w-6xl px-3 min-[400px]:px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
            How it works
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-[var(--text-primary)] md:text-6xl">
            A short path from rough idea to usable prompt.
          </h2>
        </div>
        <div className="relative grid gap-5 md:grid-cols-3">
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-16 hidden h-px bg-[linear-gradient(90deg,transparent,var(--border),transparent)] md:block"
            aria-hidden
          />
          {STEPS.map((step, index) => (
            <article key={step.n} className="card hover-lift relative z-[1] transition">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-interactive)] text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <StepIcon type={step.icon} />
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[rgba(255,254,250,0.66)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
                  {step.n}
                </span>
              </div>
              <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-extrabold tracking-[-0.032em] text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="text-[0.96rem] font-medium leading-[1.7] tracking-[-0.012em] text-[var(--text-secondary)]">
                {step.body}
              </p>
              {index < STEPS.length - 1 ? (
                <span className="absolute -bottom-4 left-8 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-tertiary)] md:-right-4 md:bottom-auto md:left-auto md:top-14">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 md:block" fill="none" aria-hidden>
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
