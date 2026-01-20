// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
    host: true
  },

  adapter: node({
    mode: 'standalone'
  }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});