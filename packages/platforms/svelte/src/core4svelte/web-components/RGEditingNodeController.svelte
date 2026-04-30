<svelte:options customElement={{ tag:'rg-editing-node-controller', shadow: 'open', props: {
    hideBorderForSingleNode: { attribute: 'hide-border-for-single-node' }
}}}/>
<script lang="ts">
    import RGEditingNodeControllerUI from "../editing/RGEditingNodeControllerUI.svelte";

    import {onMount} from "svelte";
    import {onWebComponentReady} from "./WebComponentUtils";
    import globalCss from './RGEditingNodeController.scss?inline';

    export let hideBorderForSingleNode: boolean | string | null | undefined = undefined;

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

    $: hideBorderForSingleNodeValue = parseBooleanAttr(hideBorderForSingleNode, false);

    let optionsStore: any = null;
    let graphInstance: any = null;
    let hostElement: HTMLElement | null = null;
    onMount(() => {
        onWebComponentReady(hostElement, globalCss, {
            webComponentName: 'rg-editing-node-controller',
            callback: (instance: any) => {
                graphInstance = instance;
                optionsStore = graphInstance?.dataStores.optionsStore;
                // console.log('rg-editing-node-controller got graph instance', instance);
            }
        });
    });
</script>
<div bind:this={hostElement} class="rg-editing-ctrl-wrapper">
    { #if optionsStore && graphInstance }
        <RGEditingNodeControllerUI
                {optionsStore}
                {graphInstance}
                hideBorderForSingleNode={hideBorderForSingleNodeValue}
        >
            <slot />
        </RGEditingNodeControllerUI>
    {/if}
</div>
