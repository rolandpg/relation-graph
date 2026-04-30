import { ShortEmitsToObject } from 'vue';
import { RGLine, RGOptions } from '../../../../../../types';
import { RelationGraphCore } from '../../../../../../relation-graph-models/models/RelationGraphCore';
import { RGEventEmits } from '../../../types-vue3';
export declare function useRelationLinker({ relationGraphCore, options, emitProxy }?: {
    options?: RGOptions;
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
    emitProxy?: ShortEmitsToObject<RGEventEmits>;
}): {
    RGProvider: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        options: {
            required: false;
            type: () => Partial<import('../../../../../../types').RGOptionsInited>;
        };
    }>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>[] | null, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        options: {
            required: false;
            type: () => Partial<import('../../../../../../types').RGOptionsInited>;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
    RelationLinker: import('vue').DefineComponent<{
        lines: RGLine[];
    }, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
        lines: RGLine[];
    }> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
    VueLinker: import('vue').DefineComponent<{
        lines: RGLine[];
    }, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
        lines: RGLine[];
    }> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
    graphInstance: RelationGraphCore;
};
export declare const useVueLinker: typeof useRelationLinker;
