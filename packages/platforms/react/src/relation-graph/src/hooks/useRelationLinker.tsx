import React, {PropsWithChildren, useMemo,} from 'react';
import {getOrGenerateRGInstance, RGDataProvider} from './RGDataProvider';
import {
    RGLine,
    RGOptions
} from "../../../../../../types";
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import RelationLinkerUI from "../core4react/RelationLinkerUI";
import {RelationLinkerProps} from "../../../types-react";

type UseRelationLinkerParams = {
    lines?: RGLine[];
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
};
export function useRelationLinker(params: UseRelationLinkerParams) {
    const graphInstance = getOrGenerateRGInstance(params.relationGraphCore);
    const RelationLinker = useMemo(() => {
        const MemoizedRelationLinker: React.FC<PropsWithChildren<Omit<RelationLinkerProps, 'relationGraphCore'>>> = (props) => {
            return (
                <RGDataProvider graphInstance={graphInstance}>
                    <RelationLinkerUI {...props}>
                        {props.children}
                    </RelationLinkerUI>
                </RGDataProvider>
            );
        };
        MemoizedRelationLinker.displayName = 'RelationLinker';
        return MemoizedRelationLinker;
    }, []);
    return {
        RelationLinker,
        graphInstance,
    };
}
export function useReactLinker(params: UseRelationLinkerParams) {
    const {RelationLinker, graphInstance} = useRelationLinker(params);
    return {
        ReactLinker: RelationLinker,
        graphInstance,
    };
}
