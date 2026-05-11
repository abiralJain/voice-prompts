"use client";

export type OrbVisualizerState = "idle" | "listening" | "thinking";

interface OrbVisualizerProps {
  volume: number;
  state: OrbVisualizerState;
  className?: string;
}

export default function OrbVisualizer({ volume, state, className = "" }: OrbVisualizerProps) {
  const activity = Math.min(1, Math.max(0, volume));
  const scale = state === "listening" ? 1 + activity * 0.12 : state === "thinking" ? 1.06 : 1;
  const bars = [0.35, 0.62, 0.9, 0.5, 0.76, 0.42, 0.68];

  return (
    <div
      className={`relative mx-auto flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-card)] ${className}`}
      style={{
        width: "clamp(150px, 40vw, 200px)",
        height: "clamp(150px, 40vw, 200px)",
      }}
    >
      <span className="absolute inset-[-12px] rounded-full border border-[rgba(17,17,17,0.08)]" aria-hidden />
      <span className="absolute inset-6 rounded-full border border-[rgba(17,17,17,0.06)]" aria-hidden />
      <div
        className={`relative flex h-[58%] w-[58%] items-center justify-center rounded-full bg-[var(--bg-ink)] text-white transition-transform duration-200 ${
          state === "thinking" ? "animate-pulse" : ""
        }`}
        style={{ transform: `scale(${scale})` }}
      >
        <div className="flex h-14 items-center gap-1.5">
          {bars.map((bar, index) => (
            <span
              key={`${bar}-${index}`}
              className="w-1.5 rounded-full bg-white"
              style={{
                height: `${18 + bar * 34 * (state === "listening" ? 0.7 + activity : 0.72)}px`,
                opacity: state === "idle" ? 0.42 : 0.82,
                animation: state === "idle" ? undefined : `meter ${520 + index * 70}ms ease-in-out infinite`,
              }}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}
