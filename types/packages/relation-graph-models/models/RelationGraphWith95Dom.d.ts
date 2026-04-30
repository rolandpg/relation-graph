import { RGRectTarget } from 'packages/platforms/vue2/dd/types/packages/types';
import { RGNode } from '../../types';
import { RelationGraphWith93Image } from './RelationGraphWith93Image';
/**
 * Enhancement class for relation-graph component to interact with DOM, monitor changes in the view and elements within the view, and respond accordingly
 */
export declare class RelationGraphWith95Dom extends RelationGraphWith93Image {
    protected resizeObserver: ResizeObserver;
    protected resizeListenerMap: WeakMap<object, any>;
    protected domToNodeIdMap: WeakMap<Element, string>;
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
    protected addResizeListener(dom: HTMLElement, callback: (width: number, height: number) => void): void;
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
    protected removeResizeListener(dom: HTMLElement): void;
    /**
     * @inner
     * @protected
     */
    protected destroyResizeObserver(): void;
    private getCanvasSlotList;
    getCanvasSlotRectItems(): RGRectTarget[];
}
