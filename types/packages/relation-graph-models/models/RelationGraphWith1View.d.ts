import { RGLine, RGUserEvent, RGCoordinate, RGNode, RGLink, RGRectTarget } from '../../types';
import { RelationGraphBase } from './RelationGraphBase';
/**
 * Relation-graph component view related class
 */
export declare class RelationGraphWith1View extends RelationGraphBase {
    $dom: HTMLDivElement;
    $canvasDom: HTMLDivElement;
    protected dataStores: Record<string, any>;
    /**
     * @inner
     */
    _rgAsConnectArea: boolean;
    /**
     * @inner
     */
    protected $lineTextContainer4NormalLine: HTMLDivElement;
    /**
     * @inner
     */
    protected $lineTextContainer4FakeLine: HTMLDivElement;
    /**
     * @inner
     */
    getLineTextContainer(line?: Pick<RGLine, 'isFakeLine'> | null): HTMLDivElement | undefined;
    private viewBoundingClientRect;
    /**
     * Get the RelationGraph component DOM
     * @return relationGraphDom:HTMLDivElement RelationGraph container DOM
     */
    getViewBoundingClientRect(): DOMRect | null;
    /**
     * @deprecated Please use getViewBoundingClientRect instead of getBoundingClientRect, this method is compatible with older api versions.
     */
    getBoundingClientRect(): DOMRect | null;
    getCanvasSlotRectItems(): RGRectTarget[];
    /**
     * Compatible with older api versions
     * @param e
     * @protected
     * @inner
     */
    protected _getEventPoint(e: RGUserEvent): {
        x: number;
        y: number;
    };
    /**
     * Get the coordinates mapped on the "relation-graph Component viewport" from the Event
     * @param e
     */
    getViewXyByEvent(e: RGUserEvent): {
        x: number;
        y: number;
    };
    getViewXyByClientXy(clientXY: RGCoordinate): {
        x: number;
        y: number;
    };
    /**
     * Get the coordinates mapped on the "relation-graph Component viewport" from the canvas coordinates
     * @param clientXY = {x: e.clientX, y: e.clientY}
     */
    getCanvasXyByClientXy(clientXY: RGCoordinate): RGCoordinate;
    /**
     * Get the coordinates mapped on the "relation-graph Component viewport" from the canvas coordinates
     * @param viewXy = {x: e.clientX - relationGraphViewBox.left, y: e.clientY - relationGraphViewBox.top}
     */
    getCanvasXyByViewXy(viewXy: RGCoordinate): RGCoordinate;
    /**
     * Get the coordinates mapped on the canvas from the "relation-graph Component viewport" coordinates
     * @param canvasCoordinate = {x: node.x, y: node.y}
     */
    getViewXyByCanvasXy(canvasCoordinate: RGCoordinate): RGCoordinate;
    /**
     * @deprecated Please use getCanvasXyByClientXy instead of getCanvasCoordinateByClientCoordinate, this method is compatible with older api versions.
     * @param clientXY
     */
    getCanvasCoordinateByClientCoordinate(clientXY: RGCoordinate): RGCoordinate;
    protected getEventTargetElement(e: RGUserEvent): Element | null;
    /**
     * Check if el is a node element, if so, return the corresponding node object
     * - You can use this method to determine if the element currently under the mouse is a node element, and get the corresponding node object
     * @param el
     * @return RGNode | undefined
     */
    isNode(el: Element | null): RGNode | undefined;
    /**
     * Check if el is a line element, if so, return the corresponding line object
     * - You can use this method to determine if the element currently under the mouse is a line element, and get the corresponding line object
     * @param el
     * @return RGLine | undefined
     */
    isLine(el: Element | null): RGLine | undefined;
    /**
     * @deprecated Please use isLine instead of isLink, this method is compatible with older api versions.
     * @param el
     */
    isLink(el: HTMLElement): RGLink | undefined;
}
