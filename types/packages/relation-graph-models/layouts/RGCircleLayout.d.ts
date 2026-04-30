import { default as RGForceLayout } from './RGForceLayout';
import { RelationGraphInstance, RGLayoutOptions, RGNode, RGOptionsFull } from '../../types';
export declare class RGCircleLayout extends RGForceLayout {
    constructor(layoutOptions: RGLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    placeNodes(allNodes: RGNode[], rootNode?: RGNode): void;
}
export default RGCircleLayout;
