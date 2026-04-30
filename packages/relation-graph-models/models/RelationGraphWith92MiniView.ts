import {RGLine, RGLink, RGNode, RGNodeShape, RGUserEvent} from '../../types';
import {devLog} from "../utils/RGCommon";
import {RelationGraphWith91Editing} from "./RelationGraphWith91Editing";
import RGDragUtils from "../utils/RGDragUtils";
import {getPointValue} from "../utils/line/RGLinePath";
import {getNodeShape} from "../utils/RGNodesAnalytic";

/**
 * Functionality related to the mini view(<RGMiniView />) in the relation-graph component
 */
export class RelationGraphWith92MiniView extends RelationGraphWith91Editing {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private $miniViewCanvas: HTMLCanvasElement;
    private $mvCanvasCtx: CanvasRenderingContext2D;

    constructor() {
        super();
    }

    /**
     * relation-graph internal call, please do not use externally
     * @inner
     * @param canvas
     */
    setMiniViewCanvas(canvas: HTMLCanvasElement) {
        this.$miniViewCanvas = canvas;
        this.$mvCanvasCtx = this.$miniViewCanvas.getContext('2d');
    }

    /**
     * relation-graph internal call, please do not use externally
     * @inner
     */
    updateMiniView() {
        if (!this.getOptions().showMiniView) {
            return;
        }
        this.updateMiniViewVisibleArea();
        this._updateMiniView()
    }


    /**
     * @private
     * @inner
     */
    private _updateMiniView() {
        try {
            const startTime = Date.now();
            this.mvDosomethingBeforeDraw();
            this.mvDrawAllNodes();
            // this.mvDrawAllLines();
            // console.log('_updateMiniView Use time:', Date.now() - startTime);
        } catch (e) {
            console.error(e);
        }
    }

    private _canvasDomScale = 1;

