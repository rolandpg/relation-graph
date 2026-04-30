<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import RGIcons from './RGIcons.svelte';
    import {useGraphStore} from "../../hooks/useGraphStore";

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    function clickGraphMask() {
        graphInstance.clearLoading();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        class="rg-graph-loading"
        class:rg-graph-loading-hide={!options.graphLoading}
        on:click={clickGraphMask}
>
    <div class="rg-graph-loading-message">
        <RGIcons iconName="icon-lianjiezhong" className="rg-graph-loading-icon" />
        {options.graphLoadingText || 'Loading...'}
    </div>
</div>
