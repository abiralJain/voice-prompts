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
      <div className="mx-auto max-w-6xl px-4 text-center md:px-8">
        <h2 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Ready to speak?
        </h2>
        <button type="button" onClick={onScrollToHeroAndStart} className="btn-hero-cta px-10 py-4">
          <span aria-hidden>🎤</span>
          Start speaking
        </button>
      </div>
    </section>
  );
}
