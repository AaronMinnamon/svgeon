"use client";

import { useSvgStore } from "@/store/svgStore";

export function Toolbar() {
  const neonSvg = useSvgStore((s) => s.neonSvg);
  const fileName = useSvgStore((s) => s.fileName);
  const reset = useSvgStore((s) => s.reset);

  const handleDownload = () => {
    if (!neonSvg) return;
    const blob = new Blob([neonSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName?.replace(".svg", "") ?? "output"}-neon.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!neonSvg) return;
    await navigator.clipboard.writeText(neonSvg);
  };

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur z-10">
      <div className="flex items-center gap-2.5">
        <span className="text-lg" style={{ filter: "drop-shadow(0 0 6px #00ffff)" }}>⚡</span>
        <span className="font-semibold text-sm tracking-tight text-zinc-100">svgeon</span>
      </div>

      {neonSvg && (
        <div className="flex items-center gap-2">
          <button onClick={handleCopy}
            className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-400 transition-colors">
            Copy SVG
          </button>
          <button onClick={handleDownload}
            className="py-1.5 px-3 rounded-lg text-xs font-medium text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/60 transition-colors"
            style={{ textShadow: "0 0 6px #00ffff" }}>
            Download Neon SVG
          </button>
          <button onClick={reset}
            className="py-1.5 px-3 rounded-lg text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            Clear
          </button>
        </div>
      )}
    </header>
  );
}
