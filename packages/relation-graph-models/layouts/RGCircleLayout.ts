import RGGraphMath from '../utils/RGGraphMath';
import {devLog} from '../utils/RGCommon';
import {RGNodesAnalytic} from "../utils/RGNodesAnalytic";
import RGForceLayout from "./RGForceLayout";
import {RelationGraphInstance, RGLayoutOptions, RGNode, RGOptionsFull} from "../../types";

export class RGCircleLayout extends RGForceLayout {
    constructor(layoutOptions: RGLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance) {
        super(layoutOptions, graphOptions, graphInstance);
    }

    placeNodes(allNodes: RGNode[], rootNode?: RGNode) {
        if (!rootNode) {
            devLog('root is null:', rootNode);
            return;
        } else {
            devLog('layout by root:', rootNode);
        }
        this.allNodes = allNodes;
        this.rootNode = rootNode;

        if (rootNode.fixed || this.layoutOptions.fixedRootNode) {
            // 什么都不做
        } else {
            this.updateNodePosition(rootNode, 0, 0);
        }
        const childrenTreeAlign = {
            alignItemsX: this.layoutOptions.alignItemsX || 'center',
            alignItemsY: this.layoutOptions.alignItemsY || 'center',
        };
        const rotate = this.layoutOptions.rotate || 0;
        const rootLotXY = RGNodesAnalytic.getNodeLotXY(childrenTreeAlign, rootNode);
        rootNode.lot.x = rootLotXY.x;
        rootNode.lot.y = rootLotXY.y;
        const visibleNodes = this.allNodes.filter(n => n.rgCalcedVisibility);
        const __all_size = visibleNodes.length;
        let __circle_r = __all_size * 90 / Math.PI / 2;
        if (__circle_r < 200) __circle_r = 200;
        if (__circle_r > 800) __circle_r = 800;
        visibleNodes.forEach((thisNode, _index) => {
            const _point = RGGraphMath.getOvalPoint(rootLotXY.x, rootLotXY.y, __circle_r, _index, __all_size);
            thisNode.lot.x = _point.x;
            thisNode.lot.y = _point.y;
            // console.log('xxxxxxxxxxxxxx:', thisNode.id, thisNode.lot.x, thisNode.lot.y);
        });
        visibleNodes.forEach(thisNode => {
            // if (thisNode === rootNode) return;
            if (thisNode.fixed === true) return;
            if (!thisNode.rgCalcedVisibility) return;
            if (rotate) {
                const roatedXy = RGGraphMath.getRotatedPoint(thisNode.lot.x, thisNode.lot.y, rootNode.lot.x, rootNode.lot.y, rotate);
                thisNode.lot.x = roatedXy.x;
                thisNode.lot.y = roatedXy.y;
            }
            const nodeAlignOption = childrenTreeAlign;
            const x = RGNodesAnalytic.getNodeXByLotX(nodeAlignOption, thisNode);
            const y = RGNodesAnalytic.getNodeYByLotY(nodeAlignOption, thisNode);
            this.updateNodePosition(thisNode, x, y);
        });
        this.layoutEnd();
    };
}

export default RGCircleLayout;
