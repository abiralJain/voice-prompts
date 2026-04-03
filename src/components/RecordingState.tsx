"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMicVolume } from "@/hooks/useMicVolume";
import { useSpeechRecognition, useSpeechSupported } from "@/lib/speechRecognition";
import EditableTranscript from "./EditableTranscript";
import type { OrbVisualizerState } from "./OrbVisualizer";

const OrbVisualizer = dynamic(() => import("./OrbVisualizer"), {
  ssr: false,
  loading: () => (
    <div
      className="mx-auto animate-pulse rounded-full bg-[#F2F0ED]"
      style={{ width: "clamp(150px, 40vw, 200px)", height: "clamp(150px, 40vw, 200px)" }}
    />
  ),
});

const PROCESSING_MESSAGES = [
  "Understanding your intent...",
  "Matching with the best tools...",
  "Crafting your perfect prompt...",
  "Almost there...",
];

function ProcessingView() {
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 bg-[#ffffff] px-4 pb-12 pt-12 md:pb-24">
      <OrbVisualizer volume={0} state="thinking" />
      <div className="min-h-[3rem] text-center">
        <p
          key={msgIndex}
          className="text-sm text-[#6b6b6b] [animation:status-fade_0.45s_ease-out_forwards]"
        >
          {PROCESSING_MESSAGES[msgIndex]}
        </p>
      </div>
      <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full w-full rounded-full bg-[var(--accent-brand)]"
          style={{
            animation: "processing-bar 2.8s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatTime(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export type RecordingPhase = "speaking" | "reviewing";

interface RecordingStateProps {
  phase: RecordingPhase;
  onEnterReview: () => void;
  transcript: string;
  onTranscriptChange: (value: string) => void;
  audioStream: MediaStream | null;
  ensureMic: () => Promise<void>;
  stopMic: () => void;
  onRefine: () => void;
  onClearRestart: () => void;
  onResumeSpeaking: () => void;
  processing?: boolean;
}

export default function RecordingState({
  phase,
  onEnterReview,
  transcript,
  onTranscriptChange,
  audioStream,
  ensureMic,
  stopMic,
  onRefine,
  onClearRestart,
  onResumeSpeaking,
  processing = false,
}: RecordingStateProps) {
  const supported = useSpeechSupported();
  const speech = useSpeechRecognition({
    onInterim: (live) => onTranscriptChange(live),
  });
  const { stop: stopSpeech } = speech;
  const speechStartRef = useRef(speech.start);
  const transcriptRef = useRef(transcript);

  const volume = useMicVolume(audioStream);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    speechStartRef.current = speech.start;
  }, [speech.start]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedLabel, setRecordedLabel] = useState<string | null>(null);
  const [shortHint, setShortHint] = useState(false);

  const showReviewUI = phase === "reviewing" || supported === false;

  useEffect(() => {
    if (processing) stopSpeech();
  }, [processing, stopSpeech]);

  useEffect(() => {
    if (processing || showReviewUI) return;
    let cancelled = false;
    let timeoutId: number | undefined;
    void (async () => {
      await ensureMic();
      if (cancelled) return;
      timeoutId = window.setTimeout(() => {
        if (cancelled || !supported) return;
        const t = transcriptRef.current;
        speechStartRef.current(t.trim() ? t : undefined);
      }, 400);
    })();
    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [processing, showReviewUI, ensureMic, supported]);

  useEffect(() => {
    if (showReviewUI || processing) return;
    if (!speech.isListening) return;
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [speech.isListening, showReviewUI, processing]);

  const orbState: OrbVisualizerState = processing
    ? "thinking"
    : speech.isListening
      ? "listening"
      : "idle";

  const canRefine = wordCount(transcript) >= 10 && !processing;

  const toggleListening = () => {
    setShortHint(false);
    if (speech.isListening) {
      speech.stop();
      window.setTimeout(() => {
        const merged = speech.getMergedTranscript();
        if (merged) onTranscriptChange(merged);
        setRecordedLabel(formatTime(elapsedSeconds));
        const wc = wordCount(merged || transcriptRef.current);
        if (wc > 0 && wc < 10) setShortHint(true);
        onEnterReview();
      }, 180);
    } else {
      void ensureMic();
      speech.start(transcript.trim() ? transcript : undefined);
    }
  };

  const goToReview = () => {
    setShortHint(false);
    if (speech.isListening) speech.stop();
    window.setTimeout(() => {
      const merged = speech.getMergedTranscript();
      if (merged) onTranscriptChange(merged);
      setRecordedLabel(formatTime(elapsedSeconds));
      const wc = wordCount(merged || transcript);
      if (wc > 0 && wc < 10) setShortHint(true);
      onEnterReview();
    }, 150);
  };

  const handleStartOver = () => {
    speech.stop();
    speech.reset();
    stopMic();
    onTranscriptChange("");
    setElapsedSeconds(0);
    setRecordedLabel(null);
    setShortHint(false);
    onClearRestart();
  };

  const handleContinueSpeaking = () => {
    if (speech.isListening) {
      speech.stop();
      window.setTimeout(() => {
        const merged = speech.getMergedTranscript();
        if (merged) onTranscriptChange(merged);
      }, 120);
    }
    onResumeSpeaking();
  };

  if (processing) {
    return <ProcessingView />;
  }

  if (!showReviewUI) {
    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center gap-8 bg-[#ffffff] px-4 pb-16 pt-10">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#9b9b9b]">{formatTime(elapsedSeconds)}</p>

        <OrbVisualizer volume={volume} state={orbState} />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={toggleListening}
            disabled={!supported}
            className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold shadow-[var(--shadow-md)] transition disabled:opacity-40 ${
              speech.isListening
                ? "bg-[#1a1a1a] text-white hover:bg-[#333]"
                : "border-2 border-[var(--border)] bg-[var(--bg-interactive)] text-[#1a1a1a] hover:border-[var(--border-hover)]"
            }`}
            aria-label={speech.isListening ? "Stop recording" : "Start speaking"}
          >
            {speech.isListening ? "■" : "🎤"}
          </button>
          <p className="text-center text-xs text-[#9b9b9b]">
            {speech.isListening ? "Tap when you're done — opens transcript" : "Tap to speak"}
          </p>
          {!speech.isListening ? (
            <button
              type="button"
              onClick={goToReview}
              className="mt-2 text-sm font-medium text-[#6b6b6b] underline-offset-4 hover:text-[#1a1a1a] hover:underline"
            >
              Edit transcript without recording →
            </button>
          ) : null}
        </div>

        <div className="max-h-44 w-full max-w-2xl overflow-y-auto px-1 text-center">
          <p className="text-base leading-relaxed text-[#6b6b6b]">
            {transcript || "\u00a0"}
            {speech.isListening ? (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--accent-brand)] align-middle" />
            ) : null}
          </p>
        </div>

        {!supported ? (
          <p className="max-w-md text-center text-sm text-[var(--warning)]">
            Voice works best in Chrome or Edge. Use Review transcript to type your prompt.
          </p>
        ) : null}
        {speech.error ? <p className="text-center text-sm text-[var(--error)]">{speech.error}</p> : null}
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex min-h-[calc(100dvh-3.5rem)] flex-col items-center gap-6 bg-[#ffffff] px-4 pb-12 pt-8 md:pb-20">
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <p className="text-xs text-[#9b9b9b]">Here&apos;s what we heard:</p>
          {recordedLabel ? (
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#6b6b6b]">
              Recorded {recordedLabel}
            </p>
          ) : null}
        </div>

        {!supported ? (
          <p className="text-center text-sm text-[var(--warning)]">
            Voice works best in Chrome or Edge. Edit your transcript below.
          </p>
        ) : null}

        <EditableTranscript value={transcript} onChange={onTranscriptChange} surface="paper" />

        {shortHint ? (
          <p className="text-center text-sm text-[#6b6b6b]">
            That seems a bit short. Add more detail for better results.
          </p>
        ) : null}

        <div className="flex flex-col items-stretch gap-3 pt-2 sm:items-center">
          <button
            type="button"
            disabled={!canRefine}
            onClick={onRefine}
            className="btn-hero-cta w-full max-w-md py-4 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:transform-none"
          >
            Refine Prompt →
          </button>
          {supported ? (
            <button type="button" onClick={handleContinueSpeaking} className="btn-secondary mx-auto w-full max-w-md py-3">
              Continue speaking
            </button>
          ) : null}
          <button type="button" onClick={handleStartOver} className="btn-ghost mx-auto text-sm">
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
