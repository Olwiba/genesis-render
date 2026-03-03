# @genesis/render

> JSON-to-UI rendering engine for declarative page definitions.

## What This Is

Define pages as JSON schemas, render them as React components. Built for Genesis template projects.

## Package

```
npm: @genesis/render
registry: private (Verdaccio)
peer: @olwiba/ui
```

## Installation

```bash
# Configure Verdaccio in bunfig.toml first
bun add @genesis/render @olwiba/ui @olwiba/cn
```

## Components

- `GenesisPage` — Renders a full page from schema
- `GenesisSection` — Renders a page section
- `GenesisBlock` — Renders individual blocks

## Types

- `PageSchema` — Page definition
- `SectionSchema` — Section definition
- `BlockSchema` — Block definition
- `DataBinding` — Static/query/context data sources
- `ConditionalRender` — Show/hide logic

## Usage

```tsx
import { GenesisPage } from "@genesis/render";

const pageSchema = {
  title: "Dashboard",
  sections: [
    {
      id: "header",
      blocks: [
        { type: "PageHeader", props: { title: "Dashboard" } }
      ]
    }
  ]
};

function DashboardPage() {
  return <GenesisPage schema={pageSchema} />;
}
```

## Data Binding

```tsx
// Static data
{ data: { type: "static", value: { name: "John" } } }

// tRPC query
{ data: { type: "query", procedure: "user.getProfile" } }

// Context
{ data: { type: "context", path: "user.name" } }
```

## Related

- [@olwiba/ui](https://github.com/Olwiba/olwibaUI) — Component library
- [genesis](https://github.com/Olwiba/genesis) — Full template
