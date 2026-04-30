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
        // this.graphData = graphData;
        // this.runtimeDATA4Links = runtimeData.runtimeDATA4Links;
        // this.runtimeDATA4ShouldRenderItems = runtimeData.runtimeDATA4ShouldRenderItems;
        // this.runtimeDATA4ConnectTargets = runtimeData.runtimeDATA4ConnectTargets;
        // this.runtimeDATA4NodeMap = runtimeData.runtimeDATA4NodeMap;
        // this.runtimeDATA4LinkMap = runtimeData.runtimeDATA4LinkMap;
        // this.runtimeDATA4ElLineTargets = runtimeData.runtimeDATA4ElLineTargets;
        // const orighOption = Object.assign({}, this.options, graphOptions);
        // this.options = graphOptions;
        // Object.assign(this.options, orighOption);
        this.updateViewHook = (commits: DataCommits) => {
            // console.log('###########updateViewHook');
            if (commits.optionsChanged) {
                this.dataStores.store4Options.set({...this.getOptions()});
                // console.log('[updateViewHook]optionsChanged');
            }
            if (commits.nodesListChanged || commits.changedNodes.length > 0) {
                // if (commits.changedNodes.length > 0) {
                //     const nodes = this.getShouldRenderNodes();
                //     const staticNodes = nodes.filter(n => !commits.changedNodes.includes(n.id));
                //     const changedNodes = nodes.filter(n => commits.changedNodes.includes(n.id)).map(n => ({...n}));
                //     this.dataStores.store4ShouldRenderNodes.set([...staticNodes, ...changedNodes]);
                //     console.log('[updateViewHook]changedNodes:', commits.changedNodes.length);
                // } else {
                    this.dataStores.store4ShouldRenderNodes.set([...this.getShouldRenderNodes()]);
                    // console.log('[updateViewHook]nodesListChanged');
                // }
            }
            if (commits.linesListChanged || commits.changedLines.length > 0) {
                const lines = this.getShouldRenderLines().map((line: RGLine) => ({...line}));
                this.dataStores.store4ShouldRenderLines.set(lines);
                // console.log('[updateViewHook]linesListChanged');
            // } else if (commits.changedLines.length > 0) {
            //     this.dataStores.store4ShouldRenderLines.set([...this.getShouldRenderLines()]);
            //     console.log('[updateViewHook]changedLines:', commits.changedLines.length);
            }
            if (commits.fakeLinesListChanged || commits.changedFakeLines.length > 0) {
                const lines = this.getFakeLines().map((line: RGLine) => ({...line}));
                // if (commits.changedFakeLines.length > 0) {
                //     const fakeLines = this.getFakeLines();
                //     const staticLines = fakeLines.filter(n => !commits.changedFakeLines.includes(n.id));
                //     const changedLines = fakeLines.filter(n => commits.changedFakeLines.includes(n.id)).map(n => ({...n}));
                //     this.dataStores.store4ShouldRenderFakeLines.set([...staticLines, ...changedLines]);
                //     console.log('[updateViewHook]changedFakeLines:', commits.changedNodes.length);
                // } else {
                    this.dataStores.store4ShouldRenderFakeLines.set(lines);
                    // console.log('[updateViewHook]fakeLinesListChanged');
                // }
            }
        };
    }
}
