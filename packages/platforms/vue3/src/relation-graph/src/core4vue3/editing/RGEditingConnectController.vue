<template>
    <div
            v-if="options.nodeConnectController.show"
            class="rg-editing-connect-ctrl"
            ref="connectBoxRef"
            :style="{
                transform: `translate(${options.nodeConnectController.x}px, ${options.nodeConnectController.y}px)`,
                width: options.nodeConnectController.width + 'px',
                height: options.nodeConnectController.height + 'px',
            }"
    >
        <slot :mouseUpOnJunctionPoint="mouseUpOnJunctionPoint"
              :mouseUpOnJunctionPointWithOffset="mouseUpOnJunctionPointWithOffset">
            <RGEditingConnectPoints :mouseUpOnJunctionPoint="mouseUpOnJunctionPoint"
                                    :mouseUpOnJunctionPointWithOffset="mouseUpOnJunctionPointWithOffset"/>
        </slot>
    </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import RGEditingConnectPoints from "./RGEditingConnectPoints.vue";
import {
    JsonLine, JsonLineLike,
    RGJunctionPoint, RGLineTarget,
    RGNode,
    RGPosition,
    RGUserEvent
} from "../../../../../../../types";
import {devLog} from "../../../../../../../relation-graph-models/utils/RGCommon";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const props = defineProps<{}>();
const connectBoxRef = ref();
const mouseUpOnJunctionPoint = (junctionPoint: RGJunctionPoint, $event: RGUserEvent) => {
    graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, $event, undefined, (fromNode, toNode, newLineJson) => {
        devLog('onLineVertexBeDropped:callback:', newLineJson);
        // graphInstance.value.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
    });
};
const mouseUpOnJunctionPointWithOffset = (junctionPoint: RGJunctionPoint, $event: RGUserEvent) => {
    graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, $event, connectBoxRef.value, (fromNode, toNode, newLineJson) => {
        devLog('onLineVertexBeDropped:callback:', newLineJson);
        // graphInstance.value.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
    });
};
</script>

<style scoped>
</style>
