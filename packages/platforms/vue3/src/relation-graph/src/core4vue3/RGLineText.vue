<script lang="ts" setup>
import {computed} from 'vue'
import {RGLineTextProps} from "../../../../../../types";
import {useGraphInstance} from "../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const {lineConfig, checked} = defineProps<RGLineTextProps>();
const line = computed(() => {
    return lineConfig?.line;
})
const lineTextContainer = computed(() => {
    if (line.value.isFakeLine) {
        return graphInstance.dataStores.textContainer4FakeLineRef.value;
    } else {
        return graphInstance.dataStores.textContainer4NormalRef.value;
    }
})
</script>
<template>
    <foreignObject v-if="line && lineTextContainer">
        <teleport :to="lineTextContainer">
            <div :class="[
                    'rg-line-peel',
                    line.className,
                    (checked && 'rg-line-checked'),
                    ((line.disablePointEvent || line.opacity === 0) && 'rg-line-disable-events'),
                    (line.selected && 'rg-line-selected')
                ]"
                :data-id="line.id"
                :style="{
                    '--rg-line-color': line.color,
                    '--rg-line-fontsize': (line.fontSize ? `${line.fontSize}px` : undefined),
                    '--rg-line-opacity': line.opacity,
                    '--rg-line-fontcolor': line.fontColor,
                    ...(line.cssVars || {})
                }"
            >
                <slot />
            </div>
        </teleport>
    </foreignObject>
    <g v-else>
        <text>Null-text-{{!!line}}-{{!!lineTextContainer}}</text>
    </g>
</template>
