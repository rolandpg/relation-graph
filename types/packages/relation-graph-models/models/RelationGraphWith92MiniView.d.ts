import { RGLine, RGLink, RGNode, RGNodeShape, RGUserEvent } from '../../types';
import { RelationGraphWith91Editing } from './RelationGraphWith91Editing';
/**
 * Functionality related to the mini view(<RGMiniView />) in the relation-graph component
 */
export declare class RelationGraphWith92MiniView extends RelationGraphWith91Editing {
    private $miniViewCanvas;
    private $mvCanvasCtx;
    constructor();
    /**
     * relation-graph internal call, please do not use externally
     * @inner
     * @param canvas
     */
    setMiniViewCanvas(canvas: HTMLCanvasElement): void;
    /**
     * relation-graph internal call, please do not use externally
     * @inner
     */
    updateMiniView(): void;
    /**
     * @private
     * @inner
     */
    private _updateMiniView;
    private _canvasDomScale;
    /**
     * @private
     * @inner
     */
    protected mvDosomethingBeforeDraw(): void;
    /**
     * @private
     * @inner
     */
    private updateMiniViewVisibleArea;
    protected miniViewBox: {
        visibleAreaStart: {
            x: number;
            y: number;
        };
        visibleAreaEnd: {
            x: number;
            y: number;
        };
        canvas_start_x: number;
        canvas_start_y: number;
        canvas_end_x: number;
        canvas_end_y: number;
        canvas_width: number;
        canvas_height: number;
        miniview_width: number;
        miniview_height: number;
    };
    protected visibleArea: {
        x: number;
        y: number;
    };
    private _canvasItemMiniSizeLimit;
    /**
     * @private
     * @inner
     */
    protected mvDrawAllNodes(): void;
    /**
     * @private
     * @inner
     */
    protected mvDrawNode(node: RGNode, nodeShape: RGNodeShape, nodeWidth: number, nodeHeight: number): void;
    /**
     * @private
     * @inner
     */
    protected mvDrawNode4Rect(node: RGNode, nodeWidth: number, nodeHeight: number): void;
    /**
     * @private
     * @inner
     */
    protected mvDrawNode4Circle(node: RGNode, nodeWidth: number, nodeHeight: number): void;
    /**
     * @private
     * @inner
     */
    protected mvDrawAllLines(): void;
    /**
     * @private
     * @inner
     */
    protected mvDrawLine(link: RGLink, line: RGLine): void;
    /**
     * @private
     * @inner
     */
    protected mvDrawSvgPathOnCanvas(ctx: any, svgPath: any): void;
    /**
     * Triggered when dragging the visible area indicator in the MiniView
     * @inner
     * @param e
     */
    onVisibleViewHandleDragStart(e: RGUserEvent): void;
    /**
     * Triggered when the reset function in the MiniView is clicked
     * @inner
     * @param e
     */
    resetByVisiableView(e: RGUserEvent): void;
}
