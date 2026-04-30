import {devLog} from '../utils/RGCommon';
import {RGNodesAnalytic} from '../utils/RGNodesAnalytic';
import RGBaseLayout from './RGBaseLayout';
import {CalcNode, RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions} from '../../types';
import RGForceLayout from "./RGForceLayout";
import RGGraphMath from "../utils/RGGraphMath";
import {NodesAnalyticResult} from "./analyzers/RGNetworkAnalyzer";

export class RGSmartTreeLayout extends RGBaseLayout {
    constructor(layoutOptions: RGTreeLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance) {
        super(layoutOptions, graphOptions, graphInstance);
        this.layoutOptions = layoutOptions;
        devLog('new RGSmartTreeLayout:', this.layoutOptions);
        if (!this.layoutOptions.from) this.layoutOptions.from = 'left';
        if (this.layoutOptions.levelGaps) {
            if (Array.isArray(this.layoutOptions.levelGaps)) {
                this.levelGaps = this.layoutOptions.levelGaps;
            } else {
                console.error('Error levelDistance, levelDistance must is Array');
            }
        }
        const from = this.layoutOptions.from;
        if (from === 'top' || from === 'bottom') {
            if (!this.layoutOptions.treeNodeGapH) this.layoutOptions.treeNodeGapH = 10;
            if (!this.layoutOptions.treeNodeGapV) this.layoutOptions.treeNodeGapV = 30;
            if (this.layoutOptions.treeNodeGapV < 30) {
                this.layoutOptions.treeNodeGapV = 30;
            }
        } else {
            if (!this.layoutOptions.treeNodeGapH) this.layoutOptions.treeNodeGapH = 30;
            if (!this.layoutOptions.treeNodeGapV) this.layoutOptions.treeNodeGapV = 10;
            if (this.layoutOptions.treeNodeGapH < 30) {
                this.layoutOptions.treeNodeGapH = 30;
            }
        }
        if (from === 'top') {
            if (!this.layoutOptions.alignItemsX) this.layoutOptions.alignItemsX = 'center';
            if (!this.layoutOptions.alignItemsY) this.layoutOptions.alignItemsY = 'start';
            if (!this.layoutOptions.alignParentItemsX) this.layoutOptions.alignParentItemsX = this.layoutOptions.alignItemsX;
            if (!this.layoutOptions.alignParentItemsY) this.layoutOptions.alignParentItemsY = this.getReverseAlignItems(this.layoutOptions.alignItemsY);
        } else if (from === 'bottom') {
            if (!this.layoutOptions.alignItemsX) this.layoutOptions.alignItemsX = 'center';
            if (!this.layoutOptions.alignItemsY) this.layoutOptions.alignItemsY = 'end';
            if (!this.layoutOptions.alignParentItemsX) this.layoutOptions.alignParentItemsX = this.layoutOptions.alignItemsX;
            if (!this.layoutOptions.alignParentItemsY) this.layoutOptions.alignParentItemsY = this.getReverseAlignItems(this.layoutOptions.alignItemsY);
        } else if (from === 'right') {
            if (!this.layoutOptions.alignItemsX) this.layoutOptions.alignItemsX = 'end';
            if (!this.layoutOptions.alignItemsY) this.layoutOptions.alignItemsY = 'center';
            if (!this.layoutOptions.alignParentItemsX) this.layoutOptions.alignParentItemsX = this.getReverseAlignItems(this.layoutOptions.alignItemsX);
            if (!this.layoutOptions.alignParentItemsY) this.layoutOptions.alignParentItemsY = this.layoutOptions.alignItemsY;
        } else {
            if (!this.layoutOptions.alignItemsX) this.layoutOptions.alignItemsX = 'end';
            if (!this.layoutOptions.alignItemsY) this.layoutOptions.alignItemsY = 'center';
            if (!this.layoutOptions.alignParentItemsX) this.layoutOptions.alignParentItemsX = this.getReverseAlignItems(this.layoutOptions.alignItemsX);
            if (!this.layoutOptions.alignParentItemsY) this.layoutOptions.alignParentItemsY = this.layoutOptions.alignItemsY;
        }
        // console.log('this.layoutOptions.alignItemsX:2:', this.layoutOptions.alignItemsX, this.layoutOptions.alignItemsY);
        this.requireLinks = true;
        this.graphInstance = graphInstance;
    }

    graphInstance: RelationGraphInstance
    layoutOptions: RGTreeLayoutOptions;
    levelGaps: number[] = [];

