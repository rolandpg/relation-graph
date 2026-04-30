<script lang="ts" setup>
import {computed, ref} from 'vue'
import {devLog} from '../../../../../../../relation-graph-models/utils/RGCommon'
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const showSettingPanel = ref(false)
const toggleSettingPanel = () => {
    showSettingPanel.value = !showSettingPanel.value
}
const printOptions = () => {
    graphInstance.printOptions();
}
const printData = () => {
    graphInstance.printData();
}
const enableDevlog = () => {
    graphInstance.enableDebugLog(!graphInstance.options.debug)
    devLog('debugLog:', graphInstance.options.debug)
}
</script>
<template>
    <div>
        <div :class="[]" class="rg-setting-panel-button" @click="toggleSettingPanel">
            Debug
        </div>
        <div v-if="showSettingPanel" :class="[]" class="rg-setting-panel">
            <div class="c-debug-tools-row">
                <button @click="printOptions">print options in console</button>
            </div>
            <div class="c-debug-tools-row">
                <button @click="printData">print json data in console</button>
            </div>
            <div class="c-debug-tools-row">debug log status: {{ options.debug }}
                <button @click="enableDevlog">{{ options.debug ? 'disable' : 'enable' }} debug log</button>
            </div>
            <slot />
        </div>
    </div>
</template>
