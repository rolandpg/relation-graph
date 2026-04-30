<svelte:options customElement={{ tag:'rg-editing-resize', shadow: 'open', props: {
    disableResizeWidth: { attribute: 'disable-resize-width' },
    disableResizeHeight: { attribute: 'disable-resize-height' }
}}}/>
<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import RGEditingResizeUI from "../editing/RGEditingResizeUI.svelte";
    import {onWebComponentReady} from "./WebComponentUtils";
    import globalCss from '../../../../../styles/relation-graph-rg-resize.scss?inline';
    import {editingResizeWebComponentVarCss} from "./WebComponentStyleVariables";

    export let disableResizeWidth: boolean | string | null | undefined = undefined;
    export let disableResizeHeight: boolean | string | null | undefined = undefined;

    const parseBooleanAttr = (value: boolean | string | null | undefined, defaultValue = false) => {
        if (value === null || value === undefined) return defaultValue;
        if (typeof value === 'boolean') return value;
        const normalized = value.trim().toLowerCase();
        if (normalized === '' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
            return true;
        }
        if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
            return false;
        }
        return defaultValue;
    };

    $: disableResizeWidthValue = parseBooleanAttr(disableResizeWidth, false);
    $: disableResizeHeightValue = parseBooleanAttr(disableResizeHeight, false);

    const dispatch = createEventDispatcher<{
        beforeResizeStart: [];
    }>();

    let optionsStore: any = null;
    let graphInstance: any = null;
    let hostElement: HTMLElement | null = null;
    onMount(() => {
        onWebComponentReady(hostElement, [globalCss, editingResizeWebComponentVarCss], {
            webComponentName: 'rg-editing-resize',
            callback: (instance: any) => {
                graphInstance = instance;
                optionsStore = graphInstance?.dataStores.optionsStore;
            }
        });
    });
</script>
<div bind:this={hostElement} class="rg-resize-ctl">
    { #if optionsStore && graphInstance }
        <RGEditingResizeUI
                {dispatch}
                {optionsStore}
                {graphInstance}
                disableResizeWidth={disableResizeWidthValue}
                disableResizeHeight={disableResizeHeightValue}
                on:beforeResizeStart={() => dispatch('beforeResizeStart', [])}
        />
    {/if}
</div>
