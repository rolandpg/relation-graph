import { RGNode, RGNodeShape } from '../../types';
import { default as RGCanvasImplWebGL } from '../utils/RGCanvasImplWebGL';
import { default as RGCanvasImpl2D } from '../utils/RGCanvasImpl2D';
import { RelationGraphWith7Event } from './RelationGraphWith7Event';
/**
 * In performance mode, the relation-graph component provides WebGL-based simple view rendering capabilities
 */
export declare class RelationGraphWith9EasyView extends RelationGraphWith7Event {
    protected $easyViewCanvas: HTMLCanvasElement;
    protected $rgWebglPainter: RGCanvasImplWebGL | RGCanvasImpl2D;
    constructor();
    /**
     * relation-graph internal call, please do not use externally
     * @inner
     * @private
     */
    setEasyViewCanvas(canvas: HTMLCanvasElement): void;
    protected updateMiniView(): void;
    /**
     * relation-graph internal call, please do not use externally
     * @inner
     * @private
     */
    updateEasyView(): void;
    private _updateEasyViewRequested;
    /**
     * @inner
     * @protected
     */
    protected _updateEasyView(time: number): void;
    /**
     * @inner
     * @protected
     */
    protected evDosomethingBeforeDraw(): void;
    _easyViewOffset: {
        x: number;
        y: number;
    };
    /**
     * @inner
     * @protected
     */
    protected evDrawAllNodes(): void;
    /**
     * @inner
     * @protected
     */
    protected evDrawNode(node: RGNode, nodeShape: RGNodeShape): void;
    /**
     * @inner
     * @protected
     */
    protected getNodeColor(node: RGNode): string;
    /**
     * @inner
     * @protected
     */
    private evDrawNode4Rect;
    /**
     * @inner
     * @protected
     */
    private evDrawNode4Circle;
    /**
     * @inner
     * @protected
     */
    protected evDrawAllLines(): void;
    /**
     * @inner
     * @protected
     */
    private evDrawLine;
}
