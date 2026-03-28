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
    <section className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-[var(--shadow-sm)]">
      <h3 className="mb-6 text-center font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--text-primary)]">
        How did we do?
      </h3>

      {celebrated ? (
        <div className="animate-fade-in text-center">
          <p className="mb-6 text-[var(--text-secondary)]">Try another prompt?</p>
          <button
            type="button"
            onClick={() => {
              setCelebrated(false);
              onTryAnother();
            }}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"
          >
            <span aria-hidden>🎤</span>
            Try another
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => setCelebrated(true)} className="btn-secondary px-8 py-2.5 text-sm">
            Perfect ✓
          </button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="btn-ghost text-sm text-[var(--text-secondary)]"
          >
            Could be better ›
          </button>
        </div>
      )}

      {expanded && !celebrated ? (
        <div className="animate-fade-slide-up mt-8 space-y-4 border-t border-[var(--border)] pt-8">
          <p className="text-sm text-[var(--text-secondary)]">
            Tell us what to change, then re-refine with your feedback folded in.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-interactive)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-brand)]/25"
            placeholder="e.g. More technical, different tone, another tool..."
          />
          <button
            type="button"
            disabled={!feedback.trim() || busy}
            onClick={handleReRefine}
            className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40"
          >
            {busy ? "Re-refining…" : "Re-refine with feedback"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
