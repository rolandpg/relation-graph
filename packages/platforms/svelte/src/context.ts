import {type RelationGraphInstance} from "../../../types";
export const RELATION_GRAPH_CONTEXT_KEY = Symbol('relation-graph-context');
export const RELATION_GRAPH_CONTEXT_KEY_FOR_HOOK_STORES = Symbol('relation-graph-context-for-hook-stores');
export function assertGraph(graph?: RelationGraphInstance): asserts graph {
    if (!graph) {
        throw new Error('RGProvider is missing: please ensure that RelationGraph is inside RGProvider.');
    }
}
