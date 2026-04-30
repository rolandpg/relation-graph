<script lang="ts">
    import type {
        RelationGraphInstance,
        RGOptionsFull,
        RGResizeHandlePosition,
        RGUserEvent
    } from '../../../../../types';
    import type {Readable} from "svelte/store";
    import {type EventDispatcher} from "svelte";
    export let dispatch: EventDispatcher<{beforeResizeStart: []}>;
    export let optionsStore: Readable<RGOptionsFull>;
    export let graphInstance: RelationGraphInstance;
    export let disableResizeWidth = false;
    export let disableResizeHeight = false;

    $: options = $optionsStore;

    function onMouseDown(type: RGResizeHandlePosition, e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        dispatch('beforeResizeStart', []);
        graphInstance.onResizeStart(type, e as RGUserEvent);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if options.editingController.width > 30 && (!disableResizeWidth && !disableResizeHeight)}
    <div class="rg-resize-ctl-handler rg-resize-ctl-tl" on:mousedown={(e) => onMouseDown('tl', e)}></div>
    <div class="rg-resize-ctl-handler rg-resize-ctl-tr" on:mousedown={(e) => onMouseDown('tr', e)}></div>
    <div class="rg-resize-ctl-handler rg-resize-ctl-bl" on:mousedown={(e) => onMouseDown('bl', e)}></div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if (!disableResizeWidth && !disableResizeHeight)}
    <div class="rg-resize-ctl-handler rg-resize-ctl-br" on:mousedown={(e) => onMouseDown('br', e)}></div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if (options.editingController.width > 60 || (disableResizeWidth)) && (!disableResizeHeight)}
    <div class="rg-resize-ctl-handler rg-resize-ctl-t" on:mousedown={(e) => onMouseDown('t', e)}></div>
    <div class="rg-resize-ctl-handler rg-resize-ctl-b" on:mousedown={(e) => onMouseDown('b', e)}></div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if (options.editingController.height > 60 || (disableResizeHeight)) && (!disableResizeWidth)}
    <div class="rg-resize-ctl-handler rg-resize-ctl-l" on:mousedown={(e) => onMouseDown('l', e)}></div>
    <div class="rg-resize-ctl-handler rg-resize-ctl-r" on:mousedown={(e) => onMouseDown('r', e)}></div>
{/if}