    /**
     * @private
     * @inner
     */
    protected mvDosomethingBeforeDraw() {
        let minX = 9999999;
        let minY = 9999999;
        let maxX = -9999999;
        let maxY = -9999999;
        let visiableNodesSize = 0;
        for (const node of this.getNodes()) {
            if (node.rgCalcedVisibility && (node.opacity !== 0)) {
                if (node.x < minX) minX = node.x;
                if (node.y < minY) minY = node.y;
                const nodeMaxX = node.x + node.el_W
                const nodeMaxY = node.y + node.el_H
                if (nodeMaxX > maxX) maxX = nodeMaxX;
                if (nodeMaxY > maxY) maxY = nodeMaxY;
                visiableNodesSize++;
            }
        }
        const _current_zoom = 1; // this.options.canvasZoom / 100;
        const padding_x = 50;// this.options.canvasOffset.x;
        const padding_y = 50;// this.options.canvasOffset.y;

        if (visiableNodesSize === 0) {
            this.miniViewBox.canvas_start_x = -100 - padding_x;;
            this.miniViewBox.canvas_start_y = -100 - padding_y;
            this.miniViewBox.canvas_end_x = 100 + padding_x;
            this.miniViewBox.canvas_end_y = 100 + padding_y;
            this.miniViewBox.canvas_width = this.miniViewBox.canvas_end_x - this.miniViewBox.canvas_start_x;
            this.miniViewBox.canvas_height = this.miniViewBox.canvas_end_y - this.miniViewBox.canvas_start_y;
        } else {
            this.miniViewBox.canvas_start_x = minX - padding_x;
            this.miniViewBox.canvas_start_y = minY - padding_y;
            this.miniViewBox.canvas_end_x = maxX + padding_x;
            this.miniViewBox.canvas_end_y = maxY + padding_y;
            this.miniViewBox.canvas_width = this.miniViewBox.canvas_end_x - this.miniViewBox.canvas_start_x;
            this.miniViewBox.canvas_height = this.miniViewBox.canvas_end_y - this.miniViewBox.canvas_start_y;
        }


        const miniViewBox = this.$miniViewCanvas.parentElement.getBoundingClientRect();
        const canvasWidth = miniViewBox.width;
        const canvasHeight = miniViewBox.height;
        let realWidth = 0;
        let realHeight = 0;
        let scale = 1;
        if (canvasWidth / this.miniViewBox.canvas_width < canvasHeight / this.miniViewBox.canvas_height) {
            scale = canvasWidth / this.miniViewBox.canvas_width * _current_zoom;
            realWidth = canvasWidth; // 更新 Canvas 元素的宽度
            realHeight = canvasWidth / this.miniViewBox.canvas_width * this.miniViewBox.canvas_height; // 更新 Canvas 元素的高度
        } else {
            scale = canvasHeight / this.miniViewBox.canvas_height * _current_zoom;
            realWidth = canvasHeight / this.miniViewBox.canvas_height * this.miniViewBox.canvas_width; // 更新 Canvas 元素的宽度
            realHeight = canvasHeight; // 更新 Canvas 元素的高度
        }
        this.miniViewBox.miniview_width = canvasWidth;
        this.miniViewBox.miniview_height = canvasHeight;
        this.$miniViewCanvas.width = canvasWidth; // 更新 Canvas 元素的宽度
        this.$miniViewCanvas.height = canvasHeight;
        this.$mvCanvasCtx.canvas.width = canvasWidth * window.devicePixelRatio; // 更新 Canvas 绘图区域的宽度
        this.$mvCanvasCtx.canvas.height = canvasHeight * window.devicePixelRatio; // 更新 Canvas 绘图区域的高度
        this.$mvCanvasCtx.canvas.style.width = `${canvasWidth}px`;
        this.$mvCanvasCtx.canvas.style.height = `${canvasHeight}px`;
        const startPaddingY = (canvasHeight - realHeight) / 2;
        const startPaddingX = (canvasWidth - realWidth) / 2;
        this.miniViewBox.canvas_start_x -= (startPaddingX / scale);
        this.miniViewBox.canvas_start_y -= (startPaddingY / scale);
        this.$mvCanvasCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        this.$mvCanvasCtx.scale(scale, scale);
        this._canvasDomScale = scale;
        this.$mvCanvasCtx.clearRect(0, 0, this.$mvCanvasCtx.canvas.width, this.$mvCanvasCtx.canvas.height);
    }
    /**
     * @private
     * @inner
     */
    private updateMiniViewVisibleArea() {
        // const viewRectBox = this.getViewBoundingClientRect();
        const visibleAreaStart = this.getCanvasXyByViewXy({x: 0, y: 0});
        const viewSize = this.getOptions().viewSize;
        const visibleAreaEnd = this.getCanvasXyByViewXy({
            x: viewSize.width,
            y: viewSize.height
        });
        const scale = this._canvasDomScale;
        const canvasVisiableWidth = visibleAreaEnd.x - visibleAreaStart.x;
        const canvasVisiableHeight = visibleAreaEnd.y - visibleAreaStart.y;
        this.miniViewBox.visibleAreaStart = visibleAreaStart;
        this.miniViewBox.visibleAreaEnd = visibleAreaEnd;
        const width = scale * canvasVisiableWidth;
        const height = scale * canvasVisiableHeight;
        const visibleAreaOffsetX = visibleAreaStart.x - this.miniViewBox.canvas_start_x;
        const visibleAreaOffsetY = visibleAreaStart.y - this.miniViewBox.canvas_start_y;
        const x = scale * visibleAreaOffsetX;
        const y = scale * visibleAreaOffsetY;
        let emptyContent = false;
        if (
            x + width < 0
            ||
            y + height < 0
            ||
            y > this.miniViewBox.miniview_height
            ||
            x > this.miniViewBox.miniview_width
        ) {
            emptyContent = true;
        }

        const miniViewVisibleHandle = this.getOptions().miniViewVisibleHandle;
        if (
            miniViewVisibleHandle.emptyContent !== emptyContent ||
            miniViewVisibleHandle.width !== width ||
            miniViewVisibleHandle.height !== height ||
            miniViewVisibleHandle.x !== width ||
            miniViewVisibleHandle.y !== height
        ) {
            this.dataProvider.updateOptions({
                miniViewVisibleHandle: {
                    emptyContent,
                    width,
                    height,
                    x,
                    y
                }
            });
        }
    }

    protected miniViewBox = {
        visibleAreaStart: {x: 0, y: 0},
        visibleAreaEnd: {x: 0, y: 0},
        canvas_start_x: 0,
        canvas_start_y: 0,
        canvas_end_x: 0,
        canvas_end_y: 0,
        canvas_width: 0,
        canvas_height: 0,
        miniview_width: 0,
        miniview_height: 0,
    };
    protected visibleArea = {x: 0, y: 0};
    private _canvasItemMiniSizeLimit = 1;

    /**
     * @private
     * @inner
     */
    protected mvDrawAllNodes() {
        // const canvasScale = (this.options.canvasZoom / 100);
        const finalViewScale = this._canvasDomScale;
        const defaultNodeShape = this.getOptions().defaultNodeShape;
        for (const node of this.getNodes()) {
            if (node.rgCalcedVisibility && (node.opacity !== 0)) {
                let nodeWidth = node.el_W;
                let nodeHeight = node.el_H;
                if (finalViewScale * nodeWidth < this._canvasItemMiniSizeLimit) {
                    nodeWidth = this._canvasItemMiniSizeLimit / this._canvasDomScale;
                }
                if (finalViewScale * nodeHeight < this._canvasItemMiniSizeLimit) {
                    nodeHeight = this._canvasItemMiniSizeLimit / this._canvasDomScale;
                }
                const nodeShape = getNodeShape(node.nodeShape, defaultNodeShape);
                this.mvDrawNode(node, nodeShape, nodeWidth, nodeHeight);
            }
        }
    }

