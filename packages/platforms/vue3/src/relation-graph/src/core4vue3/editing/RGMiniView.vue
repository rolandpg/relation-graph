<template>
    <div
            class="rg-miniview"
            :class="[
                    'rg-miniview-' + (position || 'br'),
                    $attrs.className
                    ]"
            ref="$rgMiniView"
            :style="{
                ...$attrs.style,
                '--miniview-width': width,
                '--miniview-height': height
            }"
    >
        <div class="rg-miniview-container">
            <canvas
                    ref="$rgMiniViewCanvas"
                    :class="{
                        'rg-mv-canvas-reset': options.miniViewVisibleHandle.emptyContent
                    }"
                    @click="onClickCanvas"
            />
            <div
                    class="rg-mv-visible-area"
                    @mousedown="onMouseDown"
                    :style="{
                        transform: `translate(${options.miniViewVisibleHandle.x}px, ${options.miniViewVisibleHandle.y}px)`,
                        // left: `${options.miniViewVisibleHandle.x}px`,
                        // top: `${options.miniViewVisibleHandle.y}px`,
                        width: options.miniViewVisibleHandle.width + 'px',
                        height: options.miniViewVisibleHandle.height + 'px'
                    }"
            ></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {RGUserEvent, RGWidgetPosition} from "../../../../types";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const props = defineProps<{
    position?: RGWidgetPosition,
    width?: string,
    height?: string,
    className?: string
}>(); // RGMiniViewProps
const $rgMiniView = ref<HTMLDivElement>();
const $rgMiniViewCanvas = ref<HTMLCanvasElement>();
onMounted(() => {
    graphInstance.onMiniViewMounted();
    graphInstance.setMiniViewCanvas($rgMiniViewCanvas.value!);
});
onUnmounted(() => {
    graphInstance.onMiniViewUnMounted();
});
const onMouseDown = (e: RGUserEvent) => {
    graphInstance.onVisibleViewHandleDragStart(e);
}
const onClickCanvas = (e: RGUserEvent) => {
    graphInstance.resetByVisiableView(e);
}
</script>
