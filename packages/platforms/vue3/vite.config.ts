import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import pkg from '../../../package.json';

const entryCssImport = `import "./style.css";\n`;
const outputDir = resolve(__dirname, '../../../lib/vue3');
const buildTarget = process.env.RG_BUILD_TARGET === 'ssr' ? 'ssr' : 'client';
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 * Repository: https://github.com/seeksdream/relation-graph
 */`;

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

const sharedResolve = {
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  alias: {
    '@': resolve(__dirname, './src'),
  },
};

export default defineConfig({
  plugins: [
    vue(),
    buildTarget === 'client' ? injectEntryCssImport() : undefined,
    buildTarget === 'client' ? dts({
      outDir: resolve(__dirname, './dd'),
      insertTypesEntry: true,
      copyDtsFiles: false
    }) : undefined,
  ].filter(Boolean),
  resolve: sharedResolve,
  build: buildTarget === 'client' ? {
    lib: {
      formats: ['es', 'umd', 'cjs'],
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RelationGraph',
      cssFileName: 'style',
      fileName: 'relation-graph'
    },
    outDir: outputDir,
    emptyOutDir: true,
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: 'relation-graph.mjs',
          exports: 'named',
          banner
        },
        {
          format: 'umd',
          name: 'RelationGraph',
          entryFileNames: 'relation-graph.umd.js',
          exports: 'named',
          globals: {
            vue: 'Vue'
          },
          banner,
        },
        {
          format: 'cjs',
          entryFileNames: 'relation-graph.js',
          exports: 'named',
          banner,
        }
      ],
    },
  } : {
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'src/index.ssr.ts'),
      name: 'RelationGraph',
      fileName: 'relation-graph.ssr'
    },
    outDir: outputDir,
    emptyOutDir: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        format: 'es',
        entryFileNames: 'relation-graph.ssr.mjs',
        exports: 'named',
        banner
      },
    },
  },
});
