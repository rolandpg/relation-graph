<template>
    <g
            :class="[
                'rg-line-peel', line.className,
                 (line.selected && 'rg-line-selected'),
                 ((line.disablePointEvent || line.opacity === 0) && 'rg-line-disable-events'),
                 (checked && 'rg-line-checked')
          ]"
            :data-id="line.id"
            :style="{
                '--rg-line-width': lineWidth,
                '--rg-line-color': line.color,
                '--rg-line-opacity': line.opacity,
                '--rg-line-fontcolor': line.fontColor,
                '--rg-line-marker-end': endArrowMarkerId,
                '--rg-line-marker-start': startArrowMarkerId,
                ...(line.cssVars || {})
            }"
    >
        <path
                :d="linePathInfo.pathData"
                class="rg-line-bg"
                @touchstart="onLineClick"
                @click="onLineClick"
        />
        <path
                :id="pathId"
                :d="linePathInfo.pathData"
                class="rg-line"
                :class="[
                    line.dashType ? ('rg-line-dashtype-' + line.dashType) : undefined,
                    line.animation ? ('rg-line-anm-' + line.animation) : undefined,
                ]"
        />
        <g
                v-if="useTextOnPath && onPathTextStyle"
        >
            <text
                    class="rg-line-text rg-line-text-on-path"
                    :dx="onPathTextStyle.textOffset.x + 'px'"
                    :dy="onPathTextStyle.textOffset.y + 'px'"
                    @touchstart="onLineClick"
                    @click="onLineClick"
            >
                <textPath :xlink:href="'#'+ pathId"
                          :startOffset="onPathTextStyle.onPathStartOffset"
                          :text-anchor="onPathTextStyle.textAnchor"
                          method="align"
                          spacing="auto"
                >
                    {{ onPathTextStyle.text }}
                </textPath>
            </text>
        </g>
        <slot />
    </g>
</template>

<script lang="ts">

export default {
    name: 'RGLinePath',
    props: [
        'lineConfig', 'linePathInfo', 'useTextOnPath', 'checked', 'graphInstanceId'
    ],
    data() {
        return {};
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        pathId() {
            return this.graphInstanceId + '-' +  this.lineConfig.line.id;
        },
        line() {
            return this.lineConfig.line;
        },
        lineWidth() {
            return this.lineConfig.line.lineWidth ? (this.lineConfig.line.lineWidth + 'px') : undefined;
        },
        startArrowMarkerId() {
            return this.graphInstance.getArrowMarkerId(this.lineConfig.line, true);
        },
        endArrowMarkerId() {
            return this.graphInstance.getArrowMarkerId(this.lineConfig.line, false);
        },
        onPathTextStyle() {
            return this.graphInstance.generateLineTextStyle4TextOnPath(this.lineConfig);
        },
    },
    watch: {},
    methods: {
        onLineClick(e) {
            this.$emit('onLineClick', e);
        }
    }
};
</script>

<style scoped>
</style>
