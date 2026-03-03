import { describe, it, expect } from 'vitest';
import { nestedToFlat, isFlat } from '../src/utils';
import type { NestedBlock, BlockSpec } from '../src/types';

describe('nestedToFlat', () => {
  it('converts a single node with no children', () => {
    const nested: NestedBlock = {
      type: 'Heading',
      props: { text: 'Hello', level: 'h1' },
    };

    const spec = nestedToFlat(nested);

    expect(spec.root).toBe('el-0');
    expect(spec.elements['el-0']).toMatchObject({
      type: 'Heading',
      props: { text: 'Hello', level: 'h1' },
    });
    expect(spec.elements['el-0']?.children).toBeUndefined();
  });

  it('converts nested children into flat elements with child keys', () => {
    const nested: NestedBlock = {
      type: 'Stack',
      props: { direction: 'vertical' },
      children: [
        { type: 'Heading', props: { text: 'Title' } },
        { type: 'Button', props: { label: 'Click' } },
      ],
    };

    const spec = nestedToFlat(nested);

    expect(spec.root).toBe('el-0');
    expect(spec.elements['el-0']?.children).toEqual(['el-1', 'el-2']);
    expect(spec.elements['el-1']?.type).toBe('Heading');
    expect(spec.elements['el-2']?.type).toBe('Button');
  });

  it('handles deeply nested children', () => {
    const nested: NestedBlock = {
      type: 'Stack',
      props: {},
      children: [
        {
          type: 'Card',
          props: {},
          children: [{ type: 'Text', props: { text: 'Deep' } }],
        },
      ],
    };

    const spec = nestedToFlat(nested);

    expect(Object.keys(spec.elements)).toHaveLength(3);
    expect(spec.elements['el-0']?.children).toEqual(['el-1']);
    expect(spec.elements['el-1']?.children).toEqual(['el-2']);
    expect(spec.elements['el-2']?.type).toBe('Text');
  });

  it('preserves visible and on fields', () => {
    const nested: NestedBlock = {
      type: 'Button',
      props: { label: 'Go' },
      visible: false,
      on: { press: { navigate: '/home' } },
    };

    const spec = nestedToFlat(nested);

    expect(spec.elements['el-0']?.visible).toBe(false);
    expect(spec.elements['el-0']?.on).toEqual({ press: { navigate: '/home' } });
  });
});

describe('isFlat', () => {
  it('returns true for a flat BlockSpec', () => {
    const flat: BlockSpec = {
      root: 'el-0',
      elements: { 'el-0': { type: 'Text', props: {} } },
    };
    expect(isFlat(flat)).toBe(true);
  });

  it('returns false for a NestedBlock', () => {
    const nested: NestedBlock = { type: 'Text', props: {} };
    expect(isFlat(nested)).toBe(false);
  });
});
