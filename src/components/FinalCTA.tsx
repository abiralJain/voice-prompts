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
      className={`reveal-on-scroll bg-[var(--bg-secondary)] px-3 py-20 min-[400px]:px-4 md:py-28 ${visible ? "is-visible" : ""}`}
    >
      <div className="ink-panel relative mx-auto min-w-0 max-w-6xl overflow-hidden rounded-[2rem] px-5 py-12 text-center md:px-8 md:py-16">
        <p className="relative mb-4 text-xs font-black uppercase tracking-[0.18em] text-white/46">
          Your next prompt can start as a voice note
        </p>
        <h2 className="relative mx-auto mb-6 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-[1.02] tracking-[-0.055em] text-white md:text-6xl">
          Talk through the idea. Leave with the prompt.
        </h2>
        <button
          type="button"
          onClick={onScrollToHeroAndStart}
          className="btn-hero-cta relative min-h-12 px-8 py-3.5 min-[400px]:px-10 min-[400px]:py-4"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M12 4.5a3.5 3.5 0 0 0-3.5 3.5v4a3.5 3.5 0 1 0 7 0V8A3.5 3.5 0 0 0 12 4.5Z" fill="currentColor" />
            <path d="M6 11.5v.75a6 6 0 0 0 12 0v-.75M12 18.25V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          Start with voice
        </button>
      </div>
    </section>
  );
}
