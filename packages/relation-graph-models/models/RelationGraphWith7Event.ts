import {
    devLog,
    getClientCoordinate,
    isInputFocused,
    isSupportTouch,
    sleep
} from '../utils/RGCommon';
import {json2Node, newNodeTemplate} from '../data/RGNodeDataUtils';
import {
    CreatingLinePlotOptions,
    CreatingNodePlotOptions,
    RGJunctionPoint,
    RGEventNames,
    RGEventTargetType, RGInnerConnectTargetType,
    RGLine,
    RGLineConnectEventHandler,
    RGLineTarget,
    RGLink,
    RGNode,
    RGPosition,
    RGSelectionView,
    RGUserEvent, RGCoordinate, JsonLine
} from '../../types';
import RGDragUtils, {RGDraggingCallback} from '../utils/RGDragUtils';
import {json2Line} from '../data/RGLineDataUtils';
import {RelationGraphWith6Layout} from "./RelationGraphWith6Layout";
import {setFullscreen} from "../utils/RGFullscreenUtils";

/**
 *  The relation-graph component UI and graphInstance event bus handle user interaction events.
 *  - Most of the events handled here are user interaction events, while some other events are handled by the following classes:
 *    - Editor-related events are handled in RelationGraphWith91Editing
 *    - MiniView-related events are handled in RelationGraphWith92MiniView
 *
 */
export class RelationGraphWith7Event extends RelationGraphWith6Layout {
    constructor() {
        super();
    }
    protected draggingSelectedNodes(_draggedNode: RGNode, _newX: number, _newY: number, _buff_x: number, _buff_y: number) {}

    private _prevClickNodeTime = 0;

    /**
     * Triggered when the user clicks on a node
     * @param node The clicked node object
     * @param e MouseDown or TouchStart event
     *
     */
    onNodeClick(node: RGNode, e: RGUserEvent) {
        if ('button' in e && e.button === 2) {
            return;
        }
        if (Date.now() - this._prevClickNodeTime < 200) {
            devLog('[node]click abort : time < 200');
            return;
        }
        this._prevClickNodeTime = Date.now();
        const options = this.getOptions();
        if (options.creatingLinePlot) {
            this.onNodeClickWhenCreatingLinePlot(node);
            return;
        }
        const disablePointEvent = node.disablePointEvent === undefined ? options.disableNodePointEvent : node.disablePointEvent;
        devLog('[node]node click', node.text, options.creatingLinePlot, disablePointEvent);
        if (!e.shiftKey && !disablePointEvent) {
            options.checkedLineId = '';
            this.dataProvider.updateOptions({
                checkedLineId: '',
                checkedNodeId: node.id
            });
        }
        this.emitEvent(RGEventNames.onNodeClick, node, e);
        this._prevClickNodeTime = Date.now();
    }
    protected _nodeXYMappingBeforeDrag: {[nodeId:string]: {x:number, y:number}} = {};

    /**
     * Triggered when the user starts dragging a node
     * - When the user starts dragging but does not move the node, it is considered as clicking the node, and the onNodeClick event will be triggered instead.
     * @param willMoveNode The node object that will be moved
     * @param e MouseDown or TouchStart event
     */
    onNodeDragStart(willMoveNode: RGNode, e: RGUserEvent) {
        if (!willMoveNode) {
            return;
        }
        if (isInputFocused(e)) {
            return;
        }
        const options = this.getOptions();
        const disableDragNode = willMoveNode.disableDrag || options.disableDragNode;
        if (disableDragNode) {
            const dragByHandler = this.getEventTargetElement(e)?.closest('.rg-node-drag-handler');
            if (!dragByHandler) {
                const nodeClickEvent = (e) => {
                    this.onNodeClick(willMoveNode, e);
                    document.body.removeEventListener('mouseup', nodeClickEvent);
                }
                document.body.addEventListener('mouseup', nodeClickEvent);
                return;
            }
        }
        if (isNaN(willMoveNode.x)) willMoveNode.x = 0;
        if (isNaN(willMoveNode.y)) willMoveNode.y = 0;
        this.dataProvider.setEditingLine(null);
        this.dataProvider.updateOptions({
            checkedLineId: ''
        });
        let dragStoped = false;
        const dragEnd = (x_buff: number, y_buff: number, $dragEndEvent: RGUserEvent) => {
            $dragEndEvent.stopPropagation();
            dragStoped = true;
            if (this._canvasMovingTimer) cancelAnimationFrame(this._canvasMovingTimer);
            this.dataProvider.updateOptions({
                draggingNodeId: '',
                editingReferenceLine: {
                    ...options.editingReferenceLine,
                    show: false
                }
            });
            this._onNodeDragEnd(willMoveNode, x_buff, y_buff, $dragEndEvent);
            if (dragStarted) {
                this.emitEvent(RGEventNames.onNodeDragEnd, willMoveNode, $dragEndEvent, x_buff, y_buff);
            } else {
                this.onNodeClick(willMoveNode, e);
            }
            this._dataUpdated();
        };
        this._nodeXYMappingBeforeDrag = {};
        this._nodeXYMappingBeforeDrag[willMoveNode.id] = {x: willMoveNode.x, y: willMoveNode.y};
        for (const node of options.editingController.nodes) {
            this._nodeXYMappingBeforeDrag[node.id] = {x: node.x, y: node.y};
        }
        const startEventCanvasXy = this.getCanvasXyByViewXy(this.getViewXyByEvent(e));
        const nodeStartXY = {x: willMoveNode.x, y: willMoveNode.y};
        let dragStarted = false;
        if (this._canvasMovingTimer) cancelAnimationFrame(this._canvasMovingTimer);
        let draggingEvent: RGUserEvent;
        const draggingCallback = () => {
            if (!draggingEvent || dragStoped) {
                return;
            }
            const draggingEventXy = this.getViewXyByEvent(draggingEvent);
            const eventCanvasXy = this.getCanvasXyByViewXy(draggingEventXy);
            const offsetXOnCanvas = (eventCanvasXy.x - startEventCanvasXy.x);
            const offsetYOnCanvas = (eventCanvasXy.y - startEventCanvasXy.y);
            let newX = offsetXOnCanvas + nodeStartXY.x;
            let newY = offsetYOnCanvas + nodeStartXY.y;
            let buff_x = newX - nodeStartXY.x;
            let buff_y = newY - nodeStartXY.y;
            const customPosition = this.emitEvent(RGEventNames.onNodeDragging, willMoveNode, newX, newY, buff_x, buff_y, draggingEvent);
            if (customPosition) {
                if (typeof customPosition.x === 'number'){
                    newX = customPosition.x;
                    buff_x = newX - nodeStartXY.x;
                }
                if (typeof customPosition.y === 'number'){
                    newY = customPosition.y;
                    buff_y = newY - nodeStartXY.y;
                }
            }
            // if (this.options.useHorizontalView) { // 竖屏支持
            //     newX = offsetY / (this.options.canvasZoom! / 100) + basePosition.x;
            //     newY = -offsetX / (this.options.canvasZoom! / 100) + basePosition.y;
            // }
            this.canvasAutoMoving(draggingEventXy);
            this.draggingSelectedNodes(willMoveNode, newX, newY, buff_x, buff_y);
            this._dataUpdated();
        }
        const movingLoop = () => {
            draggingCallback();
            this._canvasMovingTimer = requestAnimationFrame(movingLoop);
        }
        RGDragUtils.startDrag(e, nodeStartXY, dragEnd, (_offsetX, _offsetY, basePosition, startEventInfo, $draggingEvent) => {
            // dragging tick
            if (!dragStarted) {
                if ((Math.abs(_offsetX) + Math.abs(_offsetY)) > 4) {
                    devLog('[node]onNodeDragStart...', isSupportTouch($draggingEvent), $draggingEvent);
                    this.emitEvent(RGEventNames.onNodeDragStart, willMoveNode, $draggingEvent);
                    dragStarted = true;
                    this.dataProvider.updateOptions({
                        draggingNodeId: willMoveNode.id
                    });
                    this._canvasMovingTimer = requestAnimationFrame(movingLoop);
                }
            } else {
                draggingEvent = $draggingEvent;
                // draggingCallback(draggingEvent);
            }
            this.updateElementLines();
            this._dataUpdated();
        });
    }

