<script lang="ts">
    import {onMount, onDestroy, createEventDispatcher, type EventDispatcher} from 'svelte';
    import {
        type RGJsonData,
        type RGOptions,
        type RGEventNames,
        type RGNode,
        type RGGenerateLineConfig
    } from '../../../../types';

    import { useGraphInstance } from '../hooks/useGraphInstance';
    import {relationGraphVersionInfo} from "../../../../relation-graph-models/utils/RGCommon";
    import RelationGraphUI from './RelationGraphUI.svelte';
    import RGLineContent from "./RGLineContent.svelte";
    import RGNodeExpandHolder from "./RGNodeExpandHolder.svelte";
    import {type RelationGraphEvents} from "../types-svelte";


    // --- Props ---
    export let options: RGOptions | undefined = undefined;
    export let initialData: RGJsonData | undefined = undefined;
    export let eventDispatcher: EventDispatcher<RelationGraphEvents> | undefined = undefined;
    // Svelte 中类构造函数的类型定义
    // --- Event Dispatcher ---
    const dispatch = eventDispatcher ?? createEventDispatcher<RelationGraphEvents>();

    // --- Instance ---
    // 在 Svelte 中，getContext 必须在组件初始化期间调用
    const graphInstance = useGraphInstance();

    // 1. 设置事件钩子
    // 将 graphInstance 内部的事件转发为 Svelte 组件事件
    $: if (graphInstance) {
        // console.log('setEventEmitHook', graphInstance)
        graphInstance.setEventEmitHook((eventName: RGEventNames, ...eventArgs: any[]) => {
            dispatch(eventName, eventArgs);
        });
    }

    $: if (options !== undefined) {
        // console.log('[RelationGraph options changed]', options);
        graphInstance.setOptions(options);
    }
    // --- Lifecycle ---
    onMount(() => {

        // console.log('[RelationGraph mounted]');
        // 2. 版权信息
        // 注意：根据MIT许可证的规定，允许您自由地使用、修改和分发源代码。
        // 您可以根据自己的需求对源代码进行更改。
        // 然而，您仍然需要遵守MIT许可证的其他规定，如保留版权声明和免责声明等
        // relation-graph是relation-graph的网址是它的版权声明，请勿注释掉这一行信息
        relationGraphVersionInfo('Svelte'); // 修改为 Svelte

        // 3. 初始化
        graphInstance.ready();

        // console.log('[RelationGraph onReady] options:', options, graphInstance.options);
        // 4. 应用初始数据
        if (initialData) {
            // console.log('[Apply initialData]');
            graphInstance.applyInitialData(initialData);
        }
    });

    onDestroy(() => {
        if (graphInstance) {
            graphInstance.beforeUnmount();
        }
    });
</script>
<RelationGraphUI>
    <!-- 转发插槽 view -->
    <svelte:fragment slot="view">
        <slot name="view" />
    </svelte:fragment>
    <!-- 转发插槽 canvas-behind -->
    <svelte:fragment slot="canvas-behind">
        <slot name="canvas" />
        <slot />
    </svelte:fragment>

    <!-- 转发插槽 canvas-above -->
    <svelte:fragment slot="canvas-above">
        <slot name="canvas-above" />
    </svelte:fragment>
    <svelte:fragment slot="background">
        <slot name="background" />
    </svelte:fragment>
    <svelte:fragment slot="node" let:node let:checked let:dragging>
        <slot name="node" {node} {checked} {dragging}>
            <div class="rg-node-text">
                <span>{node.text}</span>
            </div>
        </slot>
    </svelte:fragment>
    <!-- 转发插槽 line -->
    <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
        <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId}>
            <RGLineContent {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
        </slot>
    </svelte:fragment>


    <svelte:fragment slot="node-expand-button" let:node let:expandHolderPosition let:expandOrCollapseNode>
        <slot
                name="node-expand-button"
                {node}
                {expandHolderPosition}
                {expandOrCollapseNode}
        >
            <RGNodeExpandHolder {node} {expandOrCollapseNode} {expandHolderPosition} />
        </slot>
    </svelte:fragment>
</RelationGraphUI>
