import {RelationGraphWith9EasyView} from './RelationGraphWith9EasyView';
import {
    JsonLineLike,
    RGCtrlPointForLine44,
    RGEventNames,
    RGFakeLine,
    RGJunctionPoint,
    RGLine,
    RGLineConnectEventHandler,
    RGLineShape,
    RGLineVertexBeDroppedEventHandler,
    RGNode,
    RGResizeHandlePosition,
    RGUserEvent
} from '../../types';
import {devLog, getClientCoordinate, isInputFocused} from '../utils/RGCommon';
import RGDragUtils from "../utils/RGDragUtils";
import {clearSamePoint, handleDirections, LVLineJunctionPoint} from "../utils/line/RGLinePathUtils";
import {getPointsByPath, updateLinePoints} from "../utils/line/RGLinePath";
import {getNodeDistance} from "../utils/RGGraphMath";

/**
 * Capability extension class related to the editor of the relation-graph component
 */
export class RelationGraphWith91Editing extends RelationGraphWith9EasyView {
    constructor() {
        super();
    }

    /**
     * Set the nodes being edited
     * - Set to null or an empty array to cancel all nodes being edited
     * - After setting, the position and size of the editing controller (<RGEditingNodeController>) will be automatically updated. If there are no editing nodes, the controller will be hidden.
     * @param nodes
     *
     */
    setEditingNodes(nodes: RGNode[] | null) {
        if (nodes === null || nodes.length === 0) {
            this.dataProvider.setEditingNodes([]);
        } else {
            const nodeIds = nodes.map(n => n.id);
            const rgNodes = this.getNodes().filter(n => nodeIds.includes(n.id));
            this.dataProvider.setEditingNodes(rgNodes);
        }
        this._updateEditingControllerView();
        this._dataUpdated();
    }

    /**
     * Add a node to the editing nodes
     * @param node
     */
    addEditingNode(node: RGNode) {
        const rgNode = this.getNodeById(node.id);
        if (!rgNode) {
            throw new Error('Node not found: ' + node.id);
        }
        this.dataProvider.setEditingNodes(this.getOptions().editingController.nodes.concat(node));
        this._updateEditingControllerView();
        this._dataUpdated();
    }

    /**
     * Remove a node from the editing nodes
     * @param node
     */
    removeEditingNode(node: RGNode) {
        this.dataProvider.setEditingNodes(this.getOptions().editingController.nodes.filter(n => n.id !== node.id));
        this._updateEditingControllerView();
        this._dataUpdated();
    }

    /**
     * Toggle the editing state of a node
     * @param node
     */
    toggleEditingNode(node: RGNode) {
        const nodeIndex = this.getOptions().editingController.nodes.findIndex(n => n.id === node.id);
        if (nodeIndex === -1) {
            this.addEditingNode(node);
        } else {
            this.removeEditingNode(node);
        }
    }

    /**
     * Update the view of the editing controller
     * - This method is automatically called when the editing nodes are set or changed.
     */
    updateEditingControllerView() {
        this._updateEditingControllerView();
        this._dataUpdated();
    }

    /**
     * @inner
     * @protected
     */
    protected _updateEditingControllerView() {
        this._updateEditingLineView();
        this._updateEditingConnectControllerView();
        const options = this.getOptions();
        if (!options.editingController.show) return;
        const {minX, minY, maxX, maxY} = this.getNodesRectBox(options.editingController.nodes);
        const padding = options.editingController.nodes.length > 1 ? 5 : 0;
        const scale = this.dataProvider.getCanvasScale();
        let viewWith = (maxX - minX);
        let viewHeight = (maxY - minY);
        if (viewWith < 0) viewWith = 0;
        if (viewHeight < 0) viewHeight = 0;
        if (viewWith > 0 && viewHeight > 0) {
            const startCoordinateOnView = this.getViewXyByCanvasXy({
                x: minX,
                y: minY
            });
            const x = startCoordinateOnView.x - padding * scale;
            const y = startCoordinateOnView.y - padding * scale;
            const width = viewWith * scale + padding * 2 * scale;
            const height = viewHeight * scale + padding * 2 * scale;
            this.dataProvider.updateOptions({
                editingController: {
                    ...options.editingController,
                    x,
                    y,
                    width,
                    height
                }
            });
        } else {
            this.dataProvider.updateOptions({
                editingController: {...options.editingController, show: false}
            });
        }
    }

    protected _onResizing;
    protected _onResizeEnd;
    protected _startPoint = {x: 0, y: 0};
    protected _startEventCanvasXy = {x: 0, y: 0};
    protected _startSizeCanvasXy = {x: 0, y: 0};
    protected _startSize = {x: 0, y: 0, width: 0, height: 0, widthOnCanvas: 0, heightOnCanvas: 0};
    protected _resizeType: RGResizeHandlePosition = 'l';
    protected _nodeStartSizeMap = new WeakMap<RGNode, any>();
    protected resizeMinLimit = {width: 10, height: 10};

    /**
     * User starts resizing the editing controller
     * @param type User handles the resize handle position: "t" | "r" | "b" | "l" | "tl" | "tr" | "bl" | "br"
     * @param e
     */
    onResizeStart(type: RGResizeHandlePosition, e: RGUserEvent) {
        this._resizeType = type;
        this._startPoint = this.getViewXyByEvent(e);
        this._startEventCanvasXy = this.getCanvasXyByViewXy(this._startPoint);
        const options = this.getOptions();
        this._startSize.x = options.editingController.x;
        this._startSize.y = options.editingController.y;
        this._startSizeCanvasXy = this.getCanvasXyByViewXy(this._startSize);
        this._startSize.width = options.editingController.width;
        this._startSize.height = options.editingController.height;
        const scale = this.dataProvider.getCanvasScale();
        this._startSize.widthOnCanvas = options.editingController.width / scale;
        this._startSize.heightOnCanvas = options.editingController.height / scale;
        for (const node of options.editingController.nodes) {
            this._nodeStartSizeMap.set(node, {
                x: node.x,
                y: node.y,
                width: node.el_W,
                height: node.el_H
            });
        }
        if (this._onResizing) this.$dom.removeEventListener('mousemove', this._onResizing);
        if (this._onResizeEnd) this.$dom.removeEventListener('mouseup', this._onResizeEnd);
        this._resizeDraggingEvent = null;
        this._resizeDraggingStoped = false;
        this._onResizing = this.onResizing.bind(this);
        this._onResizeEnd = this.onResizeEnd.bind(this);
        this.$dom.addEventListener('mousemove', this._onResizing);
        this.$dom.addEventListener('mouseup', this._onResizeEnd);
        const _onResizeRequest = this.onResizingRequest.bind(this);
        const resizeLoop = () => {
            _onResizeRequest();
            this._resizeDraggingTimer = requestAnimationFrame(resizeLoop);
        }
        this._resizeDraggingTimer = requestAnimationFrame(resizeLoop);
        this.emitEvent(RGEventNames.onResizeStart, options.editingController.nodes, e);
    }

