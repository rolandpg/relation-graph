<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {useGraphStore} from "../../hooks/useGraphStore";
    import RGEditingNodeControllerUI from "./RGEditingNodeControllerUI.svelte";

    export let hideBorderForSingleNode = false;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
</script>

<RGEditingNodeControllerUI
        {optionsStore}
        {graphInstance}
        {hideBorderForSingleNode}
>
    <slot />
</RGEditingNodeControllerUI>
