import { RGGraphData, RGOptions } from '../../types';
import { RGDataProvider } from './RGDataProvider';
/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export declare class RGDataProvider4Vue2 extends RGDataProvider {
    constructor(graphData: RGGraphData, graphOptions: RGOptions, runtimeData: any);
}
