"use client";

import { useMemo, useState } from "react";
import { useSpeechRecognition, useSpeechSupported } from "@/lib/speechRecognition";
import type { PromptMode, RefineResponse } from "@/types";
import CopyButton from "./CopyButton";
import EditableTranscript from "./EditableTranscript";
import FeedbackSection from "./FeedbackSection";

interface ResultsStateProps {
  results: RefineResponse;
  transcript: string;
  onTranscriptChange: (value: string) => void;
  activeToolIndex: number;
  onActiveToolChange: (index: number) => void;
  onReRefine: (extraFeedback?: string) => Promise<void>;
  onTryAnother: () => void;
  onGenerateToolPrompt: (toolName: string) => Promise<void>;
  loadingToolName: string | null;
  toolGenerationError: string | null;
  promptMode: PromptMode;
  onPromptModeChange: (mode: PromptMode) => void | Promise<void>;
  isReRefining: boolean;
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 4.5a3.5 3.5 0 0 0-3.5 3.5v4a3.5 3.5 0 1 0 7 0V8A3.5 3.5 0 0 0 12 4.5Z" fill="currentColor" />
      <path d="M6 11.5v.75a6 6 0 0 0 12 0v-.75M12 18.25V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13l-5.6-2 5.6-2L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect x="7.5" y="7.5" width="9" height="9" rx="2" fill="currentColor" />
    </svg>
  );
}