    /**
     * @inner
     * @protected
     */
    protected canvasAutoMoving = (draggingEventXy: RGCoordinate) => {
        const options = this.getOptions();
        const viewSize = options.viewSize;
        const forceDistance = 40;
        let forceX = 0;
        let forceY = 0;
        if (draggingEventXy.x < forceDistance) {
            forceX = forceDistance - draggingEventXy.x;
        } else if (viewSize.width - forceDistance < draggingEventXy.x) {
            forceX = (viewSize.width - forceDistance) - draggingEventXy.x;
        }
        if (draggingEventXy.y < forceDistance) {
            forceY = forceDistance - draggingEventXy.y;
        } else if (viewSize.height - forceDistance < draggingEventXy.y) {
            forceY = (viewSize.height - forceDistance) - draggingEventXy.y;
        }
        const moved = forceX !== 0 || forceY !== 0;
        if (moved) {
            forceX = Math.max(Math.min(forceX / 5, 30), -30);
            forceY = Math.max(Math.min(forceY / 5, 30), -30);
        }
        const newX = options.canvasOffset.x + forceX;
        const newY = options.canvasOffset.y + forceY;
        this.onCanvasDragging(newX, newY, forceX, forceY);
        return moved;
    }
    private _canvasMovingTimer;
    /**
     * @inner
     * @protected
     */
    private _onNodeDragEnd(node: RGNode, x_buff: number, y_buff: number, e: RGUserEvent) {
        // if (x_buff === 0 && y_buff === 0) {
        //     devLog('[node]node click by drag');
        //     this.onNodeClick(node, e);
        //     this.onNodeDragEnd(node, e, x_buff, y_buff);
        //     return;
        // }
        this.updateElementLines();
    }

    /**
     * Triggered when the user clicks on a line
     * - Triggered when the user clicks on a line path or line text
     * @param line The clicked line object
     * @param e MouseDown or TouchStart event
     */
    onLineClick(line: RGLine, e: RGUserEvent) {
        if ('button' in e && e.button === 2) {
            return;
        }
        const link = this.getLinkByLineId(line.id);
        devLog('onLineClick:', 'line:', line, 'link:', link);
        const options = this.getOptions();
        const disablePointEvent = line.disablePointEvent === undefined ? options.disableLinePointEvent : line.disablePointEvent;
        if (!disablePointEvent) {
            this.setCheckedNode('');
            this.setCheckedLine(line);
        }
        this.emitEvent(RGEventNames.onLineClick, line, link, e);
        this._dataUpdated();
    }

    /**
     * Triggered when the node's expand/collapse button is clicked.
     * - This method will expand or collapse all descendant nodes of the node.
     * - If the node is collapsed, it will be expanded; if it is expanded, it will be collapsed.
     * @param node The node object to be expanded or collapsed
     * @param e
     */
    expandOrCollapseNode(node: RGNode, e: RGUserEvent) {
        e.stopPropagation();
        if (node.expanded === false) {
            this.expandNode(node, e);
        } else {
            this.collapseNode(node, e);
        }
    }

    /**
     * Expand the specified node
     * - This method will expand the specified node and make its child nodes visible.
     * @param node The node object to be expanded
     * @param e
     */
    expandNode(node: RGNode, e?: RGUserEvent) {
        devLog('onNodeExpand:', node);
        this.dataProvider.updateNode(node.id, {
            expanded: true
        });
        this._effectWhenExpandedOrCollapsed(node);
        this.emitEvent(RGEventNames.onNodeExpand, node, e);
    }

    /**
     * Collapse the specified node
     * - This method will collapse the specified node and hide its child nodes.
     * @param node The node object to be collapsed
     * @param e
     */
    collapseNode(node: RGNode, e?: RGUserEvent) {
        devLog('onNodeCollapse:', node);
        this.dataProvider.updateNode(node.id, {
            expanded: false
        });
        this._effectWhenExpandedOrCollapsed(node);
        this.emitEvent(RGEventNames.onNodeCollapse, node, e);
    }
    private _relayoutTaskTimer;

    /**
     * After the node is expanded or collapsed, the visibility of the related nodes needs to be recalculated, and re-layout may be required.
     * @inner
     * @private
     */
    private _effectWhenExpandedOrCollapsed(node: RGNode) {
        const descendantNodes = this.getDescendantNodes(node);
        this.updateNodesVisibleProperty([node].concat(descendantNodes));
        // When the user calls garphInstance.expandNode()/collapseNode() in batches, avoid repeated layout calculations
        if (this._relayoutTaskTimer) {
            clearTimeout(this._relayoutTaskTimer);
        }
        this._relayoutTaskTimer = setTimeout(() => {
            this.updateElementLines();
            this._dataUpdated();
            const options = this.getOptions();
            if (options.reLayoutWhenExpandedOrCollapsed) {
                if (options.layout.layoutName === 'force') {
                    this.startAutoLayout();
                } else {
                    this.doLayout();
                }
            }
        }, 100);
    }
    /**
     * @inner
     * @private
     */
    protected onCanvasDragEnd(e: RGUserEvent) {
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!
        this._updateEditingControllerView();
        this.updateShouldRenderGraphData();
        this._dataUpdated();
        this.emitEvent(RGEventNames.onCanvasDragEnd, e);
    }

    /**
     * User clicks on the canvas
     * @param e
     */
    onCanvasClick(e: RGUserEvent) {
        if ('button' in e && e.button === 2) {
            return;
        }
        const options = this.getOptions();
        if (options.creatingLinePlot) {
            this.onCanvasClickWhenCreatingLinePlot(e);
        } else {
            if (this.dataProvider.isPerformanceMode()) {
                const node = this.getNodeAtEvent(e);
                if (node) {
                    this.emitEvent(RGEventNames.onNodeClick, node, e);
                    return;
                }
            }
            this.emitEvent(RGEventNames.onCanvasClick, e);
        }
    }
    /**
     * @inner
     * @private
     */
    private getNodeAtEvent(e: RGUserEvent): RGNode | null {
        const clientCoordinate = getClientCoordinate(e);
        const xyOnCanvas = this.getCanvasXyByClientXy({
            x: clientCoordinate.clientX,
            y: clientCoordinate.clientY
        });
        return this.dataProvider.findNodeByXy(xyOnCanvas);
    }
    /**
     * @inner
     * @private
     */
    private onCanvasSelectionEnd(selectionView: RGSelectionView, e: RGUserEvent) {
        this.emitEvent(RGEventNames.onCanvasSelectionEnd, selectionView, e);
        devLog('[canvas]onCanvasSelectionEnd:', selectionView);
        this._dataUpdated();
    }

