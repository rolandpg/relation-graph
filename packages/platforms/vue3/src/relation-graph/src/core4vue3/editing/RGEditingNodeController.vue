<template>
    <div
            v-if="options.editingController.show"
            class="rg-editing-ctrl"
            :class="{ 'rg-ctrl-hide-border': props.hideBorderForSingleNode && options.editingController.nodes.length === 1 }"
            :style="{
              width: options.editingController.width + 'px',
              height: options.editingController.height + 'px',
              transform: `translate(${options.editingController.x}px, ${options.editingController.y}px)`
            }"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const props = withDefaults(defineProps<{
    hideBorderForSingleNode?: boolean
}>(), {
    hideBorderForSingleNode: false
});

const graphInstance = useGraphInstance();

const options = computed(() => graphInstance.dataStores.optionsRef.value);

</script>

<style scoped>
</style>
