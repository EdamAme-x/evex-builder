export const buildTargets = {
  "auto": ["deno", null],
  "windows": ["deno", "x86_64-pc-windows-msvc"],
  "macos": ["deno", "x86_64-apple-darwin"],
  "macos:arm64": ["deno", "aarch64-apple-darwin"],
  "linux": ["deno", "x86_64-unknown-linux-gnu"],
  "linux:arm64": ["deno", "aarch64-unknown-linux-gnu"],
  "wasm": ["porffor", "wasm"],
  "c": ["porffor", "c"],
} as const satisfies Record<string, [
  Builder,
  string | null,
]>;

type Builder = "deno" | "porffor";
