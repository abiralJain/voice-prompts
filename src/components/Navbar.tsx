"use client";

import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#tools", label: "Tools" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const showDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-sm"
          : "bg-[var(--bg)]"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl min-w-0 items-center justify-between gap-2 px-3 min-[400px]:px-4 md:px-8">
        <a
          href="#top"
          className="flex min-w-0 shrink items-center gap-2 whitespace-nowrap font-[family-name:var(--font-heading)] text-base font-extrabold tracking-[-0.03em] text-[var(--text-primary)] sm:text-lg"
        >
          <BrandMark className="h-7 w-7 shrink-0 rounded-md" />
          VoicePrompt
        </a>

        <nav className="hidden min-w-0 shrink-0 items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.8125rem] font-medium tracking-[-0.01em] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {l.label}
            </a>
          ))}
          {showDev ? (
            <a
              href="/test"
              className="text-[0.8125rem] font-medium tracking-[-0.01em] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Dev
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-0.5 w-5 bg-[var(--text-primary)]" />
          <span className="block h-0.5 w-5 bg-[var(--text-primary)]" />
          <span className="block h-0.5 w-5 bg-[var(--text-primary)]" />
        </button>
      </div>

      {open ? (
        <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[0.9375rem] font-medium tracking-[-0.01em] text-[var(--text-secondary)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {showDev ? (
              <a
                href="/test"
                className="text-[0.9375rem] font-medium tracking-[-0.01em] text-[var(--text-tertiary)]"
                onClick={() => setOpen(false)}
              >
                Dev
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
