import React, { Component, memo, useMemo, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import type { Block, BlockSpec, NestedBlock, BlockRegistry, ActionHandler, EventHandler } from './types';
import { nestedToFlat, isFlat } from './utils';
import { NavigateProvider, useRendererNavigate } from './context';
import { defaultRegistry } from './registry';

// ---------------------------------------------------------------------------
// BlockErrorBoundary — silently hides a broken block instead of crashing the page
// ---------------------------------------------------------------------------

class BlockErrorBoundary extends Component<
  { type: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { type: string; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[genesis-render] Render error in block <${this.props.type}>:`, error, info.componentStack);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

// ---------------------------------------------------------------------------
// resolveHandler
// ---------------------------------------------------------------------------

function resolveHandler(
  handler: EventHandler,
  ctx: {
    navigate: ReturnType<typeof useRendererNavigate>;
    onAction?: ActionHandler;
    data?: unknown;
  },
): void {
  if (Array.isArray(handler)) {
    handler.forEach((h) => resolveHandler(h, ctx));
    return;
  }
  if ('navigate' in handler) {
    ctx.navigate?.({ to: handler.navigate });
    return;
  }
  if ('handler' in handler) {
    ctx.onAction?.(handler.handler, handler.params);
  }
}

// ---------------------------------------------------------------------------
// BlockRenderer (internal)
// ---------------------------------------------------------------------------

interface BlockRendererProps {
  elementKey: string;
  spec: BlockSpec;
  registry: BlockRegistry;
  onAction?: ActionHandler;
  fallback?: ComponentType<{ type: string }>;
}

const BlockRenderer = memo(function BlockRenderer({
  elementKey,
  spec,
  registry,
  onAction,
  fallback: Fallback,
}: BlockRendererProps) {
  const element = spec.elements[elementKey];
  const navigate = useRendererNavigate();

  if (!element || element.visible === false) return null;

  const Component = registry[element.type];

  if (!Component) {
    if (Fallback) return <Fallback type={element.type} />;
    console.warn(`[genesis-render] No component registered for type "${element.type}"`);
    return null;
  }

  const emit = (event: string, data?: unknown) => {
    const handler = element.on?.[event];
    if (!handler) return;
    resolveHandler(handler, { navigate, onAction, data });
  };

  const children = element.children?.map((key) => (
    <BlockRenderer
      key={key}
      elementKey={key}
      spec={spec}
      registry={registry}
      onAction={onAction}
      fallback={Fallback}
    />
  ));

  return (
    <BlockErrorBoundary type={element.type}>
      <Component props={element.props} emit={emit}>
        {children}
      </Component>
    </BlockErrorBoundary>
  );
});

// ---------------------------------------------------------------------------
// GenesisPage (public)
// ---------------------------------------------------------------------------

export interface GenesisPageProps {
  /** Nested (authoring) or flat (runtime) block spec */
  spec: BlockSpec | NestedBlock;
  /** Named action callback — routes events to tRPC / custom logic */
  onAction?: ActionHandler;
  /** Extends the default registry — merged, not replaced */
  registry?: Partial<BlockRegistry>;
  /** Rendered when a type has no registered component */
  fallback?: ComponentType<{ type: string }>;
}

export function GenesisPage({ spec, onAction, registry, fallback }: GenesisPageProps) {
  const flatSpec = useMemo(() => (isFlat(spec) ? spec : nestedToFlat(spec)), [spec]);
  const mergedRegistry = useMemo(
    () => ({ ...defaultRegistry, ...registry }) as BlockRegistry,
    [registry],
  );

  return (
    <NavigateProvider>
      <BlockRenderer
        elementKey={flatSpec.root}
        spec={flatSpec}
        registry={mergedRegistry}
        onAction={onAction}
        fallback={fallback}
      />
    </NavigateProvider>
  );
}
