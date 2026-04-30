<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import RGNodeExpandHolder from './RGNodeExpandHolder.vue'
import type {RGNode} from '../../../../../../types';

import {useGraphInstance} from "../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const props = defineProps<{
    nodeProps: RGNode,
    defaultExpandHolderPosition?: string,
    dragging?: boolean,
    checked?: boolean,
}>()
const nodePeelRef = ref<HTMLElement>()
const borderColor = computed(() => {
    return props.nodeProps.borderColor
});
const borderWidth = computed(() => {
    return props.nodeProps.borderWidth === undefined ? undefined : (props.nodeProps.borderWidth + 'px');
});
const nodeWidth = computed(() => {
    return props.nodeProps.width ? (props.nodeProps.width + 'px') : undefined;
});
const nodeHeight = computed(() => {
    return props.nodeProps.height ? (props.nodeProps.height + 'px') : undefined;
});
const showExpandHolder = computed(() => {
    if (props.nodeProps.expandHolderPosition) {
        return props.nodeProps.expandHolderPosition !== 'hide';
    }
    return (props.defaultExpandHolderPosition && props.defaultExpandHolderPosition !== 'hide' && props.nodeProps.rgChildrenSize > 0)
});
const isVisibleNode = computed(() => {
    // return RGNodesAnalytic.isVisibleNode(props.nodeProps)
    return props.nodeProps.rgCalcedVisibility;
})
const expandOrCollapseNode = (e: MouseEvent) => {
    graphInstance.expandOrCollapseNode(props.nodeProps, e)
}
const onDragStart = (e: MouseEvent | TouchEvent) => {
    graphInstance.onNodeDragStart(props.nodeProps, e);
}
onMounted(() => {
    graphInstance.addNodeResizeListener(nodePeelRef.value!, props.nodeProps)
})
onBeforeUnmount(() => {
    graphInstance.removeNodeResizeListener(nodePeelRef.value!)
})
</script>
<template>
    <div
            v-show="isVisibleNode"
            ref="nodePeelRef"
            :style="{
              // 'left':nodeProps.x + 'px',
              // 'top':nodeProps.y + 'px',
              transform: `translate(${nodeProps.x}px, ${nodeProps.y}px)`,
              '--rg-node-z-index':nodeProps.zIndex ? nodeProps.zIndex : undefined,
              // 'opacity': (nodeProps.opacity>1?nodeProps.opacity/100:nodeProps.opacity),
               '--rg-node-color': nodeProps.color,
               '--rg-node-font-color': nodeProps.fontColor,
               '--rg-node-font-size': nodeProps.fontSize ? (nodeProps.fontSize + 'px') : undefined,
               '--rg-node-border-width': borderWidth,
               '--rg-node-border-radius': nodeProps.borderRadius && (nodeProps.borderRadius + 'px'),
               '--rg-node-border-color': borderColor,
                '--rg-node-width': nodeWidth,
                '--rg-node-height': nodeHeight,
                '--rg-node-opacity': nodeProps.opacity === undefined ? undefined : nodeProps.opacity,
            }"
            :class="[
                    'rg-node-peel',
                    (nodeProps.selected && 'rg-node-selected'),
                    (dragging && 'rg-node-dragging'),
                    (checked && 'rg-node-checked'),
                    ((nodeProps.disablePointEvent || nodeProps.opacity === 0) && 'rg-node-disable-events'),
                    'rg-node-shape-'+(nodeProps.nodeShape===undefined?1:nodeProps.nodeShape),
                    'rg-node-type-'+nodeProps.type,
                    nodeProps.className
            ]"
            :data-id="nodeProps.id"
    >
        <slot
                v-if="showExpandHolder"
                name="node-expand-button"
                :node="nodeProps"
                :expandOrCollapseNode="expandOrCollapseNode"
                :expandHolderPosition="(nodeProps.expandHolderPosition||defaultExpandHolderPosition)"
        >
            <RGNodeExpandHolder
                    :node="nodeProps"
                    :checked="checked"
                    :expandOrCollapseNode="expandOrCollapseNode"
                    :expandHolderPosition="(nodeProps.expandHolderPosition||defaultExpandHolderPosition)"
            />
        </slot>
        <div
                class="rg-node"
                @mousedown.left.stop="onDragStart"
                @touchstart.stop="onDragStart"
        >
            <slot name="node" :node="nodeProps" :checked="checked" :dragging="dragging">
                <div class="rg-node-text">
                    <span>{{nodeProps.text}}</span>
                </div>
            </slot>
        </div>
    </div>
</template>
