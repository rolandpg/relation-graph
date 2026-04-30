<script lang="ts" setup>
import {computed, onMounted} from 'vue'
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon'
import RGLineContent from "./RGLineContent.vue";
import {useGraphInstance} from "../hooks/useGraphInstance";
defineProps<{
    defaultLineTextOnPath?: boolean,
    checkedLineId?: string,
    graphInstanceId?: string,
}>()
const graphInstance = useGraphInstance();
const creatingLineConfig = computed(() => {
    // console.error('creatingLineConfig: computed!')
    return graphInstance.generateCreatingLineConfig(graphInstance.dataStores.optionsRef.value);
});
onMounted(() => {
    devLog('[RGCanvas mounted]')
})
</script>
<template>
    <div class="rg-lines-container rg-lines-container-el-lines">
        <div class="rg-linetext-container"/>
        <svg class="rg-lines-svg rg-lines-svg-el-lines" xmlns="http://www.w3.org/2000/svg">
            <slot name="line" :line-config="creatingLineConfig">
                <RGLineContent
                        :line-config="creatingLineConfig"
                        :defaultLineTextOnPath="defaultLineTextOnPath"
                        :graph-instance-id="graphInstanceId"
                />
            </slot>
        </svg>
    </div>
</template>
<style scoped>
</style>
