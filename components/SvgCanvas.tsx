"use client";

import { useEffect, useState } from "react";
import { useSvgStore } from "@/store/svgStore";

export function SvgCanvas() {
  const neonSvg = useSvgStore((s) => s.neonSvg);
  const tracedSvg = useSvgStore((s) => s.tracedSvg);
  const [url, setUrl] = useState<string | null>(null);

  const displaySvg = neonSvg || tracedSvg;

  useEffect(() => {
    if (!displaySvg) {
      setUrl(null);
      return;
    }
    const blob = new Blob([displaySvg], { type: "image/svg+xml" });
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [displaySvg]);

  if (!url) return null;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
