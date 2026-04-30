import {RGLine, RGLink, RGNode, RGNodeShape} from '../../types';
import {devLog} from "../utils/RGCommon";
import RGCanvasImplWebGL from "../utils/RGCanvasImplWebGL";
import RGCanvasImpl2D from "../utils/RGCanvasImpl2D";
import {RelationGraphWith7Event} from "./RelationGraphWith7Event";
import {getNodeShape} from "../utils/RGNodesAnalytic";

/**
 * In performance mode, the relation-graph component provides WebGL-based simple view rendering capabilities
 */
export class RelationGraphWith9EasyView extends RelationGraphWith7Event {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    protected $easyViewCanvas: HTMLCanvasElement;
    protected $rgWebglPainter: RGCanvasImplWebGL | RGCanvasImpl2D;

    constructor() {
        super();
    }

    /**
     * relation-graph internal call, please do not use externally
     * @inner
     * @private
     */
    setEasyViewCanvas(canvas: HTMLCanvasElement) {
        this.$easyViewCanvas = canvas;
        // this.$rgWebglPainter = new RGCanvasImplWebGL(canvas);
        this.$rgWebglPainter = new RGCanvasImpl2D(canvas);
    }
    protected updateMiniView() {}

    /**
     * relation-graph internal call, please do not use externally
     * @inner
     * @private
     */
    updateEasyView() {
        this.updateMiniView();
        if (!this.dataProvider.isPerformanceMode()) {
            return;
        }
        if (!this.getOptions().showEasyView) {
            return;
        }
        if (this._updateEasyViewRequested) {
            return;
        }
        this._updateEasyViewRequested = true;
        requestAnimationFrame(this._updateEasyView.bind(this));
    }
    private _updateEasyViewRequested = false;
    /**
     * @inner
     * @protected
     */
    protected _updateEasyView(time: number) {
        try {
            const startTime = Date.now();
            if (!this.$easyViewCanvas) {
                return;
            }
            this.updateShouldRenderGraphData();
            this.evDosomethingBeforeDraw();
            this.evDrawAllLines();
            this.evDrawAllNodes();
            // console.log('_updateEasyView Use time:', Date.now() - startTime);
        } catch (e) {
            console.error(e);
        } finally {
            this._updateEasyViewRequested = false;
        }
    }

    /**
     * @inner
     * @protected
     */
    protected evDosomethingBeforeDraw() {
        const options = this.getOptions();
        const canvasWidth = options.viewSize.width;
        const canvasHeight = options.viewSize.height;
        this.$easyViewCanvas.width = canvasWidth; // 更新 Canvas 元素的宽度
        this.$easyViewCanvas.height = canvasHeight; // 更新 Canvas 元素的高度

        this.$rgWebglPainter.setSize(canvasWidth, canvasHeight);
        // devLog('updateEasyView:viewSize:', canvasWidth, canvasHeight);
        const scale = this.dataProvider.getCanvasScale();
        this.$rgWebglPainter.setScale(scale);
        this._easyViewOffset.x = (options.canvasOffset.x);
        this._easyViewOffset.y = (options.canvasOffset.y);
        this.$rgWebglPainter.setViewOffset(this._easyViewOffset.x, this._easyViewOffset.y);
        this.$rgWebglPainter.beforeDraw();
    }

    _easyViewOffset = {x: 0, y: 0};

    /**
     * @inner
     * @protected
     */
    protected evDrawAllNodes() {
        const defaultNodeShape = this.getOptions().defaultNodeShape;
        for (const node of this.getNodes()) {
            const nodeIsVisible = (node.rgShouldRender !== false) && node.rgCalcedVisibility && (node.opacity !== 0);
            if (!nodeIsVisible) {
                continue;
            }
            const nodeShape = getNodeShape(node.nodeShape, defaultNodeShape);
            this.evDrawNode(node, nodeShape);
        }
    }

    /**
     * @inner
     * @protected
     */
    protected evDrawNode(node: RGNode, nodeShape: RGNodeShape) {
        if (nodeShape === RGNodeShape.circle) {
            this.evDrawNode4Circle(node);
        } else {
            this.evDrawNode4Rect(node);
        }
    }

    /**
     * @inner
     * @protected
     */
    protected getNodeColor(node: RGNode) {
        const color = node.color || this.getOptions().defaultNodeColor || '#dddddd';
        if (color === 'transparent') {
            return 'rgba(204,204,204,0.2)';
        }
        // if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white' || color.replace(/ /g, '').includes('255,255,255')) {
        //     return 'rgba(204,204,204,0.2)';
        // }
        return color;
    }

    /**
     * @inner
     * @protected
     */
    private evDrawNode4Rect(node: RGNode) {
        const nodeWidth = node.el_W;
        const nodeHeight = node.el_H;
        const nodeOpacity = node.opacity || 0.8;
        const nodeColor = this.getNodeColor(node);
        const borderRadius = node.borderRadius === undefined ? 3 : node.borderRadius;
        const borderColor = node.borderColor || '#666666';
        this.$rgWebglPainter.evDrawNode4Rect(node.x, node.y, nodeWidth, nodeHeight, nodeColor, nodeOpacity, borderRadius, borderColor);
    }

    /**
     * @inner
     * @protected
     */
    private evDrawNode4Circle(node: RGNode) {
        const nodeWidth = node.el_W;
        const nodeHeight = node.el_H;
        const nodeOpacity = node.opacity || 0.8;
        const nodeColor = this.getNodeColor(node);
        const borderColor = node.borderColor || '#666666';
        this.$rgWebglPainter.evDrawNode4Circle(node.x, node.y, nodeWidth, nodeHeight, nodeColor, nodeOpacity, borderColor);
    }

    /**
     * @inner
     * @protected
     */
    protected evDrawAllLines() {
        for (const link of this.getLinks()) {
            const fromIsVisible = (link.fromNode.rgShouldRender !== false) && (link.fromNode.opacity !== 0) && (link.fromNode.rgCalcedVisibility);
            const toIsVisible = (link.toNode.rgShouldRender !== false) && (link.toNode.opacity !== 0) && (link.toNode.rgCalcedVisibility);
            if (!fromIsVisible && !toIsVisible) continue;
            this.evDrawLine(link, link.line);
        }
    }

    /**
     * @inner
     * @protected
     */
    private evDrawLine(link: RGLink, line: RGLine) {
        const lineDrawInfo = this.createLineDrawInfo(link, line);
        if (!lineDrawInfo) return;
        const lineOpacity = line.opacity || 1;
        const graphOptions = this.getOptions();
        const lineColor = line.color || graphOptions.defaultLineColor || '#888888'; // 设置填充颜色
        const lineWidth = line.lineWidth || graphOptions.defaultLineWidth || 1;
        this.$rgWebglPainter.evDrawLine(lineDrawInfo.pathData, lineWidth, lineColor, lineOpacity);
    }
}
