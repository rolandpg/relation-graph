<script lang="ts">
    import type { RGNode } from '../../../../types';
    import RGIcons from "./widgets/RGIcons.svelte";

    export let node: RGNode;
    export let expandOrCollapseNode: (e: MouseEvent) => void;
    export let expandHolderPosition: string;

    $: expandButtonClass = node.expanded === false ? 'rg-node-expand-button c-expanded' : 'rg-node-expand-button c-collapsed';
</script>

<div class={['rg-node-expand-holder', 'c-expand-positon-' + expandHolderPosition].join(' ')}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
            class={expandButtonClass}
            on:click|stopPropagation={expandOrCollapseNode}
            on:touchend|stopPropagation={expandOrCollapseNode}
    >
        {#if node.expanded === false}
            <RGIcons iconName="icon-fangda" />
        {:else}
            <RGIcons iconName="icon-suoxiao" />
        {/if}
    </div>
</div>
