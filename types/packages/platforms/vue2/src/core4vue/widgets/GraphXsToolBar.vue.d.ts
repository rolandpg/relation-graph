declare const _default: import('vue').DefineComponent<{
    direction: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionH: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionV: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
}, {
    refresh(): void;
    toggleAutoLayout(): void;
    downloadAsImage(): void;
    zoomToFit(): Promise<void>;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    direction: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionH: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    positionV: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
}>>, {
    direction: string;
    positionH: string;
    positionV: string;
}>;
export default _default;
