import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import pkg from '../../../package.json';
import dts from "vite-plugin-dts";
const entryCssImport = `import "./style.css";\n`;
const outputDir = resolve(__dirname, '../../../lib/react');
const buildTarget = process.env.RG_BUILD_TARGET === 'ssr' ? 'ssr' : 'client';

const injectEntryCssImport = () => ({
  name: 'inject-entry-css-import',
  renderChunk(code: string, chunk: { isEntry?: boolean; facadeModuleId?: string }, outputOptions: { format?: string }) {
    if (outputOptions.format && outputOptions.format !== 'es') return;
    if (!chunk.isEntry) return;
    if (!chunk.facadeModuleId?.endsWith('/src/index.ts')) return;
    if (code.includes(entryCssImport)) return;
    return {
      code: `${entryCssImport}${code}`,
      map: null
    };
  }
});

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 * Repository: https://github.com/relation-graph/relation-graph
 */`;
const externalDeps = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'node:crypto'
];

export default defineConfig({
  plugins: [
      react(),
      buildTarget === 'client' ? injectEntryCssImport() : undefined,
      buildTarget === 'client' ? dts({
        outDir: resolve(__dirname, './dd'),
        insertTypesEntry: true,
        copyDtsFiles: false
      }) : undefined,
  ].filter(Boolean),
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: buildTarget === 'client' ? {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RelationGraph',
      cssFileName: 'style',
      fileName: 'relation-graph',
      formats: ['es', 'umd', 'cjs'],
    },
    outDir: outputDir,
    emptyOutDir: true,
    rollupOptions: {
      external: externalDeps,
      output: [
        {
          format: 'es',
          entryFileNames: 'relation-graph.mjs',
          exports: 'named',
          banner
        },
        {
          format: 'umd',
          entryFileNames: 'relation-graph.umd.js',
          name: 'RelationGraph',
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime'
          },
          banner
        },
        {
          format: 'cjs',
          entryFileNames: 'relation-graph.js',
          exports: 'named',
          banner
        }
      ],
    },
  } : {
    lib: {
      entry: resolve(__dirname, 'src/index.ssr.ts'),
      name: 'RelationGraph',
      fileName: 'relation-graph.ssr',
      formats: ['es'],
    },
    outDir: outputDir,
    emptyOutDir: false,
    rollupOptions: {
      external: externalDeps,
      output: {
        format: 'es',
        entryFileNames: 'relation-graph.ssr.mjs',
        exports: 'named',
        banner
      },
    },
  },
})
