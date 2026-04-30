<template>
    <defs>
        <marker
                :id="options.instanceId+'-arrow-default'"
                :markerWidth="options.defaultLineMarker.markerWidth"
                :markerHeight="options.defaultLineMarker.markerHeight"
                :refX="options.defaultLineMarker.refX"
                :refY="options.defaultLineMarker.refY"
                markerUnits="userSpaceOnUse"
                orient="auto"
                :viewBox="options.defaultLineMarker.viewBox"
        >
            <path style="fill: context-stroke;" :d="options.defaultLineMarker.data"/>
        </marker>
        <marker
                :id="options.instanceId+'-start-arrow-default'"
                :markerWidth="options.defaultLineMarker.markerWidth"
                :markerHeight="options.defaultLineMarker.markerHeight"
                :refX="options.defaultLineMarker.refX"
                :refY="options.defaultLineMarker.refY"
                markerUnits="userSpaceOnUse"
                orient="auto-start-reverse"
                :viewBox="options.defaultLineMarker.viewBox"
        >
            <path style="fill: context-stroke;" :d="options.defaultLineMarker.data"/>
        </marker>
        <slot/>
    </defs>
</template>

<script lang="ts">

export default {
    name: 'RGGraphDefs',
    components: {},
    props: {
        forElementLines: {
            type: Boolean,
            mustUseProp: false,
            default: false
        }
    },
    data() {
        return {};
    },
    inject: ['graphStore'],
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        }
    }
};
</script>