    /**
     * Start the "creating node" interaction state
     * - You can set the callback function onCreateNode in the setting, and add the node to the graph data through graphInstance.addNodes([newNodeJson]); in the callback function.
     * - You can also set templateMove in the setting to get the move event of the node during placement, so as to achieve complex logic (such as highlighting an existing node when moving to it, and recording the id of this highlighted node, so that in the onCreateNode callback function, you can directly create a new node associated with the highlighted node)
     * @param e
     * @param setting Settings used to set the template information of the node being created, the callback function when the creation is completed, etc.
     */
    startCreatingNodePlot(e: RGUserEvent, setting: CreatingNodePlotOptions) {
        if (!setting) {
            throw new Error('startCreatingNodePlot need setting param');
        }
        if (!setting.onCreateNode) {
            throw new Error('startCreatingNodePlot need setting.onCreateNode param as callback');
        }
        const nodeTemplate = json2Node(JSON.parse(JSON.stringify(newNodeTemplate)), this.getOptions());
        const isTouchEvent = isSupportTouch(e);
        this.dataProvider.updateOptions({
            newNodeTemplate: Object.assign({}, nodeTemplate, setting.templateNode),
            creatingNodePlot: true,
            showTemplateNode: !isTouchEvent,
        });
        let templaceMove = (x: number, y: number) => {
            const tempNode = this.getOptions().newNodeTemplate;
            const nodeSize = {
                width: (tempNode.width || 50),
                height: (tempNode.height || 50)
            };
            this.dataProvider.updateOptions({
                newNodeTemplate: {
                    ...tempNode,
                    x: x - nodeSize.width / 2,
                    y: y - nodeSize.height / 2
                }
            });
            currentXy.x = x;
            currentXy.y = y;
            this._dataUpdated();
        };
        const viewRectBox = this.getViewBoundingClientRect();
        devLog('[CreatingNodePlot]startCreatingNodePlot:');
        const clientCoordinate = getClientCoordinate(e);
        const startX = clientCoordinate.clientX - viewRectBox.x + 10;
        const startY = clientCoordinate.clientY - viewRectBox.y + 10;
        const currentXy = { x: startX, y: startY };
        if (!isTouchEvent) templaceMove(startX, startY);
        const objectTemplateMove = ($event: MouseEvent) => {
            devLog('[CreatingNodePlot]objectTemplateMove');
            const movingXy = this.getViewXyByEvent($event);
            if (setting.templateMove) {
                setting.templateMove(movingXy.x, movingXy.y);
            }
            templaceMove(movingXy.x, movingXy.y);
        };
        const userAbort = ($event: RGUserEvent) => {
            devLog('[CreatingNodePlot]user abort!');
            clearListeners();
            this.dataProvider.updateOptions({
                creatingNodePlot: false
            });
        };
        const dragStartTime = Date.now();
        const objectBePlaced = ($event: RGUserEvent) => {
            if (Date.now() - dragStartTime < 300) {
                window.removeEventListener('mouseup', objectBePlaced);
                window.addEventListener('click', objectBePlaced);
                return;
            }
            let aborted = false;
            if (!this.getOptions().creatingNodePlot) {
                aborted = true;
            }
            clearListeners();
            this.dataProvider.updateOptions({
                creatingNodePlot: false
            });
            if (aborted) {
                devLog('[CreatingNodePlot]action be abort!');
                return;
            }
            const clientCoordinate = getClientCoordinate($event);
            const endX = clientCoordinate.clientX - viewRectBox.x + 10;
            const endY = clientCoordinate.clientY - viewRectBox.y + 10;
            if (Math.abs(startX - endX) < 30 && Math.abs(startY - endY) < 30) {
                devLog('[CreatingNodePlot]create node be abort!');
                return;
            }
            const canvasCoordinate = this.getCanvasXyByClientXy({
                x: clientCoordinate.clientX,
                y: clientCoordinate.clientY
            });
            devLog('[CreatingNodePlot]objectBePlaced:', canvasCoordinate);
            setting.onCreateNode(canvasCoordinate.x, canvasCoordinate.y, this.getOptions().newNodeTemplate);
            this._dataUpdated();
        };
        const clearListeners = () => {
            window.removeEventListener('mousemove', objectTemplateMove);
            window.removeEventListener('mouseup', objectBePlaced);
            window.removeEventListener('click', objectBePlaced);
            window.removeEventListener('contextmenu', userAbort, {capture: true});
        }
        if (!isTouchEvent) {
            window.addEventListener('mousemove', objectTemplateMove);
            window.addEventListener('mouseup', objectBePlaced);
            window.addEventListener('contextmenu', userAbort, {capture: true});
        } else {
            window.addEventListener('click', objectBePlaced);
        }
    }

    /**
     * Start the "creating line" interaction state
     * - When the line creation is completed, you need to call graphInstance.addLines([newLineJson]); in the onCreateLine callback function (or through the onLineBeCreated event of the <RelationGraph> component) to add the new line to the graph data.
     * - You can also set fromNode in the setting to specify the starting node of the line.
     * @param e
     * @param setting Settings used to set the template information of the line being created, the callback function when the creation is completed, etc.
     *
     */
    startCreatingLinePlot(e: RGUserEvent, setting: CreatingLinePlotOptions) {
        const isTouchEvent = isSupportTouch(e);
        if (setting && setting.onCreateLine) this._onCreateLineCallback = setting.onCreateLine;
        const lineTemplate = json2Line({
            id: 'newRelationTemplate',
            from: 'newRelationTemplate-from',
            to: 'newRelationTemplate-to',
            color: '',
            text: ''
        }, this.getOptions());
        if (setting && setting.template) Object.assign(lineTemplate, setting.template);
        this.dataProvider.updateOptions({
            newLineTemplate: Object.assign(lineTemplate, {
                isReverse: setting.isReverse || false
            })
        });
        this.dataProvider.updateOptions({
            newLineTemplate: Object.assign(lineTemplate, {
                isReverse: setting.isReverse || false,
                disablePointEvent: true
            }),
            creatingLinePlot: true
        });

        const newLinkTemplate = Object.assign({}, this.getOptions().newLinkTemplate, {
            fromNode: null,
            toNode: {
                id: '',
                targetType: RGInnerConnectTargetType.Node,
                x: 0,
                y: 0,
                el_W: 2,
                el_H: 2,
            },
            toNodeObject: null
        });
        if (setting && setting.fromNode) {
            newLinkTemplate.toNode.x = setting.fromNode.x! + 50;
            newLinkTemplate.toNode.y = setting.fromNode.y! + 50;
            newLinkTemplate.fromNode = setting.fromNode;
            this._step1EventTime = Date.now();
        }

        this.dataProvider.updateOptions({
            newLinkTemplate
        });

        devLog('[CreatingLinePlot]startCreatingLinePlot:isTouchEvent:', isTouchEvent);
        // this._currentMovingLineTarget = newLinkTemplate.toNode;
        if (!isTouchEvent) {
            devLog('[CreatingLinePlot]Listener move');
            if (this._onMovingWhenCreatingLine) {
                this.$dom.removeEventListener('mousemove', this._onMovingWhenCreatingLine);
            }
            this._onMovingWhenCreatingLine = this.onMovingWhenCreatingLinePlot.bind(this);
            this.$dom.addEventListener('mousemove', this._onMovingWhenCreatingLine);
        }
        this._dataUpdated();
    }

    private _onMovingWhenCreatingLine: any;

    /**
     * Stop the "creating line" interaction state
     * - This method is generally called by relation-graph itself, and users do not need to call this method manually. Unless the user needs to complete complex special interaction logic.
     *
     */
    stopCreatingLinePlot() {
        devLog('[CreatingLinePlot]stop CreatingLinePlot!');
        this.dataProvider.updateOptions({
            creatingLinePlot: false,
            newLinkTemplate: {
                ...this.getOptions().newLinkTemplate,
                fromNode: null,
                // toNode: null,
                toNodeObject: null
            },
            nodeConnectController: {
                ...this.getOptions().nodeConnectController,
                show: false
            }
        });
        this._onCreateLineCallback = undefined;
        this.$dom.removeEventListener('mousemove', this._onMovingWhenCreatingLine);
        this._onMovingWhenCreatingLine = undefined;
        // this._currentMovingLineTarget = null;
        this._dataUpdated();
    }

