import {devLog} from '../utils/RGCommon';
import {
    RGFakeLine,
    RGLine,
    RGLink,
    RGNode,
    RGNodesRectBox,
    RGRectTarget,
    RGSelectionView
} from '../../types';
import RGNodesAnalytic from '../utils/RGNodesAnalytic';
import {RelationGraphWith2Data1Getter} from "./RelationGraphWith2Data1Getter";

/**
 * The relation-graph component class related to data analysis functions
 */
export class RelationGraphWith2Data2Analysis extends RelationGraphWith2Data1Getter {
    constructor() {
        super();
    }

    /**
     * Get all lines related to the given node
     * - e.g.
     * ```
     * A --> B
     * A --> C
     * D --> A
     * getRelatedLinesByNode(A) will return [A-->B, A-->C, D-->A]
     * ```
     * @param node
     */
    getRelatedLinesByNode(node: RGNode): RGLine[] {
        const lines: RGLine[] = [];
        for (const link of this._getAllLinks()) {
            if (node === link.fromNode || node === link.toNode) {
                lines.push(link.line);
            }
        }
        return lines;
    }

    /**
     * Get all links between the given nodes
     * - e.g.
     * ```
     * A --> B
     * A --> C
     * B --> C
     * D --> E
     * getLinksBetweenNodes([A,B,C]) will return [A-->B, A-->C, B-->C]
     * ```
     * @param nodes
     */
    getLinksBetweenNodes(nodes: RGNode[]): RGLink[] {
        const links: RGLink[] = [];
        // const allLinks = this.getLinks();
        const allLinks = this._getAllLinks();
        for (const link of allLinks) {
            if (nodes.includes(link.fromNode) && nodes.includes(link.toNode)) {
                links.push(link);
            }
        }
        return links;
    }

    /**
     * Get all lines between the given nodes
     * - e.g.
     * ```
     * A --> B
     * A --> C
     * B --> C
     * D --> E
     * getLinesBetweenNodes([A,B,C]) will return [A-->B, A-->C, B-->C]
     * ```
     * @param nodes
     */
    getLinesBetweenNodes(nodes: RGNode[]): RGLine[] {
        return this.getLinksBetweenNodes(nodes).map(link => link.line);
    }

    /**
     * Get all nodes that have a direct relationship with the given node
     * - e.g.
     * ```
     * A --> X
     * B --> X
     * C --> X
     * X --> F
     * X --> M
     * getNodeRelatedNodes(X) will return [A,B,C,F,M]
     * ```
     * @param node
     * @param options
     * @return RGNode[]
     */
    getNodeRelatedNodes(node: RGNode, options: {
        incoming: boolean,
        outgoing: boolean,
    } = {
        incoming: true,
        outgoing: true
    }): RGNode[] {
        const relatedNodes: RGNode[] = [];
        for (const link of this.getLinks()) {
            if (link.line.forDisplayOnly) {
                continue;
            }
            const {fromNode, toNode} = link;
            if (options.outgoing) {
                if (fromNode === node) {
                    if (!relatedNodes.includes(toNode)) relatedNodes.push(toNode);
                }
            }
            if (options.incoming) {
                if (toNode === node) {
                    if (!relatedNodes.includes(fromNode)) relatedNodes.push(fromNode);
                }
            }
        }
        for (const fakeLineLink of this._getFakeLineLinks()) {
            if (fakeLineLink.line.forDisplayOnly) {
                continue;
            }
            const {fromNode, toNode} = fakeLineLink;
            if (options.outgoing) {
                if (fromNode === node) {
                    if (!relatedNodes.includes(toNode)) relatedNodes.push(toNode);
                }
            }
            if (options.incoming) {
                if (toNode === node) {
                    if (!relatedNodes.includes(fromNode)) relatedNodes.push(fromNode);
                }
            }
        }
        return relatedNodes;
    }
    /**
     * Get all nodes that have an incoming relationship to the given node
     * - e.g.
     * ```
     * A --> X
     * B --> X
     * C --> X
     * X --> F
     * X --> M
     * getNodeIncomingNodes(X) will return [A,B,C]
     * ```
     * @param node
     */
    getNodeIncomingNodes(node: RGNode): RGNode[] {
        return this.getNodeRelatedNodes(node, {incoming:true, outgoing:false});
    }

