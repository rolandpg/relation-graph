import { CalcNode, RelationGraphInstance, RGLayout, RGLayoutOptions, RGLink, RGNode, RGOptionsFull } from '../../types';
import { BasicNetworkAnalyzer } from './analyzers/BasicNetworkAnalyzer';
export declare abstract class RGBaseLayout implements RGLayout {
    graphOptions: RGOptionsFull;
    layoutOptions: RGLayoutOptions;
    graphInstance: RelationGraphInstance;
    networkAnalyzer: BasicNetworkAnalyzer;
    allNodes: RGNode[];
    isMainLayouer: boolean;
    requireLinks: boolean;
    allLinks: RGLink[];
    constructor(layoutOptions: RGLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    rootNode: RGNode | undefined;
    setLinks(links: RGLink[]): void;
    abstract placeNodes(allNodes: RGNode[], rootNode?: RGNode): void;
    protected generateCalcNodes<CustomCalcNode extends CalcNode>(groupNodes: RGNode[]): {
        calcNodes: CustomCalcNode[];
        calcNodeMap: Map<string, CustomCalcNode>;
    };
    protected generateLevels(groupNodes: RGNode[]): {
        levels: number[];
        levelNodesMap: Map<number, RGNode[]>;
    };
    /**
     * 修正一排/一列重叠的节点坐标, 并保持固定间距
     * * @param levelNodes 要处理的节点数组。
     * 函数假定此数组的 *顺序* 已经是您期望的布局顺序。
     * @param direction 布局方向 (left, right, top, bottom)
     * @param gap 节点之间的间距
     * @returns 返回一个 *新的* 数组, 包含修正了坐标的节点
     */
    protected adjustNodePositions(levelNodes: CalcNode[], direction: 'left' | 'right' | 'top' | 'bottom', gap: number): CalcNode[];
    getReverseAlignItems(alignItems: 'start' | 'center' | 'end'): 'start' | 'center' | 'end';
    updateNodePosition(node: RGNode | string, x: number, y: number): void;
    layoutEnd(): void;
}
export default RGBaseLayout;
