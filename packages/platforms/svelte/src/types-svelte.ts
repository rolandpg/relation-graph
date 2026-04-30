import {
    JsonLine,
    JsonNode,
    RelationGraphInstance, RGCheckedItem, RGConnectingNode,
    RGCoordinate,
    RGCreatingLine,
    RGCreatingNode,
    RGEditingLine,
    RGEditingNodes,
    RGEventTargetType,
    RGFakeLine,
    RGLine,
    RGLineTarget,
    RGLink,
    RGNode,
    RGOptionsFull,
    RGPosition,
    RGSelectionView,
    RGUserEvent, RGViewInformation
} from "../../../types";
import {Readable, Writable} from "svelte/store";

export type RelationGraphEvents = {
    onReady: CustomEvent<[RelationGraphInstance]>;
    onNodeClick: CustomEvent<[RGNode, RGUserEvent]>;
    onNodeExpand: CustomEvent<[RGNode, RGUserEvent]>;
    onNodeCollapse: CustomEvent<[RGNode, RGUserEvent]>;
    onLineClick: CustomEvent<[RGLine, RGLink, RGUserEvent]>;
    onNodeDragStart: CustomEvent<[RGNode, RGUserEvent]>;
    onNodeDragEnd: CustomEvent<[RGNode, RGUserEvent, number, number]>;
    onNodeDragging: CustomEvent<[RGNode, number, number, number, number, RGUserEvent]>;
    onCanvasDragEnd: CustomEvent<[RGUserEvent]>;
    onCanvasDragging: CustomEvent<[number, number, number, number]>;
    onContextmenu: CustomEvent<[RGUserEvent, RGEventTargetType, RGNode | RGLine | undefined, RGCoordinate, RGCoordinate]>;
    onFullscreen: CustomEvent<[boolean, () => Promise<void>]>;
    onCanvasClick: CustomEvent<[RGUserEvent]>;
    onCanvasSelectionEnd: CustomEvent<[RGSelectionView, RGUserEvent]>;
    beforeZoomStart: CustomEvent<[]>;
    onZoomEnd: CustomEvent<[]>;
    onViewResize: CustomEvent<[]>;
    onResizeStart: CustomEvent<[RGNode[], RGUserEvent]>;
    beforeNodeResize: CustomEvent<[RGNode, number, number, number, number]>;
    onResizeEnd: CustomEvent<[RGNode[], number, number, RGUserEvent]>;
    onLineVertexDropped: CustomEvent<[{ newLineTemplate: JsonLine; fromNode: RGLineTarget | RGNode; toNode: RGLineTarget | RGNode }]>;
    beforeCreateLine: CustomEvent<[{ lineJson: JsonLine; fromNode: RGLineTarget | RGNode; toNode: RGLineTarget | RGNode }]>;
    onLineBeCreated: CustomEvent<[{ lineJson: JsonLine; fromNode: RGLineTarget | RGNode; toNode: RGLineTarget | RGNode }]>;
    beforeAddNodes: CustomEvent<[JsonNode[]]>;
    beforeAddLines: CustomEvent<[JsonLine[]]>;
    onKeyboardDown: CustomEvent<[KeyboardEvent]>;
    onKeyboardUp: CustomEvent<[KeyboardEvent]>;
    onCanvasDragStart: CustomEvent<[RGPosition, RGPosition, RGUserEvent]>;
    onForceLayoutFinish: CustomEvent<[]>;
    beforeScrollStart: CustomEvent<[number, number, Event]>;
};
export type RGEditingLineControllerEvents = {
    onLinePathChanged: { line: RGLine; params: any };
    onMoveLineVertexStart: { type: 'start' | 'end'; line: RGLine };
    onMoveLineVertexEnd: { from: RGNode | RGLineTarget | RGPosition; to: RGNode | RGLineTarget | RGPosition; newLineJson?: JsonLine };
    onLineTextDragEnd: { line: RGLine };
    onLineTextChanged: { line: RGLine };
};
export type RGDataStore = {
    optionsStore: Writable<RGOptionsFull>,
    shouldRenderNodesStore: Writable<RGNode[]>,
    shouldRenderLinesStore: Writable<RGLine[]>,
    shouldRenderFakeLinesStore: Writable<RGFakeLine[]>,
}
export type RGSvelteHooksStore = {
    creatingLineStore: Readable<RGCreatingLine>,
    creatingNodeStore: Readable<RGCreatingNode>,
    editingNodesStore: Readable<RGEditingNodes>,
    editingLineStore: Readable<RGEditingLine>,
    connectingNodeStore: Readable<RGConnectingNode>,
    viewInformationStore: Readable<RGViewInformation>,
    selectionStore: Readable<RGSelectionView & {show: boolean}>,
    checkedItemStore: Readable<RGCheckedItem>
}
