<template>
    <div
            class="rg-connect-ctl"
            @mouseup="mouseUpOnJunctionPointWithOffset('', $event)"
            @touchend="mouseUpOnJunctionPointWithOffset('', $event)"
    >
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-t" data-point="top"
             @mouseup="mouseUpOnJunctionPoint('top', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-b" data-point="bottom"
             @mouseup="mouseUpOnJunctionPoint('bottom', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-center" data-point="border"
             @mouseup="mouseUpOnJunctionPoint('border', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-l" data-point="left"
             @mouseup="mouseUpOnJunctionPoint('left', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-r" data-point="right"
             @mouseup="mouseUpOnJunctionPoint('right', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-lr" data-point="lr"
             @mouseup="mouseUpOnJunctionPoint('lr', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-tb" data-point="tb"
             @mouseup="mouseUpOnJunctionPoint('tb', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-bottom-bar" data-point="bottom" data-innode="true"
             @mouseup="mouseUpOnJunctionPointWithOffset('bottom', $event)"
             @touchend="onMouseUpWithOffset('bottom', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-top-bar" data-point="top" data-innode="true"
             @mouseup="mouseUpOnJunctionPointWithOffset('top', $event)"
             @touchend="onMouseUpWithOffset('top', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-left-bar" data-point="left" data-innode="true"
             @mouseup="mouseUpOnJunctionPointWithOffset('left', $event)"
             @touchend="onMouseUpWithOffset('left', $event)"></div>
        <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-right-bar" data-point="right" data-innode="true"
             @mouseup="mouseUpOnJunctionPointWithOffset('right', $event)"
             @touchend="onMouseUpWithOffset('right', $event)"></div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'RGEditingConnectPoints',
    components: {},
    props: {
        mouseUpOnJunctionPoint: {
            type: Function,
            required: true
        },
        mouseUpOnJunctionPointWithOffset: {
            type: Function,
            required: true
        },
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        }
    },
    data() {
        return {};
    },
    methods: {
        onMouseUp(type, $event) {
            this.graphInstance.onLineVertexBeDropped(type, $event);
        }
    }
};
</script>

<style scoped>
</style>
