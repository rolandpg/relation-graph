<template>
    <div class="rg-nodes-container">
        <RGNodePeel v-for="thisNode in allNodeConfigList"
                    :key="thisNode.id"
                    :node-props="thisNode"
                    :default-expand-holder-position="defaultExpandHolderPosition"
                    :dragging="thisNode.id===draggingNodeId"
                    :checked="thisNode.id===checkedNodeId"
        >
            <template #node="nodeSlotProps">
                <slot v-bind="nodeSlotProps" name="node"/>
            </template>
            <template #node-expand-button="nodeExpandButtonSlotProps">
                <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
            </template>
        </RGNodePeel>
    </div>
</template>

<script lang="ts">
import RGNodePeel from './RGNodePeel.vue';
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';

export default {
    name: 'RGCanvasContent4Nodes',
    components: {RGNodePeel},
    data() {
        return {};
    },
    props: [
        'defaultExpandHolderPosition',
        'draggingNodeId',
        'checkedNodeId'
    ],
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        allNodeConfigList() {
            return this.graphInstance.getShouldRenderNodes();
        }
    },
    created() {
        devLog('[RGCanvasContent4Nodes created]');
    },
    mounted() {
        devLog('[RGCanvasContent4Nodes mounted]');
        this.init();
    },
    beforeDestroy() {
    },
    methods: {
        init() {
        },
    }
};
</script>
