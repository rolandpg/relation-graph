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

<script lang="ts">
import RGNodeExpandHolder from "./RGNodeExpandHolder.vue";

export default {
    name: 'RGNodePeel',
    components: {RGNodeExpandHolder},
    props: [
        'nodeProps',
        'defaultExpandHolderPosition',
        'dragging',
        'checked'
    ],
    data() {
        return {
            expanding: false
        };
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        showExpandHolder() {
            if (this.nodeProps.expandHolderPosition) {
                if (this.nodeProps.expandHolderPosition === 'hide') {
                    return false;
                } else {
                    return true;
                }
            }
            if (this.nodeProps.rgChildrenSize > 0) {
                if (this.defaultExpandHolderPosition && this.defaultExpandHolderPosition !== 'hide') {
                    return true;
                }
            } else {
                return false;
            }
        },
        borderColor() {
            return this.nodeProps.borderColor
        },
        borderWidth() {
            return this.nodeProps.borderWidth === undefined ? undefined : (this.nodeProps.borderWidth + 'px');
        },
        nodeWidth() {
            return this.nodeProps.width ? (this.nodeProps.width + 'px') : undefined;
        },
        nodeHeight() {
            return this.nodeProps.height ? (this.nodeProps.height + 'px') : undefined;
        },
        isVisibleNode() {
            // return RGNodesAnalytic.isVisibleNode(this.nodeProps);
            return this.nodeProps.rgCalcedVisibility;
        }
    },
    created() {
        // Vue.version
    },
    mounted() {
        this.graphInstance.addNodeResizeListener(this.$refs.nodePeelRef, this.nodeProps);
    },
    beforeDestroy() {
        this.graphInstance.removeNodeResizeListener(this.$refs.nodePeelRef);
    },
    methods: {
        async expandOrCollapseNode(e) {
            if (this.expanding) {
                return;
            }
            this.expanding = true;
            setTimeout(() => { // 防止手太快或者手表太灵敏
                this.expanding = false;
            }, 300);
            await this.graphInstance.expandOrCollapseNode(this.nodeProps, e);
        },
        onDragStart(e) {
            this.graphInstance.onNodeDragStart(this.nodeProps, e);
        }
    }
};
</script>

<style scoped>
</style>