    // _currentMovingLineTarget: RGLineTarget | null = null;
    /**
     * @inner
     * @private
     */
    private onMovingWhenCreatingLinePlot($event: MouseEvent) {
        devLog('[CreatingLinePlot]mousemove');
        const canvasCoordinate = this.getCanvasXyByClientXy({
            x: $event.clientX,
            y: $event.clientY
        });
        const options = this.getOptions();
        // if (options.newLinkTemplate.toNode) {
        //     this.dataProvider.updateOptions({
        //         newLinkTemplate: {
        //             ...options.newLinkTemplate,
        //             toNode: {
        //                 ...options.newLinkTemplate.toNode,
        //                 x: canvasCoordinate.x,
        //                 y: canvasCoordinate.y
        //             }
        //         }
        //     })
        //     const editingLineController = options.editingLineController;
        //     if (editingLineController.line) {
        //         this._updateEditingLineView();
        //     }
        // }
        const targetElement = this.getEventTargetElement($event);
        if (!targetElement) {
            return;
        }
        const targetElementDataset = (targetElement as HTMLElement).dataset;
        let movingOnTargetId = '';
        let movingOnTargetType: string = RGInnerConnectTargetType.Node;
        const node = this.isNode(targetElement);
        let shouldAdsorb = false;
        let adsorbRect = {
            x: 0,
            y: 0,
            el_W: 5,
            el_H: 5,
            nodeShape: 0
        };
        if (node) {
            movingOnTargetId = node.id;
            if (node === this.getOptions().newLinkTemplate.fromNode) {
                this.dataProvider.updateOptions({
                    nodeConnectController: {
                        ...this.getOptions().nodeConnectController,
                        show: false
                    }
                });
            } else {
                this.dataProvider.updateOptions({
                    nodeConnectController: {
                        ...this.getOptions().nodeConnectController,
                        node: node,
                        show: true
                    }
                });
                this._updateEditingConnectControllerView();
            }
        }
        const connectTargetDescriptor = this.resolveTargetDescriptorByElement(targetElement);
        const connectHandlerElement = connectTargetDescriptor ? null : targetElement.closest('.rg-connect-ctl-handler') as HTMLElement | null;
        if (connectTargetDescriptor || connectHandlerElement) {
            let connectToNode = this.getOptions().nodeConnectController.node;
            devLog('[CreatingLinePlot]content point:', connectTargetDescriptor?.junctionPoint || connectHandlerElement?.dataset.point);
            let junctionPoint: RGJunctionPoint = connectTargetDescriptor?.junctionPoint || (connectHandlerElement?.dataset.point || RGJunctionPoint.border) as RGJunctionPoint;
            if (connectTargetDescriptor) {
                const fakeNode = this.resolveTargetRect(
                    connectTargetDescriptor.targetType,
                    connectTargetDescriptor.targetId,
                    options.newLineTemplate,
                    {
                        preferLiveTarget: true,
                        connectTargetEl: connectTargetDescriptor.measureEl
                    }
                );
                if (fakeNode) {
                    shouldAdsorb = true;
                    adsorbRect.x = fakeNode.x;
                    adsorbRect.y = fakeNode.y;
                    adsorbRect.el_W = fakeNode.el_W;
                    adsorbRect.el_H = fakeNode.el_H;
                    adsorbRect.nodeShape = fakeNode.nodeShape;
                    this.dataProvider.updateOptions({
                        nodeConnectController: {
                            ...this.getOptions().nodeConnectController,
                            node: fakeNode,
                            show: false
                        }
                    });
                    junctionPoint = fakeNode.junctionPoint || junctionPoint;
                    if (options.newLinkTemplate.toNode) {
                        movingOnTargetId = connectTargetDescriptor.targetId;
                        movingOnTargetType = fakeNode.targetType || connectTargetDescriptor.targetType;
                        this.dataProvider.updateOptions({
                            newLinkTemplate: {
                                ...this.getOptions().newLinkTemplate,
                                toNode: {
                                    ...this.getOptions().newLinkTemplate.toNode,
                                    nodeShape: fakeNode.nodeShape
                                }
                            }
                        });
                    }
                    this._updateEditingConnectControllerView();
                }
            } else {
                if (connectToNode) {
                    movingOnTargetType = RGInnerConnectTargetType.Node;
                    shouldAdsorb = true;
                    adsorbRect.x = connectToNode.x;
                    adsorbRect.y = connectToNode.y;
                    adsorbRect.el_W = connectToNode.el_W;
                    adsorbRect.el_H = connectToNode.el_H;
                    adsorbRect.nodeShape = connectToNode.nodeShape;
                    const junctionPointOnBorder = targetElementDataset.innode === 'true';
                    if (junctionPointOnBorder) {
                        adsorbRect.x = canvasCoordinate.x;
                        adsorbRect.y = canvasCoordinate.y;
                        adsorbRect.el_W = 2;
                        adsorbRect.el_H = 2;
                        adsorbRect.nodeShape = 1;
                    }
                }
            }
            if (options.newLineTemplate.isReverse) {
                this.dataProvider.updateOptions({
                    newLineTemplate: {
                        ...this.getOptions().newLineTemplate,
                        fromJunctionPoint: junctionPoint
                    }
                });
            } else {
                this.dataProvider.updateOptions({
                    newLineTemplate: {
                        ...this.getOptions().newLineTemplate,
                        toJunctionPoint: junctionPoint
                    }
                });
            }
        } else {
            devLog('[CreatingLinePlot]point:', targetElementDataset.point);
            // this.dataProvider.updateOptions({
            //     newLineTemplate: {
            //         ...this.getOptions().newLineTemplate,
            //         toJunctionPoint: RGJunctionPoint.border
            //     }
            // });
            if (options.newLineTemplate.isReverse) {
                this.dataProvider.updateOptions({
                    newLineTemplate: {
                        ...this.getOptions().newLineTemplate,
                        fromJunctionPoint: RGJunctionPoint.border
                    }
                });
            } else {
                this.dataProvider.updateOptions({
                    newLineTemplate: {
                        ...this.getOptions().newLineTemplate,
                        toJunctionPoint: RGJunctionPoint.border
                    }
                });
            }
            if (options.newLinkTemplate.toNode) {
                // this.dataProvider.updateOptions({
                //     newLinkTemplate: {
                //         ...this.getOptions().newLinkTemplate,
                //         toNode: {
                //             ...this.getOptions().newLinkTemplate.toNode,
                //             el_W: 3,
                //             el_H: 3
                //         }
                //     }
                // });
                movingOnTargetType = RGInnerConnectTargetType.Node;
            }
        }
        if (options.newLinkTemplate.toNode) {
            if (movingOnTargetId) {
                this.dataProvider.updateOptions({
                    newLinkTemplate: {
                        ...this.getOptions().newLinkTemplate,
                        toNode: {
                            ...this.getOptions().newLinkTemplate.toNode,
                            id: movingOnTargetId
                        }
                    }
                });
            }
            this.dataProvider.updateOptions({
                newLinkTemplate: {
                    ...this.getOptions().newLinkTemplate,
                    toNode: {
                        ...this.getOptions().newLinkTemplate.toNode,
                        targetType: movingOnTargetType
                    }
                }
            });
        }
        if (options.newLinkTemplate.fromNode) {
            this.dataProvider.updateOptions({
                newLinkTemplate: {
                    ...this.getOptions().newLinkTemplate,
                    toNode: {
                        ...this.getOptions().newLinkTemplate.toNode,
                        x: shouldAdsorb ? adsorbRect.x : canvasCoordinate.x,
                        y: shouldAdsorb ? adsorbRect.y : canvasCoordinate.y,
                        el_W: adsorbRect.el_W,
                        el_H: adsorbRect.el_H,
                        nodeShape: adsorbRect.nodeShape,
                    }
                }
            });
            // console.log('xxxxxxxxx:', adsorbRect.x, adsorbRect.y);
        }
        this._dataUpdated();
    }

