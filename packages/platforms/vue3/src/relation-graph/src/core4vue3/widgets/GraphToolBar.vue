<script lang="ts" setup>
import {computed, onMounted} from 'vue'
import RGIcons from "./RGIcons.vue";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const props = defineProps<{
    direction?: 'v' | 'h',
    positionH?: 'left' | 'center' | 'right',
    positionV?: 'top' | 'center' | 'bottom',
}>(); // RGToolBarProps
const options = computed(() => graphInstance.dataStores.optionsRef.value);
onMounted(() => {
})
const refresh = () => {
    graphInstance.refresh()
}
const toggleAutoLayout = () => {
    graphInstance.toggleAutoLayout()
}
const downloadAsImage = () => {
    graphInstance.downloadAsImage('png')
}
const zoomToFit = async () => {
    graphInstance.setZoom(100);
    graphInstance.moveToCenter();
    graphInstance.enableCanvasAnimation();
    graphInstance.zoomToFit();
    setTimeout(() => {
        graphInstance.disableCanvasAnimation();
    }, 300);
}
const addZoom = (buff: number) => {
    graphInstance.zoom(buff)
}
const doFullscreen = () => {
    graphInstance.fullscreen()
}
</script>
<template>
    <div
            class="rg-toolbar"
            :class="[
              'rg-toolbar-h-' + (positionH || options.toolBarPositionH),
               'rg-toolbar-v-' + (positionV || options.toolBarPositionV),
                'rg-toolbar-' + (direction || options.toolBarDirection)
                ]"
    >
        <div class="rg-mb-button" style="margin-top: 0px;" @click="doFullscreen()">
            <RGIcons icon-name="icon-quanping"/>
        </div>
        <div class="rg-mb-button" @click="addZoom(20)">
            <RGIcons icon-name="icon-fangda"/>
        </div>
        <div class="rg-current-zoom" @click="zoomToFit">{{ Math.round(options.canvasZoom) }}%</div>
        <div class="rg-mb-button" style="margin-top:0px;" @click="addZoom(-20)">
            <RGIcons icon-name="icon-suoxiao"/>
        </div>
        <div v-if="options.layout.supportAutoLayout"
             :title="options.layout.autoLayouting?'点击停止自动布局':'点击开始自动调整布局'"
             :class="{'rg-mb-button-on':options.layout.autoLayouting}" class="rg-mb-button" @click="toggleAutoLayout">
            <RGIcons v-if="!options.layout.autoLayouting" icon-name="icon-zidong"/>
            <RGIcons v-else icon-name="icon-lianjiezhong" class-name="rg-loading-icon"/>
        </div>
        <div class="rg-mb-button" @click="refresh">
            <RGIcons icon-name="icon-ico_reset"/>
        </div>
        <!--    <div class="rg-mb-button" @click="downloadAsImage">-->
        <!--        <RGIcons icon-name="icon-tupian"/>-->
        <!--    </div>-->
        <slot/>
        <div style="clear: both;"></div>
    </div>
</template>
