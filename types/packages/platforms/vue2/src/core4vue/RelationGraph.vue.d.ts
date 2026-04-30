declare const _default: import('vue').DefineComponent<{
    options: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
    initialData: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
}, {}, {
    initialised: boolean;
    inRGProvider: boolean;
}, {}, {
    applyInstance(graphInstance: any): void;
    onRGProviderReady(graphInstance: any): void;
    getInstance(): any;
    setJsonData(): Promise<never>;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    options: {
        mustUseProp: boolean;
        default: () => {};
        type: ObjectConstructor;
    };
    initialData: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
}>>, {
    options: Record<string, any>;
    initialData: Record<string, any>;
    relationGraphCore: Function;
}>;
export default _default;
declare module 'vue' {
    interface GlobalComponents {
    }
    interface GlobalDirectives {
    }
}
