<template>
    <div
            class="rg-editing-bar"
            :class="['rg-editing-bar-' + position]"
    >
        <slot/>
    </div>
</template>

<script lang="ts">
export default {
    name: 'RGEditingNearNodeWidget',
    props: {
        position: {
            mustUseProp: false,
            default: 'top',
            type: String
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
    methods: {
        onMouseDown(type, $event) {
            $event.stopPropagation();
            // console.log('Resize start:', type);
            this.graphInstance.onResizeStart(type, $event);
        }
    }
};
</script>

<style scoped>
</style>
