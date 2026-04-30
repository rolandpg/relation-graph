<script lang="ts">
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import { useGraphStore } from '../hooks/useGraphStore';
    import RGLineContent from './RGLineContent.svelte';

    export let defaultLineTextOnPath = false;
    export let graphInstanceId: string | undefined = undefined;

    const graphInstance = useGraphInstance();
    const { optionsStore } = useGraphStore();

    $: options = $optionsStore!;
    $: creatingLineConfig = graphInstance.generateCreatingLineConfig(options);
</script>

<div class="rg-lines-container rg-lines-container-el-lines">
    <div class="rg-linetext-container" />
    <svg class="rg-lines-svg rg-lines-svg-el-lines" xmlns="http://www.w3.org/2000/svg">
        <slot name="line" lineConfig={creatingLineConfig}>
            <RGLineContent lineConfig={creatingLineConfig} checked={false} {defaultLineTextOnPath} {graphInstanceId} />
        </slot>
    </svg>
</div>
