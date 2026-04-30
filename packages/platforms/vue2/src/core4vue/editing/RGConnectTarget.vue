<template>
    <g
        v-if="forSvg"
            class="rg-connect-ctl-handler rg-connect-target"
            :class="[
                'rg-connect-ctl-handler',
                'rg-connect-target',
                $attrs.className,
            ]"
            :style="$attrs.style"
            :data-point="actualJunctionPoint"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp(actualJunctionPoint, $event)"
            @click="onClick"
    >
        <slot/>
    </g>
    <div
        v-else
            class="rg-connect-ctl-handler rg-connect-target"
            :class="[
                'rg-connect-ctl-handler',
                'rg-connect-target',
                $attrs.className,
            ]"
            :style="resolvedHostStyle"
            :data-point="actualJunctionPoint"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp(actualJunctionPoint, $event)"
            @click="onClick"
    >
        <slot/>
    </div>
</template>

<script lang="ts">
import {
    JsonLine,
    JsonLineTemplate,
    RGConnectTargetDomMode,
    RGInnerConnectTargetType,
    RGJunctionPoint,
    RGNode,
    RGPosition
} from "../../../../../types";

export default {
    name: 'RGConnectTarget',
    components: {},
    props: {
        junctionPoint: {
            mustUseProp: false,
            default: 'lr',
            type: String
        },
        targetId: {
            mustUseProp: true,
            type: String
        },
        targetType: {
            mustUseProp: false,
            type: String
        },
        targetData: {
            mustUseProp: false,
            type: Object
        },
        lineTemplate: {
            mustUseProp: false,
            type: Object
        },
        disableDrop: {
            mustUseProp: false,
            type: Boolean
        },
        forSvg: {
            mustUseProp: false,
            type: Boolean
        },
        disableDrag: {
            mustUseProp: false,
            type: Boolean
        },
        domMode: {
            mustUseProp: false,
            type: String as () => RGConnectTargetDomMode
        },
        measureSelector: {
            mustUseProp: false,
            type: String
        },
        strictMeasureTarget: {
            mustUseProp: false,
            type: Boolean
        },
    },
    inject: ['graphStore'],
    emits: ['onLineVertexBeDropped', "onDragConnectStart", "onDragConnectEnd"],
    computed: {
        RGInnerConnectTargetType() {
            return RGInnerConnectTargetType
        },
        RGJunctionPoint() {
            return RGJunctionPoint
        },
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        },
        actualJunctionPoint() {
            return this.junctionPoint || RGJunctionPoint.border;
        },
        normalizedDomMode(): RGConnectTargetDomMode {
            return !this.forSvg && this.domMode === 'contents' ? 'contents' : 'wrap';
        },
        resolvedHostStyle() {
            return this.normalizedDomMode === 'contents' ? [this.$attrs.style, {display: 'contents'}] : this.$attrs.style;
        }
    },
    data() {
        return {};
    },
    mounted() {
        this.registerCurrentTarget();
    },
    beforeUnmount() {
        this.graphInstance.unregisterConnectTarget(this.targetId);
    },
    watch: {
        targetId(newTargetId, oldTargetId) {
            if (oldTargetId && oldTargetId !== newTargetId) {
                this.graphInstance.unregisterConnectTarget(oldTargetId);
            }
            this.registerCurrentTarget();
        },
        targetType() {
            this.registerCurrentTarget();
        },
        junctionPoint() {
            this.registerCurrentTarget();
        },
        domMode() {
            this.registerCurrentTarget();
        },
        measureSelector() {
            this.registerCurrentTarget();
        },
        strictMeasureTarget() {
            this.registerCurrentTarget();
        },
        forSvg() {
            this.registerCurrentTarget();
        },
        targetData: {
            deep: true,
            handler() {
                this.registerCurrentTarget();
            }
        }
    },
    methods: {
        registerCurrentTarget() {
            this.graphInstance.registerConnectTarget({
                hostEl: this.$el,
                targetId: this.targetId,
                targetType: this.targetType || RGInnerConnectTargetType.NodePoint,
                junctionPoint: this.actualJunctionPoint,
                targetData: this.targetData,
                domMode: this.normalizedDomMode,
                measureSelector: this.measureSelector,
                strictMeasureTarget: this.strictMeasureTarget
            });
        },
        onClick($event) {
            $event.stopPropagation();
        },
        onMouseDown($event) {
            $event.stopPropagation();
            if (this.disableDrag) {
                return;
            }
            if (this.graphInstance.options.creatingLinePlot) {
                return;
            }
            const newLineJson: JsonLineTemplate = Object.assign({}, this.lineTemplate || {});
            const actualTargetType = this.graphInstance.getConnectTargetById(this.targetId)?.targetType || this.targetType || RGInnerConnectTargetType.NodePoint;
            if (!newLineJson.from) {
                newLineJson.from = this.targetId;
            }
            if (!newLineJson.fromType) {
                newLineJson.fromType = actualTargetType;
            }
            if (!newLineJson.fromJunctionPoint) {
                newLineJson.fromJunctionPoint = this.actualJunctionPoint;
            }
            this.$emit('onDragConnectStart', newLineJson, $event);
            this.graphInstance.startCreateLineFromNode(null, newLineJson, $event, (from, to, newLine) => {
                this.$emit('onDragConnectEnd', from, to, newLine);
            });
        },
        onMouseUp(type, $event) {
            $event.stopPropagation();
            if (this.disableDrop) {
                return;
            }
            this.graphInstance.onLineVertexBeDropped(type, $event, undefined, (fromNode:RGNode, toNode:RGNode|RGPosition, newLineJson:JsonLine) => {
                this.$emit('onLineVertexBeDropped', fromNode, toNode, newLineJson);
            });
        }
    }
};
</script>

<style scoped>
</style>
