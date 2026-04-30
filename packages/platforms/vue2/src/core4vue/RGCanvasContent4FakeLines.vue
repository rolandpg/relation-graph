<template>
    <div class="rg-lines-container rg-lines-container-el-lines">
        <div class="rg-linetext-container"/>
        <svg class="rg-lines-svg rg-lines-svg-el-lines" xmlns="http://www.w3.org/2000/svg">
            <RGGraphDefs :for-element-lines="true"/>
            <template  v-if="!showEasyView">
                <template v-for="line in allFakeLineConfigList">
                    <RGLinePeel
                            :key="line.id"
                            v-if="line.hidden !== true"
                            :line="line"
                            :defaultLineTextOnPath="defaultLineTextOnPath"
                            :checked="line.id === checkedLineId"
                            :graph-instance-id="graphInstanceId"
                    >
                        <template #line="lineSlotProps">
                            <slot v-bind="lineSlotProps" name="line"/>
                        </template>
                    </RGLinePeel>
                </template>
            </template>
        </svg>
    </div>
</template>

<script lang="ts">
import RGLinePeel from './RGLinePeel.vue';
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';
import RGGraphDefs from "./RGGraphDefs.vue";

export default {
    name: 'RGCanvasContent4FakeLines',
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
        allFakeLineConfigList() {
            return this.graphInstance.getShouldRenderFakeLines();
        }
    },
    created() {
        devLog('[RGCanvasContent4FakeLines created]');
    },
    mounted() {
        devLog('[RGCanvasContent4FakeLines mounted]');
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
