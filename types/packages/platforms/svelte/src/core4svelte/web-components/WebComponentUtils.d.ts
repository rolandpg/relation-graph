export type WebComponentConnectEventDetail = {
    webComponentName: string;
    componentProps?: Record<string, any>;
    callback?: (instance: any) => void;
};
export type WebComponentDisconnectEventDetail = {
    webComponentName: string;
};
export declare const onWebComponentReady: (hostElement: HTMLElement | null, globalCss: string | string[], eventDetail: WebComponentConnectEventDetail) => void;
export declare const onWebComponentUnMounted: (hostElement: HTMLElement, eventDetail: WebComponentDisconnectEventDetail) => void;
export declare const appendWebComponentGlobalStyle: (hostElement: HTMLElement, globalCss: string | string[]) => void;
export declare const appendWebComponentGlobalStyles: (hostElement: HTMLElement, globalCss: string | string[]) => void;
