import {
    RGLine,
    RGUserEvent, RGCoordinate, RGNode, RGLink, RGRectTarget
} from '../../types';
import {RelationGraphBase} from "./RelationGraphBase";
import {devLog, findParentByClassName, getClientCoordinate} from "../utils/RGCommon";

/**
 * Relation-graph component view related class
 */
export class RelationGraphWith1View extends RelationGraphBase {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    $dom: HTMLDivElement;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    $canvasDom: HTMLDivElement;
    protected dataStores: Record<string, any> = {};
    /**
     * @inner
     */
    public _rgAsConnectArea = false;
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
    getLineTextContainer(line?: Pick<RGLine, 'isFakeLine'> | null) {
        if (!line || !this.$canvasDom) {
            return;
        }
        if (line.isFakeLine) {
            if (!this.$lineTextContainer4NormalLine) {
                this.$lineTextContainer4NormalLine = this.$canvasDom.querySelector('.rg-lines-container-el-lines .rg-linetext-container');
                if (this.dataStores.textContainer4NormalRef) {
                    this.dataStores.textContainer4NormalRef.value = this.$lineTextContainer4NormalLine;
                }
            }
            return this.$lineTextContainer4NormalLine;
        } else {
            if (!this.$lineTextContainer4FakeLine) {
                this.$lineTextContainer4FakeLine = this.$canvasDom.querySelector('.rg-lines-container-normal-lines .rg-linetext-container');
                if (this.dataStores.textContainer4FakeLineRef) {
                    this.dataStores.textContainer4FakeLineRef.value = this.$lineTextContainer4FakeLine;
                }
            }
            return this.$lineTextContainer4FakeLine;
        }
    }
    private viewBoundingClientRect = null;
    /**
     * Get the RelationGraph component DOM
     * @return relationGraphDom:HTMLDivElement RelationGraph container DOM
     */
    getViewBoundingClientRect() {
        if (!this.$dom) {
            if (!this.viewBoundingClientRect) {
                console.error('[getViewBoundingClientRect] RelationGraph DOM is not set yet!');
            }
            return this.viewBoundingClientRect;
        }
        const rect = this.$dom?.getBoundingClientRect();
        this.viewBoundingClientRect = rect;
        return rect;
    }

    /**
     * @deprecated Please use getViewBoundingClientRect instead of getBoundingClientRect, this method is compatible with older api versions.
     */
    getBoundingClientRect() {
        console.warn('Please use getViewBoundingClientRect instead of getBoundingClientRect, this method is compatible with older api versions.');
        return this.getViewBoundingClientRect();
    }
    getCanvasSlotRectItems(): RGRectTarget[] {
        return [];
    }
    /**
     * Compatible with older api versions
     * @param e
     * @protected
     * @inner
     */
    protected _getEventPoint(e: RGUserEvent) {
        return this.getViewXyByEvent(e);
    }

    /**
     * Get the coordinates mapped on the "relation-graph Component viewport" from the Event
     * @param e
     */
    getViewXyByEvent(e: RGUserEvent) {
        const clientCoordinate = getClientCoordinate(e);
        const point = {
            x: clientCoordinate.clientX,
            y: clientCoordinate.clientY
        };
        return this.getViewXyByClientXy(point);
    }
    getViewXyByClientXy(clientXY: RGCoordinate) {
        const viewRectBox = this.getViewBoundingClientRect();
        return {
            x: clientXY.x - viewRectBox.x,
            y: clientXY.y - viewRectBox.y
        };
    }
    /**
     * Get the coordinates mapped on the "relation-graph Component viewport" from the canvas coordinates
     * @param clientXY = {x: e.clientX, y: e.clientY}
     */
    getCanvasXyByClientXy(clientXY: RGCoordinate): RGCoordinate {
        const viewRectBox = this.getViewBoundingClientRect();
        const viewXy = {
            x: clientXY.x - viewRectBox.left,
            y: clientXY.y - viewRectBox.top
        };
        return this.getCanvasXyByViewXy(viewXy);
    }

    /**
     * Get the coordinates mapped on the "relation-graph Component viewport" from the canvas coordinates
     * @param viewXy = {x: e.clientX - relationGraphViewBox.left, y: e.clientY - relationGraphViewBox.top}
     */
    getCanvasXyByViewXy(viewXy: RGCoordinate): RGCoordinate {
        if (this._rgAsConnectArea) {
            return viewXy;
        }
        const options = this.dataProvider.getOptions();
        const _current_zoom = options.canvasZoom / 100;
        const canvasXyOnView = {
            x: viewXy.x - options.canvasOffset.x,
            y: viewXy.y - options.canvasOffset.y
        };
        return {
            x: canvasXyOnView.x / _current_zoom,
            y: canvasXyOnView.y / _current_zoom
        };
    }

    /**
     * Get the coordinates mapped on the canvas from the "relation-graph Component viewport" coordinates
     * @param canvasCoordinate = {x: node.x, y: node.y}
     */
    getViewXyByCanvasXy(canvasCoordinate: RGCoordinate): RGCoordinate {
        const options = this.dataProvider.getOptions();
        const _current_zoom = options.canvasZoom / 100;
        return {
            x: canvasCoordinate.x * _current_zoom + options.canvasOffset.x,
            y: canvasCoordinate.y * _current_zoom + options.canvasOffset.y
        };
    }

    /**
     * @deprecated Please use getCanvasXyByClientXy instead of getCanvasCoordinateByClientCoordinate, this method is compatible with older api versions.
     * @param clientXY
     */
    getCanvasCoordinateByClientCoordinate(clientXY: RGCoordinate) {
        console.warn('Please use getCanvasXyByClientXy instead of getCanvasCoordinateByClientCoordinate, this method is compatible with older api versions.');
        return this.getCanvasXyByClientXy(clientXY);
    }
    protected getEventTargetElement(e: RGUserEvent) {
        return e.target instanceof Element ? e.target : null;
    }

    /**
     * Check if el is a node element, if so, return the corresponding node object
     * - You can use this method to determine if the element currently under the mouse is a node element, and get the corresponding node object
     * @param el
     * @return RGNode | undefined
     */
    isNode(el: Element | null): RGNode | undefined {
        const nodeEl = findParentByClassName(el as HTMLElement, 'rg-node-peel', 'rg-map');
        if (!nodeEl) return;
        return this.dataProvider.getNodeById(nodeEl.dataset.id as string);
    }

    /**
     * Check if el is a line element, if so, return the corresponding line object
     * - You can use this method to determine if the element currently under the mouse is a line element, and get the corresponding line object
     * @param el
     * @return RGLine | undefined
     */
    isLine(el: Element | null): RGLine | undefined {
        const lineEl = findParentByClassName(el as HTMLElement, 'rg-line-peel', 'relation-graph');
        if (!lineEl) return;
        return this.dataProvider.getLineById(lineEl.dataset.id as string);
    }

    /**
     * @deprecated Please use isLine instead of isLink, this method is compatible with older api versions.
     * @param el
     */
    isLink(el: HTMLElement): RGLink | undefined {
        throw new Error('Please use isLine');
    }
}
