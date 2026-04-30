import { default as _RelationGraph } from './relation-graph/RelationGraph';
import { RelationGraphCore as _RelationGraphCore } from '../../../relation-graph-models/models/RelationGraphCore';
import { RelationGraphComponent as _RelationGraphComponent } from './types-react';
import { default as BaseLayout } from '../../../relation-graph-models/layouts/RGBaseLayout';
import { default as BidirectionalTreeLayout } from '../../../relation-graph-models/layouts/RGTreeLayout';
import { default as CenterLayout } from '../../../relation-graph-models/layouts/RGCenterLayout';
import { default as CircleLayout } from '../../../relation-graph-models/layouts/RGCircleLayout';
import { default as FixedLayout } from '../../../relation-graph-models/layouts/RGFixedLayout';
import { default as ForceLayout } from '../../../relation-graph-models/layouts/RGForceLayout';
import { default as RGFolderLayout } from '../../../relation-graph-models/layouts/RGFolderLayout';
import * as RGOptionsDataUtils from "../../../relation-graph-models/data/RGOptionsDataUtils";
import * as RGLineDataUtils from "../../../relation-graph-models/data/RGLineDataUtils";
import * as RGNodeDataUtils from "../../../relation-graph-models/data/RGNodeDataUtils";
export * from '../../../types';
export * from './types-react';
export declare const version: string;
export declare const RelationGraphCore: typeof _RelationGraphCore;
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
        getRectJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectHJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectLeftJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectRightJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectTopJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectBottomJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectHorizontalLineJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            y: number;
            x: number;
        };
        getRectVerticalLineLineJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            x: number;
            y: number;
        };
        getRectVJoinPoint(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
            y: number;
            x: number;
        };
        getBorderPoint(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number, n1style: number): {
            x: number;
            y: number;
        };
        getBorderPoint4MultiLine(params: import('../../../relation-graph-models/utils/RGGraphMath').CreateJunctionPointParams): {
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
        getDescendantNodes(node: import('../../../types').RGNode, collectList?: import('../../../types').RGNode[]): import('../../../types').RGNode[];
        isVisibleNode(thisNode: import('../../../types').RGNode, deep?: number): boolean;
        isAllowShowNode(thisNode: import('../../../types').RGNode, deep?: number): boolean;
        getNodeWidth(thisNode: import('../../../types').RGNode): number;
        getNodeHeight(thisNode: import('../../../types').RGNode): number;
        getNodeXByLotX(nodeAlignOption: {
            alignItemsX: "start" | "center" | "end";
        }, thisNode: import('../../../types').RGNode): number;
        getNodeYByLotY(nodeAlignOption: {
            alignItemsY: "start" | "center" | "end";
        }, thisNode: import('../../../types').RGNode): number;
        getNodeLotXY(nodeAlignOption: import('../../../types').RGLayoutOptions4Alignment, node: import('../../../types').RGNode): {
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
        flatNodeData(orignNodes: import('../../../types').JsonNode[], parentNode: import('../../../types').JsonNode | null, nodesCollect: import('../../../types').JsonNode[], linksCollect: import('../../../types').JsonLine[]): void;
    };
    RGEffectUtils: {
        startDrag(e: MouseEvent | TouchEvent, startPositionOrModel: import('../../../types').RGCoordinate, onDragged: import('../../../relation-graph-models/utils/RGDragUtils').RGDraggedCallback, onDragging?: import('../../../relation-graph-models/utils/RGDragUtils').RGDraggingCallback): void;
        onNodeMove(e: MouseEvent | TouchEvent): void;
        onNodeDragend(e: MouseEvent | TouchEvent): void;
    };
};
export declare const RGFakeNode: import('react').FC<{
    node: import('../../../types').RGNode;
}>;
export declare const RGLinePath: import('react').FC<import('../../../types').RGLinePathProps & {
    onLineClick: (e: React.MouseEvent | React.TouchEvent) => void;
    children?: React.ReactNode;
}>;
export declare const RGLineText: import('react').FC<import('../../../types').RGLineTextProps & {
    children?: React.ReactNode;
}>;
export declare const RGDebugView: import('react').FC<{}>;
export declare const RGToolBar: import('react').FC<import('../../../types').RGToolBarProps>;
export declare const RGNodeExpandHolder: import('react').FC<import('./types-react').RGNodeExpandHolderProps>;
export declare const RGMiniToolBar: import('react').FC<import('../../../types').RGToolBarProps>;
export declare const RGMiniView: import('react').FC<import('../../../types').RGMiniViewProps>;
export declare const RGBackground: import('react').FC<import('../../../types').RGBackgroundProps>;
export declare const RGWatermark: import('react').FC<import('../../../types').RGWatermarkProps>;
export declare const RGEditingNodeController: import('react').FC<{}>;
export declare const RGEditingResize: import('react').FC<{
    disableResizeWidth?: boolean;
    disableResizeHeight?: boolean;
    beforeResizeStart?: () => void;
}>;
export declare const RGEditingNearNodeWidget: import('react').FC<import('../../../types').RGWidgetProps>;
export declare const RGEditingLineController: import('react').FC<import('../../../types').RGEditingLineControllerProps>;
export declare const RGEditingConnectController: import('react').FC<{}>;
export declare const RGConnectSource: import('react').FC<import('../../../types').RGConnectSourceProps>;
export declare const RGConnectTarget: import('react').FC<import('../../../types').RGConnectTargetProps>;
export declare const RGEditingConnectPoints: import('react').FC<{
    mouseUpOnJunctionPointWithOffset: (junctionPoint: import('../../../types').RGJunctionPoint, event: any) => void;
    mouseUpOnJunctionPoint: (junctionPoint: import('../../../types').RGJunctionPoint, event: any) => void;
}>;
export declare const RGEditingReferenceLine: import('react').FC<{
    showText?: boolean;
    adsorption?: boolean;
}>;
export declare const RGSlotOnGraph: import('react').FC<{}>;
export declare const RGSlotOnView: import('react').FC<{}>;
export declare const RGSlotOnCanvasAbove: import('react').FC<{}>;
export declare const RGSlotOnCanvas: import('react').FC<{}>;
export declare const RGSlotOnNode: import('react').FC<{
    children: (props: import('../../../types').RGNodeSlotProps) => React.ReactNode;
}>;
export declare const RGSlotOnLine: import('react').FC<{
    children: (props: import('../../../types').RGLineSlotProps) => React.ReactNode;
}>;
export declare const RelationLinker: import('react').FC<import('react').PropsWithChildren<import('./types-react').RelationLinkerProps>>;
export { RGHooks as _RGHooks } from './relation-graph/src/hooks/RGHooks';
export declare const RGHooks: {
    useRelationGraph: typeof import('./relation-graph/src/hooks/useRelationGraph').useRelationGraph;
    useGraphInstance: typeof import('./relation-graph/src/hooks/useGraphInstance').useGraphInstance;
    useAutoUpdateView: typeof import('./relation-graph/src/hooks/useGraphInstance').useAutoUpdateView;
    useCreatingLine: typeof import('./relation-graph/src/hooks/useGraphStore').useCreatingLine;
    useCreatingNode: typeof import('./relation-graph/src/hooks/useGraphStore').useCreatingNode;
    useEditingNodes: typeof import('./relation-graph/src/hooks/useGraphStore').useEditingNodes;
    useEditingLine: typeof import('./relation-graph/src/hooks/useGraphStore').useEditingLine;
    useViewInformation: typeof import('./relation-graph/src/hooks/useGraphStore').useViewInformation;
    useSelection: typeof import('./relation-graph/src/hooks/useGraphStore').useSelection;
    useConnectingNode: typeof import('./relation-graph/src/hooks/useGraphStore').useConnectingNode;
    useCheckedItem: typeof import('./relation-graph/src/hooks/useGraphStore').useCheckedItem;
    useGraphStore: typeof import('./relation-graph/src/hooks/useGraphStore').useGraphStore;
};
export declare const useRelationGraph: typeof import('./relation-graph/src/hooks/useRelationGraph').useRelationGraph;
export declare const RGProvider: import('react').FC<import('react').PropsWithChildren<import('./types-react').RelationGraphWithWithCustomCore>>;
export { RelationGraphStoreContext, RelationGraphStoreContext as RGInstanceContext, RGUpdateContext, RGUpdateSignalContext as RGUpdateSingalContext, RGUpdateSignalContext } from './relation-graph/src/core4react/store/reducers/RGStore';
export type RelationGraphComponent = _RelationGraphComponent;
export declare const RelationGraph: import('react').ForwardRefExoticComponent<import('../../../types').RGListeners & import('./types-react').RelationGraphWithSlots & {
    options: import('../../../types').RGOptions;
    initialData?: import('../../../types').RGJsonData;
} & import('./types-react').RelationGraphWithWithCustomCore & {
    children?: import('react').ReactNode | undefined;
} & import('react').RefAttributes<import('../../../types').RelationGraphExpose>>;
export default _RelationGraph;
