# rrweb-player build produces non-functional bundle when built without `browser` resolve condition

## Summary

When building rrweb-player from source (e.g. forking or local development), the built output can be unusable: the player renders an empty DOM shell and does not replay. The root cause is that Vite in library mode does not include the `browser` export condition in `resolve.conditions`, so Svelte’s runtime is resolved to the SSR build. Rollup then tree-shakes away `onMount` callbacks (and everything inside them, including `Replayer` initialization), so the bundle is missing the core replay logic.

This tends to show up when building on **Windows**; the official npm package is built on Linux (e.g. in CI), where the `browser` condition may be applied by default, so the published package works correctly.

## Environment

- **Package**: `rrweb-player` (Svelte + Vite, library mode)
- **Observed on**: Windows (build from source / fork)
- **Svelte**: uses conditional exports with `browser` and `default` in its `package.json`

## Root cause

1. **Svelte’s `package.json`** exposes the main entry with conditions like:
   ```json
   {
     "browser": { "default": "./src/runtime/index.js" },
     "default": "./src/runtime/ssr.js"
   }
   ```

2. **Vite (library build)** does not add `browser` to `resolve.conditions`, so Node’s conditional exports resolution picks the `default` branch → **`ssr.js`**.

3. In the **SSR runtime**, `onMount` is a no-op:
   ```js
   export function onMount() {}
   ```

4. **Rollup’s tree-shaking** sees that `onMount` is empty and removes the entire `onMount(...)` call and its callback. That callback contains the player setup (e.g. `new Replayer(events, { ... })`). As a result, the **Replayer class and initialization are dropped** from the bundle.

5. The built file is smaller (~295 kB instead of ~483 kB) and only renders the static DOM; playback logic is missing.

## Reproduction

1. Clone the rrweb repo and go to `packages/rrweb-player`.
2. Run the library build on Windows (e.g. `yarn build` or `npm run build`).
3. Use the built artifact (e.g. UMD or ESM from `dist/`) in a test page.
4. **Actual**: Player UI shell appears but no replay (no `Replayer` init).
5. **Expected**: Same behavior as the published npm package (full replay).

## Expected vs actual

| | Expected | Actual (broken build) |
|---|---|---|
| Bundle size | ~483 kB | ~295 kB |
| `onMount` / Replayer init | Present | Tree-shaken out |
| Runtime behavior | Replay works | Empty shell, no playback |

## Proposed fix

In `packages/rrweb-player/vite.config.ts`, ensure the `browser` condition is used when resolving dependencies (so Svelte resolves to the browser runtime, not SSR):

```ts
export default defineConfig((env) => {
  const resolved = typeof baseConfig === 'function' ? baseConfig(env) : baseConfig;
  return {
    ...resolved,
    resolve: {
      ...resolved.resolve,
      conditions: ['browser', ...(resolved.resolve?.conditions || [])],
    },
  };
});
```

After this change:

- Svelte resolves to the browser runtime (`./src/runtime/index.js`), where `onMount` is the real implementation.
- `onMount` callbacks are no longer removed by tree-shaking.
- The bundle size returns to ~483 kB and includes `Replayer` and initialization; playback works when building from source on Windows (and should remain correct on Linux).

## Workaround for downstream / forks

Until the fix is merged, anyone building rrweb-player from source (especially on Windows) can apply the same `resolve.conditions: ['browser', ...]` in their local `vite.config.ts` for the rrweb-player package.

---

I can open a PR with the above `vite.config.ts` change if the maintainers are okay with this approach.
