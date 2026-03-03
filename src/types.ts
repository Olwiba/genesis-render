import type { ComponentType, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Block spec types
// ---------------------------------------------------------------------------

export interface Block<P = Record<string, unknown>> {
  type: string;
  props: P;
  /** Child element keys — flat format only */
  children?: string[];
  visible?: boolean;
  on?: Record<string, EventHandler>;
}

/** Flat spec — runtime format used by the renderer */
export interface BlockSpec {
  root: string;
  elements: Record<string, Block>;
}

/** Nested block — authoring / AI generation format */
export interface NestedBlock {
  type: string;
  props: Record<string, unknown>;
  children?: NestedBlock[];
  visible?: boolean;
  on?: Record<string, EventHandler>;
}

// ---------------------------------------------------------------------------
// Event handler types
// ---------------------------------------------------------------------------

export type EventHandler =
  | { navigate: string }
  | { handler: string; params?: Record<string, unknown> }
  | EventHandler[];

// ---------------------------------------------------------------------------
// Component interface
// ---------------------------------------------------------------------------

/** Props passed to every block component by the renderer */
export interface BlockRenderProps<P = Record<string, unknown>> {
  props: P;
  children?: ReactNode;
  emit: (event: string, data?: unknown) => void;
}

/** Registry maps type name → React component */
export type BlockRegistry = Record<string, ComponentType<BlockRenderProps<any>>>;

/** Consumer's action callback — routes events to tRPC / custom logic */
export type ActionHandler = (name: string, params?: Record<string, unknown>) => void;
