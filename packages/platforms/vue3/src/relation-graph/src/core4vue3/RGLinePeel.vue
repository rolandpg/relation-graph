<script lang="ts" setup>
import {computed} from 'vue'
import {
    RGLinePeelProps,
} from '../../../../../../types';
import RGLineContent from "./RGLineContent.vue";
import {useGraphInstance} from "../hooks/useGraphInstance";

const {
    line,
    defaultLineTextOnPath,
    graphInstanceId,
    checked
} = defineProps<RGLinePeelProps>()
const graphInstance = useGraphInstance();

const config = computed(() => {
    return line.isFakeLine ? graphInstance.generateFakeLineConfig(line) : graphInstance.generateLineConfig(line);
})
</script>
<template>
    <g v-if="config">
        <slot
                name="line"
                :line-config="config"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :graph-instance-id="graphInstanceId"
                :checked="checked"
        >
            <RGLineContent
                    :line-config="config"
                    :defaultLineTextOnPath="defaultLineTextOnPath"
                    :graph-instance-id="graphInstanceId"
                    :checked="checked"
            />
        </slot>
    </g>
</template>
