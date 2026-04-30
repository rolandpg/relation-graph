<template>
    <div
            class="rg-map"
            :class="[
                (options.canvasOpacity === 1 && 'rg-map-ready')
                 ]"
    >
        <div :style="canvasSizeAndPosition" class="rg-map-canvas rg-canvas-behind"
             style="position: relative;pointer-events: all;user-select: text;">
            <div class="rg-canvas-slot rg-canvas-slot-behind">
                <slot name="canvas-plug-behind"/>
            </div>
        </div>
        <div ref="rgCanvasRef" :style="canvasSizeAndPosition" class="rg-map-canvas"
             style="position: absolute;left:0px;top:0px;z-index: 9;">
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
                <template #line="{lineConfig}">
                    <slot :lineConfig="lineConfig" name="line"/>
                </template>
            </RGCanvasContent>
        </div>
    </div>
</template>

<script lang="ts">
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';
import RGCanvasContent from "./RGCanvasContent.vue";

export default {
    name: 'RelationLinkerCanvas',
    components: {RGCanvasContent},
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
                'background-color': 'transparent',
                'text-wrap': 'unset',
                position: 'relative',
                width: '100%',
                height: 'fit-content'
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
    },
    beforeDestroy() {
    },
    methods: {}
};
</script>

