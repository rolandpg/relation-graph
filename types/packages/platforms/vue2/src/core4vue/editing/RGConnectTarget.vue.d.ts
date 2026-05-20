import { RGConnectTargetDomMode, RGInnerConnectTargetType, RGJunctionPoint } from '../../../../../types';
declare const _default: import('vue').DefineComponent<{
    junctionPoint: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    targetId: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetType: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetData: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    lineTemplate: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    disableDrop: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    forSvg: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    disableDrag: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    domMode: {
        mustUseProp: boolean;
        type: () => RGConnectTargetDomMode;
    };
    measureSelector: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    strictMeasureTarget: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
}, {}, {}, {
    RGInnerConnectTargetType(): typeof RGInnerConnectTargetType;
    RGJunctionPoint(): typeof RGJunctionPoint;
    graphInstance(): any;
    options(): any;
    actualJunctionPoint(): string;
    normalizedDomMode(): RGConnectTargetDomMode;
    resolvedHostStyle(): string | (string | {
        display: string;
    })[];
}, {
    registerCurrentTarget(): void;
    onClick($event: any): void;
    onMouseDown($event: any): void;
    onMouseUp(type: any, $event: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, ("onLineVertexBeDropped" | "onDragConnectStart" | "onDragConnectEnd")[], string, Readonly<import('vue').ExtractPropTypes<{
    junctionPoint: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    targetId: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetType: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    targetData: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    lineTemplate: {
        mustUseProp: boolean;
        type: ObjectConstructor;
    };
    disableDrop: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    forSvg: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    disableDrag: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
    domMode: {
        mustUseProp: boolean;
        type: () => RGConnectTargetDomMode;
    };
    measureSelector: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    strictMeasureTarget: {
        mustUseProp: boolean;
        type: BooleanConstructor;
    };
}>>, {
    disableDrag: boolean;
    junctionPoint: string;
    strictMeasureTarget: boolean;
    forSvg: boolean;
    disableDrop: boolean;
}>;
export default _default;
