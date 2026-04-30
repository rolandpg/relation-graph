<template>
    <div
            v-show="show"
            class="rg-watermark"
            :class="['rg-watermark-' + (position || 'br')]"
            ref="$watermarkRef"
            :style="{
                '--watermark-width': width,
                '--watermark-height': height
            }"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {RGWidgetPosition} from "../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();

const props = withDefaults(defineProps<{
    forImage?: boolean,
    forDisplay?: boolean,
    position?: RGWidgetPosition,
    width?: string,
    height?: string,
}>(), {
    forImage: true,
    forDisplay: false,
    position: 'br'
}); // RGWatermarkProps
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const show = computed(() => {
    let visable = false;
    if (options.value.snapshotting) {
        if (props.forImage === false) {
            visable = false;
        } else {
            visable = true;
        }
    } else {
        if (props.forDisplay === true) {
            visable = true;
        } else {
            visable = false;
        }
    }
    ;
    return visable;
});
const $watermarkRef = ref();
onMounted(() => {
    graphInstance.setWatermarkDom($watermarkRef.value, props.forImage, props.forDisplay, props.position);
});
onUnmounted(() => {
    graphInstance.setWatermarkDom(null, props.forImage, props.forDisplay);
});
</script>
