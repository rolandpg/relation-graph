import { default as React } from 'react';
import { RGLine } from '../../../../../../types';
import { RelationGraphCore } from '../../../../../../relation-graph-models/models/RelationGraphCore';
import { RelationLinkerProps } from '../../../types-react';
type UseRelationLinkerParams = {
    lines?: RGLine[];
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
};
export declare function useRelationLinker(params: UseRelationLinkerParams): {
    RelationLinker: React.FC<React.PropsWithChildren<Omit<RelationLinkerProps, "relationGraphCore">>>;
    graphInstance: RelationGraphCore;
};
export declare function useReactLinker(params: UseRelationLinkerParams): {
    ReactLinker: React.FC<React.PropsWithChildren<Omit<RelationLinkerProps, "relationGraphCore">>>;
    graphInstance: RelationGraphCore;
};
export {};
