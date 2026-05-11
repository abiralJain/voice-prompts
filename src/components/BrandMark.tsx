/** Inline logo mark - keep in sync with `src/app/icon.svg`. */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-sm)] ${className}`}
      aria-hidden
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="h-[18px] w-[18px]">
        <path fill="#111111" d="M16 5.5a4.35 4.35 0 0 0-4.35 4.35v6.3a4.35 4.35 0 1 0 8.7 0v-6.3A4.35 4.35 0 0 0 16 5.5Z" />
        <path
          stroke="#111111"
          strokeWidth="1.75"
          strokeLinecap="round"
          d="M10 17v1a6 6 0 0 0 12 0v-1M16 24v2"
        />
        <path
          stroke="#1f5cff"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M7.25 14.25c0-1.7 1.05-2.85 2.25-2.85M24.75 14.25c0-1.7-1.05-2.85-2.25-2.85"
        />
      </svg>
    </span>
  );
}
