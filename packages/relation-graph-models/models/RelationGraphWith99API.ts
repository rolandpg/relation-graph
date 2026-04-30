import {JsonLine, JsonNode, RGJsonData, RGLine, RGLink, RGNode, RGOptions, RGOptionsFull, RGRectTarget} from '../../types';
import {devLog} from '../utils/RGCommon';
import {RelationGraphWith95Dom} from "./RelationGraphWith95Dom";
import {type RGTransNodeToJsonOptions, transNodeToJson} from "../data/RGNodeDataUtils";
import {type RGTransLineToJsonOptions, transLineToJson, transLinkToJson} from "../data/RGLineDataUtils";

/**
 * Additional API methods provided by the relation-graph component
 */
export class RelationGraphWith99API extends RelationGraphWith95Dom {
    constructor() {
        super();
    }

    /**
     * Call this method to notify the relation-graph component to update when the data changes
     * - In general, there is no need to call this method manually, the relation-graph component will automatically monitor data changes and update, but in some special cases, you may need to call this method manually to ensure that the relation-graph component updates the display correctly.
     */
    dataUpdated() {
        this._requestDataUpdate();
    }

    /**
     * Set the configuration options of the relation-graph component, you need to set the configuration items you want to modify through options
     * @param options RGOptions The configuration items that need to be modified, no need to pass in a complete object
     *
     */
    setOptions(options: RGOptions) {
        devLog('setOptions:', options)
        this._updateOptions(options);
        this._dataUpdated();
    }

    /**
     * Update the configuration options of the relation-graph component, you only need to pass in the configuration items you want to modify
     * @param options Partial<RGOptions> The configuration items that need to be modified, no need to pass in a complete object
     */
    updateOptions(options: Partial<RGOptions>) {
        devLog('updateOptions:', options)
        this._updateOptions(options);
        this._dataUpdated();
    }

    /**
     * Move the canvas to the center position based on the distribution of nodes
     * @param nodes Optional parameter, specify a group of nodes or rectangle target objects. If this parameter is not passed in, all nodes in the current graph are used by default.
     *
     */
    moveToCenter(nodes?: (RGNode | RGRectTarget)[]) {
        this._moveToCenter(nodes);
        this._dataUpdated();
    }

    /**
     * relation-graph internal call, please do not use externally
     * @inner
     */
    transToLinker(newValue = true) {
        this._rgAsConnectArea = newValue;
        this.resetViewSize();
        this.updateCanvasConnectTargetsPosition('Linker');
        this.removeKeyboardListener();
        if (!this._rgAsConnectArea) {
            this.addKeyboardListener();
        }
        this._dataUpdated();
    }

    /**
     * Set the root node ID of the graph
     * - After setting the root node, it only affects the layout starting point when calling the graphInstance.doLayout() method subsequently.
     * @param rootNodeId The specified root node ID
     */
    setRootNodeId(rootNodeId: string) {
        devLog('setRootNodeId:', rootNodeId)
        this.dataProvider.setRootNodeId(rootNodeId);
    }

    /**
     * Get the root node object set in the current graph
     */
    getRootNode() {
        return this.dataProvider.getRootNode();
    }

    /**
     * Get the currently selected node object in the graph
     */
    getCheckedNode() {
        return this.getNodeById(this.getOptions().checkedNodeId);
    }

    /**
     * Get the currently selected line object in the graph
     */
    getCheckedLine() {
        const line = this.getLineById(this.getOptions().checkedLineId);
        if (line) {
            return line;
        } else {
            return this.getFakeLineById(this.getOptions().checkedLineId);
        }
    }

    /**
     * Get all selected nodes in the graph
     */
    getSelectedNodes() {
        return this.getNodes().filter(node => node.selected);
    }

    /**
     * Get all editing nodes in the graph
     */
    getEditingNodes() {
        return [...this.getOptions().editingController.nodes];
    }

    /**
     * Set the entire data of the graph, and perform layout based on the rootId in the data
     * - Use options.layout as the layout options
     * @param jsonData
     */
    async setJsonData(jsonData: RGJsonData) {
        this._setJsonData(jsonData);
        await this.doLayout(jsonData.rootId);
    }

    /**
     * Append data to the graph
     * @param jsonData
     * @param isRelayout Whether to re-layout after appending data
     */
    async appendJsonData(jsonData: RGJsonData, isRelayout = true) {
        devLog('appendData:', jsonData);
        this.loadGraphJsonData(jsonData);
        if (isRelayout) {
            await this.doLayout();
        }
    }

