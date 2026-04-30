import { ReactiveDataStores, ReactiveDataUpdaters, RGGraphData, RGOptions } from '../../types';
import { RelationGraphWith1View } from './RelationGraphWith1View';
/**
 * Data handling class for relation-graph component integrated with different data reactive frameworks
 */
export declare class RelationGraphWith2Data extends RelationGraphWith1View {
    constructor();
    private _initRawPropertyFn;
    /**
     * [Used internally by relation-graph] Set reactive data objects
     * @param graphData
     * @param reactiveData
     * @inner
     */
    setReactiveData4Vue2(graphData: RGGraphData, reactiveOptions: RGOptions, runtimeData: any, initRawPropertyFn: (item: any, propertyName: string, initialValue: any) => void): void;
    /**
     * [Used internally by relation-graph] Set reactive data objects
     * @param graphData
     * @param reactiveData
     * @inner
     */
    setReactiveData4Vue3(dataStores: ReactiveDataStores, graphData: RGGraphData, reactiveOptions: RGOptions, runtimeData: any, initRawPropertyFn: (item: any, propertyName: string, initialValue: any) => void): void;
    /**
     *
     * @inner
     * @param dataStores
     * @param updateViewHook
     */
    setReactiveData4React(dataStores: ReactiveDataStores, updateViewHook: () => void): void;
    dataStores: {
        optionsStore: any;
        shouldRenderNodesStore: any;
        shouldRenderLinesStore: any;
        shouldRenderFakeLinesStore: any;
        optionsRef?: any;
        shouldRenderNodesRef?: any;
        shouldRenderLinesRef?: any;
        shouldRenderFakeLinesRef?: any;
        textContainer4NormalRef?: any;
        textContainer4FakeLineRef?: any;
    };
    /**
     * @inner
     * @param dataStores
     * @param updaters
     */
    setReactiveData4Svelte(dataStores: ReactiveDataStores, updaters: ReactiveDataUpdaters): void;
    /**
     * Generate a unique Node id relative to the current existing nodes
     * @param idLength The minimum length of the id, default is 5
     */
    generateNewNodeId(idLength?: number): string;
}
