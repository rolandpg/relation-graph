<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {useGraphInstance} from '../hooks/useGraphInstance';
    import type {RGLinePathProps} from '../../../../types';

    export let lineConfig: RGLinePathProps['lineConfig'];
    export let linePathInfo: RGLinePathProps['linePathInfo'];
    export let checked: boolean | undefined;
    export let useTextOnPath: boolean | undefined;
    export let graphInstanceId: string | undefined;

    const dispatch = createEventDispatcher();

    const graphInstance = useGraphInstance();
    $: line = lineConfig.line;
    $: startArrowMarkerId = graphInstance.getArrowMarkerId(lineConfig.line, true);
    $: endArrowMarkerId = graphInstance.getArrowMarkerId(lineConfig.line, false);
    $: onPathTextStyle = graphInstance.generateLineTextStyle4TextOnPath(lineConfig);
    $: lineWidth = lineConfig.line.lineWidth ? lineConfig.line.lineWidth + 'px' : undefined;
    $: pathId = graphInstanceId + '-' + lineConfig.line.id;

    function onLineClick(e: MouseEvent | TouchEvent) {
        dispatch('onLineClick', e);
    }
</script>

<g
        class={[
            'rg-line-peel',
            line.className,
            line.selected ? 'rg-line-selected' : '',
            (line.disablePointEvent || line.opacity === 0) ? 'rg-line-disable-events' : '',
            checked ? 'rg-line-checked' : ''
        ].filter(Boolean).join(' ')}
        data-id={line.id}
        style:--rg-line-width={lineWidth}
        style:--rg-line-color={line.color}
        style:--rg-line-opacity={line.opacity}
        style:--rg-line-fontcolor={line.fontColor}
        style:--rg-line-marker-end={endArrowMarkerId}
        style:--rg-line-marker-start={startArrowMarkerId}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <path
            d={linePathInfo.pathData}
            class="rg-line-bg"
            on:touchstart={onLineClick}
            on:click={onLineClick}
    />
    <path
            id={pathId}
            d={linePathInfo.pathData}
            class={[
                'rg-line',
                line.dashType ? 'rg-line-dashtype-' + line.dashType : '',
                line.animation ? 'rg-line-anm-' + line.animation : ''
            ].filter(Boolean).join(' ')}
    />

    {#if useTextOnPath && onPathTextStyle}
        <g>
            <text
                    class="rg-line-text rg-line-text-on-path"
                    dx={onPathTextStyle.textOffset.x + 'px'}
                    dy={onPathTextStyle.textOffset.y + 'px'}
                    on:touchstart={onLineClick}
                    on:click={onLineClick}
            >
                <textPath
                        xlink:href={'#' + pathId}
                        startOffset={onPathTextStyle.onPathStartOffset}
                        text-anchor={onPathTextStyle.textAnchor}
                        method="align"
                        spacing="auto"
                >
                    {onPathTextStyle.text}
                </textPath>
            </text>
        </g>
    {/if}
    <slot />
</g>
