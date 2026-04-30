<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {useGraphStore} from "../../hooks/useGraphStore";

    export let showText = true;
    export let adsorption = false;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    onMount(() => {
        if (options) {
            graphInstance.onReferenceLineMounted(adsorption);
        }
    });

    onDestroy(() => {
        if (options) {
            graphInstance.onReferenceLineUnMounted();
        }
    });
</script>

<div
        class="rg-editing-referline"
        style:display={options.editingReferenceLine.show ? '' : 'none'}
>
    <div
            class="rg-referline rg-referline-v"
            style:display={options.editingReferenceLine.directionV ? '' : 'none'}
            style:transform="translate(var(--rg-refer-offset), 0px) translate({options.editingReferenceLine.v_x}px, {options.editingReferenceLine.v_y}px)"
            style:height="{options.editingReferenceLine.v_height}px"
    >
        <div class="referline">
            {#if showText !== false}
                <div>{Math.round(options.editingReferenceLine.v_height)}px</div>
            {/if}
        </div>
    </div>

    <div
            class="rg-referline rg-referline-h"
            style:display={options.editingReferenceLine.directionH ? '' : 'none'}
            style:transform="translate(0px, var(--rg-refer-offset)) translate({options.editingReferenceLine.h_x}px, {options.editingReferenceLine.h_y}px)"
            style:width="{options.editingReferenceLine.h_width}px"
    >
        <div class="referline">
            {#if showText !== false}
                <div>{Math.round(options.editingReferenceLine.h_width)}px</div>
            {/if}
        </div>
    </div>
</div>
