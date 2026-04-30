import type {JsonLine, JsonNode, RGFakeLine, RGLine, RGLink, RGNode, RGOptions} from '../../types';
import {transNodeToJson} from "../data/RGNodeDataUtils";
import {transLinkToJson, transLineToJson} from "../data/RGLineDataUtils";

export type RGAnalyzeRenderedGraphOptions = {
    waitForStable?: boolean;
    timeoutMs?: number;
    stableFrames?: number;
    includeNormalizedHtml?: boolean;
};

export type RGRenderDescriptorNode =
    | {
        kind: 'element';
        tag: string;
        classes: string[];
        attrs: Record<string, string>;
        children: RGRenderDescriptorNode[];
    }
    | {
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

type RGNodeDomInfo = {
    nodeId: string;
    peel: HTMLElement;
    nodeEl: HTMLElement;
};

type RGLineDomInfo = {
    lineId: string;
    isFakeLine: boolean;
    pathPeel?: Element;
    textPeel?: HTMLElement;
    textMode: 'html-label' | 'svg-text-path' | 'none';
};

type RGNodeRenderSample = {
    nodeId: string;
    nodeJson: JsonNode;
    renderDescriptor: RGRenderDescriptorNode;
    rootElement: HTMLElement;
};

type RGNodeRenderClassState = {
    id: string;
    signature: string;
    nodeIds: string[];
    samples: RGNodeRenderSample[];
};

type RGRenderDescriptorBuildMode = 'signature' | 'raw';
type RGRenderDescriptorValueContext = 'text' | 'attr';

const DEFAULT_TIMEOUT_MS = 1500;
const DEFAULT_STABLE_FRAMES = 2;
const TRANSIENT_NODE_CLASSES = ['rg-node-checked', 'rg-node-selected', 'rg-node-dragging', 'rg-node-hover'];
const TRANSIENT_LINE_CLASSES = ['rg-line-checked', 'rg-line-selected'];
const IGNORED_ATTRS = new Set([
    'class',
    'id',
    'tabindex'
]);
const NORMALIZED_ATTR_VALUE_PLACEHOLDER = '[value]';
const NORMALIZED_TEXT_PLACEHOLDER = '{{text}}';
const RENDER_STYLE_PSEUDOS: RGRenderStylePseudo[] = ['self', 'before', 'after'];
const PSEUDO_TO_SELECTOR: Record<RGRenderStylePseudo, string | null> = {
    self: null,
    before: '::before',
    after: '::after',
};
const PSEUDO_ORDER: Record<RGRenderStylePseudo, number> = {
    self: 0,
    before: 1,
    after: 2,
};
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const INHERITED_CSS_PROPERTIES = new Set([
    'azimuth',
    'border-collapse',
    'border-spacing',
    'caption-side',
    'caret-color',
    'color',
    'cursor',
    'direction',
    'empty-cells',
    'fill',
    'font',
    'font-family',
    'font-feature-settings',
    'font-kerning',
    'font-language-override',
    'font-optical-sizing',
    'font-palette',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-synthesis',
    'font-synthesis-small-caps',
    'font-synthesis-style',
    'font-synthesis-weight',
    'font-variant',
    'font-variant-alternates',
    'font-variant-caps',
    'font-variant-east-asian',
    'font-variant-emoji',
    'font-variant-ligatures',
    'font-variant-numeric',
    'font-variant-position',
    'font-weight',
    'hyphenate-character',
    'hyphenate-limit-chars',
    'hyphens',
    'image-rendering',
    'letter-spacing',
    'line-height',
    'list-style',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'orphans',
    'paint-order',
    'pointer-events',
    'quotes',
    'resize',
    'speak',
    'stroke',
    'tab-size',
    'text-align',
    'text-align-last',
    'text-combine-upright',
    'text-indent',
    'text-justify',
    'text-orientation',
    'text-rendering',
    'text-shadow',
    'text-transform',
    'text-underline-position',
    'visibility',
    'white-space',
    'widows',
    'word-break',
    'word-spacing',
    'word-wrap',
    'writing-mode',
]);
const BASELINE_STYLE_CONTEXTS = new WeakMap<Document, {
    container: HTMLDivElement;
    cache: Map<string, Record<string, string>>;
}>();

export async function analyzeRenderedGraphByDom(
    context: RGRenderedGraphAnalysisContext,
    options: RGAnalyzeRenderedGraphOptions = {}
): Promise<RGAnalyzeRenderedGraphResult> {
    const warnings: string[] = [];
    const meta = createBaseMeta(warnings);
    const emptyResult = createEmptyResult(meta);
    if (!context.dom || !context.canvasDom) {
        emptyResult.meta.degraded = true;
        emptyResult.meta.reason = 'graph-dom-not-ready';
        return emptyResult;
    }
    if (context.showEasyView) {
        emptyResult.meta.degraded = true;
        emptyResult.meta.reason = 'show-easy-view-enabled';
        return emptyResult;
    }
    if (context.performanceMode) {
        emptyResult.meta.degraded = true;
        emptyResult.meta.reason = 'performance-mode-partial-dom-render';
        return emptyResult;
    }

    if (options.waitForStable !== false) {
        const stable = await waitForStableRender(context, {
            timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
            stableFrames: options.stableFrames ?? DEFAULT_STABLE_FRAMES,
        });
        if (!stable) {
            warnings.push('render-stability-timeout');
        }
    }

    const nodeInfos = collectVisibleNodeDomInfos(context);
    const lineInfos = collectVisibleLineDomInfos(context);

    if (nodeInfos.length === 0 && lineInfos.length === 0) {
        warnings.push('no-visible-dom-items-detected');
    }

    const nodeStyleClassMap = new Map<string, RGNodeStyleClass>();
    const nodeRenderClassMap = new Map<string, RGNodeRenderClassState>();
    const lineStyleClassMap = new Map<string, RGLineStyleClass>();
    const nodes: RGClassifiedNodeItem[] = [];
    const lines: RGClassifiedLineItem[] = [];

    for (const nodeInfo of nodeInfos) {
        const node = context.getNodeById(nodeInfo.nodeId);
        if (!node) {
            continue;
        }
        const nodeJson = getClassifiedNodeJson(node, context.graphOptions);
        const nodeStyle = extractNodeStyle(nodeInfo, context.graphOptions);
        const nodeStyleSignature = stableStringify(nodeStyle);
        const nodeStyleClass = getOrCreateNodeStyleClass(nodeStyleClassMap, nodeStyleSignature, nodeStyle);
        nodeStyleClass.nodeIds.push(nodeInfo.nodeId);

        const renderSignatureDescriptor = buildRenderDescriptor(nodeInfo.nodeEl, 'signature');
        const renderSignature = stableStringify(renderSignatureDescriptor);
        const nodeRenderClass = getOrCreateNodeRenderClass(
            nodeRenderClassMap,
            renderSignature
        );
        nodeRenderClass.nodeIds.push(nodeInfo.nodeId);
        nodeRenderClass.samples.push({
            nodeId: nodeInfo.nodeId,
            nodeJson,
            renderDescriptor: buildRenderDescriptor(nodeInfo.nodeEl, 'raw'),
            rootElement: nodeInfo.nodeEl,
        });

        nodes.push({
            ...nodeJson,
            nodeId: nodeInfo.nodeId,
            styleClassId: nodeStyleClass.id,
            renderClassId: nodeRenderClass.id,
        });
    }

    for (const lineInfo of lineInfos) {
        const lineJson = getClassifiedLineJson(context, lineInfo);
        if (!lineJson) {
            continue;
        }
        const lineStyle = extractLineStyle(lineInfo);
        const lineSignature = stableStringify(lineStyle);
        const lineStyleClass = getOrCreateLineStyleClass(lineStyleClassMap, lineSignature, lineStyle.pathStyle, lineStyle.textStyle);
        lineStyleClass.lineIds.push(lineInfo.lineId);
        lines.push({
            ...lineJson,
            lineId: lineInfo.lineId,
            styleClassId: lineStyleClass.id,
            isFakeLine: lineInfo.isFakeLine,
            textMode: lineInfo.textMode,
        });
    }

    return {
        meta: {
            ...meta,
            warnings,
            renderedAt: Date.now(),
        },
        nodeStyleClasses: [...nodeStyleClassMap.values()],
        nodeRenderClasses: resolveNodeRenderClasses(
            [...nodeRenderClassMap.values()],
            options.includeNormalizedHtml !== false,
            warnings
        ),
        lineStyleClasses: [...lineStyleClassMap.values()],
        nodes,
        lines,
    };
}

/** @deprecated Use analyzeRenderedGraphByDom instead. */
export const collectClassAndRenderResult = analyzeRenderedGraphByDom;

function createBaseMeta(warnings: string[]): RGRenderedGraphAnalysisMeta {
    return {
        degraded: false,
        warnings,
        renderedAt: Date.now(),
    };
}

function createEmptyResult(meta: RGRenderedGraphAnalysisMeta): RGAnalyzeRenderedGraphResult {
    return {
        meta,
        nodeStyleClasses: [],
        nodeRenderClasses: [],
        lineStyleClasses: [],
        nodes: [],
        lines: [],
    };
}

async function waitForStableRender(
    context: RGRenderedGraphAnalysisContext,
    options: {timeoutMs: number; stableFrames: number}
): Promise<boolean> {
    await waitForDocumentFonts(context);
    const startedAt = Date.now();
    let previousSnapshot = '';
    let stableCount = 0;
    while (Date.now() - startedAt < options.timeoutMs) {
        await nextAnimationFrame(context.dom);
        const currentSnapshot = getRenderSnapshot(context);
        if (currentSnapshot === previousSnapshot) {
            stableCount += 1;
            if (stableCount >= options.stableFrames) {
                return true;
            }
        } else {
            stableCount = 0;
            previousSnapshot = currentSnapshot;
        }
    }
    return false;
}

async function waitForDocumentFonts(context: RGRenderedGraphAnalysisContext) {
    const ownerDocument = context.dom?.ownerDocument;
    if (!ownerDocument) {
        return;
    }
    const fonts = ownerDocument.fonts;
    if (!fonts || !fonts.ready) {
        await nextAnimationFrame(context.dom);
        await nextAnimationFrame(context.dom);
        return;
    }
    await Promise.race([
        fonts.ready.then(() => undefined),
        context.sleep(400)
    ]);
    await nextAnimationFrame(context.dom);
}

function nextAnimationFrame(host: HTMLElement | undefined): Promise<void> {
    const view = host?.ownerDocument?.defaultView;
    if (view?.requestAnimationFrame) {
        return new Promise(resolve => {
            view.requestAnimationFrame(() => resolve());
        });
    }
    return new Promise(resolve => setTimeout(resolve, 16));
}

function getRenderSnapshot(context: RGRenderedGraphAnalysisContext): string {
    const nodeInfos = collectVisibleNodeDomInfos(context);
    const lineInfos = collectVisibleLineDomInfos(context);
    const nodeSnapshot = nodeInfos
        .map(nodeInfo => {
            const rect = nodeInfo.nodeEl.getBoundingClientRect();
            return `${nodeInfo.nodeId}:${normalizeNumber(rect.width)}x${normalizeNumber(rect.height)}`;
        })
        .join('|');
    const lineSnapshot = lineInfos
        .map(lineInfo => {
            const pathEl = lineInfo.pathPeel?.querySelector('.rg-line') as SVGPathElement | null;
            const pathLength = pathEl ? normalizeNumber(pathEl.getBoundingClientRect().width) : 0;
            return `${lineInfo.lineId}:${lineInfo.textMode}:${pathLength}`;
        })
        .join('|');
    return `${nodeSnapshot}::${lineSnapshot}`;
}

function collectVisibleNodeDomInfos(context: RGRenderedGraphAnalysisContext): RGNodeDomInfo[] {
    if (!context.canvasDom) {
        return [];
    }
    const nodePeels = context.canvasDom.querySelectorAll('.rg-nodes-container-wrapper .rg-node-peel[data-id]');
    const nodeInfos: RGNodeDomInfo[] = [];
    nodePeels.forEach(nodePeel => {
        const peel = nodePeel as HTMLElement;
        const nodeId = peel.dataset.id;
        if (!nodeId || !context.getNodeById(nodeId)) {
            return;
        }
        const nodeEl = getDirectChildByClass(peel, 'rg-node');
        if (!nodeEl) {
            return;
        }
        const rect = nodeEl.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return;
        }
        nodeInfos.push({
            nodeId,
            peel,
            nodeEl,
        });
    });
    nodeInfos.sort((a, b) => a.nodeId.localeCompare(b.nodeId));
    return nodeInfos;
}

