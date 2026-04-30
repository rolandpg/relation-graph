<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import RGNodePeel from '../RGNodePeel.svelte';
    import GraphMoveOperator from './GraphMoveOperator.svelte';
    import GraphLoading from './GraphLoading.svelte';
    import {useGraphStore} from "../../hooks/useGraphStore";

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;
</script>

{#if options}
    <div class="rg-operate">
        <div class="rg-creating-container">
            {#if options.creatingNodePlot && options.showTemplateNode && options.newNodeTemplate}
                <RGNodePeel nodeProps={options.newNodeTemplate}>
                    <svelte:fragment slot="node" let:node>
                        <slot name="node" {node} />
                    </svelte:fragment>
                </RGNodePeel>
            {/if}

            {#if options.creatingSelection}
                <div
                        class="rg-selection"
                        style:transform="translate({options.selectionView.x}px, {options.selectionView.y}px)"
                        style:width="{options.selectionView.width}px"
                        style:height="{options.selectionView.height}px"
                ></div>
            {/if}
        </div>

        <GraphMoveOperator />
        <GraphLoading />
    </div>
{/if}