    private _resizeDraggingTimer;
    private _resizeDraggingEvent: RGUserEvent;
    private _resizeDraggingStoped = true;

    /**
     * @inner
     * @private
     */
    private onResizing(e: RGUserEvent) {
        this._resizeDraggingEvent = e;
    }

    /**
     * @inner
     * @private
     */
    private onResizingRequest() {
        if (!this._resizeDraggingEvent || this._resizeDraggingStoped) {
            return;
        }
        const draggingEventXy = this.getViewXyByEvent(this._resizeDraggingEvent);
        this.canvasAutoMoving(draggingEventXy);
        const startEventXyOnView = this.getViewXyByCanvasXy(this._startEventCanvasXy);
        const startSizeXyOnView = this.getViewXyByCanvasXy(this._startSizeCanvasXy);
        const buff_x = draggingEventXy.x - startEventXyOnView.x;
        const buff_y = draggingEventXy.y - startEventXyOnView.y;
        const options = this.getOptions();
        let newWidth = options.editingController.width;
        let newHeight = options.editingController.height;
        let newX = options.editingController.x;
        let newY = options.editingController.y;
        const scale = this.dataProvider.getCanvasScale();
        if (this._resizeType === 'tl') {
            newX = startEventXyOnView.x + buff_x;
            newY = startEventXyOnView.y + buff_y;
            newWidth = this._startSize.widthOnCanvas * scale - buff_x;
            newHeight = this._startSize.heightOnCanvas * scale - buff_y;
        } else if (this._resizeType === 'tr') {
            newY = startEventXyOnView.y + buff_y;
            newX = startSizeXyOnView.x;
            newWidth = this._startSize.widthOnCanvas * scale + buff_x;
            newHeight = this._startSize.heightOnCanvas * scale - buff_y;
        } else if (this._resizeType === 'bl') {
            newX = startEventXyOnView.x + buff_x;
            newY = startSizeXyOnView.y;
            newWidth = this._startSize.widthOnCanvas * scale - buff_x;
            newHeight = this._startSize.heightOnCanvas * scale + buff_y;
        } else if (this._resizeType === 'br') {
            newX = startSizeXyOnView.x;
            newY = startSizeXyOnView.y;
            newWidth = this._startSize.widthOnCanvas * scale + buff_x;
            newHeight = this._startSize.heightOnCanvas * scale + buff_y;
        } else if (this._resizeType === 't') {
            newY = startEventXyOnView.y + buff_y;
            newHeight = this._startSize.heightOnCanvas * scale - buff_y;
        } else if (this._resizeType === 'r') {
            newX = startSizeXyOnView.x;
            newWidth = this._startSize.widthOnCanvas * scale + buff_x;
        } else if (this._resizeType === 'b') {
            newHeight = this._startSize.heightOnCanvas * scale + buff_y;
            newY = startSizeXyOnView.y;
        } else if (this._resizeType === 'l') {
            newX = startEventXyOnView.x + buff_x;
            newWidth = this._startSize.widthOnCanvas * scale - buff_x;
        }
        if (newWidth < this.resizeMinLimit.width) newWidth = this.resizeMinLimit.width;
        if (newHeight < this.resizeMinLimit.width) newHeight = this.resizeMinLimit.height;
        this.dataProvider.updateOptions({
            editingController: {
                ...options.editingController,
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight
            }
        });
        this._applyResizeScale(this._resizeDraggingEvent);
        this._updateEditingControllerView();
        this._dataUpdated();
    }
    /**
     * @inner
     * @private
     */
    private _applyResizeScale(e: RGUserEvent) {
        const options = this.getOptions();
        const scale = this.dataProvider.getCanvasScale();
        const scale_x = options.editingController.width / scale / this._startSize.widthOnCanvas;
        const scale_y = options.editingController.height / scale / this._startSize.heightOnCanvas;
        const startLeftTopPoint = this._startSizeCanvasXy;
        const leftTopPoint = this.getCanvasXyByViewXy({
            x: options.editingController.x,
            y: options.editingController.y
        });
        let allowResizeWidth = true;
        let allowResizeHeight = true;
        if (this._resizeType === 't' || this._resizeType === 'b') {
            allowResizeWidth = false;
        } else if (this._resizeType === 'r' || this._resizeType === 'l') {
            allowResizeHeight = false;
        }
        for (const node of options.editingController.nodes) {
            const nodeStartSize = this._nodeStartSizeMap.get(node);
            const newWidth = nodeStartSize.width * scale_x;
            const newHeight = nodeStartSize.height * scale_y;
            const newX = leftTopPoint.x + scale_x * (nodeStartSize.x - startLeftTopPoint.x);
            const newY = leftTopPoint.y + scale_y * (nodeStartSize.y - startLeftTopPoint.y);
            const newW = newWidth;
            const newH = newHeight;
            const cancelApply = this.emitEvent(RGEventNames.beforeNodeResize, node, newX, newY, newW, newH) === false;
            if (!cancelApply) {
                if (allowResizeWidth) {
                    // node.x = newX;
                    // node.width = newW;
                    // node.el_W = newW;
                    this.dataProvider.updateNode(node.id, {
                        x: newX,
                        width: newW,
                        el_W: newW
                    });
                }
                if (allowResizeHeight) {
                    // node.y = newY;
                    // node.height = newH;
                    // node.el_H = newH;
                    this.dataProvider.updateNode(node.id, {
                        y: newY,
                        height: newH,
                        el_H: newH
                    });
                }
                // devLog('ResizeNode:', node.id, newW, newH, scale_x, scale_y);
            }
        }
    }
    /**
     * @inner
     * @private
     */
    private onResizeEnd(e: RGUserEvent) {
        cancelAnimationFrame(this._resizeDraggingTimer);
        this._resizeDraggingStoped = true;
        const point = this.getViewXyByEvent(e);
        const buff_x = point.x - this._startPoint.x;
        const buff_y = point.y - this._startPoint.y;
        // console.log('onResizeEnd', buff_x, buff_y);
        this._applyResizeScale(e);
        this.$dom.removeEventListener('mousemove', this._onResizing);
        this.$dom.removeEventListener('mouseup', this._onResizeEnd);
        this._onResizing = null;
        this._onResizeEnd = null;
        devLog('onResizeEnd:', this.getOptions().editingController.nodes, buff_x, buff_y);
        this.emitEvent(RGEventNames.onResizeEnd, this.getOptions().editingController.nodes, buff_x, buff_y, e);
    }
    /**
     * When dragging a node, update the position of the dragged node and other nodes being edited
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @inner
     * @private
     */
    protected draggingSelectedNodes(draggedNode: RGNode, newX: number, newY: number, buff_x: number, buff_y: number) {
        const fixedInfo = this.updateReferenceLineView(draggedNode, newX, newY, buff_x, buff_y);
        if (fixedInfo) {
            const {showV, fixedX, showH, fixedY} = fixedInfo;
            if (showV) {
                buff_x += (fixedX - newX);
                newX = fixedX;
            }
            if (showH) {
                buff_y += (fixedY - newY);
                newY = fixedY;
            }
        }
        const options = this.getOptions();
        if (!options.editingController.nodes.includes(draggedNode)) {
            this.dataProvider.updateNode(draggedNode.id, {x: newX, y: newY});
            this._updateEditingLineView();
        } else {
            for (const node of options.editingController.nodes) {
                const nodeXYBeforeDrag = this._nodeXYMappingBeforeDrag[node.id];
                if (nodeXYBeforeDrag) {
                    // node.x = nodeXYBeforeDrag.x + buff_x;
                    // node.y = nodeXYBeforeDrag.y + buff_y;
                    this.dataProvider.updateNode(node.id, {
                        x: nodeXYBeforeDrag.x + buff_x,
                        y: nodeXYBeforeDrag.y + buff_y
                    });
                }
            }
            this._updateEditingControllerView();
        }
    }
    /**
     * @inner
     * @private
     */
    protected _updateEditingConnectControllerView() {
        const options = this.getOptions();
        if (!options.nodeConnectController.show) {
            return;
        }
        const node = options.nodeConnectController.node;
        const minX = node.x;
        const minY = node.y;
        const maxX = node.x + node.el_W;
        const maxY = node.y + node.el_H;
        const padding = 0;
        const scale = this.dataProvider.getCanvasScale();
        const viewX = minX;
        const viewY = minY;
        const viewWith = (maxX - minX);
        const viewHeight = (maxY - minY);
        const startCoordinateOnView = this.getViewXyByCanvasXy({
            x: viewX,
            y: viewY
        });
        this.dataProvider.updateOptions({
            nodeConnectController: {
                ...options.nodeConnectController,
                x: startCoordinateOnView.x - padding * scale,
                y: startCoordinateOnView.y - padding * scale,
                width: viewWith * scale + padding * 2 * scale,
                height: viewHeight * scale + padding * 2 * scale
            }
        });
    }

