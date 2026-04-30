import { default as React } from 'react';
import { RelationGraphCore } from '../../../../../../relation-graph-models/models/RelationGraphCore';
import { RelationGraphWithProps } from '../../../types-react';
type UseRelationGraphParams = {
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
};
export declare function useRelationGraph(params?: UseRelationGraphParams): {
    RelationGraph: React.FC<React.PropsWithChildren<Omit<RelationGraphWithProps, "relationGraphCore">>>;
    graphInstance: RelationGraphCore;
};
export {};
