/**
 * relation-graph
 * Website: http://www.relation-graph.com/
 * Github: https://github.com/relation-graph/relation-graph
 */

/**
 * Data types used by relation-graph
 * This document will define and introduce the core data types used by the relation-graph component.
 */

import {RelationGraphCore} from './relation-graph-models/models/RelationGraphCore';
import {RGLinePathCommands} from "./relation-graph-models/utils/line/RGLinePath";
import {RGNetworkAnalyzer} from "./relation-graph-models/RGObjectsForExport";



/**
 * Relation-graph instance type, the instance object can provide methods for manipulating the graph, such as adding nodes, deleting nodes, updating node properties, etc.
 * @example:
 * ```ts
 * graphInstance.addNodes([
 *      {id: 'a', text: 'Node A', x: 100, y: 100},
 *      {id: 'b', text: 'Node B', x: 200, y: 200, color: '#ff0000'},
 * ]);
 * graphInstance.removeNodeById('a');
 * graphInstance.updateNode('b', {text: 'Updated Node B', color: '#00ff00'});
 * ```
 */
export type RelationGraphInstance = RelationGraphCore;

/**
 * Internal connect target types for relation-graph
 */
export enum RGInnerConnectTargetType {
    Node = 'node',
    NodePoint = 'NodePoint',
    HTMLElementId = 'HTMLElementId',
    CanvasPoint = 'CanvasPoint',
    ViewPoint = 'ViewPoint'
}

/**
 * Junction points for connecting lines to nodes
 * You can set the fromJunctionPoint and toJunctionPoint properties of the line to use it:
 * @example
 * ```ts
 * import {RGJunctionPoint} from 'relation-graph-react';
 * const line = {
 *   from: 'node1',
 *   to: 'node2',
 *   fromJunctionPoint: RGJunctionPoint.left, // Set the junction point on the 'from' node
 *   toJunctionPoint: RGJunctionPoint.right // Set the junction point on the 'to' node
 * };
 * ```
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

/**
 * Data type used internally by relation-graph to manage connection points
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
/**
 * DOM rendering mode for <RGConnectTarget />
 */
export type RGConnectTargetDomMode = 'wrap' | 'contents';
/**
 * Registration options used internally by relation-graph to manage connect targets
 * @inner
 */
export type RGRegisterConnectTargetOptions = {
    hostEl: Element;
    targetId: string;
    targetType: string;
    junctionPoint?: RGJunctionPoint;
    targetData?: Record<string, any>;
    triggerEl?: Element;
    measureEl?: Element;
    domMode?: RGConnectTargetDomMode;
    measureSelector?: string;
    strictMeasureTarget?: boolean;
};
/**
 * Resize handle positions for relation-graph
 * @inner
 */
export type RGResizeHandlePosition = 't' | 'r' | 'b' | 'l' | 'tl' | 'tr' | 'bl' | 'br';
/**
 * Used to specify the position for relation-graph widgets (such as toolbars, zoom controls, etc.)
 * @example
 * ```ts
 * import { RGSlotOnView, RGEditingNodeController, RGEditingNearNodeWidget } from 'relation-graph-react';
 * <RGSlotOnView>
 *     <RGEditingNodeController> // Used to wrap the node editing area controller, it identifies one or more nodes currently being edited
 *          <RGEditingNearNodeWidget position="top"> // Used to display custom widgets near the node editing area, here it is placed above the node
 *              <button>Custom Top Widget</button> // This is a custom button that will be displayed above the node
 *          </RGEditingNearNodeWidget>
 *     </RGEditingNodeController>
 * </RGSlotOnView>
 * ```
 *
 */
export type RGWidgetPosition = 'top' | 'right' | 'bottom' | 'left' | 'tl' | 'tr' | 'bl' | 'br';
/**
 * @inner
 */
export type RGLineEditPoint = 'start' | 'end';

/**
 * Node shapes supported by default in relation-graph, which affect the connection points of lines to nodes and the rendering of nodes on Canvas 2D (Thumbnails view, EasyView).
 */
export enum RGNodeShape {
    circle = 0,
    rect = 1
}

