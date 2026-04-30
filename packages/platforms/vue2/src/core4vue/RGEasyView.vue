<template>
    <div class="rg-easy-view" :class="{'rg-easy-view-active':options.showEasyView}">
        <canvas ref="rgEasyCanvas" style="width: 100%;height: 100%;" />
    </div>
</template>

<script lang="ts">
import { devLog } from '../../../../relation-graph-models/utils/RGCommon';

export default {
    name: 'RGEasyView',
    components: {},
    data() {
        return {
        };
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
    created() {
        devLog('[RGEasyView created]');
    },
    mounted() {
        devLog('[RGEasyView mounted]');
        const graphInstance = this.graphInstance;
        graphInstance.setEasyViewCanvas && graphInstance.setEasyViewCanvas(this.$refs.rgEasyCanvas);
        this.init();
    },
    beforeDestroy() {
    },
    methods: {
        init() {
        },
    }
};
</script>
