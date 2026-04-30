<script lang="ts">
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import { useGraphStore } from '../hooks/useGraphStore';
    import RGGraphDefs from './RGGraphDefs.svelte';
    import RGLinePeel from './RGLinePeel.svelte';

    export let showEasyView = false;
    export let defaultLineTextOnPath = false;
    export let checkedLineId = '';
    export let graphInstanceId: string | undefined = undefined;

    const graphInstance = useGraphInstance();
    const { shouldRenderLinesStore } = useGraphStore();

    $: shouldRenderLines = $shouldRenderLinesStore!;
    $: allLineConfigList = graphInstance.getShouldRenderLines(shouldRenderLines);
</script>

<div class="rg-lines-container rg-lines-container-normal-lines">
    <svg class="rg-lines-svg" xmlns="http://www.w3.org/2000/svg">
        <RGGraphDefs />
        {#if !showEasyView}
            {#each allLineConfigList as thisLine (thisLine.id)}
                {#if thisLine.hidden !== true}
                    <RGLinePeel
                            line={thisLine}
                            checked={thisLine.id === checkedLineId}
                            {graphInstanceId}
                            {defaultLineTextOnPath}
                    >
                        <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
                            <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
                        </svelte:fragment>
                    </RGLinePeel>
                {/if}
            {/each}
        {/if}
    </svg>
    <div class="rg-linetext-container" />
</div>
