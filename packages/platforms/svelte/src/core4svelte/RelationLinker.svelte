<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import type { JsonLine, RGOptions } from '../../../../types';

    import RelationLinkerUI from './RelationLinkerUI.svelte';
    import {RGEventNames} from "../../../../types";
    import type {RelationGraphEvents} from "../types-svelte";
    import {getOrGenerateRGInstance} from "../hooks/useRGDataProvider";
    import {relationGraphVersionInfo} from "../../../../relation-graph-models/utils/RGCommon";
    import RGLineContent from "./RGLineContent.svelte";

    export let options: RGOptions | undefined = undefined;
    export let lines: JsonLine[] = [];

    const dispatch = createEventDispatcher<RelationGraphEvents>();

    // --- Instance ---
    // 在 Svelte 中，getContext 必须在组件初始化期间调用
    const graphInstance = getOrGenerateRGInstance(undefined, true);
    graphInstance.setEventEmitHook((eventName: RGEventNames, ...eventArgs: any[]) => {
        dispatch(eventName, eventArgs);
    });
    // 响应式更新 lines 数据
    $: if (graphInstance && lines) {
        // 注意：这里假设 graphInstance 有一个方法来更新 lines
        // 或者 useRelationLinker 内部处理了数据的响应式同步
        // console.log('lines updated:', lines);
        // graphInstance.updateLines(lines); // 示例伪代码
        graphInstance.clearGraph();
        graphInstance.addFakeLines(lines);
    }
    // 响应式更新 lines 数据
    $: if (graphInstance && options) {
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
        relationGraphVersionInfo('Svelte-Linker'); // 修改为 Svelte
        // 3. 初始化
        graphInstance.ready();
        // 4. 应用初始数据
        if (lines) {
            // console.log('[Apply initialData]');
            graphInstance.clearGraph();
            graphInstance.addFakeLines(lines);
        }
    });

    onDestroy(() => {
        if (graphInstance) {
            graphInstance.beforeUnmount();
        }
    });
</script>

<!--
  RelationLinkerUI 内部应该包含 slots 的渲染逻辑
-->
<RelationLinkerUI>
    <!-- 转发名为 'view' 的插槽 -->
    <svelte:fragment slot="view">
        <slot name="view" />
    </svelte:fragment>

    <!-- 转发插槽 line -->
    <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
        <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId}>
            <RGLineContent {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
        </slot>
    </svelte:fragment>

    <!-- 转发默认插槽 -->
    <slot />
</RelationLinkerUI>
