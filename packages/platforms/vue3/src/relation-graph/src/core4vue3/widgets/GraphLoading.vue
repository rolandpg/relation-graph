<script lang="ts" setup>
import {computed} from "vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";
import RGIcons from "./RGIcons.vue";

const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const clickGraphMask = (e) => {
    graphInstance.clearLoading();
}
</script>
<template>
    <div
            class="rg-graph-loading"
            :class="{'rg-graph-loading-hide': !options.graphLoading}"
            @click="clickGraphMask"
    >
        <div class="rg-graph-loading-message">
            <RGIcons icon-name="icon-lianjiezhong" class-name="rg-graph-loading-icon"/>
            {{ options.graphLoadingText || 'Loading...' }}
        </div>
    </div>
</template>
