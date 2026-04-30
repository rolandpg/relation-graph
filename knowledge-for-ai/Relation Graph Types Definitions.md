
# Relation Graph Types Definitions

本文档整理自 types.ts，包含了 relation-graph 组件使用的核心数据类型定义及其注释说明。
Data types used by relation-graph

This document will define and introduce the core data types used by the relation-graph component.

## RelationGraphInstance

Relation-graph instance type, the instance object can provide methods for manipulating the graph, such as adding nodes, deleting nodes, updating node properties, etc.

```typescript
/**
 * @example:
 *
 * graphInstance.addNodes([
 * {id: 'a', text: 'Node A', x: 100, y: 100},
 * {id: 'b', text: 'Node B', x: 200, y: 200, color: '#ff0000'},
 * ]);
 * graphInstance.removeNodeById('a');
 * graphInstance.updateNode('b', {text: 'Updated Node B', color: '#00ff00'});
 *
*/
export type RelationGraphInstance = RelationGraphCore;

```

## RGInnerConnectTargetType

Internal connect target types for relation-graph

```typescript
export enum RGInnerConnectTargetType {
    Node = 'node',
    NodePoint = 'NodePoint',
    HTMLElementId = 'HTMLElementId',
    CanvasPoint = 'CanvasPoint',
    ViewPoint = 'ViewPoint'
}

```

## RGJunctionPoint

Junction points for connecting lines to nodes. You can set the fromJunctionPoint and toJunctionPoint properties of the line to use it.

```typescript
/**
 * @example
 *
 * import {RGJunctionPoint} from 'relation-graph-react';
 * const line = {
 * from: 'node1',
 * to: 'node2',
 * fromJunctionPoint: RGJunctionPoint.left, // Set the junction point on the 'from' node
 * toJunctionPoint: RGJunctionPoint.right // Set the junction point on the 'to' node
 * };
 *
*/
export enum RGJunctionPoint {
    border = 'border',
    ltrb = 'ltrb',
    tb = 'tb',
    lr = 'lr',
    left = 'left',
    right = 'right',
    top = 'top',
    bottom = 'bottom'
}

```

## RGConnectTargetData

Data type used internally by relation-graph to manage connection points.

```typescript
/**
 * @inner This type is used internally by relation-graph and is not recommended for direct use by users
 */
export type RGConnectTargetData = {
    targetId: string;
    targetType: string;
    nodeId?: string;
    junctionPoint: RGJunctionPoint;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    offsetPercentX: number;
    offsetPercentY: number;
    targetData: Record<string, any>;
};

```

## RGResizeHandlePosition

Resize handle positions for relation-graph

```typescript
/**
 * @inner
 */
export type RGResizeHandlePosition = 't' | 'r' | 'b' | 'l' | 'tl' | 'tr' | 'bl' | 'br';

```

## RGWidgetPosition

Used to specify the position for relation-graph widgets (such as toolbars, zoom controls, etc.)

```typescript
/**
 * @example
 *
 * import { RGSlotOnView, RGEditingNodeController, RGEditingNearNodeWidget } from 'relation-graph-react';
 * <RGSlotOnView>
 * <RGEditingNodeController> // Used to wrap the node editing area controller, it identifies one or more nodes currently being edited
 * <RGEditingNearNodeWidget position="top"> // Used to display custom widgets near the node editing area, here it is placed above the node
 * <button>Custom Top Widget</button> // This is a custom button that will be displayed above the node
 * </RGEditingNearNodeWidget>
 * </RGEditingNodeController>
 * </RGSlotOnView>
 *
*
*/
export type RGWidgetPosition = 'top' | 'right' | 'bottom' | 'left' | 'tl' | 'tr' | 'bl' | 'br';

```

## RGLineEditPoint

```typescript
/**
 * @inner
 */
export type RGLineEditPoint = 'start' | 'end';

```

## RGNodeShape

Node shapes supported by default in relation-graph, which affect the connection points of lines to nodes and the rendering of nodes on Canvas 2D (Thumbnails view, EasyView).

```typescript
export enum RGNodeShape {
    circle = 0,
    rect = 1
}

```

## RGLineShape

Line shapes for relation-graph. You can set the lineShape property of the line to use it.

```typescript
/**
 * @example
 *
 * import {RGLineShape} from 'relation-graph-react';
 * const line = {
 * from: 'node1',
 * to: 'node2',
 * lineShape: RGLineShape.StandardCurve // Set the line shape to StandardCurve
 * };
 *
*/
export enum RGLineShape {
    StandardStraight = 1,
    StandardCurve = 6,
    Curve2 = 2,
    Curve3 = 3,
    Curve5 = 5,
    Curve7 = 7,
    Curve8 = 8,
    SimpleOrthogonal = 4,
    StandardOrthogonal = 44,
    HardOrthogonal = 49
}

```

## RGEventTargetType

The type of target object that triggered the event. For example, in a right-click event (onContextmenu), relation-graph will tell you on which type of object the right-click event was triggered.
'canvas' means the event was triggered on the canvas, 'node' means it was triggered on a node, and 'line' means it was triggered on a line.

```typescript
export type RGEventTargetType = 'canvas' | 'node' | 'line';

```

## RGDirection

Direction enum used in internal logic processing of relation-graph

```typescript
export enum RGDirection {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
}

```

## RGUserEvent

User event type for relation-graph, can be MouseEvent or TouchEvent

```typescript
export type RGUserEvent = MouseEvent | TouchEvent;

```

## RGRectTarget

Rectangle target type for nodes in relation-graph

```typescript
export type RGRectTarget = {
    x: number;
    y: number;
    nodeShape: RGNodeShape;
    el_W: number;
    el_H: number;
}

```

## RGLineTarget

Line target type for lines in relation-graph

```typescript
export type RGLineTarget = RGRectTarget & {
    id?: string // Like node.text
    text?: string; // Like node.text
    targetType: RGInnerConnectTargetType | string
    targetData?: Record<string, any>
    hidden?: boolean
};

```

