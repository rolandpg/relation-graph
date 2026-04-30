<template>
    <g v-if="config">
        <slot
                name="line"
                :line-config="config"
                :defaultLineTextOnPath="defaultLineTextOnPath"
                :graph-instance-id="graphInstanceId"
                :checked="checked"
        >
            <RGLineContent
                    :line-config="config"
                    :defaultLineTextOnPath="defaultLineTextOnPath"
                    :graph-instance-id="graphInstanceId"
                    :checked="checked"
            />
        </slot>
    </g>
</template>

<script lang="ts">
import RGLineContent from "./RGLineContent.vue";

export default {
    name: 'RGLinePeel',
    components: {RGLineContent},
    props: [
        'line',
        'defaultLineTextOnPath',
        'graphInstanceId',
        'checked'
    ],
    data() {
        return {};
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        config() {
            return this.line.isFakeLine ? this.graphInstance.generateFakeLineConfig(this.line) : this.graphInstance.generateLineConfig(this.line);
        }
    },
    watch: {},
    methods: {
        onLineClick(e) {
            this.graphInstance.onLineClick(this.lineConfig.line, e);
        }
    }
};
</script>

<style scoped>
</style>
