<script lang="ts">
    import { onMount } from 'svelte';
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import RGCanvasContent from './RGCanvasContent.svelte';
    import {useGraphStore} from "../hooks/useGraphStore";

    const graphInstance = useGraphInstance();
    let rgCanvasRef: HTMLElement;

    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    $: canvasSizeAndPosition = {
        'background-color': 'transparent',
        'text-wrap': 'unset', // 注意：text-wrap 是较新的 CSS 属性，某些浏览器可能不兼容
        'position': 'relative',
        'width': '100%',
        'height': 'fit-content',
    };

    onMount(() => {
        // console.log('[RelationLinkerCanvas mounted]');
        graphInstance.setCanvasDom(rgCanvasRef);
    });
</script>

<div
        class="rg-map {options.canvasOpacity === 1 ? 'rg-map-ready' : ''}"
>
    <div
            style:background-color={canvasSizeAndPosition['background-color']}
            style:position={canvasSizeAndPosition.position}
            style:width={canvasSizeAndPosition.width}
            style:height={canvasSizeAndPosition.height}
            class="rg-map-canvas rg-canvas-behind"
    >
        <div
                class="rg-canvas-slot rg-canvas-slot-behind"
                style="position: relative; pointer-events: all; user-select: text;"
        >
            <slot name="canvas-behind" />
        </div>
    </div>

    <div
            bind:this={rgCanvasRef}
            style:background-color={canvasSizeAndPosition['background-color']}
            style:position="absolute"
            style:left="0px"
            style:top="0px"
            style:z-index="9"
            style:width={canvasSizeAndPosition.width}
            style:height={canvasSizeAndPosition.height}
            class="rg-map-canvas"
    >
        <RGCanvasContent
            showEasyView={options.showEasyView}
            creatingLine={!!(options.creatingLinePlot && options.newLinkTemplate.fromNode)}
            defaultExpandHolderPosition={options.defaultExpandHolderPosition}
            draggingNodeId={options.draggingNodeId}
            checkedNodeId={options.checkedNodeId}
            defaultLineTextOnPath={options.defaultLineTextOnPath}
            checkedLineId={options.checkedLineId}
            graphInstanceId={options.instanceId}
        >
            <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
                <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId} />
            </svelte:fragment>
        </RGCanvasContent>
    </div>
</div>
