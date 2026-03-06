/**
 * @rrweb/wasm - Rust/WebAssembly optimizations for rrweb
 * Provides high-performance base64 encode/decode with fallback to JS implementation
 */

import { encode as jsEncode, decode as jsDecode } from 'base64-arraybuffer';

let wasmModule: {
  base64_encode: (data: Uint8Array) => string;
  base64_decode: (str: string) => Uint8Array;
} | null = null;

let wasmInitPromise: Promise<void> | null = null;

/**
 * Initialize WASM module. Call this early for best performance, or it will init on first use.
 */
export async function initWasm(): Promise<boolean> {
  if (wasmModule) return true;
  if (wasmInitPromise) {
    await wasmInitPromise;
    return !!wasmModule;
  }

  wasmInitPromise = (async () => {
    try {
      const pkg = await import(/* @vite-ignore */ '@rrweb/wasm/wasm');
      // wasm-pack bundler target: module initializes on load, no default() needed
      wasmModule = {
        base64_encode: pkg.base64_encode,
        base64_decode: pkg.base64_decode,
      };
    } catch (e) {
      console.warn('[rrweb-wasm] WASM init failed, using JS fallback:', e);
      wasmModule = null;
    }
  })();

  await wasmInitPromise;
  return !!wasmModule;
}

/**
 * Encode ArrayBuffer to Base64 string.
 * Uses WASM when available, falls back to base64-arraybuffer.
 */
export function encode(buffer: ArrayBuffer): string {
  if (wasmModule) {
    return wasmModule.base64_encode(new Uint8Array(buffer));
  }
  return jsEncode(buffer);
}

/**
 * Decode Base64 string to ArrayBuffer.
 * Uses WASM when available, falls back to base64-arraybuffer.
 */
export function decode(base64: string): ArrayBuffer {
  if (wasmModule) {
    const u8 = wasmModule.base64_decode(base64);
    return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
  }
  return jsDecode(base64);
}

/**
 * Synchronous init - for environments that need WASM ready before first encode/decode.
 * Returns true if WASM is available (after init attempt).
 */
export function initWasmSync(): void {
  if (wasmInitPromise) return;
  wasmInitPromise = initWasm().then(() => {});
}
