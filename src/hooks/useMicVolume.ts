"use client";

import { useEffect, useRef, useState } from "react";

/** Normalized microphone level 0–1, smoothed for UI (e.g. orb reactivity). */
export function useMicVolume(stream: MediaStream | null): number {
  const [volume, setVolume] = useState(0);
  const smoothRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!stream) {
      let cancelled = false;
      const decay = () => {
        if (cancelled) return;
        smoothRef.current *= 0.92;
        if (smoothRef.current < 0.008) smoothRef.current = 0;
        setVolume(smoothRef.current);
        rafRef.current = requestAnimationFrame(decay);
      };
      rafRef.current = requestAnimationFrame(decay);
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafRef.current);
      };
    }

    let ctx: AudioContext | null = null;
    let cancelled = false;

    const run = async () => {
      ctx = new AudioContext();
      if (ctx.state === "suspended") await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const loop = () => {
        if (cancelled || !ctx) return;
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) sum += data[i];
        const avg = sum / data.length / 255;
        const boosted = Math.min(1, avg * 4);
        smoothRef.current = smoothRef.current * 0.72 + boosted * 0.28;
        setVolume(smoothRef.current);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };

    void run();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      void ctx?.close();
    };
  }, [stream]);

  return volume;
}
