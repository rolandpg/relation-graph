<script lang="ts" setup>
import RGCanvasContent4Nodes from "./RGCanvasContent4Nodes.vue";
import RGCanvasContent4FakeLines from "./RGCanvasContent4FakeLines.vue";
import RGCanvasContent4CreatingLine from "./RGCanvasContent4CreatingLine.vue";
import RGCanvasContent4Lines from "./RGCanvasContent4Lines.vue";
defineProps<{
    showEasyView: boolean
    creatingLine: boolean
    defaultExpandHolderPosition: string,
    draggingNodeId: string,
    checkedNodeId: string,
    checkedLineId: string,
    graphInstanceId: string,
    defaultLineTextOnPath?: boolean,
}>();
</script>
<template>
    <div class="rg-single-graph">
        <RGCanvasContent4Lines
                :showEasyView="showEasyView"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :checked-line-id="checkedLineId"
                :graph-instance-id="graphInstanceId"
                v-memo="[defaultLineTextOnPath, checkedLineId]"
        >
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
        </RGCanvasContent4Lines>
        <div class="rg-nodes-container-wrapper">
            <RGCanvasContent4Nodes
                    v-if="!showEasyView"
                    :default-expand-holder-position="defaultExpandHolderPosition"
                    :draggingNodeId="draggingNodeId"
                    :checkedNodeId="checkedNodeId"
                    v-memo="[draggingNodeId, checkedNodeId, defaultExpandHolderPosition]"
            >
                <template #node="nodeSlotProps">
                    <slot v-bind="nodeSlotProps" name="node"/>
                </template>
                <template #node-expand-button="nodeExpandButtonSlotProps">
                    <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
                </template>
            </RGCanvasContent4Nodes>
        </div>
        <RGCanvasContent4FakeLines
                :showEasyView="showEasyView"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :checked-line-id="checkedLineId"
                :graph-instance-id="graphInstanceId"
        >
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
        </RGCanvasContent4FakeLines>
        <RGCanvasContent4CreatingLine
                v-if="creatingLine"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :checked-line-id="checkedLineId"
        >
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
        </RGCanvasContent4CreatingLine>
    </div>
</template>
<style scoped>
</style>
