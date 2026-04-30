import {devLog} from '../utils/RGCommon';
import {json2Node} from '../data/RGNodeDataUtils';
import {json2Line} from '../data/RGLineDataUtils';
import {
    JsonLine,
    JsonNode,
    RGEventNames, RGFakeLine,
    RGInnerConnectTargetType,
    RGJsonData,
    RGLine, RGLineTarget,
    RGLink,
    RGNode
} from '../../types';
import RGNodesAnalytic from '../utils/RGNodesAnalytic';
import {RelationGraphWith2Data2Analysis} from "./RelationGraphWith2Data2Analysis";

/**
 * API class related to data (nodes, lines, etc.) updates in the relation-graph component, providing operations such as adding, deleting, and modifying graph data
 */
export class RelationGraphWith2Data3Update extends RelationGraphWith2Data2Analysis {
    constructor() {
        super();
    }

    /**
     * Remove a line
     * @param line
     */
    removeLine(line: RGLine) {
        this.removeLines([line]);
    }

    /**
     * Remove multiple lines
     * @param lines
     */
    removeLines(lines: RGLine[]) {
        this.removeLineByIds(lines.map(l => l.id));
    }

    /**
     * Remove line by lineId
     * @param lineId
     */
    removeLineById(lineId: string) {
        this.removeLineByIds([lineId]);
    }

    /**
     * Remove multiple lines by lineIds
     * @param lineIds
     */
    removeLineByIds(lineIds: string[]) {
        this.dataProvider.removeLineByIds(lineIds);
        this._dataUpdated();
    }

    /**
     * Remove a fake line
     * @param line
     */
    removeFakeLine(line: RGFakeLine) {
        this.removeFakeLineById(line.id);
    }

    /**
     * Remove a fake line by lineId
     * @param lineId
     */
    removeFakeLineById(lineId: string) {
        devLog('removeLineById:', lineId);
        this.dataProvider.removeFakeLineByIds([lineId]);
        this._dataUpdated();
    }

    /**
     * Remove a link
     * @param link
     */
    removeLink(link: RGLink) {
        devLog('removeLink:', link);
        this.removeLinkByLineId(link.lineId);
    }

    /**
     * Remove a link by lineId
     * @param lineId
     */
    removeLinkByLineId(lineId: string) {
        // Deleting the line will automatically delete the related link
        this.dataProvider.removeLineByIds([lineId]);
        this._dataUpdated();
    }

    /**
     * Remove node by nodeId
     * @param nodeId
     */
    removeNodeById(nodeId: string) {
        this.dataProvider.removeNodeById([nodeId]);
        this._dataUpdated();
    }

    /**
     * Remove multiple nodes by nodeIds
     * @param nodeIds
     */
    removeNodesByIds(nodeIds: string[]) {
        this.dataProvider.removeNodeById(nodeIds);
        // this.updateShouldRenderGraphData(true);
        this._dataUpdated();
    }

    /**
     * Remove multiple nodes
     * @param nodes
     */
    removeNodes(nodes: RGNode[]) {
        this.removeNodesByIds(nodes.map(n => n.id));
    }

    /**
     * Remove a node
     * @param node
     */
    removeNode(node: RGNode) {
        this.removeNodes([node]);
    }

    /**
     * @deprecated Use removeFakeLineById instead of removeELementLineById, this method is compatible with older api versions.
     * @param elementLineId
     */
    removeELementLineById(elementLineId: string) {
        devLog('removeELementLineById:', elementLineId);
        this.removeFakeLineById(elementLineId);
    }

    /**
     * Add a node
     * @param node
     */
    addNode(node: JsonNode) {
        devLog('addNode:', node);
        // 判断 lines 是否是数组
        if (node && Array.isArray(node)) {
            console.error('addNode: node is array:', node);
            return;
        }
        this._addNodes([node]);
        this._dataUpdated();
    }

    /**
     * Add multiple nodes
     * @param nodes
     */
    addNodes(nodes: JsonNode[]) {
        devLog('addNodes:', nodes);
        // 判断 lines 是否是数组
        if (nodes && !Array.isArray(nodes)) {
            console.error('addNodes: nodes is not array:', nodes);
            return;
        }
        this._addNodes(nodes);
        this._dataUpdated();
    }

