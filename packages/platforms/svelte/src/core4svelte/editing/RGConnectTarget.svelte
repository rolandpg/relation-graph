<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {
        type RGConnectTargetDomMode,
        type JsonLine,
        type JsonLineTemplate,
        RGJunctionPoint,
        type RGNode,
        type RGLineTarget, type RGCoordinate
    } from '../../../../../types';
    import RGConnectTargetUI from "./RGConnectTargetUI.svelte";

    export let junctionPoint: RGJunctionPoint | undefined = undefined;
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

    const graphInstance = useGraphInstance();
    const dispatch = createEventDispatcher<{
        onDragConnectStart: [ newLineTemplate: JsonLineTemplate, event: MouseEvent ];
        onDragConnectEnd: [ fromNode: RGNode | RGLineTarget | RGCoordinate, toNode: RGNode | RGLineTarget | RGCoordinate, newLineJson: JsonLine ];
        onLineVertexBeDropped: [ fromNode: RGNode | RGLineTarget | RGCoordinate, toNode: RGNode | RGLineTarget | RGCoordinate, newLineJson: JsonLine ];
    }>();
</script>
<RGConnectTargetUI
    {dispatch}
    {graphInstance}
    junctionPoint={junctionPoint || RGJunctionPoint.border}
    {targetId}
    {targetType}
    {targetData}
    {lineTemplate}
    {disableDrop}
    {disableDrag}
    {forSvg}
    {domMode}
    {measureSelector}
    {strictMeasureTarget}
    {className}
    {style}
>
    <slot />
</RGConnectTargetUI>
