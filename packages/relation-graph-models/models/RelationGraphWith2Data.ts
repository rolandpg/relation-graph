import {
    ReactiveDataStores,
    ReactiveDataUpdaters,
    RGGraphData,
    RGOptions,
} from '../../types';
import {RelationGraphWith1View} from "./RelationGraphWith1View";
import {RGDataProvider4Vue3} from "../data/RGDataProvider4Vue3";
import {RGDataProvider4Vue2} from "../data/RGDataProvider4Vue2";
import {RGDataProvider4Svelte} from "../data/RGDataProvider4Svelte";
import {RGDataProvider4React} from "../data/RGDataProvider4React";
import {generateNewUUID} from "../utils/RGCommon";

/**
 * Data handling class for relation-graph component integrated with different data reactive frameworks
 */
export class RelationGraphWith2Data extends RelationGraphWith1View {

    constructor() {
        super();
    }

    private _initRawPropertyFn = (item: any, propertyName: string, initialValue: any) => {};

    /**
     * [Used internally by relation-graph] Set reactive data objects
     * @param graphData
     * @param reactiveData
     * @inner
     */
    setReactiveData4Vue2(graphData: RGGraphData, reactiveOptions: RGOptions, runtimeData: any, initRawPropertyFn: (item: any, propertyName: string, initialValue: any) => void) {
        this.useReactiveDataToAutoUpdateView = true;
        this.dataProvider = new RGDataProvider4Vue2(graphData, reactiveOptions, runtimeData);
        this._initRawPropertyFn = initRawPropertyFn;
        this.options = this.dataProvider.options;
        this.dataStores = {
            shouldRenderNodesStore: runtimeData.runtimeDATA4ShouldRenderItems.nodes,
            shouldRenderLinesStore: runtimeData.runtimeDATA4ShouldRenderItems.lines,
            shouldRenderFakeLinesStore: runtimeData.runtimeDATA4ShouldRenderItems.fakeLines,
        };
    }

    /**
     * [Used internally by relation-graph] Set reactive data objects
     * @param graphData
     * @param reactiveData
     * @inner
     */
    setReactiveData4Vue3(dataStores: ReactiveDataStores, graphData: RGGraphData, reactiveOptions: RGOptions, runtimeData: any, initRawPropertyFn: (item: any, propertyName: string, initialValue: any) => void) {
        this.useReactiveDataToAutoUpdateView = true;
        this.dataProvider = new RGDataProvider4Vue3(dataStores, graphData, reactiveOptions, runtimeData);
        this._initRawPropertyFn = initRawPropertyFn;
        this.options = this.dataProvider.getOptions();
        this.dataStores = {
            optionsStore: dataStores.store4Options,
            shouldRenderNodesStore: dataStores.store4ShouldRenderNodes,
            shouldRenderLinesStore: dataStores.store4ShouldRenderLines,
            shouldRenderFakeLinesStore: dataStores.store4ShouldRenderFakeLines,
            optionsRef: dataStores.optionsRef,
            shouldRenderNodesRef: dataStores.shouldRenderNodesRef,
            shouldRenderLinesRef: dataStores.shouldRenderLinesRef,
            shouldRenderFakeLinesRef: dataStores.shouldRenderFakeLinesRef,
            textContainer4NormalRef: dataStores.textContainer4NormalRef, // Store Vue reactive data
            textContainer4FakeLineRef: dataStores.textContainer4FakeLineRef // Store Vue reactive data
        };
        // console.error('[RelationGraphWith2Data] setReactiveData4Vue3:', this.options);
    }

    /**
     *
     * @inner
     * @param dataStores
     * @param updateViewHook
     */
    setReactiveData4React(dataStores: ReactiveDataStores, updateViewHook: () => void) {
        this.dataProvider = new RGDataProvider4React(dataStores, updateViewHook);
        this.options = this.dataProvider.getOptions();
        // console.error('[RelationGraphWith2Data] setReactiveData4React:', this.options);
        this.dataStores = {
            optionsStore: dataStores.store4Options,
            shouldRenderNodesStore: dataStores.store4ShouldRenderNodes,
            shouldRenderLinesStore: dataStores.store4ShouldRenderLines,
            shouldRenderFakeLinesStore: dataStores.store4ShouldRenderFakeLines,
        };
    }
    dataStores: {
        optionsStore: any,
        shouldRenderNodesStore: any,
        shouldRenderLinesStore: any,
        shouldRenderFakeLinesStore: any,
        optionsRef?: any, // Store Vue reactive data
        shouldRenderNodesRef?: any, // Store Vue reactive data
        shouldRenderLinesRef?: any, // Store Vue reactive data
        shouldRenderFakeLinesRef?: any // Store Vue reactive data
        textContainer4NormalRef?: any // Store Vue reactive data
        textContainer4FakeLineRef?: any // Store Vue reactive data
    };

    /**
     * @inner
     * @param dataStores
     * @param updaters
     */
    setReactiveData4Svelte(dataStores: ReactiveDataStores, updaters: ReactiveDataUpdaters) {
        this.dataProvider = new RGDataProvider4Svelte(dataStores, updaters);
        this.options = this.dataProvider.getOptions();
        this.dataStores = {
            optionsStore: dataStores.store4Options,
            shouldRenderNodesStore: dataStores.store4ShouldRenderNodes,
            shouldRenderLinesStore: dataStores.store4ShouldRenderLines,
            shouldRenderFakeLinesStore: dataStores.store4ShouldRenderFakeLines,
        };
        // console.log('[RelationGraphWith2Data] setReactiveData4Svelte:', this.options);
    }

    /**
     * Generate a unique Node id relative to the current existing nodes
     * @param idLength The minimum length of the id, default is 5
     */
    generateNewNodeId(idLength = 5): string {
        const newNodeId = generateNewUUID(idLength);
        if (this.dataProvider.getNodeById(newNodeId)) {
            return this.generateNewNodeId(idLength + 1);
        } else {
            return newNodeId;
        }
    }
}