    /**
     * Add a line
     * @param line
     */
    addLine(line: JsonLine) {
        devLog('addLine:', line);
        // 判断 lines 是否是数组
        if (line && Array.isArray(line)) {
            console.error('addLine: line is array:', line);
            return;
        }
        this.addLines([line]);
    }

    /**
     * Add multiple lines
     * @param lines
     */
    addLines(lines: JsonLine[]) {
        devLog('addLines:', lines);
        // 判断 lines 是否是数组
        if (lines && !Array.isArray(lines)) {
            console.error('addLines: lines is not array:', lines);
            return;
        }
        // 判断是否是空数组
        if (lines.length === 0) {
            // console.error('addLines: lines is empty array:', lines);
            return;
        }
        const allNormalLines = lines.filter(line => !line.isFakeLine);
        this._addLines(allNormalLines);
        const allFakeLines = lines.filter(line => line.isFakeLine);
        this.addFakeLines(allFakeLines);
        this._dataUpdated();
    }

    /**
     * @inner
     * @protected
     */
    protected _addFakeLines(lines: JsonLine[]) {
        this.dataProvider.addFakeLines(lines);
    }

    /**
     * Add multiple fake lines
     * @param lines
     */
    addFakeLines(lines: JsonLine[]) {
        devLog('addFakeLines:', lines);
        this._addFakeLines(lines);
        // setTimeout(() => {
        //     this._dataUpdated();
        //     setTimeout(() => {
        //         this._dataUpdated();
        //     }, 300);
        // }, 100);
        this._dataUpdated();
    }

    private _elLineUpdateTimer;

    /**
     * Update the position information of all element lines
     * - Generally, there is no need to call this method, relation-graph will automatically call this method to update the position information of element lines at appropriate times. This method is only for special scenarios.
     */
    updateElementLines() {
        // console.error('xx');
        if (this.dataProvider.getElLineTargets().length === 0) {
            return;
        }
        devLog('updateElementLines:runtimeDATA4ElLineTargets:', this.dataProvider.getElLineTargets().length);
        if (this._elLineUpdateTimer) clearTimeout(this._elLineUpdateTimer);
        this._elLineUpdateTimer = setTimeout(() => {
            this._updateElementLines();
            this._dataUpdated();
        }, 100);
    }

    /**
     * @inner
     * @private
     */
    private _updateElementLines() {
        this._updateCanvasBoxInfo();
        for (const elementTarget of this.dataProvider.getElLineTargets()) {
            this.updateElementTarget(elementTarget);
        }
    }
    /**
     * @inner
     * @private
     */
    private _updateCanvasBoxInfo() {
        const canvasBox = this.$canvasDom.getBoundingClientRect();
        this._canvasCurrentInfo.x = canvasBox.x;
        this._canvasCurrentInfo.y = canvasBox.y;
        this._canvasCurrentInfo.scale = (this.dataProvider.getOptions().canvasZoom / 100);
    }
    /**
     * @inner
     * @private
     */
    private updateElementTarget(elementTarget: RGLineTarget) {
        const position = this._getElementTargetPosition(document.getElementById(elementTarget.id!), elementTarget);
        if (position) {
            this.dataProvider.updateElLineTarget(elementTarget.id, {
                hidden: false,
                ...position
            });
        } else {
            this.dataProvider.updateElLineTarget(elementTarget.id, {
                hidden: true
            });
        }
    }
    private _canvasCurrentInfo = {x: 0, y: 0, scale: 1};
    /**
     * @inner
     * @private
     */
    private _getElementTargetPosition(el: HTMLElement): Partial<RGLineTarget>|undefined {
        if (!el) {
            return null;
        }
        const box = el.getBoundingClientRect();
        const x = (box.x - this._canvasCurrentInfo.x) / this._canvasCurrentInfo.scale;
        const y = (box.y - this._canvasCurrentInfo.y) / this._canvasCurrentInfo.scale;
        const newWidth = box.width / this._canvasCurrentInfo.scale;
        const newHeight = box.height / this._canvasCurrentInfo.scale;
        return {
            x,
            y,
            el_W: newWidth,
            el_H: newHeight
        }
    }

