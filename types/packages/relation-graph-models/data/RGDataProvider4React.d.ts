import { ReactiveDataStores } from '../../types';
import { RGDataProvider } from './RGDataProvider';
/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export declare class RGDataProvider4React extends RGDataProvider {
    constructor(dataStores: ReactiveDataStores, updateViewHook: () => void);
}