    /**
     * @private
     * @inner
     */
    protected mvDrawNode(node: RGNode, nodeShape: RGNodeShape, nodeWidth: number, nodeHeight: number) {
        if (nodeShape === RGNodeShape.circle) {
            this.mvDrawNode4Circle(node, nodeWidth, nodeHeight);
        } else {
            this.mvDrawNode4Rect(node, nodeWidth, nodeHeight);
        }
    }

    /**
     * @private
     * @inner
     */
    protected mvDrawNode4Rect(node: RGNode, nodeWidth: number, nodeHeight: number) {
        const ctx = this.$mvCanvasCtx;
        const x = node.x - this.miniViewBox.canvas_start_x;
        const y = node.y - this.miniViewBox.canvas_start_y;
        // console.log('drawNode', x, y);
        ctx.beginPath();
        ctx.globalAlpha = node.opacity || 1;
        // ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.rect(x, y, nodeWidth, nodeHeight);
        ctx.fillStyle = this.getNodeColor(node); // 设置填充颜色
        ctx.fill(); // 填充圆形

        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    /**
     * @private
     * @inner
     */
    protected mvDrawNode4Circle(node: RGNode, nodeWidth: number, nodeHeight: number) {
        const ctx = this.$mvCanvasCtx;
        const x = node.x + nodeWidth / 2 - this.miniViewBox.canvas_start_x;
        const y = node.y + nodeHeight / 2 - this.miniViewBox.canvas_start_y;
        // console.log('drawNode', x, y);
        // const radius = nodeWidth / 2;
        ctx.beginPath();
        ctx.globalAlpha = node.opacity || 1;
        // ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.ellipse(x, y, nodeWidth / 2, nodeHeight / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = this.getNodeColor(node); // 设置填充颜色
        ctx.fill(); // 填充圆形

        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    /**
     * @private
     * @inner
     */
    protected mvDrawAllLines() {
        for (const link of this.getLinks()) {
            if (link.fromNode.rgCalcedVisibility && link.toNode.rgCalcedVisibility) {
                this.mvDrawLine(link, link.line);
            }
        }
    }

    /**
     * @private
     * @inner
     */
    protected mvDrawLine(link: RGLink, line: RGLine) {
        const ctx = this.$mvCanvasCtx;
        // const startX = link.fromNode.x - this.miniViewBox.canvas_start_x;
        // const startY = link.fromNode.y - this.miniViewBox.canvas_start_y;
        // const endX = link.toNode.x - this.miniViewBox.canvas_start_x;
        // const endY = link.toNode.y - this.miniViewBox.canvas_start_y;
        const lineDrawInfo = this.createLineDrawInfo(link, line);
        if (!lineDrawInfo) return;
        ctx.beginPath();

        ctx.globalAlpha = line.opacity || 1;
        // console.log('!!moveTo', startX, startY);
        // console.log('!!lineTo', endX, endY);
        // ctx.moveTo(startX, startY);
        // ctx.lineTo(endX, endY); // 绘制直线到终点坐标
        this.mvDrawSvgPathOnCanvas(ctx, lineDrawInfo.pathData);
        const graphOptions = this.getOptions();
        ctx.strokeStyle = line.color || graphOptions.defaultLineColor || '#888888'; // 设置填充颜色
        ctx.lineWidth = line.lineWidth || graphOptions.defaultLineWidth || 1; // 设置线条宽度
        ctx.stroke(); // 绘制三次贝塞尔曲线
        ctx.globalAlpha = 1;
    }

    /**
     * @private
     * @inner
     */
    protected mvDrawSvgPathOnCanvas(ctx, svgPath) {
        const commands = svgPath.match(/[a-zA-Z][^a-zA-Z]*/g);
        let currentX = 0;
        let currentY = 0;
        let startX = 0;
        let startY = 0;
        let controlX1 = 0;
        let controlY1 = 0;
        let controlX2 = 0;
        let controlY2 = 0;
        let isDrawing = false;

        commands.forEach(command => {
            const parts = command.trim().split(/[ ,]+/);
            const type = parts[0].toUpperCase();
            const isRelative = parts[0] === parts[0].toLowerCase();

            // console.log('command', type, parts.join(','));
            switch (type) {
                case 'M':
                    currentX = getPointValue(startX, parts[1], isRelative) - this.miniViewBox.canvas_start_x;
                    currentY = getPointValue(startY, parts[2], isRelative) - this.miniViewBox.canvas_start_y;
                    startX = currentX;
                    startY = currentY;
                    if (isDrawing) {
                        ctx.closePath();
                        isDrawing = false;
                    }
                    ctx.moveTo(currentX, currentY);
                    // console.log('moveTo', currentX, currentY);
                    break;
                case 'L':
                    currentX = getPointValue(startX, parts[1], isRelative) - this.miniViewBox.canvas_start_x;
                    currentY = getPointValue(startY, parts[2], isRelative) - this.miniViewBox.canvas_start_y;
                    ctx.lineTo(currentX, currentY);
                    // console.log('lineTo', currentX, currentY);
                    break;
                case 'C':
                    controlX1 = getPointValue(startX, parts[1], isRelative);
                    controlY1 = getPointValue(startY, parts[2], isRelative);
                    controlX2 = getPointValue(startX, parts[3], isRelative);
                    controlY2 = getPointValue(startY, parts[4], isRelative);
                    currentX = getPointValue(startX, parts[5], isRelative);
                    currentY = getPointValue(startY, parts[6], isRelative);
                    startX = currentX;
                    startY = currentY;
                    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, currentX, currentY);
                    // console.log('bezierCurveTo', controlX1, controlY1, controlX2, controlY2, currentX, currentY);
                    break;
                case 'Q':
                    controlX1 = getPointValue(startX, parts[1], isRelative);
                    controlY1 = getPointValue(startY, parts[2], isRelative);
                    currentX = getPointValue(startX, parts[3], isRelative);
                    currentY = getPointValue(startY, parts[4], isRelative);
                    startX = currentX;
                    startY = currentY;
                    break;
                case 'V':
                    currentY = getPointValue(startY, parts[1], isRelative);
                    startY = currentY;
                    ctx.lineTo(currentX, currentY);
                    break;
                case 'H':
                    currentX = getPointValue(startX, parts[1], isRelative);
                    startX = currentX;
                    ctx.lineTo(currentX, currentY);
                    break;
                case 'Z':
                    ctx.closePath();
                    isDrawing = false;
                    break;
                default:
                    devLog(`Unsupported command: ${type}`);
            }
        });
    }

    /**
     * Triggered when dragging the visible area indicator in the MiniView
     * @inner
     * @param e
     */
    onVisibleViewHandleDragStart(e: RGUserEvent) {
        e.preventDefault();
        e.stopPropagation();
        // console.log('onVisibleViewHandleDragStart:');
        const options = this.getOptions();
        const baseCanvasOffsetX = options.canvasOffset.x;
        const baseCanvasOffsetY = options.canvasOffset.y;
        const baseCanvasWidth = this.miniViewBox.canvas_width;
        const baseCanvasHeight = this.miniViewBox.canvas_height;
        const draggingCallback = () => {
            const offsetPercentX = buffX / this.miniViewBox.miniview_width;
            const offsetPercentY = buffY / this.miniViewBox.miniview_height;
            const scale = this.dataProvider.getCanvasScale();
            const newCanvasX = baseCanvasWidth * offsetPercentX * scale;
            const newCanvasY = baseCanvasHeight * offsetPercentY * scale;
            // console.log('setCanvasOffset:buff:', buffX, buffY);
            this.dataProvider.setCanvasOffset(baseCanvasOffsetX - newCanvasX, baseCanvasOffsetY - newCanvasY);
            this._updateEditingControllerView();
            this.updateMiniViewVisibleArea();
            this.updateShouldRenderGraphData();
            this.dataProvider.dataUpdated();
        };
        let movingTimer;
        const dragged = (buff_x: number, buff_y: number, e: MouseEvent | TouchEvent) => {
            // this.disableCanvasAnimation();
            if (movingTimer) clearInterval(movingTimer);
            this.onCanvasDragEnd(e);
        };
        let dragStarted = false;
        let buffX = 0;
        let buffY = 0;
        RGDragUtils.startDrag(e, { x: 0, y: 0 }, dragged, (buff_x: number, buff_y: number) => {
            buffX = buff_x;
            buffY = buff_y;
            // console.log('onVisibleViewHandleDragStart:move:', buff_x, buff_y);
            if (!dragStarted && Math.abs(buff_x) + Math.abs(buff_y) > 3) {
                // this.enableCanvasAnimation();
                // console.log('onVisibleViewHandleDragStart:start');
                dragStarted = true;
                movingTimer = setInterval(() => {
                    draggingCallback();
                }, 50);
            }
        });
    }

    /**
     * Triggered when the reset function in the MiniView is clicked
     * @inner
     * @param e
     */
    resetByVisiableView(e: RGUserEvent) {
        if (!this.getOptions().miniViewVisibleHandle.emptyContent) {
            return;
        }
        this.setZoom(100);
        this._moveToCenter();
        this.zoomToFit();
    }
}
