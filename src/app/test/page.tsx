"use client";

import { useState } from "react";
import Link from "next/link";
import type { PromptMode, RefineResponse } from "@/types";

interface Run {
  id: string;
  at: string;
  input: string;
  json: string;
  result: RefineResponse;
}

const PRESETS = [
  "I want to build like a dashboard for my startup where I can see all my users and their activity and maybe some charts and stuff using react",
  "can you help me make a login page with like google sign in and also email password and it should look modern and clean",
  "I need a picture of like a samurai standing in rain at night with neon lights behind him like cyberpunk style but also traditional Japanese",
  "make me a logo for my coffee brand called Brewhaha it should feel premium but also fun and playful",
  "I want to create a short video of like a drone flying over mountains at sunset with some cinematic feel to it",
  "can you make me a chill lofi beat with like piano and some rain sounds in the background for studying",
  "I want to understand what's happening with AI regulation in India right now and what it means for startups",
  "I need to write a cold email to a potential client who is a marketing director at a D2C brand and I want to pitch our design services",
  "I want to make a presentation about our Q4 results with nice charts and a clean professional look",
  "explain to me how transformers work in AI like I'm a designer who doesn't know much about machine learning",
  "umm so like I was thinking maybe I could um create some kind of app that tracks like how much water I drink and reminds me and stuff",
  "so basically what I need is uh a website no wait actually like a mobile app well maybe both that lets people book appointments for my salon",
  "I want to I want to make like one of those viral reels where text appears word by word on screen with cool transitions",
  "help me write no actually help me design wait let me think... okay so I need a one-pager for investors about my AI startup",
  "I need to edit this photo to remove the background and make it look professional for LinkedIn",
];

export default function TestPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [latest, setLatest] = useState<RefineResponse | null>(null);
  const [history, setHistory] = useState<Run[]>([]);
  const [tab, setTab] = useState(0);
  const [mode, setMode] = useState<PromptMode>("enhance");

  const refine = async () => {
    if (!input.trim()) {
      setError("Enter a transcript.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: input.trim(), mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      const result = data as RefineResponse;
      setLatest(result);
      setTab(0);
      setHistory((h) => [
        {
          id: crypto.randomUUID(),
          at: new Date().toLocaleString(),
          input: input.trim(),
          json: JSON.stringify(result, null, 2),
          result,
        },
        ...h,
      ]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[var(--bg)] px-4 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold">VoicePrompt — test lab</h1>
          <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            ← Home
          </Link>
        </div>

        <div
          className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-interactive)] p-0.5 text-xs"
          role="group"
          aria-label="Refinement mode"
        >
          <button
            type="button"
            onClick={() => setMode("enhance")}
            className={`rounded-full px-3 py-1.5 font-medium ${
              mode === "enhance"
                ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-tertiary)]"
            }`}
          >
            Enhance
          </button>
          <button
            type="button"
            onClick={() => setMode("clean")}
            className={`rounded-full px-3 py-1.5 font-medium ${
              mode === "clean"
                ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-tertiary)]"
            }`}
          >
            Clean only
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInput(p)}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
            >
              Sample {i + 1}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-interactive)] p-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
        />
        <button
          type="button"
          disabled={loading}
          onClick={refine}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refining…" : "Refine"}
        </button>
        {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}

        {latest ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-4">
              <h2 className="mb-2 text-sm font-semibold text-[var(--text-secondary)]">Full JSON</h2>
              <pre className="max-h-[480px] overflow-auto font-[family-name:var(--font-mono)] text-xs text-[var(--text-primary)]">
                {JSON.stringify(latest, null, 2)}
              </pre>
            </div>
            <div className="card p-4">
              <h2 className="mb-2 text-sm font-semibold text-[var(--text-secondary)]">Tool prompts</h2>
              <div className="mb-3 flex flex-wrap gap-2">
                {latest.tools.slice(0, 3).map((t, i) => (
                  <button
                    key={t.tool_name}
                    type="button"
                    onClick={() => setTab(i)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      tab === i
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--text-on-dark)]"
                        : "border-[var(--border)] bg-[var(--bg-interactive)] text-[var(--text-primary)]"
                    }`}
                  >
                    {t.tool_icon} {t.tool_name}
                  </button>
                ))}
              </div>
              <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--text-primary)]">
                {latest.tools[tab]?.refined_prompt}
              </pre>
            </div>
          </div>
        ) : null}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-[var(--text-secondary)]">History</h2>
          <ul className="space-y-3 text-sm">
            {history.map((h) => (
              <li key={h.id} className="card p-4">
                <p className="text-xs text-[var(--text-tertiary)]">{h.at}</p>
                <p className="line-clamp-2 text-[var(--text-secondary)]">{h.input}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
