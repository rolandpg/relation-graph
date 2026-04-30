import {devLog} from '../utils/RGCommon';
import {RGNodesAnalytic} from '../utils/RGNodesAnalytic';
import RGBaseLayout from './RGBaseLayout';
import {CalcNode, RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions} from '../../types';
import RGGraphMath from "../utils/RGGraphMath";
import {NodesAnalyticResult} from "./analyzers/RGNetworkAnalyzer";

export class RGTreeLayout extends RGBaseLayout {
    constructor(layoutOptions: RGTreeLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance) {
        super(layoutOptions, graphOptions, graphInstance);
        this.layoutOptions = layoutOptions;
        devLog('new RGTreeLayout:', this.layoutOptions);
        if (!this.layoutOptions.from) this.layoutOptions.from = 'left';
        if (!this.layoutOptions.levelGaps) this.layoutOptions.levelGaps = [];
        const from = this.layoutOptions.from;
        // console.log('this.layoutOptions.alignItemsX:1:', this.layoutOptions.alignItemsX);
        if (from === 'top' || from === 'bottom') {
            if (!this.layoutOptions.treeNodeGapH) this.layoutOptions.treeNodeGapH = 10;
            if (!this.layoutOptions.treeNodeGapV) this.layoutOptions.treeNodeGapV = 50;
        } else {
            if (!this.layoutOptions.treeNodeGapH) this.layoutOptions.treeNodeGapH = 50;
            if (!this.layoutOptions.treeNodeGapV) this.layoutOptions.treeNodeGapV = 10;
        }
        if (from === 'top') {
            if (!this.layoutOptions.alignItemsX)this.layoutOptions.alignItemsX = 'center';
            if (!this.layoutOptions.alignItemsY)this.layoutOptions.alignItemsY = 'start';
            if (!this.layoutOptions.alignParentItemsX)this.layoutOptions.alignParentItemsX = this.layoutOptions.alignItemsX;
            if (!this.layoutOptions.alignParentItemsY)this.layoutOptions.alignParentItemsY = this.getReverseAlignItems(this.layoutOptions.alignItemsY);
        } else if (from === 'bottom') {
            if (!this.layoutOptions.alignItemsX)this.layoutOptions.alignItemsX = 'center';
            if (!this.layoutOptions.alignItemsY)this.layoutOptions.alignItemsY = 'end';
            if (!this.layoutOptions.alignParentItemsX)this.layoutOptions.alignParentItemsX = this.layoutOptions.alignItemsX;
            if (!this.layoutOptions.alignParentItemsY)this.layoutOptions.alignParentItemsY = this.getReverseAlignItems(this.layoutOptions.alignItemsY);
        } else if (from === 'right') {
            if (!this.layoutOptions.alignItemsX)this.layoutOptions.alignItemsX = 'end';
            if (!this.layoutOptions.alignItemsY)this.layoutOptions.alignItemsY = 'center';
            if (!this.layoutOptions.alignParentItemsX)this.layoutOptions.alignParentItemsX = this.getReverseAlignItems(this.layoutOptions.alignItemsX);
            if (!this.layoutOptions.alignParentItemsY)this.layoutOptions.alignParentItemsY = this.layoutOptions.alignItemsY;
        } else {
            if (!this.layoutOptions.alignItemsX)this.layoutOptions.alignItemsX = 'start';
            if (!this.layoutOptions.alignItemsY)this.layoutOptions.alignItemsY = 'center';
            if (!this.layoutOptions.alignParentItemsX)this.layoutOptions.alignParentItemsX = this.getReverseAlignItems(this.layoutOptions.alignItemsX);
            if (!this.layoutOptions.alignParentItemsY)this.layoutOptions.alignParentItemsY = this.layoutOptions.alignItemsY;
        }
        // console.log('this.layoutOptions.alignItemsX:2:', this.layoutOptions.alignItemsX);
        if (this.layoutOptions.ignoreNodeSize === undefined) this.layoutOptions.ignoreNodeSize = false;
        // 下面这段很奇怪的代码是用来兼容旧版本的配置的，在后续旧版本没有人使用的时候会重构
        const _toleranceValue = this.layoutOptions.layoutExpansionDirection as string;
        const layoutExpansionDirection: "start" | "center" | "end" = (_toleranceValue === 'start' || _toleranceValue === 'left' || _toleranceValue === 'top') ? 'start' : ((_toleranceValue === 'end' || _toleranceValue === 'right' || _toleranceValue === 'bottom') ? 'end' : 'center');
        this.layoutOptions.layoutExpansionDirection = layoutExpansionDirection;
        if (this.layoutOptions.levelDistance) {
            console.error('Error: levelDistance is not support， Please use levelGaps or treeNodeGapH,treeNodeGapV option in layoutOptions');
        }
        this.enableGatherNodes = this.layoutOptions.enableGatherNodes;
        if (!this.layoutOptions.rotate) this.layoutOptions.rotate = 0;
    }

