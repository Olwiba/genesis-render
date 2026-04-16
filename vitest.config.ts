import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@olwiba/genesis-render': resolve('./src/index.ts'),
      '@': resolve('./src'),
    },
  },
});
