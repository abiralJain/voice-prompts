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
  onPromptModeChange: (mode: PromptMode) => void;
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
    <div className="mx-auto w-full max-w-4xl bg-[#ffffff] px-4 pb-16 pt-6 md:px-8">
      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[#ffffff] p-4 shadow-[var(--shadow-sm)]">
        <button
          type="button"
          onClick={() => setOriginalOpen((o) => !o)}
          className="flex w-full items-center justify-between text-left text-sm text-[#6b6b6b] hover:text-[#1a1a1a]"
        >
          <span className="text-[#9b9b9b]">Original</span>
          <span className="font-medium text-[#1a1a1a]">
            {originalOpen ? "Hide ‹" : `${preview} · Edit ›`}
          </span>
        </button>
        {originalOpen ? (
          <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
            <div className="relative">
              {supported ? (
                <button
                  type="button"
                  onClick={toggleAppendMic}
                  className="absolute right-3 top-3 z-10 rounded-lg border border-[var(--border)] bg-[#ffffff] p-2 text-sm shadow-[var(--shadow-sm)]"
                  aria-label="Append with voice"
                >
                  {speech.isListening ? "■" : "🎤"}
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
              disabled={!transcriptChanged || speech.isListening}
              onClick={() => void onReRefine()}
              className="btn-secondary text-sm disabled:opacity-40"
            >
              Re-refine
            </button>
          </div>
        ) : null}
      </div>

      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9b9b9b]">
        Optimized for:
      </p>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tools.map((t, index) => {
          const active = activeToolIndex === index;
          const loading = loadingToolName === t.tool_name;
          return (
            <button
              key={`${t.tool_name}-${index}`}
              type="button"
              onClick={() => onActiveToolChange(index)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-[#1a1a1a] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                  : "border border-[var(--border)] bg-[#ffffff] text-[#1a1a1a] hover:border-[var(--border-hover)]"
              }`}
            >
              {loading ? (
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--accent-brand)] border-t-transparent" />
              ) : null}
              <span aria-hidden>{t.tool_icon}</span> {t.tool_name}
            </button>
          );
        })}
        {otherTools.length > 0 ? (
          <button
            type="button"
            onClick={() => setMoreToolsOpen((o) => !o)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
              moreToolsOpen
                ? "border-[#1a1a1a] bg-[var(--bg-secondary)] text-[#1a1a1a]"
                : "border-[var(--border)] bg-[var(--bg-interactive)] text-[#6b6b6b] hover:border-[var(--border-hover)]"
            }`}
          >
            {moreToolsOpen ? "− Fewer tools" : "+ More tools"}
          </button>
        ) : null}
      </div>

      {toolGenerationError ? (
        <p className="mb-4 text-sm text-[var(--error)]">{toolGenerationError}</p>
      ) : null}

      {moreToolsOpen && otherTools.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-2 border-b border-[var(--border)] pb-6">
          {otherTools.map((t) => {
            const loading = loadingToolName === t.name;
            return (
              <button
                key={t.name}
                type="button"
                disabled={loading}
                onClick={() => void onGenerateToolPrompt(t.name)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[#ffffff] px-3 py-1.5 text-xs font-medium text-[#6b6b6b] hover:border-[var(--border-hover)] hover:text-[#1a1a1a] disabled:opacity-60"
                title={t.best_for}
              >
                {loading ? (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[var(--accent-brand)] border-t-transparent" />
                ) : null}
                <span aria-hidden>{t.icon}</span>
                {t.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {activeTool ? (
        <div className="crossfade-enter space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="group"
              aria-label="Refinement mode for next re-refine"
              className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-interactive)] p-0.5 text-xs"
            >
              <button
                type="button"
                onClick={() => onPromptModeChange("enhance")}
                className={`rounded-full px-3 py-1.5 font-medium ${
                  promptMode === "enhance"
                    ? "bg-[#ffffff] text-[#1a1a1a] shadow-[var(--shadow-sm)]"
                    : "text-[#9b9b9b]"
                }`}
              >
                ✨ Enhance
              </button>
              <button
                type="button"
                onClick={() => onPromptModeChange("clean")}
                className={`rounded-full px-3 py-1.5 font-medium ${
                  promptMode === "clean"
                    ? "bg-[#ffffff] text-[#1a1a1a] shadow-[var(--shadow-sm)]"
                    : "text-[#9b9b9b]"
                }`}
              >
                Clean only
              </button>
            </div>
            <p className="text-[11px] text-[#9b9b9b] sm:text-right">Switch mode, then Re-refine.</p>
          </div>

          <div className="relative rounded-2xl border border-[var(--border)] bg-[#ffffff] p-8 shadow-[var(--shadow-card)] md:p-10">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-interactive)] px-3 py-1 text-xs font-medium text-[#6b6b6b]">
                {modePill}
              </span>
              <CopyButton text={activeTool.refined_prompt} />
            </div>
            <p className="whitespace-pre-wrap font-[family-name:var(--font-mono)] text-[15px] leading-[1.7] text-[#1a1a1a] md:text-base">
              {activeTool.refined_prompt}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <button
              type="button"
              onClick={() => setWhyOpen((o) => !o)}
              className="text-left text-[#6b6b6b] hover:text-[#1a1a1a]"
            >
              Why {activeTool.tool_name}? {whyOpen ? "‹" : "›"}
            </button>
            {whyOpen ? (
              <p className="pl-0 text-[#6b6b6b]">{activeTool.prompt_explanation}</p>
            ) : null}
            <button
              type="button"
              onClick={() => setImproveOpen((o) => !o)}
              className="text-left text-[#6b6b6b] hover:text-[#1a1a1a]"
            >
              What we improved {improveOpen ? "‹" : "›"}
            </button>
            {improveOpen ? (
              <ul className="list-disc space-y-1 pl-5 text-[#6b6b6b]">
                {results.improvements_made.map((item) => (
                  <li key={item}>{item}</li>
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
