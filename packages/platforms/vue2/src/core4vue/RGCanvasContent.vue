<template>
    <div class="rg-single-graph">
        <RGCanvasContent4Lines
                :showEasyView="showEasyView"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :checked-line-id="checkedLineId"
                :graph-instance-id="graphInstanceId"
        >
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
        </RGCanvasContent4Lines>
        <div class="rg-nodes-container-wrapper">
            <RGCanvasContent4Nodes
                    v-if="!showEasyView"
                    :default-expand-holder-position="defaultExpandHolderPosition"
                    :draggingNodeId="draggingNodeId"
                    :checkedNodeId="checkedNodeId"
            >
                <template #node="nodeSlotProps">
                    <slot v-bind="nodeSlotProps" name="node"/>
                </template>
                <template #node-expand-button="nodeExpandButtonSlotProps">
                    <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
                </template>
            </RGCanvasContent4Nodes>
        </div>
        <RGCanvasContent4FakeLines
                :showEasyView="showEasyView"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :checked-line-id="checkedLineId"
                :graph-instance-id="graphInstanceId"
        >
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
        </RGCanvasContent4FakeLines>
        <RGCanvasContent4CreatingLine
                v-if="creatingLine"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :checked-line-id="checkedLineId"
        >
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
        </RGCanvasContent4CreatingLine>
    </div>
</template>

<script lang="ts">
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';
import RGCanvasContent4Lines from "./RGCanvasContent4Lines.vue";
import RGCanvasContent4Nodes from "./RGCanvasContent4Nodes.vue";
import RGCanvasContent4FakeLines from "./RGCanvasContent4FakeLines.vue";
import RGCanvasContent4CreatingLine from "./RGCanvasContent4CreatingLine.vue";

export default {
    name: 'RGCanvasContent',
    components: {
        RGCanvasContent4CreatingLine,
        RGCanvasContent4FakeLines,
        RGCanvasContent4Nodes, RGCanvasContent4Lines},
    data() {
        return {};
    },
    props: [
        'showEasyView',
        'creatingLine',
        'defaultExpandHolderPosition',
        'draggingNodeId',
        'checkedNodeId',
        'checkedLineId',
        'defaultLineTextOnPath'
    ],
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        },
        graphInstanceId() {
            return this.options.instanceId;
        }
    },
    created() {
        devLog('[RGCanvasContent created]');
    },
    mounted() {
        devLog('[RGCanvasContent mounted]');
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