    placeNodes(allNodes: RGNode[], rootNode: RGNode) {
        devLog('RGSmartTreeLayout:placeNodes');
        if (!rootNode) {
            console.error('root is null');
            return;
        } else {
            devLog('layout by root:', rootNode);
        }
        this.rootNode = rootNode;
        this.allNodes = allNodes;
        devLog('allNodes:', allNodes.length);
        const childrenTreeAlign = {
            alignItemsX: this.layoutOptions.alignItemsX,
            alignItemsY: this.layoutOptions.alignItemsY,
        };
        const parentTreeAlign = {
            alignItemsX: this.layoutOptions.alignParentItemsX,
            alignItemsY: this.layoutOptions.alignParentItemsY,
        };
        const {tree, reverseTree} = this.networkAnalyzer.analyzeNetwork(allNodes, this.rootNode, true, true);
        if (rootNode.fixed || this.layoutOptions.fixedRootNode) {
            // 什么都不做
        } else {
            this.updateNodePosition(rootNode, 0, 0);
        }
        const rootLotXY = RGNodesAnalytic.getNodeLotXY(childrenTreeAlign, rootNode);
        rootNode.lot.x = rootLotXY.x;
        rootNode.lot.y = rootLotXY.y;
        this.placeRelativePosition(rootNode, [...tree.networkNodes].concat(reverseTree.networkNodes), Math.max(tree.analyticResult.max_strength, reverseTree.analyticResult.max_strength));
        devLog('allNodes:', allNodes.length);
        const rotate = {
            'left': 0,
            'top': 90,
            'right': 180,
            'bottom': 270,
        }[this.layoutOptions.from!];
        const rootXy = {x: rootNode.x, y: rootNode.y};
        this.allNodes.forEach(thisNode => {
            if (thisNode.fixed === true) {
                return;
            }
            if (!thisNode.rgCalcedVisibility) return;
            if (Number.isNaN(thisNode.lot.x)) {
                devLog('bad lot x:', thisNode.text, thisNode.lot.x);
                thisNode.lot.x = 0;
            }
            if (Number.isNaN(thisNode.lot.y)) {
                devLog('bad lot y:', thisNode.text, thisNode.lot.y);
                thisNode.lot.y = 0;
            }
            if (rotate) {
                const roatedXy = RGGraphMath.getRotatedPoint(thisNode.lot.x, thisNode.lot.y, rootXy.x, rootXy.y, rotate);
                thisNode.lot.x = roatedXy.x;
                thisNode.lot.y = roatedXy.y;
            }
            const nodeAlignOption = thisNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
            const x = RGNodesAnalytic.getNodeXByLotX(nodeAlignOption, thisNode);
            const y = RGNodesAnalytic.getNodeYByLotY(nodeAlignOption, thisNode);
            this.updateNodePosition(thisNode, x, y);
        });
        devLog('create rootNode coordinates:1', rootNode.x, rootNode.y);
        const currentLayoutClone = new RGForceLayout({
            layoutName: 'force',
            maxLayoutTimes: 30,
            force_node_repulsion: 0.1,
            force_line_elastic: 1,
            fixedRootNode: true,
            disableLiveChanges: true
        }, this.graphOptions, this.graphInstance);
        currentLayoutClone.isMainLayouer = false;
        currentLayoutClone.requireLinks = true;
        if (this.layoutOptions.from === 'top' || this.layoutOptions.from === 'bottom') {
            currentLayoutClone.lockY = true;
        } else {
            currentLayoutClone.lockX = true;
        }
        const rootNodeFixedOrignValue = rootNode.fixed;
        rootNode.fixed = true;
        currentLayoutClone.skipInitLayout = true;
        currentLayoutClone.resetCalcNodes();
        setTimeout(() => {
            rootNode.fixed = rootNodeFixedOrignValue;
        }, 800);
        // currentLayoutClone.onTick(() => {
        //     this.graphInstance._dataUpdated();
        // });
        currentLayoutClone.onFinish(() => {
            rootNode.fixed = rootNodeFixedOrignValue;
            if (this.graphInstance) {
                this.graphInstance.enableNodeXYAnimation();
                this.graphInstance._dataUpdated();
            }
            this.applyNodesGap(this.allNodes);
            if (this.graphInstance) {
                this.graphInstance._dataUpdated();
                this.allNodes.forEach(thisNode => {
                    this.graphInstance.updateNode(thisNode, {
                        x: thisNode.x,
                        y: thisNode.y,
                    })
                })
                setTimeout(() => {
                    this.graphInstance.disableNodeXYAnimation();
                    this.graphInstance._dataUpdated();
                }, 300);
            }
        });
        currentLayoutClone.placeNodes(this.allNodes, rootNode);
        this.layoutEnd();
    };