function collectVisibleLineDomInfos(context: RGRenderedGraphAnalysisContext): RGLineDomInfo[] {
    if (!context.canvasDom) {
        return [];
    }
    const lineMap = new Map<string, RGLineDomInfo>();
    const pathPeels = context.canvasDom.querySelectorAll('.rg-lines-container .rg-line-peel[data-id]');
    pathPeels.forEach(peel => {
        const pathPeel = peel as Element;
        const lineId = (pathPeel as HTMLElement).dataset.id;
        if (!lineId) {
            return;
        }
        const lineInfo = getOrCreateLineInfo(lineMap, context, lineId);
        lineInfo.pathPeel = pathPeel;
    });

    const textContainers = context.canvasDom.querySelectorAll('.rg-lines-container .rg-linetext-container');
    textContainers.forEach(container => {
        container.querySelectorAll('.rg-line-peel[data-id]').forEach(peel => {
            const textPeel = peel as HTMLElement;
            const lineId = textPeel.dataset.id;
            if (!lineId) {
                return;
            }
            const lineInfo = getOrCreateLineInfo(lineMap, context, lineId);
            lineInfo.textPeel = textPeel;
        });
    });

    const lineInfos = [...lineMap.values()].filter(lineInfo => {
        const lineObj = lineInfo.isFakeLine ? context.getFakeLineById(lineInfo.lineId) : context.getLineById(lineInfo.lineId);
        return !!lineObj;
    });
    lineInfos.forEach(lineInfo => {
        if (lineInfo.textPeel?.querySelector('.rg-line-label')) {
            lineInfo.textMode = 'html-label';
            return;
        }
        if (lineInfo.pathPeel?.querySelector('.rg-line-text')) {
            lineInfo.textMode = 'svg-text-path';
            return;
        }
        lineInfo.textMode = 'none';
    });
    lineInfos.sort((a, b) => a.lineId.localeCompare(b.lineId));
    return lineInfos;
}

