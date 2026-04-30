import {devLog} from '../utils/RGCommon';
import {RGNodesAnalytic} from '../utils/RGNodesAnalytic';
import RGBaseLayout from './RGBaseLayout';
import {RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions} from '../../types';
import {NodesAnalyticResult, type RGLevelDirection} from "./analyzers/RGNetworkAnalyzer";

export class RGFolderLayout extends RGBaseLayout {
    constructor(layoutOptions: RGTreeLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance) {
        super(layoutOptions, graphOptions, graphInstance);
        this.layoutOptions = layoutOptions;
        devLog('new RGFolderLayout:', this.layoutOptions);
        if (!this.layoutOptions.from) this.layoutOptions.from = 'left';
        if (!this.layoutOptions.treeNodeGapH) this.layoutOptions.treeNodeGapH = 10;
        if (!this.layoutOptions.treeNodeGapV) this.layoutOptions.treeNodeGapV = 10;
        if (!this.layoutOptions.levelGaps) this.layoutOptions.levelGaps = [];
        if (this.layoutOptions.bottomJunctionPointOffsetX === undefined) this.layoutOptions.bottomJunctionPointOffsetX = -50;

        const from = this.layoutOptions.from;
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
        if (this.layoutOptions.levelDistance) {
            console.error('Error: levelDistance is not support， Please use levelGaps, treeNodeGapH, treeNodeGapV option in layoutOptions');
        }
        this.enableGatherNodes = this.layoutOptions.enableGatherNodes;
        // this.layoutOptions.layoutExpansionDirection; // 节点扩展方向[left/top]/center/[right/bottom]
    }

    enableGatherNodes = false;
    layoutOptions: RGTreeLayoutOptions;

