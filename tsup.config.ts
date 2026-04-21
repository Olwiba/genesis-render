import { defineConfig } from 'tsup';
import { createTsupBannerHook } from '@olwiba/dx';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@olwiba/cn', '@olwiba/ui', '@json-render/core', '@json-render/react', 'zod'],
  sourcemap: true,
  treeshake: true,
  onSuccess: createTsupBannerHook({
    segments: [
      { text: 'genesis' },
      { text: 'render', colorHex: '#6366f1' },
    ],
  }),
});