    /**
     * Get all nodes that have an outgoing relationship from the given node
     * - e.g.
     * ```
     * A --> X
     * B --> X
     * C --> X
     * X --> F
     * X --> M
     * getNodeOutgoingNodes(X) will return [F,M]
     * ```
     * @param node
     */
    getNodeOutgoingNodes(node: RGNode): RGNode[] {
        return this.getNodeRelatedNodes(node, {incoming:false, outgoing:true});
    }

    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @deprecated Please use getNetworkNodesByNode instead
     */
    findGroupNodes(node: RGNode, groupNodes: RGNode[] = []) {
        return this._getNetworkNodesByNode(node, groupNodes);
    }

    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @deprecated Please use getNetworkNodesByNode instead
     */
    getGroupNodesByNode(node: RGNode, groupNodes: RGNode[] = []) {
        return this._getNetworkNodesByNode(node, groupNodes);
    }

    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @param node
     * @param networkNodes
     */
    getNetworkNodesByNode(node: RGNode) {
        return this._getNetworkNodesByNode(node);
    }
    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @param node
     * @param networkNodes
     */
    private _getNetworkNodesByNode(node: RGNode, networkNodes: RGNode[] = []) {
        if (!node) {
            throw new Error('Call graphInstance.getNetworkNodesByNode:error: node is undefined');
        }
        if (!networkNodes.includes(node)) networkNodes.push(node);
        for (const thisNode of this.getNodeRelatedNodes(node)) {
            if (!networkNodes.includes(thisNode)) {
                this._getNetworkNodesByNode(thisNode, networkNodes);
            }
        }
        return networkNodes;
    }

    /**
     * @deprecated
     * @param nodes
     * @protected
     */
    protected getStuffSize(nodes?: (RGNode | RGRectTarget)[]) {
        console.warn('Please use getNodesRectBox instead of getStuffSize, this method is compatible with older api versions.');
        return this.getNodesRectBox(nodes);
    }

    /**
     * @deprecated
     * @param nodes
     * @protected
     */
    protected getNodesViewInfo(nodes?: (RGNode | RGRectTarget)[]) {
        console.warn('Please use getNodesRectBox instead of getNodesViewInfo, this method is compatible with older api versions.');
        return this.getNodesRectBox(nodes);
    }

    /**
     * Calculate the plane space information occupied by all nodes
     * @param nodes Optional, if not specified, it will be calculated based on all nodes
     */
    getNodesRectBox(nodes?: (RGNode | RGRectTarget)[]): RGNodesRectBox {
        const nodesForCalc = nodes || this.getNodes();
        const visiableNodes = nodesForCalc.filter(node => {
            return node.rgCalcedVisibility !== false;
        });
        if (visiableNodes.length === 0) {
            return {
                width: 10,
                height: 10,
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0
            };
        }
        let minX = 9999999;
        let minY = 9999999;
        let maxX = -9999999;
        let maxY = -9999999;
        visiableNodes.forEach(thisNode => {
            if (thisNode.x < minX) {
                minX = thisNode.x;
            }
            const nodeMaxX = thisNode.x + (thisNode.width || thisNode.el_W)
            if (nodeMaxX > maxX) {
                maxX = thisNode.x + (thisNode.width || thisNode.el_W);
            }
            if (thisNode.y < minY) {
                minY = thisNode.y;
            }
            const nodeMaxY = thisNode.y + (thisNode.height || thisNode.el_H)
            if (nodeMaxY > maxY) {
                maxY = nodeMaxY;
            }
        });
        const _stuff_width = maxX - minX;
        const _stuff_height = maxY - minY;
        return {
            width: _stuff_width < 0 ? 0 : _stuff_width,
            height: _stuff_height < 0 ? 0 : _stuff_height,
            minX: minX === 9999999 ? 0 : minX,
            minY: minY === 9999999 ? 0 : minY,
            maxX: maxX === -9999999 ? 0 : maxX,
            maxY: maxY === -9999999 ? 0 : maxY
        };
    }

