export default class RGCanvasImpl2D {
    protected $evCanvasCtx: CanvasRenderingContext2D;
    private viewScale = 1; // 用于视图的缩放（例如用户放大缩小），与DPR区分
    public offset: { x: number; y: number } = { x: 0, y: 0 };

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('无法获取 Canvas 2D 上下文');
        }
        this.$evCanvasCtx = ctx;
    }

    /**
     * 设置Canvas的逻辑尺寸，并根据DPR调整物理渲染尺寸。
     * @param logicalCanvasWidth Canvas期望的CSS宽度
     * @param logicalCanvasHeight Canvas期望的CSS高度
     */
    setSize(logicalCanvasWidth: number, logicalCanvasHeight: number) {
        const canvas = this.$evCanvasCtx.canvas;

        // 1. 设置Canvas绘图表面的实际像素数 (backing store)
        canvas.width = logicalCanvasWidth * window.devicePixelRatio;
        canvas.height = logicalCanvasHeight * window.devicePixelRatio;

        // 2. 设置Canvas元素在页面上显示的CSS尺寸
        // 这样可以确保Canvas在屏幕上看起来是期望的大小，而不是DPR倍那么大
        canvas.style.width = `${logicalCanvasWidth}px`;
        canvas.style.height = `${logicalCanvasHeight}px`;

        // 3. 缩放Canvas绘图上下文
        // 这样后续的绘图操作可以使用逻辑坐标，但会以高分辨率渲染
        // 注意：这里会重置当前的变换矩阵，然后再应用缩放
        // 如果有其他变换（如用户缩放），需要在之后重新应用
        this.$evCanvasCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

        // 如果之前有视图缩放，需要在这里重新应用，因为setTransform会重置它
        // 或者，更好的做法是在setScale中处理完整的变换
        // 为简单起见，我们假设setSize后会重新调用setScale和setViewOffset
        // 因此，此处仅应用DPR缩放。用户视图缩放由setScale处理。
        // 如果setScale不是每次都调用，那么需要在这里考虑 this.viewScale
        // this.$evCanvasCtx.scale(this.viewScale, this.viewScale); // 如果需要立即应用现有 viewScale

        // 清除一下，因为 setTransform 可能会影响已有的 viewScale
        // 最佳实践：setSize 之后，通常会重新计算和应用视图的 scale 和 offset
        this.applyCurrentViewTransform();

    }

    /**
     * 设置视图的缩放级别（用户操作的放大/缩小）。
     * @param scale 视图缩放级别
     */
    setScale(scale: number) {
        this.viewScale = scale;
        this.applyCurrentViewTransform();
    }

    /**
     * 应用当前的DPR和视图缩放/平移到Canvas上下文。
     * 这是一个辅助方法，用于统一处理变换。
     */
    private applyCurrentViewTransform() {
        // 1. 基于DPR重置基础变换，清除之前的平移和缩放（除了DPR）
        this.$evCanvasCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        // 2. 应用视图缩放 (viewScale)
        this.$evCanvasCtx.scale(this.viewScale, this.viewScale);
        // 3. 应用视图平移 (this.offset)
        // 注意：您的代码中 this.offset 是在绘图坐标计算时直接加上的，
        // 而不是通过 ctx.translate()。这是一个有效的方法。
        // 如果 this.offset 也想通过 ctx.translate() 应用，可以在这里添加：
        // this.$evCanvasCtx.translate(this.offset.x, this.offset.y);
        // 但根据您现有代码，this.offset 是直接加到坐标上的，所以这里不需要 ctx.translate()。
    }


    /**
     * 设置视图的偏移量（用户操作的平移）。
     * offsetX 和 offsetY 是基于当前视图缩放的屏幕像素偏移。
     * this.offset 将存储转换到逻辑坐标系下的偏移。
     * @param offsetX 屏幕X轴偏移量
     * @param offsetY 屏幕Y轴偏移量
     */
    setViewOffset(offsetX: number, offsetY: number) {
        // 偏移量是相对于当前缩放视图的，需要转换到基础逻辑坐标
        // 例如，如果视图放大了2倍 (this.viewScale = 2), 屏幕上平移100px，
        // 逻辑坐标系中只需要平移 100/2 = 50 个单位。
        this.offset.x = offsetX / this.viewScale;
        this.offset.y = offsetY / this.viewScale;
        // 注意：如果平移也通过 ctx.translate() 应用，则需要在 applyCurrentViewTransform 中处理
    }

    beforeDraw() {
        // 在setSize，setScale，setViewOffset之后调用
        // 在evDrawNode4Rect，evDrawNode4Circle，evDrawLine之前被调用
        // evDrawNode4Rect，evDrawNode4Circle，evDrawLine这三个方法会被调用多次
        // 如果需要清空画布，可以在这里做。
        // 例如，清空整个画布（物理像素）：
        // const ctx = this.$evCanvasCtx;
        // const canvas = ctx.canvas;
        // ctx.save();
        // ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换以操作物理像素
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.restore(); // 恢复DPR和视图变换

        // 或者，如果你的绘图区域是有限的，并且你知道其逻辑边界：
        // const logicalWidthToClear = ...;
        // const logicalHeightToClear = ...;
        // ctx.clearRect(this.offset.x, this.offset.y, logicalWidthToClear / this.viewScale, logicalHeightToClear / this.viewScale);
        // 上述清空逻辑需要根据您的具体需求调整。
    }

    // 你的绘图方法 (evDrawNode4Rect, evDrawNode4Circle, evDrawLine) 基本不需要修改，
    // 因为它们的坐标 (nodeX, nodeY, lineWidth 等) 和 SVG 路径坐标已经是逻辑单位，
    // Canvas 上下文的缩放会自动处理它们到高DPI绘图表面的映射。

    // public evDrawNode4Rect(nodeX: number, nodeY: number, nodeWidth:number, nodeHeight: number, nodeColor: string, nodeOpacity: number) {
    //     const ctx = this.$evCanvasCtx;
    //     // 坐标 nodeX, nodeY 已经是逻辑坐标，this.offset 也是逻辑偏移
    //     const x = this.offset.x + nodeX;
    //     const y = this.offset.y + nodeY;
    //
    //     ctx.beginPath();
    //     ctx.globalAlpha = nodeOpacity;
    //     ctx.rect(x, y, nodeWidth, nodeHeight); // nodeWidth, nodeHeight 也是逻辑尺寸
    //     ctx.fillStyle = nodeColor;
    //     ctx.fill();
    //     ctx.globalAlpha = 1;
    // }
    public evDrawNode4Rect(nodeX: number, nodeY: number, nodeWidth:number, nodeHeight: number, nodeColor: string, nodeOpacity: number, borderRadius = 5, borderColor?: string) {
        const ctx = this.$evCanvasCtx;
        const x = this.offset.x + nodeX;
        const y = this.offset.y + nodeY;

        // 处理圆角半径
        let radius = Math.max(0, borderRadius); // 确保半径不为负，默认为0

        // 限制圆角半径不能超过矩形短边的一半
        if (nodeWidth < 2 * radius) {
            radius = nodeWidth / 2;
        }
        if (nodeHeight < 2 * radius) {
            radius = nodeHeight / 2;
        }

        ctx.beginPath();
        ctx.globalAlpha = nodeOpacity;

        if (radius === 0) {
            // 如果圆角为0，直接绘制普通矩形
            ctx.rect(x, y, nodeWidth, nodeHeight);
        } else {
            // 手动构建圆角矩形路径
            // 顺序：左上角 -> 右上角 -> 右下角 -> 左下角 -> 闭合
            ctx.moveTo(x + radius, y); // 从左上角圆弧结束点开始
            ctx.arcTo(x + nodeWidth, y, x + nodeWidth, y + radius, radius); // 右上角圆弧
            ctx.arcTo(x + nodeWidth, y + nodeHeight, x + nodeWidth - radius, y + nodeHeight, radius); // 右下角圆弧
            ctx.arcTo(x, y + nodeHeight, x, y + nodeHeight - radius, radius); // 左下角圆弧
            ctx.arcTo(x, y, x + radius, y, radius); // 左上角圆弧（并闭合到 moveTo 的点）
            ctx.closePath();
        }

        ctx.fillStyle = nodeColor; // 设置填充颜色
        ctx.fill(); // 填充路径
        ctx.globalAlpha = 1; // 重置透明度


        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

    }

    public evDrawNode4Circle(nodeX: number, nodeY: number, nodeWidth:number, nodeHeight: number, nodeColor: string, nodeOpacity: number, borderColor?: string) {
        const ctx = this.$evCanvasCtx;
        const x = this.offset.x + nodeX + nodeWidth / 2;
        const y = this.offset.y + nodeY + nodeHeight / 2;
        // const radius = nodeWidth / 2; // 逻辑半径

        // ctx.beginPath();
        // ctx.globalAlpha = nodeOpacity;
        // ctx.ellipse(x, y, nodeWidth / 2, nodeHeight / 2, 0, 0, 2 * Math.PI); // 逻辑半径
        // ctx.fillStyle = nodeColor;
        // ctx.fill();
        // ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.globalAlpha = nodeOpacity;
        ctx.ellipse(x, y, nodeWidth / 2, nodeHeight / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    public evDrawLine(svgPathData: string, lineWidth: number, lineColor: string, lineOpacity: number) {
        const ctx = this.$evCanvasCtx;
        ctx.beginPath();
        ctx.globalAlpha = lineOpacity;
        // evDrawSvgPathOnCanvas 内部使用的坐标也是逻辑坐标
        this.evDrawSvgPathOnCanvas(ctx, svgPathData);
        ctx.strokeStyle = lineColor;
        // lineWidth 是逻辑宽度。由于上下文已经按 (dpr * viewScale) 缩放，
        // 实际渲染的线条宽度会是 lineWidth * (dpr * viewScale) 个物理像素（如果线条垂直或水平）
        // 或者更准确地说，lineWidth 是在当前变换空间中的宽度。
        // 如果 lineWidth=1，它将在逻辑空间中是1个单位宽，在屏幕上看起来是1个CSS像素宽，但由dpr个物理像素渲染。
        ctx.lineWidth = lineWidth * this.viewScale < 0.5 ? 0.5 : lineWidth;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    private getPointValue(currentX:number, xOrBuffX:string, isRelative: boolean) {
        // 这个函数返回逻辑坐标，不需要修改
        return isRelative ? (currentX + parseFloat(xOrBuffX)) : parseFloat(xOrBuffX);
    }

    // 假设这个方法在您的 RGCanvasImpl2D 类或其他相关类中

    private evDrawSvgPathOnCanvas(ctx: CanvasRenderingContext2D, svgPath: string) {
        const commands = svgPath.match(/[a-zA-Z][^a-zA-Z]*/g);
        if (!commands) return;

        let currentX = 0;         // 当前点的X坐标 (逻辑坐标，无offset)
        let currentY = 0;         // 当前点的Y坐标 (逻辑坐标，无offset)
        let pathStartX = 0;       // 当前子路径的起点X (逻辑坐标，无offset)
        let pathStartY = 0;       // 当前子路径的起点Y (逻辑坐标，无offset)

        // 用于 S/s, T/t 命令的状态
        let lastCubicControlPointX = 0;
        let lastCubicControlPointY = 0;
        let lastQuadraticControlPointX = 0;
        let lastQuadraticControlPointY = 0;
        let previousCommandType = ''; // 用于判断 S/s, T/t 的前一个命令类型

        ctx.beginPath(); // 开始新路径

        commands.forEach((commandSegment: string) => {
            const commandTrimmed = commandSegment.trim();
            const commandChar = commandTrimmed.charAt(0);
            const paramsStr = commandTrimmed.substring(1).trim();
            const parts = paramsStr.split(/[ ,]+/).filter(p => p !== '').map(parseFloat); // 解析参数为数字

            let x=0, y=0, x1=0, y1=0, x2=0, y2=0, rx=0, ry=0, xAxisRotation=0, largeArcFlag=0, sweepFlag=0;

            // 预处理绝对坐标的参数，相对坐标在 switch case 中处理
            // 注意：SVG允许多组坐标跟着一个命令字母，这里简化为每个命令对象对应一组操作。
            // 如果一个命令后有多组参数（例如 L x1 y1 x2 y2），这个循环需要进一步细化，
            // 或者假设上游已经将它们拆分成了单个命令。

            switch (commandChar) {
                case 'M': // MoveTo (Absolute)
                    currentX = parts[0];
                    currentY = parts[1];
                    pathStartX = currentX;
                    pathStartY = currentY;
                    ctx.moveTo(currentX + this.offset.x, currentY + this.offset.y);
                    // M 后面可以跟多个坐标对，被视为 Lineto
                    for (let i = 2; i < parts.length; i += 2) {
                        currentX = parts[i];
                        currentY = parts[i+1];
                        ctx.lineTo(currentX + this.offset.x, currentY + this.offset.y);
                    }
                    break;
                // 您的场景中 M 是大写，所以不处理 'm'

                case 'L': // LineTo (Absolute) - 您指定 L 是大写
                    for (let i = 0; i < parts.length; i += 2) {
                        currentX = parts[i];
                        currentY = parts[i+1];
                        ctx.lineTo(currentX + this.offset.x, currentY + this.offset.y);
                    }
                    break;
                case 'l': // LineTo (Relative) - 您指定 l 是小写
                    for (let i = 0; i < parts.length; i += 2) {
                        currentX += parts[i];
                        currentY += parts[i+1];
                        ctx.lineTo(currentX + this.offset.x, currentY + this.offset.y);
                    }
                    break;

                case 'H': // Horizontal LineTo (Absolute) - 您的场景指定 h 小写
                    // 如果您确实可能用到大写 H
                    for (let i = 0; i < parts.length; i++) {
                        currentX = parts[i];
                        ctx.lineTo(currentX + this.offset.x, currentY + this.offset.y);
                    }
                    break;
                case 'h': // Horizontal LineTo (Relative)
                    for (let i = 0; i < parts.length; i++) {
                        currentX += parts[i];
                        ctx.lineTo(currentX + this.offset.x, currentY + this.offset.y);
                    }
                    break;

                case 'V': // Vertical LineTo (Absolute) - 您的场景指定 v 小写
                    // 如果您确实可能用到大写 V
                    for (let i = 0; i < parts.length; i++) {
                        currentY = parts[i];
                        ctx.lineTo(currentX + this.offset.x, currentY + this.offset.y);
                    }
                    break;
                case 'v': // Vertical LineTo (Relative)
                    for (let i = 0; i < parts.length; i++) {
                        currentY += parts[i];
                        ctx.lineTo(currentX + this.offset.x, currentY + this.offset.y);
                    }
                    break;

                case 'C': // Cubic Bezier CurveTo (Absolute) - 您的场景指定 c 小写
                    for (let i = 0; i < parts.length; i += 6) {
                        x1 = parts[i]; y1 = parts[i+1];
                        x2 = parts[i+2]; y2 = parts[i+3];
                        x = parts[i+4]; y = parts[i+5];
                        ctx.bezierCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x2 + this.offset.x, y2 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        currentX = x; currentY = y;
                        lastCubicControlPointX = x2; lastCubicControlPointY = y2;
                    }
                    break;
                case 'c': // Cubic Bezier CurveTo (Relative)
                    for (let i = 0; i < parts.length; i += 6) {
                        x1 = currentX + parts[i];   y1 = currentY + parts[i+1];
                        x2 = currentX + parts[i+2]; y2 = currentY + parts[i+3];
                        x  = currentX + parts[i+4];  y  = currentY + parts[i+5];
                        ctx.bezierCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x2 + this.offset.x, y2 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        lastCubicControlPointX = x2; // 存储绝对坐标
                        lastCubicControlPointY = y2; // 存储绝对坐标
                        currentX = x; currentY = y;
                    }
                    break;

                case 'S': // Smooth Cubic Bezier CurveTo (Absolute) - 您的场景指定 s 小写
                    for (let i = 0; i < parts.length; i += 4) {
                        if (previousCommandType.match(/[CS]/i)) { // 前一个是 C 或 S (大小写不敏感)
                            x1 = 2 * currentX - lastCubicControlPointX;
                            y1 = 2 * currentY - lastCubicControlPointY;
                        } else {
                            x1 = currentX;
                            y1 = currentY;
                        }
                        x2 = parts[i];   y2 = parts[i+1];
                        x  = parts[i+2];  y  = parts[i+3];
                        ctx.bezierCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x2 + this.offset.x, y2 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        currentX = x; currentY = y;
                        lastCubicControlPointX = x2; lastCubicControlPointY = y2;
                    }
                    break;
                case 's': // Smooth Cubic Bezier CurveTo (Relative)
                    for (let i = 0; i < parts.length; i += 4) {
                        if (previousCommandType.match(/[CS]/i)) {
                            // lastCubicControlPointX/Y 存储的是上一个C/S的第二个控制点的绝对坐标
                            // 反射点 cp1 的绝对坐标是:
                            // cp1_abs_x = currentX_abs + (currentX_abs - lastCubicControlPointX_abs)
                            // cp1_rel_x = (currentX_abs + (currentX_abs - lastCubicControlPointX_abs)) - currentX_abs
                            //           = currentX_abs - lastCubicControlPointX_abs
                            // 实际上，我们这里需要的是绝对坐标进行绘制，所以计算绝对的 x1, y1
                            x1 = 2 * currentX - lastCubicControlPointX; // currentX已经是绝对的（无offset）
                            y1 = 2 * currentY - lastCubicControlPointY; // lastCubicControlPointX/Y也是绝对的（无offset）
                        } else {
                            x1 = currentX;
                            y1 = currentY;
                        }
                        x2 = currentX + parts[i];   y2 = currentY + parts[i+1];
                        x  = currentX + parts[i+2];  y  = currentY + parts[i+3];
                        ctx.bezierCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x2 + this.offset.x, y2 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        lastCubicControlPointX = x2; // 存储新的绝对坐标
                        lastCubicControlPointY = y2;
                        currentX = x; currentY = y;
                    }
                    break;

                case 'Q': // Quadratic Bezier CurveTo (Absolute) - 您的场景指定 q 小写
                    for (let i = 0; i < parts.length; i += 4) {
                        x1 = parts[i];   y1 = parts[i+1];
                        x  = parts[i+2];  y  = parts[i+3];
                        ctx.quadraticCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        currentX = x; currentY = y;
                        lastQuadraticControlPointX = x1; lastQuadraticControlPointY = y1;
                    }
                    break;
                case 'q': // Quadratic Bezier CurveTo (Relative)
                    for (let i = 0; i < parts.length; i += 4) {
                        x1 = currentX + parts[i];   y1 = currentY + parts[i+1];
                        x  = currentX + parts[i+2];  y  = currentY + parts[i+3];
                        ctx.quadraticCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        lastQuadraticControlPointX = x1; // 存储绝对坐标
                        lastQuadraticControlPointY = y1;
                        currentX = x; currentY = y;
                    }
                    break;

                case 'T': // Smooth Quadratic Bezier CurveTo (Absolute) - 您的场景指定 t 小写
                    for (let i = 0; i < parts.length; i += 2) {
                        if (previousCommandType.match(/[QT]/i)) {
                            x1 = 2 * currentX - lastQuadraticControlPointX;
                            y1 = 2 * currentY - lastQuadraticControlPointY;
                        } else {
                            x1 = currentX;
                            y1 = currentY;
                        }
                        x = parts[i]; y = parts[i+1];
                        ctx.quadraticCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        currentX = x; currentY = y;
                        lastQuadraticControlPointX = x1; lastQuadraticControlPointY = y1;
                    }
                    break;
                case 't': // Smooth Quadratic Bezier CurveTo (Relative)
                    for (let i = 0; i < parts.length; i += 2) {
                        if (previousCommandType.match(/[QT]/i)) {
                            x1 = 2 * currentX - lastQuadraticControlPointX;
                            y1 = 2 * currentY - lastQuadraticControlPointY;
                        } else {
                            x1 = currentX;
                            y1 = currentY;
                        }
                        x = currentX + parts[i]; y = currentY + parts[i+1];
                        ctx.quadraticCurveTo(
                            x1 + this.offset.x, y1 + this.offset.y,
                            x + this.offset.x, y + this.offset.y
                        );
                        lastQuadraticControlPointX = x1; // 存储新的绝对坐标 (控制点)
                        lastQuadraticControlPointY = y1;
                        currentX = x; currentY = y;
                    }
                    break;

                case 'A': // Arc (Absolute) - 您的场景指定 a 小写
                    for (let i = 0; i < parts.length; i += 7) {
                        rx = parts[i]; ry = parts[i+1];
                        xAxisRotation = parts[i+2];
                        largeArcFlag = parts[i+3] as 0 | 1;
                        sweepFlag = parts[i+4] as 0 | 1;
                        x = parts[i+5]; y = parts[i+6];
                        // 将SVG弧形参数(A)转换为Canvas arc/ellipse参数是复杂的。
                        // Canvas没有直接的 `arcTo` 等效于SVG的A命令。
                        // 通常需要一个辅助函数来实现这种转换，或者将A命令预处理为一系列贝塞尔曲线。
                        // 这里我们调用一个假设存在的辅助函数 drawArc, 您需要实现它。
                        this.drawArc(ctx, currentX, currentY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
                        currentX = x; currentY = y;
                    }
                    break;
                case 'a': // Arc (Relative)
                    for (let i = 0; i < parts.length; i += 7) {
                        rx = parts[i]; ry = parts[i+1];
                        xAxisRotation = parts[i+2];
                        largeArcFlag = parts[i+3] as 0 | 1;
                        sweepFlag = parts[i+4] as 0 | 1;
                        x = currentX + parts[i+5]; y = currentY + parts[i+6];
                        this.drawArc(ctx, currentX, currentY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
                        currentX = x; currentY = y;
                    }
                    break;

                case 'Z': // ClosePath (通常不区分大小写，但SVG规范是大写)
                case 'z': // ClosePath
                    ctx.closePath();
                    currentX = pathStartX; // Z 命令后，当前点回到子路径起点
                    currentY = pathStartY;
                    break;
                default:
                    console.warn(`未支持的SVG命令字符: ${commandChar}`);
            }
            // 记录上一个命令的字符，用于 S, s, T, t 命令的判断
            // 只有当命令是有效的曲线命令时才更新，否则平滑命令的上下文会丢失
            if (commandChar.match(/[CSQT]/i)) {
                previousCommandType = commandChar;
            } else {
                previousCommandType = ''; // 其他命令会重置平滑上下文
            }
        });
    }

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
    private drawArc(
        ctx: CanvasRenderingContext2D,
        x0: number, y0: number,
        rx: number, ry: number,
        xAxisRotation: number,
        largeArcFlag: 0 | 1,
        sweepFlag: 0 | 1,
        x: number, y: number
    ): void {
        // 确保半径为正
        rx = Math.abs(rx);
        ry = Math.abs(ry);

        // 如果半径为0，则画一条直线
        if (rx === 0 || ry === 0) {
            ctx.lineTo(x + this.offset.x, y + this.offset.y);
            return;
        }

        // X轴旋转角度转换为弧度
        const phi = (xAxisRotation % 360) * Math.PI / 180;
        const sin_phi = Math.sin(phi);
        const cos_phi = Math.cos(phi);

        // 将坐标系旋转回来，使得椭圆的轴与坐标轴平行
        const x0_prime =  cos_phi * (x0 - x) / 2 + sin_phi * (y0 - y) / 2;
        const y0_prime = -sin_phi * (x0 - x) / 2 + cos_phi * (y0 - y) / 2;

        // 确保参数在范围内（F.6.6 Correction of out-of-range radii）
        const L = (x0_prime * x0_prime) / (rx * rx) + (y0_prime * y0_prime) / (ry * ry);
        if (L > 1) {
            rx *= Math.sqrt(L);
            ry *= Math.sqrt(L);
        }

        // 计算椭圆中心 (cx_prime, cy_prime)
        let s = (largeArcFlag === sweepFlag ? -1 : 1) *
            Math.sqrt(
                Math.max(0, // Ensure non-negative under sqrt
                    (rx * rx * ry * ry - rx * rx * y0_prime * y0_prime - ry * ry * x0_prime * x0_prime) /
                    (rx * rx * y0_prime * y0_prime + ry * ry * x0_prime * x0_prime)
                )
            );
        if (isNaN(s)) s = 0; // Handle potential NaN from division by zero if denominator is zero

        const cx_prime = s * rx * y0_prime / ry;
        const cy_prime = s * -ry * x0_prime / rx;

        // 将椭圆中心转换回原始坐标系
        const cx = cos_phi * cx_prime - sin_phi * cy_prime + (x0 + x) / 2;
        const cy = sin_phi * cx_prime + cos_phi * cy_prime + (y0 + y) / 2;

        // 计算起始角度和扫描角度
        const ux = (x0_prime - cx_prime) / rx;
        const uy = (y0_prime - cy_prime) / ry;
        const vx = (-x0_prime - cx_prime) / rx;
        const vy = (-y0_prime - cy_prime) / ry;

        // 起始角度
        let startAngle = Math.atan2(uy, ux); // Angle of vector (ux, uy)

        // 计算角度变化（扫描角度）
        let deltaAngle = Math.atan2(uy * vx - ux * vy, ux * vx + uy * vy); // Angle between vectors (ux,uy) and (vx,vy)

        if (sweepFlag === 0 && deltaAngle > 0) {
            deltaAngle -= 2 * Math.PI;
        } else if (sweepFlag === 1 && deltaAngle < 0) {
            deltaAngle += 2 * Math.PI;
        }

        const endAngle = startAngle + deltaAngle;

        // 使用 Canvas ellipse 方法绘制
        // 注意：Canvas ellipse 的旋转是以弧度为单位的
        // this.offset 需要在最后应用
        if (ctx.ellipse) {
            ctx.ellipse(
                cx + this.offset.x,
                cy + this.offset.y,
                rx,
                ry,
                phi,
                startAngle,
                endAngle,
                sweepFlag === 0 // anticlockwise
            );
        } else {
            // Fallback for browsers that don't support ctx.ellipse
            // This would typically involve converting the arc to a series of Bezier curves.
            // For simplicity, we'll just draw a line as a basic fallback.
            console.warn("ctx.ellipse is not supported. Arc will be drawn as a line.");
            ctx.lineTo(x + this.offset.x, y + this.offset.y);
        }
    }
}