function getOrCreateLineInfo(
    lineMap: Map<string, RGLineDomInfo>,
    context: RGRenderedGraphAnalysisContext,
    lineId: string
): RGLineDomInfo {
    const existed = lineMap.get(lineId);
    if (existed) {
        return existed;
    }
    const isFakeLine = !context.getLineById(lineId) && !!context.getFakeLineById(lineId);
    const lineInfo: RGLineDomInfo = {
        lineId,
        isFakeLine,
        textMode: 'none',
    };
    lineMap.set(lineId, lineInfo);
    return lineInfo;
}

function getClassifiedNodeJson(node: RGNode, graphOptions: RGOptions): JsonNode {
    return (transNodeToJson(node, {
        mode: 'effective',
        graphOptions,
        effectiveSizeMode: 'node',
    }) || {id: node.id}) as JsonNode;
}

function getClassifiedLineJson(
    context: RGRenderedGraphAnalysisContext,
    lineInfo: RGLineDomInfo
): JsonLine | undefined {
    if (lineInfo.isFakeLine) {
        const fakeLine = context.getFakeLineById(lineInfo.lineId);
        return fakeLine ? transLineToJson(fakeLine, {
            mode: 'effective',
            graphOptions: context.graphOptions,
        }) : undefined;
    }
    const link = context.getLinkByLineId(lineInfo.lineId);
    if (link) {
        return transLinkToJson(link, {
            mode: 'effective',
            graphOptions: context.graphOptions,
        });
    }
    const line = context.getLineById(lineInfo.lineId);
    return line ? transLineToJson(line, {
        mode: 'effective',
        graphOptions: context.graphOptions,
    }) : undefined;
}

function extractNodeStyle(nodeInfo: RGNodeDomInfo, graphOptions: RGOptions) {
    return withTemporarilyRemovedClasses(nodeInfo.peel, TRANSIENT_NODE_CLASSES, () => {
        const nodeStyle = getComputedStyleSafe(nodeInfo.nodeEl);
        const peelStyle = getComputedStyleSafe(nodeInfo.peel);
        const textAnchorEl = (nodeInfo.nodeEl.querySelector('.rg-node-text') as HTMLElement | null) || nodeInfo.nodeEl;
        const textStyle = getComputedStyleSafe(textAnchorEl);
        const rect = nodeInfo.nodeEl.getBoundingClientRect();
        const canvasScale = getCanvasZoomScale(graphOptions);
        return {
            width: pxValue(rect.width / canvasScale),
            height: pxValue(rect.height / canvasScale),
            backgroundColor: normalizeCssValue(nodeStyle.backgroundColor),
            borderTopWidth: normalizeCssValue(nodeStyle.borderTopWidth),
            borderTopColor: normalizeCssValue(nodeStyle.borderTopColor),
            borderTopLeftRadius: normalizeCssValue(nodeStyle.borderTopLeftRadius),
            color: normalizeCssValue(textStyle.color),
            fontSize: normalizeCssValue(textStyle.fontSize || nodeStyle.fontSize),
            opacity: normalizeCssValue(peelStyle.opacity),
        };
    });
}

function extractLineStyle(lineInfo: RGLineDomInfo): {
    pathStyle: RGLinePathStyle;
    textStyle: RGLineTextStyle;
} {
    return withTemporarilyRemovedClassesFromElements([lineInfo.pathPeel, lineInfo.textPeel], TRANSIENT_LINE_CLASSES, () => {
        const pathEl = lineInfo.pathPeel?.querySelector('.rg-line') as SVGPathElement | null;
        const pathStyle = getComputedStyleSafe(pathEl);
        const linePathStyle: RGLinePathStyle = {
            stroke: normalizeCssValue(pathStyle.stroke),
            strokeWidth: normalizeCssValue(pathStyle.strokeWidth),
            strokeDasharray: normalizeCssValue(pathStyle.strokeDasharray),
            strokeDashoffset: normalizeCssValue(pathStyle.strokeDashoffset),
            opacity: normalizeCssValue(pathStyle.opacity),
        };

        if (lineInfo.textMode === 'html-label') {
            const labelEl = lineInfo.textPeel?.querySelector('.rg-line-label') as HTMLElement | null;
            return {
                pathStyle: linePathStyle,
                textStyle: labelEl ? extractLineLabelStyle(labelEl) : createEmptyLineTextStyle('none'),
            };
        }

        if (lineInfo.textMode === 'svg-text-path') {
            const textEl = lineInfo.pathPeel?.querySelector('.rg-line-text') as SVGTextElement | null;
            return {
                pathStyle: linePathStyle,
                textStyle: textEl ? extractSvgTextPathStyle(textEl) : createEmptyLineTextStyle('none'),
            };
        }

        return {
            pathStyle: linePathStyle,
            textStyle: createEmptyLineTextStyle('none'),
        };
    });
}