export default function ResultsState({
  results,
  transcript,
  onTranscriptChange,
  activeToolIndex,
  onActiveToolChange,
  onReRefine,
  onTryAnother,
  onGenerateToolPrompt,
  loadingToolName,
  toolGenerationError,
  promptMode,
  onPromptModeChange,
  isReRefining,
}: ResultsStateProps) {
  const supported = useSpeechSupported();
  const speech = useSpeechRecognition({
    onInterim: (live) => onTranscriptChange(live),
  });

  const [originalOpen, setOriginalOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);

  const transcriptChanged =
    transcript.trim() !== (results.original_transcript ?? "").trim();

  const tools = results.tools;
  const activeTool = tools[activeToolIndex] ?? tools[0];

  const generatedNames = useMemo(
    () => new Set(tools.map((t) => t.tool_name)),
    [tools],
  );

  const otherTools = useMemo(() => {
    const list = results.all_category_tools ?? [];
    return list.filter((t) => !generatedNames.has(t.name));
  }, [results.all_category_tools, generatedNames]);

  const firstLine = transcript.trim().split(/\n/)[0] ?? "";
  const preview =
    firstLine.length > 72 ? `${firstLine.slice(0, 72)}…` : firstLine || "Your transcript";

  const modePill = results.prompt_mode === "clean" ? "Cleaned" : "Enhanced";

  const toggleAppendMic = () => {
    if (!supported) return;
    if (speech.isListening) {
      speech.stop();
      window.setTimeout(() => {
        const merged = speech.getMergedTranscript();
        if (merged) onTranscriptChange(merged);
      }, 120);
    } else {
      speech.start(transcript.trim() ? transcript : undefined);
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-3 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-4 min-[400px]:px-4 md:px-8 md:pb-16 md:pt-8">
      <div className="mb-6 text-center md:mb-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Prompt ready
        </p>
        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-[-0.055em] text-[var(--text-primary)] md:text-6xl">
          Pick the version that fits your tool.
        </h2>
      </div>

      <div className="glass-panel mb-8 rounded-[1.75rem] p-3 min-[400px]:p-4">
        <button
          type="button"
          onClick={() => setOriginalOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 rounded-[1.25rem] px-2 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-white/50 hover:text-[var(--text-primary)]"
        >
          <span className="font-black uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Original</span>
          <span className="text-right font-bold text-[var(--text-primary)]">
            {originalOpen ? "Hide" : `${preview} · Edit`}
          </span>
        </button>
        {originalOpen ? (
          <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
            <div className="relative">
              {supported ? (
                <button
                  type="button"
                  onClick={toggleAppendMic}
                  className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] text-sm text-[var(--accent-brand)] shadow-[var(--shadow-sm)] min-[400px]:right-3 min-[400px]:top-3"
                  aria-label="Append with voice"
                >
                  {speech.isListening ? <StopIcon /> : <MicIcon />}
                </button>
              ) : null}
              <EditableTranscript
                value={transcript}
                onChange={onTranscriptChange}
                surface="paper"
                className="pr-14"
              />
            </div>
            {speech.error ? <p className="text-sm text-[var(--error)]">{speech.error}</p> : null}
            <button
              type="button"
              disabled={!transcriptChanged || speech.isListening || isReRefining}
              onClick={() => void onReRefine()}
              className="btn-secondary text-sm disabled:opacity-40"
            >
              {isReRefining ? "Re-refining…" : "Re-refine"}
            </button>
          </div>
        ) : null}
      </div>

      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
        Tool dock
      </p>
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-[1.75rem] border border-[var(--border)] bg-[rgba(255,252,245,0.48)] p-2 shadow-[var(--shadow-sm)] backdrop-blur-xl">
        {tools.map((t, index) => {
          const active = activeToolIndex === index;
          const loading = loadingToolName === t.tool_name;
          return (
            <button
              key={`${t.tool_name}-${index}`}
              type="button"
              onClick={() => onActiveToolChange(index)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition md:px-4 md:py-2.5 ${
                active
                  ? "bg-[var(--bg-ink)] text-white shadow-[0_12px_28px_rgba(32,25,20,0.18)]"
                  : "border border-[var(--border)] bg-[rgba(255,252,245,0.72)] text-[var(--text-primary)] hover:border-[var(--border-hover)]"
              }`}
            >
              {loading ? (
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--accent-brand)] border-t-transparent" />
              ) : null}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-[10px]" aria-hidden>
                {t.tool_name.slice(0, 1)}
              </span>
              {t.tool_name}
            </button>
          );
        })}
        {otherTools.length > 0 ? (
          <button
            type="button"
            onClick={() => setMoreToolsOpen((o) => !o)}
            className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-bold transition md:px-4 md:py-2.5 ${
              moreToolsOpen
                ? "border-[var(--text-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                : "border-[var(--border)] bg-[var(--bg-interactive)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
            }`}
          >
            {moreToolsOpen ? "Fewer tools" : "More tools"}
          </button>
        ) : null}
      </div>

      {toolGenerationError ? (
        <p className="mb-4 text-sm text-[var(--error)]">{toolGenerationError}</p>
      ) : null}

      {moreToolsOpen && otherTools.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-2 rounded-[1.75rem] border border-[var(--border)] bg-[rgba(255,252,245,0.5)] p-3">
          {otherTools.map((t) => {
            const loading = loadingToolName === t.name;
            return (
              <button
                key={t.name}
                type="button"
                disabled={loading}
                onClick={() => void onGenerateToolPrompt(t.name)}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[rgba(255,252,245,0.78)] px-3.5 py-2 text-sm font-bold text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] disabled:opacity-60 md:px-3 md:py-1.5 md:text-xs"
                title={t.best_for}
              >
                {loading ? (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[var(--accent-brand)] border-t-transparent" />
                ) : null}
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-[10px]" aria-hidden>
                  {t.name.slice(0, 1)}
                </span>
                {t.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {activeTool ? (
        <div className="crossfade-enter space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Refinement mode"
              className={`inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-interactive)] p-1 text-xs shadow-[var(--shadow-sm)] ${isReRefining ? "pointer-events-none opacity-60" : ""}`}
            >
              <button
                type="button"
                disabled={isReRefining}
                onClick={() => void onPromptModeChange("enhance")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition md:px-3 md:py-1.5 md:text-xs ${
                  promptMode === "enhance"
                    ? "bg-[#ffffff] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                <SparkIcon /> Enhance
              </button>
              <button
                type="button"
                disabled={isReRefining}
                onClick={() => void onPromptModeChange("clean")}
                className={`rounded-full px-4 py-2 text-sm font-bold transition md:px-3 md:py-1.5 md:text-xs ${
                  promptMode === "clean"
                    ? "bg-[#ffffff] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                Clean only
              </button>
            </div>
          </div>

          <div
            key={`${activeTool.tool_name}-${activeToolIndex}`}
            className="crossfade-enter glass-panel relative overflow-hidden rounded-[2rem] p-5 md:p-8"
          >
            {isReRefining ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[2rem] bg-[rgba(255,252,245,0.82)] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent-brand)] border-t-transparent" />
                  <span className="text-sm font-bold text-[var(--text-secondary)]">Regenerating…</span>
                </div>
              </div>
            ) : null}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-interactive)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                <SparkIcon /> {modePill}
              </span>
              <CopyButton text={activeTool.refined_prompt} />
            </div>
            <p className="whitespace-pre-wrap font-[family-name:var(--font-mono)] text-[15px] leading-[1.85] text-[var(--text-primary)] md:text-base">
              {activeTool.refined_prompt}
            </p>
          </div>

          {results.prompt_mode === "clean" && tools.length > 1 ? (
            <p className="text-center text-xs font-semibold text-[var(--text-tertiary)]">
              Same cleaned prompt for all tools — switch to Enhance for tool-specific prompts.
            </p>
          ) : null}

          <div className="grid gap-3 text-sm md:grid-cols-2">
            <button
              type="button"
              onClick={() => setWhyOpen((o) => !o)}
              className="rounded-2xl border border-[var(--border)] bg-[rgba(255,252,245,0.52)] px-4 py-3 text-left font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Why {activeTool.tool_name}? {whyOpen ? "Close" : "Open"}
            </button>
            {whyOpen ? (
              <p className="rounded-2xl border border-[var(--border)] bg-[rgba(255,252,245,0.52)] p-4 text-[var(--text-secondary)] md:col-span-2">{activeTool.prompt_explanation}</p>
            ) : null}
            <button
              type="button"
              onClick={() => setImproveOpen((o) => !o)}
              className="rounded-2xl border border-[var(--border)] bg-[rgba(255,252,245,0.52)] px-4 py-3 text-left font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              What we improved {improveOpen ? "Close" : "Open"}
            </button>
            {improveOpen ? (
              <ul className="space-y-2 rounded-2xl border border-[var(--border)] bg-[rgba(255,252,245,0.52)] p-4 text-[var(--text-secondary)] md:col-span-2">
                {results.improvements_made.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-brand)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <FeedbackSection
        onTryAnother={onTryAnother}
        onReRefineWithFeedback={async (fb) => {
          await onReRefine(fb);
        }}
      />
    </div>
  );
}
