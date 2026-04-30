/**
 * 创建并编译一个 WebGL 着色器。
 * @param gl WebGL 渲染上下文。
 * @param type 着色器类型 (gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER)。
 * @param source GLSL 着色器代码。
 * @returns 编译后的 WebGLShader 对象，如果失败则返回 null。
 */
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('无法创建着色器对象。');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }
    console.error('编译着色器时出错:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

/**
 * 创建并链接一个 WebGL着色器程序。
 * @param gl WebGL 渲染上下文。
 * @param vertexShader 顶点着色器。
 * @param fragmentShader 片元着色器。
 * @returns 链接后的 WebGLProgram 对象，如果失败则返回 null。
 */
function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) {
        console.error('无法创建程序对象。');
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }
    console.error('链接程序时出错:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}

// --- 着色器源码 ---


// 通用顶点着色器 (用于填充形状，如矩形和圆形)
const genericVertexShaderSource = `
    attribute vec2 a_position;
    attribute vec4 a_color;

    uniform mat3 u_projectionMatrix;
    uniform mat3 u_modelViewMatrix;

    varying vec4 v_color;

    void main() {
        gl_Position = vec4((u_projectionMatrix * u_modelViewMatrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
        v_color = a_color;
    }
`;

// 通用片元着色器 (用于填充形状)
const genericFragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`;

// 线条绘制顶点着色器
const lineVertexShaderSource = `
    attribute vec2 a_position;

    uniform mat3 u_projectionMatrix;
    uniform mat3 u_modelViewMatrix;

    void main() {
        gl_Position = vec4((u_projectionMatrix * u_modelViewMatrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
    }
`;

// 线条绘制片元着色器
const lineFragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
`;


interface ParsedColor {
    r: number; // 0-1
    g: number; // 0-1
    b: number; // 0-1
    a: number; // 0-1
}

export default class RGCanvasImplWebGL {
    protected gl: WebGLRenderingContext;
    protected genericProgram: WebGLProgram;
    protected lineProgram: WebGLProgram;

    protected genericPositionAttributeLocation: number;
    protected genericColorAttributeLocation: number;
    protected genericProjectionMatrixUniformLocation: WebGLUniformLocation | null;
    protected genericModelViewMatrixUniformLocation: WebGLUniformLocation | null;

    protected linePositionAttributeLocation: number;
    protected lineColorUniformLocation: WebGLUniformLocation | null;
    protected lineProjectionMatrixUniformLocation: WebGLUniformLocation | null;
    protected lineModelViewMatrixUniformLocation: WebGLUniformLocation | null;

    protected positionBuffer: WebGLBuffer | null;
    protected colorBuffer: WebGLBuffer | null;

    protected projectionMatrix: number[];
    protected modelViewMatrix: number[];

    protected canvasWidth: number = 0;
    protected canvasHeight: number = 0;
    public offset: { x: number; y: number } = { x: 0, y: 0 };
    protected currentScaleX: number = 1.0;
    protected currentScaleY: number = 1.0;

    constructor(canvas: HTMLCanvasElement) {
        // ... (与之前版本构造函数的前半部分相同，用于初始化GL上下文和着色器程序)
        const gl = canvas.getContext('webgl');
        if (!gl) {
            throw new Error("WebGL 不受支持或上下文创建失败。");
        }
        this.gl = gl;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        const genericVertexShader = createShader(gl, gl.VERTEX_SHADER, genericVertexShaderSource);
        const genericFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, genericFragmentShaderSource);
        if (!genericVertexShader || !genericFragmentShader) throw new Error("创建通用着色器失败。");
        const genericProgram = createProgram(gl, genericVertexShader, genericFragmentShader);
        if (!genericProgram) throw new Error("创建通用着色器程序失败。");
        this.genericProgram = genericProgram;

        this.genericPositionAttributeLocation = gl.getAttribLocation(this.genericProgram, "a_position");
        this.genericColorAttributeLocation = gl.getAttribLocation(this.genericProgram, "a_color");
        this.genericProjectionMatrixUniformLocation = gl.getUniformLocation(this.genericProgram, "u_projectionMatrix");
        this.genericModelViewMatrixUniformLocation = gl.getUniformLocation(this.genericProgram, "u_modelViewMatrix");

        const lineVertexShader = createShader(gl, gl.VERTEX_SHADER, lineVertexShaderSource);
        const lineFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, lineFragmentShaderSource);
        if (!lineVertexShader || !lineFragmentShader) throw new Error("创建线条着色器失败。");
        const lineProgram = createProgram(gl, lineVertexShader, lineFragmentShader);
        if (!lineProgram) throw new Error("创建线条着色器程序失败。");
        this.lineProgram = lineProgram;

        this.linePositionAttributeLocation = gl.getAttribLocation(this.lineProgram, "a_position");
        this.lineColorUniformLocation = gl.getUniformLocation(this.lineProgram, "u_color");
        this.lineProjectionMatrixUniformLocation = gl.getUniformLocation(this.lineProgram, "u_projectionMatrix");
        this.lineModelViewMatrixUniformLocation = gl.getUniformLocation(this.lineProgram, "u_modelViewMatrix");

        this.positionBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();

        this.projectionMatrix = this.createProjectionMatrix(this.canvasWidth, this.canvasHeight);
        this.modelViewMatrix = this.createIdentityMatrix();

        this.setupWebGLState();
    }

    private setupWebGLState() {
        const gl = this.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    // --- 矩阵运算辅助函数 (3x3，列主序) ---
    private createIdentityMatrix(): number[] { /* ... (与之前相同) ... */
        return [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
    }
    private createProjectionMatrix(width: number, height: number): number[] { /* ... (与之前相同) ... */
        if (width === 0 || height === 0) { return this.createIdentityMatrix(); }
        const w = 2 / width;
        const h = -2 / height;
        return [ w, 0, 0, 0, h, 0, -1, 1, 1 ];
    }
    private createTranslationMatrix(tx: number, ty: number): number[] { /* ... (与之前相同) ... */
        return [ 1,  0,  0, 0,  1,  0, tx, ty, 1 ];
    }
    private createScaleMatrix(sx: number, sy: number): number[] { /* ... (与之前相同) ... */
        return [ sx, 0,  0, 0,  sy, 0, 0,  0,  1 ];
    }
    private multiplyMatrices(a: number[], b: number[]): number[] { /* ... (与之前相同) ... */
        const a00 = a[0], a10 = a[1], a20 = a[2];
        const a01 = a[3], a11 = a[4], a21 = a[5];
        const a02 = a[6], a12 = a[7], a22 = a[8];
        const b00 = b[0], b10 = b[1], b20 = b[2];
        const b01 = b[3], b11 = b[4], b21 = b[5];
        const b02 = b[6], b12 = b[7], b22 = b[8];
        return [
            a00*b00 + a01*b10 + a02*b20, a10*b00 + a11*b10 + a12*b20, a20*b00 + a21*b10 + a22*b20,
            a00*b01 + a01*b11 + a02*b21, a10*b01 + a11*b11 + a12*b21, a20*b01 + a21*b11 + a22*b21,
            a00*b02 + a01*b12 + a02*b22, a10*b02 + a11*b12 + a12*b22, a20*b02 + a21*b12 + a22*b22
        ];
    }

    public setSize(canvasWidth: number, canvasHeight: number) { /* ... (与之前相同) ... */
        const gl = this.gl;
        gl.canvas.width = canvasWidth;
        gl.canvas.height = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        this.projectionMatrix = this.createProjectionMatrix(canvasWidth, canvasHeight);
    }
    public setScale(scale: number) { /* ... (与之前相同) ... */
        this.currentScaleX = scale;
        this.currentScaleY = scale;
    }
    public setViewOffset(offsetX: number, offsetY: number) { /* ... (与之前相同) ... */
        this.offset.x = offsetX;
        this.offset.y = offsetY;
    }
    public beforeDraw() { /* ... (与之前相同) ... */
        const gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const scaleMat = this.createScaleMatrix(this.currentScaleX, this.currentScaleY);
        const translateMat = this.createTranslationMatrix(this.offset.x, this.offset.y);
        this.modelViewMatrix = this.multiplyMatrices(translateMat, scaleMat);
    }

    /**
     * 解析颜色字符串 (hex, rgb, rgba) 为归一化的 RGBA 对象。
     * @param colorString 颜色字符串。
     * @returns ParsedColor 对象 {r, g, b, a} (0-1范围)，或在解析失败时返回 null。
     */
    private parseColor(colorString: string): ParsedColor | null {
        if (!colorString || typeof colorString !== 'string') {
            console.warn(`无效的颜色输入: ${colorString}`);
            return null;
        }
        const str = colorString.trim().toLowerCase();
        let match;

        // #RRGGBBAA
        if ((match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/.exec(str))) {
            return {
                r: parseInt(match[1], 16) / 255.0,
                g: parseInt(match[2], 16) / 255.0,
                b: parseInt(match[3], 16) / 255.0,
                a: parseInt(match[4], 16) / 255.0,
            };
        }
        // #RRGGBB
        if ((match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/.exec(str))) {
            return {
                r: parseInt(match[1], 16) / 255.0,
                g: parseInt(match[2], 16) / 255.0,
                b: parseInt(match[3], 16) / 255.0,
                a: 1.0,
            };
        }
        // #RGB
        if ((match = /^#?([a-f\d])([a-f\d])([a-f\d])$/.exec(str))) {
            return {
                r: parseInt(match[1] + match[1], 16) / 255.0,
                g: parseInt(match[2] + match[2], 16) / 255.0,
                b: parseInt(match[3] + match[3], 16) / 255.0,
                a: 1.0,
            };
        }

        // rgba(r,g,b,a) 或 rgb(r,g,b)
        // 匹配数字或百分比，以及可选的alpha
        // rgba?\( *(\d+%?) *, *(\d+%?) *, *(\d+%?) *(?:, *([\d\.]+%?) *)?\)
        if ((match = /^rgba?\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*(?:,\s*([\d\.]+%?)\s*)?\)$/.exec(str))) {
            const parseChannel = (valStr: string): number => {
                if (valStr.endsWith('%')) {
                    return Math.max(0, Math.min(100, parseFloat(valStr))) / 100.0;
                }
                return Math.max(0, Math.min(255, parseInt(valStr))) / 255.0;
            };
            const parseAlpha = (valStr: string | undefined): number => {
                if (valStr === undefined) return 1.0; // rgb() case
                if (valStr.endsWith('%')) {
                    return Math.max(0, Math.min(100, parseFloat(valStr))) / 100.0;
                }
                return Math.max(0, Math.min(1, parseFloat(valStr)));
            };
            try {
                return {
                    r: parseChannel(match[1]),
                    g: parseChannel(match[2]),
                    b: parseChannel(match[3]),
                    a: parseAlpha(match[4]), // match[4] might be undefined for rgb()
                };
            } catch (e) {
                console.warn(`解析rgb/rgba颜色值时出错: "${colorString}"`, e);
                return null;
            }
        }

        console.warn(`无效的颜色格式: "${colorString}"`);
        return null;
    }


    public evDrawNode4Rect(nodeX: number, nodeY: number, nodeWidth: number, nodeHeight: number, nodeColorStr: string, nodeOpacity: number, borderRadius = 10) {
        const gl = this.gl;
        const parsedColor = this.parseColor(nodeColorStr);
        if (!parsedColor) {
            return; // 警告已在 parseColor 中发出
        }
        const finalAlpha = parsedColor.a * nodeOpacity; // 混合透明度

        const x1 = nodeX;
        const y1 = nodeY;
        const x2 = nodeX + nodeWidth;
        const y2 = nodeY + nodeHeight;
        const positions = [ x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2 ];
        const colorsData = [
            parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha,
            parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha,
            parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha,
            parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha,
            parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha,
            parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha,
        ];
        // ... (与之前相同的 GL 调用: useProgram, bindBuffer, bufferData, enableVertexAttribArray, vertexAttribPointer, uniformMatrix, drawArrays)
        gl.useProgram(this.genericProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.genericPositionAttributeLocation);
        gl.vertexAttribPointer(this.genericPositionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsData), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.genericColorAttributeLocation);
        gl.vertexAttribPointer(this.genericColorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix3fv(this.genericProjectionMatrixUniformLocation, false, this.projectionMatrix);
        gl.uniformMatrix3fv(this.genericModelViewMatrixUniformLocation, false, this.modelViewMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    public evDrawNode4Circle(nodeX: number, nodeY: number, nodeWidth: number, nodeHeight: number, nodeColorStr: string, nodeOpacity: number) {
        const gl = this.gl;
        const parsedColor = this.parseColor(nodeColorStr);
        if (!parsedColor) {
            return;
        }
        const finalAlpha = parsedColor.a * nodeOpacity;

        const centerX = nodeX + nodeWidth / 2;
        const centerY = nodeY + nodeHeight / 2;
        const radiusX = nodeWidth / 2;
        const radiusY = nodeHeight / 2;
        const segments = 32;
        const positions: number[] = [centerX, centerY]; // 中心点
        const colorsData: number[] = [parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha];

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            positions.push(centerX + radiusX * Math.cos(angle), centerY + radiusY * Math.sin(angle));
            colorsData.push(parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha);
        }
        // ... (与之前相同的 GL 调用)
        gl.useProgram(this.genericProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.genericPositionAttributeLocation);
        gl.vertexAttribPointer(this.genericPositionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsData), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.genericColorAttributeLocation);
        gl.vertexAttribPointer(this.genericColorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix3fv(this.genericProjectionMatrixUniformLocation, false, this.projectionMatrix);
        gl.uniformMatrix3fv(this.genericModelViewMatrixUniformLocation, false, this.modelViewMatrix);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, segments + 2);
    }

    public evDrawLine(svgPathData: string, lineWidth: number, lineColorStr: string, lineOpacity: number) {
        const gl = this.gl;
        const parsedColor = this.parseColor(lineColorStr);
        if (!parsedColor) {
            return;
        }
        const finalAlpha = parsedColor.a * lineOpacity;

        const pathVertices = this.parseSvgPathToVertices(svgPathData);
        if (pathVertices.length === 0) return;

        // ... (与之前相同的 GL 调用, 但使用 parsedColor.r,g,b 和 finalAlpha 设置 u_color)
        gl.useProgram(this.lineProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pathVertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.linePositionAttributeLocation);
        gl.vertexAttribPointer(this.linePositionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform4f(this.lineColorUniformLocation, parsedColor.r, parsedColor.g, parsedColor.b, finalAlpha);
        gl.uniformMatrix3fv(this.lineProjectionMatrixUniformLocation, false, this.projectionMatrix);
        gl.uniformMatrix3fv(this.lineModelViewMatrixUniformLocation, false, this.modelViewMatrix);
        // gl.lineWidth(lineWidth); // 仍然受限制
        gl.drawArrays(gl.LINE_STRIP, 0, pathVertices.length / 2);
    }

    private getSvgCoordValue(currentVal: number, valStr: string, isRelative: boolean, baseForRelative: number): number {
        // ... (与之前版本相同)
        const parsedVal = parseFloat(valStr);
        if (isNaN(parsedVal)) {
            console.warn(`无法解析SVG坐标值: "${valStr}"`);
            return isRelative ? baseForRelative : 0;
        }
        return isRelative ? (baseForRelative + parsedVal) : parsedVal;
    }

    private parseSvgPathToVertices(svgPath: string): number[] {
        const vertices: number[] = [];
        const commands = svgPath.match(/[a-zA-Z][^a-zA-Z]*/g);
        if (!commands) return vertices;

        let currentX = 0;
        let currentY = 0;
        let pathStartX = 0;
        let pathStartY = 0;

        // 用于 S 和 T 命令的状态变量
        let previousCommandType = '';
        let lastCubicBezierCp2X = 0; // 前一个C或S命令的第二个控制点X
        let lastCubicBezierCp2Y = 0; // 前一个C或S命令的第二个控制点Y
        let lastQuadraticBezierCpX = 0; // 前一个Q命令的控制点X (为T命令准备)
        let lastQuadraticBezierCpY = 0; // 前一个Q命令的控制点Y (为T命令准备)

        const numSegments = 20; // 曲线细分段数

        commands.forEach((commandSegment: string) => {
            const commandTrimmed = commandSegment.trim();
            const type = commandTrimmed.charAt(0);
            const paramsStr = commandTrimmed.substring(1).trim();
            const parts = paramsStr.split(/[ ,]+/).filter(p => p !== '');

            const isRelative = type === type.toLowerCase();
            const commandUpper = type.toUpperCase();

            let tempCurrentXForRelative = currentX; // 在一个命令的多个参数段中，相对坐标基于段开始时的当前点
            let tempCurrentYForRelative = currentY;

            switch (commandUpper) {
                case 'M':
                    for (let i = 0; i < parts.length; i += 2) {
                        if (parts[i] === undefined || parts[i+1] === undefined) continue;
                        // 对于 'M' 命令的后续坐标对 (i > 0)，它们被视为隐式的 'L' 命令
                        const cmd = (i === 0) ? commandUpper : (isRelative ? 'l' : 'L');

                        const x = this.getSvgCoordValue(currentX, parts[i], isRelative, tempCurrentXForRelative);
                        const y = this.getSvgCoordValue(currentY, parts[i+1], isRelative, tempCurrentYForRelative);
                        currentX = x;
                        currentY = y;

                        if (cmd === 'M') { // 只有真正的M/m更新起始点
                            pathStartX = currentX;
                            pathStartY = currentY;
                        }
                        vertices.push(currentX, currentY);
                        // M/m 后，后续的相对坐标基于这个新的 currentX/Y
                        tempCurrentXForRelative = currentX;
                        tempCurrentYForRelative = currentY;
                    }
                    break;
                case 'L':
                case 'H':
                case 'V':
                    if (commandUpper === 'L') {
                        for (let i = 0; i < parts.length; i += 2) {
                            if (parts[i] === undefined || parts[i+1] === undefined) continue;
                            currentX = this.getSvgCoordValue(currentX, parts[i], isRelative, tempCurrentXForRelative);
                            currentY = this.getSvgCoordValue(currentY, parts[i+1], isRelative, tempCurrentYForRelative);
                            vertices.push(currentX, currentY);
                            tempCurrentXForRelative = currentX; tempCurrentYForRelative = currentY;
                        }
                    } else if (commandUpper === 'H') {
                        for (const part of parts) {
                            if (part === undefined) continue;
                            currentX = this.getSvgCoordValue(currentX, part, isRelative, tempCurrentXForRelative);
                            vertices.push(currentX, currentY);
                            tempCurrentXForRelative = currentX;
                        }
                    } else { // V
                        for (const part of parts) {
                            if (part === undefined) continue;
                            currentY = this.getSvgCoordValue(currentY, part, isRelative, tempCurrentYForRelative);
                            vertices.push(currentX, currentY);
                            tempCurrentYForRelative = currentY;
                        }
                    }
                    break;
                case 'Z':
                    if (vertices.length > 0 && (currentX !== pathStartX || currentY !== pathStartY)) {
                        currentX = pathStartX;
                        currentY = pathStartY;
                        vertices.push(currentX, currentY);
                    }
                    break;
                case 'C':
                    for (let i = 0; i < parts.length; i += 6) {
                        if (parts[i+5] === undefined) continue;
                        const p0x = currentX; const p0y = currentY;
                        const cp1x = this.getSvgCoordValue(currentX, parts[i], isRelative, tempCurrentXForRelative);
                        const cp1y = this.getSvgCoordValue(currentY, parts[i+1], isRelative, tempCurrentYForRelative);
                        const cp2x = this.getSvgCoordValue(currentX, parts[i+2], isRelative, tempCurrentXForRelative);
                        const cp2y = this.getSvgCoordValue(currentY, parts[i+3], isRelative, tempCurrentYForRelative);
                        const endX = this.getSvgCoordValue(currentX, parts[i+4], isRelative, tempCurrentXForRelative);
                        const endY = this.getSvgCoordValue(currentY, parts[i+5], isRelative, tempCurrentYForRelative);

                        for (let j = 1; j <= numSegments; j++) {
                            const t = j / numSegments; const mt = 1 - t;
                            const mt2 = mt * mt; const t2 = t * t;
                            const bx = mt2*mt*p0x + 3*mt2*t*cp1x + 3*mt*t2*cp2x + t2*t*endX;
                            const by = mt2*mt*p0y + 3*mt2*t*cp1y + 3*mt*t2*cp2y + t2*t*endY;
                            vertices.push(bx, by);
                        }
                        currentX = endX; currentY = endY;
                        lastCubicBezierCp2X = cp2x; lastCubicBezierCp2Y = cp2y;
                        tempCurrentXForRelative = currentX; tempCurrentYForRelative = currentY;
                    }
                    break;
                case 'S': // Smooth Cubic Bezier
                    for (let i = 0; i < parts.length; i += 4) {
                        if (parts[i+3] === undefined) continue;
                        const p0x = currentX; const p0y = currentY;
                        let cp1x, cp1y;
                        if (previousCommandType === 'C' || previousCommandType === 'S') {
                            cp1x = 2 * p0x - lastCubicBezierCp2X;
                            cp1y = 2 * p0y - lastCubicBezierCp2Y;
                        } else {
                            cp1x = p0x;
                            cp1y = p0y;
                        }
                        const cp2x = this.getSvgCoordValue(currentX, parts[i], isRelative, tempCurrentXForRelative);
                        const cp2y = this.getSvgCoordValue(currentY, parts[i+1], isRelative, tempCurrentYForRelative);
                        const endX = this.getSvgCoordValue(currentX, parts[i+2], isRelative, tempCurrentXForRelative);
                        const endY = this.getSvgCoordValue(currentY, parts[i+3], isRelative, tempCurrentYForRelative);

                        for (let j = 1; j <= numSegments; j++) {
                            const t = j / numSegments; const mt = 1 - t;
                            const mt2 = mt * mt; const t2 = t * t;
                            const bx = mt2*mt*p0x + 3*mt2*t*cp1x + 3*mt*t2*cp2x + t2*t*endX;
                            const by = mt2*mt*p0y + 3*mt2*t*cp1y + 3*mt*t2*cp2y + t2*t*endY;
                            vertices.push(bx, by);
                        }
                        currentX = endX; currentY = endY;
                        lastCubicBezierCp2X = cp2x; lastCubicBezierCp2Y = cp2y;
                        tempCurrentXForRelative = currentX; tempCurrentYForRelative = currentY;
                    }
                    break;
                case 'Q': // Quadratic Bezier
                    for (let i = 0; i < parts.length; i += 4) {
                        if (parts[i+3] === undefined) continue;
                        const p0x = currentX; const p0y = currentY;
                        const cpX = this.getSvgCoordValue(currentX, parts[i], isRelative, tempCurrentXForRelative);
                        const cpY = this.getSvgCoordValue(currentY, parts[i+1], isRelative, tempCurrentYForRelative);
                        const endX = this.getSvgCoordValue(currentX, parts[i+2], isRelative, tempCurrentXForRelative);
                        const endY = this.getSvgCoordValue(currentY, parts[i+3], isRelative, tempCurrentYForRelative);

                        for (let j = 1; j <= numSegments; j++) {
                            const t = j / numSegments; const mt = 1 - t;
                            const bx = mt*mt*p0x + 2*mt*t*cpX + t*t*endX;
                            const by = mt*mt*p0y + 2*mt*t*cpY + t*t*endY;
                            vertices.push(bx, by);
                        }
                        currentX = endX; currentY = endY;
                        lastQuadraticBezierCpX = cpX; lastQuadraticBezierCpY = cpY;
                        tempCurrentXForRelative = currentX; tempCurrentYForRelative = currentY;
                    }
                    break;
                default:
                    console.warn(`不支持的SVG路径命令: ${type}`);
            }
            previousCommandType = commandUpper; // 更新前一个命令类型
        });
        return vertices;
    }
}