## JsonNode

JSON node type for relation-graph

```typescript
/**
 * @example
 *
 * import {JsonNode} from 'relation-graph-react';
 * const node: JsonNode = {
 * id: 'node1',
 * text: 'Node 1',
 * type: 'customNodeType',
 * x: 100,
 * y: 100,
 * color: '#ff0000',
 * nodeShape: RGNodeShape.rect,
 * width: 120,
 * height: 60,
 * data: {
 * customProperty: 'customValue'
 * }
 * };
 *
*/
export type JsonNode = {
    id: string
    text?: string
    type?: string
    targetType?: string
    expanded?: boolean
    selected?: boolean
    disablePointEvent?: boolean
    disableDrag?: boolean
    className?: string
    nodeShape?: RGNodeShape
    borderColor?: string
    borderWidth?: number
    borderRadius?: number
    fontColor?: string
    fontSize?: number
    color?: string
    opacity?: number
    fixed?: boolean
    width?: number
    height?: number
    x?: number
    y?: number
    zIndex?: number
    data?: Record<string, any>
    expandHolderPosition?: string
    force_weight?: number
    el_W?: number;
    el_H?: number;
    /**
    * Will be ignored when importing data
    */
    children?: JsonNode[]
    hidden?: boolean
    alwaysRender?: boolean
}

```

## RGNode

Enhanced node type for runtime in relation-graph, it includes additional properties needed for runtime such as whether to render, calculated visibility, layout information, etc.

```typescript
export type RGNode = Omit<JsonNode, 'children'> & RGRectTarget & {
    type: string
    x: number
    y: number
    nodeShape: RGNodeShape
    lot: {
        childs: RGNode[]
        parent?: RGNode | undefined
        eached?: boolean
        strength?: number
        subling?: {
            level: number
            all_size: number
            all_strength: number
        }
        level?: number
        index_of_parent?: number
        strength_of_level?: number
        index_of_level?: number
        childrenSize?: number
        childrenSizeVisible?: number
        index_of_p_childs?: number
        strengthWithChilds?: number
        strengthWithChilds_from?: number
        x?: number
        y?: number
    }
    rgChildrenSize?: number
    rgShouldRender?: boolean
    rgCalcedVisibility?: boolean
}

```

## JsonLine

JSON line type for relation-graph

```typescript
/**
 * @example
 *
 * import {JsonLine, RGLineShape} from 'relation-graph-react';
 * const line: JsonLine = {
 * id: 'line1',
 * from: 'node1',
 * to: 'node2',
 * text: 'Line from Node 1 to Node 2',
 * type: 'customLineType',
 * color: '#0000ff',
 * lineShape: RGLineShape.StandardCurve,
 * data: {
 * customProperty: 'customValue'
 * }
 * };
 *
*/
export type JsonLine = {
    id?: string
    from: string
    to: string
    text?: string
    selected?: boolean
    type?: string;
    isFakeLine?: boolean;
    fromType?: string;
    toType?: string;
    color?: string
    fontColor?: string
    fontSize?: number
    lineWidth?: number
    opacity?: number
    lineShape?: RGLineShape
    className?: string
    showStartArrow?: boolean
    showEndArrow?: boolean
    startMarkerId?: string
    endMarkerId?: string
    useTextOnPath?: boolean
    placeText?: string
    textAnchor?: string
    lineDirection?: string
    polyLineStartDistance?: number
    disablePointEvent?: boolean
    data?: Record<string, any>
    cssVars?: Record<string, any>
    force_elastic?: number
    textOffsetX?: number
    textOffsetY?: number
    animation?: number
    dashType?: number
    lineRadius?: number
    forDisplayOnly?: boolean
    junctionOffset?: number
    fromJunctionPoint?: RGJunctionPoint
    toJunctionPoint?: RGJunctionPoint
    fromJunctionPointOffsetX?: number
    fromJunctionPointOffsetY?: number
    toJunctionPointOffsetX?: number
    toJunctionPointOffsetY?: number
    hidden?: boolean
}

```

## RGFakeLine

RGFakeLine can use non-node objects as the start or end points of fake nodes, enabling more complex line connection requirements.
The difference between RGFakeLine and RGLine is that the from and to properties of RGLine must be node IDs, while RGFakeLine is not restricted, but RGFakeLine does not produce any layout effects.
By setting fromType and toType to identify the start and end types of the fake line.
The default supported types are those in the RGInnerConnectTargetType enum. You can also define custom types by using the graphInstance.setFakeLineTargetRender method to specify how to obtain the RGRectTarget information for the custom type.

```typescript
export type RGFakeLine = JsonLine & {
    id: string;
    fromType?: RGInnerConnectTargetType | string;
    toType?: RGInnerConnectTargetType | string;
}

```

## RGLine

Enhanced line type for runtime in relation-graph.
isReverse: indicates whether the line direction is reversed, which is automatically calculated based on the from and to nodes and does not need to be set manually.

```typescript
export type RGLine = JsonLine & {
    id: string;
    isReverse?: boolean // 自动计算，无需设置
}

```

## RGLink

The runtime derived object type of the line, which can associate the line with its start and end nodes, and contains some additional properties for rendering and visibility calculation.
You can get the RGLink object through the graphInstance.getLinks() method, or get the RGLink object corresponding to the specified line through the graphInstance.getLinkByLineId(lineId: string) method.

```typescript
/**
 * - line : The RGLine object corresponding to this link
 * - fromNode : The RGNode object representing the start node of the line
 * - toNode : The RGNode object representing the end node of the line
 * - totalLinesBetweenNodes : The total number of lines between the fromNode and toNode
 * - currentLineIndex : The index of the current line among all lines between the fromNode and toNode
 * - rgShouldRender : Indicates whether this link should be rendered, which is calculated based on the visibility of the fromNode and toNode, as well as whether the line itself is hidden
 * - rgCalcedVisibility : Indicates whether this link is visible, which is calculated based on the visibility of the fromNode and toNode, as well as whether the line itself is hidden
 *
 */
export type RGLink = {
    lineId: string
    line: RGLine,
    fromNode: RGNode
    toNode: RGNode
    totalLinesBetweenNodes: number
    currentLineIndex: number
    rgShouldRender?: boolean
    rgCalcedVisibility?: boolean // allLines(!hidden) && (fromNode rgCalcedVisibility) && (toNode rgCalcedVisibility)
};

```

