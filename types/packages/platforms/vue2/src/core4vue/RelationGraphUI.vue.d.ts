import { RGOptionsFull } from '../../../../types';
declare const _default: import('vue').DefineComponent<{
    initialData: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
}, {}, {}, {
    graphOptions(): RGOptionsFull;
    graphClass(): string[];
    graphStyle(): {
        width: string;
        height: string;
        '--rg-checked-item-bg-color'?: undefined;
        '--rg-background-color'?: undefined;
        '--rg-node-color'?: undefined;
        '--rg-node-border-color'?: undefined;
        '--rg-node-border-width'?: undefined;
        '--rg-node-border-radius'?: undefined;
        '--rg-line-color'?: undefined;
        '--rg-line-width'?: undefined;
    } | {
        width: string;
        height: string;
        '--rg-checked-item-bg-color': string | undefined;
        '--rg-background-color': string;
        '--rg-node-color': string;
        '--rg-node-border-color': string;
        '--rg-node-border-width': string;
        '--rg-node-border-radius': string;
        '--rg-line-color': string;
        '--rg-line-width': string;
    };
}, {
    setJsonData(): Promise<never>;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    initialData: {
        mustUseProp: boolean;
        default: () => null;
        type: ObjectConstructor;
    };
}>>, {
    initialData: Record<string, any>;
}>;
export default _default;
