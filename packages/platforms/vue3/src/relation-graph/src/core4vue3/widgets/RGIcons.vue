<template>
    <svg class="rg-icon" :class="className" viewBox="0 0 1024 1024" version="1.1"
         xmlns="http://www.w3.org/2000/svg" v-html="iconInfo.data">
    </svg>
</template>

<script lang="ts" setup>
import {RGIconsData} from "../../../../../../../relation-graph-models/utils/RGIconsData";
import {computed} from "vue";
const props = defineProps<{
    iconName: string,
    className?: string
}>();
const iconInfo = computed(() => {
    return RGIconsData[props.iconName];
})
</script>
