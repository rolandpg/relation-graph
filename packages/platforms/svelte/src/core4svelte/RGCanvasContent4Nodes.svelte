<script lang="ts">
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import { useGraphStore } from '../hooks/useGraphStore';
    import RGNodePeel from './RGNodePeel.svelte';

    export let defaultExpandHolderPosition = '';
    export let draggingNodeId = '';
    export let checkedNodeId = '';

    const graphInstance = useGraphInstance();
    const { shouldRenderNodesStore } = useGraphStore();

    $: shouldRenderNodes = $shouldRenderNodesStore!;
    $: allNodeConfigList = graphInstance.getShouldRenderNodes(shouldRenderNodes);
</script>

<div class="rg-nodes-container">
    {#each allNodeConfigList as thisNode (thisNode.id)}
        <RGNodePeel
                nodeProps={thisNode}
                {defaultExpandHolderPosition}
                dragging={thisNode.id === draggingNodeId}
                checked={thisNode.id === checkedNodeId}
        >
            <svelte:fragment slot="node" let:node let:checked let:dragging>
                <slot name="node" {node} {checked} {dragging} />
            </svelte:fragment>

            <svelte:fragment slot="node-expand-button" let:node let:expandHolderPosition let:expandOrCollapseNode>
                <slot
                        name="node-expand-button"
                        {node}
                        {expandHolderPosition}
                        {expandOrCollapseNode}
                />
            </svelte:fragment>
        </RGNodePeel>
    {/each}
</div>
