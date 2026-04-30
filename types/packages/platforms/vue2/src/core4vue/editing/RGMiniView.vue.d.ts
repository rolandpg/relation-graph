import { RGUserEvent } from '../../../../../types';
declare const _default: import('vue').DefineComponent<{
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    width: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    height: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
}, {}, {}, {
    graphInstance(): any;
    options(): any;
    miniViewVisibleHandle(): any;
}, {
    onMouseDown(e: RGUserEvent): void;
    onClickCanvas(e: RGUserEvent): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    position: {
        mustUseProp: boolean;
        default: string;
        type: StringConstructor;
    };
    width: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
    height: {
        mustUseProp: boolean;
        type: StringConstructor;
    };
}>>, {
    position: string;
}>;
export default _default;
