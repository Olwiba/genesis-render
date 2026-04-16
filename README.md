# @olwiba/genesis-render

> olwibaUI adapter for `@json-render/react` - JSON-to-UI rendering for Genesis projects.

## Installation

```bash
bun add @olwiba/genesis-render @olwiba/ui @olwiba/cn
```

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
      type: 'GlassCard',
      props: { blur: 'md' },
      children: ['stat-1'],
    },
    'stat-1': {
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

## Advanced usage

### Cherry-pick components

```tsx
import { defineCatalog, defineRegistry, Renderer, StateProvider } from '@olwiba/genesis-render';
import { olwibaComponentDefinitions, olwibaComponents } from '@olwiba/genesis-render';

// Use the full catalog + registry, or pick specific components
const { registry } = defineRegistry(catalog, {
  components: {
    PageHeader: olwibaComponents.PageHeader,
    StatCard: olwibaComponents.StatCard,
  },
  actions: {
    navigate: (params) => { /* custom navigation */ },
  },
});
```

### AI prompt generation

```tsx
import { catalog } from '@olwiba/genesis-render';

// Generate a system prompt describing all available olwibaUI components.
// Includes Zod-validated prop schemas and descriptions for each component.
const systemPrompt = catalog.prompt();
```

## Available components

| Component | Description |
|-----------|-------------|
| PageHeader | Page title with optional description |
| Spinner | Loading spinner |
| GlassCard | Frosted glass card container |
| FeatureCard | Feature highlight card |
| StatCard | Stat metric with trend indicator |
| TestimonialCard | Testimonial quote with attribution |
| PricingCard | Pricing tier with feature list |
| ImageCard | Image card with optional overlay |
| EmptyState | Empty state placeholder |
| Kbd | Keyboard shortcut display |
| GradientBackground | Decorative gradient background |
| GridPattern | Decorative grid/dot pattern |
| NoiseOverlay | Noise texture overlay |
| GlowEffect | Ambient glow effect |
| CountUp | Animated number counter |
| FadeIn | Fade-in animation wrapper |

## Related

- [@json-render](https://json-render.dev) - The Generative UI framework (Vercel Labs)
- [@olwiba/ui](https://github.com/Olwiba/olwibaUI) - Component library
- [genesis](https://github.com/Olwiba/genesis) - Full template
