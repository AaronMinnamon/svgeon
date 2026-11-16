import { create } from "zustand";

export type FlickerSpeed = "none" | "slow" | "medium" | "fast";

export interface NeonOptions {
  color: string;
  glowIntensity: number;  // stdDeviation for neon_glow — keep low (2–8)
  strokeWidth: number;    // base stroke width
  flickerSpeed: FlickerSpeed;
}

interface SvgStore {
  sourceImage: string | null;   // uploaded raster image data URL
  fileName: string | null;
  threshold: number;            // potrace threshold (1–254)
  isTracing: boolean;
  tracedSvg: string | null;     // clean vector paths from potrace
  neonSvg: string | null;       // final neon result
  options: NeonOptions;

  setSourceImage: (dataUrl: string, name: string) => void;
  setThreshold: (v: number) => void;
  setIsTracing: (v: boolean) => void;
  setTracedSvg: (svg: string) => void;
  setNeonSvg: (svg: string | null) => void;
  setOptions: (opts: Partial<NeonOptions>) => void;
  reset: () => void;
}

const defaultOptions: NeonOptions = {
  color: "#00ffff",
  glowIntensity: 4,
  strokeWidth: 2,
  flickerSpeed: "medium",
};

export const useSvgStore = create<SvgStore>((set) => ({
  sourceImage: null,
  fileName: null,
  threshold: 128,
  isTracing: false,
  tracedSvg: null,
  neonSvg: null,
  options: defaultOptions,

  setSourceImage: (dataUrl, name) =>
    set({ sourceImage: dataUrl, fileName: name, tracedSvg: null, neonSvg: null }),
  setThreshold: (v) => set({ threshold: v }),
  setIsTracing: (v) => set({ isTracing: v }),
  setTracedSvg: (svg) => set({ tracedSvg: svg, neonSvg: null }),
  setNeonSvg: (svg) => set({ neonSvg: svg }),
  setOptions: (opts) =>
    set((s) => ({ options: { ...s.options, ...opts }, neonSvg: null })),
  reset: () =>
    set({ sourceImage: null, fileName: null, tracedSvg: null, neonSvg: null }),
}));
