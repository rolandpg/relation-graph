<script lang="ts" setup>
import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue'
import {useGraphInstance} from '../hooks/useGraphInstance'
import type {RGNode} from '../../../../../../types';

const props = defineProps<{
    node: RGNode
}>()
const nodePeelRef = ref<HTMLElement>()
const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const borderColor = computed(() => {
    return props.node.borderColor
});
const nodeIsDragging = computed(() => {
    return options.value.draggingNodeId === props.node.id;
});
const borderWidth = computed(() => {
    return props.node.borderWidth === undefined ? undefined : (props.node.borderWidth + 'px');
});
const nodeWidth = computed(() => {
    return props.node.width ? (props.node.width + 'px') : undefined;
});
const nodeHeight = computed(() => {
    return props.node.height ? (props.node.height + 'px') : undefined;
});
const onDragStart = (e: MouseEvent | TouchEvent) => {
    graphInstance.onNodeDragStart(props.node, e);
}
onMounted(() => {
    graphInstance.addNodeResizeListener(nodePeelRef.value!, props.node)
})
onBeforeUnmount(() => {
    graphInstance.removeNodeResizeListener(nodePeelRef.value!)
})
</script>
<template>
    <div
            ref="nodePeelRef"
            :style="{
              'left':node.x + 'px',
              'top':node.y + 'px',
              '--rg-node-z-index':node.zIndex ? node.zIndex : undefined,
              '--rg-node-opacity': (node.opacity>1?node.opacity/100:node.opacity),
               'pointer-events': node.opacity === 0 ? 'none' : undefined,
               '--rg-node-color': node.color || options.defaultNodeColor,
               '--rg-node-font-color': node.fontColor,
               '--rg-node-font-size': node.fontSize ? (node.fontSize + 'px') : undefined,
               '--rg-node-border-width': borderWidth,
                '--rg-node-width': nodeWidth,
                '--rg-node-height': nodeHeight,
               '--rg-node-border-radius': node.borderRadius && (node.borderRadius + 'px'),
               '--rg-node-border-color': borderColor
            }"
            class="rg-node-peel"
            :class="[
                    (node.selected && 'rg-node-selected'),
                    (nodeIsDragging && 'rg-node-dragging'),
                    (node.id===options.checkedNodeId && 'rg-node-checked'),
                    'rg-node-shape-'+(node.nodeShape===undefined?1:node.nodeShape),
                    'rg-node-type-'+node.type,
                    node.className
                    ]"
            :data-id="node.id"
    >
        <div
                class="rg-node"
                @mousedown.left.stop="onDragStart($event)"
                @touchstart.stop="onDragStart($event)"
        >
            <slot>
                <div class="rg-node-text">
                    <span>{{node.text}}</span>
                </div>
            </slot>
        </div>
    </div>
</template>
