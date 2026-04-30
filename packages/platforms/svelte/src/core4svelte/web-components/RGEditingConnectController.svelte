<svelte:options customElement={{ tag:'rg-editing-connect-controller', shadow: 'open'}}/>
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import {onWebComponentReady, onWebComponentUnMounted} from "./WebComponentUtils";


    let hostElement: HTMLElement;
    onMount(() => {
        onWebComponentReady(hostElement, '', {
            webComponentName: 'rg-editing-connect-controller'
        });
    });
    onDestroy(() => {
        onWebComponentUnMounted(hostElement, {
            webComponentName: 'rg-editing-connect-controller',
        });
    });
</script>

<div bind:this={hostElement} style="width: 1px;height: 1px;pointer-events: none;display: none;">
</div>
