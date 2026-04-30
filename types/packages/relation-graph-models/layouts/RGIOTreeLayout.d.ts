import { default as RGBaseLayout } from './RGBaseLayout';
import { RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions } from '../../types';
export declare class RGIOTreeLayout extends RGBaseLayout {
    constructor(layoutOptions: RGTreeLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    private rotate;
    enableGatherNodes: boolean;
    layoutOptions: RGTreeLayoutOptions;
    placeNodes(allNodes: RGNode[], rootNode: RGNode): void;
    placeNodesPosition(rootNode: RGNode, groupNodes: RGNode[]): void;
    placeRelativePosition(rootNode: RGNode, _groupNodes: RGNode[]): void;
    private buildNetwork;
    private reduceNodeRect;
    private placeNodeChildrenV;
    private placeNodeChildrenH;
    getLevelDistance(level: number, levelMaxSizeMap: Map<number, number>, defaultGap: number): number;
    private getLevelGap;
}
export default RGIOTreeLayout;
