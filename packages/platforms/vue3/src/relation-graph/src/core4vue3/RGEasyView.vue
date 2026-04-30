<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { devLog } from '../../../../../../relation-graph-models/utils/RGCommon'
import {useGraphInstance} from "../hooks/useGraphInstance";
const graphInstance = useGraphInstance();
const $rgEasyCanvas = ref<HTMLCanvasElement>()
const options = computed(() => graphInstance.dataStores.optionsRef.value);
onMounted(() => {
  devLog('[RGEasyView mounted]');
    graphInstance.setEasyViewCanvas && graphInstance.setEasyViewCanvas($rgEasyCanvas.value!);
})
</script>
<template>
    <div class="rg-easy-view" :class="{'rg-easy-view-active':options.showEasyView}">
        <canvas ref="$rgEasyCanvas" style="width: 100%;height: 100%;" />
    </div>
</template>
