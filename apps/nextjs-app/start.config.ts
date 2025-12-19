import { defineConfig } from '@tanstack/start/config';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  vite: {
    plugins: [
      react({
        devTarget: 'es2022',
      }),
      viteTsconfigPaths(),
      svgr({
        svgrOptions: {},
      }),
    ],
    server: {
      port: 3002,
    },
  },
});

