<template>
    <div
            class="rg-move-operator"
            :class="{
      'rg-move-operator-active': canvasMoveMode
    }"
    >
        <div
                class="rg-move-touchpad"
                @mousedown="onTouchpadMouseDown"
                @touchstart="onTouchpadMouseDown"
        >
        </div>
    </div>
</template>

<script lang="ts">

export default {
    name: 'GraphMoveOperator',
    components: {},
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
        },
        canvasMoveMode() {
            return this.options.canvasMoveMode;
        }
    },
    mounted() {
    },
    methods: {
        async onTouchpadMouseDown(e) {
            this.graphInstance.startMoveCanvas(e, true);
        }
    },
    beforeDestroy() {
    }
};
</script>
<style lang="scss" scoped>

</style>
