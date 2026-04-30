import {
    RGGraphData,
    RGNode,
    RGLine,
    RGLink,
    RGOptionsFull,
    JsonLine,
    RGFakeLine,
    RGConnectTargetData,
    RGLineTarget, RGInnerConnectTargetType
} from '../../types';
import {RGDataGetter} from "./RGDataGetter";
import {devLog, generateNewUUID} from "../utils/RGCommon";
import {EdgeCounter} from "./utils/EdgeCounter";
import {json2Line} from "./RGLineDataUtils";
import RGNodesAnalytic from "../utils/RGNodesAnalytic";
import {createDefaultConfig} from "./RGOptionsDataUtils";

export type DataCommits = {
    optionsChanged: boolean,
    changedNodes: string[],
    nodesListChanged: boolean,
    changedLines: string[],
    linesListChanged: boolean,
    changedFakeLines: string[],
    fakeLinesListChanged: boolean,
    changedConnectTargets: string[],
    connectTargetsListChanged: boolean
}
/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export class RGDataProvider extends RGDataGetter{
    private commits:DataCommits;
    constructor() {
        super();
        this.options = createDefaultConfig({});
        this.commits = this.resetCommints();
    }
    /**
     * Clear all data in RelationGraph, including nodes, lines, element lines, and the root node
     */
    public clearReactiveData() {
        this.graphData.nodes = [];
        this.graphData.normalLines = [];
        this.graphData.fakeLines = [];
        this.runtimeDATA4Links.splice(0, this.runtimeDATA4Links.length);
        this.runtimeDATA4ElLineTargets.splice(0, this.runtimeDATA4ElLineTargets.length);
        // this.runtimeDATA4ConnectTargets.splice(0, this.runtimeDATA4ElLineTargets.length);
        this.runtimeDATA4NodeMap.clear();
        this.runtimeDATA4LinkMap.clear();
        // this.runtimeDATA4ShouldRenderItems = []; // 它会在数据发生变化是自动更新
        this.graphData.rootNode = undefined;
        this.updateShouldRenderGraphData();
        this.commits.optionsChanged = true;
        this.commits.nodesListChanged = true;
        this.commits.linesListChanged = true;
        this.commits.fakeLinesListChanged = true;
    }

    /**
     * Protected method, For react only
     */
    updateViewHook = (commits: DataCommits)=> {};
    private resetCommints(): DataCommits {
        return {
            optionsChanged: false,
            changedNodes: [],
            nodesListChanged: false,
            changedLines: [],
            linesListChanged: false,
            changedFakeLines: [],
            fakeLinesListChanged: false,
            changedConnectTargets: [],
            connectTargetsListChanged: false,
        }
    }
    private commitLine(lineId: string) {
        // if (!this.commits.changedLines.includes(lineId)) {
        //     this.commits.changedLines.push(lineId);
        // }
        this.commits.linesListChanged = true; // todo xxxx
    }
    private commitNode(nodeId: string) {
        if (!this.commits.changedNodes.includes(nodeId)) {
            this.commits.changedNodes.push(nodeId);
            // const lines = this.getLines().filter(line => line.from === nodeId || line.to === nodeId);
            // lines.forEach(line => {
            //    this.commitLine(line.id);
            // });
        }
        // this.commits.nodesListChanged = true; // todo xxxx
        this.commits.linesListChanged = true; // todo xxxx
        this.commits.fakeLinesListChanged = true; // todo xxxx
    }
    private commitFakeLine(lineId: string) {
        // if (!this.commits.changedFakeLines.includes(lineId)) {
        //     this.commits.changedFakeLines.push(lineId);
        // }
        this.commits.fakeLinesListChanged = true; // todo xxxx
    }
    private commitConnectTarget(targetId: string) {
        if (!this.commits.changedConnectTargets.includes(targetId)) {
            this.commits.changedConnectTargets.push(targetId);
        }
        this.commits.fakeLinesListChanged = true; // todo xxxx
    }
    dataUpdated() {
        const startTime = Date.now();
        const commits = this.commits;
        this.commits = this.resetCommints();
        /**
         * Trigger view update
         * - This will be modified to a more refined update mechanism in future versions
         * - but currently in performance mode, full updates do not have any performance issues.
         * - Performance mode is the ultimate solution, no need for overly complex partial update logic, can support larger scale of data, and can always ensure smooth interactive experience.
         * - We will optimize it later, and users do not need to change their usage after optimization.
         */
        this.updateViewHook(commits);
        // console.log('Used time to update view:', Date.now() - startTime, 'ms');
    }
    updateOptions(options: Partial<RGOptionsFull>) {
        // devLog('RGDataProvider:updateOptions:', options);
        if (options.layout) {
            // console.log('RGDataProvider:updateOptions:layout:', options.layout?.layoutName, options.layout);
        }
        Object.assign(this.options, options);
        if (this.isPerformanceMode() && !this.options.showEasyView) {
            const changedKeys = Object.keys(options);
            // console.log('changedKeys:', changedKeys.join(','));
            if (changedKeys.includes('canvasZoom')) {
                this.commits.nodesListChanged = true;
                this.commits.linesListChanged = true;
            }
            if (changedKeys.includes('viewSize')) {
                this.commits.nodesListChanged = true;
                this.commits.linesListChanged = true;
            }
            if (changedKeys.includes('canvasOffset')) {
                this.commits.nodesListChanged = true;
                this.commits.linesListChanged = true;
            }
        }
        this.commits.optionsChanged = true;
    }
    clearChecked() {
        this.updateOptions({
            checkedNodeId: '',
            checkedLineId: '',
        });
    }
    setCanvasOffset(x: number, y: number) {
        this.updateOptions({
            canvasOffset: {
                x, y
            }
        });
        this.commits.optionsChanged = true;
        // this.updateOptions({
        //     canvasOffset: {
        //         ...this.options.canvasOffset,
        //         x, y
        //     }
        // });
    }
    setCanvasZoom(newValue: number) {
        this.updateOptions({
            canvasZoom: newValue
        });
    }
    setEditingLine(line: RGLine | null) {
        if (line) {
            const orighLine = this.getLineById(line.id) || this.getFakeLineById(line.id);
            if (orighLine) {
                this.updateOptions({
                    editingLineController: {
                        ...this.options.editingLineController,
                        line: orighLine,
                        show: true
                    },
                    checkedLineId: line.id
                });
            }
        } else {
            this.updateOptions({
                editingLineController: {
                    ...this.options.editingLineController,
                    line: null,
                    show: false
                },
                checkedLineId: ''
            });
        }
    }
    setEditingNodes(nodes: RGNode[]) {
        for (const node of nodes) {
            if (!node || !this.getNodeById(node.id)) {
                console.error('setEditingNodes Error: node not found:', node);
                return;
            }
        }
        const selectedNodes = this.getNodes().filter(node => node.selected);
        selectedNodes.forEach(node => this.updateNode(node.id, {selected: false}));
        this.updateOptions({
            editingController: {
                ...this.options.editingController,
                nodes,
                show: nodes.length > 0
            }
        });
        if (nodes.length > 1) this.options.editingController.nodes.forEach(node => this.updateNode(node.id, {selected: true}));
    }
    setCanvasCenter(x: number, y: number) {
        const viewX = this.options.viewSize.width / 2;
        const viewY = this.options.viewSize.height / 2;
        const scale = this.options.canvasZoom / 100;
        this.setCanvasOffset(viewX - x * scale, viewY - y * scale);
    }
    removeNodeById(nodeIds: string[]) {
        this.beforeNodeBeRemove(nodeIds);
        let __removed_nodes = 0;
        for (let i = 0; i < this.graphData.nodes.length; i++) {
            if (nodeIds.includes(this.graphData.nodes[i].id)) {
                this.graphData.nodes.splice(i, 1);
                i--;
                __removed_nodes++;
            }
        }
        for (const nodeId of nodeIds) {
            this.runtimeDATA4NodeMap.delete(nodeId);
        }
        devLog('Removed node：', nodeIds, __removed_nodes);
        this.commits.nodesListChanged = true;
    }
    removeLineByIds(lineIds: string[]) {
        devLog('_removeLineByIds:', lineIds.length, lineIds);
        this.removeFakeLineByIds(lineIds);
        let removed = 0;
        for (let i = 0; i < this.graphData.normalLines.length; i++) {
            const thisLine = this.graphData.normalLines[i];
            if (lineIds.includes(thisLine.id)) {
                this.graphData.normalLines.splice(i, 1);
                i--;
                removed++;
            }
        }
        devLog('_removeLineByIds:', removed);
        this.removeLinkByLineIds(lineIds);
        this.updateLinks();
        this.commits.linesListChanged = true;
    }
    removeFakeLineByIds(lineIds: string[]) {
        devLog('_removeFakeLineByIds:', lineIds.length, lineIds);
        let removed = 0;
        for (let i = 0; i < this.graphData.fakeLines.length; i++) {
            const thisLine = this.graphData.fakeLines[i];
            if (lineIds.includes(thisLine.id)) {
                this.graphData.fakeLines.splice(i, 1);
                i--;
                removed++;
            }
        }
        this.commits.fakeLinesListChanged = true;
        devLog('_removeFakeLineByIds:', removed);
    }
    removeLinkByLineIds(lineIds: string[]) {
        devLog('_removeLinkByLineIds:', lineIds.length, lineIds);
        let removed = 0;
        for (let i = 0; i < this.runtimeDATA4Links.length; i++) {
            const link = this.runtimeDATA4Links[i];
            if (lineIds.includes(link.lineId)) {
                this.runtimeDATA4Links.splice(i, 1);
                this.runtimeDATA4LinkMap.delete(link.lineId);
                i--;
                removed++;
            }
        }
        this.commits.fakeLinesListChanged = true;
        devLog('_removeLinkByLineIds:', removed);
    }
    removeConnectTarget(targetId: string) {
        const index = this.runtimeDATA4ConnectTargets.findIndex(n => n.targetId === targetId);
        if (index !== -1) {
            const connectTarget = this.runtimeDATA4ConnectTargets[index];
            if (connectTarget.targetType === RGInnerConnectTargetType.NodePoint || connectTarget.targetType === RGInnerConnectTargetType.CanvasPoint) {
                this.runtimeDATA4ConnectTargets.splice(index, 1);
            }
        }
        this.commits.connectTargetsListChanged = true;
        this.commits.fakeLinesListChanged = true;
    }

    private updateLinks(modifyLinks: RGLink[] = []) {
        const counter = new EdgeCounter();
        for (const link of this.runtimeDATA4Links) {
            const {from, to} = link.line;
            const index = counter.addEdge(from, to);
            if (index !== link.currentLineIndex) {
                link.currentLineIndex = index;
                this.commitLine(link.lineId);
            }
        }
        for (const link of this.runtimeDATA4Links) {
            const {from, to} = link.line;
            const count = counter.getCount(from, to);
            if (count !== link.totalLinesBetweenNodes) {
                link.totalLinesBetweenNodes = count;
                this.commitLine(link.lineId);
            }
        }
        counter.clear();
    }

    private beforeNodeBeRemove(willRemoveNodeIds: string[]) {
        let __removed_links = 0;
        for (let i = 0; i < this.runtimeDATA4Links.length; i++) {
            const thisLink = this.runtimeDATA4Links[i];
            if (willRemoveNodeIds.includes(thisLink.fromNode.id) || willRemoveNodeIds.includes(thisLink.toNode.id)) {
                devLog('Removed Node-line：', thisLink.lineId);
                // this.removeLinkByLineIds([thisLink.lineId]);
                this.removeLineByIds([thisLink.lineId]);
                i--;
                __removed_links++;
            }
        }
        for (let i = 0; i < this.graphData.fakeLines.length; i++) {
            const fakeLine = this.graphData.fakeLines[i];
            let needRemove = false;
            if (fakeLine.fromType === RGInnerConnectTargetType.Node && willRemoveNodeIds.includes(fakeLine.from)) {
                needRemove = true;
            } else if (fakeLine.fromType === RGInnerConnectTargetType.CanvasPoint || fakeLine.fromType === RGInnerConnectTargetType.NodePoint) {
                const connectTarget = this.getConnectTargetById(fakeLine.from);
                if (connectTarget && connectTarget.nodeId && willRemoveNodeIds.includes(connectTarget.nodeId)) {
                    needRemove = true;
                }
            } else if (fakeLine.toType === RGInnerConnectTargetType.CanvasPoint || fakeLine.toType === RGInnerConnectTargetType.NodePoint) {
                const connectTarget = this.getConnectTargetById(fakeLine.to);
                if (connectTarget && connectTarget.nodeId && willRemoveNodeIds.includes(connectTarget.nodeId)) {
                    needRemove = true;
                }
            }
            if (needRemove) {
                this.graphData.fakeLines.splice(i, 1);
                devLog('Removed Node-fakeLine：', fakeLine.id);
                i--;
                this.commits.fakeLinesListChanged = true;
            }
        }
        devLog('Removed Node connect-target：');
        for (let i = 0; i < this.runtimeDATA4ConnectTargets.length; i++) {
            const connectTarget = this.runtimeDATA4ConnectTargets[i];
            if (connectTarget.nodeId && willRemoveNodeIds.includes(connectTarget.nodeId)) {
                this.runtimeDATA4ConnectTargets.splice(i, 1);
                devLog('Removed Node-connect-target：', connectTarget.targetId);
                this.commitConnectTarget(connectTarget.targetId);
                i--;
            }
        }
    }
    addFakeLines(lines: JsonLine[]) {
        for (const line of lines) {
            if (!line.id) {
                // 必须有 id
                console.warn('[relation-graph]Must have id for fake line:', line);
            }
            if (this.graphData.fakeLines.some(n => n.id === line.id)) {
                // 忽略id重复的数据
                console.log('[relation-graph]Ignore duplicate fake line id:', line.id);
            } else {
                line.isFakeLine = true;
                const newLine: RGFakeLine = json2Line(line, this.options);
                // newLine.forDisplayOnly = true;
                // newLine.isFakeLine = true;
                if (!newLine.id) newLine.id = generateNewUUID(6);
                this.graphData.fakeLines.push(newLine);
            }
        }
        this.commits.fakeLinesListChanged = true;
    }

    clearFakeLines() {
        // this.graphData.fakeLines = [];
        this.graphData.fakeLines.splice(0, this.graphData.fakeLines.length);
        // this.graphData.fakeLines = [];
        // this.runtimeDATA4ConnectTargets = [];
        this.commits.fakeLinesListChanged = true;
    }
    addNodes(newNodes: RGNode[]) {
        for (const node of newNodes) {
            this.runtimeDATA4NodeMap.set(node.id, node);
        }
        this.graphData.nodes.push(...newNodes.map(n => this.runtimeDATA4NodeMap.get(n.id)));
        this.commits.nodesListChanged = true;
    }
    addLines(newLines: RGLine[]) {
        this.graphData.normalLines.push(...newLines);
        const newLinks: RGLink[] = [];
        for (const line of newLines) {
            const fromNode = this.getNodeById(line.from);
            const toNode = this.getNodeById(line.to);
            const newLink: RGLink = {
                lineId: line.id,
                line: line,
                fromNode: fromNode,
                toNode: toNode,
                currentLineIndex: 0,
                totalLinesBetweenNodes: 1,
                rgShouldRender: true,
                rgCalcedVisibility: true
            };
            this.runtimeDATA4LinkMap.set(newLink.lineId, newLink);
            newLinks.push(newLink);
        }
        this.runtimeDATA4Links.push(...newLinks.map(link => this.runtimeDATA4LinkMap.get(link.lineId)));
        this.updateLinks();
        this.commits.linesListChanged = true;
    }
    updateNode(nodeId: string, nodeProperties: Partial<RGNode>) {
        const node = this.getNodeById(nodeId);
        if (!node) {
            console.error('Cannot find node to update:', nodeId, nodeProperties);
            return;
        }
        const needUpdateVisibility = nodeProperties.hidden !== undefined && node.hidden !== nodeProperties.hidden;
        Object.assign(node, nodeProperties, {id: nodeId});
        if (needUpdateVisibility) {
            const descendantNodes = RGNodesAnalytic.getDescendantNodes(node);
            this.updateNodesVisibleProperty([node].concat(descendantNodes));
        }
        this.commitNode(nodeId);
    }
    updateNodeData(nodeId: string, nodeData: Record<string, any>) {
        const node = this.getNodeById(nodeId);
        if (!node) {
            console.error('Cannot find node to update:', nodeId);
            return;
        }
        this.updateNode(nodeId, {
            data: Object.assign(node.data || {}, nodeData)
        });
        // this.updateNode(nodeId, {
        //     data: {
        //         ...node.data,
        //         ...nodeData
        //     }
        // });
    }
    updateLine(lineId: string, lineProperties: Partial<RGLine>) {
        const line = this.getLineById(lineId);
        if (!line) {
            // console.error('Cannot find line to update:', lineId, lineProperties);
            this.updateFakeLine(lineId, lineProperties);
            return;
        }
        Object.assign(line, lineProperties, {id: lineId});
        // const needUpdateVisibility = lineProperties.hidden !== undefined && line.hidden !== lineProperties.hidden;
        // if (needUpdateVisibility) {
        //     const link = this.getLinkByLineId(lineId);
        //     if (link) {
        //         link.rgCalcedVisibility = this.calcLinkVisibility(link);
        //     }
        // }
        this.commitLine(lineId);
    }
    updateLineData(lineId: string, lineData: Record<string, any>) {
        const line = this.getLineById(lineId);
        if (!line) {
            console.error('Cannot find line to update:', lineId);
            return;
        }
        this.updateLine(lineId, {
            data: Object.assign(line.data || {}, lineData)
        });
    }
    updateFakeLine(lineId: string, lineProperties: Partial<RGLine>) {
        const line = this.getFakeLineById(lineId);
        if (!line) {
            console.error('Cannot find fakeLine to update:', lineId, lineProperties);
            return;
        }
        // const needUpdateVisibility = lineProperties.hidden !== undefined && line.hidden !== lineProperties.hidden;
        Object.assign(line, lineProperties, {id: lineId});
        // if (needUpdateVisibility) {
        //     const link = this.getLinkByLineId(lineId);
        //     if (link) {
        //         link.rgCalcedVisibility = this.calcLinkVisibility(link);
        //     }
        // }
        this.commitFakeLine(lineId);
    }
    updateConnectTarget(connectTargetId: string, connectTargetProperties: Partial<RGConnectTargetData>) {
        const connectTarget = this.getConnectTargetById(connectTargetId);
        if (!connectTarget) {
            return;
        }
        Object.assign(connectTarget, connectTargetProperties, {targetId: connectTargetId});
        this.commitConnectTarget(connectTargetId);
    }
    updateElLineTarget(elId: string, targetProperties: Partial<RGLineTarget>) {
        const connectTarget = this.getElLineTargetById(elId);
        if (!connectTarget) {
            return;
        }
        Object.assign(connectTarget, targetProperties, {id: elId});
    }
    updateNodesVisibleProperty(nodes?: RGNode[]) {
        let forAll = false;
        if (!nodes) {
            nodes = this.getNodes();
            forAll = true;
        }
        for (const node of nodes) {
            const rgCalcedVisibility = RGNodesAnalytic.isVisibleNode(node);
            if (node.rgCalcedVisibility !== rgCalcedVisibility) {
                node.rgCalcedVisibility = rgCalcedVisibility;
                this.commitNode(node.id);
            }
        }
        for (const link of this.runtimeDATA4Links) {
            let update = forAll || nodes.includes(link.fromNode) || nodes.includes(link.toNode);
            if (update) {
                const rgCalcedVisibility = this.calcLinkVisibility(link);
                // if (link.rgCalcedVisibility !== rgCalcedVisibility) {
                //     link.rgCalcedVisibility = rgCalcedVisibility;
                //     link.line.hidden = !rgCalcedVisibility;
                //     this.commitLine(link.lineId);
                // }
                link.rgCalcedVisibility = rgCalcedVisibility;
                // link.line.hidden = !rgCalcedVisibility;
                this.commitLine(link.lineId);
            }
        }
    }
    private calcLinkVisibility(link: RGLink) {
        return link.fromNode.rgCalcedVisibility && link.toNode.rgCalcedVisibility;
    }
    updateShouldRenderGraphData() {
        const options = this.options;
        const scale = options.canvasZoom / 100;

        const startCoordinateOnCanvas = {
            x: -options.canvasOffset.x / scale,
            y: -options.canvasOffset.y / scale
        };
        const endCoordinateOnCanvas = {
            x: startCoordinateOnCanvas.x + options.viewSize.width / scale,
            y: startCoordinateOnCanvas.y + options.viewSize.height / scale
        };
        const snapshotting = options.snapshotting;
        let shouldRenderNodeSize = 0;
        for (const node of this.getNodes()) {
            let isRenderNode = true;
            if (snapshotting) {
                isRenderNode = true;
            } else if (node.alwaysRender) {
                isRenderNode = true;
            } else {
                if (node.x > endCoordinateOnCanvas.x || node.y > endCoordinateOnCanvas.y) {
                    isRenderNode = false;
                }
                if ((node.x + node.el_W) < startCoordinateOnCanvas.x || (node.y + node.el_H) < startCoordinateOnCanvas.y) {
                    isRenderNode = false;
                }
            }
            node.rgShouldRender = isRenderNode;
            isRenderNode && shouldRenderNodeSize++;
        }
        for (const link of this.runtimeDATA4Links) {
            if (snapshotting) {
                link.rgShouldRender = true;
                continue;
            }
            link.rgShouldRender = (link.fromNode.rgShouldRender || link.toNode.rgShouldRender);
        }
        if (this.options.showEasyView) {
            this.runtimeDATA4ShouldRenderItems.nodes = [];
            this.runtimeDATA4ShouldRenderItems.lines = [];
            this.runtimeDATA4ShouldRenderItems.fakeLines = [];
        } else {
            this.runtimeDATA4ShouldRenderItems.nodes = this.calcShouldRenderNodes();
            this.runtimeDATA4ShouldRenderItems.lines = this.calcShouldRenderLines();
            this.runtimeDATA4ShouldRenderItems.fakeLines = this.calcShouldRenderFakeLines();
        }
    }
    addConnectTarget(newConnectTarget: RGConnectTargetData) {
        this.runtimeDATA4ConnectTargets.push(newConnectTarget);
        this.commits.connectTargetsListChanged = true;
        this.commits.fakeLinesListChanged = true;
        return this.getConnectTargetById(newConnectTarget.targetId);
    }
    addElLineTarget(elementTarget: RGLineTarget) {
        this.runtimeDATA4ElLineTargets.push(elementTarget);
        this.commits.fakeLinesListChanged = true;
    }
    setRootNodeId(rootNodeId: string) {
        this.graphData.rootNode = this.graphData.nodes.find(n => n.id === rootNodeId);
        if (!this.graphData.rootNode) {
            throw new Error('The root node [rootId] is not set! Or cannot get the root node:' + rootNodeId + ', If you don\'t have any nodes to display, you can simply set an invisible node: {id:\'root\', opacity:0}');
        }
    }
}
