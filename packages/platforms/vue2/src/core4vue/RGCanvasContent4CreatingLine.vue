<template>
    <div class="rg-lines-container rg-lines-container-el-lines">
        <div class="rg-linetext-container"/>
        <svg class="rg-lines-svg rg-lines-svg-el-lines" xmlns="http://www.w3.org/2000/svg">
            <slot name="line" :line-config="creatingLineConfig">
                <RGLineContent
                    :line-config="creatingLineConfig"
                    :defaultLineTextOnPath="defaultLineTextOnPath"
                    :graph-instance-id="graphInstanceId"
                />
            </slot>
        </svg>
    </div>
</template>

<script lang="ts">
import RGLineContent from './RGLineContent.vue';
import {devLog} from '../../../../relation-graph-models/utils/RGCommon';

export default {
    name: 'RGCanvasContent4CreatingLine',
    components: {RGLineContent},
    data() {
        return {};
    },
    props: [
        'defaultLineTextOnPath',
        'checkedLineId',
        'graphInstanceId'
    ],
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        creatingLineConfig() {
            return this.graphInstance.generateCreatingLineConfig();
        }
    },
    created() {
        devLog('[RGCanvasContent4CreatingLine created]');
    },
    mounted() {
        devLog('[RGCanvasContent4CreatingLine mounted]');
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
