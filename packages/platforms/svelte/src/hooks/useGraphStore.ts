import { useGraphInstance } from './useGraphInstance';
import {RGDataStore, RGSvelteHooksStore} from "../types-svelte";
import {getContext} from "svelte";
import {RELATION_GRAPH_CONTEXT_KEY_FOR_HOOK_STORES} from "../context";
import {
    JsonNode,
    RGConnectingNode,
    RGCreatingLine,
    RGEditingLine,
    RGEditingNodes, RGSelectionView, RGViewInformation
} from "../../../../types";

export function useGraphStore(): RGDataStore {
    const graphInstance = useGraphInstance();
    const dataStores = graphInstance.dataStores;
    if (!dataStores) {
        throw new Error('graphInstance.dataStores.store4Options 不存在，无法订阅 options。');
    }
    return dataStores;
}

export function useHookStore() {
    const hooksStore = getContext<RGSvelteHooksStore>(RELATION_GRAPH_CONTEXT_KEY_FOR_HOOK_STORES);
    if (!hooksStore) {
        throw new Error('RGProvider is missing: please ensure that RelationGraph is inside RGProvider.');
    }
    return hooksStore;
}

export function useCreatingLine() {
    const {creatingLineStore} = useHookStore();
    return creatingLineStore
}

export function useCreatingNode() {
    const {creatingNodeStore} = useHookStore();
    return creatingNodeStore
}



export function useEditingNodes() {
    const {editingNodesStore} = useHookStore();
    return editingNodesStore
}

export function useEditingLine() {
    const {editingLineStore} = useHookStore();
    return editingLineStore
}
export function useConnectingNode() {
    const {connectingNodeStore} = useHookStore();
    return connectingNodeStore
}
export function useViewInformation() {
    const {viewInformationStore} = useHookStore();
    return viewInformationStore
}
export function useSelection() {
    const {selectionStore} = useHookStore();
    return selectionStore
}
export function useCheckedItem() {
    const {checkedItemStore} = useHookStore();
    return checkedItemStore
}

