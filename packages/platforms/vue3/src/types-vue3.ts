import type {VNode} from 'vue';
import {ShallowRef, VueElement} from 'vue';
import {
    type JsonLine,
    type JsonNode,
    RelationGraphInstance,
    RelationGraphProps,
    type RGCoordinate,
    type RGEventTargetType,
    RGFakeLine,
    RGLine,
    RGLineTarget,
    type RGLink,
    RGNode,
    RGOptionsFull,
    type RGPosition,
    type RGSelectionView,
    type RGUserEvent
} from './types';

export declare class RelationGraphComponent extends VueElement {
  getInstance(): RelationGraphInstance;
  $props: RelationGraphProps;
  $slots: {
    default: VNode[];
    canvasPlug: VNode[];
    miniToolBar: VNode[];
    miniViewPanel: VNode[];
    nodeExpandHolder: VNode[];
    graphPlug: VNode[];
    node: VNode[];
    line: VNode[];
  };
}
export type RGProviderData = { graphInstance: RelationGraphInstance };
export declare const version: string;
export type RGDataStore = {
  optionsRef: ShallowRef<RGOptionsFull>
  shouldRenderNodesRef: ShallowRef<RGNode[]>
  shouldRenderLinesRef: ShallowRef<RGLine[]>
  shouldRenderFakeLinesRef: ShallowRef<RGFakeLine[]>
}
/**
 * This is a type definition specifically for the emits option of vue3 defineComponent components. It describes all the events supported by the relation-graph component and their parameter types. The content expressed is exactly the same as RGListeners.
 * @inner
 */
export const RGEventsDefine4Vue3 = {
    onReady: (graphInstance: RelationGraphInstance) => true,
    onNodeClick: (node: RGNode, event: RGUserEvent) => true,
    onNodeExpand: (node: RGNode, event: RGUserEvent) => true,
    onNodeCollapse: (node: RGNode, event: RGUserEvent) => true,
    onLineClick: (line: RGLine, link: RGLink, event: RGUserEvent) => true,
    onNodeDragStart: (node: RGNode, event: RGUserEvent) => true,
    onNodeDragEnd: (
        node: RGNode,
        event: RGUserEvent,
        x_buff: number,
        y_buff: number
    ) => true,
    onNodeDragging: (
        node: RGNode,
        newX: number,
        newY: number,
        buffX: number,
        buffY: number,
        event: RGUserEvent
    ) => true,
    onCanvasDragEnd: (event: RGUserEvent) => true,
    onCanvasDragging: (
        newX: number,
        newY: number,
        buffX: number,
        buffY: number
    ) => true,
    onContextmenu: (
        event: RGUserEvent,
        objectType: RGEventTargetType,
        object: RGNode | RGLine | undefined,
        eventPositionOnCanvas: RGCoordinate,
        eventPositionOnView: RGCoordinate
    ) => true,
    onFullscreen: (newValue: boolean, defaultFullscreen: () => Promise<void>) =>
        true,
    onCanvasClick: (event: RGUserEvent) => true,
    onCanvasSelectionEnd: (
        selectionView: RGSelectionView,
        event: RGUserEvent
    ) => true,
    beforeZoomStart: () => true,
    onZoomEnd: () => true,
    onViewResize: () => true,
    onResizeStart: (nodes: RGNode[], event: RGUserEvent) => true,
    beforeNodeResize: (
        node: RGNode,
        newX: number,
        newY: number,
        newW: number,
        newH: number
    ) => true,
    onResizeEnd: (
        nodes: RGNode[],
        buffX: number,
        buffY: number,
        event: RGUserEvent
    ) => true,
    onLineVertexDropped: (lineInfo: {
        newLineTemplate: JsonLine;
        fromNode: RGLineTarget | RGNode;
        toNode: RGLineTarget | RGNode;
    }) => true,
    beforeCreateLine: (lineInfo: {
        lineJson: JsonLine;
        fromNode: RGLineTarget | RGNode;
        toNode: RGLineTarget | RGNode;
    }) => true,
    onLineBeCreated: (lineInfo: {
        lineJson: JsonLine;
        fromNode: RGLineTarget | RGNode;
        toNode: RGLineTarget | RGNode;
    }) => true,
    beforeAddNodes: (nodes: JsonNode[]) => true,
    beforeAddLines: (lines: JsonLine[]) => true,
    onKeyboardDown: (event: KeyboardEvent) => true,
    onKeyboardUp: (event: KeyboardEvent) => true,
    onCanvasDragStart: (
        canvasMoveStartPosition: RGPosition,
        eventClientStartPosition: RGPosition,
        event: RGUserEvent
    ) => true,
    onForceLayoutFinish: () => true,
    beforeScrollStart: (buffX: number, buffY: number, event: Event) => true,
};
/**
 * This is a type definition specifically for the emits option of vue3 setup components. It describes all the events supported by the relation-graph component and their parameter types. The content expressed is exactly the same as RGListeners.
 * @inner
 */
