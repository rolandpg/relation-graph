<script lang="ts">
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import {useGraphStore} from "../hooks/useGraphStore";

    export let forElementLines: boolean = false;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;
</script>

<defs>
    <marker
            id={options.instanceId + '-arrow-default'}
            markerWidth={options.defaultLineMarker.markerWidth}
            markerHeight={options.defaultLineMarker.markerHeight}
            refX={options.defaultLineMarker.refX}
            refY={options.defaultLineMarker.refY}
            markerUnits="userSpaceOnUse"
            orient="auto"
            viewBox={options.defaultLineMarker.viewBox}
    >
        <path style="fill: context-stroke;" d={options.defaultLineMarker.data} />
    </marker>
    <marker
            id={options.instanceId + '-start-arrow-default'}
            markerWidth={options.defaultLineMarker.markerWidth}
            markerHeight={options.defaultLineMarker.markerHeight}
            refX={options.defaultLineMarker.refX}
            refY={options.defaultLineMarker.refY}
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
            viewBox={options.defaultLineMarker.viewBox}
    >
        <path style="fill: context-stroke;" d={options.defaultLineMarker.data} />
    </marker>
    <slot />
</defs>
