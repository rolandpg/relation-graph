<script lang="ts" setup>
import {computed} from 'vue'
import {RGLinePathProps} from '../../../../../../types';

import {useGraphInstance} from "../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const {lineConfig, linePathInfo, useTextOnPath, checked, graphInstanceId} = defineProps<RGLinePathProps>()
const emit = defineEmits<{
    (e: 'onLineClick', event: MouseEvent | TouchEvent): void;
}>()
const line = computed(() => {
    return lineConfig.line
})
const startArrowMarkerId = computed(() => {
    return graphInstance.getArrowMarkerId(lineConfig.line, true);
})
const endArrowMarkerId = computed(() => {
    return graphInstance.getArrowMarkerId(lineConfig.line, false);
})
const onPathTextStyle = computed(() => {
    return graphInstance.generateLineTextStyle4TextOnPath(lineConfig);
})
const lineWidth = computed(() => {
    return lineConfig.line.lineWidth ? (lineConfig.line.lineWidth + 'px') : undefined;
})
const pathId = computed(() => {
    return graphInstanceId + '-' +  lineConfig.line.id;
})
const onLineClick = (e: MouseEvent | TouchEvent) => {
    emit('onLineClick', e);
}
</script>
<template>
    <g
        :class="[
            'rg-line-peel',
            line.className,
            (line.selected && 'rg-line-selected'),
            ((line.disablePointEvent || line.opacity === 0) && 'rg-line-disable-events'),
            (checked && 'rg-line-checked')
          ]"
        :data-id="line.id"
        :style="{
            '--rg-line-width': lineWidth,
            '--rg-line-color': line.color,
            '--rg-line-opacity': line.opacity,
            '--rg-line-fontcolor': line.fontColor,
            '--rg-line-marker-end': endArrowMarkerId,
            '--rg-line-marker-start': startArrowMarkerId,
            ...(line.cssVars || {})
        }"
    >
        <path
                :d="linePathInfo.pathData"
                class="rg-line-bg"
                @touchstart="onLineClick"
                @click="onLineClick"
        />
        <path
                :id="pathId"
                :d="linePathInfo.pathData"
                class="rg-line"
                :class="[
                    line.dashType ? ('rg-line-dashtype-' + line.dashType) : undefined,
                    line.animation ? ('rg-line-anm-' + line.animation) : undefined,
                ]"
        />
        <g
                v-if="
                useTextOnPath &&
                onPathTextStyle
              "
        >
            <text
                    class="rg-line-text rg-line-text-on-path"
                    :dx="onPathTextStyle.textOffset.x + 'px'"
                    :dy="onPathTextStyle.textOffset.y + 'px'"
                    @touchstart="onLineClick"
                    @click="onLineClick"
            >
                <textPath :xlink:href="'#'+pathId"
                          :startOffset="onPathTextStyle.onPathStartOffset"
                          :text-anchor="onPathTextStyle.textAnchor"
                          method="align"
                          spacing="auto"> {{ onPathTextStyle.text }} </textPath>
            </text>
        </g>
        <slot />
    </g>
</template>
