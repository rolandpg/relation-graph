<template>
    <div
        ref="relationGraphRef"
        :id="`relation-graph-ins-${graphOptions && graphOptions.instanceId}`"
        :class="graphClass"
        tabindex="1"
        :style="graphStyle"
    >
        <GraphXsToolBar v-if="graphOptions && graphOptions.showToolBar"/>
        <RGCanvas>
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
            <template #canvas-plug-behind>
                <slot name="canvas-plug-behind"/>
            </template>
            <template #canvas-plug-above>
                <slot name="canvas-plug-above"/>
            </template>
            <template #node="nodeSlotProps">
                <slot v-bind="nodeSlotProps" name="node"/>
            </template>
            <template #node-expand-button="nodeExpandButtonSlotProps">
                <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps"/>
            </template>
            <template #background>
                <slot name="background"/>
            </template>
        </RGCanvas>
        <GraphOperateStuff>
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
        </GraphOperateStuff>
        <div class="rg-graph-plugs">
            <div class="rg-view-slot">
                <slot name="view"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';
import RGCanvas from './RGCanvas.vue';
import GraphXsToolBar from './widgets/GraphXsToolBar.vue';
import GraphOperateStuff from './widgets/GraphOperateStuff.vue';
import {RGTips} from "../../../../relation-graph-models/utils/RGTips";
import type {RGOptionsFull} from "../../../../types";

export default {
    name: 'RelationGraphUI',
    components: {
        GraphOperateStuff, GraphXsToolBar, RGCanvas
    },
    props: {
        initialData: {
            mustUseProp: false,
            default: () => {
                return null;
            },
            type: Object
        }
    },
    inject: ['graphStore'],
    computed: {
        graphOptions(): RGOptionsFull {
            return this.graphStore.options;
        },
        graphClass(): string[] {
            const options = this.graphOptions;
            const classList = ['relation-graph'];
            if (options) {
                if (options.creatingLinePlot) {
                    classList.push('rg-creating-line');
                }
                if (options.dragEventAction === 'move') {
                    classList.push('rg-move-mode');
                }
                if (options.enableNodeXYAnimation) {
                    classList.push('rg-enable-node-xy-animation');
                }
                if (options.enableCanvasTransformAnimation) {
                    classList.push('rg-enable-canvas-animation');
                }
            }
            return classList;
        },
        graphStyle() {
            const options = this.graphOptions;
            if (!options) return { width: '100%', height: '100%' };
            return {
                width: '100%',
                height: options.viewHeight ? options.viewHeight : '100%',
                '--rg-checked-item-bg-color': options.checkedItemBackgroundColor,
                '--rg-background-color': options.backgroundColor,
                '--rg-node-color': options.defaultNodeColor,
                '--rg-node-border-color': options.defaultNodeBorderColor,
                '--rg-node-border-width': options.defaultNodeBorderWidth + 'px',
                '--rg-node-border-radius': options.defaultNodeBorderRadius + 'px',
                '--rg-line-color': options.defaultLineColor,
                '--rg-line-width': options.defaultLineWidth + 'px',
            };
        }
    },
    mounted() {
        // console.log('---------------------------RelationGraphUI mounted---------------------------');
        const graphInstance = this.graphStore.graphInstance;
        graphInstance.setDom(this.$refs.relationGraphRef);
        graphInstance.ready();
        if (this.initialData) {
            graphInstance.applyInitialData(this.initialData);
        }
    },
    methods: {
        async setJsonData() {
            throw new Error(RGTips.setJsonData4Vue2)
        }
    },
    beforeDestroy() {
        devLog('beforeDestroy:relation-graph');
        const graphInstance = this.graphStore.graphInstance;
        graphInstance.beforeUnmount();
    }
};
</script>
