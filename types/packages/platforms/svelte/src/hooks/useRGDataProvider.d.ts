import { RelationGraphCore } from '../../../../relation-graph-models/models/RelationGraphCore';
import { RGOptions } from '../../../../types';
/**
 * 获取或生成 RelationGraphCore 实例
 * 对应 Vue 的 generateRGInstance
 */
export declare function generateRGInstance(relationGraphCoreClass?: new (...args: any[]) => RelationGraphCore, forLinker?: boolean): RelationGraphCore;
/**
 * 获取或生成 RelationGraphCore 实例
 * 对应 Vue 的 generateRGInstance
 */
export declare function getOrGenerateRGInstance(relationGraphCoreClass?: new (...args: any[]) => RelationGraphCore, forLinker?: boolean): RelationGraphCore;
/**
 * 初始化响应式数据并绑定到 graphInstance
 * 对应 Vue 的 defineRGDataProviderComponent 中的 setup 逻辑
 */
export declare function initRGDataProvider(graphInstance: RelationGraphCore, options?: RGOptions): {
    graphInstance: RelationGraphCore;
};
