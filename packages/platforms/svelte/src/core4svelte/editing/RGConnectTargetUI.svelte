<script lang="ts">
    import {onDestroy, type EventDispatcher} from 'svelte';
    import {
        type RGConnectTargetDomMode,
        RGInnerConnectTargetType,
        type JsonLine,
        type JsonLineTemplate,
        RGJunctionPoint,
        type RGNode,
        type RGUserEvent, type RGLineTarget, type RGCoordinate, type RelationGraphInstance
    } from '../../../../../types';

    export let dispatch:  EventDispatcher<{onDragConnectStart: [newLineTemplate: JsonLineTemplate, event: MouseEvent], onDragConnectEnd: [fromNode: RGNode | RGLineTarget | RGCoordinate, toNode: RGNode | RGLineTarget | RGCoordinate, newLineJson: JsonLine], onLineVertexBeDropped: [fromNode: RGNode | RGLineTarget | RGCoordinate, toNode: RGNode | RGLineTarget | RGCoordinate, newLineJson: JsonLine]}>;
    export let graphInstance: RelationGraphInstance;
    export let junctionPoint: RGJunctionPoint;
    export let targetId: string;
    export let targetType: string | undefined = undefined;
    export let targetData: any = undefined;
    export let lineTemplate: JsonLineTemplate | undefined = undefined;
    export let disableDrop = false;
    export let disableDrag = false;
    export let forSvg = false;
    export let domMode: RGConnectTargetDomMode | undefined = undefined;
    export let measureSelector: string | undefined = undefined;
    export let strictMeasureTarget = false;

    export let className: string | undefined = undefined;
    export let style: string | undefined = undefined;
    let targetRef: HTMLElement | SVGGElement;
    let registeredTargetId: string | undefined = undefined;
    $: actualJunctionPoint = junctionPoint || RGJunctionPoint.border;
    $: normalizedDomMode = !forSvg && domMode === 'contents' ? 'contents' : 'wrap';
    $: hostStyle = normalizedDomMode === 'contents' ? `${style ? `${style.trim().replace(/;?$/, ';')}` : ''}display: contents;` : style;

    onDestroy(() => {
        if (registeredTargetId) {
            graphInstance.unregisterConnectTarget(registeredTargetId);
        }
    });

    $: if (targetRef) {
        if (registeredTargetId && registeredTargetId !== targetId) {
            graphInstance.unregisterConnectTarget(registeredTargetId);
        }
        graphInstance.registerConnectTarget({
            hostEl: targetRef,
            targetId,
            targetType: targetType || RGInnerConnectTargetType.NodePoint,
            junctionPoint: actualJunctionPoint,
            targetData,
            domMode: normalizedDomMode,
            measureSelector,
            strictMeasureTarget
        });
        registeredTargetId = targetId;
    }

    function onClick(e: MouseEvent) {
        e.stopPropagation();
    }

    function onMouseUp(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        if (disableDrop) return;

        graphInstance.onLineVertexBeDropped(actualJunctionPoint, e as RGUserEvent, undefined, (fromNode, toNode, newLineJson) => {
            dispatch('onLineVertexBeDropped', [ fromNode, toNode, newLineJson ]);
        });
    }

    function onMouseDown(e: MouseEvent) {
        e.stopPropagation();
        if (disableDrag) return;
        if (graphInstance.options.creatingLinePlot) return;

        const newLineJson: JsonLineTemplate = { ...(lineTemplate || {}) };
        const actualTargetType = graphInstance.getConnectTargetById(targetId)?.targetType || targetType || RGInnerConnectTargetType.NodePoint;
        if (!newLineJson.from) newLineJson.from = targetId;
        if (!newLineJson.fromType) newLineJson.fromType = actualTargetType;
        if (!newLineJson.fromJunctionPoint) newLineJson.fromJunctionPoint = actualJunctionPoint;

        dispatch('onDragConnectStart', [ newLineJson, e ]);

        graphInstance.startCreateLineFromNode(null, newLineJson, e as RGUserEvent, (from, to, newLine) => {
            dispatch('onDragConnectEnd', [ from, to, newLine ]);
        });
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if forSvg}
<g
        bind:this={targetRef}
        class="rg-connect-ctl-handler rg-connect-target {className || ''}"
        {style}
        data-point={actualJunctionPoint}
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:click={onClick}
>
    <slot />
</g>
{:else}
    <div
        bind:this={targetRef}
        class="rg-connect-ctl-handler rg-connect-target {className || ''}"
        style={hostStyle}
        data-point={actualJunctionPoint}
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:click={onClick}
    >
        <slot />
    </div>
{/if}
