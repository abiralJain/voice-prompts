"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

const ProblemSection = dynamic(() => import("@/components/ProblemSection"));
const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection"));
const FinalCTA = dynamic(() => import("@/components/FinalCTA"));
const Footer = dynamic(() => import("@/components/Footer"));
import type { HeroState, PromptMode, RefineResponse, ToolPrompt } from "@/types";

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function HomePage() {
  const [heroState, setHeroState] = useState<HeroState>("landing");
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState<RefineResponse | null>(null);
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [loadingToolName, setLoadingToolName] = useState<string | null>(null);
  const [toolGenerationError, setToolGenerationError] = useState<string | null>(null);
  const [promptMode, setPromptMode] = useState<PromptMode>("enhance");
  const [isReRefining, setIsReRefining] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const promptCacheRef = useRef<Map<string, ToolPrompt>>(new Map());

  const ensureMic = useCallback(async (): Promise<MediaStream | null> => {
    if (streamRef.current) return streamRef.current;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = s;
      setAudioStream(s);
      return s;
    } catch {
      setBannerError("Microphone unavailable — you can still type your transcript.");
      window.setTimeout(() => setBannerError(null), 4000);
      return null;
    }
  }, []);

  const stopMic = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setAudioStream(null);
  }, []);

  const scrollToHeroAndStart = useCallback(() => {
    setBannerError(null);
    stopMic();
    promptCacheRef.current = new Map();
    setLoadingToolName(null);
    setToolGenerationError(null);
    setResults(null);
    setTranscript("");
    setActiveToolIndex(0);
    setPromptMode("enhance");
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      setHeroState("recording");
      void ensureMic();
    }, 380);
  }, [ensureMic, stopMic]);

  const runRefine = useCallback(async (text: string, mode: PromptMode) => {
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const res = await fetch("/api/refine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: text, mode }),
        });
        const data = (await res.json()) as RefineResponse & { error?: string };
        if (!res.ok) {
          throw new Error(data.error || "Refinement failed");
        }
        if (!Array.isArray(data.tools) || data.tools.length === 0) {
          throw new Error("Unexpected response from AI. Please try again.");
        }
        const normalized: RefineResponse = {
          ...data,
          tools: data.tools.slice(0, Math.min(data.tools.length, 3)),
          all_category_tools: data.all_category_tools ?? [],
          improvements_made: data.improvements_made ?? [],
          prompt_mode: data.prompt_mode ?? mode,
          original_transcript: data.original_transcript ?? text,
          category_label: data.category_label || data.category,
          best_match_index: Math.min(
            data.best_match_index ?? 0,
            Math.max(0, data.tools.slice(0, Math.min(data.tools.length, 3)).length - 1),
          ),
        };
        promptCacheRef.current = new Map();
        for (const t of normalized.tools) {
          promptCacheRef.current.set(`${t.tool_name}\t${normalized.prompt_mode}`, t);
        }
        setToolGenerationError(null);
        setLoadingToolName(null);
        setResults(normalized);
        setTranscript(normalized.original_transcript);
        setActiveToolIndex(
          Math.min(normalized.best_match_index ?? 0, normalized.tools.length - 1),
        );
        setHeroState("results");
        return;
      } catch (e: unknown) {
        lastError = e instanceof Error ? e : new Error("Something went wrong");
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    }
    throw lastError ?? new Error("Refinement failed");
  }, []);

  const handleRefine = useCallback(async () => {
    if (wordCount(transcript) < 10) return;
    setBannerError(null);
    setHeroState("processing");
    stopMic();
    try {
      await runRefine(transcript.trim(), promptMode);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setBannerError(message);
      setHeroState("reviewing");
    }
  }, [runRefine, stopMic, transcript, promptMode]);

  const handleReRefine = useCallback(
    async (feedback?: string) => {
      const base = transcript.trim();
      const payload = feedback
        ? `${base}\n\n--- User feedback ---\n${feedback.trim()}`
        : base;
      setBannerError(null);
      setIsReRefining(true);
      try {
        await runRefine(payload, promptMode);
        requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Something went wrong";
        setBannerError(message);
      } finally {
        setIsReRefining(false);
      }
    },
    [runRefine, transcript, promptMode],
  );

  const handlePromptModeChange = useCallback(
    async (newMode: PromptMode) => {
      if (newMode === promptMode) return;
      setPromptMode(newMode);
      const text = transcript.trim();
      if (!text || wordCount(text) < 5 || !results) return;
      setBannerError(null);
      setIsReRefining(true);
      try {
        await runRefine(text, newMode);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Something went wrong";
        setBannerError(message);
      } finally {
        setIsReRefining(false);
      }
    },
    [promptMode, transcript, results, runRefine],
  );

  const handleTryAnother = useCallback(() => {
    stopMic();
    promptCacheRef.current = new Map();
    setLoadingToolName(null);
    setToolGenerationError(null);
    setResults(null);
    setTranscript("");
    setActiveToolIndex(0);
    setPromptMode("enhance");
    setHeroState("landing");
  }, [stopMic]);

  const handleGenerateToolPrompt = useCallback(
    async (toolName: string) => {
      if (!results) return;
      const text = transcript.trim();
      if (wordCount(text) < 5) return;

      const existingIdx = results.tools.findIndex((t) => t.tool_name === toolName);
      if (existingIdx >= 0) {
        setActiveToolIndex(existingIdx);
        return;
      }

      const cacheKey = `${toolName}\t${promptMode}`;
      const cached = promptCacheRef.current.get(cacheKey);
      if (cached) {
        setResults((prev) => {
          if (!prev) return prev;
          if (prev.tools.some((t) => t.tool_name === toolName)) return prev;
          const tools = [...prev.tools, cached];
          queueMicrotask(() => setActiveToolIndex(tools.length - 1));
          return { ...prev, tools };
        });
        return;
      }

      setToolGenerationError(null);
      setLoadingToolName(toolName);
      try {
        const res = await fetch("/api/refine/tool", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: text,
            toolName,
            category: results.category,
            mode: promptMode,
          }),
        });
        const data = (await res.json()) as { tool?: ToolPrompt; error?: string };
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate prompt");
        }
        if (!data.tool) {
          throw new Error("Unexpected response from AI");
        }
        promptCacheRef.current.set(cacheKey, data.tool);
        setResults((prev) => {
          if (!prev) return prev;
          if (prev.tools.some((t) => t.tool_name === data.tool!.tool_name)) return prev;
          const tools = [...prev.tools, data.tool!];
          queueMicrotask(() => setActiveToolIndex(tools.length - 1));
          return { ...prev, tools };
        });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Something went wrong";
        setToolGenerationError(message);
      } finally {
        setLoadingToolName(null);
      }
    },
    [results, transcript, promptMode],
  );

  const handleRecordingClearRestart = useCallback(() => {
    stopMic();
    setHeroState("landing");
    setTranscript("");
  }, [stopMic]);

  const handleStartSpeaking = useCallback(() => {
    setBannerError(null);
    setHeroState("recording");
    void ensureMic();
  }, [ensureMic]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      {bannerError ? (
        <div className="border-b border-[var(--error)]/25 bg-[var(--error)]/10 px-3 py-3 text-center text-sm font-semibold text-[var(--error)] backdrop-blur-xl min-[400px]:px-4">
          {bannerError}
        </div>
      ) : null}

      <HeroSection
        heroState={heroState}
        transcript={transcript}
        onTranscriptChange={setTranscript}
        results={results}
        activeToolIndex={activeToolIndex}
        onActiveToolChange={setActiveToolIndex}
        audioStream={audioStream}
        ensureMic={ensureMic}
        stopMic={stopMic}
        onStartSpeaking={handleStartSpeaking}
        onEnterReview={() => setHeroState("reviewing")}
        onResumeSpeaking={() => setHeroState("recording")}
        onRecordingClearRestart={handleRecordingClearRestart}
        onRefine={handleRefine}
        onReRefine={handleReRefine}
        onTryAnother={handleTryAnother}
        onGenerateToolPrompt={handleGenerateToolPrompt}
        loadingToolName={loadingToolName}
        toolGenerationError={toolGenerationError}
        promptMode={promptMode}
        onPromptModeChange={handlePromptModeChange}
        isReRefining={isReRefining}
        resultsRef={resultsRef}
      />

      <ProblemSection />
      <HowItWorksSection />
      <FinalCTA onScrollToHeroAndStart={scrollToHeroAndStart} />

      <Footer />
    </div>
  );
}