## RGElementLine

@deprecated Use RGLink instead

```typescript
export type RGElementLine = RGLink;

```

## RGJsonData

RGJsonData is a JSON data format for quickly setting graph data. Through it, you can quickly import data using the graphInstance.setJsonData method.

```typescript
/**
 * It is a shortcut method, equivalent to the following code:
 *
 * const jsonData = {
 * rootId: 'rootNodeId',
 * nodes: [...],
 * lines: [...]
 * };
 * graphInstance.addNodes(jsonData.nodes);
 * graphInstance.addLines(jsonData.lines);
 * graphInstance.setRootNodeId(jsonData.rootId);
 *
*/
export type RGJsonData = {
    rootId?: string
    nodes: JsonNode[]
    lines: JsonLine[]
    fakeLines?: JsonLine[]
};

```

## RGGraphData

RGGraphData is the internal data structure used by relation-graph to manage graph data

```typescript
export type RGGraphData = {
    rootNode?: RGNode,
    nodes: RGNode[],
    normalLines: RGLine[],
    fakeLines: RGFakeLine[]
};

```

## RGCoordinate

Coordinate type for relation-graph

```typescript
export type RGCoordinate = {
    x: number;
    y: number;
};

```

## RGNodesRectBox

Rectangle box type for counting node areas.

```typescript
/**
 * For example, you can get the rectangular area occupied by the specified nodes through the following code:
 *
 * const nodesBoxInfo: RGNodesRectBox = graphInstance.getNodesRectBox(someNodes);
 *
*/
export type RGNodesRectBox = {
    width: number;
    height: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

```

## RGPosition

Position type for relation-graph. Generally used to save position coordinates.

```typescript
export type RGPosition = RGCoordinate;

```

## RGDraggingCallback

Drag callback type used in internal logic processing of relation-graph

```typescript
/**
 * @inner
 */
export type RGDraggingCallback = (
    offsetX: number,
    offsetY: number,
    startElPosition: { x: number; y: number },
    startEventPosition: { x: number; y: number },
    event: MouseEvent | TouchEvent
) => void;

```

## RGDraggedCallback

Drag end callback type used in internal logic processing of relation-graph

```typescript
/**
 * @inner
 */
export type RGDraggedCallback = (
    buffX: number,
    buffY: number,
    event: MouseEvent | TouchEvent
) => void;

```

## RGLayoutOptions4Alignment

Layout options fragment: node alignment settings

```typescript
/**
 * - alignItemsX: The coordinate assigned to the node is based on which position of the node, 'start' means left-aligned, 'center' means center-aligned, and 'end' means right-aligned
 * - alignItemsY: The coordinate assigned to the node is based on which position of the node, 'start' means top-aligned, 'center' means center-aligned, and 'end' means bottom-aligned
 */
export type RGLayoutOptions4Alignment = {
    alignItemsX?: 'start' | 'center' | 'end';
    alignItemsY?: 'start' | 'center' | 'end';
};

```

## RGLayoutOptionsCore

Layout core options type

```typescript
/**
 * - layoutName: Layout algorithm name such as 'force', 'center', 'tree', etc.
 * - layoutDirection: Layout direction, 'h' means horizontal layout, 'v' means vertical layout
 * - fixedRootNode: By default, the root node is fixed at the center of the canvas (coordinates: 0,0). If set to true, the root node position will not be fixed, and the layout engine will assign relative positions to other nodes based on the current coordinates of the root node.
 * - autoLayouting: Used to get whether the layout engine is currently performing automatic layout calculations (applicable to force-directed layouts and center layouts that inherit from force-directed layouts). This property does not need to be set and is read-only.
 * - supportAutoLayout: Whether to support automatic layout. Generally, force-directed layouts and center layouts that inherit from force-directed layouts support automatic layout, while other layouts do not support automatic layout. This property does not need to be set and is read-only.
 */
export type RGLayoutOptionsCore = RGLayoutOptions4Alignment & {
    layoutName: string;
    layoutDirection?: 'h' | 'v';
    fixedRootNode?: boolean
    autoLayouting?: boolean
    supportAutoLayout?: boolean
};

```

## RGForceLayoutOptions

Force-directed layout options type

```typescript
/**
 * - fastStart: Default is false. The force-directed layout will start the force-directed calculation with a center layout as the initial state. If set to true, it will start the force-directed calculation from a random position, which may speed up the convergence of the layout, but the node positions may be more dispersed in the initial state.
 * - maxLayoutTimes: Maximum number of layout iterations, default is 300. The force-directed layout will stop the layout calculation when it reaches this number of iterations, even if the layout has not fully converged.
 * - byNode: Whether to enable repulsion calculation between nodes, default is true.
 * - byLine: Whether to enable elastic force calculation between lines, default is true.
 * - force_node_repulsion: Repulsion coefficient between nodes, default is 1. The larger this value, the stronger the repulsion between nodes, and the more dispersed the layout will be.
 * - force_line_elastic: Elastic coefficient between lines, default is 1. The larger this value, the stronger the elastic force between lines, and the more compact the layout will be.
 *
 */
export type RGForceLayoutOptions = RGLayoutOptionsCore & {
    fastStart?: boolean;
    maxLayoutTimes?: number;
    byNode?: boolean;
    byLine?: boolean;
    force_node_repulsion?: number;
    force_line_elastic?: number;
};

```

## RGCenterLayoutOptions

Center layout options type

