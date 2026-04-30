<script lang="ts" setup>
import { computed } from 'vue'
import {useGraphInstance} from "../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const props = defineProps<{
  forElementLines?: boolean
}>()
</script>
<template>
  <defs>
    <marker
      :id="options.instanceId+'-arrow-default'"
      :markerWidth="options.defaultLineMarker.markerWidth"
      :markerHeight="options.defaultLineMarker.markerHeight"
      :refX="options.defaultLineMarker.refX"
      :refY="options.defaultLineMarker.refY"
      markerUnits="userSpaceOnUse"
      orient="auto"
      :viewBox="options.defaultLineMarker.viewBox"
    >
      <path style="fill: context-stroke;" :d="options.defaultLineMarker.data" />
    </marker>
    <marker
      :id="options.instanceId+'-start-arrow-default'"
      :markerWidth="options.defaultLineMarker.markerWidth"
      :markerHeight="options.defaultLineMarker.markerHeight"
      :refX="options.defaultLineMarker.refX"
      :refY="options.defaultLineMarker.refY"
      markerUnits="userSpaceOnUse"
      orient="auto-start-reverse"
      :viewBox="options.defaultLineMarker.viewBox"
    >
      <path style="fill: context-stroke;" :d="options.defaultLineMarker.data"  />
    </marker>
    <slot />
  </defs>
</template>
<style scoped>
</style>
