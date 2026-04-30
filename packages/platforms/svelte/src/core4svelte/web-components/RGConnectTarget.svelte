<svelte:options customElement={{ tag:'rg-connect-target', shadow: 'open', props: {
    junctionPointAlias: { attribute: 'junction-point' },
    targetIdAlias: { attribute: 'target-id' },
    targetTypeAlias: { attribute: 'target-type' },
    targetDataAlias: { attribute: 'target-data' },
    lineTemplateAlias: { attribute: 'line-template' },
    disableDropAlias: { attribute: 'disable-drop' },
    disableDragAlias: { attribute: 'disable-drag' },
    forSvgAlias: { attribute: 'for-svg' },
    domModeAlias: { attribute: 'dom-mode' },
    measureSelectorAlias: { attribute: 'measure-selector' },
    strictMeasureTargetAlias: { attribute: 'strict-measure-target' },
    classNameAlias: { attribute: 'class-name' }
}}}/>
<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import {
        type RGConnectTargetDomMode,
        type JsonLine,
        type JsonLineTemplate,
        type RGCoordinate,
        RGJunctionPoint,
        type RGLineTarget,
        type RGNode
    } from '../../../../../types';
    import RGConnectTargetUI from "../editing/RGConnectTargetUI.svelte";
    import {onWebComponentReady} from "./WebComponentUtils";
    import globalCss from './RGConnectTarget.scss?inline';

    export let junctionPoint: RGJunctionPoint | undefined = undefined;
    export let junctionPointAlias: RGJunctionPoint | string | undefined = undefined;
    export let targetId: string;
    export let targetIdAlias: string | undefined = undefined;
    export let targetType: string | undefined = undefined;
    export let targetTypeAlias: string | undefined = undefined;
    export let targetData: any = undefined;
    export let targetDataAlias: any = undefined;
    export let lineTemplate: JsonLineTemplate | undefined = undefined;
    export let lineTemplateAlias: JsonLineTemplate | string | undefined = undefined;
    export let disableDrop: boolean | string | null | undefined = undefined;
    export let disableDropAlias: boolean | string | null | undefined = undefined;
    export let disableDrag: boolean | string | null | undefined = undefined;
    export let disableDragAlias: boolean | string | null | undefined = undefined;
    export let forSvg: boolean | string | null | undefined = undefined;
    export let forSvgAlias: boolean | string | null | undefined = undefined;
    export let domMode: RGConnectTargetDomMode | undefined = undefined;
    export let domModeAlias: RGConnectTargetDomMode | string | undefined = undefined;
    export let measureSelector: string | undefined = undefined;
    export let measureSelectorAlias: string | undefined = undefined;
    export let strictMeasureTarget: boolean | string | null | undefined = undefined;
    export let strictMeasureTargetAlias: boolean | string | null | undefined = undefined;

    const parseBooleanAttr = (value: boolean | string | null | undefined, defaultValue = false) => {
        if (value === null || value === undefined) return defaultValue;
        if (typeof value === 'boolean') return value;
        const normalized = value.trim().toLowerCase();
        if (normalized === '' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
            return true;
        }
        if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
            return false;
        }
        return defaultValue;
    };

    $: disableDropValue = parseBooleanAttr(disableDropAlias ?? disableDrop, false);
    $: disableDragValue = parseBooleanAttr(disableDragAlias ?? disableDrag, false);
    $: forSvgValue = parseBooleanAttr(forSvgAlias ?? forSvg, false);
    $: strictMeasureTargetValue = parseBooleanAttr(strictMeasureTargetAlias ?? strictMeasureTarget, false);
    $: resolvedJunctionPoint = (junctionPointAlias ?? junctionPoint) as RGJunctionPoint | undefined;
    $: resolvedTargetId = targetIdAlias ?? targetId;
    $: resolvedTargetType = targetTypeAlias ?? targetType;
    $: resolvedTargetData = targetDataAlias ?? targetData;
    $: resolvedLineTemplate = lineTemplateAlias ?? lineTemplate;
    $: resolvedDomMode = (domModeAlias ?? domMode) as RGConnectTargetDomMode | undefined;
    $: resolvedMeasureSelector = measureSelectorAlias ?? measureSelector;

    export let className: string | undefined = undefined;
    export let classNameAlias: string | undefined = undefined;
    export let style: string | undefined = undefined;
    $: resolvedClassName = classNameAlias ?? className;

    let hostElement: HTMLElement;
    const dispatch = createEventDispatcher<{
        onDragConnectStart: [newLineTemplate: JsonLineTemplate, event: MouseEvent];
        onDragConnectEnd: [fromNode: RGNode | RGLineTarget | RGCoordinate, toNode: RGNode | RGLineTarget | RGCoordinate, newLineJson: JsonLine];
        onLineVertexBeDropped: [fromNode: RGNode | RGLineTarget | RGCoordinate, toNode: RGNode | RGLineTarget | RGCoordinate, newLineJson: JsonLine];
    }>();

    let graphInstance: any = null;
    onMount(() => {
        onWebComponentReady(hostElement, globalCss, {
            webComponentName: 'rg-connect-target',
            callback: (instance: any) => {
                graphInstance = instance;
                // console.log('rg-connect-target got graph instance', instance);
            }
        });
    });
</script>
<div bind:this={hostElement} class="rg-connect-target-wrapper">
    { #if graphInstance }
        <RGConnectTargetUI
                {dispatch}
                {graphInstance}
                junctionPoint={resolvedJunctionPoint || RGJunctionPoint.border}
                targetId={resolvedTargetId}
                targetType={resolvedTargetType}
                targetData={resolvedTargetData}
                lineTemplate={resolvedLineTemplate}
                disableDrop={disableDropValue}
                disableDrag={disableDragValue}
                forSvg={forSvgValue}
                domMode={resolvedDomMode}
                measureSelector={resolvedMeasureSelector}
                strictMeasureTarget={strictMeasureTargetValue}
                className={resolvedClassName}
                {style}
        >
            <slot/>
        </RGConnectTargetUI>
    {/if}
</div>
