<template>
    <div v-if="options" class="rg-operate">
        <div class="rg-creating-container">
            <RGNodePeel v-if="options.creatingNodePlot && options.showTemplateNode"
                         :node-props="options.newNodeTemplate">
                <template #node>
                    <slot :node="options.newNodeTemplate" name="node"/>
                </template>
            </RGNodePeel>
            <div
                    v-if="options.creatingSelection"
                    class="rg-selection"
                    :style="{
                            transform: `translate(${options.selectionView.x}px, ${options.selectionView.y}px)`,
                            width: options.selectionView.width + 'px',
                            height: options.selectionView.height + 'px',
                      }"
            >

            </div>
        </div>
        <GraphLoading />
        <GraphMoveOperator/>
    </div>
</template>

<script lang="ts">
import RGNodePeel from "../RGNodePeel.vue";
import GraphMoveOperator from "./GraphMoveOperator.vue";
import GraphLoading from "./GraphLoading.vue";

export default {
    name: 'GraphOperateStuff',
    components: {GraphLoading, GraphMoveOperator, RGNodePeel},
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        }
    },
    mounted() {
    },
    methods: {}
};
</script>

<style scoped>
</style>
