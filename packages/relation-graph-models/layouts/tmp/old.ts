import {RGNode} from "../../../types";
import {NodesAnalyticResult, type RGLevelDirection} from "../analyzers/RGNetworkAnalyzer";
import {devLog} from "../../utils/RGCommon";

class OldVersion {
    analysis(rootNode: RGNode) {
        let groupNodes = [];
        let analyticResult = {
            max_deep: 1,
            max_length: 1,
            max_strength: 1
        };
        this.analysisNodesForFolder(groupNodes, [rootNode], 0, analyticResult);
        groupNodes = [];
        analyticResult = {
            max_deep: 1,
            max_length: 1,
            max_strength: 1
        };
        this.analysisNodes4Tree(groupNodes, [rootNode], 0, analyticResult, 1);
    }
    analysisNodes4Tree(willLayoutNodes:RGNode[], thisLevelNodes:RGNode[], thisDeep:number, analyticResult:NodesAnalyticResult, levelDirect:RGLevelDirection) {
        devLog(`${levelDirect} level ${thisDeep} size: ${thisLevelNodes.length}`)
        if (thisLevelNodes.length > analyticResult.max_length) {
            analyticResult.max_length = thisLevelNodes.length;
        }
        if (thisDeep > analyticResult.max_deep) {
            analyticResult.max_deep = thisDeep;
        }
        const __thisLOT_subling = {
            level: thisDeep,
            all_size: thisLevelNodes.length,
            all_strength: 0
        };
        const newLevelNodes:RGNode[] = [];
        thisLevelNodes.forEach(thisNode => {
            if (!thisNode.lot)thisNode.lot = { childs: [] };
            thisNode.lot.eached = true;
            thisNode.lot.subling = __thisLOT_subling;
            thisNode.lot.level = thisDeep;
            willLayoutNodes.push(thisNode);
        });
        let __thisLevel_index = 0;
        // var __prev_node
        thisLevelNodes.forEach(thisNode => {
            let __thisNode_child_size = 0;
            const childNodes = this.graphInstance.getNodeRelatedNodes(thisNode);
            let __thisTargetIndex = 0;
            childNodes.forEach((thisTarget) => {
                if (!thisTarget.lot) thisTarget.lot = {eached: false, childs: []};
                if (!thisTarget.lot.eached) {
                    thisTarget.lot.eached = true;
                    if (thisTarget.rgCalcedVisibility) {
                        thisTarget.lot.parent = thisNode;
                        thisTarget.lot.index_of_parent = __thisTargetIndex++;
                        // thisTarget.lot.prevNode = __prev_node
                        // if (__prev_node)__prev_node.lot.nextNode = thisTarget
                        // __prev_node = thisTarget
                        thisNode.lot.childs.push(thisTarget);
                        newLevelNodes.push(thisTarget);
                        __thisNode_child_size++;
                    }
                }
            });
            thisNode.lot.strength = __thisNode_child_size > 0 ? __thisNode_child_size : 1;
            __thisLOT_subling.all_strength += thisNode.lot.strength;
            thisNode.lot.strength_plus = __thisLOT_subling.all_strength;
            thisNode.lot.index_of_level = __thisLevel_index;
            thisNode.lot.childrenSize = __thisNode_child_size;
            __thisLevel_index++;
        });
        if (__thisLOT_subling.all_strength > analyticResult.max_strength) {
            analyticResult.max_strength = __thisLOT_subling.all_strength;
        }
        if (newLevelNodes.length > 0) {
            this.analysisNodes4Tree(willLayoutNodes, newLevelNodes, thisDeep + levelDirect, analyticResult, levelDirect);
        } else {
            willLayoutNodes.forEach(thisNode => {
                thisNode.lot.strengthWithChilds = 1;
                this.conductStrengthToParents4Folder(thisNode);
            });
            this.analysisDataFolder([willLayoutNodes[0]], 0, levelDirect);
            // willLayoutNodes.forEach(thisNode => {
            //   thisNode.text = thisNode.text + '('+(thisNode.lot.parent && thisNode.lot.parent.lot.strengthWithChilds_from!)+')' + thisNode.lot.strengthWithChilds_from + ':' + thisNode.lot.strengthWithChilds + '/' + thisNode.lot.strength
            // })
        }
    }
    conductStrengthToParents4Folder(node:RGNode) {
        if (node.lot.parent) {
            node.lot.parent.lot.strengthWithChilds += 1;
            // console.log('[xxxxxxxx]', node.text, 'add to parent:', node.lot.parent.text, node.lot.parent.lot.strengthWithChilds);
            this.conductStrengthToParents4Folder(node.lot.parent);
        }
    }
    analysisDataFolder(thisLevelNodes:RGNode[], thisDeep:number, levelDirect:RGLevelDirection) {
        const newLevelNodes:RGNode[] = [];
        let currentLevelStrengthWidthChilds = 0;
        let parent: RGNode|undefined;
        thisLevelNodes.forEach(thisNode => {
            if (thisNode.lot.level === 0 || levelDirect === (thisNode.lot.level! < 0 ? -1 : 1)) {
                if (thisNode.lot.childs.length > 0) {
                    thisNode.lot.childs.forEach((thisTarget) => {
                        newLevelNodes.push(thisTarget);
                    });
                }
                if (thisNode.lot.parent) {
                    if (!parent) {
                        parent = thisNode.lot.parent;
                        currentLevelStrengthWidthChilds = parent.lot.strengthWithChilds_from!;
                        // console.log('xxxxxxxxxx:set:parent:', parent.text, currentLevelStrengthWidthChilds);
                    } else if (parent !== thisNode.lot.parent) {
                        parent = thisNode.lot.parent;
                        // currentLevelStrengthWidthChilds += 1;
                        currentLevelStrengthWidthChilds = parent.lot.strengthWithChilds_from!;
                        // console.log('xxxxxxxxxx:chg:parent:', parent.text, currentLevelStrengthWidthChilds);
                    }
                }
                // console.log('xxxxxxxxxx:', parent && parent.text, ' ---> ', thisNode.text, 1 + currentLevelStrengthWidthChilds);
                thisNode.lot.strengthWithChilds_from = 1 + currentLevelStrengthWidthChilds;
                currentLevelStrengthWidthChilds += thisNode.lot.strengthWithChilds!;
            }
        });
        if (newLevelNodes.length > 0) {
            this.analysisDataFolder(newLevelNodes, thisDeep + levelDirect, levelDirect);
        }
    }
    analysisNodesForFolder(eachedNodes:RGNode[], thisLevelNodes:RGNode[], thisDeep:number, analyticResult:NodesAnalyticResult) {
        if (thisLevelNodes.length > analyticResult.max_length) {
            analyticResult.max_length = thisLevelNodes.length;
        }
        if (thisDeep > analyticResult.max_deep) {
            analyticResult.max_deep = thisDeep;
        }
        const __thisLOT_subling = {
            level: thisDeep,
            all_size: thisLevelNodes.length,
            all_strength: 0
        };
        if (thisDeep === 0) {
            thisLevelNodes.forEach(thisNode => {
                thisNode.lot.parent = undefined;
            });
        }
        const newLevelNodes:RGNode[] = [];
        for (const thisNode of thisLevelNodes) {
            eachedNodes.push(thisNode);
            for (const thisNextLevelNode of this.graphInstance.getNodeRelatedNodes(thisNode)) {
                if (!eachedNodes.includes(thisNextLevelNode)) {
                    eachedNodes.push(thisNextLevelNode);
                    thisNextLevelNode.lot.parent = thisNode;
                    // thisNode.lot.childs.push(thisTarget);
                    newLevelNodes.push(thisNextLevelNode);
                }
            }
        }
        if (__thisLOT_subling.all_strength > analyticResult.max_strength) {
            analyticResult.max_strength = __thisLOT_subling.all_strength;
        }
        if (newLevelNodes.length > 0) {
            this.analysisNodesForFolder(eachedNodes, newLevelNodes, thisDeep + 1, analyticResult);
        }
    }
}
