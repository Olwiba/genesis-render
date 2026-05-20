# @olwiba/genesis-render

> olwibaUI adapter for `@json-render/react` - JSON-to-UI rendering for Genesis projects.

**[Docs](https://renderer.genesis.olwiba.com)**

## Installation

```bash
bun add @olwiba/genesis-render
```

Peer dependencies: `@olwiba/cn @olwiba/ui react react-dom zod`

## Quick start

```tsx
import { GenesisPage } from '@olwiba/genesis-render';

const spec = {
  root: 'header-1',
  elements: {
    'header-1': {
      type: 'PageHeader',
      props: { title: 'Dashboard', description: 'Welcome back' },
      children: ['card-1'],
    },
    'card-1': {
      type: 'StatCard',
      props: { label: 'Users', value: '1,234', delta: '+12%', trend: 'up' },
      children: [],
    },
  },
};

function DashboardPage() {
  return (
    <GenesisPage
      spec={spec}
      onAction={{ navigate: (params) => router.navigate(params.to) }}
    />
  );
}
```

## Advanced: cherry-pick components

```tsx
import { defineRegistry, catalog, olwibaComponents } from '@olwiba/genesis-render';

const { registry } = defineRegistry(catalog, {
  components: {
    PageHeader: olwibaComponents.PageHeader,
    StatCard: olwibaComponents.StatCard,
  },
  actions: {
    navigate: (params) => router.navigate(params.to),
  },
});
```

## Advanced: AI prompt generation

```tsx
import { catalog } from '@olwiba/genesis-render';

// Generates a system prompt describing all registered components,
// their Zod-validated prop schemas, and descriptions.
const systemPrompt = catalog.prompt();
```

## Related

- [@json-render](https://json-render.dev) - Generative UI framework
- [@olwiba/ui](https://github.com/Olwiba/olwibaUI) - Component library
- [@olwiba/cn](https://github.com/Olwiba/olwibaCN) - Component primitives
