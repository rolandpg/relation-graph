<template>
    <div
            v-show="options.editingReferenceLine.show"
            class="rg-editing-referline"
    >
        <div
                v-show="options.editingReferenceLine.directionV"
                class="rg-referline rg-referline-v"
                :style="{
                  transform: `translate(var(--rg-refer-offset), 0px) translate(${options.editingReferenceLine.v_x}px, ${options.editingReferenceLine.v_y}px)`,
                  height: options.editingReferenceLine.v_height + 'px'
                }"
        >
            <div class="referline">
                <div v-if="showText !== false">{{ Math.round(options.editingReferenceLine.v_height) }}px</div>
            </div>
        </div>
        <div
                v-show="options.editingReferenceLine.directionH"
                class="rg-referline rg-referline-h"
                :style="{
                    transform: `translate(0px, var(--rg-refer-offset)) translate(${options.editingReferenceLine.h_x}px, ${options.editingReferenceLine.h_y}px)`,
                  width: options.editingReferenceLine.h_width + 'px'
                }"
        >
            <div class="referline">
                <div v-if="showText !== false">{{ Math.round(options.editingReferenceLine.h_width) }}px</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted} from "vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const props = defineProps<{
    showText?: boolean,
    adsorption?: boolean
}>();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
onMounted(() => {
    graphInstance.onReferenceLineMounted(props.adsorption);
});
onUnmounted(() => {
    graphInstance.onReferenceLineUnMounted();
});
</script>
