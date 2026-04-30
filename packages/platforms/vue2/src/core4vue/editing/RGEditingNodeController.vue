<template>
    <div
            v-if="options.editingController.show"
            class="rg-editing-ctrl"
            :class="{ 'rg-ctrl-hide-border': hideBorderForSingleNode && options.editingController.nodes.length === 1 }"
            :style="{
                width: options.editingController.width + 'px',
                height: options.editingController.height + 'px',
                transform: `translate(${options.editingController.x}px, ${options.editingController.y}px)`
            }"
    >
        <slot/>
    </div>
</template>

<script lang="ts">
import RGEditingToolbar from "./RGEditingNearNodeWidget.vue";
import RGEditingResize from "./RGEditingResize.vue";

export default {
    name: 'RGEditingNodeController',
    components: {RGEditingResize, RGEditingToolbar},
    props: {
        hideBorderForSingleNode: {
            type: Boolean,
            default: false
        }
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
    methods: {}
};
</script>

<style scoped>
</style>