    placeNodes(allNodes: RGNode[], rootNode: RGNode) {
        devLog('RGFolderLayout:placeNodes');
        if (!rootNode) {
            console.error('root is null');
            return;
        } else {
            devLog('layout by root:', rootNode);
        }
        this.rootNode = rootNode;
        this.allNodes = allNodes;
        // console.log('fixedRootNode:', this.layoutOptions.fixedRootNode);

        const childrenTreeAlign = {
            alignItemsX: this.layoutOptions.alignItemsX,
            alignItemsY: this.layoutOptions.alignItemsY,
        };
        const parentTreeAlign = {
            alignItemsX: this.layoutOptions.alignParentItemsX,
            alignItemsY: this.layoutOptions.alignParentItemsY,
        };
        if (rootNode.fixed || this.layoutOptions.fixedRootNode) {
            // 什么都不做
        } else {
            this.updateNodePosition(rootNode, 0, 0);
        }
        const rootLotXY = RGNodesAnalytic.getNodeLotXY(childrenTreeAlign, rootNode);
        rootNode.lot.x = rootLotXY.x;
        rootNode.lot.y = rootLotXY.y;

        devLog('allNodes:', allNodes.length);
        this.networkAnalyzer.isFolderLayout = true;
        const {tree} = this.networkAnalyzer.analyzeNetwork(allNodes, rootNode, false, false);
        this.placeRelativePosition(rootNode, tree.networkNodes, tree.analyticResult);
        devLog('networkNodes:', tree.networkNodes.length);
        this.allNodes.forEach(thisNode => {
            if (thisNode.fixed === true) {
                return;
            }
            if (Number.isNaN(thisNode.lot.x)) {
                devLog('bad lot x:', thisNode.text, thisNode.lot.x);
                thisNode.lot.x = 0;
            }
            if (Number.isNaN(thisNode.lot.y)) {
                devLog('bad lot y:', thisNode.text, thisNode.lot.y);
                thisNode.lot.y = 0;
            }
            if (thisNode === rootNode) {
                // 什么都不做
            } else {
                const nodeAlignOption = thisNode.lot.level < 0 ? parentTreeAlign : childrenTreeAlign;
                const x = RGNodesAnalytic.getNodeXByLotX(nodeAlignOption, thisNode);
                const y = RGNodesAnalytic.getNodeYByLotY(nodeAlignOption, thisNode);
                this.updateNodePosition(thisNode, x, y);
            }
        });
        devLog('create rootNode coordinates:1', rootNode.x, rootNode.y);
        this.layoutEnd();
    };
    // analysis() {
    //     let groupNodes = [];
    //     let analyticResult = {
    //         max_deep: 1,
    //         max_length: 1,
    //         max_strength: 1
    //     };
    //     this.analysisNodesForFolder(groupNodes, [this.rootNode], 0, analyticResult);
    //     groupNodes = [];
    //     analyticResult = {
    //         max_deep: 1,
    //         max_length: 1,
    //         max_strength: 1
    //     };
    //     this.analysisNodes4Tree(groupNodes, [this.rootNode], 0, analyticResult, 1);
    // }
    // analysisNodes4Tree(willLayoutNodes:RGNode[], thisLevelNodes:RGNode[], thisDeep:number, analyticResult:NodesAnalyticResult, levelDirect:RGLevelDirection) {
    //     devLog(`${levelDirect} level ${thisDeep} size: ${thisLevelNodes.length}`)
    //     if (thisLevelNodes.length > analyticResult.max_length) {
    //         analyticResult.max_length = thisLevelNodes.length;
    //     }
    //     if (thisDeep > analyticResult.max_deep) {
    //         analyticResult.max_deep = thisDeep;
    //     }
    //     const __thisLOT_subling = {
    //         level: thisDeep,
    //         all_size: thisLevelNodes.length,
    //         all_strength: 0
    //     };
    //     const newLevelNodes:RGNode[] = [];
    //     thisLevelNodes.forEach(thisNode => {
    //         if (!thisNode.lot)thisNode.lot = { childs: [] };
    //         thisNode.lot.eached = true;
    //         thisNode.lot.subling = __thisLOT_subling;
    //         thisNode.lot.level = thisDeep;
    //         willLayoutNodes.push(thisNode);
    //     });
    //     let __thisLevel_index = 0;
    //     // var __prev_node
    //     thisLevelNodes.forEach(thisNode => {
    //         let __thisNode_child_size = 0;
    //         const childNodes = this.graphInstance.getNodeRelatedNodes(thisNode);
    //         let __thisTargetIndex = 0;
    //         childNodes.forEach((thisTarget) => {
    //             if (!thisTarget.lot) thisTarget.lot = {eached: false, childs: []};
    //             if (!thisTarget.lot.eached) {
    //                 thisTarget.lot.eached = true;
    //                 if (thisTarget.rgCalcedVisibility) {
    //                     thisTarget.lot.parent = thisNode;
    //                     thisTarget.lot.index_of_parent = __thisTargetIndex++;
    //                     // thisTarget.lot.prevNode = __prev_node
    //                     // if (__prev_node)__prev_node.lot.nextNode = thisTarget
    //                     // __prev_node = thisTarget
    //                     thisNode.lot.childs.push(thisTarget);
    //                     newLevelNodes.push(thisTarget);
    //                     __thisNode_child_size++;
    //                 }
    //             }
    //         });
    //         thisNode.lot.strength = __thisNode_child_size > 0 ? __thisNode_child_size : 1;
    //         __thisLOT_subling.all_strength += thisNode.lot.strength;
    //         thisNode.lot.strength_plus = __thisLOT_subling.all_strength;
    //         thisNode.lot.index_of_level = __thisLevel_index;
    //         thisNode.lot.childrenSize = __thisNode_child_size;
    //         __thisLevel_index++;
    //     });
    //     if (__thisLOT_subling.all_strength > analyticResult.max_strength) {
    //         analyticResult.max_strength = __thisLOT_subling.all_strength;
    //     }
    //     if (newLevelNodes.length > 0) {
    //         this.analysisNodes4Tree(willLayoutNodes, newLevelNodes, thisDeep + levelDirect, analyticResult, levelDirect);
    //     } else {
    //         willLayoutNodes.forEach(thisNode => {
    //             thisNode.lot.strengthWithChilds = 1;
    //             this.conductStrengthToParents4Folder(thisNode);
    //         });
    //         this.analysisDataFolder([willLayoutNodes[0]], 0, levelDirect);
    //         // willLayoutNodes.forEach(thisNode => {
    //         //   thisNode.text = thisNode.text + '('+(thisNode.lot.parent && thisNode.lot.parent.lot.strengthWithChilds_from!)+')' + thisNode.lot.strengthWithChilds_from + ':' + thisNode.lot.strengthWithChilds + '/' + thisNode.lot.strength
    //         // })
    //     }
    // }
    // conductStrengthToParents4Folder(node:RGNode) {
    //     if (node.lot.parent) {
    //         node.lot.parent.lot.strengthWithChilds += 1;
    //         // console.log('[xxxxxxxx]', node.text, 'add to parent:', node.lot.parent.text, node.lot.parent.lot.strengthWithChilds);
    //         this.conductStrengthToParents4Folder(node.lot.parent);
    //     }
    // }
    // analysisDataFolder(thisLevelNodes:RGNode[], thisDeep:number, levelDirect:RGLevelDirection) {
    //     const newLevelNodes:RGNode[] = [];
    //     let currentLevelStrengthWidthChilds = 0;
    //     let parent: RGNode|undefined;
    //     thisLevelNodes.forEach(thisNode => {
    //         if (thisNode.lot.level === 0 || levelDirect === (thisNode.lot.level! < 0 ? -1 : 1)) {
    //             if (thisNode.lot.childs.length > 0) {
    //                 thisNode.lot.childs.forEach((thisTarget) => {
    //                     newLevelNodes.push(thisTarget);
    //                 });
    //             }
    //             if (thisNode.lot.parent) {
    //                 if (!parent) {
    //                     parent = thisNode.lot.parent;
    //                     currentLevelStrengthWidthChilds = parent.lot.strengthWithChilds_from!;
    //                     // console.log('xxxxxxxxxx:set:parent:', parent.text, currentLevelStrengthWidthChilds);
    //                 } else if (parent !== thisNode.lot.parent) {
    //                     parent = thisNode.lot.parent;
    //                     // currentLevelStrengthWidthChilds += 1;
    //                     currentLevelStrengthWidthChilds = parent.lot.strengthWithChilds_from!;
    //                     // console.log('xxxxxxxxxx:chg:parent:', parent.text, currentLevelStrengthWidthChilds);
    //                 }
    //             }
    //             // console.log('xxxxxxxxxx:', parent && parent.text, ' ---> ', thisNode.text, 1 + currentLevelStrengthWidthChilds);
    //             thisNode.lot.strengthWithChilds_from = 1 + currentLevelStrengthWidthChilds;
    //             currentLevelStrengthWidthChilds += thisNode.lot.strengthWithChilds!;
    //         }
    //     });
    //     if (newLevelNodes.length > 0) {
    //         this.analysisDataFolder(newLevelNodes, thisDeep + levelDirect, levelDirect);
    //     }
    // }
    // analysisNodesForFolder(eachedNodes:RGNode[], thisLevelNodes:RGNode[], thisDeep:number, analyticResult:NodesAnalyticResult) {
    //     if (thisLevelNodes.length > analyticResult.max_length) {
    //         analyticResult.max_length = thisLevelNodes.length;
    //     }
    //     if (thisDeep > analyticResult.max_deep) {
    //         analyticResult.max_deep = thisDeep;
    //     }
    //     const __thisLOT_subling = {
    //         level: thisDeep,
    //         all_size: thisLevelNodes.length,
    //         all_strength: 0
    //     };
    //     if (thisDeep === 0) {
    //         thisLevelNodes.forEach(thisNode => {
    //             thisNode.lot.parent = undefined;
    //         });
    //     }
    //     const newLevelNodes:RGNode[] = [];
    //     for (const thisNode of thisLevelNodes) {
    //         eachedNodes.push(thisNode);
    //         for (const thisNextLevelNode of this.graphInstance.getNodeRelatedNodes(thisNode)) {
    //             if (!eachedNodes.includes(thisNextLevelNode)) {
    //                 eachedNodes.push(thisNextLevelNode);
    //                 thisNextLevelNode.lot.parent = thisNode;
    //                 // thisNode.lot.childs.push(thisTarget);
    //                 newLevelNodes.push(thisNextLevelNode);
    //             }
    //         }
    //     }
    //     if (__thisLOT_subling.all_strength > analyticResult.max_strength) {
    //         analyticResult.max_strength = __thisLOT_subling.all_strength;
    //     }
    //     if (newLevelNodes.length > 0) {
    //         this.analysisNodesForFolder(eachedNodes, newLevelNodes, thisDeep + 1, analyticResult);
    //     }
    // }
    placeRelativePosition(rootNode: RGNode, groupNodes: RGNode[], analyticResult: NodesAnalyticResult) {
        const treeNodeGapH = this.layoutOptions.treeNodeGapH || 20;
        const treeNodeGapV = this.layoutOptions.treeNodeGapV || 20;
        const levelMaxWidthMap = new Map<number, number>();
        let sumNodeHeight = 0;
        let sumNodeSize = 0;
        for (const node of groupNodes) {
            const level = node.lot.level;
            const nodeWidth = node.width || node.el_W || 50;
            const nodeHeight = node.height || node.el_H || 50;
            sumNodeHeight += nodeHeight;
            sumNodeSize++;
            const maxNodeWidth = levelMaxWidthMap.get(level);
            if (maxNodeWidth === undefined) {
                levelMaxWidthMap.set(level, nodeWidth);
            } else if (nodeWidth > maxNodeWidth) {
                levelMaxWidthMap.set(level, maxNodeWidth);
            }
        }
        if (sumNodeSize === 0) {
            return;
        }
        // console.log('levelMaxWidthMap:', levelMaxWidthMap);
        const avgNodeHeight = sumNodeHeight / sumNodeSize;
        const __per_height = avgNodeHeight + treeNodeGapV;
        groupNodes.forEach(thisNode => {
            if (thisNode.fixed === true) return;
            if (thisNode === rootNode) return;
            // if (this.layoutOptions.from === 'right') {
            //   thisNode.lot.x = rootNode.lot.x! - this.getLevelDistance(thisNode, thisNode.lot.subling!.level, __per_width);
            // } else {
            //   thisNode.lot.x = rootNode.lot.x! + this.getLevelDistance(thisNode, thisNode.lot.subling!.level, __per_width);
            // }
            if (this.layoutOptions.from === 'right') {
                thisNode.lot.x = rootNode.lot.x! - this.getLevelDistance(thisNode.lot.level!, levelMaxWidthMap, treeNodeGapH + 50);
            } else {
                thisNode.lot.x = rootNode.lot.x! + this.getLevelDistance(thisNode.lot.level!, levelMaxWidthMap, treeNodeGapH + 50);
            }
        });
        groupNodes.forEach(thisNode => {
            if (thisNode.fixed === true) return;
            if (thisNode === rootNode) return;
            if (thisNode.lot.level !== 0) {
                // thisNode.lot.y = rootNode.lot.y! + __per_height * ((analyticResult.max_strength / -2) + thisNode.lot.strengthWithChilds_from! + thisNode.lot.strengthWithChilds! / 2);
                // thisNode.lot.y = rootNode.lot.y! - __per_height * (thisNode.lot.strengthWithChilds_from!);
                // thisNode.lot.y = rootNode.lot.y! + __per_height * (thisNode.lot.strengthWithChilds_from!);
                thisNode.lot.y = rootNode.lot.y! + __per_height * (thisNode.lot.strengthWithChilds_from!);
                // console.log('xxxxxxxx2222:', thisNode.text, 'bloomingNode:', rootNode.lot.y, thisNode.lot.strengthWithChilds_from!, thisNode.lot.y);
            }
        });
        this.gatherNodes(groupNodes, 'h', __per_height);
    }

