<script lang="ts">
    import type {Readable} from "svelte/store";
    import type {RelationGraphInstance, RGOptionsFull} from "../../../../../types";

    export let optionsStore: Readable<RGOptionsFull>;
    export let graphInstance: RelationGraphInstance;
    export let hideBorderForSingleNode = false;
    $: options = $optionsStore;
</script>

{#if options.editingController.show}
    <div
            class="rg-editing-ctrl"
            class:rg-ctrl-hide-border={hideBorderForSingleNode && options.editingController.nodes.length === 1}
            style:width="{options.editingController.width}px"
            style:height="{options.editingController.height}px"
            style:transform="translate({options.editingController.x}px, {options.editingController.y}px)"
    >
        <slot />
    </div>
{/if}
