<template>
    <div :class="['rg-node-expand-holder', ('c-expand-positon-' + expandHolderPosition)]">
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

<script lang="ts">
import RGIcons from "./widgets/RGIcons.vue";

export default {
    name: 'RGNodeExpandHolder',
    components: {RGIcons},
    props: {
        node: {
            type: Object,
            required: true
        },
        expandOrCollapseNode: {
            type: Function,
            required: true
        },
        expandHolderPosition: {
            type: String,
            required: true
        }
    },
    computed: {
        expandButtonClass() {
            return this.node.expanded === false ? 'c-expanded' : 'c-collapsed';
        }
    }
}
</script>
