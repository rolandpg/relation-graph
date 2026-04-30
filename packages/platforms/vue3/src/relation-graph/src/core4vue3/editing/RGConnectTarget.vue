<template>
    <g
        v-if="forSvg"
            ref="targetRef"
            :class="[
                'rg-connect-ctl-handler',
                'rg-connect-target',
                attrs.className,
            ]"
            :style="attrs.style"
            :data-point="actualJunctionPoint"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp(actualJunctionPoint, $event)"
            @click="onClick"
    >
        <slot />
    </g>
    <div
        v-else
            ref="targetRef"
            :class="[
                'rg-connect-ctl-handler',
                'rg-connect-target',
                attrs.className,
            ]"
            :style="hostStyle"
            :data-point="actualJunctionPoint"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp(actualJunctionPoint, $event)"
            @click="onClick"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import {
    JsonLine,
    JsonLineLike, JsonLineTemplate,
    RGConnectTargetDomMode,
    RGInnerConnectTargetType,
    RGJunctionPoint, RGLineTarget,
    RGNode,
    RGPosition,
    RGUserEvent
} from "../../../../types";
import {computed, onMounted, onUnmounted, ref, useAttrs, watch} from "vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";
const graphInstance = useGraphInstance();
const attrs = useAttrs();

const props = defineProps<{
    junctionPoint?: RGJunctionPoint;
    targetId: string;
    targetType?: string;
    targetData?: any;
    lineTemplate?: JsonLineTemplate;
    disableDrop?: boolean;
    disableDrag?: boolean;
    forSvg?: boolean;
    domMode?: RGConnectTargetDomMode;
    measureSelector?: string;
    strictMeasureTarget?: boolean;
}>();
const emit = defineEmits<{
    onLineVertexBeDropped: [fromNode:RGNode|RGLineTarget|RGPosition, toNode:RGNode|RGLineTarget|RGPosition, newLineJson?:JsonLine]
    onDragConnectStart: [newLineTemplate:JsonLineLike, event:RGUserEvent]
    onDragConnectEnd: [fromNode:RGNode|RGLineTarget|RGPosition, toNode:RGNode|RGLineTarget|RGPosition, newLineJson?:JsonLine]
}>();
const targetRef = ref();
const actualJunctionPoint = computed(() => props.junctionPoint || RGJunctionPoint.border);
const normalizedDomMode = computed<RGConnectTargetDomMode>(() => (!props.forSvg && props.domMode === 'contents') ? 'contents' : 'wrap');
const hostStyle = computed(() => normalizedDomMode.value === 'contents' ? [attrs.style as any, {display: 'contents'}] : attrs.style);
const registerTarget = () => {
    if (!targetRef.value) {
        return;
    }
    graphInstance.registerConnectTarget({
        hostEl: targetRef.value,
        targetId: props.targetId,
        targetType: props.targetType || RGInnerConnectTargetType.NodePoint,
        junctionPoint: actualJunctionPoint.value,
        targetData: props.targetData,
        domMode: normalizedDomMode.value,
        measureSelector: props.measureSelector,
        strictMeasureTarget: props.strictMeasureTarget
    });
};
onMounted(() => {
    registerTarget();
});
watch(() => [props.targetId, props.targetType, props.junctionPoint, props.targetData, props.domMode, props.measureSelector, props.strictMeasureTarget, props.forSvg], ([targetId], oldValue) => {
    const oldTargetId = oldValue?.[0];
    if (oldTargetId && oldTargetId !== targetId) {
        graphInstance.unregisterConnectTarget(oldTargetId);
    }
    registerTarget();
}, {
    deep: true
});
onUnmounted(() => {
    graphInstance.unregisterConnectTarget(props.targetId);
});
const onClick = ($event: RGUserEvent) => {
    $event.stopPropagation();
}
const onMouseUp = (type: RGJunctionPoint, event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    if (props.disableDrop) {
        return;
    }
    graphInstance.onLineVertexBeDropped(type, event, undefined, (fromNode:RGNode, toNode:RGNode|RGPosition, newLineJson:JsonLine) => {
        emit('onLineVertexBeDropped', fromNode, toNode, newLineJson);
    });
};
const onMouseDown = ($event: MouseEvent) => {
    $event.stopPropagation();
    if (props.disableDrag) {
        return;
    }
    if (graphInstance.options.creatingLinePlot) {
        return;
    }
    const newLineJson: JsonLineTemplate = Object.assign({}, props.lineTemplate || {});
    const actualTargetType = graphInstance.getConnectTargetById(props.targetId)?.targetType || props.targetType || RGInnerConnectTargetType.NodePoint;
    if (!newLineJson.from) {
        newLineJson.from = props.targetId;
    }
    if (!newLineJson.fromType) {
        newLineJson.fromType = actualTargetType;
    }
    if (!newLineJson.fromJunctionPoint) {
        newLineJson.fromJunctionPoint = actualJunctionPoint.value;
    }
    emit('onDragConnectStart', newLineJson, $event);
    graphInstance.startCreateLineFromNode(null, newLineJson, $event, (from, to, newLine) => {
        emit('onDragConnectEnd', from, to, newLine);
    });
};
</script>

<style scoped>
</style>
