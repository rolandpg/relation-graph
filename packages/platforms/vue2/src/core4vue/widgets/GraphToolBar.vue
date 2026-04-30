<template>
    <div
            class="rg-toolbar"
            :class="['rg-toolbar-h-' + (positionH || options.toolBarPositionH), 'rg-toolbar-v-' + (positionV || options.toolBarPositionV), 'rg-toolbar-' + (direction || options.toolBarDirection)]"
    >
        <div class="rg-mb-button" style="margin-top: 0px;" @click="graphInstance.fullscreen();">
            <RGIcons icon-name="icon-quanping"/>
        </div>
        <div class="rg-mb-button" @click="graphInstance.zoom(20)">
            <RGIcons icon-name="icon-fangda"/>
        </div>
        <div class="rg-current-zoom" @dblclick="zoomToFit">{{ Math.round(options.canvasZoom) }}%</div>
        <div class="rg-mb-button" style="margin-top:0px;" @click="graphInstance.zoom(-20)">
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

<script lang="ts">
import RGIcons from "./RGIcons.vue";

export default {
    name: 'GraphMiniToolBar',
    components: {RGIcons},
    props: {
        direction: {
            mustUseProp: false,
            default: '',
            type: String
        },
        positionH: {
            mustUseProp: false,
            default: '',
            type: String
        },
        positionV: {
            mustUseProp: false,
            default: '',
            type: String
        }
    },
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
    mounted() {
    },
    methods: {
        refresh() {
            this.graphInstance.refresh();
        },
        toggleAutoLayout() {
            this.graphInstance.toggleAutoLayout();
        },
        downloadAsImage() {
            this.graphInstance.downloadAsImage('png');
        },
        async zoomToFit() {
            const graphInstance = this.graphInstance;
            graphInstance.setZoom(100);
            graphInstance.moveToCenter();
            graphInstance.enableCanvasAnimation();
            graphInstance.zoomToFit();
            setTimeout(() => {
                graphInstance.disableCanvasAnimation();
            }, 300);
        }
    }
};
</script>