```typescript
/**
 * - distanceCoefficient: Coefficient for calculating the ideal distance between nodes, default is 1. The larger this value, the greater the ideal distance between nodes, and the more dispersed the layout will be.
 * - levelGaps: Array of distances between levels, default is []. You can set the distance between different levels of nodes in the tree structure. For example, [100, 200, 300] means the distance between level 0 and level 1 is 100, the distance between level 1 and level 2 is 200, and the distance between level 2 and level 3 is 300. If the array length is less than the number of levels, the last value will be used for the remaining levels.
 */
export type RGCenterLayoutOptions = RGForceLayoutOptions & {
    distanceCoefficient?: number
    levelGaps?: number[]
};

```

## RGTreeLayoutOptions

Tree layout options type

```typescript
/**
 * - from: The node ID from which the tree layout starts
 * - treeNodeGapH: Horizontal gap between tree nodes, default is 50
 * - treeNodeGapV: Vertical gap between tree nodes, default is 50
 * - levelGaps: Array of gaps between levels, default is []. You can set the gap between different levels of nodes in the tree structure. For example, [100, 200, 300] means the gap between level 0 and level 1 is 100, the gap between level 1 and level 2 is 200, and the gap between level 2 and level 3 is 300. If the array length is less than the number of levels, the last value will be used for the remaining levels.
 * - layoutExpansionDirection: Direction of tree expansion, 'start' means expanding from top to bottom or left to right, 'center' means expanding from center to both sides, 'end' means
 * - simpleTree: By default, the tree will expand bidirectionally based on the root node according to the direction of the relationships. If set to true, the tree structure will only expand unidirectionally.
 * - ignoreNodeSize: Whether to ignore node size when calculating tree layout, default is false. If set to true, all nodes will be treated as having the same size during layout calculation, which may speed up the layout calculation but may affect the layout effect.
 * - alignParentItemsX: Alignment of parent nodes in the X direction, 'start' means left-aligned, 'center' means center-aligned, and 'end' means right-aligned. Default is 'center'.
 * - alignParentItemsY: Alignment of parent nodes in the Y direction, 'start' means top-aligned, 'center' means center-aligned, and 'end' means bottom-aligned. Default is 'center'.
 */
export type RGTreeLayoutOptions = RGLayoutOptionsCore & {
    from: string
    treeNodeGapH?: number
    treeNodeGapV?: number
    levelGaps?: number[]
    layoutExpansionDirection?: 'start' | 'center' | 'end'
    simpleTree?: boolean;
    ignoreNodeSize?: boolean;
    alignParentItemsX?: 'start' | 'center' | 'end';
    alignParentItemsY?: 'start' | 'center' | 'end';
};

```

## RGLayoutOptions

Layout options type for relation-graph

```typescript
/**
 * Supported layoutName include:
 * - tree: Tree layout, using RGTreeLayout class for layout
 * - center: Center layout, using RGCenterLayout class for layout
 * - circle: Circle layout, using RGCircleLayout class for layout
 * - force: Force-directed layout, using RGForceLayout class for layout
 * - fixed: Fixed layout, using RGFixedLayout class for layout
 * - smart-tree: Smart tree layout, using RGSmartTreeLayout class for layout
 * - io-tree: Input-output tree layout, using RGIOTreeLayout class for layout
 * - folder: Folder layout, using RGFolderLayout class for layout
 */
export type RGLayoutOptions = RGLayoutOptionsCore
    | RGForceLayoutOptions
    | RGCenterLayoutOptions
    | RGTreeLayoutOptions;

```

## RGLayout

Layout engine interface type for relation-graph internal use

```typescript
/**
 * @inner
 */
export interface RGLayout {
    isMainLayouer: boolean
    requireLinks: boolean
    allNodes: RGNode[]
    rootNode?: RGNode
    layoutOptions: RGLayoutOptions
    networkAnalyzer: RGNetworkAnalyzer
    setLinks: (links: RGLink[]) => void
    placeNodes: (allNodes: RGNode[], rootNode: RGNode) => void
    start?: () => void
    stop?: () => void
}

```

## RGOptionsInited

Complete configuration type that includes all options available for users to configure

```typescript
export type RGOptionsInited = {
    instanceId: string
    debug: boolean
    showToolBar: boolean
    backgroundColor: string
    disableWheelEvent: boolean
    wheelEventAction: 'zoom' | 'scroll' | 'none'
    dragEventAction: 'move' | 'selection' | 'none'
    disableDragNode: boolean
    disableDragLine: boolean
    canvasMoveMode: boolean
    disableNodePointEvent: boolean
    disableLinePointEvent: boolean
    toolBarDirection: string
    toolBarPositionH: string
    toolBarPositionV: string
    defaultExpandHolderPosition: 'hide' | 'left' | 'top' | 'right' | 'bottom'
    defaultNodeColor: string
    checkedItemBackgroundColor?: string //
    defaultLineTextOffsetX?: number,
    defaultLineTextOffsetY?: number,
    defaultLineColor: string
    defaultLineShape?: RGLineShape
    // defaultNodeWidth: number
    // defaultNodeHeight: number
    // defaultShowLineLabel: boolean
    // hideNodeContentByZoom: boolean
    defaultJunctionPoint?: RGJunctionPoint
    // placeSingleNode: boolean
    placeOtherNodes: boolean
    defaultLineTextOnPath: boolean
    lineTextMaxLength: number
    multiLineDistance: number
    checkedNodeId: string // private
    checkedLineId: string // private
    draggingNodeId: string // private
    performanceMode: boolean,
    fullscreenElementXPath: string,
    data: any
    viewHeight: string
    defaultLineMarker: {
        markerWidth: number
        markerHeight: number
        refX: number
        refY: number
        viewBox: string
        data: string
    }
    layout: RGLayoutOptions
    canvasZoom: number // private
    mouseWheelSpeed: number // private
    minCanvasZoom: number // private
    maxCanvasZoom: number // private
    placeOtherGroup: boolean
    defaultPolyLineRadius: number,
    reLayoutWhenExpandedOrCollapsed: boolean
    creatingSelection: boolean
    selectionView: RGSelectionView
    creatingNodePlot: boolean
    showTemplateNode: boolean
    newNodeTemplate: any
    creatingLinePlot: boolean
    newLineTemplate: RGLine
    newLinkTemplate: any
    definitelyNoDataProviderNeeded: boolean
}

```

