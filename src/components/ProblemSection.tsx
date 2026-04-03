"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const BEFORE_PARTS = [
  { t: "Um ", h: true },
  { t: "so ", h: true },
  { t: "basically I need ", h: true },
  { t: "like a dashboard thing for my startup where I can see users and maybe charts and ", h: false },
  { t: "uhh ", h: true },
  { t: "React I guess and it should look clean and stuff, ", h: false },
  { t: "you know what I mean, ", h: true },
  { t: "like not too busy but also informative...", h: false },
];

const AFTER_SNIPPET =
  "Build an admin dashboard in React and TypeScript with Tailwind: user list with search and filters, activity timeline, retention chart with Recharts, and CSV export. Include loading, empty, and error states, responsive layout, and accessible contrast. Pull data from a REST /api/users endpoint with pagination.";

export default function ProblemSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id="problem"
      ref={ref}
      className={`reveal-on-scroll bg-[var(--bg-secondary)] py-20 md:py-24 ${visible ? "is-visible" : ""}`}
    >
      <div className="mx-auto min-w-0 max-w-6xl px-3 min-[400px]:px-4 md:px-8">
        <h2 className="mb-3 max-w-3xl font-[family-name:var(--font-heading)] text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] md:text-4xl md:tracking-[-0.032em]">
          You use AI every day.
        </h2>
        <p className="mb-10 max-w-3xl text-2xl font-semibold leading-snug tracking-[-0.025em] text-[var(--text-secondary)] md:text-3xl">
          Your prompts hold you back.
        </p>
        <p className="mb-12 max-w-2xl text-[1.0625rem] leading-[1.7] tracking-[-0.012em] text-[var(--text-secondary)]">
          Rambling voice notes and vague requests waste time. VoicePrompt turns what you mean into
          clear, tool-ready prompts.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--error)]">
              Before
            </p>
            <p className="font-[family-name:var(--font-mono)] text-sm italic leading-relaxed text-[var(--text-tertiary)]">
              &ldquo;
              {BEFORE_PARTS.map((p, i) =>
                p.h ? (
                  <mark key={i} className="bg-pink-100 text-[var(--text-secondary)]">
                    {p.t}
                  </mark>
                ) : (
                  <span key={i}>{p.t}</span>
                ),
              )}
              &rdquo;
            </p>
          </div>
          <div className="card card-active">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--success)]">
              After
            </p>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-interactive)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-tertiary)]">
              <span>⚡</span> Cursor
            </p>
            <p className="font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--text-primary)]">
              {AFTER_SNIPPET}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
