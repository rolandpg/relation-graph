<template>
    <div v-show="show" class="rg-background" ref="backgroundRef">
        <slot/>
    </div>
</template>

<script lang="ts">

export default {
    name: 'GraphBackground',
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
        }
    },
    data() {
        return {
            originBackgroundColor: '',
        };
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
                if (this.forDisplay === false) {
                    show = false;
                } else {
                    show = true;
                }
            }
            return show;
        }
    },
    mounted() {
        this.graphInstance.setBackgroundDom(this.$refs.backgroundRef, this.forImage, this.forDisplay);
    },
    methods: {},
    beforeDestroy() {
        this.graphInstance.setBackgroundDom(null, this.forImage, this.forDisplay);
    }
};
</script>

<style scoped>
</style>