## RGOptionsFull

Complete configuration type that includes all runtime state options, none of which can be directly configured by users

```typescript
export type RGOptionsFull = RGOptionsInited & {
    snapshotting: boolean
    graphLoading: boolean
    enableNodeXYAnimation: boolean
    enableCanvasTransformAnimation: boolean
    graphLoadingText: string
    editingLineController: RGEditingLine,
    editingController: RGEditingNodes,
    nodeConnectController: RGConnectingNode,
    showReferenceLine: boolean,
    referenceLineAdsorption: boolean,
    editingReferenceLine: {
        show: boolean,
        directionV: boolean,
        directionH: boolean,
        v_x: number,
        v_y: number,
        v_height: number,
        h_x: number,
        h_y: number,
        h_width: number
    },
    showMiniView: boolean,
    miniViewVisibleHandle: {
        x: number,
        y: number,
        width: number,
        height: number,
        emptyContent: boolean
    }
    instanceId: string
    viewSize: { width: number; height: number }
    canvasSize: {
        width: number
        height: number
    }
    canvasOffset: {
        x: number
        y: number
    }
    fullscreen: boolean // private
    showEasyView?: boolean // private
    canvasOpacity?: number // private
}

```

## RGOptions

Partial configuration type for relation-graph, users can configure any subset of options

```typescript
export type RGOptions = Partial<RGOptionsInited>;

```

## RGSelectionView

When the user performs a selection operation on the canvas (event: onCanvasSelectionEnd), the type of selection view information passed

```typescript
export type RGSelectionView = {
    x: number
    y: number
    width: number
    height: number
};

```

## RGEventHandler

Event handler type for relation-graph events

```typescript
/**
 * @inner
 */
export type RGEventHandler = (eventName: RGEventNames, ...args: any[]) => void | any;

```

## RGEventEmitHook

Event emit hook type for relation-graph events

```typescript
/**
 * @inner
 */
export type RGEventEmitHook = (eventName: RGEventNames, ...args: any[]) => void | any;

```

## RGCtrlPointForLine44

Control point type for RGLineShape.Line44 lines

```typescript
/**
 * @inner
 */
export type RGCtrlPointForLine44 = {
    pIndex: number,
    optionName: string,
    direction: 'v' | 'h',
    x: number,
    y: number,
    startDirection: RGDirection,
    endDirection: RGDirection,
    hide?: boolean
}

```

## RelationGraphExpose

The exposed interface type of the relation-graph component instance

```typescript
/**
 * @inner
 */
export interface RelationGraphExpose {
    getInstance(): RelationGraphInstance;
}

```

## RGNodeSlotProps

Props type for RGNodeSlot component

```typescript
export interface RGNodeSlotProps {
    node: RGNode
    defaultExpandHolderPosition?: string
    dragging?: boolean
    checked?: boolean
}

```

## RGLinePeelProps

Props type for RGLineSlot component

```typescript
/**
 * @inner
 */
export interface RGLinePeelProps {
    line: RGLine | RGFakeLine
    checked?: boolean
    defaultLineTextOnPath?: boolean
    graphInstanceId?: string
}

```

## RGLineSlotProps

Custom line slot component Props type

```typescript
/**
 * @param lineConfig Configuration parameters for the line, which include information such as the start and end objects, line objects, etc., used for line objects, and global default configurations for rendering lines.
 * @param checked Whether the current line is selected
 * @param defaultLineTextOnPath Whether the line uses textPath to typeset text, allowing the text to be arranged along the line path
 * @param graphInstanceId The ID of the current graph instance, used for creating some unique identifiers, etc. (for example, you can display two relation-graph components with the same data on one page to prevent their ids from conflicting)
 *
 */
export interface RGLineSlotProps {
    lineConfig: RGGenerateLineConfig
    checked?: boolean
    defaultLineTextOnPath?: boolean
    graphInstanceId?: string
}

```

## RGLinePathProps

Props type for RGLinePath component

```typescript
/**
 * @param lineConfig Configuration parameters for the line, which include information such as the start and end objects, line objects, etc., used for line objects, and global default configurations for rendering lines.
 * @param linePathInfo The path information of the line, including path data, text position, etc., used for rendering the line path
 * @param useTextOnPath Whether the line uses textPath to typeset text, allowing the text to be arranged along the line path
 * @param checked Whether the current line is selected
 * @param graphInstanceId The ID of the current graph instance, used for creating some unique identifiers, etc. (for example, you can display two relation-graph components with the same data on one page to prevent their ids from conflicting)
 *
 */
export interface RGLinePathProps {
    lineConfig: RGGenerateLineConfig
    linePathInfo: RGLinePathInfo
    useTextOnPath?: boolean
    checked?: boolean
    graphInstanceId?: string
}

```

## RGLineTextProps

Props type for RGLineText component

```typescript
/**
 * @param lineConfig Configuration parameters for the line, which include information such as the start and end objects, line objects, etc., used for line objects, and global default configurations for rendering lines.
 * @param linePathInfo The path information of the line, including path data, text position, etc., used for rendering the line path
 * @param checked Whether the current line is selected
 *
 */
export interface RGLineTextProps {
    lineConfig: RGGenerateLineConfig
    linePathInfo: RGLinePathInfo
    checked?: boolean
}

```

## RelationGraphProps

Props type for <RelationGraph /> component

```typescript
/**
 * @param options Configuration options for relation-graph
 * @param relationGraphCore The core class of relation-graph, default is RelationGraphCore
 */
export type RelationGraphProps = RGListeners & {
    options: RGOptions;
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
};

```

## RGToolBarProps

Positioning props for <RGToolBar /> components

