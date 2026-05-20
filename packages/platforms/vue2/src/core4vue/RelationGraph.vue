<template>
    <RGProvider v-if="!inRGProvider" @onReady="onRGProviderReady">
        <RelationGraphUI v-if="initialised" :initial-data="initialData">
            <template #view>
                <slot name="view"/>
            </template>
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
            <template #canvas-plug-behind>
                <slot name="canvas"/>
                <slot/>
            </template>
            <template #canvas-plug-above>
                <slot name="canvas-above"/>
            </template>
            <template #node="nodeSlotProps">
                <slot v-bind="nodeSlotProps" name="node"/>
            </template>
            <template #node-expand-button="nodeExpandButtonSlotProps">
                <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
            </template>
            <template #background>
                <slot name="background"/>
            </template>
        </RelationGraphUI>
    </RGProvider>
    <RelationGraphUI v-else :initial-data="initialData">
        <template #view>
            <slot name="view"/>
        </template>
        <template #line="lineSlotProps">
            <slot v-bind="lineSlotProps" name="line"/>
        </template>
        <template #canvas-plug-behind>
            <slot name="canvas"/>
            <slot/>
        </template>
        <template #canvas-plug-above>
            <slot name="canvas-above"/>
        </template>
        <template #node="nodeSlotProps">
            <slot v-bind="nodeSlotProps" name="node"/>
        </template>
        <template #node-expand-button="nodeExpandButtonSlotProps">
            <slot name="node-expand-button" v-bind="nodeExpandButtonSlotProps" />
        </template>
        <template #background>
            <slot name="background"/>
        </template>
    </RelationGraphUI>
</template>

<script lang="ts">
import Vue from 'vue';
import {devLog, relationGraphVersionInfo} from '../../../../relation-graph-models/utils/RGCommon';
import RelationGraphUI from './RelationGraphUI.vue';
import {RGEventNames} from "../../../../types";
import {getEventListeners} from "../../../../relation-graph-models/utils/RGIntergration";
import {RGTips} from "../../../../relation-graph-models/utils/RGTips";
import RGProvider from "./RGProvider.vue";

export default {
    name: 'RelationGraph',
    components: {
        RGProvider,
        RelationGraphUI
    },
    props: {
        options: {
            mustUseProp: false,
            default: () => {
                return {};
            },
            type: Object
        },
        initialData: {
            mustUseProp: false,
            default: () => {
                return null;
            },
            type: Object
        },
        relationGraphCore: {
            mustUseProp: false,
            default: null,
            type: Function
        }
    },
    data() {
      return {
          initialised: false,
          inRGProvider: false
      }
    },
    inject: {
        graphStore: {
            default: null
        }
    },
    created() {
        if (typeof window !== 'undefined' && window) window.relationGraphDebug = this.options.debug;
        devLog('---------------------------graph created---------------------------', this);
        // 注意：
        // 根据MIT许可证的规定，允许您自由地使用、修改和分发源代码。您可以根据自己的需求对源代码进行更改。
        // 然而，您仍然需要遵守MIT许可证的其他规定，如保留版权声明和免责声明等
        // relation-graph是relation-graph的网址是它的版权声明，请勿注释掉以下版权声明信息
        relationGraphVersionInfo('Vue2');
        let slotAlert = false;
        // console.error(`vue version:${Vue.version}`);
        if (!Vue || !Vue.version || Vue.version.startsWith('3')) {
            console.error('如果您使用的是vue3或react，你需要注意import时使用的名称：');
            console.error('vue2:import RelationGraph from \'relation-graph\'');
            console.error('vue3:import RelationGraph from \'relation-graph/vue3\'');
            console.error('react:import RelationGraph from \'relation-graph/react\'');
            return;
        }
        if (this.$slots['node-expand-holder']) {
            throw new Error('Slot name "#node-expand-holder" has been renamed to "#node-expand-button". Please update your code accordingly.');
        }
        if (this.$slots['graph-plug']) {
            throw new Error('Slot name "#graph-plug" has been renamed to "#view". Please update your code accordingly.');
        }
        if (this.$slots['canvas-plug']) {
            throw new Error('Slot name "#canvas-plug" has been renamed to "#canvas". Please update your code accordingly.');
        }
        if (this.$slots['canvas-plug-above']) {
            throw new Error('Slot name "#canvas-plug-above" has been renamed to "#canvas-above". Please update your code accordingly.');
        }
        if (Vue.version.slice(0, 4) === '2.5.') slotAlert = true;
        if (Vue.version.slice(0, 4) === '2.6.' && Number.parseInt(Vue.version.split('.')[2]) <= 12) slotAlert = true;
        if (slotAlert) {
            console.error(`您的Vue版本：${Vue.version}注意：当你使用的vue版本等于低于2.6.12时，图谱会显示不正常，参考这个连接解决这个问题：https://github.com/relation-graph/relation-graph/issues/113`);
        }
        // const propsListeners = getEventListeners(this);
        // if (Object.values(propsListeners).filter(fn => !!fn).length > 0) {
        //     throw new Error('Please use the @ tag to register events' + Object.values(propsListeners).filter(fn => !!fn).join(',') + ' for your components. Example: @onNodeClick');
        // }
        if (this.graphStore) {
            // console.log('Use parent graphInstance:', this.graphStore);
            this.inRGProvider = true;
            this.applyInstance(this.graphStore.graphInstance);
            this.initialised = true;
        } else {
            // console.log('Generate new graphInstance:');
            this.inRGProvider = false;
        }
    },
    watch: {
        options() {
            if (this._selfGraphInstance) this._selfGraphInstance.setOptions(this.options || {});
        }
    },
    mounted() {
        // console.log('---------------------------RelationGraph mounted---------------------------');
    },
    methods: {
        applyInstance(graphInstance: any) {
            this._selfGraphInstance = graphInstance;
            this._selfGraphInstance.setOptions(this.options || {});
            this._selfGraphInstance.setEventEmitHook((eventName: RGEventNames, ...eventArgs: any[]) => {
                this.$emit(eventName, ...eventArgs);
            });
        },
        onRGProviderReady(graphInstance: any) {
            // console.log('---------------------------onRGProviderReady---------------------------');
            this.applyInstance(graphInstance);
            this.initialised = true;
        },
        getInstance() {
            if (!this.options?.definitelyNoDataProviderNeeded) console.warn(RGTips.Vue2GetInstance)
            return this._selfGraphInstance;
        },
        async setJsonData() {
            throw new Error(RGTips.setJsonData4Vue2)
        }
    }
};
</script>
