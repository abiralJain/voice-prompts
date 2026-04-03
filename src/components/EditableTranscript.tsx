"use client";

interface EditableTranscriptProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** interactive = warm fill; paper = white card (review / results) */
  surface?: "interactive" | "paper";
  /** Strong border/background when transcript is too short (review flow) */
  emphasizeWarning?: boolean;
}

export default function EditableTranscript({
  value,
  onChange,
  placeholder = "Your words will appear here...",
  disabled = false,
  className = "",
  surface = "interactive",
  emphasizeWarning = false,
}: EditableTranscriptProps) {
  const basePaper =
    surface === "paper"
      ? "rounded-2xl border bg-[#ffffff] p-1 shadow-[var(--shadow-card)]"
      : "rounded-2xl border bg-[var(--bg-interactive)] p-1 shadow-[var(--shadow-sm)]";
  const borderTone = emphasizeWarning
    ? "border-[var(--warning)] shadow-[0_0_0_3px_rgba(224,159,62,0.2)]"
    : "border-[var(--border)]";
  const shell = `${basePaper} ${borderTone}`;
  return (
    <div className={`${shell} ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={6}
        className={`min-h-[120px] w-full resize-y rounded-xl px-4 py-3 text-[0.9375rem] leading-[1.65] tracking-[-0.01em] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--accent-brand)]/25 disabled:opacity-60 md:min-h-[160px] md:text-base md:leading-[1.62] ${emphasizeWarning ? "bg-[rgba(224,159,62,0.1)]" : "bg-transparent"}`}
      />
    </div>
  );
}