    /**
     * Set the line being edited
     * - When set to null, the line being edited is canceled
     * - When the line being edited is not null, the <RGEditingLineController> controller will automatically display and update its position
     * @param line The line being edited
     */
    setEditingLine(line: RGLine | null) {
        this.dataProvider.setEditingLine(line);
        this._updateEditingLineView();
        this._dataUpdated();
    }
    /**
     * @inner
     * @private
     */
    private updateReferenceLineView(draggedNode: RGNode, newX: number, newY: number, buff_x: number, buff_y: number) {
        const options = this.getOptions();
        if (!options.showReferenceLine) return;
        if (!options.editingReferenceLine.show) {
            const distanceX = Math.abs(buff_x);
            const distanceY = Math.abs(buff_y);
            if ((distanceX + distanceY) > 2) {
                this.dataProvider.updateOptions({
                    editingReferenceLine: {
                        ...options.editingReferenceLine,
                        show: true
                    }
                });
            }
        }
        if (!options.editingReferenceLine.show) return;
        const draggedNodeXStart = newX;
        const draggedNodeWidth = draggedNode.el_W;
        const draggedNodeHeight = draggedNode.el_H;
        const draggedNodeXCenter = newX + draggedNodeWidth / 2;
        const draggedNodeXEnd = newX + draggedNodeWidth;
        const draggedNodeYStart = newY;
        const draggedNodeYCenter = newY + draggedNodeHeight / 2;
        const draggedNodeYEnd = newY + draggedNodeHeight;
        const centerOnView = this.getViewXyByCanvasXy({
            x: draggedNodeXCenter,
            y: draggedNodeYCenter
        });
        let showH = false;
        let showV = false;
        let fixedX = 0;
        let fixedY = 0;
        const nearNodes = this.getNodes().filter(n => {
            if (this._nodeXYMappingBeforeDrag[n.id]) return false;
            return Math.abs(n.x - draggedNodeXCenter) < 600 && Math.abs(n.y - draggedNodeYCenter) < 600;
        });
        nearNodes.sort((a, b) => {
            const distanceToDraggingNodeA = getNodeDistance(
                draggedNodeXCenter,
                draggedNodeYCenter,
                a.x + a.el_W / 2,
                a.y + a.el_H / 2
            );
            const distanceToDraggingNodeB = getNodeDistance(
                draggedNodeXCenter,
                draggedNodeYCenter,
                b.x + b.el_W / 2,
                b.y + b.el_H / 2
            );
            return distanceToDraggingNodeA < distanceToDraggingNodeB ? -1 : 1;
        });
        let {v_x, v_y, v_height, h_x, h_y, h_width} = options.editingReferenceLine;
        for (const node of nearNodes) {
            const nodeXStart = node.x;
            const nodeWidth = node.el_W;
            const nodeHeight = node.el_H;
            const nodeXCenter = node.x + nodeWidth / 2;
            const nodeXEnd = node.x + nodeWidth;
            const nodeYStart = node.y;
            const nodeYCenter = node.y + nodeHeight / 2;
            const nodeYEnd = node.y + nodeHeight;
            const buffXStart = Math.abs(draggedNodeXStart - nodeXStart);
            const buffXCenter = Math.abs(draggedNodeXCenter - nodeXCenter);
            const buffXEnd = Math.abs(draggedNodeXEnd - nodeXEnd);
            const buffYStart = Math.abs(draggedNodeYStart - nodeYStart);
            const buffYCenter = Math.abs(draggedNodeYCenter - nodeYCenter);
            const buffYEnd = Math.abs(draggedNodeYEnd - nodeYEnd);
            const matchDistance = 5;
            if (buffXCenter < 800 && buffYCenter < 800) {
                if (!showV && buffXCenter < matchDistance) {
                    const toPoint = this.getViewXyByCanvasXy({
                        x: nodeXCenter,
                        y: nodeYCenter
                    });
                    v_x = toPoint.x;
                    v_y = centerOnView.y > toPoint.y ? toPoint.y : centerOnView.y;
                    v_height = Math.round(Math.abs(centerOnView.y - toPoint.y));
                    showV = true;
                    fixedX = nodeXCenter - draggedNodeWidth / 2;
                }
                if (!showV && buffXStart < matchDistance) {
                    const toPoint = this.getViewXyByCanvasXy({
                        x: nodeXStart,
                        y: nodeYCenter
                    });
                    v_x = toPoint.x;
                    v_y = centerOnView.y > toPoint.y ? toPoint.y : centerOnView.y;
                    v_height = Math.round(Math.abs(centerOnView.y - toPoint.y));
                    showV = true;
                    fixedX = nodeXStart;
                }
                if (!showV && buffXEnd < matchDistance) {
                    const toPoint = this.getViewXyByCanvasXy({
                        x: nodeXEnd,
                        y: nodeYCenter
                    });
                    v_x = toPoint.x;
                    v_y = centerOnView.y > toPoint.y ? toPoint.y : centerOnView.y;
                    v_height = Math.round(Math.abs(centerOnView.y - toPoint.y));
                    showV = true;
                    fixedX = nodeXEnd - draggedNodeWidth;
                }
                if (!showH && buffYCenter < matchDistance) {
                    const toPoint = this.getViewXyByCanvasXy({
                        x: nodeXCenter,
                        y: nodeYCenter
                    });
                    h_y = toPoint.y;
                    h_x = centerOnView.x > toPoint.x ? toPoint.x : centerOnView.x;
                    h_width = Math.round(Math.abs(centerOnView.x - toPoint.x));
                    showH = true;
                    fixedY = nodeYCenter - draggedNodeHeight / 2;
                }
                if (!showH && buffYStart < matchDistance) {
                    const toPoint = this.getViewXyByCanvasXy({
                        x: nodeXCenter,
                        y: nodeYStart
                    });
                    h_y = toPoint.y;
                    h_x = centerOnView.x > toPoint.x ? toPoint.x : centerOnView.x;
                    h_width = Math.round(Math.abs(centerOnView.x - toPoint.x));
                    showH = true;
                    fixedY = nodeYStart;
                }
                if (!showH && buffYEnd < matchDistance) {
                    const toPoint = this.getViewXyByCanvasXy({
                        x: nodeXCenter,
                        y: nodeYEnd
                    });
                    h_y = toPoint.y;
                    h_x = centerOnView.x > toPoint.x ? toPoint.x : centerOnView.x;
                    h_width = Math.abs(centerOnView.x - toPoint.x);
                    showH = true;
                    fixedY = nodeYEnd - draggedNodeHeight;
                }
                if (showH && showV) {
                    break;
                }
            }
        }
        this.dataProvider.updateOptions({
            editingReferenceLine: {
                ...options.editingReferenceLine,
                v_x,
                v_y,
                v_height,
                h_x,
                h_y,
                h_width,
                directionH: showH,
                directionV: showV,
            }
        });
        if (options.referenceLineAdsorption) {
            return {
                showV, fixedX,
                showH, fixedY
            }
        }
    }

