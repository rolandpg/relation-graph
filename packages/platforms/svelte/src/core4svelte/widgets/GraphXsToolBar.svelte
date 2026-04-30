<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import RGIcons from './RGIcons.svelte';
    import {useGraphStore} from "../../hooks/useGraphStore";

    export let direction: 'v' | 'h' | undefined = undefined;
    export let positionH: 'left' | 'center' | 'right' | undefined = undefined;
    export let positionV: 'top' | 'center' | 'bottom' | undefined = undefined;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    function toggleAutoLayout() {
        graphInstance.toggleAutoLayout();
    }

    function downloadAsImage() {
        graphInstance.downloadAsImage('png');
    }

    async function zoomToFit() {
        graphInstance.setZoom(100);
        graphInstance.moveToCenter();
        graphInstance.enableCanvasAnimation();
        await graphInstance.zoomToFit();
        setTimeout(() => {
            graphInstance.disableCanvasAnimation();
        }, 300);
    }

    function doZoom(value: number) {
        graphInstance.zoom(value);
    }

    function fullscreen() {
        graphInstance.fullscreen();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        class={[
    'rg-toolbar',
    'rg-xs-toolbar',
    'rg-toolbar-h-' + (positionH || options.toolBarPositionH || 'left'),
    'rg-toolbar-v-' + (positionV || options.toolBarPositionV || 'bottom'),
    'rg-toolbar-' + (direction || options.toolBarDirection || 'h')
  ].join(' ')}
>
    <div title="Full Screen" class="rg-mb-button" style="margin-top: 0px;" on:click={fullscreen}>
        <RGIcons iconName="icon-quanping" />
    </div>

    <div class="rg-mb-button" on:click={() => doZoom(20)}>
        <RGIcons iconName="icon-fangda" />
    </div>

    <div class="rg-current-zoom" on:click={zoomToFit}>
        {Math.round(options.canvasZoom)}%
    </div>

    <div class="rg-mb-button" style="margin-top:0px;" on:click={() => doZoom(-20)}>
        <RGIcons iconName="icon-suoxiao" />
    </div>

    {#if options.layout.supportAutoLayout}
        <div
                title={options.layout.autoLayouting ? 'Stop Force Layout' : 'Start Force Layout'}
                class="rg-mb-button"
                class:rg-mb-button-on={options.layout.autoLayouting}
                on:click={toggleAutoLayout}
        >
            {#if !options.layout.autoLayouting}
                <RGIcons iconName="icon-zidong" />
            {:else}
                <RGIcons iconName="icon-lianjiezhong" className="rg-loading-icon" />
            {/if}
        </div>
    {/if}

    <slot />
    <div style="clear: both;"></div>
</div>
