export type WebComponentConnectEventDetail = {
    webComponentName: string,
    componentProps?: Record<string, any>,
    callback?: (instance: any) => void
}
export type WebComponentDisconnectEventDetail = {
    webComponentName: string
}

const supportsAdoptedSheets = typeof ShadowRoot !== 'undefined' && 'adoptedStyleSheets' in ShadowRoot.prototype;
const styleSheetCache = new Map<string, CSSStyleSheet>();

const normalizeStyleList = (globalCss: string | string[] | null | undefined) => {
    if (!globalCss) return [] as string[];
    const styleList = Array.isArray(globalCss) ? globalCss : [globalCss];
    return styleList.filter((item) => typeof item === 'string' && item.trim().length > 0);
};

const getSharedStyleSheet = (globalCss: string) => {
    if (!supportsAdoptedSheets) return null;
    const cachedSheet = styleSheetCache.get(globalCss);
    if (cachedSheet) {
        return cachedSheet;
    }
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(globalCss);
    styleSheetCache.set(globalCss, styleSheet);
    return styleSheet;
};

const createStyleHash = (content: string) => {
    let hash = 5381;
    for (let index = 0; index < content.length; index += 1) {
        hash = ((hash << 5) + hash) ^ content.charCodeAt(index);
    }
    return `rg-web-component-style-${Math.abs(hash >>> 0).toString(36)}`;
};

export const onWebComponentReady = (
    hostElement: HTMLElement | null,
    globalCss: string | string[],
    eventDetail: WebComponentConnectEventDetail
) => {
    if (!hostElement) return;
    appendWebComponentGlobalStyles(hostElement, globalCss);
    setTimeout(() => {
        hostElement.dispatchEvent(new CustomEvent('connect-to-graph-instance', {
            detail: eventDetail,
            bubbles: true,
            composed: true
        }));
    }, 500);
};
export const onWebComponentUnMounted = (hostElement: HTMLElement, eventDetail: WebComponentDisconnectEventDetail) => {
    hostElement.dispatchEvent(new CustomEvent('disconnect-to-graph-instance', {
        detail: eventDetail,
        bubbles: true,
        composed: true
    }));
};
export const appendWebComponentGlobalStyle = (hostElement: HTMLElement, globalCss: string | string[]) => {
    appendWebComponentGlobalStyles(hostElement, globalCss);
};
export const appendWebComponentGlobalStyles = (hostElement: HTMLElement, globalCss: string | string[]) => {
    const styleList = normalizeStyleList(globalCss);
    if (!styleList.length) return;
    const rootNode = hostElement.getRootNode();
    if (!(rootNode instanceof ShadowRoot)) {
        return;
    }
    if (supportsAdoptedSheets) {
        const nextSheets = rootNode.adoptedStyleSheets ?? [];
        const appendSheets = styleList
            .map((styleText) => getSharedStyleSheet(styleText))
            .filter((styleSheet): styleSheet is CSSStyleSheet => !!styleSheet && !nextSheets.includes(styleSheet));
        if (appendSheets.length > 0) {
            rootNode.adoptedStyleSheets = [...nextSheets, ...appendSheets];
        }
        return;
    }
    styleList.forEach((styleText) => {
        const styleId = createStyleHash(styleText);
        if (rootNode.querySelector(`style[data-rg-web-component-style="${styleId}"]`)) {
            return;
        }
        const styleTag = document.createElement('style');
        styleTag.dataset.rgWebComponentStyle = styleId;
        styleTag.textContent = styleText;
        rootNode.appendChild(styleTag);
    });
};