    /**
     * Hide the editing line view
     * - Generally used in this scenario: when editing a line, the line editing controller may block the display of the line. When modifying the appearance of the line (such as arrows, etc.), this method can be called to hide the line editing controller view, allowing users to preview the final effect of the line in time.
     */
    hideEditingLineView() {
        this.dataProvider.updateOptions({
            editingLineController: {
                ...this.getOptions().editingLineController,
                show: false
            }
        });
    }

    /**
     * Update the view of the editing line controller
     * - This method is automatically called when the editing line is set or changed.
     */
    updateEditingLineView() {
        this._updateEditingLineView();
        this._dataUpdated();
    }
    /**
     * @inner
     * @private
     */
    protected _updateEditingLineView() {
        // @ts-ignore
        this.updateElementLines();
        const options = this.getOptions();
        if (!options.editingLineController.show) return;
        const line = options.editingLineController.line as RGLine;
        const link = this.getLinkByLine(line);
        if (!line || line.to === "newRelationTemplate-to") {
            this.dataProvider.updateOptions({
                editingLineController: {
                    ...this.getOptions().editingLineController,
                    show: false
                }
            });
            return;
        }
        let startPoint;
        let endPoint;
        let textPositionOnCanvas;
        const lineDrawInfo = this.createLineDrawInfo(link, line);
        if (!lineDrawInfo) {
            this.dataProvider.updateOptions({
                editingLineController: {
                    ...this.getOptions().editingLineController,
                    show: false
                }
            });
            return;
        }
        // @ts-ignore
        if (line.lineShape === RGLineShape.StandardOrthogonal) {
            let {
                textPosition,
                pathData,
                points,
                startDirection,
                endDirection
            } = lineDrawInfo;
            textPositionOnCanvas = textPosition;
            startPoint = points[0];
            endPoint = points[points.length - 1];
            // this.dataProvider.updateLine(line.id, {
            //     ctrlPointsFor44: points
            // });
            // points = line.ctrlPointsFor44;
            const line44Splits: RGCtrlPointForLine44[] = [];
            for (let i = 0; i < points.length - 1; i++) {
                const point = points[i];
                const nextPoint = points[i + 1];
                const ctrlPoint: RGCtrlPointForLine44 = {
                    pIndex: i,
                    optionName: 'cp-' + i,
                    x: 0,
                    y: 0,
                    direction: 'v',
                    startDirection,
                    endDirection
                };
                if (point.x !== nextPoint.x) {
                    ctrlPoint.direction = 'h';
                }
                const position = this.getViewXyByCanvasXy({
                    x: (point.x + nextPoint.x) / 2,
                    y: (point.y + nextPoint.y) / 2,
                });
                ctrlPoint.x = position.x;
                ctrlPoint.y = position.y;
                line44Splits.push(ctrlPoint);
            }
            if (line44Splits.length === 1) {
            } else if (line44Splits.length === 2) {
            } else if (line44Splits.length === 3) {
                const prevPoint = points[0];
                const currentPoint = points[1];
                const nextPoint = points[3];
                if (line44Splits[1].direction === 'v') {
                    const prevValue = prevPoint.x;
                    const currentValue = currentPoint.x;
                    const nextValue = nextPoint.x;
                    const isCenter = Math.max(prevValue, currentValue, nextValue) !== currentValue && Math.min(prevValue, currentValue, nextValue) !== currentValue;
                    if (isCenter) {
                        line44Splits[1].optionName = 'cx';
                    } else {
                        const distanceFrom = Math.abs(currentValue - prevValue);
                        const distanceTo = Math.abs(currentValue - nextValue);
                        if (distanceFrom >= distanceTo) {
                            line44Splits[1].optionName = 'td';
                        } else if (distanceFrom < distanceTo) {
                            line44Splits[1].optionName = 'fd';
                        }
                    }
                } else {
                    const prevValue = prevPoint.y;
                    const currentValue = currentPoint.y;
                    const nextValue = nextPoint.y;
                    const isCenter = Math.max(prevValue, currentValue, nextValue) !== currentValue && Math.min(prevValue, currentValue, nextValue) !== currentValue;
                    if (isCenter) {
                        line44Splits[1].optionName = 'cy';
                    } else {
                        const distanceFrom = Math.abs(currentValue - prevValue);
                        const distanceTo = Math.abs(currentValue - nextValue);
                        if (distanceFrom >= distanceTo) {
                            line44Splits[1].optionName = 'td';
                        } else if (distanceFrom < distanceTo) {
                            line44Splits[1].optionName = 'fd';
                        }
                    }
                }
            } else if (line44Splits.length === 4) {
                line44Splits[1].optionName = 'fd';
                line44Splits[2].optionName = 'td';
            } else if (line44Splits.length === 5) {
                line44Splits[1].optionName = 'fd';
                if (line44Splits[2].direction === 'v') {
                    line44Splits[2].optionName = 'cx';
                } else {
                    line44Splits[2].optionName = 'cy';
                }
                line44Splits[3].optionName = 'td';
            }
            this.dataProvider.updateOptions({
                editingLineController: {
                    ...this.getOptions().editingLineController,
                    line44Splits,
                    line49Points: points
                }
            });
            // if (!line.ctrlPointsFor49) {
            //     // line.ctrlPointsFor49 = points;
            //     this.dataProvider.updateLine(line.id, {
            //         ctrlPointsFor49: points
            //     });
            // }
            // @ts-ignore
        } else if (line.lineShape === RGLineShape.HardOrthogonal) {
            let {
                textPosition,
                pathData,
                points,
                startDirection,
                endDirection
            } = lineDrawInfo;
            textPositionOnCanvas = textPosition;
            const line44Splits: RGCtrlPointForLine44[] = [];
            // line.ctrlPointsFor49 = points;
            // this.dataProvider.updateLine(line.id, {
            //     ctrlPointsFor49: points
            // });
            points = line.ctrlPointsFor49;
            startPoint = points[0];
            endPoint = points[points.length - 1];
            const ctrlPointsFor49 = points;
            for (let i = 0; i < ctrlPointsFor49.length - 1; i++) {
                const point = ctrlPointsFor49[i];
                const nextPoint = ctrlPointsFor49[i + 1];
                const ctrlPoint: RGCtrlPointForLine44 = {
                    pIndex: i,
                    optionName: 'cp-' + i,
                    x: 0,
                    y: 0,
                    direction: 'v',
                    startDirection,
                    endDirection
                };
                if (point.x !== nextPoint.x) {
                    ctrlPoint.direction = 'h';
                    if (Math.abs(point.x - nextPoint.x) < 15) {
                        ctrlPoint.hide = true;
                    }
                } else {
                    if (Math.abs(point.y - nextPoint.y) < 15) {
                        ctrlPoint.hide = true;
                    }
                }
                const position = this.getViewXyByCanvasXy({
                    x: (point.x + nextPoint.x) / 2,
                    y: (point.y + nextPoint.y) / 2,
                });
                ctrlPoint.x = position.x;
                ctrlPoint.y = position.y;
                line44Splits.push(ctrlPoint);
            }
            for (let i = 0; i < line44Splits.length; i++) {
                const prevCtrlPoint = line44Splits[i - 1];
                const ctrlPoint = line44Splits[i];
                const nextCtrlPoint = line44Splits[i + 1];
                if (i === 0) {
                    if (ctrlPoint.direction === nextCtrlPoint.direction) {
                        ctrlPoint.hide = true;
                    }
                }
                if (i === line44Splits.length - 1) {
                    if (ctrlPoint.direction === prevCtrlPoint.direction) {
                        ctrlPoint.hide = true;
                    }
                }
            }
            this.dataProvider.updateOptions({
                editingLineController: {
                    ...this.getOptions().editingLineController,
                    line44Splits,
                    line49Points: ctrlPointsFor49
                }
            });
        } else if (line.lineShape !== 1) {
            textPositionOnCanvas = lineDrawInfo.textPosition;
            const linePoints = getPointsByPath(lineDrawInfo.pathData);
            let ctrlPoint1;
            let ctrlPoint2;
            if (line.isReverse) {
                startPoint = linePoints.endPoint;
                endPoint = linePoints.startPoint;
                ctrlPoint1 = this.getViewXyByCanvasXy(linePoints.ctrl1);
                ctrlPoint2 = this.getViewXyByCanvasXy(linePoints.ctrl2);
            } else {
                startPoint = linePoints.startPoint;
                endPoint = linePoints.endPoint;
                ctrlPoint1 = this.getViewXyByCanvasXy(linePoints.ctrl1);
                ctrlPoint2 = this.getViewXyByCanvasXy(linePoints.ctrl2);
            }
            this.dataProvider.updateOptions({
                editingLineController: {
                    ...this.getOptions().editingLineController,
                    ctrlPoint1,
                    ctrlPoint2
                }
            });
        } else {
            textPositionOnCanvas = lineDrawInfo.textPosition;
            const path = lineDrawInfo.pathData;
            const linePoints = getPointsByPath(path);
            startPoint = linePoints.startPoint;
            endPoint = linePoints.endPoint;
        }
        const viewStartPoint = this.getViewXyByCanvasXy(line.isReverse ? endPoint : startPoint);
        const viewEndPoint = this.getViewXyByCanvasXy(line.isReverse ? startPoint : endPoint);
        // options.editingLineController.startPoint.x = viewStartPoint.x;
        // options.editingLineController.startPoint.y = viewStartPoint.y;
        // options.editingLineController.endPoint.x = viewEndPoint.x;
        // options.editingLineController.endPoint.y = viewEndPoint.y;

        this.dataProvider.updateOptions({
            editingLineController: {
                ...this.getOptions().editingLineController,
                startPoint: viewStartPoint,
                endPoint: viewEndPoint
            }
        });
        const textPoint = this.getViewXyByCanvasXy(textPositionOnCanvas);
        const lineDom = this.$canvasDom.querySelector(`g[data-id='${line.id}']`);
        let textAlignOffsetX = 0;
        let textAlignOffsetY = 0;
        let orignLineTextOffsetX = line.textOffsetX || 0;
        let orignLineTextOffsetY = line.textOffsetY || 0;
        const scale = this.dataProvider.getCanvasScale();
        let textWidth = 20;
        let textHeight = 20;
        if (lineDom) {
            const textDom: SVGTextElement = lineDom.querySelector(`text.rg-line-text`)!;
            // console.log('this.$canvasDom:line:', textDom);
            if (textDom) {
                orignLineTextOffsetX = Math.floor(parseFloat(textDom.getAttribute('x') || '0'));
                orignLineTextOffsetY = Math.floor(parseFloat(textDom.getAttribute('y') || '0'));
                const lineTextLabelDomWidth = textDom.clientWidth;
                const lineTextLabelDomHeight = textDom.clientHeight;
                // options.editingLineController.text.width = lineTextLabelDomWidth;
                // options.editingLineController.text.height = lineTextLabelDomHeight;
                textWidth = lineTextLabelDomWidth;
                textHeight = lineTextLabelDomHeight;
            }
        }
        textWidth += 40;
        textHeight += 10;
        if (textWidth > 120) {
            textWidth = 120;
        }
        if (textHeight > 20) {
            textHeight = 20;
        }
        // options.editingLineController.text.x = textPoint.x + textAlignOffsetX + (orignLineTextOffsetX) * scale;
        // options.editingLineController.text.y = textPoint.y + textAlignOffsetY + (orignLineTextOffsetY) * scale;
        this.dataProvider.updateOptions({
            editingLineController: {
                ...this.getOptions().editingLineController,
                text: {
                    ...this.getOptions().editingLineController.text,
                    width: textWidth,
                    height: textHeight,
                    x: textPoint.x + textAlignOffsetX + (orignLineTextOffsetX) * scale,
                    y: textPoint.y + textAlignOffsetY + (orignLineTextOffsetY) * scale,
                }
            }
        });
    }

