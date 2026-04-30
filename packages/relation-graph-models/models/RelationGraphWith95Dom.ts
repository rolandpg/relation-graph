import type {RGCoordinate, RGNode, RGRectTarget} from '../../types';
import {RGEventNames} from '../../types';
import {devLog, isInputFocused} from "../utils/RGCommon";
import {analyzeRenderedGraphByDom, type RGAnalyzeRenderedGraphOptions, type RGAnalyzeRenderedGraphResult} from "../utils/RGClassAndRender";
import {RelationGraphWith93Image} from "./RelationGraphWith93Image";

type RGNativeGestureEvent = Event & {
    scale?: number;
};
/**
 * Enhancement class for relation-graph component to interact with DOM, monitor changes in the view and elements within the view, and respond accordingly
 */
export class RelationGraphWith95Dom extends RelationGraphWith93Image {

    protected resizeObserver: ResizeObserver;
    protected resizeListenerMap = new WeakMap();
    protected domToNodeIdMap = new WeakMap<Element, string>();
    protected connectTargetHostMutationObserverMap = new Map<Element, MutationObserver>();
    private _trackpadGestureActive = false;
    private _trackpadGestureStartZoom = 100;
    private _trackpadGestureAnchorView: RGCoordinate | undefined;
    private _trackpadGestureStartOffset: RGCoordinate | undefined;
    private _mouseMoveHandler?: (e: MouseEvent) => void;
    private _gestureStartHandler?: (e: Event) => void;
    private _gestureChangeHandler?: (e: Event) => void;
    private _gestureEndHandler?: (e: Event) => void;
    private _lastMouseClientXy?: RGCoordinate;

    constructor() {
        super();
    }

    /**
     * [Used internally by relation-graph] This method will be called after the RelationGraph component is mounted, to facilitate DOM operations in the JS instance object (this will only obtain visual information of the DOM and monitor changes in size and position).
     * @param relationGraphDom:HTMLDivElement RelationGraph container DOM
     */
    setDom(relationGraphDom: HTMLDivElement) {
        devLog('relation-graph mounted on:', this.instanceId, relationGraphDom);
        this.$dom = relationGraphDom;
    }
    /**
     * [Used internally by relation-graph] This method will be called after the RelationGraph component's canvas element is mounted, to facilitate DOM operations in the JS instance object (this will only obtain visual information of the DOM and monitor changes in size and position).
     * @param relationGraphDom:HTMLDivElement canvas DOM
     */
    setCanvasDom(canvasDom: HTMLDivElement) {
        devLog('relation-graph canvas dom mounted!');
        this.$canvasDom = canvasDom;
        this.$lineTextContainer4NormalLine = null;
        this.$lineTextContainer4FakeLine = null;
        this.reinitMutationObservers();
        this.getLineTextContainer({isFakeLine: true});
        this.getLineTextContainer({isFakeLine: false});
    }

    /**
     * Analyze the currently rendered graph DOM and classify node styles, node render methods, and line styles.
     * - This method only relies on the final DOM/CSS result, so it can capture styles from both data-driven configuration and external CSS overrides.
     * - The returned nodes/lines also include merged JsonNode/JsonLine effective values based on the current graph options.
     * - It is only valid when the graph is rendered with real DOM nodes/lines. In performance mode or easy-view mode it will return a degraded result.
     */
    async analyzeRenderedGraph(options: RGAnalyzeRenderedGraphOptions = {}): Promise<RGAnalyzeRenderedGraphResult> {
        return analyzeRenderedGraphByDom({
            dom: this.$dom,
            canvasDom: this.$canvasDom,
            instanceId: this.instanceId,
            graphOptions: this.getOptions(),
            performanceMode: this.dataProvider.isPerformanceMode(),
            showEasyView: this.getOptions().showEasyView,
            sleep: (time: number) => this.sleep(time),
            getNodeById: (id: string) => this.getNodeById(id),
            getLineById: (id: string) => this.getLineById(id),
            getLinkByLineId: (id: string) => this.getLinkByLineId(id),
            getFakeLineById: (id: string) => this.getFakeLineById(id),
        }, options);
    }

    /**
     * @deprecated Use analyzeRenderedGraph instead.
     */
    async getClassAndRender(options: RGAnalyzeRenderedGraphOptions = {}): Promise<RGAnalyzeRenderedGraphResult> {
        return this.analyzeRenderedGraph(options);
    }

