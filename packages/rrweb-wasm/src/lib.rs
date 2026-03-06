use base64::{engine::general_purpose::STANDARD, Engine};
use wasm_bindgen::prelude::*;

/// Encode ArrayBuffer to Base64 string (WASM-optimized)
#[wasm_bindgen]
pub fn base64_encode(data: &[u8]) -> String {
    STANDARD.encode(data)
}

/// Decode Base64 string to bytes (returns Vec<u8> as Uint8Array in JS)
#[wasm_bindgen]
pub fn base64_decode(base64_str: &str) -> Result<Vec<u8>, JsValue> {
    STANDARD
        .decode(base64_str)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}