    gatherNodes(groupNodes: RGNode[], hv: 'h' | 'v', perSize: number) {
        if (!this.enableGatherNodes) {
            return;
        }
        const levelMapping: { [level: string]: RGNode[] } = {};
        groupNodes.forEach(thisNode => {
            if (thisNode.lot.level !== 0) return;
            const levelId = thisNode.lot.level + '';
            if (!levelMapping[levelId]) {
                levelMapping[levelId] = [];
            }
            levelMapping[levelId].push(thisNode);
            thisNode.lot.movedNodeSizeBefore = 1;
            thisNode.lot.movedNodeSizeAfter = 1;
        });
        groupNodes.forEach(thisNode => {
            if (thisNode.fixed === true) return;
            if (thisNode.lot.level !== 0) {
                const levelId = thisNode.lot.level + '';
                const levelNodes = levelMapping[levelId];
                if (thisNode.lot.strengthWithChilds === 1) {
                    if (thisNode.lot.childrenSizeVisible! <= 1) {
                        const bloomingNode = this.getBloomingNearByParent(thisNode, thisNode.lot.parent!, levelNodes, hv);
                        // console.log(thisNode.text, 'bloomingNode:', bloomingNode && bloomingNode.text, bloomingNode && bloomingNode.lot.y, perSize);
                        if (bloomingNode) {
                            if (hv === 'h') {
                                if (thisNode.lot.y - bloomingNode.lot.y > 0) {
                                    thisNode.lot.y = bloomingNode.lot.y! + perSize * bloomingNode.lot.movedNodeSizeAfter;
                                    bloomingNode.lot.movedNodeSizeAfter++;
                                } else {
                                    thisNode.lot.y = bloomingNode.lot.y! - perSize * bloomingNode.lot.movedNodeSizeBefore;
                                    bloomingNode.lot.movedNodeSizeBefore++;
                                }
                            } else {
                                if (thisNode.lot.x - bloomingNode.lot.x > 0) {
                                    thisNode.lot.x = bloomingNode.lot.x! + perSize * bloomingNode.lot.movedNodeSizeAfter;
                                    bloomingNode.lot.movedNodeSizeAfter++;
                                } else {
                                    thisNode.lot.x = bloomingNode.lot.x! - perSize * bloomingNode.lot.movedNodeSizeBefore;
                                    bloomingNode.lot.movedNodeSizeBefore++;
                                }
                            }
                        }
                    }
                }
                // thisNode.lot.y = rootNode.lot.y! + __per_height * ((analyticResult.max_strength / -2) + thisNode.lot.strengthWithChilds_from! + thisNode.lot.strengthWithChilds! / 2);
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

    getLevelDistance(level: number, levelMaxWidthMap: Map<number, number>, defaultGap: number) {
        if (level === 0) {
            return 0;
        }
        if (level > 0) {
            let sumDistance = 0;
            for (let i = 0; i < level; i++) {
                sumDistance += (levelMaxWidthMap.get(i) + this.getLevelGap(i, defaultGap));
            }
            // console.log('getLevelDistance:', level, sumDistance);
            return sumDistance;
        } else {
            let sumDistance = level < -1 ? 0 : -levelMaxWidthMap.get(level) / 2;
            for (let i = level; i < 0; i++) {
                sumDistance += (levelMaxWidthMap.get(i) + this.getLevelGap(i, defaultGap) + 50);
            }
            // console.log('getLevelDistance:', level, sumDistance);
            return -sumDistance;
        }
    }

    private getLevelGap(level: number, defaultGap: number) {
        let levelGap = defaultGap;
        if (this.layoutOptions.levelGaps?.length > 0) {
            const gap = this.layoutOptions.levelGaps[Math.abs(level)];
            if (gap) {
                levelGap = gap;
            }
        }
        return levelGap;
    }
}

export default RGFolderLayout;
