<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import type {
        JsonLineTemplate, RGCoordinate, RGLineTarget,
        RGNode,
        RGUserEvent
    } from '../../../../../types';

    export let lineTemplate: JsonLineTemplate;

    export let className: string | undefined = undefined;
    export let style: string | undefined = undefined;

    const graphInstance = useGraphInstance();
    const dispatch = createEventDispatcher<
        {
            onConnectStart: [lineTemplate: JsonLineTemplate | undefined, e: MouseEvent];
            onLineConnectEnd: [
                fromNode: RGNode | RGLineTarget | RGCoordinate,
                toNode: RGNode | RGLineTarget | RGCoordinate,
                newLineJson: any,
            ];
        }
    >();

    function onClick(e: MouseEvent) {
        e.stopPropagation();
    }

    function onMouseDown(e: MouseEvent) {
        e.stopPropagation();
        dispatch('onConnectStart', [lineTemplate, e ]);
        graphInstance.startCreateLineFromNode(null, lineTemplate || {}, e as RGUserEvent, (fromNode, toNode, newLineJson) => {
            dispatch('onLineConnectEnd', [ fromNode, toNode, newLineJson ]);
            graphInstance.defaultLineConnectEndHandler(fromNode, toNode, newLineJson);
        });
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        class="rg-connect-source-handle rg-connect-ctl-handler rg-connect-target {className || ''}"
        {style}
        on:mousedown={onMouseDown}
        on:click={onClick}
>
    <slot />
</div>