    /**
     * Start dragging the start or end point of the line to reselect the start or end point of the line
     * - During the process of changing the start or end point of the line, the line will be removed. When reconnecting, you can get the new line information (the new line information id and other attributes will be retained) through onLineConnectEventHandler(or through the onLineBeCreated event of the <RelationGraph> component). You need to complete the data change through graphInstance.addLines([newJsonLine]) to finally complete the modification of the line endpoint.
     * @param type Choose to drag the start point or end point of the line, 'start' means dragging the start point, 'end' means dragging the end point
     * @param $event
     * @param onLineConnectEventHandler Callback function after line connection is completed, you can get the new line information through the parameters, you need to complete the data change through graphInstance.addLines([newJsonLine])
     *
     */
    startMoveLineVertex(type: 'start' | 'end', $event: RGUserEvent, onLineConnectEventHandler: RGLineConnectEventHandler) {
        $event.stopPropagation();
        const line = this.getOptions().editingLineController.line as RGLine;
        const link = this.getLinkByLine(line);
        let fromNode;
        let toNode;
        if (link) {
            fromNode = link.fromNode
            toNode = link.toNode
        } else {
            const fakeLineConfig = this.generateFakeLineConfig(line as RGFakeLine);
            if (!fakeLineConfig) {
                console.warn('[startDragLine]Can not resolve fake line targets:', line);
                return;
            }
            const {from, to} = fakeLineConfig;
            fromNode = from;
            toNode = to;
        }
        let templateLineStartNode = fromNode;
        this.dataProvider.setEditingLine(null);
        if (link) {
            this.removeLine(line);
        } else {
            this.removeFakeLine(line as RGFakeLine);
        }
        // console.log('DragLine start:', type, line.isReverse);
        let movingStart = false;
        // const {startMarkerId, endMarkerId, fromJunctionPoint, fromJunctionPointOffsetX, fromJunctionPointOffsetY, toJunctionPoint, toJunctionPointOffsetX, toJunctionPointOffsetY} = this.options.newLineTemplate;
        if (line.lineShape === RGLineShape.HardOrthogonal) {
            line.lineShape = RGLineShape.StandardOrthogonal;
        }
        if (type === 'start') {
            line.fromJunctionPointOffsetX = 0;
            line.fromJunctionPointOffsetY = 0;
            templateLineStartNode = toNode;
            movingStart = true;
        } else {
            line.toJunctionPointOffsetX = 0;
            line.toJunctionPointOffsetY = 0;
        }
        this.startCreatingLinePlot($event, {
            template: line,
            fromNode: templateLineStartNode,
            isReverse: movingStart,
            onCreateLine: onLineConnectEventHandler
        });
    }