    placeRelativePosition(rootNode: RGNode, groupNodes: RGNode[], max_strength: number) {
        const hv = this.layoutOptions.from === 'top' || this.layoutOptions.from === 'bottom' ? 'v' : 'h';
        let treeNodeGapH = this.layoutOptions.treeNodeGapH || 300;
        let treeNodeGapV = this.layoutOptions.treeNodeGapV || 10;
        if (hv === 'v') {
            [treeNodeGapH, treeNodeGapV] = [treeNodeGapV, treeNodeGapH];
        }

        const {levels, levelNodesMap} = this.generateLevels(groupNodes);
        const levelMaxWidthMap = new Map<number, number>();
        for (const level of levels) {
            const levelNodes = levelNodesMap.get(level)!;
            levelMaxWidthMap.set(level, Math.max(...levelNodes.map(n => n.el_W)));
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
            thisNode.lot.x = rootNode.lot.x! + this.getLevelDistance(thisNode.lot.level, levelMaxWidthMap, treeNodeGapH);
        });
        groupNodes.forEach(thisNode => {
            if (thisNode.fixed === true) return;
            if (thisNode === rootNode) return;
            if (thisNode.lot.level === 0) {
                thisNode.lot.y = rootNode.lot.y! + __per_height * thisNode.lot.index_of_level!;
            } else {
                thisNode.lot.y = rootNode.lot.y! + __per_height * ((max_strength / -2) + thisNode.lot.strengthWithChilds_from! + thisNode.lot.strengthWithChilds! / 2);
            }
        });
    }

    applyNodesGap(groupNodes: RGNode[]) {
        const hv = this.layoutOptions.from === 'top' || this.layoutOptions.from === 'bottom' ? 'v' : 'h';
        const {levels, levelNodesMap} = this.generateLevels(groupNodes);
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
            calcNode.x = calcNode.rgNode.x;
            calcNode.y = calcNode.rgNode.y;
            calcNode.width = calcNode.rgNode.el_W;
            calcNode.height = calcNode.rgNode.el_H;
            calcNode.buffY = 0;
        });
        for (const level of levels) {
            const levelNodes = levelNodesMap.get(level) || [];
            if (hv === 'h') {
                const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                const upNodes = levelCalcNodes.filter(n => n.y < this.rootNode.y).sort((a, b) => b.y - a.y);
                const downNodes = levelCalcNodes.filter(n => n.y >= this.rootNode.y).sort((a, b) => a.y - b.y);
                this.adjustNodePositions(upNodes, 'top', 5);
                this.adjustNodePositions(downNodes, 'bottom', 5);
                for (const calcNode of levelCalcNodes) {
                    calcNode.rgNode.y = calcNode.y;
                }
            } else {
                const levelCalcNodes = levelNodes.map(n => calcNodeMap.get(n.id));
                const upNodes = levelCalcNodes.filter(n => n.x < this.rootNode.x).sort((a, b) => b.x - a.x);
                const downNodes = levelCalcNodes.filter(n => n.x >= this.rootNode.x).sort((a, b) => a.x - b.x);
                this.adjustNodePositions(upNodes, 'left', 5);
                this.adjustNodePositions(downNodes, 'right', 5);
                for (const calcNode of levelCalcNodes) {
                    calcNode.rgNode.x = calcNode.x;
                }
            }
            // console.log('levelNodes:', level, levelNodes);
        }
    }

    getLevelDistance(level: number, levelMaxSizeMap: Map<number, number>, defaultGap: number) {
        if (level === 0) {
            return 0;
        }
        if (level > 0) {
            let sumDistance = 0;
            for (let i = 1; i <= level; i++) {
                const levelMaxSize = levelMaxSizeMap.get(i);
                sumDistance += (levelMaxSize + this.getLevelGap(i, defaultGap, levelMaxSize));
            }
            return sumDistance;
        } else {
            let sumDistance = 0;
            for (let i = -1; i >= level; i--) {
                const levelMaxSize = levelMaxSizeMap.get(i);
                sumDistance += (levelMaxSize + this.getLevelGap(i, defaultGap, levelMaxSize));
            }
            return -sumDistance;
        }
    }

    private getLevelGap(level: number, defaultGap: number, levelMaxSize: number) {
        let levelGap = defaultGap + (level === -1 ? levelMaxSize / 2 : 0);
        if (this.layoutOptions.levelGaps?.length > 0) {
            const gap = this.layoutOptions.levelGaps[Math.abs(level)];
            if (gap) {
                levelGap = gap;
            }
        }
        return levelGap;
    }
}

export default RGSmartTreeLayout;