    /**
     * Add multiple element lines
     * @deprecated Please use addFakeLines instead of addElementLines, this method is compatible with older api versions.
     * @param lines
     */
    addElementLines(lines: JsonLine[]) {
        devLog('addElementLines:', lines);
        lines.forEach(thisLineJson => {
            thisLineJson.fromType = RGInnerConnectTargetType.HTMLElementId;
            thisLineJson.toType = RGInnerConnectTargetType.HTMLElementId;
            // thisLineJson.type = 'fake-line';
            thisLineJson.isFakeLine = true;
            if (!thisLineJson.id) thisLineJson.id = this.generateNewUUID(6);
            thisLineJson.forDisplayOnly = true;
        });
        this.addFakeLines(lines);
        // console.log('addElementLines:', lines.length, lines);
        this.updateElementLines();
    }
    private _nodeResizeEffectTimer;
    /**
     * @inner
     * @private
     */
    protected  updateNodeOffsetSize(nodeId: string, width: number, height: number) {
        const rgNode = this.getNodeById(nodeId);
        if (!rgNode) {
            // console.warn('Node not found for resize handling:', nodeId);
            return;
        }
        const _ow = rgNode.el_W;
        const _oh = rgNode.el_H;
        if (_ow !== width || _oh !== height) {
            this.dataProvider.updateNode(nodeId, {
                el_W: width,
                el_H: height
            });
            if (this._nodeResizeEffectTimer) {
                clearTimeout(this._nodeResizeEffectTimer);
            }
            this._nodeResizeEffectTimer = setTimeout(() => {
                this._dataUpdated();
            }, 100);
        }
    }

    /**
     * Clear all fake lines
     */
    clearFakeLines() {
        this.dataProvider.clearFakeLines();
        this._dataUpdated();
    }

    /**
     * Clear all element lines
     * @deprecated Please use clearFakeLines instead of clearElementLines, this method is compatible with older api versions.
     */
    clearElementLines() {
        const lineIds = [];
        for (const fakeLine of this.getFakeLines()) {
            if (fakeLine.fromType === RGInnerConnectTargetType.HTMLElementId || fakeLine.toType === RGInnerConnectTargetType.HTMLElementId) {
                lineIds.push(fakeLine.id);
            }
        }
        this.dataProvider.removeFakeLineByIds(lineIds);
        this._dataUpdated();
    }

    protected prevAddNodeTimestamp = 0;
    /**
     * Convert JsonNode to RGNode object and add it to the graph
     * @inner
     * @param _nodes
     * @protected
     */
    protected _addNodes(_nodes: JsonNode[]) {
        this.emitEvent(RGEventNames.beforeAddNodes, _nodes);
        const nodeMap = {};
        this.getNodes().forEach(n => {
            nodeMap[n.id] = n;
        });
        const newNodes: RGNode[] = [];
        const graphOptions = this.getOptions();
        _nodes.forEach(thisNodeJson => {
            let thisNode = nodeMap[thisNodeJson.id];
            if (!thisNode) {
                let {text, id} = thisNodeJson;
                if (!text && thisNodeJson.label) {
                    text = thisNodeJson.label;
                    console.warn('Use "label" as "text":', thisNodeJson.label);
                }
                if (text === undefined && id) {
                    text = id;
                    console.warn('Use "id" as "text":', id);
                }
                thisNode = json2Node(Object.assign({}, thisNodeJson, {text}), graphOptions, this._nodesElSizeMap);
                this._initRawPropertyFn && this._initRawPropertyFn(thisNode, 'lot', thisNode.lot);
                if (thisNode) {
                    nodeMap[thisNode.id] = thisNode;
                    newNodes.push(thisNode);
                }
            }
        });
        this.dataProvider.addNodes(newNodes);
        if (newNodes.length > 0) {
            this.prevAddNodeTimestamp = Date.now();
        }
    }

