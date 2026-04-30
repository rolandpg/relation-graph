import {RGNode} from "../../../types";

export type NodesAnalyticLevel = {
    level: number;
    all_size: number;
    all_strength: number;
};
export type NodesAnalyticResult = {
    direct: number;
    max_deep: number;
    min_deep: number;
    max_length: number;
    max_strength: number;
    levels: Map<number, NodesAnalyticLevel>;
};

export type RGLevelDirection = -1 | 0 | 1;

export interface RGNetworkAnalyzer {
    analyzeNetwork(nodes: RGNode[], rootNode: RGNode, bothWay?: boolean, deepBothWay?: boolean):{
        tree: {
            networkNodes: RGNode[],
            analyticResult: NodesAnalyticResult
        },
        reverseTree: {
            networkNodes: RGNode[],
            analyticResult: NodesAnalyticResult
        }
    }
}
