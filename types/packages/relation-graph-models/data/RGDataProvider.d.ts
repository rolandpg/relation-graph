import { RGNode, RGLine, RGOptionsFull, JsonLine, RGConnectTargetData, RGLineTarget } from '../../types';
import { RGDataGetter } from './RGDataGetter';
export type DataCommits = {
    optionsChanged: boolean;
    changedNodes: string[];
    nodesListChanged: boolean;
    changedLines: string[];
    linesListChanged: boolean;
    changedFakeLines: string[];
    fakeLinesListChanged: boolean;
    changedConnectTargets: string[];
    connectTargetsListChanged: boolean;
};
/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export declare class RGDataProvider extends RGDataGetter {
    private commits;
    constructor();
    /**
     * Clear all data in RelationGraph, including nodes, lines, element lines, and the root node
     */
    clearReactiveData(): void;
    /**
     * Protected method, For react only
     */
    updateViewHook: (commits: DataCommits) => void;
    private resetCommints;
    private commitLine;
    private commitNode;
    private commitFakeLine;
    private commitConnectTarget;
    dataUpdated(): void;
    updateOptions(options: Partial<RGOptionsFull>): void;
    clearChecked(): void;
    setCanvasOffset(x: number, y: number): void;
    setCanvasZoom(newValue: number): void;
    setEditingLine(line: RGLine | null): void;
    setEditingNodes(nodes: RGNode[]): void;
    setCanvasCenter(x: number, y: number): void;
    removeNodeById(nodeIds: string[]): void;
    removeLineByIds(lineIds: string[]): void;
    removeFakeLineByIds(lineIds: string[]): void;
    removeLinkByLineIds(lineIds: string[]): void;
    removeConnectTarget(targetId: string): void;
    private updateLinks;
    private beforeNodeBeRemove;
    addFakeLines(lines: JsonLine[]): void;
    clearFakeLines(): void;
    addNodes(newNodes: RGNode[]): void;
    addLines(newLines: RGLine[]): void;
    updateNode(nodeId: string, nodeProperties: Partial<RGNode>): void;
    updateNodeData(nodeId: string, nodeData: Record<string, any>): void;
    updateLine(lineId: string, lineProperties: Partial<RGLine>): void;
    updateLineData(lineId: string, lineData: Record<string, any>): void;
    updateFakeLine(lineId: string, lineProperties: Partial<RGLine>): void;
    updateConnectTarget(connectTargetId: string, connectTargetProperties: Partial<RGConnectTargetData>): void;
    updateElLineTarget(elId: string, targetProperties: Partial<RGLineTarget>): void;
    updateNodesVisibleProperty(nodes?: RGNode[]): void;
    private calcLinkVisibility;
    updateShouldRenderGraphData(): void;
    addConnectTarget(newConnectTarget: RGConnectTargetData): RGConnectTargetData | undefined;
    addElLineTarget(elementTarget: RGLineTarget): void;
    setRootNodeId(rootNodeId: string): void;
}
