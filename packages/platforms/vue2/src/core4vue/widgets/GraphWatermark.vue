<template>
    <div
            v-show="show"
            class="rg-watermark"
            :class="['rg-watermark-' + position]"
            ref="watermarkRef"
            :style="{
                '--watermark-width': width,
                '--watermark-height': height
            }"
    >
        <slot/>
    </div>
</template>

<script lang="ts">

export default {
    name: 'GraphWatermark',
    components: {},
    props: {
        forImage: {
            mustUseProp: false,
            default: true,
            type: Boolean
        },
        forDisplay: {
            mustUseProp: false,
            default: true,
            type: Boolean
        },
        position: {
            mustUseProp: false,
            default: 'br',
            type: String
        },
        width: {
            mustUseProp: false,
            type: String
        },
        height: {
            mustUseProp: false,
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
        },
        show() {
            let show = false;
            if (this.options.snapshotting) {
                if (this.forImage === false) {
                    show = false;
                } else {
                    show = true;
                }
            } else {
                if (this.forDisplay === true) {
                    show = true;
                } else {
                    show = false;
                }
            }
            return show;
        }
    },
    mounted() {
        this.graphInstance.setWatermarkDom(this.$refs.watermarkRef, this.forImage, this.forDisplay, this.position);
    },
    methods: {},
    beforeDestroy() {
        this.graphInstance.setWatermarkDom(null, this.forImage, this.forDisplay);
    }
};
</script>

<style scoped>
</style>
