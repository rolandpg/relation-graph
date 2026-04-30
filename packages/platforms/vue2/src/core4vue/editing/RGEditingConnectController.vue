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

<script lang="ts">
import RGEditingConnectPoints from "./RGEditingConnectPoints.vue";
import {JsonLine, RGJunctionPoint, RGNode, RGPosition, RGUserEvent} from "../../../../../types";
import {devLog} from "../../../../../relation-graph-models/utils/RGCommon";

export default {
    name: 'RGEditingConnectController',
    components: {RGEditingConnectPoints},
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        }
    },
    data() {
        return {};
    },
    methods: {
        mouseUpOnJunctionPoint(junctionPoint: RGJunctionPoint, $event: RGUserEvent) {
            this.graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, $event, undefined, (fromNode: RGNode, toNode: RGNode | RGPosition, newLineJson?: JsonLine) => {
                devLog('onLineVertexBeDropped:callback:', newLineJson);
                // graphInstance.value.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
            });
        },
        mouseUpOnJunctionPointWithOffset(junctionPoint: RGJunctionPoint, $event: RGUserEvent) {
            this.graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, $event, this.$refs.connectBoxRef.value, (fromNode: RGNode, toNode: RGNode | RGPosition, newLineJson?: JsonLine) => {
                devLog('onLineVertexBeDropped:callback:', newLineJson);
                // graphInstance.value.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
            });
        }
    }
};
</script>

<style scoped>
</style>
