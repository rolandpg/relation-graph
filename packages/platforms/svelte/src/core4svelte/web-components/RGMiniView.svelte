<svelte:options customElement={{ tag:'rg-mini-view', shadow: 'open'}} />

<script lang="ts">
    import type {RGWidgetPosition} from '../../../../../types';
    import RGMiniViewContent from "../editing/RGMiniViewContent.svelte";
    import {onMount} from "svelte";
    import globalCss from '../../../../../styles/relation-graph-rg-miniview.scss?inline';
    import {onWebComponentReady} from "./WebComponentUtils";
    import {miniViewWebComponentVarCss} from "./WebComponentStyleVariables";

    export let position: RGWidgetPosition = 'br';
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let className: string | undefined = undefined;
    export let style: string | undefined = undefined;

    let optionsStore: any = null;
    let graphInstance: any = null;
    let hostElement: HTMLElement | null = null;
    onMount(() => {
        onWebComponentReady(hostElement, [globalCss, miniViewWebComponentVarCss], {
            webComponentName: 'rg-mini-view',
            callback: (instance: any) => {
                graphInstance = instance;
                optionsStore = graphInstance?.dataStores.optionsStore;
            }
        });
    });
</script>
<div
        bind:this={hostElement}
        class="rg-miniview rg-miniview-{position || 'br'} {className || ''}"
        {style}
        style:--rg-miniview-width={width}
        style:--rg-miniview-height={height}
>
    { #if optionsStore && graphInstance }
        <RGMiniViewContent
                {optionsStore}
                {graphInstance}
        />
    {/if}
</div>
