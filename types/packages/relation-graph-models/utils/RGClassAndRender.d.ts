import { JsonLine, JsonNode, RGFakeLine, RGLine, RGLink, RGNode, RGOptions } from '../../types';
export type RGAnalyzeRenderedGraphOptions = {
    waitForStable?: boolean;
    timeoutMs?: number;
    stableFrames?: number;
    includeNormalizedHtml?: boolean;
};
export type RGRenderDescriptorNode = {
    kind: 'element';
    tag: string;
    classes: string[];
    attrs: Record<string, string>;
    children: RGRenderDescriptorNode[];
} | {
    kind: 'text';
    text: string;
};
export type RGNodeStyleClass = {
    id: string;
    signature: string;
    style: Record<string, string>;
    nodeIds: string[];
};
export type RGNodeRenderClass = {
    id: string;
    signature: string;
    renderDescriptor: RGRenderDescriptorNode;
    renderStyleRules: RGRenderStyleRule[];
    renderKeyframes: RGRenderKeyframes[];
    normalizedHtml?: string;
    nodeIds: string[];
};
export type RGRenderStylePseudo = 'self' | 'before' | 'after';
export type RGRenderStyleRule = {
    path: string;
    pseudo: RGRenderStylePseudo;
    style: Record<string, string>;
};
export type RGRenderKeyframes = {
    name: string;
    cssText: string;
};
export type RGLinePathStyle = {
    stroke: string;
    strokeWidth: string;
    strokeDasharray: string;
    strokeDashoffset: string;
    opacity: string;
};
export type RGLineTextStyle = {
    mode: 'html-label' | 'svg-text-path' | 'none';
    backgroundColor: string;
    fontSize: string;
    color: string;
};
export type RGLineStyleClass = {
    id: string;
    signature: string;
    pathStyle: RGLinePathStyle;
    textStyle: RGLineTextStyle;
    lineIds: string[];
};
export type RGClassifiedNodeItem = JsonNode & {
    nodeId: string;
    styleClassId: string;
    renderClassId: string;
};
export type RGClassifiedLineItem = JsonLine & {
    lineId: string;
    styleClassId: string;
    isFakeLine: boolean;
    textMode: 'html-label' | 'svg-text-path' | 'none';
};
export type RGRenderedGraphAnalysisMeta = {
    degraded: boolean;
    reason?: string;
    warnings: string[];
    renderedAt: number;
};
export type RGAnalyzeRenderedGraphResult = {
    meta: RGRenderedGraphAnalysisMeta;
    nodeStyleClasses: RGNodeStyleClass[];
    nodeRenderClasses: RGNodeRenderClass[];
    lineStyleClasses: RGLineStyleClass[];
    nodes: RGClassifiedNodeItem[];
    lines: RGClassifiedLineItem[];
};
export type RGRenderedGraphAnalysisContext = {
    dom?: HTMLDivElement;
    canvasDom?: HTMLDivElement;
    instanceId: string;
    graphOptions: RGOptions;
    performanceMode: boolean;
    showEasyView: boolean;
    sleep: (time: number) => Promise<void>;
    getNodeById: (id: string) => RGNode | undefined;
    getLineById: (id: string) => RGLine | undefined;
    getLinkByLineId: (id: string) => RGLink | undefined;
    getFakeLineById: (id: string) => RGFakeLine | undefined;
};
/** @deprecated Use RGAnalyzeRenderedGraphOptions instead. */
export type RGGetClassAndRenderOptions = RGAnalyzeRenderedGraphOptions;
/** @deprecated Use RGRenderedGraphAnalysisMeta instead. */
export type RGClassAndRenderMeta = RGRenderedGraphAnalysisMeta;
/** @deprecated Use RGAnalyzeRenderedGraphResult instead. */
export type RGClassAndRenderResult = RGAnalyzeRenderedGraphResult;
/** @deprecated Use RGRenderedGraphAnalysisContext instead. */
export type RGClassAndRenderContext = RGRenderedGraphAnalysisContext;
export declare function analyzeRenderedGraphByDom(context: RGRenderedGraphAnalysisContext, options?: RGAnalyzeRenderedGraphOptions): Promise<RGAnalyzeRenderedGraphResult>;
/** @deprecated Use analyzeRenderedGraphByDom instead. */
export declare const collectClassAndRenderResult: typeof analyzeRenderedGraphByDom;
