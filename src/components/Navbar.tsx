"use client";

import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";

const links = [
  { href: "#tools", label: "Tools" },
  { href: "#problem", label: "Before/after" },
  { href: "#how-it-works", label: "Flow" },
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
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg-elevated)]/88 shadow-[0_10px_35px_rgba(17,17,17,0.06)] backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl min-w-0 items-center justify-between gap-3 px-3 min-[400px]:px-4 md:px-8">
        <a
          href="#top"
          className="group flex min-w-0 shrink items-center gap-2.5 whitespace-nowrap font-[family-name:var(--font-heading)] text-base font-extrabold tracking-[-0.04em] text-[var(--text-primary)] sm:text-lg"
        >
          <BrandMark className="h-8 w-8 shrink-0 transition-transform group-hover:scale-105" />
          <span>VoicePrompt</span>
          <span className="hidden rounded-full border border-[var(--border)] bg-[rgba(255,254,250,0.72)] px-2 py-0.5 text-[10px] font-medium tracking-normal text-[var(--text-tertiary)] sm:inline">
            studio
          </span>
        </a>

        <nav className="hidden min-w-0 shrink-0 items-center gap-1 rounded-2xl border border-[var(--border)] bg-[rgba(255,254,250,0.58)] p-1 shadow-[var(--shadow-sm)] backdrop-blur-xl md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-4 py-2 text-[0.8125rem] font-semibold tracking-[-0.01em] text-[var(--text-secondary)] hover:bg-white/70 hover:text-[var(--text-primary)]"
            >
              {l.label}
            </a>
          ))}
          {showDev ? (
            <a
              href="/test"
              className="rounded-xl px-4 py-2 text-[0.8125rem] font-semibold tracking-[-0.01em] text-[var(--text-tertiary)] hover:bg-white/70 hover:text-[var(--text-primary)]"
            >
              Dev
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[rgba(255,254,250,0.72)] shadow-[var(--shadow-sm)] md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`block h-0.5 w-5 bg-[var(--text-primary)] transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-[var(--text-primary)] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-[var(--text-primary)] transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open ? (
        <div className="animate-fade-slide-up border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-2xl px-3 py-3 text-[0.9375rem] font-semibold tracking-[-0.01em] text-[var(--text-secondary)] hover:bg-white/60"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {showDev ? (
              <a
                href="/test"
                className="rounded-2xl px-3 py-3 text-[0.9375rem] font-semibold tracking-[-0.01em] text-[var(--text-tertiary)] hover:bg-white/60"
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
