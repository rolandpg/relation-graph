import {CalcNode, RelationGraphInstance, RGLayout, RGLayoutOptions, RGLink, RGNode, RGOptionsFull} from '../../types';
import { devLog } from '../utils/RGCommon';
import {BasicNetworkAnalyzer} from "./analyzers/BasicNetworkAnalyzer";

export abstract class RGBaseLayout implements RGLayout{
  graphOptions:RGOptionsFull;
  layoutOptions:RGLayoutOptions;
  graphInstance:RelationGraphInstance;
  networkAnalyzer;
  allNodes:RGNode[] = [];
  isMainLayouer = true;
  requireLinks = false;
  allLinks:RGLink[] = [];
  constructor(layoutOptions:RGLayoutOptions, graphOptions:RGOptionsFull, graphInstance: RelationGraphInstance) {
    this.layoutOptions = layoutOptions;
    this.graphOptions = graphOptions;
    this.graphInstance = graphInstance;
    this.networkAnalyzer = new BasicNetworkAnalyzer(graphInstance);
  }
  rootNode:RGNode|undefined;
  setLinks(links:RGLink[]) {
    devLog('setLinks:', links.length);
    this.allLinks = links;
  }
  abstract placeNodes(allNodes: RGNode[], rootNode?: RGNode) : void;
  protected generateCalcNodes<CustomCalcNode extends CalcNode>(groupNodes: RGNode[]) {
    const calcNodes: CustomCalcNode[] = [];
    const calcNodeMap = new Map<string, CustomCalcNode>;
    for (const node of groupNodes) {
      const calcNode = {
        rgNode: node,
        x: node.x,
        y: node.y,
        width: (node.width || node.el_W || 50),
        height: (node.height ||node.el_H || 50)
      };
      calcNodes.push(calcNode);
      calcNodeMap.set(node.id, calcNode);
    }
    return {calcNodes, calcNodeMap};
  }
  protected generateLevels(groupNodes: RGNode[]) {
    const levels: number[] = [];
    const levelNodesMap = new Map<number, RGNode[]>;
    for (const node of groupNodes) {
      if (!node.lot || typeof node.lot.level !== 'number') {
        continue;
      }
      const level = node.lot.level;
      if (!levels.includes(level)) {
        levels.push(level);
        levelNodesMap.set(level, []);
      }
      levelNodesMap.get(level)!.push(node);
    }
    levels.sort((a, b) => a - b);
    return {levels, levelNodesMap};
  }

  /**
   * 修正一排/一列重叠的节点坐标, 并保持固定间距
   * * @param levelNodes 要处理的节点数组。
   * 函数假定此数组的 *顺序* 已经是您期望的布局顺序。
   * @param direction 布局方向 (left, right, top, bottom)
   * @param gap 节点之间的间距
   * @returns 返回一个 *新的* 数组, 包含修正了坐标的节点
   */
  protected adjustNodePositions(
      levelNodes: CalcNode[],
      direction: 'left' | 'right' | 'top' | 'bottom',
      gap: number
  ): CalcNode[] {
    // 如果节点数组为空或无效, 直接返回空数组
    if (!levelNodes || levelNodes.length === 0) {
      return [];
    }
    // 循环从第二个节点开始 (索引为 1)
    // 第一个节点 (索引 0) 的位置被视为锚点, 不会改变
    for (let i = 1; i < levelNodes.length; i++) {
      const currentNode = levelNodes[i];
      // !! 关键: 我们总是基于 *上一个刚被修正过的节点* (i-1) 来计算当前位置
      const prevNode = levelNodes[i - 1];

      switch (direction) {
          /**
           * 水平方向排列 (right / left)
           * 我们修正 x 坐标, 并强制 y 坐标与前一个节点对齐, 确保在一条直线上
           */
        case 'right':
          if (currentNode.x < prevNode.x + prevNode.width + gap) {
            // 锚点在左, 向右排列
            // 新 x = 上一个节点的 x + 上一个节点的宽度 + 间距
            currentNode.x = prevNode.x + prevNode.width + gap;
          }
          break;

        case 'left':
          if (currentNode.x + currentNode.width > prevNode.x - gap) {
            // 锚点在右, 向左排列
            // 新 x = 上一个节点的 x - 当前节点的宽度 - 间距
            currentNode.x = prevNode.x - currentNode.width - gap;
          }
          break;

          /**
           * 垂直方向排列 (bottom / top)
           * 我们修正 y 坐标, 并强制 x 坐标与前一个节点对齐, 确保在一条直线上
           */
        case 'bottom':
          if (currentNode.y < prevNode.y + prevNode.height + gap) {
            // 锚点在上, 向下排列
            // 新 y = 上一个节点的 y + 上一个节点的高度 + 间距
            currentNode.y = prevNode.y + prevNode.height + gap;
          }
          break;

        case 'top':
          if (currentNode.y + currentNode.height > prevNode.y - gap) {
            // 锚点在下, 向上排列
            // 新 y = 上一个节点的 y - 当前节点的高度 - 间距
            currentNode.y = prevNode.y - currentNode.height - gap;
          }
          break;
      }
    }

    return levelNodes;
  }
  getReverseAlignItems(alignItems: 'start' | 'center' | 'end'): 'start' | 'center' | 'end' {
    return alignItemsReverseMap[alignItems];
  }
  updateNodePosition(node: RGNode | string, x: number, y: number) {
    this.graphInstance.updateNode(typeof node === 'string' ? node :  node.id, { x, y });
  }
  layoutEnd() {
      if (this.graphInstance) {
          this.graphInstance.dataProvider.updateShouldRenderGraphData();
          this.graphInstance._dataUpdated();
      }
  }
}
const alignItemsReverseMap = {
  'start': 'end',
  'end': 'start',
  'center': 'center',
};

export default RGBaseLayout;
