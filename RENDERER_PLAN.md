# @genesis/renderer — Implementation Plan

> A lightweight JSON-to-UI mapper that renders declarative block specs using `@olwiba/ui` components. Designed to enable AI-generated pages in the Genesis TanStack template.

---

## Vision

The renderer is a **thin mapping layer** — it takes a JSON spec and proxies each block through to the real `@olwiba/ui` component. No component implementations live here.

The ecosystem works like this:

```
@olwiba/cn          — shadcn primitives (complete)
    ↓ peerDep
@olwiba/ui          — reusable blocks built on CN (in development, grows over time)
    ↓ peerDep           each block exports a Zod schema alongside its component
@genesis/renderer   — JSON spec → olwibaUI mapper (this package)
    ↓ dep
genesis             — TanStack template: routes are JSX or JSON-spec-powered
```

**Key principle:** When a new block is added to `@olwiba/ui`, you register it in the renderer's default registry and it's immediately available to JSON specs. The renderer itself doesn't change shape.

---

## Package Identity

| Field | Value |
|-------|-------|
| Package name | `@genesis/renderer` |
| Location | `C:\Workspace\genesis-render\` |
| Registry | `https://npm.olwiba.com/` (private Verdaccio) |
| Scope | `@genesis` |
| Peer deps | `@olwiba/ui`, `@olwiba/cn`, `react`, `react-dom`, `@tanstack/react-router` |
| Runtime | Bun |
| Language | TypeScript strict, functional |
| Tests | Vitest |

`bunfig.toml` mirrors olwibaUI — `@genesis` scope points to `https://npm.olwiba.com/` with the shared token.

---

## Schema Ownership — Lives in olwibaUI

Each block in `@olwiba/ui` exports a Zod schema alongside its component:

```ts
// olwibaUI/src/components/Button.tsx
import { z } from 'zod';

export const ButtonSchema = z.object({
  label: z.string(),
  variant: z.enum(['default', 'secondary', 'destructive', 'outline', 'ghost']).optional(),
  disabled: z.boolean().optional(),
});

export type ButtonProps = z.infer<typeof ButtonSchema>;

export function Button({ label, variant, disabled }: ButtonProps) { ... }
```

The renderer imports both the component and its schema. Zod is the single source of truth — no duplicated `schema.json` files. If a portable JSON Schema is ever needed (e.g. for AI prompt injection), it can be generated at build time via `zod-to-json-schema`.

---

## Spec Format

### Nested (authoring / AI generation format)

Simple, human-writable, AI-generatable. Stored as JSON files in the project.

```json
{
  "type": "Stack",
  "props": { "direction": "vertical", "gap": "md" },
  "children": [
    {
      "type": "Heading",
      "props": { "text": "Welcome back", "level": "h1" }
    },
    {
      "type": "Button",
      "props": { "label": "Get started", "variant": "default" },
      "on": { "press": { "navigate": "/dashboard" } }
    }
  ]
}
```

### Flat (internal runtime format)

Converted from nested at render time (memoised). Optimised for recursive rendering without deep tree walks.

```json
{
  "root": "el-0",
  "elements": {
    "el-0": { "type": "Stack", "props": { "direction": "vertical", "gap": "md" }, "children": ["el-1", "el-2"] },
    "el-1": { "type": "Heading", "props": { "text": "Welcome back", "level": "h1" } },
    "el-2": { "type": "Button", "props": { "label": "Get started", "variant": "default" }, "on": { "press": { "navigate": "/dashboard" } } }
  }
}
```

---

## Core Types

```typescript
// A single block element
interface Block<P = Record<string, unknown>> {
  type: string;
  props: P;
  children?: string[];           // child element keys (flat format only)
  visible?: boolean;
  on?: Record<string, EventHandler>;
}

// Flat spec (runtime)
interface BlockSpec {
  root: string;
  elements: Record<string, Block>;
}

// Nested block (authoring)
interface NestedBlock {
  type: string;
  props: Record<string, unknown>;
  children?: NestedBlock[];
  visible?: boolean;
  on?: Record<string, EventHandler>;
}

// Event handlers
type EventHandler =
  | { navigate: string }                                          // TanStack Router
  | { handler: string; params?: Record<string, unknown> }        // named callback → onAction
  | EventHandler[];                                              // sequential

// What each block component receives
interface BlockRenderProps<P = Record<string, unknown>> {
  props: P;
  children?: ReactNode;
  emit: (event: string, data?: unknown) => void;
}

// Registry: type name → React component
type BlockRegistry = Record<string, ComponentType<BlockRenderProps<any>>>;

// Consumer's action callback
type ActionHandler = (name: string, params?: Record<string, unknown>) => void;
```

