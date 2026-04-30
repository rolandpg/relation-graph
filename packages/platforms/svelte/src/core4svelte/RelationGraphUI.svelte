<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import {useGraphInstance} from '../hooks/useGraphInstance';
    import {useGraphStore} from '../hooks/useGraphStore';
    import GraphOperateStuff from './widgets/GraphOperateStuff.svelte';
    import GraphXsToolBar from './widgets/GraphXsToolBar.svelte';
    import RGCanvas from './RGCanvas.svelte';
    import RGLineContent from "./RGLineContent.svelte";

    let relationGraphRef: HTMLElement;
    let graphReady = false;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    onMount(() => {
        // console.log('[RelationGraphUI mounted]');
        graphInstance.setDom(relationGraphRef);
        graphReady = true;
    });

    onDestroy(() => {
        graphInstance.beforeUnmount();
    });
</script>

<div
        bind:this={relationGraphRef}
        id={options ? 'relation-graph-ins-' + options.instanceId : undefined}
        tabindex={1}
        class={[
            'relation-graph',
            options?.creatingLinePlot ? 'rg-creating-line' : '',
            options?.dragEventAction === 'move' ? 'rg-move-mode' : '',
            options?.enableNodeXYAnimation ? 'rg-enable-node-xy-animation' : '',
            options?.enableCanvasTransformAnimation ? 'rg-enable-canvas-animation' : ''
          ].filter(Boolean).join(' ')}
        style:width="100%"
        style:height={options?.viewHeight ? options.viewHeight : '100%'}
        style:opacity={graphReady ? 1 : 0}
        style:--rg-checked-item-bg-color={options?.checkedItemBackgroundColor}
        style:--rg-background-color={options?.backgroundColor}
        style:--rg-node-color={options?.defaultNodeColor}
        style:--rg-node-border-color={options?.defaultNodeBorderColor}
        style:--rg-node-border-width={options?.defaultNodeBorderWidth + 'px'}
        style:--rg-node-border-radius={options?.defaultNodeBorderRadius + 'px'}
        style:--rg-line-color={options?.defaultLineColor}
        style:--rg-line-width={options?.defaultLineWidth + 'px'}
>
    {#if options && graphReady}
        {#if options.showToolBar}
            <GraphXsToolBar/>
        {/if}

        <RGCanvas>
            <!-- 转发插槽 node -->
            <svelte:fragment slot="node" let:node let:checked let:dragging>
                <slot name="node" {node} {checked} {dragging}/>
            </svelte:fragment>

            <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
                <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
            </svelte:fragment>

            <!-- 转发插槽 canvas-plug-behind -->
            <svelte:fragment slot="canvas-behind">
                <slot name="canvas-behind"/>
            </svelte:fragment>

            <!-- 转发插槽 canvas-plug-above -->
            <svelte:fragment slot="canvas-above">
                <slot name="canvas-above"/>
            </svelte:fragment>
            <svelte:fragment slot="background">
                <slot name="background" />
            </svelte:fragment>

            <!-- 转发插槽 node-expand-button -->
            <svelte:fragment slot="node-expand-button" let:node let:expandHolderPosition let:expandOrCollapseNode>
                <slot
                        name="node-expand-button"
                        {node}
                        {expandHolderPosition}
                        {expandOrCollapseNode}
                />
            </svelte:fragment>
        </RGCanvas>

        <GraphOperateStuff>
            <svelte:fragment slot="node" let:node>
                <slot name="node" {node}/>
            </svelte:fragment>
        </GraphOperateStuff>

        <div class="rg-graph-plugs">
            <div class="rg-view-slot">
                <slot name="view"/>
            </div>
        </div>
    {/if}
</div>
