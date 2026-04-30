import { useGraphInstance } from './useGraphInstance';
import {RGDataStore} from "../../../types-vue3";

export function useGraphData(): RGDataStore {
    const graphInstance = useGraphInstance();
    if (!graphInstance) {
        throw new Error('RGHooks.useGraphStore must be used inside RGProvider or RelationGraph tag.');
    }
    return {
        optionsRef: graphInstance.dataStores.optionsRef,
        shouldRenderNodesRef: graphInstance.dataStores.shouldRenderNodesRef,
        shouldRenderLinesRef: graphInstance.dataStores.shouldRenderLinesRef,
        shouldRenderFakeLinesRef: graphInstance.dataStores.shouldRenderFakeLinesRef,
    };
}