    /**
     * @inner
     * @private
     */
    private onCanvasClickWhenCreatingLinePlot($event: RGUserEvent) {
        if (Date.now() - this._step1EventTime < 500) {
            devLog('[CreatingLinePlot]step1EventTime:', this._step1EventTime);
            return;
        }
        const options = this.getOptions();
        if (!options.newLinkTemplate.fromNode) {
            devLog('[CreatingLinePlot]CreatingLinePlot:fromNode not set!');
            return;
        }
        let rejectStop = false;
        if (!options.newLinkTemplate.toNodeObject) {
            devLog('[CreatingLinePlot]CreatingLinePlot:toNodeObject not set!');
            const clientXy = getClientCoordinate($event);
            const canvasXy = this.getCanvasXyByClientXy({
                x: clientXy.clientX,
                y: clientXy.clientY
            });
            rejectStop = this.onReadyToCreateLine(options.newLinkTemplate.fromNode, canvasXy);
        }
        if (rejectStop !== true) this.stopCreatingLinePlot();
    }

    _step1EventTime = 0;

    /**
     * @inner
     * @private
     */
    private onNodeClickWhenCreatingLinePlot(node: RGNode) {
        const options = this.getOptions();
        if (!options.newLinkTemplate.fromNode) {
            devLog('[CreatingLinePlot]step 1: set fromNode:', node);
            this.dataProvider.updateOptions({
                newLinkTemplate: {
                    ...options.newLinkTemplate,
                    fromNode: node,
                    toNode: {
                        ...options.newLinkTemplate.toNode,
                        x: node.x + 50,
                        y: node.y + 50
                    }
                }
            });
            this._step1EventTime = Date.now();
        } else {
            devLog('[CreatingLinePlot]step 2: set toNodeObjecct:', options.newLinkTemplate.fromNode, node);
            this.dataProvider.updateOptions({
                newLinkTemplate: {
                    ...options.newLinkTemplate,
                    toNodeObject: node,
                }
            });
            const rejectStop = this.onReadyToCreateLine(options.newLinkTemplate.fromNode, node);
            if (rejectStop !== true) this.stopCreatingLinePlot();
        }
    }

    _onCreateLineCallback: RGLineConnectEventHandler | undefined;

    /**
     * Triggered when the creation of a line is ready. You can modify the line data in this event, or return true to prevent the line from being created (for example, if the user selects a node that is not allowed to be connected and requires the user to select another node).
     * - This method will ultimately trigger the `onLineBeCreated` event of the <RelationGraph /> component. In this event, users can obtain the line data and use the graphInstance.addLines([newLineJson]) method to complete the data change and add the line to the graph.
     * @param from Current line start node, may be null
     * @param to Current line end node, may be null or RGPosition, Position type means the user did not select a node to connect to, but clicked on the canvas to create a line to that position.
     * @returns Return true to prevent the line from being created.
     * @protected
     */
    protected onReadyToCreateLine(from: RGNode | RGLineTarget | RGPosition, to: RGNode | RGLineTarget | RGPosition) {
        devLog('[CreatingLinePlot][fire-event]onCreateLine:', from, to);
        const options = this.getOptions();
        const lineJson = json2Line(options.newLineTemplate, this.getOptions());
        const getTargetId = (target: RGNode | RGLineTarget | RGPosition | undefined) => {
            return target && 'id' in target ? target.id || '' : '';
        };
        if (options.newLineTemplate.isReverse) {// 当拖拽线条端点时，可能会使用isReverse属性让线条起点和终点被反转的情况，这里需要还原isReverse属性，确保数据中的线条都是正向的。
            lineJson.from = getTargetId(to);
            lineJson.to = getTargetId(from);
            lineJson.isReverse = undefined;
            [from, to] = [to, from];
        } else {
            lineJson.from = getTargetId(from);
            lineJson.to = getTargetId(to);
        }
        lineJson.disablePointEvent = false;
        const abortCreate = this.emitEvent(RGEventNames.beforeCreateLine, {lineJson, fromNode: from, toNode: to});
        devLog('[CreatingLinePlot]onCreateLine:abort-flag:', abortCreate);
        if (abortCreate === true) {
            devLog('[CreatingLinePlot]onCreateLine:abort!');
            return;
        }
        if (this._onCreateLineCallback) {
            devLog('[CreatingLinePlot]onCreateLine:callback');
            try {
                this._onCreateLineCallback(from, to, lineJson);
            } catch (e) {
                console.warn('[Custom Reject Connect By Throw Error:', e);
                return false;
            }
        }
        devLog('[CreatingLinePlot]onCreateLine:emitEvent');
        const rejectStop = this.emitEvent(RGEventNames.onLineBeCreated, {lineJson, fromNode: from, toNode: to});
        return rejectStop;
    }

    /**
     * User right-click context menu event
     * - Finally, you can get this event through the onContextmenu event, and you can get the position where the user right-clicked and the type of object clicked (canvas | line | node) and the object through this event.
     * @param e
     */
    onContextmenu(e: RGUserEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.stopCreatingLinePlot();
        let objectType: RGEventTargetType = 'canvas';
        const targetElement = this.getEventTargetElement(e);
        let object: RGNode | RGLine | undefined = this.isNode(targetElement);
        if (object) {
            objectType = 'node';
        } else {
            object = this.isLine(targetElement);
            if (object) {
                objectType = 'line';
            }
        }
        devLog('contextmenu:objectType', objectType, object);
        const clientXy = getClientCoordinate(e);
        const eventPositionOnCanvas = this.getCanvasXyByClientXy({
            x: clientXy.clientX,
            y: clientXy.clientY
        });
        const eventPositionOnView = this.getViewXyByCanvasXy(eventPositionOnCanvas)
        this.emitEvent(RGEventNames.onContextmenu, e, objectType, object, eventPositionOnCanvas, eventPositionOnView);
    }

    /**
     * Toggle fullscreen mode
     - If newValue is true, enter fullscreen mode
     - If newValue is false, exit fullscreen mode
     - If newValue is not provided, toggle fullscreen mode
     * @param newValue
     */
    async fullscreen(newValue?: boolean) {
        const options = this.getOptions();
        if (newValue !== undefined && newValue === options.fullscreen) {
            return;
        }
        devLog("fullscreen:newValue:", newValue);
        // console.log("fullscreen:newValue:", newValue);
        if (newValue === undefined) {
            newValue = !options.fullscreen;
        }
        let fullscreenElement = this.$dom;
        devLog('options.fullscreenElementXPath:', options.fullscreenElementXPath)
        if (options.fullscreenElementXPath) {
            fullscreenElement = document.querySelector(options.fullscreenElementXPath) || this.$dom;
        }
        await setFullscreen(fullscreenElement, newValue);
        this.dataProvider.updateOptions({ fullscreen: newValue });
        this.emitEvent(RGEventNames.onFullscreen, newValue);
        this._dataUpdated();
    }

