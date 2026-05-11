"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export default function CopyButton({ text, className = "", label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text.trim()}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] shadow-[var(--shadow-sm)] disabled:cursor-not-allowed disabled:opacity-40 ${
        copied
          ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]"
          : failed
            ? "border-[var(--error)]/30 bg-[var(--error)]/10 text-[var(--error)]"
            : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--border-hover)]"
      } ${className}`}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {failed ? "Failed" : copied ? "Copied" : label}
    </button>
  );
}
