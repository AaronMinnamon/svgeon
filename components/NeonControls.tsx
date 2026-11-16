"use client";

import { useCallback } from "react";
import { useSvgStore } from "@/store/svgStore";
import type { FlickerSpeed } from "@/store/svgStore";
import { applyNeonEffect } from "@/lib/neonUtils";

const FLICKER_OPTIONS: { value: FlickerSpeed; label: string }[] = [
  { value: "none",   label: "Static" },
  { value: "slow",   label: "Slow" },
  { value: "medium", label: "Medium" },
  { value: "fast",   label: "Fast" },
];

const PRESET_COLORS = [
  { value: "#00ffff", label: "Cyan" },
  { value: "#ff0080", label: "Pink" },
  { value: "#39ff14", label: "Green" },
  { value: "#bf5fff", label: "Purple" },
  { value: "#ff6600", label: "Orange" },
  { value: "#ffffff", label: "White" },
];

export function NeonControls() {
  const tracedSvg = useSvgStore((s) => s.tracedSvg);
  const options = useSvgStore((s) => s.options);
  const setOptions = useSvgStore((s) => s.setOptions);
  const setNeonSvg = useSvgStore((s) => s.setNeonSvg);

  const handleApply = useCallback(() => {
    if (!tracedSvg) return;
    const result = applyNeonEffect(tracedSvg, options);
    setNeonSvg(result);
  }, [tracedSvg, options, setNeonSvg]);

  if (!tracedSvg) return null;

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Neon Effect</p>

      {/* Color */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-500">Color</p>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map(({ value, label }) => (
            <button key={value} title={label} onClick={() => setOptions({ color: value })}
              className={`h-7 rounded-lg border-2 transition-all ${options.color === value ? "border-white scale-110" : "border-transparent hover:scale-105"}`}
              style={{ backgroundColor: value, boxShadow: options.color === value ? `0 0 8px ${value}` : undefined }}
            />
          ))}
        </div>
        <input type="color" value={options.color}
          onChange={(e) => setOptions({ color: e.target.value })}
          className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-zinc-700" />
      </div>

      {/* Glow intensity */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <p className="text-xs text-zinc-500">Glow Spread</p>
          <span className="text-xs text-zinc-400">{options.glowIntensity}</span>
        </div>
        <input type="range" min={1} max={12} step={0.5} value={options.glowIntensity}
          onChange={(e) => setOptions({ glowIntensity: Number(e.target.value) })}
          className="w-full accent-violet-500" />
      </div>

      {/* Stroke width */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <p className="text-xs text-zinc-500">Stroke Width</p>
          <span className="text-xs text-zinc-400">{options.strokeWidth}</span>
        </div>
        <input type="range" min={0.5} max={8} step={0.5} value={options.strokeWidth}
          onChange={(e) => setOptions({ strokeWidth: Number(e.target.value) })}
          className="w-full accent-violet-500" />
      </div>

      {/* Flicker speed */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-500">Flicker</p>
        <div className="grid grid-cols-4 gap-1.5">
          {FLICKER_OPTIONS.map(({ value, label }) => (
            <button key={value} onClick={() => setOptions({ flickerSpeed: value })}
              className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                options.flickerSpeed === value
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Apply */}
      <button onClick={handleApply}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all bg-zinc-900 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-500/5"
        style={{ textShadow: "0 0 8px #00ffff", boxShadow: "0 0 20px #00ffff11" }}>
        ⚡ Apply Neon
      </button>
    </div>
  );
}
