<script lang="ts">
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import {RGLineShape, type RGLineSlotProps} from '../../../../types';
    import RGLineText from './RGLineText.svelte';
    import RGLinePath from './RGLinePath.svelte';

    export let lineConfig: RGLineSlotProps['lineConfig'];
    export let checked: boolean | undefined;
    export let defaultLineTextOnPath: boolean | undefined;
    export let graphInstanceId: string | undefined;
    const graphInstance = useGraphInstance();
    $: linePathInfo = graphInstance.generateLinePath(lineConfig);
    $: textStyle = graphInstance.generateLineTextStyle(lineConfig, linePathInfo);
    $: useTextOnPath = (lineConfig.line.useTextOnPath || defaultLineTextOnPath);
    $: useSvgTextPath = useTextOnPath && (lineConfig.line.lineShape !== RGLineShape.StandardStraight);

    function onLineClick(e: MouseEvent | TouchEvent | CustomEvent) {
        // 处理 CustomEvent (Svelte dispatch 出来的) 或 原生 Event
        const event = e instanceof CustomEvent ? e.detail : e;
        graphInstance.onLineClick(lineConfig.line, event);
    }

</script>

<RGLinePath
        {lineConfig}
        {linePathInfo}
        {checked}
        {graphInstanceId}
        useTextOnPath={useSvgTextPath}
        on:onLineClick={onLineClick}
/>

{#if lineConfig.line.text && !useSvgTextPath}
    <RGLineText
            {lineConfig}
            {linePathInfo}
            {checked}
    >
        <div
            class={`rg-line-label ${useTextOnPath ? 'rg-line-label-on-path':''}`}
            style:transform={textStyle.cssStyles.transform}
            style:transform-origin={textStyle.cssStyles?.transformOrigin}
            on:touchstart={onLineClick}
            on:click={onLineClick}
        >
            {textStyle.text}
        </div>
    </RGLineText>
{/if}
