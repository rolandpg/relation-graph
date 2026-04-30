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
    protected canvasWidth: number;
    protected canvasHeight: number;
    offset: {
        x: number;
        y: number;
    };
    protected currentScaleX: number;
    protected currentScaleY: number;
    constructor(canvas: HTMLCanvasElement);
    private setupWebGLState;
    private createIdentityMatrix;
    private createProjectionMatrix;
    private createTranslationMatrix;
    private createScaleMatrix;
    private multiplyMatrices;
    setSize(canvasWidth: number, canvasHeight: number): void;
    setScale(scale: number): void;
    setViewOffset(offsetX: number, offsetY: number): void;
    beforeDraw(): void;
    /**
     * 解析颜色字符串 (hex, rgb, rgba) 为归一化的 RGBA 对象。
     * @param colorString 颜色字符串。
     * @returns ParsedColor 对象 {r, g, b, a} (0-1范围)，或在解析失败时返回 null。
     */
    private parseColor;
    evDrawNode4Rect(nodeX: number, nodeY: number, nodeWidth: number, nodeHeight: number, nodeColorStr: string, nodeOpacity: number, borderRadius?: number): void;
    evDrawNode4Circle(nodeX: number, nodeY: number, nodeWidth: number, nodeHeight: number, nodeColorStr: string, nodeOpacity: number): void;
    evDrawLine(svgPathData: string, lineWidth: number, lineColorStr: string, lineOpacity: number): void;
    private getSvgCoordValue;
    private parseSvgPathToVertices;
}
