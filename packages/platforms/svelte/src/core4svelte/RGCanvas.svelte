<script lang="ts">
    import { onMount } from 'svelte';
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import type { RGUserEvent } from '../../../../types';
    import RGCanvasContent from './RGCanvasContent.svelte';
    import RGEasyView from './RGEasyView.svelte';
    import {useGraphStore} from "../hooks/useGraphStore";

    let rgCanvasRef: HTMLElement;
    let rgMapRef: HTMLElement;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    function onDragStart(e: MouseEvent | TouchEvent) {
        graphInstance.onCanvasDragStart(e as RGUserEvent);
    }

    function contextmenu(e: MouseEvent) {
        graphInstance.onContextmenu(e as RGUserEvent);
    }

    function mouseWheelListener(e: WheelEvent) {
        graphInstance.onMouseWheel(e);
    }

    $: canvasSizeAndPosition = `
    width: ${options.canvasSize.width}px;
    height: ${options.canvasSize.height}px;
    background-color: transparent;
    transform: translate(${options.canvasOffset.x}px, ${options.canvasOffset.y}px) scale(${options.canvasZoom / 100}, ${options.canvasZoom / 100});
  `;

    onMount(() => {
        // console.log('[RGCanvas mounted]');
        graphInstance.setCanvasDom(rgCanvasRef);
        rgMapRef.addEventListener('wheel', mouseWheelListener, { passive: false });
        return () => {
            rgMapRef?.removeEventListener('wheel', mouseWheelListener);
        };
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        bind:this={rgMapRef}
        class="rg-map {options.canvasOpacity === 1 ? 'rg-map-ready' : ''}"
        on:contextmenu={contextmenu}
        on:mousedown={onDragStart}
        on:touchstart={onDragStart}
>
    <div class="rg-map-background">
        <slot name="background" />
    </div>
    <div style={canvasSizeAndPosition} class="rg-map-canvas rg-canvas-behind">
        <div class="rg-canvas-slot rg-canvas-slot-behind">
            <slot name="canvas-behind" />
        </div>
    </div>

    <RGEasyView />
    <div bind:this={rgCanvasRef} style={canvasSizeAndPosition} class="rg-map-canvas">
        <RGCanvasContent
                showEasyView={options.showEasyView}
                creatingLine={!!(options.creatingLinePlot && options.newLinkTemplate.fromNode)}
                defaultExpandHolderPosition={options.defaultExpandHolderPosition}
                draggingNodeId={options.draggingNodeId}
                checkedNodeId={options.checkedNodeId}
                defaultLineTextOnPath={options.defaultLineTextOnPath}
                checkedLineId={options.checkedLineId}
                graphInstanceId={options.instanceId}
        >
            <svelte:fragment slot="node" let:node let:checked let:dragging>
                <slot name="node" {node} {checked} {dragging} />
            </svelte:fragment>

            <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
                <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
            </svelte:fragment>

            <svelte:fragment slot="node-expand-button" let:node let:expandHolderPosition let:expandOrCollapseNode>
                <slot
                        name="node-expand-button"
                        {node}
                        {expandHolderPosition}
                        {expandOrCollapseNode}
                />
            </svelte:fragment>
        </RGCanvasContent>
    </div>

    <div style={canvasSizeAndPosition} class="rg-map-canvas rg-canvas-above">
        <div class="rg-canvas-slot rg-canvas-slot-above">
            <slot name="canvas-above" />
        </div>
    </div>
</div>
