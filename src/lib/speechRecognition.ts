"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

type SpeechRecognitionErrorCode =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed";

interface SpeechRecognitionErrorEventLike extends Event {
  error: SpeechRecognitionErrorCode;
}

export interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  /** Non-standard; supported in some Chromium builds */
  maxAlternatives?: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructorLike | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechSupported(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => Boolean(getSpeechRecognitionConstructor()),
    () => false,
  );
}

export function createSpeechRecognition(): SpeechRecognitionLike | null {
  const Ctor = getSpeechRecognitionConstructor();
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-IN";
  try {
    recognition.maxAlternatives = 1;
  } catch {
    /* not supported in all engines */
  }
  return recognition;
}

const ERROR_MESSAGES: Record<SpeechRecognitionErrorCode, string> = {
  aborted: "Recording was interrupted.",
  "audio-capture": "No microphone detected. Check input and permissions.",
  "bad-grammar": "Speech parsing failed. Try again.",
  "language-not-supported": "This language is not supported for speech input.",
  network: "Network error during speech recognition.",
  "no-speech": "No speech detected. Speak a bit louder or closer to the mic.",
  "not-allowed": "Microphone permission denied. Allow mic access in browser settings.",
  "service-not-allowed": "Speech service blocked by browser or device policy.",
};

export interface UseSpeechRecognitionOptions {
  onInterim?: (text: string) => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { onInterim } = options;
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const prefixRef = useRef("");
  const isStoppingRef = useRef(false);
  const onInterimRef = useRef(onInterim);

  useEffect(() => {
    onInterimRef.current = onInterim;
  }, [onInterim]);

  const [isListening, setIsListening] = useState(false);
  const [sessionFinals, setSessionFinals] = useState("");
  const sessionFinalsRef = useRef("");
  const [interimText, setInterimText] = useState("");
  const interimRef = useRef("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recognition = createSpeechRecognition();
    recognitionRef.current = recognition;
    if (!recognition) return;

    recognition.onresult = (event) => {
      let interim = "";
      let addition = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result[0]?.transcript ?? "";
        if (result.isFinal) {
          addition += piece;
        } else {
          interim += piece;
        }
      }
      const trimmedInterim = interim.trim();
      interimRef.current = trimmedInterim;
      setInterimText(trimmedInterim);

      if (addition) {
        const next = `${sessionFinalsRef.current}${addition}`;
        sessionFinalsRef.current = next;
        setSessionFinals(next);
      }

      /* Never call onInterim inside setState updaters — it updates the parent and triggers
       * "Cannot update a component while rendering a different component" in React 19. */
      queueMicrotask(() => {
        const finalsSoFar = `${prefixRef.current}${sessionFinalsRef.current}`.trim();
        const live = [finalsSoFar, interimRef.current].filter(Boolean).join(" ");
        onInterimRef.current?.(live);
      });
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted" && isStoppingRef.current) return;
      setError(ERROR_MESSAGES[event.error] ?? "Voice recognition failed.");
      setIsListening(false);
      isStoppingRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isStoppingRef.current) isStoppingRef.current = false;
    };

    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const start = useCallback((appendAfter?: string) => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    const trimmed = appendAfter?.trim();
    prefixRef.current = trimmed ? `${trimmed} ` : "";
    setError(null);
    setSessionFinals("");
    sessionFinalsRef.current = "";
    interimRef.current = "";
    setInterimText("");
    isStoppingRef.current = false;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setError("Could not start microphone. Check permissions and try again.");
      setIsListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    isStoppingRef.current = true;
    recognition.stop();
  }, []);

  const reset = useCallback(() => {
    setSessionFinals("");
    sessionFinalsRef.current = "";
    interimRef.current = "";
    setInterimText("");
    setError(null);
    prefixRef.current = "";
  }, []);

  const getMergedTranscript = useCallback(() => {
    return [prefixRef.current + sessionFinalsRef.current, interimRef.current]
      .filter(Boolean)
      .join(" ")
      .trim();
  }, []);

  return {
    isListening,
    sessionFinals,
    interimText,
    getMergedTranscript,
    error,
    start,
    stop,
    reset,
    setError,
  };
}
