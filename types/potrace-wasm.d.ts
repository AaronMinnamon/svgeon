declare module "potrace-wasm" { export function loadFromCanvas(canvas: HTMLCanvasElement, threshold?: number): Promise<string>; }
