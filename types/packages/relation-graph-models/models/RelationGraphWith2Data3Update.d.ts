import { JsonLine, JsonNode, RGFakeLine, RGJsonData, RGLine, RGLink, RGNode } from '../../types';
import { RelationGraphWith2Data2Analysis } from './RelationGraphWith2Data2Analysis';
/**
 * API class related to data (nodes, lines, etc.) updates in the relation-graph component, providing operations such as adding, deleting, and modifying graph data
 */
export declare class RelationGraphWith2Data3Update extends RelationGraphWith2Data2Analysis {
    constructor();
    /**
     * Remove a line
     * @param line
     */
    removeLine(line: RGLine): void;
    /**
     * Remove multiple lines
     * @param lines
     */
    removeLines(lines: RGLine[]): void;
    /**
     * Remove line by lineId
     * @param lineId
     */
    removeLineById(lineId: string): void;
    /**
     * Remove multiple lines by lineIds
     * @param lineIds
     */
    removeLineByIds(lineIds: string[]): void;
    /**
     * Remove a fake line
     * @param line
     */
    removeFakeLine(line: RGFakeLine): void;
    /**
     * Remove a fake line by lineId
     * @param lineId
     */
    removeFakeLineById(lineId: string): void;
    /**
     * Remove a link
     * @param link
     */
    removeLink(link: RGLink): void;
    /**
     * Remove a link by lineId
     * @param lineId
     */
    removeLinkByLineId(lineId: string): void;
    /**
     * Remove node by nodeId
     * @param nodeId
     */
    removeNodeById(nodeId: string): void;
    /**
     * Remove multiple nodes by nodeIds
     * @param nodeIds
     */
    removeNodesByIds(nodeIds: string[]): void;
    /**
     * Remove multiple nodes
     * @param nodes
     */
    removeNodes(nodes: RGNode[]): void;
    /**
     * Remove a node
     * @param node
     */
    removeNode(node: RGNode): void;
    /**
     * @deprecated Use removeFakeLineById instead of removeELementLineById, this method is compatible with older api versions.
     * @param elementLineId
     */
    removeELementLineById(elementLineId: string): void;
    /**
     * Add a node
     * @param node
     */
    addNode(node: JsonNode): void;
    /**
     * Add multiple nodes
     * @param nodes
     */
    addNodes(nodes: JsonNode[]): void;
    /**
     * Add a line
     * @param line
     */
    addLine(line: JsonLine): void;
    /**
     * Add multiple lines
     * @param lines
     */
    addLines(lines: JsonLine[]): void;
    /**
     * @inner
     * @protected
     */
    protected _addFakeLines(lines: JsonLine[]): void;
    /**
     * Add multiple fake lines
     * @param lines
     */
    addFakeLines(lines: JsonLine[]): void;
    private _elLineUpdateTimer;
    /**
     * Update the position information of all element lines
     * - Generally, there is no need to call this method, relation-graph will automatically call this method to update the position information of element lines at appropriate times. This method is only for special scenarios.
     */
    updateElementLines(): void;
    /**
     * @inner
     * @private
     */
    private _updateElementLines;
    /**
     * @inner
     * @private
     */
    private _updateCanvasBoxInfo;
    /**
     * @inner
     * @private
     */
    private updateElementTarget;
    private _canvasCurrentInfo;
    /**
     * @inner
     * @private
     */
    private _getElementTargetPosition;
    /**
     * Add multiple element lines
     * @deprecated Please use addFakeLines instead of addElementLines, this method is compatible with older api versions.
     * @param lines
     */
    addElementLines(lines: JsonLine[]): void;
    private _nodeResizeEffectTimer;
    /**
     * @inner
     * @private
     */
    protected updateNodeOffsetSize(nodeId: string, width: number, height: number): void;
    /**
     * Clear all fake lines
     */
    clearFakeLines(): void;
    /**
     * Clear all element lines
     * @deprecated Please use clearFakeLines instead of clearElementLines, this method is compatible with older api versions.
     */
    clearElementLines(): void;
    protected prevAddNodeTimestamp: number;
    /**
     * Convert JsonNode to RGNode object and add it to the graph
     * @inner
     * @param _nodes
     * @protected
     */
    protected _addNodes(_nodes: JsonNode[]): void;
    /**
     * Convert JsonLine to RGLine object and add it to the graph
     * @inner
     * @param _lines
     * @protected
     */
    protected _addLines(_lines: JsonLine[]): void;
    /**
     * Modify node property values, you only need to pass in the properties you want to modify, and the properties that are not passed in will remain unchanged
     * @param nodeOrId RGNode object or nodeId
     * @param nodeProperties
     */
    updateNode(nodeOrId: RGNode | string, nodeProperties: Partial<RGNode>): void;
    /**
     * Modify node position
     * @param nodeOrId RGNode object or nodeId
     * @param x
     * @param y
     */
    updateNodePosition(nodeOrId: RGNode | string, x: number, y: number): void;
    /**
     * Modify the specified attribute values in node.data. It is a shortcut method, equivalent to:
     * ```ts
     *         this.updateNode(node.id, {
     *             data: {...node.data, ...nodeData}
     *         });
     *  ```
     * @param nodeOrId RGNode object or nodeId
     * @param nodeData
     *
     */
    updateNodeData(nodeOrId: RGNode | string, nodeData: Record<string, any>): void;
    /**
     * Modify line property values, you only need to pass in the properties you want to modify, and the properties that are not passed in will remain unchanged
     * @param lineOrId RGLine object or lineId
     * @param lineProperties
     */
    updateLine(lineOrId: string | RGLine, lineProperties: Partial<RGLine>): void;
    /**
     * Modify the specified attribute values in line.data. It is a shortcut method, equivalent to:
     * ```ts
     *         this.updateLine(line.id, {
     *             data: {...line.data, ...lineData}
     *         });
     *  ```
     * @param lineOrId RGLine object or lineId
     * @param lineData
     */
    updateLineData(lineOrId: string | RGLine, lineData: Record<string, any>): void;
    /**
     * Modify fake line property values, you only need to pass in the properties you want to modify, and the properties that are not passed in will remain unchanged
     * @param lineOrId RGLine object or lineId
     * @param lineProperties
     */
    updateFakeLine(lineOrId: string | RGLine, lineProperties: Partial<RGFakeLine>): void;
    /**
     * Expand tree-structured data into flattened data
     * @param orign_nodes Tree-structured data, e.g., [{id:'a',children:[{id:'a-1'},{id:'a-1', children: [{id:'a-1-1'}]}]}]
     * @param parentNode Please pass null
     * @param nodes_collect All expanded nodes will be stored here
     * @param lines_collect All expanded lines will be stored here
     */
    flatNodeData(orign_nodes: JsonNode[], parentNode: JsonNode | null, nodes_collect: JsonNode[], lines_collect: JsonLine[]): void;
    private _nodesElSizeMap;
    private backupNodesElSize;
    /**
     * @inner
     * @param jsonData
     * @protected
     */
    protected loadGraphJsonData(jsonData: RGJsonData): void;
    /**
     * Recalculate all visible nodes
     * relation-graph外部无需调用这个方法，因为当你修改数据后，relation-graph会自动调用这个方法
     * @inner
     * @param force
     */
    protected updateShouldRenderGraphData(force?: boolean): void;
    /**
     * Update the visible property of nodes
     *  - When you expand/collapse nodes, there is no need to call this method outside of relation-graph, because relation-graph will automatically call this method. However, when you directly modify the visibility property of a node (for example, if you modify a node's parent node to be hidden, then you need to call this method to make the child node invisible), you need to call this method to update the visibility of the nodes.
     * @param nodes
     */
    updateNodesVisibleProperty(nodes?: RGNode[]): void;
    /**
     * @inner
     */
    updateVisibleNodesSize(): void;
    /**
     * @inner
     * @protected
     */
    protected _clearGraph(): void;
    /**
     * @inner
     * @param jsonData
     * @param resetViewSize
     * @protected
     */
    protected _setJsonData(jsonData: RGJsonData, resetViewSize?: boolean): void;
}
