import { ReactiveDataStores, ReactiveDataUpdaters } from '../../types';
import { RGDataProvider } from './RGDataProvider';
/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export declare class RGDataProvider4Svelte extends RGDataProvider {
    dataStores: ReactiveDataStores;
    constructor(dataStores: ReactiveDataStores, updaters: ReactiveDataUpdaters);
}
