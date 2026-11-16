"use client";

import { useCallback, useState } from "react";
import { useSvgStore } from "@/store/svgStore";
import { traceImage } from "@/lib/tracer";
import { Toolbar } from "@/components/Toolbar";
import { SvgCanvas } from "@/components/SvgCanvas";
import { SvgUpload } from "@/components/SvgUpload";
import { NeonControls } from "@/components/NeonControls";

export default function Home() {
  const sourceImage = useSvgStore((s) => s.sourceImage);
  const tracedSvg = useSvgStore((s) => s.tracedSvg);
  const neonSvg = useSvgStore((s) => s.neonSvg);
  const threshold = useSvgStore((s) => s.threshold);
  const isTracing = useSvgStore((s) => s.isTracing);
  const setThreshold = useSvgStore((s) => s.setThreshold);
  const setIsTracing = useSvgStore((s) => s.setIsTracing);
  const setTracedSvg = useSvgStore((s) => s.setTracedSvg);

  const handleTrace = useCallback(async () => {
    if (!sourceImage) return;
    setIsTracing(true);
    try {
      const svg = await traceImage(sourceImage, threshold);
      setTracedSvg(svg);
    } finally {
      setIsTracing(false);
    }
  }, [sourceImage, threshold, setIsTracing, setTracedSvg]);

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 flex flex-col gap-5 border-r border-zinc-800/80 bg-zinc-900/50 overflow-y-auto p-4">
          <SvgUpload />

          {/* Trace step */}
          {sourceImage && (
            <>
              <div className="border-t border-zinc-800/80" />
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Trace</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <p className="text-xs text-zinc-500">Threshold</p>
                    <span className="text-xs text-zinc-400">{threshold}</span>
                  </div>
                  <input type="range" min={1} max={254} step={1} value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-violet-500" />
                  <p className="text-xs text-zinc-600">Lower = more detail, higher = bolder shapes</p>
                </div>
                <button onClick={handleTrace} disabled={isTracing}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                  {isTracing ? "Tracing…" : tracedSvg ? "Re-trace" : "Trace Image"}
                </button>
              </div>
            </>
          )}

          {/* Neon controls */}
          {tracedSvg && (
            <>
              <div className="border-t border-zinc-800/80" />
              <NeonControls />
            </>
          )}
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-0" style={{
            background: neonSvg
              ? "radial-gradient(ellipse at center, rgb(49,44,24) 0%, rgba(0,0,0,0.95) 100%)"
              : "radial-gradient(ellipse at center, #0f0f1a 0%, #050508 100%)",
          }} />

          {!sourceImage && (
            <div className="relative text-center space-y-3 p-8 max-w-xs">
              <p className="text-4xl" style={{ filter: "drop-shadow(0 0 12px #00ffff)" }}>⚡</p>
              <p className="text-zinc-400 font-medium">Upload an image to get started</p>
              <p className="text-zinc-600 text-sm">Any PNG, JPG, WEBP, or SVG will be traced and turned into a neon sign</p>
            </div>
          )}

          {(tracedSvg || neonSvg) && <SvgCanvas />}

          {sourceImage && !tracedSvg && !isTracing && (
            <div className="relative text-center space-y-2 p-8 max-w-xs">
              <p className="text-zinc-500 text-sm">Adjust threshold and click <span className="text-violet-400 font-medium">Trace Image</span></p>
            </div>
          )}

          {isTracing && (
            <div className="relative text-center space-y-2">
              <p className="text-zinc-400 text-sm animate-pulse">Tracing image…</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