    /**
     * User scroll mouse wheel event
     * - Supports touchpad and mouse wheel
     * - This event will determine whether to zoom the canvas or scroll the canvas based on whether the user presses the Ctrl/Cmd key and options.wheelEventAction
     * - When options.disableWheelEvent is true, there will be no response
     * @param e
     */
    onMouseWheel(e: WheelEvent) {
        const options = this.getOptions();
        if (!e.ctrlKey && !e.metaKey) {
            if (options.disableWheelEvent || options.wheelEventAction === 'none') {
                // e.cancelBubble = false;
                return true;
            }
        }
        try {
            // e.cancelBubble = true;
            e.preventDefault();
            e.stopPropagation();
        } catch (e) {
            // xxx
        }
        // 1. 获取基础值
        let { deltaX, deltaY, deltaMode } = e;

        // 2. 归一化：处理不同设备的滚动单位差异
        // deltaMode: 0 = 像素, 1 = 行, 2 = 页
        if (deltaMode === 1) {
            // 鼠标滚轮模式，通常乘以一个步长（例如 40px 或 100px）让它和触摸板体验接近
            deltaX *= 40;
            deltaY *= 40;
        } else if (deltaMode === 2) {
            // 页模式（极少见），乘以窗口高度
            deltaX *= 800;
            deltaY *= 800;
        }
        this._mouseWheelForce.x += deltaX;
        this._mouseWheelForce.y += deltaY;
        this._applyWheelEvent(e);
    }

    /**
     * @inner
     * @private
     */
    private _applyWheelEvent(e: WheelEvent) {
        clearTimeout(this._mouseWheelTimer);
        this._mouseWheelTimer = setTimeout(() => {
            // const moveX = Math.abs(this._mouseWheelForce.x) > 5 ? this._mouseWheelForce.x / 2 : this._mouseWheelForce.x;
            // const moveY = Math.abs(this._mouseWheelForce.y) > 5 ? this._mouseWheelForce.y / 2 : this._mouseWheelForce.y;
            const moveX = this._mouseWheelForce.x;
            const moveY = this._mouseWheelForce.y;
            this._onMouseWheel(e, moveX, moveY);
            this._mouseWheelForce.x -= moveX;
            this._mouseWheelForce.y -= moveY;
            this._mouseWheelEventPrevApplyTime = Date.now();
            if (Math.abs(this._mouseWheelForce.x) > 1 || Math.abs(this._mouseWheelForce.y) > 1) {
                this._applyWheelEvent(e);
            }
        }, (Date.now() - this._mouseWheelEventPrevApplyTime) > 50 ? 0 : 50);
    }
    private _mouseWheelTimer;
    private _mouseWheelEventPrevApplyTime = 0;
    private _mouseWheelForce = {x: 0, y: 0};

    /**
     * @inner
     * @private
     */
    private _onMouseWheel(e: WheelEvent, deltaX: number, deltaY: number) {
        const onCtrlKey = e.ctrlKey || e.metaKey;
        const options = this.getOptions();
        if (!onCtrlKey && options.wheelEventAction === 'scroll') {
            let force = Math.max(Math.abs(deltaX), Math.abs(deltaY));
            const forceX = deltaX / force;
            const forceY = deltaY / force;
            if (force > 200) {
                force = 200;
            }
            const buffX = options.mouseWheelSpeed / 10 * -forceX * force;
            const buffY = options.mouseWheelSpeed / 10 * -forceY * force;
            const abortZoom = this.emitEvent(RGEventNames.beforeScrollStart, buffX, buffY, e);
            devLog('[scroll]', 'abortScroll:', abortZoom);
            if (abortZoom === true) {
                return;
            }
            this.scrollView(buffX, buffY);
        } else if (!onCtrlKey && options.wheelEventAction === 'none') {

        } else {
            const userZoomCenter = {
                x: e.clientX,
                y: e.clientY
            };
            // const direction = deltaY === 0 ? 0 : deltaY > 0 ? -1 : 1;
            let buffAmount = options.mouseWheelSpeed / 20 * -deltaY;
            // 确保buffAmount不大于 50且不小于 -50
            buffAmount = Math.max(Math.min(buffAmount, 20), -20);
            // console.log('zoom:', buffAmount, deltaY);
            this.zoom(buffAmount, userZoomCenter, e);
        }
    }

    /**
     * Scroll the canvas
     * @param buffX - The amount to scroll
     * @param buffY - The amount to scroll
     */
    scrollView(buffX: number, buffY: number) {
        const options = this.getOptions();
        this.dataProvider.setCanvasOffset(options.canvasOffset.x + buffX, options.canvasOffset.y + buffY);
        this._updateEditingControllerView();
        this.updateShouldRenderGraphData();
        this._dataUpdated();
    }

    /**
     * @inner
     * @private
     */
    private onLineDragStart(line: RGLine, e: RGUserEvent) {
        devLog('onLineDragStart...');
        const link = this.getLinkByLine(line)!;
        const node1BasePosition: RGPosition = {x: link.fromNode.x, y: link.fromNode.y};
        const node2BasePosition: RGPosition = {x: link.toNode.x, y: link.toNode.y};
        const draggingCallback = (moved_x: number, moved_y: number, basePosition: RGPosition, baseEventPosition: RGPosition, e_move: RGUserEvent) => {
            const scale = this.dataProvider.getCanvasScale();
            link.fromNode.x = node1BasePosition.x + moved_x / scale;
            link.fromNode.y = node1BasePosition.y + moved_y / scale;
            link.toNode.x = node2BasePosition.x + moved_x / scale;
            link.toNode.y = node2BasePosition.y + moved_y / scale;
            this._updateEditingControllerView();
            this._dataUpdated();
        };
        RGDragUtils.startDrag(e, {x: 0, y: 0}, (...args) => {
            this.onLineDragEnd(...args);
        }, draggingCallback);
    }

    onLineDragEnd(x_buff: number, y_buff: number, e: RGUserEvent) {
        devLog('onLineDragEnd');
        this.updateElementLines();
    }

    /**
     * User Start Drag Canvas
     * - This method will determine whether to create a selection area or move the canvas based on whether the user is holding down the Shift key or the configuration item options.dragEventAction.
     * - When options.dragEventAction is set to 'none', clicking and dragging on the canvas will only trigger a click event and will not create a selection area or move the canvas.
     * @param e
     */
    onCanvasDragStart(e: RGUserEvent) {
        // console.log('mouseLikeEvent.button:', e.button);
        // if (isRightMouseEvent(e)) {
        //     return;
        // }
        if (isInputFocused(e)) {
            return;
        }
        if (this.getEventTargetElement(e)?.closest('.rg-line-peel')) {
            return;
        }
        const options = this.getOptions();
        if (this.dataProvider.isPerformanceMode()) {
            if (options.editingController.nodes.length > 0) {
                const node = this.getNodeAtEvent(e);
                if (node) {
                    this.onNodeDragStart(node, e);
                    return;
                }
            }
        }
        if (options.dragEventAction === 'none') {
            this.onCanvasClick(e);
            return;
        }
        // e.preventDefault();
        // e.stopPropagation();
        if (options.dragEventAction === 'selection' || e.shiftKey) {
            this.startCreateSelection(e);
            // RGEffectUtils.startDrag(e, {x:0, y: 0}, this.onDragEnd, null);
            return;
        }
        // Drag line impl will move to EditingLineController
        if (!options.disableDragLine) {
            const line = this.isLine(this.getEventTargetElement(e));
            if (line) {
                this.onLineDragStart(line, e);
                return;
            }
        }
        this.startMoveCanvas(e);
    }

