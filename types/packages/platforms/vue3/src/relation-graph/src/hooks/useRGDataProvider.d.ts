import { RGOptions } from '../../../../../../types';
import { RelationGraphCore } from '../../../../../../relation-graph-models/models/RelationGraphCore';
export declare function generateNewRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker?: boolean): import('vue').Raw<RelationGraphCore>;
export declare function getOrGenerateRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker?: boolean): RelationGraphCore;
export declare function defineRGDataProviderComponent(graphInstance: RelationGraphCore): import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    options: {
        required: false;
        type: () => RGOptions;
    };
}>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}>[] | null, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    options: {
        required: false;
        type: () => RGOptions;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
