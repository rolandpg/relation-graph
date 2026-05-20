import { CreatingLinePlotOptions, CreatingNodePlotOptions, RGLine, RGLineConnectEventHandler, RGLineTarget, RGNode, RGPosition, RGUserEvent, RGCoordinate, JsonLine } from '../../types';
import { RelationGraphWith6Layout } from './RelationGraphWith6Layout';
/**
 *  The relation-graph component UI and graphInstance event bus handle user interaction events.
 *  - Most of the events handled here are user interaction events, while some other events are handled by the following classes:
 *    - Editor-related events are handled in RelationGraphWith91Editing
 *    - MiniView-related events are handled in RelationGraphWith92MiniView
 *
 */
export declare class RelationGraphWith7Event extends RelationGraphWith6Layout {
    constructor();
    protected draggingSelectedNodes(_draggedNode: RGNode, _newX: number, _newY: number, _buff_x: number, _buff_y: number): void;
    private _prevClickNodeTime;
    /**
     * Triggered when the user clicks on a node
     * @param node The clicked node object
     * @param e MouseDown or TouchStart event
     *
     */
    onNodeClick(node: RGNode, e: RGUserEvent): void;
    protected _nodeXYMappingBeforeDrag: {
        [nodeId: string]: {
            x: number;
            y: number;
        };
    };
    /**
     * Triggered when the user starts dragging a node
     * - When the user starts dragging but does not move the node, it is considered as clicking the node, and the onNodeClick event will be triggered instead.
     * @param willMoveNode The node object that will be moved
     * @param e MouseDown or TouchStart event
     */
    onNodeDragStart(willMoveNode: RGNode, e: RGUserEvent): void;
    /**
     * @inner
     * @protected
     */
    protected canvasAutoMoving: (draggingEventXy: RGCoordinate) => boolean;
    private _canvasMovingTimer;
    /**
     * @inner
     * @protected
     */
    private _onNodeDragEnd;
    /**
     * Triggered when the user clicks on a line
     * - Triggered when the user clicks on a line path or line text
     * @param line The clicked line object
     * @param e MouseDown or TouchStart event
     */
    onLineClick(line: RGLine, e: RGUserEvent): void;
    /**
     * Triggered when the node's expand/collapse button is clicked.
     * - This method will expand or collapse all descendant nodes of the node.
     * - If the node is collapsed, it will be expanded; if it is expanded, it will be collapsed.
     * @param node The node object to be expanded or collapsed
     * @param e
     */
    expandOrCollapseNode(node: RGNode, e: RGUserEvent): void;
    /**
     * Expand the specified node
     * - This method will expand the specified node and make its child nodes visible.
     * @param node The node object to be expanded
     * @param e
     */
    expandNode(node: RGNode, e?: RGUserEvent): void;
    /**
     * Collapse the specified node
     * - This method will collapse the specified node and hide its child nodes.
     * @param node The node object to be collapsed
     * @param e
     */
    collapseNode(node: RGNode, e?: RGUserEvent): void;
    private _relayoutTaskTimer;
    /**
     * After the node is expanded or collapsed, the visibility of the related nodes needs to be recalculated, and re-layout may be required.
     * @inner
     * @private
     */
    private _effectWhenExpandedOrCollapsed;
    /**
     * @inner
     * @private
     */
    protected onCanvasDragEnd(e: RGUserEvent): void;
    /**
     * User clicks on the canvas
     * @param e
     */
    onCanvasClick(e: RGUserEvent): void;
    /**
     * @inner
     * @private
     */
    private getNodeAtEvent;
    /**
     * @inner
     * @private
     */
    private onCanvasSelectionEnd;
    /**
     * Start the "creating node" interaction state
     * - You can set the callback function onCreateNode in the setting, and add the node to the graph data through graphInstance.addNodes([newNodeJson]); in the callback function.
     * - You can also set templateMove in the setting to get the move event of the node during placement, so as to achieve complex logic (such as highlighting an existing node when moving to it, and recording the id of this highlighted node, so that in the onCreateNode callback function, you can directly create a new node associated with the highlighted node)
     * @param e
     * @param setting Settings used to set the template information of the node being created, the callback function when the creation is completed, etc.
     */
    startCreatingNodePlot(e: RGUserEvent, setting: CreatingNodePlotOptions): void;
    /**
     * Start the "creating line" interaction state
     * - When the line creation is completed, you need to call graphInstance.addLines([newLineJson]); in the onCreateLine callback function (or through the onLineBeCreated event of the <RelationGraph> component) to add the new line to the graph data.
     * - You can also set fromNode in the setting to specify the starting node of the line.
     * @param e
     * @param setting Settings used to set the template information of the line being created, the callback function when the creation is completed, etc.
     *
     */
    startCreatingLinePlot(e: RGUserEvent, setting: CreatingLinePlotOptions): void;
    private _onMovingWhenCreatingLine;
    /**
     * Stop the "creating line" interaction state
     * - This method is generally called by relation-graph itself, and users do not need to call this method manually. Unless the user needs to complete complex special interaction logic.
     *
     */
    stopCreatingLinePlot(): void;
    /**
     * @inner
     * @private
     */
    private onMovingWhenCreatingLinePlot;
    /**
     * @inner
     * @private
     */
    private onCanvasClickWhenCreatingLinePlot;
    _step1EventTime: number;
    /**
     * @inner
     * @private
     */
    private onNodeClickWhenCreatingLinePlot;
    _onCreateLineCallback: RGLineConnectEventHandler | undefined;
    /**
     * Triggered when the creation of a line is ready. You can modify the line data in this event, or return true to prevent the line from being created (for example, if the user selects a node that is not allowed to be connected and requires the user to select another node).
     * - This method will ultimately trigger the `onLineBeCreated` event of the <RelationGraph /> component. In this event, users can obtain the line data and use the graphInstance.addLines([newLineJson]) method to complete the data change and add the line to the graph.
     * @param from Current line start node, may be null
     * @param to Current line end node, may be null or RGPosition, Position type means the user did not select a node to connect to, but clicked on the canvas to create a line to that position.
     * @returns Return true to prevent the line from being created.
     * @protected
     */
    protected onReadyToCreateLine(from: RGNode | RGLineTarget | RGPosition, to: RGNode | RGLineTarget | RGPosition): false | RGCoordinate | undefined;
    /**
     * User right-click context menu event
     * - Finally, you can get this event through the onContextmenu event, and you can get the position where the user right-clicked and the type of object clicked (canvas | line | node) and the object through this event.
     * @param e
     */
    onContextmenu(e: RGUserEvent): void;
    /**
     * Toggle fullscreen mode
     - If newValue is true, enter fullscreen mode
     - If newValue is false, exit fullscreen mode
     - If newValue is not provided, toggle fullscreen mode
     * @param newValue
     */
    fullscreen(newValue?: boolean): Promise<void>;
    /**
     * User scroll mouse wheel event
     * - Supports touchpad and mouse wheel
     * - This event will determine whether to zoom the canvas or scroll the canvas based on whether the user presses the Ctrl/Cmd key and options.wheelEventAction
     * - When options.disableWheelEvent is true, there will be no response
     * @param e
     */
    onMouseWheel(e: WheelEvent): true | undefined;
    /**
     * @inner
     * @private
     */
    private _applyWheelEvent;
    private _mouseWheelTimer;
    private _mouseWheelEventPrevApplyTime;
    private _mouseWheelForce;
    /**
     * @inner
     * @private
     */
    private _onMouseWheel;
    /**
     * Scroll the canvas
     * @param buffX - The amount to scroll
     * @param buffY - The amount to scroll
     */
    scrollView(buffX: number, buffY: number): void;
    /**
     * @inner
     * @private
     */
    private onLineDragStart;
    onLineDragEnd(x_buff: number, y_buff: number, e: RGUserEvent): void;
    /**
     * User Start Drag Canvas
     * - This method will determine whether to create a selection area or move the canvas based on whether the user is holding down the Shift key or the configuration item options.dragEventAction.
     * - When options.dragEventAction is set to 'none', clicking and dragging on the canvas will only trigger a click event and will not create a selection area or move the canvas.
     * @param e
     */
    onCanvasDragStart(e: RGUserEvent): void;
    /**
     * User Start Move Canvas
     *
     * @param e
     * @param forceStartMove
     */
    startMoveCanvas(e: RGUserEvent, forceStartMove?: boolean): void;
    /**
     * @inner
     * @private
     */
    protected onCanvasDragging(newX: number, newY: number, buffX: number, buffY: number): void;
    /**
     * @inner
     * @param e
     */
    private onCanvasDragStop;
    /**
     * @inner
     * @param e
     */
    private startCreateSelection;
    private _fullscreenchangeHandler;
    /**
     * Monitor fullscreen changes
     * @inner
     * @private
     */
    protected addFullscreenListener(): void;
    /**
     * Remove fullscreen change monitoring
     * @inner
     * @private
     */
    protected removeFullscreenListener(): void;
    /**
     * Default line connect end handler for <RGConnectTarget /> component
     * - This method does not make any data changes. Users need to obtain the line information through the onLineConnectEnd event of the <RGConnectTarget /> component, and use the graphInstance.addLines([newLineJson]) method to complete the data change.
     *
     * @inner
     * @private
     */
    defaultLineConnectEndHandler(from: RGNode | RGLineTarget | RGPosition, to: RGNode | RGLineTarget | RGPosition, newLine?: JsonLine): void;
    /**
     * Default line vertex change handler
     * - This method does not make any data changes. Users need to obtain the line information through the onLineBeCreated event when the line is created or the line vertex is changed, and use the graphInstance.addLines([newLineJson]) method to complete the data change.
     * - Why does the line vertex change also need to be added through addLines to add data?
     *      - Because the implementation of line vertex change is to delete the original line data first, and then add a new line data to achieve it. However, the line data obtained through the onLineBeCreated event will be a line data with an id and all information identical to the original line.
     *
     * @inner
     * @param from
     * @param to
     * @param newLine
     */
    defaultLineVertexBeChangedHandler(from: RGNode | RGLineTarget | RGPosition, to: RGNode | RGLineTarget | RGPosition, newLine?: JsonLine): void;
    /**
     * Sleep for a specified amount of time
     * @param time - The time to sleep in milliseconds
     */
    sleep(time: number): Promise<void>;
    /**
     * This method is called by the force layout engine to update the view after each iteration of the force layout calculation is completed.
     * @inner
     * @private
     */
    forceLayoutTickCallback(): void;
}