---

## Package Structure

Mirrors `@olwiba/ui` exactly — same repo layout, same tooling.

```
genesis-render/
├── src/                          # Package source (published to npm.olwiba.com)
│   ├── types.ts                  # All TypeScript types
│   ├── utils.ts                  # nestedToFlat, isFlat
│   ├── context.tsx               # NavigateContext (TanStack Router navigate)
│   ├── renderer.tsx              # BlockRenderer + GenesisPage
│   ├── registry.ts               # Default registry wired to @olwiba/ui
│   └── index.ts                  # Public API
│
├── site/                         # Docs app (TanStack Start, mirrors olwibaUI/site/)
│   └── routes/
│       ├── __root.tsx
│       ├── index.tsx
│       ├── api/
│       └── docs/
│
├── content/                      # MDX docs content (mirrors olwibaUI/content/)
│   └── docs/
│       ├── index.mdx             # Getting started
│       ├── meta.json
│       └── blocks/               # One .mdx per supported block type
│           ├── index.mdx
│           ├── button.mdx
│           ├── card.mdx
│           └── ...
│
├── tests/                        # Vitest tests
│   ├── utils.test.ts             # nestedToFlat, isFlat
│   ├── resolver.test.ts          # resolveHandler event logic
│   └── renderer.test.tsx         # GenesisPage rendering (React Testing Library)
│
├── package.json
├── tsconfig.json
├── tsup.config.ts                # Package build (mirrors olwibaUI)
├── vite.config.ts                # Docs site build (mirrors olwibaUI)
├── source.config.ts              # Fumadocs config (mirrors olwibaUI)
├── bunfig.toml                   # @olwiba + @genesis scope → npm.olwiba.com
└── Dockerfile                    # Docs site deployment (mirrors olwibaUI)
```

Deliberately minimal. No `components/` folder in the renderer — implementations live in `@olwiba/ui`.

---

## Renderer Architecture

### `BlockRenderer` (internal, memoised)

```tsx
const BlockRenderer = memo(function BlockRenderer({ elementKey, spec, registry, onAction }) {
  const element = spec.elements[elementKey];
  if (!element || element.visible === false) return null;

  const Component = registry[element.type] ?? registry['Unknown'];
  if (!Component) {
    console.warn(`[genesis-render] No component registered for type "${element.type}"`);
    return null;
  }

  const navigate = useNavigate();  // from context (see below)

  const emit = (event: string, data?: unknown) => {
    const handler = element.on?.[event];
    if (!handler) return;
    resolveHandler(handler, { navigate, onAction, data });
  };

  const children = element.children?.map((key) => (
    <BlockRenderer key={key} elementKey={key} spec={spec} registry={registry} onAction={onAction} />
  ));

  return <Component props={element.props} emit={emit}>{children}</Component>;
});
```

### `GenesisPage` (public API)

```tsx
interface GenesisPageProps {
  spec: BlockSpec | NestedBlock;
  onAction?: ActionHandler;
  registry?: Partial<BlockRegistry>;   // merged with defaultRegistry
}

export function GenesisPage({ spec, onAction, registry }: GenesisPageProps) {
  const flatSpec = useMemo(() => isFlat(spec) ? spec : nestedToFlat(spec), [spec]);
  const mergedRegistry = useMemo(
    () => ({ ...defaultRegistry, ...registry }),
    [registry]
  );

  return (
    <BlockRenderer
      elementKey={flatSpec.root}
      spec={flatSpec}
      registry={mergedRegistry}
      onAction={onAction}
    />
  );
}
```

### TanStack Router Navigation

`useNavigate` needs to be called inside the TanStack Router tree. We thread it via context so `BlockRenderer` doesn't need it as a prop:

```tsx
// context.tsx
const NavigateContext = createContext<ReturnType<typeof useNavigate> | null>(null);

export function NavigateProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return <NavigateContext.Provider value={navigate}>{children}</NavigateContext.Provider>;
}

export const useRendererNavigate = () => useContext(NavigateContext);
```

`GenesisPage` wraps in `NavigateProvider`. `resolveHandler` calls it for `{ navigate }` events.

### Event Resolution

```typescript
const resolveHandler = (
  handler: EventHandler,
  ctx: { navigate: ReturnType<typeof useNavigate>; onAction?: ActionHandler; data?: unknown }
) => {
  if (Array.isArray(handler)) {
    handler.forEach((h) => resolveHandler(h, ctx));
    return;
  }
  if ('navigate' in handler) {
    ctx.navigate({ to: handler.navigate });
    return;
  }
  if ('handler' in handler) {
    ctx.onAction?.(handler.handler, handler.params);
  }
};
```

