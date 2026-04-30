<template>
    <div>
        <div :class="[]" class="rg-setting-panel-button" @click="toggleSettingPanel">
            Debug
        </div>
        <div v-if="showSettingPanel" :class="[]" class="rg-setting-panel">
            <div class="c-debug-tools-row">
                <button @click="printOptions">print options in console</button>
            </div>
            <div class="c-debug-tools-row">
                <button @click="printData">print json data in console</button>
            </div>
            <div class="c-debug-tools-row">debug log status: {{ options.debug }}
                <button @click="enableDevlog">{{ options.debug ? 'disable' : 'enable' }} debug log</button>
            </div>
            <slot/>
        </div>
    </div>
</template>

<script lang="ts">

import {devLog} from '../../../../../relation-graph-models/utils/RGCommon';

export default {
    name: 'RGDebugView',
    data() {
        return {
            showSettingPanel: false
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
    methods: {
        toggleSettingPanel() {
            this.showSettingPanel = !this.showSettingPanel;
        },
        printOptions() {
            this.graphInstance.printOptions();
        },
        printData() {
            this.graphInstance.printData();
        },
        enableDevlog() {
            this.graphInstance.enableDebugLog(!this.options.debug);
            devLog('debugLog:', this.options.debug);
        }
    }
};
</script>

