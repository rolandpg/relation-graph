<script lang="ts" setup>
import {computed} from 'vue'
import RGIcons from "./RGIcons.vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const props = defineProps<{
    direction?: 'v' | 'h',
    positionH?: 'left' | 'center' | 'right',
    positionV?: 'top' | 'center' | 'bottom',
}>(); // RGToolBarProps
const graphInstance = useGraphInstance();
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const toggleAutoLayout = () => {
    graphInstance.toggleAutoLayout();
}
const zoomToFit = async () => {
    graphInstance.enableCanvasAnimation();
    graphInstance.setZoom(100);
    graphInstance.moveToCenter();
    graphInstance.zoomToFit();
    setTimeout(() => {
        graphInstance.disableCanvasAnimation();
    }, 300);
}
const doZoom = async (value: number) => {
    graphInstance.zoom(value);
}
const fullscreen = async () => {
    graphInstance.fullscreen();
}
</script>
<template>
    <div
            class="rg-toolbar rg-xs-toolbar"
            :class="['rg-toolbar-h-' + (positionH||options.toolBarPositionH || 'left'), 'rg-toolbar-v-' + (positionV||options.toolBarPositionV||'bottom'), 'rg-toolbar-' + (direction||options.toolBarDirection||'h')]"
    >
        <div title="Full Screen" class="rg-mb-button" style="margin-top: 0px;" @click="fullscreen">
            <RGIcons icon-name="icon-quanping"/>
        </div>
        <div class="rg-mb-button" @click="doZoom(20)">
            <RGIcons icon-name="icon-fangda"/>
        </div>
        <div class="rg-current-zoom" @click="zoomToFit">{{ Math.round(options.canvasZoom) }}%</div>
        <div class="rg-mb-button" style="margin-top:0px;" @click="doZoom(-20)">
            <RGIcons icon-name="icon-suoxiao"/>
        </div>
        <div v-if="options.layout.supportAutoLayout"
             :title="options.layout.autoLayouting?'Stop Force Layout':'Start Force Layout'"
             :class="{'rg-mb-button-on':options.layout.autoLayouting}" class="rg-mb-button" @click="toggleAutoLayout">
            <RGIcons v-if="!options.layout.autoLayouting" icon-name="icon-zidong"/>
            <RGIcons v-else icon-name="icon-lianjiezhong" class-name="rg-loading-icon"/>
        </div>
        <slot/>
        <div style="clear: both;"></div>
    </div>
</template>
