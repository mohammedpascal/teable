import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react({
      devTarget: 'es2022',
    }),
    viteTsconfigPaths(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    // Plugin to handle openapi-snippet CommonJS module and generate.schema
    {
      name: 'exclude-openapi-snippet',
      enforce: 'pre',
      resolveId(id, importer) {
        // Intercept ALL openapi-snippet imports regardless of how they're imported
        if (id.includes('openapi-snippet')) {
          return '\0virtual:openapi-snippet';
        }
        // Intercept relative imports that resolve to openapi-snippet
        if (id === './openapi-snippet' || id === '../openapi-snippet' || id === '../../openapi-snippet') {
          return '\0virtual:openapi-snippet';
        }
        // Intercept generate.schema imports from @teable/openapi package
        if (id.includes('generate.schema') || id.endsWith('generate.schema.ts') || id.endsWith('generate.schema.js')) {
          // Only intercept if it's from the @teable/openapi package
          if (id.includes('@teable/openapi') || (importer && !importer.includes('node_modules'))) {
            return '\0virtual:generate-schema';
          }
        }
        // Also check if the resolved path would be openapi-snippet
        if (importer && importer.includes('generate.schema') && (id === './openapi-snippet' || id.includes('openapi-snippet'))) {
          return '\0virtual:openapi-snippet';
        }
      },
      load(id) {
        if (id === '\0virtual:openapi-snippet') {
          return `
            export const getEndpointSnippets = () => ({ snippets: [] });
            export default { getEndpointSnippets };
          `;
        }
        if (id === '\0virtual:generate-schema') {
          return `
            export async function getOpenApiDocumentation(config) {
              throw new Error('getOpenApiDocumentation is server-only and cannot be used in the browser');
            }
          `;
        }
      },
    },
  ],
  define: {
    'process.env': '{}',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Replace openapi-snippet with a stub to prevent CommonJS require() errors
      './openapi-snippet': path.resolve(__dirname, './src/lib/stubs/openapi-snippet.ts'),
      '../openapi-snippet': path.resolve(__dirname, './src/lib/stubs/openapi-snippet.ts'),
      '../../openapi-snippet': path.resolve(__dirname, './src/lib/stubs/openapi-snippet.ts'),
    },
  },
  server: {
    port: 3002,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: (id) => {
        // Exclude openapi-snippet from client bundle
        if (id.includes('openapi-snippet')) {
          return true;
        }
        return false;
      },
    },
  },
  optimizeDeps: {
    exclude: ['@teable/core', '@teable/openapi'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  ssr: {
    noExternal: ['@teable/openapi'],
  },
});
