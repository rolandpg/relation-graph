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
    const { shouldRenderFakeLinesStore } = useGraphStore();

    $: shouldRenderFakeLines = $shouldRenderFakeLinesStore!;
    $: allFakeLineConfigList = graphInstance.getShouldRenderFakeLines(shouldRenderFakeLines);
</script>

<div class="rg-lines-container rg-lines-container-el-lines">
    <svg class="rg-lines-svg rg-lines-svg-el-lines" xmlns="http://www.w3.org/2000/svg">
        <RGGraphDefs forElementLines={true} />
        {#if !showEasyView}
            {#each allFakeLineConfigList as line (line.id)}
                {#if line.hidden !== true}
                    <RGLinePeel
                            {line}
                            {defaultLineTextOnPath}
                            checked={line.id === checkedLineId}
                            {graphInstanceId}
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