    private _startCreateLineFromNodeTime = 0;

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
    startCreateLineFromNode(fromNode: RGNode | null | undefined, useLineTemplate: JsonLineLike, $event: RGUserEvent, onLineConnectEventHandler: RGLineConnectEventHandler) {
        $event.stopPropagation();
        const lineTemplate = JSON.parse(JSON.stringify(useLineTemplate));
        this._startCreateLineFromNodeTime = Date.now();
        if (!lineTemplate.from) {
            if (!fromNode) {
                const editingNodes = this.getOptions().editingController.nodes;
                if (editingNodes.length === 1) {
                    fromNode = editingNodes[0];
                }
            }
            if (fromNode) {
                lineTemplate.from = fromNode.id;
                lineTemplate.fromType = fromNode.targetType;
            }
        }
        if (!lineTemplate.from) {
            console.error(`Error:lineTemplate:`, lineTemplate);
            throw Error(`Error:startCreateLineByTemplate: lineTemplate must has [fromType, from]`);
        }
        const fromTarget = this.resolveTargetRect(lineTemplate.fromType, lineTemplate.from, lineTemplate, {
            preferLiveTarget: true
        });
        if (!fromTarget) {
            console.error(`Error:fakeTarget[fromType, from]:`, lineTemplate.fromType, lineTemplate.from, lineTemplate);
            throw Error(`Error:startCreateLineByTemplate: error from fakeTarget[fromType, from]:${lineTemplate.fromType}, ${lineTemplate.from}`);
        }
        if (!lineTemplate.lineShape) {
            lineTemplate.lineShape = 6;
        }
        this.startCreatingLinePlot($event, {
            template: lineTemplate,
            fromNode: fromTarget,
            isReverse: false,
            onCreateLine: onLineConnectEventHandler
        });
    }

    /**
     * When the start or end point of the line is connected to the junction point of a node, this method is called
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param type
     * @param $event
     * @param junctionPointOffset
     * @param onLineVertexBeDropped
     * @inner
     */
    onLineVertexBeDropped(type: RGJunctionPoint, $event: RGUserEvent, junctionPointOffset = {
        x: 0,
        y: 0
    }, onLineVertexBeDropped?: RGLineVertexBeDroppedEventHandler) {
        $event.stopPropagation();
        const options = this.getOptions();
        if (!options.creatingLinePlot) {
            return;
        }
        if (Date.now() - this._startCreateLineFromNodeTime < 500) {
            return;
        }
        // console.log('Connect end:isReverse:', options.newLineTemplate.isReverse);
        const node = options.nodeConnectController.node;
        let {
            toJunctionPoint,
            toJunctionPointOffsetX,
            toJunctionPointOffsetY,
            fromJunctionPoint,
            fromJunctionPointOffsetX,
            fromJunctionPointOffsetY
        } = options.newLineTemplate;
        if (!options.newLinkTemplate.fromNode) {
            if (options.newLineTemplate.isReverse) {
                toJunctionPoint = type;
                toJunctionPointOffsetX = junctionPointOffset.x;
                toJunctionPointOffsetY = junctionPointOffset.y;
            } else {
                fromJunctionPoint = type;
                fromJunctionPointOffsetX = junctionPointOffset.x;
                fromJunctionPointOffsetY = junctionPointOffset.y;
            }
            this.dataProvider.updateOptions({
                newLineTemplate: {
                    ...this.getOptions().newLineTemplate,
                    fromJunctionPoint,
                    fromJunctionPointOffsetX,
                    fromJunctionPointOffsetY,
                    toJunctionPoint,
                    toJunctionPointOffsetX,
                    toJunctionPointOffsetY
                },
                newLinkTemplate: {
                    ...this.getOptions().newLinkTemplate,
                    fromNode: node
                }
            });
        } else {
            if (options.newLineTemplate.isReverse) {
                fromJunctionPoint = type;
                fromJunctionPointOffsetX = junctionPointOffset.x;
                fromJunctionPointOffsetY = junctionPointOffset.y;
            } else {
                toJunctionPoint = type;
                toJunctionPointOffsetX = junctionPointOffset.x;
                toJunctionPointOffsetY = junctionPointOffset.y;
            }
            // this.options.newLinkTemplate.toNodeObject = node;
            const fromNode = this.getOptions().newLinkTemplate.fromNode;
            this.dataProvider.updateOptions({
                newLineTemplate: {
                    ...this.getOptions().newLineTemplate,
                    fromJunctionPoint,
                    fromJunctionPointOffsetX,
                    fromJunctionPointOffsetY,
                    toJunctionPoint,
                    toJunctionPointOffsetX,
                    toJunctionPointOffsetY
                },
                newLinkTemplate: {
                    ...this.getOptions().newLinkTemplate,
                    toNodeObject: node
                }
            });
            const toNode = node;
            try {
                const onLineVertexDroppedEventParams = {
                    newLineTemplate: this.getOptions().newLineTemplate,
                    fromNode,
                    toNode
                };
                this.emitEvent(RGEventNames.onLineVertexDropped, onLineVertexDroppedEventParams);
                onLineVertexBeDropped && onLineVertexBeDropped(
                    onLineVertexDroppedEventParams.fromNode,
                    onLineVertexDroppedEventParams.toNode,
                    onLineVertexDroppedEventParams.newLineTemplate
                );
                const continueCreating = this.onReadyToCreateLine(this.getOptions().newLinkTemplate.fromNode, this.getOptions().nodeConnectController.node);
                if (continueCreating !== true) {
                    this.stopCreatingLinePlot();
                }
            } catch (e) {
                this.stopCreatingLinePlot();
                console.warn('[Custom Reject onCreateLine By Throw Error:', e);
            }
        }
    }

