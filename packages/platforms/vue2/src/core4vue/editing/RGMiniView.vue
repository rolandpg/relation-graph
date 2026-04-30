<template>
    <div
            class="rg-miniview"
            :class="[
                'rg-miniview-' + position,
                $attrs.className
            ]"
            ref="rgMiniView"
            :style="{
                ...$attrs.style,
                '--miniview-width': width,
                '--miniview-height': height
            }"
    >
        <div class="rg-miniview-container">
            <canvas
                    ref="rgMiniViewCanvas"
                    :class="{
                      'rg-mv-canvas-reset': miniViewVisibleHandle.emptyContent
                      }"
                    @click="onClickCanvas"
            />
            <div
                    class="rg-mv-visible-area"
                    @mousedown="onMouseDown"
                    :style="{
                        transform: `translate(${miniViewVisibleHandle.x}px, ${miniViewVisibleHandle.y}px)`,
                        width: miniViewVisibleHandle.width + 'px',
                        height: miniViewVisibleHandle.height + 'px'
                    }"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
import {RGUserEvent} from "../../../../../types";

export default {
    name: 'RGMiniView',
    components: {},
    props: {
        position: {
            mustUseProp: false,
            default: 'br',
            type: String
        },
        width: {
            mustUseProp: false,
            type: String
        },
        height: {
            mustUseProp: false,
            type: String
        }
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        },
        miniViewVisibleHandle() {
            return this.options.miniViewVisibleHandle;
        }
    },
    data() {
        return {};
    },
    mounted() {
        this.graphInstance.onMiniViewMounted();
        this.graphInstance.setMiniViewCanvas(this.$refs.rgMiniViewCanvas);
    },
    methods: {
        onMouseDown(e: RGUserEvent) {
            this.graphInstance.onVisibleViewHandleDragStart(e);
        },
        onClickCanvas(e: RGUserEvent) {
            this.graphInstance.resetByVisiableView(e);
        }
    },
    beforeDestroy() {
        this.graphInstance.onMiniViewUnMounted();
    }
};
</script>

<style scoped>
</style>
