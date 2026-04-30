import { NodesAnalyticResult, RGLevelDirection, RGNetworkAnalyzer } from './RGNetworkAnalyzer';
import { RelationGraphInstance, RGNode } from '../../../types';
export declare class BasicNetworkAnalyzer implements RGNetworkAnalyzer {
    graphInstance: RelationGraphInstance;
    private initialized;
    isFolderLayout: boolean;
    constructor(graphInstance: RelationGraphInstance);
    analyzeNetwork(nodes: RGNode[], rootNode: RGNode, bothWay?: boolean, deepBothWay?: boolean): {
        tree: {
            networkNodes: RGNode[];
            analyticResult: NodesAnalyticResult;
        };
        reverseTree: {
            networkNodes: never[];
            analyticResult: NodesAnalyticResult;
        };
    };
    protected markNodeParent(rootNode: RGNode): {
        networkNodes: RGNode[];
    };
    private _markNodeParent;
    private expandLevelNodesWithDirection;
    private _appendNodeChildrenToNextLevelNodes;
    private calcStrengthWithChildsValue;
    calcStrengthFromValue(rootNode: RGNode, deepFindDirect?: RGLevelDirection): void;
    private _calcStrengthFromValue;
    conductStrengthToParents(node: RGNode): void;
}