function createEmptyLineTextStyle(mode: RGLineTextStyle['mode']): RGLineTextStyle {
    return {
        mode,
        backgroundColor: mode === 'svg-text-path' ? 'transparent' : '',
        fontSize: '',
        color: '',
    };
}

function extractLineLabelStyle(labelEl: HTMLElement): RGLineTextStyle {
    const labelStyle = getComputedStyleSafe(labelEl);
    return {
        mode: 'html-label',
        backgroundColor: normalizeCssValue(labelStyle.backgroundColor),
        fontSize: normalizeCssValue(labelStyle.fontSize),
        color: normalizeCssValue(labelStyle.color),
    };
}

function extractSvgTextPathStyle(textEl: SVGTextElement): RGLineTextStyle {
    const textStyle = getComputedStyleSafe(textEl);
    return {
        mode: 'svg-text-path',
        backgroundColor: 'transparent',
        fontSize: normalizeCssValue(textStyle.fontSize),
        color: normalizeCssValue(textStyle.fill || textStyle.color),
    };
}

function withTemporarilyRemovedClassesFromElements<T>(
    elements: Array<Element | null | undefined>,
    classNames: string[],
    handler: () => T
): T {
    const rollbacks = elements
        .filter((element): element is Element => !!element)
        .map(element => removeClassesTemporarily(element, classNames));
    try {
        return handler();
    } finally {
        rollbacks.reverse().forEach(rollback => rollback());
    }
}

function withTemporarilyRemovedClasses<T>(
    element: Element,
    classNames: string[],
    handler: () => T
): T {
    const rollback = removeClassesTemporarily(element, classNames);
    try {
        return handler();
    } finally {
        rollback();
    }
}

function removeClassesTemporarily(
    element: Element,
    classNames: string[]
): () => void {
    const removedClassNames: string[] = [];
    classNames.forEach(className => {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
            removedClassNames.push(className);
        }
    });
    return () => {
        removedClassNames.forEach(className => {
            element.classList.add(className);
        });
    };
}

function buildRenderDescriptor(
    nodeEl: HTMLElement,
    mode: RGRenderDescriptorBuildMode = 'signature'
): RGRenderDescriptorNode {
    const fragmentChildren = normalizeChildNodes(nodeEl.childNodes, mode);
    return {
        kind: 'element',
        tag: 'fragment',
        classes: [],
        attrs: {},
        children: fragmentChildren,
    };
}

function normalizeChildNodes(
    nodeList: NodeListOf<ChildNode> | NodeList | ChildNode[],
    mode: RGRenderDescriptorBuildMode
): RGRenderDescriptorNode[] {
    const childNodes = Array.from(nodeList as ArrayLike<ChildNode>);
    const normalizedChildren: RGRenderDescriptorNode[] = [];
    childNodes.forEach(childNode => {
        const descriptor = normalizeDomNode(childNode, mode);
        if (descriptor) {
            normalizedChildren.push(descriptor);
        }
    });
    return normalizedChildren;
}

function normalizeDomNode(
    domNode: ChildNode,
    mode: RGRenderDescriptorBuildMode
): RGRenderDescriptorNode | null {
    if (domNode.nodeType === Node.TEXT_NODE) {
        const normalizedText = domNode.textContent?.replace(/\s+/g, ' ').trim();
        if (!normalizedText) {
            return null;
        }
        return {
            kind: 'text',
            text: mode === 'signature' ? NORMALIZED_TEXT_PLACEHOLDER : normalizedText,
        };
    }
    if (domNode.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }
    const element = domNode as HTMLElement;
    const classes = Array.from(element.classList).sort();
    const attrs = normalizeElementAttributes(element, mode);
    const children = normalizeChildNodes(element.childNodes, mode);
    return {
        kind: 'element',
        tag: element.tagName.toLowerCase(),
        classes,
        attrs,
        children,
    };
}

function normalizeElementAttributes(
    element: Element,
    mode: RGRenderDescriptorBuildMode
): Record<string, string> {
    const normalizedAttrs: Record<string, string> = {};
    for (const attr of Array.from(element.attributes)) {
        if (IGNORED_ATTRS.has(attr.name)) {
            continue;
        }
        if (attr.name.startsWith('data-') || attr.name.startsWith('aria-')) {
            continue;
        }
        normalizedAttrs[attr.name] = normalizeAttributeValue(attr.name, attr.value, mode);
    }
    return normalizedAttrs;
}

function normalizeAttributeValue(
    attrName: string,
    attrValue: string,
    mode: RGRenderDescriptorBuildMode
): string {
    const trimmedValue = attrValue.trim();
    if (!trimmedValue) {
        return '';
    }
    if (mode === 'raw') {
        return trimmedValue;
    }
    if (attrName === 'type' || attrName === 'role') {
        return trimmedValue;
    }
    return NORMALIZED_ATTR_VALUE_PLACEHOLDER;
}

function renderDescriptorToHtml(descriptor: RGRenderDescriptorNode): string {
    if (descriptor.kind === 'text') {
        return descriptor.text;
    }
    if (descriptor.tag === 'fragment') {
        return descriptor.children.map(renderDescriptorToHtml).join('');
    }
    const classAttr = descriptor.classes.length > 0 ? ` class="${descriptor.classes.join(' ')}"` : '';
    const attrs = Object.keys(descriptor.attrs)
        .sort()
        .map(attrName => {
            const attrValue = descriptor.attrs[attrName];
            if (attrValue === '') {
                return ` ${attrName}`;
            }
            return ` ${attrName}="${escapeHtmlAttr(attrValue)}"`;
        })
        .join('');
    const childrenHtml = descriptor.children.map(renderDescriptorToHtml).join('');
    return `<${descriptor.tag}${classAttr}${attrs}>${childrenHtml}</${descriptor.tag}>`;
}