```typescript
/**
 * @param direction 'v' means vertical toolbar, 'h' means horizontal toolbar
 * @param positionH 'left' means left-aligned, 'center' means center-aligned, 'right' means right-aligned
 * @param positionV 'top' means top-aligned, 'center' means center-aligned, 'bottom' means bottom-aligned
 */
export interface RGToolBarProps {
    direction?: 'v' | 'h' | string,
    positionH?: 'left' | 'center' | 'right' | string,
    positionV?: 'top' | 'center' | 'bottom' | string,
}

```

## RGMiniViewProps

Positioning props for <RGMiniView /> components

```typescript
/**
 * @param position Position of the mini view: 'tl' | 'tr' | 'bl' | 'br' | 'top' | 'right' | 'bottom' | 'left'
 * @param width Width of the mini view
 * @param height Height of the mini view
 */
export interface RGMiniViewProps {
    position?: RGWidgetPosition,
    width?: string,
    height?: string,
    className?: string;
    style?: Record<string, string | number | undefined>,
}

```

## RGWidgetProps

Positioning props for <RGEditingNearNodeWidget /> components

```typescript
/**
 * @param position Position of the widget: 'tl' | 'tr' | 'bl' | 'br' | 'top' | 'right' | 'bottom' | 'left'
 */
export interface RGWidgetProps {
    position?: RGWidgetPosition
}

```

## RGEditingLineControllerProps

Props type for RGEditingLineController component

```typescript
/**
 * @inner
 */
export interface RGEditingLineControllerProps {
    textEditable?: boolean
    pathEditable?: boolean
    onMoveLineVertexStart?: (type: RGLineEditPoint, line: RGLine) => void
    onMoveLineVertexEnd?: RGLineVertexBeDroppedEventHandler
    onLinePathChanged?: (line: RGLine, params: any) => void
    onLineTextDragEnd?: (line: RGLine) => void
    onLineTextChanged?: (line: RGLine) => void
}

```

## RGLineConnectEventHandler

```typescript
/**
 * @inner
 */
export type RGLineConnectEventHandler = (fromNode: RGNode | RGLineTarget | RGPosition, toNode: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine) => void;

```

## RGLineVertexBeDroppedEventHandler

```typescript
/**
 * @inner
 */
export type RGLineVertexBeDroppedEventHandler = (fromNode: RGNode | RGLineTarget | RGPosition, toNode: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine) => void;

```

## CreatingLinePlotOptions

```typescript
/**
 * @inner
 */
export type CreatingLinePlotOptions = {
    onCreateLine: RGLineConnectEventHandler | undefined
    isReverse?: boolean,
    template?: JsonLineLike
    fromNode?: RGLineTarget
};

```

## CreatingNodePlotOptions

```typescript
/**
 * @inner
 */
export type CreatingNodePlotOptions = {
    templateNode: JsonNodeLike
    templateMove?: (x: number, y: number) => void
    onCreateNode: (x: number, y: number, nodeTemplate?: JsonNodeLike) => void
};

```

## RGConnectSourceProps

Props type for <RGConnectSource> component.
The RGConnectSource component allows any element to have the functionality of a connection starting point.

```typescript
/**
 * @param lineTemplate The template information for the connection line, which can be partial properties of JsonLine
 * @param onConnectStart Callback function triggered when starting to initiate a connection line
 * @param onConnectEnd Callback function triggered when the connection line initiation ends
 * @param className Custom class name for the component
 * @param style Custom styles for the component
 * @example
 *
 * import {RGLineShape} from 'relation-graph-react';
 *
 * <RGConnectSource
 * :lineTemplate="{ color: 'red', lineShape: RGLineShape.StandardCurve }"
 * :onConnectEnd="(fromNode, toNode, newLineJson) => {
 * console.log('Connection ended:', fromNode, toNode, newLineJson);
 * // You can add the new line to the graph here
 * graphInstance.addLines([newLineJson]);
 * }"
 * >
 * <div class="my-connect-source">
 * Drag from here to connect
 * </div>
 * </RGConnectSource>
 *
*/
export interface RGConnectSourceProps {
lineTemplate: JsonLineLike;
onConnectStart?: (newLineTemplate?: JsonLineLike, event?: RGUserEvent) => void;
onConnectEnd?: RGLineConnectEventHandler; // default is true
className?: string;
style?: Record<string, string | number | undefined>,
}

```

## RGConnectTargetProps

Component <RGConnectTarget> Props type.
The RGConnectTarget component allows any element to have the functionality of a connection endpoint. Unlike RGConnectSource, RGConnectTarget can not only be dragged to start creating a line, but also be used as a connection point for lines.

```typescript
/**
 * When a connection line is initiated from RGConnectTarget and completed, the new line information can be obtained through the onLineBeCreated event of the <RelationGraph> component and added to the graph. The creation of the line can also be completed through onDragConnectEnd.
 * @param junctionPoint Specifies the junction point information of the connection target
 * @param targetId The target ID corresponding to the connection target, which can be a node ID or a special identifier
 * @param targetType The type of the connection target, which can be customized to distinguish different types of targets, Default is RGInnerConnectTargetType.NodePoint (if RGConnectTarget is placed inside a node) or RGInnerConnectTargetType.CanvasPoint
 * @param targetData Additional data for the connection target, which can store any information related to the target
 * @param onLineVertexBeDropped Callback function triggered when a line endpoint is dragged to this connection target and released
 * @param lineTemplate The template information for the connection line, which can be partial properties of JsonLine
 * @param disableDrop Whether to disable the function of dragging the line endpoint to this connection target for connection, default is false
 * @param disableDrag Whether to disable the function of initiating line connection from this connection target, default is false
 * @param onDragConnectStart Callback function triggered when starting to drag from this connection target to initiate a connection line
 * @param onDragConnectEnd Callback function triggered when the connection line initiated by dragging from this connection target is released
 * @param className Custom class name for the component
 * @param style Custom styles for the component
 * @example
 *
 * import {RGJunctionPoint, RGLineShape} from 'relation-graph-react';
 *
 * <RGConnectTarget
 * :junctionPoint="RGJunctionPoint.Bottom"
 * targetId="my-target-1"
 * :targetData="{ info: 'additional data' }"
 * :lineTemplate="{ color: '#ff0000', lineShape: RGLineShape.StandardStraight, data: { info: 'additional data' } }"
 * >
 * <div class="my-connect-target">
 * Drop line here or drag from here to connect
 * </div>
 * </RGConnectTarget>
 *
*/
export interface RGConnectTargetProps {
    junctionPoint: RGJunctionPoint;
    targetId: string;
    targetType?: string;
    targetData?: Record<string, any>;
    onLineVertexBeDropped?: RGLineVertexBeDroppedEventHandler;
    lineTemplate?: JsonLineLike;
    disableDrop?: boolean;
    disableDrag?: boolean;
    onDragConnectStart?: (newLineTemplate?: JsonLineLike, event?: RGUserEvent) => void;
    onDragConnectEnd?: RGLineConnectEventHandler; // default is true
    className?: string;
    style?: Record<string, string | number | undefined>,
}

```

