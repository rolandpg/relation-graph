<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import RelationLinkerCanvas from './RelationLinkerCanvas.svelte';
    import GraphOperateStuff from './widgets/GraphOperateStuff.svelte';
    import {useGraphStore} from "../hooks/useGraphStore";

    const graphInstance = useGraphInstance();
    let relationGraphRef: HTMLElement;
    let graphReady = false;

    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    onMount(() => {
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
        tabindex="1"
        class={[
    'relation-graph',
    options?.creatingLinePlot ? 'rg-creating-line' : ''
  ].filter(Boolean).join(' ')}
        style:width="100%"
        style:height="fit-content"
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
        <RelationLinkerCanvas>
            <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
                <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
            </svelte:fragment>

            <svelte:fragment slot="canvas-behind">
                <slot />
            </svelte:fragment>
        </RelationLinkerCanvas>

        <GraphOperateStuff />

        <div class="rg-graph-plugs">
            <div class="rg-view-slot">
                <slot name="view" />
            </div>
        </div>
    {/if}
</div>
