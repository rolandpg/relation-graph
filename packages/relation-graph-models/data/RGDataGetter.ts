import {
    RGNode,
    RGLine,
    RGFakeLine,
    RGConnectTargetData,
    RGCoordinate
} from '../../types';
import {RGDataDefine} from "./RGDataDefine";

/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export class RGDataGetter extends RGDataDefine{
    constructor() {
        super();
    }
    getOptions() {
        return this.options;
    }
    /**
     * Get the node object by node id
     * @param nodeId: RGNode
     */
    getNodeById(nodeId: string) {
        return this.runtimeDATA4NodeMap.get(nodeId);
    }
    getLineById(lineId: string) {
        return this.runtimeDATA4LinkMap.get(lineId)?.line;
    }
    getLinkByLineId(lineId: string) {
        return this.runtimeDATA4LinkMap.get(lineId);
    }
    getFakeLineById(lineId: string) {
        return this.graphData.fakeLines.find(l => l.id === lineId);
    }
    getNodes() {
        return this.graphData.nodes;
    }
    getLinks() {
        return this.runtimeDATA4Links;
    }
    getFakeLines(): RGFakeLine[] {
        return this.graphData.fakeLines;
    }
    getLines(): RGLine[] {
        return this.runtimeDATA4Links.map(link => link.line);
    }
    getRootNode() {
        return this.graphData.rootNode;
    }
    getShouldRenderNodes() {
        if (this.isPerformanceMode()) {
            return this.runtimeDATA4ShouldRenderItems.nodes;
        }
        return this.graphData.nodes;
        // return this.calcShouldRenderNodes();
    }
    getShouldRenderLines() {
        if (this.isPerformanceMode()) {
            return this.runtimeDATA4ShouldRenderItems.lines;
        }
        // return this.calcShouldRenderLines();
        return this.graphData.normalLines;
    }
    getShouldRenderFakeLines() {
        if (this.isPerformanceMode()) {
            return this.runtimeDATA4ShouldRenderItems.fakeLines;
        }
        // return this.calcShouldRenderFakeLines();
        return this.graphData.fakeLines;
    }
    isPerformanceMode() {
        return this.options.performanceMode;
    }
    getCanvasScale() {
        return this.options.canvasZoom / 100;
    }

    getConnectTargets(): RGConnectTargetData[] {
        return this.runtimeDATA4ConnectTargets;
    }
    getConnectTargetById(targetId: string): RGConnectTargetData|undefined {
        if (!targetId) {
            throw new Error('[getConnectTargetById]targetId is empty');
        }
        for (let i = 0; i < this.runtimeDATA4ConnectTargets.length; i++) {
            const n = this.runtimeDATA4ConnectTargets[i];
            if (n.targetId === targetId) {
                return n;
            }
        }
    }
    getElLineTargets() {
        return this.runtimeDATA4ElLineTargets;
    }
    getElLineTargetById(elId: string) {
        return this.runtimeDATA4ElLineTargets.find(l => l.id === elId);
    }
    calcShouldRenderNodes() {
        const nodeConfigList: RGNode[] = [];
        this.graphData.nodes.forEach(node => {
            if (node.rgShouldRender === false) {
                return;
            }
            if (node.rgCalcedVisibility === false) {
                return;
            }
            // const visible = RGNodesAnalytic.isVisibleNode(node);
            // if (!visible) {
            //     return;
            // }
            nodeConfigList.push(node)
        })
        return nodeConfigList;
    }
    calcShouldRenderLines() {
        const lineList: RGLine[] = [];
        this.runtimeDATA4Links.forEach(link => {
            if (link.rgShouldRender === false) {
                return;
            }
            if (link.line.hidden === true) {
                return;
            }
            if (link.rgCalcedVisibility === false) {
                return;
            }
            // if (link.fromNode.rgCalcedVisibility === false || link.toNode.rgCalcedVisibility === false) {
            //     return;
            // }
            // const visible = RGNodesAnalytic.isVisibleNode(link.fromNode) && RGNodesAnalytic.isVisibleNode(link.toNode);
            // if (!visible) {
            //     return;
            // }
            lineList.push(link.line);
        })
        return lineList;
    }
    calcShouldRenderFakeLines() {
        return this.graphData.fakeLines;
    }
    findNodeByXy(xy: RGCoordinate) {
        // 根据点击的坐标，寻找被点击的节点
        const nodes = this.graphData.nodes;
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const nodeX = node.x;
            const nodeY = node.y;
            const nodeWidth = node.el_W || node.width || 50;
            const nodeHeight = node.el_H || node.height || 50;
            if (
                xy.x > nodeX
                && xy.x < nodeX + nodeWidth
                && xy.y > nodeY
                && xy.y < nodeY + nodeHeight
            ) {
                return node;
            }
        }
        return null;
    }
}