    /**
     * @inner
     * @private
     */
    private getResizeObserver() {
        if (!this.resizeObserver) {
            this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
                for (const entry of entries) {
                    const resizeHandler = this.resizeListenerMap.get(entry.target);
                    if (resizeHandler) {
                        if (entry.borderBoxSize) {
                            resizeHandler(entry.borderBoxSize[0].inlineSize, entry.borderBoxSize[0].blockSize);
                        } else {
                            resizeHandler(entry.target.clientWidth, entry.target.clientHeight);
                        }
                    } else {
                        if (entry.borderBoxSize) {
                            this._onNodeDomResize(entry.target, entry.borderBoxSize[0].inlineSize, entry.borderBoxSize[0].blockSize);
                        } else {
                            this._onNodeDomResize(entry.target, entry.target.clientWidth, entry.target.clientHeight);
                        }
                    }
                }
            });
        }
        return this.resizeObserver;
    }
    /**
     * @inner
     * @private
     */
    protected initDom() {
        this.addResizeListener(this.$dom, (width, height) => {
            devLog('resizeListener:this.$dom');
            this.resetViewSize();
            this.updateEasyView();
            if (this._rgAsConnectArea) {
                this.updateCanvasConnectTargetsPosition('View Resize');
            }
            this._updateEditingLineView();
            this._updateEditingControllerView();
            this._dataUpdated();
            setTimeout(() => {
                devLog('resizeListener:updateShouldRenderGraphData');
                // this.zoom(-1);
                // this.zoom(1);
                this.emitEvent(RGEventNames.onViewResize, {width, height});
                this._dataUpdated();
            }, 500);
        });
        // Add keyboard event listeners
        if (!this._rgAsConnectArea) {
            this.removeKeyboardListener();
            this.addKeyboardListener();
            this.removeTrackpadGestureListeners();
            this.addTrackpadGestureListeners();
        }
    }
    updateCanvasConnectTargetsPosition(reson = 'api') {
        this.updateConnectTargetsOnCanvas(reson, this.$dom.querySelector('.rg-canvas-slot-behind'));
        this.updateConnectTargetsOnCanvas(reson, this.$dom.querySelector('.rg-canvas-slot-above'));
        // const canvasZoom = this.getOptions().canvasZoom;
        // this.setZoom(canvasZoom - 1);
        // this.setZoom(canvasZoom);
        // this._dataUpdated();
    }
    private mutationObserver4Nodes?: MutationObserver;
    private mutationObserver4CanvasSlotBehind?: MutationObserver;
    private mutationObserver4CanvasSlotAbove?: MutationObserver;
    /**
     * @inner
     * @private
     */
    private reinitMutationObservers() {
        this.destroyMutationObserver();
        // console.log('reinitMutationObservers', this.$canvasDom);
        const nodesDivDom = this.$canvasDom.querySelector('.rg-nodes-container-wrapper');
        if (nodesDivDom) {
            this.mutationObserver4Nodes = new MutationObserver((mutations: MutationRecord[]) => {
                if (this.dataProvider.getConnectTargets().length > 0) {
                    for (const mutation of mutations) {
                        const nodeEl = this.getNodeElByChildrenTarget(mutation.target);
                        const nodeId = this.domToNodeIdMap.get(nodeEl);
                        if (nodeId) {
                            this.updateConnectTargetsOnNode('Mutation', nodeId, nodeEl);
                        } else {
                            // console.error('MutationObserver:error:Can not find node for mutation target:', mutation.target);
                        }
                    }
                }
            });
            this.mutationObserver4Nodes.observe(nodesDivDom, {
                // attributeFilter: [],
                childList: true, // observe direct children additions/removals
                subtree: true,   // observe all descendants
                characterData: true // observe text changes
            });
        } else {
            throw new Error('MutationObserver:error:Can not find: .rg-nodes-container-wrapper');
        }
        const canvasSlotBehindDom = this.$canvasDom.parentElement.querySelector('.rg-canvas-slot-behind');
        if (canvasSlotBehindDom) {
            this.mutationObserver4CanvasSlotBehind = new MutationObserver((mutations: MutationRecord[]) => {
                // console.warn(`MutationObserver:updateConnectTargetsOnCanvas:mutations:`, mutations);
                this.updateConnectTargetsOnCanvas('CanvasBehind-Mutation', canvasSlotBehindDom);
            });
            this.mutationObserver4CanvasSlotBehind.observe(canvasSlotBehindDom, {
                childList: true, // observe direct children additions/removals
                subtree: true,   // observe all descendants
                characterData: true, // observe text changes
            });
            {
                // // For Web Components using slots, we need to monitor the assigned elements of the slots
                // const slots = canvasSlotBehindDom.querySelectorAll('slot');
                // console.log('canvasSlotBehindDom: slots:', slots.length);
                // // clearInterval(this._updateCanvasConnectTargetsTask);
                // // if (slots.length > 0) {
                // //     this._updateCanvasConnectTargetsTask = setInterval(() => {
                // //         console.warn(`MutationObserver:_updateCanvasConnectTargetsTask:`);
                // //         this.updateConnectTargetsOnCanvas('CanvasBehind-timer', canvasSlotBehindDom);
                // //     }, 3000);
                // // }
                // for (const slotElement of slots) {
                //     const assignedElements = slotElement.assignedElements();
                //     assignedElements.forEach(element => {
                //         console.log('#######observe:', element);
                //         // 对每一个被分配进来的元素进行监听
                //         // config 根据你的需求调整：childList, attributes, subtree, characterData
                //         this.mutationObserver4CanvasSlotBehind!.observe(element, {
                //             characterData: true,
                //             childList: true,
                //             subtree: true
                //         });
                //     });
                // }
            }
        } else {
            throw new Error('MutationObserver:error:Can not find: .rg-canvas-slot-behind');
        }
        const canvasSlotAboveDom = this.$canvasDom.parentElement.querySelector('.rg-canvas-slot-above');
        if (canvasSlotAboveDom) {
            this.mutationObserver4CanvasSlotAbove = new MutationObserver((mutations: MutationRecord[]) => {
                this.updateConnectTargetsOnCanvas('CanvasAbove-Mutation', canvasSlotAboveDom);
            });
            this.mutationObserver4CanvasSlotAbove.observe(canvasSlotAboveDom, {
                childList: true, // observe direct children additions/removals
                subtree: true,   // observe all descendants
                characterData: true // observe text changes
            });
        }
    }
    private _updateCanvasConnectTargetsTask;
    /**
     * @inner
     * @private
     */
    protected destroyMutationObserver() {
        if (this.mutationObserver4Nodes) {
            this.mutationObserver4Nodes.disconnect();
            this.mutationObserver4Nodes = undefined;
        }
        if (this.mutationObserver4CanvasSlotBehind) {
            this.mutationObserver4CanvasSlotBehind.disconnect();
            this.mutationObserver4CanvasSlotBehind = undefined;
        }
        if (this.mutationObserver4CanvasSlotAbove) {
            this.mutationObserver4CanvasSlotAbove.disconnect();
            this.mutationObserver4CanvasSlotAbove = undefined;
        }
        for (const observer of this.connectTargetHostMutationObserverMap.values()) {
            observer.disconnect();
        }
        this.connectTargetHostMutationObserverMap.clear();
    }
    private onKeyDownHanlder;
    private onKeyUpHanlder;
    private getTrackpadGestureAnchorView() {
        const viewRectBox = this.getViewBoundingClientRect();
        if (!viewRectBox) {
            return {
                x: 0,
                y: 0
            };
        }
        if (this._lastMouseClientXy) {
            return this.getViewXyByClientXy({
                x: this._lastMouseClientXy.x,
                y: this._lastMouseClientXy.y
            });
        }
        return {
            x: viewRectBox.width / 2,
            y: viewRectBox.height / 2
        };
    }

    protected addTrackpadGestureListeners() {
        this._mouseMoveHandler = (e: MouseEvent) => {
            this._lastMouseClientXy = {
                x: e.clientX,
                y: e.clientY
            };
        };
        this._gestureStartHandler = (event: Event) => {
            const e = event as RGNativeGestureEvent;
            if (isInputFocused(e as unknown as TouchEvent)) return;
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            this._trackpadGestureActive = true;
            this._trackpadGestureStartZoom = this.getOptions().canvasZoom;
            this._trackpadGestureStartOffset = {
                x: this.getOptions().canvasOffset.x,
                y: this.getOptions().canvasOffset.y
            };
            this._trackpadGestureAnchorView = this.getTrackpadGestureAnchorView();
        };
        this._gestureChangeHandler = (event: Event) => {
            const e = event as RGNativeGestureEvent;
            if (!this._trackpadGestureActive || !this._trackpadGestureAnchorView || !this._trackpadGestureStartOffset) {
                return;
            }
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            const scale = e.scale;
            if (!scale || !Number.isFinite(scale) || scale <= 0) {
                return;
            }
            const gestureScaleDeadzone = 0.01;
            if (Math.abs(scale - 1) < gestureScaleDeadzone) {
                return;
            }
            const newZoom = this._trackpadGestureStartZoom * scale;
            const oldScale = this._trackpadGestureStartZoom / 100;
            const newScale = this.getClampedZoom(newZoom) / 100;
            const newX = this._trackpadGestureAnchorView.x - (this._trackpadGestureAnchorView.x - this._trackpadGestureStartOffset.x) * (newScale / oldScale);
            const newY = this._trackpadGestureAnchorView.y - (this._trackpadGestureAnchorView.y - this._trackpadGestureStartOffset.y) * (newScale / oldScale);
            this.setZoomAndOffset(newZoom, {
                x: newX,
                y: newY
            });
        };
        this._gestureEndHandler = (event: Event) => {
            const e = event as RGNativeGestureEvent;
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            this._trackpadGestureActive = false;
            this._trackpadGestureAnchorView = undefined;
            this._trackpadGestureStartOffset = undefined;
        };
        this.$dom.addEventListener('mousemove', this._mouseMoveHandler);
        this.$dom.addEventListener('gesturestart', this._gestureStartHandler);
        this.$dom.addEventListener('gesturechange', this._gestureChangeHandler);
        this.$dom.addEventListener('gestureend', this._gestureEndHandler);
    }

    protected removeTrackpadGestureListeners() {
        if (this._mouseMoveHandler) this.$dom.removeEventListener('mousemove', this._mouseMoveHandler);
        if (this._gestureStartHandler) this.$dom.removeEventListener('gesturestart', this._gestureStartHandler);
        if (this._gestureChangeHandler) this.$dom.removeEventListener('gesturechange', this._gestureChangeHandler);
        if (this._gestureEndHandler) this.$dom.removeEventListener('gestureend', this._gestureEndHandler);
        this._trackpadGestureActive = false;
        this._trackpadGestureAnchorView = undefined;
        this._trackpadGestureStartOffset = undefined;
        this._mouseMoveHandler = undefined;
        this._gestureStartHandler = undefined;
        this._gestureChangeHandler = undefined;
        this._gestureEndHandler = undefined;
    }

    /**
     * @inner
     * @private
     */
    protected addKeyboardListener() {
        this.onKeyDownHanlder = (e: KeyboardEvent) => {
            // console.log('onKeyDown:', e.keyCode, e.code, e.ctrlKey, e.metaKey);
            if (isInputFocused(e)) return;
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.getOptions().canvasMoveMode === false) {
                    this.setCanvasMoveMode(true);
                }
            }
            this.emitEvent(RGEventNames.onKeyboardDown, e);
        };

        this.onKeyUpHanlder = (e: KeyboardEvent) => {
            // console.log('onKeyUp:', e.keyCode, e.code);
            if (isInputFocused(e)) return;
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.getOptions().canvasMoveMode === true) {
                    this.setCanvasMoveMode(false);
                }
            }
            this.emitEvent(RGEventNames.onKeyboardUp, e);
        };
        this.$dom.addEventListener('keydown', this.onKeyDownHanlder);
        this.$dom.addEventListener('keyup', this.onKeyUpHanlder);
    }

    /**
     * @inner
     * @private
     */
    protected removeKeyboardListener() {
        if (this.onKeyDownHanlder) this.$dom.removeEventListener('keydown', this.onKeyDownHanlder);
        if (this.onKeyUpHanlder) this.$dom.removeEventListener('keyup', this.onKeyUpHanlder);
    }

    /**
     * Monitor the size changes of a DOM element using ResizeObserver
     * @inner
     * @param dom
     * @param callback
     * @protected
     */
    protected addResizeListener(dom: Element, callback: (width: number, height: number) => void) {
        this.resizeListenerMap.set(dom, callback);
        this.getResizeObserver().observe(dom);
    }
    protected _observeConnectTargetElement(targetId: string, runtime: { hostEl: Element; measureEl: Element; }) {
        this.addResizeListener(runtime.measureEl, () => {
            const currentRuntime = this.getConnectTargetRuntimeById(targetId);
            if (!currentRuntime) {
                return;
            }
            this.updateConnectTargetById('Target-Resize', targetId, currentRuntime.measureEl);
        });
        if (this.connectTargetHostMutationObserverMap.has(runtime.hostEl)) {
            return;
        }
        const observer = new MutationObserver(() => {
            this.refreshConnectTargetRuntimeById('Target-HostMutation', targetId);
        });
        observer.observe(runtime.hostEl, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });
        this.connectTargetHostMutationObserverMap.set(runtime.hostEl, observer);
    }
    protected _unobserveConnectTargetElement(_targetId: string, runtime: { hostEl: Element; measureEl: Element; }) {
        this.removeResizeListener(runtime.measureEl);
        const observer = this.connectTargetHostMutationObserverMap.get(runtime.hostEl);
        if (observer) {
            observer.disconnect();
            this.connectTargetHostMutationObserverMap.delete(runtime.hostEl);
        }
    }

    /**
     * Node DOM resize event handler
     * @inner
     * @param dom
     * @param width
     * @param height
     * @private
     */
    private _onNodeDomResize(dom: Element, width: number, height: number) {
        if (width === 0 || height === 0) {
            return;
        }
        const nodeId = this.domToNodeIdMap.get(dom);
        this._onNodeResize(dom, nodeId, width, height);
    }

    /**
     * Node DOM resize event handler
     * @inner
     * @param dom
     * @param node
     * @param width
     * @param height
     * @private
     */
    private _onNodeResize(dom: Element, nodeId: string, width: number, height: number) {
        if (width === 0 || height === 0) {
            return;
        }
        this.updateConnectTargetsOnNode('Node-Created', nodeId, dom);
        this.updateNodeOffsetSize(nodeId, width, height);
    }

    /**
     * [Used internally by relation-graph] This method is called when the Node component is mounted to monitor changes in the size of the Node's DOM element.
     * @param dom The DOM element corresponding to the Node component
     * @param node The JS data object of the Node
     * @inner
     */
    addNodeResizeListener(dom: HTMLElement, node: RGNode) {
        // console.error('addNodeResizeListener:', node.id);
        this.domToNodeIdMap.set(dom, node.id);
        // console.log('addNodeResizeListener:', node.id);
        this._onNodeResize(dom, node.id, dom.offsetWidth, dom.offsetHeight);
        this.getResizeObserver().observe(dom);
    }

    /**
     * [Used internally by relation-graph] This method is called when the Node component is destroyed to remove monitoring of the corresponding DOM element of the Node.
     * @param dom The DOM element corresponding to the Node component
     * @inner
     */
    removeNodeResizeListener(dom: HTMLElement) {
        this.domToNodeIdMap.delete(dom);
        if (dom) {
            this.getResizeObserver().unobserve(dom);
        } else {
            devLog('removeNodeResizeListener: dom is null or undefined!');
        }
    }

    /**
     * Remove size change monitoring for the DOM element
     * @param dom
     * @protected
     */
    protected removeResizeListener(dom: Element) {
        this.resizeListenerMap.delete(dom);
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(dom);
        }
    }

    /**
     * @inner
     * @protected
     */
    protected destroyResizeObserver() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
    private getCanvasSlotList() {
        return this.$dom.querySelectorAll('.rg-map > .rg-map-canvas > .rg-canvas-slot');
    }
    getCanvasSlotRectItems(): RGRectTarget[] {
        if (!this.$dom) return [];
        const canvasSlotList = this.getCanvasSlotList();
        const rectItems: RGRectTarget[] = [];
        for (const canvasSlot of Array.from(canvasSlotList)) {
            for (const item of Array.from(canvasSlot.children)) {
                const itemEl = item as HTMLDivElement;
                const rectItem: RGRectTarget = {
                    x: itemEl.offsetLeft || 0,
                    y: itemEl.offsetTop || 0,
                    nodeShape: 1,
                    el_W: itemEl.scrollWidth,
                    el_H: itemEl.scrollHeight
                };
                rectItems.push(rectItem);
            }
        }
        return rectItems;
    }
}
