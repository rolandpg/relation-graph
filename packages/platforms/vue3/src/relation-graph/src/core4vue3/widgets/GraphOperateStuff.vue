<script lang="ts" setup>
import {computed} from 'vue'
import RGNodePeel from '../RGNodePeel.vue'
import GraphMoveOperator from "./GraphMoveOperator.vue";
import GraphLoading from "./GraphLoading.vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();

const options = computed(() => graphInstance.dataStores.optionsRef.value);
</script>
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
        <GraphMoveOperator/>
        <GraphLoading/>
    </div>
</template>
