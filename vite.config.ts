import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      exclude: ['src/__tests__', 'src/dev.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        'fbsim-ui': resolve(__dirname, 'src/index.ts'),
        register: resolve(__dirname, 'src/register.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        '@whatsacomputertho/fbsim-core',
        '@whatsacomputertho/fbsim-core/web',
        '@whatsacomputertho/fbsim-core/node',
      ],
    },
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/register.ts', 'src/dev.ts'],
    },
  },
});