function escapeHtmlAttr(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getOrCreateNodeStyleClass(
    classMap: Map<string, RGNodeStyleClass>,
    signature: string,
    style: Record<string, string>
) {
    const existed = classMap.get(signature);
    if (existed) {
        return existed;
    }
    const newClass: RGNodeStyleClass = {
        id: `node-style-${classMap.size + 1}`,
        signature,
        style,
        nodeIds: [],
    };
    classMap.set(signature, newClass);
    return newClass;
}

function getOrCreateNodeRenderClass(
    classMap: Map<string, RGNodeRenderClassState>,
    signature: string
) {
    const existed = classMap.get(signature);
    if (existed) {
        return existed;
    }
    const newClass: RGNodeRenderClassState = {
        id: `node-render-${classMap.size + 1}`,
        signature,
        nodeIds: [],
        samples: [],
    };
    classMap.set(signature, newClass);
    return newClass;
}

function resolveNodeRenderClasses(
    classStates: RGNodeRenderClassState[],
    includeNormalizedHtml: boolean,
    warnings: string[]
): RGNodeRenderClass[] {
    return classStates.map(classState => {
        const renderDescriptor = inferNodeRenderDescriptor(classState.samples);
        const renderStyleRules = inferNodeRenderStyleRules(classState.samples);
        const renderKeyframes = resolveNodeRenderKeyframes(classState.samples, renderStyleRules, warnings);
        return {
            id: classState.id,
            signature: classState.signature,
            renderDescriptor,
            renderStyleRules,
            renderKeyframes,
            normalizedHtml: includeNormalizedHtml ? renderDescriptorToHtml(renderDescriptor) : undefined,
            nodeIds: classState.nodeIds,
        };
    });
}

function inferNodeRenderStyleRules(samples: RGNodeRenderSample[]): RGRenderStyleRule[] {
    if (samples.length === 0) {
        return [];
    }
    const sampleStyleMaps = samples.map(sample => collectRenderStyleRuleMap(sample.rootElement));
    const firstMap = sampleStyleMaps[0];
    const commonRules: RGRenderStyleRule[] = [];
    for (const entryKey of Array.from(firstMap.keys()).sort(compareRenderStyleEntryKey)) {
        let commonStyle = cloneStyleRecord(firstMap.get(entryKey));
        if (!commonStyle || Object.keys(commonStyle).length === 0) {
            continue;
        }
        for (let index = 1; index < sampleStyleMaps.length; index += 1) {
            commonStyle = intersectStyleRecords(commonStyle, sampleStyleMaps[index].get(entryKey));
            if (!commonStyle || Object.keys(commonStyle).length === 0) {
                break;
            }
        }
        if (!commonStyle || Object.keys(commonStyle).length === 0) {
            continue;
        }
        const {path, pseudo} = parseRenderStyleEntryKey(entryKey);
        commonRules.push({
            path,
            pseudo,
            style: sortStyleRecord(commonStyle),
        });
    }
    return commonRules;
}

function collectRenderStyleRuleMap(rootElement: HTMLElement): Map<string, Record<string, string>> {
    return withTemporarilyRemovedClasses(rootElement.parentElement || rootElement, TRANSIENT_NODE_CLASSES, () => {
        const entries = collectRenderElementPathEntries(rootElement);
        const styleRuleMap = new Map<string, Record<string, string>>();
        entries.forEach(entry => {
            RENDER_STYLE_PSEUDOS.forEach(pseudo => {
                const style = extractRenderElementStyle(entry.element, pseudo);
                if (Object.keys(style).length === 0) {
                    return;
                }
                styleRuleMap.set(createRenderStyleEntryKey(entry.path, pseudo), style);
            });
        });
        return styleRuleMap;
    });
}

function collectRenderElementPathEntries(rootElement: HTMLElement): Array<{path: string; element: Element}> {
    return collectRenderElementPathEntriesFromNodeList(rootElement.childNodes, '');
}

function collectRenderElementPathEntriesFromNodeList(
    nodeList: NodeListOf<ChildNode> | NodeList | ChildNode[],
    parentPath: string
): Array<{path: string; element: Element}> {
    const childNodes = Array.from(nodeList as ArrayLike<ChildNode>);
    const entries: Array<{path: string; element: Element}> = [];
    let normalizedIndex = 0;
    childNodes.forEach(childNode => {
        if (childNode.nodeType === Node.TEXT_NODE) {
            const normalizedText = childNode.textContent?.replace(/\s+/g, ' ').trim();
            if (!normalizedText) {
                return;
            }
            normalizedIndex += 1;
            return;
        }
        if (childNode.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        const element = childNode as Element;
        const path = parentPath ? `${parentPath}/${normalizedIndex}` : `${normalizedIndex}`;
        entries.push({path, element});
        entries.push(...collectRenderElementPathEntriesFromNodeList(element.childNodes, path));
        normalizedIndex += 1;
    });
    return entries;
}

function extractRenderElementStyle(
    element: Element,
    pseudo: RGRenderStylePseudo
): Record<string, string> {
    const computedStyle = getComputedStyleSafe(element, PSEUDO_TO_SELECTOR[pseudo]);
    const baselineStyle = getBaselineComputedStyle(element, pseudo);
    const inheritedSourceStyle = pseudo === 'self'
        ? getComputedStyleSafe(element.parentElement)
        : getComputedStyleSafe(element);
    const propertyNames = getComputedStylePropertyNames(computedStyle, element);
    const style: Record<string, string> = {};
    propertyNames.forEach(propertyName => {
        if (shouldSkipRenderStyleProperty(propertyName)) {
            return;
        }
        const propertyValue = normalizeCssValue(computedStyle.getPropertyValue(propertyName));
        if (!propertyValue) {
            return;
        }
        const baselineValue = normalizeCssValue(baselineStyle.getPropertyValue(propertyName));
        if (propertyValue === baselineValue) {
            return;
        }
        if (INHERITED_CSS_PROPERTIES.has(propertyName)) {
            const inheritedValue = normalizeCssValue(inheritedSourceStyle.getPropertyValue(propertyName));
            if (propertyValue === inheritedValue) {
                return;
            }
        }
        style[propertyName] = propertyValue;
    });
    return sortStyleRecord(style);
}

function getComputedStylePropertyNames(
    style: CSSStyleDeclaration,
    element: Element
): string[] {
    const propertyNames = new Set<string>();
    for (let index = 0; index < style.length; index += 1) {
        const propertyName = style.item(index);
        if (propertyName) {
            propertyNames.add(propertyName);
        }
    }
    if (element instanceof HTMLElement || element instanceof SVGElement) {
        for (let index = 0; index < element.style.length; index += 1) {
            const propertyName = element.style.item(index);
            if (propertyName) {
                propertyNames.add(propertyName);
            }
        }
    }
    return Array.from(propertyNames).sort();
}

function shouldSkipRenderStyleProperty(propertyName: string): boolean {
    if (!propertyName) {
        return true;
    }
    if (propertyName.startsWith('--rg-')) {
        return true;
    }
    return false;
}

function getBaselineComputedStyle(
    element: Element,
    pseudo: RGRenderStylePseudo
): CSSStyleDeclaration {
    const ownerDocument = element.ownerDocument;
    const cacheKey = `${element.namespaceURI === SVG_NAMESPACE ? 'svg' : 'html'}|${element.tagName.toLowerCase()}|${pseudo}`;
    let context = BASELINE_STYLE_CONTEXTS.get(ownerDocument);
    if (!context) {
        const container = ownerDocument.createElement('div');
        container.setAttribute('data-rg-render-style-baseline', 'true');
        container.style.setProperty('all', 'initial');
        container.style.setProperty('position', 'fixed');
        container.style.setProperty('left', '-99999px');
        container.style.setProperty('top', '-99999px');
        container.style.setProperty('visibility', 'hidden');
        container.style.setProperty('pointer-events', 'none');
        container.style.setProperty('contain', 'layout style paint');
        (ownerDocument.body || ownerDocument.documentElement).appendChild(container);
        context = {
            container,
            cache: new Map<string, Record<string, string>>(),
        };
        BASELINE_STYLE_CONTEXTS.set(ownerDocument, context);
    }
    const cachedStyle = context.cache.get(cacheKey);
    if (cachedStyle) {
        return createStyleDeclarationFromRecord(cachedStyle);
    }
    const baselineElement = element.namespaceURI === SVG_NAMESPACE
        ? ownerDocument.createElementNS(SVG_NAMESPACE, element.tagName.toLowerCase())
        : ownerDocument.createElement(element.tagName.toLowerCase());
    context.container.appendChild(baselineElement);
    const computedStyle = getComputedStyleSafe(baselineElement, PSEUDO_TO_SELECTOR[pseudo]);
    const styleRecord = styleDeclarationToRecord(computedStyle);
    baselineElement.remove();
    context.cache.set(cacheKey, styleRecord);
    return createStyleDeclarationFromRecord(styleRecord);
}

function styleDeclarationToRecord(style: CSSStyleDeclaration): Record<string, string> {
    const styleRecord: Record<string, string> = {};
    for (let index = 0; index < style.length; index += 1) {
        const propertyName = style.item(index);
        if (!propertyName) {
            continue;
        }
        const propertyValue = normalizeCssValue(style.getPropertyValue(propertyName));
        if (propertyValue) {
            styleRecord[propertyName] = propertyValue;
        }
    }
    return styleRecord;
}

function createStyleDeclarationFromRecord(styleRecord: Record<string, string>): CSSStyleDeclaration {
    return new Proxy(styleRecord, {
        get(target, property: string) {
            if (property === 'getPropertyValue') {
                return (propertyName: string) => target[propertyName] || '';
            }
            if (property === 'item') {
                return (index: number) => Object.keys(target).sort()[index] || '';
            }
            if (property === 'length') {
                return Object.keys(target).length;
            }
            return target[property] || '';
        }
    }) as unknown as CSSStyleDeclaration;
}

function cloneStyleRecord(style: Record<string, string> | undefined): Record<string, string> | undefined {
    if (!style) {
        return undefined;
    }
    return {...style};
}

function intersectStyleRecords(
    baseStyle: Record<string, string> | undefined,
    currentStyle: Record<string, string> | undefined
): Record<string, string> | undefined {
    if (!baseStyle || !currentStyle) {
        return undefined;
    }
    const intersectedStyle: Record<string, string> = {};
    Object.keys(baseStyle).forEach(propertyName => {
        if (currentStyle[propertyName] === baseStyle[propertyName]) {
            intersectedStyle[propertyName] = baseStyle[propertyName];
        }
    });
    return intersectedStyle;
}

function sortStyleRecord(style: Record<string, string>): Record<string, string> {
    return Object.keys(style).sort().reduce<Record<string, string>>((result, propertyName) => {
        result[propertyName] = style[propertyName];
        return result;
    }, {});
}

function createRenderStyleEntryKey(path: string, pseudo: RGRenderStylePseudo): string {
    return `${path}::${pseudo}`;
}

function parseRenderStyleEntryKey(entryKey: string): {path: string; pseudo: RGRenderStylePseudo} {
    const separatorIndex = entryKey.lastIndexOf('::');
    if (separatorIndex < 0) {
        return {
            path: entryKey,
            pseudo: 'self',
        };
    }
    return {
        path: entryKey.slice(0, separatorIndex),
        pseudo: entryKey.slice(separatorIndex + 2) as RGRenderStylePseudo,
    };
}

function compareRenderStyleEntryKey(a: string, b: string): number {
    const parsedA = parseRenderStyleEntryKey(a);
    const parsedB = parseRenderStyleEntryKey(b);
    const pathDiff = compareRenderPaths(parsedA.path, parsedB.path);
    if (pathDiff !== 0) {
        return pathDiff;
    }
    return PSEUDO_ORDER[parsedA.pseudo] - PSEUDO_ORDER[parsedB.pseudo];
}

function compareRenderPaths(a: string, b: string): number {
    const segmentsA = a.split('/').map(value => Number(value));
    const segmentsB = b.split('/').map(value => Number(value));
    const maxLength = Math.max(segmentsA.length, segmentsB.length);
    for (let index = 0; index < maxLength; index += 1) {
        const valueA = segmentsA[index];
        const valueB = segmentsB[index];
        if (Number.isNaN(valueA) || Number.isNaN(valueB)) {
            return a.localeCompare(b);
        }
        if (valueA !== valueB) {
            return valueA - valueB;
        }
    }
    return segmentsA.length - segmentsB.length;
}

function resolveNodeRenderKeyframes(
    samples: RGNodeRenderSample[],
    renderStyleRules: RGRenderStyleRule[],
    warnings: string[]
): RGRenderKeyframes[] {
    if (samples.length === 0 || renderStyleRules.length === 0) {
        return [];
    }
    const animationNames = collectAnimationNamesFromStyleRules(renderStyleRules);
    if (animationNames.length === 0) {
        return [];
    }
    const ownerDocument = samples[0].rootElement.ownerDocument;
    const keyframeDefinitions = collectDocumentKeyframes(ownerDocument, warnings);
    const keyframes: RGRenderKeyframes[] = [];
    animationNames.forEach(animationName => {
        const cssText = keyframeDefinitions.get(animationName);
        if (!cssText) {
            appendUniqueWarning(warnings, 'render-keyframes-missing-definition');
            return;
        }
        keyframes.push({
            name: animationName,
            cssText,
        });
    });
    return keyframes;
}

function collectAnimationNamesFromStyleRules(renderStyleRules: RGRenderStyleRule[]): string[] {
    const animationNames = new Set<string>();
    renderStyleRules.forEach(rule => {
        const value = rule.style['animation-name'];
        if (!value) {
            return;
        }
        value.split(',').forEach(animationName => {
            const normalizedAnimationName = animationName.trim();
            if (!normalizedAnimationName || normalizedAnimationName === 'none') {
                return;
            }
            animationNames.add(normalizedAnimationName);
        });
    });
    return Array.from(animationNames).sort();
}

function collectDocumentKeyframes(
    ownerDocument: Document,
    warnings: string[]
): Map<string, string> {
    const keyframeDefinitions = new Map<string, string>();
    const visitedSheets = new Set<CSSStyleSheet>();
    Array.from(ownerDocument.styleSheets).forEach(styleSheet => {
        collectKeyframesFromStyleSheet(styleSheet as CSSStyleSheet, keyframeDefinitions, warnings, visitedSheets);
    });
    return keyframeDefinitions;
}

function collectKeyframesFromStyleSheet(
    styleSheet: CSSStyleSheet | null | undefined,
    keyframeDefinitions: Map<string, string>,
    warnings: string[],
    visitedSheets: Set<CSSStyleSheet>
) {
    if (!styleSheet || visitedSheets.has(styleSheet)) {
        return;
    }
    visitedSheets.add(styleSheet);
    let cssRules: CSSRuleList;
    try {
        cssRules = styleSheet.cssRules;
    } catch {
        appendUniqueWarning(warnings, 'stylesheet-rules-inaccessible');
        return;
    }
    Array.from(cssRules).forEach(rule => {
        if (rule instanceof CSSImportRule) {
            collectKeyframesFromStyleSheet(rule.styleSheet, keyframeDefinitions, warnings, visitedSheets);
            return;
        }
        if (rule instanceof CSSKeyframesRule) {
            keyframeDefinitions.set(rule.name, rule.cssText);
            return;
        }
        if (isCssRuleContainer(rule)) {
            collectKeyframesFromCssRules(rule.cssRules, keyframeDefinitions);
        }
    });
}

function collectKeyframesFromCssRules(
    cssRules: CSSRuleList,
    keyframeDefinitions: Map<string, string>
) {
    Array.from(cssRules).forEach(rule => {
        if (rule instanceof CSSKeyframesRule) {
            keyframeDefinitions.set(rule.name, rule.cssText);
            return;
        }
        if (isCssRuleContainer(rule)) {
            collectKeyframesFromCssRules(rule.cssRules, keyframeDefinitions);
        }
    });
}

function isCssRuleContainer(rule: CSSRule): rule is CSSRule & {cssRules: CSSRuleList} {
    return 'cssRules' in rule;
}

function appendUniqueWarning(warnings: string[], warning: string) {
    if (!warnings.includes(warning)) {
        warnings.push(warning);
    }
}

function inferNodeRenderDescriptor(samples: RGNodeRenderSample[]): RGRenderDescriptorNode {
    if (samples.length === 0) {
        return {
            kind: 'element',
            tag: 'fragment',
            classes: [],
            attrs: {},
            children: [],
        };
    }
    return inferRenderDescriptorNode(samples.map(sample => ({
        nodeJson: sample.nodeJson,
        renderDescriptor: sample.renderDescriptor,
    })));
}

function inferRenderDescriptorNode(samples: Array<{
    nodeJson: JsonNode;
    renderDescriptor: RGRenderDescriptorNode;
}>): RGRenderDescriptorNode {
    const firstDescriptor = samples[0]?.renderDescriptor;
    if (!firstDescriptor) {
        return {
            kind: 'text',
            text: NORMALIZED_TEXT_PLACEHOLDER,
        };
    }
    if (firstDescriptor.kind === 'text') {
        return {
            kind: 'text',
            text: resolveDescriptorValue(
                samples.map(sample => sample.renderDescriptor.kind === 'text' ? sample.renderDescriptor.text : ''),
                samples.map(sample => sample.nodeJson),
                'text'
            ),
        };
    }
    const attrNames = Array.from(new Set(
        samples.flatMap(sample => sample.renderDescriptor.kind === 'element' ? Object.keys(sample.renderDescriptor.attrs) : [])
    )).sort();
    const attrs: Record<string, string> = {};
    attrNames.forEach(attrName => {
        attrs[attrName] = resolveDescriptorValue(
            samples.map(sample => sample.renderDescriptor.kind === 'element' ? (sample.renderDescriptor.attrs[attrName] ?? '') : ''),
            samples.map(sample => sample.nodeJson),
            'attr'
        );
    });
    const children = firstDescriptor.children.map((_, childIndex) => {
        return inferRenderDescriptorNode(samples.map(sample => {
            const elementDescriptor = sample.renderDescriptor as Extract<RGRenderDescriptorNode, {kind: 'element'}>;
            return {
                nodeJson: sample.nodeJson,
                renderDescriptor: elementDescriptor.children[childIndex],
            };
        }));
    });
    return {
        kind: 'element',
        tag: firstDescriptor.tag,
        classes: firstDescriptor.classes,
        attrs,
        children,
    };
}

function resolveDescriptorValue(
    values: string[],
    nodeJsons: JsonNode[],
    context: RGRenderDescriptorValueContext
): string {
    if (values.length === 0) {
        return context === 'text' ? NORMALIZED_TEXT_PLACEHOLDER : NORMALIZED_ATTR_VALUE_PLACEHOLDER;
    }
    const firstValue = values[0];
    const allSame = values.every(value => value === firstValue);
    if (allSame) {
        return firstValue;
    }
    const bindingExpression = inferBindingExpression(values, nodeJsons, context);
    if (bindingExpression) {
        return `{{${bindingExpression}}}`;
    }
    return context === 'text' ? NORMALIZED_TEXT_PLACEHOLDER : NORMALIZED_ATTR_VALUE_PLACEHOLDER;
}

function inferBindingExpression(
    values: string[],
    nodeJsons: JsonNode[],
    context: RGRenderDescriptorValueContext
): string | undefined {
    if (values.length !== nodeJsons.length || values.length === 0) {
        return undefined;
    }
    const firstNodeCandidates = collectNodeBindingCandidates(nodeJsons[0], context);
    const matchedExpressions = firstNodeCandidates
        .filter(candidate => {
            return values.every((value, index) => {
                const candidates = collectNodeBindingCandidates(nodeJsons[index], context);
                const matchedCandidate = candidates.find(thisCandidate => thisCandidate.expression === candidate.expression);
                return !!matchedCandidate && matchedCandidate.value === value;
            });
        })
        .map(candidate => candidate.expression);
    if (matchedExpressions.length === 0) {
        return undefined;
    }
    return matchedExpressions.sort(compareBindingExpression)[0];
}

function collectNodeBindingCandidates(
    nodeJson: JsonNode,
    context: RGRenderDescriptorValueContext
): Array<{expression: string; value: string}> {
    const candidates: Array<{expression: string; value: string}> = [];
    appendNodeBindingCandidates(nodeJson, 'node', context, candidates);
    return candidates;
}

function appendNodeBindingCandidates(
    value: unknown,
    expression: string,
    context: RGRenderDescriptorValueContext,
    candidates: Array<{expression: string; value: string}>
) {
    if (value === undefined || value === null) {
        return;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        candidates.push({
            expression,
            value: normalizeBindingCandidateValue(value, context),
        });
        return;
    }
    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            appendNodeBindingCandidates(item, `${expression}[${index}]`, context, candidates);
        });
        return;
    }
    if (typeof value === 'object') {
        Object.keys(value as Record<string, unknown>).sort().forEach(key => {
            appendNodeBindingCandidates((value as Record<string, unknown>)[key], `${expression}.${key}`, context, candidates);
        });
    }
}

