import { RelationGraphWith9EasyView } from './RelationGraphWith9EasyView';
import { JsonLineLike, RGCtrlPointForLine44, RGJunctionPoint, RGLine, RGLineConnectEventHandler, RGLineVertexBeDroppedEventHandler, RGNode, RGResizeHandlePosition, RGUserEvent } from '../../types';
/**
 * Capability extension class related to the editor of the relation-graph component
 */
export declare class RelationGraphWith91Editing extends RelationGraphWith9EasyView {
    constructor();
    /**
     * Set the nodes being edited
     * - Set to null or an empty array to cancel all nodes being edited
     * - After setting, the position and size of the editing controller (<RGEditingNodeController>) will be automatically updated. If there are no editing nodes, the controller will be hidden.
     * @param nodes
     *
     */
    setEditingNodes(nodes: RGNode[] | null): void;
    /**
     * Add a node to the editing nodes
     * @param node
     */
    addEditingNode(node: RGNode): void;
    /**
     * Remove a node from the editing nodes
     * @param node
     */
    removeEditingNode(node: RGNode): void;
    /**
     * Toggle the editing state of a node
     * @param node
     */
    toggleEditingNode(node: RGNode): void;
    /**
     * Update the view of the editing controller
     * - This method is automatically called when the editing nodes are set or changed.
     */
    updateEditingControllerView(): void;
    /**
     * @inner
     * @protected
     */
    protected _updateEditingControllerView(): void;
    protected _onResizing: any;
    protected _onResizeEnd: any;
    protected _startPoint: {
        x: number;
        y: number;
    };
    protected _startEventCanvasXy: {
        x: number;
        y: number;
    };
    protected _startSizeCanvasXy: {
        x: number;
        y: number;
    };
    protected _startSize: {
        x: number;
        y: number;
        width: number;
        height: number;
        widthOnCanvas: number;
        heightOnCanvas: number;
    };
    protected _resizeType: RGResizeHandlePosition;
    protected _nodeStartSizeMap: WeakMap<RGNode, any>;
    protected resizeMinLimit: {
        width: number;
        height: number;
    };
    /**
     * User starts resizing the editing controller
     * @param type User handles the resize handle position: "t" | "r" | "b" | "l" | "tl" | "tr" | "bl" | "br"
     * @param e
     */
    onResizeStart(type: RGResizeHandlePosition, e: RGUserEvent): void;
    private _resizeDraggingTimer;
    private _resizeDraggingEvent;
    private _resizeDraggingStoped;
    /**
     * @inner
     * @private
     */
    private onResizing;
    /**
     * @inner
     * @private
     */
    private onResizingRequest;
    /**
     * @inner
     * @private
     */
    private _applyResizeScale;
    /**
     * @inner
     * @private
     */
    private onResizeEnd;
    /**
     * When dragging a node, update the position of the dragged node and other nodes being edited
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @inner
     * @private
     */
    protected draggingSelectedNodes(draggedNode: RGNode, newX: number, newY: number, buff_x: number, buff_y: number): void;
    /**
     * @inner
     * @private
     */
    protected _updateEditingConnectControllerView(): void;
    /**
     * Set the line being edited
     * - When set to null, the line being edited is canceled
     * - When the line being edited is not null, the <RGEditingLineController> controller will automatically display and update its position
     * @param line The line being edited
     */
    setEditingLine(line: RGLine | null): void;
    /**
     * @inner
     * @private
     */
    private updateReferenceLineView;
    /**
     * Hide the editing line view
     * - Generally used in this scenario: when editing a line, the line editing controller may block the display of the line. When modifying the appearance of the line (such as arrows, etc.), this method can be called to hide the line editing controller view, allowing users to preview the final effect of the line in time.
     */
    hideEditingLineView(): void;
    /**
     * Update the view of the editing line controller
     * - This method is automatically called when the editing line is set or changed.
     */
    updateEditingLineView(): void;
    /**
     * @inner
     * @private
     */
    protected _updateEditingLineView(): void;
    /**
     * Start dragging the start or end point of the line to reselect the start or end point of the line
     * - During the process of changing the start or end point of the line, the line will be removed. When reconnecting, you can get the new line information (the new line information id and other attributes will be retained) through onLineConnectEventHandler(or through the onLineBeCreated event of the <RelationGraph> component). You need to complete the data change through graphInstance.addLines([newJsonLine]) to finally complete the modification of the line endpoint.
     * @param type Choose to drag the start point or end point of the line, 'start' means dragging the start point, 'end' means dragging the end point
     * @param $event
     * @param onLineConnectEventHandler Callback function after line connection is completed, you can get the new line information through the parameters, you need to complete the data change through graphInstance.addLines([newJsonLine])
     *
     */
    startMoveLineVertex(type: 'start' | 'end', $event: RGUserEvent, onLineConnectEventHandler: RGLineConnectEventHandler): void;
    private _startCreateLineFromNodeTime;
    /**
     * Start creating a line from a specified starting point
     * - The <RGConnectSource> and <RGConnectTarget> components will use this method, and you can call this method yourself to create a line from a specified node
     * - It is worth noting that: fromNode can be empty. If it is empty, it will try to automatically find the starting point. The logic is:
     *     - 1. Determine whether lineTemplate.from is empty. If it is not empty, use the node corresponding to lineTemplate.from as the starting point
     *     - 2. Find the only node from the currently edited nodes as the starting node.
     *     - 3. If the starting node still cannot be found, an exception is thrown
     * - When the user completes the connection of the line, the onLineConnectEventHandler callback will be triggered (or through the onLineBeCreated event of the <RelationGraph> component), and you need to add the line data in the callback, through
     *
     * @param fromNode
     * @param useLineTemplate
     * @param $event
     * @param onLineConnectEventHandler
     */
    startCreateLineFromNode(fromNode: RGNode | null | undefined, useLineTemplate: JsonLineLike, $event: RGUserEvent, onLineConnectEventHandler: RGLineConnectEventHandler): void;
    /**
     * When the start or end point of the line is connected to the junction point of a node, this method is called
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param type
     * @param $event
     * @param junctionPointOffset
     * @param onLineVertexBeDropped
     * @inner
     */
    onLineVertexBeDropped(type: RGJunctionPoint, $event: RGUserEvent, junctionPointOffset?: {
        x: number;
        y: number;
    }, onLineVertexBeDropped?: RGLineVertexBeDroppedEventHandler): void;
    /**
     * Start dragging the line text position
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param $event
     * @param moveEndCallback
     * @inner
     */
    startMoveLineText($event: RGUserEvent, moveEndCallback: () => void): void;
    /**
     * Start dragging the line control point (applicable to lines with curved line types)
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param ctrlPointIndex
     * @param $event
     * @param onLinePathChanged
     * @inner
     */
    startMoveLine6CtrlPoint(ctrlPointIndex: number, $event: RGUserEvent, onLinePathChanged: (line: RGLine) => void): void;
    /**
     * Start dragging the line control point (applicable to lines with line type RGLineShape.StandardOrthogonal)
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param split
     * @param $event
     * @param onLinePathChanged
     */
    startMoveLine44CtrlPoint(split: RGCtrlPointForLine44, $event: RGUserEvent, onLinePathChanged: (line: RGLine) => void): void;
    /**
     * When the start or end point of the line is dropped onto the connection point on the node connection controller (<RGEditingConnectController />), this method is called
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param junctionPoint
     * @param $event
     * @param connectBoxDom
     * @param lineVertexBeDroppedEventHandler
     * @inner
     */
    onLineVertexBeDroppedOnConnectController(junctionPoint: RGJunctionPoint, $event: RGUserEvent, connectBoxDom?: HTMLElement, lineVertexBeDroppedEventHandler?: RGLineVertexBeDroppedEventHandler): void;
}
