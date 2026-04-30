<template>
    <div
            class="rg-move-operator"
            :class="{ 'rg-move-operator-active': canvasMoveMode }"
    >
        <div
                class="rg-move-touchpad"
                @mousedown="onTouchpadMouseDown"
                @touchstart="onTouchpadMouseDown"
        ></div>
    </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const canvasMoveMode = computed(() => {
    return options.value.canvasMoveMode;
})
const onTouchpadMouseDown = (e: KeyboardEvent) => {
    graphInstance!.startMoveCanvas(e, true);
};
</script>
