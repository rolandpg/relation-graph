import { getContext } from 'svelte';
import {RELATION_GRAPH_CONTEXT_KEY, assertGraph} from '../context';
import type {RelationGraphInstance} from "../../../../types";
export function useGraphInstance<InstanceType extends RelationGraphInstance>(): InstanceType {
    const graphInstance = getContext<RelationGraphInstance>(RELATION_GRAPH_CONTEXT_KEY);
    assertGraph(graphInstance);
    return graphInstance as InstanceType;
}

