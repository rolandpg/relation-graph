<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {useGraphStore} from "../../hooks/useGraphStore";
    import RGEditingResizeUI from "./RGEditingResizeUI.svelte";

    export let disableResizeWidth = false;
    export let disableResizeHeight = false;

    const dispatch = createEventDispatcher<{
        beforeResizeStart: [];
    }>();

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="rg-resize-ctl">
    <RGEditingResizeUI
        {dispatch}
        {optionsStore}
        {graphInstance}
        {disableResizeWidth}
        {disableResizeHeight}
        on:beforeResizeStart={() => dispatch('beforeResizeStart', [])}
    />
</div>
