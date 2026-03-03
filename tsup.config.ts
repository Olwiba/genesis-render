import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@olwiba/cn', '@olwiba/ui', '@tanstack/react-router', 'zod'],
  sourcemap: true,
  treeshake: true,
});
