<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {useGraphStore} from "../../hooks/useGraphStore";

    export let forImage = true;
    export let forDisplay = true;

    let backgroundRef: HTMLElement;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    onMount(() => {
        if (backgroundRef) {
            graphInstance.setBackgroundDom(backgroundRef, forImage, forDisplay);
        }
    });

    onDestroy(() => {
        graphInstance.setBackgroundDom(null, forImage, forDisplay);
    });
</script>

<div
        bind:this={backgroundRef}
        class="rg-background"
        style:display={forDisplay !== false ? '' : 'none'}
>
    <slot />
</div>
