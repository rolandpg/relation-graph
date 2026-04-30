import { default as RGBaseLayout } from './RGBaseLayout';
import { RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions } from '../../types';
import { NodesAnalyticResult } from './analyzers/RGNetworkAnalyzer';
export declare class RGTreeLayout extends RGBaseLayout {
    constructor(layoutOptions: RGTreeLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    enableGatherNodes: boolean;
    layoutOptions: RGTreeLayoutOptions;
    placeNodes(allNodes: RGNode[], rootNode: RGNode): void;
    placeNodesPosition(rootNode: RGNode, groupNodes: RGNode[], analyticResult: NodesAnalyticResult): void;
    placeRelativePosition(rootNode: RGNode, groupNodes: RGNode[], analyticResult: NodesAnalyticResult): void;
    getLevelDistance(level: number, levelMaxSizeMap: Map<number, number>, defaultGap: number): number;
    private getLevelGap;
    applyNodesGap(groupNodes: RGNode[], hv: 'h' | 'v'): void;
    gatherNodes(groupNodes: RGNode[], hv: 'h' | 'v', perSize: number): void;
    getBloomingNearByParent(node: RGNode, parentNode: RGNode, levelNodes: RGNode[], hv: 'h' | 'v'): RGNode | undefined;
}
export default RGTreeLayout;