/**
 * Line shapes for relation-graph
 * You can set the lineShape property of the line to use it:
 * @example
 * ```ts
 * import {RGLineShape} from 'relation-graph-react';
 * const line = {
 *   from: 'node1',
 *   to: 'node2',
 *   lineShape: RGLineShape.StandardCurve // Set the line shape to StandardCurve
 *   };
 * ```
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

/**
 * The type of target object that triggered the event. For example, in a right-click event (onContextmenu), relation-graph will tell you on which type of object the right-click event was triggered.
 * 'canvas' means the event was triggered on the canvas, 'node' means it was triggered on a node, and 'line' means it was triggered on a line.
 */
export type RGEventTargetType = 'canvas' | 'node' | 'line';

/**
 * Direction enum used in internal logic processing of relation-graph
 */
export enum RGDirection {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
}

/**
 * User event type for relation-graph, can be MouseEvent or TouchEvent
 */
export type RGUserEvent = MouseEvent | TouchEvent;
/**
 * Rectangle target type for nodes in relation-graph
 */
export type RGRectTarget = {
    x: number;
    y: number;
    nodeShape: RGNodeShape;
    el_W: number;
    el_H: number;
}
/**
 * Line target type for lines in relation-graph
 */
export type RGLineTarget = RGRectTarget & {
    id?: string // Like node.text
    text?: string; // Like node.text
    targetType: RGInnerConnectTargetType | string
    junctionPoint?: RGJunctionPoint
    targetData?: Record<string, any>
    hidden?: boolean
};
/**
 * JSON node type for relation-graph
 * @example
 * ```ts
 * import {JsonNode} from 'relation-graph-react';
 * const node: JsonNode = {
 *   id: 'node1',
 *   text: 'Node 1',
 *   type: 'customNodeType',
 *   x: 100,
 *   y: 100,
 *   color: '#ff0000',
 *   nodeShape: RGNodeShape.rect,
 *   width: 120,
 *   height: 60,
 *   data: {
 *      customProperty: 'customValue'
 *   }
 * };
 *   ```
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
/**
 * Enhanced node type for runtime in relation-graph, it includes additional properties needed for runtime such as whether to render, calculated visibility, layout information, etc.
 */
export type RGNode = Omit<JsonNode, 'children'> & RGRectTarget & {
    type: string
    x: number
    y: number
    nodeShape: RGNodeShape
    data: Record<string, any>
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
    rgChildrenSize: number
    rgShouldRender: boolean
    rgCalcedVisibility: boolean
}
/**
 * JSON line type for relation-graph
 * @example
 * ```ts
 * import {JsonLine, RGLineShape} from 'relation-graph-react';
 * const line: JsonLine = {
 *   id: 'line1',
 *   from: 'node1',
 *   to: 'node2',
 *   text: 'Line from Node 1 to Node 2',
 *   type: 'customLineType',
 *   color: '#0000ff',
 *   lineShape: RGLineShape.StandardCurve,
 *   data: {
 *   customProperty: 'customValue'
 *   }
 * };
 * ```
 */
