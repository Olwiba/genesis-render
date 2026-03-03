import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3003,
  },
  resolve: {
    alias: {
      '@genesis/render': resolve('./src/index.ts'),
    },
  },
  plugins: [
    mdx(await import('./source.config')),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'site',
    }),
    react(),
  ],
});
