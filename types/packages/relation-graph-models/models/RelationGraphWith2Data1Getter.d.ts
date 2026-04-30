import { RGFakeLine, RGLine, RGLink, RGNode } from '../../types';
import { RelationGraphWith2Data } from './RelationGraphWith2Data';
/**
 * The instance class of the relation-graph component, providing read-only API methods based on data
 */
export declare class RelationGraphWith2Data1Getter extends RelationGraphWith2Data {
    constructor();
    /**
     * Get current options
     * @return options RGOptionsFull
     */
    getOptions(): import('../../types').RGOptionsFull;
    /**
     * Get node by nodeId
     * @param nodeId
     * @return RGNode | undefined
     */
    getNodeById(nodeId: string): RGNode | undefined;
    /**
     * Get line by lineId
     * @param lineId
     * @return RGLine | undefined
     */
    getLineById(lineId: string): RGLine | undefined;
    /**
     * Get link by lineId
     * @param lineId
     * @return RGLink | undefined
     */
    getLinkByLineId(lineId: string): RGLink | undefined;
    /**
     * Get link by line
     * @param line
     * @return RGLink | undefined
     */
    getLinkByLine(line: RGLine): RGLink | undefined;
    /**
     * Get all lines
     * @return RGLine[]
     */
    getLines(): RGLine[];
    /**
     * @deprecated Please use getFakeLineById instead of getElementLineById, this method is compatible with older api versions.
     * @param elLineId
     */
    getElementLineById(elLineId: string): RGFakeLine | undefined;
    /**
     * @deprecated Please use getFakeLines instead of getElementLines, this method is compatible with older api versions.
     */
    getElementLines(): RGLine[];
    /**
     * Get all fake lines
     * @return RGFakeLine[]
     */
    getFakeLines(): RGFakeLine[];
    /**
     * Get fake line by lineId
     * @param lineId
     * @return RGFakeLine | undefined
     */
    getFakeLineById(lineId: string): RGFakeLine | undefined;
    /**
     * Get all nodes
     * @return RGNode[]
     */
    getNodes(): RGNode[];
    /**
     * Get all links
     * @return RGLink[]
     */
    getLinks(): RGLink[];
    /**
     * Get all links, Inlcuding fakeLine links
     * @return RGLink[]
     */
    protected _getAllLinks(): RGLink[];
    private getNodeByTargetId;
    protected _getFakeLineLinks(): RGLink[];
    /**
     * Get all connect targets
     * @return RGLineTarget[]
     */
    getConnectTargets(): import('../../types').RGConnectTargetData[];
    getConnectTargetById(targetId: string): import('../../types').RGConnectTargetData | undefined;
}
