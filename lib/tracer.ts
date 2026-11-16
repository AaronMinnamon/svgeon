"use client";

let potraceModule: typeof import("potrace-wasm") | null = null;
let loadPromise: Promise<void> | null = null;

async function ensureLoaded() {
  if (potraceModule) return;
  if (!loadPromise) {
    loadPromise = (async () => {
      potraceModule = await import("potrace-wasm");
    })();
  }
  await loadPromise;
}

export async function traceImage(imageDataUrl: string, threshold: number): Promise<string> {
  await ensureLoaded();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          d[i] = 255 - d[i];
          d[i + 1] = 255 - d[i + 1];
          d[i + 2] = 255 - d[i + 2];
        }
        ctx.putImageData(imageData, 0, 0);
        const svg = await potraceModule!.loadFromCanvas(canvas, threshold);
        resolve(svg);
      } catch (err) { reject(err); }
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}

export async function warmup() {
  await ensureLoaded();
}
