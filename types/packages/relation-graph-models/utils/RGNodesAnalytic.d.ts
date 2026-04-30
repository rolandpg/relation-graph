import { JsonLine, JsonNode, RGLayoutOptions4Alignment, RGNode, RGNodeShape } from '../../types';
export declare const RGNodesAnalytic: {
    getDescendantNodes(node: RGNode, collectList?: RGNode[]): RGNode[];
    isVisibleNode(thisNode: RGNode, deep?: number): boolean;
    isAllowShowNode(thisNode: RGNode, deep?: number): boolean;
    getNodeWidth(thisNode: RGNode): number;
    getNodeHeight(thisNode: RGNode): number;
    getNodeXByLotX(nodeAlignOption: {
        alignItemsX: 'start' | 'center' | 'end';
    }, thisNode: RGNode): number;
    getNodeYByLotY(nodeAlignOption: {
        alignItemsY: 'start' | 'center' | 'end';
    }, thisNode: RGNode): number;
    getNodeLotXY(nodeAlignOption: RGLayoutOptions4Alignment, node: RGNode): {
        x: number;
        y: number;
    };
    isRectangleOverlap(rectA: any, rectB: any): boolean;
    isXOverlap(aX: number, bX: number, a_W: number, b_W: number): boolean;
    isYOverlap(aY: number, bY: number, a_H: number, b_H: number): boolean;
    shapesOverlap(nodeA: any, nodeB: any, shapeA?: number, shapeB?: number): boolean;
    getNoOverlapLimitedPosition(rectA: any, newX: any, newY: any, rectB: any): {
        x: any;
        y: any;
    };
    flatNodeData(orignNodes: JsonNode[], parentNode: JsonNode | null, nodesCollect: JsonNode[], linksCollect: JsonLine[]): void;
};
export declare const getNodeShape: (nodeShape: RGNodeShape, defaultNodeShape: RGNodeShape) => RGNodeShape;
export default RGNodesAnalytic;
