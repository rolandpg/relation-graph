import {
    RGGraphData,
    RGOptions
} from '../../types';
import {RGDataProvider} from "./RGDataProvider";

/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export class RGDataProvider4Vue2 extends RGDataProvider{
    constructor(graphData: RGGraphData, graphOptions:RGOptions, runtimeData: any) {
        super();
        this.graphData = graphData;
        this.runtimeDATA4Links = runtimeData.runtimeDATA4Links;
        this.runtimeDATA4ShouldRenderItems = runtimeData.runtimeDATA4ShouldRenderItems;
        this.runtimeDATA4ConnectTargets = runtimeData.runtimeDATA4ConnectTargets;
        this.runtimeDATA4NodeMap = runtimeData.runtimeDATA4NodeMap;
        this.runtimeDATA4LinkMap = runtimeData.runtimeDATA4LinkMap;
        this.runtimeDATA4ElLineTargets = runtimeData.runtimeDATA4ElLineTargets;
        const orighOption = Object.assign({}, this.options, graphOptions);
        this.options = graphOptions;
        Object.assign(this.options, orighOption);
    }
}
