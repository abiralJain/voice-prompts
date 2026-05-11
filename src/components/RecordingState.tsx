"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
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
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-8 bg-[var(--bg)] px-3 pb-12 pt-12 min-[400px]:px-4 md:pb-24">
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
  ensureMic: () => Promise<MediaStream | null>;
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
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingPrefixRef = useRef("");

  const volume = useMicVolume(audioStream);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    speechStartRef.current = speech.start;
  }, [speech.start]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedLabel, setRecordedLabel] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const showReviewUI = phase === "reviewing" || supported === false;
  const showShortWarning =
    showReviewUI && wordCount(transcript) > 0 && wordCount(transcript) < 10;

  const startLocalRecording = useCallback((stream: MediaStream) => {
    if (typeof MediaRecorder === "undefined") return;
    if (recorderRef.current?.state === "recording") return;

    audioChunksRef.current = [];
    const preferredType = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
    ].find((type) => MediaRecorder.isTypeSupported(type));

    try {
      const recorder = new MediaRecorder(stream, preferredType ? { mimeType: preferredType } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecordingAudio(true);
    } catch {
      setTranscriptionError("Could not start local recording. You can still type your transcript.");
    }
  }, []);

  const stopLocalRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder) return Promise.resolve<Blob | null>(null);

    return new Promise<Blob | null>((resolve) => {
      const finish = () => {
        const type = audioChunksRef.current[0]?.type || recorder.mimeType || "audio/webm";
        const blob = audioChunksRef.current.length
          ? new Blob(audioChunksRef.current, { type })
          : null;
        recorderRef.current = null;
        audioChunksRef.current = [];
        setIsRecordingAudio(false);
        resolve(blob);
      };

      if (recorder.state === "inactive") {
        finish();
        return;
      }

      recorder.onstop = finish;
      recorder.stop();
    });
  }, []);

  const transcribeRecording = useCallback(async (blob: Blob) => {
    const formData = new FormData();
    const extension = blob.type.includes("mp4") ? "m4a" : "webm";
    formData.append("audio", blob, `voiceprompt-recording.${extension}`);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { transcript?: string; error?: string };
    if (!res.ok) throw new Error(data.error || "Could not transcribe recording.");
    return data.transcript?.trim() ?? "";
  }, []);

  const beginListening = useCallback(
    async (appendAfter?: string) => {
      setTranscriptionError(null);
      const stream = await ensureMic();
      if (!stream) return;
      startLocalRecording(stream);
      if (!supported) return;
      recordingPrefixRef.current = appendAfter?.trim() ?? "";
      speechStartRef.current(appendAfter);
    },
    [ensureMic, startLocalRecording, supported],
  );

  const finishListening = useCallback(async () => {
    if (speech.isListening) speech.stop();
    const merged = speech.getMergedTranscript();
    const audioBlob = await stopLocalRecording();

    let nextTranscript = merged;
    const needsServerTranscription = audioBlob && (speech.errorCode === "network" || !nextTranscript.trim());

    if (needsServerTranscription) {
      setIsTranscribing(true);
      setTranscriptionError(null);
      try {
        const spokenText = await transcribeRecording(audioBlob);
        nextTranscript = [recordingPrefixRef.current, spokenText].filter(Boolean).join(" ").trim();
      } catch (error: unknown) {
        setTranscriptionError(error instanceof Error ? error.message : "Could not transcribe recording.");
      } finally {
        setIsTranscribing(false);
      }
    }

    if (nextTranscript.trim()) onTranscriptChange(nextTranscript);
    setRecordedLabel(formatTime(elapsedSeconds));
    onEnterReview();
  }, [
    elapsedSeconds,
    onEnterReview,
    onTranscriptChange,
    speech,
    stopLocalRecording,
    transcribeRecording,
  ]);

  useEffect(() => {
    if (processing) {
      stopSpeech();
      void stopLocalRecording();
    }
  }, [processing, stopLocalRecording, stopSpeech]);

  useEffect(() => {
    if (processing || showReviewUI) return;
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled || !supported) return;
      const t = transcriptRef.current;
      void beginListening(t.trim() ? t : undefined);
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [beginListening, processing, showReviewUI, supported]);

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
    : speech.isListening || isRecordingAudio || isTranscribing
      ? "listening"
      : "idle";

  const canRefine = wordCount(transcript) >= 10 && !processing && !isTranscribing;
  const isCapturing = speech.isListening || isRecordingAudio || isTranscribing;

  const toggleListening = () => {
    if (isCapturing) {
      void finishListening();
    } else {
      void beginListening(transcript.trim() ? transcript : undefined);
    }
  };

  const goToReview = () => {
    void finishListening();
  };

  const handleStartOver = () => {
    speech.stop();
    speech.reset();
    void stopLocalRecording();
    stopMic();
    onTranscriptChange("");
    setElapsedSeconds(0);
    setRecordedLabel(null);
    onClearRestart();
  };

  const handleContinueSpeaking = () => {
    if (speech.isListening) {
      void finishListening();
    }
    onResumeSpeaking();
  };

  if (processing) {
    return <ProcessingView />;
  }

  if (!showReviewUI) {
    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center gap-6 bg-[var(--bg)] px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-8 min-[400px]:gap-8 min-[400px]:px-4 min-[400px]:pb-16 min-[400px]:pt-10">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#9b9b9b]">{formatTime(elapsedSeconds)}</p>

        <OrbVisualizer volume={volume} state={orbState} />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={toggleListening}
            disabled={!supported || isTranscribing}
            className={`flex h-[52px] w-[52px] min-[400px]:h-16 min-[400px]:w-16 items-center justify-center rounded-full text-xl font-bold shadow-[var(--shadow-md)] transition disabled:opacity-40 ${
              isCapturing
                ? "bg-[#1a1a1a] text-white hover:bg-[#333]"
                : "border-2 border-[var(--border)] bg-[var(--bg-interactive)] text-[#1a1a1a] hover:border-[var(--border-hover)]"
            }`}
            aria-label={isCapturing ? "Stop recording" : "Start speaking"}
          >
            {isCapturing ? "■" : "🎤"}
          </button>
          <p className="text-center text-xs text-[#9b9b9b]">
            {isTranscribing
              ? "Converting your voice to text..."
              : isCapturing
                ? "Tap when you're done — opens transcript"
                : "Tap to speak"}
          </p>
          {!isCapturing ? (
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
            {isCapturing ? (
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
        {speech.errorCode === "network" && isRecordingAudio ? (
          <p className="max-w-md text-center text-sm text-[var(--warning)]">
            Browser speech recognition is unavailable, but recording is still running. Tap stop and
            we&apos;ll transcribe it another way.
          </p>
        ) : null}
        {transcriptionError ? (
          <p className="max-w-md text-center text-sm text-[var(--error)]">{transcriptionError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex min-h-[calc(100dvh-3.5rem)] flex-col items-center gap-6 bg-[var(--bg)] px-3 pb-[max(3rem,env(safe-area-inset-bottom))] pt-6 min-[400px]:px-4 min-[400px]:pb-12 min-[400px]:pt-8 md:pb-20">
      <div className="w-full min-w-0 max-w-2xl space-y-4">
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

        <EditableTranscript
          value={transcript}
          onChange={onTranscriptChange}
          surface="paper"
          emphasizeWarning={showShortWarning}
        />

        {showShortWarning ? (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-sm font-medium text-[var(--warning)]"
          >
            That seems a bit short. Add more detail for better results.
          </p>
        ) : null}

        <div className="flex flex-col items-stretch gap-3 pt-2 sm:items-center">
          <button
            type="button"
            disabled={!canRefine}
            onClick={onRefine}
            className="btn-hero-cta min-h-12 w-full max-w-md py-3.5 min-[400px]:py-4 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:transform-none"
          >
            Refine Prompt →
          </button>
          {supported ? (
            <button
              type="button"
              onClick={handleContinueSpeaking}
              className="btn-secondary mx-auto min-h-12 w-full max-w-md py-3"
            >
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
