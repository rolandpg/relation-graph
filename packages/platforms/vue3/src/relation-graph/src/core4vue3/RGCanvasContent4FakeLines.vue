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
const allFakeLineConfigList = computed(() => {
    // console.error('allFakeLineConfigList: computed!')
    return graphInstance.getShouldRenderFakeLines(graphInstance.dataStores.shouldRenderFakeLinesRef.value);
});
onMounted(() => {
    devLog('[RGCanvas mounted]')
})
</script>
<template>
    <div class="rg-lines-container rg-lines-container-el-lines">
        <div class="rg-linetext-container"/>
        <svg class="rg-lines-svg rg-lines-svg-el-lines" xmlns="http://www.w3.org/2000/svg">
            <RGGraphDefs :for-element-lines="true"/>
            <template v-if="!showEasyView">
                <template v-for="line in allFakeLineConfigList" :key="line.id">
                    <RGLinePeel
                            v-if="line.hidden !== true"
                            :line="line"
                            :defaultLineTextOnPath="defaultLineTextOnPath"
                            :checked="line.id === checkedLineId"
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
