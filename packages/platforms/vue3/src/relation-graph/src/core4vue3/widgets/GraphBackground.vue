<template>
    <div v-show="forDisplay!==false" class="rg-background" ref="$backgroundRef">
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const props = withDefaults(defineProps<{
    forImage?: boolean,
    forDisplay?: boolean
}>(), {
    forImage: true,
    forDisplay: true
}); // RGWatermarkProps
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const $backgroundRef = ref();
onMounted(() => {
    graphInstance.setBackgroundDom($backgroundRef.value, props.forImage, props.forDisplay);
});
onUnmounted(() => {
    graphInstance.setBackgroundDom(null, props.forImage, props.forDisplay);
});
</script>
