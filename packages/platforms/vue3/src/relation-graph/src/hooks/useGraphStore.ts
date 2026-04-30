import { useGraphInstance } from './useGraphInstance';
import {type Ref} from "vue";
import {computed} from "vue";
import {
    RGCheckedItem,
    RGConnectingNode,
    RGCreatingLine,
    RGCreatingNode, RGEditingLine,
    RGEditingNodes,
    RGOptionsFull, RGSelectionView, RGViewInformation
} from "../../../../../../types";

export function useGraphStore(): {
    optionsRef: Ref<RGOptionsFull>;
} {
    const graphInstance = useGraphInstance();
    if (!graphInstance) {
        throw new Error('RGHooks.useGraphStore must be used inside RGProvider or RelationGraph tag.');
    }
    return {
        optionsRef: graphInstance.dataStores.optionsRef as Ref<RGOptionsFull>
    };
}
export function useGraphOptions(): Ref<RGOptionsFull> {
    const graphInstance = useGraphInstance();
    if (!graphInstance) {
        throw new Error('RGHooks.useGraphStore must be used inside RGProvider or RelationGraph tag.');
    }
    return graphInstance.dataStores.optionsRef;
}

export function useCreatingLine(): Ref<RGCreatingLine> {
    const graphInstance = useGraphInstance();
    if (!graphInstance) {
        throw new Error('RGHooks.useGraphStore must be used inside RGProvider or RelationGraph tag.');
    }
    const optionsRef = graphInstance.dataStores.optionsRef as Ref<RGOptionsFull>;
    return computed(() => graphInstance.getCreatingLine(optionsRef.value));
}

export function useCreatingNode(): Ref<RGCreatingNode> {
    const graphInstance = useGraphInstance();
    if (!graphInstance) {
        throw new Error('RGHooks.useGraphStore must be used inside RGProvider or RelationGraph tag.');
    }
    const optionsRef = graphInstance.dataStores.optionsRef as Ref<RGOptionsFull>;
    return computed(() => graphInstance.getCreatingNode(optionsRef.value));
}

export function useEditingNodes(): Ref<RGEditingNodes> {
    const optionsRef = useGraphOptions();
    return computed(() => optionsRef.value.editingController);
}

export function useEditingLine(): Ref<RGEditingLine> {
    const optionsRef = useGraphOptions();
    return computed(() => optionsRef.value.editingLineController);
}
export function useConnectingNode(): Ref<RGConnectingNode> {
    const optionsRef = useGraphOptions();
    return computed(() => optionsRef.value.nodeConnectController);
}
export function useViewInformation(): Ref<RGViewInformation> {
    const optionsRef = useGraphOptions();
    return computed(() => ({
        viewSize: optionsRef.value.viewSize,
        canvasSize: optionsRef.value.canvasSize,
        canvasOffset: optionsRef.value.canvasOffset,
        canvasZoom: optionsRef.value.canvasZoom,
        fullscreen: optionsRef.value.fullscreen,
        showEasyView: optionsRef.value.showEasyView
    }));
}
export function useSelection(): Ref<RGSelectionView & {show: boolean}> {
    const optionsRef = useGraphOptions();
    return computed(() => ({
        ...optionsRef.value.selectionView,
        show: optionsRef.value.creatingSelection
    }));
}
export function useCheckedItem(): Ref<RGCheckedItem> {
    const optionsRef = useGraphOptions();
    return computed(() => ({
        checkedLineId: optionsRef.value.checkedLineId,
        checkedNodeId: optionsRef.value.checkedNodeId,
        draggingNodeId: optionsRef.value.draggingNodeId
    }));
}

