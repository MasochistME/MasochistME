import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      include: '**/*.svg',
      svgrOptions: { exportType: 'named' },
    }),
  ],
  envPrefix: ['REACT_APP_'],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
  server: {
    host: process.env.HOST ?? true,
    port: Number(process.env.PORT ?? 3000),
    strictPort: true,
  },
  build: {
    outDir: 'build',
    target: 'es2021',
    sourcemap: true,
  },
});
