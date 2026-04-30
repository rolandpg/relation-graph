import { default as _RelationGraph } from './core4svelte/RelationGraph.svelte';
import { RelationGraphCore as _RelationGraphCore } from '../../../relation-graph-models/models/RelationGraphCore';
import { default as BaseLayout } from '../../../relation-graph-models/layouts/RGBaseLayout';
import { default as BidirectionalTreeLayout } from '../../../relation-graph-models/layouts/RGTreeLayout';
import { default as CenterLayout } from '../../../relation-graph-models/layouts/RGCenterLayout';
import { default as CircleLayout } from '../../../relation-graph-models/layouts/RGCircleLayout';
import { default as FixedLayout } from '../../../relation-graph-models/layouts/RGFixedLayout';
import { default as ForceLayout } from '../../../relation-graph-models/layouts/RGForceLayout';
import { default as RGFolderLayout } from '../../../relation-graph-models/layouts/RGFolderLayout';
export { default as RGToolBar } from './core4svelte/widgets/GraphXsToolBar.svelte';
export { default as RGFakeNode } from './core4svelte/RGFakeNode.svelte';
export { default as RGLinePath } from './core4svelte/RGLinePath.svelte';
export { default as RGLineText } from './core4svelte/RGLineText.svelte';
export { default as RGNodeExpandHolder } from './core4svelte/RGNodeExpandHolder.svelte';
export { default as RGMiniToolBar } from './core4svelte/widgets/GraphXsToolBar.svelte';
export { default as RGEditingNodeController } from './core4svelte/editing/RGEditingNodeController.svelte';
export { default as RGEditingResize } from './core4svelte/editing/RGEditingResize.svelte';
export { default as RGMiniView } from './core4svelte/editing/RGMiniView.svelte';
export { default as RelationGraphAsWebComponent } from './core4svelte/web-components/RelationGraphWithProvider.svelte';
export { default as RGMiniViewAsWebComponent } from './core4svelte/web-components/RGMiniView.svelte';
export { default as RGEditingNodeControllerWebComponenet } from './core4svelte/web-components/RGEditingNodeController.svelte';
export { default as RGEditingResizeWebComponenet } from './core4svelte/web-components/RGEditingResize.svelte';
export { default as RGConnectTargetWebComponenet } from './core4svelte/web-components/RGConnectTarget.svelte';
export { default as RGEditingNearNodeWidgetWebComponenet } from './core4svelte/web-components/RGEditingNearNodeWidget.svelte';
export { default as RGEditingLineControllerWebComponenet } from './core4svelte/web-components/RGEditingLineController.svelte';
export { default as RGEditingConnectControllerWebComponenet } from './core4svelte/web-components/RGEditingConnectController.svelte';
export { default as RGEditingReferenceLineWebComponenet } from './core4svelte/web-components/RGEditingReferenceLine.svelte';
export { default as RGWatermark } from './core4svelte/widgets/GraphWatermark.svelte';
export { default as RGBackground } from './core4svelte/widgets/GraphBackground.svelte';
export { default as RGEditingNearNodeWidget } from './core4svelte/editing/RGEditingNearNodeWidget.svelte';
export { default as RGEditingLineController } from './core4svelte/editing/RGEditingLineController.svelte';
export { default as RGEditingConnectController } from './core4svelte/editing/RGEditingConnectController.svelte';
export { default as RGConnectSource } from './core4svelte/editing/RGConnectSource.svelte';
export { default as RGConnectTarget } from './core4svelte/editing/RGConnectTarget.svelte';
export { default as RGEditingConnectPoints } from './core4svelte/editing/RGEditingConnectPoints.svelte';
export { default as RGEditingReferenceLine } from './core4svelte/editing/RGEditingReferenceLine.svelte';
export { default as RelationLinker } from './core4svelte/RelationLinker.svelte';
export { default as RGProvider } from './RGProvider.svelte';
import * as RGOptionsDataUtils from "../../../relation-graph-models/data/RGOptionsDataUtils";
import * as RGLineDataUtils from "../../../relation-graph-models/data/RGLineDataUtils";
import * as RGNodeDataUtils from "../../../relation-graph-models/data/RGNodeDataUtils";
export * from '../../../types';
export * from './types-svelte';
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
        getDescendantNodes(node: import('./index.shared').RGNode, collectList?: import('./index.shared').RGNode[]): import('./index.shared').RGNode[];
        isVisibleNode(thisNode: import('./index.shared').RGNode, deep?: number): boolean;
        isAllowShowNode(thisNode: import('./index.shared').RGNode, deep?: number): boolean;
        getNodeWidth(thisNode: import('./index.shared').RGNode): number;
        getNodeHeight(thisNode: import('./index.shared').RGNode): number;
        getNodeXByLotX(nodeAlignOption: {
            alignItemsX: "start" | "center" | "end";
        }, thisNode: import('./index.shared').RGNode): number;
        getNodeYByLotY(nodeAlignOption: {
            alignItemsY: "start" | "center" | "end";
        }, thisNode: import('./index.shared').RGNode): number;
        getNodeLotXY(nodeAlignOption: import('./index.shared').RGLayoutOptions4Alignment, node: import('./index.shared').RGNode): {
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
        flatNodeData(orignNodes: import('./index.shared').JsonNode[], parentNode: import('./index.shared').JsonNode | null, nodesCollect: import('./index.shared').JsonNode[], linksCollect: import('./index.shared').JsonLine[]): void;
    };
    RGEffectUtils: {
        startDrag(e: MouseEvent | TouchEvent, startPositionOrModel: import('./index.shared').RGCoordinate, onDragged: import('../../../relation-graph-models/utils/RGDragUtils').RGDraggedCallback, onDragging?: import('../../../relation-graph-models/utils/RGDragUtils').RGDraggingCallback): void;
        onNodeMove(e: MouseEvent | TouchEvent): void;
        onNodeDragend(e: MouseEvent | TouchEvent): void;
    };
};
export { useRelationGraph } from './hooks/useRelationGraph';
export declare const RGHooks: {
    useGraphInstance: typeof import('./hooks/useGraphInstance').useGraphInstance;
    useGraphStore: typeof import('./hooks/useGraphStore').useGraphStore;
    useCreatingLine: typeof import('./hooks/useGraphStore').useCreatingLine;
    useCreatingNode: typeof import('./hooks/useGraphStore').useCreatingNode;
    useEditingNodes: typeof import('./hooks/useGraphStore').useEditingNodes;
    useEditingLine: typeof import('./hooks/useGraphStore').useEditingLine;
    useViewInformation: typeof import('./hooks/useGraphStore').useViewInformation;
    useSelection: typeof import('./hooks/useGraphStore').useSelection;
    useConnectingNode: typeof import('./hooks/useGraphStore').useConnectingNode;
    useCheckedItem: typeof import('./hooks/useGraphStore').useCheckedItem;
};
export declare const useGraphInstance: typeof import('./hooks/useGraphInstance').useGraphInstance;
export declare const RelationGraph: typeof _RelationGraph;
/**
const RG_COMPONENTS: Record<string, any> = {
    'relation-graph': RelationGraphAsWebComponent,
    'rg-mini-view': RGMiniViewAsWebComponent,
    'rg-editing-node-controller': RGEditingNodeControllerWebComponenet,
    'rg-editing-resize': RGEditingResizeWebComponenet,
    'rg-connect-target': RGConnectTargetWebComponenet,
    'rg-editing-node-widget': RGEditingNearNodeWidgetWebComponenet,
    'rg-editing-line-controller': RGEditingLineControllerWebComponenet,
    'rg-editing-connect-controller': RGEditingConnectControllerWebComponenet,
    'rg-editing-reference-line': RGEditingReferenceLineWebComponenet,
};

function safeDefine(tag: string, clazz: CustomElementConstructor) {
    if (typeof window === 'undefined') return; // 适配 SSR 环境

    const existing = customElements.get(tag);
    if (existing) {
        if (existing !== clazz) {
            console.warn(`[RelationGraph] Element "${tag}" is already defined with a different class.`);
        }
        return;
    }

    try {
        customElements.define(tag, clazz);
    } catch (err) {
        console.error(`[RelationGraph] Failed to define "${tag}":`, err);
    }
}
export function registerRelationGraphElements(prefix = '') {
    Object.entries(RG_COMPONENTS).forEach(([tag, clazz]) => {
        const finalTag = prefix ? `${prefix}-${tag}` : tag;
        safeDefine(finalTag, clazz);
    });
}
if (typeof window !== "undefined" && typeof customElements !== "undefined") {
    registerRelationGraphElements();
}
    **/
export default _RelationGraph;
