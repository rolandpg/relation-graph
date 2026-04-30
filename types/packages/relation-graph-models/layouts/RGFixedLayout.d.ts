import { default as RGBaseLayout } from './RGBaseLayout';
import { RelationGraphInstance, RGLayoutOptions, RGNode, RGOptionsFull } from '../../types';
export declare class RGFixedLayout extends RGBaseLayout {
    constructor(layoutOptions: RGLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance);
    graphOptions: RGOptionsFull;
    layoutOptions: RGLayoutOptions;
    allNodes: never[];
    placeNodes(allNodes: RGNode[], rootNode?: RGNode): void;
}
export default RGFixedLayout;
