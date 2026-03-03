import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['./tests/setup.ts'],
    coverage: {
      provider:  'v8',
      reporter:  ['text', 'lcov', 'html'],
      thresholds: { branches: 80, functions: 80, lines: 80 },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@components': resolve(__dirname, 'components'),
      '@lib':        resolve(__dirname, 'lib'),
      '@types':      resolve(__dirname, 'types'),
    },
  },
});