    enableGatherNodes = false;
    layoutOptions: RGTreeLayoutOptions;

    placeNodes(allNodes: RGNode[], rootNode: RGNode) {
        // console.log('tree:placeNodes:rootNode', rootNode.id, rootNode);
        devLog('RGTreeLayout:placeNodes');
        if (!rootNode) {
            console.error('root is null');
            return;
        } else {
            devLog('layout by root:', rootNode);
        }
        devLog('allNodes:', allNodes.length);
        const childrenTreeAlign = {
            alignItemsX: this.layoutOptions.alignItemsX,
            alignItemsY: this.layoutOptions.alignItemsY,
        };
        const parentTreeAlign = {
            alignItemsX: this.layoutOptions.alignParentItemsX,
            alignItemsY: this.layoutOptions.alignParentItemsY,
        };
        this.rootNode = rootNode;
        this.allNodes = allNodes;
        if (rootNode.fixed || this.layoutOptions.fixedRootNode) {
            // 什么都不做
        } else {
            this.updateNodePosition(rootNode, 0, 0);
        }
        const rootLotXY = RGNodesAnalytic.getNodeLotXY(childrenTreeAlign, rootNode);
        rootNode.lot.x = rootLotXY.x;
        rootNode.lot.y = rootLotXY.y;
        const groupNodes = allNodes;
        devLog('groupNodes:2:', groupNodes.length, groupNodes.map(n => n.text).join(','));
        if (this.layoutOptions.simpleTree === true) {
            const {tree} = this.networkAnalyzer.analyzeNetwork(groupNodes, this.rootNode, false);
            this.placeNodesPosition(this.rootNode, tree.networkNodes, tree.analyticResult);
        } else {
            const {tree, reverseTree} = this.networkAnalyzer.analyzeNetwork(groupNodes, this.rootNode, true);
            this.placeNodesPosition(this.rootNode, tree.networkNodes, tree.analyticResult);
            this.placeNodesPosition(this.rootNode, reverseTree.networkNodes, reverseTree.analyticResult);
        }
        const rotate = this.layoutOptions.rotate || 0;
        // console.log('rotate:', rotate);
        const rootXy = {x:rootNode.x, y: rootNode.y};
        this.allNodes.forEach(thisNode => {
            if (thisNode.fixed === true) {
                return;
            }
            if (!RGNodesAnalytic.isVisibleNode(thisNode)) return;
            if (Number.isNaN(thisNode.lot.x)) {
                devLog('bad lot x:', thisNode.text, thisNode.lot.x);
                thisNode.lot.x = 0;
            }
            if (Number.isNaN(thisNode.lot.y)) {
                devLog('bad lot y:', thisNode.text, thisNode.lot.y);
                thisNode.lot.y = 0;
            }
            if (thisNode === rootNode) {
                // Do nothing
            } else {
                if (rotate) {
                    const roatedXy = RGGraphMath.getRotatedPoint(thisNode.lot.x, thisNode.lot.y, rootXy.x, rootXy.y, rotate);
                    thisNode.lot.x = roatedXy.x;
                    thisNode.lot.y = roatedXy.y;
                }
                const nodeAlignOption = thisNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
                const x = RGNodesAnalytic.getNodeXByLotX(nodeAlignOption, thisNode);
                const y = RGNodesAnalytic.getNodeYByLotY(nodeAlignOption, thisNode);
                this.updateNodePosition(thisNode, x, y);
            }
        });
        devLog('create rootNode coordinates:1', rootNode.x, rootNode.y);
        this.layoutEnd();
    };

    placeNodesPosition(rootNode: RGNode, groupNodes: RGNode[], analyticResult: NodesAnalyticResult) {
        this.placeRelativePosition(rootNode, groupNodes, analyticResult);
    }

