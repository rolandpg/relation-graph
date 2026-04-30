export default class RGCanvasImpl2D {
    protected $evCanvasCtx: CanvasRenderingContext2D;
    private viewScale;
    offset: {
        x: number;
        y: number;
    };
    constructor(canvas: HTMLCanvasElement);
    /**
     * 设置Canvas的逻辑尺寸，并根据DPR调整物理渲染尺寸。
     * @param logicalCanvasWidth Canvas期望的CSS宽度
     * @param logicalCanvasHeight Canvas期望的CSS高度
     */
    setSize(logicalCanvasWidth: number, logicalCanvasHeight: number): void;
    /**
     * 设置视图的缩放级别（用户操作的放大/缩小）。
     * @param scale 视图缩放级别
     */
    setScale(scale: number): void;
    /**
     * 应用当前的DPR和视图缩放/平移到Canvas上下文。
     * 这是一个辅助方法，用于统一处理变换。
     */
    private applyCurrentViewTransform;
    /**
     * 设置视图的偏移量（用户操作的平移）。
     * offsetX 和 offsetY 是基于当前视图缩放的屏幕像素偏移。
     * this.offset 将存储转换到逻辑坐标系下的偏移。
     * @param offsetX 屏幕X轴偏移量
     * @param offsetY 屏幕Y轴偏移量
     */
    setViewOffset(offsetX: number, offsetY: number): void;
    beforeDraw(): void;
    evDrawNode4Rect(nodeX: number, nodeY: number, nodeWidth: number, nodeHeight: number, nodeColor: string, nodeOpacity: number, borderRadius?: number, borderColor?: string): void;
    evDrawNode4Circle(nodeX: number, nodeY: number, nodeWidth: number, nodeHeight: number, nodeColor: string, nodeOpacity: number, borderColor?: string): void;
    evDrawLine(svgPathData: string, lineWidth: number, lineColor: string, lineOpacity: number): void;
    private getPointValue;
    private evDrawSvgPathOnCanvas;
    /**
     * 辅助函数：将SVG的A/a弧形命令参数转换为Canvas可以理解的绘图操作。
     * 这是SVG路径解析中最复杂的部分之一。
     * 一个完整的实现会涉及端点到中心点参数的转换，以及计算起始和终止角度。
     * 通常这会转换为一系列的 ctx.bezierCurveTo 调用，或者如果角度和旋转简单，
     * 可能会使用 ctx.ellipse (如果可用且参数匹配)。
     *
     * @param ctx Canvas 2D 上下文
     * @param x0 当前点 X (绝对坐标, 未偏移)
     * @param y0 当前点 Y (绝对坐标, 未偏移)
     * @param rx X轴半径
     * @param ry Y轴半径
     * @param xAxisRotation X轴旋转角度 (度)
     * @param largeArcFlag 0 表示小弧, 1 表示大弧
     * @param sweepFlag 0 表示逆时针, 1 表示顺时针
     * @param x 弧的终点 X (绝对坐标, 未偏移)
     * @param y 弧的终点 Y (绝对坐标, 未偏移)
     */
    private drawArc;
}
