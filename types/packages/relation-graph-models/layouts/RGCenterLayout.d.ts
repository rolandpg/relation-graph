import { default as RGForceLayout } from './RGForceLayout';
import { RelationGraphInstance, RGCenterLayoutOptions, RGLayoutOptions, RGNode, RGOptionsFull } from '../../types';
export declare class RGCenterLayout extends RGForceLayout {
    layoutOptions: RGCenterLayoutOptions;
    constructor(layoutOptions: RGLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    placeNodes(allNodes: RGNode[], rootNode?: RGNode): void;
    private getLevelDistanceArr;
}
export default RGCenterLayout;
