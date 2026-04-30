<template>
    <div
            class="rg-graph-loading"
            :class="{'rg-graph-loading-hide': !options.graphLoading}"
            @click="clickGraphMask"
    >
        <div v-if="options.graphLoadingText" class="rg-graph-loading-message">
            <RGIcons icon-name="icon-lianjiezhong" class-name="rg-graph-loading-icon"/>
            {{ options.graphLoadingText || 'Loading...' }}
        </div>
    </div>
</template>

<script lang="ts">
import RGIcons from "./RGIcons";

export default {
    name: 'GraphLoading',
    components: {RGIcons},
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
    },
    methods: {
        clickGraphMask(e) {
            this.graphInstance.clearLoading();
        }
    }
};
</script>
