<template>
    <foreignObject v-if="line" style="display: none;">
        <div
            ref="teleportContent"
            :class="[
                'rg-line-peel',
                line.className,
                (checked && 'rg-line-checked'),
                ((line.disablePointEvent || line.opacity === 0) && 'rg-line-disable-events'),
                (line.selected && 'rg-line-selected')
              ]"
            :data-id="line.id"
            :style="lineStyle"
        >
            <slot />
        </div>
    </foreignObject>
</template>

<script>
// 假设你有一个 mixin 或 inject 来获取 graphInstance
// 如果没有，你需要根据你的 Vue2 项目架构获取它
// import { getGraphInstance } from '../utils/graph';

export default {
    name: 'RGLineText',
    props: {
        lineConfig: {
            type: Object,
            required: true
        },
        checked: {
            type: Boolean,
            default: false
        }
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        line() {
            return this.lineConfig && this.lineConfig.line;
        },
        // 计算目标容器
        targetContainer() {
            if (!this.graphInstance || !this.line) return null;
            return this.graphInstance.getLineTextContainer(this.line);
        },
        // 计算样式，保持模板整洁
        lineStyle() {
            if (!this.line) return {};
            return {
                '--rg-line-color': this.line.color,
                '--rg-line-fontsize': this.line.fontSize ? `${this.line.fontSize}px` : undefined,
                '--rg-line-opacity': this.line.opacity,
                '--rg-line-fontcolor': this.line.fontColor,
                ...(this.line.cssVars || {})
            };
        }
    },
    // watch: {
    //     // 监听容器变化，如果容器变了（极其少见，但为了健壮性），需要重新挂载
    //     targetContainer(newContainer, oldContainer) {
    //         if (newContainer !== oldContainer) {
    //             this.removeContent();
    //             this.appendContent();
    //         }
    //     }
    // },
    mounted() {
        // 组件挂载后，立即将内容移动到目标容器
        this.appendContent();
    },
    beforeDestroy() {
        // 组件销毁前，清理 DOM，防止内存泄漏或残留节点
        this.removeContent();
    },
    methods: {
        appendContent() {
            const content = this.$refs.teleportContent;
            const container = this.targetContainer;

            // 核心逻辑：原生 DOM 移动
            if (content && container) {
                container.appendChild(content);
            }
        },
        removeContent() {
            const content = this.$refs.teleportContent;
            // 检查 content 是否还存在且有父节点（即是否已被挂载到某处）
            if (content && content.parentNode) {
                content.parentNode.removeChild(content);
            }
        }
    }
};
</script>
