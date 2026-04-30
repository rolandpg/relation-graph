<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon'
import RGCanvasContent from './RGCanvasContent.vue'
import {useGraphInstance} from "../hooks/useGraphInstance";

const rgCanvasRef = ref<HTMLDivElement>()
const graphInstance = useGraphInstance();

const options = computed(() => graphInstance.dataStores.optionsRef.value);
const canvasSizeAndPosition = computed(() => {
    return {
        'background-color': 'transparent',
        'text-wrap': 'unset',
        position: 'relative',
        width: '100%',
        height: 'fit-content',
    }
})
onMounted(() => {
    devLog('[RGCanvas mounted]')
    graphInstance.setCanvasDom(rgCanvasRef.value!)
})
</script>
<template>
    <div
        class="rg-map"
        :class="[
                (options.canvasOpacity === 1 && 'rg-map-ready')
                 ]"
    >
        <div :style="canvasSizeAndPosition" class="rg-map-canvas rg-canvas-behind">
            <div class="rg-canvas-slot rg-canvas-slot-behind" style="position: relative;pointer-events: all;user-select: text;">
                <slot name="canvas-behind"/>
            </div>
        </div>
        <div ref="rgCanvasRef" :style="canvasSizeAndPosition" class="rg-map-canvas" style="position: absolute;left:0px;top:0px;z-index: 9;">
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
            </RGCanvasContent>
        </div>
    </div>
</template>
<style scoped>
</style>
