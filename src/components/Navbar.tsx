"use client";

import { useEffect, useState } from "react";

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
          ? "border-b border-[var(--border)] bg-[#ffffff]/95 backdrop-blur-sm"
          : "bg-[#ffffff]"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-8">
        <a
          href="#top"
          className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-primary)]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-soft)] text-sm">
            🎙️
          </span>
          VoicePrompt
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {l.label}
            </a>
          ))}
          {showDev ? (
            <a
              href="/test"
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Dev
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] md:hidden"
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
        <div className="border-b border-[var(--border)] bg-[#ffffff] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[var(--text-secondary)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {showDev ? (
              <a href="/test" className="text-sm text-[var(--text-tertiary)]" onClick={() => setOpen(false)}>
                Dev
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