    /**
     * User Start Move Canvas
     *
     * @param e
     * @param forceStartMove
     */
    startMoveCanvas(e: RGUserEvent, forceStartMove = false) {
        let draggingCallback: RGDraggingCallback;
        if (isSupportTouch(e)) {
            type TouchGestureMode = 'pan' | 'pinch';
            const pinchZoomDamping = 0.85;
            const pinchDistanceDeadzone = 6;
            const pinchMidpointDeadzone = 2;
            let touchGestureMode: TouchGestureMode | undefined;
            let panStartTouch: RGPosition | undefined;
            let panStartCanvasOffset: RGPosition | undefined;
            let pinchStartMidpointView: RGPosition | undefined;
            let pinchStartCanvasOffset: RGPosition | undefined;
            let pinchStartDistance = 0;
            let pinchStartZoom = 100;
            const getTouchList = (event: RGUserEvent) => {
                if ('touches' in event && event.touches.length > 0) {
                    return event.touches;
                }
                if ('targetTouches' in event && event.targetTouches.length > 0) {
                    return event.targetTouches;
                }
                return undefined;
            };
            const getTouchPosition = (touch: Touch): RGPosition => {
                return {
                    x: touch.clientX,
                    y: touch.clientY
                };
            };
            const getDistance = (point1: RGPosition, point2: RGPosition) => {
                return Math.hypot(point2.x - point1.x, point2.y - point1.y);
            };
            const getMidpoint = (point1: RGPosition, point2: RGPosition): RGPosition => {
                return {
                    x: (point1.x + point2.x) / 2,
                    y: (point1.y + point2.y) / 2
                };
            };
            const beginPan = (touch: Touch, initialBase?: {touch: RGPosition, offset: RGPosition}) => {
                touchGestureMode = 'pan';
                if (initialBase) {
                    panStartTouch = {
                        x: initialBase.touch.x,
                        y: initialBase.touch.y
                    };
                    panStartCanvasOffset = {
                        x: initialBase.offset.x,
                        y: initialBase.offset.y
                    };
                } else {
                    panStartTouch = getTouchPosition(touch);
                    const options = this.getOptions();
                    panStartCanvasOffset = {
                        x: options.canvasOffset.x,
                        y: options.canvasOffset.y
                    };
                }
            };
            const beginPinch = (touch1: Touch, touch2: Touch) => {
                touchGestureMode = 'pinch';
                const point1 = getTouchPosition(touch1);
                const point2 = getTouchPosition(touch2);
                const options = this.getOptions();
                pinchStartDistance = getDistance(point1, point2);
                pinchStartZoom = options.canvasZoom;
                pinchStartCanvasOffset = {
                    x: options.canvasOffset.x,
                    y: options.canvasOffset.y
                };
                pinchStartMidpointView = this.getViewXyByClientXy(getMidpoint(point1, point2));
            };
            draggingCallback = (x_buff: number, y_buff: number, basePosition: RGPosition, baseEventPosition: RGPosition, $draggingEvent: RGUserEvent) => {
                const touches = getTouchList($draggingEvent);
                if (!touches || touches.length === 0) {
                    return;
                }
                if ($draggingEvent.cancelable) {
                    $draggingEvent.preventDefault();
                }
                if (touches.length > 1) {
                    const touchPointer1 = touches[0];
                    const touchPointer2 = touches[1];
                    if (touchGestureMode !== 'pinch') {
                        beginPinch(touchPointer1, touchPointer2);
                    }
                    const point1 = getTouchPosition(touchPointer1);
                    const point2 = getTouchPosition(touchPointer2);
                    const currentDistance = getDistance(point1, point2);
                    if (!pinchStartMidpointView || !pinchStartCanvasOffset || pinchStartDistance <= 0 || currentDistance <= 0) {
                        beginPinch(touchPointer1, touchPointer2);
                        return;
                    }
                    const currentMidpointView = this.getViewXyByClientXy(getMidpoint(point1, point2));
                    const distanceOffset = currentDistance - pinchStartDistance;
                    const midpointOffsetX = currentMidpointView.x - pinchStartMidpointView.x;
                    const midpointOffsetY = currentMidpointView.y - pinchStartMidpointView.y;
                    if (Math.abs(distanceOffset) < pinchDistanceDeadzone &&
                        Math.abs(midpointOffsetX) < pinchMidpointDeadzone &&
                        Math.abs(midpointOffsetY) < pinchMidpointDeadzone) {
                        return;
                    }
                    const rawZoomRatio = currentDistance / pinchStartDistance;
                    const dampedZoomRatio = Math.pow(rawZoomRatio, pinchZoomDamping);
                    const newZoom = pinchStartZoom * dampedZoomRatio;
                    const oldScale = pinchStartZoom / 100;
                    const newScale = this.getClampedZoom(newZoom) / 100;
                    const newX = currentMidpointView.x - (pinchStartMidpointView.x - pinchStartCanvasOffset.x) * (newScale / oldScale);
                    const newY = currentMidpointView.y - (pinchStartMidpointView.y - pinchStartCanvasOffset.y) * (newScale / oldScale);
                    this.setZoomAndOffset(newZoom, {
                        x: newX,
                        y: newY
                    });
                } else {
                    const touchPointer = touches[0];
                    if (touchGestureMode !== 'pan') {
                        beginPan(touchPointer, touchGestureMode === undefined ? {
                            touch: baseEventPosition,
                            offset: basePosition
                        } : undefined);
                    }
                    if (!panStartTouch || !panStartCanvasOffset) {
                        beginPan(touchPointer);
                        return;
                    }
                    const currentTouch = getTouchPosition(touchPointer);
                    const buffX = currentTouch.x - panStartTouch.x;
                    const buffY = currentTouch.y - panStartTouch.y;
                    const newX = panStartCanvasOffset.x + buffX;
                    const newY = panStartCanvasOffset.y + buffY;
                    this.onCanvasDragging(newX, newY, buffX, buffY);
                    this._updateEditingControllerView();
                    this._dataUpdated();
                }
            };
        } else {
            draggingCallback = (buffX: number, buffY: number, basePosition: RGPosition, baseEventPosition: RGPosition, $draggingEvent: RGUserEvent) => {
                const newX = basePosition.x + buffX;
                const newY = basePosition.y + buffY;
                this.onCanvasDragging(newX, newY, buffX, buffY);
                this._updateEditingControllerView();
                this._dataUpdated();
            };
        }
        const options = this.getOptions();
        const startPosition = {
            x: options.canvasOffset.x,
            y: options.canvasOffset.y,
        }
        let dragStarted = forceStartMove;
        RGDragUtils.startDrag(e, startPosition, (x_buff: number, y_buff: number, e: RGUserEvent) => {
            this.onCanvasDragStop(x_buff, y_buff, e);
        }, (offsetX: number, offsetY: number, basePosition: RGPosition, baseEventPosition: RGPosition, $draggingEvent: RGUserEvent) => {
            const touchCount = ('touches' in $draggingEvent && $draggingEvent.touches) ? $draggingEvent.touches.length : 0;
            if (!dragStarted) {
                if (touchCount > 1 || (Math.abs(offsetX) + Math.abs(offsetY)) > 4) {
                    this.emitEvent(RGEventNames.onCanvasDragStart, basePosition, baseEventPosition, $draggingEvent);
                    dragStarted = true;
                }
            }
            if (dragStarted) {
                draggingCallback(offsetX, offsetY, basePosition, baseEventPosition, $draggingEvent);
            }
        });
    }

    /**
     * @inner
     * @private
     */
    protected onCanvasDragging(newX: number, newY: number, buffX: number, buffY: number) {
        const customPosition = this.emitEvent(RGEventNames.onCanvasDragging, newX, newY, buffX, buffY);
        if (customPosition === false) {
            return;
        }
        if (customPosition) {
            (typeof customPosition.x === 'number') && (newX = customPosition.x);
            (typeof customPosition.y === 'number') && (newY = customPosition.y);
        }
        this.dataProvider.setCanvasOffset(newX, newY);
    }
    /**
     * @inner
     * @param e
     */
    private onCanvasDragStop(x_buff: number, y_buff: number, e: RGUserEvent) {
        const options = this.getOptions();
        if (options.creatingSelection) {
            this.dataProvider.updateOptions({
                creatingSelection: false
            });
            this.onCanvasSelectionEnd(options.selectionView, e);
            return;
        }
        if (Math.abs(x_buff) + Math.abs(y_buff) < 4) {
            devLog('[canvas]onDragEnd as click2');
            this._dataUpdated();
            this.onCanvasClick(e);
            return;
        } else {
            devLog('[canvas]onDragEnd');
            this.onCanvasDragEnd(e);
        }
    }

