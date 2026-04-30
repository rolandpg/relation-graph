<script lang="ts">
    import {RelationGraphCore} from '../../../../relation-graph-models/models/RelationGraphCore';
    import {initRGDataProvider} from "../hooks/useRGDataProvider";

    export let graphInstance: RelationGraphCore;
    initRGDataProvider(graphInstance);
    // setContext(RELATION_GRAPH_CONTEXT_KEY, graphInstance);
</script>
<slot/>
