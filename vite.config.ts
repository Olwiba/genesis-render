import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { resolve } from 'path';

export default defineConfig(async ({ command }) => {
  const devPlugins = [];
  if (command === 'serve') {
    const { createDevBannerPlugin } = await import('@olwiba/dx');
    const { projectBanner } = await import('./site/project.config');
    devPlugins.push(createDevBannerPlugin(projectBanner));
  }

  return {
    server: {
      port: 3003,
    },
    resolve: {
      alias: {
        '@olwiba/genesis-render': resolve('./src/index.ts'),
      },
    },
    plugins: [
      ...devPlugins,
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
  };
});
