"use client";

import { useCallback } from "react";
import { useSvgStore } from "@/store/svgStore";

export function SvgUpload() {
  const setSourceImage = useSvgStore((s) => s.setSourceImage);
  const sourceImage = useSvgStore((s) => s.sourceImage);
  const fileName = useSvgStore((s) => s.fileName);
  const reset = useSvgStore((s) => s.reset);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setSourceImage(e.target!.result as string, file.name);
    reader.readAsDataURL(file);
  }, [setSourceImage]);

  return (
    <label
      className={`relative flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden
        ${sourceImage ? "h-40 border-violet-500/40" : "h-32 border-zinc-700 hover:border-violet-500/60 bg-zinc-800/40 hover:bg-violet-500/5"}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
    >
      <input type="file" accept="image/*" className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {sourceImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sourceImage} alt="Source" className="h-full w-full object-contain p-2" />
          <button
            onClick={(e) => { e.preventDefault(); reset(); }}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white flex items-center justify-center text-xs z-10"
          >✕</button>
          <p className="absolute bottom-1 text-xs text-zinc-600 truncate max-w-full px-4">{fileName}</p>
        </>
      ) : (
        <>
          <svg className="w-7 h-7 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-zinc-400">Drop image or <span className="text-violet-400">browse</span></p>
          <p className="text-xs text-zinc-600">PNG, JPG, WEBP, SVG</p>
        </>
      )}
    </label>
  );
}
