<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import RGEditingConnectPoints from './RGEditingConnectPoints.svelte';
    import { devLog } from '../../../../../relation-graph-models/utils/RGCommon';
    import type {
        JsonLine,
        RGJunctionPoint,
        RGNode,
        RGPosition,
        RGUserEvent
    } from '../../../../../types';
    import {useGraphStore} from "../../hooks/useGraphStore";

    let connectBoxRef: HTMLElement;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    function mouseUpOnJunctionPoint(junctionPoint: RGJunctionPoint, e: RGUserEvent) {
        graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, e, undefined, (fromNode, toNode, newLineJson) => {
            devLog('onLineVertexBeDropped:callback:', newLineJson);
            // graphInstance.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
        });
    }

    function mouseUpOnJunctionPointWithOffset(junctionPoint: RGJunctionPoint, e: RGUserEvent) {
        graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, e, connectBoxRef, (fromNode, toNode, newLineJson) => {
            devLog('onLineVertexBeDropped:callback:', newLineJson);
            // graphInstance.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
        });
    }
</script>

{#if options.nodeConnectController.show}
    <div
            class="rg-editing-connect-ctrl"
            bind:this={connectBoxRef}
            style:transform="translate({options.nodeConnectController.x}px, {options.nodeConnectController.y}px)"
            style:width="{options.nodeConnectController.width}px"
            style:height="{options.nodeConnectController.height}px"
    >
        <!--
            Svelte 插槽传递 prop 的方式。
            如果有默认插槽内容，可以像这样提供默认实现。
        -->
        <slot
                {mouseUpOnJunctionPoint}
                {mouseUpOnJunctionPointWithOffset}
        >
            <RGEditingConnectPoints
                    {mouseUpOnJunctionPoint}
                    {mouseUpOnJunctionPointWithOffset}
            />
        </slot>
    </div>
{/if}
