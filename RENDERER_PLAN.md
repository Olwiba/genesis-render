# @olwiba/genesis-render - Architecture

> Thin olwibaUI adapter layer on top of `@json-render/core` and `@json-render/react`.

## Vision

`@olwiba/genesis-render` does not implement a rendering engine. It wraps `@json-render/react` with a pre-built catalog and registry of `@olwiba/ui` components, similar to how `@json-render/shadcn` wraps shadcn/ui.

```
@json-render/core      - catalog definitions, spec types
@json-render/react     - Renderer, StateProvider, ActionProvider, VisibilityProvider
    |
@olwiba/genesis-render        - olwibaUI catalog + registry + GenesisPage convenience wrapper
    |
genesis                - TanStack template: routes render JSON specs via GenesisPage
```

## What this package provides

1. **Catalog** (`catalog.ts`) - Zod-validated component definitions for olwibaUI components suitable for JSON-driven rendering
2. **Registry** (`registry.ts`) - Maps catalog types to actual olwibaUI component implementations via `defineRegistry`
3. **GenesisPage** (`genesis-page.tsx`) - Pre-configured wrapper that composes `Renderer` + `StateProvider` + `ActionProvider` + `VisibilityProvider` with the default olwibaUI registry
4. **Re-exports** - Core json-render utilities so consumers don't need to depend on json-render directly

## Adding a new component

1. Export the component from `@olwiba/ui`
2. Add its Zod prop schema to `olwibaComponentDefinitions` in `catalog.ts`
3. Add its adapter to `olwibaComponents` in `registry.ts`

The catalog and registry types stay in sync via `defineRegistry(catalog, ...)`.

## Package identity

| Field | Value |
|-------|-------|
| Package | `@olwiba/genesis-render` |
| Dependencies | `@json-render/core`, `@json-render/react` |
| Peer deps | `@olwiba/ui`, `@olwiba/cn`, `react`, `react-dom`, `zod` |
| Tests | Vitest + @testing-library/react |
