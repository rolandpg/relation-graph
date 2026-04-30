import React, {
    useContext,
    useEffect,
    useState,
    PropsWithChildren, useRef, useCallback,
} from 'react';
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import {
    ReactiveDataStores,
    RelationGraphInstance, RGFakeLine,
    RGLine, RGNode,
    RGOptionsFull, WriteableData
} from "../../../../../../types";
import {RelationGraphProvider, RGUpdateProvider, RGViewDataProvider, RGUpdateSignalProvider} from "../core4react/store";
import {RelationGraphStoreContext} from "../core4react/store/reducers/RGStore";
import {createDefaultConfig} from "../../../../../../relation-graph-models/data/RGOptionsDataUtils";
import {RGDataStore} from "../../../types-react";
export const useRelationGraphInstance = () => {
    const instance = useContext(RelationGraphStoreContext);
    if (!instance) {
        throw new Error(
            'useRelationGraphInstance 必须在 RelationGraph.Provider 内部使用'
        );
    }
    return instance;
};
export function generateNewRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker = false) {
    const graphInstance = relationGraphCore ? Reflect.construct(relationGraphCore, []) : new RelationGraphCore();
    graphInstance._rgAsConnectArea = forLinker;
    // console.log('[RGProvider]Creating new graphInstance', graphInstance.instanceId, forLinker);
    return graphInstance;
}
export function getOrGenerateRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker = false) {
    const parentProvider = useContext(RelationGraphStoreContext);
    if (parentProvider) {
        // console.log('[RGProvider]Got existing graphInstance from parent RGProvider', parentProvider.instanceId);
        return parentProvider;
    } else {
        // console.log('[RGProvider]No parent RGProvider found, creating new graphInstance');
        return generateNewRGInstance(relationGraphCore, forLinker);
    }
}
export const RGReactiveDataProvider: React.FC<PropsWithChildren<{graphInstance: RelationGraphInstance}>> = ({graphInstance, children}) => {
    const [updateSignal, setUpdateSignal] = useState(0);
    const {data, dataStores}= useReactiveData();
    const updateSignalValue = useRef(0);
    const updateView = useCallback((_instance?: RelationGraphCore) => {
        updateSignalValue.current++;
        setUpdateSignal(updateSignalValue.current);
    }, []);
    if (updateSignalValue.current === 0) {
        graphInstance.setReactiveData4React(dataStores, updateView);
    }
    return (
        <RelationGraphProvider value={graphInstance}>
            <RGUpdateProvider value={updateView}>
                <RGUpdateSignalProvider value={updateSignal}>
                    <RGViewDataProvider value={data}>
                        {children}
                    </RGViewDataProvider>
                </RGUpdateSignalProvider>
            </RGUpdateProvider>
        </RelationGraphProvider>
    );
};
export const RGDataProvider: React.FC<PropsWithChildren<{graphInstance: RelationGraphInstance}>> = ({graphInstance, children}) => {
    const parentGraphInstance = useContext(RelationGraphStoreContext);
    if (parentGraphInstance) {
        return <>{children}</>;
    } else {
        return (
            <RGReactiveDataProvider graphInstance={graphInstance}>
                {children}
            </RGReactiveDataProvider>
        );
    }
};

export const useReactiveData = () => {
    const [options, setOptions] = useState<RGOptionsFull>(createDefaultConfig({}));
    const [shouldRenderNodes, setShouldRenderNodes] = useState<RGNode[]>([]);
    const [shouldRenderLines, setShouldRenderLines] = useState<RGLine[]>([]);
    const [shouldRenderFakeLines, setShouldRenderFakeLines] = useState<RGFakeLine[]>([]);
    const store4Options: WriteableData<RGOptionsFull> = {
        set: (newOptions: RGOptionsFull) => {
            // console.log('[React-store]store4Options:::updated!');
            setOptions({...newOptions});
        },
    };
    const store4ShouldRenderNodes: WriteableData<RGNode[]> = {
        set: (nodes: RGNode[]) => {
            // console.log('[React-store]store4ShouldRenderNodes::::updated:', nodes.length);
            setShouldRenderNodes(nodes);
        },
    };
    const store4ShouldRenderLines: WriteableData<RGLine[]> = {
        set: (lines: RGLine[]) => {
            // console.log('[React-store]store4ShouldRenderLines::::updated:', lines.length);
            setShouldRenderLines(lines);
        },
    };
    const store4ShouldRenderFakeLines: WriteableData<RGFakeLine[]> = {
        set: (fakeLines: RGFakeLine[]) => {
            // console.log('[React-store]store4ShouldRenderFakeLines::::updated:', fakeLines.length);
            setShouldRenderFakeLines(fakeLines);
        },
    }
    const dataStores: ReactiveDataStores = {
        store4Options,
        store4ShouldRenderNodes,
        store4ShouldRenderLines,
        store4ShouldRenderFakeLines,
    }
    const data: RGDataStore = {
        options,
        shouldRenderNodes,
        shouldRenderLines,
        shouldRenderFakeLines,
    }
    return {
        data,
        dataStores
    };
};
