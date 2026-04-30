<script lang="ts" setup>
import {computed, onMounted} from 'vue'
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon'
import RGGraphDefs from "./RGGraphDefs.vue";
import RGLinePeel from "./RGLinePeel.vue";
import {useGraphInstance} from "../hooks/useGraphInstance";
defineProps<{
    showEasyView: boolean,
    defaultLineTextOnPath?: boolean,
    checkedLineId?: string,
    graphInstanceId?: string,
}>()
const graphInstance = useGraphInstance();
const allLineConfigList = computed(() => {
    // console.error('allLineConfigList: computed!')
    return graphInstance.getShouldRenderLines(graphInstance.dataStores.shouldRenderLinesRef.value);
});
onMounted(() => {
    devLog('[RGCanvas mounted]')
})
</script>
<template>
    <div class="rg-lines-container rg-lines-container-normal-lines">
        <div class="rg-linetext-container"/>
        <svg class="rg-lines-svg"
             xmlns="http://www.w3.org/2000/svg">
            <RGGraphDefs />
            <template v-if="!showEasyView">
                <template v-for="thisLine in allLineConfigList" :key="thisLine.id">
                    <RGLinePeel
                            v-if="thisLine.hidden !== true"
                            :key="'l-'+thisLine.id"
                            :line="thisLine"
                            :defaultLineTextOnPath="defaultLineTextOnPath"
                            :checked="thisLine.id === checkedLineId"
                            :graph-instance-id="graphInstanceId"
                    >
                        <template #line="lineSlotProps">
                            <slot v-bind="lineSlotProps" name="line"/>
                        </template>
                    </RGLinePeel>
                </template>
            </template>
        </svg>
    </div>
</template>
<style scoped>
</style>
