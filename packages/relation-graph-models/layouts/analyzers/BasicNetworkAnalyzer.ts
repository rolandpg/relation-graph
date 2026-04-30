import {NodesAnalyticLevel, NodesAnalyticResult, RGLevelDirection, RGNetworkAnalyzer} from "./RGNetworkAnalyzer";
import {RelationGraphInstance, RGNode} from "../../../types";
import {RGNodesAnalytic} from "../../utils/RGNodesAnalytic";
import {devLog} from "../../utils/RGCommon";

export class BasicNetworkAnalyzer implements RGNetworkAnalyzer {
    graphInstance: RelationGraphInstance;
    private initialized = false;

    // Change 1: 添加布局模式控制开关
    public isFolderLayout = false;

    constructor(graphInstance: RelationGraphInstance) {
        this.graphInstance = graphInstance;
    }
    analyzeNetwork(nodes: RGNode[], rootNode: RGNode, bothWay = false, deepBothWay = false) {
        if (!this.initialized) {
            this.initialized = true;
        }
        nodes.forEach(thisNode => {
            if (!thisNode.lot) thisNode.lot = {};
            thisNode.lot.eached = false;
            thisNode.lot.index_of_level = 0;
            thisNode.lot.index_of_p_childs = 0;
            thisNode.lot.index_of_parent = 0;
            thisNode.lot.strength = 0;
            thisNode.lot.strengthWithChilds_from = 0;
            thisNode.lot.strengthWithChilds = 0;
            thisNode.lot.childrenSizeVisible = 0;
            thisNode.lot.childrenSize = 0;
            thisNode.lot.childs = [];
            thisNode.lot.subling = undefined;
            thisNode.lot.parent = undefined;
        });
        rootNode.lot.parent = undefined;
        const markedResult = this.markNodeParent(rootNode);
        devLog('groupNodes:marked-tree-node:', markedResult.networkNodes.length);

        const exploredNetworkNodes: RGNode[] = [];
        const analyticResult: NodesAnalyticResult = {
            direct: 1,
            min_deep: 0,
            max_deep: 0,
            max_length: 1,
            max_strength: 1,
            levels: new Map()
        }
        const reverseTreeAnalyticResult: NodesAnalyticResult = {
            direct: -1,
            min_deep: 0,
            max_deep: 0,
            max_length: 1,
            max_strength: 1,
            levels: new Map()
        }
        const firstLevelNodes = [rootNode];
        this.expandLevelNodesWithDirection(exploredNetworkNodes, firstLevelNodes, 0, bothWay, deepBothWay, analyticResult, reverseTreeAnalyticResult);
        this.calcStrengthWithChildsValue(exploredNetworkNodes);
        this.calcStrengthFromValue(rootNode, 1);
        if (bothWay) this.calcStrengthFromValue(rootNode, -1);
        const level1Nodes = exploredNetworkNodes.filter(node => node.lot.level === 1);
        const max_strength = level1Nodes.length === 0 ? 1 :level1Nodes.map(n => n.lot.strengthWithChilds!).reduce((prev,curr) => prev + curr, 0)
        analyticResult.max_strength = max_strength;
        const networkNodes = exploredNetworkNodes.filter(node => node.lot!.level >= 0);
        devLog('groupNodes:tree-nodes:', networkNodes.length, analyticResult);
        const result = {
            tree: {
                networkNodes,
                analyticResult
            },
            reverseTree: {
                networkNodes: [],
                analyticResult: reverseTreeAnalyticResult
            }
        }
        if (bothWay) {
            const level_1Nodes = exploredNetworkNodes.filter(node => node.lot.level === -1);
            const max_strength = level_1Nodes.length === 0 ? 1 :level_1Nodes.map(n => n.lot.strengthWithChilds!).reduce((prev,curr) => prev + curr, 0)
            reverseTreeAnalyticResult.max_strength = max_strength;
            const reverseTreeNodes = exploredNetworkNodes.filter(node => node.lot!.level <= 0);
            devLog('groupNodes:reverse-tree-nodes:', reverseTreeNodes.length, reverseTreeAnalyticResult);
            result.reverseTree.networkNodes = reverseTreeNodes;
        }
        for (const node of nodes) {
            // console.log('update node children size:', node.text, node.lot.childs.length);
            this.graphInstance.updateNode(node, {
                rgChildrenSize: node.lot.childrenSize
            });
        }
        return result
    }
    protected markNodeParent(rootNode:RGNode) {
        let markedNodes: RGNode[] = [];
        this._markNodeParent(markedNodes, [rootNode], 0);
        return {
            networkNodes: markedNodes
        };
    }
    private _markNodeParent(markedNodes:RGNode[], thisLevelNodes:RGNode[], thisDeep:number) {
        if (thisDeep === 0) {
            thisLevelNodes.forEach(thisNode => {
                thisNode.lot.parent = undefined;
            });
        }
        const newLevelNodes:RGNode[] = [];
        for (const thisNode of thisLevelNodes) {
            if (!markedNodes.includes(thisNode)) {
                markedNodes.push(thisNode);
            }
            for (const thisNextLevelNode of this.graphInstance.getNodeRelatedNodes(thisNode)) {
                if (!markedNodes.includes(thisNextLevelNode)) {
                    markedNodes.push(thisNextLevelNode);
                    thisNextLevelNode.lot.parent = thisNode;
                    newLevelNodes.push(thisNextLevelNode);
                }
            }
        }
        if (newLevelNodes.length > 0) {
            this._markNodeParent(markedNodes, newLevelNodes, thisDeep + 1);
        }
    }
    private expandLevelNodesWithDirection(
        exploredNetworkNodes: RGNode[],
        thisLevelNodes: RGNode[],
        level: number,
        bothWay: boolean,
        deepBothWay: boolean,
        treeAnalyticResult: NodesAnalyticResult,
        reverseTreeAnalyticResult: NodesAnalyticResult
    ) {
        const analyticResult = bothWay && level < 0 ? reverseTreeAnalyticResult : treeAnalyticResult;
        devLog(`bothWay:${bothWay}(deep:${deepBothWay}) level ${level} size: ${thisLevelNodes.length}`, analyticResult.direct);
        if (thisLevelNodes.length > analyticResult.max_length) {
            analyticResult.max_length = thisLevelNodes.length;
        }
        if (level > analyticResult.max_deep) {
            analyticResult.max_deep = level;
        }
        if (level < analyticResult.min_deep) {
            analyticResult.min_deep = level;
        }
        if (!analyticResult.levels.has(level)) {
            analyticResult.levels.set(level, {
                level: level,
                all_size: thisLevelNodes.length,
                all_strength: 0
            });
        }
        const _treeLevelSibling = analyticResult.levels.get(level)!;
        thisLevelNodes.forEach(thisNode => {
            thisNode.lot.eached = true;
            thisNode.lot.subling = _treeLevelSibling;
            thisNode.lot.level = level;
            exploredNetworkNodes.push(thisNode);
        });
        const newFromNodes: RGNode[] = [];
        const newToNodes: RGNode[] = [];
        let toFindDirect = 1;
        let __thisLevel_index = 0;
        thisLevelNodes.forEach(thisNode => {
            let fromNodes: RGNode[] = [];
            let toNodes: RGNode[] = [];
            if (bothWay) {
                if (deepBothWay || level === 0) {
                    fromNodes = this.graphInstance.getNodeIncomingNodes(thisNode)
                    toNodes = this.graphInstance.getNodeOutgoingNodes(thisNode)
                } else {
                    if (level < 0) {
                        toFindDirect = -1;
                    }
                    toNodes = this.graphInstance.getNodeRelatedNodes(thisNode)
                }
            } else {
                toNodes = this.graphInstance.getNodeRelatedNodes(thisNode)
            }
            this._appendNodeChildrenToNextLevelNodes(thisNode, toNodes, newToNodes, _treeLevelSibling, bothWay, 1);
            this._appendNodeChildrenToNextLevelNodes(thisNode, fromNodes, newFromNodes, _treeLevelSibling, bothWay, -1);
            thisNode.lot.index_of_level = __thisLevel_index;
            __thisLevel_index++;
        });
        if (_treeLevelSibling.all_strength > analyticResult.max_strength) {
            analyticResult.max_strength = _treeLevelSibling.all_strength;
        }
        if (newToNodes.length > 0) {
            this.expandLevelNodesWithDirection(exploredNetworkNodes, newToNodes, level + toFindDirect, bothWay, deepBothWay, treeAnalyticResult, reverseTreeAnalyticResult);
        }
        if (newFromNodes.length > 0) {
            this.expandLevelNodesWithDirection(exploredNetworkNodes, newFromNodes, level - 1, bothWay, deepBothWay, treeAnalyticResult, reverseTreeAnalyticResult);
        }
    }
    private _appendNodeChildrenToNextLevelNodes(thisNode: RGNode, childrenNodes: RGNode[], newLevelNodes: RGNode[], _treeLevelSibling: NodesAnalyticLevel, bothWay: boolean, direct: 1|-1) {
        let _nodeVisibleChildrenSize = 0;
        let _nodeChildrenSize = 0;
        let __thisTargetIndex = 0;
        childrenNodes.forEach((thisTarget) => {
            if (!thisTarget.lot) thisTarget.lot = {eached: false, childs: []};
            if (!thisTarget.lot.eached) {
                _nodeChildrenSize++;
                thisTarget.lot.parent = thisNode;
                if (RGNodesAnalytic.isVisibleNode(thisTarget)) {
                    thisTarget.lot.eached = true;
                    thisTarget.lot.index_of_parent = __thisTargetIndex++;
                    newLevelNodes.push(thisTarget);
                    _nodeVisibleChildrenSize++;
                }
                thisNode.lot.childs.push(thisTarget);
            }
        });
        if (direct === 1) {
            const strength = _nodeVisibleChildrenSize > 0 ? _nodeVisibleChildrenSize : 1;
            thisNode.lot.strength = strength;
            _treeLevelSibling.all_strength += strength;
            thisNode.lot.strength_of_level = _treeLevelSibling.all_strength;
            thisNode.lot.childrenSizeVisible = _nodeVisibleChildrenSize;
            thisNode.lot.childrenSize = _nodeChildrenSize;
        }
    }
    private calcStrengthWithChildsValue(exploredNetworkNodes: RGNode[]) {
        if (this.isFolderLayout) {
            exploredNetworkNodes.forEach(thisNode => {
                thisNode.lot.strengthWithChilds = 1;
                this.conductStrengthToParents(thisNode);
            });
        } else {
            exploredNetworkNodes.forEach(thisNode => {
                if (thisNode.lot.childrenSizeVisible > 0) {
                    thisNode.lot.strengthWithChilds = 0;
                }
            });
            exploredNetworkNodes.forEach(thisNode => {
                if (thisNode.lot.childrenSizeVisible === 0) {
                    thisNode.lot.strengthWithChilds = 1;
                    this.conductStrengthToParents(thisNode);
                }
            });
        }
    }
    calcStrengthFromValue(rootNode: RGNode, deepFindDirect: RGLevelDirection = 1) {
        this._calcStrengthFromValue([rootNode], 0, (deepFindDirect === -1 ? -1 : 1));
    }
    private _calcStrengthFromValue(thisLevelNodes:RGNode[], thisDeep: number, deepFindDirect: RGLevelDirection = 1) {
        const newLevelNodes:RGNode[] = [];
        let currentLevelStrengthWidthChilds = 0;
        thisLevelNodes.forEach(thisNode => {
            if (thisNode.lot.level === 0 || deepFindDirect === (thisNode.lot.level! < 0 ? -1 : 1)) {
                thisNode.lot.childs.forEach((thisTarget) => {
                    newLevelNodes.push(thisTarget);
                });


                // Change 2: 保持原有的父节点对齐逻辑，这部分逻辑是通用的，保证了子节点不会早于父节点开始
                if (thisNode.lot.parent && currentLevelStrengthWidthChilds < thisNode.lot.parent.lot.strengthWithChilds_from!) {
                    currentLevelStrengthWidthChilds = thisNode.lot.parent.lot.strengthWithChilds_from!;
                }
                // Change 3: 根据 isFolderLayout 决定是否增加额外的偏移量 (+1)
                // old.ts 逻辑: thisNode.lot.strengthWithChilds_from = 1 + currentLevelStrengthWidthChilds;
                const folderLayoutOffset = this.isFolderLayout ? 1 : 0;
                thisNode.lot.strengthWithChilds_from = currentLevelStrengthWidthChilds + folderLayoutOffset;

                currentLevelStrengthWidthChilds += thisNode.lot.strengthWithChilds!;
            }
        });
        if (newLevelNodes.length > 0) {
            this._calcStrengthFromValue(newLevelNodes, thisDeep + (deepFindDirect < 0 ? -1 : 1), deepFindDirect);
        }
    }
    conductStrengthToParents(node:RGNode) {
        if (node.lot.parent) {
            // Change 4: 放宽递归条件
            // 标准树布局要求严格的层级相邻 (Level N 的父节点必须是 Level N-1)
            // Folder 布局可能存在跨层级或者更灵活的父子关系，因此如果是 Folder 布局则跳过层级严格检查
            const strictLevelCheck = Math.abs(node.lot.level) - 1 === Math.abs(node.lot.parent.lot.level);

            if (this.isFolderLayout || strictLevelCheck) {
                node.lot.parent.lot.strengthWithChilds += 1;
                this.conductStrengthToParents(node.lot.parent);
            }
        }
    }
}
