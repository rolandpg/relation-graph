<script lang="ts">
    import { onMount } from 'svelte';
    import RGCanvasContent4Nodes from './RGCanvasContent4Nodes.svelte';
    import RGCanvasContent4Lines from './RGCanvasContent4Lines.svelte';
    import RGCanvasContent4FakeLines from './RGCanvasContent4FakeLines.svelte';
    import RGCanvasContent4CreatingLine from './RGCanvasContent4CreatingLine.svelte';

    // 定义与 Vue 版本一致的 Props
    export let showEasyView = false;
    export let creatingLine = false;
    export let defaultExpandHolderPosition = '';
    export let draggingNodeId = '';
    export let checkedNodeId = '';
    export let checkedLineId = '';
    export let defaultLineTextOnPath = false;
    export let graphInstanceId: string | undefined = undefined;

    onMount(() => {
        // console.log('[RGCanvasContent mounted]');
    });
</script>

<div class="rg-single-graph">
    <RGCanvasContent4Lines
            {showEasyView}
            {defaultLineTextOnPath}
            {checkedLineId}
            {graphInstanceId}
    >
        <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
            <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
        </svelte:fragment>
    </RGCanvasContent4Lines>

    <div class="rg-nodes-container-wrapper">
        {#if !showEasyView}
            <RGCanvasContent4Nodes
                    {defaultExpandHolderPosition}
                    {draggingNodeId}
                    {checkedNodeId}
            >
                <svelte:fragment slot="node" let:node let:checked let:dragging>
                    <slot name="node" {node} {checked} {dragging} />
                </svelte:fragment>
                <svelte:fragment slot="node-expand-button" let:node let:expandHolderPosition let:expandOrCollapseNode>
                    <slot
                            name="node-expand-button"
                            {node}
                            {expandHolderPosition}
                            {expandOrCollapseNode}
                    />
                </svelte:fragment>
            </RGCanvasContent4Nodes>
        {/if}
    </div>

    <RGCanvasContent4FakeLines
            {showEasyView}
            {defaultLineTextOnPath}
            {checkedLineId}
            {graphInstanceId}
    >
        <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
            <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
        </svelte:fragment>
    </RGCanvasContent4FakeLines>

    {#if creatingLine}
        <RGCanvasContent4CreatingLine
                {defaultLineTextOnPath}
                {graphInstanceId}
        >
            <svelte:fragment slot="line" let:lineConfig>
                <slot name="line" {lineConfig} />
            </svelte:fragment>
        </RGCanvasContent4CreatingLine>
    {/if}
</div>
