<template>
    <RGProvider v-if="!inRGProvider" @onReady="onRGProviderReady" :for-linker="true">
        <RelationLinkerUI v-if="initialised" :lines="lines">
            <template #view>
                <slot name="view"/>
            </template>
            <template #line="lineSlotProps">
                <slot v-bind="lineSlotProps" name="line"/>
            </template>
            <template #canvas-plug-behind>
                <slot name="canvas-behind"/>
                <slot/>
            </template>
        </RelationLinkerUI>
    </RGProvider>
    <RelationLinkerUI v-else :lines="lines">
        <template #view>
            <slot name="view"/>
        </template>
        <template #line="lineSlotProps">
            <slot v-bind="lineSlotProps" name="line"/>
        </template>
        <template #canvas-plug-behind>
            <slot name="canvas-behind"/>
            <slot/>
        </template>
    </RelationLinkerUI>
</template>

<script lang="ts">
import {devLog, relationGraphVersionInfo} from '../../../../relation-graph-models/utils/RGCommon';
import RelationLinkerUI from './RelationLinkerUI.vue';
import {RGEventNames} from "../../../../types";
import {RGTips} from "../../../../relation-graph-models/utils/RGTips";
import RGProvider from "./RGProvider.vue";

export default {
    name: 'RelationLinker',
    components: {
        RGProvider,
        RelationLinkerUI
    },
    props: {
        options: {
            mustUseProp: false,
            default: () => {
                return {};
            },
            type: Object
        },
        lines: {
            mustUseProp: true,
            default: () => {
                return [];
            },
            type: Array
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
        relationGraphVersionInfo('Vue2-Linker');
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
