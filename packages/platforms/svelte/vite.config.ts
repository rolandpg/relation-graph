import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import {resolve} from "path";
import dts from 'vite-plugin-dts';
import pkg from '../../../package.json';
const entryCssImport = `import "./style.css";\n`;
const isSvelteRuntime = (id: string) => id === 'svelte' || id.startsWith('svelte/');
const injectEntryCssImport = () => ({
    name: 'inject-entry-css-import',
    renderChunk(code: string, chunk: { isEntry?: boolean; facadeModuleId?: string }, outputOptions: { format?: string }) {
        if (forWebComponent) return;
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
// 建立你的 banner 內容
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 * Repository: https://github.com/relation-graph/relation-graph
 */`;
const forWebComponent = process.env.npm_lifecycle_event === 'build-wc';
const externals = forWebComponent ? [] : isSvelteRuntime;
const outputConfigs = forWebComponent ? [
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
        globals: {},
        banner
    },
    {
        format: 'cjs',
        entryFileNames: 'relation-graph.cjs',
        exports: 'named',
        banner
    }
] : [
    {
        format: 'es',
        entryFileNames: 'relation-graph.mjs',
        exports: 'named',
        banner
    },
    {
        format: 'cjs',
        entryFileNames: 'relation-graph.cjs',
        exports: 'named',
        banner
    }
];

console.log('[vite] running script:', forWebComponent);
export default defineConfig({
    plugins: [
        svelte({
            compilerOptions: {
                customElement: forWebComponent, // 确保这里也开启了
            }
        }),
        injectEntryCssImport(),
        forWebComponent ? undefined:dts({
            // tsconfigPath: resolve(__dirname, '../../../tsconfig.json'),
            // entryRoot: resolve(__dirname, './src/index.ts'),
            // 指定输出目录，默认为 'dist'
            outDir: resolve(__dirname, './dd'),
            // 是否将类型声明打包成一个文件
            insertTypesEntry: true,
            // 解决 Vue 3 中 `defineExpose` 无法正确导出类型的问题
            copyDtsFiles: false
        }),
    ].filter(Boolean),
    build: {
        target: 'esnext',
        lib: {
            formats: forWebComponent ? ['es', 'umd', 'cjs'] : ['es', 'cjs'],
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, forWebComponent ? 'src/index.wc.ts' : 'src/index.ts'),
            name: 'RelationGraph',
            cssFileName: 'style',
            // the proper extensions will be added
            fileName: 'relation-graph'
        },
        outDir: resolve(__dirname, `../../../lib/${forWebComponent ? 'web-components' : 'svelte'}`),
        emptyOutDir: true,
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: externals,
            output: outputConfigs,
        },
    },
});
