import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    env: {
      NODE_ENV: 'test',
    },
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
  },
})
