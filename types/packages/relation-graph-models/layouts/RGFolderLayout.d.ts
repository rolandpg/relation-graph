import { default as RGBaseLayout } from './RGBaseLayout';
import { RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions } from '../../types';
import { NodesAnalyticResult } from './analyzers/RGNetworkAnalyzer';
export declare class RGFolderLayout extends RGBaseLayout {
    constructor(layoutOptions: RGTreeLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    enableGatherNodes: boolean;
    layoutOptions: RGTreeLayoutOptions;
    placeNodes(allNodes: RGNode[], rootNode: RGNode): void;
    placeRelativePosition(rootNode: RGNode, groupNodes: RGNode[], analyticResult: NodesAnalyticResult): void;
    gatherNodes(groupNodes: RGNode[], hv: 'h' | 'v', perSize: number): void;
    getBloomingNearByParent(node: RGNode, parentNode: RGNode, levelNodes: RGNode[], hv: 'h' | 'v'): RGNode | undefined;
    getLevelDistance(level: number, levelMaxWidthMap: Map<number, number>, defaultGap: number): number;
    private getLevelGap;
}
export default RGFolderLayout;
