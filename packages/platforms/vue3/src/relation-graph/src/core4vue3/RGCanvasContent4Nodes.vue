<script lang="ts" setup>
import {computed, onMounted} from 'vue'
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon'
import RGNodePeel from './RGNodePeel.vue'
import {useGraphInstance} from "../hooks/useGraphInstance";
defineProps<{
    defaultExpandHolderPosition: string,
    draggingNodeId: string,
    checkedNodeId: string,
}>()
const graphInstance = useGraphInstance();
const allNodeConfigList = computed(() => {
    // console.error('allNodeConfigList: computed!')
    return graphInstance.getShouldRenderNodes(graphInstance.dataStores.shouldRenderNodesRef.value);
});
onMounted(() => {
    devLog('[RGCanvas mounted]')
})
</script>
<template>
    <div class="rg-nodes-container">
        <template v-for="thisNode in allNodeConfigList" :key="thisNode.id">
            <RGNodePeel
                    :node-props="thisNode"
                    :default-expand-holder-position="defaultExpandHolderPosition"
                    :dragging="thisNode.id===draggingNodeId"
                    :checked="thisNode.id===checkedNodeId"
            >
                <template #node="nodeSlotProps">
                    <slot v-bind="nodeSlotProps" name="node"/>
                </template>
                <template #node-expand-button="nodeExpandButtonSlotProps">
                    <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
                </template>
            </RGNodePeel>
        </template>
    </div>
</template>
<style scoped>
</style>