function normalizeBindingCandidateValue(
    value: string | number | boolean,
    context: RGRenderDescriptorValueContext
): string {
    const stringValue = String(value);
    return context === 'text' ? stringValue.replace(/\s+/g, ' ').trim() : stringValue.trim();
}

function compareBindingExpression(a: string, b: string): number {
    const scoreDiff = getBindingExpressionScore(b) - getBindingExpressionScore(a);
    if (scoreDiff !== 0) {
        return scoreDiff;
    }
    return a.localeCompare(b);
}

function getBindingExpressionScore(expression: string): number {
    if (expression === 'node.text') {
        return 400;
    }
    if (expression === 'node.id') {
        return 390;
    }
    if (expression === 'node.type') {
        return 380;
    }
    if (expression.startsWith('node.data.')) {
        return 300 - expression.split('.').length;
    }
    if (expression.startsWith('node.')) {
        return 200 - expression.split('.').length;
    }
    return 0;
}

function getOrCreateLineStyleClass(
    classMap: Map<string, RGLineStyleClass>,
    signature: string,
    pathStyle: RGLinePathStyle,
    textStyle: RGLineTextStyle
) {
    const existed = classMap.get(signature);
    if (existed) {
        return existed;
    }
    const newClass: RGLineStyleClass = {
        id: `line-style-${classMap.size + 1}`,
        signature,
        pathStyle,
        textStyle,
        lineIds: [],
    };
    classMap.set(signature, newClass);
    return newClass;
}

