import {
    RGFakeLine, RGInnerConnectTargetType,
    RGLine, type RGLink, RGNode
} from '../../types';
import {RelationGraphWith2Data} from "./RelationGraphWith2Data";

/**
 * The instance class of the relation-graph component, providing read-only API methods based on data
 */
export class RelationGraphWith2Data1Getter extends RelationGraphWith2Data {
    constructor() {
        super();
    }

    /**
     * Get current options
     * @return options RGOptionsFull
     */
    getOptions() {
        return this.dataProvider.getOptions();
    }

    /**
     * Get node by nodeId
     * @param nodeId
     * @return RGNode | undefined
     */
    getNodeById(nodeId: string) {
        return this.dataProvider.getNodeById(nodeId);
    }

    /**
     * Get line by lineId
     * @param lineId
     * @return RGLine | undefined
     */
    getLineById(lineId: string) {
        return this.dataProvider.getLineById(lineId);
    }

    /**
     * Get link by lineId
     * @param lineId
     * @return RGLink | undefined
     */
    getLinkByLineId(lineId: string) {
        return this.dataProvider.getLinkByLineId(lineId);
    }

    /**
     * Get link by line
     * @param line
     * @return RGLink | undefined
     */
    getLinkByLine(line: RGLine) {
        return this.getLinkByLineId(line.id!);
    }

    /**
     * Get all lines
     * @return RGLine[]
     */
    getLines(): RGLine[] {
        return this.dataProvider.getLines();
    }
    /**
     * @deprecated Please use getFakeLineById instead of getElementLineById, this method is compatible with older api versions.
     * @param elLineId
     */
    getElementLineById(elLineId: string) {
        return this.getFakeLineById(elLineId);
    }
    /**
     * @deprecated Please use getFakeLines instead of getElementLines, this method is compatible with older api versions.
     */
    getElementLines(): RGLine[] {
        return this.getFakeLines();
    }

    /**
     * Get all fake lines
     * @return RGFakeLine[]
     */
    getFakeLines(): RGFakeLine[] {
        return this.dataProvider.getFakeLines();
    }

    /**
     * Get fake line by lineId
     * @param lineId
     * @return RGFakeLine | undefined
     */
    getFakeLineById(lineId: string) {
        return this.dataProvider.getFakeLineById(lineId);
    }

    /**
     * Get all nodes
     * @return RGNode[]
     */
    getNodes() {
        return this.dataProvider.getNodes();
    }

    /**
     * Get all links
     * @return RGLink[]
     */
    getLinks() {
        return this.dataProvider.getLinks();
    }
    /**
     * Get all links, Inlcuding fakeLine links
     * @return RGLink[]
     */
    protected _getAllLinks() {
        const links = this.getLinks();
        const fakeLines = this._getFakeLineLinks();
        return fakeLines.concat(links);
    }
    private getNodeByTargetId(targetId: string): RGNode | undefined {
        const connectTarget = this.dataProvider.getConnectTargetById(targetId);
        if (connectTarget && connectTarget.nodeId) {
            return this.getNodeById(connectTarget.nodeId);
        }
    }
    protected _getFakeLineLinks() {
        const links: RGLink[] = [];
        // console.error('Processing _getFakeLineLinks:', this.getFakeLines().length, this.dataProvider.graphData, this.dataProvider.graphData.fakeLines);
        for (const fakeLine of this.getFakeLines()) {
            if (fakeLine.forDisplayOnly) {
                continue;
            }
            if ((
                fakeLine.fromType === RGInnerConnectTargetType.Node
                || fakeLine.fromType === RGInnerConnectTargetType.NodePoint
                || fakeLine.fromType === RGInnerConnectTargetType.CanvasPoint
            ) && (
                fakeLine.toType === RGInnerConnectTargetType.Node
                || fakeLine.toType === RGInnerConnectTargetType.NodePoint
                || fakeLine.toType === RGInnerConnectTargetType.CanvasPoint
            )) {
                let fromNode = null;
                let toNode = null;
                if (fakeLine.fromType === RGInnerConnectTargetType.Node) {
                    fromNode = this.getNodeById(fakeLine.from);
                } else if (fakeLine.fromType === RGInnerConnectTargetType.NodePoint || fakeLine.fromType === RGInnerConnectTargetType.CanvasPoint) {
                    fromNode = this.getNodeByTargetId(fakeLine.from);
                }
                if (fakeLine.toType === RGInnerConnectTargetType.Node) {
                    toNode = this.getNodeById(fakeLine.to);
                } else if (fakeLine.toType === RGInnerConnectTargetType.NodePoint || fakeLine.toType === RGInnerConnectTargetType.CanvasPoint) {
                    toNode = this.getNodeByTargetId(fakeLine.to);
                }
                if (fromNode && toNode) {
                    links.push({
                        lineId: fakeLine.id,
                        line: fakeLine,
                        fromNode,
                        toNode,
                        totalLinesBetweenNodes: 1,
                        currentLineIndex: 0,
                        rgShouldRender: true,
                        rgCalcedVisibility: true
                    });
                }
            }
        }
        return links;
    }

    /**
     * Get all connect targets
     * @return RGLineTarget[]
     */
    getConnectTargets() {
        return this.dataProvider.getConnectTargets();
    }
    getConnectTargetById(targetId: string) {
        return this.dataProvider.getConnectTargetById(targetId);
    }
}
