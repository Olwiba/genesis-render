import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@olwiba/cn', '@olwiba/ui', '@json-render/core', '@json-render/react', 'zod'],
  sourcemap: true,
  treeshake: true,
});
