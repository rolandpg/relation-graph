import { RGNode, RGRectTarget } from '../../types';
import { RGAnalyzeRenderedGraphOptions, RGAnalyzeRenderedGraphResult } from '../utils/RGClassAndRender';
import { RelationGraphWith93Image } from './RelationGraphWith93Image';
/**
 * Enhancement class for relation-graph component to interact with DOM, monitor changes in the view and elements within the view, and respond accordingly
 */
export declare class RelationGraphWith95Dom extends RelationGraphWith93Image {
    protected resizeObserver: ResizeObserver;
    protected resizeListenerMap: WeakMap<object, any>;
    protected domToNodeIdMap: WeakMap<Element, string>;
    protected connectTargetHostMutationObserverMap: Map<Element, MutationObserver>;
    private _trackpadGestureActive;
    private _trackpadGestureStartZoom;
    private _trackpadGestureAnchorView;
    private _trackpadGestureStartOffset;
    private _mouseMoveHandler?;
    private _gestureStartHandler?;
    private _gestureChangeHandler?;
    private _gestureEndHandler?;
    private _lastMouseClientXy?;
    constructor();
    /**
     * [Used internally by relation-graph] This method will be called after the RelationGraph component is mounted, to facilitate DOM operations in the JS instance object (this will only obtain visual information of the DOM and monitor changes in size and position).
     * @param relationGraphDom:HTMLDivElement RelationGraph container DOM
     */
    setDom(relationGraphDom: HTMLDivElement): void;
    /**
     * [Used internally by relation-graph] This method will be called after the RelationGraph component's canvas element is mounted, to facilitate DOM operations in the JS instance object (this will only obtain visual information of the DOM and monitor changes in size and position).
     * @param relationGraphDom:HTMLDivElement canvas DOM
     */
    setCanvasDom(canvasDom: HTMLDivElement): void;
    /**
     * Analyze the currently rendered graph DOM and classify node styles, node render methods, and line styles.
     * - This method only relies on the final DOM/CSS result, so it can capture styles from both data-driven configuration and external CSS overrides.
     * - The returned nodes/lines also include merged JsonNode/JsonLine effective values based on the current graph options.
     * - It is only valid when the graph is rendered with real DOM nodes/lines. In performance mode or easy-view mode it will return a degraded result.
     */
    analyzeRenderedGraph(options?: RGAnalyzeRenderedGraphOptions): Promise<RGAnalyzeRenderedGraphResult>;
    /**
     * @deprecated Use analyzeRenderedGraph instead.
     */
    getClassAndRender(options?: RGAnalyzeRenderedGraphOptions): Promise<RGAnalyzeRenderedGraphResult>;
    /**
     * @inner
     * @private
     */
    private getResizeObserver;
    /**
     * @inner
     * @private
     */
    protected initDom(): void;
    updateCanvasConnectTargetsPosition(reson?: string): void;
    private mutationObserver4Nodes?;
    private mutationObserver4CanvasSlotBehind?;
    private mutationObserver4CanvasSlotAbove?;
    /**
     * @inner
     * @private
     */
    private reinitMutationObservers;
    private _updateCanvasConnectTargetsTask;
    /**
     * @inner
     * @private
     */
    protected destroyMutationObserver(): void;
    private onKeyDownHanlder;
    private onKeyUpHanlder;
    private getTrackpadGestureAnchorView;
    protected addTrackpadGestureListeners(): void;
    protected removeTrackpadGestureListeners(): void;
    /**
     * @inner
     * @private
     */
    protected addKeyboardListener(): void;
    /**
     * @inner
     * @private
     */
    protected removeKeyboardListener(): void;
    /**
     * Monitor the size changes of a DOM element using ResizeObserver
     * @inner
     * @param dom
     * @param callback
     * @protected
     */
    protected addResizeListener(dom: Element, callback: (width: number, height: number) => void): void;
    protected _observeConnectTargetElement(targetId: string, runtime: {
        hostEl: Element;
        measureEl: Element;
    }): void;
    protected _unobserveConnectTargetElement(_targetId: string, runtime: {
        hostEl: Element;
        measureEl: Element;
    }): void;
    /**
     * Node DOM resize event handler
     * @inner
     * @param dom
     * @param width
     * @param height
     * @private
     */
    private _onNodeDomResize;
    /**
     * Node DOM resize event handler
     * @inner
     * @param dom
     * @param node
     * @param width
     * @param height
     * @private
     */
    private _onNodeResize;
    /**
     * [Used internally by relation-graph] This method is called when the Node component is mounted to monitor changes in the size of the Node's DOM element.
     * @param dom The DOM element corresponding to the Node component
     * @param node The JS data object of the Node
     * @inner
     */
    addNodeResizeListener(dom: HTMLElement, node: RGNode): void;
    /**
     * [Used internally by relation-graph] This method is called when the Node component is destroyed to remove monitoring of the corresponding DOM element of the Node.
     * @param dom The DOM element corresponding to the Node component
     * @inner
     */
    removeNodeResizeListener(dom: HTMLElement): void;
    /**
     * Remove size change monitoring for the DOM element
     * @param dom
     * @protected
     */
    protected removeResizeListener(dom: Element): void;
    /**
     * @inner
     * @protected
     */
    protected destroyResizeObserver(): void;
    private getCanvasSlotList;
    getCanvasSlotRectItems(): RGRectTarget[];
}
