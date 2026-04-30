<script lang="ts">
    import RGProvider4Instance from "./core4svelte/RGProvider4Instance.svelte";
    import {getOrGenerateRGInstance} from "./hooks/useRGDataProvider";
    import {RelationGraphCore} from "../../../relation-graph-models/models/RelationGraphCore";

    export let relationGraphCore: (new (...args: any[]) => RelationGraphCore) | undefined = undefined;
    export let isLinker: boolean | undefined = false;
    const graphInstance = getOrGenerateRGInstance(relationGraphCore, isLinker);
</script>
<RGProvider4Instance {graphInstance}>
    <slot/>
</RGProvider4Instance>

