import RGGraphMath from '../utils/RGGraphMath';
import {devLog} from '../utils/RGCommon';
import RGForceLayout from './RGForceLayout';
import {RGNodesAnalytic} from '../utils/RGNodesAnalytic';
import {RelationGraphInstance, RGCenterLayoutOptions, RGLayoutOptions, RGNode, RGOptionsFull} from '../../types';

export class RGCenterLayout extends RGForceLayout {
    layoutOptions: RGCenterLayoutOptions;

    constructor(layoutOptions: RGLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance) {
        super(layoutOptions, graphOptions, graphInstance);
        this.layoutOptions = layoutOptions as RGCenterLayoutOptions;
        if (!this.layoutOptions.distanceCoefficient) this.layoutOptions.distanceCoefficient = 1;
        if (!this.layoutOptions.levelGaps) this.layoutOptions.levelGaps = [];
        if (this.layoutOptions.levelDistance) {
            console.error('Error: levelDistance is not support， Please use levelGaps option in layoutOptions');
        }
    }
    placeNodes(allNodes: RGNode[], rootNode?: RGNode)  {
        devLog('RGCenterLayout:placeNodes');
        if (!rootNode) {
            devLog('root is null:', rootNode);
            return;
        }
        devLog('layout by root:', rootNode);
        this.allNodes = allNodes;
        this.calcNodes = allNodes;
        this.rootNode = rootNode;
        const {tree} = this.networkAnalyzer.analyzeNetwork(allNodes, this.rootNode);
        const {networkNodes, analyticResult} = tree;
        if (this.layoutOptions.genLotInfoOnly) {
            devLog('only gen lot info, return');
            return;
        }

        if (rootNode.fixed || this.layoutOptions.fixedRootNode) {
            // 什么都不做
        } else {
            this.updateNodePosition(rootNode, 0, 0);
        }
        const childrenTreeAlign = {
            alignItemsX: this.layoutOptions.alignItemsX || 'center',
            alignItemsY: this.layoutOptions.alignItemsY || 'center',
        };
        const rootLotXY = RGNodesAnalytic.getNodeLotXY(childrenTreeAlign, rootNode);
        rootNode.lot.x = rootLotXY.x;
        rootNode.lot.y = rootLotXY.y;

        const rotate = this.layoutOptions.rotate || 0;
        devLog('root position:', rootNode.lot.x, rootNode.lot.y);
        // this.rootNode.lot.x = 0
        // this.rootNode.lot.y = 0
        // if (this.rootNode.lot.y > 400) {
        //   this.rootNode.lot.y = 400
        // }
        const distanceCoefficient = this.layoutOptions.distanceCoefficient || 1;
        const levelDistanceArr = this.getLevelDistanceArr();
        this.placeRelativePosition(this.rootNode, networkNodes, analyticResult, distanceCoefficient, levelDistanceArr);
        const rootXy = {x:rootNode.x, y: rootNode.y};
        networkNodes.forEach(thisNode => {
            if (thisNode.fixed === true) return;
            if (!thisNode.rgCalcedVisibility) return;
            if (thisNode === rootNode) {
                // 什么都不做
            } else {
                if (rotate) {
                    const roatedXy = RGGraphMath.getRotatedPoint(thisNode.lot.x, thisNode.lot.y, rootXy.x, rootXy.y, rotate);
                    thisNode.lot.x = roatedXy.x;
                    thisNode.lot.y = roatedXy.y;
                }
                const nodeAlignOption = childrenTreeAlign;
                const x = RGNodesAnalytic.getNodeXByLotX(nodeAlignOption, thisNode);
                const y = RGNodesAnalytic.getNodeYByLotY(nodeAlignOption, thisNode);
                this.updateNodePosition(thisNode, x, y);
            }
        });
        this.layoutEnd();
    };

    private getLevelDistanceArr() {
        let levelDistanceArr: number[] = [];
        if (this.layoutOptions.levelGaps) {
            if (Array.isArray(this.layoutOptions.levelGaps)) {
                levelDistanceArr = this.layoutOptions.levelGaps;
            } else {
                console.error('Error levelDistance, levelDistance must is Array');
                return new Array(10).fill(200);
            }
            if (levelDistanceArr.length > 0 && levelDistanceArr.length < 10) {
                for (let i = levelDistanceArr.length; i < 10; i++) {
                    levelDistanceArr.push(levelDistanceArr[levelDistanceArr.length - 1]);
                }
            }
        }
        return levelDistanceArr;
    }
}

export default RGCenterLayout;