## RGWatermarkProps

The <RGWatermark /> component is now deprecated. It is recommended to use a custom background component to achieve watermark effects, as custom background components can provide more flexible watermark effects.

```typescript
/**
 * @deprecated
 */
export interface RGWatermarkProps {
    forImage?: boolean,
    forDisplay?: boolean,
    position?: RGWidgetPosition,
    width?: string,
    height?: string
}

```

## RGBackgroundProps

The <RGBackground /> component is now deprecated. It is recommended to use a custom background component to achieve watermark effects, as custom background components can provide more flexible background effects.

```typescript
/**
 * @deprecated
 */
export interface RGBackgroundProps {
    forImage?: boolean,
    forDisplay?: boolean,
}

```

## RGLineTextPosition

```typescript
/**
 * @inner
 */
export type RGLineTextPosition = {
    x: number;
    y: number;
    rotate: number;
};

```

## RGGenerateLineConfig

Configuration parameter type passed in when generating line path and rendering information

```typescript
/**
 * @param line The line object or fake line object
 * @param from The starting object of the line
 * @param to The ending object of the line
 * @param totalLinesBetweenNodes Total number of lines between the two nodes (including this line)
 * @param currentLineIndex The index of the current line among the lines between the two nodes (starting from 0)
 * @param defaultOptions Global default configuration options for rendering lines
 */
export type RGGenerateLineConfig = {
    line: RGLine | RGFakeLine,
    from?: RGLineTarget,
    to?: RGLineTarget,
    totalLinesBetweenNodes?: number,
    currentLineIndex?: number,
    defaultOptions?: any
}

```

## RGFakeLineTargetRender

Callback function type for generating fake line target objects when rendering custom lines.

```typescript
/**
 * English: Callback function type for generating fake line target objects when rendering custom lines
 * @param targetType When the value is 'node', it represents a normal node; 'RGInnerConnectTargetType.NodePoint' represents a connection point inside a node; 'RGInnerConnectTargetType.CanvasPoint' represents a connection point on the canvas. Generally, these built-in node types will be automatically handled, and the node types that can be handled by RGFakeLineTargetRender are all user-defined types.
 * @param targetId The id of the connectable object (e.g., node id, RGConnectTarget's targetId)
 * @param fakeLine The fake line object
 * @returns Returns the corresponding line target object
 *
 */
export type RGFakeLineTargetRender = (targetType: string, targetId: string, fakeLine: RGFakeLine) => RGLineTarget;

```

## RGGenerateLinePrams

```typescript
/**
 * @inner
 */
export type RGGenerateLinePrams = {
    line: RGLine,
    totalLinesBetweenNodes: number,
    currentLineIndex: number,
    lineDirection: 'v' | 'h',
    lineShape: RGLineShape,
    lineRadius: number,
    fromJunctionPoint: RGJunctionPoint,
    toJunctionPoint: RGJunctionPoint,
    fx: number,
    fy: number,
    fcx: number,
    fcy: number,
    f_W: number,
    f_H: number,
    tx: number,
    ty: number,
    tcx: number,
    tcy: number,
    t_W: number,
    t_H: number
}

```

## RGLinePathInfo

Line path information generated by relation-graph

```typescript
/**
 * @param pathData SVG Path data of the line
 * @param pathCommands Command point information of the line path
 * @param textPosition Position and rotation information of the line text
 * @param points Array of key point coordinates on the line path
 * @param startDirection Line start direction (only valid for certain line shapes)
 * @param endDirection Line end direction (only valid for certain line shapes)
 */
export type RGLinePathInfo = {
    pathData: string;
    pathCommands: RGLinePathCommands;
    textPosition: RGLineTextPosition,
    points: RGCoordinate[],
    startDirection?: RGDirection,
    endDirection?: RGDirection,
};

```

## CalcNode

```typescript
/**
 * @inner
 */
export type CalcNode = {
    rgNode: RGNode;
    x: number;
    y: number;
    width: number;
    height: number;
};

```

## WriteableData

```typescript
/**
 * @inner
 */
export type WriteableData<T> = {
    set(this: void, value: T): void;
}

```

## ReactiveDataStores

```typescript
/**
 * @inner
 */
export type ReactiveDataStores = {
    store4Options: WriteableData<RGOptionsFull>,
    store4ShouldRenderNodes: WriteableData<RGNode[]>,
    store4ShouldRenderLines: WriteableData<RGLine[]>,
    store4ShouldRenderFakeLines: WriteableData<RGFakeLine[]>,
    optionsRef?: any, // Store Vue reactive data
    shouldRenderNodesRef?: any, // Store Vue reactive data
    shouldRenderLinesRef?: any, // Store Vue reactive data
    shouldRenderFakeLinesRef?: any // Store Vue reactive data
}

```

## ReactiveDataUpdaters

