<script lang="ts">
    import { onMount } from 'svelte';
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import {useGraphStore} from "../hooks/useGraphStore";

    let rgEasyCanvas: HTMLCanvasElement;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    onMount(() => {
        // console.log('[RGEasyView mounted]');
        if (graphInstance.setEasyViewCanvas) {
            graphInstance.setEasyViewCanvas(rgEasyCanvas);
        }
    });
</script>

<div class="rg-easy-view" class:rg-easy-view-active={options.showEasyView}>
    <canvas bind:this={rgEasyCanvas} style="width: 100%; height: 100%;" />
</div>