    placeRelativePosition(rootNode: RGNode, groupNodes: RGNode[], analyticResult: NodesAnalyticResult) {
        const layoutExpansionDirection = this.layoutOptions.layoutExpansionDirection!;
        const { levels, levelNodesMap } = this.generateLevels(groupNodes);
        const max_strength = analyticResult.max_strength;
        if (this.layoutOptions.from === 'top' || this.layoutOptions.from === 'bottom') {
            const treeNodeGapH = this.layoutOptions.treeNodeGapH || 20;
            const treeNodeGapV = this.layoutOptions.treeNodeGapV || 20;
            const levelMaxHeightMap = new Map<number, number>();
            for (const level of levels) {
                const levelNodes = levelNodesMap.get(level)!;
                levelMaxHeightMap.set(level, Math.max(...levelNodes.map(n => n.el_H)));
            }
            let sumNodeWidth = 0;
            let sumNodeSize = 0;
            for (const node of groupNodes) {
                const nodeWidth = node.el_W;
                sumNodeWidth += nodeWidth;
                sumNodeSize++;
            }
            const avgNodeWidth = sumNodeWidth / sumNodeSize;
            const __per_width = avgNodeWidth + treeNodeGapH;

            groupNodes.forEach(thisNode => {
                if (thisNode.fixed === true) return;
                if (thisNode === rootNode) return;
                if (this.layoutOptions.from === 'bottom') {
                    thisNode.lot.y = rootNode.lot.y! - this.getLevelDistance(thisNode.lot.level, levelMaxHeightMap, treeNodeGapV + 10);
                } else {
                    thisNode.lot.y = rootNode.lot.y! + this.getLevelDistance(thisNode.lot.level, levelMaxHeightMap, treeNodeGapV + 10);
                }
            });
            groupNodes.forEach(thisNode => {
                if (thisNode.fixed === true) return;
                if (thisNode.lot.level !== 0) {
                    if (layoutExpansionDirection === 'start') {
                        thisNode.lot.x = rootNode.lot.x! - __per_width * (thisNode.lot.strengthWithChilds_from!);
                    } else if (layoutExpansionDirection === 'end') {
                        thisNode.lot.x = rootNode.lot.x! + __per_width * (thisNode.lot.strengthWithChilds_from!);
                    } else {
                        thisNode.lot.x = rootNode.lot.x! + __per_width * ((max_strength / -2) + thisNode.lot.strengthWithChilds_from! + thisNode.lot.strengthWithChilds! / 2);
                    }
                }
            });
            this.applyNodesGap(groupNodes, 'v');
            this.gatherNodes(groupNodes, 'v', __per_width);
        } else {
            const treeNodeGapH = this.layoutOptions.treeNodeGapH || 20;
            const treeNodeGapV = this.layoutOptions.treeNodeGapV || 20;

            // console.log('levelNodesMap:', levelNodesMap);
            const levelMaxWidthMap = new Map<number, number>();
            for (const level of levels) {
                const levelNodes = levelNodesMap.get(level)!;
                levelMaxWidthMap.set(level, Math.max(...levelNodes.map(n => (n.el_W || n.width || 50))));
            }
            let sumNodeHeight = 0;
            let sumNodeSize = 0;
            for (const node of groupNodes) {
                const nodeHeight = node.el_H;
                sumNodeHeight += nodeHeight;
                sumNodeSize++;
            }
            if (sumNodeSize === 0) {
                return;
            }
            const avgNodeHeight = sumNodeHeight / sumNodeSize;
            const __per_height = avgNodeHeight + treeNodeGapV;
            groupNodes.forEach(thisNode => {
                if (thisNode.fixed === true) return;
                if (thisNode === rootNode) return;
                if (this.layoutOptions.from === 'right') {
                    thisNode.lot.x = rootNode.lot.x! - this.getLevelDistance(thisNode.lot.level, levelMaxWidthMap, treeNodeGapH + 50);
                } else {
                    thisNode.lot.x = rootNode.lot.x! + this.getLevelDistance(thisNode.lot.level, levelMaxWidthMap, treeNodeGapH + 50);
                }
            });

            groupNodes.forEach(thisNode => {
                if (thisNode.fixed === true) return;
                if (thisNode.lot.level !== 0) {
                    if (layoutExpansionDirection === 'start') {
                        thisNode.lot.y = rootNode.lot.y! - __per_height * (thisNode.lot.strengthWithChilds_from!);
                    } else if (layoutExpansionDirection === 'end') {
                        thisNode.lot.y = rootNode.lot.y! + __per_height * (thisNode.lot.strengthWithChilds_from!);
                    } else {
                        thisNode.lot.y = rootNode.lot.y! + __per_height * ((max_strength / -2) + thisNode.lot.strengthWithChilds_from! + thisNode.lot.strengthWithChilds! / 2);
                    }
                }
            });
            // console.log('levelMaxWidthMap:', rootNode.id, levelMaxWidthMap);
            this.applyNodesGap(groupNodes, 'h');
            this.gatherNodes(groupNodes, 'h', __per_height);
        }
    }

