import { RGNode, RGLine, RGFakeLine, RGConnectTargetData, RGCoordinate } from '../../types';
import { RGDataDefine } from './RGDataDefine';
/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export declare class RGDataGetter extends RGDataDefine {
    constructor();
    getOptions(): import('../../types').RGOptionsFull;
    /**
     * Get the node object by node id
     * @param nodeId: RGNode
     */
    getNodeById(nodeId: string): RGNode | undefined;
    getLineById(lineId: string): RGLine | undefined;
    getLinkByLineId(lineId: string): import('../../types').RGLink | undefined;
    getFakeLineById(lineId: string): RGFakeLine | undefined;
    getNodes(): RGNode[];
    getLinks(): import('../../types').RGLink[];
    getFakeLines(): RGFakeLine[];
    getLines(): RGLine[];
    getRootNode(): RGNode | undefined;
    getShouldRenderNodes(): RGNode[];
    getShouldRenderLines(): RGLine[];
    getShouldRenderFakeLines(): RGFakeLine[];
    isPerformanceMode(): boolean;
    getCanvasScale(): number;
    getConnectTargets(): RGConnectTargetData[];
    getConnectTargetById(targetId: string): RGConnectTargetData | undefined;
    getElLineTargets(): import('../../types').RGLineTarget[];
    getElLineTargetById(elId: string): import('../../types').RGLineTarget | undefined;
    calcShouldRenderNodes(): RGNode[];
    calcShouldRenderLines(): RGLine[];
    calcShouldRenderFakeLines(): RGFakeLine[];
    findNodeByXy(xy: RGCoordinate): RGNode | null;
}