function getComputedStyleSafe(element: Element | null, pseudoElement?: string | null): CSSStyleDeclaration {
    if (!element || !element.ownerDocument?.defaultView) {
        return createEmptyCssStyleDeclaration();
    }
    return element.ownerDocument.defaultView.getComputedStyle(element, pseudoElement || null);
}

function createEmptyCssStyleDeclaration(): CSSStyleDeclaration {
    const styleMap: Record<string, string> = {};
    return new Proxy(styleMap, {
        get(target, property: string) {
            if (property === 'getPropertyValue') {
                return (propertyName: string) => target[propertyName] || '';
            }
            if (property === 'item') {
                return () => '';
            }
            if (property === 'length') {
                return 0;
            }
            return target[property] || '';
        }
    }) as unknown as CSSStyleDeclaration;
}

function getDirectChildByClass(parent: HTMLElement, className: string): HTMLElement | null {
    for (const child of Array.from(parent.children)) {
        if (child instanceof HTMLElement && child.classList.contains(className)) {
            return child;
        }
    }
    return null;
}

function normalizeCssValue(value: string | null | undefined): string {
    if (!value) {
        return '';
    }
    return value
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ',')
        .trim();
}

function normalizeNumber(value: number): number {
    return Number.parseFloat(value.toFixed(2));
}

function getCanvasZoomScale(graphOptions: RGOptions): number {
    const scale = (graphOptions.canvasZoom || graphOptions.canvasZoom === 0) ? graphOptions.canvasZoom / 100 : 1;
    return scale > 0 ? scale : 1;
}

function pxValue(value: number): string {
    return `${normalizeNumber(value)}px`;
}

function stableStringify(value: unknown): string {
    return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortValue);
    }
    if (value && typeof value === 'object') {
        const sortedObject: Record<string, unknown> = {};
        Object.keys(value as Record<string, unknown>)
            .sort()
            .forEach(key => {
                sortedObject[key] = sortValue((value as Record<string, unknown>)[key]);
            });
        return sortedObject;
    }
    return value;
}
