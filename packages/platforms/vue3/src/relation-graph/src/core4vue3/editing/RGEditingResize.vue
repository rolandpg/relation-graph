<template>
    <div class="rg-resize-ctl">
        <div v-if="options.editingController.width > 30 && (!disableResizeWidth && !disableResizeHeight)" class="rg-resize-ctl-handler rg-resize-ctl-tl"
             @mousedown="onMouseDown('tl', $event)"></div>
        <div v-if="options.editingController.width > 30 && (!disableResizeWidth && !disableResizeHeight)" class="rg-resize-ctl-handler rg-resize-ctl-tr"
             @mousedown="onMouseDown('tr', $event)"></div>
        <div v-if="options.editingController.width > 30 && (!disableResizeWidth && !disableResizeHeight)" class="rg-resize-ctl-handler rg-resize-ctl-bl"
             @mousedown="onMouseDown('bl', $event)"></div>
        <div v-if="(!disableResizeWidth && !disableResizeHeight)" class="rg-resize-ctl-handler rg-resize-ctl-br" @mousedown="onMouseDown('br', $event)"></div>
        <div v-if="(options.editingController.width > 60 || (disableResizeWidth)) && (!disableResizeHeight)" class="rg-resize-ctl-handler rg-resize-ctl-t"
             @mousedown="onMouseDown('t', $event)"></div>
        <div v-if="(options.editingController.width > 60 || (disableResizeWidth)) && (!disableResizeHeight)" class="rg-resize-ctl-handler rg-resize-ctl-b"
             @mousedown="onMouseDown('b', $event)"></div>
        <div v-if="(options.editingController.height > 60 || (disableResizeHeight)) && (!disableResizeWidth)" class="rg-resize-ctl-handler rg-resize-ctl-l"
             @mousedown="onMouseDown('l', $event)"></div>
        <div v-if="(options.editingController.height > 60 || (disableResizeHeight)) && (!disableResizeWidth)" class="rg-resize-ctl-handler rg-resize-ctl-r"
             @mousedown="onMouseDown('r', $event)"></div>
    </div>
</template>

<script lang="ts" setup>
import {
    RGResizeHandlePosition,
    RGUserEvent,
} from "../../../../types";
import {computed} from "vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const props = defineProps<{
    disableResizeWidth?: boolean,
    disableResizeHeight?: boolean,
}>();

const emit = defineEmits<{
    (e: 'beforeResizeStart'):void;
}>();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const onMouseDown = (type: RGResizeHandlePosition, $event: RGUserEvent) => {
    $event.stopPropagation();
    emit('beforeResizeStart');
    graphInstance.onResizeStart(type, $event);
}
</script>
