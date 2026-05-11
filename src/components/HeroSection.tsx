"use client";

import type { RefObject } from "react";
import type { HeroState, PromptMode, RefineResponse } from "@/types";
import LandingState from "./LandingState";
import RecordingState from "./RecordingState";
import ResultsState from "./ResultsState";

interface HeroSectionProps {
  heroState: HeroState;
  transcript: string;
  onTranscriptChange: (value: string) => void;
  results: RefineResponse | null;
  activeToolIndex: number;
  onActiveToolChange: (index: number) => void;
  audioStream: MediaStream | null;
  ensureMic: () => Promise<MediaStream | null>;
  stopMic: () => void;
  onStartSpeaking: () => void;
  onEnterReview: () => void;
  onResumeSpeaking: () => void;
  onRecordingClearRestart: () => void;
  onRefine: () => Promise<void>;
  onReRefine: (feedback?: string) => Promise<void>;
  onTryAnother: () => void;
  onGenerateToolPrompt: (toolName: string) => Promise<void>;
  loadingToolName: string | null;
  toolGenerationError: string | null;
  promptMode: PromptMode;
  onPromptModeChange: (mode: PromptMode) => void | Promise<void>;
  isReRefining: boolean;
  resultsRef: RefObject<HTMLDivElement | null>;
}

export default function HeroSection({
  heroState,
  transcript,
  onTranscriptChange,
  results,
  activeToolIndex,
  onActiveToolChange,
  audioStream,
  ensureMic,
  stopMic,
  onStartSpeaking,
  onEnterReview,
  onResumeSpeaking,
  onRecordingClearRestart,
  onRefine,
  onReRefine,
  onTryAnother,
  onGenerateToolPrompt,
  loadingToolName,
  toolGenerationError,
  promptMode,
  onPromptModeChange,
  isReRefining,
  resultsRef,
}: HeroSectionProps) {
  const inCaptureFlow =
    heroState === "recording" || heroState === "reviewing" || heroState === "processing";

  return (
    <section id="top" className="scroll-mt-16">
      {heroState === "landing" ? (
        <div className="animate-fade-in">
          <LandingState onStartSpeaking={onStartSpeaking} />
        </div>
      ) : null}

      {inCaptureFlow ? (
        <div className="animate-fade-in">
          <RecordingState
            phase={heroState === "recording" ? "speaking" : "reviewing"}
            onEnterReview={onEnterReview}
            onResumeSpeaking={onResumeSpeaking}
            transcript={transcript}
            onTranscriptChange={onTranscriptChange}
            audioStream={audioStream}
            ensureMic={ensureMic}
            stopMic={stopMic}
            onRefine={() => void onRefine()}
            onClearRestart={onRecordingClearRestart}
            processing={heroState === "processing"}
          />
        </div>
      ) : null}

      {heroState === "results" && results ? (
        <div ref={resultsRef} className="animate-fade-in">
          <ResultsState
            results={results}
            transcript={transcript}
            onTranscriptChange={onTranscriptChange}
            activeToolIndex={activeToolIndex}
            onActiveToolChange={onActiveToolChange}
            onReRefine={onReRefine}
            onTryAnother={onTryAnother}
            onGenerateToolPrompt={onGenerateToolPrompt}
            loadingToolName={loadingToolName}
            toolGenerationError={toolGenerationError}
            promptMode={promptMode}
            onPromptModeChange={onPromptModeChange}
            isReRefining={isReRefining}
          />
        </div>
      ) : null}
    </section>
  );
}
