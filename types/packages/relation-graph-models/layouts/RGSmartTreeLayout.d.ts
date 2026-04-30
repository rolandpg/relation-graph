import { default as RGBaseLayout } from './RGBaseLayout';
import { RelationGraphInstance, RGNode, RGOptionsFull, RGTreeLayoutOptions } from '../../types';
export declare class RGSmartTreeLayout extends RGBaseLayout {
    constructor(layoutOptions: RGTreeLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    graphInstance: RelationGraphInstance;
    layoutOptions: RGTreeLayoutOptions;
    levelGaps: number[];
    placeNodes(allNodes: RGNode[], rootNode: RGNode): void;
    placeRelativePosition(rootNode: RGNode, groupNodes: RGNode[], max_strength: number): void;
    applyNodesGap(groupNodes: RGNode[]): void;
    getLevelDistance(level: number, levelMaxSizeMap: Map<number, number>, defaultGap: number): number;
    private getLevelGap;
}
export default RGSmartTreeLayout;
