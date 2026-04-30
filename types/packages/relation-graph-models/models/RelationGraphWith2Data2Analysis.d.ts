import { RGFakeLine, RGLine, RGLink, RGNode, RGNodesRectBox, RGRectTarget, RGSelectionView } from '../../types';
import { RelationGraphWith2Data1Getter } from './RelationGraphWith2Data1Getter';
/**
 * The relation-graph component class related to data analysis functions
 */
export declare class RelationGraphWith2Data2Analysis extends RelationGraphWith2Data1Getter {
    constructor();
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
    getRelatedLinesByNode(node: RGNode): RGLine[];
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
    getLinksBetweenNodes(nodes: RGNode[]): RGLink[];
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
    getLinesBetweenNodes(nodes: RGNode[]): RGLine[];
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
    getNodeRelatedNodes(node: RGNode, options?: {
        incoming: boolean;
        outgoing: boolean;
    }): RGNode[];
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
    getNodeIncomingNodes(node: RGNode): RGNode[];
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
    getNodeOutgoingNodes(node: RGNode): RGNode[];
    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @deprecated Please use getNetworkNodesByNode instead
     */
    findGroupNodes(node: RGNode, groupNodes?: RGNode[]): RGNode[];
    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @deprecated Please use getNetworkNodesByNode instead
     */
    getGroupNodesByNode(node: RGNode, groupNodes?: RGNode[]): RGNode[];
    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @param node
     * @param networkNodes
     */
    getNetworkNodesByNode(node: RGNode): RGNode[];
    /**
     * Get all nodes that have a direct or indirect relationship with a given node
     * @param node
     * @param networkNodes
     */
    private _getNetworkNodesByNode;
    /**
     * @deprecated
     * @param nodes
     * @protected
     */
    protected getStuffSize(nodes?: (RGNode | RGRectTarget)[]): RGNodesRectBox;
    /**
     * @deprecated
     * @param nodes
     * @protected
     */
    protected getNodesViewInfo(nodes?: (RGNode | RGRectTarget)[]): RGNodesRectBox;
    /**
     * Calculate the plane space information occupied by all nodes
     * @param nodes Optional, if not specified, it will be calculated based on all nodes
     */
    getNodesRectBox(nodes?: (RGNode | RGRectTarget)[]): RGNodesRectBox;
    /**
     * Get the center coordinates of the plane space occupied by the node collection
     * @param nodes Optional, if not specified, it will be calculated based on all nodes
     */
    getNodesCenter(nodes?: (RGNode | RGRectTarget)[]): {
        x: number;
        y: number;
    };
    /**
     * Get all descendant nodes in the relationship network where the node is located. Descendant nodes are completely calculated based on the connection relationship and the root node used by the current layout (for the same node, using different root nodes for layout will result in different descendants).
     * @return All descendant nodes
     */
    getDescendantNodes(node: RGNode): RGNode[];
    /**
     * Get nodes within the selection area
     * - This method is generally used in conjunction with the onCanvasSelectionEnd event, where you can obtain information about the selection area through the event's parameters.
     * - After obtaining the nodes within this area, you can use the graphInstance.getLinesBetweenNodes(nodesInSelection) method to get the lines between the nodes in the area.
     * @param selectionView The position and size of the selection area in the view
     * @return Nodes within the selection area
     */
    getNodesInSelectionView(selectionView: RGSelectionView): RGNode[];
    /**
     * Get the list of nodes to be rendered, this method is used internally by relation-graph
     * - To get the list of nodes to be rendered outside the <relation-graph> component, please use hook: const { shouldRenderNodes } = useGraphStore();
     * This allows you to get reactive data and let the data drive your UI
     * @param nodes
     * @return RGNode[]
     */
    getShouldRenderNodes(nodes?: (RGNode | RGRectTarget)[]): RGNode[];
    /**
     * Get the list of lines to be rendered, this method is used internally by relation-graph
     - To get the list of lines to be rendered outside the <relation-graph> component, please use hook: const { shouldRenderLines } = useGraphStore();
     * This allows you to get reactive data and let the data drive your UI
     * @param lines
     * @return RGLine[]
     */
    getShouldRenderLines(lines?: RGLine[]): RGLine[];
    /**
     * Get the list of fake lines to be rendered, this method is used internally by relation-graph
     - To get the list of fake lines to be rendered outside the <relation-graph> component, please use hook: const { shouldRenderFakeLines } = useGraphStore();
     * This allows you to get reactive data and let the data drive your UI
     * @param fakeLines
     * @return RGFakeLine[]
     */
    getShouldRenderFakeLines(fakeLines?: RGFakeLine[]): RGFakeLine[];
}
