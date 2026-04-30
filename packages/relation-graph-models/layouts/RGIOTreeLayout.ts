import {devLog} from '../utils/RGCommon';
import {RGNodesAnalytic} from '../utils/RGNodesAnalytic';
import RGBaseLayout from './RGBaseLayout';
import {RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions} from '../../types';
import RGGraphMath from "../utils/RGGraphMath";

export class RGIOTreeLayout extends RGBaseLayout {
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
        } else {
            if (!this.layoutOptions.alignItemsX)this.layoutOptions.alignItemsX = 'start';
            if (!this.layoutOptions.alignItemsY)this.layoutOptions.alignItemsY = 'start';
            if (!this.layoutOptions.alignParentItemsX)this.layoutOptions.alignParentItemsX = this.getReverseAlignItems(this.layoutOptions.alignItemsX);
            if (!this.layoutOptions.alignParentItemsY)this.layoutOptions.alignParentItemsY = this.layoutOptions.alignItemsY;
        }
        // console.log('this.layoutOptions.alignItemsX:2:', this.layoutOptions.alignItemsX);
        if (this.layoutOptions.ignoreNodeSize === undefined) this.layoutOptions.ignoreNodeSize = false;
        // 下面这段很奇怪的代码是用来兼容旧版本的配置的，在后续旧版本没有人使用的时候会重构
        const _toleranceValue = this.layoutOptions.layoutExpansionDirection as string;
        const layoutExpansionDirection: "start" | "center" | "end" = (_toleranceValue === 'start' || _toleranceValue === 'left' || _toleranceValue === 'top') ? 'start' : ((_toleranceValue === 'end' || _toleranceValue === 'right' || _toleranceValue === 'bottom') ? 'end' : 'center');
        this.layoutOptions.layoutExpansionDirection = layoutExpansionDirection;
        if (this.layoutOptions.treeNodeGapH < 100) {
            this.layoutOptions.treeNodeGapH = 100;
        }
        if (this.layoutOptions.treeNodeGapV < 10) {
            this.layoutOptions.treeNodeGapV = 10;
        }
        if (this.layoutOptions.from === 'bottom' || this.layoutOptions.from === 'right') {
            this.rotate = 180;
        }
        if (this.layoutOptions.changeNodeSizeDuringLayout === undefined) {
            this.layoutOptions.changeNodeSizeDuringLayout = false;
        }
    }
    private rotate = 0;
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
        rootNode.lot.x = rootNode.x;
        rootNode.lot.y = rootNode.y;
        const groupNodes = allNodes;
        devLog('groupNodes:2:', groupNodes.length, groupNodes.map(n => n.text).join(','));
        const rotate = this.rotate;
        // console.log('rotate:', rotate);
        const {tree} = this.networkAnalyzer.analyzeNetwork(groupNodes, this.rootNode, false);
        this.placeNodesPosition(rootNode, groupNodes);
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
                // if (rotate) {
                //     const roatedXy = RGGraphMath.getRotatedPoint(thisNode.lot.x, thisNode.lot.y, rootCenterX, rootCenterY, rotate);
                //     thisNode.lot.x = roatedXy.x;
                //     thisNode.lot.y = roatedXy.y;
                // }
                if (this.layoutOptions.from === 'right') {
                    thisNode.lot.x = RGGraphMath.getFlippedX(thisNode.lot.x, rootXy.x);
                }
                if (this.layoutOptions.from === 'bottom') {
                    thisNode.lot.y = RGGraphMath.getFlippedY(thisNode.lot.y, rootXy.y);
                }
                // const nodeAlignOption = thisNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
                const x = this.layoutOptions.from === 'right' ? RGNodesAnalytic.getNodeXByLotX({alignItemsX: 'end'}, thisNode) : thisNode.lot.x;
                const y = this.layoutOptions.from === 'bottom' ? RGNodesAnalytic.getNodeYByLotY({alignItemsY: 'end'}, thisNode) : thisNode.lot.y;
                // thisNode.x = thisNode.lot.x;
                // thisNode.y = thisNode.lot.y;
                this.updateNodePosition(thisNode, x, y);

            }
        });
        // Since RGIOTreeLayout does not analyze node relationships through RGNetworkAnalyzer, it is necessary to assign childrenSize to rgChildrenSize here in order to correctly identify the number of child nodes of a node.
        for (const node of this.allNodes) {
            this.graphInstance.updateNode(node, {
                // rgChildrenSize: node.lot.childrenSize
                rgChildrenSize: node.lot.childs.length
            });
        }
        devLog('create rootNode coordinates:1', rootNode.x, rootNode.y);
        this.layoutEnd();
    };

    placeNodesPosition(rootNode: RGNode, groupNodes: RGNode[]) {
        this.placeRelativePosition(rootNode, groupNodes);
    }
    placeRelativePosition(rootNode: RGNode, _groupNodes: RGNode[]) {
        rootNode.lot.parent = undefined;
        rootNode.lot.level = 0;
        const networkNodes: RGNode[] = [];
        this.buildNetwork([rootNode], networkNodes, 0);
        const maxLevel = Math.max(...networkNodes.map(n => n.lot.level));
        const isHorizontal = this.layoutOptions.from === 'left' || this.layoutOptions.from === 'right';
        this.reduceNodeRect(networkNodes, maxLevel, isHorizontal);
        // rootNode.lot.x -= rootNode.lot.width_with_childs / 2;
        if (isHorizontal) {
            this.placeNodeChildrenH(networkNodes, 0);
        } else {
            this.placeNodeChildrenV(networkNodes, 0);
        }
        let rootOffsetX = rootNode.lot.x - rootNode.x;
        let rootOffsetY = rootNode.lot.y - rootNode.y;
        if (this.layoutOptions.from === 'right') {
            rootOffsetX += rootNode.lot.width;
        }
        if (this.layoutOptions.from === 'bottom') {
            rootOffsetY += rootNode.lot.height;
        }
        networkNodes.forEach(thisNode => {
            if (thisNode.fixed === true) return;
            thisNode.lot.x -= rootOffsetX;
            thisNode.lot.y -= rootOffsetY;
        });
        // console.log('levelMaxWidthMap:', rootNode.id);
    }
    private buildNetwork(thisLevelNodes: RGNode[], networkNodes: RGNode[], level: number) {
        if (level === 0) {
            networkNodes.push(...thisLevelNodes);
        }
        const nextLevelNodes: RGNode[] = [];
        thisLevelNodes.forEach(thisNode => {
            if (!RGNodesAnalytic.isVisibleNode(thisNode)) {
                return;
            }
            const _fromNodes = this.graphInstance.getNodeIncomingNodes(thisNode).filter(RGNodesAnalytic.isVisibleNode);
            const _toNodes = this.graphInstance.getNodeOutgoingNodes(thisNode).filter(RGNodesAnalytic.isVisibleNode);
            const toNodes = _toNodes.filter(n => !networkNodes.includes(n));
            networkNodes.push(...toNodes);
            const fromNodes = _fromNodes.filter(n => !networkNodes.includes(n));
            networkNodes.push(...fromNodes);
            thisNode.lot.level = level;
            thisNode.lot.toNodes = toNodes;
            thisNode.lot.fromNodes = fromNodes;
            for (const n of fromNodes.concat(toNodes)) {
                n.lot.parent = thisNode;
                if (!nextLevelNodes.includes(n)) {
                    nextLevelNodes.push(n);
                }
            }
        });
        if (nextLevelNodes.length > 0) {
            this.buildNetwork(nextLevelNodes, networkNodes, level + 1);
        }
    }
    private reduceNodeRect(networkNodes: RGNode[], level: number, isHorizontal = false) {
        let treeNodeGapH = this.layoutOptions.treeNodeGapH!;
        let treeNodeGapV = this.layoutOptions.treeNodeGapV!;
        // if (isHorizontal) {
        //     [treeNodeGapH, treeNodeGapV] = [treeNodeGapV, treeNodeGapH];
        // }
        const padding = treeNodeGapH;
        const paddingV = treeNodeGapV;
        const levelNodes = networkNodes.filter(n => n.lot.level === level);
        // console.log('reduceNodeRect:level:', level, levelNodes.length)
        for (const node of levelNodes) {
            if (!RGNodesAnalytic.isVisibleNode(node)) {
                continue;
            }
            let width = node.width || node.el_W || 50;
            let height = node.height || node.el_H || 50;
            node.lot.width = width;
            node.lot.height = height;
            if (node.lot.toNodes.length === 0 && node.lot.fromNodes.length === 0) {
                node.lot.width_with_childs = width;
                node.lot.height_with_childs = height;
            } else {
                if (isHorizontal) {
                    let maxWidthFrom = 0;
                    let heightFrom = 0;
                    for (const cNode of node.lot.fromNodes) {
                        if (cNode.lot.height_with_childs > heightFrom) heightFrom = cNode.lot.height_with_childs;
                        maxWidthFrom += (cNode.lot.width_with_childs + paddingV);
                    }
                    let maxWidthTo = 0;
                    let heightTo = 0;
                    for (const cNode of node.lot.toNodes) {
                        if (cNode.lot.height_with_childs > heightTo) heightTo = cNode.lot.height_with_childs;
                        maxWidthTo += (cNode.lot.width_with_childs + paddingV);
                    }
                    if (this.layoutOptions.changeNodeSizeDuringLayout) {
                        height = 0;
                    }
                    height = (Math.max(heightFrom + padding / 2, height / 2)) + (Math.max(heightTo + padding / 2, height / 2));
                    node.lot.width_with_childs = width + Math.max(maxWidthFrom, maxWidthTo) + paddingV;
                    node.lot.height_with_childs = height;
                } else {
                    let maxWidthFrom = 0;
                    let heightFrom = 0;
                    for (const cNode of node.lot.fromNodes) {
                        if (cNode.lot.width_with_childs > maxWidthFrom) maxWidthFrom = cNode.lot.width_with_childs;
                        heightFrom += (cNode.lot.height_with_childs + paddingV);
                    }
                    let maxWidthTo = 0;
                    let heightTo = 0;
                    for (const cNode of node.lot.toNodes) {
                        if (cNode.lot.width_with_childs > maxWidthTo) maxWidthTo = cNode.lot.width_with_childs;
                        heightTo += (cNode.lot.height_with_childs + paddingV);
                    }
                    if (this.layoutOptions.changeNodeSizeDuringLayout) {
                        width = 0;
                    }
                    width = (Math.max(maxWidthFrom + padding / 2, width / 2)) + (Math.max(maxWidthTo + padding / 2, width / 2));
                    node.lot.width_with_childs = width;
                    node.lot.height_with_childs = height + Math.max(heightFrom, heightTo) + paddingV;
                }
            }
        }
        if (level >= 0) {
            this.reduceNodeRect(networkNodes, level - 1, isHorizontal);
        }
    }
    private placeNodeChildrenV(networkNodes: RGNode[], level: number) {
        const treeNodeGapH = this.layoutOptions.treeNodeGapH!;
        const treeNodeGapV = this.layoutOptions.treeNodeGapV!;
        const padding = treeNodeGapH;
        const paddingV = treeNodeGapV;
        let currentLevelNodes = 0;
        const levelNodes = networkNodes.filter(n => n.lot.level === level);
        // console.log('placeNodeChildren:level:', level, levelNodes.length)

        for (const node of levelNodes) {
            currentLevelNodes++;
            let width = node.lot.width;
            if (this.layoutOptions.changeNodeSizeDuringLayout) {
                width = 0;
            }
            if (level === 0) {
                node.lot.groupStartX = node.lot.x + width / 2 - node.lot.width_with_childs / 2;;
            }
            const groupStartX = node.lot.groupStartX;
            const baseY = node.lot.y;
            let maxWidthFrom = 0;
            let maxWidthTo = 0;
            for (const cNode of node.lot.fromNodes) {
                if (cNode.lot.width_with_childs > maxWidthFrom) maxWidthFrom = cNode.lot.width_with_childs;
            }
            for (const cNode of node.lot.toNodes) {
                if (cNode.lot.width_with_childs > maxWidthTo) maxWidthTo = cNode.lot.width_with_childs;
            }
            const baseX = groupStartX + (Math.max(maxWidthFrom + padding / 2, width / 2));
            if (node.lot.fromNodes.length > 0) {
                let sumY = node.lot.height + paddingV;
                for (const cNode of node.lot.fromNodes) {
                    cNode.lot.groupStartX = baseX - cNode.lot.width_with_childs - padding / 2;
                    cNode.lot.y = baseY + sumY + paddingV;
                    sumY += (cNode.lot.height_with_childs + paddingV);
                }
            }
            if (node.lot.toNodes.length > 0) {
                let sumY = node.lot.height + paddingV;
                for (const cNode of node.lot.toNodes) {
                    cNode.lot.groupStartX = baseX + padding / 2;
                    cNode.lot.y = baseY + sumY + paddingV;
                    sumY += (cNode.lot.height_with_childs + paddingV);
                }
            }
            if (maxWidthFrom > 0 || maxWidthTo > 0) {
                if (this.layoutOptions.changeNodeSizeDuringLayout) {
                    node.lot.x = groupStartX;
                    node.width = node.lot.width_with_childs
                } else {
                    node.lot.x = baseX - node.lot.width / 2;
                }
            } else {
                node.lot.x = groupStartX;
            }
        }
        if (currentLevelNodes > 0) {
            this.placeNodeChildrenV(networkNodes, level + 1);
        }
    }
    private placeNodeChildrenH(networkNodes: RGNode[], level: number) {
        const treeNodeGapH = this.layoutOptions.treeNodeGapH!;
        const treeNodeGapV = this.layoutOptions.treeNodeGapV!;
        const padding = treeNodeGapH;
        const paddingV = treeNodeGapV;
        let currentLevelNodes = 0;
        const levelNodes = networkNodes.filter(n => n.lot.level === level);
        // console.log('placeNodeChildren:level:', level, levelNodes.length)

        for (const node of levelNodes) {
            currentLevelNodes++;
            let height = node.lot.height;
            if (this.layoutOptions.changeNodeSizeDuringLayout) {
                height = 0;
            }
            if (level === 0) {
                node.lot.groupStartY = node.lot.y + height / 2 - node.lot.height_with_childs / 2;;
            }
            const groupStartY = node.lot.groupStartY;
            const baseX = node.lot.x;
            let maxHeightFrom = 0;
            let maxHeightTo = 0;
            for (const cNode of node.lot.fromNodes) {
                if (cNode.lot.height_with_childs > maxHeightFrom) maxHeightFrom = cNode.lot.height_with_childs;
            }
            for (const cNode of node.lot.toNodes) {
                if (cNode.lot.height_with_childs > maxHeightTo) maxHeightTo = cNode.lot.height_with_childs;
            }
            const baseY = groupStartY + (Math.max(maxHeightFrom + padding / 2, height / 2));
            if (node.lot.fromNodes.length > 0) {
                let sumX = node.lot.width + paddingV;
                for (const cNode of node.lot.fromNodes) {
                    cNode.lot.groupStartY = baseY - cNode.lot.height_with_childs - padding / 2;
                    cNode.lot.x = baseX + sumX + paddingV;
                    sumX += (cNode.lot.width_with_childs + paddingV);
                }
            }
            if (node.lot.toNodes.length > 0) {
                let sumX = node.lot.width + paddingV;
                for (const cNode of node.lot.toNodes) {
                    cNode.lot.groupStartY = baseY + padding / 2;
                    cNode.lot.x = baseX + sumX + paddingV;
                    sumX += (cNode.lot.width_with_childs + paddingV);
                }
            }
            if (maxHeightFrom > 0 || maxHeightTo > 0) {
                if (this.layoutOptions.changeNodeSizeDuringLayout) {
                    node.lot.y = groupStartY;
                    node.height = node.lot.height_with_childs
                } else {
                    node.lot.y = baseY - node.lot.height / 2;
                }
            } else {
                node.lot.y = groupStartY;
            }
        }
        if (currentLevelNodes > 0) {
            this.placeNodeChildrenH(networkNodes, level + 1);
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
}

export default RGIOTreeLayout;
