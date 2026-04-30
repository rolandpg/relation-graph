import {
    RGGraphData,
    RGLine,
    RGOptions,
    ReactiveDataStores
} from '../../types';
import {DataCommits, RGDataProvider} from "./RGDataProvider";

/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export class RGDataProvider4Vue3 extends RGDataProvider{
    dataStores: ReactiveDataStores;
    constructor(dataStores: ReactiveDataStores, graphData: RGGraphData, graphOptions:RGOptions, runtimeData: any) {
        super();
        this.dataStores = dataStores;
        const orighOption = Object.assign({}, this.options, graphOptions);
        this.options = graphOptions;
        Object.assign(this.options, orighOption);
        this.graphData = graphData;
        this.runtimeDATA4Links = runtimeData.runtimeDATA4Links;
        this.runtimeDATA4ShouldRenderItems = runtimeData.runtimeDATA4ShouldRenderItems;
        this.runtimeDATA4ConnectTargets = runtimeData.runtimeDATA4ConnectTargets;
        this.runtimeDATA4NodeMap = runtimeData.runtimeDATA4NodeMap;
        this.runtimeDATA4LinkMap = runtimeData.runtimeDATA4LinkMap;
        this.runtimeDATA4ElLineTargets = runtimeData.runtimeDATA4ElLineTargets;
        this.updateViewHook = (commits: DataCommits) => {
            // console.log('###########updateViewHook');
            if (commits.optionsChanged) {
                this.dataStores.store4Options.set(this.getOptions());
                // this.dataStores.store4Options.set({...this.getOptions()});
                // console.log('[updateViewHook]optionsChanged');
            }
            if (commits.nodesListChanged) {
                this.dataStores.store4ShouldRenderNodes.set(this.getShouldRenderNodes());
                // console.log('[updateViewHook]nodesListChanged');
            }
            if (commits.linesListChanged) {
                const lines = this.getShouldRenderLines();
                this.dataStores.store4ShouldRenderLines.set(lines);
                // console.log('[updateViewHook]linesListChanged');
            }
            if (commits.fakeLinesListChanged) {
                const lines = this.getShouldRenderFakeLines();
                this.dataStores.store4ShouldRenderFakeLines.set(lines);
                // console.log('[updateViewHook]fakeLinesListChanged');
            }
        };
    }
}
