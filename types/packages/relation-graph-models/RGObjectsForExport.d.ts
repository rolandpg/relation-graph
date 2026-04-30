import { default as BaseLayout } from './layouts/RGBaseLayout';
import { default as BidirectionalTreeLayout } from './layouts/RGTreeLayout';
import { default as CenterLayout } from './layouts/RGCenterLayout';
import { default as CircleLayout } from './layouts/RGCircleLayout';
import { default as FixedLayout } from './layouts/RGFixedLayout';
import { default as ForceLayout } from './layouts/RGForceLayout';
import { default as RGFolderLayout } from './layouts/RGFolderLayout';
import { RGNetworkAnalyzer as _RGNetworkAnalyzer } from './layouts/analyzers/RGNetworkAnalyzer';
import * as RGOptionsDataUtils from "./data/RGOptionsDataUtils";
import * as RGLineDataUtils from "./data/RGLineDataUtils";
import * as RGNodeDataUtils from "./data/RGNodeDataUtils";
export type RGNetworkAnalyzer = _RGNetworkAnalyzer;
export declare const RGLayouts: {
    BaseLayout: typeof BaseLayout;
    BidirectionalTreeLayout: typeof BidirectionalTreeLayout;
    CenterLayout: typeof CenterLayout;
    CircleLayout: typeof CircleLayout;
    FixedLayout: typeof FixedLayout;
    ForceLayout: typeof ForceLayout;
    RGFolderLayout: typeof RGFolderLayout;
};
export declare const RGUtils: {
    RGOptionsDataUtils: typeof RGOptionsDataUtils;
    RGLineDataUtils: typeof RGLineDataUtils;
    RGNodeDataUtils: typeof RGNodeDataUtils;
    RGGraphMath: {
        getRectPoint(from_x: number, from_y: number, to_x: number, to_y: number, f_W: number, f_H: number, t_W: number, t_H: number, isReverse?: boolean, totalLines?: number, currentIndex?: number, lineDistance?: number, isEndPoint?: boolean): {
            x: number;
            y: number;
        };
        getRectPointBasic(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number): {
            x: number;
            y: number;
            _case: string;
        };
        getRectJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectHJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectLeftJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectRightJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectTopJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectBottomJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectHorizontalLineJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            y: number;
            x: number;
        };
        getRectVerticalLineLineJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectVJoinPoint(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            y: number;
            x: number;
        };
        getBorderPoint(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number, n1style: number): {
            x: number;
            y: number;
        };
        getBorderPoint4MultiLine(params: import('./utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getCirclePoint(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number): {
            x: number;
            y: number;
        };
        getCirclePoint4MultiLine(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number, isReverse: boolean, totalLines: number, currentIndex: number, lineDistance: number, isEndPoint: boolean): {
            x: number;
            y: number;
        };
        getCirclePointBasic(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number, radius: number): {
            x: number;
            y: number;
        };
        getCirclePointPlus(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number): {
            x: number;
            y: number;
        };
        getOvalPoint(c_x: number, c_y: number, c_r: number, c_i: number, c_n: number, startAngle?: number): {
            x: number;
            y: number;
        };
        getRotatedPoint(x: number, y: number, c_x: number, c_y: number, rotateDeg: number): {
            x: number;
            y: number;
        };
        getFlippedX(x: number, c_x: number): number;
        getFlippedY(y: number, c_y: number): number;
        getAngleType(buffer_x: number, buffer_y: number): 1 | 2 | 3 | 4 | undefined;
        getTextAngle(fx: number, fy: number, tx: number, ty: number): number;
    };
    RGNodesAnalyticUtils: {
        getDescendantNodes(node: import('../types').RGNode, collectList?: import('../types').RGNode[]): import('../types').RGNode[];
        isVisibleNode(thisNode: import('../types').RGNode, deep?: number): boolean;
        isAllowShowNode(thisNode: import('../types').RGNode, deep?: number): boolean;
        getNodeWidth(thisNode: import('../types').RGNode): number;
        getNodeHeight(thisNode: import('../types').RGNode): number;
        getNodeXByLotX(nodeAlignOption: {
            alignItemsX: "start" | "center" | "end";
        }, thisNode: import('../types').RGNode): number;
        getNodeYByLotY(nodeAlignOption: {
            alignItemsY: "start" | "center" | "end";
        }, thisNode: import('../types').RGNode): number;
        getNodeLotXY(nodeAlignOption: import('../types').RGLayoutOptions4Alignment, node: import('../types').RGNode): {
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
        flatNodeData(orignNodes: import('../types').JsonNode[], parentNode: import('../types').JsonNode | null, nodesCollect: import('../types').JsonNode[], linksCollect: import('../types').JsonLine[]): void;
    };
    RGEffectUtils: {
        startDrag(e: MouseEvent | TouchEvent, startPositionOrModel: import('../types').RGCoordinate, onDragged: import('./utils/RGDragUtils').RGDraggedCallback, onDragging?: import('./utils/RGDragUtils').RGDraggingCallback | undefined): void;
        onNodeMove(e: MouseEvent | TouchEvent): void;
        onNodeDragend(e: MouseEvent | TouchEvent): void;
    };
};
