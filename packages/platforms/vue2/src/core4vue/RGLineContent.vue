<template>
    <RGLinePath
            :lineConfig="lineConfig"
            :linePathInfo="linePathInfo"
            :useTextOnPath="useSvgTextPath"
            :graph-instance-id="graphInstanceId"
            :checked="checked"
            @onLineClick="onLineClick"
    >
        <RGLineText
                v-if="lineConfig.line.text && !useSvgTextPath"
                :lineConfig="lineConfig"
                :linePathInfo="linePathInfo"
                :checked="checked"
                @onLineClick="onLineClick"
        >
            <div
                :class="`rg-line-label ${useTextOnPath ? 'rg-line-label-on-path':''}`"
                :style="{
                    ...textStyle.cssStyles
                }"
                @touchstart="onLineClick"
                @click="onLineClick"
            >
                {{ textStyle.text }}
            </div>
        </RGLineText>
    </RGLinePath>
</template>

<script lang="ts">
import RGLinePath from "./RGLinePath";
import RGLineText from "./RGLineText";
import {RGLineShape} from "../../../../types";

export default {
    name: 'RGLineContent',
    components: {RGLinePath, RGLineText},
    props: [
        'lineConfig',
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
        useTextOnPath() {
            return this.lineConfig.line.useTextOnPath || this.defaultLineTextOnPath;
        },
        useSvgTextPath() {
            return this.useTextOnPath && (this.lineConfig.line.lineShape !== RGLineShape.StandardStraight);
        },
        linePathInfo() {
            return this.graphInstance.generateLinePath(this.lineConfig);
        },
        textStyle() {
            return this.graphInstance.generateLineTextStyle(this.lineConfig, this.linePathInfo)
        },
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
