<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {useGraphStore} from "../../hooks/useGraphStore";
    import {type RGEditingLineControllerEvents} from "../../types-svelte";
    import RGEditingLineControllerUI from "./RGEditingLineControllerUI.svelte";

    export let textEditable = true;
    export let pathEditable = true;

    const dispatch = createEventDispatcher<RGEditingLineControllerEvents>();

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<RGEditingLineControllerUI
        {dispatch}
        {textEditable}
        {pathEditable}
        {optionsStore}
        {graphInstance}
>
    <slot />
</RGEditingLineControllerUI>
