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

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13l-5.6-2 5.6-2L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProblemSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id="problem"
      ref={ref}
      className={`reveal-on-scroll relative overflow-hidden bg-[var(--bg-secondary)] py-20 md:py-28 ${visible ? "is-visible" : ""}`}
    >
      <div className="mx-auto min-w-0 max-w-6xl px-3 min-[400px]:px-4 md:px-8">
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
          <SparkIcon />
          The actual problem
        </p>
        <h2 className="mb-5 max-w-4xl font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-[var(--text-primary)] md:text-6xl">
          The best prompt is usually hiding inside a messy thought.
        </h2>
        <p className="mb-12 max-w-2xl text-[1.0625rem] font-medium leading-[1.75] tracking-[-0.01em] text-[var(--text-secondary)]">
          Instead of asking you to write like a prompt engineer, VoicePrompt lets you speak naturally,
          then turns that into a clean request with structure, context, and constraints.
        </p>
        <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr] md:items-stretch">
          <div className="card hover-lift relative overflow-hidden">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              Raw thought
            </p>
            <p className="font-[family-name:var(--font-mono)] text-sm italic leading-relaxed text-[var(--text-secondary)]">
              &ldquo;
              {BEFORE_PARTS.map((p, i) =>
                p.h ? (
                  <mark key={i} className="rounded-md bg-[rgba(17,17,17,0.06)] px-1 text-[var(--text-secondary)]">
                    {p.t}
                  </mark>
                ) : (
                  <span key={i}>{p.t}</span>
                ),
              )}
              &rdquo;
            </p>
            <div className="mt-5 flex gap-1.5">
              {[34, 58, 28, 76, 44, 64].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="w-2 rounded-full bg-[rgba(17,17,17,0.12)]"
                  style={{ height }}
                  aria-hidden
                />
              ))}
            </div>
          </div>
          <div className="card card-active hover-lift relative overflow-hidden">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              Prompt engineered
            </p>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-interactive)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              <SparkIcon /> Cursor ready
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