    /**
     * Convert JsonLine to RGLine object and add it to the graph
     * @inner
     * @param _lines
     * @protected
     */
    protected _addLines(_lines: JsonLine[]) {
        this.emitEvent(RGEventNames.beforeAddLines, _lines);
        const newLines: RGLine[] = [];
        _lines.forEach(thisLineJson => {
            let {from, to, text} = thisLineJson;
            if (!from) {
                if (thisLineJson.source) {
                    from = thisLineJson.source;
                    console.warn('Use "source" as "from":', thisLineJson.source);
                } else {
                    console.error('JsonLine Must have field:"from"', thisLineJson);
                    return;
                }
            }
            if (!to) {
                if (thisLineJson.target) {
                    to = thisLineJson.target;
                    console.warn('Use "target" as "to":', thisLineJson.target);
                } else {
                    console.error('JsonLine Must have field:"to"', thisLineJson);
                    return;
                }
            }
            if (!text) {
                if (thisLineJson.label) {
                    text = thisLineJson.label;
                    console.warn('Use "label" as "text":', thisLineJson.label);
                }
            }
            const fromNode = this.getNodeById(from);
            if (!fromNode) {
                console.error('Can not found from node:', thisLineJson);
                return;
            }
            const toNode = this.getNodeById(to);
            if (!toNode) {
                console.error('Can not found to node:', thisLineJson);
                return;
            }
            if (thisLineJson.id) {
                const oldLine = this.getLineById(thisLineJson.id);
                if (oldLine) {
                    console.warn('_addLines:skip duplicate line id:', thisLineJson.id);
                    return;
                } else if (newLines.some(l => l.id === thisLineJson.id)) {
                    console.warn('Duplicate line id in new lines:', thisLineJson.id);
                    return;
                }
            } else {
                thisLineJson.id = 'L-' + this.generateNewUUID(6);
            }
            const newRGLine = json2Line(Object.assign({}, thisLineJson, {from, to, text}), this.getOptions());
            newLines.push(newRGLine);
        });
        this.dataProvider.addLines(newLines);
    }

    /**
     * Modify node property values, you only need to pass in the properties you want to modify, and the properties that are not passed in will remain unchanged
     * @param nodeOrId RGNode object or nodeId
     * @param nodeProperties
     */
    updateNode(nodeOrId: RGNode | string, nodeProperties: Partial<RGNode>) {
        this.dataProvider.updateNode(typeof nodeOrId === 'string' ? nodeOrId :  nodeOrId.id, nodeProperties);
        this._dataUpdated();
    }

    /**
     * Modify node position
     * @param nodeOrId RGNode object or nodeId
     * @param x
     * @param y
     */
    updateNodePosition(nodeOrId: RGNode | string, x: number, y: number) {
        const nodeId = typeof nodeOrId === 'string' ? nodeOrId :  nodeOrId.id;
        this.dataProvider.updateNode(nodeId, { x, y });
        if (this.getOptions().layout.autoLayouting) { // 如果正在力学布局，则让力学布局器使用节点最新的位置（因为力学布局器中用于计算的x,y是缓存）
            this.layoutor?.syncNodePosition(nodeId, x, y);
        }
        this._dataUpdated();
    }

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
    updateNodeData(nodeOrId: RGNode | string, nodeData: Record<string, any>) {
        this.dataProvider.updateNodeData(typeof nodeOrId === 'string' ? nodeOrId :  nodeOrId.id, nodeData);
        this._dataUpdated();
    }

    /**
     * Modify line property values, you only need to pass in the properties you want to modify, and the properties that are not passed in will remain unchanged
     * @param lineOrId RGLine object or lineId
     * @param lineProperties
     */
    updateLine(lineOrId: string | RGLine, lineProperties: Partial<RGLine>) {
        this.dataProvider.updateLine(typeof lineOrId === 'string' ? lineOrId :  lineOrId.id, lineProperties);
        this._dataUpdated();
    }

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
    updateLineData(lineOrId: string | RGLine, lineData: Record<string, any>) {
        this.dataProvider.updateLineData(typeof lineOrId === 'string' ? lineOrId :  lineOrId.id, lineData);
        this._dataUpdated();
    }

