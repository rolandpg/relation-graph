<template>
    <div
            ref="rgMapRef"
            :class="[
                    'rg-map',
                    (options.canvasOpacity === 1 && 'rg-map-ready')
            ]"
            @contextmenu.prevent="contextmenu"
            @mousedown.left="onDragStart"
            @touchstart="onDragStart"
    >
        <div class="rg-map-background">
            <slot name="background"/>
        </div>
        <div :style="canvasSizeAndPosition" class="rg-map-canvas rg-canvas-behind">
            <div class="rg-canvas-slot rg-canvas-slot-behind">
                <slot name="canvas-plug-behind"/>
            </div>
        </div>
        <RGEasyView/>
        <div ref="rgCanvasRef" :style="canvasSizeAndPosition" class="rg-map-canvas">
            <RGCanvasContent
                    :show-easy-view="options.showEasyView"
                    :creating-line="!!(options.creatingLinePlot && options.newLinkTemplate.fromNode)"
                    :default-expand-holder-position="options.defaultExpandHolderPosition"
                    :draggingNodeId="options.draggingNodeId"
                    :checkedNodeId="options.checkedNodeId"
                    :defaultLineTextOnPath="options.defaultLineTextOnPath"
                    :checked-line-id="options.checkedLineId"
                    :graph-instance-id="options.instanceId"
            >
                <template #line="lineSlotProps">
                    <slot v-bind="lineSlotProps" name="line"/>
                </template>
                <template #node="nodeSlotProps">
                    <slot v-bind="nodeSlotProps" name="node"/>
                </template>
                <template #node-expand-button="nodeExpandButtonSlotProps">
                    <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
                </template>
            </RGCanvasContent>
        </div>
        <div :style="canvasSizeAndPosition" class="rg-map-canvas rg-canvas-above">
            <div class="rg-canvas-slot rg-canvas-slot-above">
                <slot name="canvas-plug-above"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';
import RGCanvasContent from "./RGCanvasContent.vue";
import RGEasyView from "./RGEasyView.vue";

export default {
    name: 'RGCanvas',
    components: {RGEasyView, RGCanvasContent},
    data() {
        return {};
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        },
        canvasSizeAndPosition() {
            return {
                'width': `${this.options.canvasSize.width}px`,
                'height': `${this.options.canvasSize.height}px`,
                'background-color': 'transparent',
                'transform': `translate(${this.options.canvasOffset.x}px, ${this.options.canvasOffset.y}px) scale(${this.options.canvasZoom / 100},${this.options.canvasZoom / 100})`
            };
        }
    },
    watch: {},
    created() {
        devLog('[RGCanvas created]');
    },
    mounted() {
        devLog('[RGCanvas mounted]');
        this.graphInstance.setCanvasDom(this.$refs.rgCanvasRef);
        this.$refs.rgMapRef.addEventListener('wheel', this.mouseListener, { passive: false });
    },
    beforeDestroy() {
        this.$refs.rgMapRef?.removeEventListener('wheel', this.mouseListener);
    },
    methods: {
        onDragStart(e) {
            this.graphInstance.onCanvasDragStart(e);
        },
        contextmenu(e) {
            this.graphInstance.onContextmenu(e);
        },
        mouseListener(e) {
            this.graphInstance.onMouseWheel(e);
        }
    }
};
</script>
