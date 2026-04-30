<script lang="ts">
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import type { RGLinePeelProps } from '../../../../types';

    // 注意：Svelte中 export let 用于接收 props，直接解构 defineProps 不太一样
    export let line: RGLinePeelProps['line'];
    export let checked: boolean | undefined;
    export let defaultLineTextOnPath: boolean | undefined;
    export let graphInstanceId: string | undefined;

    const graphInstance = useGraphInstance();

    $: lineConfig = line.isFakeLine
        ? graphInstance.generateFakeLineConfig(line)
        : graphInstance.generateLineConfig(line);
</script>

{#if lineConfig}
    <g>
        <slot name="line" {lineConfig} {checked} {graphInstanceId} {defaultLineTextOnPath} />
     </g>
{/if}
