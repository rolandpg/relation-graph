<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import RelationLinkerCanvas from './RelationLinkerCanvas.vue'
import GraphOperateStuff from './widgets/GraphOperateStuff.vue'

import {useGraphInstance} from "../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const relationGraphRef$ = ref<HTMLElement>()
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const graphReady = ref(false);
onMounted(() => {
    graphInstance.setDom(relationGraphRef$.value);
    graphReady.value = true;
})
onBeforeUnmount(() => {
    graphInstance.beforeUnmount();
})
</script>
<template>
    <div ref="relationGraphRef$"
         :id="'relation-graph-ins-' + options?.instanceId"
         tabindex="1"
         :class="[
                'relation-graph',
                ((options && options.creatingLinePlot) ? 'rg-creating-line':'')
          ]"
         :style="{
              width: '100%',
              height : 'fit-content',
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
            <RelationLinkerCanvas>
                <template #line="lineSlotProps">
                    <slot v-bind="lineSlotProps" name="line"/>
                </template>
                <template #canvas-behind>
                    <slot />
                </template>
            </RelationLinkerCanvas>
            <GraphOperateStuff>
            </GraphOperateStuff>
            <div class="rg-graph-plugs">
                <div class="rg-view-slot">
                    <slot name="view"/>
                </div>
            </div>
        </template>
    </div>
</template>
