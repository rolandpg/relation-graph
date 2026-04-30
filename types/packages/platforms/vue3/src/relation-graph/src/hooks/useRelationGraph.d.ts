import { RGJsonData, RGOptions } from '../../../../../../types';
import { RelationGraphCore } from '../../../../../../relation-graph-models/models/RelationGraphCore';
/**
 * This is a sophisticated and decoupled pattern:
 *
 * `useRGDataProvider`: Uses `provide`/`inject` (Vue's Context API) to "provide" a single, markRaw-marked `graphInstance` instance.
 *
 * `useRelationGraph`: A Hook that dynamically creates and returns a `graphInstance` instance and a `<RelationGraph>` component bound to that instance.
 * @param emitProxy
 * @param relationGraphCore
 */
export declare function useRelationGraph({ relationGraphCore }?: {
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
}): {
    RelationGraph: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        options: {
            required: false;
            type: () => RGOptions;
        };
        initialData: {
            required: false;
            type: () => RGJsonData;
        };
        emitProxy: {
            required: false;
            type: () => (any | void);
        };
    }>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        onReady: (graphInstance: RelationGraphCore) => boolean;
        onNodeClick: (node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => boolean;
        onNodeExpand: (node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => boolean;
        onNodeCollapse: (node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => boolean;
        onLineClick: (line: import('../../../../../../types').RGLine, link: import('../../../../../../types').RGLink, event: import('../../../../../../types').RGUserEvent) => boolean;
        onNodeDragStart: (node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => boolean;
        onNodeDragEnd: (node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent, x_buff: number, y_buff: number) => boolean;
        onNodeDragging: (node: import('../../../../../../types').RGNode, newX: number, newY: number, buffX: number, buffY: number, event: import('../../../../../../types').RGUserEvent) => boolean;
        onCanvasDragEnd: (event: import('../../../../../../types').RGUserEvent) => boolean;
        onCanvasDragging: (newX: number, newY: number, buffX: number, buffY: number) => boolean;
        onContextmenu: (event: import('../../../../../../types').RGUserEvent, objectType: import('../../../../../../types').RGEventTargetType, object: import('../../../../../../types').RGNode | import('../../../../../../types').RGLine | undefined, eventPositionOnCanvas: import('../../../../../../types').RGCoordinate, eventPositionOnView: import('../../../../../../types').RGCoordinate) => boolean;
        onFullscreen: (newValue: boolean, defaultFullscreen: () => Promise<void>) => boolean;
        onCanvasClick: (event: import('../../../../../../types').RGUserEvent) => boolean;
        onCanvasSelectionEnd: (selectionView: import('../../../../../../types').RGSelectionView, event: import('../../../../../../types').RGUserEvent) => boolean;
        beforeZoomStart: () => boolean;
        onZoomEnd: () => boolean;
        onViewResize: () => boolean;
        onResizeStart: (nodes: import('../../../../../../types').RGNode[], event: import('../../../../../../types').RGUserEvent) => boolean;
        beforeNodeResize: (node: import('../../../../../../types').RGNode, newX: number, newY: number, newW: number, newH: number) => boolean;
        onResizeEnd: (nodes: import('../../../../../../types').RGNode[], buffX: number, buffY: number, event: import('../../../../../../types').RGUserEvent) => boolean;
        onLineVertexDropped: (lineInfo: {
            newLineTemplate: import('../../../../../../types').JsonLine;
            fromNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
            toNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
        }) => boolean;
        beforeCreateLine: (lineInfo: {
            lineJson: import('../../../../../../types').JsonLine;
            fromNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
            toNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
        }) => boolean;
        onLineBeCreated: (lineInfo: {
            lineJson: import('../../../../../../types').JsonLine;
            fromNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
            toNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
        }) => boolean;
        beforeAddNodes: (nodes: import('../../../../../../types').JsonNode[]) => boolean;
        beforeAddLines: (lines: import('../../../../../../types').JsonLine[]) => boolean;
        onKeyboardDown: (event: KeyboardEvent) => boolean;
        onKeyboardUp: (event: KeyboardEvent) => boolean;
        onCanvasDragStart: (canvasMoveStartPosition: import('../../../../../../types').RGCoordinate, eventClientStartPosition: import('../../../../../../types').RGCoordinate, event: import('../../../../../../types').RGUserEvent) => boolean;
        onForceLayoutFinish: () => boolean;
        beforeScrollStart: (buffX: number, buffY: number, event: Event) => boolean;
    }, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        options: {
            required: false;
            type: () => RGOptions;
        };
        initialData: {
            required: false;
            type: () => RGJsonData;
        };
        emitProxy: {
            required: false;
            type: () => (any | void);
        };
    }>> & Readonly<{
        onOnReady?: ((graphInstance: RelationGraphCore) => any) | undefined;
        onOnNodeClick?: ((node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnNodeExpand?: ((node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnNodeCollapse?: ((node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnLineClick?: ((line: import('../../../../../../types').RGLine, link: import('../../../../../../types').RGLink, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnNodeDragStart?: ((node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnNodeDragEnd?: ((node: import('../../../../../../types').RGNode, event: import('../../../../../../types').RGUserEvent, x_buff: number, y_buff: number) => any) | undefined;
        onOnNodeDragging?: ((node: import('../../../../../../types').RGNode, newX: number, newY: number, buffX: number, buffY: number, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnCanvasDragEnd?: ((event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnCanvasDragging?: ((newX: number, newY: number, buffX: number, buffY: number) => any) | undefined;
        onOnContextmenu?: ((event: import('../../../../../../types').RGUserEvent, objectType: import('../../../../../../types').RGEventTargetType, object: import('../../../../../../types').RGNode | import('../../../../../../types').RGLine | undefined, eventPositionOnCanvas: import('../../../../../../types').RGCoordinate, eventPositionOnView: import('../../../../../../types').RGCoordinate) => any) | undefined;
        onOnFullscreen?: ((newValue: boolean, defaultFullscreen: () => Promise<void>) => any) | undefined;
        onOnCanvasClick?: ((event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnCanvasSelectionEnd?: ((selectionView: import('../../../../../../types').RGSelectionView, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onBeforeZoomStart?: (() => any) | undefined;
        onOnZoomEnd?: (() => any) | undefined;
        onOnViewResize?: (() => any) | undefined;
        onOnResizeStart?: ((nodes: import('../../../../../../types').RGNode[], event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onBeforeNodeResize?: ((node: import('../../../../../../types').RGNode, newX: number, newY: number, newW: number, newH: number) => any) | undefined;
        onOnResizeEnd?: ((nodes: import('../../../../../../types').RGNode[], buffX: number, buffY: number, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnLineVertexDropped?: ((lineInfo: {
            newLineTemplate: import('../../../../../../types').JsonLine;
            fromNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
            toNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
        }) => any) | undefined;
        onBeforeCreateLine?: ((lineInfo: {
            lineJson: import('../../../../../../types').JsonLine;
            fromNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
            toNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
        }) => any) | undefined;
        onOnLineBeCreated?: ((lineInfo: {
            lineJson: import('../../../../../../types').JsonLine;
            fromNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
            toNode: import('../../../../../../types').RGNode | import('../../../../../../types').RGLineTarget;
        }) => any) | undefined;
        onBeforeAddNodes?: ((nodes: import('../../../../../../types').JsonNode[]) => any) | undefined;
        onBeforeAddLines?: ((lines: import('../../../../../../types').JsonLine[]) => any) | undefined;
        onOnKeyboardDown?: ((event: KeyboardEvent) => any) | undefined;
        onOnKeyboardUp?: ((event: KeyboardEvent) => any) | undefined;
        onOnCanvasDragStart?: ((canvasMoveStartPosition: import('../../../../../../types').RGCoordinate, eventClientStartPosition: import('../../../../../../types').RGCoordinate, event: import('../../../../../../types').RGUserEvent) => any) | undefined;
        onOnForceLayoutFinish?: (() => any) | undefined;
        onBeforeScrollStart?: ((buffX: number, buffY: number, event: Event) => any) | undefined;
    }>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
    graphInstance: RelationGraphCore;
};
