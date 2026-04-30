<template>
    <div
            class="rg-connect-source-handle"
            :class="[
                'rg-connect-ctl-handler',
                'rg-connect-target',
                $attrs.className,
            ]"
            :style="$attrs.style"
            @mousedown="onMouseDown($event)"
    >
        <slot/>
    </div>
</template>

<script lang="ts">

import {JsonLine, RGNode, RGPosition} from "../../../../../types";

export default {
    name: 'RGConnectSource',
    components: {},
    props: {
        fromNode: {
            mustUseProp: false,
            default: () => null,
            type: Object
        },
        lineTemplate: {
            mustUseProp: true,
            default: () => {
                return {};
            },
            type: Object
        }
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
    },
    data() {
        return {};
    },
    methods: {
        onMouseDown($event: MouseEvent | TouchEvent) {
            this.$emit('onConnectStart', this.lineTemplate, $event);
            const graphInstance = this.graphInstance;
            graphInstance.startCreateLineFromNode(null, this.lineTemplate, $event, (fromNode: RGNode, toNode: RGNode | RGPosition, newLineJson?: JsonLine) => {
                this.$emit('onLineConnectEnd', fromNode, toNode, newLineJson);
                graphInstance.defaultLineConnectEndHandler(fromNode, toNode, newLineJson);
            });
        }
    }
};
</script>

<style scoped>
</style>