    /**
     * Start dragging the line text position
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param $event
     * @param moveEndCallback
     * @inner
     */
    startMoveLineText($event: RGUserEvent, moveEndCallback: () => void) {
        if (isInputFocused($event)) {
            return;
        }
        // $event.stopPropagation();
        // $event.preventDefault();
        const startPoint = this.getViewXyByEvent($event);
        const options = this.getOptions();
        const line: RGLine = options.editingLineController.line!;
        // console.log('startMoveLineText:', line.id);
        const orignLineTextOffsetX = line.textOffsetX || 0;
        const orignLineTextOffsetY = line.textOffsetY || 0;
        let dragged = false;
        const onDragging = (e: MouseEvent) => {
            const scale = this.dataProvider.getCanvasScale();
            const point = this.getViewXyByEvent(e);
            const buff_x = point.x - startPoint.x;
            const buff_y = point.y - startPoint.y;
            if (buff_x > 0 || buff_y > 0) {
                dragged = true;
            }
            const textOffsetX = Math.round(orignLineTextOffsetX + buff_x / scale);
            const textOffsetY = Math.round(orignLineTextOffsetY + buff_y / scale);
            this.dataProvider.updateLine(line.id, {
                textOffsetX,
                textOffsetY,
            })
            this._updateEditingLineView();
            this._dataUpdated();
        };
        const onDragEnd = (e: MouseEvent) => {
            this.$dom.removeEventListener('mousemove', onDragging);
            this.$dom.removeEventListener('mouseup', onDragEnd);
            if (dragged && moveEndCallback) {
                moveEndCallback();
            }
            this._dataUpdated();
        };
        this.$dom.addEventListener('mousemove', onDragging);
        this.$dom.addEventListener('mouseup', onDragEnd);
    }

    /**
     * Start dragging the line control point (applicable to lines with curved line types)
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param ctrlPointIndex
     * @param $event
     * @param onLinePathChanged
     * @inner
     */
    startMoveLine6CtrlPoint(ctrlPointIndex: number, $event: RGUserEvent, onLinePathChanged: (line: RGLine) => void) {
        $event.stopPropagation();
        $event.preventDefault();
        const options = this.getOptions();
        const editingLineController = options.editingLineController;
        const line = editingLineController.line;
        let ctrlPoints = line.ctrlPoints || [];
        if (ctrlPoints.length === 0) {
            ctrlPoints.push({x: 0, y: 0});
            ctrlPoints.push({x: 0, y: 0});
        }
        this.dataProvider.updateLine(line.id, {
            ctrlPoints
        });
        // console.log('startMoveLine6CtrlPoint:line:', line);
        ctrlPoints = line.ctrlPoints;
        if (line.isReverse) {
            ctrlPointIndex = ctrlPoints.length - 1 - ctrlPointIndex;
        }
        const scale = this.dataProvider.getCanvasScale();
        const ctrlPoint = ctrlPoints[ctrlPointIndex];
        const {x, y} = ctrlPoint;
        const onDragEnd = () => {
            // console.log('stopMoveLineCtrlPoint:', ctrlPointIndex);
            onLinePathChanged(line);
            this._dataUpdated();
        }
        RGDragUtils.startDrag($event, {x: 0, y: 0}, onDragEnd, (offsetX: number, offsetY: number) => {
            ctrlPoint.x = x + offsetX / scale;
            ctrlPoint.y = y + offsetY / scale;
            this.dataProvider.updateLine(line.id, {
                ctrlPoints
            });
            this._updateEditingLineView();
            // console.log('LineCtrlPoint:moving...', ctrlPointIndex);
            this._dataUpdated();
        });
    }