    getLevelDistance(level: number, levelMaxSizeMap: Map<number, number>, defaultGap: number) {
        if (level === 0) {
            return 0;
        }
        if (level > 0) {
            let sumDistance = 0;
            for (let i = 0; i < level; i++) {
                const levelMaxSize = levelMaxSizeMap.get(i)!;
                sumDistance += (levelMaxSize + this.getLevelGap(i, defaultGap, levelMaxSize, level));
            }
            return sumDistance;
        } else {
            let sumDistance = 0;
            for (let i = 0; i > level; i--) {
                const levelMaxSize = levelMaxSizeMap.get(i)!;
                sumDistance += (levelMaxSize + this.getLevelGap(i, defaultGap, levelMaxSize, level));
            }
            return -sumDistance;
        }
    }

    private getLevelGap(level: number, defaultGap: number, levelMaxSize: number, sumToLevel: number) {
        let levelGap = defaultGap + (sumToLevel === -1 && level === 0 ? levelMaxSize / 2 : 0);
        if (this.layoutOptions.levelGaps!.length > 0) {
            const gap = this.layoutOptions.levelGaps![Math.abs(level)];
            if (gap) {
                levelGap = gap;
            }
        }
        return levelGap;
    }

    applyNodesGap(groupNodes: RGNode[], hv: 'h' | 'v') {
        if (this.layoutOptions.ignoreNodeSize) {
            return;
        }
        const childrenTreeAlign = {
            alignItemsX: this.layoutOptions.alignItemsX,
            alignItemsY: this.layoutOptions.alignItemsY,
        };
        const parentTreeAlign = {
            alignItemsX: this.layoutOptions.alignParentItemsX,
            alignItemsY: this.layoutOptions.alignParentItemsY,
        };
        const layoutExpansionDirection = this.layoutOptions.layoutExpansionDirection!;
        const { levels, levelNodesMap } = this.generateLevels(groupNodes);
        const levelMaxWidthMap = new Map<number, number>();
        for (const level of levels) {
            const levelNodes = levelNodesMap.get(level)!;
            levelMaxWidthMap.set(level, Math.max(...levelNodes.map(n => n.el_W)));
        }

        const {calcNodes, calcNodeMap} = this.generateCalcNodes<CalcNode & {
            buffY: number
        }>(groupNodes);
        // initial
        calcNodes.forEach(calcNode => {
            const nodeAlignOption = calcNode.rgNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
            calcNode.x = RGNodesAnalytic.getNodeXByLotX(nodeAlignOption, calcNode.rgNode);
            calcNode.y = RGNodesAnalytic.getNodeYByLotY(nodeAlignOption, calcNode.rgNode);
            calcNode.width = calcNode.rgNode.el_W;
            calcNode.height = calcNode.rgNode.el_H;
            calcNode.buffY = 0;
        });
        for (const level of levels) {
            const levelNodes = levelNodesMap.get(level) || [];
            if (hv === 'h') {
                if (layoutExpansionDirection === 'end') {
                    levelNodes.sort((a, b) => a.lot.y - b.lot.y);
                    const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                    this.adjustNodePositions(levelCalcNodes, 'bottom', this.layoutOptions.treeNodeGapV);
                    for (const calcNode of levelCalcNodes) {
                        const nodeAlignOption = calcNode.rgNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
                        calcNode.rgNode.lot.y = RGNodesAnalytic.getNodeLotXY(nodeAlignOption, calcNode).y;
                    }
                } else {
                    levelNodes.sort((a, b) => b.lot.y - a.lot.y);
                    const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                    this.adjustNodePositions(levelCalcNodes, 'top', this.layoutOptions.treeNodeGapV);
                    for (const calcNode of levelCalcNodes) {
                        const nodeAlignOption = calcNode.rgNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
                        calcNode.rgNode.lot.y = RGNodesAnalytic.getNodeLotXY(nodeAlignOption, calcNode).y;
                    }
                }
            } else {
                if (layoutExpansionDirection === 'end') {
                    levelNodes.sort((a, b) => a.lot.x - b.lot.x);
                    const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                    this.adjustNodePositions(levelCalcNodes, 'right', this.layoutOptions.treeNodeGapH);
                    for (const calcNode of levelCalcNodes) {
                        const nodeAlignOption = calcNode.rgNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
                        const newXy = RGNodesAnalytic.getNodeLotXY(nodeAlignOption, calcNode);
                        calcNode.rgNode.lot.x = newXy.x;
                    }
                } else {
                    levelNodes.sort((a, b) => b.lot.x - a.lot.x);
                    const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                    this.adjustNodePositions(levelCalcNodes, 'left', this.layoutOptions.treeNodeGapH);
                    for (const calcNode of levelCalcNodes) {
                        const nodeAlignOption = calcNode.rgNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
                        calcNode.rgNode.lot.x = RGNodesAnalytic.getNodeLotXY(nodeAlignOption, calcNode).x;
                    }
                }
            }
            // console.log('levelNodes:', level, levelNodes);
        }
        if (hv === 'h') {
            const levelMaxWidthMap = new Map<number, number>();
            const levelMinXMap = new Map<number, number>();
            for (const level of levels) {
                const levelNodes = levelNodesMap.get(level)!;
                const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                levelMaxWidthMap.set(level, Math.max(...levelCalcNodes.map(n => n.width)));
                levelMinXMap.set(level, Math.min(...levelCalcNodes.map(n => n.x)));
            }
            const gap = this.layoutOptions.treeNodeGapH;
            let rightLevels = levels.filter(l => l > 0).sort((a, b) => a - b);
            let leftLevels = levels.filter(l => l < 0).sort((a, b) => b - a);
            let deriction = 1;
            if (this.layoutOptions.from === 'right') {
                [leftLevels, rightLevels] = [rightLevels, leftLevels];
                deriction = -1;
            }
            let moved = 0;
            for (const level of rightLevels) {
                const prevLevel = level - deriction;
                const prevMinX = levelMinXMap.get(prevLevel);
                const prevMaxWidth = levelMaxWidthMap.get(prevLevel);
                const minX = levelMinXMap.get(level) + moved;
                const maxWidth = levelMaxWidthMap.get(level);
                const prevEnd = prevMinX + prevMaxWidth + gap;
                if (prevEnd > minX) {
                    const buff = prevEnd - minX;
                    // console.log('[xxxxx]move', prevLevel, level, prevEnd, minX, buff);
                    moved = buff;

                    const levelNodes = levelNodesMap.get(level)!;
                    for (const node of levelNodes) {
                        node.lot.x += moved;
                    }
                    levelMinXMap.set(level, minX + buff);
                } else {
                    // console.log('[xxxxx]goon', prevLevel, level, prevEnd, minX);
                    levelMinXMap.set(level, minX);
                }
            }
            moved = 0;
            for (const level of leftLevels) {
                const prevLevel = level + deriction;
                const prevMinX = levelMinXMap.get(prevLevel);
                const prevMaxWidth = levelMaxWidthMap.get(prevLevel);
                const minX = levelMinXMap.get(level) + moved;
                const maxWidth = levelMaxWidthMap.get(level);
                const prevEnd = prevMinX - gap;
                if (minX + maxWidth > prevEnd) {
                    const buff = prevEnd - (minX + maxWidth);
                    moved = buff;
                    const levelNodes = levelNodesMap.get(level)!;
                    for (const node of levelNodes) {
                        node.lot.x += moved;
                    }
                    levelMinXMap.set(level, minX + buff);
                } else {
                    levelMinXMap.set(level, minX);
                }
            }
        } else {
            const levelMaxHeightMap = new Map<number, number>();
            const levelMinYMap = new Map<number, number>();
            for (const level of levels) {
                const levelNodes = levelNodesMap.get(level)!;
                const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                levelMaxHeightMap.set(level, Math.max(...levelCalcNodes.map(n => n.height)));
                levelMinYMap.set(level, Math.min(...levelCalcNodes.map(n => n.y)));
            }
            const gap = this.layoutOptions.treeNodeGapV;
            let rightLevels = levels.filter(l => l > 0).sort((a, b) => a - b);
            let leftLevels = levels.filter(l => l < 0).sort((a, b) => b - a);
            let deriction = 1;
            if (this.layoutOptions.from === 'bottom') {
                [leftLevels, rightLevels] = [rightLevels, leftLevels];
                deriction = -1;
            }
            let moved = 0;
            for (const level of rightLevels) {
                const prevLevel = level - deriction;
                const prevMinX = levelMinYMap.get(prevLevel);
                const prevMaxWidth = levelMaxHeightMap.get(prevLevel);
                const minX = levelMinYMap.get(level) + moved;
                const maxWidth = levelMaxHeightMap.get(level);
                const prevEnd = prevMinX + prevMaxWidth + gap;
                if (prevEnd > minX) {
                    const buff = prevEnd - minX;
                    // console.log('[xxxxx]move', prevLevel, level, prevEnd, minX, buff);
                    moved = buff;

                    const levelNodes = levelNodesMap.get(level)!;
                    for (const node of levelNodes) {
                        node.lot.y += moved;
                    }
                    levelMinYMap.set(level, minX + buff);
                } else {
                    // console.log('[xxxxx]goon', prevLevel, level, prevEnd, minX);
                    levelMinYMap.set(level, minX);
                }
            }
            moved = 0;
            for (const level of leftLevels) {
                const prevLevel = level + deriction;
                const prevMinX = levelMinYMap.get(prevLevel);
                const prevMaxWidth = levelMaxHeightMap.get(prevLevel);
                const minX = levelMinYMap.get(level) + moved;
                const maxWidth = levelMaxHeightMap.get(level);
                const prevEnd = prevMinX - gap;
                if (minX + maxWidth > prevEnd) {
                    const buff = prevEnd - (minX + maxWidth);
                    moved = buff;
                    const levelNodes = levelNodesMap.get(level)!;
                    for (const node of levelNodes) {
                        node.lot.y += moved;
                    }
                    levelMinYMap.set(level, minX + buff);
                } else {
                    levelMinYMap.set(level, minX);
                }
            }
        }
    }
    gatherNodes(groupNodes: RGNode[], hv: 'h' | 'v', perSize: number) {
        if (!this.enableGatherNodes) {
            return;
        }
        const {calcNodes, calcNodeMap} = this.generateCalcNodes<CalcNode & {
            movedNodeSizeBefore: number,
            movedNodeSizeAfter: number,
        }>(groupNodes);
        // initial
        calcNodes.forEach(calcNode => {
            calcNode.movedNodeSizeBefore = 1;
            calcNode.movedNodeSizeAfter = 1;
        });
        const { levelNodesMap } = this.generateLevels(groupNodes);
        groupNodes.forEach(thisNode => {
            if (thisNode.fixed === true) return;
            if (thisNode.lot.level !== 0) {
                const levelNodes = levelNodesMap.get(thisNode.lot.level) || [];
                if (thisNode.lot.strengthWithChilds === 1) {
                    if (thisNode.lot.childrenSizeVisible! <= 1) {
                        const bloomingNode = this.getBloomingNearByParent(thisNode, thisNode.lot.parent!, levelNodes, hv);
                        if (bloomingNode) {
                            const calcNode = calcNodeMap.get(thisNode.id);
                            if (hv === 'h') {
                                if (thisNode.lot.y - bloomingNode.lot.y > 0) {
                                    thisNode.lot.y = bloomingNode.lot.y! + perSize * calcNode.movedNodeSizeAfter;
                                    calcNode.movedNodeSizeAfter++;
                                } else {
                                    thisNode.lot.y = bloomingNode.lot.y! - perSize * calcNode.movedNodeSizeBefore;
                                    calcNode.movedNodeSizeBefore++;
                                }
                            } else {
                                if (thisNode.lot.x - bloomingNode.lot.x > 0) {
                                    thisNode.lot.x = bloomingNode.lot.x! + perSize * calcNode.movedNodeSizeAfter;
                                    calcNode.movedNodeSizeAfter++;
                                } else {
                                    thisNode.lot.x = bloomingNode.lot.x! - perSize * calcNode.movedNodeSizeBefore;
                                    calcNode.movedNodeSizeBefore++;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    getBloomingNearByParent(node: RGNode, parentNode: RGNode, levelNodes: RGNode[], hv: 'h' | 'v'): RGNode | undefined {
        let minDistance = 9999;
        let minNode: RGNode | undefined;
        for (const thisNode of levelNodes) {
            if (thisNode.lot.childrenSizeVisible! > 1 && thisNode.lot.parent === parentNode) {
                const distance = hv === 'h' ? thisNode.lot.y - parentNode.lot.y : thisNode.lot.x - parentNode.lot.x;
                if (Math.abs(distance) < minDistance) {
                    minDistance = Math.abs(distance);
                    minNode = thisNode;
                }
            }
        }
        if (minNode && minNode !== node) {
            return minNode;
        }
    }
}

export default RGTreeLayout;
