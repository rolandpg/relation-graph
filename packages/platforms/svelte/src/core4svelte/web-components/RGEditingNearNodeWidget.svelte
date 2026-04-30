<svelte:options customElement={{ tag:'rg-editing-node-widget', shadow: 'open'}}/>
<script lang="ts">
    import type { RGWidgetPosition } from '../../../../../types';
    import globalCss from './RGEditingNearNodeWidget.scss?inline';
    import {onMount} from "svelte";
    import {onWebComponentReady} from "./WebComponentUtils";

    export let position: RGWidgetPosition = 'top';
    let hostElement: HTMLElement | null = null;
    onMount(() => {
        onWebComponentReady(hostElement, globalCss, {
            webComponentName: 'rg-connect-target',
            callback: (instance: any) => {
                // console.log('rg-connect-target got graph instance', instance);
            }
        });
    });
</script>

<div bind:this={hostElement} class="rg-editing-bar rg-editing-bar-{position || 'top'}">
    <slot />
</div>
