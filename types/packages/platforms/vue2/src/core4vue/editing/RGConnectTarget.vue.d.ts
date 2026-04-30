import { RGInnerConnectTargetType, RGJunctionPoint } from '../../../../../types';
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
}, {}, {}, {
    RGInnerConnectTargetType(): typeof RGInnerConnectTargetType;
    RGJunctionPoint(): typeof RGJunctionPoint;
    graphInstance(): any;
    options(): any;
}, {
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
}>>, {
    disableDrag: boolean;
    junctionPoint: string;
    disableDrop: boolean;
    forSvg: boolean;
}>;
export default _default;
