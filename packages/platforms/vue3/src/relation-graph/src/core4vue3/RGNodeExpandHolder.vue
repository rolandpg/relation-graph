<script lang="ts" setup>
import type {RGNode} from '../../../../../../types';
import {computed} from "vue";
import RGIcons from "./widgets/RGIcons.vue";

const props = defineProps<{
    node: RGNode
    expandOrCollapseNode: (e: MouseEvent) => void
    expandHolderPosition: string
}>();

const expandButtonClass = computed(() => {
    return props.node.expanded === false ? 'c-expanded' : 'c-collapsed'
})
</script>
<template>
    <div
            :class="['rg-node-expand-holder', ('c-expand-positon-'+expandHolderPosition)]"
    >
        <div
            class="rg-node-expand-button"
            :class="expandButtonClass"
            @click.stop="expandOrCollapseNode"
            @touchend.stop="expandOrCollapseNode"
        >
            <RGIcons v-if="node.expanded === false" iconName="icon-fangda" />
            <RGIcons v-else iconName="icon-suoxiao" />
        </div>
    </div>
</template>