    /**
     * Start dragging the line control point (applicable to lines with line type RGLineShape.StandardOrthogonal)
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param split
     * @param $event
     * @param onLinePathChanged
     */
    startMoveLine44CtrlPoint(split: RGCtrlPointForLine44, $event: RGUserEvent, onLinePathChanged: (line: RGLine) => void) {
        $event.stopPropagation();
        $event.preventDefault();
        const options = this.getOptions();
        const editingLineController = options.editingLineController;
        const line = editingLineController.line;
        // console.log('startMoveLine44CtrlPoint:', line?.lineShape, split.optionName);
        let ctrlOptionsFor44 = line.ctrlOptionsFor44;
        if (!ctrlOptionsFor44) {
            ctrlOptionsFor44 = {cx: 0, cy: 0, fd: 0, td: 0};
            this.dataProvider.updateLine(line.id, {
                ctrlOptionsFor44
            });
            ctrlOptionsFor44 = line.ctrlOptionsFor44;
        }
        const startValue = ctrlOptionsFor44[split.optionName];
        const cursor = {indexOffset: 0};
        let startCtrlPointsFor49 = line.ctrlPointsFor49 ? JSON.parse(JSON.stringify(line.ctrlPointsFor49)) : null;
        const lineSplitCtrlMoving = (offsetX: number, offsetY: number) => {
            // console.log('lineSplitCtrlMoving:', line?.lineShape, split.optionName);
            const scale = this.dataProvider.getCanvasScale();
            if (line.lineShape === RGLineShape.StandardOrthogonal) {
                if (split.optionName === 'cx') {
                    const startDirection = 1;// split.startDirection === Position.Left || Position.Top ? 1 : -1;
                    const newValueX = startValue + offsetX / scale * startDirection;
                    ctrlOptionsFor44.cx = newValueX;
                    this.dataProvider.updateLine(line.id, {
                        ctrlOptionsFor44
                    });
                } else if (split.optionName === 'cy') {
                    const startDirection = 1;// split.startDirection === Position.Left || Position.Top ? 1 : -1;
                    const newValueY = startValue + offsetY / scale * startDirection;
                    ctrlOptionsFor44.cy = newValueY;
                    this.dataProvider.updateLine(line.id, {
                        ctrlOptionsFor44
                    });
                } else if (split.optionName === 'fd') {
                    const sourceDir = handleDirections[split.startDirection];
                    const offset = split.direction === 'v' ? offsetX * sourceDir.x : offsetY * sourceDir.y;
                    ctrlOptionsFor44.fd = startValue + offset / scale;
                    this.dataProvider.updateLine(line.id, {
                        ctrlOptionsFor44
                    });
                } else if (split.optionName === 'td') {
                    const targetDir = handleDirections[split.endDirection];
                    const offset = split.direction === 'v' ? offsetX * targetDir.x : offsetY * targetDir.y;
                    ctrlOptionsFor44.td = startValue + offset / scale;
                    this.dataProvider.updateLine(line.id, {
                        ctrlOptionsFor44
                    });
                } else {
                    if (split.direction === 'v' && Math.abs(offsetX) > 5 || split.direction === 'h' && Math.abs(offsetY) > 5) {
                        // line.ctrlPointsFor49 = editingLineController.line49Points;
                        // line.lineShape = 49
                        const ctrlPointsFor49 = editingLineController.line49Points;
                        startCtrlPointsFor49 = JSON.parse(JSON.stringify(ctrlPointsFor49));
                        // console.log(':startCtrlPointsFor49:::', startCtrlPointsFor49);
                        this.dataProvider.updateLine(line.id, {
                            ctrlPointsFor49: startCtrlPointsFor49
                        });
                        this.dataProvider.updateLine(line.id, {
                            lineShape: RGLineShape.HardOrthogonal
                        });
                    }
                }
            } else if (line.lineShape === RGLineShape.HardOrthogonal) {
                const {newPoints, pointsChanged} = updateLinePoints(
                    line.ctrlPointsFor49,
                    startCtrlPointsFor49,
                    split.pIndex + cursor.indexOffset,
                    split,
                    cursor,
                    offsetX / scale,
                    offsetY / scale
                );
                if (pointsChanged) {
                    startCtrlPointsFor49 = JSON.parse(JSON.stringify(newPoints));
                }
                // line.ctrlPointsFor49 = newPoints
                this.dataProvider.updateLine(line.id, {
                    ctrlPointsFor49: newPoints
                });
            }
        }
        const onDragEnd = () => {
            if (line.lineShape === RGLineShape.HardOrthogonal) {
                const newPoints = clearSamePoint(line.ctrlPointsFor49);
                // line.ctrlPointsFor49 = newPoints
                this.dataProvider.updateLine(line.id, {
                    ctrlPointsFor49: newPoints
                });
            }
            this._updateEditingLineView();
            onLinePathChanged && onLinePathChanged(line);
            this._dataUpdated();
        }
        RGDragUtils.startDrag($event, {x: 0, y: 0}, onDragEnd, (offsetX: number, offsetY: number) => {
            lineSplitCtrlMoving(offsetX, offsetY);
            this._updateEditingLineView();
            this._dataUpdated();
        });
    }

    /**
     * When the start or end point of the line is dropped onto the connection point on the node connection controller (<RGEditingConnectController />), this method is called
     * - This method is called internally by relation-graph and does not need to be called by the user
     * @param junctionPoint
     * @param $event
     * @param connectBoxDom
     * @param lineVertexBeDroppedEventHandler
     * @inner
     */
    onLineVertexBeDroppedOnConnectController(junctionPoint: RGJunctionPoint, $event: RGUserEvent, connectBoxDom?: HTMLElement, lineVertexBeDroppedEventHandler?: RGLineVertexBeDroppedEventHandler) {
        devLog('onLineVertexBeDroppedOnConnectController', junctionPoint, $event, connectBoxDom);
        $event.stopPropagation();
        if (!connectBoxDom) {
            this.onLineVertexBeDropped(junctionPoint, $event, undefined, lineVertexBeDroppedEventHandler);
            return;
        }
        const eventPosition = getClientCoordinate($event);
        const box = connectBoxDom!.getBoundingClientRect();
        const leftPoint = { x: box.left, y: box.top + box.height / 2 };
        const topPoint = { x: box.left + box.width / 2, y: box.top };
        const rightPoint = { x: box.left + box.width, y: box.top + box.height / 2 };
        const bottomPoint = { x: box.left + box.width / 2, y: box.top + box.height };
        let type:LVLineJunctionPoint = LVLineJunctionPoint.left;
        const offset = { x: 0, y: 0 };
        if (junctionPoint) {
            type = junctionPoint as LVLineJunctionPoint;
            if (type === LVLineJunctionPoint.top) {
                offset.x =  eventPosition.clientX - bottomPoint.x;
            } else if (type === LVLineJunctionPoint.bottom) {
                offset.x =  eventPosition.clientX - bottomPoint.x;
            } else if (type === LVLineJunctionPoint.right) {
                offset.y =  eventPosition.clientY - rightPoint.y;
            } else {
                offset.y =  eventPosition.clientY - leftPoint.y;
            }
        } else {
            const distanceToLeft = getNodeDistance(eventPosition.clientX, eventPosition.clientY, leftPoint.x, leftPoint.y);
            const distanceToTop = getNodeDistance(eventPosition.clientX, eventPosition.clientY, topPoint.x, topPoint.y);
            const distanceToRight = getNodeDistance(eventPosition.clientX, eventPosition.clientY, rightPoint.x, rightPoint.y);
            const distanceToBottom = getNodeDistance(eventPosition.clientX, eventPosition.clientY, bottomPoint.x, bottomPoint.y);
            const minDistance = Math.min(distanceToLeft, distanceToTop, distanceToRight, distanceToBottom);
            if (minDistance === distanceToLeft) {
                type = LVLineJunctionPoint.left;
                offset.x =  eventPosition.clientX - leftPoint.x;
                offset.y =  eventPosition.clientY - leftPoint.y;
            } else if (minDistance === distanceToTop) {
                type = LVLineJunctionPoint.top;
                offset.x =  eventPosition.clientX - topPoint.x;
                offset.y =  eventPosition.clientY - topPoint.y;
            } else if (minDistance === distanceToRight) {
                type = LVLineJunctionPoint.right;
                offset.x =  eventPosition.clientX - rightPoint.x;
                offset.y =  eventPosition.clientY - rightPoint.y;
            } else if (minDistance === distanceToBottom) {
                type = LVLineJunctionPoint.bottom;
                offset.x =  eventPosition.clientX - bottomPoint.x;
                offset.y =  eventPosition.clientY - bottomPoint.y;
            }
        }
        const scale = this.dataProvider.getCanvasScale();
        offset.x = offset.x / scale;
        offset.y = offset.y / scale;
        devLog('onMouseUpWithOffset:', junctionPoint, offset);
        this.onLineVertexBeDropped(type, $event, offset, lineVertexBeDroppedEventHandler);
    }
}
