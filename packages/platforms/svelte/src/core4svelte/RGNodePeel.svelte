<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import type { RGNode } from '../../../../types';

    export let nodeProps: RGNode;
    export let defaultExpandHolderPosition: string | undefined;
    export let dragging: boolean | undefined;
    export let checked: boolean | undefined;
    let nodePeelRef: HTMLElement;


    const graphInstance = useGraphInstance();
    $: borderColor = nodeProps.borderColor;
    $: borderWidth = nodeProps.borderWidth === undefined ? undefined : nodeProps.borderWidth + 'px';
    $: nodeWidth = nodeProps.width ? nodeProps.width + 'px' : undefined;
    $: nodeHeight = nodeProps.height ? nodeProps.height + 'px' : undefined;

    $: expandButtonPosition = nodeProps.expandHolderPosition || defaultExpandHolderPosition || 'hide';
    $: showExpandHolder = (nodeProps.expandHolderPosition && nodeProps.expandHolderPosition !== 'hide') || (expandButtonPosition !== 'hide' && nodeProps.rgChildrenSize > 0);

    $: isVisibleNode = nodeProps.rgCalcedVisibility;

    function expandOrCollapseNode(e: MouseEvent) {
        graphInstance.expandOrCollapseNode(nodeProps, e);
    }

    function onDragStart(e: MouseEvent | TouchEvent) {
        graphInstance.onNodeDragStart(nodeProps, e);
    }

    onMount(() => {
        if (nodePeelRef) {
            graphInstance.addNodeResizeListener(nodePeelRef, nodeProps);
        }
    });

    onDestroy(() => {
        if (nodePeelRef) {
            graphInstance.removeNodeResizeListener(nodePeelRef);
        }
    });
</script>

<div
        bind:this={nodePeelRef}
        class={[
    'rg-node-peel',
    nodeProps.selected ? 'rg-node-selected' : '',
    dragging ? 'rg-node-dragging' : '',
    checked ? 'rg-node-checked' : '',
    (nodeProps.disablePointEvent || nodeProps.opacity === 0) ? 'rg-node-disable-events' : '',
    'rg-node-shape-' + (nodeProps.nodeShape === undefined ? 1 : nodeProps.nodeShape),
    'rg-node-type-' + nodeProps.type,
    nodeProps.className
  ].filter(Boolean).join(' ')}
        data-id={nodeProps.id}
        style:display={isVisibleNode ? '' : 'none'}
        style:transform="translate({nodeProps.x}px, {nodeProps.y}px)"
        style:--rg-node-z-index={nodeProps.zIndex}
        style:--rg-node-color={nodeProps.color}
        style:--rg-node-font-color={nodeProps.fontColor}
        style:--rg-node-font-size={nodeProps.fontSize ? nodeProps.fontSize + 'px' : undefined}
        style:--rg-node-border-width={borderWidth}
        style:--rg-node-border-radius={nodeProps.borderRadius ? nodeProps.borderRadius + 'px' : undefined}
        style:--rg-node-border-color={borderColor}
        style:--rg-node-width={nodeWidth}
        style:--rg-node-height={nodeHeight}
        style:--rg-node-opacity={nodeProps.opacity}
>
    {#if showExpandHolder}
        <slot
                name="node-expand-button"
                node={nodeProps}
                {expandOrCollapseNode}
                expandHolderPosition={expandButtonPosition}
         />
    {/if}

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
            class="rg-node"
            on:mousedown|stopPropagation={onDragStart}
            on:touchstart|stopPropagation={onDragStart}
    >
        <slot name="node" node={nodeProps} {checked} {dragging} />
    </div>
</div>