    /**
     * Modify fake line property values, you only need to pass in the properties you want to modify, and the properties that are not passed in will remain unchanged
     * @param lineOrId RGLine object or lineId
     * @param lineProperties
     */
    updateFakeLine(lineOrId: string | RGLine, lineProperties: Partial<RGFakeLine>) {
        this.dataProvider.updateFakeLine(typeof lineOrId === 'string' ? lineOrId :  lineOrId.id, lineProperties);
        this._dataUpdated();
    }
    /**
     * Expand tree-structured data into flattened data
     * @param orign_nodes Tree-structured data, e.g., [{id:'a',children:[{id:'a-1'},{id:'a-1', children: [{id:'a-1-1'}]}]}]
     * @param parentNode Please pass null
     * @param nodes_collect All expanded nodes will be stored here
     * @param lines_collect All expanded lines will be stored here
     */
    flatNodeData(orign_nodes: JsonNode[], parentNode: JsonNode | null, nodes_collect: JsonNode[], lines_collect: JsonLine[]) {
        RGNodesAnalytic.flatNodeData(orign_nodes, parentNode, nodes_collect, lines_collect);
    }
    private _nodesElSizeMap = new Map<string, [number, number]>();
    private backupNodesElSize() {
        for (const node of this.getNodes()) {
            this._nodesElSizeMap.set(node.id, [node.el_W, node.el_H]);
        }
    }
    /**
     * @inner
     * @param jsonData
     * @protected
     */
    protected loadGraphJsonData(jsonData: RGJsonData) {
        // 兼容以前的配置
        if (!jsonData.lines) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jsonData.lines = jsonData.relations;
            if (jsonData.lines) {
                console.warn('[relation-graph] For compatibility with older version, Use jsonData.relations as jsonData.lines, It is recommended that you define your data using');
            }
        }
        if (!jsonData.lines) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jsonData.lines = jsonData.links || jsonData.edges;
            if (jsonData.lines) {
                console.warn('[relation-graph] For compatibility with older version, Use jsonData.links/jsonData.edges as jsonData.lines, It is recommended that you define your data using');
            }
        }
        const _orign_nodes = jsonData.nodes || [];
        const _orign_lines = jsonData.lines || [];
        const _nodes: JsonNode[] = [];
        const _lines: JsonLine[] = [];
        // 自动转换tree data
        this.flatNodeData(_orign_nodes, null, _nodes, _lines);
        _orign_lines.forEach(orign_link => {
            _lines.push(orign_link);
        });
        this._addNodes(_nodes);
        devLog('Nodes is initialized');
        this._addLines(_lines);
        this._dataUpdated();
        jsonData.fakeLines && this.addFakeLines(jsonData.fakeLines);
        setTimeout(() => {
            if (jsonData.elementLines) {
                console.warn('elementLines is deprecated, please use fakeLines with isFakeLine and fromType/toType = RGInnerConnectTargetType.HTMLElementId instead:', jsonData.elementLines);
                this.addElementLines(jsonData.elementLines);
            }
            this._dataUpdated();
        }, 500);
    }

    /**
     * Recalculate all visible nodes
     * relation-graph外部无需调用这个方法，因为当你修改数据后，relation-graph会自动调用这个方法
     * @inner
     * @param force
     */
    protected updateShouldRenderGraphData(force = false) {
        // console.log('updateShouldRenderGraphData:');
        if (!force) {
            if (!this.dataProvider.isPerformanceMode()) {
                return;
            }
            // if (this.options.showEasyView) {
            //   return;
            // }
        }
        this.dataProvider.updateShouldRenderGraphData();
    }

    /**
     * Update the visible property of nodes
     *  - When you expand/collapse nodes, there is no need to call this method outside of relation-graph, because relation-graph will automatically call this method. However, when you directly modify the visibility property of a node (for example, if you modify a node's parent node to be hidden, then you need to call this method to make the child node invisible), you need to call this method to update the visibility of the nodes.
     * @param nodes
     */
    updateNodesVisibleProperty(nodes?: RGNode[]) {
        this.dataProvider.updateNodesVisibleProperty(nodes);
    }

    /**
     * @inner
     */
    updateVisibleNodesSize() {
        for (const node of this.getShouldRenderNodes()) {
            const nodeEl = this.getNodeElByNodeId(node.id);
            if (nodeEl) {
                this._onNodeDomResize(nodeEl, nodeEl.clientWidth, nodeEl.clientHeight);
            }
        }
    }

    /**
     * @inner
     * @protected
     */
    protected _clearGraph() {
        this.backupNodesElSize();
        this.dataProvider.clearReactiveData();
        this.dataProvider.clearChecked();
        this.dataProvider.setEditingLine(null);
        this.dataProvider.setEditingNodes([]);
    }

    /**
     * @inner
     * @param jsonData
     * @param resetViewSize
     * @protected
     */
    protected _setJsonData(jsonData: RGJsonData, resetViewSize = false) {
        this._clearGraph();
        this.loadGraphJsonData(jsonData);
    }
}
