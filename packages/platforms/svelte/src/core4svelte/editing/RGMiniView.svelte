<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import type { RGWidgetPosition } from '../../../../../types';
    import {useGraphStore} from "../../hooks/useGraphStore";
    import RGMiniViewContent from "./RGMiniViewContent.svelte";

    export let position: RGWidgetPosition = 'br';
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let className: string | undefined = undefined;
    export let style: string | undefined = undefined;
    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();

</script>
<div
        class="rg-miniview rg-miniview-{position || 'br'} {className || ''}"
        {style}
        style:--miniview-width={width}
        style:--miniview-height={height}
>
    <RGMiniViewContent
            {optionsStore}
            {graphInstance}
    />
</div>
