<template>
    <div
            class="rg-toolbar rg-xs-toolbar"
            :class="['rg-toolbar-h-' + (positionH||options.toolBarPositionH || 'left'), 'rg-toolbar-v-' + (positionV||options.toolBarPositionV||'bottom'), 'rg-toolbar-' + (direction||options.toolBarDirection||'h')]"
    >
        <div title="Full Screen" class="rg-mb-button" style="margin-top: 0px;" @click="graphInstance.fullscreen();">
            <RGIcons icon-name="icon-quanping"/>
        </div>
        <div class="rg-mb-button" @click="graphInstance.zoom(20)">
            <RGIcons icon-name="icon-fangda"/>
        </div>
        <div class="rg-current-zoom" @click="zoomToFit">{{ Math.round(options.canvasZoom) }}%</div>
        <div class="rg-mb-button" style="margin-top:0px;" @click="graphInstance.zoom(-20)">
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

<script lang="ts">
import RGIcons from "./RGIcons.vue";

export default {
    name: 'GraphXsToolBar',
    components: {RGIcons},
    data() {
        return {};
    },
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
            graphInstance.enableCanvasAnimation();
            graphInstance.setZoom(100);
            graphInstance.moveToCenter();
            graphInstance.zoomToFit();
            setTimeout(() => {
                graphInstance.disableCanvasAnimation();
            }, 300);
        }
    }
};
</script>
