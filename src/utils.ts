import type { Block, BlockSpec, NestedBlock } from './types';

// ---------------------------------------------------------------------------
// nestedToFlat
// ---------------------------------------------------------------------------

/**
 * Convert a nested block spec (authoring format) to the flat format used
 * internally by the renderer. Auto-generates keys (`el-0`, `el-1`, ...).
 */
export function nestedToFlat(nested: NestedBlock): BlockSpec {
  const elements: Record<string, Block> = {};
  let counter = 0;

  const walk = (node: NestedBlock): string => {
    const key = `el-${counter++}`;
    const { children: rawChildren, ...rest } = node;

    const childKeys: string[] = [];
    if (rawChildren) {
      for (const child of rawChildren) {
        childKeys.push(walk(child));
      }
    }

    elements[key] = {
      ...rest,
      children: childKeys.length > 0 ? childKeys : undefined,
    };

    return key;
  };

  const root = walk(nested);
  return { root, elements };
}

// ---------------------------------------------------------------------------
// isFlat
// ---------------------------------------------------------------------------

/**
 * Returns true if the value looks like a flat BlockSpec (has `root` and
 * `elements` keys) rather than a NestedBlock.
 */
export function isFlat(value: BlockSpec | NestedBlock): value is BlockSpec {
  return (
    typeof value === 'object' &&
    value !== null &&
    'root' in value &&
    'elements' in value
  );
}