export type JsonLine = {
    id: string
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
    placeText?: 'start'|'center'|'end'
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
/**
 * RGFakeLine can use non-node objects as the start or end points of fake nodes, enabling more complex line connection requirements
 * The difference between RGFakeLine and RGLine is that the from and to properties of RGLine must be node IDs, while RGFakeLine is not restricted, but RGFakeLine does not produce any layout effects
 * By setting fromType and toType to identify the start and end types of the fake line
 * The default supported types are those in the RGInnerConnectTargetType enum. You can also define custom types by using the graphInstance.setFakeLineTargetRender method to specify how to obtain the RGRectTarget information for the custom type.
 */
export type RGFakeLine = JsonLine & {
    id: string;
    fromType: RGInnerConnectTargetType | string;
    toType: RGInnerConnectTargetType | string;
}
/**
 * Enhanced line type for runtime in relation-graph
 * isReverse: indicates whether the line direction is reversed, which is automatically calculated based on the from and to nodes and does not need to be set manually.
 */
export type RGLine = JsonLine & {
    id: string;
    isReverse?: boolean // 自动计算，无需设置
}
/**
 * The runtime derived object type of the line, which can associate the line with its start and end nodes, and contains some additional properties for rendering and visibility calculation
 * You can get the RGLink object through the graphInstance.getLinks() method, or get the RGLink object corresponding to the specified line through the graphInstance.getLinkByLineId(lineId: string) method
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
/**
 * @deprecated Use RGLink instead
 */
export type RGElementLine = RGLink;
/**
 *  RGJsonData is a JSON data format for quickly setting graph data. Through it, you can quickly import data using the graphInstance.setJsonData method.
 * It is a shortcut method, equivalent to the following code:
 * ```ts
 * const jsonData = {
 *  rootId: 'rootNodeId',
 *  nodes: [...],
 *  lines: [...]
 * };
 * graphInstance.addNodes(jsonData.nodes);
 * graphInstance.addLines(jsonData.lines);
 * graphInstance.setRootNodeId(jsonData.rootId);
 *   ```
 */
export type RGJsonData = {
    rootId?: string
    nodes: JsonNode[]
    lines: JsonLine[]
    fakeLines?: JsonLine[]
};
/**
 * RGGraphData is the internal data structure used by relation-graph to manage graph data
 */
export type RGGraphData = {
    rootNode?: RGNode,
    nodes: RGNode[],
    normalLines: RGLine[],
    fakeLines: RGFakeLine[]
};
/**
 * Coordinate type for relation-graph
 */
export type RGCoordinate = {
    x: number;
    y: number;
};
/**
 * Rectangle box type for counting node areas
 * For example, you can get the rectangular area occupied by the specified nodes through the following code:
 * ```ts
 * const nodesBoxInfo: RGNodesRectBox = graphInstance.getNodesRectBox(someNodes);
 * ```
 */
export type RGNodesRectBox = {
    width: number;
    height: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
/**
 * Position type for relation-graph
 * Generally used to save position coordinates
 */
export type RGPosition = RGCoordinate;
/**
 * Drag callback type used in internal logic processing of relation-graph
 * @inner
 */
export type RGDraggingCallback = (
    offsetX: number,
    offsetY: number,
    startElPosition: { x: number; y: number },
    startEventPosition: { x: number; y: number },
    event: MouseEvent | TouchEvent
) => void;
/**
 * Drag end callback type used in internal logic processing of relation-graph
 * @inner
 */
export type RGDraggedCallback = (
    buffX: number,
    buffY: number,
    event: MouseEvent | TouchEvent
) => void;
/**
 * Layout options fragment: node alignment settings
 * - alignItemsX: The coordinate assigned to the node is based on which position of the node, 'start' means left-aligned, 'center' means center-aligned, and 'end' means right-aligned
 * - alignItemsY: The coordinate assigned to the node is based on which position of the node, 'start' means top-aligned, 'center' means center-aligned, and 'end' means bottom-aligned
 */
export type RGLayoutOptions4Alignment = {
    alignItemsX?: 'start' | 'center' | 'end';
    alignItemsY?: 'start' | 'center' | 'end';
};
/**
 * Layout core options type
 * - layoutName: Layout algorithm name such as 'force', 'center', 'tree', etc.
 * - layoutDirection: Layout direction, 'h' means horizontal layout, 'v' means vertical layout
 * - fixedRootNode: By default, the root node is fixed at the center of the canvas (coordinates: 0,0). If set to true, the root node position will not be fixed, and the layout engine will assign relative positions to other nodes based on the current coordinates of the root node.
 * - autoLayouting: Used to get whether the layout engine is currently performing automatic layout calculations (applicable to force-directed layouts and center layouts that inherit from force-directed layouts). This property does not need to be set and is read-only.
 * - supportAutoLayout: Whether to support automatic layout. Generally, force-directed layouts and center layouts that inherit from force-directed layouts support automatic layout, while other layouts do not support automatic layout. This property does not need to be set and is read-only.
 */
export type RGLayoutOptionsCore = RGLayoutOptions4Alignment & {
    layoutName: string;
    layoutDirection?: 'h' | 'v';
    fixedRootNode?: boolean;
    autoLayouting?: boolean;
    supportAutoLayout?: boolean;
    rotate?: number;
};
/**
 * Force-directed layout options type
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
/**
 * Center layout options type
 * - distanceCoefficient: Coefficient for calculating the ideal distance between nodes, default is 1. The larger this value, the greater the ideal distance between nodes, and the more dispersed the layout will be.
 * - disableAsForceLayout: CenterLayout extends ForceLayout. If you want to use CenterLayout as a pure center layout without force-directed layout capabilities, you can set this option to true to disable the force-directed layout features.
 * - levelGaps: Array of distances between levels, default is []. You can set the distance between different levels of nodes in the tree structure. For example, [100, 200, 300] means the distance between level 0 and level 1 is 100, the distance between level 1 and level 2 is 200, and the distance between level 2 and level 3 is 300. If the array length is less than the number of levels, the last value will be used for the remaining levels.
 */
export type RGCenterLayoutOptions = RGForceLayoutOptions & {
    distanceCoefficient?: number
    levelGaps?: number[]
    disableAsForceLayout?: boolean;
};
/**
 * Tree layout options type
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
    from?: 'left'|'top'|'right'|'bottom'
    treeNodeGapH?: number
    treeNodeGapV?: number
    levelGaps?: number[]
    layoutExpansionDirection?: 'start' | 'center' | 'end'
    simpleTree?: boolean;
    ignoreNodeSize?: boolean;
    alignParentItemsX?: 'start' | 'center' | 'end';
    alignParentItemsY?: 'start' | 'center' | 'end';
};
/**
 * Layout options type for relation-graph
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
export type RGLayoutOptions =
    (RGCenterLayoutOptions & { layoutName: 'center' })
    | (RGForceLayoutOptions & { layoutName: 'force' })
    | (RGTreeLayoutOptions & { layoutName: 'tree' })
    | (RGLayoutOptionsCore & { layoutName: 'circle' })
    | (RGLayoutOptionsCore & { layoutName: 'fixed' })
    | (RGTreeLayoutOptions & { layoutName: 'smart-tree' })
    | (RGTreeLayoutOptions & { layoutName: 'io-tree' })
    | (RGTreeLayoutOptions & { layoutName: 'folder' })

/**
 * Layout engine interface type for relation-graph internal use
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

/**
 * Complete configuration type that includes all options available for users to configure
 */
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
    toolBarDirection: 'h'|'v'
    toolBarPositionH: 'left'|'center'|'right'
    toolBarPositionV: 'top'|'center'|'bottom'
    defaultExpandHolderPosition: 'hide' | 'left' | 'top' | 'right' | 'bottom'
    defaultNodeColor: string
    defaultNodeBorderColor: string,
    defaultNodeBorderWidth: number,
    defaultNodeBorderRadius: number,
    defaultNodeShape: RGNodeShape,
    defaultNodeWidth?: number
    defaultNodeHeight?: number
    checkedItemBackgroundColor?: string //
    defaultLineTextOffsetX?: number,
    defaultLineTextOffsetY?: number,
    defaultLineColor: string
    defaultLineWidth: number
    defaultLineShape?: RGLineShape
    // defaultShowLineLabel: boolean
    // hideNodeContentByZoom: boolean
    defaultJunctionPoint?: RGJunctionPoint
    defaultLineJunctionOffset: number,
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
/**
 * Complete configuration type that includes all runtime state options, none of which can be directly configured by users
 */
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
/**
 * Partial configuration type for relation-graph, users can configure any subset of options
 */
export type RGOptions = Partial<RGOptionsInited>;
/**
 * When the user performs a selection operation on the canvas (event: onCanvasSelectionEnd), the type of selection view information passed
 */
export type RGSelectionView = {
    x: number
    y: number
    width: number
    height: number
};

/**
 * Event handler type for relation-graph events
 * @inner
 */
export type RGEventHandler = (eventName: RGEventNames, ...args: any[]) => void | any;
/**
 * Event emit hook type for relation-graph events
 * @inner
 */
export type RGEventEmitHook = (eventName: RGEventNames, ...args: any[]) => void | any;
/**
 * Control point type for RGLineShape.Line44 lines
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

/**
 * The exposed interface type of the relation-graph component instance
 * @inner
 */
export interface RelationGraphExpose {
    getInstance(): RelationGraphInstance;
}

/**
 * Props type for RGNodeSlot component
 */
export interface RGNodeSlotProps {
    node: RGNode
    defaultExpandHolderPosition?: string
    dragging?: boolean
    checked?: boolean
}

/**
 * Props type for RGLineSlot component
 * @inner
 */
export interface RGLinePeelProps {
    line: RGLine | RGFakeLine
    checked?: boolean
    defaultLineTextOnPath?: boolean
    graphInstanceId?: string
}

/**
 * Custom line slot component Props type
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

/**
 * Props type for RGLinePath component
 * @param lineConfig Configuration parameters for the line, which include information such as the start and end objects, line objects, etc., used for line objects, and global default configurations for rendering lines.
 * @param linePathInfo The path information of the line, including path data, text position, etc., used for rendering the line path
 * @param defaultLineTextOnPath Whether the line uses textPath to typeset text, allowing the text to be arranged along the line path
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

/**
 * Props type for RGLineText component
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

/**
 * Props type for <RelationGraph /> component
 * @param options Configuration options for relation-graph
 * @param relationGraphCore The core class of relation-graph, default is RelationGraphCore
 */
export type RelationGraphProps = RGListeners & {
    options: RGOptions;
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
};

/**
 * Positioning props for <RGToolBar /> components
 * @param direction 'v' means vertical toolbar, 'h' means horizontal toolbar
 * @param positionH 'left' means left-aligned, 'center' means center-aligned, 'right' means right-aligned
 * @param positionV 'top' means top-aligned, 'center' means center-aligned, 'bottom' means bottom-aligned
 */
export interface RGToolBarProps {
    direction?: 'v' | 'h' | string,
    positionH?: 'left' | 'center' | 'right' | string,
    positionV?: 'top' | 'center' | 'bottom' | string,
}

/**
 * Positioning props for <RGMiniView /> components
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

/**
 * Positioning props for <RGEditingNearNodeWidget /> components
 * @param position Position of the widget: 'tl' | 'tr' | 'bl' | 'br' | 'top' | 'right' | 'bottom' | 'left'
 */
export interface RGWidgetProps {
    position?: RGWidgetPosition
}

/**
 * Props type for RGEditingLineController component
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

/**
 * @inner
 */
export type RGLineConnectEventHandler = (fromNode: RGNode | RGLineTarget | RGPosition, toNode: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine) => void;
/**
 * @inner
 */
export type RGLineVertexBeDroppedEventHandler = (fromNode: RGNode | RGLineTarget | RGPosition, toNode: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine) => void;
export type JsonNodeLike = Partial<JsonNode>;
export type JsonLineLike = Partial<JsonLine>;
export type JsonNodeTemplate = JsonNodeLike;
export type JsonLineTemplate = JsonLineLike;

/**
 * @inner
 */
export type CreatingLinePlotOptions = {
    onCreateLine: RGLineConnectEventHandler | undefined
    isReverse?: boolean,
    template?: JsonLineLike
    fromNode?: RGNode | RGLineTarget
};
/**
 * @inner
 */
export type CreatingNodePlotOptions = {
    templateNode: JsonNodeLike
    templateMove?: (x: number, y: number) => void
    onCreateNode: (x: number, y: number, nodeTemplate?: JsonNodeLike) => void
};

/**
 * Props type for <RGConnectSource> component
 * The RGConnectSource component allows any element to have the functionality of a connection starting point.
 * @param lineTemplate The template information for the connection line, which can be partial properties of JsonLine
 * @param onConnectStart Callback function triggered when starting to initiate a connection line
 * @param onConnectEnd Callback function triggered when the connection line initiation ends
 * @param className Custom class name for the component
 * @param style Custom styles for the component
 * @example
 * ```tsx
 * import {RGLineShape} from 'relation-graph-react';
 *
 * <RGConnectSource
 *   :lineTemplate="{ color: 'red', lineShape: RGLineShape.StandardCurve }"
 *   :onConnectEnd="(fromNode, toNode, newLineJson) => {
 *     console.log('Connection ended:', fromNode, toNode, newLineJson);
 *     // You can add the new line to the graph here
 *     graphInstance.addLines([newLineJson]);
 *   }"
 * >
 *   <div class="my-connect-source">
 *     Drag from here to connect
 *   </div>
 * </RGConnectSource>
 * ```
 */
export interface RGConnectSourceProps {
    lineTemplate: JsonLineLike;
    onConnectStart?: (newLineTemplate?: JsonLineLike, event?: RGUserEvent) => void;
    onConnectEnd?: RGLineConnectEventHandler; // default is true
    className?: string;
    style?: Record<string, string | number | undefined>,
}

/**
 * Component <RGConnectTarget> Props type
 * The RGConnectTarget component allows any element to have the functionality of a connection endpoint. Unlike RGConnectSource, RGConnectTarget can not only be dragged to start creating a line, but also be used as a connection point for lines.
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
 * ```tsx
 * import {RGJunctionPoint, RGLineShape} from 'relation-graph-react';
 *
 * <RGConnectTarget
 *   :junctionPoint="RGJunctionPoint.Bottom"
 *   targetId="my-target-1"
 *   :targetData="{ info: 'additional data' }"
 *   :lineTemplate="{ color: '#ff0000', lineShape: RGLineShape.StandardStraight, data: { info: 'additional data' } }"
 * >
 *   <div class="my-connect-target">
 *     Drop line here or drag from here to connect
 *   </div>
 * </RGConnectTarget>
 * ```
 */
export interface RGConnectTargetProps {
    junctionPoint?: RGJunctionPoint;
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
    forSvg?: boolean;
    style?: Record<string, string | number | undefined>,
    domMode?: RGConnectTargetDomMode;
    measureSelector?: string;
    strictMeasureTarget?: boolean;
}

/**
 * The <RGWatermark /> component is now deprecated. It is recommended to use a custom background component to achieve watermark effects, as custom background components can provide more flexible watermark effects.
 * @deprecated
 */
export interface RGWatermarkProps {
    forImage?: boolean,
    forDisplay?: boolean,
    position?: RGWidgetPosition,
    width?: string,
    height?: string
}

/**
 * The <RGBackground /> component is now deprecated. It is recommended to use a custom background component to achieve watermark effects, as custom background components can provide more flexible background effects.
 * @deprecated
 */
export interface RGBackgroundProps {
    forImage?: boolean,
    forDisplay?: boolean,
}

/**
 * @inner
 */
export type RGLineTextPosition = {
    x: number;
    y: number;
    rotate: number;
};
/**
 * Configuration parameter type passed in when generating line path and rendering information
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
/**
 * English: Callback function type for generating fake line target objects when rendering custom lines
 * @param targetType When the value is 'node', it represents a normal node; 'RGInnerConnectTargetType.NodePoint' represents a connection point inside a node; 'RGInnerConnectTargetType.CanvasPoint' represents a connection point on the canvas. Generally, these built-in node types will be automatically handled, and the node types that can be handled by RGFakeLineTargetRender are all user-defined types.
 * @param targetId The id of the connectable object (e.g., node id, RGConnectTarget's targetId)
 * @param fakeLine The fake line object
 * @returns Returns the corresponding line target object
 *
 */
export type RGFakeLineTargetRender = (targetType: string, targetId: string, fakeLine: RGFakeLine) => RGLineTarget;
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
/**
 * Line path information generated by relation-graph
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
/**
 * @inner
 */
export type WriteableData<T> = {
    set(this: void, value: T): void;
    // value(): T;
    // /**
    //  * Update value using callback and inform subscribers.
    //  * @param updater callback
    //  */
    // update(this: void, updater: (v: T) => T): void;
}
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
    shouldRenderFakeLinesRef?: any, // Store Vue reactive data
    textContainer4NormalRef?:any,
    textContainer4FakeLineRef?:any
}
/**
 * @inner
 */
export type ReactiveDataUpdaters = {
    updateStore4Options: (newValue: RGOptionsFull) => void,
    updateStore4ShouldRenderNodes: (newValue: RGNode[]) => void,
    updateStore4ShouldRenderLines: (newValue: RGLine[]) => void,
    updateStore4FakeLines: (newValue: RGFakeLine[]) => void,
}
/**
 * Reactive data object returned by hooks provided by the relation-graph component:
 * - information about the line being created (the line being dragged into the canvas)
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

/**
 * Reactive data object returned by hooks provided by the relation-graph component:
 * - information about the node being created (the node being dragged into the canvas)
 * @param creating Whether a node is being created
 * @param nodeJson The JsonNode information of the node being created
 */
export type RGCreatingNode = {
    creating: true,
    nodeJson?: JsonNode
} | {
    creating: false
}
/**
 * Reactive data object returned by hooks provided by the relation-graph component:
 * - information about the nodes being edited
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
/**
 * Reactive data object returned by hooks provided by the relation-graph component:
 * - Information about the node being connected when creating a line
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
/**
 * Reactive data object returned by hooks provided by the relation-graph component:
 * - Information about the line being edited
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
/**
 * Reactive data object returned by hooks provided by the relation-graph component:
 * - Current view information
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
/**
 * Reactive data object returned by hooks provided by the relation-graph component:
 * - Information about the currently selected node or lines
 * @param checkedLineId The ID of the selected line
 * @param checkedNodeId The ID of the selected node
 * @param draggingNodeId The ID of the node being dragged
 */
export type RGCheckedItem = {
    checkedLineId?: string;
    checkedNodeId?: string;
    draggingNodeId?: string;
}

/**
 * Enumeration of all event names supported by relation-graph
 */
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
/**
 * All event listener types supported by the relation-graph component
 */
export interface RGListeners {
    /**
     * When the graph is ready, this event is triggered
     * @param graphInstance The relation-graph instance object
     */
    onReady?: (graphInstance: RelationGraphInstance) => void;
    /**
     * Triggered when a node is clicked
     */
    onNodeClick?: (node: RGNode, e: RGUserEvent) => boolean | void | Promise<boolean | void>;
    /**
     * Triggered when a node is expanded
     */
    onNodeExpand?: (node: RGNode, e: RGUserEvent) => boolean | void | Promise<boolean | void>;
    /**
     * Triggered when a node is collapsed
     */
    onNodeCollapse?: (node: RGNode, e: RGUserEvent) => boolean | void | Promise<boolean | void>;
    /**
     * Triggered when a line is clicked, line is the line, link is the RGLink object corresponding to the line
     */
    onLineClick?: (line: RGLine, link: RGLink, e: RGUserEvent) => boolean | void | Promise<boolean | void>;
    /**
     * Triggered when a node drag starts
     * @param node The dragged node
     */
    onNodeDragStart?: (node: RGNode, e: RGUserEvent) => void;
    /**
     * Triggered when a node drag ends
     * @param node The dragged node
     * @param e The event that triggered the drag end
     * @param x_buff The x offset at the end of the drag
     * @param y_buff The y offset at the end of the drag
     *
     */
    onNodeDragEnd?: (node: RGNode, e: RGUserEvent, x_buff: number, y_buff: number) => void;
    /**
     * Triggered when a node is being dragged
     * @param node The dragged node
     * @param newX The new X position of the node
     * @param newY The new Y position of the node
     * @param buffX The X offset of the node from the start of the drag to the current position
     * @param buffY The Y offset of the node from the start of the drag to the current position
     * @return Can return void, or can return an RGPosition object, indicating that the x and y in the returned RGPosition object are used as the new position of the node
     */
    onNodeDragging?: (node: RGNode, newX: number, newY: number, buffX: number, buffY: number, e: RGUserEvent) => void | RGPosition | undefined;
    /**
     * Triggered when the canvas drag ends
     */
    onCanvasDragEnd?: (e: RGUserEvent) => void;
    /**
     * Triggered when the canvas is being dragged
     * @param newX The new offset X of the canvas
     * @param newY The new offset Y of the canvas
     * @param buffX The X offset of the canvas from the start of the drag to the current position
     * @param buffY The Y offset of the canvas from the start of the drag to the current position
     * @return Can return void, or can return an RGPosition object, indicating that the x and y in the returned RGPosition object are used as the new offset position of the canvas
     */
    onCanvasDragging?: (newX: number, newY: number, buffX: number, buffY: number) => void | RGPosition | undefined;
    /**
     * Triggered when the canvas is right-clicked
     * @param e The event that triggered
     * @param objectType The type of object, which can be 'canvas', 'node', or 'line'
     * @param object The clicked object, which can be undefined, RGNode, or RGLine
     * @param eventPositionOnCanvas The coordinates of the event on the canvas
     * @param eventPositionOnView The coordinates of the event on the view (relative to the top-left corner of the <RelationGraph> component)
     */
    onContextmenu?: (e: RGUserEvent, objectType: RGEventTargetType, object: RGNode | RGLine | undefined, eventPositionOnCanvas: RGCoordinate, eventPositionOnView: RGCoordinate) => void;
    /**
     *  Triggered when the fullscreen state changes
     *  @param newValue The new fullscreen state
     *  @param defaultFullscreen The function to perform the default fullscreen toggle operation
     */
    onFullscreen?: (newValue: boolean, defaultFullscreen: () => Promise<void>) => void;
    /**
     * Triggered when the canvas is clicked
     * - This event will not be triggered when clicking on nodes or lines
     */
    onCanvasClick?: (e: RGUserEvent) => void;
    /**
     * Triggered when the canvas selection ends
     * @param selectionView The area information of the canvas selection, including x, y, width, height
     */
    onCanvasSelectionEnd?: (selectionView: RGSelectionView, e: RGUserEvent) => void;
    /**
     * Triggered before zooming starts
     * @return Returning false can prevent the zoom operation
     */
    beforeZoomStart?: () => void | false;
    /**
     * Triggered when zooming ends
     */
    onZoomEnd?: () => void;
    /**
     * Triggered when the view size changes
     */
    onViewResize?: () => void;
    /**
     * Triggered when one or more nodes (via RGEditingResize) start being resized
     * @param nodes The array of nodes being resized
     */
    onResizeStart?: (nodes: RGNode[], e: RGUserEvent) => void;
    /**
     * Triggered before resizing a node, returning false can prevent the resize operation
     * @param node The node being resized
     * @param newX The new X position to be resized to
     * @param newY The new Y position to be resized to
     * @param newW The new width to be resized to
     * @param newH The new height to be resized to
     * @return Return false to prevent resizing
     */
    beforeNodeResize?: (node: RGNode, newX: number, newY: number, newW: number, newH: number) => void | false;
    /**
     * Triggered when one or more nodes (via RGEditingResize) finish being resized
     * @param nodes The array of nodes that were resized
     * @param buffX The X offset at the end of the resize
     * @param buffY The Y offset at the end of the resize
     */
    onResizeEnd?: (nodes: RGNode[], buffX: number, buffY: number, e: RGUserEvent) => void;
    /**
     * Triggered when the endpoint (start or end) of a line is dropped
     * @param fromNode The starting node
     * @param toNode The target node
     * @param lineTemplate The line information (JsonLine)
     *
     */
    onLineVertexDropped?: (lineInfo: {
        newLineTemplate: JsonLine,
        fromNode: RGLineTarget | RGNode,
        toNode: RGLineTarget | RGNode
    }) => void;
    /**
     * Triggered after the line creation or modification endpoint is completed, before onLineBeCreated is triggered. You can return false to prevent the creation of the line, or modify the line information.
     * @param fromNode The starting node
     * @param toNode The target node
     * @param lineTemplate The line information (JsonLine)
     *
     */
    beforeCreateLine?: (lineInfo: {
        lineJson: JsonLine,
        fromNode: RGLineTarget | RGNode,
        toNode: RGLineTarget | RGNode
    }) => void | false;
    /**
     * Triggered when a new line is created or the endpoint is modified
     * - Note: The process of modifying the endpoints (start or end) of a line is actually to first delete the line, and then create a new line with the same id (all other attributes of the line will be retained) through the onLineBeCreated event.
     * - Please be sure to add the new line to the graph through the graphInstance.addLines method in the onLineBeCreated event, otherwise the line will not actually be created.
     * @param fromNode The starting node
     * @param toNode The target node
     * @param lineTemplate The line information (JsonLine)
     */
    onLineBeCreated?: (lineInfo: {
        lineJson: JsonLine,
        fromNode: RGLineTarget | RGNode,
        toNode: RGLineTarget | RGNode
    }) => void;
    /**
     * Triggered before new nodes are added (via setJsonData, addNodes methods) to the graph
     * @param nodes The array of jsonNode objects that are about to be added
     */
    beforeAddNodes?: (nodes: JsonNode[]) => void;
    /**
     * Triggered before new lines are added (via setJsonData, addLines methods) to the graph
     * @param lines The array of jsonLine objects that are about to be added
     */
    beforeAddLines?: (lines: JsonLine[]) => void;
    /**
     * Triggered when the keyboard is pressed down in the graph area
     * @param e
     */
    onKeyboardDown?: (e: KeyboardEvent) => void;
    /**
     * Triggered when the keyboard is released in the graph area
     * @param e
     */
    onKeyboardUp?: (e: KeyboardEvent) => void;
    /**
     * Triggered when canvas drag starts
     * @param canvasMoveStartPosition The initial position of the canvas when dragging starts
     * @param eventClientStartPosition The client position of the user event when it starts
     * @param e
     */
    onCanvasDragStart?: (canvasMoveStartPosition: RGPosition, eventClientStartPosition: RGPosition, e: RGUserEvent) => void;
    /**
     * Triggered when the force-directed layout calculation is completed
     */
    onForceLayoutFinish?: () => void;
    /**
     * Triggered before performing canvas move scroll, returning true indicates to prevent the scroll from continuing
     * @param buffX The X offset that is about to be scrolled
     * @param buffY The Y offset that is about to be scrolled
     * @return true = Abort Scroll
     */
    beforeScrollStart?: (buffX: number, buffY: number, e: Event) => true | undefined | void;
}
