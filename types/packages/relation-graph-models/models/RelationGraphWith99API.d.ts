import { JsonLine, JsonNode, RGJsonData, RGLine, RGLink, RGNode, RGOptions, RGRectTarget } from '../../types';
import { RelationGraphWith95Dom } from './RelationGraphWith95Dom';
/**
 * Additional API methods provided by the relation-graph component
 */
export declare class RelationGraphWith99API extends RelationGraphWith95Dom {
    constructor();
    /**
     * Call this method to notify the relation-graph component to update when the data changes
     * - In general, there is no need to call this method manually, the relation-graph component will automatically monitor data changes and update, but in some special cases, you may need to call this method manually to ensure that the relation-graph component updates the display correctly.
     */
    dataUpdated(): void;
    /**
     * Set the configuration options of the relation-graph component, you need to set the configuration items you want to modify through options
     * @param options RGOptions The configuration items that need to be modified, no need to pass in a complete object
     *
     */
    setOptions(options: RGOptions): void;
    /**
     * Update the configuration options of the relation-graph component, you only need to pass in the configuration items you want to modify
     * @param options Partial<RGOptions> The configuration items that need to be modified, no need to pass in a complete object
     */
    updateOptions(options: Partial<RGOptions>): void;
    /**
     * Move the canvas to the center position based on the distribution of nodes
     * @param nodes Optional parameter, specify a group of nodes or rectangle target objects. If this parameter is not passed in, all nodes in the current graph are used by default.
     *
     */
    moveToCenter(nodes?: (RGNode | RGRectTarget)[]): void;
    /**
     * relation-graph internal call, please do not use externally
     * @inner
     */
    transToLinker(newValue?: boolean): void;
    /**
     * Set the root node ID of the graph
     * - After setting the root node, it only affects the layout starting point when calling the graphInstance.doLayout() method subsequently.
     * @param rootNodeId The specified root node ID
     */
    setRootNodeId(rootNodeId: string): void;
    /**
     * Get the root node object set in the current graph
     */
    getRootNode(): RGNode | undefined;
    /**
     * Get the currently selected node object in the graph
     */
    getCheckedNode(): RGNode | undefined;
    /**
     * Get the currently selected line object in the graph
     */
    getCheckedLine(): RGLine | import('../../types').RGFakeLine | undefined;
    /**
     * Get all selected nodes in the graph
     */
    getSelectedNodes(): RGNode[];
    /**
     * Get all editing nodes in the graph
     */
    getEditingNodes(): RGNode[];
    /**
     * Set the entire data of the graph, and perform layout based on the rootId in the data
     * - Use options.layout as the layout options
     * @param jsonData
     */
    setJsonData(jsonData: RGJsonData): Promise<void>;
    /**
     * Append data to the graph
     * @param jsonData
     * @param isRelayout Whether to re-layout after appending data
     */
    appendJsonData(jsonData: RGJsonData, isRelayout?: boolean): Promise<void>;
    /**
     * Apply initial data to the graph, centering and zooming to fit
     * @param initialData
     */
    applyInitialData(initialData: RGJsonData): Promise<void>;
    /**
     * Get all nodes and lines json data in the current graph.
     * @param graphJsonData: RGJsonData
     */
    getGraphJsonData(): RGJsonData;
    /**
     * Convert an RGNode object to a JSON-serializable object
     * @param nodeJson: JsonNode
     */
    transRGNodeToJsonObject(node: RGNode): JsonNode;
    /**
     * Convert an RGLink object to a JSON-serializable object
     * @param lines: JsonLine
     */
    transRGLinkToJsonObject(link: RGLink): JsonLine;
    /**
     * Convert an RGLine object to a JSON-serializable object
     * @param lineJson: JsonLine
     */
    transRGLineToJsonObject(line: RGLine): JsonLine;
    /**
     * Get the configuration information of the current graph
     */
    getGraphJsonOptions(): {};
    /**
     *  Clear the current graph data
     *  - Including:
     *  - All node data
     *  - All line data
     *  - All fake line data
     *  - Reset root node ID
     *  - Reset selected elements
     *  - Reset editing elements
     */
    clearGraph(): void;
    /**
     * Print the current graph configuration information to the console
     */
    printOptions(): void;
    /**
     * Print all data of the current graph to the console
     */
    printData(): void;
    /**
     * Print the current graph configuration and JSON data to the console
     */
    printGraphJsonData(): void;
}
