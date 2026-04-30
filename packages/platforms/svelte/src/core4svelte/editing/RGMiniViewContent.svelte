<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type {
        RelationGraphInstance,
        RGOptionsFull,
        RGUserEvent
    } from '../../../../../types';
    import {type Readable} from "svelte/store";

    export let optionsStore: Readable<RGOptionsFull>;
    export let graphInstance: RelationGraphInstance;

    $: options = $optionsStore;
    let rgMiniViewCanvasRef: HTMLCanvasElement;

    function onMouseDown(e: MouseEvent | TouchEvent) {
        graphInstance.onVisibleViewHandleDragStart(e as RGUserEvent);
    }

    function onClickCanvas(e: MouseEvent | TouchEvent) {
        graphInstance.resetByVisiableView(e as RGUserEvent);
    }
    onMount(() => {
        graphInstance.onMiniViewMounted();
        if (rgMiniViewCanvasRef) {
            graphInstance.setMiniViewCanvas(rgMiniViewCanvasRef);
        }
    });

    onDestroy(() => {
        graphInstance.onMiniViewUnMounted();
    });
</script>
<div class="rg-miniview-container">
    <canvas
            bind:this={rgMiniViewCanvasRef}
            class:rg-mv-canvas-reset={options.miniViewVisibleHandle.emptyContent}
            on:click={onClickCanvas}
    />
    <div
            class="rg-mv-visible-area"
            on:mousedown={onMouseDown}
            style:transform="translate({options.miniViewVisibleHandle.x}px, {options.miniViewVisibleHandle.y}px)"
            style:width="{options.miniViewVisibleHandle.width}px"
            style:height="{options.miniViewVisibleHandle.height}px"
    ></div>
</div>
