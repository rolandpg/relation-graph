/**
* relation-graph
* Website: http://www.relation-graph.com/
* Github: https://github.com/relation-graph/relation-graph
*
*/
import { RelationGraphCore as _RelationGraphCore } from '../../../relation-graph-models/models/RelationGraphCore';
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
export { default as RGProvider } from './core4vue/RGProvider.vue';
export { graphStoreMixin } from './hooks/GraphStoreMixin';
export * from '../../../types';
export * from './types-vue2';
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
export declare const RGFakeNode: import('vue').DefineComponent<{
    node: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
}, {}, {
    expanding: boolean;
}, {}, {}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    node: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
}>>, {
    node: Record<string, any>;
}>;
export declare const RGLinePath: import('vue').DefineComponent<string[], {}, {}, {
    graphInstance(): any;
    pathId(): string;
    line(): any;
    lineWidth(): string | undefined;
    startArrowMarkerId(): any;
    endArrowMarkerId(): any;
    onPathTextStyle(): any;
}, {
    onLineClick(e: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<string[]>>, {
    [x: number]: string;
}>;
export declare const RGLineText: import('@vue/runtime-core').DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
export declare const RGToolBar: import('vue').DefineComponent<{
    direction: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionH: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionV: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {
    refresh(): void;
    toggleAutoLayout(): void;
    downloadAsImage(): void;
    zoomToFit(): Promise<void>;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    direction: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionH: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionV: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}>>, {
    direction: string;
    positionH: string;
    positionV: string;
}>;
export declare const RGNodeExpandHolder: import('vue').DefineComponent<{
    node: {
        type: ObjectConstructor;
        required: true;
    };
    expandOrCollapseNode: {
        type: FunctionConstructor;
        required: true;
    };
    expandHolderPosition: {
        type: StringConstructor;
        required: true;
    };
}, {}, {}, {
    expandButtonClass(): "c-expanded" | "c-collapsed";
}, {}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    node: {
        type: ObjectConstructor;
        required: true;
    };
    expandOrCollapseNode: {
        type: FunctionConstructor;
        required: true;
    };
    expandHolderPosition: {
        type: StringConstructor;
        required: true;
    };
}>>, {}>;
export declare const RGDebugView: import('vue').DefineComponent<Readonly<{}>, {}, {
    showSettingPanel: boolean;
}, {
    graphInstance(): any;
    options(): any;
}, {
    toggleSettingPanel(): void;
    printOptions(): void;
    printData(): void;
    enableDevlog(): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<Readonly<{}>>>, {}>;
export declare const RGMiniToolBar: import('vue').DefineComponent<{
    direction: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionH: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionV: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {
    refresh(): void;
    toggleAutoLayout(): void;
    downloadAsImage(): void;
    zoomToFit(): Promise<void>;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    direction: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionH: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionV: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}>>, {
    direction: string;
    positionH: string;
    positionV: string;
}>;
export declare const RGMiniView: import('vue').DefineComponent<{
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    width: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    height: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
    miniViewVisibleHandle(): any;
}, {
    onMouseDown(e: import('../../../types').RGUserEvent): void;
    onClickCanvas(e: import('../../../types').RGUserEvent): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    width: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    height: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
}>>, {
    position: string;
}>;
export declare const RGBackground: import('vue').DefineComponent<{
    forImage: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
    forDisplay: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
}, {}, {
    originBackgroundColor: string;
}, {
    graphInstance(): any;
    options(): any;
    show(): boolean;
}, {}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    forImage: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
    forDisplay: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
}>>, {
    forImage: boolean;
    forDisplay: boolean;
}>;
export declare const RGWatermark: import('vue').DefineComponent<{
    forImage: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
    forDisplay: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    width: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    height: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
    show(): boolean;
}, {}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    forImage: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
    forDisplay: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    width: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    height: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
}>>, {
    position: string;
    forImage: boolean;
    forDisplay: boolean;
}>;
export declare const RGEditingNodeController: import('vue').DefineComponent<{
    hideBorderForSingleNode: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    hideBorderForSingleNode: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    hideBorderForSingleNode: boolean;
}>;
export declare const RGEditingResize: import('vue').DefineComponent<{
    disableResizeWidth: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    disableResizeHeight: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {
    onMouseDown(type: any, $event: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    disableResizeWidth: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    disableResizeHeight: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}>>, {
    disableResizeWidth: boolean;
    disableResizeHeight: boolean;
}>;
export declare const RGEditingNearNodeWidget: import('vue').DefineComponent<{
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {
    onMouseDown(type: any, $event: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}>>, {
    position: string;
}>;
export declare const RGEditingLineController: import('vue').DefineComponent<{
    textEditable: {
        default: boolean;
    };
    pathEditable: {
        default: boolean;
    };
}, {}, {
    lineText: string;
    editing: boolean;
    prevClickTime: number;
}, {
    graphInstance(): any;
    options(): any;
    editingLineController(): any;
    show(): any;
    editingLine(): any;
    editingLineShape(): any;
    ctrlPoint1(): any;
    ctrlPoint2(): any;
    ctrlPoint1SvgPath(): any;
    ctrlPoint2SvgPath(): any;
    line44Splits(): any;
    text(): any;
}, {
    onCtrlPointMouseDown(ctrlPointIndex: any, $event: any): void;
    onLine44CtrlPointMouseDown(split: any, $event: any): void;
    onMouseDown(type: any, $event: any): void;
    startMoveText($event: any): void;
    startEditingLineText($event: any): void;
    onLineTextChange($event: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    textEditable: {
        default: boolean;
    };
    pathEditable: {
        default: boolean;
    };
}>>, {
    textEditable: boolean;
    pathEditable: boolean;
}>;
export declare const RGEditingConnectController: import('vue').DefineComponent<Readonly<{}>, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {
    mouseUpOnJunctionPoint(junctionPoint: import('../../../types').RGJunctionPoint, $event: import('../../../types').RGUserEvent): void;
    mouseUpOnJunctionPointWithOffset(junctionPoint: import('../../../types').RGJunctionPoint, $event: import('../../../types').RGUserEvent): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<Readonly<{}>>>, {}>;
export declare const RGConnectSource: import('vue').DefineComponent<{
    fromNode: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
    lineTemplate: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
}, {
    onMouseDown($event: MouseEvent | TouchEvent): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    fromNode: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
    lineTemplate: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
}>>, {
    fromNode: Record<string, any>;
    lineTemplate: Record<string, any>;
}>;
export declare const RGConnectTarget: import('vue').DefineComponent<{
    junctionPoint: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    targetId: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetType: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetData: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    lineTemplate: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    disableDrop: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    forSvg: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    disableDrag: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    domMode: {
        mustUseProp: boolean;
        type: () => import('../../../types').RGConnectTargetDomMode;
    };
    measureSelector: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    strictMeasureTarget: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
}, {}, {}, {
    RGInnerConnectTargetType(): typeof import('../../../types').RGInnerConnectTargetType;
    RGJunctionPoint(): typeof import('../../../types').RGJunctionPoint;
    graphInstance(): any;
    options(): any;
    actualJunctionPoint(): string;
    normalizedDomMode(): import('../../../types').RGConnectTargetDomMode;
    resolvedHostStyle(): string | (string | {
        display: string;
    })[];
}, {
    registerCurrentTarget(): void;
    onClick($event: any): void;
    onMouseDown($event: any): void;
    onMouseUp(type: any, $event: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, ("onLineVertexBeDropped" | "onDragConnectStart" | "onDragConnectEnd")[], string, Readonly<import('vue').ExtractPropTypes<{
    junctionPoint: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    targetId: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetType: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetData: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    lineTemplate: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    disableDrop: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    forSvg: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    disableDrag: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    domMode: {
        mustUseProp: boolean;
        type: () => import('../../../types').RGConnectTargetDomMode;
    };
    measureSelector: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    strictMeasureTarget: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
}>>, {
    disableDrag: boolean;
    junctionPoint: string;
    strictMeasureTarget: boolean;
    forSvg: boolean;
    disableDrop: boolean;
}>;
export declare const RGEditingConnectPoints: import('vue').DefineComponent<{
    mouseUpOnJunctionPoint: {
        type: FunctionConstructor;
        required: true;
    };
    mouseUpOnJunctionPointWithOffset: {
        type: FunctionConstructor;
        required: true;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {
    onMouseUp(type: any, $event: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    mouseUpOnJunctionPoint: {
        type: FunctionConstructor;
        required: true;
    };
    mouseUpOnJunctionPointWithOffset: {
        type: FunctionConstructor;
        required: true;
    };
}>>, {}>;
export declare const RGEditingReferenceLine: import('vue').DefineComponent<{
    showText: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    adsorption: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    showText: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    adsorption: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>>, {
    showText: boolean;
    adsorption: boolean;
}>;
export declare const RelationLinker: import('vue').DefineComponent<{
    options: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
    lines: {
        mustUseProp: boolean;
        default: () => never[];
        type: ArrayConstructor;
    };
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
}, {}, {
    initialised: boolean;
    inRGProvider: boolean;
}, {}, {
    applyInstance(graphInstance: any): void;
    onRGProviderReady(graphInstance: any): void;
    getInstance(): any;
    setJsonData(): Promise<never>;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    options: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
    lines: {
        mustUseProp: boolean;
        default: () => never[];
        type: ArrayConstructor;
    };
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
}>>, {
    lines: unknown[];
    options: Record<string, any>;
    relationGraphCore: Function;
}>;
export declare const RelationGraph: import('vue').DefineComponent<{
    options: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
    initialData: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
}, {}, {
    initialised: boolean;
    inRGProvider: boolean;
}, {}, {
    applyInstance(graphInstance: any): void;
    onRGProviderReady(graphInstance: any): void;
    getInstance(): any;
    setJsonData(): Promise<never>;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    options: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
    initialData: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
}>>, {
    options: Record<string, any>;
    initialData: Record<string, any>;
    relationGraphCore: Function;
}>;
declare const _default: {
    version: string;
    install: (Vue: any, options?: any) => void;
    data?: ((this: import('vue').CreateComponentPublicInstance<Readonly<import('vue').ExtractPropTypes<{
        options: {
            mustUseProp: boolean;
            default: () => {};
            type: ObjectConstructor;
        };
        initialData: {
            mustUseProp: boolean;
            default: () => null;
            type: ObjectConstructor;
        };
        relationGraphCore: {
            mustUseProp: boolean;
            default: null;
            type: FunctionConstructor;
        };
    }>>, {}, {}, {}, {
        applyInstance(graphInstance: any): void;
        onRGProviderReady(graphInstance: any): void;
        getInstance(): any;
        setJsonData(): Promise<never>;
    }, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin>, vm: import('vue').CreateComponentPublicInstance<Readonly<import('vue').ExtractPropTypes<{
        options: {
            mustUseProp: boolean;
            default: () => {};
            type: ObjectConstructor;
        };
        initialData: {
            mustUseProp: boolean;
            default: () => null;
            type: ObjectConstructor;
        };
        relationGraphCore: {
            mustUseProp: boolean;
            default: null;
            type: FunctionConstructor;
        };
    }>>, {}, {}, {}, {
        applyInstance(graphInstance: any): void;
        onRGProviderReady(graphInstance: any): void;
        getInstance(): any;
        setJsonData(): Promise<never>;
    }, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin>) => {
        initialised: boolean;
        inRGProvider: boolean;
    }) | undefined;
    computed?: {} | undefined;
    methods?: {
        applyInstance(graphInstance: any): void;
        onRGProviderReady(graphInstance: any): void;
        getInstance(): any;
        setJsonData(): Promise<never>;
    } | undefined;
    mixins?: import('vue/types/v3-component-options').ComponentOptionsMixin[] | undefined;
    extends?: import('vue/types/v3-component-options').ComponentOptionsMixin | undefined;
    emits?: ThisType<void> | (string[] & ThisType<void>) | undefined;
    setup?: import('vue').SetupFunction<Readonly<import('vue/types/common').LooseRequired<Readonly<import('vue').ExtractPropTypes<{
        options: {
            mustUseProp: boolean;
            default: () => {};
            type: ObjectConstructor;
        };
        initialData: {
            mustUseProp: boolean;
            default: () => null;
            type: ObjectConstructor;
        };
        relationGraphCore: {
            mustUseProp: boolean;
            default: null;
            type: FunctionConstructor;
        };
    }>>>>, {}, {}> | undefined;
    __defaults?: {
        options: Record<string, any>;
        initialData: Record<string, any>;
        relationGraphCore: Function;
    } | undefined;
    el?: (Element | string) | undefined;
    template?: string | undefined;
    propsData?: object | undefined;
    watch?: Record<string, import('vue').WatchOptionsWithHandler<any> | import('vue').WatchHandler<any> | Array<import('vue').WatchOptionsWithHandler<any> | import('vue').WatchHandler<any>>> | undefined;
    render?: ((createElement: import('vue').CreateElement, hack: import('vue').RenderContext<import('vue/types/options').DefaultProps>) => import('vue').VNode | null | void) | undefined;
    renderError?: ((createElement: import('vue').CreateElement, err: Error) => import('vue').VNode) | undefined;
    staticRenderFns?: ((createElement: import('vue').CreateElement) => import('vue').VNode)[] | undefined;
    beforeCreate?: ((this: import('vue').default<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => import('vue').default>) => void) | undefined;
    created?: (() => void) | undefined;
    beforeDestroy?: (() => void) | undefined;
    destroyed?: (() => void) | undefined;
    beforeMount?: (() => void) | undefined;
    mounted?: (() => void) | undefined;
    beforeUpdate?: (() => void) | undefined;
    updated?: (() => void) | undefined;
    activated?: (() => void) | undefined;
    deactivated?: (() => void) | undefined;
    errorCaptured?: ((err: Error, vm: import('vue').default, info: string) => boolean | void) | undefined;
    serverPrefetch?: ((this: import('vue').default<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => import('vue').default>) => Promise<void>) | undefined;
    renderTracked?: ((e: import('vue').DebuggerEvent) => void) | undefined;
    renderTriggerd?: ((e: import('vue').DebuggerEvent) => void) | undefined;
    directives?: {
        [key: string]: import('vue').DirectiveFunction | import('vue').DirectiveOptions;
    } | undefined;
    components?: {
        [key: string]: {} | import('vue').Component<any, any, any, any, any> | import('vue').AsyncComponent<any, any, any, any>;
    } | undefined;
    transitions?: {
        [key: string]: object;
    } | undefined;
    filters?: {
        [key: string]: Function;
    } | undefined;
    provide?: object | (() => object) | undefined;
    inject?: import('vue/types/options').InjectOptions | undefined;
    model?: {
        prop?: string;
        event?: string;
    } | undefined;
    parent?: import('vue').default | undefined;
    name?: string | undefined;
    __name?: string | undefined;
    delimiters?: [string, string] | undefined;
    comments?: boolean | undefined;
    inheritAttrs?: boolean | undefined;
    props: {
        options: {
            mustUseProp: boolean;
            default: () => {};
            type: ObjectConstructor;
        };
        initialData: {
            mustUseProp: boolean;
            default: () => null;
            type: ObjectConstructor;
        };
        relationGraphCore: {
            mustUseProp: boolean;
            default: null;
            type: FunctionConstructor;
        };
    };
};
export default _default;
