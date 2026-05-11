"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMicVolume } from "@/hooks/useMicVolume";
import { useSpeechRecognition, useSpeechSupported } from "@/lib/speechRecognition";
import EditableTranscript from "./EditableTranscript";
import OrbVisualizer, { type OrbVisualizerState } from "./OrbVisualizer";

const PROCESSING_MESSAGES = [
  "Listening for intent...",
  "Mapping the best AI tools...",
  "Engineering the prompt structure...",
  "Polishing the final wording...",
];

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M12 4.5a3.5 3.5 0 0 0-3.5 3.5v4a3.5 3.5 0 1 0 7 0V8A3.5 3.5 0 0 0 12 4.5Z" fill="currentColor" />
      <path d="M6 11.5v.75a6 6 0 0 0 12 0v-.75M12 18.25V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="7.5" y="7.5" width="9" height="9" rx="2" fill="currentColor" />
    </svg>
  );
}

function ProcessingView() {
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-8 px-3 pb-12 pt-12 min-[400px]:px-4 md:pb-24">
      <div className="ink-panel flex w-full max-w-2xl flex-col items-center gap-8 rounded-[2rem] px-5 py-12 text-center">
        <OrbVisualizer volume={0} state="thinking" />
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-white/42">Prompt lab running</p>
          <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-white md:text-4xl">Turning speech into structure</h2>
        </div>
        <div className="min-h-[3rem] text-center">
          <p
            key={msgIndex}
            className="text-sm font-semibold text-white/62 [animation:status-fade_0.45s_var(--ease-out)_forwards]"
          >
            {PROCESSING_MESSAGES[msgIndex]}
          </p>
        </div>
        <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,var(--accent-brand),var(--accent-brand-2))]"
            style={{
              animation: "processing-bar 2.4s var(--ease-in-out) infinite",
            }}
          />
        </div>
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

  const showReviewUI = phase === "reviewing";
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
    stopMic();

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
    stopMic,
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
      if (cancelled) return;
      const t = transcriptRef.current;
      void beginListening(t.trim() ? t : undefined);
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [beginListening, processing, showReviewUI]);

  useEffect(() => {
    if (showReviewUI || processing) return;
    if (!speech.isListening && !isRecordingAudio) return;
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRecordingAudio, speech.isListening, showReviewUI, processing]);

  const orbState: OrbVisualizerState = processing
    ? "thinking"
    : speech.isListening || isRecordingAudio || isTranscribing
      ? "listening"
      : "idle";

  const currentWordCount = wordCount(transcript);
  const canRefine = currentWordCount >= 10 && !processing && !isTranscribing;
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
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center gap-6 px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-8 min-[400px]:gap-8 min-[400px]:px-4 min-[400px]:pb-16 min-[400px]:pt-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-[2rem] border border-[var(--border)] bg-[rgba(255,252,245,0.56)] p-4 shadow-[var(--shadow-card)] backdrop-blur-xl min-[400px]:p-6 md:p-8">
          <div className="flex w-full items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                {isCapturing ? "Recording live" : "Voice studio"}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--text-secondary)]">
                {formatTime(elapsedSeconds)}
              </p>
            </div>
            <div className="flex h-9 items-end gap-1.5 rounded-full border border-[var(--border)] bg-[rgba(255,252,245,0.7)] px-3 py-2">
              {[0, 1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className={`w-1.5 rounded-full ${isCapturing ? "bg-[var(--accent-brand)]" : "bg-[var(--border-hover)]"}`}
                  style={{
                    height: `${8 + bar * 3}px`,
                    animation: isCapturing ? `meter ${560 + bar * 80}ms ease-in-out infinite` : undefined,
                  }}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          <OrbVisualizer volume={volume} state={orbState} />

          <div className="flex w-full flex-col items-center gap-3">
            <button
              type="button"
              onClick={toggleListening}
              disabled={isTranscribing}
              className={`group relative flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold shadow-[var(--shadow-md)] transition disabled:opacity-40 min-[400px]:h-20 min-[400px]:w-20 ${
                isCapturing
                  ? "bg-[var(--bg-ink)] text-white shadow-[0_18px_42px_rgba(17,17,17,0.22),0_0_0_9px_rgba(17,17,17,0.045)] hover:bg-[#26231f]"
                  : "border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--border-hover)]"
              }`}
              aria-label={isCapturing ? "Stop recording" : "Start speaking"}
            >
              {isCapturing ? (
                <>
                  <span className="absolute inset-[-7px] rounded-full border border-[var(--bg-ink)]/10" aria-hidden />
                  <StopIcon />
                </>
              ) : (
                <MicIcon />
              )}
            </button>
            <p className="max-w-md text-center text-sm font-semibold text-[var(--text-secondary)]">
              {isTranscribing
                ? "Converting your voice to text..."
                : isCapturing
                  ? "Tap stop when you're done. Your audio is being captured even if live captions pause."
                  : "Tap once and speak naturally."}
            </p>
            {!isCapturing ? (
              <button type="button" onClick={goToReview} className="btn-ghost mt-1 text-sm">
                Type instead
              </button>
            ) : null}
          </div>

          <div className="max-h-48 min-h-24 w-full overflow-y-auto rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,252,245,0.64)] p-4 text-center">
            <p className="text-base font-medium leading-relaxed text-[var(--text-secondary)]">
              {transcript ||
                "Your transcript will appear here when browser speech recognition is available. If it is not, we will transcribe the recording after you stop."}
              {isCapturing ? (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--accent-brand)] align-middle" />
              ) : null}
            </p>
          </div>

          {!supported ? (
            <p className="max-w-md rounded-2xl border border-[var(--warning)]/25 bg-[var(--warning)]/10 px-4 py-3 text-center text-sm font-semibold text-[var(--warning)]">
              Live captions work best in Chrome or Edge. Recording can still use server transcription after you stop.
            </p>
          ) : null}
          {speech.errorCode === "network" && isRecordingAudio ? (
            <p
              role="status"
              aria-live="polite"
              className="max-w-md rounded-2xl border border-[var(--warning)]/20 bg-[rgba(154,101,15,0.08)] px-4 py-3 text-center text-sm font-semibold text-[var(--warning)]"
            >
              Live captions are unavailable right now. Keep speaking, then tap stop and we&apos;ll transcribe
              the recording.
            </p>
          ) : speech.error ? (
            <p className="max-w-md rounded-2xl border border-[var(--error)]/20 bg-[rgba(184,50,60,0.08)] px-4 py-3 text-center text-sm font-semibold text-[var(--error)]">
              {speech.error}
            </p>
          ) : null}
          {transcriptionError ? (
            <p className="max-w-md text-center text-sm text-[var(--error)]">{transcriptionError}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex min-h-[calc(100dvh-4rem)] flex-col items-center gap-6 px-3 pb-[max(3rem,env(safe-area-inset-bottom))] pt-6 min-[400px]:px-4 min-[400px]:pb-12 min-[400px]:pt-8 md:pb-20">
      <div className="glass-panel w-full min-w-0 max-w-3xl space-y-5 rounded-[2rem] p-4 min-[400px]:p-6 md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-tertiary)]">Review transcript</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[var(--text-primary)] md:text-4xl">
            Here&apos;s what we heard
          </h2>
          {recordedLabel ? (
            <p className="mt-2 font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--text-secondary)]">
              Recorded {recordedLabel}
            </p>
          ) : null}
        </div>

        {!supported ? (
          <p className="rounded-2xl border border-[var(--warning)]/25 bg-[var(--warning)]/10 px-4 py-3 text-center text-sm font-semibold text-[var(--warning)]">
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
            className="rounded-2xl border border-[var(--warning)]/25 bg-[var(--warning)]/10 px-4 py-3 text-center text-sm font-bold text-[var(--warning)]"
          >
            Add a little more detail for better results. You have {currentWordCount}/10 words.
          </p>
        ) : null}

        <div className="flex flex-col items-stretch gap-3 pt-2 sm:items-center">
          <button
            type="button"
            disabled={!canRefine}
            onClick={onRefine}
            className="btn-hero-cta min-h-12 w-full max-w-md py-3.5 min-[400px]:py-4 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:transform-none"
          >
            Refine prompt
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
