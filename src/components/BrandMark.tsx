/** Inline logo mark — keep in sync with `src/app/icon.svg`. */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-[#f5f3ff] ${className}`}
      aria-hidden
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="h-[18px] w-[18px]">
        <path fill="#6c5ce7" d="M16 6a4 4 0 0 0-4 4v6a4 4 0 1 0 8 0v-6a4 4 0 0 0-4-4Z" />
        <path
          stroke="#6c5ce7"
          strokeWidth="1.75"
          strokeLinecap="round"
          d="M10 17v1a6 6 0 0 0 12 0v-1M16 24v2"
        />
        <path
          stroke="#a29bfe"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M7 14c0-1.5 1-2.5 2-2.5M25 14c0-1.5-1-2.5-2-2.5"
        />
      </svg>
    </span>
  );
}