---

## Default Registry

```typescript
// registry.ts — imports grow as @olwiba/ui grows
import { Button } from '@olwiba/ui';
import { Card } from '@olwiba/ui';
// ... etc

export const defaultRegistry: BlockRegistry = {
  Button: ({ props, emit }) => (
    <Button {...props} onClick={() => emit('press')} />
  ),
  Card: ({ props, children }) => (
    <Card {...props}>{children}</Card>
  ),
  // ... one entry per supported block
};
```

Each registry entry is a small adapter — it bridges the generic `{ props, emit, children }` interface to the olwibaUI component's actual API.

---

## Public API (`index.ts`)

```typescript
export { GenesisPage } from './renderer';
export { defaultRegistry } from './registry';
export { nestedToFlat } from './utils';
export type {
  Block,
  BlockSpec,
  NestedBlock,
  BlockRegistry,
  BlockRenderProps,
  EventHandler,
  ActionHandler,
} from './types';
```

---

## Genesis Template Integration

Routes can be JSX (normal) or JSON-spec-powered. Both are valid — the renderer is additive.

### JSON-spec route

```
src/routes/landing/
├── index.tsx       ← loads spec.json, renders via GenesisPage
└── spec.json       ← AI-generated or hand-authored block spec
```

```tsx
// src/routes/landing/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { GenesisPage } from '@genesis/renderer';
import spec from './spec.json';

export const Route = createFileRoute('/landing/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <GenesisPage
      spec={spec}
      onAction={(name, params) => {
        console.log('Action:', name, params);
        // route to tRPC mutations as needed
      }}
    />
  );
}
```

### Normal JSX route (unchanged)

```tsx
// src/routes/dashboard/index.tsx — just regular olwibaUI components
import { PageHeader, Spinner } from '@olwiba/ui';

function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Spinner />
    </>
  );
}
```

---

## Implementation Phases

### Phase 1 — Package scaffold
1. `package.json` — name, peerDeps, `publishConfig` → `npm.olwiba.com`
2. `bunfig.toml` — `@olwiba` + `@genesis` scopes, token
3. `tsconfig.json` — strict, bundler module resolution, path aliases
4. `tsup.config.ts` — ESM output, dts, externals (mirrors olwibaUI)
5. `vite.config.ts` + `source.config.ts` — docs site (mirrors olwibaUI)

### Phase 2 — Core engine + tests
6. `src/types.ts` — all interfaces
7. `src/utils.ts` — `nestedToFlat`, `isFlat` + `tests/utils.test.ts`
8. `src/context.tsx` — `NavigateProvider`, `useRendererNavigate`
9. `src/renderer.tsx` — `BlockRenderer` + `GenesisPage` + `tests/renderer.test.tsx`
10. `tests/resolver.test.ts` — event handler resolution

### Phase 3 — Registry (grows with olwibaUI)
11. `src/registry.ts` — wire up current olwibaUI exports
12. `src/index.ts` — public API surface

### Phase 4 — Docs site
13. `site/` — TanStack Start docs app scaffold (mirrors olwibaUI/site/)
14. `content/docs/` — Getting started + one page per registered block

### Phase 5 — Genesis template integration
15. Add `@genesis/renderer` dep to genesis `package.json`
16. Confirm `bunfig.toml` `@genesis` scope in genesis
17. Create example `spec.json` + route to close the loop

---

## Confirmed Decisions

| Decision | Choice |
|----------|--------|
| Component implementations | Live in `@olwiba/ui`, not the renderer |
| Schemas | Zod exported from each olwibaUI component |
| Registry ownership | Renderer ships with `defaultRegistry` (genesis can extend) |
| Registry merge behaviour | Always merges — `{ ...defaultRegistry, ...customRegistry }` |
| Spec format | Nested JSON for authoring, flat at runtime |
| Route integration | `spec.json` co-located with the route file |
| Publishing | `npm.olwiba.com` private registry, `@genesis` scope |
| Navigation | TanStack Router `useNavigate` via context |
| State management | None in v1 — dynamic data injected server-side into the spec |
| Streaming / AI DSL | Deferred to v2 |
| Tests | Vitest — utils, resolver logic, renderer |
| Docs | Same structure as olwibaUI (Fumadocs + TanStack Start in `site/`) |
| Repo structure | Mirrors olwibaUI exactly — `src/`, `site/`, `content/`, same tooling |
| Package manager | Bun |
| Philosophy | KISS — thin mapper only, grows alongside olwibaUI |
