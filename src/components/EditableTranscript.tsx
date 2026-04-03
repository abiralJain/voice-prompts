"use client";

interface EditableTranscriptProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** interactive = warm fill; paper = white card (review / results) */
  surface?: "interactive" | "paper";
}

export default function EditableTranscript({
  value,
  onChange,
  placeholder = "Your words will appear here...",
  disabled = false,
  className = "",
  surface = "interactive",
}: EditableTranscriptProps) {
  const shell =
    surface === "paper"
      ? "rounded-2xl border border-[var(--border)] bg-[#ffffff] p-1 shadow-[var(--shadow-card)]"
      : "rounded-2xl border border-[var(--border)] bg-[var(--bg-interactive)] p-1 shadow-[var(--shadow-sm)]";
  return (
    <div className={`${shell} ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={6}
        className="min-h-[120px] w-full resize-y rounded-xl bg-transparent px-4 py-3 text-sm leading-relaxed text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--accent-brand)]/25 disabled:opacity-60 md:min-h-[160px] md:text-base"
      />
    </div>
  );
}
