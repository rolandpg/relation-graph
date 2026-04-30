
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const forWebComponent = process.env.npm_lifecycle_event === 'build-wc';
export default {
    preprocess: vitePreprocess(),
    compilerOptions: {
        // 关键配置：启用 Web Component 编译模式
        customElement: forWebComponent
    },
    kit: {
        alias: {
            $lib: 'src/lib',
            $models: '../../relation-graph-models'
        }
    }
};
