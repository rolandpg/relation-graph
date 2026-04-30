<template>
    <div ref="rgCanvas" class="rg-lines-container rg-lines-container-normal-lines">
        <svg class="rg-lines-svg"
             xmlns="http://www.w3.org/2000/svg">
            <RGGraphDefs />
            <template  v-if="!showEasyView">
                <template v-for="thisLine in allLineConfigList">
                    <RGLinePeel
                            v-if="thisLine.hidden !== true"
                            :key="'l-'+thisLine.id"
                            :line="thisLine"
                            :defaultLineTextOnPath="defaultLineTextOnPath"
                            :checked="thisLine.id === checkedLineId"
                            :graph-instance-id="graphInstanceId"
                    >
                        <template #line="lineSlotProps">
                            <slot v-bind="lineSlotProps" name="line"/>
                        </template>
                    </RGLinePeel>
                </template>
            </template>
        </svg>
        <div class="rg-linetext-container"/>
    </div>
</template>

<script lang="ts">
import RGLinePeel from './RGLinePeel.vue';
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';
import RGGraphDefs from "./RGGraphDefs.vue";

export default {
    name: 'RGCanvasContent4Lines',
    components: {RGLinePeel, RGGraphDefs},
    data() {
        return {};
    },
    props: [
        'showEasyView',
        'defaultLineTextOnPath',
        'checkedLineId',
        'graphInstanceId'
    ],
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        allLineConfigList() {
            return this.graphInstance.getShouldRenderLines();
        }
    },
    created() {
        devLog('[RGCanvasContent4Lines created]');
    },
    mounted() {
        devLog('[RGCanvasContent4Lines mounted]');
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
