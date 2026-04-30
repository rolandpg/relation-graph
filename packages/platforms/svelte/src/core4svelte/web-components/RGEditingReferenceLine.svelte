<svelte:options customElement={{ tag:'rg-editing-reference-line', shadow: 'open', props: {
    showText: { attribute: 'show-text', type: 'String', reflect: true },
    adsorption: { attribute: 'adsorption', type: 'String', reflect: true }
}}}/>
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import {onWebComponentReady, onWebComponentUnMounted} from "./WebComponentUtils";

    export let showText: string | undefined = '';
    export let adsorption: string | undefined = '';

    let hostElement: HTMLElement;
    onMount(() => {
        // console.error('rg-editing-reference-line:', showText, adsorption);
        onWebComponentReady(hostElement, '', {
            webComponentName: 'rg-editing-reference-line',
            componentProps: {
                showText: showText !== 'false',
                adsorption: adsorption !== 'false',
            }
        });
    });
    onDestroy(() => {
        onWebComponentUnMounted(hostElement, {
            webComponentName: 'rg-editing-reference-line',
        });
    });
</script>

<div bind:this={hostElement} style="width: 1px;height: 1px;pointer-events: none;display: none;">
    {showText}:{adsorption}
</div>
