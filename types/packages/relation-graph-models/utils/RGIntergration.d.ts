import { RelationGraphProps } from '../../types';
export declare const getEventListeners: (props: RelationGraphProps) => {
    onReady: ((graphInstance: import('../models/RelationGraphCore').RelationGraphCore) => void) | undefined;
    onNodeClick: ((node: import('../../types').RGNode, e: import('../../types').RGUserEvent) => boolean | void | Promise<boolean | void>) | undefined;
    onNodeExpand: ((node: import('../../types').RGNode, e: import('../../types').RGUserEvent) => boolean | void | Promise<boolean | void>) | undefined;
    onNodeCollapse: ((node: import('../../types').RGNode, e: import('../../types').RGUserEvent) => boolean | void | Promise<boolean | void>) | undefined;
    onLineClick: ((line: import('../../types').RGLine, link: import('../../types').RGLink, e: import('../../types').RGUserEvent) => boolean | void | Promise<boolean | void>) | undefined;
    onNodeDragStart: ((node: import('../../types').RGNode, e: import('../../types').RGUserEvent) => void) | undefined;
    onNodeDragEnd: ((node: import('../../types').RGNode, e: import('../../types').RGUserEvent, x_buff: number, y_buff: number) => void) | undefined;
    onNodeDragging: ((node: import('../../types').RGNode, newX: number, newY: number, buffX: number, buffY: number, e: import('../../types').RGUserEvent) => void | import('../../types').RGCoordinate | undefined) | undefined;
    onCanvasDragEnd: ((e: import('../../types').RGUserEvent) => void) | undefined;
    onCanvasDragging: ((newX: number, newY: number, buffX: number, buffY: number) => void | import('../../types').RGCoordinate | undefined) | undefined;
    onContextmenu: ((e: import('../../types').RGUserEvent, objectType: import('../../types').RGEventTargetType, object: import('../../types').RGNode | import('../../types').RGLine | undefined, eventPositionOnCanvas: import('../../types').RGCoordinate, eventPositionOnView: import('../../types').RGCoordinate) => void) | undefined;
    onFullscreen: ((newValue: boolean, defaultFullscreen: () => Promise<void>) => void) | undefined;
    onCanvasClick: ((e: import('../../types').RGUserEvent) => void) | undefined;
    onCanvasSelectionEnd: ((selectionView: import('../../types').RGSelectionView, e: import('../../types').RGUserEvent) => void) | undefined;
    beforeZoomStart: (() => false | void) | undefined;
    onZoomEnd: (() => void) | undefined;
    onViewResize: (() => void) | undefined;
    onResizeStart: ((nodes: import('../../types').RGNode[], e: import('../../types').RGUserEvent) => void) | undefined;
    beforeNodeResize: ((node: import('../../types').RGNode, newX: number, newY: number, newW: number, newH: number) => false | void) | undefined;
    onResizeEnd: ((nodes: import('../../types').RGNode[], buffX: number, buffY: number, e: import('../../types').RGUserEvent) => void) | undefined;
    onLineVertexDropped: ((lineInfo: {
        newLineTemplate: import('../../types').JsonLine;
        fromNode: import('../../types').RGNode | import('../../types').RGLineTarget;
        toNode: import('../../types').RGNode | import('../../types').RGLineTarget;
    }) => void) | undefined;
    beforeCreateLine: ((lineInfo: {
        lineJson: import('../../types').JsonLine;
        fromNode: import('../../types').RGNode | import('../../types').RGLineTarget;
        toNode: import('../../types').RGNode | import('../../types').RGLineTarget;
    }) => false | void) | undefined;
    onLineBeCreated: ((lineInfo: {
        lineJson: import('../../types').JsonLine;
        fromNode: import('../../types').RGNode | import('../../types').RGLineTarget;
        toNode: import('../../types').RGNode | import('../../types').RGLineTarget;
    }) => void) | undefined;
    beforeAddNodes: ((nodes: import('../../types').JsonNode[]) => void) | undefined;
    beforeAddLines: ((lines: import('../../types').JsonLine[]) => void) | undefined;
    onKeyboardDown: ((e: KeyboardEvent) => void) | undefined;
    onKeyboardUp: ((e: KeyboardEvent) => void) | undefined;
    onCanvasDragStart: ((canvasMoveStartPosition: import('../../types').RGCoordinate, eventClientStartPosition: import('../../types').RGCoordinate, e: import('../../types').RGUserEvent) => void) | undefined;
    onForceLayoutFinish: (() => void) | undefined;
    beforeScrollStart: ((buffX: number, buffY: number, e: Event) => true | void | undefined) | undefined;
};
