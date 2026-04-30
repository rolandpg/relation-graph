<template>
    <div
            ref="relationGraphRef"
            :id="`relation-graph-ins-${graphOptions && graphOptions.instanceId}`"
            :class="graphClass"
            tabindex="1"
            :style="graphStyle"
    >
        <RelationLinkerCanvas>
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
            <template #canvas-plug-behind>
                <slot name="canvas-plug-behind"/>
            </template>
        </RelationLinkerCanvas>
        <GraphOperateStuff>
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
import RelationLinkerCanvas from './RelationLinkerCanvas.vue';
import GraphOperateStuff from './widgets/GraphOperateStuff.vue';

export default {
    name: 'RelationLinkerUI',
    components: {
        RelationLinkerCanvas,
        GraphOperateStuff
    },
    props: {
        lines: {
            mustUseProp: true,
            default: () => {
                return [];
            },
            type: Array
        }
    },
    inject: ['graphStore'],
    computed: {
        graphOptions() {
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
    watch: {
        lines() {
            this.applyJsonData();
        }
    },
    mounted() {
        devLog('---------------------------RelationLinker mounted---------------------------');
        const graphInstance = this.graphStore.graphInstance;
        graphInstance.setDom(this.$refs.relationGraphRef);
        graphInstance.ready();
        this.applyJsonData();
    },
    updated() {
        devLog('---------------------------RelationLinker updated---------------------------');
    },
    methods: {
        applyJsonData() {
            if (this.lines) {
                const graphInstance = this.graphStore.graphInstance;
                graphInstance.clearGraph();
                graphInstance.addFakeLines(this.lines);
            }
        },
        getInstance() {
            return this.graphStore.graphInstance;
        }
    },
    beforeDestroy() {
        devLog('beforeDestroy:relation-graph');
        const graphInstance = this.graphStore.graphInstance;
        graphInstance.beforeUnmount();
    }
};
</script>