export type RGEventEmits = {
    (e: 'onReady', graphInstance: RelationGraphInstance): void;
    (e: 'onNodeClick', node: RGNode, event: RGUserEvent): void;
    (e: 'onNodeExpand', node: RGNode, event: RGUserEvent): void;
    (e: 'onNodeCollapse', node: RGNode, event: RGUserEvent): void;
    (e: 'onLineClick', line: RGLine, link: RGLink, event: RGUserEvent): void;
    (e: 'onNodeDragStart', node: RGNode, event: RGUserEvent): void;
    (e: 'onNodeDragEnd', node: RGNode, event: RGUserEvent, x_buff: number, y_buff: number): void;
    (e: 'onNodeDragging', node: RGNode, newX: number, newY: number, buffX: number, buffY: number, event: RGUserEvent): void;
    (e: 'onCanvasDragEnd', event: RGUserEvent): void;
    (e: 'onCanvasDragging', newX: number, newY: number, buffX: number, buffY: number): void;
    (e: 'onContextmenu', event: RGUserEvent, objectType: RGEventTargetType, object: RGNode | RGLine | undefined, eventPositionOnCanvas: RGCoordinate, eventPositionOnView: RGCoordinate): void;
    (e: 'onFullscreen', newValue: boolean, defaultFullscreen: () => Promise<void>): void;
    (e: 'onCanvasClick', event: RGUserEvent): void;
    (e: 'onCanvasSelectionEnd', selectionView: RGSelectionView, event: RGUserEvent): void;
    (e: 'beforeZoomStart'): void;
    (e: 'onZoomEnd'): void;
    (e: 'onViewResize'): void;
    (e: 'onResizeStart', nodes: RGNode[], event: RGUserEvent): void;
    (e: 'beforeNodeResize', node: RGNode, newX: number, newY: number, newW: number, newH: number): void;
    (e: 'onResizeEnd', nodes: RGNode[], buffX: number, buffY: number, event: RGUserEvent): void;
    (e: 'onLineVertexDropped', lineInfo: {
        newLineTemplate: JsonLine,
        fromNode: RGLineTarget | RGNode,
        toNode: RGLineTarget | RGNode
    }): void;
    (e: 'beforeCreateLine', lineInfo: {
        lineJson: JsonLine,
        fromNode: RGLineTarget | RGNode,
        toNode: RGLineTarget | RGNode
    }): void;
    (e: 'onLineBeCreated', lineInfo: {
        lineJson: JsonLine,
        fromNode: RGLineTarget | RGNode,
        toNode: RGLineTarget | RGNode
    }): void;
    (e: 'beforeAddNodes', nodes: JsonNode[]): void;
    (e: 'beforeAddLines', lines: JsonLine[]): void;
    (e: 'onKeyboardDown', event: KeyboardEvent): void;
    (e: 'onKeyboardUp', event: KeyboardEvent): void;
    (e: 'onCanvasDragStart', canvasMoveStartPosition: RGPosition, eventClientStartPosition: RGPosition, event: RGUserEvent): void;
    (e: 'onForceLayoutFinish'): void;
    (e: 'beforeScrollStart', buffX: number, buffY: number, event: Event): true | undefined | void;
};
