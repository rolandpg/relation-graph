import {devLog} from '../utils/RGCommon';
import RGBaseLayout from './RGBaseLayout';
import {RelationGraphInstance, RGLayoutOptions, RGNode, RGOptionsFull} from '../../types';

export class RGFixedLayout extends RGBaseLayout {
    constructor(layoutOptions: RGLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance) {
        super(layoutOptions, graphOptions, graphInstance);
        this.layoutOptions = layoutOptions;
        this.graphOptions = graphOptions;
    }

    graphOptions;
    layoutOptions;
    allNodes = [];

    placeNodes(allNodes: RGNode[], rootNode?: RGNode) {
        if (!rootNode) {
            devLog('root is null:', rootNode);
            return;
        } else {
            devLog('layout by root:', rootNode);
        }
        devLog('allNodes:', allNodes.length);
        this.networkAnalyzer.analyzeNetwork(allNodes, rootNode, false, false);
        devLog('[Fixed layout canvasOffset]', this.graphOptions.viewSize, this.graphOptions.canvasSize);
        this.layoutEnd();
    };
}

export default RGFixedLayout;
