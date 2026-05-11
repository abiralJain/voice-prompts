"use client";

import { useState } from "react";

interface FeedbackSectionProps {
  onTryAnother: () => void;
  onReRefineWithFeedback: (feedback: string) => Promise<void>;
}

export default function FeedbackSection({ onTryAnother, onReRefineWithFeedback }: FeedbackSectionProps) {
  const [celebrated, setCelebrated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  const handleReRefine = async () => {
    if (!feedback.trim()) return;
    setBusy(true);
    try {
      await onReRefineWithFeedback(feedback.trim());
      setExpanded(false);
      setFeedback("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-14 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[rgba(255,252,245,0.58)] p-5 shadow-[var(--shadow-card)] backdrop-blur-xl md:p-8">
      <h3 className="mb-2 text-center font-[family-name:var(--font-heading)] text-2xl font-extrabold tracking-[-0.04em] text-[var(--text-primary)]">
        Does this feel ready?
      </h3>
      <p className="mb-6 text-center text-sm font-semibold text-[var(--text-secondary)]">
        Keep the momentum or ask the studio to tune the result.
      </p>

      {celebrated ? (
        <div className="animate-fade-in text-center">
          <p className="mb-6 text-[var(--text-secondary)]">Great. Want to shape another idea?</p>
          <button
            type="button"
            onClick={() => {
              setCelebrated(false);
              onTryAnother();
            }}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M12 4.5a3.5 3.5 0 0 0-3.5 3.5v4a3.5 3.5 0 1 0 7 0V8A3.5 3.5 0 0 0 12 4.5Z" fill="currentColor" />
              <path d="M6 11.5v.75a6 6 0 0 0 12 0v-.75M12 18.25V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            Try another
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => setCelebrated(true)} className="btn-secondary px-8 py-2.5 text-sm">
            Perfect
          </button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="btn-ghost text-sm text-[var(--text-secondary)]"
          >
            Could be better
          </button>
        </div>
      )}

      {expanded && !celebrated ? (
        <div className="animate-fade-slide-up mt-8 space-y-4 border-t border-[var(--border)] pt-8">
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            Tell us what to change, then re-refine with your feedback folded in.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="min-h-32 w-full rounded-[1.35rem] border border-[var(--border)] bg-[var(--bg-interactive)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-brand)]/25"
            placeholder="e.g. More technical, different tone, another tool..."
          />
          <button
            type="button"
            disabled={!feedback.trim() || busy}
            onClick={handleReRefine}
            className="btn-primary w-full px-6 py-2.5 text-sm disabled:opacity-40 sm:w-auto"
          >
            {busy ? "Re-refining…" : "Re-refine with feedback"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
