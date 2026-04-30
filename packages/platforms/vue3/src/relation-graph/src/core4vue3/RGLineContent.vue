<script lang="ts" setup>
import {computed} from 'vue'
import {RGLineShape, RGLineSlotProps} from '../../../../../../types';
import RGLineText from "./RGLineText.vue";
import RGLinePath from "./RGLinePath.vue";
import {useGraphInstance} from "../hooks/useGraphInstance";
const graphInstance = useGraphInstance();
const {
    lineConfig,
    defaultLineTextOnPath,
    graphInstanceId,
    checked
} = defineProps<RGLineSlotProps>()
const linePathInfo = computed(() => {
    return graphInstance.generateLinePath(lineConfig)
});
const textStyle = computed(() => graphInstance.generateLineTextStyle(lineConfig, linePathInfo.value));
const useTextOnPath = computed(() => {
    return (lineConfig.line.useTextOnPath || defaultLineTextOnPath);
})
const useSvgTextPath = computed(() => {
    return useTextOnPath.value && (lineConfig.line.lineShape !== RGLineShape.StandardStraight);
})
const onLineClick = (e: MouseEvent | TouchEvent) => {
    graphInstance.onLineClick(lineConfig.line, e)
}
</script>
<template>
    <RGLinePath
            :lineConfig="lineConfig"
            :linePathInfo="linePathInfo"
            :useTextOnPath="useSvgTextPath"
            :graph-instance-id="graphInstanceId"
            :checked="checked"
            @onLineClick="onLineClick"
    />
    <RGLineText
            v-if="lineConfig.line.text && !useSvgTextPath"
            :lineConfig="lineConfig"
            :linePathInfo="linePathInfo"
            :checked="checked"
    >
        <div
                :class="`rg-line-label ${useTextOnPath ? 'rg-line-label-on-path':''}`"
                :style="{
                    ...textStyle.cssStyles
                }"
                @touchstart="onLineClick"
                @click="onLineClick"
        >
            {{ textStyle.text }}
        </div>
    </RGLineText>
</template>
