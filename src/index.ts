// @genesis/render
// JSON-to-UI mapping engine for @olwiba/ui components

export { GenesisPage } from './renderer';
export { defaultRegistry } from './registry';
export { nestedToFlat, isFlat } from './utils';

export type {
  Block,
  BlockSpec,
  NestedBlock,
  BlockRegistry,
  BlockRenderProps,
  EventHandler,
  ActionHandler,
} from './types';
