import { default as React, PropsWithChildren } from 'react';
import { RelationGraphCore } from '../../../../../../relation-graph-models/models/RelationGraphCore';
import { ReactiveDataStores, RelationGraphInstance } from '../../../../../../types';
import { RGDataStore } from '../../../types-react';
export declare const useRelationGraphInstance: () => RelationGraphCore;
export declare function generateNewRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker?: boolean): RelationGraphCore;
export declare function getOrGenerateRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker?: boolean): RelationGraphCore;
export declare const RGReactiveDataProvider: React.FC<PropsWithChildren<{
    graphInstance: RelationGraphInstance;
}>>;
export declare const RGDataProvider: React.FC<PropsWithChildren<{
    graphInstance: RelationGraphInstance;
}>>;
export declare const useReactiveData: () => {
    data: RGDataStore;
    dataStores: ReactiveDataStores;
};
