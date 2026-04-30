<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon'
import type {RGUserEvent} from '../../../../../../types'
import RGCanvasContent from './RGCanvasContent.vue'
import RGEasyView from "./RGEasyView.vue";
import {useGraphInstance} from "../hooks/useGraphInstance";

const rgCanvasRef = ref<HTMLDivElement>()
const rgMapRef = ref<HTMLDivElement>()
const graphInstance = useGraphInstance();

const options = computed(() => {
    return graphInstance.dataStores.optionsRef.value;
});
const onDragStart = (e: RGUserEvent) => {
    graphInstance.onCanvasDragStart(e);
}
const contextmenu = (e: RGUserEvent) => {
    graphInstance.onContextmenu(e);
}
const mouseWheelListener = (e: WheelEvent) => {
    graphInstance.onMouseWheel(e);
}

const canvasSizeAndPosition = computed(() => {
    const optionsRef = graphInstance.dataStores.optionsRef.value;
    return {
        width: `${optionsRef.canvasSize.width}px`,
        height: `${optionsRef.canvasSize.height}px`,
        'background-color': 'transparent',
        'transform': `translate(${optionsRef.canvasOffset.x}px, ${optionsRef.canvasOffset.y}px) scale(${optionsRef.canvasZoom / 100},${options.value.canvasZoom / 100})`
    }
})
onMounted(() => {
    devLog('[RGCanvas mounted]')
    graphInstance.setCanvasDom(rgCanvasRef.value!)
    rgMapRef.value?.addEventListener('wheel', mouseWheelListener, { passive: false })
})
onBeforeUnmount(() => {
    rgMapRef.value?.removeEventListener('wheel', mouseWheelListener)
})
</script>
<template>
    <div
        ref="rgMapRef"
        class="rg-map"
        :class="[
                (options.canvasOpacity === 1 && 'rg-map-ready')
                 ]"
        @contextmenu.prevent="contextmenu($event)"
        @mousedown.left="onDragStart($event)"
        @touchstart="onDragStart($event)"
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
<style scoped>
</style>
