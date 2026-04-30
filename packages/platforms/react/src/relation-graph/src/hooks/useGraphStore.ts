import {RGDataStore} from "../../../types-react";
import {useContext, useMemo} from "react";
import {RGViewDataContext} from "../core4react/store/reducers/RGStore";
import {
    RGCheckedItem,
    RGConnectingNode,
    RGCreatingLine,
    RGCreatingNode,
    RGEditingLine,
    RGEditingNodes,
    RGSelectionView,
    RGViewInformation
} from "../../../../../../types";
import {useGraphInstance} from "./useGraphInstance";

export function useGraphStore(): RGDataStore {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useGraphStore' must be used within 'RGProvider'");
    }
    return dataStore;
}


export function useCreatingLine(): RGCreatingLine {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useCreatingLine' must be used within 'RGProvider'");
    }
    const graphInstance = useGraphInstance();
    return useMemo(() => {
        if (!dataStore.options || !dataStore.options.creatingLinePlot) {
            return {
                creating: false
            };
        }
        const {line, from, to} = graphInstance.generateCreatingLineConfig(dataStore.options);
        return {
            creating: true,
            fromTarget: from,
            toTarget: to,
            lineJson: line
        };
    }, [
        dataStore.options.creatingLinePlot,
        dataStore.options.newLinkTemplate,
        dataStore.options.newLineTemplate
    ]);
}

export function useCreatingNode(): RGCreatingNode {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useCreatingLine' must be used within 'RGProvider'");
    }
    return useMemo(() => {
        if (!dataStore.options || !dataStore.options.creatingNodePlot) {
            return {
                creating: false
            };
        }
        return {
            creating: true,
            nodeJson: dataStore.options.newNodeTemplate
        };
    }, [
        dataStore.options.creatingNodePlot,
        dataStore.options.newNodeTemplate
    ]);
}

export function useEditingNodes(): RGEditingNodes {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useEditingNodes' must be used within 'RGProvider'");
    }
    return useMemo(() => {
        return dataStore.options.editingController;
    }, [dataStore.options.editingController]);
}

export function useEditingLine(): RGEditingLine {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useEditingLine' must be used within 'RGProvider'");
    }
    return useMemo(() => {
        return dataStore.options.editingLineController;
    }, [dataStore.options.editingLineController]);
}
export function useConnectingNode(): RGConnectingNode {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useConnectingNode' must be used within 'RGProvider'");
    }
    return useMemo(() => {
        return dataStore.options.nodeConnectController;
    }, [dataStore.options.nodeConnectController]);
}
export function useViewInformation(): RGViewInformation {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useViewInformation' must be used within 'RGProvider'");
    }
    return useMemo(() => {
        const {viewSize,canvasSize, canvasOffset,canvasZoom,fullscreen, showEasyView} = dataStore.options;
        return {viewSize,canvasSize, canvasOffset,canvasZoom,fullscreen, showEasyView};
    }, [
        dataStore.options.viewSize,
        dataStore.options.canvasSize,
        dataStore.options.canvasOffset,
        dataStore.options.canvasZoom,
        dataStore.options.fullscreen,
        dataStore.options.showEasyView
    ]);
}
export function useSelection(): RGSelectionView & {show: boolean} {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useSelection' must be used within 'RGProvider'");
    }
    return useMemo(() => {
        return {
            ...dataStore.options.selectionView,
            show: dataStore.options.creatingSelection
        };
    }, [
        dataStore.options.selectionView,
        dataStore.options.creatingSelection
    ]);
}
export function useCheckedItem(): RGCheckedItem {
    const dataStore = useContext(RGViewDataContext);
    if (dataStore === undefined) {
        throw new Error("'useCheckedItem' must be used within 'RGProvider'");
    }
    return useMemo(() => {
        return {
            checkedLineId: dataStore.options.checkedLineId,
            checkedNodeId: dataStore.options.checkedNodeId,
            draggingNodeId: dataStore.options.draggingNodeId
        };
    }, [
        dataStore.options.checkedLineId,
        dataStore.options.checkedNodeId,
        dataStore.options.draggingNodeId
    ]);
}


