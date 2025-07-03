import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/cli.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  splitting: false,
  shims: true,
  dts: false,
  minify: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
