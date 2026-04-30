declare const _default: import('vue').DefineComponent<{
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
    forLinker: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
}, {}, {
    graphData: {
        rootNode: null;
        nodes: never[];
        normalLines: never[];
        fakeLines: never[];
    };
    runtimeData: {
        runtimeDATA4Links: never[];
        runtimeDATA4ElLineTargets: never[];
        runtimeDATA4ConnectTargets: never[];
        runtimeDATA4NodeMap: Map<any, any>;
        runtimeDATA4LinkMap: Map<any, any>;
        runtimeDATA4ShouldRenderItems: {
            nodes: never[];
            lines: never[];
            fakeLines: never[];
        };
    };
    graphStore: {
        options: import('packages/types').RGOptionsFull;
        graphInstance: null;
    };
}, {}, {}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    relationGraphCore: {
        mustUseProp: boolean;
        default: null;
        type: FunctionConstructor;
    };
    forLinker: {
        mustUseProp: boolean;
        default: boolean;
        type: BooleanConstructor;
    };
}>>, {
    relationGraphCore: Function;
    forLinker: boolean;
}>;
export default _default;