    /**
     * Apply initial data to the graph, centering and zooming to fit
     * @param initialData
     */
    async applyInitialData(initialData: RGJsonData) {
        devLog('applyInitialData:', initialData)
        await this.setJsonData(initialData);
        this.moveToCenter();
        this.zoomToFit();
    }
    /**
     * Get all nodes and lines json data in the current graph.
     * @param graphJsonData: RGJsonData
     */
    getGraphJsonData(): RGJsonData {
        const _nodes: JsonNode[] = [];
        const _lines: JsonLine[] = [];
        const _fakeLines: JsonLine[] = [];
        this.getNodes().forEach(thisNode => {
            const jsonNode = transNodeToJson(thisNode);
            if (jsonNode) {
                _nodes.push(jsonNode);
            }
        });
        this.getLines().forEach(thisLine => {
            const jsonLine = transLineToJson(thisLine);
            if (jsonLine) {
                _lines.push(jsonLine);
            }
        });
        this.getFakeLines().forEach(thisLine => {
            const jsonLine = transLineToJson(thisLine);
            if (jsonLine) {
                _fakeLines.push(jsonLine);
            }
        });
        const jsonData = {
            rootId: this.dataProvider.getRootNode()?.id || '',
            nodes: _nodes,
            lines: _lines
        };
        if (_fakeLines.length > 0) {
            jsonData.fakeLines = _fakeLines;
        }
        return jsonData;
    }

    /**
     * Convert an RGNode object to a JSON-serializable object
     * @param nodeJson: JsonNode
     */
    transRGNodeToJsonObject(node: RGNode, options: RGTransNodeToJsonOptions = {}): JsonNode {
        const resolvedOptions = options.mode === 'effective' && !options.graphOptions ? {
            ...options,
            graphOptions: this.getOptions()
        } : options;
        return transNodeToJson(node, resolvedOptions)!;
    }

    /**
     * Convert an RGLink object to a JSON-serializable object
     * @param lines: JsonLine
     */
    transRGLinkToJsonObject(link: RGLink, options: RGTransLineToJsonOptions = {}): JsonLine {
        const resolvedOptions = options.mode === 'effective' && !options.graphOptions ? {
            ...options,
            graphOptions: this.getOptions()
        } : options;
        return transLinkToJson(link, resolvedOptions)!;
    }

    /**
     * Convert an RGLine object to a JSON-serializable object
     * @param lineJson: JsonLine
     */
    transRGLineToJsonObject(line: RGLine, options: RGTransLineToJsonOptions = {}): JsonLine {
        const resolvedOptions = options.mode === 'effective' && !options.graphOptions ? {
            ...options,
            graphOptions: this.getOptions()
        } : options;
        return transLineToJson(line, resolvedOptions)!;
    }
    /**
     * Get the configuration information of the current graph
     */
    getGraphJsonOptions() {
        const _options = {};
        const _ignore = [
            'layouter', 'layoutor', 'autoLayouting', 'canvasNVInfo', 'canvasOffset', 'canvasZoom', 'fullscreen', 'instanceId', 'layoutClassName', 'layoutDirection',
            'layoutLabel', 'layoutName', 'resetViewSize', 'viewELSize', 'viewNVInfo', 'viewSize', 'canvasSize',
            'newLinkTemplate', 'newLineTemplate', 'newNodeTemplate'
        ];
        const options = this.getOptions();
        Object.keys(options).forEach(thisKey => {
            if (!_ignore.includes(thisKey)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _options[thisKey] = options[thisKey];
            }
        });
        return _options;
    }

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
    clearGraph() {
        this._clearGraph();
        this._dataUpdated();
    }
    /**
     * Print the current graph configuration information to the console
     */
    printOptions() {
        const objectData = this.getGraphJsonOptions();
        // console.log('options:', objectData);
        // console.log('options-json-string:');
        // console.log(JSON.stringify(objectData));
    }

    /**
     * Print all data of the current graph to the console
     */
    printData() {
        const objectData = this.getGraphJsonData();
        // console.log('data:', objectData);
        // console.log('data-json-string:');
        // console.log(JSON.stringify(objectData));
    }

    /**
     * Print the current graph configuration and JSON data to the console
     */
    printGraphJsonData() {
        this.printOptions();
        this.printData();
    }

}
