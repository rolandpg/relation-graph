<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import RGCanvas from './RGCanvas.vue'
import GraphOperateStuff from './widgets/GraphOperateStuff.vue'
import GraphXsToolBar from "./widgets/GraphXsToolBar.vue";
import {useGraphInstance} from "../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const relationGraphRef$ = ref<HTMLElement>()
const options = computed(() => graphInstance.dataStores.optionsRef.value);
// console.error('Initial RelationGraph');
const graphReady = ref(false);
onMounted(() => {
    // 在元素上做些操作
    graphInstance.setDom(relationGraphRef$.value);
    graphReady.value = true;
})
onBeforeUnmount(() => {
    graphInstance.beforeUnmount();
})
// console.error('RelationView.vue');
onMounted(() => {
    // console.error('RelationView.vue mounted');
});
</script>
<template>
    <div ref="relationGraphRef$"
         :id="'relation-graph-ins-' + options?.instanceId"
         tabindex="1"
         :class="[
                'relation-graph',
                ((options && options.creatingLinePlot) ? 'rg-creating-line':''),
                ((options && options.dragEventAction === 'move') ? 'rg-move-mode':''),
                ((options && options.enableNodeXYAnimation) ? 'rg-enable-node-xy-animation':''),
                ((options && options.enableCanvasTransformAnimation) ? 'rg-enable-canvas-animation':'')
          ]"
         :style="{
              width: '100%',
              height : options?.viewHeight ? options?.viewHeight : '100%',
              opacity: graphReady ? 1 : 0,
              '--rg-checked-item-bg-color': options?.checkedItemBackgroundColor,
              '--rg-background-color': options?.backgroundColor,
              '--rg-node-color': options?.defaultNodeColor,
              '--rg-node-border-color': options?.defaultNodeBorderColor,
              '--rg-node-border-width': options?.defaultNodeBorderWidth + 'px',
              '--rg-node-border-radius': options?.defaultNodeBorderRadius + 'px',
              '--rg-line-color': options?.defaultLineColor,
              '--rg-line-width': options?.defaultLineWidth + 'px',
          }"
    >
        <template v-if="options && graphReady">
            <GraphXsToolBar v-if="options.showToolBar" />
            <RGCanvas>
                <template #node="nodeSlotProps">
                    <slot v-bind="nodeSlotProps" name="node"/>
                </template>
                <template #line="lineSlotProps">
                    <slot v-bind="lineSlotProps" name="line"/>
                </template>
                <template #canvas-plug-behind>
                    <slot name="canvas"/>
                    <slot />
                </template>
                <template #canvas-plug-above>
                    <slot name="canvas-above" />
                </template>
                <template #node-expand-button="nodeExpandButtonSlotProps">
                    <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
                </template>
                <template #background>
                    <slot name="background"/>
                </template>
            </RGCanvas>
            <GraphOperateStuff>
                <template #node="nodeSlotProps">
                    <slot v-bind="nodeSlotProps" name="node"/>
                </template>
            </GraphOperateStuff>
            <div class="rg-graph-plugs">
                <div class="rg-view-slot">
                    <slot name="view"/>
                </div>
            </div>
        </template>
    </div>
</template>
