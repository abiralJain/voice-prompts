"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

interface FinalCTAProps {
  onScrollToHeroAndStart: () => void;
}

export default function FinalCTA({ onScrollToHeroAndStart }: FinalCTAProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`reveal-on-scroll bg-[var(--bg-secondary)] py-20 md:py-24 ${visible ? "is-visible" : ""}`}
    >
      <div className="mx-auto min-w-0 max-w-6xl px-3 text-center min-[400px]:px-4 md:px-8">
        <h2 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-[var(--text-primary)] md:text-4xl md:tracking-[-0.032em]">
          Ready to speak?
        </h2>
        <button
          type="button"
          onClick={onScrollToHeroAndStart}
          className="btn-hero-cta min-h-12 px-8 py-3.5 min-[400px]:px-10 min-[400px]:py-4"
        >
          <span aria-hidden>🎤</span>
          Start speaking
        </button>
      </div>
    </section>
  );
}