    /**
     * Get the center coordinates of the plane space occupied by the node collection
     * @param nodes Optional, if not specified, it will be calculated based on all nodes
     */
    getNodesCenter(nodes?: (RGNode | RGRectTarget)[]) {
        const stuffSize = this.getNodesRectBox(nodes);
        devLog('getNodesCenter:', stuffSize);
        const x = (stuffSize.minX + (stuffSize.maxX - stuffSize.minX) / 2);
        const y = (stuffSize.minY + (stuffSize.maxY - stuffSize.minY) / 2);
        return {
            x,
            y
        };
    }

    /**
     * Get all descendant nodes in the relationship network where the node is located. Descendant nodes are completely calculated based on the connection relationship and the root node used by the current layout (for the same node, using different root nodes for layout will result in different descendants).
     * @return All descendant nodes
     */
    getDescendantNodes(node: RGNode) {
        return RGNodesAnalytic.getDescendantNodes(node);
    }

    /**
     * Get nodes within the selection area
     * - This method is generally used in conjunction with the onCanvasSelectionEnd event, where you can obtain information about the selection area through the event's parameters.
     * - After obtaining the nodes within this area, you can use the graphInstance.getLinesBetweenNodes(nodesInSelection) method to get the lines between the nodes in the area.
     * @param selectionView The position and size of the selection area in the view
     * @return Nodes within the selection area
     */
    getNodesInSelectionView(selectionView: RGSelectionView) {
        const startCoordinateOnCanvas = this.getCanvasXyByViewXy({
            x: selectionView.x,
            y: selectionView.y
        });
        const endCoordinateOnCanvas = this.getCanvasXyByViewXy({
            x: selectionView.x + selectionView.width,
            y: selectionView.y + selectionView.height
        });
        const nodes: RGNode[] = [];
        this.getNodes().forEach(node => {
            const nodeCenterX = node.x + node.el_W / 2;
            const nodeCenterY = node.y + node.el_H / 2;
            if (nodeCenterX > startCoordinateOnCanvas.x && nodeCenterY > startCoordinateOnCanvas.y) {
                if (nodeCenterX < endCoordinateOnCanvas.x && nodeCenterY < endCoordinateOnCanvas.y) {
                    nodes.push(node);
                }
            }
        });
        return nodes;
    }

    /**
     * Get the list of nodes to be rendered, this method is used internally by relation-graph
     * - To get the list of nodes to be rendered outside the <relation-graph> component, please use hook: const { shouldRenderNodes } = useGraphStore();
     * This allows you to get reactive data and let the data drive your UI
     * @param nodes
     * @return RGNode[]
     */
    getShouldRenderNodes(nodes?: (RGNode | RGRectTarget)[]): RGNode[] {
        if (this.dataProvider.isPerformanceMode()) {
            if (nodes) {
                return nodes as RGNode[];
            }
        }
        return this.dataProvider.getShouldRenderNodes() as RGNode[];
    }

    /**
     * Get the list of lines to be rendered, this method is used internally by relation-graph
     - To get the list of lines to be rendered outside the <relation-graph> component, please use hook: const { shouldRenderLines } = useGraphStore();
     * This allows you to get reactive data and let the data drive your UI
     * @param lines
     * @return RGLine[]
     */
    getShouldRenderLines(lines?: RGLine[]) {
        if (this.dataProvider.isPerformanceMode()) {
            if (lines) {
                return lines;
            }
        }
        return this.dataProvider.getShouldRenderLines();
    }

    /**
     * Get the list of fake lines to be rendered, this method is used internally by relation-graph
     - To get the list of fake lines to be rendered outside the <relation-graph> component, please use hook: const { shouldRenderFakeLines } = useGraphStore();
     * This allows you to get reactive data and let the data drive your UI
     * @param fakeLines
     * @return RGFakeLine[]
     */
    getShouldRenderFakeLines(fakeLines?: RGFakeLine[]) {
        if (this.dataProvider.isPerformanceMode()) {
            if (fakeLines) {
                return fakeLines;
            }
        }
        return this.dataProvider.getShouldRenderFakeLines();
    }
}
