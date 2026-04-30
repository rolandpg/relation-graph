<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import type { RGNode } from '../../../../types';
    import {get} from "svelte/store";
    import {useGraphStore} from "../hooks/useGraphStore";

    export let node: RGNode;

    let nodePeelRef: HTMLElement;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;
    $: borderColor = node.borderColor;
    $: nodeIsDragging = options.draggingNodeId === node.id;
    $: borderWidth = node.borderWidth === undefined ? undefined : node.borderWidth + 'px';
    $: nodeWidth = node.width ? node.width + 'px' : undefined;
    $: nodeHeight = node.height ? node.height + 'px' : undefined;
    $: opacity = node.opacity > 1 ? node.opacity / 100 : node.opacity;

    function onDragStart(e: MouseEvent | TouchEvent) {
        graphInstance.onNodeDragStart(node, e);
    }

    onMount(() => {
        if (nodePeelRef) {
            graphInstance.addNodeResizeListener(nodePeelRef, node);
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
    node.selected ? 'rg-node-selected' : '',
    nodeIsDragging ? 'rg-node-dragging' : '',
    node.id === options.checkedNodeId ? 'rg-node-checked' : '',
    'rg-node-shape-' + (node.nodeShape === undefined ? 1 : node.nodeShape),
    'rg-node-type-' + node.type,
    node.className
  ].filter(Boolean).join(' ')}
        data-id={node.id}
        style:left="{node.x}px"
        style:top="{node.y}px"
        style:--rg-node-z-index={node.zIndex}
        style:--rg-node-opacity={opacity}
        style:pointer-events={node.opacity === 0 ? 'none' : undefined}
        style:--rg-node-color={node.color || options.defaultNodeColor}
        style:--rg-node-font-color={node.fontColor}
        style:--rg-node-font-size={node.fontSize ? node.fontSize + 'px' : undefined}
        style:--rg-node-border-width={borderWidth}
        style:--rg-node-width={nodeWidth}
        style:--rg-node-height={nodeHeight}
        style:--rg-node-border-radius={node.borderRadius ? node.borderRadius + 'px' : undefined}
        style:--rg-node-border-color={borderColor}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
            class="rg-node"
            on:mousedown|stopPropagation={onDragStart}
            on:touchstart|stopPropagation={onDragStart}
    >
        <slot>
            <div class="rg-node-text">
                <span>{node.text}</span>
            </div>
        </slot>
    </div>
</div>