    /**
     * @inner
     * @param e
     */
    private startCreateSelection(e: RGUserEvent) {
        const updateSelectionController = () => {
            if (!draggingEvent || stoped) {
                return;
            }
            const draggingEventXy = this.getViewXyByEvent(draggingEvent);
            const canvasMoved = this.canvasAutoMoving(draggingEventXy);
            if (canvasMoved) {
                this._updateEditingControllerView();
            }
            const startViewXy = this.getViewXyByCanvasXy(startEventCanvasXy);
            // const eventCanvasXy = this.getCanvasXyByViewXy(draggingEventXy);
            // const offsetXOnCanvas = (eventCanvasXy.x - startEventCanvasXy.x);
            // const offsetYOnCanvas = (eventCanvasXy.y - startEventCanvasXy.y);
            const moved_x = draggingEventXy.x - startViewXy.x;
            const moved_y = draggingEventXy.y - startViewXy.y;
            if (moved_x < 0) {
                this.dataProvider.updateOptions({
                    selectionView: {
                        ...this.getOptions().selectionView,
                        x: startViewXy.x + moved_x,
                        width: Math.abs(moved_x)
                    }
                });
            } else {
                this.dataProvider.updateOptions({
                    selectionView: {
                        ...this.getOptions().selectionView,
                        x: startViewXy.x ,
                        width: Math.abs(moved_x)
                    }
                });
            }
            if (moved_y < 0) {
                this.dataProvider.updateOptions({
                    selectionView: {
                        ...this.getOptions().selectionView,
                        y: startViewXy.y + moved_y,
                        height: Math.abs(moved_y)
                    }
                });
            } else {
                this.dataProvider.updateOptions({
                    selectionView: {
                        ...this.getOptions().selectionView,
                        y: startViewXy.y,
                        height: moved_y
                    }
                });
            }
            this._dataUpdated();
        }
        let draggingEvent: RGUserEvent;
        let started = false;
        let stoped = true;
        const startEventCanvasXy = this.getCanvasXyByViewXy(this.getViewXyByEvent(e));
        const movingLoop = () => {
            updateSelectionController();
            this._canvasMovingTimer = requestAnimationFrame(movingLoop);
        }
        const draggingCallback = (_moved_x: number, _moved_y: number, basePosition: RGPosition, baseEventPosition: RGPosition, $draggingEvent: RGUserEvent) => {
            draggingEvent = $draggingEvent;
            if (!started) {
                if ((Math.abs(_moved_x) + Math.abs(_moved_y)) > 6) {
                    started = true;
                    stoped = false;
                    const options = this.getOptions();
                    // options.selectionView.width = 5;
                    // options.selectionView.height = 5;
                    this.dataProvider.updateOptions({
                        creatingSelection: true,
                        selectionView: {
                            ...options.selectionView,
                            width: 5,
                            height: 5
                        }
                    });
                    if (this._canvasMovingTimer) cancelAnimationFrame(this._canvasMovingTimer);
                    this._canvasMovingTimer = requestAnimationFrame(movingLoop);
                }
            } else  {
                draggingEvent = $draggingEvent;
                // updateSelectionController();
            }
            this._dataUpdated();
        };
        RGDragUtils.startDrag(e, {x: 0, y: 0}, (...args) => {
            stoped = true;
            if (this._canvasMovingTimer) cancelAnimationFrame(this._canvasMovingTimer);
            this.onCanvasDragStop(...args);
        }, draggingCallback);
    }

    private _fullscreenchangeHandler;

    /**
     * Monitor fullscreen changes
     * @inner
     * @private
     */
    protected addFullscreenListener() {
        this._fullscreenchangeHandler = () => {
            let graphIsFullscreen = false;
            if (document.fullscreenElement) {
                devLog('div entered fullscreen mode', document.fullscreenElement);
                if (this.$dom === document.fullscreenElement) {
                    devLog('relation-graph is fullscreen!');
                    graphIsFullscreen = true;
                }
            } else {
                devLog('div exited fullscreen mode');
            }
            const graphFullscreenStatusChanged = graphIsFullscreen !== this.getOptions().fullscreen;
            if (graphFullscreenStatusChanged) {
                this.dataProvider.updateOptions({
                    fullscreen: graphIsFullscreen
                });
                this._dataUpdated();
                setTimeout(async () => {
                    this.resetViewSize();
                    this._moveToCenter();
                    this.zoomToFit();
                    devLog('relation-graph reset complete!');
                }, 500);
            }
        };
        document.addEventListener('fullscreenchange', this._fullscreenchangeHandler);
    }

    /**
     * Remove fullscreen change monitoring
     * @inner
     * @private
     */
    protected removeFullscreenListener() {
        document.addEventListener('fullscreenchange', this._fullscreenchangeHandler);
    }
    /**
     * Default line connect end handler for <RGConnectTarget /> component
     * - This method does not make any data changes. Users need to obtain the line information through the onLineConnectEnd event of the <RGConnectTarget /> component, and use the graphInstance.addLines([newLineJson]) method to complete the data change.
     *
     * @inner
     * @private
     */
    defaultLineConnectEndHandler(from: RGNode|RGLineTarget | RGPosition, to: RGNode|RGLineTarget | RGPosition, newLine?: JsonLine) {
        devLog('defaultLineConnectEndHandler:', from, to, newLine);
        // if (to.id) { // 创建的连线的起点一定是节点，但终点可以是空白处，终点没有选择成节点时to不是一个节点，to.id不会有值，这里做了判断，只处理to为节点的情况
        //     // console.log('onCreateLine:', from.text, to.text, newLineTemplate.fromJunctionPoint, newLineTemplate.toJunctionPoint);
        //     const newLineJson = Object.assign({}, newLine, {
        //         from: from.id,
        //         to: to.id
        //     });
        //     this.addLines([newLineJson]);
        //     this._dataUpdated();
        // }
    }

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
    defaultLineVertexBeChangedHandler(from: RGNode | RGLineTarget | RGPosition, to: RGNode | RGLineTarget | RGPosition, newLine?: JsonLine) {
        devLog('defaultLineVertexBeChangedHandler:', (newLine as RGLine | undefined)?.isReverse);
        // if (to.id) { // 创建的连线的起点一定是节点，但终点可以是空白处，终点没有选择成节点时to不是一个节点，to.id不会有值，这里做了判断，只处理to为节点的情况
        //   // console.log('defaultLineVertexBeChangedHandler:', from, to, newLine);
        //   let fromId = from.id;
        //   let toId = to.id;
        //   if (newLine && newLine.isReverse) {
        //     fromId = to.id;
        //     toId = from.id;
        //     devLog('defaultLineVertexBeChangedHandler:reset:isReverse!');
        //     newLine.isReverse = undefined;
        //   }
        //   // const newLineJson = Object.assign(newLine || {}, {
        //   //   from: fromId,
        //   //   disablePointEvent: false,
        //   //   to: toId
        //   // });
        //   // this.addLines([newLineJson]);
        //   // this._dataUpdated();
        // }
    }
    /**
     * Sleep for a specified amount of time
     * @param time - The time to sleep in milliseconds
     */
    async sleep(time: number) {
        await sleep(time);
    }

    /**
     * This method is called by the force layout engine to update the view after each iteration of the force layout calculation is completed.
     * @inner
     * @private
     */
    forceLayoutTickCallback() {
        this._updateEditingControllerView();
        this.dataProvider.updateShouldRenderGraphData();
        this._dataUpdated();
    }
}
