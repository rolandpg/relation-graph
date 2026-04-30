<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {type RGGenerateLineConfig, RGLineShape, type RGLineSlotProps} from '../../../../../types';
    import RGLineText from '../RGLineText.svelte';
    import RGLinePath from '../RGLinePath.svelte';

    export let renderLine: ((lineConfig: RGGenerateLineConfig, checked: boolean, defaultLineTextOnPath: boolean, graphInstanceId: string) => string | undefined | null) | undefined = undefined;
    export let renderLineText: ((lineConfig: RGGenerateLineConfig, checked: boolean, defaultLineTextOnPath: boolean, graphInstanceId: string) => string | undefined | null) | undefined = undefined;
    export let lineConfig: RGLineSlotProps['lineConfig'];
    export let checked: boolean | undefined;
    export let defaultLineTextOnPath: boolean | undefined;
    export let graphInstanceId: string | undefined;
    const graphInstance = useGraphInstance();
    let customLineSvgHost: SVGGElement | null = null;
    let customLineSvgHtml = '';
    $: linePathInfo = graphInstance.generateLinePath(lineConfig);
    $: textStyle = graphInstance.generateLineTextStyle(lineConfig, linePathInfo);
    $: useTextOnPath = (lineConfig.line.useTextOnPath || defaultLineTextOnPath);
    $: useSvgTextPath = useTextOnPath && (lineConfig.line.lineShape !== RGLineShape.StandardStraight);
    $: customLineSvgHtml = renderLine
        ? (renderLine(lineConfig, checked || false, defaultLineTextOnPath || false, graphInstanceId || '') ?? '')
        : '';

    function onLineClick(e: MouseEvent | TouchEvent | CustomEvent) {
        // 处理 CustomEvent (Svelte dispatch 出来的) 或 原生 Event
        const event = e instanceof CustomEvent ? e.detail : e;
        graphInstance.onLineClick(lineConfig.line, event);
    }

    function renderCustomLineSvg(customSvgHtml: string) {
        if (!customLineSvgHost || !renderLine) {
            return;
        }
        customLineSvgHost.replaceChildren();
        if (!customSvgHtml) {
            return;
        }
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${customSvgHtml}</svg>`, 'image/svg+xml');
        const parsedSvgRoot = parsedDoc.documentElement;
        Array.from(parsedSvgRoot.childNodes).forEach((childNode) => {
            customLineSvgHost?.appendChild(document.importNode(childNode, true));
        });
    }

    $: if (renderLine && customLineSvgHost) {
        renderCustomLineSvg(customLineSvgHtml);
    }

</script>
{#if renderLine}
    <g bind:this={customLineSvgHost}></g>
{:else}
    <RGLinePath
        {lineConfig}
        {linePathInfo}
        {checked}
        {graphInstanceId}
        useTextOnPath={useSvgTextPath}
        on:onLineClick={onLineClick}
    />
{/if}

{#if renderLineText}
    <RGLineText
        {lineConfig}
        {linePathInfo}
        {checked}
    >
        {@html renderLineText(lineConfig, checked || false, defaultLineTextOnPath || false, graphInstanceId||'') ?? ''}
    </RGLineText>
{:else}
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
{/if}