```typescript
/**
 * @inner
 */
export type ReactiveDataUpdaters = {
    updateStore4Options: (newValue: RGOptionsFull) => void,
    updateStore4ShouldRenderNodes: (newValue: RGNode[]) => void,
    updateStore4ShouldRenderLines: (newValue: RGLine[]) => void,
    updateStore4FakeLines: (newValue: RGFakeLine[]) => void,
}

```

## RGCreatingLine

Reactive data object returned by hooks provided by the relation-graph component:

* information about the line being created (the line being dragged into the canvas)

```typescript
/**
 * @param creating Whether a line is being created
 * @param fromTarget The starting target of the line being created
 * @param toTarget The ending target of the line being created
 * @param lineJson The JsonLine information of the line being created
 */
export type RGCreatingLine = {
    creating: true,
    fromTarget?: RGLineTarget,
    toTarget?: RGLineTarget,
    lineJson?: JsonLine
} | {
    creating: false
}

```

## RGCreatingNode

Reactive data object returned by hooks provided by the relation-graph component:

* information about the node being created (the node being dragged into the canvas)

```typescript
/**
 * @param creating Whether a node is being created
 * @param nodeJson The JsonNode information of the node being created
 */
export type RGCreatingNode = {
    creating: true,
    nodeJson?: JsonNode
} | {
    creating: false
}

```

## RGEditingNodes

Reactive data object returned by hooks provided by the relation-graph component:

* information about the nodes being edited

```typescript
/**
 * @param show Whether nodes are currently being edited. If there are nodes being edited, it is true; otherwise, it is false. When true, the <RGEditingNodeController /> component will be displayed.
 * @param nodes The array of nodes being edited
 * @param x The X position of the editing box
 * @param y The Y position of the editing box
 * @param width The width of the editing box
 * @param height The height of the editing box
 */
export type RGEditingNodes = {
    show: boolean,
    nodes: RGNode[],
    x: number,
    y: number,
    width: number,
    height: number
}

```

## RGConnectingNode

Reactive data object returned by hooks provided by the relation-graph component:

* Information about the node being connected when creating a line

```typescript
/**
 * @param x The X position of the connecting box
 * @param y The Y position of the connecting box
 * @param width The width of the connecting box
 * @param height The height of the connecting box
 */
export type RGConnectingNode = {
    show: boolean,
    node: RGNode | RGLineTarget | RGRectTarget,
    x: number,
    y: number,
    width: number,
    height: number
}

```

## RGEditingLine

Reactive data object returned by hooks provided by the relation-graph component:

* Information about the line being edited

```typescript
/**
 * @param show Whether a line is currently being edited. If there is a line being edited, it is true; otherwise, it is false. When true, the <RGEditingLineController /> component will be displayed.
 * @param line The line being edited
 * @param startPoint The starting point of the line being edited
 * @param endPoint The ending point of the line being edited
 */
export type RGEditingLine = {
    show: boolean,
    line: RGLine | null,
    startPoint: RGPosition,
    endPoint: RGPosition,
    text: {
        show: boolean,
        x: number,
        y: number,
        width: number,
        height: number
    },
    ctrlPoints: RGPosition[],
    selectedLines: string[],
    line44Splits: RGCtrlPointForLine44[],
    line49Points: RGPosition[],
    ctrlPoint1: RGPosition,
    ctrlPoint2: RGPosition,
    toolbar: RGPosition
}

```

## RGViewInformation

Reactive data object returned by hooks provided by the relation-graph component:

* Current view information

```typescript
/**
 * @param viewSize The size of the view area
 * @param fullscreen Whether it is in fullscreen mode
 * @param canvasSize The size of the canvas
 * @param canvasZoom The zoom level of the canvas
 * @param canvasOffset The offset position of the canvas
 */
export type RGViewInformation = {
    viewSize: { width: number; height: number },
    fullscreen: boolean,
    canvasSize: { width: number; height: number },
    canvasZoom: number,
    canvasOffset: { x: number; y: number },
    showEasyView?: boolean,
}

```

## RGCheckedItem

Reactive data object returned by hooks provided by the relation-graph component:

* Information about the currently selected node or lines

```typescript
/**
 * @param checkedLineId The ID of the selected line
 * @param checkedNodeId The ID of the selected node
 * @param draggingNodeId The ID of the node being dragged
 */
export type RGCheckedItem = {
    checkedLineId?: string;
    checkedNodeId?: string;
    draggingNodeId?: string;
}

```

## RGEventNames

Enumeration of all event names supported by relation-graph

```typescript
export enum RGEventNames {
    onReady = 'onReady',
    onNodeClick = 'onNodeClick',
    onNodeExpand = 'onNodeExpand',
    onNodeCollapse = 'onNodeCollapse',
    onLineClick = 'onLineClick',
    onNodeDragStart = 'onNodeDragStart',
    onNodeDragEnd = 'onNodeDragEnd',
    onNodeDragging = 'onNodeDragging',
    onCanvasDragEnd = 'onCanvasDragEnd',
    onCanvasDragging = 'onCanvasDragging',
    onContextmenu = 'onContextmenu',
    onFullscreen = 'onFullscreen',
    onCanvasClick = 'onCanvasClick',
    onCanvasSelectionEnd = 'onCanvasSelectionEnd',
    beforeZoomStart = 'beforeZoomStart',
    onZoomEnd = 'onZoomEnd',
    onViewResize = 'onViewResize',
    onResizeStart = 'onResizeStart',
    beforeNodeResize = 'beforeNodeResize',
    onResizeEnd = 'onResizeEnd',
    onLineVertexDropped = 'onLineVertexDropped',
    beforeCreateLine = 'beforeCreateLine',
    onLineBeCreated = 'onLineBeCreated',
    beforeAddNodes = 'beforeAddNodes',
    beforeAddLines = 'beforeAddLines',
    onKeyboardDown = 'onKeyboardDown',
    onKeyboardUp = 'onKeyboardUp',
    onCanvasDragStart = 'onCanvasDragStart',
    onForceLayoutFinish = 'onForceLayoutFinish',
    beforeScrollStart = 'beforeScrollStart'
}

```

