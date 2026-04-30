<template>
    <div
            class="rg-connect-source-handle"
            :class="[
                'rg-connect-ctl-handler',
                'rg-connect-target',
                $attrs.className,
            ]"
            :style="$attrs.style"
            @mousedown="onMouseDown($event)"
            @click="onClick"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>

import {
    JsonLine,
    JsonLineLike,
    JsonLineTemplate,
    RGLineTarget,
    RGNode,
    RGPosition,
    RGUserEvent
} from "../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";
const graphInstance = useGraphInstance();

const props = defineProps<{
    lineTemplate: JsonLineTemplate;
}>();
const emit = defineEmits<{
    onConnectStart: [newLineTemplate?:JsonLineLike, event?:RGUserEvent]
    onLineConnectEnd: [fromNode:RGNode|RGLineTarget, toNode:RGNode|RGLineTarget|RGPosition, newLineJson?:JsonLine]
}>();
const onClick = ($event: RGUserEvent) => {
    $event.stopPropagation();
}
const onMouseDown = ($event: RGUserEvent) => {
    $event.stopPropagation();
    emit('onConnectStart', props.lineTemplate, $event);
    graphInstance.startCreateLineFromNode(null, props.lineTemplate || {}, $event, (fromNode:RGNode|RGLineTarget, toNode:RGNode|RGLineTarget|RGPosition, newLineJson?:JsonLine) => {
        emit('onLineConnectEnd', fromNode, toNode, newLineJson);
        graphInstance.defaultLineConnectEndHandler(fromNode, toNode, newLineJson);
    });
}
</script>

<style scoped>
</style>
